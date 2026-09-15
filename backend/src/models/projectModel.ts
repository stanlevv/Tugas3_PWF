import pool from '../config/db.js';

export interface Project {
    id: number;
    name: string;
    code: string;
    join_code?: string;
    created_by: number;
    created_at?: string;
    creator_username?: string;
    member_count?: number;
}

export interface ProjectMember {
    id: number;
    project_id: number;
    user_id: number;
    role?: 'owner' | 'member';
    username: string;
    email: string;
    joined_at: string;
}

// Inisialisasi tabel projects & project_members otomatis jika belum ada
export const initProjectTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                code VARCHAR(20) NOT NULL UNIQUE,
                join_code VARCHAR(16) NOT NULL UNIQUE,
                owner_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS project_members (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                user_id INT NOT NULL,
                role ENUM('owner', 'member') DEFAULT 'member',
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_member (project_id, user_id),
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `);

        // Pastikan kolom project_id ada di tabel todos
        const [columns]: any = await pool.query(`SHOW COLUMNS FROM todos LIKE 'project_id'`);
        if (columns.length === 0) {
            await pool.query(`
                ALTER TABLE todos 
                ADD COLUMN project_id INT NULL DEFAULT NULL AFTER user_id,
                ADD CONSTRAINT fk_todos_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
            `);
        }
    } catch (err) {
        console.error('Error initializing project tables:', err);
    }
};

// Jalankan inisialisasi tabel saat file dimuat
initProjectTables();

export const ProjectModel = {
    // 1. Buat Ruang Project baru & daftarkan pembuatnya sebagai owner di project_members
    create: async (name: string, code: string, createdBy: number): Promise<number> => {
        const [result]: any = await pool.query(
            'INSERT INTO projects (name, code, join_code, owner_id) VALUES (?, ?, ?, ?)',
            [name, code, code, createdBy]
        );
        const projectId = result.insertId;

        // Otomatis masukkan pembuat sebagai anggota pertama dengan role owner
        await pool.query(
            'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
            [projectId, createdBy, 'owner']
        );

        return projectId;
    },

    // 2. Cari project berdasarkan kode unik (misal: KEL-8942)
    getByCode: async (code: string): Promise<Project | null> => {
        const [rows]: any = await pool.query(
            `SELECT p.id, p.name, p.code, p.join_code, p.owner_id AS created_by, p.created_at, u.username AS creator_username
             FROM projects p
             JOIN users u ON p.owner_id = u.id
             WHERE p.code = ? OR p.join_code = ?`,
            [code, code]
        );
        return rows[0] || null;
    },

    // 3. Ambil project berdasarkan ID
    getById: async (id: number): Promise<Project | null> => {
        const [rows]: any = await pool.query(
            `SELECT p.id, p.name, p.code, p.join_code, p.owner_id AS created_by, p.created_at, u.username AS creator_username
             FROM projects p
             JOIN users u ON p.owner_id = u.id
             WHERE p.id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    // 4. Ambil semua project yang diikuti oleh user tertentu
    getByUserId: async (userId: number): Promise<Project[]> => {
        const [rows]: any = await pool.query(
            `SELECT p.id, p.name, p.code, p.join_code, p.owner_id AS created_by, p.created_at, u.username AS creator_username,
                    (SELECT COUNT(*) FROM project_members pm2 WHERE pm2.project_id = p.id) AS member_count
             FROM projects p
             JOIN project_members pm ON p.id = pm.project_id
             JOIN users u ON p.owner_id = u.id
             WHERE pm.user_id = ?
             ORDER BY p.id DESC`,
            [userId]
        );
        return rows;
    },

    // 5. Ambil daftar anggota dalam 1 project
    getMembers: async (projectId: number): Promise<ProjectMember[]> => {
        const [rows]: any = await pool.query(
            `SELECT pm.id, pm.project_id, pm.user_id, pm.role, u.username, u.email, pm.joined_at
             FROM project_members pm
             JOIN users u ON pm.user_id = u.id
             WHERE pm.project_id = ?
             ORDER BY pm.id ASC`,
            [projectId]
        );
        return rows;
    },

    // 6. Cek apakah user adalah anggota project
    isMember: async (projectId: number, userId: number): Promise<boolean> => {
        const [rows]: any = await pool.query(
            'SELECT id FROM project_members WHERE project_id = ? AND user_id = ?',
            [projectId, userId]
        );
        return rows.length > 0;
    },

    // 7. Tambahkan anggota ke project (Join)
    addMember: async (projectId: number, userId: number): Promise<boolean> => {
        try {
            await pool.query(
                'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
                [projectId, userId, 'member']
            );
            return true;
        } catch (err: any) {
            if (err.code === 'ER_DUP_ENTRY') return false;
            throw err;
        }
    },

    // 8. Keluar dari project (Leave)
    leave: async (projectId: number, userId: number): Promise<boolean> => {
        const [result]: any = await pool.query(
            'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
            [projectId, userId]
        );
        return result.affectedRows > 0;
    },

    // 9. Hapus project (Hanya pembuat yang berhak)
    delete: async (projectId: number): Promise<boolean> => {
        const [result]: any = await pool.query(
            'DELETE FROM projects WHERE id = ?',
            [projectId]
        );
        return result.affectedRows > 0;
    }
};

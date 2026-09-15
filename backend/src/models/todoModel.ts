import pool from '../config/db.js';

export const TodoModel = {
    // 1. Ambil semua tugas pribadi milik user_id tertentu (project_id IS NULL)
    getByUserId: async (userId: number) => {
        const [rows] = await pool.query(
            `SELECT t.id, t.user_id, t.project_id, t.task, t.is_completed, u.username AS creator_username
             FROM todos t
             JOIN users u ON t.user_id = u.id
             WHERE t.user_id = ? AND t.project_id IS NULL
             ORDER BY t.id DESC`,
            [userId]
        );
        return rows;
    },

    // 2. Ambil semua tugas dalam 1 Project Kelompok
    getByProjectId: async (projectId: number) => {
        const [rows] = await pool.query(
            `SELECT t.id, t.user_id, t.project_id, t.task, t.is_completed, u.username AS creator_username
             FROM todos t
             JOIN users u ON t.user_id = u.id
             WHERE t.project_id = ?
             ORDER BY t.id DESC`,
            [projectId]
        );
        return rows;
    },

    // 3. Ambil satu tugas berdasarkan ID
    getById: async (id: number) => {
        const [rows]: any = await pool.query(
            `SELECT t.id, t.user_id, t.project_id, t.task, t.is_completed, u.username AS creator_username, p.name AS project_name
             FROM todos t
             JOIN users u ON t.user_id = u.id
             LEFT JOIN projects p ON t.project_id = p.id
             WHERE t.id = ? LIMIT 1`,
            [id]
        );
        return rows[0] || null;
    },

    // 4. Tambahkan tugas baru (Pribadi atau Kelompok)
    create: async (userId: number, task: string, projectId: number | null = null) => {
        const [result]: any = await pool.query(
            'INSERT INTO todos (user_id, project_id, task, is_completed) VALUES (?, ?, ?, 0)',
            [userId, projectId, task]
        );
        return result.insertId;
    },

    // 5. Update status atau isi tugas
    update: async (id: number, is_completed?: boolean | number, task?: string) => {
        if (typeof is_completed !== 'undefined' && task !== undefined) {
            const [result]: any = await pool.query(
                'UPDATE todos SET is_completed = ?, task = ? WHERE id = ?',
                [is_completed ? 1 : 0, task, id]
            );
            return result.affectedRows;
        } else if (typeof is_completed !== 'undefined') {
            const [result]: any = await pool.query(
                'UPDATE todos SET is_completed = ? WHERE id = ?',
                [is_completed ? 1 : 0, id]
            );
            return result.affectedRows;
        } else if (task !== undefined) {
            const [result]: any = await pool.query(
                'UPDATE todos SET task = ? WHERE id = ?',
                [task, id]
            );
            return result.affectedRows;
        }
        return 0;
    },

    // 6. Hapus tugas berdasarkan id
    delete: async (id: number) => {
        const [result]: any = await pool.query(
            'DELETE FROM todos WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

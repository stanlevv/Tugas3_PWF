import pool from '../config/db.js';

export const UserModel = {
    // 1. Cari data user berdasarkan username atau email (untuk Login)
    findByUsernameOrEmail: async (identifier: string) => {
        const [rows]: any = await pool.query(
            'SELECT id, username, email, password FROM users WHERE username = ? OR email = ? LIMIT 1',
            [identifier, identifier]
        );
        return rows[0];
    },

    // 2. Simpan user baru ke database (untuk Register)
    create: async (username: string, email: string, hashedPassword: string) => {
        const [result]: any = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return result.insertId;
    },

    // 3. Cari user berdasarkan ID
    findById: async (id: number) => {
        const [rows]: any = await pool.query(
            'SELECT id, username, email, password FROM users WHERE id = ? LIMIT 1',
            [id]
        );
        return rows[0] || null;
    },

    // 4. Update Password
    updatePassword: async (id: number, hashedPassword: string) => {
        const [result]: any = await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
        return result.affectedRows > 0;
    }
};


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
    }
};

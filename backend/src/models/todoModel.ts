import pool from '../config/db.js';

export const TodoModel = {
    // 1. Ambil semua tugas milik user_id tertentu
    getByUserId: async (userId: number) => {
        const [rows] = await pool.query(
            'SELECT id, user_id, task, is_completed FROM todos WHERE user_id = ? ORDER BY id DESC',
            [userId]
        );
        return rows;
    },

    // 2. Ambil tugas berdasarkan id dan user_id
    getById: async (id: number, userId: number) => {
        const [rows]: any = await pool.query(
            'SELECT id, user_id, task, is_completed FROM todos WHERE id = ? AND user_id = ? LIMIT 1',
            [id, userId]
        );
        return rows[0];
    },

    // 3. Tambahkan tugas baru ke dalam database
    create: async (userId: number, task: string) => {
        const [result]: any = await pool.query(
            'INSERT INTO todos (user_id, task, is_completed) VALUES (?, ?, 0)',
            [userId, task]
        );
        return result.insertId;
    },

    // 4. Update status atau isi tugas
    update: async (id: number, userId: number, is_completed?: boolean | number, task?: string) => {
        if (typeof is_completed !== 'undefined' && task) {
            await pool.query(
                'UPDATE todos SET is_completed = ?, task = ? WHERE id = ? AND user_id = ?',
                [is_completed ? 1 : 0, task, id, userId]
            );
        } else if (typeof is_completed !== 'undefined') {
            await pool.query(
                'UPDATE todos SET is_completed = ? WHERE id = ? AND user_id = ?',
                [is_completed ? 1 : 0, id, userId]
            );
        } else if (task) {
            await pool.query(
                'UPDATE todos SET task = ? WHERE id = ? AND user_id = ?',
                [task, id, userId]
            );
        }
    },

    // 5. Hapus tugas berdasarkan id dan user_id
    delete: async (id: number, userId: number) => {
        const [result]: any = await pool.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }
};

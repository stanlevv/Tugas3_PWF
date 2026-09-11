import { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel.js';

// 1. Ambil Semua Todo Milik User yang Sedang Login
export const getTodos = async (req: Request, res: Response): Promise<void> => {
    const userId = res.locals.userId;
    try {
        const todos = await TodoModel.getByUserId(userId);
        res.status(200).json({ success: true, data: todos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data tugas.' });
    }
};

// 2. Ambil Detail Todo Berdasarkan ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
    const userId = res.locals.userId;
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID tugas tidak valid.' });
        return;
    }
    try {
        const todo = await TodoModel.getById(id, userId);
        if (!todo) {
            res.status(404).json({ success: false, message: 'Tugas tidak ditemukan.' });
            return;
        }
        res.status(200).json({ success: true, data: todo });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil detail tugas.' });
    }
};

// 3. Tambahkan Todo Baru
export const createTodo = async (req: Request, res: Response): Promise<void> => {
    const { task } = req.body;
    const userId = res.locals.userId;

    if (!task || typeof task !== 'string' || task.trim() === '') {
        res.status(400).json({ success: false, message: 'Tugas (task) wajib diisi!' });
        return;
    }

    try {
        const newId = await TodoModel.create(userId, task.trim());
        res.status(201).json({
            success: true,
            message: 'Tugas berhasil ditambahkan!',
            data: { id: newId, task: task.trim(), is_completed: false }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menambahkan tugas.' });
    }
};

// 4. Update Todo (Toggle Completed / Edit Task)
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    const userId = res.locals.userId;
    const id = parseInt(req.params.id as string, 10);
    const { is_completed, task } = req.body;

    if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID tugas tidak valid.' });
        return;
    }

    try {
        await TodoModel.update(id, userId, is_completed, task);
        res.status(200).json({ success: true, message: 'Tugas berhasil diperbarui!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui tugas.' });
    }
};

// 5. Hapus Todo Berdasarkan ID
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const userId = res.locals.userId;
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'ID tugas tidak valid.' });
        return;
    }

    try {
        const deleted = await TodoModel.delete(id, userId);
        if (!deleted) {
            res.status(404).json({ success: false, message: 'Tugas tidak ditemukan atau bukan milik Anda.' });
            return;
        }
        res.status(200).json({ success: true, message: 'Tugas berhasil dihapus!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus tugas.' });
    }
};

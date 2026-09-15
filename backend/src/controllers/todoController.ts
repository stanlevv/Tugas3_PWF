import { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel.js';
import { ProjectModel } from '../models/projectModel.js';

// 1. Ambil Semua Todo (Mendukung Tugas Pribadi vs Ruang Project)
export const getTodos = async (req: Request, res: Response): Promise<void> => {
    const userId = res.locals.userId;
    const projectIdQuery = req.query.project_id;

    try {
        if (projectIdQuery && projectIdQuery !== 'undefined' && projectIdQuery !== 'null') {
            const projectId = parseInt(projectIdQuery as string, 10);
            if (isNaN(projectId)) {
                res.status(400).json({ success: false, message: 'ID project tidak valid.' });
                return;
            }

            // Verifikasi apakah user adalah anggota project
            const isMember = await ProjectModel.isMember(projectId, userId);
            if (!isMember) {
                res.status(403).json({ success: false, message: 'Anda bukan anggota project ini!' });
                return;
            }

            const todos = await TodoModel.getByProjectId(projectId);
            res.status(200).json({ success: true, data: todos });
            return;
        }

        // Default: Tugas Pribadi (project_id IS NULL)
        const todos = await TodoModel.getByUserId(userId);
        res.status(200).json({ success: true, data: todos });
    } catch (error) {
        console.error('Error getTodos:', error);
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
        const todo: any = await TodoModel.getById(id);
        if (!todo) {
            res.status(404).json({ success: false, message: 'Tugas tidak ditemukan.' });
            return;
        }

        // Cek izin akses: jika todo milik project, cek keanggotaan; jika pribadi, cek user_id
        if (todo.project_id) {
            const isMember = await ProjectModel.isMember(todo.project_id, userId);
            if (!isMember) {
                res.status(403).json({ success: false, message: 'Akses ditolak ke tugas kelompok ini.' });
                return;
            }
        } else if (todo.user_id !== userId) {
            res.status(403).json({ success: false, message: 'Akses ditolak ke tugas pribadi ini.' });
            return;
        }

        res.status(200).json({ success: true, data: todo });
    } catch (error) {
        console.error('Error getTodoById:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil detail tugas.' });
    }
};

// 3. Tambahkan Todo Baru (Pribadi atau Kelompok)
export const createTodo = async (req: Request, res: Response): Promise<void> => {
    const { task, project_id } = req.body;
    const userId = res.locals.userId;

    if (!task || typeof task !== 'string' || task.trim() === '') {
        res.status(400).json({ success: false, message: 'Tugas (task) wajib diisi!' });
        return;
    }

    let parsedProjectId: number | null = null;
    if (project_id) {
        parsedProjectId = parseInt(project_id, 10);
        if (isNaN(parsedProjectId)) {
            res.status(400).json({ success: false, message: 'ID project tidak valid.' });
            return;
        }

        const isMember = await ProjectModel.isMember(parsedProjectId, userId);
        if (!isMember) {
            res.status(403).json({ success: false, message: 'Anda bukan anggota dari project ini!' });
            return;
        }
    }

    try {
        const newId = await TodoModel.create(userId, task.trim(), parsedProjectId);
        const createdTodo = await TodoModel.getById(newId);

        res.status(201).json({
            success: true,
            message: 'Tugas berhasil ditambahkan!',
            data: createdTodo
        });
    } catch (error) {
        console.error('Error createTodo:', error);
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
        const todo: any = await TodoModel.getById(id);
        if (!todo) {
            res.status(404).json({ success: false, message: 'Tugas tidak ditemukan.' });
            return;
        }

        // Cek izin update
        if (todo.project_id) {
            const isMember = await ProjectModel.isMember(todo.project_id, userId);
            if (!isMember) {
                res.status(403).json({ success: false, message: 'Akses ditolak.' });
                return;
            }
        } else if (todo.user_id !== userId) {
            res.status(403).json({ success: false, message: 'Akses ditolak.' });
            return;
        }

        await TodoModel.update(id, is_completed, task);
        const updated = await TodoModel.getById(id);
        res.status(200).json({ success: true, message: 'Tugas berhasil diperbarui!', data: updated });
    } catch (error) {
        console.error('Error updateTodo:', error);
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
        const todo: any = await TodoModel.getById(id);
        if (!todo) {
            res.status(404).json({ success: false, message: 'Tugas tidak ditemukan.' });
            return;
        }

        // Cek izin hapus: di project bisa dihapus oleh pembuat tugas atau pembuat project
        if (todo.project_id) {
            const project = await ProjectModel.getById(todo.project_id);
            const isCreator = todo.user_id === userId || (project && project.created_by === userId);
            if (!isCreator) {
                res.status(403).json({ success: false, message: 'Hanya pembuat tugas atau pemilik project yang dapat menghapus tugas ini.' });
                return;
            }
        } else if (todo.user_id !== userId) {
            res.status(403).json({ success: false, message: 'Akses ditolak.' });
            return;
        }

        await TodoModel.delete(id);
        res.status(200).json({ success: true, message: 'Tugas berhasil dihapus!' });
    } catch (error) {
        console.error('Error deleteTodo:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus tugas.' });
    }
};

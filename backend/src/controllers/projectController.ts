import { Request, Response } from 'express';
import { ProjectModel } from '../models/projectModel.js';

// Helper membuat kode unik acak (contoh: KEL-8942)
function generateProjectCode(): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `KEL-${randomDigits}`;
}

export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.userId || (req as any).user?.id;
        const { name } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            res.status(400).json({ success: false, message: 'Nama ruang project wajib diisi!' });
            return;
        }

        let code = generateProjectCode();
        let attempts = 0;
        while (attempts < 5) {
            const existing = await ProjectModel.getByCode(code);
            if (!existing) break;
            code = generateProjectCode();
            attempts++;
        }

        const projectId = await ProjectModel.create(name.trim(), code, userId);
        const newProject = await ProjectModel.getById(projectId);

        res.status(201).json({
            success: true,
            message: 'Ruang project kelompok berhasil dibuat!',
            data: newProject
        });
    } catch (error: any) {
        console.error('Error createProject:', error);
        res.status(500).json({ success: false, message: 'Gagal membuat ruang project.' });
    }
};

export const getUserProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.userId || (req as any).user?.id;
        const projects = await ProjectModel.getByUserId(userId);

        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (error: any) {
        console.error('Error getUserProjects:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil daftar project.' });
    }
};

export const getProjectDetail = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.userId || (req as any).user?.id;
        const projectId = parseInt(req.params.id as string, 10);

        if (isNaN(projectId)) {
            res.status(400).json({ success: false, message: 'ID project tidak valid!' });
            return;
        }

        const isMember = await ProjectModel.isMember(projectId, userId);
        if (!isMember) {
            res.status(403).json({ success: false, message: 'Anda bukan anggota dari ruang project ini!' });
            return;
        }

        const project = await ProjectModel.getById(projectId);
        const members = await ProjectModel.getMembers(projectId);

        res.status(200).json({
            success: true,
            data: {
                ...project,
                members
            }
        });
    } catch (error: any) {
        console.error('Error getProjectDetail:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil detail project.' });
    }
};

export const joinProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.userId || (req as any).user?.id;
        const { code } = req.body;

        if (!code || typeof code !== 'string') {
            res.status(400).json({ success: false, message: 'Kode undangan project wajib diisi!' });
            return;
        }

        const project = await ProjectModel.getByCode(code.trim());
        if (!project) {
            res.status(404).json({ success: false, message: 'Kode project tidak ditemukan!' });
            return;
        }

        const success = await ProjectModel.addMember(project.id, userId);
        if (!success) {
            res.status(400).json({ success: false, message: 'Anda sudah menjadi anggota di ruang project ini!' });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Berhasil bergabung ke kelompok "${project.name}"!`,
            data: project
        });
    } catch (error: any) {
        console.error('Error joinProject:', error);
        res.status(500).json({ success: false, message: 'Gagal bergabung ke project.' });
    }
};

export const leaveProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.userId || (req as any).user?.id;
        const projectId = parseInt(req.params.id as string, 10);

        const project = await ProjectModel.getById(projectId);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project tidak ditemukan.' });
            return;
        }

        if (project.created_by === userId) {
            res.status(400).json({ success: false, message: 'Pembuat ruang tidak dapat meninggalkan project. Gunakan hapus project.' });
            return;
        }

        await ProjectModel.leave(projectId, userId);
        res.status(200).json({ success: true, message: 'Berhasil keluar dari project.' });
    } catch (error: any) {
        console.error('Error leaveProject:', error);
        res.status(500).json({ success: false, message: 'Gagal keluar dari project.' });
    }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = res.locals.userId || (req as any).user?.id;
        const projectId = parseInt(req.params.id as string, 10);

        const project = await ProjectModel.getById(projectId);
        if (!project) {
            res.status(404).json({ success: false, message: 'Project tidak ditemukan.' });
            return;
        }

        if (project.created_by !== userId) {
            res.status(403).json({ success: false, message: 'Hanya pembuat ruang yang dapat menghapus project ini.' });
            return;
        }

        await ProjectModel.delete(projectId);
        res.status(200).json({ success: true, message: 'Ruang project berhasil dihapus.' });
    } catch (error: any) {
        console.error('Error deleteProject:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus project.' });
    }
};

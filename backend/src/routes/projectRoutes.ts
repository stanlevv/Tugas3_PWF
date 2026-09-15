import { Router } from 'express';
import { createProject, getUserProjects, getProjectDetail, joinProject, leaveProject, deleteProject } from '../controllers/projectController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Rute Ruang Kelompok / Team Workspaces
router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getUserProjects);
router.get('/:id', verifyToken, getProjectDetail);
router.post('/join', verifyToken, joinProject);
router.post('/:id/leave', verifyToken, leaveProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;

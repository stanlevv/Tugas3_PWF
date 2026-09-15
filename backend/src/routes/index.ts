import { Router } from 'express';
import authRoutes from './authRoutes.js';
import todoRoutes from './todoRoutes.js';
import projectRoutes from './projectRoutes.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/todos', verifyToken, todoRoutes);
router.use('/projects', verifyToken, projectRoutes);

export default router;

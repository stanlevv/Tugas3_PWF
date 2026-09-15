import { Router } from 'express';
import authRoutes from './authRoutes.js';
import todoRoutes from './todoRoutes.js';
import projectRoutes from './projectRoutes.js';

const router = Router();

// Agregasi seluruh modul rute
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/projects', projectRoutes);

export default router;

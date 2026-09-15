import { Router } from 'express';
import { register, login, changePassword } from '../controllers/authController.js';
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';
import { createProject, getUserProjects, getProjectDetail, joinProject, leaveProject, deleteProject } from '../controllers/projectController.js';
import { validateRegister, validateLogin, validateTodo } from '../middlewares/validator.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// 1. RUTE AUTHENTICATION
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', validateLogin, login);
router.put('/auth/change-password', verifyToken, changePassword);

// 2. RUTE TODO (Mendukung Pribadi & Ruang Kelompok)
router.get('/todos', verifyToken, getTodos);
router.get('/todos/:id', verifyToken, getTodoById);
router.post('/todos', verifyToken, validateTodo, createTodo);
router.put('/todos/:id', verifyToken, updateTodo);
router.delete('/todos/:id', verifyToken, deleteTodo);

// 3. RUTE PROJECT / RUANG KELOMPOK (Team Plan)
router.post('/projects', verifyToken, createProject);
router.get('/projects', verifyToken, getUserProjects);
router.get('/projects/:id', verifyToken, getProjectDetail);
router.post('/projects/join', verifyToken, joinProject);
router.post('/projects/:id/leave', verifyToken, leaveProject);
router.delete('/projects/:id', verifyToken, deleteProject);

export default router;

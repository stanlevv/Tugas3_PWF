import { Router } from 'express';
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';
import { validateTodo } from '../middlewares/validator.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Rute CRUD Todo (Tugas Pribadi & Ruang Kelompok)
router.get('/', verifyToken, getTodos);
router.get('/:id', verifyToken, getTodoById);
router.post('/', verifyToken, validateTodo, createTodo);
router.put('/:id', verifyToken, updateTodo);
router.delete('/:id', verifyToken, deleteTodo);

export default router;

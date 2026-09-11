import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';
import { validateRegister, validateLogin, validateTodo } from '../middlewares/validator.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// RUTE AUTHENTICATION
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', validateLogin, login);

// RUTE TODO (Dilindungi oleh verifyToken)
router.get('/todos', verifyToken, getTodos);
router.get('/todos/:id', verifyToken, getTodoById);
router.post('/todos', verifyToken, validateTodo, createTodo);
router.put('/todos/:id', verifyToken, updateTodo);
router.delete('/todos/:id', verifyToken, deleteTodo);

export default router;

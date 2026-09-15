import { Router } from 'express';
import { register, login, changePassword } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middlewares/validator.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Rute Otentikasi Pengguna
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.put('/change-password', verifyToken, changePassword);

export default router;

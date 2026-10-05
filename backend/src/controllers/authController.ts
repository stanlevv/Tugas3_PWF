import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import type { RegisterRequest, LoginRequest, JwtUserPayload } from '../types/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

// 1. Registrasi User Baru
export const register = async (req: Request, res: Response): Promise<void> => {
    const payload: RegisterRequest = req.body;
    try {
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        await UserModel.create(payload.username, payload.email, hashedPassword);
        sendSuccess(res, 'Registrasi berhasil!', undefined, 201);
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            sendError(res, 'Username atau Email sudah terdaftar!', 409);
            return;
        }
        sendError(res, 'Error server.', 500);
    }
};

// 2. Login User
export const login = async (req: Request, res: Response): Promise<void> => {
    const payload: LoginRequest = req.body;
    try {
        const user = await UserModel.findByUsernameOrEmail(payload.username);

        if (!user || !(await bcrypt.compare(payload.password, user.password))) {
            sendError(res, 'Username/Email atau password salah!', 401);
            return;
        }

        const tokenPayload: JwtUserPayload = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'jwt_secret_key_tugas4_praktikum_062',
            { expiresIn: '24h' }
        );

        sendSuccess(res, 'Login berhasil!', { token, user: tokenPayload });
    } catch {
        sendError(res, 'Error server.', 500);
    }
};

// 3. Ubah Password Pengguna
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        sendError(res, 'Password lama dan password baru wajib diisi!', 400);
        return;
    }

    if (newPassword.length < 6) {
        sendError(res, 'Password baru minimal 6 karakter!', 400);
        return;
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            sendError(res, 'Password lama tidak sesuai!', 401);
            return;
        }

        const hashedNew = await bcrypt.hash(newPassword, 10);
        await UserModel.updatePassword(userId, hashedNew);

        sendSuccess(res, 'Password berhasil diubah!');
    } catch (error) {
        console.error('Error changePassword:', error);
        sendError(res, 'Gagal mengubah password.', 500);
    }
};

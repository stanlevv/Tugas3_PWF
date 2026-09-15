import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

// 1. Fungsi Registrasi User Baru
export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ success: false, message: 'Username, email, dan password wajib diisi!' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create(username, email, hashedPassword);
        res.status(201).json({ success: true, message: 'Registrasi berhasil!' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ success: false, message: 'Username atau Email sudah terdaftar!' });
            return;
        }
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
};

// 2. Fungsi Login User
export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
        res.status(400).json({ success: false, message: 'Username/Email dan password wajib diisi!' });
        return;
    }

    try {
        const user = await UserModel.findByUsernameOrEmail(identifier);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ success: false, message: 'Username/Email atau password salah!' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login berhasil!',
            token,
            data: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
};

// 3. Fungsi Ubah Password Pengguna
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    const userId = res.locals.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        res.status(400).json({ success: false, message: 'Password lama dan password baru wajib diisi!' });
        return;
    }

    if (newPassword.length < 6) {
        res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter!' });
        return;
    }

    try {
        const user = await UserModel.findById(userId);
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            res.status(401).json({ success: false, message: 'Password lama tidak sesuai!' });
            return;
        }

        const hashedNew = await bcrypt.hash(newPassword, 10);
        await UserModel.updatePassword(userId, hashedNew);

        res.status(200).json({ success: true, message: 'Password berhasil diubah!' });
    } catch (error) {
        console.error('Error changePassword:', error);
        res.status(500).json({ success: false, message: 'Gagal mengubah password.' });
    }
};


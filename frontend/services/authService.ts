import { apiClient, ApiResponse } from './api';
import type { LoginPayload, RegisterPayload, AuthData, User } from '@/types/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
    async register(payload: RegisterPayload): Promise<ApiResponse<{ id: number; username: string; email: string }>> {
        return apiClient<ApiResponse<{ id: number; username: string; email: string }>>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async login(payload: LoginPayload): Promise<ApiResponse<AuthData>> {
        const res = await apiClient<ApiResponse<AuthData>>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (res.data?.token && typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, res.data.token);
            if (res.data.user) {
                localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
            }
        }

        return res;
    },

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    },

    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    getUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};

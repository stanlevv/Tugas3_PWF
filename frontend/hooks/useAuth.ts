'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, getAuthToken, getAuthUser, setAuthSession, clearAuthSession } from '@/lib/api';

export type User = {
  id: number;
  username: string;
  email: string;
};

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Inisialisasi status auth saat komponen mount di browser
  useEffect(() => {
    const savedToken = getAuthToken();
    const savedUser = getAuthUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Fungsi Login
  const login = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({
        username: identifier,
        password,
      });

      const userData = response.data || { id: 0, username: identifier, email: identifier };
      setAuthSession(response.token, userData);
      setToken(response.token);
      setUser(userData);

      return { success: true, message: response.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal login.' };
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Registrasi
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.register({ username, email, password });
      return { success: true, message: response.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal registrasi.' };
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Logout (Redirect langsung ke Landing Page)
  const logout = useCallback(() => {
    clearAuthSession();
    setToken(null);
    setUser(null);
    router.push('/');
  }, [router]);

  return {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    register,
    logout,
  };
}

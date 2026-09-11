'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, setAuthSession } from '@/lib/api';

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError('Username/Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({
        username: identifier.trim(),
        password,
      });

      if (res.success && res.token) {
        // Simpan sesi login & data user
        const userData = res.data || { id: 0, username: identifier.trim(), email: identifier.trim() };
        setAuthSession(res.token, userData);

        // Redirect langsung ke Dashboard Todo
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Username/Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
          Email / Username:
        </label>
        <input
          type="text"
          id="identifier"
          name="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Masukkan email atau username"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="block text-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Memverifikasi...' : 'Login'}
        </button>
      </div>
    </form>
  );
}
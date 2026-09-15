'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, setAuthSession } from '@/lib/api';

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        router.push('/todos');
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
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="identifier" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
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
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070f3]/40 focus:border-[#0070f3] bg-white text-gray-800 transition-all text-sm shadow-xs"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Password:
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
            className="w-full p-3 pr-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070f3]/40 focus:border-[#0070f3] bg-white text-gray-800 transition-all text-sm shadow-xs"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-md focus:outline-none transition-colors"
            aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showPassword ? (
              // Eye Slash Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              // Eye Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="block text-center w-full py-3 bg-[#0070f3] hover:bg-[#0060df] text-white font-medium rounded-xl transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed text-sm active:scale-[0.99]"
        >
          {loading ? 'Memverifikasi...' : 'Login'}
        </button>
      </div>
    </form>
  );
}
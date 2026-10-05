'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/api';

const SPRING_TRANSITION = { duration: 0.18, ease: 'easeOut' as const };

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    // Validasi Sisi Klien
    if (!trimmedUsername || !trimmedEmail || !password.trim()) {
      setError('Semua kolom wajib diisi.');
      triggerShake();
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Format alamat email tidak valid.');
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setError('Password minimal terdiri dari 6 karakter.');
      triggerShake();
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password di atas.');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({
        username: trimmedUsername,
        email: trimmedEmail,
        password,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 900);
      } else {
        throw new Error(res.message || 'Gagal mendaftar akun.');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal melakukan registrasi.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* 1. ANIMATED ERROR ALERT */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={SPRING_TRANSITION}
            className="p-3.5 text-xs text-red-700 bg-red-50/90 border border-red-200/90 rounded-2xl flex items-start gap-2.5 shadow-2xs"
          >
            <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
              !
            </div>
            <div className="flex-1 leading-relaxed">
              <span className="font-semibold block">Registrasi Gagal</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ANIMATED SUCCESS ALERT */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 text-xs text-emerald-800 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex items-center gap-2.5 shadow-2xs"
          >
            <svg className="w-4 h-4 text-emerald-600 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-semibold">Registrasi Berhasil! Mengalihkan ke Login...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* USERNAME */}
      <div className="space-y-1.5">
        <label htmlFor="username" className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          disabled={loading || isSuccess}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Buat username unik"
          required
          className={`w-full p-3 pl-3.5 border rounded-2xl focus:outline-none transition-all text-xs sm:text-sm shadow-2xs bg-white text-zinc-800 disabled:opacity-60 disabled:bg-zinc-50 ${
            error && !username.trim()
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-zinc-200/90 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 hover:border-zinc-300'
          }`}
        />
      </div>

      {/* EMAIL */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          disabled={loading || isSuccess}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="nama@email.com"
          required
          className={`w-full p-3 pl-3.5 border rounded-2xl focus:outline-none transition-all text-xs sm:text-sm shadow-2xs bg-white text-zinc-800 disabled:opacity-60 disabled:bg-zinc-50 ${
            error && (!email.trim() || !email.includes('@'))
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-zinc-200/90 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 hover:border-zinc-300'
          }`}
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            disabled={loading || isSuccess}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Minimal 6 karakter"
            required
            className={`w-full p-3 pr-11 border rounded-2xl focus:outline-none transition-all text-xs sm:text-sm shadow-2xs bg-white text-zinc-800 disabled:opacity-60 disabled:bg-zinc-50 ${
              error && password.length < 6
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-zinc-200/90 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 hover:border-zinc-300'
            }`}
          />
          <button
            type="button"
            disabled={loading || isSuccess}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg focus:outline-none transition-colors cursor-pointer"
            aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
          Konfirmasi Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            disabled={loading || isSuccess}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ulangi password di atas"
            required
            className={`w-full p-3 pr-11 border rounded-2xl focus:outline-none transition-all text-xs sm:text-sm shadow-2xs bg-white text-zinc-800 disabled:opacity-60 disabled:bg-zinc-50 ${
              error && confirmPassword !== password
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-zinc-200/90 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 hover:border-zinc-300'
            }`}
          />
          <button
            type="button"
            disabled={loading || isSuccess}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg focus:outline-none transition-colors cursor-pointer"
            aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showConfirmPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* SUBMIT BUTTON WITH VERIFICATION ANIMATION */}
      <div className="pt-2">
        <motion.button
          whileHover={!loading && !isSuccess ? { scale: 1.015 } : {}}
          whileTap={!loading && !isSuccess ? { scale: 0.985 } : {}}
          transition={SPRING_TRANSITION}
          type="submit"
          disabled={loading || isSuccess}
          className={`w-full py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isSuccess
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          } disabled:opacity-75 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>Memproses Pendaftaran...</span>
            </>
          ) : isSuccess ? (
            <>
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Pendaftaran Berhasil!</span>
            </>
          ) : (
            <span>Daftar Akun</span>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
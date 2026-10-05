import React from 'react';
import Link from 'next/link';
import LoginForm from './components/LoginForm';

type LoginPageProps = {
  searchParams?: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const isRegistered = params.registered === 'true';

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100 flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-200/30 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-7 sm:p-9 rounded-3xl shadow-xl border border-slate-200/90 relative z-10 space-y-6">
        {/* Tombol Kembali ke Landing Page */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Header */}
        <header className="border-b border-slate-100 pb-5 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-[11px] font-bold text-[#002D72] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#0056D2] animate-pulse" />
            <span>Todo App 062</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Masuk
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Praktikum PWF — Kelas T3D
          </p>
        </header>

        {isRegistered && (
          <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl text-center font-medium">
            ✓ Akun dibuat. Masuk dengan username dan password tadi.
          </div>
        )}

        {/* Form Komponen Login */}
        <LoginForm />

        <footer className="border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-600">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#0056D2] hover:text-[#002D72] hover:underline font-bold transition-colors">
              Daftar di sini
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
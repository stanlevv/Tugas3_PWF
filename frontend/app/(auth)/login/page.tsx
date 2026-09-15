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
    <main className="min-h-screen p-6 md:p-8 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-200/80">
        {/* Tombol Kembali ke Landing Page */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Halaman Utama
          </Link>
        </div>

        <header className="mb-6 border-b border-gray-100 pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke akun Todo Anda</p>
        </header>

        {isRegistered && (
          <div className="mb-4 p-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            ✓ Akun berhasil dibuat! Silakan login dengan kredensial Anda.
          </div>
        )}

        {/* Form Komponen Login */}
        <LoginForm />

        <div className="mt-6 border-t border-gray-100 pt-4 text-center">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#0070f3] hover:underline font-medium">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
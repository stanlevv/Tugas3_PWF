'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  return (
    <main className="relative min-h-screen bg-white text-gray-900 overflow-hidden flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24">
      {/* Background Subtle Tech/Mesh Gradient & Dot Matrix Decoration */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-50">
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100/60 via-sky-50/40 to-transparent blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-[450px] w-[450px] rounded-full bg-radial from-blue-50/60 via-transparent to-transparent blur-2xl" />
        <svg
          className="absolute inset-0 w-full h-full text-gray-300/40"
          fill="none"
          viewBox="0 0 100% 100%"
        >
          <defs>
            <pattern
              id="pattern-dots-bg"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-dots-bg)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
        {/* Left Column: Hero Text & Dynamic Actions */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-950 leading-[1.1]">
            Welcome to<br />
            My <span className="text-[#0070f3]">Project</span>
          </h1>

          <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-normal">
            Aplikasi pencatatan tugas modern yang cepat, terstruktur, dan terintegrasi langsung dengan Express.js dan database MySQL. Seluruh fitur dapat digunakan secara gratis tanpa batasan.
          </p>

          {/* Dynamic Auth State Controls */}
          {authLoading ? (
            <div className="flex items-center gap-3 pt-4">
              <div className="h-11 w-28 bg-gray-100 animate-pulse rounded-xl" />
              <div className="h-11 w-28 bg-gray-100 animate-pulse rounded-xl" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="space-y-4 pt-2">
              {/* Logged in Greeting Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-medium text-emerald-800 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Masuk sebagai: <strong className="font-semibold">{user.username}</strong></span>
              </div>

              {/* Action Buttons for Logged In User */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/todos"
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#0070f3] hover:bg-[#0060df] active:scale-95 text-white font-medium rounded-xl shadow-xs transition-all text-sm"
                >
                  Buka Workspace Tugas
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-red-50 active:scale-95 text-red-600 font-medium rounded-xl border border-red-200 shadow-xs transition-all text-sm cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            /* Guest Action Buttons */
            <div className="flex items-center gap-4 pt-4">
              <Link
                href="/todos"
                className="inline-flex items-center justify-center px-8 py-3 bg-[#0070f3] hover:bg-[#0060df] active:scale-95 text-white font-medium rounded-xl shadow-xs transition-all text-sm"
              >
                Mulai
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-50 active:scale-95 text-gray-800 font-medium rounded-xl border border-gray-200 shadow-xs transition-all text-sm"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Preview Component (Clean & Free) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block mb-5">
              PREVIEW APLIKASI
            </span>

            {/* Inner Clean Preview Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900 leading-snug">
                    Workspace Terpadu
                  </h2>
                  <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                    100% Gratis
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Kelola tugas harian individu maupun kolaborasi kelompok.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Tugas Pribadi & Ruang Kolaborasi Tim</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Integrasi Penuh Basis Data MySQL</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Pencarian Cepat & Filter Real-time</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/todos"
                  className="w-full inline-flex items-center justify-center py-2.5 bg-[#0070f3] hover:bg-[#0060df] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Buka Aplikasi Sekarang →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Left Icon/Badge */}
      <div className="fixed bottom-6 left-6 z-40">
        <div
          title="Built with Next.js & Express.js"
          className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-white/80 select-none cursor-default"
        >
          N
        </div>
      </div>
    </main>
  );
}
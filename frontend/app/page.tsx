import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Welcome to My Project',
  description: 'Landing Page Tugas Praktikum Web Framework',
};

export default function HomePage() {
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
        {/* Left Column: Hero Text & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-950 leading-[1.1]">
            Welcome to<br />
            My <span className="text-[#0070f3]">Project</span>
          </h1>

          <p className="text-gray-500 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

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
        </div>

        {/* Right Column: Preview Component */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block mb-5">
              PREVIEW KOMPONEN
            </span>

            {/* Inner Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900 leading-snug">
                  Team Plan
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  For small teams shipping fast.
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Unlimited projects, shared components, and priority support.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#0070f3] hover:bg-[#0060df] text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
                >
                  Choose plan
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#71717a] hover:bg-[#52525b] text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
                >
                  Compare
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Left Icon/Badge */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-white/80 select-none">
          N
        </div>
      </div>
    </main>
  );
}
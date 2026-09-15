'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';

type TaskDetailCardProps = {
  todo: Todo;
};

const SPRING_TRANSITION = { duration: 0.15, ease: 'easeOut' as const };

export default function TaskDetailCard({ todo }: TaskDetailCardProps) {
  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-10 bg-zinc-50/70 text-zinc-900 flex items-center justify-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xs border border-zinc-200/80 space-y-6"
      >
        <header className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
              {todo.project_name ? `Ruang Tim: ${todo.project_name}` : 'Tugas Pribadi'}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight mt-0.5">Detail Tugas</h1>
          </div>

          <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.96 }} transition={SPRING_TRANSITION}>
            <Link
              href="/todos"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200/90 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali ke Workspace</span>
            </Link>
          </motion.div>
        </header>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                ID Tugas
              </label>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono font-semibold bg-zinc-100 text-zinc-800 rounded-lg border border-zinc-200/70">
                  #{todo.id}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Status
              </label>
              <div className="mt-1">
                {todo.completed ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-lg">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Selesai</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <span>Aktif / Dalam Proses</span>
                  </span>
                )}
              </div>
            </div>

            {todo.creator_username && (
              <div>
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Dibuat Oleh
                </label>
                <div className="mt-1">
                  <span className="inline-flex items-center text-xs font-medium text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200/70">
                    @{todo.creator_username}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Judul Tugas
            </label>
            <h2 className="text-lg font-bold text-zinc-950 mt-0.5">{todo.title || todo.task}</h2>
          </div>

          {todo.description && (
            <div>
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Deskripsi
              </label>
              <p className="text-zinc-700 bg-zinc-50/80 p-3.5 rounded-2xl border border-zinc-200/70 mt-1 text-xs sm:text-sm leading-relaxed">
                {todo.description}
              </p>
            </div>
          )}

          <div>
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Tanggal Dibuat
            </label>
            <p className="text-zinc-500 text-xs mt-0.5">{todo.createdAt || 'Baru saja'}</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTodos, FilterType } from '@/hooks/useTodos';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { Button } from '@/app/components/ui/button';

export default function TodoRealApp() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const {
    todos,
    loading: todosLoading,
    error,
    filter,
    setFilter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  // 1. Tampilan jika sesi belum terautentikasi (Belum Login)
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-2">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Silakan Login Terlebih Dahulu</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Untuk mengelola dan menyimpan daftar tugas ke basis data MySQL Laragon secara real-time, Anda wajib masuk ke akun Anda.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
          >
            Masuk (Login)
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
          >
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Header & Logout */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-gray-600">
            Masuk sebagai: <strong className="text-gray-900">{user?.username || 'User'}</strong>
          </span>
        </div>
        <Button
          type="button"
          onClick={logout}
          variant="outline"
          size="xs"
          className="text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
        >
          Keluar (Logout)
        </Button>
      </div>

      {/* Error Banner jika ada */}
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Statistik Ringkasan (Modul 3: State Integration) */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total</div>
          <div className="text-xl font-bold text-blue-900 mt-0.5">{stats.total}</div>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Belum Selesai</div>
          <div className="text-xl font-bold text-amber-900 mt-0.5">{stats.pending}</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Selesai</div>
          <div className="text-xl font-bold text-emerald-900 mt-0.5">{stats.completed}</div>
        </div>
      </div>

      {/* Form Tambah Todo Baru (Real MySQL INSERT) */}
      <TodoForm onAddTodo={addTodo} />

      {/* Filter Tabs (All, Pending, Completed) */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {(['all', 'pending', 'completed'] as FilterType[]).map((f) => {
          const label = f === 'all' ? 'Semua' : f === 'pending' ? 'Belum Selesai' : 'Selesai';
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Loading Indicator */}
      {todosLoading && todos.length === 0 && (
        <div className="text-center py-6 text-sm text-gray-400">
          Memuat data dari database MySQL Laragon...
        </div>
      )}

      {/* List Tugas Interaktif (Real MySQL UPDATE & DELETE) */}
      <TodoList
        todos={todos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
    </div>
  );
}

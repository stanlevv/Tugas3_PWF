'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TodoItem from './TodoItem';
import { Todo } from '@/types/todo';
import { FilterType } from '@/hooks/useTodos';

type TodoListProps = {
  todos: Todo[];
  loading?: boolean;
  error?: string | null;
  filter?: FilterType;
  onFilterChange?: (f: FilterType) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  stats?: { total: number; completed: number; pending: number };
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onEditTodo?: (id: number, newText: string) => Promise<any>;
  onRefresh?: () => void;
};

const SPRING_TRANSITION = { duration: 0.15, ease: 'easeOut' as const };

export default function TodoList({
  todos,
  loading = false,
  error = null,
  filter: propFilter,
  onFilterChange: propOnFilterChange,
  searchQuery: propSearchQuery,
  onSearchChange: propOnSearchChange,
  stats: propStats,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onRefresh,
}: TodoListProps) {
  // Local fallback states if not provided by parent
  const [localFilter, setLocalFilter] = useState<FilterType>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const filter = propFilter !== undefined ? propFilter : localFilter;
  const onFilterChange = propOnFilterChange || setLocalFilter;
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : localSearch;
  const onSearchChange = propOnSearchChange || setLocalSearch;

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const stats = propStats || { total, completed, pending };

  return (
    <div className="space-y-4">
      {/* FILTER BAR & SEARCH INPUT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-zinc-50/70 p-2 sm:p-2.5 rounded-2xl border border-zinc-200/80">
        {/* Search Box */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 flex items-center pointer-events-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari tugas atau nama pembuat..."
            className="w-full pl-8 pr-7 py-1.5 bg-white border border-zinc-200/90 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-0.5 rounded cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Buttons & Refresh */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Tombol Semua (Blue active state) */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_TRANSITION}
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80'
            }`}
          >
            Semua ({stats.total})
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_TRANSITION}
            type="button"
            onClick={() => onFilterChange('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80'
            }`}
          >
            Aktif ({stats.pending})
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_TRANSITION}
            type="button"
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80'
            }`}
          >
            Selesai ({stats.completed})
          </motion.button>

          {onRefresh && (
            <motion.button
              whileHover={{ scale: 1.08, rotate: 180 }}
              whileTap={{ scale: 0.92 }}
              transition={SPRING_TRANSITION}
              type="button"
              onClick={onRefresh}
              title="Perbarui Data"
              className="p-1.5 bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200/80 rounded-xl transition-colors cursor-pointer text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200/80 rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && todos.length === 0 && (
        <div className="py-12 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">Sinkronisasi data MySQL...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && todos.length === 0 && (
        <div className="text-center py-12 px-4 border-2 border-dashed border-zinc-200/80 rounded-3xl bg-zinc-50/40 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-semibold text-sm text-zinc-900">
            {searchQuery ? 'Tidak ada tugas yang cocok' : 'Belum ada tugas di ruang ini'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {searchQuery
              ? `Hasil pencarian untuk "${searchQuery}" tidak ditemukan.`
              : 'Tulis tugas baru Anda pada formulir di atas untuk mulai mencatat produktivitas!'}
          </p>
        </div>
      )}

      {/* LIST ITEMS */}
      {todos.length > 0 && (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
              onDelete={onDeleteTodo}
              onEdit={onEditTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
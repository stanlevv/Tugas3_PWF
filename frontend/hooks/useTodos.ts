'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { todoApi, getAuthToken } from '@/lib/api';
import { Todo, normalizeTodo } from '@/types/todo';

const CACHE_KEY = 'todo_app_cache_data';

export type FilterType = 'all' | 'pending' | 'completed';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  // 1. Caching Layer: Ambil dari cache local storage terlebih dahulu (Instant UI / Fast Render)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: any[] = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setTodos(parsed.map(normalizeTodo));
          }
        }
      } catch (e) {
        console.warn('Gagal membaca cache lokal:', e);
      }
    }
  }, []);

  // Simpan state terbaru ke cache
  const updateCache = useCallback((updatedTodos: Todo[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedTodos));
      } catch (e) {
        console.warn('Gagal menyimpan cache:', e);
      }
    }
  }, []);

  // 2. Fetch Data Nyata dari Backend MySQL Laragon
  const fetchTodos = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await todoApi.getAll();
      if (response.success && Array.isArray(response.data)) {
        const normalized = response.data.map(normalizeTodo);
        setTodos(normalized);
        updateCache(normalized);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data tugas dari server.');
    } finally {
      setLoading(false);
    }
  }, [updateCache]);

  // Muat data saat komponen mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 3. Tambah Tugas Baru (Persisten ke MySQL Laragon)
  const addTodo = async (task: string) => {
    const trimmed = task.trim();
    if (!trimmed) return;

    setError(null);
    try {
      const res = await todoApi.create(trimmed);
      if (res.success && res.data) {
        const newTodo = normalizeTodo(res.data);
        setTodos((prev) => {
          const next = [newTodo, ...prev];
          updateCache(next);
          return next;
        });
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan tugas ke database.');
      throw err;
    }
  };

  // 4. Toggle Status Tugas (Selesai / Belum Selesai di MySQL Laragon)
  const toggleTodo = async (id: number) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const newStatus = !target.completed;

    // Optimistic UI Update
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, completed: newStatus, is_completed: newStatus ? 1 : 0 } : t));
      updateCache(next);
      return next;
    });

    try {
      await todoApi.update(id, { is_completed: newStatus });
    } catch (err: any) {
      // Rollback jika error
      setTodos((prev) => {
        const rolledBack = prev.map((t) => (t.id === id ? target : t));
        updateCache(rolledBack);
        return rolledBack;
      });
      setError('Gagal memperbarui status tugas di server.');
    }
  };

  // 5. Hapus Tugas (Hapus Permanen dari MySQL Laragon)
  const deleteTodo = async (id: number) => {
    const previousTodos = [...todos];

    // Optimistic UI Update
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id);
      updateCache(next);
      return next;
    });

    try {
      await todoApi.delete(id);
    } catch (err: any) {
      // Rollback jika error
      setTodos(previousTodos);
      updateCache(previousTodos);
      setError('Gagal menghapus tugas dari server.');
    }
  };

  // 6. Filter & Statistik Terkalkulasi (State Integration)
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'completed':
        return todos.filter((t) => t.completed);
      case 'pending':
        return todos.filter((t) => !t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [todos]);

  return {
    todos: filteredTodos,
    allTodos: todos,
    loading,
    error,
    filter,
    setFilter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    refresh: fetchTodos,
  };
}

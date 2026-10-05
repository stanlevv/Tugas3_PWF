'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { todoApi } from '@/lib/api';
import { Todo, normalizeTodo } from '@/types/todo';
import TaskNotFound from './components/TaskNotFound';
import TaskDetailCard from './components/TaskDetailCard';

export default function TodoDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    async function loadDetail() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await todoApi.getById(id);
        if (isMounted) {
          if (res.success && res.data) {
            setTodo(normalizeTodo(res.data));
          } else {
            setTodo(null);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          const msg = err?.message || '';
          if (msg.includes('tidak ditemukan') || msg.includes('404')) {
            setTodo(null);
          } else {
            setErrorMessage(msg || 'Gagal memuat tugas karena gangguan server.');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen p-6 md:p-10 bg-zinc-50/70 text-zinc-700 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-500">Memuat detail tugas #{id} dari MySQL...</p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen p-6 md:p-10 bg-zinc-50/70 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xs border border-red-200 text-center space-y-4">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
            !
          </div>
          <h2 className="text-base font-bold text-zinc-900">Terjadi Gangguan</h2>
          <p className="text-xs text-red-600">{errorMessage}</p>
          <Link
            href="/todos"
            className="inline-flex items-center justify-center px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
          >
            Kembali ke Workspace
          </Link>
        </div>
      </main>
    );
  }

  if (!todo) {
    return <TaskNotFound id={id} />;
  }

  return <TaskDetailCard todo={todo} />;
}
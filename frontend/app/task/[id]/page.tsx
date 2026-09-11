'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { todoApi } from '@/lib/api';
import { Todo, normalizeTodo } from '@/types/todo';
import TaskNotFound from './components/TaskNotFound';
import TaskDetailCard from './components/TaskDetailCard';

export default function TodoDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    async function loadDetail() {
      try {
        const res = await todoApi.getById(id);
        if (isMounted && res.success && res.data) {
          setTodo(normalizeTodo(res.data));
        } else if (isMounted) {
          setTodo(null);
        }
      } catch (e) {
        if (isMounted) setTodo(null);
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
      <main className="min-h-screen p-6 md:p-10 bg-white text-gray-700 flex items-center justify-center">
        <p className="text-gray-500">Memuat detail tugas #{id} dari database MySQL...</p>
      </main>
    );
  }

  if (!todo) {
    return <TaskNotFound id={id} />;
  }

  return <TaskDetailCard todo={todo} />;
}
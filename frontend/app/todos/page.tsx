import React from 'react';
import TodoRealApp from '../components/TodoRealApp';

export const metadata = {
  title: 'Todo App - State, Hooks, & Caching Data Integration',
  description: 'Aplikasi Todo Fullstack terintegrasi dengan Express.js dan MySQL Laragon',
};

export default function TodosPage() {
  return (
    <main className="min-h-screen p-6 md:p-10 bg-gray-50 text-gray-800">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
          <header className="mb-6 border-b border-gray-100 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
              Daftar Tugas (Todo List)
            </h1>
          </header>

          {/* Aplikasi Todo Nyata Terhubung ke Laragon MySQL */}
          <TodoRealApp />
        </div>
      </div>
    </main>
  );
}

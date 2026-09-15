import React from 'react';
import TodoRealApp from '../components/TodoRealApp';

export const metadata = {
  title: 'Workspace - State, Hooks, & Caching Data Integration',
  description: 'Aplikasi Todo Fullstack terintegrasi dengan Express.js dan MySQL Laragon',
};

export default function TodosPage() {
  return (
    <main className="min-h-screen bg-gray-50/70">
      <TodoRealApp />
    </main>
  );
}

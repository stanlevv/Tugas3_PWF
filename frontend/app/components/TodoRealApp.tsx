'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useTodos } from '@/hooks/useTodos';
import DashboardSidebar from './DashboardSidebar';
import ProjectHeader from './ProjectHeader';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import ProjectModal from './ProjectModal';
import AccountSettingsModal from './AccountSettingsModal';
import ToastNotification, { ToastState } from './ToastNotification';

const SPRING_TRANSITION = { duration: 0.15, ease: 'easeOut' as const };

export default function TodoRealApp() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const {
    projects,
    activeProject,
    members,
    selectProject,
    createProject,
    joinProject,
    leaveProject,
    deleteProject,
  } = useProjects();

  // Sidebar & Modals State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
  };

  // Todo hook with active project ID
  const {
    todos,
    loading: todosLoading,
    error: todosError,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    stats,
    addTodo,
    toggleTodo,
    updateTodoText,
    deleteTodo,
    refresh,
  } = useTodos(activeProject?.id);

  // Redirect to login if unauthenticated once auth resolves
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">Memeriksa sesi otentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex font-sans">
      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* 1. COLLAPSIBLE SIDEBAR */}
      <DashboardSidebar
        user={user}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={selectProject}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64 sm:lg:ml-72'
        }`}
      >
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Buka Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2 font-bold text-sm text-zinc-900">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="tracking-tight">{activeProject ? activeProject.name : 'Tugas Pribadi'}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsAccountModalOpen(true)}
            className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </button>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-4xl w-full mx-auto space-y-5 sm:space-y-6">
          {/* Top Title & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/70 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
                {activeProject ? activeProject.name : 'Daftar Tugas Pribadi'}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                {activeProject
                  ? `Ruang kolaborasi tim "${activeProject.name}" • Kode: ${activeProject.code}`
                  : 'Kelola catatan dan tugas harian Anda (Terhubung ke MySQL Laragon)'}
              </p>
            </div>

            {/* Top Right: Logout Button with SVG Icon */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING_TRANSITION}
                type="button"
                onClick={logout}
                title="Keluar dari sesi dan kembali ke Landing Page"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-red-50 text-zinc-700 hover:text-red-600 text-xs font-semibold rounded-xl border border-zinc-200/90 shadow-2xs transition-colors cursor-pointer group"
              >
                <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Keluar (Logout)</span>
              </motion.button>
            </div>
          </div>

          {/* Active Team Space Header */}
          {activeProject && (
            <ProjectHeader
              project={activeProject}
              members={members}
              onLeave={leaveProject}
              onDelete={deleteProject}
              onToast={showToast}
            />
          )}

          {/* Form Tambah Tugas Baru */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-zinc-200/80 shadow-2xs space-y-2.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              {activeProject ? `Tambah Tugas ke ${activeProject.name}` : 'Tambah Tugas Pribadi'}
            </span>
            <TodoForm
              onAddTodo={async (task) => {
                await addTodo(task);
                showToast('success', 'Tugas baru berhasil ditambahkan!');
              }}
            />
          </div>

          {/* Daftar Tugas & Filter Bar */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-zinc-200/80 shadow-2xs space-y-4">
            <TodoList
              todos={todos}
              loading={todosLoading}
              error={todosError}
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              stats={stats}
              onToggleTodo={(id) => {
                toggleTodo(id);
                showToast('info', 'Status tugas diperbarui.');
              }}
              onDeleteTodo={(id) => {
                deleteTodo(id);
                showToast('info', 'Tugas telah dihapus.');
              }}
              onEditTodo={async (id, newText) => {
                await updateTodoText(id, newText);
                showToast('success', 'Teks tugas berhasil diperbarui!');
              }}
              onRefresh={() => {
                refresh();
                showToast('info', 'Data tugas disinkronkan ulang.');
              }}
            />
          </div>
        </main>
      </div>

      {/* 3. MODAL BUAT / GABUNG RUANG KELOMPOK */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreate={async (name) => {
          const res = await createProject(name);
          showToast('success', `Ruang "${name}" berhasil dibuat!`);
          return res;
        }}
        onJoin={async (code) => {
          const res = await joinProject(code);
          showToast('success', `Berhasil bergabung ke ruang project!`);
          return res;
        }}
      />

      {/* 4. MODAL PENGATURAN AKUN */}
      <AccountSettingsModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={user}
        onLogout={logout}
        onToast={showToast}
      />
    </div>
  );
}

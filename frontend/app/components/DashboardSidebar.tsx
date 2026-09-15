'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User } from '@/hooks/useAuth';
import { ProjectData } from '@/types/todo';

interface DashboardSidebarProps {
  user: User | null;
  projects: ProjectData[];
  activeProject: ProjectData | null;
  onSelectProject: (project: ProjectData | null) => void;
  onOpenProjectModal: () => void;
  onOpenAccountModal: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const SPRING_TRANSITION = { duration: 0.15, ease: 'easeOut' as const };

export default function DashboardSidebar({
  user,
  projects,
  activeProject,
  onSelectProject,
  onOpenProjectModal,
  onOpenAccountModal,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onMobileClose}
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white/85 backdrop-blur-xl border-r border-zinc-200/80 flex flex-col justify-between transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64 sm:w-72'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP SECTION: Header & Navigation */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <Link
              href="/"
              title="Kembali ke Beranda"
              className="flex items-center gap-2.5 group"
            >
              {/* Minimalist Geometric Mark Logo in Blue */}
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              {!isCollapsed && (
                <div>
                  <span className="font-bold text-sm text-zinc-900 tracking-tight leading-none block">
                    Todo Workspace
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    Tugas & Kolaborasi
                  </span>
                </div>
              )}
            </Link>

            {/* Minimize Toggle on Desktop */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING_TRANSITION}
              type="button"
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
              className="hidden lg:flex p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100/80 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isCollapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'}
                />
              </svg>
            </motion.button>
          </div>

          {/* Nav Items */}
          <div className="space-y-1">
            {/* 1. Tugas Pribadi */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING_TRANSITION}
              type="button"
              onClick={() => {
                onSelectProject(null);
                onMobileClose();
              }}
              title="Tugas Pribadi"
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                isCollapsed ? 'justify-center' : ''
              } ${
                activeProject === null
                  ? 'bg-blue-50/80 text-blue-600 border border-blue-200/70 font-semibold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
              }`}
            >
              <svg
                className={`w-4 h-4 flex-shrink-0 ${
                  activeProject === null ? 'text-blue-600' : 'text-zinc-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {!isCollapsed && <span>Tugas Pribadi</span>}
            </motion.button>

            {/* 2. Buat / Gabung Ruang Kelompok Button in Sidebar */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING_TRANSITION}
              type="button"
              onClick={() => {
                onOpenProjectModal();
                onMobileClose();
              }}
              title="Buat atau Gabung Ruang Kelompok"
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer text-zinc-600 hover:text-blue-600 hover:bg-blue-50/60 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <svg className="w-4 h-4 text-zinc-500 hover:text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {!isCollapsed && <span>Buat / Gabung Ruang</span>}
            </motion.button>
          </div>

          {/* TEAM WORKSPACES SECTION */}
          <div className="space-y-2 pt-3 border-t border-zinc-100">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Ruang Kelompok
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-md">
                  {projects.length}
                </span>
              </div>
            )}

            {/* List Project Workspaces */}
            <div className="space-y-1">
              {projects.map((p) => {
                const isActive = activeProject?.id === p.id;
                return (
                  <motion.button
                    key={p.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={SPRING_TRANSITION}
                    type="button"
                    onClick={() => {
                      onSelectProject(p);
                      onMobileClose();
                    }}
                    title={p.name}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                      isCollapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100/80 hover:text-zinc-900'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200/80'
                      }`}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">{p.name}</span>
                    )}
                  </motion.button>
                );
              })}

              {/* Add / Join Team Space Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING_TRANSITION}
                type="button"
                onClick={onOpenProjectModal}
                title="Buat atau Gabung Ruang Kelompok"
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-dashed border-zinc-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/40 text-zinc-500 transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {!isCollapsed && <span>Tambah Ruang Tim</span>}
              </motion.button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Account Card & Settings */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/50">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING_TRANSITION}
            onClick={onOpenAccountModal}
            title="Klik untuk Pengaturan Akun"
            className={`flex items-center gap-2.5 p-2 rounded-2xl bg-white/70 hover:bg-white border border-zinc-200/60 hover:border-zinc-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            {/* User Avatar in Blue */}
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 group-hover:bg-blue-700 transition-colors">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900 truncate block">
                    {user?.username || 'Pengguna'}
                  </span>
                  <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[10px] text-zinc-500 truncate block">
                  {user?.email || 'email@domain.com'}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </aside>
    </>
  );
}

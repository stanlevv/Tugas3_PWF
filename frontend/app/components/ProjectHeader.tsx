'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectData, ProjectMember } from '@/types/todo';
import { useAuth } from '@/hooks/useAuth';

interface ProjectHeaderProps {
  project: ProjectData;
  members: ProjectMember[];
  onLeave: (projectId: number) => Promise<any>;
  onDelete: (projectId: number) => Promise<any>;
  onToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

const SPRING_TRANSITION = { duration: 0.15, ease: 'easeOut' as const };

export default function ProjectHeader({
  project,
  members,
  onLeave,
  onDelete,
  onToast,
}: ProjectHeaderProps) {
  const { user } = useAuth();
  const isOwner = user?.id === project.created_by;
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(project.code);
      setCopied(true);
      if (onToast) onToast('success', `Kode "${project.code}" berhasil disalin!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleAction = async () => {
    if (isOwner) {
      if (!confirm(`Hapus ruang "${project.name}"? Semua tugas kelompok akan terhapus permanen.`)) return;
      setLoading(true);
      try {
        await onDelete(project.id);
        if (onToast) onToast('info', 'Ruang project berhasil dihapus.');
      } catch (err: any) {
        if (onToast) onToast('error', err.message || 'Gagal menghapus ruang project.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!confirm(`Keluar dari ruang kelompok "${project.name}"?`)) return;
      setLoading(true);
      try {
        await onLeave(project.id);
        if (onToast) onToast('info', 'Anda telah keluar dari ruang kelompok.');
      } catch (err: any) {
        if (onToast) onToast('error', err.message || 'Gagal keluar dari ruang project.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-zinc-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Project Title & Creator */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight">{project.name}</h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Dibuat oleh <span className="font-semibold text-zinc-700">@{project.creator_username || 'Admin'}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Copy Invite Code Badge */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_TRANSITION}
            type="button"
            onClick={handleCopyCode}
            title="Klik untuk menyalin kode undangan"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-mono font-medium rounded-xl border border-zinc-200/80 shadow-2xs transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span>{project.code}</span>
            <span className="text-[10px] text-blue-600 font-sans font-semibold ml-1">
              {copied ? 'Tersalin' : 'Salin'}
            </span>
          </motion.button>

          {/* Leave / Delete Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING_TRANSITION}
            type="button"
            disabled={loading}
            onClick={handleAction}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
              isOwner
                ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200/80'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200/80'
            }`}
          >
            {isOwner ? 'Hapus Ruang' : 'Keluar Ruang'}
          </motion.button>
        </div>
      </div>

      {/* Member Avatar Stack */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
        <span className="font-medium text-[11px]">Anggota Tim ({members.length})</span>
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          {members.slice(0, 6).map((m) => (
            <div
              key={m.id}
              title={`${m.username} (${m.email})`}
              className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[9px] ring-2 ring-white shadow-2xs"
            >
              {m.username.charAt(0).toUpperCase()}
            </div>
          ))}
          {members.length > 6 && (
            <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-[9px] ring-2 ring-white">
              +{members.length - 6}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

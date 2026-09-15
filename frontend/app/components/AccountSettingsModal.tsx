'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/hooks/useAuth';
import { authApi } from '@/lib/api';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

type TabType = 'profile' | 'security';

const SPRING_TRANSITION = { duration: 0.15, ease: 'easeOut' as const };

export default function AccountSettingsModal({
  isOpen,
  onClose,
  user,
  onLogout,
  onToast,
}: AccountSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Security Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      onToast('error', 'Semua kolom password wajib diisi.');
      return;
    }

    if (newPassword.length < 6) {
      onToast('error', 'Password baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      onToast('error', 'Konfirmasi password baru tidak cocok.');
      return;
    }

    setSecurityLoading(true);
    try {
      const res = await authApi.changePassword({ oldPassword, newPassword });
      if (res.success) {
        onToast('success', 'Password berhasil diubah!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      onToast('error', err.message || 'Gagal mengubah password.');
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={SPRING_TRANSITION}
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl border border-zinc-200/90 shadow-2xl p-6 sm:p-7 z-10 space-y-5"
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3.5">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase block mb-0.5">
                  Pengaturan Akun
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
                  Akun & Keamanan
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profil Pengguna</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-white text-zinc-900 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Keamanan & Sandi</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[180px]">
              {/* TAB 1: PROFIL */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 p-3.5 bg-zinc-50/80 rounded-2xl border border-zinc-200/80">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-zinc-950">{user?.username || 'Pengguna'}</h3>
                      <p className="text-xs text-zinc-500">{user?.email || 'email@domain.com'}</p>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">User ID: #{user?.id}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={user?.username || ''}
                        disabled
                        className="w-full px-3.5 py-2 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-700 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3.5 py-2 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-700 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KEAMANAN */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                      Password Lama:
                    </label>
                    <div className="relative">
                      <input
                        type={showOld ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Masukkan password saat ini"
                        required
                        className="w-full px-3 py-2 pr-9 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white text-zinc-900 text-xs shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOld(!showOld)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                      >
                        {showOld ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                      Password Baru:
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        required
                        className="w-full px-3 py-2 pr-9 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white text-zinc-900 text-xs shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
                      >
                        {showNew ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                      Konfirmasi Password Baru:
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      required
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white text-zinc-900 text-xs shadow-2xs"
                    />
                  </div>

                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={SPRING_TRANSITION}
                      type="submit"
                      disabled={securityLoading}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-xs text-xs cursor-pointer disabled:opacity-50"
                    >
                      {securityLoading ? 'Memperbarui...' : 'Simpan Password Baru'}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Action: Logout */}
            <div className="border-t border-zinc-100 pt-3.5 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Keluar dari sesi saat ini?</span>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING_TRANSITION}
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl border border-red-200/80 transition-colors text-xs cursor-pointer"
              >
                Keluar (Logout)
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastState {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastNotificationProps {
  toast: ToastState | null;
  onClose: () => void;
}

export default function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  return (
    <div className="fixed top-5 right-5 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-50/95 text-emerald-800 border-emerald-200/90'
                : toast.type === 'error'
                ? 'bg-red-50/95 text-red-800 border-red-200/90'
                : 'bg-blue-50/95 text-blue-800 border-blue-200/90'
            }`}
          >
            {/* Status Icon */}
            {toast.type === 'success' ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
                ✓
              </div>
            ) : toast.type === 'error' ? (
              <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
                !
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
                ℹ
              </div>
            )}

            <span>{toast.message}</span>

            <button
              type="button"
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors focus:outline-none cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

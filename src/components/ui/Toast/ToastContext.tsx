/**
 * ToastContext
 *
 * Contexto y hook para gestionar una cola de notificaciones Toast.
 * Renderiza un contenedor fijo en la esquina superior derecha con
 * región ARIA live para anuncios accesibles.
 *
 * Requisitos: 3.9, 11.4, 11.5
 */

'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { Toast, ToastVariant } from './Toast';
import styles from './ToastContext.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  exiting?: boolean;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Duration of the exit animation in ms — must match CSS --duration-normal */
const EXIT_ANIMATION_DURATION = 300;

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    // Mark as exiting to trigger exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove from state after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_ANIMATION_DURATION);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Fixed container – top-right, stacks toasts vertically */}
      <div
        className={styles.container}
        aria-live="polite"
        aria-atomic="false"
        aria-label="Notificaciones"
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            variant={toast.variant}
            duration={toast.duration}
            exiting={toast.exiting}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

export { ToastContext };
export default ToastProvider;
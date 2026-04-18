/**
 * Toast Component
 *
 * Notificación temporal con variantes semánticas, animación slide-in desde arriba,
 * auto-dismiss configurable y botón de cierre accesible.
 *
 * Requisitos: 3.9, 8.4, 11.4, 11.5, 10.10
 */

'use client';

import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  /** Mensaje a mostrar en la notificación */
  message: string;
  /** Variante semántica del toast */
  variant?: ToastVariant;
  /** Callback al cerrar el toast */
  onClose: () => void;
  /** Duración en ms antes del auto-dismiss (0 para deshabilitar) */
  duration?: number;
  /** Clase CSS adicional */
  className?: string;
  /** Si el toast está en proceso de salida (animación de salida activa) */
  exiting?: boolean;
}

const ICONS: Record<ToastVariant, React.ReactElement> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" fill="currentColor" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-13a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V5zm-1 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-5a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1z" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1 4a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1z" fill="currentColor" />
    </svg>
  ),
};

const ARIA_LABELS: Record<ToastVariant, string> = {
  success: 'Éxito',
  error: 'Error',
  warning: 'Advertencia',
  info: 'Información',
};

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  onClose,
  duration = 3000,
  className,
  exiting = false,
}) => {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const classNames = [
    styles.toast,
    styles[`toast--${variant}`],
    exiting ? styles['toast--exiting'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span className={styles.toast__icon} aria-label={ARIA_LABELS[variant]}>
        {ICONS[variant]}
      </span>

      <p className={styles.toast__message}>{message}</p>

      <button
        type="button"
        className={styles.toast__close}
        onClick={onClose}
        aria-label="Cerrar notificación"
        title="Cerrar notificación"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

Toast.displayName = 'Toast';

export default Toast;
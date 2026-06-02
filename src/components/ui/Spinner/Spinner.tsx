/**
 * Spinner Component
 *
 * Indicador de carga circular con animación de rotación suave.
 * Incluye atributos ARIA para accesibilidad con lectores de pantalla.
 *
 * Requisitos: 3.6, 11.2, 10.3
 */

import React from 'react';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  /** Tamaño del spinner: sm (16px), md (24px), lg (32px) */
  size?: SpinnerSize;
  /** Etiqueta para lectores de pantalla */
  label?: string;
  /** Clase CSS adicional */
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = React.memo(({
  size = 'md',
  label = 'Cargando…',
  className,
}) => {
  const classNames = [
    styles.spinner,
    styles[`spinner--${size}`],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classNames}
      role="status"
      aria-label={label}
    >
      <svg
        className={styles.spinner__svg}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          className={styles.spinner__track}
          cx="12"
          cy="12"
          r="10"
          strokeWidth="2.5"
        />
        <path
          className={styles.spinner__arc}
          d="M12 2a10 10 0 0 1 10 10"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
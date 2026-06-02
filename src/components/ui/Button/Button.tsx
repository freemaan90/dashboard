/**
 * Button Component
 *
 * Componente de botón reutilizable con variantes, tamaños, estados y soporte de iconos.
 *
 * Requisitos: 3.1, 10.1, 10.2, 10.3
 */

import React, { forwardRef } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón */
  variant?: ButtonVariant;
  /** Tamaño del botón */
  size?: ButtonSize;
  /** Estado de carga — deshabilita el botón y muestra un spinner */
  loading?: boolean;
  /** Icono opcional al inicio del texto */
  leadingIcon?: React.ReactNode;
  /** Icono opcional al final del texto */
  trailingIcon?: React.ReactNode;
  /** Renderizar como botón de solo icono (sin texto visible) */
  iconOnly?: boolean;
  /** Texto accesible cuando se usa iconOnly */
  'aria-label'?: string;
}

/**
 * Spinner inline para el estado de carga del botón.
 */
const ButtonSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => (
  <span
    className={`${styles.spinner} ${styles[`spinner--${size}`]}`}
    aria-hidden="true"
  />
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leadingIcon,
      trailingIcon,
      iconOnly = false,
      children,
      className,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classNames = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      iconOnly ? styles['button--icon-only'] : '',
      loading ? styles['button--loading'] : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        data-state={loading ? 'loading' : 'idle'}
        {...rest}
      >
        {loading && <ButtonSpinner size={size} />}

        {!loading && leadingIcon && (
          <span className={styles.icon} aria-hidden="true">
            {leadingIcon}
          </span>
        )}

        {!iconOnly && children && (
          <span className={styles.label}>{children}</span>
        )}

        {iconOnly && !loading && children}

        {!loading && trailingIcon && (
          <span className={styles.icon} aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
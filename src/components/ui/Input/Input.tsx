import React, { forwardRef, useId } from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label visible del campo */
  label?: string;
  /** Texto de ayuda mostrado debajo del input */
  helperText?: string;
  /** Mensaje de error — activa el estado de error cuando está presente */
  errorMessage?: string;
  /** Icono opcional al inicio del input */
  leadingIcon?: React.ReactNode;
  /** Icono opcional al final del input */
  trailingIcon?: React.ReactNode;
  /** Clases adicionales para el contenedor raíz */
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      leadingIcon,
      trailingIcon,
      id: idProp,
      disabled = false,
      className,
      containerClassName,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    const hasError = Boolean(errorMessage);
    const helperId = helperText ? `${id}-helper` : undefined;
    const errorId = hasError ? `${id}-error` : undefined;

    // aria-describedby links the input to helper/error text
    const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

    const wrapperClasses = [
      styles.wrapper,
      hasError ? styles['wrapper--error'] : '',
      disabled ? styles['wrapper--disabled'] : '',
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      styles.input,
      leadingIcon ? styles['input--has-leading'] : '',
      trailingIcon ? styles['input--has-trailing'] : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={[styles.root, containerClassName ?? ''].filter(Boolean).join(' ')}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}

        <div className={wrapperClasses}>
          {leadingIcon && (
            <span className={`${styles.icon} ${styles['icon--leading']}`} aria-hidden="true">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={inputClasses}
            {...rest}
          />

          {trailingIcon && (
            <span className={`${styles.icon} ${styles['icon--trailing']}`} aria-hidden="true">
              {trailingIcon}
            </span>
          )}
        </div>

        {helperText && !hasError && (
          <p id={helperId} className={styles.helper}>
            {helperText}
          </p>
        )}

        {hasError && (
          <p id={errorId} className={styles.error} role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
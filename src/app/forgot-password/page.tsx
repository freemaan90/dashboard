"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../login/login.module.css";
import { startResetPasswordFlow } from "../actions/User";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await startResetPasswordFlow(email);
      setErrorMsg("");
      setEmail("");
      router.push(`/login`);
    } catch (err) {
      setErrorMsg("Hubo un error, intentá nuevamente");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formPanel}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Recuperar contraseña</h1>
            <p className={styles.subtitle}>
              Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {errorMsg && <p className={styles.error} role="alert">{errorMsg}</p>}

            <button type="submit" className={styles.button}>Cambiar contraseña</button>
          </form>

          <p className={styles.backText}>
            ¿Recordaste tu contraseña?{" "}
            <span
              className={styles.backLink}
              onClick={() => router.push("/login")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && router.push("/login")}
            >
              Volver al inicio de sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

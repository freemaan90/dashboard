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
      <div className={styles.card}>
        <h1 className={styles.title}>Recuperar contraseña</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Digita tu email para recuperar tu contraseña"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <button className={styles.button}>Cambiar contraseña</button>
        </form>

        <p className={styles.backText}>
          ¿Recordaste tu contraseña?{" "}
          <span
            className={styles.backLink}
            onClick={() => router.push("/login")}
          >
            Volver al inicio de sesión
          </span>
        </p>
      </div>
    </div>
  );
}

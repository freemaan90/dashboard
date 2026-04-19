"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../login/login.module.css";
import { env } from "@/config/envs";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== repeatPassword) {
      setErrorMsg("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/user/reset-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
        credentials: "include"
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.message || "Error al actualizar la contraseña");
        return;
      }

      setSuccessMsg("Contraseña actualizada correctamente");
      setErrorMsg("");

      setEmail("");
      setNewPassword("");
      setRepeatPassword("");
      router.push(`/login`)

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
            placeholder="Ingresá tu email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Repetir nueva contraseña"
            className={styles.input}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
          {successMsg && <p className={styles.success}>{successMsg}</p>}

          <button className={styles.button}>Cambiar contraseña</button>
        </form>

        <p className={styles.backText}>
          ¿Recordaste tu contraseña?{" "}
          <span className={styles.backLink} onClick={() => router.push("/login")}>
            Volver al inicio de sesión
          </span>
        </p>
      </div>
    </div>
  );
}

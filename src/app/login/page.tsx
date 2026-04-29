"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg("Credenciales inválidas");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Iniciar sesión</h1>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.emailWrapper}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.passwordWrapper}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className={styles.showButton}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Ocultar" : "Ver"}
            </button>
          </div>

          <p className={styles.forgotText}>
            ¿Olvidaste tu contraseña?{" "}
            <span
              className={styles.forgotLink}
              onClick={() => router.push("/forgot-password")}
            >
              Recuperala acá
            </span>
          </p>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <button className={styles.button}>Entrar</button>
        </form>

        <p className={styles.registerText}>
          ¿No tenés cuenta?{" "}
          <span
            className={styles.registerLink}
            onClick={() => router.push("/signup")}
          >
            Registrate acá
          </span>
        </p>
      </div>
    </div>
  );
}

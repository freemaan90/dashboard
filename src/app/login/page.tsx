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
      setErrorMsg("Credenciales inválidas. Verificá tu email y contraseña.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className={styles.container}>
      {/* Panel izquierdo — branding */}
      <div className={styles.brandPanel} aria-hidden="true">
        <div className={styles.brandLogo}>
          <div className={styles.brandLogoIcon}>💬</div>
          <span className={styles.brandLogoText}>WaSender</span>
        </div>

        <div className={styles.brandContent}>
          <h1 className={styles.brandHeadline}>
            Conectá tu empresa con WhatsApp
          </h1>
          <p className={styles.brandDescription}>
            Gestioná sesiones, enviá mensajes y administrá templates desde un solo lugar.
          </p>
        </div>

        <div className={styles.brandFeatures}>
          <div className={styles.brandFeature}>
            <span className={styles.brandFeatureDot} />
            Sesiones WhatsApp en tiempo real
          </div>
          <div className={styles.brandFeature}>
            <span className={styles.brandFeatureDot} />
            Templates de mensajes reutilizables
          </div>
          <div className={styles.brandFeature}>
            <span className={styles.brandFeatureDot} />
            Gestión de equipos y roles
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className={styles.formPanel}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>Bienvenido de vuelta</h2>
            <p className={styles.subtitle}>Ingresá tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className={styles.form}>
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

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Contraseña</label>
              <div className={`${styles.inputWrapper} ${styles.passwordWrapper}`}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${styles.input} ${styles.passwordInput}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.showButton}
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <p className={styles.forgotText}>
              ¿Olvidaste tu contraseña?{" "}
              <span
                className={styles.forgotLink}
                onClick={() => router.push("/forgot-password")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && router.push("/forgot-password")}
              >
                Recuperala acá
              </span>
            </p>

            {errorMsg && (
              <p className={styles.error} role="alert">
                {errorMsg}
              </p>
            )}

            <button type="submit" className={styles.button}>
              Iniciar sesión
            </button>
          </form>

          <p className={styles.registerText}>
            ¿No tenés cuenta?{" "}
            <span
              className={styles.registerLink}
              onClick={() => router.push("/signup")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && router.push("/signup")}
            >
              Registrate acá
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import { env } from "@/config/envs";
import { registerAction } from "../actions/User";
import { UserInterface } from "@/interfaces/User.interface";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<UserInterface>({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "OWNER",
    company: "",
    companyLogo: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    await registerAction({
      ...form,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear cuenta</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nombre"
            className={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Apellido"
            className={styles.input}
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          <input
            type="text"
            placeholder="Teléfono"
            className={styles.input}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            type="text"
            placeholder="Empresa"
            className={styles.input}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <input
            type="text"
            placeholder="Lgogo de la empresa (URL)"
            className={styles.input}
            value={form.companyLogo}
            onChange={(e) => setForm({ ...form, companyLogo: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Password */}
          <div className={styles.passwordWrapper}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              type="button"
              className={styles.showButton}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "Ocultar" : "Ver"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Repetir password"
              className={styles.input}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <button
              type="button"
              className={styles.showButton}
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              {showConfirmPass ? "Ocultar" : "Ver"}
            </button>
          </div>

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <button className={styles.button}>Registrarse</button>
        </form>

        <p className={styles.loginText}>
          ¿Ya tenés cuenta?{" "}
          <span
            className={styles.loginLink}
            onClick={() => router.push("/login")}
          >
            Iniciá sesión
          </span>
        </p>
      </div>
    </div>
  );
}

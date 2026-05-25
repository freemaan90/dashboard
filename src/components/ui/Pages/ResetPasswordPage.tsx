"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/login/login.module.css";
import { InputPassword } from "@/components/ui/Input/InputPassword";
import { PasswordType, Roles } from "@/enum/Roles";
import { useUserForm } from "@/hooks/useUserForm";
import { resetPassword, validateResetToken } from "@/app/actions/User";

export default function ResetPasswordPage({ token }: { token?: string }) {
  const router = useRouter();
  const { form, setForm } = useUserForm("OWNER");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Validar token al cargar la página
  useEffect(() => {
    if (!token) {
      setErrorMsg("Token inválido");
      return;
    }

    validateResetToken(token).catch(() => {
      setErrorMsg("Token inválido o expirado");
    });
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMsg("Token inválido");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      resetPassword(token, form.password, form.confirmPassword);
      setSuccessMsg("Contraseña actualizada correctamente");
      setErrorMsg("");

      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setErrorMsg("Hubo un error, intentá nuevamente");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Restablecer contraseña</h1>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {successMsg && <p className={styles.success}>{successMsg}</p>}

        {!errorMsg && (
          <form onSubmit={handleSubmit} className={styles.form}>

            <InputPassword setForm={setForm} form={form} type={PasswordType.PASSWORD} role={Roles.OWNER} />
            <InputPassword setForm={setForm} form={form} type={PasswordType.CONFIRM_PASSWORD} role={Roles.OWNER} />

            <button className={styles.button}>Cambiar contraseña</button>
          </form>
        )}

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

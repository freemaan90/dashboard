"use client";
import { changePassword } from "@/app/actions/User";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./ResetPassword.module.css";
import { UserSession } from "@/interfaces/User.interface";
import { InputPassword } from "../Input/InputPassword";
import { useUserForm } from "@/hooks/useUserForm";
import { PasswordType, Roles } from "@/enum/Roles";

export const ResetLoginPage = ({
  user,
  accessToken,
}: {
  user: UserSession;
  accessToken: string;
}) => {
  const router = useRouter();
  const { id } = user;
  const { form, setForm } = useUserForm("OWNER", accessToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    console.log(form);
    const res = await changePassword({
      currentPassword: form.actualPassword!,
      newPassword: form.confirmPassword!,
      userId: id,
    });
    if (!res.ok) {
      setError("Error al cambiar la contraseña");
      setLoading(false);
      return;
    }
    setLoading(false);
    setSuccess("Contraseña actualizada correctamente");

    setTimeout(() => {
      router.push("/dashboard/account");
    }, 1200);
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Cambiar contraseña</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Contraseña actual</label>

        <InputPassword
          form={form}
          role={Roles.OWNER}
          setForm={setForm}
          type={PasswordType.ACTUAL_PASSWORD}
        />

        <label className={styles.label}>Nueva contraseña</label>
        <InputPassword
          form={form}
          role={Roles.OWNER}
          setForm={setForm}
          type={PasswordType.PASSWORD}
        />

        <label className={styles.label}>Repetir nueva contraseña</label>
        <InputPassword
          form={form}
          role={Roles.OWNER}
          setForm={setForm}
          type={PasswordType.CONFIRM_PASSWORD}
        />

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <button className={styles.btnPrimary} disabled={loading}>
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
    </div>
  );
};

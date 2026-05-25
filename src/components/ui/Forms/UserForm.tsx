"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./UserForm.module.css";
import { useUserForm } from "@/hooks/useUserForm";
import { InputPassword } from "../Input/InputPassword";
import { PasswordType, Roles } from "@/enum/Roles";
import { env } from "@/config/envs";

export const UserForm = () => {
  const router = useRouter();
  const { form, setForm, errorMsg, handleSubmit } = useUserForm("OWNER");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    setUploading(true);
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/upload/logo`, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setForm({ ...form, companyLogo: json.url });
    } catch {
      // mantiene el valor anterior si falla
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear cuenta</h1>

        <form onSubmit={async (e) => { e.preventDefault(); await handleSubmit(); }} className={styles.form}>
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

          <div className={styles.logoUpload}>
            {form.companyLogo ? (
              <img
                src={form.companyLogo}
                alt="Logo"
                className={styles.logoPreview}
                onClick={() => fileInputRef.current?.click()}
              />
            ) : (
              <div
                className={styles.logoPlaceholder}
                onClick={() => fileInputRef.current?.click()}
              >
                Logo
              </div>
            )}
            {uploading ? (
              <span className={styles.uploading}>Subiendo...</span>
            ) : (
              <label className={styles.logoLabel} onClick={() => fileInputRef.current?.click()}>
                {form.companyLogo ? "Cambiar logo" : "Subir logo de empresa"}
              </label>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.logoInput}
              onChange={handleLogoChange}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <InputPassword setForm={setForm} form={form} type={PasswordType.PASSWORD} role={Roles.OWNER} />

          <InputPassword form={form} setForm={setForm} type={PasswordType.CONFIRM_PASSWORD} role={Roles.OWNER} />

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
};

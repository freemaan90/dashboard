"use client";
import { useRouter } from "next/navigation";
import styles from "./UserForm.module.css";
import { useUserForm } from "@/hooks/useUserForm";
import { InputPassword } from "../Input/InputPassword";
import { PasswordType, Roles } from "@/enum/Roles";
export const UserForm = () => {
  const router = useRouter();
  const {
    form,
    setForm,
    errorMsg,
    handleSubmit,
  } = useUserForm("OWNER");

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

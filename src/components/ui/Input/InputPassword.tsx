"use client";

import styles from "./InputPassword.module.css";
import { PasswordType, Roles } from "../../../enum/Roles";
import { UserInterface } from "@/interfaces/User.interface";
import { Dispatch, SetStateAction } from "react";
import { useUserForm } from "@/hooks/useUserForm";

export const InputPassword = ({
  role,
  type,
  form,
  setForm,
}: {
  role: Roles.OWNER | Roles.EMPLOYEE;
  type: PasswordType.PASSWORD | PasswordType.CONFIRM_PASSWORD | PasswordType.ACTUAL_PASSWORD;
  form: UserInterface;
  setForm: Dispatch<SetStateAction<UserInterface>>;
}) => {
  const { showPass, setShowPass } = useUserForm(role);

  const placeholderMap = {
    [PasswordType.ACTUAL_PASSWORD]: "Contraseña actual",
    [PasswordType.PASSWORD]: "Nueva contraseña",
    [PasswordType.CONFIRM_PASSWORD]: "Repetir contraseña",
  };

  return (
    <div className={styles.passwordWrapper}>
      <input
        type={showPass ? "text" : "password"}
        placeholder={placeholderMap[type]}
        className={styles.input}
        value={form[type] ?? ""}
        onChange={(e) =>
          setForm({
            ...form,
            [type]: e.target.value,
          })
        }
      />

      <button
        type="button"
        className={styles.showButton}
        onClick={() => setShowPass(!showPass)}
      >
        {showPass ? "Ocultar" : "Ver"}
      </button>
    </div>
  );
};

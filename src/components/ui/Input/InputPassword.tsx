import { useUserForm } from "@/hooks/useUserForm";
import styles from "./InputPassword.module.css";
import { PasswordType, Roles } from "../../../enum/Roles";
import { UserInterface } from "@/interfaces/User.interface";
import { Dispatch, SetStateAction } from "react";
export const InputPassword = ({
  role,
  type,
  form,
  setForm
}: {
  role: Roles.OWNER | Roles.EMPLOYEE;
  type: PasswordType.PASSWORD | PasswordType.CONFIRM_PASSWORD;
  form: UserInterface,
  setForm: Dispatch<SetStateAction<UserInterface>>
}) => {
  const { showPass, setShowPass } = useUserForm(role);
  
  return (
    <div className={styles.passwordWrapper}>
      <input
        type={showPass ? "text" : "password"}
        placeholder={type === PasswordType.PASSWORD ? "Nueva contraseña" : "Repetir contraseña"}
        className={styles.input}
        value={form[type]}
        onChange={(e) => {
            console.log(form)
            return setForm({ ...form, [type]: e.target.value });
        }}
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

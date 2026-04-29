"use client";

import styles from "./ChangePasswordButton.module.css";

export default function ChangePasswordButton({ userId }:{userId: string}) {
    const goToChangePassword = () => {
        console.log("Redirigiendo a cambiar contraseña para userId:", userId);
    }

  return (
    <button className={styles.btnSecondary} onClick={goToChangePassword}>
      Cambiar contraseña
    </button>
  );
}

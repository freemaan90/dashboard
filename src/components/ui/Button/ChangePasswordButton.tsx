"use client";

import { useRouter } from "next/navigation";
import styles from "./ChangePasswordButton.module.css";

export default function ChangePasswordButton({ userId }: { userId: string }) {
  const router = useRouter(); // 👈 ahora sí existe

  const goToChangePassword = () => {
    router.push("/dashboard/reset");
  };

  return (
    <button className={styles.btnSecondary} onClick={goToChangePassword}>
      Cambiar contraseña
    </button>
  );
}

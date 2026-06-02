"use client";

import { useState } from "react";
import styles from "./EditPhone.module.css";
import { updateClient } from "@/app/actions/User";
import { useRouter } from "next/navigation";

export default function EditPhone({
  phone,
  userId,
}: {
  phone: string;
  userId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(phone);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function save() {
    setLoading(true);
    await updateClient({ userId, field: "phone", value });
    router.refresh
    setLoading(false);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className={styles.inlineRow}>
        <span className={styles.value}>{value}</span>
        <button className={styles.btnSmall} onClick={() => setEditing(true)}>
          Editar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.inlineRow}>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button className={styles.btnSmall} onClick={save} disabled={loading}>
        Guardar
      </button>

      <button className={styles.btnSmall} onClick={() => setEditing(false)}>
        Cancelar
      </button>
    </div>
  );
}

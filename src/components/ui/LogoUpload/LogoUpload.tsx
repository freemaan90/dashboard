"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./LogoUpload.module.css";

interface LogoUploadProps {
  userId: string;
  currentLogo: string;
  initials: string;
}

export function LogoUpload({ userId, currentLogo, initials }: LogoUploadProps) {
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState(currentLogo);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      // 1) Subir archivo
      const data = new FormData();
      data.append("file", file);

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/logo?userId=${userId}`,
        { method: "POST", body: data },
      );

      if (!uploadRes.ok) throw new Error("Error subiendo imagen");

      const { url } = await uploadRes.json();

      // 2) Guardar en la base de datos
      const patchRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyLogo: url }),
        },
      );

      if (!patchRes.ok) throw new Error("Error guardando el logo");

      // 3) Actualizar sesión y estado local
      setLogo(url);
      await update({ user: { companyLogo: url } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setUploading(false);
      // reset input para poder volver a seleccionar el mismo archivo
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.avatarButton}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        aria-label="Cambiar logo de empresa"
      >
        {logo ? (
          <img src={logo} alt="Logo de empresa" className={styles.logo} />
        ) : (
          <span className={styles.initials}>{initials}</span>
        )}
        <span className={styles.overlay} aria-hidden="true">
          {uploading ? "..." : "✎"}
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        className={styles.fileInput}
        onChange={handleChange}
      />

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

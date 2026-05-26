"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { TextAreaContent } from "./TextAreaContent";
import styles from "../../app/dashboard/templates/TemplatePage.module.css";

interface TemplateFormProps {
  action: (formData: FormData) => Promise<void>;
  onSuccess?: () => void;
}

type ActionState = { success: boolean; error?: string } | null;

export function TemplateForm({ action, onSuccess }: TemplateFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaResetRef = useRef<() => void>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const wrappedAction = async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
    try {
      await action(formData);
      return { success: true };
    } catch {
      return { success: false, error: "Error al crear el template" };
    }
  };

  const [state, dispatch] = useActionState(wrappedAction, null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      textAreaResetRef.current?.();
      setImageUrl("");
      onSuccess?.();
    }
  }, [state]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/template-image`,
        { method: "POST", body: data },
      );

      if (!res.ok) throw new Error("Error subiendo imagen");

      const { url } = await res.json();
      setImageUrl(url);
    } catch {
      setUploadError("No se pudo subir la imagen. Intentá de nuevo.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form ref={formRef} action={dispatch} className={styles.form}>
      <h2 className={styles.formTitle}>Nuevo template</h2>

      <div>
        <label htmlFor="title" className={styles.label}>
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          className={styles.input}
          placeholder="Ej: Bienvenida al cliente"
        />
      </div>

      <TextAreaContent name="content" resetRef={textAreaResetRef} />

      <div>
        <label className={styles.label}>Imagen (opcional)</label>
        <div className={styles.imageUploadArea}>
          {imageUrl ? (
            <div className={styles.imagePreviewContainer}>
              <img src={imageUrl} alt="Preview" className={styles.imagePreview} />
              <button
                type="button"
                className={styles.imageRemoveButton}
                onClick={() => setImageUrl("")}
              >
                Quitar imagen
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.imageUploadButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Subiendo..." : "Seleccionar imagen"}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            className={styles.hiddenFileInput}
            onChange={handleImageChange}
          />
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>
        {uploadError && <p className={styles.error}>{uploadError}</p>}
      </div>

      {state?.error && (
        <p className={styles.error}>{state.error}</p>
      )}

      <button type="submit" className={styles.button}>
        Crear template
      </button>
    </form>
  );
}

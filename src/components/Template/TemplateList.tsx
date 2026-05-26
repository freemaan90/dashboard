"use client";

import { useRef, useState, useTransition } from "react";
import { Template } from "@/interfaces/Template.interface";
import { Button } from "../ui/Button/Button";
import { Icon } from "../ui/Icon/Icon";
import { ApplyTemplateModal } from "./ApplyTemplateModal";
import { HighlightedText } from "./HighlightedText";
import { TextAreaContent } from "./TextAreaContent";
import styles from "./TemplateList.module.css";

interface Props {
  templates: Template[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: { title: string; content: string; imageUrl?: string }) => Promise<void>;
}

interface EditState {
  title: string;
  content: string;
  imageUrl: string;
}

export const TemplateList = ({ templates, onDelete, onUpdate }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState>({ title: "", content: "", imageUrl: "" });
  const [applyTemplate, setApplyTemplate] = useState<Template | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editUploading, setEditUploading] = useState(false);
  const [editUploadError, setEditUploadError] = useState("");
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (t: Template) => {
    setEditingId(t.id);
    setEditState({ title: t.title, content: t.content, imageUrl: t.imageUrl ?? "" });
    setEditUploadError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: number) => {
    startTransition(async () => {
      await onUpdate(id, {
        title: editState.title,
        content: editState.content,
        imageUrl: editState.imageUrl || undefined,
      });
      setEditingId(null);
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Eliminar este template?")) return;
    startTransition(async () => {
      await onDelete(id);
    });
  };

  const handleEditImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditUploadError("");
    setEditUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/template-image`,
        { method: "POST", body: data },
      );

      if (!res.ok) throw new Error("Error subiendo imagen");

      const { url } = await res.json();
      setEditState((s) => ({ ...s, imageUrl: url }));
    } catch {
      setEditUploadError("No se pudo subir la imagen. Intentá de nuevo.");
    } finally {
      setEditUploading(false);
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className={styles.listSection}>
        <h2 className={styles.listTitle}>
          Tus templates
          {templates.length > 0 && (
            <span className={styles.templateCount}>({templates.length})</span>
          )}
        </h2>

        {templates.length === 0 ? (
          <p className={styles.empty}>No tenés templates todavía. ¡Creá el primero!</p>
        ) : (
          <ul className={styles.list}>
            {templates
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((t) => (
                <li key={t.id} className={styles.item}>
                  {editingId === t.id ? (
                    <div className={styles.editForm}>
                      <input
                        className={styles.editInput}
                        value={editState.title}
                        onChange={(e) => setEditState((s) => ({ ...s, title: e.target.value }))}
                        placeholder="Título"
                      />
                      <TextAreaContent
                        value={editState.content}
                        onChange={(v) => setEditState((s) => ({ ...s, content: v }))}
                      />

                      <div>
                        <p className={styles.editImageLabel}>Imagen</p>
                        <div className={styles.editImageArea}>
                          {editState.imageUrl ? (
                            <div className={styles.editImagePreviewContainer}>
                              <img src={editState.imageUrl} alt="Preview" className={styles.editImagePreview} />
                              <button
                                type="button"
                                className={styles.editImageRemoveButton}
                                onClick={() => setEditState((s) => ({ ...s, imageUrl: "" }))}
                              >
                                Quitar imagen
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className={styles.editImageUploadButton}
                              onClick={() => editFileInputRef.current?.click()}
                              disabled={editUploading}
                            >
                              {editUploading ? "Subiendo..." : "Seleccionar imagen"}
                            </button>
                          )}
                          <input
                            ref={editFileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                            className={styles.hiddenFileInput}
                            onChange={handleEditImageChange}
                          />
                        </div>
                        {editUploadError && <p className={styles.editUploadError}>{editUploadError}</p>}
                      </div>

                      <div className={styles.editActions}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => saveEdit(t.id)}
                          disabled={isPending || editUploading || !editState.title.trim() || !editState.content.trim()}
                          loading={isPending}
                        >
                          Guardar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={isPending}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.templateItemContainer}>
                      <div className={styles.templateItemContent}>
                        {t.imageUrl && (
                          <img src={t.imageUrl} alt={t.title} className={styles.imageThumbnail} />
                        )}
                        <div>
                          <h3 className={styles.itemTitle}>{t.title}</h3>
                          <HighlightedText content={t.content} className={styles.itemContent} />
                          <p className={styles.itemDate}>
                            Actualizado: {new Date(t.updatedAt).toLocaleString("es-AR")}
                          </p>
                        </div>
                      </div>

                      <div className={styles.buttonsContainer}>
                        <div className={styles.buttons}>
                          <div className={styles.applyButtonContainer}>
                            <Button
                              variant="primary"
                              size="sm"
                              className={styles.buttonApply}
                              onClick={() => setApplyTemplate(t)}
                              disabled={isPending}
                            >
                              <Icon name="FileSpreadsheet" size={16} aria-hidden="true" />
                              Aplicar
                            </Button>
                          </div>
                          <div className={styles.editDeleteContainer}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(t)}
                              disabled={isPending}
                            >
                              <Icon name="Edit" size={16} />
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(t.id)}
                              disabled={isPending}
                            >
                              <Icon name="Trash2" size={16} />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>

      {applyTemplate && (
        <ApplyTemplateModal
          template={applyTemplate}
          onClose={() => setApplyTemplate(null)}
        />
      )}
    </>
  );
};

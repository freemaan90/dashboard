"use client";

import { useState, useTransition } from "react";
import { Template } from "@/interfaces/Template.interface";
import { Button } from "../ui/Button/Button";
import { Icon } from "../ui/Icon/Icon";
import { ApplyTemplateModal } from "./ApplyTemplateModal";
import styles from "./TemplateList.module.css";

interface Props {
  templates: Template[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: { title: string; content: string }) => Promise<void>;
}

interface EditState {
  title: string;
  content: string;
}

export const TemplateList = ({ templates, onDelete, onUpdate }: Props) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState>({ title: "", content: "" });
  const [applyTemplate, setApplyTemplate] = useState<Template | null>(null);
  const [isPending, startTransition] = useTransition();

  const startEdit = (t: Template) => {
    setEditingId(t.id);
    setEditState({ title: t.title, content: t.content });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: number) => {
    startTransition(async () => {
      await onUpdate(id, editState);
      setEditingId(null);
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Eliminar este template?")) return;
    startTransition(async () => {
      await onDelete(id);
    });
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
                      <textarea
                        className={styles.editTextarea}
                        value={editState.content}
                        onChange={(e) => setEditState((s) => ({ ...s, content: e.target.value }))}
                        rows={4}
                        placeholder="Contenido del template. Usá {{variable}} para variables."
                      />
                      <div className={styles.editActions}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => saveEdit(t.id)}
                          disabled={isPending || !editState.title.trim() || !editState.content.trim()}
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
                      <div>
                        <h3 className={styles.itemTitle}>{t.title}</h3>
                        <p className={styles.itemContent}>{t.content}</p>
                        <p className={styles.itemDate}>
                          Actualizado: {new Date(t.updatedAt).toLocaleString("es-AR")}
                        </p>
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

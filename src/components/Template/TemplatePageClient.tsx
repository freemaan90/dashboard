"use client";

import { useState } from "react";
import { Template } from "@/interfaces/Template.interface";
import { TemplateForm } from "./TemplateForm";
import { TemplateList } from "./TemplateList";
import styles from "../../app/dashboard/templates/TemplatePage.module.css";

interface Props {
  templates: Template[];
  isEmployee: boolean;
  company: string;
  onCreate: (formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: { title: string; content: string }) => Promise<void>;
}

type View = "list" | "new";

export function TemplatePageClient({ templates, isEmployee, company, onCreate, onDelete, onUpdate }: Props) {
  const [view, setView] = useState<View>("list");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Templates</h1>
        <p className={styles.subtitle}>
          {isEmployee
            ? `Plantillas disponibles para ${company}`
            : `Creá y reutilizá plantillas de mensajes para ${company}`}
        </p>
      </div>

      {!isEmployee && (
        <div className={styles.tabs}>
          <button
            className={`${styles.tab}${view === "list" ? ` ${styles.tabActive}` : ""}`}
            onClick={() => setView("list")}
          >
            Ver templates
          </button>
          <button
            className={`${styles.tab}${view === "new" ? ` ${styles.tabActive}` : ""}`}
            onClick={() => setView("new")}
          >
            Nuevo template
          </button>
        </div>
      )}

      {!isEmployee && view === "new" ? (
        <TemplateForm action={onCreate} onSuccess={() => setView("list")} />
      ) : (
        <TemplateList templates={templates} onDelete={onDelete} onUpdate={onUpdate} />
      )}
    </div>
  );
}

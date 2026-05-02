"use client";

import { useActionState, useEffect, useRef } from "react";
import { TextAreaContent } from "./TextAreaContent";
import styles from "../../app/dashboard/templates/TemplatePage.module.css";

interface TemplateFormProps {
  action: (formData: FormData) => Promise<void>;
}

type ActionState = { success: boolean; error?: string } | null;

async function formAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    // La acción real se pasa como prop y se llama desde aquí
    // pero useActionState necesita una función directa, así que
    // usamos un ref trick — ver componente abajo
    return { success: true };
  } catch {
    return { success: false, error: "Error al crear el template" };
  }
}

export function TemplateForm({ action }: TemplateFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaResetRef = useRef<() => void>(null);

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
    }
  }, [state]);

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

      {state?.error && (
        <p className={styles.error}>{state.error}</p>
      )}

      <button type="submit" className={styles.button}>
        Crear template
      </button>
    </form>
  );
}

"use client";
import { useRef, useState, useImperativeHandle } from "react";
import styles from "./TextAreaContent.module.css";

interface TextAreaContentProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  resetRef?: React.RefObject<(() => void) | null>;
}

function renderHighlighted(text: string): string {
  return text.replace(
    /\{\{\w+\}\}/g,
    (match) => `<span class="highlight-var">${match}</span>`,
  );
}

export const TextAreaContent = ({
  value,
  onChange,
  name,
  resetRef,
}: TextAreaContentProps) => {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const controlled = value !== undefined;
  const text = controlled ? value : internalValue;

  // Expone la función reset al padre via resetRef
  useImperativeHandle(resetRef, () => () => {
    setInternalValue("");
    onChange?.("");
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!controlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor="contenido" className={styles.label}>
        Contenido
      </label>

      <div className={styles.editorWrapper}>
        {/* Overlay que muestra el texto con highlights */}
        <div
          className={styles.overlay}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: renderHighlighted(text) + "\n" }}
        />

        {/* Textarea real, transparente, encima del overlay */}
        <textarea
          ref={textareaRef}
          id="contenido"
          name={name}
          className={styles.textarea}
          value={text}
          onChange={handleChange}
          placeholder="Hola {{nombre}}, te damos la bienvenida a..."
          rows={5}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

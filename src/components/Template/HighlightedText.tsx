import styles from "./HighlightedText.module.css";

interface Props {
  content: string;
  className?: string;
}

function renderHighlighted(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{\{\w+\}\}/g, (match) => `<span class="highlight-var">${match}</span>`);
}

export function HighlightedText({ content, className }: Props) {
  return (
    <span
      className={`${styles.root}${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: renderHighlighted(content) }}
    />
  );
}

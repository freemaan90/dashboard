export function renderTemplate(
  content: string,
  vars: Record<string, string>,
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

export function extractVariables(content: string): string[] {
  return [...content.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
}

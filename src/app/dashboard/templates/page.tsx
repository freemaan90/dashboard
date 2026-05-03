import styles from "./TemplatePage.module.css";
import { getAllTemplates, createTemplate } from "@/app/actions/Templates";
import { authMe } from "@/app/actions/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TemplateForm } from "@/components/Template/TemplateForm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export default async function TemplatePage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("No hay sesión activa");
  }

  const user = await authMe(session.accessToken);
  if (!user) {
    throw new Error("No se pudo obtener la información del usuario");
  }

  const templates = await getAllTemplates(user.id, session.accessToken);
  async function handleCreate(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!session?.accessToken) {
      throw new Error("No hay sesión activa");
    }

    const user = await authMe(session.accessToken);

    if (!user) {
      throw new Error("No se pudo obtener la información del usuario");
    }

    await createTemplate(session.accessToken!, {
      title,
      content,
      userId: String(user.id),
    });

    revalidatePath("/dashboard/templates");
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Templates</h1>
        <p className={styles.subtitle}>
          Creá y reutilizá plantillas de mensajes para {user.company}
        </p>
      </div>

      {/* Formulario */}
      <TemplateForm action={handleCreate} />

      {/* Lista */}
      <div className={styles.listSection}>
        <h2 className={styles.listTitle}>
          Tus templates
          {templates.length > 0 && (
            <span className={styles.templateCount}>({templates.length})</span>
          )}
        </h2>

        {templates.length === 0 ? (
          <p className={styles.empty}>
            No tenés templates todavía. ¡Creá el primero!
          </p>
        ) : (
          <ul className={styles.list}>
            {templates
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((t) => (
                <li key={t.id} className={styles.item}>
                  <h3 className={styles.itemTitle}>{t.title}</h3>
                  <p className={styles.itemContent}>{t.content}</p>
                  <p className={styles.itemDate}>
                    Actualizado: {new Date(t.updatedAt).toLocaleString("es-AR")}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

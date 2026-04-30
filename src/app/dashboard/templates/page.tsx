import styles from "./TemplatePage.module.css";
import { getAllTemplates, createTemplate } from "@/app/actions/Templates";
import { authMe } from "@/app/actions/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export default async function TemplatePage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("No hay sesión activa");
  }

  const user = await authMe(session.accessToken);

  if(!user) {
    throw new Error("No se pudo obtener la información del usuario");
  }

  const templates = await getAllTemplates(user.id);

  async function handleCreate(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if(!session?.accessToken) {
      throw new Error("No hay sesión activa");
    }

    const user = await authMe(session.accessToken);

    if(!user) {
      throw new Error("No se pudo obtener la información del usuario");
    }   

    await createTemplate(session.accessToken!, { title, content, userId: user.id });

    revalidatePath("/dashboard/templates");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Templates de {user.name}</h1>

      {/* FORM */}
      <form action={handleCreate} className={styles.form}>
        <div>
          <label className={styles.label}>Título</label>
          <input
            name="title"
            required
            className={styles.input}
            placeholder="Título del template"
          />
        </div>

        <div>
          <label className={styles.label}>Contenido</label>
          <textarea
            name="content"
            required
            className={styles.textarea}
            placeholder="Contenido del template"
          />
        </div>

        <button type="submit" className={styles.button}>
          Crear Template
        </button>
      </form>

      {/* LISTA */}
      <div>
        <h2 className={styles.listTitle}>Tus templates</h2>

        {templates.length === 0 && (
          <p className={styles.empty}>No tenés templates todavía.</p>
        )}

        <ul className={styles.list}>
          {templates.map((t: any) => (
            <li key={t.id} className={styles.item}>
              <h3 className={styles.itemTitle}>{t.title}</h3>
              <p className={styles.itemContent}>{t.content}</p>
              <p className={styles.itemDate}>
                Creado: {new Date(t.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

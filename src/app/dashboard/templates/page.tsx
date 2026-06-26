import { getAllTemplates, createTemplate, updateTemplate, deleteTemplate } from "@/app/actions/Templates";
import { authMe } from "@/app/actions/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TemplatePageClient } from "@/components/Template/TemplatePageClient";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function TemplatePage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || !session.user) {
    throw new Error("No hay sesión activa");
  }

  const user = await authMe(session.accessToken);
  if (!user) {
    throw new Error("No se pudo obtener la información del usuario");
  }

  // Templates are scoped to the tenant owner.
  // OWNER: ownerId is null, use their own id.
  // SUPERVISOR / EMPLOYEE: use ownerId to see owner's templates.
  const effectiveOwnerId = session.user.ownerId ?? session.user.id;

  let templates;
  try {
    templates = await getAllTemplates(effectiveOwnerId, session.accessToken);
  } catch (err: any) {
    if (err.statusCode === 402) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem", textAlign: "center", padding: "2rem" }}>
          <span style={{ fontSize: "2.5rem" }}>🔒</span>
          <h2 style={{ fontSize: "var(--font-size-h3)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-primary)", margin: 0 }}>
            Necesitás un plan activo
          </h2>
          <p style={{ fontSize: "var(--font-size-body)", color: "var(--color-text-tertiary)", maxWidth: "420px", margin: 0 }}>
            Las plantillas de mensajes están disponibles con cualquier plan. Elegí el que mejor se adapte a tu equipo y empezá a usarlas hoy.
          </p>
          <Link href="/dashboard/billing" style={{ display: "inline-block", marginTop: "0.5rem", padding: "0.75rem 1.5rem", background: "var(--color-primary-600, #7c3aed)", color: "#fff", borderRadius: "var(--radius-md)", fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-body)", textDecoration: "none" }}>
            Ver planes
          </Link>
        </div>
      );
    }
    throw err;
  }

  const isEmployee = session.user.role === "EMPLOYEE";

  async function handleCreate(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = (formData.get("imageUrl") as string) || undefined;

    if (!session?.accessToken || !session.user) {
      throw new Error("No hay sesión activa");
    }

    const ownerId = session.user.ownerId ?? session.user.id;

    await createTemplate(session.accessToken, {
      title,
      content,
      userId: ownerId,
      imageUrl,
    });

    revalidatePath("/dashboard/templates");
  }

  async function handleDelete(templateId: number) {
    "use server";
    if (!session?.accessToken) throw new Error("No hay sesión activa");
    await deleteTemplate(session.accessToken, templateId);
    revalidatePath("/dashboard/templates");
  }

  async function handleUpdate(templateId: number, data: { title: string; content: string; imageUrl?: string }) {
    "use server";
    if (!session?.accessToken) throw new Error("No hay sesión activa");
    await updateTemplate(session.accessToken, templateId, data);
    revalidatePath("/dashboard/templates");
  }

  return (
    <TemplatePageClient
      templates={templates}
      isEmployee={isEmployee}
      company={user.company}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
    />
  );
}

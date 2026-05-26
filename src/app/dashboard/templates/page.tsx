import { getAllTemplates, createTemplate, updateTemplate, deleteTemplate } from "@/app/actions/Templates";
import { authMe } from "@/app/actions/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TemplatePageClient } from "@/components/Template/TemplatePageClient";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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

  const templates = await getAllTemplates(effectiveOwnerId, session.accessToken);

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

import { env } from "@/config/envs";
import { Template } from "@/interfaces/Template.interface";
import { api } from "@/lib";

export const getAllTemplates = async (userId: string, accessToken: string): Promise<Template[]> => {
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/template/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener las plantillas");
  }
  return res.json();
}

export async function createTemplate(accessToken: string, data: { title: string; content: string; userId: string }) {
  const res = await api("/template", "POST", data, accessToken);
  return res;
}

export async function updateTemplate(accessToken: string, templateId: number, data: { title: string; content: string }) {
  const res = await api(`/template/${templateId}`, "PATCH", data, accessToken);
  return res;
}

export async function deleteTemplate(accessToken: string, templateId: number) {
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/template/${templateId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar el template");
  }
}
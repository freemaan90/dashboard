import { env } from "@/config/envs";
import { api } from "@/lib";

export const getAllTemplates = async (userId: string) => {
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/template/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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
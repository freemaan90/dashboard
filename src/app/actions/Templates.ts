'use server'
import { env } from "@/config/envs";
import { Template } from "@/interfaces/Template.interface";
import { api } from "@/lib";
import { revalidatePath } from "next/cache";

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

export async function deleteTemolate(accessToken: string, templateId:number){
  const res = await api(`/template/${templateId}`,'DELETE',{},accessToken)
  if(res.deleted){
    revalidatePath(`/dashboard/templates`)
  }
  return res
}

export async function updateTemolate(accessToken: string, templateId:string, data:{}){
  const res = await api(`/template/`,'PATCH',data, accessToken)
}
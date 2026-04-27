"use server";

import { env } from "@/config/envs";
import { Employees, UserInterface } from "@/interfaces/User.interface";
import { redirect } from "next/navigation";

export async function registerAction(formData: UserInterface) {
  const body = { ...formData, confirmPassword: undefined, role: undefined };
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error creando usuario");
  }

  redirect("/login");
}

export async function registerEmployeeAction(formData: UserInterface) {
  
  const body = { ...formData, confirmPassword: undefined, role: undefined };
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/user/new-employee`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include", 
  });

  if (!res.ok) {
    throw new Error("Error creando empleado");
  }

  redirect("/dashboard");
}

export async function handleRoleChange(id: number, formData: FormData) {
  const newRole = formData.get("role") as string;

  console.log("Cambiando rol de", id, "a", newRole);

  // TODO: fetch a NestJS
  // await fetch(`${process.env.API_URL}/user/${id}/role`, {
  //   method: "PATCH",
  //   body: JSON.stringify({ role: newRole }),
  // });
}

export async function handleDelete(id: number) {
  // TODO: llamar a tu backend NestJS
  // await fetch(`${process.env.API_URL}/user/${id}`, { method: "DELETE" });
}

export async function getEmployees(ownerId: number):Promise<Employees[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/user/employees/${ownerId}`, {
    method: "GET",
  });
  if(!res.ok) {
    throw new Error("Error obteniendo empleados");
  }
  return res.json();
}
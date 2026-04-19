"use server";

import { env } from "@/config/envs";
import { UserInterface } from "@/interfaces/User.interface";
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

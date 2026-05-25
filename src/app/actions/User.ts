"use server";

import { env } from "@/config/envs";
import { Employees, UserInterface, UserSession } from "@/interfaces/User.interface";
import { redirect } from "next/navigation";

export async function registerAction(formData: UserInterface) {
  const { confirmPassword: _, role: __, actualPassword: ___, ownerId: ____, ...body } = formData;
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
  const { confirmPassword: _, actualPassword: __, ownerId: ___, company: ____, companyLogo: _____, ...body } = formData;
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

export async function getEmployees(ownerId: number): Promise<Employees[]> {
  const res = await fetch(
    `${env.NEXT_PUBLIC_BACKEND_URL}/user/employees/${ownerId}`,
    {
      method: "GET",
    },
  );
  if (!res.ok) {
    throw new Error("Error obteniendo empleados");
  }
  return res.json();
}

export async function startResetPasswordFlow(email: string) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_BACKEND_URL}/auth/request-password-reset`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );

  if (!res.ok) {
    throw new Error("Error iniciando el proceso de recuperación de contraseña");
  }

  redirect("/login");
}

export async function validateResetToken(token: string) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_BACKEND_URL}/auth/validate-reset-token?token=${token}`,
  );
  if (!res.ok) {
    throw new Error("Token inválido o expirado");
  }
  return res.json();
}

export async function resetPassword(
  token: string,
  newPassword: string,
  confirmPassword: string,
) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    },
  );

  if (!res.ok) {
    throw new Error("Error al actualizar la contraseña");
  }

  redirect("/login");
}

export async function updateClient({
  userId,
  field,
  value,
}: {
  userId: string;
  field: string;
  value: string;
}) {
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: value }),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar la contraseña");
  }
  return res.json();
}

export async function authMe(accessToken: string):Promise<UserSession | null> {
  // 3) Pedir el usuario usando el token como Bearer
  const meRes = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (!meRes.ok) return null;

  const user:UserSession = await meRes.json();
  return user
}
export async function changePassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}/change-password`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    return {
      ok: false,
      message: error?.message || "No se pudo actualizar la contraseña",
    };
  }

  return { ok: true };
}

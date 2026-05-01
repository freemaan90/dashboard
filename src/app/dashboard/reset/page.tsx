"use server";
import { authMe } from "@/app/actions/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ResetLoginPage } from "@/components/ui/Pages/ResetLoginPage";
import { getServerSession } from "next-auth";

export default async function ResetPasswordPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("No hay sesión activa");
  }

  const user = session.accessToken && (await authMe(session.accessToken));

  if (!user) {
    throw new Error("No se pudo obtener la información del usuario");
  }

  return <ResetLoginPage user={user} accessToken={session.accessToken!} />;
}

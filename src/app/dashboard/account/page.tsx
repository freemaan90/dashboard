"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { AccountPage } from "@/components/ui/Pages/AccountPage";
import { authMe } from "@/app/actions/User";

export default async function Account() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("No hay sesión activa");
  }

  const user = session.accessToken && await authMe(session.accessToken)

  return <AccountPage user={user} />;
}

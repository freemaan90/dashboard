"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getEmployees } from "@/app/actions/User";
import { EmployeeContainer } from "@/components/Account/EmployeeContainer";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  // TODO: reemplazar por fetch real a tu backend
  // const employees = [
  //   { id: 1, name: "Juan Pérez", role: "SUPERVISOR" },
  //   { id: 2, name: "María Gómez", role: "EMPLOYEE" },
  // ];
  if (!session?.user) {
    throw new Error("No hay sesión activa");
  }

  const accessToken = session.accessToken

  const employees = await getEmployees(Number(session.user.id));

  return (
    <div>
      <EmployeeContainer accessToken={accessToken} employees={employees} userSession={session.user} />
    </div>
  );
}

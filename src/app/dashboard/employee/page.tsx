"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { getEmployees } from "@/app/actions/User";
import { EmployeeContainer } from "@/components/Account/EmployeeContainer";
import { Roles } from "@/enum/Roles";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("No hay sesión activa");
  }

  const { user, accessToken } = session;

  // Determinar el ownerId real
  const ownerId =
    user.role === Roles.OWNER ? Number(user.id) : Number(user.ownerId);

  // Obtener empleados del owner
  let employees = await getEmployees(ownerId);

  // Si NO es OWNER, filtrar al usuario actual
  if (user.role !== Roles.OWNER) {
    employees = employees.filter((emp) => emp.id !== Number(user.id));
  }

  return (
    <div>
      <EmployeeContainer
        accessToken={accessToken}
        employees={employees}
        userSession={user}
      />
    </div>
  );
}

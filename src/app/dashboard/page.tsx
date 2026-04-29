import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { authMe } from "../actions/User";

export default async function DashboardPage() {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("No hay sesión activa");
  }

  const user = session.accessToken && (await authMe(session.accessToken));
  
  return (
    <div>
      <h1>Bienvenido {user?.name}</h1>

      <pre style={{ marginTop: 20 }}>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

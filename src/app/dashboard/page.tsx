import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1>Bienvenido {session?.user?.name}</h1>

      <pre style={{ marginTop: 20 }}>
        {JSON.stringify(session?.user, null, 2)}
      </pre>
    </div>
  );
}

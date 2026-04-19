import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession();
  console.log("Session in DashboardPage:", session);
  return (
    <div>
      <h1>Bienvenido {session?.user?.name}</h1>

      <pre style={{ marginTop: 20 }}>
        {JSON.stringify(session?.user, null, 2)}
      </pre>
    </div>
  );
}

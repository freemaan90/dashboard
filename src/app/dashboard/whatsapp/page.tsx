import { getServerSession } from "next-auth";

export default async function WhatsAppPage() {
  const session = await getServerSession();

  return (
    <div>
      <pre style={{ marginTop: 20 }}>
        {JSON.stringify(session?.user, null, 2)}
      </pre>
    </div>
  );
}

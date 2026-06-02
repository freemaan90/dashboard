import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllTemplates } from "@/app/actions/Templates";
import SessionPanel from "@/components/WhatsAppSender/SessionPanel/SessionPanel";
import { getServerSession } from "next-auth";

export default async function WhatsAppPage() {
  const session = await getServerSession(authOptions);

  const templates =
    session?.accessToken && session.user
      ? await getAllTemplates(
          session.user.ownerId ?? session.user.id,
          session.accessToken,
        ).catch(() => [])
      : [];

  return (
    <div>
      <SessionPanel templates={templates} />
    </div>
  );
}

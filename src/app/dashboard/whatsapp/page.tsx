import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SessionPanel from "@/components/WhatsAppSender/SessionPanel/SessionPanel";
import { getServerSession } from "next-auth";

export default async function WhatsAppPage() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <SessionPanel />
    </div>
  );
}

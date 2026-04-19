import SessionPanel from "@/components/WhatsAppSender/SessionPanel/SessionPanel";
import { getServerSession } from "next-auth";

export default async function WhatsAppPage() {
  const session = await getServerSession();
  console.log("Session in WhatsAppPage:", session);
  return (
    <div>
      <SessionPanel />
    </div>
  );
}

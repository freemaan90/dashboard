import SessionPanel from "@/components/WhatsAppSender/SessionPanel/SessionPanel";
import { getServerSession } from "next-auth";

export default async function WhatsAppPage() {
  const session = await getServerSession();

  return (
    <div>
      <SessionPanel />
    </div>
  );
}

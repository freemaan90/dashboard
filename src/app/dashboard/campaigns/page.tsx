import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getCampaigns } from "@/app/actions/Campaigns";
import { CampaignList } from "@/components/Campaign/CampaignList";
import styles from "./CampaignsPage.module.css";

export default async function CampaignsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken || !session.user) {
    throw new Error("No hay sesión activa");
  }

  const effectiveOwnerId = session.user.ownerId ?? session.user.id;
  const campaigns = await getCampaigns(Number(effectiveOwnerId));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Campañas</h1>
        <p className={styles.subtitle}>
          Historial de envíos masivos y sus resultados
        </p>
      </div>

      <CampaignList campaigns={campaigns} />
    </div>
  );
}

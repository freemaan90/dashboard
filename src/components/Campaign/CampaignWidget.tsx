import { Campaign } from "@/interfaces/Campaign.interface";
import { DonutChart } from "./DonutChart";
import styles from "./CampaignWidget.module.css";
import Link from "next/link";

interface Props {
  campaign: Campaign | null;
}

export function CampaignWidget({ campaign }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Última campaña</h2>
        <Link href="/dashboard/campaigns" className={styles.link}>
          Ver historial →
        </Link>
      </div>

      {!campaign ? (
        <p className={styles.empty}>
          Todavía no hay campañas. Iniciá un envío masivo desde WhatsApp o Templates.
        </p>
      ) : (
        <div className={styles.body}>
          {campaign.templateTitle && (
            <p className={styles.templateTitle}>
              Template: <strong>{campaign.templateTitle}</strong>
            </p>
          )}

          <div className={styles.chart}>
            <DonutChart sent={campaign.sent} failed={campaign.failed} size={96} />
            <div className={styles.chartCenter}>
              <span className={styles.pct}>
                {campaign.total > 0 ? Math.round((campaign.sent / campaign.total) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statDot} data-color="success" />
              <span className={styles.statLabel}>Enviados</span>
              <strong className={styles.statValue}>{campaign.sent}</strong>
            </div>
            {campaign.failed > 0 && (
              <div className={styles.stat}>
                <span className={styles.statDot} data-color="error" />
                <span className={styles.statLabel}>Fallidos</span>
                <strong className={styles.statValue}>{campaign.failed}</strong>
              </div>
            )}
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total</span>
              <strong className={styles.statValue}>{campaign.total}</strong>
            </div>
          </div>

          <p className={styles.date}>
            {campaign.finishedAt
              ? new Date(campaign.finishedAt).toLocaleString("es-AR")
              : new Date(campaign.startedAt).toLocaleString("es-AR")}
          </p>
        </div>
      )}
    </div>
  );
}

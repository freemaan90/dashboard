import { Campaign } from "@/interfaces/Campaign.interface";
import { DonutChart } from "./DonutChart";
import styles from "./CampaignList.module.css";

interface Props {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: Props) {
  if (campaigns.length === 0) {
    return (
      <p className={styles.empty}>
        Todavía no hay campañas registradas. Los envíos masivos aparecerán aquí una vez que finalicen.
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {campaigns.map((c) => {
        const successPct = c.total > 0 ? Math.round((c.sent / c.total) * 100) : 0;
        return (
          <li key={c.id} className={styles.item}>
            <div className={styles.donut}>
              <DonutChart sent={c.sent} failed={c.failed} size={64} />
              <span className={styles.donutPct}>{successPct}%</span>
            </div>

            <div className={styles.info}>
              {c.templateTitle && (
                <p className={styles.templateTitle}>{c.templateTitle}</p>
              )}
              <p className={styles.date}>
                {c.finishedAt
                  ? new Date(c.finishedAt).toLocaleString("es-AR")
                  : new Date(c.startedAt).toLocaleString("es-AR")}
              </p>
              <p className={styles.session}>Sesión: {c.sessionId}</p>
            </div>

            <div className={styles.stats}>
              <span className={styles.statSent}>✓ {c.sent} enviados</span>
              {c.failed > 0 && (
                <span className={styles.statFailed}>✗ {c.failed} fallidos</span>
              )}
              <span className={styles.statTotal}>{c.total} total</span>
            </div>

            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{ width: `${successPct}%` }}
                title={`${successPct}% exitosos`}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

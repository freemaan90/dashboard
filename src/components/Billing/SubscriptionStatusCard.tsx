"use client";

import type { BillingStatus, SubscriptionStatus } from "@/interfaces/Billing.interface";
import styles from "./SubscriptionStatusCard.module.css";

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  TRIAL: "Período de prueba",
  ACTIVE: "Activa",
  PAST_DUE: "Pago pendiente",
  CANCELED: "Cancelada",
  EXPIRED: "Vencida",
};

const STATUS_BADGE: Record<SubscriptionStatus, string> = {
  TRIAL: styles.trial,
  ACTIVE: styles.active,
  PAST_DUE: styles.pastDue,
  CANCELED: styles.canceled,
  EXPIRED: styles.expired,
};

interface Props {
  status: BillingStatus | null;
}

export function SubscriptionStatusCard({ status }: Props) {
  const subStatus = status?.status;

  const planName = status?.plan?.name ?? (subStatus === "TRIAL" ? "Sin plan" : "—");

  const renderInfo = () => {
    if (!subStatus) return <p className={styles.info}>No hay suscripción activa.</p>;

    if (subStatus === "TRIAL") {
      const days = status?.daysRemaining ?? 0;
      const pct = Math.min(100, Math.max(0, Math.round((days / 14) * 100)));
      return (
        <div className={styles.trialProgress}>
          <div className={styles.progressLabel}>
            <span>Prueba gratuita</span>
            <span>{days} día{days !== 1 ? "s" : ""} restante{days !== 1 ? "s" : ""}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
        </div>
      );
    }

    if (subStatus === "ACTIVE" && status?.currentPeriodEnd) {
      const date = new Date(status.currentPeriodEnd).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return <p className={styles.info}>Próxima renovación: {date}</p>;
    }

    if (subStatus === "CANCELED" || subStatus === "EXPIRED") {
      return <p className={styles.info}>Tu suscripción no está activa. Seleccioná un plan para continuar.</p>;
    }

    if (subStatus === "PAST_DUE") {
      return <p className={styles.info}>Hay un problema con tu pago. Por favor actualizá tu método de pago.</p>;
    }

    return null;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Suscripción actual</span>
        {subStatus && (
          <span className={`${styles.badge} ${STATUS_BADGE[subStatus]}`}>
            <span className={styles.dot} aria-hidden="true" />
            {STATUS_LABELS[subStatus]}
          </span>
        )}
      </div>

      <h2 className={styles.planName}>{planName}</h2>

      {renderInfo()}
    </div>
  );
}

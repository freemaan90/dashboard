"use client";

import Link from "next/link";
import styles from "./TrialBanner.module.css";

interface Props {
  daysRemaining: number;
}

export function TrialBanner({ daysRemaining }: Props) {
  if (daysRemaining > 3) return null;

  const dayText = daysRemaining === 1 ? "1 día" : `${daysRemaining} días`;

  return (
    <div className={styles.banner} role="alert" aria-live="polite">
      <span>
        Tu período de prueba vence en <strong>{dayText}</strong>.
      </span>
      <Link href="/dashboard/billing" className={styles.link}>
        Suscribite ahora
      </Link>
    </div>
  );
}

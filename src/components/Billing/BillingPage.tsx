"use client";

import { useSearchParams } from "next/navigation";
import type { BillingStatus, Plan, InvoicesResponse } from "@/interfaces/Billing.interface";
import { SubscriptionStatusCard } from "./SubscriptionStatusCard";
import { PlanSelector } from "./PlanSelector";
import { InvoiceTable } from "./InvoiceTable";
import { PaymentMethodCard } from "./PaymentMethodCard";
import styles from "./BillingPage.module.css";

interface Props {
  initialStatus: BillingStatus | null;
  plans: Plan[];
  initialInvoices: InvoicesResponse;
}

const RETURN_MESSAGES: Record<string, { text: string; variant: string }> = {
  success: { text: "✓ Pago procesado correctamente. Tu suscripción se actualizará en unos momentos.", variant: "success" },
  failure: { text: "✗ El pago no pudo completarse. Podés intentarlo nuevamente.", variant: "failure" },
  pending: { text: "⏳ Tu pago está siendo procesado. Te notificaremos cuando se confirme.", variant: "pending" },
};

export function BillingPage({ initialStatus, plans, initialInvoices }: Props) {
  const searchParams = useSearchParams();
  const returnStatus = searchParams.get("status");
  const returnMessage = returnStatus ? RETURN_MESSAGES[returnStatus] : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Facturación</h1>
        <p className={styles.subtitle}>
          Gestioná tu suscripción, planes y métodos de pago.
        </p>
      </div>

      {returnMessage && (
        <div
          className={`${styles.returnBanner} ${styles[returnMessage.variant]}`}
          role="alert"
        >
          {returnMessage.text}
        </div>
      )}

      <SubscriptionStatusCard status={initialStatus} />

      <PlanSelector plans={plans} currentPlanId={initialStatus?.plan?.id ?? null} />

      <div className={styles.grid}>
        <PaymentMethodCard status={initialStatus} />
        <InvoiceTable initialInvoices={initialInvoices} />
      </div>
    </div>
  );
}

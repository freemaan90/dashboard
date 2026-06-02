"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import type { BillingStatus } from "@/interfaces/Billing.interface";
import { updatePaymentMethod } from "@/app/actions/Billing";
import { Button } from "@/components/ui/Button/Button";
import styles from "./PaymentMethodCard.module.css";

interface Props {
  status: BillingStatus | null;
}

export function PaymentMethodCard({ status }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMethod = !!status?.mpPaymentMethodId;
  const lastFour = status?.mpCardLastFour;
  const methodType = status?.mpPaymentMethodId;

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { initPoint } = await updatePaymentMethod();
      window.location.href = initPoint;
    } catch (err: any) {
      setError(err?.message ?? "Error al actualizar método de pago");
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Método de pago</span>

      {hasMethod ? (
        <div className={styles.methodInfo}>
          <div className={styles.cardIcon} aria-hidden="true">
            <CreditCard size={18} />
          </div>
          <div className={styles.cardDetails}>
            <span className={styles.cardNumber}>
              •••• •••• •••• {lastFour ?? "****"}
            </span>
            {methodType && (
              <span className={styles.cardType}>{methodType}</span>
            )}
          </div>
        </div>
      ) : (
        <p className={styles.emptyState}>
          Sin método de pago configurado. Seleccioná un plan para agregar uno.
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {hasMethod && (
        <Button
          variant="outline"
          size="sm"
          loading={loading}
          onClick={handleUpdate}
        >
          Actualizar método de pago
        </Button>
      )}
    </div>
  );
}

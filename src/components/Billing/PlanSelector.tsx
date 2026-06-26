"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { Plan } from "@/interfaces/Billing.interface";
import { subscribeToPlan } from "@/app/actions/Billing";
import { Button } from "@/components/ui/Button/Button";
import styles from "./PlanSelector.module.css";

interface Props {
  plans: Plan[];
  currentPlanId: number | null;
}

export function PlanSelector({ plans, currentPlanId }: Props) {
  const router = useRouter();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (plan: Plan) => {
    setLoadingPlanId(plan.id);
    setError(null);
    try {
      const { initPoint } = await subscribeToPlan(plan.id);
      if (initPoint) {
        window.location.href = initPoint;
      } else {
        router.refresh();
        setLoadingPlanId(null);
      }
    } catch (err: any) {
      setError(err?.message ?? "Error al procesar la suscripción");
      setLoadingPlanId(null);
    }
  };

  const parseFeatures = (features: string | string[]): string[] => {
    if (Array.isArray(features)) return features;
    try {
      return JSON.parse(features);
    } catch {
      return [];
    }
  };

  return (
    <div className={styles.section}>
      <span className={styles.sectionTitle}>Planes disponibles</span>

      {error && (
        <p role="alert" style={{ color: "var(--color-error-text, #9f1239)", fontSize: "var(--font-size-small)" }}>
          {error}
        </p>
      )}

      {plans.length === 0 ? (
        <p className={styles.emptyState}>No hay planes disponibles en este momento.</p>
      ) : (
        <div className={styles.grid}>
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const features = parseFeatures(plan.features);
            const price = Number(plan.priceArs).toLocaleString("es-AR");

            return (
              <div
                key={plan.id}
                className={`${styles.card} ${isCurrent ? styles.current : ""}`}
              >
                <div>
                  <h3 className={styles.cardName}>{plan.name}</h3>
                  {plan.description && (
                    <p className={styles.cardDescription}>{plan.description}</p>
                  )}
                </div>

                <p className={styles.price}>
                  {plan.isFree ? (
                    "Gratis"
                  ) : (
                    <>
                      ${price}
                      <span className={styles.priceSuffix}>/mes</span>
                    </>
                  )}
                </p>

                <ul className={styles.features}>
                  {features.map((f, i) => (
                    <li key={i} className={styles.featureItem}>
                      <Check size={14} className={styles.checkIcon} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <span className={styles.currentBadge}>Plan actual</span>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className={styles.selectBtn}
                    loading={loadingPlanId === plan.id}
                    disabled={loadingPlanId !== null}
                    onClick={() => handleSelect(plan)}
                  >
                    {plan.isFree ? "Empezar gratis" : "Seleccionar"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

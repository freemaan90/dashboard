"use client";

import { useState, useTransition } from "react";
import type { Invoice, InvoiceStatus, InvoicesResponse } from "@/interfaces/Billing.interface";
import { getInvoices } from "@/app/actions/Billing";
import { Button } from "@/components/ui/Button/Button";
import styles from "./InvoiceTable.module.css";

const BADGE_CLASS: Record<InvoiceStatus, string> = {
  PAID: styles.paid,
  PENDING: styles.pending,
  FAILED: styles.failed,
  REFUNDED: styles.refunded,
};

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
};

interface Props {
  initialInvoices: InvoicesResponse;
}

export function InvoiceTable({ initialInvoices }: Props) {
  const [invoices, setInvoices] = useState<InvoicesResponse>(initialInvoices);
  const [isPending, startTransition] = useTransition();

  const handlePage = (newPage: number) => {
    startTransition(async () => {
      const data = await getInvoices(newPage, invoices.limit);
      setInvoices(data);
    });
  };

  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("es-AR", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  const formatAmount = (amount: string) =>
    `$${Number(amount).toLocaleString("es-AR")}`;

  const totalPages = Math.max(1, Math.ceil(invoices.total / invoices.limit));

  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Historial de pagos</span>

      {invoices.data.length === 0 ? (
        <p className={styles.emptyState}>No hay pagos registrados aún.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {invoices.data.map((inv: Invoice) => (
                <tr key={inv.id}>
                  <td>{formatDate(inv.paidAt ?? inv.createdAt)}</td>
                  <td>{inv.description ?? "Suscripción"}</td>
                  <td>{formatAmount(inv.amountArs)}</td>
                  <td>
                    <span className={`${styles.badge} ${BADGE_CLASS[inv.status]}`}>
                      {STATUS_LABEL[inv.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <span className={styles.pageInfo}>
                Página {invoices.page} de {totalPages}
              </span>
              <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={invoices.page <= 1 || isPending}
                  onClick={() => handlePage(invoices.page - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={invoices.page >= totalPages || isPending}
                  onClick={() => handlePage(invoices.page + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Plan {
  id: number;
  name: string;
  description: string;
  priceArs: string; // Decimal comes as string from Prisma cjs JSON
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface BillingStatus {
  status: SubscriptionStatus | null;
  plan: Plan | null;
  trialEndsAt: string | null;
  daysRemaining: number | null;
  currentPeriodEnd: string | null;
  mpPaymentMethodId: string | null;
  mpCardLastFour: string | null;
}

export interface Invoice {
  id: number;
  status: InvoiceStatus;
  amountArs: string; // Decimal as string
  description: string | null;
  paidAt: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  createdAt: string;
}

export interface InvoicesResponse {
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
}

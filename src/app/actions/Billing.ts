'use server';

import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';
import type { BillingStatus, Plan, InvoicesResponse } from '@/interfaces/Billing.interface';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const req = {
    cookies: Object.fromEntries(
      cookieStore.getAll().map((c) => [c.name, c.value])
    ),
    headers: Object.fromEntries(headerStore.entries()),
  };

  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  return (token?.accessToken as string) ?? null;
}

export async function getBillingStatus(): Promise<BillingStatus | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const res = await fetch(`${API_URL}/billing/status`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? json;
  } catch {
    return null;
  }
}

export async function getPlans(): Promise<Plan[]> {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const res = await fetch(`${API_URL}/billing/plans`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? json;
  } catch {
    return [];
  }
}

export async function subscribeToPlan(planId: number): Promise<{ initPoint: string | null }> {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error('Sin sesión activa');

  const res = await fetch(`${API_URL}/billing/subscribe`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ planId }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message ?? err?.data?.message ?? 'Error al suscribirse');
  }

  const json = await res.json();
  return json?.data ?? json;
}

export async function cancelSubscription(): Promise<void> {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error('Sin sesión activa');

  const res = await fetch(`${API_URL}/billing/subscription`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message ?? err?.data?.message ?? 'Error al cancelar');
  }
}

export async function getInvoices(page = 1, limit = 10): Promise<InvoicesResponse> {
  const accessToken = await getAccessToken();
  if (!accessToken) return { data: [], total: 0, page, limit };

  try {
    const res = await fetch(
      `${API_URL}/billing/invoices?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      }
    );
    if (!res.ok) return { data: [], total: 0, page, limit };
    return res.json();
  } catch {
    return { data: [], total: 0, page, limit };
  }
}

export async function updatePaymentMethod(): Promise<{ initPoint: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error('Sin sesión activa');

  const res = await fetch(`${API_URL}/billing/payment-method`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message ?? err?.data?.message ?? 'Error al actualizar método de pago');
  }

  const json = await res.json();
  return json?.data ?? json;
}

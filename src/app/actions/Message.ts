'use server';

import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

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

export type SendMessagePayload =
  | { type: 'simple'; sessionId: string; phone: string; message: string }
  | { type: 'template'; sessionId: string; phone: string; templateName: string; variables?: string };

export interface BulkJobStatus {
  jobId: string;
  status: 'processing' | 'waiting' | 'done';
  total: number;
  done: number;
  failed: { phone: string; error: string }[];
  waitUntil?: string;
}

export async function startBulkSend(
  sessionId: string,
  messages: { phone: string; message: string }[],
): Promise<{ jobId: string }> {
  const token = await getAccessToken();
  const res = await fetch(`${API_URL}/whatsapp-sender/sessions/${sessionId}/bulk-send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'No se pudo iniciar el envío masivo');
  }
  return res.json();
}

export async function getBulkSendStatus(jobId: string): Promise<BulkJobStatus> {
  const token = await getAccessToken();
  const res = await fetch(`${API_URL}/whatsapp-sender/bulk-send/${jobId}`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'No se pudo obtener el estado del envío');
  }
  return res.json();
}

export async function sendWhatsappMessage(payload: SendMessagePayload): Promise<{ success: boolean }> {
  const token = await getAccessToken();

  const { sessionId, phone } = payload;

  const body =
    payload.type === 'simple'
      ? { phone, message: payload.message }
      : { phone, message: payload.templateName, variables: payload.variables };

  const res = await fetch(`${API_URL}/whatsapp-sender/sessions/${sessionId}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'No se pudo enviar el mensaje');
  }

  return { success: true };
}

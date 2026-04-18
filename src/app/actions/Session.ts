'use server';

import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // Construir un objeto request-like que getToken pueda usar
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

export async function createWhatsappSession(sessionId: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('No autorizado');
  }

  const createRes = await fetch(`${API_URL}/whatsapp-sender/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId }),
    cache: 'no-store',
  });

  if (!createRes.ok) {
    const error = await createRes.json().catch(() => ({}));
    throw new Error(error.message || 'No se pudo crear la sesión de WhatsApp');
  }

  const data = await createRes.json();

  return { sessionId, success: true, data };
}

export async function deleteSessionById(sessionId: string) {
  const token = await getAccessToken();

  if (!token) {
    throw new Error('No autorizado');
  }

  const deleteResp = await fetch(`${API_URL}/whatsapp-sender/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!deleteResp.ok) {
    const error = await deleteResp.json().catch(() => ({}));
    throw new Error(error.message || 'No se pudo borrar la sesión de WhatsApp');
  }

  return await deleteResp.json();
}

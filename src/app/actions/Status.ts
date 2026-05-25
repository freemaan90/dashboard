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

export interface SessionStatus {
  sessionId: string;
  isReady: boolean;
  qrBase64: string | null;
  hasBrowser: boolean;
  hasPage: boolean;
  lastRestart: number;
}

export const getSessionStatus = async (sessionId: string): Promise<SessionStatus> => {
  const token = await getAccessToken();

  const res = await fetch(`${API_URL}/whatsapp-sender/sessions/${sessionId}/status`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Session not found: ${res.status}`);

  return res.json();
};

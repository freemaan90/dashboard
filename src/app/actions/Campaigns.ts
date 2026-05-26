'use server';

import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';
import { Campaign } from '@/interfaces/Campaign.interface';

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

export async function getCampaigns(ownerId: number): Promise<Campaign[]> {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  const res = await fetch(`${API_URL}/campaigns?ownerId=${ownerId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) return [];

  const json = await res.json();
  return (json?.data ?? json) as Campaign[];
}

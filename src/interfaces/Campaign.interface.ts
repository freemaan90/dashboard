export interface Campaign {
  id: number;
  sessionId: string;
  templateTitle: string | null;
  total: number;
  sent: number;
  failed: number;
  failedDetails: { phone: string; error: string }[];
  startedAt: string;
  finishedAt: string | null;
}

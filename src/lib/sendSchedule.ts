// Argentina is UTC-3, no DST
const ARG_OFFSET_MS = -3 * 3_600_000;
const START_HOUR = 8;
const END_HOUR = 20;

export const DELAY_BETWEEN_MS = 40_000;

function argMsSinceMidnight(): number {
  const argMs = Date.now() + ARG_OFFSET_MS;
  return argMs % (24 * 3_600_000);
}

export function isInSendWindow(): boolean {
  const ms = argMsSinceMidnight();
  return ms >= START_HOUR * 3_600_000 && ms < END_HOUR * 3_600_000;
}

export function msUntilNextWindow(): number {
  const msSinceMidnight = argMsSinceMidnight();
  const target = START_HOUR * 3_600_000;
  if (target > msSinceMidnight) return target - msSinceMidnight;
  return 24 * 3_600_000 - msSinceMidnight + target;
}

export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

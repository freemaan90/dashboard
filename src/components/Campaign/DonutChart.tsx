interface Props {
  sent: number;
  failed: number;
  size?: number;
}

export function DonutChart({ sent, failed, size = 80 }: Props) {
  const total = sent + failed;
  const r = size * 0.4;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = size * 0.15;
  const circumference = 2 * Math.PI * r;

  const sentPct = total > 0 ? sent / total : 1;
  const sentDash = circumference * sentPct;
  const failedDash = circumference * (total > 0 ? failed / total : 0);

  // Start at top (-90deg = -π/2)
  const sentOffset = 0;
  const failedOffset = -circumference * sentPct;

  if (total === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border-default)" strokeWidth={strokeWidth} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {/* Sent arc (green) */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="var(--color-success, #22c55e)"
        strokeWidth={strokeWidth}
        strokeDasharray={`${sentDash} ${circumference - sentDash}`}
        strokeDashoffset={sentOffset}
        strokeLinecap="butt"
      />
      {/* Failed arc (red) */}
      {failed > 0 && (
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--color-error, #ef4444)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${failedDash} ${circumference - failedDash}`}
          strokeDashoffset={failedOffset}
          strokeLinecap="butt"
        />
      )}
    </svg>
  );
}

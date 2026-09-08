export function ProgressRing({ value, label }: { value: number; label: string }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative size-28 shrink-0" aria-label={`${label}: ${value}%`} role="img">
      <svg viewBox="0 0 112 112" className="-rotate-90" aria-hidden="true">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="var(--line)" strokeWidth="7" />
        <circle cx="56" cy="56" r={radius} fill="none" stroke="var(--signal)" strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><div className="font-display text-2xl font-semibold">{value}%</div><div className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--muted)]">completo</div></div>
      </div>
    </div>
  );
}

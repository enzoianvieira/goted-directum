export function Progress({ label, value }: { label: string; value: number }) {
  const safe = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="progress-item">
      <span>
        {label}
        <strong>{Math.round(safe)}%</strong>
      </span>
      <div>
        <i style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

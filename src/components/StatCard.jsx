export default function StatCard({ icon: Icon, label, value, accent, trend }) {
  return (
    <div className="rounded-none border border-hairline bg-surface-card p-5 transition-colors hover:border-hairline-strong">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-uppercase text-xs font-bold text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{value}</p>
          {trend && <p className="mt-1 text-xs font-medium text-muted">{trend}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-none ${accent}`}>
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}

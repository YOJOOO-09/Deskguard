const STATUS_CONFIG = {
  available: {
    label: 'Available',
    dot: 'bg-success',
    classes: 'bg-success-50 text-green-400 border-success/30',
  },
  occupied: {
    label: 'Occupied',
    dot: 'bg-occupied',
    classes: 'bg-occupied-50 text-red-400 border-occupied/30',
  },
  away: {
    label: 'Away',
    dot: 'bg-away',
    classes: 'bg-away-50 text-yellow-400 border-away/30',
  },
  reserved: {
    label: 'Reserved for you',
    dot: 'bg-primary',
    classes: 'bg-primary-50 text-primary border-primary/30',
  },
};

export default function StatusBadge({ status, className = '' }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;

  return (
    <span
      className={`label-uppercase inline-flex items-center gap-1.5 rounded-none border px-2.5 py-1 text-[11px] font-bold ${config.classes} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };

const STATUS_STYLES = {
  available: 'bg-success/10 border-success/30 text-green-400 hover:bg-success/20 hover:border-success',
  occupied: 'bg-occupied/10 border-occupied/30 text-red-400 hover:bg-occupied/20 hover:border-occupied',
  away: 'bg-away/10 border-away/40 text-yellow-400 hover:bg-away/25 hover:border-away',
  reserved: 'bg-primary-50 border-primary/40 text-primary hover:bg-primary-100 hover:border-primary',
};

const DOT_STYLES = {
  available: 'bg-success',
  occupied: 'bg-occupied',
  away: 'bg-away',
  reserved: 'bg-primary',
};

export default function DeskCell({ desk, onClick, highlighted = false }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(desk)}
      className={`group relative flex aspect-square flex-col items-center justify-center gap-1 rounded-none border-2 text-sm font-semibold transition-all active:scale-95 ${STATUS_STYLES[desk.status] ?? STATUS_STYLES.available} ${
        highlighted ? 'ring-2 ring-primary ring-offset-2 ring-offset-black animate-pulse' : ''
      }`}
      title={`${desk.id} — ${desk.status}`}
    >
      <span className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${DOT_STYLES[desk.status] ?? DOT_STYLES.available}`} />
      <span>{desk.id}</span>
    </button>
  );
}

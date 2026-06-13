import { ListOrdered, LogOut, Users } from 'lucide-react';

export default function QueueBanner({ stats, position, queueLength, onJoin, onLeave, loading }) {
  const isFull = stats.available === 0;

  if (!isFull && position == null) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-none border border-primary/30 bg-primary-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-card text-primary">
          <ListOrdered size={20} />
        </span>
        <div>
          {position != null ? (
            <>
              <p className="text-sm font-semibold text-ink">You're #{position} in the virtual queue</p>
              <p className="mt-0.5 text-xs text-body">
                We'll notify you the instant a desk frees up — no need to keep refreshing.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-ink">The library is fully booked right now</p>
              <p className="mt-0.5 text-xs text-body">
                Join the virtual queue and we'll hold the next available desk for you.
              </p>
            </>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted">
            <Users size={13} /> {queueLength} {queueLength === 1 ? 'person' : 'people'} waiting
          </p>
        </div>
      </div>

      {position != null ? (
        <button
          onClick={onLeave}
          disabled={loading}
          className="label-uppercase flex items-center justify-center gap-2 rounded-none border border-primary/40 bg-transparent px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary-100 disabled:opacity-60"
        >
          <LogOut size={16} />
          Leave Queue
        </button>
      ) : (
        <button
          onClick={onJoin}
          disabled={loading}
          className="label-uppercase flex items-center justify-center gap-2 rounded-none bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
        >
          Join Virtual Queue
        </button>
      )}
    </div>
  );
}

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Search, Users2, X } from 'lucide-react';

export default function GroupBookingPanel({ floors, cluster, onFind, onReserve, onClear, loading, error, reserved }) {
  const [count, setCount] = useState(4);
  const [floorIndex, setFloorIndex] = useState('any');

  return (
    <div className="mt-4 rounded-none border border-hairline bg-surface-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-none bg-primary-50 text-primary">
          <Users2 size={18} />
        </span>
        <div>
          <h3 className="text-sm font-semibold uppercase text-ink">Group Study Booking</h3>
          <p className="text-xs text-muted">Find a cluster of adjacent desks for your project group.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm text-body">
          Desks needed
          <input
            type="number"
            min={1}
            max={12}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-none border border-hairline bg-surface-soft px-3 py-2 text-sm font-semibold text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <select
          value={floorIndex}
          onChange={(e) => setFloorIndex(e.target.value)}
          className="rounded-none border border-hairline bg-surface-soft px-3 py-2 text-sm font-medium text-body focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="any">Any floor</option>
          {floors.map((f, i) => (
            <option key={f} value={i}>{f}</option>
          ))}
        </select>

        <button
          onClick={() => onFind(count, floorIndex === 'any' ? null : Number(floorIndex))}
          disabled={loading}
          className="label-uppercase flex items-center justify-center gap-2 rounded-none bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
        >
          <Search size={16} />
          {loading ? 'Searching…' : 'Find Adjacent Desks'}
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-none bg-occupied-50 px-3 py-2 text-sm font-medium text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {cluster && !reserved && (
        <div className="mt-3 flex flex-col gap-3 rounded-none border border-primary/30 bg-primary-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-ink">
            Found <span className="font-semibold">{cluster.deskIds.length} adjacent desks</span> on{' '}
            <span className="font-semibold">{cluster.floor}</span>: {cluster.deskIds.join(', ')}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onReserve}
              className="label-uppercase flex items-center gap-2 rounded-none bg-primary px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-700"
            >
              Reserve for Group
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-2 rounded-none border border-primary/40 bg-transparent px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary-100"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {reserved && (
        <div className="mt-3 flex items-center gap-2 rounded-none bg-success-50 px-3 py-2 text-sm font-medium text-green-400">
          <CheckCircle2 size={16} />
          Reserved {reserved.deskIds.join(', ')} for your group. Your group members can check in at their desks now.
        </div>
      )}
    </div>
  );
}

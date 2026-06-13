import { Clock, Monitor, Plug, QrCode, User } from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';

function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function DeskDetailsModal({ desk, onClose, onCheckIn, onScan, onClaim, currentStudentId }) {
  if (!desk) return null;
  const isAvailable = desk.status === 'available';
  const isReservedForMe = desk.status === 'reserved' && desk.reservedFor?.studentId === currentStudentId;

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between pr-8">
        <div>
          <p className="label-uppercase text-xs font-bold text-muted">
            {desk.floor} · {desk.section}
          </p>
          <h2 className="mt-1 text-2xl font-bold uppercase text-ink">Desk {desk.id}</h2>
        </div>
        <StatusBadge status={isReservedForMe ? 'reserved' : desk.status} />
      </div>

      {/* Visual preview */}
      <div className="mt-4 flex items-center justify-center rounded-none border border-hairline bg-surface-soft py-8">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-none border-2 text-lg font-bold ${
            desk.status === 'available'
              ? 'border-success/30 bg-success/10 text-green-400'
              : desk.status === 'occupied'
                ? 'border-occupied/30 bg-occupied/10 text-red-400'
                : desk.status === 'reserved'
                  ? 'border-primary/40 bg-primary-50 text-primary'
                  : 'border-away/40 bg-away/20 text-yellow-400'
          }`}
        >
          {desk.id}
        </div>
      </div>

      {/* Amenities */}
      <div className="mt-4 flex flex-wrap gap-2">
        {desk.hasPower && (
          <span className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-body">
            <Plug size={13} /> Power outlet
          </span>
        )}
        {desk.hasMonitor && (
          <span className="flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-body">
            <Monitor size={13} /> External monitor
          </span>
        )}
      </div>

      {/* Reserved-for-you banner */}
      {isReservedForMe && (
        <div className="mt-4 rounded-none border border-primary/20 bg-primary-50 p-4 text-center">
          <p className="text-sm font-semibold text-primary">This desk is being held for you from the queue.</p>
          <p className="mt-1 text-xs text-primary/70">Scan the QR code or check in below before the hold expires.</p>
        </div>
      )}

      {/* Reserved for someone else */}
      {desk.status === 'reserved' && !isReservedForMe && (
        <div className="mt-4 rounded-none border border-dashed border-hairline p-4 text-center">
          <p className="text-sm text-body">This desk is temporarily held for another student from the queue.</p>
        </div>
      )}

      {/* Occupant info */}
      {!isAvailable && desk.status !== 'reserved' && desk.occupant && (
        <div className="mt-4 space-y-3 rounded-none border border-hairline p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
              <User size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{desk.occupant.name}</p>
              <p className="text-xs text-muted">{desk.occupant.studentId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-body">
            <Clock size={16} className="text-muted" />
            <span>
              Checked in at <span className="font-semibold text-body-strong">{formatTime(desk.checkInTime)}</span>
            </span>
          </div>
          {desk.status === 'away' && (
            <div className="rounded-none bg-away-50 px-3 py-2 text-xs font-medium text-yellow-400">
              Marked "Away" — desk may be auto-released if unattended for too long.
            </div>
          )}
        </div>
      )}

      {/* Empty state for available desk */}
      {isAvailable && (
        <div className="mt-4 rounded-none border border-dashed border-hairline p-4 text-center">
          <p className="text-sm text-body">This desk is free. Check in to start your study session.</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onScan}
          className="label-uppercase flex flex-1 items-center justify-center gap-2 rounded-none border border-hairline bg-transparent px-4 py-2.5 text-xs font-bold text-ink transition-colors hover:bg-surface-elevated"
        >
          <QrCode size={18} />
          Scan QR Code
        </button>
        {isReservedForMe ? (
          <button
            onClick={onClaim}
            className="label-uppercase flex flex-1 items-center justify-center gap-2 rounded-none bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-700"
          >
            Claim This Desk
          </button>
        ) : (
          <button
            onClick={onCheckIn}
            disabled={!isAvailable}
            className={`label-uppercase flex flex-1 items-center justify-center gap-2 rounded-none px-4 py-2.5 text-xs font-bold text-white transition-colors ${
              isAvailable ? 'bg-primary hover:bg-primary-700' : 'cursor-not-allowed bg-surface-elevated text-muted'
            }`}
          >
            {isAvailable ? 'Book / Check-In' : 'Currently Unavailable'}
          </button>
        )}
      </div>
    </Modal>
  );
}

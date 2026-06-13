import { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import Modal from './Modal';

export default function DeskReadyModal({ notification, onClaim, onDismiss, claiming }) {
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(notification.reservedUntil));

  useEffect(() => {
    setSecondsLeft(secondsUntil(notification.reservedUntil));
    const timer = setInterval(() => {
      setSecondsLeft(secondsUntil(notification.reservedUntil));
    }, 1000);
    return () => clearInterval(timer);
  }, [notification.reservedUntil]);

  useEffect(() => {
    if (secondsLeft <= 0) onDismiss?.();
  }, [secondsLeft, onDismiss]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = Math.max(0, Math.min(100, (secondsLeft / notification.holdSeconds) * 100));

  return (
    <Modal maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="m-stripe flex h-14 w-14 items-center justify-center rounded-full">
          <Sparkles size={28} className="text-white" />
        </div>

        <h2 className="mt-4 text-xl font-bold uppercase text-ink">Desk {notification.deskId} is ready for you!</h2>
        <p className="mt-2 text-sm text-body">
          {notification.floor} · {notification.section} just opened up. You're first in line — scan the QR code or
          claim it now before it goes to the next person.
        </p>

        <div className="mt-5 w-full">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Time to claim</span>
            <span className="font-mono font-semibold text-occupied">
              {mins}:{String(secs).padStart(2, '0')}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={onClaim}
          disabled={claiming}
          className="label-uppercase mt-6 flex w-full items-center justify-center gap-2 rounded-none bg-primary px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
        >
          <CheckCircle2 size={18} />
          {claiming ? 'Claiming…' : 'Claim This Desk'}
        </button>
        <button
          onClick={onDismiss}
          className="mt-2 text-xs font-medium text-muted transition-colors hover:text-body"
        >
          Pass to next person in queue
        </button>
      </div>
    </Modal>
  );
}

function secondsUntil(iso) {
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 1000));
}

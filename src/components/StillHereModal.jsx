import { useEffect, useState } from 'react';
import { AlarmClock, Check } from 'lucide-react';
import Modal from './Modal';

const AUTO_RELEASE_SECONDS = 60;

export default function StillHereModal({ onConfirm, onTimeout, deskId = 'D08' }) {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_RELEASE_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeout?.();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onTimeout]);

  const progress = (secondsLeft / AUTO_RELEASE_SECONDS) * 100;

  return (
    <Modal maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-away-50">
          <AlarmClock size={28} className="text-yellow-400" />
        </div>

        <h2 className="mt-4 text-xl font-bold uppercase text-ink">Are you still using this desk?</h2>
        <p className="mt-2 text-sm text-body">
          We noticed no activity at desk <span className="font-semibold text-body-strong">{deskId}</span>. Confirm
          you're still here, or it will be released automatically.
        </p>

        {/* Auto-release countdown */}
        <div className="mt-5 w-full">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>Auto-release in</span>
            <span className="font-mono font-semibold text-occupied">
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
            <div
              className="h-full rounded-full bg-occupied transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={onConfirm}
          className="label-uppercase mt-6 flex w-full items-center justify-center gap-2 rounded-none bg-primary px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-primary-700"
        >
          <Check size={18} />
          Yes, I'm Here
        </button>
      </div>
    </Modal>
  );
}

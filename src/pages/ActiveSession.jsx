import { useEffect, useMemo, useState } from 'react';
import { Activity, Armchair, Clock, Coffee, MapPin, Power, Wifi } from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import StillHereModal from '../components/StillHereModal';
import { checkOutDesk, markDeskAway, markDeskBack } from '../lib/api';

const SESSION_SECONDS = 2 * 60 * 60; // 2 hour session

export default function ActiveSession({ onNavigate, desk, onEndSession }) {
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS - 42 * 60); // ~1h18m left for a nice demo
  const [isAway, setIsAway] = useState(false);
  const [showStillHere, setShowStillHere] = useState(false);

  useEffect(() => {
    if (isAway) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isAway]);

  // Demo trigger: show "Still Here" check after 8 seconds of viewing the page
  useEffect(() => {
    if (!desk) return undefined;
    const t = setTimeout(() => setShowStillHere(true), 8000);
    return () => clearTimeout(t);
  }, [desk]);

  const progress = useMemo(() => secondsLeft / SESSION_SECONDS, [secondsLeft]);
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const hours = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  async function toggleAway() {
    if (!desk) {
      setIsAway((v) => !v);
      return;
    }
    try {
      if (isAway) {
        await markDeskBack(desk.id);
      } else {
        await markDeskAway(desk.id);
      }
      setIsAway((v) => !v);
    } catch (err) {
      console.error(err);
    }
  }

  async function endSession() {
    if (desk) {
      try {
        await checkOutDesk(desk.id);
      } catch (err) {
        console.error(err);
      }
    }
    onEndSession?.();
    onNavigate?.('dashboard');
  }

  if (!desk) {
    return (
      <div className="min-h-screen bg-black pb-20 md:pb-0">
        <Navbar onNavigate={onNavigate} active="session" />
        <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary">
            <Armchair />
          </div>
          <h1 className="mt-4 text-xl font-bold uppercase text-ink">No active session</h1>
          <p className="mt-2 text-sm text-body">
            Head to the Library Map and check in to a desk to start a session here.
          </p>
          <button
            onClick={() => onNavigate?.('dashboard')}
            className="label-uppercase mt-6 rounded-none bg-primary px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-700"
          >
            Go to Library Map
          </button>
        </main>
        <BottomNav active="session" onNavigate={onNavigate} onScan={() => onNavigate?.('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-0">
      <Navbar onNavigate={onNavigate} active="session" />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight text-ink">My Session</h1>
            <p className="mt-1 text-sm text-body">Keep this open to maintain your seat reservation.</p>
          </div>
          <span
            className={`label-uppercase inline-flex items-center gap-1.5 rounded-none border px-3 py-1.5 text-[11px] font-bold ${
              isAway ? 'border-away/30 bg-away-50 text-yellow-400' : 'border-success/30 bg-success-50 text-green-400'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isAway ? 'bg-away' : 'bg-success'}`} />
            {isAway ? 'Away' : 'Active'}
          </span>
        </div>

        {/* Desk info card */}
        <div className="rounded-none border border-hairline bg-surface-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-none bg-primary-50 text-xl font-bold text-primary">
                {desk.id}
              </div>
              <div>
                <p className="text-base font-semibold text-ink">Desk {desk.id}</p>
                <p className="flex items-center gap-1 text-sm text-body">
                  <MapPin size={14} /> {desk.floor} · {desk.section}
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-xs font-medium text-body">
              <span className="flex items-center gap-1 rounded-full bg-surface-elevated px-3 py-1.5"><Power size={13} /> Power</span>
              <span className="flex items-center gap-1 rounded-full bg-surface-elevated px-3 py-1.5"><Wifi size={13} /> Wi-Fi</span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="mt-6 flex flex-col items-center rounded-none border border-hairline bg-surface-card p-8">
          <div className="relative flex h-64 w-64 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r={radius} fill="none" stroke="#262626" strokeWidth="14" />
              <circle
                cx="120"
                cy="120"
                r={radius}
                fill="none"
                stroke={isAway ? '#f4b400' : '#1c69d4'}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="label-uppercase text-xs font-bold text-muted">Time remaining</span>
              <span className="mt-1 font-mono text-5xl font-bold tracking-tight text-ink">
                {String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
              <span className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <Clock size={14} /> Session ends at {sessionEndLabel(secondsLeft)}
              </span>
            </div>
          </div>

          {/* Activity status */}
          <div className="mt-6 flex w-full items-center gap-3 rounded-none bg-surface-soft px-4 py-3">
            <Activity size={18} className={isAway ? 'text-yellow-400' : 'text-green-400'} />
            <p className="text-sm text-body">
              {isAway
                ? 'You are marked away. Your seat may be released if you don’t return soon.'
                : 'Activity detected — your seat is securely held.'}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={toggleAway}
              className="label-uppercase flex flex-1 items-center justify-center gap-2 rounded-none border border-hairline bg-transparent px-4 py-3 text-xs font-bold text-ink transition-colors hover:bg-surface-elevated"
            >
              <Coffee size={18} />
              {isAway ? 'I’m Back' : 'Away for 20 Minutes'}
            </button>
            <button
              onClick={endSession}
              className="label-uppercase flex flex-1 items-center justify-center gap-2 rounded-none bg-occupied px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-red-600"
            >
              End Session
            </button>
          </div>
        </div>
      </main>

      <BottomNav active="session" onNavigate={onNavigate} onScan={() => onNavigate?.('dashboard')} />

      {showStillHere && (
        <StillHereModal
          deskId={desk.id}
          onConfirm={() => setShowStillHere(false)}
          onTimeout={async () => {
            setShowStillHere(false);
            await endSession();
          }}
        />
      )}
    </div>
  );
}

function sessionEndLabel(secondsLeft) {
  const end = new Date(Date.now() + secondsLeft * 1000);
  return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

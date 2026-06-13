import { AlarmClock, Bell, CheckCheck, Clock3, DoorOpen } from 'lucide-react';
import { NOTIFICATIONS } from '../data/mockData';

const ICONS = {
  released: { icon: DoorOpen, classes: 'bg-success-50 text-green-400' },
  warning: { icon: AlarmClock, classes: 'bg-occupied-50 text-red-400' },
  reminder: { icon: Clock3, classes: 'bg-away-50 text-yellow-400' },
};

export default function NotificationPanel({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} aria-hidden="true" />
      <div className="absolute right-0 z-40 mt-2 w-[22rem] max-w-[90vw] overflow-hidden rounded-none border border-hairline bg-surface-card shadow-lg">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-muted" />
            <h3 className="text-sm font-semibold uppercase text-ink">Notifications</h3>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <CheckCheck size={14} /> Mark all read
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {NOTIFICATIONS.map((n) => {
            const config = ICONS[n.type] ?? ICONS.reminder;
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                className={`flex gap-3 border-b border-hairline px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-elevated ${
                  n.unread ? 'bg-primary-50/40' : ''
                }`}
              >
                <span className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-none ${config.classes}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{n.title}</p>
                    {n.unread && <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-body">{n.message}</p>
                  <p className="mt-1 text-[11px] font-medium text-muted">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-hairline px-4 py-2.5 text-center">
          <button className="text-xs font-semibold text-primary hover:underline">View all notifications</button>
        </div>
      </div>
    </>
  );
}

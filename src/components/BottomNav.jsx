import { LayoutGrid, QrCode, Timer, User } from 'lucide-react';

export default function BottomNav({ active, onNavigate, onScan }) {
  const items = [
    { id: 'dashboard', label: 'Map', icon: LayoutGrid },
    { id: 'session', label: 'Session', icon: Timer },
    { id: 'scan', label: 'Scan', icon: QrCode, isScan: true },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-hairline bg-black/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        if (item.isScan) {
          return (
            <button
              key={item.id}
              onClick={onScan}
              className="-mt-6 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform active:scale-95"
              aria-label="Scan QR"
            >
              <Icon size={22} />
            </button>
          );
        }
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-none px-3 py-1.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-primary' : 'text-muted'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

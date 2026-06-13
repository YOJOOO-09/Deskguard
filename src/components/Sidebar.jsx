import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  Users,
} from 'lucide-react';
import Logo from './Logo';
import { CURRENT_USER } from '../data/mockData';

export default function Sidebar({ active, onSelect, onNavigate }) {
  const items = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'desks', label: 'Occupied Desks', icon: Users },
    { id: 'abandoned', label: 'Abandoned Desks', icon: ShieldAlert },
    { id: 'logs', label: 'Activity Logs', icon: ClipboardList },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-hairline bg-black lg:flex">
      <div className="flex h-16 items-center border-b border-hairline px-6">
        <Logo />
      </div>
      <div className="m-stripe h-1 w-full" />

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="label-uppercase px-3 pb-2 pt-1 text-xs font-bold text-muted">
          Admin Console
        </p>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect?.(item.id)}
              className={`flex w-full items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary'
                  : 'text-body hover:bg-surface-card hover:text-ink'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-hairline p-4">
        <div className="mb-2 flex items-center gap-3 rounded-none px-3 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            MR
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">Ms. Rao</p>
            <p className="truncate text-xs text-muted">Head Librarian</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate?.('login')}
          className="flex w-full items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-surface-card hover:text-occupied"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

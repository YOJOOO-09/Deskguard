import { useState } from 'react';
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import Logo from './Logo';
import NotificationPanel from './NotificationPanel';
import { CURRENT_USER, NOTIFICATIONS } from '../data/mockData';

export default function Navbar({ onNavigate, active = 'dashboard' }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  const links = [
    { id: 'dashboard', label: 'Library Map' },
    { id: 'session', label: 'My Session' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-black/80 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate?.(link.id)}
                className={`label-uppercase rounded-none px-3 py-2 text-xs font-bold transition-colors ${
                  active === link.id
                    ? 'text-ink border-b-2 border-primary'
                    : 'text-body hover:text-ink'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-none text-body transition-colors hover:bg-surface-card hover:text-ink"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-occupied text-[10px] font-bold text-white ring-2 ring-black">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 rounded-none py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-surface-card"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {CURRENT_USER.avatar}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-ink">
                  {CURRENT_USER.name}
                </span>
                <span className="block text-xs leading-tight text-muted">{CURRENT_USER.studentId}</span>
              </span>
              <ChevronDown size={16} className="hidden text-muted sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-none border border-hairline bg-surface-card py-2 shadow-lg">
                <div className="border-b border-hairline px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{CURRENT_USER.name}</p>
                  <p className="text-xs text-muted">{CURRENT_USER.email}</p>
                </div>
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-body transition-colors hover:bg-surface-elevated hover:text-ink">
                  <User size={16} /> My Profile
                </button>
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-body transition-colors hover:bg-surface-elevated hover:text-ink">
                  <Settings size={16} /> Settings
                </button>
                <button
                  onClick={() => onNavigate?.('login')}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-occupied transition-colors hover:bg-surface-elevated"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  Bell,
  Menu,
  RotateCcw,
  Search,
  ShieldAlert,
  Users,
  Armchair,
  LayoutGrid,
  UserX,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import NotificationPanel from '../components/NotificationPanel';
import { ACTIVITY_LOG, DESKS, SECTION_USAGE, USAGE_TREND, getDeskStats } from '../data/mockData';

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function minutesAgo(iso) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

export default function AdminDashboard({ onNavigate }) {
  const [section, setSection] = useState('overview');
  const [notifOpen, setNotifOpen] = useState(false);
  const [resetDesks, setResetDesks] = useState(new Set());

  const stats = getDeskStats(DESKS);
  const occupied = useMemo(() => DESKS.filter((d) => d.status === 'occupied'), []);
  const away = useMemo(() => DESKS.filter((d) => d.status === 'away' && !resetDesks.has(d.id)), [resetDesks]);

  const handleReset = (id) => {
    setResetDesks((prev) => new Set(prev).add(id));
  };

  const titles = {
    overview: 'Overview',
    desks: 'Occupied Desks',
    abandoned: 'Abandoned Desks',
    logs: 'Activity Logs',
    analytics: 'Analytics',
    settings: 'Settings',
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar active={section} onSelect={setSection} onNavigate={onNavigate} />

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-hairline bg-black/80 px-4 glass sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-none p-2 text-body hover:bg-surface-card lg:hidden">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold uppercase tracking-tight text-ink">{titles[section]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search desks, students..."
                className="w-64 rounded-none border border-hairline bg-surface-card py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative flex h-10 w-10 items-center justify-center rounded-none text-body transition-colors hover:bg-surface-card"
              >
                <Bell size={20} />
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-occupied text-[10px] font-bold text-white ring-2 ring-black">
                  3
                </span>
              </button>
              {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {section === 'overview' && (
            <OverviewSection stats={stats} away={away} onGoTo={setSection} />
          )}
          {section === 'desks' && <OccupiedDesksSection desks={occupied} />}
          {section === 'abandoned' && <AbandonedDesksSection desks={away} onReset={handleReset} />}
          {section === 'logs' && <ActivityLogsSection />}
          {section === 'analytics' && <AnalyticsSection />}
          {section === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

function OverviewSection({ stats, away, onGoTo }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={LayoutGrid} label="Total Desks" value={stats.total} accent="bg-primary-50 text-primary" trend="Across 3 floors" />
        <StatCard icon={Armchair} label="Available" value={stats.available} accent="bg-success-50 text-green-400" trend="Live count" />
        <StatCard icon={Users} label="Occupied" value={stats.occupied} accent="bg-occupied-50 text-red-400" trend="Live count" />
        <StatCard icon={UserX} label="Away / Idle" value={stats.away} accent="bg-away-50 text-yellow-400" trend="Auto-release pending" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-none border border-hairline bg-surface-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase text-ink">Today's Occupancy Trend</h3>
            <span className="text-xs font-medium text-muted">Last 10 hours</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={USAGE_TREND}>
              <defs>
                <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1c69d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1c69d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#7e7e7e' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#7e7e7e' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 0, borderColor: '#3c3c3c', backgroundColor: '#1a1a1a', color: '#ffffff', fontSize: 12 }} />
              <Area type="monotone" dataKey="occupied" stroke="#1c69d4" strokeWidth={2} fill="url(#occ)" name="Occupied desks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-none border border-hairline bg-surface-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase text-ink">Abandoned Desks</h3>
            <ShieldAlert size={16} className="text-yellow-400" />
          </div>
          {away.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-50">
                <Armchair size={22} className="text-green-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-body">No abandoned desks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {away.slice(0, 4).map((desk) => (
                <div key={desk.id} className="flex items-center justify-between rounded-none bg-away-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">Desk {desk.id}</p>
                    <p className="text-xs text-body">{minutesAgo(desk.awaySince)} min idle</p>
                  </div>
                  <StatusBadge status="away" />
                </div>
              ))}
              <button
                onClick={() => onGoTo('abandoned')}
                className="label-uppercase w-full rounded-none border border-hairline py-2 text-xs font-bold text-primary hover:bg-primary-50"
              >
                View all ({away.length})
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-none border border-hairline bg-surface-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase text-ink">Recent Activity</h3>
          <button onClick={() => onGoTo('logs')} className="text-xs font-semibold text-primary hover:underline">
            View all logs
          </button>
        </div>
        <div className="space-y-2">
          {ACTIVITY_LOG.slice(0, 4).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between border-b border-hairline py-2 text-sm last:border-0">
              <div>
                <span className="font-medium text-ink">{entry.user}</span>
                <span className="text-muted"> — {entry.action} </span>
                <span className="font-semibold text-body-strong">{entry.desk}</span>
              </div>
              <span className="text-xs text-muted">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OccupiedDesksSection({ desks }) {
  if (desks.length === 0) {
    return <EmptyState icon={Users} title="No occupied desks" subtitle="All desks are currently free." />;
  }
  return (
    <div className="overflow-hidden rounded-none border border-hairline bg-surface-card">
      <table className="w-full text-sm">
        <thead className="label-uppercase border-b border-hairline bg-surface-soft text-left text-xs font-bold text-muted">
          <tr>
            <th className="px-5 py-3">Desk</th>
            <th className="px-5 py-3">Location</th>
            <th className="px-5 py-3">Student</th>
            <th className="px-5 py-3">Check-In</th>
            <th className="px-5 py-3">Duration</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {desks.map((desk) => (
            <tr key={desk.id} className="transition-colors hover:bg-surface-elevated">
              <td className="px-5 py-3 font-semibold text-ink">{desk.id}</td>
              <td className="px-5 py-3 text-body">{desk.floor} · {desk.section}</td>
              <td className="px-5 py-3">
                <p className="font-medium text-ink">{desk.occupant.name}</p>
                <p className="text-xs text-muted">{desk.occupant.studentId}</p>
              </td>
              <td className="px-5 py-3 text-body">{formatTime(desk.checkInTime)}</td>
              <td className="px-5 py-3 text-body">{minutesAgo(desk.checkInTime)} min</td>
              <td className="px-5 py-3"><StatusBadge status="occupied" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AbandonedDesksSection({ desks, onReset }) {
  if (desks.length === 0) {
    return <EmptyState icon={ShieldAlert} title="No abandoned desks" subtitle="Everything looks great — no idle seats right now." good />;
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-none border border-away/30 bg-away-50 p-4 text-sm text-yellow-400">
        <AlertTriangle size={18} />
        {desks.length} desk{desks.length > 1 ? 's' : ''} marked "away" and may be hoarding space. Review and reset if needed.
      </div>
      {desks.map((desk) => (
        <div key={desk.id} className="flex items-center justify-between rounded-none border border-hairline bg-surface-card p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-none bg-away-50 text-base font-bold text-yellow-400">
              {desk.id}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{desk.occupant?.name ?? 'Unknown student'}</p>
              <p className="text-xs text-body">{desk.floor} · {desk.section} · idle for {minutesAgo(desk.awaySince)} min</p>
            </div>
          </div>
          <button
            onClick={() => onReset(desk.id)}
            className="label-uppercase flex items-center gap-2 rounded-none bg-occupied px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-600"
          >
            <RotateCcw size={16} />
            Manual Reset
          </button>
        </div>
      ))}
    </div>
  );
}

function ActivityLogsSection() {
  return (
    <div className="overflow-hidden rounded-none border border-hairline bg-surface-card">
      <table className="w-full text-sm">
        <thead className="label-uppercase border-b border-hairline bg-surface-soft text-left text-xs font-bold text-muted">
          <tr>
            <th className="px-5 py-3">User</th>
            <th className="px-5 py-3">Action</th>
            <th className="px-5 py-3">Desk</th>
            <th className="px-5 py-3">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {ACTIVITY_LOG.map((entry) => (
            <tr key={entry.id} className="transition-colors hover:bg-surface-elevated">
              <td className="px-5 py-3 font-medium text-ink">{entry.user}</td>
              <td className="px-5 py-3 text-body">{entry.action}</td>
              <td className="px-5 py-3 font-semibold text-body-strong">{entry.desk}</td>
              <td className="px-5 py-3 text-muted">{entry.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AnalyticsSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-none border border-hairline bg-surface-card p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase text-ink">Occupied vs Available Throughout the Day</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={USAGE_TREND}>
            <defs>
              <linearGradient id="occ2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e22718" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#e22718" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="avail2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0fa336" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0fa336" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#7e7e7e' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#7e7e7e' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 0, borderColor: '#3c3c3c', backgroundColor: '#1a1a1a', color: '#ffffff', fontSize: 12 }} />
            <Area type="monotone" dataKey="occupied" stroke="#e22718" strokeWidth={2} fill="url(#occ2)" name="Occupied" />
            <Area type="monotone" dataKey="available" stroke="#0fa336" strokeWidth={2} fill="url(#avail2)" name="Available" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-none border border-hairline bg-surface-card p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase text-ink">Utilization by Section (%)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={SECTION_USAGE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="section" tick={{ fontSize: 11, fill: '#7e7e7e' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#7e7e7e' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 0, borderColor: '#3c3c3c', backgroundColor: '#1a1a1a', color: '#ffffff', fontSize: 12 }} />
            <Bar dataKey="usage" fill="#1c69d4" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-none border border-hairline bg-surface-card p-5 lg:col-span-2">
        <h3 className="mb-2 text-sm font-semibold uppercase text-ink">Key Insights</h3>
        <ul className="grid gap-3 text-sm text-body sm:grid-cols-3">
          <li className="rounded-none bg-surface-soft p-3">Peak usage occurs around <strong className="text-ink">11AM–12PM</strong>.</li>
          <li className="rounded-none bg-surface-soft p-3"><strong className="text-ink">Computer Lab</strong> has the highest utilization at 85%.</li>
          <li className="rounded-none bg-surface-soft p-3">Average abandoned-desk reset time: <strong className="text-ink">4.2 minutes</strong>.</li>
        </ul>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="max-w-2xl rounded-none border border-hairline bg-surface-card p-6">
      <h3 className="text-sm font-semibold uppercase text-ink">Anti-Hoarding Settings</h3>
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between rounded-none bg-surface-soft px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Away grace period</p>
            <p className="text-xs text-body">Time before a desk marked "away" prompts a check.</p>
          </div>
          <span className="rounded-none bg-surface-elevated px-3 py-1 text-sm font-semibold text-primary">20 min</span>
        </div>
        <div className="flex items-center justify-between rounded-none bg-surface-soft px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Auto-release timeout</p>
            <p className="text-xs text-body">Time after "Still Here?" prompt before releasing the seat.</p>
          </div>
          <span className="rounded-none bg-surface-elevated px-3 py-1 text-sm font-semibold text-primary">60 sec</span>
        </div>
        <div className="flex items-center justify-between rounded-none bg-surface-soft px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Max session length</p>
            <p className="text-xs text-body">Maximum continuous booking duration per student.</p>
          </div>
          <span className="rounded-none bg-surface-elevated px-3 py-1 text-sm font-semibold text-primary">2 hours</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle, good }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-hairline bg-surface-card py-16 text-center">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${good ? 'bg-success-50' : 'bg-surface-elevated'}`}>
        <Icon size={22} className={good ? 'text-green-400' : 'text-muted'} />
      </div>
      <p className="mt-3 text-sm font-semibold text-body-strong">{title}</p>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
    </div>
  );
}

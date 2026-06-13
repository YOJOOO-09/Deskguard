import { useState } from 'react';
import { ArrowRight, BookOpen, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login({ onLogin, onAdminLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin?.();
  };

  return (
    <div className="flex min-h-screen w-full bg-black">
      {/* Left: form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Logo size="lg" />

          <h1 className="mt-10 text-3xl font-bold uppercase tracking-tight text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-body">
            Sign in to find a free desk, check in, and keep the library fair for everyone.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-body-strong">
                Student Email
              </label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full rounded-none border border-hairline bg-surface-card py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-body-strong">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-none border border-hairline bg-surface-card py-2.5 pl-11 pr-12 text-sm text-ink placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted hover:text-body"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-body">
              <input type="checkbox" className="h-4 w-4 rounded-none border-hairline bg-surface-card text-primary focus:ring-primary/30" />
              Remember me on this device
            </label>

            <button
              type="submit"
              className="label-uppercase flex w-full items-center justify-center gap-2 rounded-none bg-primary px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-primary-700"
            >
              Sign In
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-body">
            Need an account?{' '}
            <a href="#" className="font-semibold text-primary hover:underline">
              Contact your library admin
            </a>
          </p>

          <button
            type="button"
            onClick={onAdminLogin}
            className="mx-auto mt-4 block text-center text-xs font-medium text-muted hover:text-primary hover:underline"
          >
            Sign in as Librarian / Admin instead
          </button>
        </div>
      </div>

      {/* Right: illustration */}
      <div className="relative hidden w-1/2 overflow-hidden bg-black lg:flex">
        <div className="m-stripe absolute inset-x-0 top-0 h-1" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 text-center text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-none border border-hairline bg-surface-card">
            <BookOpen size={40} />
          </div>
          <h2 className="mt-8 text-3xl font-bold uppercase leading-tight">
            Find your seat.<br />Stay focused.<br />Share fairly.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-body">
            DeskGuard keeps the university library running smoothly with real-time seat availability and
            anti-hoarding checks — so there's always a desk when you need one.
          </p>

          {/* Mock map preview card */}
          <div className="mt-10 w-full max-w-xs rounded-none border border-hairline bg-surface-card p-4 text-left shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="label-uppercase text-xs font-bold text-muted">Live Library Map</p>
              <span className="flex items-center gap-1 text-xs font-semibold text-green-400">
                <Sparkles size={12} /> Live
              </span>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-1.5">
              {Array.from({ length: 24 }).map((_, i) => {
                const r = (i * 13) % 7;
                const status = r < 3 ? 'bg-success/70' : r < 5 ? 'bg-occupied/70' : 'bg-away/70';
                return <div key={i} className={`aspect-square rounded-none ${status}`} />;
              })}
            </div>
            <div className="mt-3 flex items-center gap-4 text-[11px] text-body">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Available</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-occupied" /> Occupied</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-away" /> Away</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs font-medium text-body">
            <ShieldCheck size={16} />
            Trusted by 12,000+ students across campus
          </div>
        </div>
      </div>
    </div>
  );
}

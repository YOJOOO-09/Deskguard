import { ShieldCheck } from 'lucide-react';

export default function Logo({ size = 'md', withText = true }) {
  const sizes = {
    sm: { icon: 18, text: 'text-base' },
    md: { icon: 22, text: 'text-xl' },
    lg: { icon: 28, text: 'text-2xl' },
  };
  const s = sizes[size] ?? sizes.md;

  return (
    <div className="flex items-center gap-2">
      <span className="m-stripe flex items-center justify-center rounded-none p-2 text-white">
        <ShieldCheck size={s.icon} strokeWidth={2.4} />
      </span>
      {withText && (
        <span className={`font-bold uppercase tracking-wide text-ink ${s.text}`}>
          Desk<span className="text-primary">Guard</span>
        </span>
      )}
    </div>
  );
}

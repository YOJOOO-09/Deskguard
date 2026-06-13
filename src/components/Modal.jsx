import { X } from 'lucide-react';

export default function Modal({ children, onClose, maxWidth = 'max-w-md' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className={`relative w-full ${maxWidth} animate-[fadeIn_0.15s_ease-out] rounded-none border border-hairline bg-surface-card p-6 shadow-2xl`}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-elevated hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

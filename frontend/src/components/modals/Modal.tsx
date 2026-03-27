import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ open, onClose, title, subtitle, children, footer }: ModalProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[500] flex items-center justify-center transition-opacity duration-[250ms] ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`bg-popover border border-[hsl(var(--border-bright))] rounded-[20px] w-[480px] max-w-[calc(100vw-32px)] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${open ? 'translate-y-0 scale-100' : 'translate-y-5 scale-[0.97]'}`}>
        <div className="p-6 pb-0 flex items-start justify-between">
          <div>
            <div className="text-lg font-bold">{title}</div>
            {subtitle && <div className="text-[13px] text-muted-foreground mt-1">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-surface border border-border text-muted-foreground cursor-pointer flex items-center justify-center text-base transition-all duration-200 hover:text-primary hover:border-primary">✕</button>
        </div>
        <div className="p-6 pt-5">{children}</div>
        {footer && <div className="px-6 pb-6 flex gap-2.5 justify-end">{footer}</div>}
      </div>
    </div>
  );
}

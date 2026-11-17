import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CircleAlert, CircleCheckBig, Info, X } from 'lucide-react';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastMessage {
  /** Muda a cada novo toast — reinicia o timer mesmo com a mesma mensagem. */
  id: number;
  message: string;
  tone: ToastTone;
}

interface SyncToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
  /** Tempo de exibição em ms. */
  duration?: number;
}

const TONE_STYLE: Record<ToastTone, { icon: typeof Info; iconClass: string; borderClass: string }> = {
  success: { icon: CircleCheckBig, iconClass: 'text-success', borderClass: 'border-success/40' },
  error: { icon: CircleAlert, iconClass: 'text-danger', borderClass: 'border-danger/40' },
  info: { icon: Info, iconClass: 'text-accent', borderClass: 'border-accent-from/40' },
};

/** Notificação de sincronização com entrada/saída animada e fechamento automático. */
export const SyncToast: React.FC<SyncToastProps> = ({ toast, onDismiss, duration = 3500 }) => {
  // O timer é amarrado ao id: um toast novo cancela o timer do anterior.
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [toast?.id, duration, onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex justify-end pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className={`pointer-events-auto w-full sm:w-auto sm:max-w-sm rounded-card border ${TONE_STYLE[toast.tone].borderClass} bg-surface shadow-card p-3.5 text-xs text-primary flex items-start gap-2.5`}
          >
            {React.createElement(TONE_STYLE[toast.tone].icon, {
              className: `w-4 h-4 shrink-0 mt-px ${TONE_STYLE[toast.tone].iconClass}`,
              'aria-hidden': true,
            })}
            <span className="flex-1 leading-relaxed">{toast.message}</span>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Fechar notificação"
              className="p-0.5 -m-0.5 rounded text-muted hover:text-primary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

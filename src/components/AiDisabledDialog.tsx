import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AI_OFF_MESSAGES, onAiDisabledRequest } from '../config/ai';
import type { AiOffMessage } from '../types/aiSource';

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-from';

/**
 * Aviso de "IA desligada" (src/config/ai.ts). Fica no App e abre quando algum recurso de IA é
 * clicado (showAiDisabled()). A mensagem fica mais debochada a cada insistência na sessão.
 */
export const AiDisabledDialog: React.FC = () => {
  const [message, setMessage] = useState<AiOffMessage | null>(null);
  const attempts = useRef(0);
  const lastRandom = useRef(-1);
  const okButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () =>
      onAiDisabledRequest(() => {
        attempts.current += 1;
        if (attempts.current === 1) {
          setMessage(AI_OFF_MESSAGES.first);
        } else if (attempts.current === 2) {
          setMessage(AI_OFF_MESSAGES.second);
        } else {
          // Sorteia sem repetir a anterior.
          const pool = AI_OFF_MESSAGES.more;
          let index = Math.floor(Math.random() * pool.length);
          if (index === lastRandom.current) index = (index + 1) % pool.length;
          lastRandom.current = index;
          setMessage(pool[index]);
        }
      }),
    []
  );

  useEffect(() => {
    if (!message) return;
    const previous = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => okButtonRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMessage(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [message]);

  const close = () => setMessage(null);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="ia-desligada"
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            aria-label="Fechar aviso"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 bg-canvas/75 backdrop-blur-[2px] cursor-pointer"
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ia-desligada-titulo"
            aria-describedby="ia-desligada-texto"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="relative w-full max-w-md rounded-card border border-subtle bg-surface shadow-card p-5 space-y-4"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-warning/40 bg-warning/10 text-[11px] font-semibold text-warning">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" aria-hidden="true" />
                IA desligada
              </span>
              <h2 id="ia-desligada-titulo" className="text-lg font-extrabold text-primary">
                {message.title}
              </h2>
              <p id="ia-desligada-texto" className="text-sm text-muted leading-relaxed">
                {message.body}
              </p>
            </div>
            <div className="rounded-lg border border-subtle bg-canvas px-3 py-2.5 text-xs text-muted leading-relaxed">
              <strong className="text-primary">O que funciona sem IA:</strong> as <strong className="text-primary">Dicas</strong> do
              exercício, o <strong className="text-primary">Guia rápido</strong> (<kbd className="px-1 rounded border border-subtle font-mono text-[10px] whitespace-nowrap">Ctrl /</kbd>)
              e a <strong className="text-primary">Solução</strong> comentada.
            </div>
            <div className="flex justify-end">
              <button
                ref={okButtonRef}
                type="button"
                onClick={close}
                className={`px-4 py-2 rounded-control bg-gradient-accent text-white text-sm font-semibold shadow-glow hover:brightness-110 transition-[filter] cursor-pointer ${FOCUS_RING}`}
              >
                Beleza, vou no braço 💪
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

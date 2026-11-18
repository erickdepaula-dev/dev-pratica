import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { getCareerProgress } from '../services/xp';

interface XpBarProps {
  xp: number;
  /** Versão reduzida (só nível e barra) para espaços apertados. */
  compact?: boolean;
}

/**
 * Barra de XP do Header (Fase 3). Quando o XP sobe, o número conta até o novo valor,
 * a barra preenche e um "+N XP" flutua — tudo respeitando prefers-reduced-motion.
 */
export const XpBar: React.FC<XpBarProps> = ({ xp, compact = false }) => {
  const career = getCareerProgress(xp);
  const reduceMotion = useReducedMotion();
  const [displayXp, setDisplayXp] = useState(xp);
  const [gain, setGain] = useState<{ id: number; amount: number } | null>(null);
  const previous = useRef(xp);

  useEffect(() => {
    const from = previous.current;
    previous.current = xp;
    if (xp <= from) {
      setDisplayXp(xp);
      return;
    }
    setGain({ id: Date.now(), amount: xp - from });
    const hideGain = window.setTimeout(() => setGain(null), 1800);
    if (reduceMotion) {
      setDisplayXp(xp);
      return () => window.clearTimeout(hideGain);
    }
    const controls = animate(from, xp, { duration: 0.9, ease: 'easeOut', onUpdate: v => setDisplayXp(Math.round(v)) });
    return () => {
      controls.stop();
      window.clearTimeout(hideGain);
    };
  }, [xp, reduceMotion]);

  const label = career.nextLevel
    ? `${career.level.name}: ${xp} XP — faltam ${career.nextLevel.minXp - xp} XP para ${career.nextLevel.name}`
    : `${career.level.name}: ${xp} XP — nível máximo`;

  return (
    <div className="relative flex items-center gap-2" title={label}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-gradient-accent whitespace-nowrap">
        {career.level.name}
      </span>
      <div
        className="w-14 h-1.5 rounded-full bg-subtle overflow-hidden"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={career.percent}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-accent origin-left"
          initial={false}
          animate={{ scaleX: career.percent / 100 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
      {!compact && (
        <span className="sr-only">{displayXp} XP</span>
      )}

      <AnimatePresence>
        {gain && (
          <motion.span
            key={gain.id}
            className="absolute right-0 -bottom-5 text-[11px] font-bold text-success whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            aria-live="polite"
          >
            +{gain.amount} XP
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

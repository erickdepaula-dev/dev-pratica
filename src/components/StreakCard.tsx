import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Flame } from 'lucide-react';
import { UserProgress } from '../types/exercise';
import { calculateEffectiveStreak } from '../services/storage';
import { getCurrentWeekDays, getFortalezaDateString } from '../utils/dateUtils';

interface StreakCardProps {
  streak: UserProgress['streak'];
  className?: string;
}

/**
 * Card de ofensiva: contador animado, ícone de fogo pulsante e linha dos 7 dias
 * da semana (segunda a domingo, fuso America/Fortaleza).
 */
export const StreakCard: React.FC<StreakCardProps> = ({ streak, className = '' }) => {
  const streakInfo = calculateEffectiveStreak(streak);
  const count = streakInfo.count;
  const todayStr = getFortalezaDateString();
  const weekDays = getCurrentWeekDays(streak?.activeDates || []);

  // Guarda o valor anterior para animar só quando o contador SOBE.
  const previousCount = useRef(count);
  const [justIncreased, setJustIncreased] = useState(false);
  useEffect(() => {
    if (count > previousCount.current) {
      setJustIncreased(true);
      const timer = window.setTimeout(() => setJustIncreased(false), 1400);
      previousCount.current = count;
      return () => window.clearTimeout(timer);
    }
    previousCount.current = count;
  }, [count]);

  const isLit = count > 0;

  return (
    <div className={`rounded-card p-px bg-gradient-streak shadow-card ${className}`}>
      <div className="h-full rounded-[calc(var(--radius-card)-1px)] bg-surface bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--streak-from)_20%,transparent),transparent_65%)] p-5 flex flex-col gap-5 md:flex-row md:items-stretch">
        {/* Contador */}
        <div className="flex-1 flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.span
              className={`w-11 h-11 rounded-control flex items-center justify-center shrink-0 ${
                isLit ? 'bg-gradient-streak shadow-[0_0_24px_color-mix(in_srgb,var(--streak-from)_45%,transparent)]' : 'bg-surface-hover border border-subtle'
              }`}
              animate={isLit ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={isLit ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
              aria-hidden="true"
            >
              <Flame className={`w-6 h-6 ${isLit ? 'text-white fill-white/30' : 'text-muted'}`} />
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-wider text-streak-from">Ofensiva de estudos</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="relative inline-flex overflow-hidden text-5xl font-black font-mono tabular-nums leading-none">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={count}
                  className={isLit ? 'text-gradient-streak' : 'text-muted'}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                >
                  {count}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-sm font-semibold text-streak-from">
              {count === 1 ? 'dia consecutivo' : 'dias consecutivos'}
            </span>
            <AnimatePresence>
              {justIncreased && (
                <motion.span
                  className="text-xs font-bold text-streak-from"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  aria-hidden="true"
                >
                  +1
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <p className="text-xs leading-relaxed" aria-live="polite">
            {streakInfo.isActiveToday ? (
              <span className="text-success font-medium">✓ Atividade concluída hoje! Sua ofensiva foi mantida.</span>
            ) : streakInfo.isAtRisk ? (
              <span className="text-warning font-medium">
                ⚡ Sequência de ontem preservada! Conclua um exercício hoje para somar mais 1 dia.
              </span>
            ) : (
              <span className="text-muted">
                A ofensiva começa em 1 dia assim que você concluir o seu primeiro exercício.
              </span>
            )}
          </p>
        </div>

        {/* Semana */}
        <div className="md:w-[55%] flex flex-col justify-between gap-3 md:pl-5 md:border-l border-t md:border-t-0 border-subtle pt-4 md:pt-0">
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
            <span className="font-bold text-primary">Esta semana</span>
            <span className="text-[11px] text-muted">Dias com pelo menos 1 exercício concluído</span>
          </div>

          <ol className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekDays.map((day, index) => {
              const isFuture = day.dateStr > todayStr;
              return (
                <li key={day.dateStr} className="flex flex-col items-center gap-1.5">
                  <span
                    className={`text-[10px] font-semibold ${day.isToday ? 'text-streak-from' : 'text-muted'}`}
                  >
                    {day.dayShort}
                  </span>
                  <span
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      day.isToday ? 'ring-2 ring-streak-from/60 ring-offset-2 ring-offset-surface' : ''
                    }`}
                    title={`${day.dateStr}${day.hasActivity ? ' — estudou' : ''}`}
                  >
                    {/* Base vazia */}
                    <span
                      className={`absolute inset-0 rounded-full border ${
                        isFuture ? 'border-dashed border-subtle' : 'border-subtle bg-canvas/60'
                      }`}
                    />
                    {/* Preenchimento animado */}
                    <AnimatePresence>
                      {day.hasActivity && (
                        <motion.span
                          className="absolute inset-0 rounded-full bg-gradient-streak flex items-center justify-center"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.25 + index * 0.05 }}
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3} aria-hidden="true" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <span
                      className={`relative text-[11px] font-bold ${
                        day.hasActivity ? 'sr-only' : isFuture ? 'text-muted/60' : 'text-muted'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    <span className="sr-only">{day.hasActivity ? 'estudou' : 'sem atividade'}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="text-[11px] text-muted flex items-center justify-between gap-2">
            <span>Regra: 1 dia por calendário (Fortaleza)</span>
            <span className="font-mono text-streak-from whitespace-nowrap">Hoje: {todayStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

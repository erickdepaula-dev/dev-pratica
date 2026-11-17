import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Award } from 'lucide-react';
import { UnlockedBadge } from '../types/gamification';
import { CAREER_LEVELS, getCareerProgress } from '../services/xp';
import { BADGES } from '../services/badges';

interface CareerCardProps {
  xp: number;
  badges: readonly UnlockedBadge[];
  onOpenAchievements: () => void;
}

/** Card de nível de carreira (Dashboard): nível atual, XP para o próximo e escada de níveis. */
export const CareerCard: React.FC<CareerCardProps> = ({ xp, badges, onOpenAchievements }) => {
  const career = getCareerProgress(xp);
  const currentIndex = CAREER_LEVELS.findIndex(l => l.id === career.level.id);
  const recent = [...badges]
    .sort((a, b) => b.unlockedAt.localeCompare(a.unlockedAt))
    .slice(0, 4)
    .map(b => BADGES.find(def => def.id === b.id))
    .filter((def): def is (typeof BADGES)[number] => Boolean(def));

  return (
    <div className="rounded-card border border-subtle bg-surface shadow-card p-5 sm:p-6 flex flex-col gap-5 md:flex-row md:items-center">
      {/* Nível atual */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Nível de carreira</span>
          <span className="text-xs font-mono tabular-nums text-muted">{xp} XP</span>
        </div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-black text-gradient-accent">{career.level.name}</span>
          {career.nextLevel ? (
            <span className="text-xs text-muted">
              faltam <strong className="text-primary font-mono">{career.nextLevel.minXp - xp} XP</strong> para{' '}
              {career.nextLevel.name}
            </span>
          ) : (
            <span className="text-xs text-success font-semibold">nível máximo alcançado</span>
          )}
        </div>
        <div className="h-2 rounded-full bg-subtle overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-accent origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: career.percent / 100 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
        {/* Escada de níveis */}
        <ol className="flex items-center justify-between gap-1 text-[10px]" aria-label="Níveis de carreira">
          {CAREER_LEVELS.map((level, index) => (
            <li
              key={level.id}
              className={`flex flex-col items-center gap-0.5 ${index <= currentIndex ? 'text-primary font-semibold' : 'text-muted/60'}`}
              aria-current={index === currentIndex ? 'step' : undefined}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  index < currentIndex ? 'bg-accent-to' : index === currentIndex ? 'bg-gradient-accent ring-2 ring-accent-from/40' : 'bg-subtle'
                }`}
              />
              <span>{level.name}</span>
              <span className="font-mono text-muted/70">{level.minXp}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Conquistas recentes */}
      <div className="md:w-56 md:pl-5 md:border-l border-t md:border-t-0 border-subtle pt-4 md:pt-0 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
          <Award className="w-4 h-4 text-streak-from" aria-hidden="true" />
          Conquistas
          <span className="ml-auto font-mono text-primary">
            {badges.length}/{BADGES.length}
          </span>
        </div>
        {recent.length > 0 ? (
          <ul className="flex gap-2" aria-label="Conquistas recentes">
            {recent.map(def => (
              <li
                key={def.id}
                title={def.name + ' — ' + def.description}
                className="w-10 h-10 rounded-control bg-streak-from/10 border border-streak-from/30 flex items-center justify-center text-lg"
              >
                <span aria-hidden="true">{def.icon}</span>
                <span className="sr-only">{def.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted">Conclua seu primeiro exercício para ganhar a primeira conquista.</p>
        )}
        <button
          type="button"
          onClick={onOpenAchievements}
          className="group text-xs font-semibold text-accent hover:text-primary transition-colors flex items-center gap-1"
        >
          Ver todas
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

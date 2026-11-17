import React from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { UnlockedBadge } from '../types/gamification';
import { BADGES } from '../services/badges';

interface BadgeGridProps {
  badges: readonly UnlockedBadge[];
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Fortaleza' });
}

/** Grid de conquistas: desbloqueadas coloridas, pendentes em silhueta com a condição visível. */
export const BadgeGrid: React.FC<BadgeGridProps> = ({ badges }) => {
  const unlocked = new Map(badges.map(b => [b.id, b]));

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" aria-label="Conquistas">
      {BADGES.map((badge, index) => {
        const owned = unlocked.get(badge.id);
        return (
          <motion.li
            key={badge.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className={`relative rounded-card border p-4 flex flex-col items-center text-center gap-2 ${
              owned
                ? 'border-streak-from/40 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--streak-from)_14%,transparent),transparent_70%)] bg-surface shadow-card'
                : 'border-dashed border-subtle bg-surface/40'
            }`}
          >
            <span
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                owned ? 'bg-streak-from/15 ring-2 ring-streak-from/40' : 'bg-subtle grayscale opacity-40'
              }`}
              aria-hidden="true"
            >
              {badge.icon}
            </span>
            <span className={`text-xs font-bold ${owned ? 'text-primary' : 'text-muted'}`}>{badge.name}</span>
            <span className="text-[11px] text-muted leading-snug">{badge.description}</span>
            {owned ? (
              <span className="text-[10px] font-mono text-streak-from">{formatDate(owned.unlockedAt)}</span>
            ) : (
              <span className="text-[10px] text-muted/70 flex items-center gap-1">
                <Lock className="w-3 h-3" aria-hidden="true" /> Bloqueada
              </span>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
};

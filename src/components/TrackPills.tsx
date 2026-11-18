import React from 'react';
import { motion } from 'motion/react';
import { Track } from '../types/exercise';
import { TRACKS } from '../utils/track';
import { getTrackTheme } from '../utils/exerciseTheme';

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-from';

const INDICATOR_TRANSITION = { type: 'spring', stiffness: 500, damping: 38 } as const;

interface TrackPillsProps {
  selectedTrack: Track;
  onSelectTrack: (track: Track) => void;
  /** Mostra o nome completo da linguagem em vez da sigla. */
  showFullName?: boolean;
  /** Abaixo de `lg`, mostra só o emoji (o nome fica no title/aria-label) — para o Header. */
  compactBelowLg?: boolean;
  /** Precisa ser único por instância para não "voar" entre o desktop e o menu mobile. */
  indicatorId: string;
}

/** Seletor de trilha (linguagens + Lógica) em "pills", com indicador em gradiente animado (layoutId). */
export const TrackPills: React.FC<TrackPillsProps> = ({
  selectedTrack,
  onSelectTrack,
  indicatorId,
  showFullName = false,
  compactBelowLg = false,
}) => (
  <div
    role="radiogroup"
    aria-label="Trilha de estudo"
    className="flex items-center p-0.5 bg-canvas border border-subtle rounded-full"
  >
    {TRACKS.map(track => {
      const theme = getTrackTheme(track);
      const isActive = selectedTrack === track;
      return (
        <button
          key={track}
          type="button"
          role="radio"
          aria-checked={isActive}
          aria-label={theme.name}
          onClick={() => onSelectTrack(track)}
          title={theme.name + ' — ' + theme.tag}
          className={`relative px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap cursor-pointer transition-colors ${FOCUS_RING} ${
            isActive ? 'text-white' : 'text-muted hover:text-primary'
          }`}
        >
          {isActive && (
            <motion.span
              layoutId={indicatorId}
              transition={INDICATOR_TRANSITION}
              className="absolute inset-0 rounded-full bg-gradient-accent shadow-glow"
            />
          )}
          <span className="relative flex items-center gap-1">
            <span aria-hidden="true">{theme.emoji}</span>
            <span className={compactBelowLg ? 'hidden lg:inline' : undefined}>{showFullName ? theme.name : theme.shortName}</span>
          </span>
        </button>
      );
    })}
  </div>
);

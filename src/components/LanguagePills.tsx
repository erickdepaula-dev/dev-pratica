import React from 'react';
import { motion } from 'motion/react';
import { Language } from '../types/exercise';
import { LANGUAGES } from '../utils/language';
import { getLanguageTheme } from '../utils/exerciseTheme';

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-from';

const INDICATOR_TRANSITION = { type: 'spring', stiffness: 500, damping: 38 } as const;

interface LanguagePillsProps {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  /** Mostra o nome completo da linguagem em vez da sigla. */
  showFullName?: boolean;
  /** Precisa ser único por instância para não "voar" entre o desktop e o menu mobile. */
  indicatorId: string;
}

/** Seletor de trilha em "pills", com indicador em gradiente animado (layoutId). */
export const LanguagePills: React.FC<LanguagePillsProps> = ({
  selectedLanguage,
  onSelectLanguage,
  indicatorId,
  showFullName = false,
}) => (
  <div
    role="radiogroup"
    aria-label="Trilha de linguagem"
    className="flex items-center p-0.5 bg-canvas border border-subtle rounded-full"
  >
    {LANGUAGES.map(language => {
      const theme = getLanguageTheme(language);
      const isActive = selectedLanguage === language;
      return (
        <button
          key={language}
          type="button"
          role="radio"
          aria-checked={isActive}
          aria-label={theme.name}
          onClick={() => onSelectLanguage(language)}
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
            <span>{showFullName ? theme.name : theme.shortName}</span>
          </span>
        </button>
      );
    })}
  </div>
);

import React from 'react';
import { motion } from 'motion/react';
import { Language } from '../types/exercise';

interface LanguageOption {
  id: Language;
  label: string;
  fullName: string;
  emoji: string;
  title: string;
}

/** Ordem e rótulos das trilhas. A trilha TypeScript (Fase 2) entra aqui. */
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'php', label: 'PHP', fullName: 'PHP', emoji: '🐘', title: 'PHP - Linguagem Principal de Estudo' },
  { id: 'javascript', label: 'JS', fullName: 'JavaScript', emoji: '⚡', title: 'JavaScript - Linguagem Secundária' },
];

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
    {LANGUAGE_OPTIONS.map(lang => {
      const isActive = selectedLanguage === lang.id;
      return (
        <button
          key={lang.id}
          type="button"
          role="radio"
          aria-checked={isActive}
          onClick={() => onSelectLanguage(lang.id)}
          title={lang.title}
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
            <span aria-hidden="true">{lang.emoji}</span>
            <span>{showFullName ? lang.fullName : lang.label}</span>
          </span>
        </button>
      );
    })}
  </div>
);

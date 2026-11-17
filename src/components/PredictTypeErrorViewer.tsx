import React from 'react';
import { motion } from 'motion/react';
import { TypeErrorChallenge } from '../types/exercise';

interface PredictTypeErrorViewerProps {
  code: string;
  challenge: TypeErrorChallenge;
  selectedLine: number | null;
  selectedReason: number | null;
  onSelectLine: (line: number) => void;
  onSelectReason: (reason: number) => void;
  /** Depois de verificar: destaca acerto/erro da linha escolhida. */
  lineFeedback?: 'correta' | 'incorreta' | null;
  disabled?: boolean;
}

/**
 * Modalidade 'prever_erro_de_tipo': o código não compila. O aluno clica na linha que o
 * compilador acusa e escolhe o motivo. Cada linha é um botão (acessível por teclado).
 */
export const PredictTypeErrorViewer: React.FC<PredictTypeErrorViewerProps> = ({
  code,
  challenge,
  selectedLine,
  selectedReason,
  onSelectLine,
  onSelectReason,
  lineFeedback = null,
  disabled = false,
}) => {
  const lines = code.replace(/\s+$/, '').split('\n');

  return (
    <div className="space-y-4">
      {/* Código */}
      <div className="rounded-card border border-subtle bg-canvas overflow-hidden font-mono text-xs sm:text-sm shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-subtle bg-surface/60 text-xs text-muted">
          <span className="text-primary font-medium">Código TypeScript (não compila)</span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded border bg-typescript/10 text-typescript-text border-typescript/30">
            1. Clique na linha que o compilador acusa
          </span>
        </div>

        <div role="radiogroup" aria-label="Linha com erro de tipo" className="p-2 overflow-x-auto max-h-[480px] overflow-y-auto">
          {lines.map((text, index) => {
            const lineNumber = index + 1;
            const isSelected = selectedLine === lineNumber;
            const feedbackClass =
              isSelected && lineFeedback === 'correta'
                ? 'bg-success/15 ring-1 ring-success/50'
                : isSelected && lineFeedback === 'incorreta'
                  ? 'bg-danger/15 ring-1 ring-danger/50'
                  : isSelected
                    ? 'bg-typescript/15 ring-1 ring-typescript/60'
                    : 'hover:bg-surface-hover';
            return (
              <button
                key={lineNumber}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Linha ${lineNumber}: ${text.trim() || 'vazia'}`}
                disabled={disabled}
                onClick={() => onSelectLine(lineNumber)}
                className={`relative w-full flex gap-4 px-2 rounded text-left transition-colors cursor-pointer disabled:cursor-default ${feedbackClass}`}
                style={{ minHeight: '26px', lineHeight: '26px' }}
              >
                {isSelected && (
                  <motion.span
                    layoutId="type-error-line-marker"
                    className="absolute left-0 top-1 bottom-1 w-0.5 rounded bg-typescript"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="w-7 text-right text-muted/60 select-none shrink-0 tabular-nums text-xs" style={{ lineHeight: '26px' }}>
                  {lineNumber}
                </span>
                <span className="whitespace-pre text-primary">{text || ' '}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Motivo */}
      <fieldset className="rounded-card border border-typescript/30 bg-typescript/5 p-5 space-y-3">
        <legend className="px-1 text-sm font-semibold text-primary">2. Por que o compilador reclama?</legend>
        <div className="space-y-2">
          {challenge.reasonOptions.map((option, index) => {
            const isSelected = selectedReason === index;
            return (
              <label
                key={index}
                className={`flex items-start gap-3 p-3 rounded-control border text-xs cursor-pointer transition-colors ${
                  isSelected ? 'border-typescript/60 bg-typescript/10 text-primary' : 'border-subtle bg-canvas/60 text-muted hover:text-primary hover:border-typescript/40'
                }`}
              >
                <input
                  type="radio"
                  name="motivo-erro-de-tipo"
                  className="mt-0.5 accent-[var(--lang-typescript)]"
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => onSelectReason(index)}
                />
                <span className="leading-relaxed">{option}</span>
              </label>
            );
          })}
        </div>
        <p className="text-xs text-muted">
          {selectedLine === null ? 'Nenhuma linha escolhida ainda.' : `Linha escolhida: ${selectedLine}.`} Depois de acertar,
          você verá a mensagem exata do compilador.
        </p>
      </fieldset>
    </div>
  );
};

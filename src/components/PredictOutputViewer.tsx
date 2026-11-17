import React from 'react';

interface PredictOutputViewerProps {
  language: 'php' | 'javascript';
  code: string;
  userPrediction: string;
  onChangePrediction: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const PredictOutputViewer: React.FC<PredictOutputViewerProps> = ({
  language,
  code,
  userPrediction,
  onChangePrediction,
  onSubmit,
  disabled = false,
}) => {
  const lines = code.trim().split('\n');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Code Display Window */}
      <div className="rounded-card border border-subtle bg-canvas overflow-hidden font-mono text-xs sm:text-sm shadow-card">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-subtle/80 bg-surface/60 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-danger/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-success/80 inline-block" />
            </div>
            <span className="text-primary font-medium ml-2">Código para Previsão ({language.toUpperCase()})</span>
          </div>
          <span className="text-[11px] text-warning/90 font-medium bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
            👁️ Analise mentalmente a saída
          </span>
        </div>

        <div className="p-4 overflow-x-auto text-primary min-h-[200px] max-h-[480px] overflow-y-auto font-mono text-[13px]">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className="flex gap-4 hover:bg-surface/40 px-1.5 rounded transition-colors"
              style={{ minHeight: '24px', lineHeight: '24px' }}
            >
              <span className="w-7 text-right text-muted/60 select-none shrink-0 font-mono text-xs tabular-nums" style={{ lineHeight: '24px' }}>
                {idx + 1}
              </span>
              <pre className="font-mono text-primary overflow-x-visible m-0 p-0" style={{ lineHeight: '24px' }}>{line || ' '}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Input Card */}
      <div className="rounded-xl border border-accent-from/30 bg-accent-from/10 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="prediction-input" className="text-sm font-semibold text-primary flex items-center gap-2">
            <span>Terminal / Saída Esperada:</span>
            <span className="text-xs text-accent font-normal">O que será impresso na tela?</span>
          </label>
          <span className="text-xs text-muted">Atalho: Ctrl + Enter</span>
        </div>

        <div className="relative">
          <input
            id="prediction-input"
            type="text"
            value={userPrediction}
            onChange={e => onChangePrediction(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Digite o resultado exato que o código produzirá..."
            className="w-full px-4 py-3 bg-canvas border border-subtle rounded-lg text-primary font-mono text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent-from focus:ring-2 focus:ring-accent-from/40 transition-[border-color,box-shadow]"
            autoFocus
          />
        </div>

        <p className="text-xs text-muted">
          💡 Dica: Considere a ordem dos comandos, concatenações de strings, conversões de tipo implícitas e quebras de linha.
        </p>
      </div>
    </div>
  );
};

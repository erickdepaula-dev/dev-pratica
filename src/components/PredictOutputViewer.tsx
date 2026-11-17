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
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs sm:text-sm shadow-xl">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-slate-300 font-medium ml-2">Código para Previsão ({language.toUpperCase()})</span>
          </div>
          <span className="text-[11px] text-amber-400/90 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            👁️ Analise mentalmente a saída
          </span>
        </div>

        <div className="p-4 overflow-x-auto text-slate-200 min-h-[200px] max-h-[480px] overflow-y-auto font-mono text-[13px]">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className="flex gap-4 hover:bg-slate-900/40 px-1.5 rounded transition-colors"
              style={{ minHeight: '24px', lineHeight: '24px' }}
            >
              <span className="w-7 text-right text-slate-600 select-none shrink-0 font-mono text-xs tabular-nums" style={{ lineHeight: '24px' }}>
                {idx + 1}
              </span>
              <pre className="font-mono text-slate-200 overflow-x-visible m-0 p-0" style={{ lineHeight: '24px' }}>{line || ' '}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Input Card */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="prediction-input" className="text-sm font-semibold text-white flex items-center gap-2">
            <span>Terminal / Saída Esperada:</span>
            <span className="text-xs text-indigo-300 font-normal">O que será impresso na tela?</span>
          </label>
          <span className="text-xs text-slate-400">Atalho: Ctrl + Enter</span>
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
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
        </div>

        <p className="text-xs text-slate-400">
          💡 Dica: Considere a ordem dos comandos, concatenações de strings, conversões de tipo implícitas e quebras de linha.
        </p>
      </div>
    </div>
  );
};

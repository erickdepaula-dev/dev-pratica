import React from 'react';
import { DeskCheckChallenge } from '../types/exercise';

interface DeskCheckViewerProps {
  challenge: DeskCheckChallenge;
  /** Gabarito (só para mostrar as linhas de exemplo e contar as linhas da tabela). */
  expectedRows: string[][];
  givenRows: number;
  answer: string[][];
  onChangeCell: (row: number, column: number, value: string) => void;
  /** Acerto por célula depois de verificar (null = ainda não verificou). */
  cellResults: boolean[][] | null;
  onSubmit: () => void;
}

/**
 * Modalidade 'teste_de_mesa' (Fase 4.5): o código à esquerda/acima e a tabela de variáveis.
 * Cada vez que a execução passa por `anotar(...)`, o aluno preenche uma linha.
 */
export const DeskCheckViewer: React.FC<DeskCheckViewerProps> = ({
  challenge,
  expectedRows,
  givenRows,
  answer,
  onChangeCell,
  cellResults,
  onSubmit,
}) => {
  const lines = challenge.code.trim().split('\n');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-subtle bg-canvas overflow-hidden font-mono text-xs sm:text-sm shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-subtle/80 bg-surface/60 text-xs text-muted">
          <span className="text-primary font-medium font-sans">Código para executar no papel (JavaScript)</span>
          <span className="text-[11px] font-sans text-logica-text bg-logica/10 px-2 py-0.5 rounded border border-logica/30">
            📝 uma linha da tabela a cada <code className="font-mono">anotar(...)</code>
          </span>
        </div>
        <div className="p-4 overflow-x-auto max-h-[360px] overflow-y-auto text-[13px]">
          {lines.map((line, idx) => {
            const isNote = line.includes('anotar(');
            return (
              <div
                key={idx}
                className={`flex gap-4 px-1.5 rounded ${isNote ? 'bg-logica/10' : ''}`}
                style={{ minHeight: '24px', lineHeight: '24px' }}
              >
                <span className="w-7 text-right text-muted/60 select-none shrink-0 text-xs tabular-nums">{idx + 1}</span>
                <pre className={`m-0 p-0 ${isNote ? 'text-logica-text' : 'text-primary'}`}>{line || ' '}</pre>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-card border border-subtle bg-surface/40 overflow-x-auto shadow-card">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <caption className="sr-only">Tabela do teste de mesa: uma linha por chamada de anotar</caption>
          <thead>
            <tr className="bg-surface/80 text-muted">
              <th scope="col" className="px-2 py-2 text-[11px] font-semibold text-left w-10">#</th>
              {challenge.columns.map(column => (
                <th key={column} scope="col" className="px-2 py-2 font-mono font-semibold text-primary text-left">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expectedRows.map((expectedRow, r) => (
              <tr key={r} className="border-t border-subtle/70">
                <th scope="row" className="px-2 py-1.5 text-[11px] text-muted font-normal text-left tabular-nums">
                  {r + 1}
                </th>
                {challenge.columns.map((column, c) => {
                  if (r < givenRows) {
                    return (
                      <td key={column} className="px-2 py-1.5 font-mono text-muted">
                        {expectedRow[c]}
                        {r === 0 && c === 0 && <span className="sr-only"> (exemplo)</span>}
                      </td>
                    );
                  }
                  const result = cellResults?.[r]?.[c];
                  const stateClass =
                    result === undefined || cellResults === null
                      ? 'border-subtle focus:border-accent-from'
                      : result
                        ? 'border-success/60 bg-success/10'
                        : 'border-danger/60 bg-danger/10';
                  return (
                    <td key={column} className="px-1.5 py-1">
                      <input
                        type="text"
                        inputMode="text"
                        autoComplete="off"
                        spellCheck={false}
                        value={answer[r]?.[c] ?? ''}
                        onChange={e => onChangeCell(r, c, e.target.value)}
                        onKeyDown={handleKeyDown}
                        aria-label={`Linha ${r + 1}, ${column}`}
                        aria-invalid={result === false ? true : undefined}
                        className={`w-full min-w-[4.5rem] px-2 py-1 rounded-md bg-canvas border font-mono text-primary outline-none ${stateClass}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted leading-relaxed">
        {givenRows === 0
          ? 'Sem linha de exemplo: comece pelos valores do primeiro anotar(...). '
          : givenRows === 1
            ? 'A linha 1 já vem preenchida como exemplo. '
            : `As linhas 1 a ${givenRows} já vêm preenchidas como exemplo. `}
        Textos podem ir sem aspas; verdadeiro/falso como <code className="font-mono">true</code>/
        <code className="font-mono">false</code>; listas como <code className="font-mono">[1, 2]</code>. Ctrl+Enter verifica.
      </p>
    </div>
  );
};

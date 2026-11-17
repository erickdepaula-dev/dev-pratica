import React, { useRef } from 'react';
import { Blank } from '../types/exercise';
import { BlankValidationResult } from '../services/evaluator';

interface FillInBlanksEditorProps {
  templateCode: string;
  blanks: Blank[];
  userValues: Record<string, string>;
  validationResults?: BlankValidationResult[];
  hasAttempted: boolean;
  disabled?: boolean;
  onChangeBlank: (blankId: string, value: string) => void;
  onSubmit: () => void;
}

export const FillInBlanksEditor: React.FC<FillInBlanksEditorProps> = ({
  templateCode,
  blanks,
  userValues,
  validationResults,
  hasAttempted,
  disabled = false,
  onChangeBlank,
  onSubmit,
}) => {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Map blank validation result by ID
  const resultsById = React.useMemo(() => {
    const map = new Map<string, BlankValidationResult>();
    if (validationResults) {
      validationResults.forEach(r => map.set(r.blankId, r));
    }
    return map;
  }, [validationResults]);

  const blanksById = React.useMemo(() => {
    const map = new Map<string, Blank>();
    blanks.forEach(b => map.set(b.id, b));
    return map;
  }, [blanks]);

  const lines = templateCode.split('\n');

  // Simple token highlighter for surrounding code
  const highlightCode = (text: string) => {
    // Escaped HTML text with basic syntax coloring
    // Highlight PHP tags, comments, keywords, variables, strings
    const parts = text.split(/(<\?php|\/\/.*$|\/\*[\s\S]*?\*\/|\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*|"[^"]*"|'[^']*'|\b(?:function|return|if|else|foreach|as|class|public|private|protected|interface|trait|use|try|catch|throw|new|const|let|var|async|await|get)\b)/g);

    return parts.map((part, i) => {
      if (!part) return null;

      if (part === '<?php') {
        return <span key={i} className="text-syntax-tag font-bold">{part}</span>;
      }
      if (part.startsWith('//') || part.startsWith('/*')) {
        return <span key={i} className="text-syntax-comment italic">{part}</span>;
      }
      if (part.startsWith('$')) {
        return <span key={i} className="text-syntax-variable font-medium">{part}</span>;
      }
      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
        return <span key={i} className="text-syntax-string">{part}</span>;
      }
      if (/^(function|return|if|else|foreach|as|class|public|private|protected|interface|trait|use|try|catch|throw|new|const|let|var|async|await|get)$/.test(part)) {
        return <span key={i} className="text-syntax-keyword font-semibold">{part}</span>;
      }
      if (/^[0-9]+(\.[0-9]+)?$/.test(part)) {
        return <span key={i} className="text-syntax-number">{part}</span>;
      }
      return <span key={i} className="text-primary">{part}</span>;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative rounded-card border border-subtle bg-canvas overflow-hidden font-mono text-sm shadow-card transition-[border-color,box-shadow] duration-200 focus-within:border-accent-from/60 focus-within:shadow-glow">
      {/* Editor Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-subtle/80 bg-surface/60 text-xs text-muted">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-warning/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-success/80 inline-block" />
          </div>
          <span className="text-primary font-medium ml-2">Editor de Lacunas</span>
          <span className="text-muted">·</span>
          <span className="text-muted">{blanks.length} {blanks.length === 1 ? 'lacuna' : 'lacunas'} a preencher</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-muted">
          <span>Tab para navegar</span>
          <span>·</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-hover border border-subtle text-[11px] text-primary">Ctrl + Enter</kbd>
          <span>para verificar</span>
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="overflow-x-auto p-4 leading-relaxed min-h-[280px] max-h-[580px] overflow-y-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((lineText, lineIdx) => {
              const lineNumber = lineIdx + 1;
              const hasBlank = /\{\{blank_\d+\}\}/.test(lineText);

              return (
                <tr key={lineIdx} className="hover:bg-surface/30 transition-colors">
                  {/* Line Number */}
                  <td className="w-10 select-none text-right pr-4 text-muted/60 text-xs align-top pt-1">
                    {lineNumber}
                  </td>

                  {/* Line Content */}
                  <td className="text-primary whitespace-pre font-mono text-[13.5px] leading-7">
                    {!hasBlank ? (
                      highlightCode(lineText)
                    ) : (
                      // Parse line with blank markers
                      <span>
                        {lineText.split(/(\{\{blank_\d+\}\})/).map((chunk, chunkIdx) => {
                          const match = chunk.match(/^\{\{(blank_\d+)\}\}$/);
                          if (!match) {
                            return <span key={chunkIdx}>{highlightCode(chunk)}</span>;
                          }

                          const blankId = match[1];
                          const blankInfo = blanksById.get(blankId);
                          const userVal = userValues[blankId] || '';
                          const validation = resultsById.get(blankId);

                          // Visual state
                          let inputStyle = 'border-accent-from/40 bg-surface text-accent focus:border-accent-from focus:ring-2 focus:ring-accent-from/40 focus:bg-surface-hover';
                          let statusIcon = null;

                          if (hasAttempted && validation) {
                            if (validation.passed) {
                              inputStyle = 'border-success bg-success/10 text-success ring-1 ring-success/50';
                              statusIcon = <span className="text-success text-xs ml-1" title="Correto!">✓</span>;
                            } else {
                              inputStyle = 'border-danger bg-danger/10 text-danger ring-1 ring-danger/50';
                              statusIcon = <span className="text-danger text-xs ml-1" title={validation.message}>✗</span>;
                            }
                          }

                          // Calculate width: comfortable base width when empty, expands as user types
                          const currentLen = Math.max(userVal.length, 14);
                          const charWidthRem = currentLen * 0.65;

                          return (
                            <span key={chunkIdx} className="inline-flex items-center mx-1 align-baseline relative group">
                              <input
                                ref={el => { inputRefs.current[blankId] = el; }}
                                type="text"
                                spellCheck={false}
                                autoCapitalize="none"
                                autoComplete="off"
                                autoCorrect="off"
                                disabled={disabled}
                                value={userVal}
                                placeholder=""
                                onChange={e => onChangeBlank(blankId, e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ width: `${Math.min(Math.max(charWidthRem, 7.5), 32)}rem` }}
                                className={`px-2.5 py-0.5 rounded font-mono text-[13.5px] border outline-none transition-all ${inputStyle}`}
                                title="Preencha esta lacuna"
                              />
                              {statusIcon}
                            </span>
                          );
                        })}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer blank summary */}
      <div className="border-t border-subtle bg-surface/40 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-muted gap-2">
        <div className="flex items-center gap-3">
          <span>Campos de lacunas:</span>
          {blanks.map((b, idx) => {
            const res = resultsById.get(b.id);
            const isFilled = Boolean((userValues[b.id] || '').trim());
            let badgeBg = 'bg-surface-hover text-muted border-subtle';
            if (hasAttempted && res) {
              badgeBg = res.passed
                ? 'bg-success/10 border-success/50 text-success'
                : 'bg-danger/10 border-danger/50 text-danger';
            } else if (isFilled) {
              badgeBg = 'bg-accent-from/10 border-accent-from/50 text-accent';
            }

            return (
              <button
                key={b.id}
                type="button"
                onClick={() => inputRefs.current[b.id]?.focus()}
                className={`px-2 py-0.5 rounded border text-[11px] font-mono transition-colors hover:brightness-110 ${badgeBg}`}
              >
                Lacuna #{idx + 1}: {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

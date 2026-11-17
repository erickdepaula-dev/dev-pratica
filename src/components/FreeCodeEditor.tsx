import React, { useRef, useState, useEffect } from 'react';

interface FreeCodeEditorProps {
  language: 'php' | 'javascript';
  code: string;
  onChangeCode: (code: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export const FreeCodeEditor: React.FC<FreeCodeEditorProps> = ({
  language,
  code,
  onChangeCode,
  onSubmit,
  onReset,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });

  // Calculate lines array and ensure a minimum of 14 lines so the editor never looks truncated
  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 14);

  // Synchronize scroll position between textarea and line numbers column
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Track cursor line and column
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart || 0;
    const textBefore = code.substring(0, pos);
    const lineIndex = textBefore.split('\n').length;
    const lastLineBreak = textBefore.lastIndexOf('\n');
    const colIndex = lastLineBreak === -1 ? pos + 1 : pos - lastLineBreak;
    setCursorPos({ line: lineIndex, col: colIndex });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore if clipboard permissions are restricted
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key (insert 4 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChangeCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
        updateCursorPosition();
      }, 0);
      return;
    }

    // Ctrl + Enter or Meta + Enter shortcut to run code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
      return;
    }

    setTimeout(updateCursorPosition, 0);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-sm shadow-xl flex flex-col transition-all">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/70 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-slate-200 font-semibold ml-2">Editor Livre ({language.toUpperCase()})</span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] text-slate-400">{lines.length} {lines.length === 1 ? 'linha' : 'linhas'}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/60 text-slate-300 text-[11px] transition-colors flex items-center gap-1"
            title="Copiar código para a área de transferência"
          >
            {copied ? (
              <>
                <span className="text-emerald-400">✓</span>
                <span className="text-emerald-300">Copiado</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copiar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/60 text-slate-300 text-[11px] transition-colors flex items-center gap-1"
            title="Restaurar código inicial do exercício"
          >
            <span>↺</span>
            <span>Restaurar</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-bold">
              Ctrl + Enter
            </kbd>
            <span>executar</span>
          </div>
        </div>
      </div>

      {/* Editor Body: Fixed 15 lines on desktop (~390px) with smooth inner scrolling */}
      <div className="relative flex flex-1 h-[390px] min-h-[320px] max-h-[390px] bg-slate-950 overflow-hidden">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="select-none py-4 pl-3 pr-3 text-right text-slate-600 text-xs bg-slate-950/95 border-r border-slate-900 font-mono overflow-hidden shrink-0 z-10"
          style={{ width: '3.6rem' }}
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div
              key={i}
              className="text-slate-600 font-mono text-xs tabular-nums"
              style={{ height: '24px', lineHeight: '24px' }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Code Area */}
        <div className="relative flex-1 h-full flex overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => {
              onChangeCode(e.target.value);
              updateCursorPosition();
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onScroll={handleScroll}
            disabled={disabled}
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            className="flex-1 w-full h-full py-4 px-4 bg-transparent text-slate-100 font-mono text-[13.5px] outline-none focus:ring-0 selection:bg-indigo-500/30 overflow-auto whitespace-pre cursor-text"
            style={{
              lineHeight: '24px',
              tabSize: 4,
            }}
            placeholder="// Digite ou edite seu código aqui..."
          />
        </div>
      </div>

      {/* Editor Status Footer */}
      <div className="px-4 py-1.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-400">
            Lin {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span className="text-slate-700">·</span>
          <span>Tab insere 4 espaços</span>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span>UTF-8</span>
          <span className="text-slate-700">·</span>
          <span className="uppercase font-semibold text-slate-400">{language}</span>
        </div>
      </div>
    </div>
  );
};

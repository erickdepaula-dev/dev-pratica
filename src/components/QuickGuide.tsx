import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, BookOpen, Copy, Search, X } from 'lucide-react';
import {
  FUNCTION_ANATOMY,
  FUNCTION_QUESTIONS,
  QUICK_FUNCTIONS,
  QUICK_OPERATORS,
  QUICK_PRECEDENCE,
  QUICK_PRECEDENCE_EXAMPLE,
  QUICK_SYNTAX,
  anatomyLegend,
  quickGuideSuggestions,
} from '../data/guiaRapido';
import type { QuickGuideLanguage, QuickGuideTab } from '../types/reference';

interface QuickGuideProps {
  open: boolean;
  onClose: () => void;
  /** Linguagem do exercício aberto: a linha dela aparece primeiro e destacada. */
  language: QuickGuideLanguage;
  /** Tópico do exercício, para os atalhos "Neste exercício". */
  topic: string;
}

/** Chave de linha de um cartão: as linguagens (JS e TS juntas quando o código é igual). */
type LineKey = 'php' | 'js' | 'ts' | 'jsts' | 'portugol';

interface CardLine {
  key: LineKey;
  code: string;
}

interface Card {
  id: string;
  tab: 'Operadores' | 'Sintaxe' | 'Funções';
  group: string;
  title: string;
  lines: CardLine[];
  example?: { input: string; result: string };
  pitfall?: string;
  /** Texto usado na busca. */
  haystack: string;
}

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-from';

const LINE_LABEL: Record<LineKey, string> = { php: 'PHP', js: 'JS', ts: 'TS', jsts: 'JS / TS', portugol: 'PORTUGOL' };
const LANGUAGE_NAME: Record<QuickGuideLanguage, string> = { php: 'PHP', js: 'JavaScript', ts: 'TypeScript' };

/** Cores das partes da anatomia de uma função (1–7), em tokens do design system. */
const PART_TEXT: Record<number, string> = {
  1: 'text-syntax-keyword',
  2: 'text-syntax-variable',
  3: 'text-syntax-number',
  4: 'text-logica-text',
  5: 'text-primary',
  6: 'text-syntax-string',
  7: 'text-warning',
};
const PART_BG: Record<number, string> = {
  1: 'bg-syntax-keyword',
  2: 'bg-syntax-variable',
  3: 'bg-syntax-number',
  4: 'bg-logica-text',
  5: 'bg-primary',
  6: 'bg-syntax-string',
  7: 'bg-warning',
};

const TABS: { id: QuickGuideTab; label: string }[] = [
  { id: 'operadores', label: 'Operadores' },
  { id: 'precedencia', label: 'Precedência' },
  { id: 'sintaxe', label: 'Sintaxe' },
  { id: 'funcoes', label: 'Funções' },
];

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function isHighlighted(key: LineKey, language: QuickGuideLanguage): boolean {
  return key === language || (key === 'jsts' && language !== 'php');
}

/** A linguagem do exercício primeiro; depois a "irmã" (JS ↔ TS); depois PHP ou JS; Portugol por último. */
function orderLines(lines: CardLine[], language: QuickGuideLanguage): CardLine[] {
  const sibling = (key: LineKey) => (language === 'ts' && key === 'js') || (language === 'js' && key === 'ts');
  const weight = (key: LineKey) =>
    key === 'portugol' ? 3 : isHighlighted(key, language) ? 0 : sibling(key) ? 1 : 2;
  return [...lines].sort((a, b) => weight(a.key) - weight(b.key));
}

function buildCards(): Card[] {
  const operators: Card[] = QUICK_OPERATORS.map(o => ({
    id: `op-${o.id}`,
    tab: 'Operadores',
    group: '',
    title: o.name,
    lines: [
      { key: 'php', code: o.php },
      { key: 'jsts', code: o.jsts },
      { key: 'portugol', code: o.portugol },
    ],
    example: { input: o.example, result: o.result },
    pitfall: o.pitfall,
    haystack: normalize([o.name, o.php, o.jsts, o.portugol, o.example, o.pitfall ?? ''].join(' ')),
  }));
  const syntax: Card[] = QUICK_SYNTAX.map(s => ({
    id: `sx-${s.id}`,
    tab: 'Sintaxe',
    group: s.group,
    title: s.name,
    lines:
      s.js === s.ts
        ? [{ key: 'php', code: s.php }, { key: 'jsts', code: s.js }, { key: 'portugol', code: s.portugol }]
        : [{ key: 'php', code: s.php }, { key: 'js', code: s.js }, { key: 'ts', code: s.ts }, { key: 'portugol', code: s.portugol }],
    pitfall: s.pitfall,
    haystack: normalize([s.name, s.group, s.php, s.js, s.ts, s.portugol, s.pitfall ?? ''].join(' ')),
  }));
  const functions: Card[] = QUICK_FUNCTIONS.map(f => ({
    id: `fn-${f.id}`,
    tab: 'Funções',
    group: f.group,
    title: f.name,
    lines: [{ key: 'php', code: f.php }, { key: 'jsts', code: f.jsts }],
    pitfall: f.pitfall,
    haystack: normalize([f.name, f.group, f.php, f.jsts, f.pitfall ?? ''].join(' ')),
  }));
  return [...operators, ...syntax, ...functions];
}

const ALL_CARDS = buildCards();

/**
 * Guia rápido (Ctrl /): janela no centro, com a tela escurecida, para tirar uma dúvida de
 * sintaxe e voltar ao código. Fecha pelo mesmo atalho, por Esc, pelo X ou clicando fora.
 * Conteúdo em src/data/guiaRapido.ts.
 */
export const QuickGuide: React.FC<QuickGuideProps> = ({ open, onClose, language, topic }) => {
  const [tab, setTab] = useState<QuickGuideTab>('sintaxe');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const copiedTimer = useRef<number | undefined>(undefined);

  // Ao abrir: sempre na aba Sintaxe, busca limpa e foco na busca. Ao fechar: o foco volta para
  // onde estava (o botão ou o editor).
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    setTab('sintaxe');
    setQuery('');
    const id = window.setTimeout(() => searchRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(id);
      previous?.focus?.();
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  // Esc fecha; Tab fica preso dentro da janela.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input, [href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const copy = (key: string, code: string) => {
    void navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(key);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(null), 1400);
  };

  const term = normalize(query.trim());
  const searching = term !== '';
  const cards = useMemo(() => {
    if (searching) return ALL_CARDS.filter(c => c.haystack.includes(term));
    const tabName = tab === 'operadores' ? 'Operadores' : tab === 'sintaxe' ? 'Sintaxe' : tab === 'funcoes' ? 'Funções' : null;
    return tabName ? ALL_CARDS.filter(c => c.tab === tabName) : [];
  }, [searching, term, tab]);
  const suggestions = useMemo(() => quickGuideSuggestions(topic), [topic]);
  const anatomy = FUNCTION_ANATOMY[language];
  const anatomyText = anatomy.map(line => line.map(s => s.text).join('')).join('\n');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="quick-guide"
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Fundo escurecido: clicar fora fecha */}
          <button
            type="button"
            aria-label="Fechar o Guia rápido"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-canvas/75 backdrop-blur-[2px] cursor-pointer"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="guia-rapido-titulo"
            onKeyDown={handleKeyDown}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            // Sem ligaduras: numa cola de sintaxe, === precisa aparecer como três sinais, não como ≡.
            className="relative w-full max-w-[34rem] h-full max-h-[52rem] flex flex-col rounded-card border border-subtle bg-surface shadow-card overflow-hidden [font-variant-ligatures:none]"
          >
            {/* Cabeçalho */}
            <div className="p-4 pb-3 space-y-3 border-b border-subtle">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-accent-from/15 border border-accent-from/40 text-accent flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <h2 id="guia-rapido-titulo" className="text-sm font-extrabold text-primary">Guia rápido</h2>
                  <p className="text-[11px] text-muted">
                    Destacando <strong className="text-accent">{LANGUAGE_NAME[language]}</strong> · a linguagem deste exercício
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar o Guia rápido (Ctrl / ou Esc)"
                  title="Fechar (Ctrl / ou Esc)"
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border border-subtle text-muted hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer ${FOCUS_RING}`}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <label className="relative block">
                <span className="sr-only">Buscar no guia</span>
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar: resto, elseif, tamanho, função, &&…"
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-full h-10 pl-9 pr-3 rounded-control border border-subtle bg-canvas text-sm text-primary placeholder:text-muted/80 outline-none focus:border-accent-from ${FOCUS_RING}`}
                />
              </label>

              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-muted">Neste exercício:</span>
                {suggestions.map(([label, search]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setQuery(search)}
                    className={`px-2 py-1 rounded-full border border-subtle bg-canvas text-accent font-mono font-semibold hover:bg-surface-hover transition-colors cursor-pointer ${FOCUS_RING}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {searching ? (
                <div className="flex items-center justify-between text-xs text-muted" role="status">
                  <span>{cards.length === 1 ? '1 resultado' : `${cards.length} resultados`} em todas as abas</span>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className={`px-2 py-1 rounded-md border border-subtle text-accent font-semibold hover:bg-surface-hover cursor-pointer ${FOCUS_RING}`}
                  >
                    Limpar busca
                  </button>
                </div>
              ) : (
                <div role="tablist" aria-label="Seções do guia" className="grid grid-cols-4 gap-1 p-1 rounded-control bg-canvas border border-subtle">
                  {TABS.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={tab === t.id}
                      onClick={() => setTab(t.id)}
                      className={`h-8 rounded-md text-xs font-bold transition-colors cursor-pointer ${FOCUS_RING} ${
                        tab === t.id ? 'bg-gradient-accent text-white' : 'text-muted hover:text-primary hover:bg-surface-hover'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2.5" role={searching ? undefined : 'tabpanel'}>
              {!searching && tab === 'sintaxe' && (
                <section aria-label="Montar uma função" className="rounded-xl border border-accent-from/40 bg-accent-from/[0.07] p-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[13px] font-extrabold text-primary">
                      Montar uma função <span className="text-accent">({LANGUAGE_NAME[language]})</span>
                    </h3>
                    <CopyButton copied={copied === 'anatomia'} onClick={() => copy('anatomia', anatomyText)} label="Copiar o modelo de função" text="Copiar modelo" />
                  </div>
                  <div className="p-3 rounded-lg bg-canvas border border-subtle font-mono text-[12.5px] leading-[22px] overflow-x-auto">
                    {anatomy.map((line, i) => (
                      <div key={i} className="min-h-[22px] whitespace-pre">
                        {line.map((seg, j) => (
                          <React.Fragment key={j}>
                            {seg.part && (
                              <span
                                aria-hidden="true"
                                className={`inline-flex items-center justify-center w-[15px] h-[15px] mx-[2px] rounded-full ${PART_BG[seg.part]} text-canvas font-sans font-extrabold text-[9px] align-[2px]`}
                              >
                                {seg.part}
                              </span>
                            )}
                            <span className={seg.part ? PART_TEXT[seg.part] : 'text-syntax-comment'}>{seg.text}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    ))}
                  </div>
                  <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                    {anatomyLegend(language).map(item => (
                      <li key={item.part} className="flex items-baseline gap-1.5 text-[11.5px] leading-snug">
                        <span className={`shrink-0 inline-flex items-center justify-center w-[15px] h-[15px] rounded-full ${PART_BG[item.part]} text-canvas font-extrabold text-[9px]`}>
                          {item.part}
                        </span>
                        <span>
                          <strong className="text-primary">{item.name}</strong> <span className="text-muted">{item.description}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                  <div className="pt-2 border-t border-accent-from/25 space-y-1">
                    <strong className="block text-[11px] tracking-wider uppercase text-accent">Deu branco? Responda nesta ordem</strong>
                    {FUNCTION_QUESTIONS.map((q, i) => (
                      <p key={q.question} className="m-0 flex gap-2 text-xs leading-snug">
                        <span className="w-3.5 shrink-0 font-bold text-accent">{i + 1}.</span>
                        <span>
                          <strong className="text-primary">{q.question}</strong> <span className="text-muted">{q.answer}</span>
                        </span>
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {!searching && tab === 'precedencia' && (
                <div className="space-y-3">
                  <p className="text-xs text-muted leading-relaxed">
                    Do que é calculado primeiro (1) ao último. Vale igual em PHP, JavaScript e TypeScript.
                  </p>
                  <ol className="space-y-1">
                    {QUICK_PRECEDENCE.map((level, i) => (
                      <li key={level.operators} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-canvas border border-subtle">
                        <span className="w-5 h-5 shrink-0 rounded-full bg-accent-from/15 text-accent font-mono font-bold text-[11px] flex items-center justify-center">{i + 1}</span>
                        <code className="font-mono font-semibold text-[13px] text-primary min-w-[7rem]">{level.operators}</code>
                        <span className="text-xs text-muted">{level.name}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="rounded-xl border border-accent-from/35 bg-accent-from/[0.08] p-3 space-y-2">
                    <strong className="block text-xs text-accent">Resolvido passo a passo</strong>
                    <code className="block font-mono font-semibold text-[13px] text-syntax-number">{QUICK_PRECEDENCE_EXAMPLE.expression}</code>
                    {QUICK_PRECEDENCE_EXAMPLE.steps.map((step, i) => (
                      <div key={step.calc} className="flex items-baseline gap-2.5 text-xs">
                        <span className="w-4 shrink-0 text-muted">{i + 1}.</span>
                        <code className="flex-1 font-mono text-primary">{step.calc}</code>
                        <span className="text-muted">{step.why}</span>
                      </div>
                    ))}
                    <p className="m-0 text-xs text-muted">Na dúvida, use parênteses: deixam a intenção explícita e não custam nada.</p>
                  </div>
                </div>
              )}

              {cards.map((card, i) => {
                const showGroup = !searching && card.group !== '' && card.group !== cards[i - 1]?.group;
                return (
                  <React.Fragment key={card.id}>
                    {showGroup && (
                      <h4 className="pt-1.5 px-0.5 text-[11px] font-bold tracking-widest uppercase text-muted">{card.group}</h4>
                    )}
                    <article className="rounded-xl border border-subtle bg-canvas px-3 py-2.5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="flex-1 text-[13px] font-bold text-primary">{card.title}</h3>
                        {searching && (
                          <span className="px-2 py-0.5 rounded-full border border-subtle text-[10px] font-semibold text-muted">{card.tab}</span>
                        )}
                      </div>
                      {orderLines(card.lines, language).map(line => {
                        const highlighted = isHighlighted(line.key, language);
                        const key = `${card.id}:${line.key}`;
                        return (
                          <div
                            key={line.key}
                            className={`group flex items-center gap-2 px-1.5 py-1 rounded-md ${highlighted ? 'bg-accent-from/15' : ''}`}
                          >
                            <span
                              className={`w-16 shrink-0 text-[10px] font-bold tracking-wide ${
                                highlighted ? 'text-accent' : 'text-muted/70'
                              }`}
                            >
                              {LINE_LABEL[line.key]}
                            </span>
                            <code
                              className={`flex-1 min-w-0 font-mono text-[12.5px] whitespace-pre-wrap break-words ${
                                highlighted ? 'text-primary' : line.key === 'portugol' ? 'text-muted' : 'text-primary/75'
                              }`}
                            >
                              {line.code}
                            </code>
                            {line.code !== '—' && (
                              <CopyButton
                                copied={copied === key}
                                onClick={() => copy(key, line.code)}
                                label={`Copiar ${LINE_LABEL[line.key]}: ${line.code}`}
                              />
                            )}
                          </div>
                        );
                      })}
                      {card.example && (
                        <p className="m-0 px-1.5 text-xs text-muted">
                          Exemplo: <code className="font-mono text-primary">{card.example.input}</code> →{' '}
                          <code className="font-mono text-syntax-string">{card.example.result}</code>
                        </p>
                      )}
                      {card.pitfall && (
                        <p className="m-0 flex gap-2 px-2 py-1.5 rounded-lg bg-warning/10 border border-warning/30 text-xs leading-snug text-syntax-number">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{card.pitfall}</span>
                        </p>
                      )}
                    </article>
                  </React.Fragment>
                );
              })}

              {searching && cards.length === 0 && (
                <p className="py-8 text-center text-sm text-muted leading-relaxed">
                  Nada encontrado para “{query.trim()}”.
                  <br />
                  Tente outra palavra: <span className="text-accent">tamanho</span>, <span className="text-accent">para</span>,{' '}
                  <span className="text-accent">resto</span>.
                </p>
              )}
            </div>

            {/* Rodapé */}
            <div className="px-4 py-2.5 border-t border-subtle flex flex-wrap justify-between gap-2 text-[11px] text-muted">
              <span>
                <kbd className="px-1.5 py-px rounded border border-subtle font-mono text-[10px]">Ctrl /</kbd> abre e fecha ·{' '}
                <kbd className="px-1.5 py-px rounded border border-subtle font-mono text-[10px]">Esc</kbd> fecha
              </span>
              <span>Completo no Guia de Estudos</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface CopyButtonProps {
  copied: boolean;
  onClick: () => void;
  label: string;
  /** Texto ao lado do ícone (por padrão, só o ícone; "Copiado" depois de copiar). */
  text?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ copied, onClick, label, text }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title="Copiar"
    className={`shrink-0 h-[26px] min-w-[26px] px-1.5 flex items-center justify-center gap-1 rounded-md border border-subtle bg-surface text-[10px] font-semibold transition-colors cursor-pointer hover:bg-surface-hover ${FOCUS_RING} ${
      copied ? 'text-success' : 'text-muted hover:text-primary'
    }`}
  >
    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
    {copied ? 'Copiado' : text}
    <span className="sr-only" aria-live="polite">{copied ? 'Copiado' : ''}</span>
  </button>
);

/** Material de referência da trilha de Lógica (Fase 4, tarefas 4.5 e 4.6). */

export interface OperatorRow {
  /** Operador em JavaScript/TypeScript. */
  operator: string;
  /** Equivalente em Portugol (VisuAlg), quando difere. */
  portugol: string;
  meaning: string;
  example: string;
  result: string;
}

export interface OperatorGroup {
  title: string;
  rows: OperatorRow[];
  /** Observação curta mostrada abaixo do grupo (pegadinhas comuns). */
  note?: string;
}

export interface EquivalenceRow {
  concept: string;
  portugol: string;
  php: string;
  javascript: string;
}

export interface DeskCheckGuideStep {
  title: string;
  text: string;
}

/* ---------- Guia rápido do workspace (janela com Ctrl /) ---------- */

/** Linguagem destacada no Guia rápido (a do exercício aberto). */
export type QuickGuideLanguage = 'php' | 'js' | 'ts';

export type QuickGuideTab = 'operadores' | 'precedencia' | 'sintaxe' | 'funcoes';

export interface QuickOperator {
  id: string;
  name: string;
  /** Igual em JavaScript e TypeScript. */
  jsts: string;
  php: string;
  portugol: string;
  example: string;
  result: string;
  pitfall?: string;
}

export interface QuickSyntax {
  id: string;
  group: string;
  name: string;
  portugol: string;
  php: string;
  js: string;
  /** Quando igual a `js`, o guia mostra uma linha só "JS / TS". */
  ts: string;
  pitfall?: string;
}

export interface QuickFunction {
  id: string;
  group: string;
  name: string;
  php: string;
  jsts: string;
  pitfall?: string;
}

/** Trecho colorido da "anatomia" de uma função; `part` (1–7) liga o trecho à legenda. */
export interface AnatomySegment {
  text: string;
  part?: number;
}

export interface AnatomyLegendItem {
  part: number;
  name: string;
  description: string;
}

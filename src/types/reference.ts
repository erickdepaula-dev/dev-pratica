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

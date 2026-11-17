/**
 * Tipos da avaliação de TypeScript (Fase 2, tarefa 2.6).
 * Pipeline: compilar → executar → testar. Cada etapa pode interromper as seguintes.
 */

/** De onde veio um diagnóstico: do código do aluno ou dos testes de tipo (typeAssertions). */
export type DiagnosticOrigin = 'codigo' | 'teste_de_tipo';

export interface TsDiagnostic {
  /** Linha 1-based, relativa ao código do aluno (ou ao bloco de typeAssertions). */
  line: number;
  column: number;
  /** Código do compilador, ex.: 2322 (exibido como TS2322). */
  code: number;
  message: string;
  origin: DiagnosticOrigin;
}

export interface TsCompileOutput {
  diagnostics: TsDiagnostic[];
  /** JavaScript emitido (script, sem export) — vazio se a emissão falhar. */
  js: string;
  /** Tempo de compilação em ms (para medir a necessidade de um Web Worker). */
  durationMs: number;
}

export type PipelineStageName = 'compilar' | 'executar' | 'testar' | 'regras';

export interface PipelineStageReport {
  stage: PipelineStageName;
  passed: boolean;
  /** Se true, as etapas seguintes não rodaram. */
  halted: boolean;
}

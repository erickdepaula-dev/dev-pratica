/**
 * Pipeline de avaliação de exercícios TypeScript: compilar → executar → testar → regras.
 *
 * Cada etapa é um objeto { name, run(ctx) } e pode interromper as seguintes (ex.: erro de
 * tipo impede a execução). Para adicionar validações mais avançadas no futuro (testes de
 * performance, cobertura, execução em Web Worker), basta criar uma nova etapa e incluí-la
 * na lista passada a runPipeline — sem mudar as existentes.
 *
 * Este módulo é puro (sem DOM): é usado pelo app e pelo verificador de conteúdo.
 */
import type { Exercise } from '../../types/exercise';
import type { PipelineStageName, PipelineStageReport, TsCompileOutput } from '../../types/typescriptEvaluation';
import type { EvaluationResult } from '../evaluator';
import { formatDiagnostic } from './compilerCore';

type TestCaseResult = EvaluationResult['testCaseResults'][number];

/** Compila o código (com ou sem typeAssertions). Injetado para o pipeline não depender do ambiente. */
export type CompileFn = (code: string, typeAssertions?: string) => TsCompileOutput;

export interface PipelineContext {
  readonly exercise: Exercise;
  readonly userCode: string;
  readonly compile: CompileFn;
  compiled?: TsCompileOutput;
  logs: string[];
  checks: TestCaseResult[];
  reports: PipelineStageReport[];
  /** Mensagem principal quando uma etapa interrompe o pipeline. */
  haltReason?: string;
}

export interface StageOutcome {
  passed: boolean;
  /** Interrompe as etapas seguintes. */
  halt: boolean;
}

export interface PipelineStage {
  name: PipelineStageName;
  run(ctx: PipelineContext): Promise<StageOutcome>;
}

// ---------------------------------------------------------------------------
// Sandbox de execução (mesma abordagem do avaliador de JS: new Function + console próprio)
// ---------------------------------------------------------------------------

function createConsole(logs: string[]) {
  const format = (args: unknown[]) => args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
  return {
    log: (...args: unknown[]) => logs.push(format(args)),
    error: (...args: unknown[]) => logs.push('[ERRO] ' + format(args)),
  };
}

/** Executa o JS emitido seguido de um trecho extra; aguarda Promises. */
export async function runInSandbox(js: string, extra: string, logs: string[]): Promise<unknown> {
  const runner = new Function('console', `${js}\n${extra}`);
  return Promise.resolve(runner(createConsole(logs)));
}

/** Cada teste roda no próprio escopo, para não colidir com nomes declarados pelo aluno. */
export function wrapTest(testFunction: string): string {
  return `return (function () {\n${testFunction}\n})();`;
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// ---------------------------------------------------------------------------
// Etapas
// ---------------------------------------------------------------------------

/** 1. Compilar: sintaxe e tipos, incluindo os testes de tipo (typeAssertions). */
export const compileStage: PipelineStage = {
  name: 'compilar',
  async run(ctx) {
    const compiled = ctx.compile(ctx.userCode, ctx.exercise.typeAssertions);
    ctx.compiled = compiled;
    ctx.logs.push(`Compilação TypeScript (strict) em ${compiled.durationMs} ms.`);

    const assertionLines = (ctx.exercise.typeAssertions ?? '').split('\n');
    for (const d of compiled.diagnostics) {
      if (d.origin === 'teste_de_tipo' && d.code === 2578) {
        // TS2578 = diretiva "expect-error" sem erro: o compilador aceitou algo que deveria recusar.
        const guarded = assertionLines[d.line]?.trim() ?? '';
        ctx.checks.push({
          description: 'Teste de tipo: este uso deveria ser recusado pelo compilador',
          passed: false,
          expected: 'Erro de compilação',
          output: guarded || 'O compilador aceitou o uso indevido',
        });
      } else {
        ctx.checks.push({
          description: d.origin === 'teste_de_tipo' ? 'Teste de tipo do exercício' : 'Compilação TypeScript',
          passed: false,
          error: formatDiagnostic(d),
        });
      }
    }

    if (compiled.diagnostics.length > 0) {
      const own = compiled.diagnostics.filter(d => d.origin === 'codigo').length;
      ctx.haltReason =
        own > 0
          ? `O código não compila: ${own} erro(s) de sintaxe ou de tipo. Corrija-os antes de executar.`
          : 'O código compila, mas não respeita o contrato de tipos do exercício (testes de tipo).';
      return { passed: false, halt: true };
    }
    ctx.checks.push({ description: 'Compilação TypeScript (strict)', passed: true, output: 'Sem erros de tipo' });
    return { passed: true, halt: false };
  },
};

/** 2. Executar: roda o programa uma vez (captura logs e erros de runtime). */
export const executeStage: PipelineStage = {
  name: 'executar',
  async run(ctx) {
    try {
      await runInSandbox(ctx.compiled?.js ?? '', '', ctx.logs);
      return { passed: true, halt: false };
    } catch (e) {
      ctx.checks.push({ description: 'Execução do código', passed: false, error: errorMessage(e) });
      ctx.haltReason = `O código compila, mas lança um erro ao executar: ${errorMessage(e)}`;
      return { passed: false, halt: true };
    }
  },
};

/** 3. Testar: cada testFunction contra o JS emitido. */
export const testStage: PipelineStage = {
  name: 'testar',
  async run(ctx) {
    let allPassed = true;
    for (const tc of ctx.exercise.testCases) {
      if (!tc.testFunction) continue;
      try {
        const ok = Boolean(await runInSandbox(ctx.compiled?.js ?? '', wrapTest(tc.testFunction), []));
        allPassed &&= ok;
        ctx.checks.push({
          description: tc.description,
          passed: ok,
          expected: tc.expectedOutput,
          output: ok ? tc.expectedOutput : 'Resultado diferente do esperado',
        });
      } catch (e) {
        allPassed = false;
        ctx.checks.push({ description: tc.description, passed: false, expected: tc.expectedOutput, error: errorMessage(e) });
      }
    }
    return { passed: allPassed, halt: false };
  },
};

/** 4. Regras estáticas do exercício (ex.: "não usar any"). */
export const rulesStage: PipelineStage = {
  name: 'regras',
  async run(ctx) {
    let allPassed = true;
    for (const rule of ctx.exercise.validationRules ?? []) {
      let ok = true;
      if (rule.type === 'contains') ok = ctx.userCode.includes(rule.target);
      else if (rule.type === 'not_contains') ok = !ctx.userCode.includes(rule.target);
      else if (rule.type === 'regex') ok = new RegExp(rule.target, 'i').test(ctx.userCode);
      allPassed &&= ok;
      ctx.checks.push({ description: rule.description, passed: ok, output: ok ? 'Atendido' : 'Não atendido' });
    }
    return { passed: allPassed, halt: false };
  },
};

export const DEFAULT_STAGES: readonly PipelineStage[] = [compileStage, executeStage, testStage, rulesStage];

// ---------------------------------------------------------------------------

export async function runPipeline(
  exercise: Exercise,
  userCode: string,
  compile: CompileFn,
  stages: readonly PipelineStage[] = DEFAULT_STAGES
): Promise<EvaluationResult> {
  const ctx: PipelineContext = { exercise, userCode, compile, logs: [], checks: [], reports: [] };

  for (const stage of stages) {
    const outcome = await stage.run(ctx);
    ctx.reports.push({ stage: stage.name, passed: outcome.passed, halted: outcome.halt });
    if (outcome.halt) break;
  }

  const passedCount = ctx.checks.filter(c => c.passed).length;
  const allPassed = ctx.checks.length > 0 && passedCount === ctx.checks.length;
  const scorePercent = ctx.checks.length > 0 ? Math.round((passedCount / ctx.checks.length) * 100) : 0;

  return {
    passed: allPassed,
    scorePercent,
    blankResults: [],
    logs: ctx.logs,
    testCaseResults: ctx.checks,
    diagnostics: ctx.compiled?.diagnostics ?? [],
    generalFeedback: ctx.haltReason
      ? ctx.haltReason
      : allPassed
        ? 'Parabéns! O código compila sem erros de tipo e passou em todos os testes.'
        : `${passedCount} de ${ctx.checks.length} verificações passaram. Veja os detalhes abaixo.`,
  };
}

export type Language = 'php' | 'javascript' | 'typescript';
export type Difficulty = 'basico' | 'intermediario' | 'avancado' | 'dev';
export type ExerciseType =
  | 'lacunas'
  | 'codigo_livre'
  | 'corrigir_erros'
  | 'prever_saida'
  | 'desafio_pratico'
  | 'prever_erro_de_tipo'; // só TypeScript: apontar a linha do erro e o motivo

export interface Blank {
  id: string; // e.g. "blank_0"
  label: string; // Description of what this blank represents
  placeholder?: string;
  expectedAnswers: string[]; // List of acceptable code strings
  validationRegex?: string; // Optional regex for flexible matching
  hint: string;
}

export interface TestCase {
  description: string;
  input?: string;
  expectedOutput: string;
  testFunction?: string; // JS code evaluation snippet
}

export interface AlternativeSolution {
  title: string;
  code: string;
  explanation: string;
  isRecommended?: boolean;
}

export interface UserStory {
  asA: string;
  iWant: string;
  soThat: string;
}

export interface AcceptanceCriterion {
  id: string;
  label: string;
}

/**
 * Modalidade 'prever_erro_de_tipo': o aluno lê um trecho (em `codeToPredict`) que NÃO
 * compila, aponta a linha que o compilador acusa e escolhe o motivo entre alternativas.
 * `errorLine` e `errorCode` são conferidos contra o compilador real por `npm run check:ts`.
 */
export interface TypeErrorChallenge {
  /** Linha 1-based do (único) erro que o compilador reporta. */
  errorLine: number;
  /** Código do diagnóstico, ex.: 2322 (TS2322). */
  errorCode: number;
  /** Alternativas para "por que o compilador reclama?". */
  reasonOptions: string[];
  /** Índice da alternativa correta em reasonOptions. */
  correctReason: number;
}

export interface ProjectBrief {
  clientName: string;
  poName: string;
  businessContext: string;
  userStories: UserStory[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  acceptanceCriteria: AcceptanceCriterion[];
  databaseSchema?: string;
  architectureNotes?: string;
}

export interface Exercise {
  id: string;
  language: Language;
  difficulty: Difficulty;
  type: ExerciseType;
  topic: string;
  title: string;
  summary: string;
  description: string;
  realWorldContext: string;
  goal: string;
  templateCode: string; // contains {{blank_0}} for lacunas, or starter code for free code/challenges
  blanks?: Blank[];
  solutionCode: string;
  hints: string[];
  testCases: TestCase[];
  explanation: string;
  alternativeSolutions?: AlternativeSolution[];
  projectBrief?: ProjectBrief; // For DEV module projects

  // Extensions for new exercise modalities:
  initialBuggyCode?: string; // For 'corrigir_erros'
  buggyLineNumbers?: number[]; // Lines where bug is located
  bugDescription?: string; // Context for what error occurs (e.g. fatal error, wrong total)
  
  codeToPredict?: string; // For 'prever_saida' (code snippet displayed for mental execution)
  expectedOutputPrediction?: string; // Expected exact or normalized stdout/return
  acceptableOutputPredictions?: string[]; // Multiple valid representations
  
  practicalRequirements?: string[]; // For 'desafio_pratico'

  /**
   * Só TypeScript (avaliado a partir da tarefa 2.6): código TS anexado ao do usuário
   * antes da compilação, para testar TIPOS — que não existem em runtime.
   * - Linhas comuns devem compilar (ex.: `const r: [number, number] | null = minMax([1]);`).
   * - Linhas precedidas de `// @ts-expect-error` DEVEM ser rejeitadas pelo compilador
   *   (ex.: garantir que a função não aceita `string`). Pressupõe `strict: true`.
   * - São só checadas, NUNCA executadas: o avaliador as envolve numa função que não é
   *   chamada (`function __typeAssertions() { ... }`), o que também isola o escopo.
   */
  typeAssertions?: string;

  typeErrorChallenge?: TypeErrorChallenge; // For 'prever_erro_de_tipo'
  validationRules?: Array<{
    id: string;
    description: string;
    type: 'contains' | 'not_contains' | 'regex' | 'custom_check';
    target: string;
  }>;
}

/**
 * Exercício da trilha TypeScript. O tipo amarra `id`, `language` e `difficulty`,
 * fazendo o `tsc` rejeitar IDs fora da convenção `ts-<nivel>-<slug>`
 * (ex.: `ts-basico-union-types`) ou com nível diferente do campo `difficulty`.
 * Os IDs de PHP/JS não seguem 100% o padrão e não podem mudar (o Firestore os referencia).
 */
export type TsExercise<D extends Difficulty = Difficulty> = Exercise & {
  language: 'typescript';
  difficulty: D;
  id: `ts-${D}-${string}`;
};

export interface ExerciseAttempt {
  exerciseId: string;
  passed: boolean;
  attemptsCount: number;
  completedAt?: string | null;
  lastAttemptAt: string;
  userBlanks?: Record<string, string>;
  userCode?: string;
  revealedSolution?: boolean;
  hintsUsed: number;
  checklistDone?: string[];
  outputPrediction?: string;
  /** Resposta de 'prever_erro_de_tipo' (linha escolhida e índice do motivo). */
  typeErrorAnswer?: { line: number; reason: number };
}

import { AiChallengeAttempt } from './aiChallenge';

export interface UserProgress {
  selectedLanguage: Language;
  completedIds: string[];
  attempts: Record<string, ExerciseAttempt>;
  aiChallenges?: Record<string, AiChallengeAttempt>;
  streak: {
    currentStreak: number;
    lastActiveDate: string;
    activeDates: string[];
  };
}

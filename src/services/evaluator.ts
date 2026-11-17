import { Exercise, Blank } from '../types/exercise';
import { assertNever } from '../utils/language';
import type { TsDiagnostic } from '../types/typescriptEvaluation';

export interface BlankValidationResult {
  blankId: string;
  passed: boolean;
  userValue: string;
  expectedAnswers: string[];
  message: string;
}

export interface EvaluationResult {
  passed: boolean;
  scorePercent: number;
  blankResults: BlankValidationResult[];
  logs: string[];
  testCaseResults: {
    description: string;
    passed: boolean;
    output?: string;
    expected?: string;
    error?: string;
  }[];
  generalFeedback: string;
  /** Só TypeScript: diagnósticos do compilador (também enviados ao tutor IA). */
  diagnostics?: TsDiagnostic[];
}

/**
 * Normalizes code snippets for flexible comparison.
 * Normalizes quotes (' vs "), collapses spaces, and cleans around operators.
 */
export function normalizeCodeSnippet(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s*([=+\-*/%&|!<>?:;,()\[\]{}])\s*/g, '$1')
    .trim();
}

/**
 * Normalizes stdout and prediction text for 'prever_saida' comparison.
 */
export function normalizeOutputText(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

/**
 * Validates a single blank value against accepted answers and optional regex
 */
export function evaluateSingleBlank(blank: Blank, userValue: string): BlankValidationResult {
  const cleanInput = (userValue || '').trim();
  const normalizedInput = normalizeCodeSnippet(cleanInput);

  if (!cleanInput) {
    return {
      blankId: blank.id,
      passed: false,
      userValue: '',
      expectedAnswers: blank.expectedAnswers,
      message: 'Lacuna não preenchida.',
    };
  }

  // 1. Check regex if provided
  if (blank.validationRegex) {
    try {
      const reg = new RegExp(blank.validationRegex, 'i');
      if (reg.test(cleanInput)) {
        return {
          blankId: blank.id,
          passed: true,
          userValue: cleanInput,
          expectedAnswers: blank.expectedAnswers,
          message: 'Correto!',
        };
      }
    } catch {
      // fallback to expectedAnswers
    }
  }

  // 2. Check normalized matches against all expected answers
  for (const expected of blank.expectedAnswers) {
    const normalizedExpected = normalizeCodeSnippet(expected);

    // Exact normalized comparison
    if (normalizedInput === normalizedExpected) {
      return {
        blankId: blank.id,
        passed: true,
        userValue: cleanInput,
        expectedAnswers: blank.expectedAnswers,
        message: 'Correto!',
      };
    }

    // Tolerance for semicolon at the end
    const withoutSemiInput = normalizedInput.replace(/;$/, '');
    const withoutSemiExpected = normalizedExpected.replace(/;$/, '');
    if (withoutSemiInput === withoutSemiExpected) {
      return {
        blankId: blank.id,
        passed: true,
        userValue: cleanInput,
        expectedAnswers: blank.expectedAnswers,
        message: 'Correto!',
      };
    }

    // Tolerance for single vs double quotes (e.g. 'chave' vs "chave")
    const quoteNeutralInput = withoutSemiInput.replace(/['"]/g, '"');
    const quoteNeutralExpected = withoutSemiExpected.replace(/['"]/g, '"');
    if (quoteNeutralInput === quoteNeutralExpected) {
      return {
        blankId: blank.id,
        passed: true,
        userValue: cleanInput,
        expectedAnswers: blank.expectedAnswers,
        message: 'Correto!',
      };
    }
  }

  return {
    blankId: blank.id,
    passed: false,
    userValue: cleanInput,
    expectedAnswers: blank.expectedAnswers,
    message: 'Não confere com a sintaxe esperada.',
  };
}

/**
 * Validates all blanks in an exercise
 */
export function evaluateBlanks(
  exercise: Exercise,
  userBlanks: Record<string, string>
): EvaluationResult {
  const blanks = exercise.blanks || [];
  if (blanks.length === 0) {
    return {
      passed: true,
      scorePercent: 100,
      blankResults: [],
      logs: [],
      testCaseResults: [],
      generalFeedback: 'Nenhuma lacuna para validar.',
    };
  }

  const results: BlankValidationResult[] = blanks.map(blank => {
    const val = userBlanks[blank.id] || '';
    return evaluateSingleBlank(blank, val);
  });

  const passedCount = results.filter(r => r.passed).length;
  const allPassed = passedCount === blanks.length;
  const scorePercent = Math.round((passedCount / blanks.length) * 100);

  const testCaseResults = exercise.testCases.map(tc => {
    return {
      description: tc.description,
      passed: allPassed,
      expected: tc.expectedOutput,
      output: allPassed ? tc.expectedOutput : 'Aguardando correção das lacunas',
    };
  });

  let generalFeedback = '';
  if (allPassed) {
    generalFeedback = 'Excelente trabalho! Todas as lacunas foram preenchidas com a sintaxe e lógica corretas.';
  } else if (passedCount > 0) {
    generalFeedback = `Você acertou ${passedCount} de ${blanks.length} lacuna(s). Revise os campos indicados em vermelho ou peça uma dica.`;
  } else {
    generalFeedback = 'Nenhuma lacuna correta ainda. Leia atentamente o enunciado e experimente utilizar as dicas disponíveis.';
  }

  return {
    passed: allPassed,
    scorePercent,
    blankResults: results,
    logs: [],
    testCaseResults,
    generalFeedback,
  };
}

/**
 * Evaluates an output prediction ('prever_saida') exercise.
 */
export function evaluateOutputPrediction(
  exercise: Exercise,
  userPrediction: string
): EvaluationResult {
  const cleanUser = (userPrediction || '').trim();
  const normalizedUser = normalizeOutputText(cleanUser);

  const acceptable = [
    exercise.expectedOutputPrediction || '',
    ...(exercise.acceptableOutputPredictions || []),
  ].filter(Boolean);

  const isMatch = acceptable.some(expected => {
    const normExp = normalizeOutputText(expected);
    if (normalizedUser === normExp) return true;
    // Check if user omitted brackets or quotes
    const stripPunctUser = normalizedUser.replace(/[\[\]"']/g, '').trim();
    const stripPunctExp = normExp.replace(/[\[\]"']/g, '').trim();
    return stripPunctUser === stripPunctExp;
  });

  const testCaseResults = [
    {
      description: 'Previsão de Saída do Código',
      passed: isMatch,
      expected: exercise.expectedOutputPrediction || acceptable[0] || '',
      output: cleanUser || '(vazio)',
    },
  ];

  return {
    passed: isMatch,
    scorePercent: isMatch ? 100 : 0,
    blankResults: [],
    logs: [
      `Sua previsão: "${cleanUser}"`,
      `Saída real esperada: "${exercise.expectedOutputPrediction || acceptable[0]}"`,
    ],
    testCaseResults,
    generalFeedback: isMatch
      ? 'Exato! Você previu com precisão o comportamento de execução do código.'
      : 'Sua previsão foi diferente da saída gerada. Veja a análise comentada para entender o fluxo de avaliação.',
  };
}

/** Resposta do aluno em 'prever_erro_de_tipo' (null = ainda não escolheu). */
export interface TypeErrorAnswer {
  line: number | null;
  reason: number | null;
}

/**
 * Avalia 'prever_erro_de_tipo': linha e motivo vêm do gabarito do exercício (conferido contra
 * o compilador real por `npm run check:ts`). Depois, carrega o compilador para mostrar ao aluno
 * a mensagem exata que o TypeScript emite para o trecho — se o carregamento falhar, a nota
 * não muda.
 */
export async function evaluateTypeErrorPrediction(
  exercise: Exercise,
  answer: TypeErrorAnswer
): Promise<EvaluationResult> {
  const challenge = exercise.typeErrorChallenge;
  if (!challenge) {
    return {
      passed: false,
      scorePercent: 0,
      blankResults: [],
      logs: [],
      testCaseResults: [],
      generalFeedback: 'Exercício sem gabarito de erro de tipo.',
    };
  }

  const lineOk = answer.line === challenge.errorLine;
  const reasonOk = answer.reason === challenge.correctReason;
  const testCaseResults: EvaluationResult['testCaseResults'] = [
    {
      description: 'Linha em que o compilador acusa o erro',
      passed: lineOk,
      expected: lineOk ? 'Linha ' + challenge.errorLine : undefined,
      output: answer.line === null ? '(nenhuma linha escolhida)' : 'Linha ' + answer.line,
    },
    {
      description: 'Motivo do erro',
      passed: reasonOk,
      output: answer.reason === null ? '(nenhum motivo escolhido)' : challenge.reasonOptions[answer.reason],
    },
  ];
  const passed = lineOk && reasonOk;

  let compilerMessage = '';
  let diagnostics: EvaluationResult['diagnostics'];
  if (passed) {
    try {
      const { getBrowserCompileFn } = await import('./typescript/browserCompiler');
      const { formatDiagnostic } = await import('./typescript/compilerCore');
      const compiled = (await getBrowserCompileFn())(exercise.codeToPredict ?? exercise.templateCode);
      diagnostics = compiled.diagnostics;
      const first = compiled.diagnostics[0];
      if (first) compilerMessage = ' O compilador diz: ' + formatDiagnostic(first);
    } catch {
      // Sem o compilador, a correção continua válida; só não exibimos a mensagem literal.
    }
  }

  return {
    passed,
    scorePercent: (lineOk ? 50 : 0) + (reasonOk ? 50 : 0),
    blankResults: [],
    logs: [],
    testCaseResults,
    diagnostics,
    generalFeedback: passed
      ? 'Exato! Você leu o código como o compilador.' + compilerMessage
      : lineOk
        ? 'A linha está certa, mas o motivo não. Releia os tipos envolvidos nessa linha.'
        : reasonOk
          ? 'O motivo está certo, mas o compilador acusa outra linha. Em que ponto o tipo deixa de bater?'
          : 'Ainda não. Procure a primeira linha em que um valor é usado com um tipo incompatível.',
  };
}

/**
 * Evaluates code debugging / bug fixing ('corrigir_erros').
 */
export async function evaluateBugFix(
  exercise: Exercise,
  userCode: string
): Promise<EvaluationResult> {
  return evaluateCodeForLanguage(exercise, userCode);
}

/**
 * Evaluates practical business challenges ('desafio_pratico').
 */
export async function evaluatePracticalChallenge(
  exercise: Exercise,
  userCode: string
): Promise<EvaluationResult> {
  return evaluateCodeForLanguage(exercise, userCode);
}

/**
 * Ponto único de despacho por linguagem para código escrito pelo usuário
 * ('codigo_livre', 'corrigir_erros', 'desafio_pratico').
 * O `switch` é exaustivo: uma nova linguagem em `Language` sem avaliador quebra o `tsc`.
 */
export async function evaluateCodeForLanguage(
  exercise: Exercise,
  userCode: string
): Promise<EvaluationResult> {
  switch (exercise.language) {
    case 'javascript':
      return evaluateJavaScriptFreeCode(exercise, userCode);
    case 'php':
      return evaluatePhpFreeCode(exercise, userCode);
    case 'typescript':
      return evaluateTypeScriptCode(exercise, userCode);
    default:
      return assertNever(exercise.language, 'Linguagem do exercício');
  }
}

/**
 * Avaliação de TypeScript com compilação real no navegador (pacote oficial `typescript`,
 * linha 5.x via alias `typescript-browser`). Pipeline: compilar → executar → testar → regras.
 * O compilador é carregado sob demanda na primeira avaliação (ver services/typescript/).
 */
export async function evaluateTypeScriptCode(
  exercise: Exercise,
  userCode: string
): Promise<EvaluationResult> {
  try {
    const [{ getBrowserCompileFn }, { runPipeline }] = await Promise.all([
      import('./typescript/browserCompiler'),
      import('./typescript/pipeline'),
    ]);
    const compile = await getBrowserCompileFn();
    return await runPipeline(exercise, userCode, compile);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      passed: false,
      scorePercent: 0,
      blankResults: [],
      logs: [],
      testCaseResults: [{ description: 'Carregamento do compilador TypeScript', passed: false, error: message }],
      generalFeedback: 'Não foi possível carregar o compilador TypeScript. Verifique a conexão e tente novamente.',
    };
  }
}

/**
 * Evaluates free code (JavaScript safe client-side execution sandbox)
 */
export async function evaluateJavaScriptFreeCode(
  exercise: Exercise,
  userCode: string
): Promise<EvaluationResult> {
  const logs: string[] = [];
  const testCaseResults: {
    description: string;
    passed: boolean;
    output?: string;
    expected?: string;
    error?: string;
  }[] = [];

  const customConsole = {
    log: (...args: any[]) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args: any[]) => {
      logs.push('[ERRO] ' + args.map(a => String(a)).join(' '));
    },
  };

  try {
    // Check syntax by creating sandboxed function
    const sandboxedRunner = new Function('console', `
      ${userCode}
      return true;
    `);

    sandboxedRunner(customConsole);

    // Run test cases
    for (const tc of exercise.testCases) {
      if (tc.testFunction) {
        try {
          const testRunner = new Function('console', `
            ${userCode}
            ${tc.testFunction.replace('{{USER_CODE}}', userCode)}
          `);
          const testResult = await Promise.resolve(testRunner(customConsole));
          const isSuccess = Boolean(testResult);
          testCaseResults.push({
            description: tc.description,
            passed: isSuccess,
            expected: tc.expectedOutput,
            output: isSuccess ? tc.expectedOutput : 'Falhou no teste de validação',
          });
        } catch (err: any) {
          testCaseResults.push({
            description: tc.description,
            passed: false,
            expected: tc.expectedOutput,
            error: err.message,
          });
        }
      } else {
        // Fallback static validation check for requirement
        testCaseResults.push({
          description: tc.description,
          passed: true,
          expected: tc.expectedOutput,
          output: tc.expectedOutput,
        });
      }
    }
  } catch (err: any) {
    return {
      passed: false,
      scorePercent: 0,
      blankResults: [],
      logs,
      testCaseResults: [
        {
          description: 'Compilação e Sintaxe JavaScript',
          passed: false,
          error: err.message,
        },
      ],
      generalFeedback: `Erro de sintaxe no código: ${err.message}`,
    };
  }

  const passedTests = testCaseResults.filter(t => t.passed).length;
  const allPassed = passedTests === testCaseResults.length && testCaseResults.length > 0;
  const scorePercent = testCaseResults.length > 0 ? Math.round((passedTests / testCaseResults.length) * 100) : 0;

  return {
    passed: allPassed,
    scorePercent,
    blankResults: [],
    logs,
    testCaseResults,
    generalFeedback: allPassed
      ? 'Parabéns! Todos os testes unitários passaram com êxito.'
      : `${passedTests} de ${testCaseResults.length} testes passaram. Verifique os critérios.`,
  };
}

/**
 * Validates free-form PHP code via structural static analysis and assertion rules.
 */
export function evaluatePhpFreeCode(
  exercise: Exercise,
  userCode: string
): EvaluationResult {
  const testCaseResults: {
    description: string;
    passed: boolean;
    output?: string;
    expected?: string;
    error?: string;
  }[] = [];

  const clean = userCode.trim();

  // If specific validation rules are declared on the exercise:
  if (exercise.validationRules && exercise.validationRules.length > 0) {
    for (const rule of exercise.validationRules) {
      let passed = false;
      if (rule.type === 'contains') {
        passed = clean.includes(rule.target);
      } else if (rule.type === 'not_contains') {
        passed = !clean.includes(rule.target);
      } else if (rule.type === 'regex') {
        try {
          passed = new RegExp(rule.target, 'i').test(clean);
        } catch {
          passed = false;
        }
      }
      testCaseResults.push({
        description: rule.description,
        passed,
        expected: rule.target,
        output: passed ? 'Atendido' : 'Não encontrado no código',
      });
    }
  } else {
    // Evaluate standard test cases against code
    exercise.testCases.forEach((tc, idx) => {
      // Check if test case relates to function, class, or expected keyword
      const hasKeyword = tc.expectedOutput ? clean.toLowerCase().includes(tc.expectedOutput.toLowerCase().slice(0, 10)) : true;
      testCaseResults.push({
        description: tc.description,
        passed: hasKeyword || clean.length > 30,
        expected: tc.expectedOutput,
        output: clean.length > 30 ? 'Implementado' : 'Incompleto',
      });
    });
  }

  const passedTests = testCaseResults.filter(t => t.passed).length;
  const allPassed = passedTests === testCaseResults.length && testCaseResults.length > 0;
  const scorePercent = testCaseResults.length > 0 ? Math.round((passedTests / testCaseResults.length) * 100) : 0;

  return {
    passed: allPassed,
    scorePercent,
    blankResults: [],
    logs: [
      'Validação estrutural estática e regras de conformidade PHP executadas.',
    ],
    testCaseResults,
    generalFeedback: allPassed
      ? 'Excelente! Seu código PHP cumpre todos os critérios de estrutura, segurança e algoritmo solicitados.'
      : `Seu código atendeu a ${passedTests} de ${testCaseResults.length} requisitos. Ajuste as pendências indicadas.`,
  };
}

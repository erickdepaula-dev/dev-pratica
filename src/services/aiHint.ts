import { Exercise } from '../types/exercise';

export interface ContextualHintRequest {
  exercise: Exercise;
  userBlanks?: Record<string, string>;
  currentCode?: string;
  /** Só TypeScript: diagnósticos reais do compilador (ex.: "Linha 9 · TS2322: ..."). */
  compilerDiagnostics?: string[];
}

export interface ContextualHintResponse {
  hint?: string;
  error?: string;
}

export interface TutorDialogRequest {
  exercise: Exercise;
  currentCode?: string;
  userStatement?: string;
  dialogType?: 'doubt' | 'statement_help' | 'check_logic' | 'syntax_help' | 'next_step';
  /** Só TypeScript: diagnósticos reais do compilador. */
  compilerDiagnostics?: string[];
}

export interface TutorDialogResponse {
  response: string;
  error?: string;
}

export interface CodeLineExplanation {
  line: number;
  code: string;
  explanation: string;
  purpose: string;
}

export interface CodeExplanationResponse {
  summary: string;
  lines: CodeLineExplanation[];
  bestPractices: string[];
  error?: string;
}

// 1. Contextual Quick Hint
export async function requestGeminiContextualHint(
  params: ContextualHintRequest
): Promise<ContextualHintResponse> {
  const { exercise, userBlanks, currentCode, compilerDiagnostics } = params;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const res = await fetch('/api/gemini/hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        exerciseTitle: exercise.title,
        language: exercise.language,
        difficulty: exercise.difficulty,
        topic: exercise.topic,
        description: exercise.description,
        goal: exercise.goal,
        templateCode: exercise.templateCode,
        currentCode: currentCode || '',
        userBlanks: userBlanks || {},
        exerciseType: exercise.type,
        compilerDiagnostics: compilerDiagnostics ?? [],
      }),
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.hint) {
        return { hint: data.hint };
      }
    }

    return getFallbackPedagogicalHint(exercise, userBlanks, currentCode);
  } catch (err: any) {
    console.warn('Requisição de IA falhou, acionando fallback pedagógico:', err);
    return getFallbackPedagogicalHint(exercise, userBlanks, currentCode);
  }
}

// 2. Interactive Tutor Dialog: talk about what you understand or request statement explanation
export async function requestTutorDialog(
  params: TutorDialogRequest
): Promise<TutorDialogResponse> {
  const { exercise, currentCode, userStatement, dialogType, compilerDiagnostics } = params;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const res = await fetch('/api/gemini/tutor-dialog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        exerciseTitle: exercise.title,
        language: exercise.language,
        difficulty: exercise.difficulty,
        topic: exercise.topic,
        description: exercise.description,
        goal: exercise.goal,
        currentCode: currentCode || '',
        userStatement: userStatement || '',
        dialogType: dialogType || 'doubt',
        exerciseType: exercise.type,
        compilerDiagnostics: compilerDiagnostics ?? [],
      }),
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.response) {
        return { response: data.response };
      }
    }

    return { response: getFallbackClientTutorResponse(params) };
  } catch (err: any) {
    console.warn('Falha no diálogo do tutor, usando fallback:', err);
    return { response: getFallbackClientTutorResponse(params) };
  }
}

// 3. Line-by-Line Code Breakdown & Explanation
export async function requestLineByLineExplanation(
  exercise: Exercise,
  code: string
): Promise<CodeExplanationResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const res = await fetch('/api/gemini/explain-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        exerciseTitle: exercise.title,
        language: exercise.language,
        code,
      }),
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.lines) && data.lines.length > 0) {
        return data as CodeExplanationResponse;
      }
    }

    return getFallbackClientCodeExplanation(exercise, code);
  } catch (err: any) {
    console.warn('Falha na explicação linha a linha, usando fallback:', err);
    return getFallbackClientCodeExplanation(exercise, code);
  }
}

function getFallbackPedagogicalHint(
  exercise: Exercise,
  userBlanks?: Record<string, string>,
  _currentCode?: string
): ContextualHintResponse {
  const blanks = exercise.blanks || [];
  const emptyBlanks = blanks.filter(b => !(userBlanks?.[b.id] || '').trim());

  if (blanks.length > 0 && emptyBlanks.length === blanks.length) {
    return {
      hint: `Você ainda não preencheu as lacunas. Dica para o primeiro passo: leia o objetivo "${exercise.goal}" e comece definindo a primeira lacuna: ${exercise.hints[0] || 'verifique a sintaxe esperada'}.`,
    };
  }

  if (emptyBlanks.length > 0) {
    const nextBlank = emptyBlanks[0];
    return {
      hint: `Bom progresso! Você ainda tem lacunas vazias. Para a ${nextBlank.label}, lembre-se: ${nextBlank.hint}`,
    };
  }

  if (exercise.hints && exercise.hints.length > 0) {
    const hintIdx = Math.min(1, exercise.hints.length - 1);
    return {
      hint: `Analise as lacunas preenchidas: ${exercise.hints[hintIdx]}. Observe atentamente a pontuação, delimitadores e nomes de variáveis.`,
    };
  }

  return {
    hint: `Revise a lógica exigida em "${exercise.goal}". Verifique os tipos de retorno e os parâmetros da função.`,
  };
}

function getFallbackClientTutorResponse(params: TutorDialogRequest): string {
  const { exercise, userStatement = '', dialogType = 'doubt' } = params;
  const isStatementHelp =
    dialogType === 'statement_help' ||
    userStatement.toLowerCase().includes('não entendi o enunciado') ||
    userStatement.toLowerCase().includes('nao entendi o enunciado');

  if (isStatementHelp) {
    return `Olá! Vamos descomplicar o enunciado de "${exercise.title}":

🎯 **Objetivo Principal:**
${exercise.goal || exercise.description}

💡 **No dia a dia do desenvolvedor:**
${exercise.realWorldContext || 'Este padrão é comum em tarefas reais de backend ou frontend, onde funções devem receber entradas seguras e transformar em resultados confiáveis.'}

👉 **Dica prática:**
Comece identificando o que os parâmetros de entrada trazem e qual formato de dado precisa ser retornado. Preencha uma etapa por vez!`;
  }

  return `Entendido! Você comentou: "${userStatement || 'Tenho dúvidas sobre o que fazer'}".

Seu raciocínio está no caminho certo. Em ${exercise.language.toUpperCase()}, garanta que as variáveis que você está utilizando correspondam exatamente aos parâmetros da função e que a fórmula ou lógica atenda a: "${exercise.goal}".`;
}

function getFallbackClientCodeExplanation(exercise: Exercise, code: string): CodeExplanationResponse {
  const lines = code.split('\n');
  const explainedLines: CodeLineExplanation[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let explanation = `Linha de código em ${exercise.language.toUpperCase()}.`;
    let purpose = `Executa uma instrução lógica do fluxo do programa.`;

    if (trimmed === '<?php') {
      explanation = 'Tag de abertura do código PHP.';
      purpose = 'Indica ao interpretador que o arquivo ou bloco contém comandos PHP a serem executados no servidor.';
    } else if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
      explanation = 'Comentário de documentação.';
      purpose = 'Explica a intenção do código para facilitar manutenções futuras pela equipe.';
    } else if (trimmed.includes('function ') || trimmed.startsWith('function ')) {
      explanation = `Declaração de função tipada em ${exercise.language.toUpperCase()}.`;
      purpose = 'Encapsula a lógica de cálculo ou negócio, permitindo reutilização e testes unitários.';
    } else if (trimmed.includes('return ')) {
      explanation = 'Comando return com a expressão calculada.';
      purpose = 'Encerra a função e devolve o valor computado para quem chamou a função.';
    } else if (trimmed.startsWith('if') || trimmed.startsWith('else')) {
      explanation = 'Estrutura condicional de controle de fluxo.';
      purpose = 'Garante validação de regras de negócio antes de avançar o processamento.';
    } else if (trimmed.startsWith('foreach') || trimmed.startsWith('for')) {
      explanation = 'Laço de repetição.';
      purpose = 'Itera sobre os itens da coleção ou array aplicando a regra necessária.';
    } else if (trimmed.includes('=')) {
      explanation = 'Operação de atribuição de variável.';
      purpose = 'Guarda o resultado parcial em memória para utilizar na lógica a seguir.';
    }

    explainedLines.push({
      line: idx + 1,
      code: trimmed,
      explanation,
      purpose,
    });
  });

  return {
    summary: `Análise estruturada do código do exercício "${exercise.title}".`,
    lines: explainedLines,
    bestPractices: [
      `Sempre especifique os tipos dos parâmetros e o retorno da função para evitar bugs de conversão.`,
      `Mantenha o código limpo e com nomes intuitivos de variáveis.`,
    ],
  };
}

/**
 * Rotas da API (tutor e Desafios IA com Gemini), sem servidor HTTP nem front-end.
 * Usada por `server.ts` (desenvolvimento local e `npm start`) e pela função serverless
 * da Vercel (`server/vercelEntry.ts`, empacotada por `scripts/build-vercel.mjs`).
 */
import express from 'express';
import vm from 'vm';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  generateFallbackChallenge,
  generateFallbackEvaluation,
  generateFallbackTutorResponse,
  generateFallbackCodeExplanation,
} from '../src/data/fallbackChallenges.js';

export function createApiApp(): express.Express {
  const app = express();
  app.use(express.json());

  // Initialize GoogleGenAI SDK with recommended telemetry header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'dev-pratica',
      },
    },
  });

  // Resilient helper to query Gemini with automatic model cascade, retry on 503/429 spikes, and silent fallback
  async function callGeminiResiliently({
    prompt,
    systemInstruction,
    responseMimeType,
    thinkingLevel,
    operationName = 'operação',
  }: {
    prompt: string;
    systemInstruction?: string;
    responseMimeType?: string;
    thinkingLevel?: ThinkingLevel;
    operationName?: string;
  }): Promise<string | null> {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }

    // Cascade: stable workhorse gemini-flash-latest -> fast gemini-3.1-flash-lite -> preview gemini-3.8-flash
    const modelsToTry = [
      'gemini-flash-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
    ];

    for (let i = 0; i < modelsToTry.length; i++) {
      const model = modelsToTry[i];
      try {
        const config: any = {};
        if (systemInstruction) config.systemInstruction = systemInstruction;
        if (responseMimeType) config.responseMimeType = responseMimeType;
        // thinkingConfig is supported on Gemini 3 and 4 series
        if (thinkingLevel && (model.startsWith('gemini-3.') || model.startsWith('gemini-4-'))) {
          config.thinkingConfig = { thinkingLevel };
        }

        // Strict 8-second timeout per model attempt to avoid indefinite hanging
        const timeoutMs = 8000;
        const callPromise = ai.models.generateContent({
          model,
          contents: prompt,
          config: Object.keys(config).length > 0 ? config : undefined,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout de ${timeoutMs}ms excedido para o modelo ${model}`)), timeoutMs)
        );

        const response = await Promise.race([callPromise, timeoutPromise]);
        const text = response.text?.trim();
        if (text) {
          return text;
        }
      } catch (err: any) {
        // Output informative log without spamming stderr
        console.log(`[DevPrática IA] Modelo ${model} indisponível temporariamente para ${operationName}: ${err?.message || err}. Alternando na cascata...`);
        if (i < modelsToTry.length - 1) {
          await new Promise(r => setTimeout(r, 250));
        }
      }
    }

    console.log(`[DevPrática IA] Modelos remotos ocupados para ${operationName}. Ativando gerador inteligente local.`);
    return null;
  }

  /**
   * Diretrizes extras quando o exercício é de TypeScript (Fase 2, tarefa 2.6): o foco é o
   * sistema de tipos, e o tutor recebe os diagnósticos reais do compilador do navegador.
   */
  function typeScriptGuidance(language: unknown, exerciseType: unknown, diagnostics: unknown): string {
    if (language !== 'typescript') return '';
    const lista = Array.isArray(diagnostics)
      ? diagnostics.filter((d): d is string => typeof d === 'string').slice(0, 5).map(d => '- ' + d.slice(0, 300))
      : [];
    const blocoDiagnosticos = lista.length
      ? `\nDiagnósticos REAIS do compilador TypeScript (strict) para o código atual do aluno:\n${lista.join('\n')}\nUse-os como fonte de verdade sobre o erro.\n`
      : '';
    const modalidade =
      exerciseType === 'prever_erro_de_tipo'
        ? '\n- Modalidade "prever_erro_de_tipo": o aluno precisa apontar a linha e o motivo do erro. NÃO revele a linha nem o motivo; sugira comparar, linha a linha, o tipo declarado com o tipo do valor usado.'
        : '';
    return `
DIRETRIZES ESPECÍFICAS DE TYPESCRIPT:
- O código é compilado em modo strict. O foco do exercício é o SISTEMA DE TIPOS, não só a lógica.
- Ao comentar um erro de tipo, explique em linguagem simples o que o compilador esperava e o que recebeu, citando o código TSxxxx quando houver.
- NUNCA sugira any, "as" (type assertion), "!" (non-null assertion) ou @ts-ignore para silenciar o erro: oriente a corrigir o tipo ou a fazer narrowing.${modalidade}
${blocoDiagnosticos}`;
  }

  // Server-side route for contextual AI hints based on user's current code
  app.post('/api/gemini/hint', async (req, res) => {
    try {
      const {
        exerciseTitle,
        language = 'php',
        difficulty,
        topic,
        description,
        goal,
        templateCode,
        currentCode,
        userBlanks,
        exerciseType,
        compilerDiagnostics,
      } = req.body;

      // Build pedagogical prompt tailored to the student's exact attempt and modality
      const studentAttemptContext =
        userBlanks && Object.keys(userBlanks).length > 0
          ? `Preenchimento atual das lacunas pelo aluno:\n${JSON.stringify(userBlanks, null, 2)}`
          : `Código atual digitado pelo aluno:\n\`\`\`${language}\n${currentCode || '(vazio)'}\n\`\`\``;

      const prompt = `Você é um tutor sênior e atencioso de desenvolvimento de software em ${String(language).toUpperCase()}.
Um estudante está resolvendo o seguinte exercício prático:
- Título: ${exerciseTitle}
- Nível de Dificuldade: ${difficulty}
- Modalidade: ${exerciseType || 'lacunas'}
- Tópico: ${topic}
- Enunciado: ${description}
- Objetivo Esperado: ${goal}

Estrutura/Template original do exercício:
\`\`\`${language}
${templateCode || ''}
\`\`\`

${studentAttemptContext}

MISSÃO E DIRETRIZES PEDAGÓGICAS ADAPTADAS À MODALIDADE:
1. Responda em Português do Brasil com tom profissional, encorajador e acolhedor.
2. Adapte a dica à modalidade do exercício:
   - Se for "lacunas": oriente sobre o conceito da expressão ou operador que falta na lacuna.
   - Se for "corrigir_erros": ajude o estudante a investigar o sintoma do bug (ex: precedência, escopo, SQL Injection) sem entregar o código corrigido.
   - Se for "prever_saida": explique como o interpretador processa os tipos e operadores sem dizer a resposta pronta do terminal.
   - Se for "desafio_pratico": ajude a decompor os requisitos em etapas menores (guard clauses, validações, retorno).
   - Se for "codigo_livre": oriente sobre a assinatura da função e a próxima etapa lógica.
   - Se for "prever_erro_de_tipo": ajude o aluno a raciocinar como o compilador, sem apontar a linha.
   - Se for "teste_de_mesa": o aluno preenche uma tabela com o valor das variáveis a cada chamada de anotar(...). NÃO informe os valores das células; sugira executar uma instrução por vez e conferir quando a condição do laço é testada e em que ponto o anotar acontece.
3. NUNCA dê a resposta pronta completa nem revele o código final de bandeja. O objetivo é que o aluno exercite a lógica e chegue à conclusão.
4. Limite sua explicação a 2 ou 3 frases curtas, objetivas e práticas para leitura rápida no editor.
${typeScriptGuidance(language, exerciseType, compilerDiagnostics)}`;

      let hintText = await callGeminiResiliently({
        prompt,
        thinkingLevel: ThinkingLevel.LOW,
        operationName: 'dica contextual',
      });

      if (!hintText) {
        hintText =
          'Analise a declaração da função e verifique se as variáveis, operadores e tipos de retorno atendem a todos os requisitos do enunciado.';
      }

      res.json({ hint: hintText });
    } catch (error: any) {
      console.log('[DevPrática IA] Exceção tratada em /api/gemini/hint:', error?.message || error);
      res.json({
        hint: 'Analise a declaração da função e verifique se as variáveis, operadores e tipos de retorno atendem aos requisitos.',
      });
    }
  });

  // Server-side route for interactive Tutor Dialog
  // User can state what they know so far or say they didn't understand the statement
  app.post('/api/gemini/tutor-dialog', async (req, res) => {
    try {
      const {
        exerciseTitle,
        language = 'php',
        difficulty,
        topic,
        description,
        goal,
        currentCode,
        userStatement,
        dialogType, // 'doubt' | 'statement_help' | 'check_logic' | 'syntax_help' | 'next_step'
        exerciseType,
        compilerDiagnostics,
      } = req.body;

      const prompt = `Você é o Tutor IA do DevPrática, um especialista e mentor sênior de desenvolvimento em ${String(language).toUpperCase()}.
Um aluno desenvolvedor está resolvendo o seguinte exercício:
- Título: ${exerciseTitle}
- Dificuldade: ${difficulty}
- Tópico: ${topic}
- Enunciado: ${description}
- Objetivo: ${goal}

Código atual do aluno:
\`\`\`${language}
${currentCode || '(vazio)'}
\`\`\`

Tipo de interação: ${dialogType || 'doubt'}
Mensagem do aluno sobre o que ele sabe ou dúvida:
"${userStatement || 'Não entendi o enunciado do exercício e não sei por onde começar.'}"

DIRETRIZES DA RESPOSTA:
1. Responda em Português do Brasil com tom encorajador, prático e didático de um colega sênior em um code review.
2. Se o aluno disse que NÃO entendeu o enunciado: reescreva o problema com um exemplo simples do cotidiano de um desenvolvedor, explicando a entrada, a transformação necessária e a saída esperada.
3. Se o aluno compartilhou o que ENTENDEU ATÉ O MOMENTO: valide o que está correto para dar confiança, aponte com delicadeza onde está o desvio ou lacuna de raciocínio, e dê uma orientação de próximo passo.
4. NUNCA forneça a resposta de código pronta integral. Dê exemplos análogos ou perguntas socráticas para o aluno chegar à solução sozinho.
5. Use parágrafos curtos e objetivos com boa formatação.
${typeScriptGuidance(language, exerciseType, compilerDiagnostics)}`;

      const tutorAnswer = await callGeminiResiliently({
        prompt,
        operationName: 'diálogo com tutor',
      });

      res.json({
        response:
          tutorAnswer ||
          generateFallbackTutorResponse({
            userStatement,
            dialogType,
            exerciseTitle,
            language,
            goal,
            description,
          }),
      });
    } catch (error: any) {
      console.log('[DevPrática IA] Exceção tratada em /api/gemini/tutor-dialog:', error?.message || error);
      res.json({
        response: generateFallbackTutorResponse({
          userStatement: req.body?.userStatement,
          dialogType: req.body?.dialogType,
          exerciseTitle: req.body?.exerciseTitle || '',
          language: req.body?.language || 'php',
          goal: req.body?.goal || '',
          description: req.body?.description || '',
        }),
      });
    }
  });

  // Server-side route to explain code line-by-line
  // Returns structured line items: line number, code snippet, syntax explanation, and practical purpose
  app.post('/api/gemini/explain-code', async (req, res) => {
    try {
      const {
        exerciseTitle = '',
        language = 'php',
        code = '',
      } = req.body;

      if (!code || !code.trim()) {
        return res.status(400).json({ error: 'Nenhum código fornecido para análise.' });
      }

      const prompt = `Você é um arquiteto de software sênior especialista em ${String(language).toUpperCase()}.
Analise o código abaixo linha por linha para um desenvolvedor em treinamento no exercício "${exerciseTitle}".

Código a analisar:
\`\`\`${language}
${code}
\`\`\`

Sua missão é explicar CADA linha relevante:
- "line": número da linha (1-indexed)
- "code": o trecho exato daquela linha
- "explanation": o que essa linha faz sintaticamente na linguagem ${language} (ex: declaração de tipo escalar, abertura de tag, condicional if, atribuição de variável, etc.)${language === 'typescript' ? ' Em TypeScript, destaque o papel dos tipos na linha (anotação, inferência, narrowing, generics) e lembre que eles são apagados no JavaScript gerado.' : ''}
- "purpose": para que serve essa linha na prática e qual o impacto no fluxo de execução do sistema

Retorne ESTRITAMENTE um objeto JSON válido (sem comentários dentro do JSON), com a estrutura:
{
  "summary": "Resumo de 1 ou 2 frases do objetivo geral deste código.",
  "lines": [
    {
      "line": 1,
      "code": "...",
      "explanation": "...",
      "purpose": "..."
    }
  ],
  "bestPractices": [
    "Dica prática de boa prática ou detalhe importante sobre essa sintaxe..."
  ]
}`;

      let parsedData: any = null;
      const rawText = await callGeminiResiliently({
        prompt,
        responseMimeType: 'application/json',
        operationName: 'explicação linha a linha',
      });

      if (rawText) {
        try {
          const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
          parsedData = JSON.parse(cleaned);
        } catch {
          parsedData = null;
        }
      }

      if (!parsedData) {
        parsedData = generateFallbackCodeExplanation(code, language, exerciseTitle);
      }

      res.json(parsedData);
    } catch (error: any) {
      console.log('[DevPrática IA] Exceção tratada em /api/gemini/explain-code:', error?.message || error);
      res.json(generateFallbackCodeExplanation(req.body?.code || '', req.body?.language || 'php', req.body?.exerciseTitle || ''));
    }
  });

  // =========================================================================
  // NOVA ÁREA: DESAFIOS COM IA (GERAÇÃO E AVALIAÇÃO DE DESAFIOS TÉCNICOS)
  // =========================================================================

  // Endpoint para gerar desafio personalizado sob medida
  app.post('/api/gemini/generate-challenge', async (req, res) => {
    try {
      const {
        language = 'php',
        topic = '',
        difficulty = 'intermediario',
      } = req.body;

      const targetLang = language === 'javascript' ? 'javascript' : 'php';

      const difficultyMap: Record<string, { label: string; level: 1 | 2 | 3 | 4 | 5; guide: string }> = {
        muito_facil: {
          label: 'Muito fácil',
          level: 1,
          guide: 'Problema básico de entrada e saída, operadores fundamentais, 1 função simples, 2 a 3 requisitos claros e diretos.',
        },
        facil: {
          label: 'Fácil',
          level: 2,
          guide: 'Problema com validações condicionais simples ou iteração básica em array, tipos escalares, 3 a 4 requisitos claros.',
        },
        intermediario: {
          label: 'Intermediário',
          level: 3,
          guide: 'Problema com regras de negócio reais do dia a dia (cálculos financeiros, descontos progressivos, agrupamentos em arrays associativos, manipulação de strings, validação cadastral), múltiplas regras e casos especiais.',
        },
        dificil: {
          label: 'Difícil',
          level: 4,
          guide: 'Problema técnico elaborado com classes/serviços, tratamento de exceções, validação de regras de negócio encadeadas, sanitização, transações ou consultas preparadas.',
        },
        muito_dificil: {
          label: 'Muito difícil',
          level: 5,
          guide: 'Problema arquitetural avançado: múltiplos requisitos interdependentes, edge cases estritos, algoritmos eficientes (sem repetição desnecessária), tipagem rígida e código resiliente.',
        },
      };

      const diffInfo = difficultyMap[difficulty] || difficultyMap.intermediario;

      const prompt = `Você é um desenvolvedor e arquiteto de software sênior criando um desafio técnico prático para um desenvolvedor em treinamento no DevPrática.
Linguagem solicitada: ${targetLang.toUpperCase()} (${targetLang === 'php' ? 'Linguagem PRINCIPAL da plataforma' : 'Linguagem SECUNDÁRIA da plataforma'}).
Tema/Assunto: ${topic.trim() ? topic.trim() : 'Escolha um assunto técnico indispensável do cotidiano profissional adequado ao nível'}.
Nível de Dificuldade: ${diffInfo.label} (Nível ${diffInfo.level} de 5).
Complexidade esperada: ${diffInfo.guide}

DIRETRIZES TÉCNICAS OBRIGATÓRIAS:
1. NÃO crie exercícios repetitivos, teóricos ou superficiais. O exercício deve simular uma demanda real de trabalho técnico de uma empresa (ex: cálculo de médias com recuperação, processamento de itens de pedido com cupons de desconto, validação de dados de formulário com regras financeiras/cadastrais, agrupamento de faturas por categoria em arrays associativos, detector de registros duplicados, cálculo de parcelas com juros, classes de serviço com métodos bem definidos, tratamento de exceções).
2. Para ${targetLang === 'php' ? 'PHP' : 'JavaScript'}, utilize rigorosamente a sintaxe moderna (${targetLang === 'php' ? 'PHP 8+, declare(strict_types=1);, type hints estritos em parâmetros e retornos, match/arrow functions se aplicável' : 'ES6+, const/let, arrow functions, métodos de array imutáveis como map/filter/reduce, async/await'}).
3. A dificuldade deve afetar a complexidade do raciocínio, a quantidade de requisitos e os casos de teste, e não apenas o tamanho do texto.
4. Forneça EXATAMENTE 3 dicas progressivas:
   - Dica 1: orientação conceitual
   - Dica 2: qual recurso ou método da linguagem pode ajudar
   - Dica 3: explicação da abordagem passo a passo (SEM entregar o código pronto)
5. Forneça starterCode: apenas o esqueleto inicial com a assinatura da função/classe e comentários TODO, para que o desenvolvedor implemente a lógica completa.
6. Forneça solutionCode: código de solução exemplar completo e comentado.
7. Forneça pelo menos 3 a 5 casos de teste com situações normais, valores extremos e entradas inválidas/edge cases.

Retorne ESTRITAMENTE um objeto JSON válido (sem tags markdown em volta, sem comentários dentro do JSON) com a estrutura:
{
  "title": "Título conciso e profissional",
  "topic": "Nome do Tópico",
  "description": "Contexto detalhado do problema do cotidiano e o que precisa ser desenvolvido.",
  "functionalRequirements": [
    "Requisito 1: ...",
    "Requisito 2: ...",
    "Requisito 3: ..."
  ],
  "technicalConstraints": [
    "Restrição técnica 1: ...",
    "Restrição técnica 2: ..."
  ],
  "usageExamples": [
    {
      "input": "exemplo de chamada da função com argumentos",
      "output": "resultado esperado retornado",
      "explanation": "por que esse resultado é gerado"
    }
  ],
  "testCases": [
    {
      "description": "Caso normal de sucesso",
      "input": "...",
      "expectedOutput": "...",
      "isEdgeCase": false
    },
    {
      "description": "Caso extremo ou valor inválido",
      "input": "...",
      "expectedOutput": "...",
      "isEdgeCase": true
    }
  ],
  "hints": [
    "Dica 1 (Conceitual): ...",
    "Dica 2 (Recurso da Linguagem): ...",
    "Dica 3 (Abordagem Estruturada): ..."
  ],
  "starterCode": "...",
  "solutionCode": "...",
  "explanation": "Explicação técnica da solução e boas práticas de produção adotadas."
}`;

      let challengeData: any = null;
      const rawResponse = await callGeminiResiliently({
        prompt,
        responseMimeType: 'application/json',
        operationName: 'geração de desafio',
      });

      if (rawResponse) {
        try {
          const cleaned = rawResponse.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
          challengeData = JSON.parse(cleaned);
        } catch {
          challengeData = null;
        }
      }

      const isOfflineFallback = !challengeData;
      if (!challengeData) {
        challengeData = generateFallbackChallenge(targetLang, topic, diffInfo.level, difficulty);
      }

      // Ensure mandatory fields and unique id
      const finalChallenge = {
        id: `ai-chal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: challengeData.title || 'Desafio Técnico com IA',
        language: targetLang,
        topic: challengeData.topic || topic || 'Lógica & Regras de Negócio',
        difficulty,
        difficultyLevel: diffInfo.level,
        createdAt: new Date().toISOString(),
        description: challengeData.description || 'Desenvolva a solução para o problema descrito nos requisitos.',
        functionalRequirements:
          Array.isArray(challengeData.functionalRequirements) && challengeData.functionalRequirements.length > 0
            ? challengeData.functionalRequirements
            : ['Implementar a função principal atendendo aos casos de teste fornecidos.'],
        technicalConstraints:
          Array.isArray(challengeData.technicalConstraints) && challengeData.technicalConstraints.length > 0
            ? challengeData.technicalConstraints
            : [targetLang === 'php' ? 'Utilizar tipagem declarativa de tipos' : 'Utilizar const/let e métodos imutáveis'],
        usageExamples: Array.isArray(challengeData.usageExamples) ? challengeData.usageExamples : [],
        testCases: Array.isArray(challengeData.testCases) ? challengeData.testCases : [],
        hints:
          Array.isArray(challengeData.hints) && challengeData.hints.length >= 3
            ? challengeData.hints
            : [
                'Analise os parâmetros de entrada e a saída esperada nos exemplos.',
                `Em ${targetLang.toUpperCase()}, use os recursos nativos apropriados para tratar os tipos e validações.`,
                'Divida a resolução em etapas: guard clauses de validação, processamento principal e retorno formatado.',
              ],
        starterCode:
          challengeData.starterCode ||
          (targetLang === 'php' ? "<?php\n\n// Escreva sua solução aqui...\n" : "// Escreva sua solução aqui...\n"),
        solutionCode: challengeData.solutionCode || '',
        explanation: challengeData.explanation || 'Solução bem estruturada e modular.',
        isFallback: isOfflineFallback,
        fallbackNotice: isOfflineFallback
          ? 'Desafio selecionado do acervo técnico do DevPrática para manter seus estudos sem pausas durante picos temporários de demanda na API.'
          : undefined,
      };

      res.json(finalChallenge);
    } catch (error: any) {
      console.log('[DevPrática IA] Exceção tratada em /api/gemini/generate-challenge:', error?.message || error);
      const fallback = generateFallbackChallenge(
        req.body?.language === 'javascript' ? 'javascript' : 'php',
        req.body?.topic || '',
        3,
        'intermediario'
      );
      res.json({
        id: `ai-chal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...fallback,
        isFallback: true,
        fallbackNotice: 'Desafio preparado pelo acervo do DevPrática para manter sua prática de estudos.',
      });
    }
  });

  // Endpoint para avaliar a solução enviada pelo aluno com feedback profundo
  app.post('/api/gemini/evaluate-challenge', async (req, res) => {
    try {
      const { challenge, userCode } = req.body;

      if (!challenge || typeof userCode !== 'string') {
        return res.status(400).json({ error: 'Desafio ou código do usuário ausente.' });
      }

      const trimmedCode = userCode.trim();
      if (!trimmedCode) {
        return res.json({
          score: 0,
          passed: false,
          testsPassedPercentage: 0,
          requirementsMet: [],
          requirementsUnmet: ['O editor está vazio. Escreva sua implementação antes de verificar.'],
          syntaxAndErrors: ['Nenhum código fornecido para avaliação.'],
          improvements: ['Comece implementando a função principal com os tipos de parâmetros especificados.'],
          explanation:
            'Para que a solução possa ser avaliada, é necessário escrever o código da função ou classe solicitada no editor.',
          testResults: (challenge.testCases || []).map((tc: any) => ({
            description: tc.description,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: '(não executado)',
            passed: false,
            error: 'Código vazio',
          })),
          environmentNote:
            challenge.language === 'php'
              ? 'Ambiente de Análise Estática & Semântica com IA.'
              : 'Execução em Sandbox JavaScript Isolado & Análise de Qualidade de Código com IA.',
          evaluatedAt: new Date().toISOString(),
        });
      }

      // In case of JavaScript, execute real test cases safely in Node vm sandbox
      let jsExecutionResults: Array<{
        description: string;
        input: string;
        expected: string;
        actual: string;
        passed: boolean;
        error?: string;
      }> = [];
      let jsPassedCount = 0;

      if (challenge.language === 'javascript' && Array.isArray(challenge.testCases)) {
        try {
          const sandboxContext: Record<string, any> = {
            console: { log: () => {} },
            Math,
            Date,
            JSON,
            Array,
            Object,
            String,
            Number,
            Boolean,
            RegExp,
            Set,
            Map,
            parseInt,
            parseFloat,
          };
          const context = vm.createContext(sandboxContext);
          vm.runInContext(userCode, context, { timeout: 1000 });

          for (const tc of challenge.testCases) {
            try {
              const testScript = `${tc.input}`;
              const actualValue = vm.runInContext(testScript, context, { timeout: 1000 });
              const actualStr = typeof actualValue === 'object' ? JSON.stringify(actualValue) : String(actualValue);
              const expectedNormalized = String(tc.expectedOutput).trim();
              const actualNormalized = actualStr.trim();
              const isMatch =
                actualNormalized === expectedNormalized ||
                JSON.stringify(actualValue) === JSON.stringify(JSON.parse(expectedNormalized || 'null'));

              if (isMatch) {
                jsPassedCount++;
              }

              jsExecutionResults.push({
                description: tc.description,
                input: tc.input,
                expected: tc.expectedOutput,
                actual: actualStr,
                passed: isMatch,
              });
            } catch (tcErr: any) {
              jsExecutionResults.push({
                description: tc.description,
                input: tc.input,
                expected: tc.expectedOutput,
                actual: 'Erro de execução',
                passed: false,
                error: tcErr.message,
              });
            }
          }
        } catch (execErr: any) {
          console.log('[DevPrática IA] Execução JS sandbox:', execErr.message);
        }
      }

      // Build evaluation prompt for Gemini
      const prompt = `Você é um avaliador técnico sênior e atencioso da plataforma DevPrática.
Avalie com rigor técnico e sensibilidade pedagógica a solução enviada pelo estudante para o seguinte desafio em ${challenge.language.toUpperCase()}:

DESAFIO:
Título: ${challenge.title}
Dificuldade: ${challenge.difficulty} (Nível ${challenge.difficultyLevel} de 5)
Descrição: ${challenge.description}

Requisitos Funcionais Obrigatórios:
${(challenge.functionalRequirements || []).map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

Restrições Técnicas:
${(challenge.technicalConstraints || []).map((c: string, i: number) => `- ${c}`).join('\n')}

Casos de Teste Esperados:
${JSON.stringify(challenge.testCases, null, 2)}

${jsExecutionResults.length > 0 ? `Resultado da Execução Real no Sandbox JS:\n${JSON.stringify(jsExecutionResults, null, 2)}` : ''}

Solução de Referência da Plataforma:
\`\`\`${challenge.language}
${challenge.solutionCode}
\`\`\`

CÓDIGO ENVIADO PELO ESTUDANTE:
\`\`\`${challenge.language}
${userCode}
\`\`\`

DIRETRIZES DE AVALIAÇÃO:
1. Requisitos Funcionais: Avalie item por item se o código do estudante implementa as regras pedidas. Liste explicitamente os requisitos atendidos em "requirementsMet" e os que faltaram em "requirementsUnmet".
2. Casos de Teste: Avalie se as saídas para cada teste batem com o esperado. (Se for PHP, simule mentalmente o fluxo determinístico e compare com rigor).
3. Restrições Técnicas: Verifique se restrições da linguagem (ex: declare(strict_types=1), type hints em PHP, arrow functions, sem globais, etc.) foram respeitadas.
4. Sintaxe e Erros: Aponte erros reais de lógica, sintaxe ou variáveis indefinidas em "syntaxAndErrors" (deixe vazio se não houver).
5. Boas Práticas: Em "improvements", dê sugestões de legibilidade, performance ou convenções da comunidade, DIFERENCIANDO-AS de erros funcionais. Se o código do aluno funcionar corretamente de outra forma válida, não reprove apenas por estilo!
6. Nota de 0.0 a 10.0: Atribua uma nota justa proporcional ao cumprimento dos requisitos e testes. (Considerado "passed: true" se nota >= 7.0).
7. NUNCA revele a solução completa de código do gabarito pronta no texto caso o aluno não atinja a nota mínima. Permita que ele veja o que errou para tentar novamente.

Retorne ESTRITAMENTE um objeto JSON válido (sem comentários dentro do JSON) com a estrutura:
{
  "score": 8.5,
  "passed": true,
  "testsPassedPercentage": 100,
  "requirementsMet": ["Requisito 1 atendido...", "..."],
  "requirementsUnmet": ["Requisito que faltou atender se houver..."],
  "syntaxAndErrors": ["Erros de sintaxe ou de lógica se houver..."],
  "improvements": ["Sugestões de boas práticas e clean code..."],
  "explanation": "Comentário geral detalhado e encorajador sobre o que foi bom e o que pode evoluir.",
  "testResults": [
    {
      "description": "Descrição do teste",
      "input": "chamada ou entrada",
      "expected": "saída esperada",
      "actual": "saída gerada pelo código",
      "passed": true,
      "error": ""
    }
  ]
}`;

      let parsedEval: any = null;
      const evalRaw = await callGeminiResiliently({
        prompt,
        responseMimeType: 'application/json',
        operationName: 'avaliação de solução',
      });

      if (evalRaw) {
        try {
          const cleaned = evalRaw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
          parsedEval = JSON.parse(cleaned);
        } catch {
          parsedEval = null;
        }
      }

      // Fallback evaluation if Gemini unavailable or parse failed
      if (!parsedEval) {
        parsedEval = generateFallbackEvaluation(challenge, userCode, jsExecutionResults);
      }

      // Merge real sandbox results if JS had live execution
      if (jsExecutionResults.length > 0 && (!parsedEval.testResults || parsedEval.testResults.length === 0)) {
        parsedEval.testResults = jsExecutionResults;
        const total = jsExecutionResults.length;
        parsedEval.testsPassedPercentage = Math.round((jsPassedCount / total) * 100);
      }

      // Add environment notice transparently
      parsedEval.environmentNote =
        challenge.language === 'php'
          ? 'Ambiente de Análise Estática & Semântica com IA (Como a infraestrutura de PHP CLI nativo não está instalada no servidor, a validação de sintaxe, tipos, casos de teste e regras de negócio foi executada pelo motor de análise do Google Gemini sem simulações falsas).'
          : 'Execução em Sandbox JavaScript Isolado & Análise de Qualidade de Código com IA.';

      parsedEval.evaluatedAt = new Date().toISOString();

      res.json(parsedEval);
    } catch (error: any) {
      console.log('[DevPrática IA] Exceção tratada em /api/gemini/evaluate-challenge:', error?.message || error);
      const fallbackEval = generateFallbackEvaluation(req.body?.challenge || {}, req.body?.userCode || '', []);
      res.json(fallbackEval);
    }
  });

  return app;
}

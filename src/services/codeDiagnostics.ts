/**
 * Diagnóstico de falhas em exercícios de código livre.
 *
 * Quando um teste falha, "Falhou no teste de validação" não ajuda ninguém: diz o que
 * aconteceu, não por quê. Este módulo procura as duas causas estruturais que respondem pela
 * maior parte das reprovações no nível básico — a função não existe, ou existe e não devolve
 * nada — e devolve uma frase que aponta o erro.
 *
 * O princípio é não errar o diagnóstico: toda checagem é feita de modo que a dúvida leve ao
 * silêncio (nenhum diagnóstico, feedback genérico) em vez de a uma afirmação errada. Dizer
 * "falta o return" para quem já escreveu o return é pior do que não dizer nada.
 */

/** Identificador JavaScript válido — só este formato pode ser interpolado na sondagem. */
const IDENTIFICADOR = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export type CausaDaFalha = 'funcao-ausente' | 'sem-retorno';

export interface DiagnosticoDeCodigo {
  causa: CausaDaFalha;
  /** Explicação completa, para o resumo da avaliação. */
  mensagem: string;
  /** Versão curta, para a linha de cada teste reprovado. */
  resumo: string;
}

/** O que a sondagem descobre sobre a função dentro do escopo do aluno. */
export interface SondaDeFuncao {
  existe: boolean;
  /** `Function.prototype.toString()` da função, quando ela existe. */
  fonte: string | null;
}

/** O que a solução de referência declara: muda quais checagens fazem sentido. */
export type FormaDoAlvo = 'funcao' | 'classe';

export interface AlvoDoExercicio {
  nome: string;
  forma: FormaDoAlvo;
}

/**
 * O que o exercício espera que o aluno declare, lido da solução de referência.
 *
 * Cobre `function nome(...)`, `function nome<T>(...)` (genérico de TypeScript, em que o nome
 * não encosta no parêntese), `const nome = (...) => ...` e `class Nome`.
 */
export function alvoDoExercicio(solutionCode: string): AlvoDoExercicio | null {
  const declaracao = solutionCode.match(
    /\bfunction\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*(?:<[^(]*>)?\s*\(/,
  );
  const atribuicao = solutionCode.match(
    /\b(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(?:async\s+)?(?:function\b|<|\()/,
  );
  const classe = solutionCode.match(/\bclass\s+([A-Za-z_$][A-Za-z0-9_$]*)\b/);

  const nome = declaracao?.[1] ?? atribuicao?.[1] ?? classe?.[1];
  if (!nome || !IDENTIFICADOR.test(nome)) return null;

  const forma: FormaDoAlvo = !declaracao && !atribuicao && classe ? 'classe' : 'funcao';
  return { nome, forma };
}

/** Compatibilidade: só o nome, quando a forma não importa. */
export function nomeDaFuncaoEsperada(solutionCode: string): string | null {
  return alvoDoExercicio(solutionCode)?.nome ?? null;
}

/**
 * Trecho a executar no mesmo escopo do código do aluno. Usa `typeof`, que não lança quando o
 * identificador nem foi declarado — por isso a sondagem funciona mesmo com a função ausente.
 */
export function codigoDaSonda(nome: string): string {
  if (!IDENTIFICADOR.test(nome)) {
    throw new Error(`Nome de função inválido para sondagem: ${nome}`);
  }
  return `return (function () {
    if (typeof ${nome} !== 'function') return { existe: false, fonte: null };
    return { existe: true, fonte: String(${nome}) };
  })();`;
}

/** Converte o retorno cru da sondagem no formato esperado, sem confiar no que veio. */
export function lerSonda(bruto: unknown): SondaDeFuncao | null {
  if (typeof bruto !== 'object' || bruto === null) return null;
  const obj = bruto as { existe?: unknown; fonte?: unknown };
  if (typeof obj.existe !== 'boolean') return null;
  return { existe: obj.existe, fonte: typeof obj.fonte === 'string' ? obj.fonte : null };
}

/**
 * A função devolve algum valor?
 *
 * Procura a palavra `return` e, se não achar, o corpo de expressão de uma arrow
 * (`(a, b) => a + b`), que devolve sem escrever `return`. Um `return` dentro de comentário ou
 * de string contaria como retorno — e tudo bem: o erro cai para o lado de não diagnosticar.
 */
function devolveValor(fonte: string): boolean {
  if (/\breturn\b/.test(fonte)) return true;
  const semPrefixo = fonte.replace(/^\s*(?:async\s+)?/, '');
  return /=>\s*[^{\s]/.test(semPrefixo);
}

/**
 * Cruza a sondagem com a solução de referência e devolve a causa, quando houver uma certa.
 *
 * A checagem de retorno só vale quando a própria solução devolve algo: é o que garante que o
 * exercício realmente espera um retorno, em vez de supor isso.
 */
export function diagnosticar(
  alvo: AlvoDoExercicio | string,
  sonda: SondaDeFuncao | null,
  solutionCode: string,
): DiagnosticoDeCodigo | null {
  if (!sonda) return null;
  const { nome, forma }: AlvoDoExercicio =
    typeof alvo === 'string' ? { nome: alvo, forma: 'funcao' } : alvo;

  if (!sonda.existe) {
    const rotulo = forma === 'classe' ? 'a classe' : 'a função';
    return {
      causa: 'funcao-ausente',
      resumo: `${forma === 'classe' ? 'A classe' : 'A função'} ${nome} não foi encontrada`,
      mensagem:
        `O seu código não define ${rotulo} \`${nome}\`. Os testes usam exatamente esse nome, ` +
        `então uma letra diferente ou um acento a mais já bastam para não ser encontrada.`,
    };
  }

  // "Falta o return" não se aplica a uma classe: o que os testes chamam são os métodos dela,
  // e cada um tem o seu próprio contrato. Aqui a sondagem não tem como decidir.
  if (forma === 'classe') return null;

  const solucaoDevolve = devolveValor(solutionCode);
  if (solucaoDevolve && sonda.fonte && !devolveValor(sonda.fonte)) {
    return {
      causa: 'sem-retorno',
      resumo: 'A função não devolveu valor (undefined)',
      mensagem:
        `A função \`${nome}\` faz o cálculo, mas não devolve o resultado: falta o \`return\`. ` +
        `Sem ele, quem chama a função recebe \`undefined\` — por isso todos os testes falham ao ` +
        `mesmo tempo, mesmo com a conta certa.`,
    };
  }

  return null;
}

/** Texto do resumo da avaliação, juntando o diagnóstico (quando há) à contagem de testes. */
export function resumoDaAvaliacao(
  passaram: number,
  total: number,
  diagnostico: DiagnosticoDeCodigo | null,
): string {
  const contagem = `${passaram} de ${total} ${total === 1 ? 'teste passou' : 'testes passaram'}.`;
  return diagnostico ? `${diagnostico.mensagem} (${contagem})` : `${contagem} Verifique os critérios.`;
}

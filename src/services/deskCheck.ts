/**
 * Teste de mesa (Fase 4.5) — núcleo puro, usado pelo app e por `npm run check:ts`.
 *
 * O gabarito vem da execução do próprio código do exercício: `anotar(...)` registra uma linha
 * da tabela a cada chamada. Assim o gabarito nunca fica dessincronizado do código mostrado.
 */
import type { DeskCheckChallenge } from '../types/exercise';

/** Converte um valor registrado por `anotar(...)` no texto que o aluno digitaria. */
export function formatDeskCheckValue(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(formatDeskCheckValue).join(', ')}]`;
  if (typeof value === 'string') return value;
  return String(value);
}

/**
 * Executa o código e devolve as linhas da tabela (uma por chamada de `anotar`).
 * Lança erro se o código falhar ou se alguma linha tiver um número de valores diferente do
 * número de colunas — os dois casos são defeito do exercício, não do aluno.
 */
export function runDeskCheck(challenge: DeskCheckChallenge): string[][] {
  const rows: string[][] = [];
  const anotar = (...values: unknown[]): void => {
    rows.push(values.map(formatDeskCheckValue));
  };
  // Código do próprio exercício (conteúdo versionado), não do aluno.
  const run = new Function('anotar', `"use strict";\n${challenge.code}`) as (fn: typeof anotar) => void;
  run(anotar);
  rows.forEach((row, index) => {
    if (row.length !== challenge.columns.length) {
      throw new Error(`linha ${index + 1} tem ${row.length} valores, mas a tabela tem ${challenge.columns.length} colunas`);
    }
  });
  return rows;
}

/** Quantas linhas vêm preenchidas como exemplo (limitado ao total de linhas). */
export function givenRowCount(challenge: DeskCheckChallenge, totalRows: number): number {
  return Math.min(Math.max(challenge.givenRows ?? 1, 0), totalRows);
}

/**
 * Normaliza uma célula para comparação: ignora espaços e aspas em volta, aceita vírgula
 * decimal ("2,5"), ignora maiúsculas em true/false e espaços dentro de listas ("[1,2]").
 */
export function normalizeDeskCheckCell(raw: string): string {
  let text = raw.trim();
  if (text.length >= 2 && /^(['"`]).*\1$/.test(text)) text = text.slice(1, -1).trim();
  if (/^-?\d+,\d+$/.test(text)) text = text.replace(',', '.');
  if (/^(true|false|verdadeiro|falso)$/i.test(text)) {
    return /^(true|verdadeiro)$/i.test(text) ? 'true' : 'false';
  }
  if (text.startsWith('[') && text.endsWith(']')) text = text.replace(/\s+/g, '');
  return text;
}

/** Compara a resposta do aluno com o valor esperado (números com tolerância). */
export function deskCheckCellMatches(answer: string, expected: string): boolean {
  const a = normalizeDeskCheckCell(answer);
  const e = normalizeDeskCheckCell(expected);
  if (a === '') return false;
  const na = Number(a);
  const ne = Number(e);
  if (!Number.isNaN(na) && !Number.isNaN(ne) && a !== '' && e !== '') {
    return Math.abs(na - ne) < 1e-9;
  }
  return a === e;
}

/** Achata/desachata a tabela (o Firestore não aceita array de arrays). */
export function flattenDeskCheck(rows: string[][]): string[] {
  return rows.flat();
}

export function unflattenDeskCheck(cells: string[] | undefined, rowCount: number, columnCount: number): string[][] {
  return Array.from({ length: rowCount }, (_, r) =>
    Array.from({ length: columnCount }, (_, c) => cells?.[r * columnCount + c] ?? '')
  );
}

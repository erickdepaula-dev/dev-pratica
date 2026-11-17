import { Language } from '../types/exercise';

/**
 * Lista de todas as trilhas, na ordem de exibição.
 * O `satisfies` + a checagem abaixo garantem que a lista e o tipo `Language`
 * nunca saiam de sincronia: adicionar uma linguagem ao tipo sem incluí-la aqui
 * (ou vice-versa) quebra o `npm run lint`.
 */
export const LANGUAGES = ['php', 'javascript', 'typescript'] as const satisfies readonly Language[];

type MissingFromList = Exclude<Language, (typeof LANGUAGES)[number]>;
// Se este tipo deixar de ser `never`, falta alguma linguagem em LANGUAGES.
const _languageListIsExhaustive: MissingFromList extends never ? true : never = true;
void _languageListIsExhaustive;

/** Type guard para valores vindos de fora (localStorage, Firestore, JSON importado). */
export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

/**
 * Exaustividade em `switch`: chame no `default`. Se um novo membro for adicionado
 * à union e não for tratado, o `tsc` acusa erro aqui.
 */
export function assertNever(value: never, context = 'valor'): never {
  throw new Error(`${context} não tratado: ${String(value)}`);
}

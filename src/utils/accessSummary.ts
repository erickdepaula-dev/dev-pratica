import type { AccessEntry, AccessSummary } from '../types/accessLog';

/** Agrupa por e-mail: total de acessos, primeiro e último. Ordenado pelo último acesso. */
export function resumirAcessos(acessos: AccessEntry[]): AccessSummary[] {
  const porEmail = new Map<string, AccessSummary>();
  for (const a of acessos) {
    const atual = porEmail.get(a.email);
    if (!atual) {
      porEmail.set(a.email, { email: a.email, nome: a.nome, total: 1, ultimo: a.em, primeiro: a.em });
      continue;
    }
    atual.total += 1;
    if (a.em && (!atual.ultimo || a.em > atual.ultimo)) {
      atual.ultimo = a.em;
      if (a.nome) atual.nome = a.nome;
    }
    if (a.em && (!atual.primeiro || a.em < atual.primeiro)) atual.primeiro = a.em;
  }
  return [...porEmail.values()].sort((x, y) => (y.ultimo?.getTime() ?? 0) - (x.ultimo?.getTime() ?? 0));
}

/**
 * Registro de acesso (aba Admin): quem entrou e quando. Gravado no Firestore em `acessos/{id}`;
 * só o administrador lê (regra em firestore.rules), cada usuário só grava o próprio acesso.
 */
export type AccessKind = 'login' | 'retorno';

export interface AccessEntry {
  id: string;
  uid: string;
  email: string;
  nome: string;
  /** 'login' = clicou em Entrar; 'retorno' = voltou ao site já conectado (sessão salva). */
  tipo: AccessKind;
  /** Hora do servidor do Firestore; null enquanto o servidor não confirma. */
  em: Date | null;
}

/** Resumo por e-mail para a tabela da aba Admin. */
export interface AccessSummary {
  email: string;
  nome: string;
  total: number;
  ultimo: Date | null;
  primeiro: Date | null;
}

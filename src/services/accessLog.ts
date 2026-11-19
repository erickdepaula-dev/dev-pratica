import { addDoc, collection, getDocsFromServer, limit, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebase';
import type { AccessEntry, AccessKind } from '../types/accessLog';

/**
 * Registro de acessos para a aba Admin. Regras em firestore.rules (`match /acessos/{acessoId}`):
 * qualquer usuário conectado só CRIA o próprio registro (uid e e-mail do token); só o e-mail do
 * administrador LÊ. O e-mail do administrador não fica no código (o repositório é público): ele
 * só existe nas regras publicadas no console do Firebase. Ver docs/DEPLOY.md.
 */
const COLECAO = 'acessos';
const CHAVE_LOGIN_EM_ANDAMENTO = 'devpratica_login_em_andamento';
const chaveRegistrado = (uid: string) => `devpratica_acesso_registrado_${uid}`;

function lerSessao(chave: string): string | null {
  try {
    return sessionStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravarSessao(chave: string, valor: string | null): void {
  try {
    if (valor === null) sessionStorage.removeItem(chave);
    else sessionStorage.setItem(chave, valor);
  } catch {
    /* modo privado sem sessionStorage: registra a cada carregamento, sem problema */
  }
}

/** Chamado logo antes de abrir o login do Google: o próximo acesso conta como 'login'. */
export function marcarLoginEmAndamento(): void {
  gravarSessao(CHAVE_LOGIN_EM_ANDAMENTO, '1');
}

/** Ao sair: o próximo acesso nesta aba volta a ser registrado. */
export function esquecerAcessoDaAba(uid: string): void {
  gravarSessao(chaveRegistrado(uid), null);
}

/** O login foi cancelado ou falhou: o próximo acesso não deve contar como 'login'. */
export function limparLoginEmAndamento(): void {
  gravarSessao(CHAVE_LOGIN_EM_ANDAMENTO, null);
}

/**
 * Registra o acesso uma vez por aba (sessionStorage), quando o Firebase confirma o usuário.
 * Falhas são ignoradas: o registro nunca pode atrapalhar o uso do app.
 */
export async function registrarAcesso(user: User): Promise<void> {
  if (!user.email) return;
  // Clicar em Entrar sempre registra; voltar já conectado registra uma vez por aba (sem contar
  // cada recarregamento da página).
  const emLogin = lerSessao(CHAVE_LOGIN_EM_ANDAMENTO) !== null;
  if (!emLogin && lerSessao(chaveRegistrado(user.uid))) return;
  const tipo: AccessKind = emLogin ? 'login' : 'retorno';
  gravarSessao(chaveRegistrado(user.uid), '1');
  gravarSessao(CHAVE_LOGIN_EM_ANDAMENTO, null);
  try {
    await addDoc(collection(db, COLECAO), {
      uid: user.uid,
      email: user.email,
      nome: (user.displayName ?? '').slice(0, 120),
      tipo,
      em: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Não foi possível registrar o acesso:', error);
  }
}

/** Lê os acessos mais recentes. Só funciona para o administrador (as regras recusam os demais). */
export async function listarAcessos(maximo = 500): Promise<AccessEntry[]> {
  const snap = await getDocsFromServer(query(collection(db, COLECAO), orderBy('em', 'desc'), limit(maximo)));
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      uid: String(data.uid ?? ''),
      email: String(data.email ?? ''),
      nome: String(data.nome ?? ''),
      tipo: data.tipo === 'login' ? 'login' : 'retorno',
      em: data.em instanceof Timestamp ? data.em.toDate() : null,
    };
  });
}

/**
 * O usuário conectado é o administrador? Descobre tentando ler um registro: só o administrador
 * tem permissão. Assim o app não precisa conhecer o e-mail do administrador.
 */
export async function verificarAdmin(): Promise<boolean> {
  try {
    // Do servidor, nunca do cache: sem conexão (ou sem permissão) a resposta tem de ser "não".
    await getDocsFromServer(query(collection(db, COLECAO), limit(1)));
    return true;
  } catch {
    return false;
  }
}

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase.config';

const app = initializeApp(firebaseConfig);

// O id do banco vem da configuração (o projeto atual usa "(default)"; o do AI Studio não usava).
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Resultado de uma tentativa de login.
 * - `ok`: autenticado, o usuário vem no campo `user`.
 * - `cancelado`: o usuário fechou ou dispensou a janela; não é erro.
 * - `redirecionando`: o pop-up foi bloqueado e caímos no fluxo de redirecionamento.
 *   A página vai sair do ar em seguida; quem chamou não deve esperar por mais nada.
 */
export type LoginOutcome =
  | { status: 'ok'; user: User }
  | { status: 'cancelado' }
  | { status: 'redirecionando' };

const CODIGOS_DE_CANCELAMENTO = [
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled',
];

// Quando o pop-up não é uma opção, o redirecionamento é o caminho oficial do Firebase.
const CODIGOS_SEM_POPUP = [
  'auth/popup-blocked',
  'auth/operation-not-supported-in-this-environment',
];

export async function loginWithGoogle(): Promise<LoginOutcome> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { status: 'ok', user: result.user };
  } catch (error: any) {
    const code = error?.code;

    if (CODIGOS_DE_CANCELAMENTO.includes(code)) {
      return { status: 'cancelado' };
    }

    if (CODIGOS_SEM_POPUP.includes(code)) {
      // Sai desta página para a tela do Google e volta autenticado. O resultado é
      // recolhido por consumeRedirectLogin() quando o app monta de novo, e o
      // onAuthStateChanged dispara com o usuário já pronto.
      marcarRedirecionamentoPendente();
      await signInWithRedirect(auth, googleProvider);
      return { status: 'redirecionando' };
    }

    console.warn('Tentativa de autenticação não concluída:', error?.message || error);
    throw error;
  }
}

/**
 * Recolhe o resultado de um login por redirecionamento, se houver um pendente.
 * Deve ser chamada uma vez quando o app monta: é só aqui que os erros do fluxo de
 * redirecionamento aparecem (domínio não autorizado, por exemplo) — sem esta chamada
 * eles se perdem em silêncio e o usuário volta à tela de login sem explicação.
 *
 * Devolve `null` quando não houve redirecionamento, que é o caso normal.
 */
export async function consumeRedirectLogin(): Promise<User | null> {
  const estavaRedirecionando = consumirRedirecionamentoPendente();
  const result = await getRedirectResult(auth);
  if (result?.user) return result.user;
  if (estavaRedirecionando) {
    // Saímos para o Google e voltamos sem usuário e sem erro: o navegador descartou a sessão
    // no caminho (bloqueio de armazenamento de terceiros — authDomain ≠ domínio do app).
    // Sem este aviso, o usuário simplesmente "volta deslogado" sem explicação.
    await auth.authStateReady();
    if (!auth.currentUser) {
      throw Object.assign(new Error('Retorno do Google sem sessão'), { code: 'app/redirect-sem-sessao' });
    }
  }
  return null;
}

// Marca, só nesta aba, que um login por redirecionamento começou (sessionStorage pode falhar
// em modo privado — nesse caso apenas não há aviso).
const CHAVE_REDIRECIONAMENTO = 'devpratica_login_redirect_pendente';

function marcarRedirecionamentoPendente(): void {
  try {
    sessionStorage.setItem(CHAVE_REDIRECIONAMENTO, '1');
  } catch {
    /* sem sessionStorage: segue sem o aviso */
  }
}

function consumirRedirecionamentoPendente(): boolean {
  try {
    const pendente = sessionStorage.getItem(CHAVE_REDIRECIONAMENTO) === '1';
    sessionStorage.removeItem(CHAVE_REDIRECIONAMENTO);
    return pendente;
  } catch {
    return false;
  }
}

export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao sair do Firebase:', error);
    throw error;
  }
}

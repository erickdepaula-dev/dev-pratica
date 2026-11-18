/**
 * Configuração do Firebase do projeto `dev-pratica` (projeto próprio do usuário, criado em 2026-11-18;
 * antes era o projeto do AI Studio `gen-lang-client-0954454406`, sem acesso ao console).
 *
 * Estes valores não são segredo: a configuração web do Firebase vai no bundle e chega ao
 * navegador de qualquer visitante. O que protege os dados são as regras do Firestore
 * (`firestore.rules`) e os domínios autorizados no Firebase Auth — nunca o sigilo da apiKey.
 * Por isso os valores ficam versionados, e o app funciona sem nenhuma variável de ambiente.
 *
 * Para apontar para outro projeto do Firebase (um ambiente de teste, por exemplo), defina as
 * variáveis `VITE_FIREBASE_*` — cada uma sobrepõe o valor padrão abaixo. Ver `.env.example`.
 */
export interface FirebaseProjectConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId: string;
  /** Id do banco do Firestore, passado ao getFirestore(). O projeto próprio usa "(default)". */
  firestoreDatabaseId: string;
}

const env = import.meta.env;

/**
 * Usa a variável de ambiente quando ela existe e não está vazia; senão, o padrão do projeto.
 * Recebe `unknown` porque o que vem de `import.meta.env` não tem tipo garantido: uma variável
 * ausente é `undefined`, e um `.env` mal escrito pode entregar qualquer coisa.
 */
function valor(daEnv: unknown, padrao: string): string {
  const limpo = typeof daEnv === 'string' ? daEnv.trim() : '';
  return limpo !== '' ? limpo : padrao;
}

export const firebaseConfig: FirebaseProjectConfig = {
  apiKey: valor(env.VITE_FIREBASE_API_KEY, "AIzaSyD5WfcZyn6EDdbqqLiRF20MvJgVDoNl3gs"),
  authDomain: valor(env.VITE_FIREBASE_AUTH_DOMAIN, "dev-pratica.firebaseapp.com"),
  projectId: valor(env.VITE_FIREBASE_PROJECT_ID, "dev-pratica"),
  appId: valor(env.VITE_FIREBASE_APP_ID, "1:1082635470502:web:48c4beb92c763ba9271667"),
  storageBucket: valor(env.VITE_FIREBASE_STORAGE_BUCKET, "dev-pratica.firebasestorage.app"),
  messagingSenderId: valor(env.VITE_FIREBASE_MESSAGING_SENDER_ID, "1082635470502"),
  measurementId: valor(env.VITE_FIREBASE_MEASUREMENT_ID, "G-CRZ63SDN26"),
  firestoreDatabaseId: valor(env.VITE_FIREBASE_FIRESTORE_DATABASE_ID, "(default)"),
};

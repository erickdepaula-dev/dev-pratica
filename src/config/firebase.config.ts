/**
 * Configuração do Firebase do projeto.
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
  /** O Firestore deste projeto não usa o banco "(default)"; o id vai no getFirestore(). */
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
  apiKey: valor(env.VITE_FIREBASE_API_KEY, "AIzaSyDqB0t8V3o55XtCImL543Gy8CeRJJc176Q"),
  authDomain: valor(env.VITE_FIREBASE_AUTH_DOMAIN, "gen-lang-client-0954454406.firebaseapp.com"),
  projectId: valor(env.VITE_FIREBASE_PROJECT_ID, "gen-lang-client-0954454406"),
  appId: valor(env.VITE_FIREBASE_APP_ID, "1:455733755566:web:0bfddf685b25c23578773f"),
  storageBucket: valor(env.VITE_FIREBASE_STORAGE_BUCKET, "gen-lang-client-0954454406.firebasestorage.app"),
  messagingSenderId: valor(env.VITE_FIREBASE_MESSAGING_SENDER_ID, "455733755566"),
  measurementId: valor(env.VITE_FIREBASE_MEASUREMENT_ID, ""),
  firestoreDatabaseId: valor(env.VITE_FIREBASE_FIRESTORE_DATABASE_ID, "ai-studio-devprticaphpjs-eabcb68f-1feb-48e1-9cf3-cb910e1446c7"),
};

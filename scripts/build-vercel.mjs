/**
 * Build para a Vercel (Build Output API v3) — roda em `npm run build:vercel`, configurado
 * como buildCommand no vercel.json. Gera .vercel/output com:
 * - static/: o front (saída do `vite build` em dist/);
 * - functions/api.func: a API Express (server/vercelEntry.ts) empacotada num arquivo só;
 * - config.json: /api/* vai para a função; o resto é arquivo estático ou cai no index.html (SPA).
 *
 * Empacotar aqui (em vez de deixar a Vercel compilar TS) evita depender do pacote `typescript`
 * do projeto, que é o TS 7 nativo e não tem a API JS que o builder da Vercel usa.
 */
import { build } from 'esbuild';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

const out = '.vercel/output';
// Domínio do Firebase Hosting do projeto (o handler de login fica em /__/auth/handler).
const FIREBASE_AUTH_HOST = process.env.FIREBASE_AUTH_HOST || 'dev-pratica.firebaseapp.com';
rmSync(out, { recursive: true, force: true });

// Front-end (o `vite build` já rodou antes deste script)
mkdirSync(`${out}/static`, { recursive: true });
cpSync('dist', `${out}/static`, { recursive: true });

// Função serverless com a API
const fn = `${out}/functions/api.func`;
await build({
  entryPoints: ['server/vercelEntry.ts'],
  outfile: `${fn}/index.js`,
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  footer: { js: 'module.exports = module.exports.default;' },
  logLevel: 'info',
});
// O projeto é "type": "module"; a função é CommonJS e precisa declarar isso na própria pasta.
writeFileSync(`${fn}/package.json`, JSON.stringify({ type: 'commonjs' }));
writeFileSync(
  `${fn}/.vc-config.json`,
  JSON.stringify({ runtime: 'nodejs22.x', handler: 'index.js', launcherType: 'Nodejs', maxDuration: 60 }, null, 2),
);

writeFileSync(
  `${out}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Login do Firebase servido pelo próprio domínio do site (proxy para o handler do Firebase).
        // Necessário para o login por redirecionamento em navegadores que bloqueiam armazenamento de
        // terceiros; só tem efeito quando o authDomain da configuração aponta para o domínio do site.
        // Ver docs/DEPLOY.md, "Login com Google: pop-up e redirecionamento".
        { src: '^/__/(auth|firebase)/(.*)$', dest: `https://${FIREBASE_AUTH_HOST}/__/$1/$2` },
        { src: '^/api/(.*)$', dest: '/api' },
        { handle: 'filesystem' },
        { src: '/(.*)', dest: '/index.html' },
      ],
    },
    null,
    2,
  ),
);
console.log('Saída da Vercel gerada em .vercel/output');

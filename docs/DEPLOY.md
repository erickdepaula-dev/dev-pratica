# 🚀 Deploy na Vercel

> O app é publicado na Vercel e **atualiza sozinho a cada push na `main`** (deploy de produção).
> Push em outra branch gera um deploy de *preview* com URL própria.

---

## Como funciona

| Parte | Na Vercel | Código |
| :--- | :--- | :--- |
| Front (React + Vite) | Arquivos estáticos | `npm run build` → `dist/` |
| API do tutor e dos Desafios IA (`/api/gemini/*`) | Uma função serverless (Node 22, até 60 s) | `server/apiApp.ts`, entrada em `server/vercelEntry.ts` |
| Roteamento | `/api/*` → função; arquivo existente → estático; o resto → `index.html` (SPA) | `scripts/build-vercel.mjs` |

- O `vercel.json` define a instalação (`npm install --legacy-peer-deps`) e o build (`npm run build:vercel`).
- O `build:vercel` roda o `vite build` e depois empacota a API com esbuild num arquivo só. A saída vai para
  `.vercel/output`, no formato *Build Output API v3*.
- Por que empacotar no build: o pacote `typescript` do projeto é o TS 7 nativo, que não tem a API JS
  que o compilador padrão da Vercel usa para funções em TS.
- Localmente nada muda: o `npm run dev` continua usando o `server.ts`, que monta a mesma API com o Vite.

Para testar o build da Vercel localmente:

```bash
npm run build:vercel
```

A saída vai para `.vercel/output/`, que é ignorada pelo Git.

---

## Estado atual

- **Projeto:** `dev-pratica` no time *deverickpaulawork's projects* (`prj_D2YTXmWX73W2uRD1sRpSWiB6VQ9S`),
  ligado ao GitHub `erickdepaula-dev/dev-pratica`, branch de produção `main`. Criado em 2026-11-18
  pela API da Vercel (o conector MCP da Vercel nesta sessão é só leitura).
- **Produção:** https://dev-pratica.vercel.app
- **Falta (usuário):** a variável `GEMINI_API_KEY` no projeto (passo 4 abaixo) e liberar os domínios no
  Firebase (passo 6) — **é por isso que o "Entrar" dá erro no site**.

## Configuração inicial (referência — os passos 1–3 e 5 já foram feitos)

1. Acesse **https://vercel.com/new**, com o time *deverickpaulawork's projects* selecionado.
2. Em *Import Git Repository*, escolha **`erickdepaula-dev/dev-pratica`** e clique em **Import**.
3. Em *Framework Preset*, deixe **Other**. **Não altere** os comandos de Build e Install: o
   `vercel.json` já os define.
4. Abra **Environment Variables** e adicione a variável a seguir. Ela é opcional: sem ela, o tutor usa
   respostas prontas.
   - `GEMINI_API_KEY` = sua chave do Gemini (marque *Production* e *Preview*).
5. Clique em **Deploy**. Ao terminar, a Vercel mostra a URL, por exemplo `https://dev-pratica.vercel.app`.
6. **Libere os domínios no Firebase**, senão o login com Google falha com `auth/unauthorized-domain`
   (o app mostra "Login bloqueado: o domínio … não está autorizado"):
   [console.firebase.google.com](https://console.firebase.google.com) → projeto `gen-lang-client-0954454406`
   (criado pelo AI Studio; abre com a mesma conta Google) → **Authentication** → **Settings** →
   **Authorized domains** → **Add domain**, um de cada vez, sem `https://`:
   - `dev-pratica.vercel.app` (produção)
   - `localhost` (para testar na sua máquina — **também não está liberado hoje**)

   Verificado em 2026-11-18: a lista tinha só os domínios do AI Studio (`*.run.app`, `*.ai.studio`,
   `*.firebaseapp.com`, `*.web.app`). A chave de API não tem restrição de origem, então liberar os
   domínios basta. A mudança vale na hora, sem novo deploy.

Depois disso, todo push na `main` publica sozinho.

> Os deploys de *preview* têm um domínio diferente a cada vez. Neles, o login Google só funciona se
> o domínio for liberado no Firebase. Para usar o app logado, use o domínio de produção.

---

## Login com Google: pop-up e redirecionamento

O login tenta primeiro o **pop-up** (`signInWithPopup`). Quando o navegador o bloqueia, o app cai
sozinho no **redirecionamento** (`signInWithRedirect`): a página sai para a tela do Google e volta
autenticada. O resultado é recolhido por `consumeRedirectLogin()` quando o app monta, e é só ali que
os erros desse fluxo aparecem.

**Ressalva que ainda está em aberto.** O `authDomain` do projeto é
`gen-lang-client-0954454406.firebaseapp.com`, um domínio diferente daquele onde o app roda. Isso faz
o redirecionamento depender de armazenamento de terceiros, que o Safari bloqueia por padrão e o
Firefox bloqueia no modo estrito. Nesses navegadores, com o pop-up também bloqueado, o login pode
voltar do Google sem sessão — e o usuário cai na tela de login sem erro aparente.

No Chrome com as opções padrão os dois caminhos funcionam. Para fechar o caso de vez, a solução
documentada pelo Firebase é servir o handler de autenticação no **mesmo domínio do app**: criar um
rewrite de `/__/auth/**` para o domínio do Firebase no `vercel.json` e apontar o `authDomain` da
configuração para o domínio de produção. Vale fazer se o login falhar no Safari.

Enquanto isso, o atalho para o usuário é permitir pop-ups para o site: no Chrome, o ícone de pop-up
bloqueado na barra de endereço → *Sempre permitir pop-ups de…*.

---

## Conferir se o deploy está saudável

- [ ] A URL abre o Painel com as 4 trilhas.
- [ ] Recarregar numa rota interna não dá 404, porque o roteamento manda tudo para o `index.html`.
- [ ] Um exercício TS compila (o compilador é baixado na primeira verificação).
- [ ] Um pedido de dica ao tutor responde. Sem `GEMINI_API_KEY` vem uma resposta genérica, o que é esperado.
- [ ] O login com Google funciona no domínio de produção (passo 6).
- [ ] Com pop-ups bloqueados no navegador, o login cai no redirecionamento e volta autenticado.

**Se algo falhar:** no painel da Vercel → projeto → *Deployments* → clique no deploy → *Build Logs*.
Para erros da API, veja *Logs* ou *Runtime Logs* em tempo real.

---

## Mudou a variável de ambiente?

Variáveis novas ou alteradas só valem no **próximo deploy**. Faça um push, ou use *Deployments*
→ ⋯ → **Redeploy**.

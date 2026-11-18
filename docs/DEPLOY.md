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
- **Firebase:** projeto próprio **`dev-pratica`** (nº 1082635470502), criado pelo usuário em 2026-11-18.
  Conferido pela API: domínios `localhost`, `dev-pratica.firebaseapp.com`, `dev-pratica.web.app` e
  `dev-pratica.vercel.app` autorizados; login com Google ativo. `GEMINI_API_KEY` cadastrada na Vercel.
- **Firestore:** banco `(default)` criado e `firestore.rules` publicado pelo usuário (2026-11-18).
  Conferido pela API: leitura anônima recusada com "Missing or insufficient permissions" (o esperado).

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
   (o app mostra "Login bloqueado: o domínio … não está autorizado"): console do Firebase → projeto
   `dev-pratica` → **Authentication** → **Configurações** → **Domínios autorizados** → **Adicionar
   domínio** → `dev-pratica.vercel.app` (o `localhost` vem por padrão). ✅ Feito em 2026-11-18.

Depois disso, todo push na `main` publica sozinho.

> Os deploys de *preview* têm um domínio diferente a cada vez. Neles, o login Google só funciona se
> o domínio for liberado no Firebase. Para usar o app logado, use o domínio de produção.

## Login com a sua conta Google: projeto Firebase próprio ✅ em uso

Até 2026-11-18 o app usava um projeto Firebase criado pelo Google AI Studio
(`gen-lang-client-0954454406`), que o usuário não conseguia administrar no console — os domínios do
site nunca entraram na lista dele. O app agora usa o projeto próprio **`dev-pratica`**. Não houve
progresso perdido na nuvem (o login nunca funcionou fora do AI Studio); o progresso do navegador sobe
para o projeto novo no primeiro login. Passos usados, para referência (ou para recriar o projeto):

**Passos no console** ([console.firebase.google.com](https://console.firebase.google.com), logado com a
sua conta Google):

1. **Adicionar projeto** → nome `dev-pratica` → pode desativar o Google Analytics → **Criar projeto**.
2. **Build → Authentication → Vamos começar** → aba **Método de login** → **Google** → **Ativar** →
   escolha o e-mail de suporte → **Salvar**.
3. **Authentication → Settings → Domínios autorizados → Adicionar domínio** → `dev-pratica.vercel.app`.
   O `localhost` já vem na lista em projetos novos; confira.
4. **Build → Firestore Database → Criar banco de dados** → ID `(default)` → local
   `southamerica-east1 (São Paulo)` → **Iniciar no modo de produção** → **Criar**.
5. **Firestore → Regras** → apague o conteúdo, cole o arquivo [`firestore.rules`](../firestore.rules)
   inteiro → **Publicar**.
6. **⚙️ Configurações do projeto → Seus apps → `</>` (Web)** → apelido `dev-pratica` (sem Hosting) →
   **Registrar app**. Copie o bloco `firebaseConfig` que aparece (apiKey, authDomain, projectId,
   storageBucket, messagingSenderId, appId).

Esses valores **não são segredo**: vão no código do site e qualquer visitante os vê. O que protege os
dados são as regras do passo 5 e os domínios do passo 3. Pode colar o bloco no chat.

**Troca no código** (✅ feita): valores padrão em `src/config/firebase.config.ts` apontam para
`dev-pratica`, com `firestoreDatabaseId: '(default)'`.

**Como conferir pela API** (sem console, com a apiKey pública):
- domínios: `GET https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=<apiKey>`;
- Firestore: `GET https://firestore.googleapis.com/v1/projects/dev-pratica/databases/(default)/documents/users/x?key=<apiKey>`
  — `PERMISSION_DENIED` com "Cloud Firestore API has not been used" = banco não criado; `PERMISSION_DENIED`
  com "Missing or insufficient permissions" = banco criado e regras bloqueando acesso anônimo (o certo).

---


## Login com Google: pop-up e redirecionamento

O login tenta primeiro o **pop-up** (`signInWithPopup`). Quando o navegador o bloqueia, o app cai
sozinho no **redirecionamento** (`signInWithRedirect`): a página sai para a tela do Google e volta
autenticada. O resultado é recolhido por `consumeRedirectLogin()` quando o app monta, e é só ali que
os erros desse fluxo aparecem.

**Ressalva que ainda está em aberto.** O `authDomain` do projeto é
`dev-pratica.firebaseapp.com`, um domínio diferente daquele onde o app roda. Isso faz o login
depender de armazenamento de terceiros, que o Safari, o Brave, o Edge (prevenção rígida) e o Chrome
em janela anônima bloqueiam. Nesses navegadores o usuário volta do Google **sem sessão e sem erro**
— foi o que aconteceu no primeiro teste em produção (2026-11-18). Desde então o app avisa
("Você voltou do Google, mas o navegador descartou a sessão…"), via `consumeRedirectLogin()`.

**Correção definitiva (preparada, falta 1 passo do usuário):** servir o handler de login no próprio
domínio do site.
1. ✅ Proxy na Vercel: `/__/auth/*` e `/__/firebase/*` → `https://dev-pratica.firebaseapp.com`
   (rota em `scripts/build-vercel.mjs`; variável `FIREBASE_AUTH_HOST` para outro projeto).
2. ⏳ **Usuário:** no [Google Cloud Console](https://console.cloud.google.com/apis/credentials?project=dev-pratica)
   → projeto `dev-pratica` → **APIs e serviços → Credenciais** → em "IDs do cliente OAuth 2.0", abrir
   **Web client (auto created by Google Service)** → em **URIs de redirecionamento autorizados**,
   **Adicionar URI** → `https://dev-pratica.vercel.app/__/auth/handler` → **Salvar**.
3. ⏳ Agente: cadastrar na Vercel, **só em Production**, `VITE_FIREBASE_AUTH_DOMAIN=dev-pratica.vercel.app`
   (o código já lê essa variável em `src/config/firebase.config.ts`) e refazer o deploy. Previews e
   `localhost` seguem com o `authDomain` padrão.

**Não inverter a ordem:** com o passo 3 antes do 2, o Google recusa o login com `redirect_uri_mismatch`.

Enquanto isso, o atalho para o usuário é permitir pop-ups para o site: no Chrome, o ícone de pop-up
bloqueado na barra de endereço → *Sempre permitir pop-ups de…*.

---

## Instalação de dependências e o `--legacy-peer-deps`

O `vercel.json` manda a Vercel instalar com `npm install --legacy-peer-deps`. Esse sinalizador
foi posto para contornar um conflito de peer dependency: a raiz pedia `esbuild@^0.25`, e o
`vite@8` aceita `esbuild@^0.27 || ^0.28` como peer opcional. Era o mesmo erro `ERESOLVE` que
aparecia num `npm install` local.

A causa foi corrigida em 2026-11-18 — a raiz agora pede `esbuild@^0.28.0`, dentro da faixa que o
Vite aceita. **O sinalizador continua no `vercel.json` de propósito**, até alguém confirmar que um
`npm install` limpo (sem `--legacy-peer-deps`, com a pasta `node_modules` e o `package-lock.json`
apagados) passa sem erro. Confirmado isso, vale tirá-lo: com ele, um conflito real de dependência
passa batido no build da Vercel e só aparece em produção.

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

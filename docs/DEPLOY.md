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

## Configuração inicial (uma vez, pelo painel)

1. Acesse **https://vercel.com/new**, com o time *deverickpaulawork's projects* selecionado.
2. Em *Import Git Repository*, escolha **`erickdepaula-dev/dev-pratica`** e clique em **Import**.
3. Em *Framework Preset*, deixe **Other**. **Não altere** os comandos de Build e Install: o
   `vercel.json` já os define.
4. Abra **Environment Variables** e adicione a variável a seguir. Ela é opcional: sem ela, o tutor usa
   respostas prontas.
   - `GEMINI_API_KEY` = sua chave do Gemini (marque *Production* e *Preview*).
5. Clique em **Deploy**. Ao terminar, a Vercel mostra a URL, por exemplo `https://dev-pratica.vercel.app`.
6. **Libere o domínio no Firebase**, senão o login com Google falha com `auth/unauthorized-domain`:
   [console.firebase.google.com](https://console.firebase.google.com) → projeto `gen-lang-client-0954454406`
   → **Authentication** → **Settings** → **Authorized domains** → **Add domain** → cole o domínio
   sem `https://`, por exemplo `dev-pratica.vercel.app`.

Depois disso, todo push na `main` publica sozinho.

> Os deploys de *preview* têm um domínio diferente a cada vez. Neles, o login Google só funciona se
> o domínio for liberado no Firebase. Para usar o app logado, use o domínio de produção.

---

## Conferir se o deploy está saudável

- [ ] A URL abre o Painel com as 4 trilhas.
- [ ] Recarregar numa rota interna não dá 404, porque o roteamento manda tudo para o `index.html`.
- [ ] Um exercício TS compila (o compilador é baixado na primeira verificação).
- [ ] Um pedido de dica ao tutor responde. Sem `GEMINI_API_KEY` vem uma resposta genérica, o que é esperado.
- [ ] O login com Google funciona no domínio de produção (passo 6).

**Se algo falhar:** no painel da Vercel → projeto → *Deployments* → clique no deploy → *Build Logs*.
Para erros da API, veja *Logs* ou *Runtime Logs* em tempo real.

---

## Mudou a variável de ambiente?

Variáveis novas ou alteradas só valem no **próximo deploy**. Faça um push, ou use *Deployments*
→ ⋯ → **Redeploy**.

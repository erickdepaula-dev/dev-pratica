# 🧪 Como testar localmente

> Guia para rodar o DevPrática na sua máquina e conferir o que foi feito em cada fase.
> Os comandos valem para Windows (PowerShell), macOS e Linux, exceto onde está indicado.

---

## 1. Pré-requisitos

- **Node.js 22** (mínimo 20.19; o Vite 8 não roda em versões mais antigas). Confira com `node -v`.
- **Git**.
- Opcional: uma **chave do Gemini** para o tutor de IA ([aistudio.google.com](https://aistudio.google.com) → *Get API key*).
  Sem ela o app funciona, mas o tutor e os Desafios IA usam respostas prontas (de *fallback*).

---

## 2. Baixar e instalar

Primeira vez:

```bash
git clone https://github.com/erickdepaula-dev/dev-pratica.git
cd dev-pratica
```

Se já tem o repositório, atualize a `main`:

```bash
git checkout main
git pull
```

Instale as dependências. O `--legacy-peer-deps` é **obrigatório**, porque há um conflito de versões entre o Vite 8 e um plugin:

```bash
npm install --legacy-peer-deps
```

> A `main` tem as fases concluídas. Se o `docs/CONTEXT.md` disser que há trabalho mais novo
> na branch de trabalho, use `git checkout <branch>` e depois `git pull` para testar essa versão.

---

## 3. Configurar o `.env` (opcional, só para o tutor IA)

Copie o modelo e preencha a chave. O arquivo `.env` nunca vai para o Git.

```bash
cp .env.example .env
```

No PowerShell use `Copy-Item .env.example .env`. Depois edite o arquivo:

```
GEMINI_API_KEY="sua-chave-aqui"
```

O `APP_URL` pode ficar como está para uso local.

A configuração do Firebase já está em `firebase-applet-config.json`. Para o **login com Google**
funcionar localmente, porém, o domínio `localhost` precisa estar liberado no Firebase (Authentication →
Settings → Authorized domains) — hoje não está; ver o passo 6 de [`DEPLOY.md`](./DEPLOY.md).

---

## 4. Rodar

```bash
npm run dev
```

Abra **http://localhost:3000**. O terminal deve mostrar `[DevPrática] Servidor iniciado na porta 3000`.

> ⚠️ **O servidor não recarrega sozinho** quando um arquivo muda (o `watch` do Vite está desligado,
> herança do AI Studio). Depois de um `git pull` ou de editar algo, pare (`Ctrl+C`) e rode
> `npm run dev` de novo.

Para outra porta, defina a variável `PORT`:

```bash
PORT=4000 npm run dev
```

No PowerShell: `$env:PORT=4000; npm run dev`.

### Build da Vercel (opcional)

`npm run build:vercel` gera em `.vercel/output/` exatamente o que é publicado. Veja [`DEPLOY.md`](./DEPLOY.md).

### Versão de produção (opcional)

Gera o build e serve os arquivos estáticos de `dist/`, como em produção:

```bash
npm run build
```

Depois, no macOS ou Linux:

```bash
NODE_ENV=production npm start
```

No PowerShell:

```powershell
$env:NODE_ENV="production"; npm start
```

---

## 5. Verificações automáticas

Rode antes de testar manualmente. Todas devem terminar sem erro.

| Comando | O que confere | Resultado esperado |
| :--- | :--- | :--- |
| `npm run lint` | Tipagem de todo o projeto (TS 7) | Nenhuma saída de erro |
| `npm run check:ts` | Cada exercício de TypeScript e de Lógica, com o compilador real: gabarito passa, modelo inicial não vem resolvido | `... exercícios verificados ..., 0 problema(s).` |
| `npm run check:xp` | Regras de XP, níveis e conquistas (20 testes) + tabela de calibração | Todos os testes ✓ |
| `npm run build` | Build de produção | `✓ built in ...` |

Para conferir só uma parte, filtre pelo começo do ID:

```bash
npm run check:ts -- logica
```

Com `-- ts-basico`, confere só o nível básico da trilha TypeScript.

---

## 6. Roteiro de teste manual

Marque conforme for testando. Para começar do zero, veja a [seção 7](#7-zerar-os-dados).

### Geral (Fase 1 — interface)
- [ ] O Painel abre com os cards das 4 trilhas (PHP, JavaScript, TypeScript, Lógica).
- [ ] As pílulas de trilha no topo trocam a trilha. Redimensione a janela: nada deve vazar ou
      sobrepor, do celular (375 px) à tela cheia.
- [ ] Navegação por teclado: `Tab` mostra o contorno de foco nos botões.
- [ ] Com "reduzir movimento" ligado no sistema operacional, as animações ficam mínimas.

### Trilha TypeScript (Fase 2)
- [ ] Abra um exercício de código livre de TS e escreva algo com erro de tipo (ex.: `const n: number = 'a'`).
      Ao verificar, aparece o erro do compilador com a linha.
- [ ] Corrija e verifique de novo: os testes passam e o exercício conta como concluído.
- [ ] Modalidade **"Prever erro de tipo"**: escolha a linha e o motivo; a correção mostra o erro real.
- [ ] **Pendente de verificação (precisa de você):** com `GEMINI_API_KEY` no `.env`, peça uma dica
      ou abra o tutor num exercício TS com erro de tipo. O tutor deve explicar o erro **sem** sugerir
      `any`, `as` ou `@ts-ignore`.

### Gamificação (Fase 3)
- [ ] Ao concluir um exercício, aparece "+N XP" e a barra do topo avança (o número fica no tooltip da barra).
- [ ] O card de carreira no Painel mostra o nível e quanto falta para o próximo.
- [ ] Na aba **Progresso**: gráfico de XP dos últimos 14 dias (com opção de ver como tabela) e conquistas.
- [ ] Reabrir um exercício já concluído e resolver de novo **não** dá XP outra vez.

### Trilha de Lógica (Fase 4, em andamento)
- [ ] Selecione **Lógica 🧩**: aparecem os exercícios já convertidos (hoje, nº 1 a 40).
- [ ] Num exercício, use **"Resolver em: JavaScript | TypeScript"**. O editor troca para o modelo
      da linguagem escolhida e o progresso (concluído, XP) vale para as duas.
- [ ] Escreva algo em JS, troque para TS e volte: o código em JS reaparece.
- [ ] Em TS, os exercícios com categorias (ex.: nº 17, Par ou Ímpar) recusam textos fora das opções.

### Sincronização na nuvem (login Google)
- [ ] Clique em **Entrar** e faça login com Google.
- [ ] **Pendente de verificação:** conclua um exercício TS, recarregue a página e confira que o
      progresso continua lá.
- [ ] **Pendente de verificação:** em outro navegador (ou janela anônima) logado na mesma conta,
      confira que o XP e as conquistas aparecem.

> Quando os três itens "Pendente de verificação" passarem, avise: as Fases 2 e 3 são marcadas como
> ✅ no `docs/CONTEXT.md`.

---

## 7. Zerar os dados

O progresso local fica no `localStorage` do navegador (chave `devpratica_user_progress_v1`).
Você pode zerar de três formas:
- **Pela interface:** botão **Zerar Dados** na aba Progresso. Ele apaga o progresso deste navegador.
  Se você estiver logado, a nuvem continua com o progresso: ao recarregar, a sincronização junta tudo de
  volta, porque o *merge* nunca desfaz conclusões.
- **Só neste navegador:** DevTools (`F12`) → *Application* → *Local Storage* → `http://localhost:3000` → apagar a chave.
- **Teste limpo sem perder nada:** use uma janela anônima, sem fazer login.

---

## 8. Problemas comuns

| Sintoma | Causa provável | Solução |
| :--- | :--- | :--- |
| `npm install` falha com `ERESOLVE` | Conflito de peer deps | Use `npm install --legacy-peer-deps` |
| Mudança no código não aparece | O servidor não observa arquivos | Pare e rode `npm run dev` de novo |
| `EADDRINUSE: ... 3000` | Porta ocupada (outro `npm run dev` aberto?) | Feche o outro processo ou use `PORT=4000` |
| Tutor responde sempre de forma genérica | Sem `GEMINI_API_KEY` (respostas de *fallback*) | Preencha o `.env` e reinicie o servidor |
| "Login bloqueado: o domínio … não está autorizado" (`auth/unauthorized-domain`) | Domínio fora da lista do Firebase | Adicione `localhost` (e `dev-pratica.vercel.app`) em Firebase → Authentication → Settings → Authorized domains. Use `localhost`, não `127.0.0.1` nem o IP da rede |
| Erro de sintaxe estranho ao rodar | Node antigo | Atualize para o Node 22 |
| Primeira verificação de TS demora ~1–2 s | O compilador TS é carregado sob demanda | Normal; as seguintes são rápidas |

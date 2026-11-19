# 📍 CONTEXT — Estado Atual do DevPrática

> **Leia este arquivo primeiro** ao iniciar qualquer sessão de trabalho.
> Atualize a seção "Onde paramos" e o Changelog ao final de cada tarefa.

---

## 🎯 Objetivo do projeto

Plataforma pessoal de prática de programação, inspirada no [coddy.tech](https://coddy.tech),
para o dono do repositório treinar lógica e sintaxe em **JavaScript**, **PHP** e **TypeScript**,
com tutor de IA, ofensiva (streak) e progresso sincronizado.

Uso **pessoal** — não é um produto comercial, não há multi-tenant nem certificados.

---

## 🧱 Estado atual da base de código

### Já implementado e funcionando

| Área | Detalhe |
| :--- | :--- |
| **Trilhas** | PHP (88), JavaScript (87), TypeScript (118, incluindo 30 de `prever_erro_de_tipo`) e Lógica (133, resolvida em JS ou TS, incluindo 12 de `teste_de_mesa`) |
| **Níveis** | `basico`, `intermediario`, `avancado`, `dev` |
| **Modalidades** | `lacunas`, `codigo_livre`, `corrigir_erros`, `prever_saida`, `desafio_pratico` + `prever_erro_de_tipo` (só TS) + `teste_de_mesa` (Lógica; gabarito gerado executando o código, `src/services/deskCheck.ts`) |
| **Abas** | `dashboard`, `exercicios`, `desafios_ia`, `progresso`, `guia` |
| **Guia rápido** | Janela de consulta de sintaxe dentro dos exercícios (`Ctrl /`): operadores, precedência, Portugol × PHP × JS × TS, funções prontas, "montar uma função" (`src/components/QuickGuide.tsx`, `src/data/guiaRapido.ts`) |
| **Tutor IA** | Gemini — dica contextual, explicação do enunciado, análise linha a linha (`src/services/aiHint.ts`, `src/components/AiTutorModal.tsx`). **Desligado por padrão** (`VITE_AI_ENABLED`, `src/config/ai.ts`): Dica Rápida, Tutor IA e Desafios IA mostram o aviso `AiDisabledDialog` |
| **Desafios IA** | Hub + workspace gerados dinamicamente (`src/components/AiChallenges/`) |
| **Ofensiva** | Streak em dias, timezone `America/Fortaleza` (`src/utils/dateUtils.ts`) |
| **Persistência** | localStorage + Firebase Firestore, login Google (`src/services/storage.ts`, `firestoreSync.ts`) |
| **Design system** | Tokens em `src/styles/tokens.css` + `@theme` (`src/index.css`), temas em `src/utils/exerciseTheme.ts`, animações com `motion` e reduced motion global |
| **Gamificação** | XP congelado por conclusão, 5 níveis de carreira, 11 conquistas, gráfico de XP por dia (`services/xp.ts`, `services/badges.ts`) |
| **Avaliação** | Lacunas, regex e test cases (`src/services/evaluator.ts`); **TypeScript compilado de verdade no navegador** (TS 5.9.3, pipeline compilar → executar → testar → regras em `src/services/typescript/`) |

### Ainda não existe

- Nada pendente do plano original — as 4 fases têm as tarefas feitas. Restam só as verificações
  manuais do usuário (abaixo) e o login com Google em produção (ver "Deploy").

---

## 📂 Material externo disponível

Pasta local `C:\CURSO\programacao` (não versionada) contém PDFs de apoio:

- `100_Exercicios_Logica.pdf` + gabarito
- `30 Exercícios Extras de Condicionais.pdf`
- `30 Exercícios Extras de Estruturas de Repetição.pdf`
- `Guia de Equivalência - Portugol, Python e JavaScript.pdf`
- `Guia Rápido de Operadores.pdf`
- `Guia Visual de Teste de Mesa.pdf`

**Já catalogados.** Os 160 exercícios estão mapeados em
[`fase-4-indice-exercicios.md`](./fase-4-indice-exercicios.md) — número, módulo e título,
com a progressão de tópicos. Os PDFs em si não são necessários para executar a Fase 4.

---

## 🗺️ Fases do plano

| Fase | Arquivo | Status |
| :--- | :--- | :--- |
| 1 — UI Redesign | [`fase-1-ui.md`](./fase-1-ui.md) | ✅ Concluída |
| 2 — Trilha TypeScript | [`fase-2-typescript.md`](./fase-2-typescript.md) | 🟡 Tarefas concluídas; 2 critérios aguardam verificação manual |
| 3 — Gamificação | [`fase-3-gamificacao.md`](./fase-3-gamificacao.md) | 🟡 Tarefas concluídas (na `main`); sync com Firestore aguarda verificação manual |
| 4 — Exercícios dos PDFs | [`fase-4-exercicios.md`](./fase-4-exercicios.md) | ✅ Concluída |

**Índice de apoio:** [`fase-4-indice-exercicios.md`](./fase-4-indice-exercicios.md) — catálogo dos 160 exercícios.

Legenda: ⬜ não iniciada · 🟡 em andamento · ✅ concluída

---

## 📌 Onde paramos

> **Retrato do estado atual** — reescrito a cada tarefa. O histórico completo está no
> Changelog (abaixo) e nos arquivos de cada fase. Se você está retomando o trabalho sem
> contexto, esta seção é suficiente para saber onde está tudo.

**Última atualização:** 2026-11-18

### Onde está o código

| O quê | Onde |
| :--- | :--- |
| Fases 1, 2, 3, a Fase 4 até o lote 4 da 4.3 e o setup de deploy | `main` (Fases 1–2 via PR #1; o resto por fast-forward — o último em 2026-11-18, a pedido do usuário no meio da Fase 4) |
| Trabalho em andamento da fase ativa | branch `claude/gifted-wozniak-kif49s` (igual à `main` até o próximo commit) |

**Regra (definida pelo usuário em 2026-11-18, ampliada no mesmo dia):** o trabalho é feito na branch
de trabalho e **levado para a `main` (fast-forward, sem PR) ao fim de cada fase e de cada entrega
verificada** (ex.: cada lote de exercícios). A `main` publica sozinha na Vercel, então ela é o que
está no ar.

### Estado de cada fase

| Fase | Estado | Detalhes |
| :--- | :--- | :--- |
| 1 — UI Redesign | ✅ Concluída | `fase-1-ui.md` |
| 2 — Trilha TypeScript | 🟡 Tarefas feitas; 2 verificações manuais pendentes | `fase-2-typescript.md` |
| 3 — Gamificação | 🟡 Tarefas feitas; 1 verificação manual pendente | `fase-3-gamificacao.md` |
| 4 — Exercícios dos PDFs | ✅ Concluída — 133 exercícios de Lógica, teste de mesa e material de referência | `fase-4-exercicios.md` |

### Pendente de verificação manual (precisa do usuário)

Não dá para testar no ambiente de desenvolvimento (sem chave Gemini e sem login Google):
1. **Tutor IA em TS (Fase 2):** com `GEMINI_API_KEY` no `.env`, pedir dica/diálogo num exercício TS
   com erro de tipo; o tutor deve explicar o erro sem sugerir `any`/`as`/`@ts-ignore`.
2. **Sincronização da trilha TS (Fase 2):** logado com Google, concluir um exercício TS e conferir
   que o progresso volta após recarregar.
3. **Sincronização de XP e conquistas (Fase 3):** logado, concluir um exercício e conferir em outro
   navegador que XP e conquistas aparecem.

Quando passarem: marcar as Fases 2 e 3 como ✅ (e os critérios correspondentes nos arquivos das fases).

### Próximo passo

**Fase 4 concluída (2026-11-18) — as quatro fases do plano têm as tarefas feitas.**
A trilha de Lógica tem **133 exercícios** em `src/data/logica/`: os 100 principais (`m01`–`m05`),
21 bônus (`m06`, `m07`; os outros 39 duplicavam exercícios — ver tarefa 4.4 em
`fase-4-exercicios.md`, e compare regra e nome da função, não só o título, antes de revisitar) e
**12 de teste de mesa** (`m08TesteDeMesa.ts`, `logica-t01…t12`).

**Teste de mesa (4.5):** modalidade `teste_de_mesa`. O aluno preenche a tabela de variáveis; o
gabarito é gerado executando o código do exercício (cada `anotar(...)` = uma linha), então não há
tabela digitada à mão para dessincronizar. Detalhes em "Como ficou (4.5)" no `fase-4-exercicios.md`.
**Material de referência (4.6):** operadores + precedência (no StudyGuide; dentro dos exercícios,
no **Guia rápido** — janela com `Ctrl /`, ver abaixo) e a tabela Portugol × PHP × JavaScript (`src/data/referencia.ts`).

**O que falta, tudo do lado do usuário:**
1. **As 3 verificações manuais** da seção acima (o Firebase está configurado; é entrar no site e testar).
2. Depois delas, marcar as Fases 2 e 3 como ✅.

Ideias para depois (não fazem parte do plano): mais exercícios de teste de mesa (vetores, matrizes,
funções), e trazer o teste de mesa para as trilhas JS/TS.

**Deploy:** Vercel, automático a cada push na `main` — produção em **https://dev-pratica.vercel.app**
(projeto `dev-pratica`, ver [`DEPLOY.md`](./DEPLOY.md)). `GEMINI_API_KEY` cadastrada na Vercel.

**Firebase:** o app usa o projeto próprio do usuário **`dev-pratica`** (trocado em 2026-11-18; o do AI
Studio, `gen-lang-client-0954454406`, não podia ser administrado). Conferido pela API: domínios do site
e `localhost` autorizados, login com Google ativo, Firestore `(default)` criado com o `firestore.rules`
publicado (leitura anônima recusada, como deve ser).
**Login pelo domínio do site (ativo desde 2026-11-18):** no 1º teste o usuário voltou do Google sem
sessão (navegador bloqueando armazenamento de terceiros, porque o `authDomain` era outro domínio).
Correção: proxy `/__/auth` na Vercel + URI `https://dev-pratica.vercel.app/__/auth/handler` no
cliente OAuth (feito pelo usuário) + `VITE_FIREBASE_AUTH_DOMAIN=dev-pratica.vercel.app` na Vercel,
só em Production. Topo logado mostra "● Conectado" + "Sair". **Login confirmado pelo usuário em produção
(2026-11-18)**; o Painel cumprimenta pelo primeiro nome. Faltam só as 3 verificações manuais.

**Como testar localmente:** [`TESTANDO-LOCAL.md`](./TESTANDO-LOCAL.md) (instalação, `.env`, verificações
automáticas, roteiro de teste manual por fase, problemas comuns).

### Como retomar uma sessão

```bash
git checkout claude/gifted-wozniak-kif49s   # ou main, se a fase ativa já foi levada para lá
npm install --legacy-peer-deps   # o projeto tem conflito de peer deps (vite 8)
npm run lint && npm run check:ts && npm run check:xp && npm run build
```

- O dev server (`npm run dev`) **não recarrega arquivos alterados** (`watch: null`): reinicie para ver mudanças.
- `npm run lint` usa o TS 7 por caminho explícito; o compilador do navegador é o TS 5.9.3
  (alias `typescript-browser`). Não trocar um pelo outro — ver `fase-2-typescript.md`.

**Decisões em aberto (além da ordem da Fase 4):**
- Paleta da Fase 1: implementada com a proposta inicial; ajustes finos só exigem editar `src/styles/tokens.css`.
- Botão "Continuar" foi removido do Header na Fase 3 (não cabia); pode voltar como atalho só com ícone se o usuário quiser.
- **Cores que já existiam e se confundem** (achado da validação de cores na 4.6): índigo do PHP × azul
  do TS (ΔE 9,7), âmbar do JS × laranja da ofensiva (ΔE 9,6) e verde de sucesso × vermelho de erro
  para daltonismo vermelho-verde (ΔE 5,6). Atenuado porque trilhas sempre aparecem com nome/emoji e
  status com ✓/✗; revisar a paleta se incomodar.

---

## 📝 Changelog

| Data | Fase | O que foi feito |
| :--- | :--- | :--- |
| 2026-11-17 | — | Criado `CLAUDE.md` e a documentação de fases (`docs/`). Plano de ação definido. |
| 2026-11-17 | 4 | Tarefa 4.2 concluída: 160 exercícios extraídos dos PDFs (texto + OCR) e catalogados em `fase-4-indice-exercicios.md`. Decidido não versionar os enunciados originais. |
| 2026-11-17 | 1 | Tarefa 1.1 concluída: `tokens.css`, mapeamento `@theme` (+ utilitários de gradiente), `exerciseTheme.ts` e `Dashboard.tsx` migrado para o helper. |
| 2026-11-17 | 1 | Tarefa 1.2 concluída: Header com indicador animado, pills de linguagem, menu mobile e slot de XP; `MotionConfig` com reduced motion global. |
| 2026-11-17 | 1 | Tarefa 1.3 concluída: Dashboard com card de continuação em destaque, `ProgressRing`, estatísticas, grid de trilhas e animação em cascata. |
| 2026-11-17 | 1 | Tarefa 1.4 concluída: `StreakCard` com fogo pulsante, contador animado e semana animada; visão semanal unificada no card. |
| 2026-11-17 | 1 | Tarefa 1.5 concluída: workspace e editores nos tokens, abas animadas, feedback de acerto/erro animado, foco visível. Tokens `--accent-text` e `--syntax-*`. |
| 2026-11-17 | 1 | Tarefa 1.6 concluída: catálogo com chips em gradiente, cards animados ao filtrar, estado vazio ilustrado; `LanguagePills.tsx` extraído. |
| 2026-11-17 | 1 | Tarefa 1.7 concluída e **Fase 1 finalizada**: toast animado, skeleton de sync, foco/cursor globais, reduced motion global; Progresso, Guia, Desafios IA e Tutor IA migrados para tokens. |
| 2026-11-17 | 2 | Decisão da 2.6: validar TS com compilação real no navegador (pacote oficial, linha 5.x — o TS 7 nativo não tem API JS), pipeline extensível. |
| 2026-11-17 | 2 | Tarefa 2.1 concluída: `Language` com TS, `utils/language.ts`, migração defensiva, avaliador com despacho exaustivo (stub TS), Desafios IA restritos a PHP/JS, tema da trilha TS. |
| 2026-11-17 | 2 | Tarefa 2.2 concluída: `src/data/ts/` registrado; convenção `ts-<nivel>-<slug>` checada pelo tipo `TsExercise`; detecção de IDs duplicados em dev. Contagem real das trilhas corrigida (88 PHP / 87 JS). |
| 2026-11-17 | 2 | 2.3 parcial: 28 exercícios TS do nível básico, validados com o compilador TS 5.9.3 (solução compila e passa nos testes, bug é detectável, gabaritos conferidos). Campo `typeAssertions` no `Exercise`. Meta revista para 28 por nível (volume real de JS). |
| 2026-11-17 | 2 | Tarefa 2.3 concluída: +28 exercícios TS do intermediário (type guards, unknown, generics, utility types, readonly, classes). 56 no total, todos validados com o compilador real. |
| 2026-11-17 | 2 | Tarefa 2.4 concluída: +28 exercícios TS do avançado e 4 projetos DEV com projectBrief. Trilha TS com 88 exercícios, todos validados com o compilador TS 5.9.3. |
| 2026-11-17 | 2 | Tarefa 2.5 concluída: trilha TS selecionável no Header, catálogo e Dashboard; seletor derivado de uma fonte única; realce de sintaxe TS; header sem overflow com 3 trilhas. |
| 2026-11-17 | 2 | 2.6 parcial: avaliador TS com compilação real no navegador (typescript@5.9.3 via alias, lazy), pipeline compilar→executar→testar→regras, `npm run check:ts`. Corrigido: `npm run lint` rodava o TS 5.9 por colisão de binários. |
| 2026-11-17 | 2 | 2.6 parcial: modalidade `prever_erro_de_tipo` (tipo, tela, avaliador, 30 exercícios validados). Corrigidos: persistência de `outputPrediction` e `checklistDone`; "1 dias" no header. |
| 2026-11-17 | 2 | Tarefa 2.6 concluída: tutor IA ciente de TS (diagnósticos reais nos prompts, sem revelar respostas em `prever_erro_de_tipo`) e roteiro TS no Guia. Fase 2 com todas as tarefas feitas; 2 critérios aguardam verificação manual (Gemini e Firestore). |
| 2026-11-17 | 3 | Tarefa 3.1 concluída: tipos de gamificação, `services/xp.ts`, `services/badges.ts` (11 badges declarativas) e `npm run check:xp`. Níveis recalibrados contra o XP real (9.200 base). |
| 2026-11-17 | 3 | Tarefa 3.2 concluída: XP congelado na conclusão, migração retroativa idempotente (`migrateProgress`), merge no Firestore preservando XP/conclusões, badges sincronizadas. |
| 2026-11-17 | 3 | Tarefa 3.3 concluída: barra de XP, +XP no acerto, card de carreira, grid e toast de conquistas. Header sem overflow de 375 a 1920 px; botão "Continuar" do Header removido. Dicas não consomem mais a 1ª tentativa. |
| 2026-11-17 | 3 | Tarefa 3.4 concluída e Fase 3 com todas as tarefas feitas: XP nos Desafios IA e nos cards, gráfico de XP por dia. Pendente: verificação manual da sincronização com o Firestore. |
| 2026-11-17 | 4 | Tarefa 4.1 concluída: trilha "Lógica" própria (decisão do usuário); `Track` separado de `Language`, variantes JS/TS por exercício com `resolveLogicExercise`, convenção de IDs, badges por trilha. Tarefa 4.6 (interface) acrescentada. |
| 2026-11-18 | — | "Onde paramos" reescrito como retrato do estado atual (local do código por branch, estado por fase, verificações manuais pendentes, próximo passo e como retomar). Removidos trechos desatualizados (fase ativa errada, lembrete do stub de TS). |
| 2026-11-18 | 3 | Fase 3 (+ 4.1) levada para a `main` por fast-forward. Nova regra do usuário: levar para a `main` ao fim de cada fase. Ordem da Fase 4 decidida: 4.6 (interface) antes da 4.3. |
| 2026-11-18 | 4 | 4.6 parcial (base): trilha selecionada e linguagem da Lógica no progresso (com migração e sync), tema da trilha de Lógica. Cor ameixa (#A44C8C) escolhida por busca de matiz: maior distância de todas as trilhas e status (ΔE ≥ 16); validada com a skill de dataviz. |
| 2026-11-18 | 4 | Tarefa 4.6 concluída: trilha de Lógica no seletor, catálogo, Dashboard e Progresso; "Resolver em JS/TS" no workspace (código salvo por linguagem); `check:ts` valida as variantes; piloto `logica-001`. Header sem overflow com 4 trilhas. Corrigido bug antigo do editor de código com 80 px úteis. |
| 2026-11-18 | 4 | 4.3, lote 1 (nº 1–20): módulo 01 completo (15) + nº 16–20 do módulo 02; helper `logica()` gera template/solução JS e TS a partir de uma assinatura e um corpo. `check:ts`: 20 exercícios de Lógica, 0 problemas; soluções erradas típicas testadas e reprovadas. Avaliador JS: cada teste roda no próprio escopo (um `const` do teste não colide mais com o código do aluno). |
| 2026-11-18 | 4 | 4.3, lote 2 (nº 21–40): módulo 02 completo (condicionais, 16–35) + nº 36–40 do módulo 03 (repetição, novo `m03EstruturasDeRepeticao.ts`). `check:ts`: 40 exercícios de Lógica, 0 problemas; 11 soluções erradas típicas testadas e reprovadas. |
| 2026-11-18 | — | Criado `docs/TESTANDO-LOCAL.md` (como rodar e testar localmente). Branch levada para a `main` por fast-forward a pedido do usuário (Fase 4 ainda em andamento: 40 de 160 exercícios de Lógica). |
| 2026-11-18 | — | Deploy na Vercel preparado: `server.ts` separado em `server/apiApp.ts` (rotas) + servidor local; `npm run build:vercel` gera `.vercel/output` (estático + API Express empacotada como função Node 22); `vercel.json`; guia `docs/DEPLOY.md`. Criação do projeto pelo conector recusada (403) — importação fica para o usuário no painel. Levado para a `main`. |
| 2026-11-18 | — | Projeto `dev-pratica` criado na Vercel pela API (token do usuário; o conector MCP é só leitura), ligado ao GitHub com produção na `main`. Primeiro deploy de produção: build OK, função da API `READY`, domínio `dev-pratica.vercel.app`. |
| 2026-11-18 | 4 | 4.3, lote 3 (nº 41–60): módulo 03 (repetição) completo — acumuladores, contadores, máximo/mínimo, sentinelas (`while`/`break`), duas passadas (acima da média), `number \| null` no TS. `check:ts`: 60 exercícios de Lógica, 0 problemas; 12 soluções erradas testadas (a de `else if` no nº 51 é correta — dica e explicação corrigidas). |
| 2026-11-18 | 4 | 4.3, lote 4 (nº 61–80): módulo 04 (vetores e matrizes) completo — busca, contagem, filtro, intercalar, comparar, vetores paralelos, Bubble Sort, matrizes com laços aninhados; sem métodos prontos (reverse/sort/filter/indexOf). Primeiros 2 exercícios `avancado` (75, 79). `check:ts`: 80 de Lógica, 0 problemas; 14 soluções erradas testadas, todas reprovadas. Levado para a `main`. |
| 2026-11-18 | — | Erro no "Entrar" investigado: os domínios autorizados do Firebase Auth só têm os do AI Studio (faltam `dev-pratica.vercel.app` e `localhost`); a chave de API não tem restrição de origem. O app agora mostra a causa (`auth/unauthorized-domain`) em vez de uma mensagem genérica. Docs corrigidas (o `TESTANDO-LOCAL.md` dizia que o login funcionava em `localhost`). |
| 2026-11-18 | 4 | Enunciados completos, requisitos e tabelas de teste dos 160 exercícios extraídos dos PDFs para `docs/material-apoio/` (script em `scripts/build-exercicios.py`). Serve de especificação para os lotes restantes; a prosa segue escrita do zero. |
| 2026-11-18 | 4 | 4.3, lote 5 (nº 81–100): módulo 05 (funções e desafios combinados) completo — funções que devolvem em vez de exibir, fatorial e Fibonacci iterativos, busca de posições e os quatro relatórios compostos (vendas, turma, semana, estoque) com vetores paralelos. **Tarefa 4.3 concluída:** 100 exercícios, 0 IDs duplicados. Verificação: 96 testes na variante JS e 96 na TS transpilada, 0 falhas; type-check strict das 20 variantes TS; 26 soluções erradas testadas, todas reprovadas. O `check:ts` oficial não rodou (sem rede para `npm install` no ambiente) — rodar na máquina do usuário. |
| 2026-11-18 | — | Correção: o login com Google caía quando o navegador bloqueava o pop-up — o app só avisava "permita pop-ups". Agora `loginWithGoogle` cai em `signInWithRedirect`, e `consumeRedirectLogin()` recolhe o resultado na volta (é onde os erros desse fluxo aparecem). Mensagens de erro de login centralizadas em `descreverErroDeLogin`. Ressalva do `authDomain` em outro domínio documentada em `DEPLOY.md`. |
| 2026-11-18 | 4 | **Tarefa 4.4 concluída.** 21 dos 60 bônus convertidos: `m06BonusCondicionais.ts` (17) e `m07BonusRepeticao.ts` (4). Os outros 39 repetiam exercício existente — critério e lista em `fase-4-exercicios.md`. Trilha de Lógica em 121 exercícios. Verificação: 128 testes em JS e 128 na variante TS transpilada, 0 falhas; type-check strict dos 21; 28 soluções erradas testadas, todas reprovadas (duas rodadas: a primeira achou um buraco real no c18, sem teste para 8,95, e um falso positivo meu no r27). |
| 2026-11-18 | — | **Desvinculado do Google AI Studio.** `npm install` falhava com `ERESOLVE`: a raiz pedia `esbuild@^0.25` e o `vite@8` aceita `^0.27 \|\| ^0.28` — raiz passou a `^0.28.0`. Removidos `metadata.json` (manifesto do applet) e `bun.lock` (o projeto usa npm); `firebase-applet-config.json` virou `src/config/firebase.config.ts`, com sobreposição por `VITE_FIREBASE_*`; `firebase-blueprint.json` foi para `docs/firestore-schema.json`. HMR religado (`hmr: { server }` no `server.ts`, `hmr: false`/`watch: null` fora do `vite.config.ts`). Removido do `index.html` o script que trocava o `window.WebSocket` por um objeto falso e engolia todo erro com "WebSocket" no texto — rodava em produção e podia esconder falha do Firestore. `package.json` renomeado para `dev-pratica`, título do app sem "PHP & JS". O `--legacy-peer-deps` do `vercel.json` ficou de propósito até alguém confirmar um `npm install` limpo (ver `DEPLOY.md`). |
| 2026-11-18 | — | Adicionado `.gitattributes` com `* text=auto eol=lf`. No clone Windows do usuário os arquivos estavam com CRLF e os 118 arquivos do projeto apareciam como modificados no `git status` sem nenhuma edição real (`git diff --ignore-all-space` vinha vazio). Agora o git normaliza na entrada e o status fica limpo em qualquer sistema, sem depender de `core.autocrlf` local. Confirmado também que o deploy de produção está no commit mais recente: o `<title>` do site é `DevPrática`, valor introduzido em `f505469`. |
| 2026-11-18 | — | Feedback de erro no código livre deixou de ser genérico. O usuário escreveu a soma sem o `return` e recebeu três "Falhou no teste de validação", que diz o que aconteceu e não por quê. Novo `src/services/codeDiagnostics.ts` sonda o escopo do aluno e identifica duas causas estruturais: função/classe não definida e função que não devolve valor. Usado pelo avaliador de JS e pelo pipeline de TS. Projetado para errar para o lado do silêncio: a checagem de retorno só vale se a solução de referência devolver algo, e arrow com retorno implícito conta como retorno. Verificado: 0 falsos positivos nos 135 exercícios de código livre, 8 cenários de diagnóstico corretos, 121 exercícios de Lógica ainda passam com a solução oficial. |
| 2026-11-18 | — | "Entrar" reinvestigado: o código de login está certo (pop-up com redirecionamento de reserva); o bloqueio é o projeto Firebase do AI Studio, cujos domínios autorizados não incluem o site nem `localhost`. Documentado o caminho de um projeto Firebase próprio do usuário (`DEPLOY.md`), que só exige trocar a configuração. |
| 2026-11-18 | 4 | **Fase 4 concluída.** 4.5: modalidade `teste_de_mesa` (tipo, `DeskCheckViewer`, `evaluateDeskCheck`, gabarito gerado executando o código via `anotar(...)`, persistência achatada para o Firestore, tutor instruído a não revelar células) + 12 exercícios `logica-t01…t12`; seção Trilha de Lógica no StudyGuide com o método do teste de mesa. 4.6: guia de operadores (StudyGuide + consulta rápida no workspace) e tabela Portugol × Python × JS. `check:ts`: 251 exercícios, 0 problemas; testado no navegador (erro marcado por célula, acerto +10 XP, resposta restaurada, 375/768/1440 px sem overflow). Levado para a `main`. |
| 2026-11-18 | — | Firebase trocado para o projeto próprio `dev-pratica` (config em `src/config/firebase.config.ts`, banco `(default)`). Conferido pela API: domínios do site/`localhost` autorizados e login Google ativo; o Firestore ainda não foi criado. Login que dá certo com a nuvem fora do ar agora avisa "login feito, nuvem não respondeu" em vez de erro de autenticação. Docs de deploy atualizadas. |
| 2026-11-18 | — | Firestore `(default)` criado no projeto `dev-pratica` e `firestore.rules` publicado pelo usuário (conteúdo conferido, idêntico ao do repositório). Conferido pela API: leitura anônima recusada. Configuração do Firebase completa. |
| 2026-11-18 | — | Login: no 1º teste em produção o usuário voltou do Google sem sessão. Topo logado agora mostra "● Conectado" (abre o menu da conta) e "Sair"; para caber de 375 a 1920 px, com login as pílulas de trilha ficam só com emoji e o nome da marca some abaixo de `lg` (deslogado, nada mudou). Aviso quando o redirecionamento volta sem sessão. Proxy `/__/auth` e `/__/firebase` na Vercel para servir o login no domínio do site (ativação depende do URI de redirecionamento no Google Cloud). |
| 2026-11-18 | — | Login pelo domínio do site ativado: usuário adicionou o URI de redirecionamento e a origem no cliente OAuth; agente cadastrou `VITE_FIREBASE_AUTH_DOMAIN=dev-pratica.vercel.app` (só Production) e refez o deploy. Para desfazer: apagar a variável e refazer o deploy. |
| 2026-11-18 | — | Login com Google confirmado pelo usuário em produção (topo em "● Conectado" + "Sair", progresso carregado). Painel passa a cumprimentar pelo primeiro nome da conta Google ("Olá, Desenvolvedor" só para visitante). |
| 2026-11-18 | 4 | Tabela de equivalência do Guia de Estudos: coluna Python trocada por PHP (pedido do usuário) — agora Portugol × PHP × JavaScript, as linguagens das trilhas. |
| 2026-11-19 | — | **Guia rápido** nos exercícios (ideia do usuário, protótipo aprovado): botão na barra de ações e atalho `Ctrl /` (abre e fecha pelo mesmo atalho, também com o cursor no editor; `Esc` e clique fora fecham; o foco volta ao editor). Janela no centro com a tela escurecida — é para tirar a dúvida e voltar ao código. Abre em Sintaxe, com "Montar uma função" (anatomia numerada na linguagem do exercício + 5 perguntas para quando dá branco); abas Operadores, Precedência (com conta resolvida), Sintaxe (Portugol × PHP × JS × TS) e Funções prontas (textos, vetores, números); busca em todas as abas; copiar; pegadinhas; linguagem do exercício destacada e primeiro. Sem ligaduras de fonte (=== aparece como três sinais). Substitui a "Consulta rápida" da aba Instruções. Dados em `src/data/guiaRapido.ts`, componente `QuickGuide.tsx`. |
| 2026-11-19 | — | IA: usuário perguntou se a IA estava desativada. A `GEMINI_API_KEY` está na Vercel (Production e Preview), mas a troca para respostas locais era silenciosa e os logs da função não são acessíveis daqui. Criado `GET /api/gemini/status` (diz se a chave existe e se cada modelo responde, com o motivo; nunca expõe a chave); dica e tutor agora informam a origem (`source: gemini \| local`) e a tela avisa quando a resposta é local. Cascata de modelos: `gemini-flash-latest`, `gemini-flash-lite-latest` (aliases mantidos pelo Google), `gemini-3.1-flash-lite` — saiu `gemini-3.8-flash`, que não existe. |
| 2026-11-19 | — | **IA desligada por decisão do usuário** (app aberto para alguns amigos, sem custo; o `/api/gemini/status` mostrou a `GEMINI_API_KEY` da Vercel inválida, e tudo bem). Interruptor `VITE_AI_ENABLED` (padrão desligado; `src/config/ai.ts`). Dica Rápida, Tutor IA, gerar e avaliar desafio com IA mostram `AiDisabledDialog`: mensagens bem-humoradas que escalam com a insistência (1ª explica, 2ª "Você não tem jeito, né?", depois sorteio) e apontam o que funciona sem IA (Dicas, Guia rápido, Solução). Nenhuma chamada a `/api/gemini` sai com a IA desligada (conferido no navegador). Para religar: `VITE_AI_ENABLED=true` + chave válida + deploy. |

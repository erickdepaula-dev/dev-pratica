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
| **Trilhas** | PHP (88), JavaScript (87) e TypeScript (118, incluindo 30 de `prever_erro_de_tipo`) |
| **Níveis** | `basico`, `intermediario`, `avancado`, `dev` |
| **Modalidades** | `lacunas`, `codigo_livre`, `corrigir_erros`, `prever_saida`, `desafio_pratico` + `prever_erro_de_tipo` (só TS) |
| **Abas** | `dashboard`, `exercicios`, `desafios_ia`, `progresso`, `guia` |
| **Tutor IA** | Gemini — dica contextual, explicação do enunciado, análise linha a linha (`src/services/aiHint.ts`, `src/components/AiTutorModal.tsx`) |
| **Desafios IA** | Hub + workspace gerados dinamicamente (`src/components/AiChallenges/`) |
| **Ofensiva** | Streak em dias, timezone `America/Fortaleza` (`src/utils/dateUtils.ts`) |
| **Persistência** | localStorage + Firebase Firestore, login Google (`src/services/storage.ts`, `firestoreSync.ts`) |
| **Design system** | Tokens em `src/styles/tokens.css` + `@theme` (`src/index.css`), temas em `src/utils/exerciseTheme.ts`, animações com `motion` e reduced motion global |
| **Gamificação** | XP congelado por conclusão, 5 níveis de carreira, 11 conquistas, gráfico de XP por dia (`services/xp.ts`, `services/badges.ts`) |
| **Avaliação** | Validação de lacunas, regex e test cases (`src/services/evaluator.ts`) |

### Ainda não existe

- ❌ Trilha de lógica pura (material em PDF ainda não convertido)

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
| 3 — Gamificação | [`fase-3-gamificacao.md`](./fase-3-gamificacao.md) | 🟡 Tarefas concluídas; sync com Firestore aguarda verificação manual |
| 4 — Exercícios dos PDFs | [`fase-4-exercicios.md`](./fase-4-exercicios.md) | 🟡 Tarefas 4.1 e 4.2 concluídas |

**Índice de apoio:** [`fase-4-indice-exercicios.md`](./fase-4-indice-exercicios.md) — catálogo dos 160 exercícios.

Legenda: ⬜ não iniciada · 🟡 em andamento · ✅ concluída

---

## 📌 Onde paramos

**Última atualização:** 2026-11-17

**Fase ativa:** Fase 2 — Trilha TypeScript.

**Fase 1:** ✅ concluída (detalhes em `fase-1-ui.md` e no Changelog).

**Concluído na Fase 2:**
- 2.1 — `Language` com `'typescript'`; `src/utils/language.ts` (`LANGUAGES`, `isLanguage`,
  `assertNever`); migração defensiva de `selectedLanguage` no storage e no Firestore
  (testada com progresso antigo, corrompido e sem o campo); despacho exaustivo
  `evaluateCodeForLanguage` (antes, TS cairia no avaliador de PHP) com stub para TS;
  Desafios IA restritos a PHP/JS (`AiChallengeLanguage`); tema/cor da trilha TS.
- 2.2 — `src/data/ts/` (7 arquivos + `index.ts`) registrado em `allExercises`; tipo
  `TsExercise<nivel>` faz o `tsc` barrar IDs fora de `ts-<nivel>-<slug>`;
  `findDuplicateExerciseIds()` com alerta em dev.
- 2.3 — **56 exercícios TS** (28 básico + 28 intermediário; por nível: 10 lacunas,
  6 corrigir_erros, 6 prever_saida, 5 desafio_pratico, 1 codigo_livre), todos validados com o
  compilador TS 5.9.3. Novo campo opcional `Exercise.typeAssertions` (testes de tipo; só
  checados, nunca executados). Regras do avaliador para a 2.6 documentadas em `fase-2-typescript.md`.
- 2.4 — +28 do avançado (constraints, keyof/T[K], conditional types, infer, mapped e template
  literal types, discriminated unions, never, satisfies, declaration merging) e 4 projetos DEV
  (validação de API a partir de unknown, formulário genérico, reducer exaustivo, cliente HTTP
  tipado por endpoint). **Trilha TS com 88 exercícios**, todos validados com o compilador real.

- 2.5 — Trilha TS na interface: seletor (Header, catálogo, menu mobile), card no Dashboard,
  Progresso, realce de sintaxe TS. Seletor e grid derivam de `LANGUAGES` + `getLanguageTheme`.
  Header ajustado para caber 3 trilhas sem overflow.

- 2.6 (parcial) — **compilação real de TS no navegador** (pacote oficial 5.9.3 via alias,
  carregado sob demanda) com pipeline extensível compilar → executar → testar → regras.
  `npm run check:ts` valida o conteúdo com o mesmo pipeline do app. `npm run lint` agora
  chama o TS 7 por caminho explícito (o alias sequestrava o `.bin/tsc`).

- 2.6 (parcial) — modalidade **`prever_erro_de_tipo`** com 30 exercícios (10 por nível); a
  mensagem real do compilador aparece ao acertar. Trilha TS com **118 exercícios**.
  Corrigidos bugs antigos: respostas de "prever saída" e checklist DEV não persistiam.

- 2.6 — tutor IA ciente de TS (diretrizes de tipagem + diagnósticos reais nos prompts) e roteiro
  TS no Guia de Estudo. **Todas as tarefas da Fase 2 concluídas.**

**Pendente de verificação manual (você):**
1. Com uma chave da API Gemini configurada, pedir dica/diálogo num exercício TS com erro de tipo
   e conferir se o tutor explica o erro sem sugerir any/as/@ts-ignore.
2. Logado com Google, concluir um exercício TS e conferir que o progresso volta após recarregar
   (sincronização com o Firestore).

Depois da verificação, marcar a Fase 2 como ✅.

**Fase 3 em andamento** (o usuário pediu para seguir e testar tudo depois; PR #1 foi mesclado na
`main` e a branch de trabalho recomeçou a partir dela).
- 3.1 — tipos (`types/gamification.ts`), cálculo de XP e níveis (`services/xp.ts`), badges
  declarativas (`services/badges.ts`) e `npm run check:xp` (15 testes + calibração). Níveis
  recalibrados contra o volume real (Staff 15.000 → 8.000). XP total é derivado dos `xpEarned`
  congelados — ver "Decisões de modelagem" em `fase-3-gamificacao.md`.

- 3.2 — persistência: `xpEarned` congelado na 1ª conclusão (exercícios e desafios IA),
  `migrateProgress()` com XP/badges retroativos, merge no Firestore que nunca perde XP nem
  conclusão, `badges` sincronizadas.

- 3.3 — interface: `XpBar` no Header, "+N XP" no acerto, `CareerCard` no Dashboard, `BadgeGrid`
  na aba Progresso, toast de conquista. Header reequilibrado (overflow em 1280+). Dicas/critérios
  DEV não consomem mais a "1ª tentativa" (`countAttempt: false`).

- 3.4 — integração: "+N XP" nos Desafios IA, "até +N XP" nos cards do catálogo, gráfico de XP
  por dia (14 dias, fuso de Fortaleza, com tabela) na aba Progresso. **Todas as tarefas da Fase 3
  concluídas.**

**Pendente de verificação manual (Fase 3):** logado com Google, concluir um exercício e conferir
em outro navegador que o XP e as conquistas aparecem (sincronização com o Firestore).

**Fase 4 iniciada.** 4.1 — usuário decidiu por **trilha "Lógica" própria**. Modelagem: `Track`
separado de `Language`; exercícios de Lógica com variantes JS e TS (`logicVariants`) e
`resolveLogicExercise()` montando a versão escolhida (avaliador/XP sem mudanças); convenção de
ID `logica-001-...`/`logica-c01-...`/`logica-r01-...`; `src/data/logica/` registrado (vazio).
Acrescentada a tarefa 4.6 (interface da trilha), que o plano não tinha.

**Próximo passo:** 4.6 (interface) antes da 4.3 — para cada lote convertido já poder ser testado
na tela — ou 4.3 direto (conversão em lotes de 20). Confirmar a ordem com o usuário.
Lembrete: até a 2.6 a avaliação de TS é um stub — exercícios `lacunas` e `prever_saida`
já funcionam (não dependem do compilador); `codigo_livre`, `corrigir_erros` e
`desafio_pratico` em TS só serão avaliados de verdade após a 2.6.

**Pendências / decisões em aberto:**
- Paleta da Fase 1: implementada com a proposta inicial; ajustes finos só exigem editar `src/styles/tokens.css`.
- ~~Fase 2, tarefa 2.6: regex vs transpilar~~ → **decidido:** compilação real no navegador
  com o pacote oficial `typescript`, em pipeline extensível (compilar → executar → testar).
  Atenção: o TS 7 do lint é nativo e não tem API JS; a 2.6 usa a linha 5.x via alias npm.
  Detalhes em `fase-2-typescript.md`.
- ~~Fase 4, tarefa 4.1: trilha própria vs distribuir~~ → **decidido: trilha "Lógica" própria**, resolvida em JS ou TS.

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

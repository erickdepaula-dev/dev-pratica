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
| **Trilhas** | PHP (88), JavaScript (87) e TypeScript (88) — as três selecionáveis |
| **Níveis** | `basico`, `intermediario`, `avancado`, `dev` |
| **Modalidades** | `lacunas`, `codigo_livre`, `corrigir_erros`, `prever_saida`, `desafio_pratico` |
| **Abas** | `dashboard`, `exercicios`, `desafios_ia`, `progresso`, `guia` |
| **Tutor IA** | Gemini — dica contextual, explicação do enunciado, análise linha a linha (`src/services/aiHint.ts`, `src/components/AiTutorModal.tsx`) |
| **Desafios IA** | Hub + workspace gerados dinamicamente (`src/components/AiChallenges/`) |
| **Ofensiva** | Streak em dias, timezone `America/Fortaleza` (`src/utils/dateUtils.ts`) |
| **Persistência** | localStorage + Firebase Firestore, login Google (`src/services/storage.ts`, `firestoreSync.ts`) |
| **Design system** | Tokens em `src/styles/tokens.css` + `@theme` (`src/index.css`), temas em `src/utils/exerciseTheme.ts`, animações com `motion` e reduced motion global |
| **Avaliação** | Validação de lacunas, regex e test cases (`src/services/evaluator.ts`) |

### Ainda não existe

- ❌ Trilha TypeScript
- ❌ Sistema de XP / níveis de carreira
- ❌ Conquistas (badges)
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
| 2 — Trilha TypeScript | [`fase-2-typescript.md`](./fase-2-typescript.md) | 🟡 Tarefas 2.1 a 2.5 concluídas |
| 3 — Gamificação | [`fase-3-gamificacao.md`](./fase-3-gamificacao.md) | ⬜ Não iniciada |
| 4 — Exercícios dos PDFs | [`fase-4-exercicios.md`](./fase-4-exercicios.md) | 🟡 Tarefa 4.2 concluída (índice extraído) |

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

**Próximo passo:** tarefa `2.6 — Avaliação e tutor` (compilação real de TS no navegador,
tutor ciente de TS, roteiro TS no Guia, decisão sobre `prever_erro_de_tipo`).
Até lá, exercícios TS de código (livre, corrigir, desafio) mostram "validação disponível na 2.6".
Lembrete: até a 2.6 a avaliação de TS é um stub — exercícios `lacunas` e `prever_saida`
já funcionam (não dependem do compilador); `codigo_livre`, `corrigir_erros` e
`desafio_pratico` em TS só serão avaliados de verdade após a 2.6.

**Pendências / decisões em aberto:**
- Paleta da Fase 1: implementada com a proposta inicial; ajustes finos só exigem editar `src/styles/tokens.css`.
- ~~Fase 2, tarefa 2.6: regex vs transpilar~~ → **decidido:** compilação real no navegador
  com o pacote oficial `typescript`, em pipeline extensível (compilar → executar → testar).
  Atenção: o TS 7 do lint é nativo e não tem API JS; a 2.6 usa a linha 5.x via alias npm.
  Detalhes em `fase-2-typescript.md`.
- Fase 4, tarefa 4.1: trilha "Lógica" própria vs distribuir nas trilhas de linguagem.

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

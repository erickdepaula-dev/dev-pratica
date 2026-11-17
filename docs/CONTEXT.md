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
| **Trilhas** | JavaScript (~211 exercícios) e PHP (~245 exercícios) |
| **Níveis** | `basico`, `intermediario`, `avancado`, `dev` |
| **Modalidades** | `lacunas`, `codigo_livre`, `corrigir_erros`, `prever_saida`, `desafio_pratico` |
| **Abas** | `dashboard`, `exercicios`, `desafios_ia`, `progresso`, `guia` |
| **Tutor IA** | Gemini — dica contextual, explicação do enunciado, análise linha a linha (`src/services/aiHint.ts`, `src/components/AiTutorModal.tsx`) |
| **Desafios IA** | Hub + workspace gerados dinamicamente (`src/components/AiChallenges/`) |
| **Ofensiva** | Streak em dias, timezone `America/Fortaleza` (`src/utils/dateUtils.ts`) |
| **Persistência** | localStorage + Firebase Firestore, login Google (`src/services/storage.ts`, `firestoreSync.ts`) |
| **Avaliação** | Validação de lacunas, regex e test cases (`src/services/evaluator.ts`) |

### Ainda não existe

- ❌ Trilha TypeScript
- ❌ Sistema de XP / níveis de carreira
- ❌ Conquistas (badges)
- 🟡 Design system: tokens criados (`src/styles/tokens.css`), aplicação nas telas em andamento
- ❌ Animações consistentes (dependência `motion` instalada mas pouco usada)
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
| 1 — UI Redesign | [`fase-1-ui.md`](./fase-1-ui.md) | 🟡 Tarefas 1.1 a 1.5 concluídas |
| 2 — Trilha TypeScript | [`fase-2-typescript.md`](./fase-2-typescript.md) | ⬜ Não iniciada |
| 3 — Gamificação | [`fase-3-gamificacao.md`](./fase-3-gamificacao.md) | ⬜ Não iniciada |
| 4 — Exercícios dos PDFs | [`fase-4-exercicios.md`](./fase-4-exercicios.md) | 🟡 Tarefa 4.2 concluída (índice extraído) |

**Índice de apoio:** [`fase-4-indice-exercicios.md`](./fase-4-indice-exercicios.md) — catálogo dos 160 exercícios.

Legenda: ⬜ não iniciada · 🟡 em andamento · ✅ concluída

---

## 📌 Onde paramos

**Última atualização:** 2026-11-17

**Fase ativa:** Fase 1 — UI Redesign.

**Concluído:**
- 1.1 — design tokens em `src/styles/tokens.css`, mapeados no `@theme inline` de `src/index.css`
  (classes `bg-surface`, `text-muted`, `bg-gradient-accent`...) e helper `src/utils/exerciseTheme.ts`.
- 1.2 — `Header.tsx` redesenhado: indicador animado (`layoutId`) no gradiente assinatura,
  pills de linguagem, menu hambúrguer no mobile, slot `xpSlot` para a Fase 3.
  `MotionConfig reducedMotion="user"` adicionado em `src/main.tsx`.
  Testado em 375 / 768 / 1024 / 1440 px sem overflow horizontal.
- 1.3 — `Dashboard.tsx` redesenhado: card "Continuar de onde parei" com borda em gradiente e
  `ProgressRing`, 4 cards de estatística, grid de trilhas PHP / JS / TS ("em breve"),
  entrada em cascata (`staggerChildren`). Tema por trilha em `getLanguageTheme`.
- 1.4 — `StreakCard.tsx`: borda em gradiente laranja→vermelho, fogo pulsante, contador
  animado (+1 ao subir) e linha dos 7 dias com preenchimento animado. Pulso verificado
  parado com `prefers-reduced-motion`.
- 1.5 — Workspace e editores migrados para tokens (novos: `text-accent`, `text-syntax-*`),
  abas com indicador animado e transição, shake no erro, animação de acerto, modal animado,
  foco visível nos editores. Testado com "prever saída" (erro e acerto) em 375 e 1440 px.

**Próximo passo:** tarefa `1.6 — Lista de exercícios`.
Obs.: `ExerciseList.tsx` ainda tem um `getTypeMeta` duplicado — será trocado pelo helper na tarefa 1.6.

**Pendências / decisões em aberto:**
- Paleta da Fase 1: implementada com a proposta inicial; ajustes finos só exigem editar `src/styles/tokens.css`.
- Fase 2, tarefa 2.6: como validar TypeScript — regex vs transpilar no browser.
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

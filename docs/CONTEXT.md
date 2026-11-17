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
- ❌ Design system formalizado (cores estão espalhadas pelos componentes)
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

Serão a fonte dos exercícios da **Fase 4**.

---

## 🗺️ Fases do plano

| Fase | Arquivo | Status |
| :--- | :--- | :--- |
| 1 — UI Redesign | [`fase-1-ui.md`](./fase-1-ui.md) | ⬜ Não iniciada |
| 2 — Trilha TypeScript | [`fase-2-typescript.md`](./fase-2-typescript.md) | ⬜ Não iniciada |
| 3 — Gamificação | [`fase-3-gamificacao.md`](./fase-3-gamificacao.md) | ⬜ Não iniciada |
| 4 — Exercícios dos PDFs | [`fase-4-exercicios.md`](./fase-4-exercicios.md) | ⬜ Não iniciada |

Legenda: ⬜ não iniciada · 🟡 em andamento · ✅ concluída

---

## 📌 Onde paramos

**Última atualização:** 2026-11-17

**Fase ativa:** nenhuma — planejamento concluído, aguardando início da Fase 1.

**Próximo passo:** abrir `docs/fase-1-ui.md` e começar pela tarefa `1.1 — Design tokens`.

**Pendências / decisões em aberto:**
- Definir a paleta de cores final da Fase 1 (proposta inicial no arquivo da fase, sujeita a aprovação).

---

## 📝 Changelog

| Data | Fase | O que foi feito |
| :--- | :--- | :--- |
| 2026-11-17 | — | Criado `CLAUDE.md` e a documentação de fases (`docs/`). Plano de ação definido. |

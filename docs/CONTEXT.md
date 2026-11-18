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
| **Avaliação** | Lacunas, regex e test cases (`src/services/evaluator.ts`); **TypeScript compilado de verdade no navegador** (TS 5.9.3, pipeline compilar → executar → testar → regras em `src/services/typescript/`) |

### Ainda não existe

- 🟡 Trilha de Lógica: modelagem e interface prontas; 40 de 160 exercícios (lotes 1–2 da 4.3) — conversão segue nas Fases 4.3–4.4

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
| 4 — Exercícios dos PDFs | [`fase-4-exercicios.md`](./fase-4-exercicios.md) | 🟡 Tarefas 4.1, 4.2 e 4.6 concluídas |

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
| Fases 1, 2, 3 e a Fase 4 até o lote 2 da 4.3 | `main` (Fases 1–2 via PR #1; o resto por fast-forward — o último em 2026-11-18, a pedido do usuário no meio da Fase 4) |
| Trabalho em andamento da fase ativa | branch `claude/gifted-wozniak-kif49s` (igual à `main` até o próximo commit) |

**Regra (definida pelo usuário em 2026-11-18):** o trabalho é feito na branch de trabalho e
**levado para a `main` ao fim de cada fase** (fast-forward, sem PR). Assim a `main` é sempre a
fonte de verdade das fases concluídas; a fase em andamento pode estar à frente, na branch.

### Estado de cada fase

| Fase | Estado | Detalhes |
| :--- | :--- | :--- |
| 1 — UI Redesign | ✅ Concluída | `fase-1-ui.md` |
| 2 — Trilha TypeScript | 🟡 Tarefas feitas; 2 verificações manuais pendentes | `fase-2-typescript.md` |
| 3 — Gamificação | 🟡 Tarefas feitas; 1 verificação manual pendente | `fase-3-gamificacao.md` |
| 4 — Exercícios dos PDFs | 🟡 **Ativa** — 4.1, 4.2 e 4.6 feitas; 4.3 em andamento (lotes 1–2 de 5 feitos: nº 1–40) | `fase-4-exercicios.md` |

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

**4.3 em andamento — lotes 1 e 2 de 5 feitos (exercícios 1 a 40).** Arquivos por módulo em
`src/data/logica/`: `m01PrimeirosAlgoritmos.ts` (nº 1–15, completo), `m02EstruturasCondicionais.ts`
(nº 16–35, completo) e `m03EstruturasDeRepeticao.ts` (nº 36–40 por enquanto; o módulo vai até o 60).
Cada exercício é escrito com o helper `logica()` (`logicFactory.ts`): assinatura JS e TS + um corpo
de solução (`tsBody` quando o TS precisa de anotação, ex.: `const numeros: number[] = []`); o
template ("// Escreva aqui o seu algoritmo") sai automático. Os nº 11–13 (sem enunciado na origem)
foram criados do zero: Idade em dias, Segundos em h/min/s, Consumo médio.

**Próximo passo: lote 3 (nº 41–60)** — resto do módulo 03 (repetição) em
`m03EstruturasDeRepeticao.ts`. Depois lotes 4 (61–80, vetores e matrizes → novo
`m04VetoresEMatrizes.ts`) e 5 (81–100, funções → `m05FuncoesEDesafios.ts`), cada arquivo
registrado em `src/data/logica/index.ts`. Convenções: funções puras (sem leitura de teclado;
"mostrar na tela" vira devolver um array), resultados múltiplos em objeto ou tupla, categorias
como union de literais no TS, decimais comparados com tolerância, testes que reprovam o erro
típico (precedência, `-3 % 2`, fronteiras com `>=`, off-by-one em laços).
Rodar `npm run check:ts -- logica` a cada lote.
Depois: 4.4 (60 bônus) e 4.5 (teste de mesa). Ao fim da Fase 4, levar para a `main`.

Contexto da Fase 4: trilha **"Lógica" própria** (decisão do usuário), resolvida em **JS ou TS**
(PHP não roda no navegador). Modelagem pronta: `Track` separado de `Language`, `logicVariants`
por exercício e `resolveLogicExercise()` — ver "Modelagem decidida (4.1)" em `fase-4-exercicios.md`.

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

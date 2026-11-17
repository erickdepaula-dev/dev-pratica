# 🎨 Fase 1 — UI Redesign

**Status:** 🟡 Em andamento (1.1 concluída)
**Objetivo:** dar ao DevPrática uma identidade visual própria — gradientes, animações e consistência — tendo o coddy.tech como referência.

---

## Contexto

Hoje as cores estão espalhadas direto nas classes Tailwind de cada componente
(`bg-indigo-500/10`, `text-slate-300`, `border-slate-700`...). Isso funciona, mas:

- não há uma paleta única, então telas novas tendem a divergir;
- a dependência `motion` está instalada e quase não é usada;
- falta hierarquia visual — tudo tem o mesmo peso na tela.

Esta fase resolve isso **antes** de criarmos telas novas nas fases seguintes.

---

## Proposta de paleta (sujeita a aprovação)

| Token | Uso | Valor sugerido |
| :--- | :--- | :--- |
| `--bg-base` | Fundo da aplicação | `#0B0F1A` |
| `--bg-surface` | Cards e painéis | `#121829` |
| `--bg-surface-hover` | Hover de cards | `#1A2238` |
| `--border-subtle` | Divisores | `#232B42` |
| `--text-primary` | Texto principal | `#E8ECF5` |
| `--text-muted` | Texto secundário | `#8792AC` |
| `--accent-from` | Início do gradiente de destaque | `#6366F1` (indigo) |
| `--accent-to` | Fim do gradiente de destaque | `#A855F7` (purple) |
| `--success` | Acerto / concluído | `#10B981` |
| `--warning` | Atenção / prever saída | `#F59E0B` |
| `--danger` | Erro / corrigir erros | `#F43F5E` |
| `--streak-from` | Gradiente da ofensiva | `#F97316` |
| `--streak-to` | Gradiente da ofensiva | `#EF4444` |

**Gradiente assinatura:** `linear-gradient(135deg, var(--accent-from), var(--accent-to))`
— usado em botões primários, barra de progresso e destaque do item ativo na navegação.

### Cores por modalidade de exercício

Já existe esse mapeamento em `Dashboard.tsx` (`getExerciseTypeBadge`). A tarefa 1.1
move isso para um único lugar reutilizável, mantendo as cores atuais:

| Modalidade | Cor |
| :--- | :--- |
| `lacunas` | indigo |
| `corrigir_erros` | rose |
| `prever_saida` | amber |
| `desafio_pratico` | emerald |
| `codigo_livre` | cyan |

---

## Tarefas

### 1.1 — Design tokens
- [x] Criar `src/styles/tokens.css` com as CSS variables da paleta
- [x] Importar em `src/index.css`
- [x] Mapear os tokens no `@theme` do Tailwind 4 para virarem classes utilitárias
- [x] Criar `src/utils/exerciseTheme.ts` com o mapa de cor por modalidade e por dificuldade
- [x] Substituir `getExerciseTypeBadge` do `Dashboard.tsx` pelo helper novo

### 1.2 — Header e navegação
- [ ] Redesenhar `src/components/Header.tsx` com o gradiente assinatura no item ativo
- [ ] Indicador de aba ativa animado (`layoutId` do motion)
- [ ] Seletor de linguagem como pills com gradiente no selecionado
- [ ] Deixar espaço reservado para a barra de XP (Fase 3) — sem implementar ainda
- [ ] Responsividade: navegação colapsa em menu no mobile

### 1.3 — Dashboard
- [ ] Cards de estatística com fundo `bg-surface`, borda sutil e brilho no hover
- [ ] Barra de progresso circular ou linear com o gradiente assinatura
- [ ] Animação de entrada em cascata nos cards (`staggerChildren`)
- [ ] Card "Continuar de onde parei" em destaque, com gradiente
- [ ] Grid de progresso por trilha (PHP / JS / TS) lado a lado

### 1.4 — Card de ofensiva (streak)
- [ ] Gradiente laranja→vermelho com animação de pulso no ícone de fogo
- [ ] Linha dos 7 dias da semana com estado preenchido / vazio animado
- [ ] Contador com animação de incremento ao subir o streak

### 1.5 — Workspace de exercício
- [ ] Refinar `ExerciseWorkspace.tsx` com os tokens novos
- [ ] Transição suave entre as abas (enunciado / solução / análise)
- [ ] Feedback de acerto com animação de sucesso (sem confete exagerado)
- [ ] Feedback de erro com shake sutil no botão de verificar
- [ ] Estilizar `FillInBlanksEditor` e `FreeCodeEditor` com foco visível nos tokens

### 1.6 — Lista de exercícios
- [ ] Cards de exercício com badge de modalidade colorido (helper da 1.1)
- [ ] Filtros como chips com estado ativo em gradiente
- [ ] Animação de layout ao filtrar (`AnimatePresence`)
- [ ] Estado vazio ilustrado quando nenhum filtro casa

### 1.7 — Microinterações e estados
- [ ] Skeleton de carregamento para quando o Firestore está sincronizando
- [ ] Toast de sincronização com entrada/saída animada (hoje é um `setTimeout` cru)
- [ ] Hover e focus-visible consistentes em todos os botões
- [ ] Respeitar `prefers-reduced-motion` em todas as animações

---

## Critérios de pronto

- [ ] Nenhuma cor hardcoded fora de `tokens.css` e `exerciseTheme.ts` nos componentes tocados
- [ ] Todas as animações respeitam `prefers-reduced-motion`
- [ ] `npm run lint` e `npm run build` passam
- [ ] Layout testado em mobile (375px) e desktop (1440px)
- [ ] `docs/CONTEXT.md` atualizado

---

## Notas de implementação

- O Tailwind 4 usa `@theme` no CSS em vez de `tailwind.config.js` — os tokens vão lá.
- `motion` v12 importa de `motion/react`, não de `framer-motion`.
- Evitar animar `width`/`height` (causa reflow); preferir `transform` e `opacity`.
- O projeto não tem biblioteca de componentes — tudo é Tailwind na mão. Manter assim.

### Classes utilitárias disponíveis (após a 1.1)

| Token CSS | Classe Tailwind |
| :--- | :--- |
| `--bg-base` | `bg-canvas` (não `bg-base`, para não colidir com `text-base`) |
| `--bg-surface` / `--bg-surface-hover` | `bg-surface` / `bg-surface-hover` |
| `--border-subtle` | `border-subtle` |
| `--text-primary` / `--text-muted` | `text-primary` / `text-muted` |
| `--accent-from` / `--accent-to` | `from-accent-from` / `to-accent-to` |
| `--success` / `--warning` / `--danger` | `text-success`, `bg-danger/10`, etc. |
| `--streak-from` / `--streak-to` | `from-streak-from` / `to-streak-to` |
| gradiente assinatura | `bg-gradient-accent`, `text-gradient-accent` |
| gradiente da ofensiva | `bg-gradient-streak` |
| sombras / raios | `shadow-card`, `shadow-glow`, `rounded-card`, `rounded-control` |

Badges de modalidade e dificuldade: `getExerciseTypeTheme(type)` e
`getDifficultyTheme(difficulty)` em `src/utils/exerciseTheme.ts`
(retornam `label`, `shortLabel`, `badgeClass`, `textClass`).

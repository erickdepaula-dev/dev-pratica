# 🎨 Fase 1 — UI Redesign

**Status:** 🟡 Em andamento (1.1 a 1.5 concluídas)
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
- [x] Redesenhar `src/components/Header.tsx` com o gradiente assinatura no item ativo
- [x] Indicador de aba ativa animado (`layoutId` do motion)
- [x] Seletor de linguagem como pills com gradiente no selecionado
- [x] Deixar espaço reservado para a barra de XP (Fase 3) — sem implementar ainda
- [x] Responsividade: navegação colapsa em menu no mobile

### 1.3 — Dashboard
- [x] Cards de estatística com fundo `bg-surface`, borda sutil e brilho no hover
- [x] Barra de progresso circular ou linear com o gradiente assinatura
- [x] Animação de entrada em cascata nos cards (`staggerChildren`)
- [x] Card "Continuar de onde parei" em destaque, com gradiente
- [x] Grid de progresso por trilha (PHP / JS / TS) lado a lado

### 1.4 — Card de ofensiva (streak)
- [x] Gradiente laranja→vermelho com animação de pulso no ícone de fogo
- [x] Linha dos 7 dias da semana com estado preenchido / vazio animado
- [x] Contador com animação de incremento ao subir o streak

### 1.5 — Workspace de exercício
- [x] Refinar `ExerciseWorkspace.tsx` com os tokens novos
- [x] Transição suave entre as abas (enunciado / solução / análise)
- [x] Feedback de acerto com animação de sucesso (sem confete exagerado)
- [x] Feedback de erro com shake sutil no botão de verificar
- [x] Estilizar `FillInBlanksEditor` e `FreeCodeEditor` com foco visível nos tokens

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
| `--accent-text` | `text-accent` (texto de destaque legível; use no lugar de `text-accent-from` em texto pequeno) |
| `--syntax-*` | `text-syntax-keyword`, `-variable`, `-string`, `-number`, `-comment`, `-tag` |

Badges de modalidade e dificuldade: `getExerciseTypeTheme(type)` e
`getDifficultyTheme(difficulty)` em `src/utils/exerciseTheme.ts`
(retornam `label`, `shortLabel`, `badgeClass`, `textClass`).

### Header (após a 1.2)

- Abas e trilhas são listas (`NAV_ITEMS`, `LANGUAGE_OPTIONS`) em `Header.tsx`.
  **Fase 2:** adicionar a trilha TS em `LANGUAGE_OPTIONS`.
- **Fase 3:** a barra de XP entra pela prop opcional `xpSlot` do `Header` (aparece a partir de `lg`).
- Larguras: `md` só ícones · `lg` rótulos curtos · `xl` ícone + rótulo completo e botão "Continuar".
  Abaixo de `md`, menu hambúrguer (fecha com Esc ou ao escolher uma aba).
- `MotionConfig reducedMotion="user"` em `src/main.tsx` faz todas as animações do motion
  respeitarem `prefers-reduced-motion`. Animações CSS usam `motion-reduce:animate-none`.
### Dashboard (após a 1.3)

- `src/components/ProgressRing.tsx`: anel SVG reutilizável com o gradiente assinatura.
- `getLanguageTheme(language)` em `exerciseTheme.ts`: nome, emoji, selo e cores por trilha.
  É um `Record<Language, ...>`, então a Fase 2 é obrigada (pelo tsc) a cadastrar o tema TS.
- Lista `TRACKS` no `Dashboard.tsx` define as trilhas do grid; o card "TypeScript — Em breve"
  (`UpcomingTrackCard`) deve ser removido quando a trilha TS existir.

### Ofensiva (após a 1.4)

- `src/components/StreakCard.tsx` reúne contador + linha da semana (substitui o antigo card
  "Visão semanal"). Recebe só `streak` de `UserProgress`.
- Contador troca de dígito com spring e mostra "+1" apenas quando o valor **sobe**.
- Dias futuros aparecem com borda tracejada; hoje tem anel laranja.
- Novo utilitário `text-gradient-streak` em `src/index.css`.

### Workspace (após a 1.5)

- `ExerciseWorkspace`, `FillInBlanksEditor`, `FreeCodeEditor` e `PredictOutputViewer` sem
  cores de paleta avulsas. A migração foi feita por regra (slate → canvas/surface/subtle/
  primary/muted; emerald/rose/amber/indigo → success/danger/warning/accent).
- Abas orientadas a dados (`workspaceTabs`) com indicador `layoutId` e conteúdo em
  `AnimatePresence mode="wait"`.
- Erro: shake via `useAnimate` no botão "Verificar" (pulado se `useReducedMotion()`).
- Acerto: selo com spring + um anel que se expande uma vez; painel com brilho verde.
- Editores: `focus-within` com borda accent + `shadow-glow`.

- O dev server roda com `watch: null` — reinicie `npm run dev` para ver alterações.

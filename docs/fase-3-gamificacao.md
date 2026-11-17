# 🎮 Fase 3 — Gamificação

**Status:** 🟡 Todas as tarefas concluídas — sincronização com o Firestore aguarda verificação manual
**Depende de:** Fase 1 (tokens visuais) e Fase 2 (trilha TS entra no cálculo de XP)
**Objetivo:** tornar o progresso visível e recompensador, aproximando a sensação do Coddy.

---

## Contexto

Hoje o único reforço positivo é a **ofensiva (streak)** e a contagem de exercícios
concluídos. O Coddy combina streak com XP, níveis e ligas — e é isso que faz voltar
no dia seguinte.

Como o DevPrática é de uso pessoal, **ligas e leaderboard ficam fora**: não há com
quem competir. O foco é progressão individual.

---

## Modelo de XP

### Peso por dificuldade

| Nível | XP base |
| :--- | :--- |
| `basico` | 10 |
| `intermediario` | 25 |
| `avancado` | 50 |
| `dev` | 120 |

### Modificadores

| Condição | Efeito |
| :--- | :--- |
| Acertou na primeira tentativa | × 1.5 |
| Usou dica do tutor | × 0.8 por dica (piso de × 0.5) |
| Revelou a solução | × 0.2 |
| Refazer exercício já concluído | 0 XP (não acumula) |

### Níveis de carreira

| Nível | XP acumulado | Proposta original |
| :--- | :--- | :--- |
| Iniciante | 0 | 0 |
| Júnior | 400 | 500 |
| Pleno | 1.500 | 2.000 |
| Sênior | 4.000 | 6.000 |
| Staff | 8.000 | 15.000 |

> **Calibrado na 3.1 contra o volume real** (`npm run check:xp` imprime a tabela): o XP base
> total das 3 trilhas é **9.200** (293 exercícios; 13.800 com bônus de 1ª tentativa em tudo).
> Com a proposta original, Staff (15.000) seria inalcançável. Agora: Júnior ≈ o básico de uma
> trilha; Sênior (43%) ≈ uma trilha e meia; Staff (87%) ≈ as três trilhas. Recalibrar após a Fase 4.

### Detalhes do cálculo

- Dicas: × 0.8 **por dica** (0.8ⁿ), com piso de × 0.5 — o piso só entra a partir da 4ª dica.
- Os modificadores se multiplicam; o resultado é arredondado (`Math.round`).
- **Desafios com IA:** base por nível (1–5: 10, 20, 35, 60, 100) × nota/10, com os mesmos
  multiplicadores de 1ª tentativa e dicas.

---

## Conquistas (badges)

Condições declarativas para facilitar adicionar novas sem mexer na lógica.

| Badge | Condição |
| :--- | :--- |
| Primeiro commit | Concluir o primeiro exercício |
| Semana cheia | Streak de 7 dias |
| Mês de disciplina | Streak de 30 dias |
| Sem rede | 10 exercícios seguidos sem usar dica |
| Poliglota | Concluir ao menos 1 exercício em cada trilha |
| Trilha fechada | 100% de uma trilha em um nível |
| Caçador de bugs | 25 exercícios de `corrigir_erros` |
| Compilador humano | 25 exercícios de `prever_saida` |
| Product Owner | Concluir todos os projetos DEV de uma trilha |
| Type checker *(nova)* | 25 exercícios de `prever_erro_de_tipo` (modalidade da Fase 2) |
| Senioridade *(nova)* | Alcançar o nível de carreira Sênior |

"Semana cheia" e "Mês de disciplina" usam a **maior** ofensiva já alcançada, derivada de
`activeDates` — quem já teve 7 dias seguidos antes da Fase 3 ganha a badge retroativamente.

---

## Tarefas

### 3.1 — Modelo e cálculo
- [x] `src/types/gamification.ts`: tipos `XpEvent`, `CareerLevel`, `Badge`, `BadgeCondition`
- [x] `src/services/xp.ts`: cálculo de XP a partir de um `ExerciseAttempt`
- [x] `src/services/badges.ts`: avaliação declarativa das condições de badge
- [x] Testes manuais de sanidade dos cálculos (planilha ou script) — `npm run check:xp` (15 testes + calibração)

### 3.2 — Persistência
- [x] Estender `UserProgress` com `badges` e as tentativas com `xpEarned` (ver "Decisões")
- [x] **Migração defensiva** em `src/services/storage.ts`:
      usuário com progresso antigo recebe XP retroativo calculado dos `attempts` existentes
- [x] Atualizar `firestore.rules` se o shape do documento mudar — revisado: as regras só validam `userId`; `badges` não exige mudança
- [x] Verificar `firestoreSync.ts` — campos novos precisam subir e descer

### 3.3 — Interface
- [x] Barra de XP no `Header.tsx` (espaço já reservado na Fase 1)
- [x] Animação de ganho de XP ao concluir exercício (número subindo + barra preenchendo)
- [x] Card de nível de carreira no `Dashboard.tsx`
- [x] Grid de conquistas — desbloqueadas coloridas, pendentes em silhueta
- [x] Modal/toast ao desbloquear uma badge

### 3.4 — Integração
- [x] Disparar cálculo de XP no fluxo de conclusão do `ExerciseWorkspace.tsx` (no `recordExerciseAttempt`, chamado pelo workspace)
- [x] Disparar também no `AiChallengeWorkspace.tsx` (desafios de IA valem XP) — com "+N XP" no resultado
- [x] Mostrar XP potencial no card do exercício antes de começar ("até +N XP"; concluídos mostram o XP ganho)
- [x] `ProgressReport.tsx`: histórico de XP ganho por dia (`XpHistoryChart`, 14 dias, com tabela)

---

## Critérios de pronto

- [ ] XP é calculado, persistido e sincronizado — cálculo e persistência local **verificados**; sincronização com o Firestore **pendente de verificação manual** (sem login Google no ambiente)
- [x] Usuário com progresso anterior recebe XP retroativo correto (não zera) — `check:xp`
- [x] Badges desbloqueiam nas condições certas (`check:xp` + navegador)
- [x] Refazer exercício não acumula XP (testado no navegador e no `check:xp`)
- [x] `npm run lint` e `npm run build` passam (+ `check:xp` com 18 testes e `check:ts`)
- [x] `docs/CONTEXT.md` atualizado

---

## Decisões de modelagem (3.1)

- **XP congelado na conclusão:** cada tentativa ganha `xpEarned`, calculado uma única vez na
  primeira conclusão. Motivo: hoje, depois de acertar, a solução é exibida automaticamente e
  gravações seguintes salvam `revealedSolution: true`; recalcular faria o XP **cair** depois de
  ganho. Também garante "refazer não acumula".
- **XP total derivado, não armazenado** (desvio da proposta `UserProgress.xp: number`): é a soma
  dos `xpEarned`. Um total separado teria de ser mesclado à parte com o Firestore e poderia
  divergir das tentativas; derivado, o XP retroativo e a sincronização ficam corretos por construção.
- **Badges desbloqueadas armazenadas** (`UserProgress.badges: { id, unlockedAt }[]`), porque não
  podem sumir (ex.: ofensiva quebrada); as **condições** são derivadas dos dados existentes.
- **XP retroativo:** tentativas concluídas antes da Fase 3 recebem XP com os dados gravados
  (1ª tentativa = `attemptsCount <= 1`, dicas = `hintsUsed`), **ignorando o fator de solução**,
  porque o dado antigo não distingue "revelou antes de acertar" de "exibida após o acerto".
- `services/xp.ts` e `services/badges.ts` são puros; o catálogo de exercícios entra por parâmetro.

## Persistência (3.2)

- **Na conclusão** (`storage.ts`): `recordExerciseAttempt` e `recordAiChallengeAttempt` calculam o
  `xpEarned` só na primeira aprovação e reavaliam as badges. `saveAiChallengeDraft` preserva o
  `xpEarned` (salvar rascunho depois de concluir não pode apagar o XP).
- **`migrateProgress()`** (idempotente): XP retroativo para tentativas concluídas sem `xpEarned`;
  `completedAt` ausente (dados muito antigos) ← `lastAttemptAt`; badges retroativas. Roda na carga
  local, na mesclagem com o Firestore e na importação de JSON.
- **Firestore** (`firestoreSync.ts`): `badges` sobe no documento. Na mesclagem, tentativas são
  combinadas por id (`mergeById`): a nuvem prevalece, mas uma conclusão nunca é desfeita e o
  `xpEarned` congelado e a data de conclusão mais antiga são preservados. Badges: união por id,
  mantendo o desbloqueio mais antigo.
- `check:xp` cobre a migração com um progresso realista de antes da Fase 3 (17 testes).
- Testado no navegador: 1ª conclusão de primeira = 15 XP; refazer (3 tentativas) mantém 15 XP.

## Interface (3.3)

- `XpBar.tsx` (Header, `xpSlot`): nível + barra; o número de XP aparece em `2xl`. Ao subir, o
  número conta, a barra preenche e "+N XP" flutua (respeita `prefers-reduced-motion`). No celular,
  aparece no menu.
- Painel de acerto do workspace: "+N XP" na 1ª conclusão; "Já concluído · sem XP extra" ao refazer.
- `CareerCard.tsx` (Dashboard): nível, XP para o próximo, escada de níveis e conquistas recentes.
- `BadgeGrid.tsx` (aba Progresso, seção `#conquistas`): desbloqueadas coloridas com data; pendentes
  em silhueta com a condição visível.
- Toast de conquista: tom `conquista` no `SyncToast`; o `App` compara as badges antes/depois de cada
  atualização. As desbloqueadas na migração da primeira carga não geram toast.
- **Header reequilibrado** (havia overflow): a medição em 1280 px — pulada na Fase 1 — mostrou que
  essa largura já estourava antes da barra, e a versão "completa" (`2xl`) não cabia nem em 1920 px,
  porque o contêiner tem 1280 px. Agora: rótulos curtos da navegação sempre (o completo fica no
  `title`), "Entrar" no lugar de "Salvar no Firebase", e o botão "Continuar" do Header saiu (duplicava
  o card "Continuar de onde parei" do Painel). Sem overflow em 375/768/1024/1280/1440/1536/1920.
- **`countAttempt: false`** em `recordExerciseAttempt` para gravações que não são envio de resposta
  (liberar dica, revelar solução, marcar critério DEV). Antes, elas incrementavam `attemptsCount` e
  tiravam o bônus de 1ª tentativa — no DEV, quem seguia o checklist perdia o × 1.5.

## Integração (3.4)

- Desafio IA: "+N XP" no resultado (ou "Já aprovado · sem XP extra").
- Catálogo: cada card mostra "até +N XP" (máximo: 1ª tentativa, sem dicas) ou o XP ganho.
- `XpHistoryChart.tsx` na aba Progresso: XP por dia nos últimos 14 dias, agrupado no fuso de
  Fortaleza (`xpByDay` em `services/xp.ts`, testado no `check:xp`). Seguiu a skill de dataviz:
  série única sem legenda, cor `--accent-from` validada contra a superfície escura (todas as
  checagens passam), barras finas (máx. 28 px) com topo de 4 px, grade recessiva, tooltip por
  coluna (área de hover/foco = coluna inteira) e alternância para tabela.
- Verificado no navegador com um progresso "antigo" (sem `xpEarned`): XP retroativo por tentativa
  conferido à mão (total 173), badges retroativas, tooltip e tabela; sem overflow em 375 e 1440 px.

## Notas de implementação

- **Cuidado com a migração:** o usuário já tem dezenas de exercícios concluídos.
  Se o XP retroativo não for calculado, o nível vai aparecer como "Iniciante" com
  centenas de exercícios feitos — frustrante e errado.
- Não dar XP por tentativa, só por conclusão — senão vira farm de submissão errada.
- Ligas e leaderboard: **fora de escopo** (uso pessoal, sem outros usuários).

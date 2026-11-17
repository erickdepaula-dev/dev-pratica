# 🎮 Fase 3 — Gamificação

**Status:** ⬜ Não iniciada
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

| Nível | XP acumulado |
| :--- | :--- |
| Iniciante | 0 |
| Júnior | 500 |
| Pleno | 2.000 |
| Sênior | 6.000 |
| Staff | 15.000 |

> Números são uma proposta inicial. Calibrar depois de rodar contra o volume real
> de exercícios (hoje ~456 em JS+PHP, mais os da Fase 2 e 4).

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

---

## Tarefas

### 3.1 — Modelo e cálculo
- [ ] `src/types/gamification.ts`: tipos `XpEvent`, `CareerLevel`, `Badge`, `BadgeCondition`
- [ ] `src/services/xp.ts`: cálculo de XP a partir de um `ExerciseAttempt`
- [ ] `src/services/badges.ts`: avaliação declarativa das condições de badge
- [ ] Testes manuais de sanidade dos cálculos (planilha ou script)

### 3.2 — Persistência
- [ ] Estender `UserProgress` com `xp: number`, `badges: string[]`
- [ ] **Migração defensiva** em `src/services/storage.ts`:
      usuário com progresso antigo recebe XP retroativo calculado dos `attempts` existentes
- [ ] Atualizar `firestore.rules` se o shape do documento mudar
- [ ] Verificar `firestoreSync.ts` — campos novos precisam subir e descer

### 3.3 — Interface
- [ ] Barra de XP no `Header.tsx` (espaço já reservado na Fase 1)
- [ ] Animação de ganho de XP ao concluir exercício (número subindo + barra preenchendo)
- [ ] Card de nível de carreira no `Dashboard.tsx`
- [ ] Grid de conquistas — desbloqueadas coloridas, pendentes em silhueta
- [ ] Modal/toast ao desbloquear uma badge

### 3.4 — Integração
- [ ] Disparar cálculo de XP no fluxo de conclusão do `ExerciseWorkspace.tsx`
- [ ] Disparar também no `AiChallengeWorkspace.tsx` (desafios de IA valem XP)
- [ ] Mostrar XP potencial no card do exercício antes de começar
- [ ] `ProgressReport.tsx`: histórico de XP ganho por dia

---

## Critérios de pronto

- [ ] XP é calculado, persistido e sincronizado
- [ ] Usuário com progresso anterior recebe XP retroativo correto (não zera)
- [ ] Badges desbloqueiam nas condições certas
- [ ] Refazer exercício não acumula XP
- [ ] `npm run lint` e `npm run build` passam
- [ ] `docs/CONTEXT.md` atualizado

---

## Notas de implementação

- **Cuidado com a migração:** o usuário já tem dezenas de exercícios concluídos.
  Se o XP retroativo não for calculado, o nível vai aparecer como "Iniciante" com
  centenas de exercícios feitos — frustrante e errado.
- Não dar XP por tentativa, só por conclusão — senão vira farm de submissão errada.
- Ligas e leaderboard: **fora de escopo** (uso pessoal, sem outros usuários).

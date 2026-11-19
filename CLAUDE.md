# CLAUDE.md — Instruções para o Agente

> Arquivo de orientação para qualquer sessão de IA (Claude, Gemini, etc.) que trabalhe neste repositório.

---

## 🚦 Protocolo obrigatório ao iniciar uma sessão

**SEMPRE siga esta ordem antes de escrever qualquer código:**

1. **Ler `docs/CONTEXT.md`** — estado atual do projeto, o que já foi feito, onde parou.
   A seção "Onde paramos" diz **em qual branch está o trabalho mais recente** (pode não ser a `main`).
2. **Ler `docs/PLANO.md`** — visão geral das fases e ordem de execução.
3. **Ler o arquivo da fase ativa** (`docs/fase-1-ui.md`, `docs/fase-2-typescript.md`, etc.) — tarefas detalhadas, checklist e critérios de pronto.
4. **Confirmar com o usuário** qual tarefa atacar, caso a fase tenha mais de uma pendência.

**Ao concluir qualquer tarefa:**

1. Marcar o checkbox correspondente no arquivo da fase (`- [ ]` → `- [x]`).
2. Atualizar a seção **"Onde paramos"** em `docs/CONTEXT.md` — ela é um *retrato do estado atual*
   (onde está o código, estado de cada fase, pendências, próximo passo), reescrito a cada tarefa;
   o histórico vai no Changelog e nos arquivos das fases.
3. Atualizar o **Changelog** em `docs/CONTEXT.md` com data e resumo.
4. Rodar `npm run lint` para garantir que a tipagem está válida.

**Levar para a `main`** (fast-forward, sem PR — regra do usuário): ao fim de cada fase **e** de cada
entrega que passou nas verificações (ex.: cada lote de exercícios), porque a `main` publica sozinha
na Vercel (https://dev-pratica.vercel.app) e o usuário acompanha pelo site.

---

## 📐 Convenções do projeto

### Stack
- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **Motion** (`motion/react`) para animações
- **Firebase** (Auth Google + Firestore) para persistência em nuvem
- **Google Gemini** (`@google/genai`) como tutor de IA
- **Express** + **tsx** no `server.ts`
- **lucide-react** para ícones

### Estrutura de pastas
```
src/
├── components/          # Componentes React (um arquivo por componente)
│   └── AiChallenges/    # Subpasta para features maiores
├── data/                # Exercícios estáticos tipados
│   ├── js/              # basic, intermediate, advanced, dev + modalities*
│   ├── php/             # mesma estrutura
│   ├── ts/              # mesma estrutura + typeErrors* (modalidade prever_erro_de_tipo)
│   ├── logica/          # trilha de Lógica (Fase 4), resolvida em JS ou TS (+ teste de mesa em m08)
│   ├── referencia.ts    # operadores e equivalência Portugol/PHP/JS (StudyGuide)
│   ├── guiaRapido.ts    # conteúdo do Guia rápido dos exercícios (Ctrl /, QuickGuide.tsx)
│   └── index.ts         # agregador + helpers de consulta (getExercisesByLanguage/ByTrack)
├── services/            # IO e regras: firebase, firestoreSync, storage, evaluator, deskCheck, aiHint, xp, badges
│   └── typescript/      # compilação real de TS no navegador (núcleo puro + pipeline)
├── styles/              # tokens.css (design tokens)
├── types/               # Interfaces compartilhadas
└── utils/               # Helpers puros (dateUtils, language, track, exerciseTheme)
server/                  # apiApp.ts (rotas /api do Gemini) + vercelEntry.ts (função da Vercel)
scripts/                 # check-ts-exercises.ts, check-gamification.ts, build-vercel.mjs
```

### Regras de código
- **Idioma:** UI, enunciados e comentários em **português (pt-BR)**. Nomes de variáveis, funções e tipos em **inglês**.
- **Tipagem:** nunca usar `any`. Novos tipos vão em `src/types/`.
- **Exercícios:** seguem a interface `Exercise` em `src/types/exercise.ts`. IDs são únicos e usam o padrão `<lang>-<nivel>-<slug>` (ex.: `ts-basico-tipos-primitivos`).
- **Timezone:** streak e datas usam `America/Fortaleza` via `src/utils/dateUtils.ts`. Não trocar sem atualizar o util.
- **Componentes:** funcionais com `React.FC<Props>`, props tipadas em interface acima do componente.
- **Tailwind:** usar os tokens do design system (ver `docs/fase-1-ui.md`), não cores hardcoded avulsas.

### Comandos
```bash
npm run dev     # servidor full-stack (porta 3000)
npm run lint    # tsc --noEmit (TS 7, por caminho explícito) — validação de tipos
npm run check:ts # valida os exercícios TS com o compilador real (rodar ao criar/editar exercícios TS)
npm run check:xp # testes de sanidade de XP, níveis e badges + calibração
npm run build   # build de produção
npm run build:vercel # build da Vercel (.vercel/output) — ver docs/DEPLOY.md
npm start       # produção
```

Roteiro para o usuário rodar e testar localmente: `docs/TESTANDO-LOCAL.md` (manter atualizado
quando mudar comando, variável de ambiente ou o que há para testar).

**Deploy:** Vercel, automático a cada push na `main` (`docs/DEPLOY.md`). As rotas `/api/*` ficam em
`server/apiApp.ts` (usado pelo `server.ts` local e pela função da Vercel) — rota nova vai lá.

---

## 🎯 Decisões de produto já tomadas

| Decisão | Status |
| :--- | :--- |
| Manter trilhas **JavaScript** e **PHP** existentes | ✅ Confirmado |
| Adicionar trilha **TypeScript** | ✅ Confirmado |
| UI polida com **gradientes e animações** (referência: coddy.tech) | ✅ Confirmado |
| Sistema de **certificados** | ❌ Fora de escopo |
| Uso **pessoal** (não é produto multi-usuário) | ✅ Confirmado — aberto para alguns amigos em 2026-11-19 (cada um entra com o próprio Google; as regras do Firestore isolam os dados por usuário) |
| **IA (Gemini) desligada** por padrão, sem custo (`VITE_AI_ENABLED`, `src/config/ai.ts`); recursos de IA mostram um aviso bem-humorado | ✅ Decidido em 2026-11-19 |

---

## ⚠️ Cuidados

- `.env` nunca é commitado. Variáveis novas vão em `.env.example`.
- Não quebrar os IDs de exercícios existentes — o progresso salvo no Firestore referencia esses IDs.
- Alterações em `UserProgress` exigem migração defensiva em `src/services/storage.ts` (usuário já tem dados salvos).
- `firestore.rules` controla o acesso; revisar ao mudar o shape dos documentos.

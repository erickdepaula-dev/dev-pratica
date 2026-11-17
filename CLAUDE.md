# CLAUDE.md — Instruções para o Agente

> Arquivo de orientação para qualquer sessão de IA (Claude, Gemini, etc.) que trabalhe neste repositório.

---

## 🚦 Protocolo obrigatório ao iniciar uma sessão

**SEMPRE siga esta ordem antes de escrever qualquer código:**

1. **Ler `docs/CONTEXT.md`** — estado atual do projeto, o que já foi feito, onde parou.
2. **Ler `docs/PLANO.md`** — visão geral das fases e ordem de execução.
3. **Ler o arquivo da fase ativa** (`docs/fase-1-ui.md`, `docs/fase-2-typescript.md`, etc.) — tarefas detalhadas, checklist e critérios de pronto.
4. **Confirmar com o usuário** qual tarefa atacar, caso a fase tenha mais de uma pendência.

**Ao concluir qualquer tarefa:**

1. Marcar o checkbox correspondente no arquivo da fase (`- [ ]` → `- [x]`).
2. Atualizar a seção **"Onde paramos"** em `docs/CONTEXT.md`.
3. Atualizar o **Changelog** em `docs/CONTEXT.md` com data e resumo.
4. Rodar `npm run lint` para garantir que a tipagem está válida.

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
│   └── index.ts         # agregador + helpers de consulta
├── services/            # Lógica de IO: firebase, firestoreSync, storage, evaluator, aiHint
├── types/               # Interfaces compartilhadas
└── utils/               # Helpers puros (dateUtils)
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
npm run lint    # tsc --noEmit — validação de tipos
npm run build   # build de produção
npm start       # produção
```

---

## 🎯 Decisões de produto já tomadas

| Decisão | Status |
| :--- | :--- |
| Manter trilhas **JavaScript** e **PHP** existentes | ✅ Confirmado |
| Adicionar trilha **TypeScript** | ✅ Confirmado |
| UI polida com **gradientes e animações** (referência: coddy.tech) | ✅ Confirmado |
| Sistema de **certificados** | ❌ Fora de escopo |
| Uso **pessoal** (não é produto multi-usuário) | ✅ Confirmado |

---

## ⚠️ Cuidados

- `.env` nunca é commitado. Variáveis novas vão em `.env.example`.
- Não quebrar os IDs de exercícios existentes — o progresso salvo no Firestore referencia esses IDs.
- Alterações em `UserProgress` exigem migração defensiva em `src/services/storage.ts` (usuário já tem dados salvos).
- `firestore.rules` controla o acesso; revisar ao mudar o shape dos documentos.

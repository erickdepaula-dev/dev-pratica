# 📘 Fase 2 — Trilha TypeScript

**Status:** ⬜ Não iniciada
**Depende de:** Fase 1 (usa os tokens de design para o seletor de linguagem e badges)
**Objetivo:** adicionar TypeScript como terceira trilha, com a mesma profundidade de JS e PHP.

---

## Contexto

Hoje `Language` é `'php' | 'javascript'` e aparece em vários pontos:

- `src/types/exercise.ts` — definição do tipo
- `src/data/index.ts` — agregação e filtros
- `src/services/storage.ts` — linguagem selecionada
- `src/components/Header.tsx` e `Dashboard.tsx` — seletor e contadores
- `src/services/evaluator.ts` — execução/validação por linguagem
- `src/services/aiHint.ts` — prompt do tutor menciona a linguagem

Adicionar `'typescript'` exige tocar todos esses pontos. O TS também traz um desafio
novo: **o erro mais importante é de tipagem, não de runtime** — o avaliador precisa
saber checar isso.

---

## Escopo de conteúdo

### Básico
Tipos primitivos anotados, inferência, `type` vs `interface`, arrays e tuplas,
union e literal types, enums, funções com parâmetros e retorno tipados, parâmetros opcionais.

### Intermediário
Type guards (`typeof`, `in`, `instanceof`), narrowing, generics em funções,
utility types (`Partial`, `Pick`, `Omit`, `Record`, `Required`), `readonly`,
interfaces com index signature, classes com modificadores de acesso.

### Avançado
Generics com `extends` e constraints, conditional types, `infer`,
mapped types, template literal types, discriminated unions,
`satisfies`, declaration merging, módulos e `declare`.

### DEV (projetos com história de usuário)
- Tipagem de uma resposta de API com dados parciais e validação em runtime
- Formulário genérico tipado (campo → tipo do valor → validador)
- Store/contexto React com actions discriminadas e reducer exaustivo
- Cliente HTTP genérico com inferência do tipo de retorno por endpoint

### Modalidades
Mesmas de JS/PHP: `lacunas`, `codigo_livre`, `corrigir_erros`, `prever_saida`, `desafio_pratico`.

**Modalidade nova a avaliar:** `prever_erro_de_tipo` — mostrar um trecho que não compila
e pedir para o usuário identificar qual linha o compilador reclama e por quê.
Decidir na tarefa 2.6 se entra nesta fase ou fica para depois.

---

## Tarefas

### 2.1 — Estender o modelo de dados
- [ ] `src/types/exercise.ts`: `Language = 'php' | 'javascript' | 'typescript'`
- [ ] Verificar todos os lugares que fazem exaustividade sobre `Language` (o `tsc` vai apontar)
- [ ] `src/services/storage.ts`: migração defensiva — progresso salvo sem TS continua válido
- [ ] Rodar `npm run lint` e corrigir todos os erros de exaustividade antes de seguir

### 2.2 — Estrutura de arquivos
- [ ] Criar `src/data/ts/` espelhando `src/data/js/`:
      `basic.ts`, `intermediate.ts`, `advanced.ts`, `dev.ts`,
      `modalitiesBasic.ts`, `modalitiesIntermediate.ts`, `modalitiesAdvanced.ts`, `index.ts`
- [ ] Registrar `tsExercises` em `src/data/index.ts`
- [ ] Convenção de ID: `ts-<nivel>-<slug>` (ex.: `ts-basico-union-types`)

### 2.3 — Conteúdo: básico e intermediário
- [ ] Exercícios do nível básico (meta: ~40, alinhado ao volume de JS)
- [ ] Modalidades do básico
- [ ] Exercícios do nível intermediário (meta: ~40)
- [ ] Modalidades do intermediário

### 2.4 — Conteúdo: avançado e DEV
- [ ] Exercícios do nível avançado (meta: ~40)
- [ ] Modalidades do avançado
- [ ] Projetos DEV com `projectBrief` completo (meta: 3 a 4 projetos)

### 2.5 — Interface
- [ ] Seletor de linguagem no `Header.tsx` com a terceira opção
- [ ] `Dashboard.tsx`: card de progresso da trilha TS
- [ ] `ExerciseList.tsx`: filtros funcionando para TS
- [ ] Ícone / cor própria para a trilha TS (azul TypeScript `#3178C6`)

### 2.6 — Avaliação e tutor
- [ ] `src/services/evaluator.ts`: validação para TS
      (decidir: checagem por regex/padrão esperado vs transpilar e rodar)
- [ ] Decidir se a modalidade `prever_erro_de_tipo` entra nesta fase
- [ ] `src/services/aiHint.ts`: prompt do tutor ciente de TypeScript
      (deve explicar erros de tipo, não só de lógica)
- [ ] `StudyGuide.tsx`: roteiro de estudo da trilha TS

---

## Critérios de pronto

- [ ] Trilha TS selecionável e com exercícios em todos os 4 níveis
- [ ] Progresso da trilha TS persiste no localStorage e no Firestore
- [ ] Tutor IA responde adequadamente a exercícios de TS
- [ ] Progresso antigo (só JS/PHP) continua carregando sem erro
- [ ] `npm run lint` e `npm run build` passam
- [ ] `docs/CONTEXT.md` atualizado

---

## Notas de implementação

- **Decisão técnica em aberto (tarefa 2.6):** validar TS é diferente de validar JS.
  Opções: (a) comparar com padrões esperados via regex — simples, mas frágil;
  (b) transpilar no browser com a API do TypeScript e ler os diagnósticos — mais fiel,
  mas adiciona peso ao bundle. Avaliar antes de escrever o avaliador.
- Evitar duplicar exercícios de JS só adicionando tipos. O valor da trilha TS está
  no que é **exclusivo** de TypeScript: o sistema de tipos.
- `satisfies` e template literal types exigem TS 4.9+ / 5.x — o projeto usa TS 7, tudo disponível.

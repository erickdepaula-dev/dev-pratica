# 📘 Fase 2 — Trilha TypeScript

**Status:** 🟡 Em andamento (2.1 a 2.3 concluídas)
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
- [x] `src/types/exercise.ts`: `Language = 'php' | 'javascript' | 'typescript'`
- [x] Verificar todos os lugares que fazem exaustividade sobre `Language` (o `tsc` vai apontar)
- [x] `src/services/storage.ts`: migração defensiva — progresso salvo sem TS continua válido
- [x] Rodar `npm run lint` e corrigir todos os erros de exaustividade antes de seguir

### 2.2 — Estrutura de arquivos
- [x] Criar `src/data/ts/` espelhando `src/data/js/`:
      `basic.ts`, `intermediate.ts`, `advanced.ts`, `dev.ts`,
      `modalitiesBasic.ts`, `modalitiesIntermediate.ts`, `modalitiesAdvanced.ts`, `index.ts`
- [x] Registrar `tsExercises` em `src/data/index.ts`
- [x] Convenção de ID: `ts-<nivel>-<slug>` (ex.: `ts-basico-union-types`) — checada pelo tipo `TsExercise`

### 2.3 — Conteúdo: básico e intermediário
- [x] Exercícios do nível básico (meta revista: 13 por arquivo principal, como em JS — ver nota)
- [x] Modalidades do básico (5 corrigir_erros, 5 prever_saida, 5 desafio_pratico)
- [x] Exercícios do nível intermediário (meta revista: 13)
- [x] Modalidades do intermediário (5 corrigir_erros, 5 prever_saida, 5 desafio_pratico)

### 2.4 — Conteúdo: avançado e DEV
- [ ] Exercícios do nível avançado (meta revista: 13)
- [ ] Modalidades do avançado
- [ ] Projetos DEV com `projectBrief` completo (meta: 3 a 4 projetos)

### 2.5 — Interface
- [ ] Seletor de linguagem no `Header.tsx` com a terceira opção
- [ ] `Dashboard.tsx`: card de progresso da trilha TS
- [ ] `ExerciseList.tsx`: filtros funcionando para TS
- [x] Ícone / cor própria para a trilha TS (azul TypeScript `#3178C6`)

### 2.6 — Avaliação e tutor
- [ ] `src/services/evaluator.ts`: validação para TS com **compilação real no navegador**
      (decidido — ver "Decisão: validação de TypeScript" abaixo). Substituir o stub
      `evaluateTypeScriptCode` criado na 2.1.
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

### Decisão: validação de TypeScript (tomada em 2026-11-17, implementar na 2.6)

**Compilação real no navegador com o pacote oficial `typescript`** — nada de regex.
A plataforma deve apontar erros reais de **sintaxe e de tipagem** (os diagnósticos do
compilador, com linha, coluna e código `TSxxxx`).

**Restrição descoberta na 2.1:** o `typescript@7.x` que o projeto usa como devDependency
(para o `npm run lint`) é a versão **nativa em Go**: o pacote só traz o binário do `tsc` e
uma API instável que conversa com ele — **não tem** `createProgram`/`transpileModule` e não
roda no navegador. A API JavaScript do compilador está na linha **5.x** (5.9.3 hoje).
Caminho previsto: instalar a 5.x como dependência de runtime com alias npm, mantendo o
TS 7 do lint intacto. Exemplo: `"typescript-browser": "npm:typescript@5.9.3"`. O pacote
continua sendo o oficial da Microsoft, só com outro nome local.

**Arquitetura pedida — preparada para crescer:** a validação deve ser um pipeline de
etapas independentes, para no futuro somar execução e testes sem reescrever o avaliador:

1. **Compilar** (2.6): diagnósticos sintáticos + semânticos via `ts.createProgram` com um
   `CompilerHost` em memória (arquivo do usuário + `lib.*.d.ts` necessárias).
2. **Executar** (futuro): reaproveitar o JS emitido pela etapa 1 no sandbox de JS que já
   existe em `evaluateJavaScriptFreeCode`.
3. **Testar** (futuro): rodar os `testCases` do exercício contra o JS emitido.

Cada etapa recebe o resultado da anterior e pode interromper o pipeline (ex.: erro de
tipo → não executa). O resultado final continua sendo um `EvaluationResult`.

**Cuidados de implementação (2.6):**
- O compilador pesa vários MB: carregar com `import()` dinâmico só quando um exercício TS
  for avaliado (não entra no bundle inicial). Considerar rodar em Web Worker para não
  travar a UI durante a checagem.
- As `lib.*.d.ts` precisam ser servidas ao `CompilerHost` (ex.: importadas com `?raw` do Vite).
- Os diagnósticos devem chegar ao usuário traduzidos em contexto (linha + mensagem), e o
  tutor IA (`aiHint.ts`) deve recebê-los para explicar o erro de tipo.
- Evitar duplicar exercícios de JS só adicionando tipos. O valor da trilha TS está
  no que é **exclusivo** de TypeScript: o sistema de tipos.
- `satisfies` e template literal types exigem TS 4.9+ — disponíveis tanto no TS 7 (lint)
  quanto no TS 5.9 (compilação no navegador).

### Conteúdo (2.3 / 2.4)

- **Volume:** a meta original de "~40 por nível, alinhado ao volume de JS" partiu de uma
  contagem errada. A trilha JS tem **28 por nível** (13 no arquivo principal: 10 lacunas +
  1 corrigir_erros + 1 prever_saida + 1 desafio/livre; e 15 nas modalidades: 5 + 5 + 5).
  A trilha TS segue esse volume.
- **Foco no que é exclusivo de TS:** cada exercício exercita o sistema de tipos. Exercícios
  de correção partem de **erros reais do compilador** (TS2322, TS2366, TS18048...) e os
  desafios usam `typeAssertions` para provar a tipagem (ex.: que a função recusa `string`).
- **Todo o código assume `strict: true`** (vários bugs — ex.: "possibly undefined" — só
  existem com strict).

### Regras do avaliador TS (definidas ao validar o conteúdo; implementar na 2.6)

- Compilar com `strict: true`, `target: ES2022`, `lib: ['lib.es2022.d.ts']` (sem DOM — evita
  colisões como a global `name`) e um ambiente mínimo declarando `console`.
- `moduleDetection: legacy` / `module: None`: o JS emitido é um script, sem `export {}`,
  e pode ser executado com `new Function` como no avaliador de JS.
- **`typeAssertions` nunca executam:** envolver em `function __typeAssertions(): void { ... }`
  (não chamada) e compilar junto com o código do usuário. Uma diretiva `@ts-expect-error`
  sem erro vira TS2578 — é assim que "isto deve ser rejeitado" é verificado.
- **Cada `testFunction` roda no próprio escopo:** `return (function () { <teste> })();`,
  para não colidir com nomes declarados pelo usuário.
- Erros de tipo interrompem o pipeline antes da execução (o usuário vê os diagnósticos).

### Verificador de conteúdo (QA)

Todo exercício TS foi validado por um script com o compilador real (TS 5.9.3): a solução
compila sem erros e passa nos testes; o código bugado dos `corrigir_erros` falha (e o erro
cai em `buggyLineNumbers`); as lacunas preenchidas com as respostas esperadas compilam; a
saída real de cada `prever_saida` bate com o gabarito; a solução cumpre as próprias
`validationRules`. O script entra no repositório na
2.6 como `scripts/check-ts-exercises.ts`, junto com a dependência `typescript@5` — antes
disso, o `npm run lint` (TS 7) não tem os tipos da API do compilador.

### O que a 2.1 deixou pronto

- `Language` inclui `'typescript'`; `src/utils/language.ts` tem `LANGUAGES` (lista de
  trilhas, checada contra o tipo), `isLanguage()` (type guard para dados externos) e
  `assertNever()` (exaustividade em `switch`).
- `storage.ts` e `firestoreSync.ts` validam `selectedLanguage` com `isLanguage` — valor
  desconhecido volta para `'php'`; progresso antigo (só PHP/JS) carrega igual. Testado com
  progresso antigo, valor corrompido e campo ausente. `firestore.rules` não restringe o campo.
- `evaluator.ts`: `evaluateCodeForLanguage` é o despacho único e exaustivo por linguagem.
  Antes, código TS cairia no avaliador de **PHP** (ternários `=== 'javascript' ? … : php`).
- Desafios com IA continuam só PHP/JS: `AiChallengeLanguage = Exclude<Language, 'typescript'>`
  e `toAiChallengeLanguage()` (trilha TS abre o hub em JS). TS nos desafios IA está fora do escopo.
- Tema da trilha em `exerciseTheme.ts` com tokens `--lang-typescript` (#3178C6) e
  `--lang-typescript-text` (#7FB3EF, contraste 8:1 — o azul puro tem 3,9:1, abaixo do AA para texto pequeno).
### O que a 2.2 deixou pronto

- `src/data/ts/` com os 7 arquivos (arrays vazios) + `index.ts` agregando na mesma ordem
  das trilhas JS/PHP; `tsExercises` registrado em `allExercises`.
- **Convenção de ID garantida pelo compilador:** cada arquivo é tipado como
  `TsExercise<'basico' | 'intermediario' | 'avancado' | 'dev'>[]` (em `src/types/exercise.ts`),
  que exige `language: 'typescript'`, `difficulty` igual ao do arquivo e
  `id: \`ts-<nivel>-<slug>\``. Verificado: prefixo errado, nível trocado e linguagem
  errada são erros de `tsc`. Use o nível por extenso (`intermediario`, não `inter`).
- `findDuplicateExerciseIds()` em `src/data/index.ts`; em dev, IDs duplicados geram
  `console.error` (hoje: zero duplicados entre os 175 exercícios).
- IDs antigos de PHP/JS: 56 fogem do padrão (ex.: `php-inter-01`) e **não podem mudar**.

- A trilha **ainda não aparece na UI** (seletor/Dashboard são a 2.5) — sem exercícios, ela
  ficaria vazia.

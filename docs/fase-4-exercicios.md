# 📚 Fase 4 — Exercícios dos PDFs

**Status:** 🟡 Em andamento (4.1, 4.2 e 4.6 concluídas)
**Depende de:** Fases 1, 2 e 3 (usa tokens, trilha TS e sistema de XP já estabilizados)
**Objetivo:** converter o material de estudo em PDF em exercícios da plataforma.

---

## Material de origem

Pasta local `C:\CURSO\programacao` (não versionada no repositório):

| Arquivo | Conteúdo |
| :--- | :--- |
| `100_Exercicios_Logica.pdf` | 100 exercícios de lógica de programação |
| `GABARITO_100_EXERCICIOS_LOGICA_PROGRAMACAO_A4.pdf` | Gabarito dos 100 |
| `30 Exercícios Extras de Condicionais.pdf` | 30 exercícios de condicionais |
| `30 Exercícios Extras de Estruturas de Repetição.pdf` | 30 exercícios de laços |
| `Guia de Equivalência - Portugol, Python e JavaScript.pdf` | Tabela de equivalência de sintaxe |
| `Guia Rápido de Operadores.pdf` | Referência de operadores |
| `Guia Visual de Teste de Mesa.pdf` | Método de teste de mesa |

**Total:** 160 exercícios de lógica, já catalogados em
**[`fase-4-indice-exercicios.md`](./fase-4-indice-exercicios.md)** — número, módulo e título
de cada um, com a progressão de tópicos. Comece por ali, não pelos PDFs.

Os PDFs não estão versionados (ficam em `C:\CURSO\programacao`), mas o índice já
carrega o que a conversão precisa saber.

---

## Decisão de arquitetura: trilha "Lógica Pura"

Esses exercícios são **independentes de linguagem** — o mesmo problema de lógica
pode ser resolvido em JS, TS ou PHP. Duas abordagens:

**(a) Distribuir nas trilhas existentes** — cada exercício entra como nível básico de JS/TS/PHP.
Simples, mas tripica o conteúdo e infla a contagem das trilhas.

**(b) Criar uma trilha própria "Lógica"** — o usuário escolhe em qual linguagem resolver.
Mais trabalho na UI, mas reflete melhor a natureza do material.

**Recomendação:** opção (b). Decidir na tarefa 4.1 antes de converter em volume.

**✅ Decidido pelo usuário (2026-11-17): opção (b), trilha "Lógica" própria.**

---

## Tarefas

### 4.1 — Decisão e modelagem
- [x] Decidir entre trilha própria vs distribuir nas trilhas existentes — **trilha própria**
- [x] Se trilha própria: estender `Language` ou criar o conceito de `Track` separado de linguagem — **`Track` separado**
- [x] Definir a convenção de ID (ex.: `logica-001-media-aritmetica`)
- [x] Modelar como um exercício aceita solução em mais de uma linguagem

### Modelagem decidida (4.1)

- **`Track = Language | 'logica'`** (`src/types/exercise.ts`). `'logica'` **não** entra em `Language`:
  compilador, avaliador e tutor continuam lidando só com linguagens reais.
- **Linguagens da trilha: JavaScript e TypeScript** (`LogicLanguage`). PHP fica de fora porque não
  há como executá-lo no navegador (o avaliador de PHP é só estrutural) — o plano já pedia
  `solutionCode` em JS e TS.
- Cada exercício de Lógica tem `track: 'logica'`, `language: 'javascript'` (variante padrão) e
  `logicVariants: { javascript, typescript }` com `templateCode`/`solutionCode` (+ `typeAssertions`
  opcional no TS). **`resolveLogicExercise(ex, linguagem)`** (`src/utils/track.ts`) devolve um
  `Exercise` comum da linguagem escolhida: **avaliador, compilador TS, tutor e XP funcionam sem
  nenhuma mudança**. O `id` não muda com a linguagem (o progresso é do exercício).
- **IDs** (tipo `LogicExercise`): `logica-001-soma-de-dois-numeros` (número do índice, 100 principais),
  `logica-c01-...` (bônus de condicionais), `logica-r01-...` (bônus de repetição).
- `getExercisesByLanguage` exclui a Lógica (senão ela inflaria a trilha JS); `getExercisesByTrack`
  serve a nova trilha. Badges: "Trilha fechada" agrupa por trilha (fechar um nível de Lógica vale);
  "Poliglota" continua exigindo as 3 linguagens. Coberto no `check:xp` (20 testes).
- `src/data/logica/index.ts` criado (vazio) e registrado em `allExercises`.

### 4.2 — Extração do conteúdo ✅ CONCLUÍDA
- [x] Extrair a estrutura dos PDFs (texto + OCR nos que são imagem)
- [x] Catalogar os 160 exercícios por módulo e título
- [x] Revisar os títulos onde o OCR falhou
- [x] Gerar o índice em [`fase-4-indice-exercicios.md`](./fase-4-indice-exercicios.md)

**Decisão tomada:** os enunciados **não** foram copiados para o repositório. O material
de origem é uma publicação comercial e o repo é público, então o índice guarda apenas
títulos e tópicos. Os enunciados são escritos do zero na tarefa 4.3, no tom da plataforma.

### 4.3 — Conversão: 100 exercícios de lógica
- [ ] Converter em lotes de 20 para o formato `Exercise`
  - [x] Lote 1 — nº 1–20 (módulo 01 completo + 16–20 do módulo 02)
  - [ ] Lote 2 — nº 21–40
  - [ ] Lote 3 — nº 41–60
  - [ ] Lote 4 — nº 61–80
  - [ ] Lote 5 — nº 81–100
- [ ] Para cada um: `summary`, `description`, `goal`, `realWorldContext`, `testCases`, `explanation`
- [ ] Escrever `solutionCode` em JS e TS
- [ ] Classificar a dificuldade (nem todos os 100 são básicos)

**Convenções (lote 1):** cada exercício é escrito com `logica()` (`src/data/logica/logicFactory.ts`):
assinatura JS + assinatura TS + um corpo de solução (igual nas duas, salvo `tsBody`); o template sai
automático. Funções puras no lugar de "leia do teclado / mostre na tela"; vários resultados viram
objeto (`{ area, perimetro }`) ou tupla (`[number, number]`); categorias viram union de literais no
TS (`'par' | 'ímpar'`); decimais são comparados com tolerância; cada exercício tem ao menos um teste
que reprova o erro típico. Os nº 11–13 (sem enunciado na origem) foram criados: Idade em dias,
Segundos em horas/minutos/segundos, Consumo médio de combustível. Dificuldade do lote 1: 17 básicos,
3 intermediários (12, 19, 20).

### 4.4 — Conversão: condicionais e repetição
- [ ] 30 exercícios de condicionais
- [ ] 30 exercícios de estruturas de repetição
- [ ] Agrupar por tópico para os filtros da lista

### 4.6 — Interface da trilha de Lógica *(acrescentada na 4.1 — o plano não tinha tarefa de UI)*
- [x] Seletor de trilha com "Lógica" (Header, catálogo, Dashboard); `UserProgress.selectedTrack`
      com migração defensiva (progresso antigo: `selectedTrack = selectedLanguage`)
- [x] No workspace de um exercício de Lógica: escolher JS ou TS (lembrar a última escolha)
- [x] `check:ts` (ou um `check:logica`) validando as duas variantes de cada exercício de Lógica
- [x] Card da trilha no Dashboard, XP e conquistas funcionando para a Lógica

**Como ficou (4.6):**
- `TrackPills.tsx` (antigo `LanguagePills`) percorre `TRACKS` com `getTrackTheme`; no Header, entre
  768 e 1023 px, mostra só o emoji. Header sem overflow de 375 a 1920 px — para caber a 4ª trilha,
  o Header deixou de mostrar o número de XP e a palavra "dias" (o XP fica no tooltip da barra e no
  card de carreira).
- Catálogo, Dashboard e Progresso usam a trilha selecionada (`getSelectedTrack`,
  `getExercisesByTrack`). Trilha vazia mostra "Em construção" (e não "Parabéns, trilha concluída").
- Workspace: seletor "Resolver em: JavaScript | TypeScript"; trocar remonta o workspace com a variante
  da linguagem (`App` resolve via `resolveLogicExercise` + `getLogicLanguage`). O código salvo só é
  restaurado na linguagem em que foi escrito (`ExerciseAttempt.logicLanguage`); o progresso (concluído,
  XP) é do exercício e vale para as duas.
- Cor da trilha: ameixa `#A44C8C` (token `--track-logica`), escolhida por busca de matiz — a maior
  distância (OKLab ΔE ≥ 16) de todas as trilhas e cores de status; texto `#ECAED8` (contraste 9,8:1).
- `check:ts` valida a Lógica: solução TS no pipeline, solução JS no avaliador de JS do app e
  templates que **não** passam (o exercício não vem resolvido).
- **Piloto:** `logica-001-soma-de-dois-numeros` (`src/data/logica/m01PrimeirosAlgoritmos.ts`) —
  primeiro exercício do lote 1 da 4.3. Testado no navegador: resolver em JS (+15 XP), trocar para TS
  (editor com o template TS, exercício segue concluído), voltar para JS (código salvo volta).
- **Bug antigo corrigido:** o editor de código livre tinha só 80 px úteis (o contêiner de 390 px tinha
  `flex-1` numa coluna sem altura definida, então o `h-full` dos filhos não resolvia) — rolava com
  3–4 linhas e desalinhava a numeração, em todas as trilhas, desde o commit inicial do projeto.

### 4.5 — Teste de mesa como modalidade
- [ ] Avaliar criar a modalidade `teste_de_mesa`: usuário preenche a tabela de
      valores das variáveis passo a passo
- [ ] Se aprovada: tipo, componente, avaliador e integração com XP
- [ ] Incorporar o conteúdo do `Guia Visual de Teste de Mesa` ao `StudyGuide`

### 4.6 — Material de referência
- [ ] Adicionar o `Guia Rápido de Operadores` como consulta dentro do workspace
- [ ] Adicionar a tabela de equivalência Portugol/Python/JS ao `StudyGuide`

---

## Critérios de pronto

- [ ] ~160 exercícios de lógica disponíveis e resolvíveis
- [ ] Cada exercício tem ao menos um `testCase` válido
- [ ] Gabarito conferido — nenhuma solução de referência quebrada
- [ ] XP calculado corretamente para a trilha nova
- [ ] `npm run lint` e `npm run build` passam
- [ ] `docs/CONTEXT.md` atualizado

---

## Notas de implementação

- **Volume:** esta é a fase mais longa. Trabalhar em lotes de 20 exercícios,
  commitando cada lote, e atualizar o `CONTEXT.md` com o número do último lote concluído.
  Assim uma sessão nova sabe exatamente de onde continuar.
- **Os PDFs não são necessários para a conversão.** O índice já tem o mapa de tópicos.
  Uma sessão sem acesso à pasta local consegue executar a Fase 4 inteira a partir dele.
- Enunciados de exercício de lógica tendem a ser secos ("faça um programa que...").
  Escrever com o `realWorldContext` que o resto da plataforma usa — além de manter o tom,
  é o que evita republicar o texto da apostila.
- Os exercícios **11, 12 e 13** dos 100 não têm enunciado no material de origem.
  Escrever do zero a partir do tópico do Módulo 01.
- Os dois bônus têm numeração própria (1 a 30 cada), independente dos 100. Cuidado
  ao gerar IDs para não colidir: sugestão `logica-100-NNN-slug`, `logica-cond-NN-slug`,
  `logica-rep-NN-slug`.

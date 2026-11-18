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

**Material extraído:** além do índice de títulos, os enunciados completos, requisitos e
tabelas de teste estão em **[`material-apoio/BANCO_EXERCICIOS.md`](./material-apoio/BANCO_EXERCICIOS.md)**
(e em `material-apoio/dataset.json`, estruturado). Use-o para saber a **especificação** de cada
exercício — regra, fronteiras e valores de teste. A prosa (`description`, `realWorldContext`,
`hints`, `explanation`) continua escrita do zero, como nos nº 1 a 80.

Reproduzível com `python3 scripts/build-exercicios.py <pasta-dos-pdfs>`.

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
- [x] Converter em lotes de 20 para o formato `Exercise`
  - [x] Lote 1 — nº 1–20 (módulo 01 completo + 16–20 do módulo 02)
  - [x] Lote 2 — nº 21–40 (módulo 02 completo + 36–40 do módulo 03)
  - [x] Lote 3 — nº 41–60 (módulo 03 completo)
  - [x] Lote 4 — nº 61–80 (módulo 04 completo)
  - [x] Lote 5 — nº 81–100 (módulo 05 completo)
- [x] Para cada um: `summary`, `description`, `goal`, `realWorldContext`, `testCases`, `explanation`
- [x] Escrever `solutionCode` em JS e TS
- [x] Classificar a dificuldade (nem todos os 100 são básicos)

**Tarefa 4.3 concluída.** 100 exercícios na trilha, sem IDs duplicados: 55 básicos,
41 intermediários, 4 avançados.

**Convenções (lote 1):** cada exercício é escrito com `logica()` (`src/data/logica/logicFactory.ts`):
assinatura JS + assinatura TS + um corpo de solução (igual nas duas, salvo `tsBody`); o template sai
automático. Funções puras no lugar de "leia do teclado / mostre na tela"; vários resultados viram
objeto (`{ area, perimetro }`) ou tupla (`[number, number]`); categorias viram union de literais no
TS (`'par' | 'ímpar'`); decimais são comparados com tolerância; cada exercício tem ao menos um teste
que reprova o erro típico. Os nº 11–13 (sem enunciado na origem) foram criados: Idade em dias,
Segundos em horas/minutos/segundos, Consumo médio de combustível. Dificuldade do lote 1: 17 básicos,
3 intermediários (12, 19, 20); lote 2: 10 básicos, 10 intermediários (regras com faixas,
`switch`, várias condições combinadas). Na repetição, "mostrar na tela" vira devolver um array;
lote 3: 9 básicos, 11 intermediários ("ler até" vira percorrer uma lista com sentinela);
lote 4: 8 básicos, 10 intermediários, 2 avançados (Bubble Sort e totais de linhas/colunas); os métodos
prontos da linguagem (sort, filter, reverse…) ficam de fora do enunciado e aparecem só nas explicações.
Lote 5: 12 básicos, 6 intermediários, 2 avançados (99 e 100). O módulo 05 é o único em que a
especificação veio do `BANCO_EXERCICIOS.md` e não só do título — os conjuntos reduzidos de teste do
material (as 5 vendas, a turma de 5 alunos, o estoque de 4 produtos) viraram os `testCases`, com os
números conferidos. Dois ajustes de forma: o procedimento `mostrarTabuada` (nº 90) virou
`linhasDaTabuada`, que devolve as dez linhas num array — o enunciado explica por que uma função que
devolve é testável e um procedimento que imprime não é; e os nº 96 a 100, que no material pedem
várias funções separadas, viram uma função que devolve um objeto com todos os resultados e cujo
corpo se quebra em auxiliares (o avaliador chama uma função só). Nos nº 97, 99 e 100 os vetores
paralelos têm teste de desalinhamento: dados em que trocar o índice ou comparar a coluna errada
(preço em vez de quantidade × preço) dá uma resposta plausível e errada.

### 4.4 — Conversão: condicionais e repetição ✅ CONCLUÍDA
- [x] 30 exercícios de condicionais → **17 convertidos** (`m06BonusCondicionais.ts`, IDs `logica-c<nn>`)
- [x] 30 exercícios de repetição → **4 convertidos** (`m07BonusRepeticao.ts`, IDs `logica-r<nn>`)
- [x] Agrupar por tópico para os filtros: `Bônus — Condicionais` e `Bônus — Repetição`

**Decisão: só os que acrescentam algo.** Os bônus são "exercícios extras" dos módulos 02 e 03, e
boa parte repete exercício que a trilha já tem. Converter os 60 daria ao usuário a mesma função
para resolver duas vezes. Então 21 entraram e 39 ficaram de fora:

*Condicionais — 13 fora.* Regra idêntica a um exercício existente: par ou ímpar (`parOuImpar`),
positivo/negativo/zero (`classificarSinal`), maior de dois (`maiorDeDois`), menor de três
(`menor3`), situação do aluno (`situacaoPorFaixa`), IMC (`classificarImc`), tipo de triângulo
(`tipoTriangulo`), ano bissexto (`ehBissexto`). Variação mínima: pode votar (= `categoriaDeVoto`),
maior de três, menor de dois, empréstimo sem parcelas (= `aprovarEmprestimo`), divisível por 2 e 3
(mesma forma do c12, que ficou).

*Repetição — 26 fora.* Regra idêntica: contagem regressiva, somatório de 1 até N, ler até zero,
maior e menor valor, notas acima da média. Variações do mesmo acumulador que o módulo 03 treina:
somar pares, somar ímpares, produto de 1 até N, contar múltiplos de 3, tabuada, média de N valores,
contagem de 2 em 2 e as demais. Quatro pareciam novas pelo título e não eram — vale registrar,
porque a comparação por título não as pegou: "Mostrar Pares" é o `paresAte` do nº 39, "Contar Pares"
é um recorte do `contarParesEImpares`, e "Contar Negativos" e "Contar Notas Aprovadas" são espelhos
do `contarPositivos`, cuja lição de fronteira inclusiva já está no c26/r26.

**O que os 21 acrescentam.** Nos 17 de condicionais: classificação em faixas em domínios que a
trilha não tinha (faixa etária, preço, energia, imposto, pressão, hora do dia, estoque, bônus de
vendas, conceito A–D, categoria esportiva), um código de letra em vez de número (`turnoDeEstudo`,
com normalização de maiúscula e caso inválido), uma tabela limitada nas duas pontas
(`faixaDoIntervalo`), um valor isolado antes das faixas (`nivelDeEstoque`, em que zero não é
"baixo"), um piso que a tabela não prevê (`categoriaDoNadador` abaixo de 5 anos), dois resultados
de uma faixa só (`descontoDaCompra`) e duas decisões que combinam duas entradas — `temFreteGratis`
com OU e `entradaPermitida`, em que a autorização só vale na faixa de 16 e 17 anos.
Nos 4 de repetição: sentinela recebida por parâmetro (`somarAteSentinela`), gerar a sequência
inteira de Fibonacci em vez de um termo (`primeirosFibonacci`), limite de comparação parametrizado
(`contarAcimaDe`) e parada por soma acumulada em vez de contagem de voltas (`somarAte100`).

**Duas inferências, porque o OCR não leu a tabela.** No desconto da compra (c08) a tabela de faixas
saiu ilegível; os valores de teste do material (80 → 0%, 100 → 0%, 150 → 5%, 250 → 5%, 350 → 10%)
fixam 0% até 100 e 5% até 300, então a fronteira dos 10% foi posta em "acima de 300". Na categoria
do nadador (c22) a tabela começa em 5 anos e não diz o que fazer abaixo disso; uma função tem de
devolver algo, então foi criado o retorno `'sem categoria'`, com teste próprio.

**Uma divergência consciente com o material.** No IMC (c09, que ficou de fora por duplicar o
`classificarImc`) o gabarito classifica 68 kg / 1,65 m como "Sobrepeso", mas o IMC exato é 24,98 —
dentro da faixa "18,5 a 24,9". O material classifica pelo valor já arredondado para 25,0. O
`classificarImc` da trilha usa o valor exato, que é o correto; fica o registro caso alguém compare
os dois e estranhe.

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

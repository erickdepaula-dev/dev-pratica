# 📚 Fase 4 — Exercícios dos PDFs

**Status:** ⬜ Não iniciada
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

**Total estimado:** ~160 exercícios de lógica.

---

## Decisão de arquitetura: trilha "Lógica Pura"

Esses exercícios são **independentes de linguagem** — o mesmo problema de lógica
pode ser resolvido em JS, TS ou PHP. Duas abordagens:

**(a) Distribuir nas trilhas existentes** — cada exercício entra como nível básico de JS/TS/PHP.
Simples, mas tripica o conteúdo e infla a contagem das trilhas.

**(b) Criar uma trilha própria "Lógica"** — o usuário escolhe em qual linguagem resolver.
Mais trabalho na UI, mas reflete melhor a natureza do material.

**Recomendação:** opção (b). Decidir na tarefa 4.1 antes de converter em volume.

---

## Tarefas

### 4.1 — Decisão e modelagem
- [ ] Decidir entre trilha própria vs distribuir nas trilhas existentes
- [ ] Se trilha própria: estender `Language` ou criar o conceito de `Track` separado de linguagem
- [ ] Definir a convenção de ID (ex.: `logica-001-media-aritmetica`)
- [ ] Modelar como um exercício aceita solução em mais de uma linguagem

### 4.2 — Extração do conteúdo
- [ ] Extrair o texto dos PDFs de exercícios
- [ ] Extrair o gabarito e casar cada resposta com seu enunciado
- [ ] Revisar a extração — PDFs costumam quebrar formatação de código
- [ ] Gerar um JSON intermediário com `{ numero, enunciado, gabarito }`

### 4.3 — Conversão: 100 exercícios de lógica
- [ ] Converter em lotes de 20 para o formato `Exercise`
- [ ] Para cada um: `summary`, `description`, `goal`, `realWorldContext`, `testCases`, `explanation`
- [ ] Escrever `solutionCode` em JS e TS
- [ ] Classificar a dificuldade (nem todos os 100 são básicos)

### 4.4 — Conversão: condicionais e repetição
- [ ] 30 exercícios de condicionais
- [ ] 30 exercícios de estruturas de repetição
- [ ] Agrupar por tópico para os filtros da lista

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
- Os PDFs não estão no repositório (pasta local). Uma sessão sem acesso à pasta
  não consegue executar a tarefa 4.2 — registrar isso no `CONTEXT.md` se for o caso.
- Enunciados de exercício de lógica tendem a ser secos ("faça um programa que...").
  Reescrever com o `realWorldContext` que o resto da plataforma usa, para manter o tom.

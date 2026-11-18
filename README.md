# 🚀 DevPrática — Plataforma Interativa para Praticar PHP e JavaScript

O **DevPrática** é um ambiente de aprendizado e treinamento prático de programação focado no desenvolvimento de lógica, sintaxe e resolução de problemas reais do cotidiano de um desenvolvedor de software, com ênfase principal em **PHP** e suporte a **JavaScript**.

---

## 🧭 Documentação de desenvolvimento

O roadmap do projeto vive em [`docs/`](./docs/):

| Arquivo | Para quê |
| :--- | :--- |
| [`CLAUDE.md`](./CLAUDE.md) | Protocolo para sessões de IA: convenções, stack e o que ler antes de codar |
| [`docs/TESTANDO-LOCAL.md`](./docs/TESTANDO-LOCAL.md) | **Como rodar e testar na sua máquina** (instalação, `.env`, verificações, roteiro de teste) |
| [`docs/CONTEXT.md`](./docs/CONTEXT.md) | **Estado atual** — o que já existe, onde paramos, changelog |
| [`docs/PLANO.md`](./docs/PLANO.md) | Visão geral das 4 fases e ordem de execução |
| [`docs/fase-1-ui.md`](./docs/fase-1-ui.md) | Fase 1 — UI redesign (design tokens, gradientes, animações) |
| [`docs/fase-2-typescript.md`](./docs/fase-2-typescript.md) | Fase 2 — Trilha TypeScript |
| [`docs/fase-3-gamificacao.md`](./docs/fase-3-gamificacao.md) | Fase 3 — XP, níveis e conquistas |
| [`docs/fase-4-exercicios.md`](./docs/fase-4-exercicios.md) | Fase 4 — Conversão dos exercícios em PDF |
| [`docs/fase-4-indice-exercicios.md`](./docs/fase-4-indice-exercicios.md) | Catálogo dos 160 exercícios do material de apoio |

> Ao iniciar uma fase: ler `docs/CONTEXT.md` → `CLAUDE.md` → o arquivo da fase.

---

## 📌 Sumário
1. [O que é o DevPrática?](#-o-que-é-o-devprática)
2. [Estrutura da Plataforma](#-estrutura-da-plataforma)
3. [Níveis de Dificuldade e Módulos](#-níveis-de-dificuldade-e-módulos)
4. [Tipos de Exercícios](#-tipos-de-exercícios)
5. [Tutor IA com Google Gemini](#-tutor-ia-com-google-gemini)
6. [Ofensiva e Persistência de Dados (Firebase)](#-ofensiva-e-persistência-de-dados-firebase)
7. [Como Usar: Guia Passo a Passo](#-como-usar-guia-passo-a-passo)
8. [Boas Práticas de Estudo Recomendadas](#-boas-práticas-de-estudo-recomendadas)
9. [Comandos de Execução e Desenvolvimento](#-comandos-de-execução-e-desenvolvimento)

---

## 🎯 O que é o DevPrática?

Diferente de plataformas puramente teóricas ou com questionários de múltipla escolha, o **DevPrática** foi projetado para simular o trabalho real de um desenvolvedor:
- **PHP como linguagem principal:** foco em desenvolvimento backend, conexões seguras com banco via PDO (evitando SQL Injection), sessões, validações de formulário, CRUD, arquitetura orientada a objetos (POO) e princípios SOLID.
- **JavaScript como linguagem secundária:** foco em ecossistema moderno (ES6+), manipulação imutável de coleções (`map`, `filter`, `reduce`), funções assíncronas (`Promises`, `async/await`), desestruturação e escopos.
- **Sem respostas automáticas prontas de bandeja:** o objetivo é exercitar a lógica e o raciocínio crítico através de dicas progressivas e orientação socrática da IA.

---

## 🧭 Estrutura da Plataforma

A aplicação está dividida em 4 seções principais acessíveis pela barra de navegação superior:

1. **Painel (Dashboard):**
   - Visão panorâmica do seu progresso na linguagem ativa.
   - Indicador de **Sequência de Estudos (Ofensiva em dias)**.
   - Métricas de precisão (taxa de acertos) e total de submissões.
   - Distribuição percentual por nível de dificuldade.
   - **Exercícios Recomendados para Hoje:** exibe os próximos desafios pendentes da sua trilha, ocultando automaticamente os que você já concluiu para manter seu foco em conteúdos inéditos.
   - Alternador rápido de linguagem de estudo (**PHP** ou **JavaScript**).

2. **Exercícios:**
   - Catálogo completo de desafios.
   - Filtros dinâmicos por **Nível** (Básico, Intermediário, Avançado, DEV), **Tipo** (Lacunas ou Código Livre) e **Status** (Todos, Pendentes ou Concluídos).
   - Busca textual por palavra-chave no título ou tópico.

3. **Progresso:**
   - Detalhamento de todas as tentativas e soluções enviadas.
   - Identificação de pontos fortes e tópicos com maior taxa de erro para revisão.
   - Opção para reiniciar ou sincronizar dados.

4. **Guia de Estudo:**
   - Roteiro estruturado de aprendizado para PHP e JavaScript do zero à arquitetura profissional.
   - Dicas práticas sobre segurança, clean code e preparação técnica.

---

## 📊 Níveis de Dificuldade e Módulos

Cada trilha conta com desafios distribuídos progressivamente:

| Nível | PHP | JavaScript |
| :--- | :--- | :--- |
| **Básico** | Variáveis, operadores aritméticos/lógicos, condicionais (`if/else`), laços (`foreach`, `for`), arrays associativos e funções tipadas. | Declaração (`const`/`let`), tipos primitivos, template literals, operadores lógicos, laços e funções tradicionais / arrow functions. |
| **Intermediário** | Manipulação de strings/arrays, classes e objetos básicos, encapsulamento (`public`/`private`), tratamento de exceções (`try/catch`) e consultas preparadas PDO. | Métodos de array imutáveis (`map`, `filter`, `reduce`), desestruturação, operador spread, Promises e tratamento de erros. |
| **Avançado** | Injeção de dependências, interfaces, classes abstratas, arquitetura em camadas (Controller/Service/Repository), transações com rollback e validações avançadas. | Programação assíncrona com `async/await`, `Promise.allSettled`, closures, debouncing, throttling e composição de funções. |
| **DEV (Projetos PO)** | **Projetos completos com histórias de usuário do Product Owner:** regras de negócio de checkout e-commerce com cálculo tributário, autenticação com rate limiting e motor de conciliação financeira. | **Projetos completos com requisitos reais:** orquestrador de requisições com retry exponencial, pipeline de validação de formulários reativos e cache local com expiração TTL. |

---

## ✏️ Tipos de Exercícios

### 1. Editor com Lacunas (Fill in the blanks)
- O código do exercício já vem estruturado com a sintaxe e indentação corretas.
- Você só precisa digitar exatamente as expressões, funções ou variáveis que faltam nos campos destacados.
- **Campos limpos:** os inputs não possuem textos de exemplo que poluam a visualização; você pode navegar entre as lacunas com a tecla `Tab`.
- Ao submeter, o sistema avalia suas respostas contra os critérios esperados e apresenta feedback detalhado.

### 2. Editor de Código Livre
- Desenvolvido para problemas onde você escreve ou completa a função inteira de forma independente.
- Permite formatar, testar cenários e comparar com a solução de referência.

---

## 🤖 Tutor IA com Google Gemini

O DevPrática possui um **Tutor de IA Integrado** via Gemini para acelerar seu aprendizado sem estragar o desafio:

### Funcionalidades do Tutor:
1. **Dica Rápida Contextual (`Pedir Dica`):**
   - O Gemini analisa o código ou lacunas que você digitou no momento e aponta com gentileza onde está a falha ou o que falta para completar, em 2 ou 3 frases objetivas.
2. **Caixa de Diálogo do Tutor IA (`💬 Tutor IA & Explicações`):**
   - **"Não entendi o enunciado":** Traduz os requisitos técnicos para uma analogia do dia a dia de um programador, explicando a entrada de dados, o processamento necessário e o retorno esperado.
   - **"Explicar o que sei até o momento":** Permite que você digite a sua linha de raciocínio. O tutor valida o que você compreendeu corretamente e orienta o próximo passo sem dar a resposta pronta.
   - **"Explicar Código Linha a Linha":** Analisa cada linha do código, detalhando:
     - O que ela faz sintaticamente na linguagem.
     - Qual a finalidade prática no fluxo de execução do sistema.
     - Boas práticas recomendadas por desenvolvedores sêniores.

---

## ☁️ Ofensiva e Persistência de Dados (Firebase)

- **Ofensiva em Dias (Streak):**
  - Começa em **0 dias**.
  - Ao resolver seu primeiro exercício, sua ofensiva registra 1 dia.
  - A cada dia consecutivo que você praticar, sua sequência aumenta com o selo de fogo 🔥.
- **Sincronização em Nuvem:**
  - Integrado ao **Firebase Firestore** e **Firebase Authentication (Google)**.
  - Se você estiver no modo convidado, seus dados são salvos localmente no navegador.
  - Ao clicar em **"Entrar com Google"**, todo o seu progresso anterior é automaticamente sincronizado com a sua conta na nuvem, permitindo continuar os estudos em qualquer dispositivo.

---

## 📖 Como Usar: Guia Passo a Passo

1. **Escolha sua Trilha:** Na barra superior ou no Painel, clique em **PHP** (foco principal) ou **JS** (foco secundário).
2. **Selecione um Exercício:** Comece pelo botão **"Continuar de onde parei"** no Dashboard ou vá até a aba **"Exercícios"** e filtre pelo nível desejado (ex: Básico).
3. **Leia o Enunciado e o Objetivo:** Entenda quais são os dados de entrada, as regras de negócio e o valor de retorno esperado.
4. **Preencha o Código:**
   - Se for um exercício de lacunas, digite nos campos em branco. Use `Tab` para pular para a próxima lacuna.
   - Se travar, clique no botão **💡 Pedir Dica** ou abra o **💬 Tutor IA** para discutir o problema com a inteligência artificial.
5. **Verifique sua Resposta:**
   - Clique em **"Verificar Resposta"** (ou use o atalho `Ctrl + Enter` / `Cmd + Enter`).
   - Se acertar: parabéns! Você acumula pontuação, avança sua ofensiva e desbloqueia a aba **"Solução & Análise"** com a explicação detalhada de boas práticas.
   - Se errar: leia o feedback, revise a sintaxe e clique em **"Tentar Novamente"**.
6. **Acompanhe suas Estatísticas:** Acesse o **Painel** e a aba **Progresso** para monitorar sua taxa de acerto e consistência diária.

---

## 💡 Boas Práticas de Estudo Recomendadas

- **Consistência sobre volume:** Praticar 2 a 3 exercícios por dia todos os dias é muito mais eficaz do que resolver 20 exercícios em um único dia e parar por semanas.
- **Não copie e cole:** Sempre digite o código com suas próprias mãos para fixar a memória muscular da sintaxe (pontos e vírgula, cifrões `$`, chaves `{}` e operadores de seta `->` / `=>`).
- **Analise a Solução Recomendada:** Mesmo quando acertar de primeira, leia a aba **"Solução & Análise"** para aprender como um desenvolvedor sênior estruturaria aquele mesmo problema usando recursos modernos.
- **Enfrente os Projetos DEV:** Ao completar os módulos Básico e Intermediário, dedique tempo aos projetos do módulo DEV para se acostumar a interpretar requisitos de negócio reais de Product Owners.

---

## 🛠️ Comandos de Execução e Desenvolvimento

Caso queira executar a plataforma localmente:

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento full-stack (porta 3000)
npm run dev

# 3. Validar a tipagem do TypeScript
npm run lint

# 4. Gerar a build de produção otimizada
npm run build

# 5. Iniciar a aplicação em modo de produção
npm start
```

---

*Bons estudos e mãos no código!* 💻🔥

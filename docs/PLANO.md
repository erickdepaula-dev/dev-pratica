# 🗺️ PLANO DE AÇÃO — DevPrática v2

> Visão geral das fases. Para o estado atual veja [`CONTEXT.md`](./CONTEXT.md).
> Para as tarefas detalhadas, abra o arquivo da fase correspondente.

---

## Premissas

1. **Manter** tudo que já existe em JavaScript e PHP — nenhum exercício é removido ou renumerado.
2. **Adicionar** TypeScript como terceira trilha de primeira classe.
3. **UI polida** com gradientes e animações, tendo o [coddy.tech](https://coddy.tech) como referência estética.
4. **Sem certificados** — fora de escopo.
5. Projeto de **uso pessoal**: priorizar o que motiva a praticar todo dia.

---

## Ordem de execução

```
Fase 1 (UI)  →  Fase 2 (TypeScript)  →  Fase 3 (Gamificação)  →  Fase 4 (PDFs)
```

**Por que nessa ordem:**

- **UI primeiro** porque define os tokens de design que todas as telas seguintes vão consumir.
  Fazer depois significaria refatorar telas novas.
- **TypeScript antes da gamificação** porque gamificação lê o total de exercícios por trilha;
  com a trilha TS já no lugar, o cálculo de XP nasce correto.
- **PDFs por último** porque é o trabalho mais volumoso e mecânico, e se beneficia de
  toda a estrutura (UI, tipos, XP) já estabilizada.

---

## Resumo das fases

### 🎨 [Fase 1 — UI Redesign](./fase-1-ui.md)

Criar um design system com gradientes e animações, e aplicá-lo nas telas principais.

- Design tokens (cores, tipografia, espaçamento, sombras)
- Dashboard redesenhado
- Header / navegação
- Workspace de exercício
- Card de ofensiva animado
- Microinterações e estados de carregamento

**Entrega:** app com identidade visual própria, consistente em todas as telas.

---

### 📘 [Fase 2 — Trilha TypeScript](./fase-2-typescript.md)

Adicionar TypeScript como terceira linguagem, com a mesma profundidade de JS e PHP.

- Estender o tipo `Language`
- Estrutura de dados `src/data/ts/`
- Exercícios: básico, intermediário, avançado, DEV
- Modalidades (lacunas, corrigir erros, prever saída)
- Avaliador adaptado para checagem de tipos
- Guia de estudo da trilha

**Entrega:** trilha TS selecionável, com progresso e tutor funcionando.

---

### 🎮 [Fase 3 — Gamificação](./fase-3-gamificacao.md)

Aproximar a sensação de progresso do que o Coddy oferece.

- Sistema de XP por exercício (peso por dificuldade e modalidade)
- Níveis de carreira: Iniciante → Júnior → Pleno → Sênior → Staff
- Conquistas (badges) com condições declarativas
- Barra de XP animada no header
- Migração defensiva do `UserProgress`

**Entrega:** XP, nível e conquistas visíveis e persistidos.

---

### 📚 [Fase 4 — Exercícios dos PDFs](./fase-4-exercicios.md)

Converter o material de estudo em PDF para exercícios da plataforma.

- Extrair os 100 exercícios de lógica + 30 condicionais + 30 repetições
- Converter para o formato `Exercise` em JS e TS
- Criar a trilha "Lógica Pura", independente de linguagem
- Incorporar o Guia de Teste de Mesa como modalidade

**Entrega:** +160 exercícios de lógica disponíveis na plataforma.

**Resultado (2026-11-18):** ✅ 133 exercícios na trilha "Lógica" (os 39 bônus restantes duplicavam
exercícios) + modalidade `teste_de_mesa` + guia de operadores e tabela Portugol/Python/JS.

---

## Critérios de pronto (válidos para todas as fases)

Uma fase só é marcada como ✅ quando:

- [ ] Todas as tarefas do arquivo da fase estão com `- [x]`
- [ ] `npm run lint` passa sem erros
- [ ] `npm run build` conclui sem erros
- [ ] O progresso salvo de antes da mudança continua carregando (sem perda de dados)
- [ ] `docs/CONTEXT.md` atualizado: status da fase, "Onde paramos" e Changelog

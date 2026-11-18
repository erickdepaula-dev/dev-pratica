import { LogicExercise } from '../../types/exercise';
import { logica } from './logicFactory';

const topic = 'Estruturas Condicionais';

/**
 * Trilha de Lógica — Módulo 02: Estruturas Condicionais (índice: exercícios 16 a 35, completo).
 * Enunciados escritos do zero (ver docs/fase-4-indice-exercicios.md).
 * Nos exercícios que devolvem uma categoria, a variante TS usa union de literais no retorno
 * ('par' | 'ímpar'): o compilador recusa qualquer texto fora das opções.
 */
export const logicModule02: LogicExercise[] = [
  // Índice nº 16 — Positivo, negativo ou zero
  logica({
    id: 'logica-016-positivo-negativo-ou-zero',
    difficulty: 'basico',
    topic,
    title: 'Positivo, Negativo ou Zero',
    summary: 'Classifique um número como positivo, negativo ou zero.',
    realWorldContext:
      'O extrato do banco pinta o valor de verde (entrada), vermelho (saída) ou cinza (zerado). Por trás da cor há um if que olha o sinal do número.',
    description:
      'Implemente classificarSinal(n), que retorna o texto "positivo", "negativo" ou "zero".',
    goal: 'Usar if / else if / else para escolher entre três saídas.',
    signature: {
      javascript: 'function classificarSinal(n)',
      typescript: "function classificarSinal(n: number): 'positivo' | 'negativo' | 'zero'",
    },
    body: `  if (n > 0) {
    return 'positivo';
  } else if (n < 0) {
    return 'negativo';
  } else {
    return 'zero';
  }`,
    typeAssertions: `// @ts-expect-error — o retorno só pode ser uma das três categorias
const categoria: 'positivo' | 'negativo' = classificarSinal(1);`,
    hints: [
      'São três casos que não se sobrepõem: maior que zero, menor que zero e o que sobrar.',
      'Com if / else if / else, só um dos blocos executa. O else final pega o caso que nenhum teste anterior pegou (o zero).',
    ],
    testCases: [
      { description: 'Positivo', input: 'classificarSinal(42)', expectedOutput: '"positivo"', testFunction: "return classificarSinal(42) === 'positivo';" },
      { description: 'Negativo', input: 'classificarSinal(-0.5)', expectedOutput: '"negativo"', testFunction: "return classificarSinal(-0.5) === 'negativo';" },
      { description: 'Zero', input: 'classificarSinal(0)', expectedOutput: '"zero"', testFunction: "return classificarSinal(0) === 'zero';" },
    ],
    explanation:
      'Uma cadeia if / else if / else testa as condições em ordem e executa só o primeiro bloco verdadeiro. No TypeScript, o retorno \'positivo\' | \'negativo\' | \'zero\' é uma union de literais: um erro de digitação como \'positvo\' vira erro de compilação, e quem chama a função sabe exatamente quais textos pode receber.',
  }),

  // Índice nº 17 — Par ou ímpar
  logica({
    id: 'logica-017-par-ou-impar',
    difficulty: 'basico',
    topic,
    title: 'Par ou Ímpar',
    summary: 'Diga se um número inteiro é par ou ímpar.',
    realWorldContext:
      'Tabelas e listas zebradas (uma linha clara, outra escura) decidem a cor pelo índice da linha: par de um jeito, ímpar de outro. O mesmo teste distribui tarefas em turnos alternados.',
    description:
      'Implemente parOuImpar(n), que retorna "par" ou "ímpar". Deve funcionar também com números negativos.',
    goal: 'Usar o resto da divisão por 2 (%) para decidir.',
    signature: {
      javascript: 'function parOuImpar(n)',
      typescript: "function parOuImpar(n: number): 'par' | 'ímpar'",
    },
    body: `  if (n % 2 === 0) {
    return 'par';
  }
  return 'ímpar';`,
    hints: [
      'Um número é par quando o resto da divisão por 2 é zero: n % 2 === 0.',
      'Cuidado com negativos: em JS/TS, -3 % 2 é -1, não 1. Testar n % 2 === 1 erra os ímpares negativos — teste o par (=== 0) e deixe o resto ser ímpar.',
    ],
    testCases: [
      { description: 'Par positivo', input: 'parOuImpar(8)', expectedOutput: '"par"', testFunction: "return parOuImpar(8) === 'par';" },
      { description: 'Ímpar positivo', input: 'parOuImpar(7)', expectedOutput: '"ímpar"', testFunction: "return parOuImpar(7) === 'ímpar';" },
      { description: 'Zero é par', input: 'parOuImpar(0)', expectedOutput: '"par"', testFunction: "return parOuImpar(0) === 'par';" },
      { description: 'Ímpar negativo', input: 'parOuImpar(-3)', expectedOutput: '"ímpar"', testFunction: "return parOuImpar(-3) === 'ímpar';" },
    ],
    explanation:
      'O operador % devolve o resto da divisão e mantém o sinal do dividendo: -3 % 2 === -1. Por isso a forma robusta é testar o caso par (resto 0) e tratar todo o resto como ímpar. Repare também no "return antecipado": quando o if retorna, o else é desnecessário.',
  }),

  // Índice nº 18 — Maior de dois números
  logica({
    id: 'logica-018-maior-de-dois-numeros',
    difficulty: 'basico',
    topic,
    title: 'Maior de Dois Números',
    summary: 'Devolva o maior entre dois números, usando if.',
    realWorldContext:
      'Num leilão online, o sistema compara o lance novo com o maior lance atual e fica com o maior. É uma comparação de dois valores — feita a cada lance.',
    description:
      'Implemente maiorDeDois(a, b), que retorna o maior dos dois números. Se forem iguais, retorne esse valor. Resolva com if — o objetivo é praticar a comparação (deixe o Math.max para depois).',
    goal: 'Comparar a e b com um if e retornar o maior.',
    signature: {
      javascript: 'function maiorDeDois(a, b)',
      typescript: 'function maiorDeDois(a: number, b: number): number',
    },
    body: `  if (a > b) {
    return a;
  }
  return b;`,
    hints: [
      'Compare a > b: se for verdade, a é o maior.',
      'Se a não é maior que b, então b é maior ou igual — e nos dois casos retornar b está certo.',
    ],
    testCases: [
      { description: 'Primeiro é maior', input: 'maiorDeDois(9, 4)', expectedOutput: '9', testFunction: 'return maiorDeDois(9, 4) === 9;' },
      { description: 'Segundo é maior', input: 'maiorDeDois(-2, 3)', expectedOutput: '3', testFunction: 'return maiorDeDois(-2, 3) === 3;' },
      { description: 'Iguais', input: 'maiorDeDois(5, 5)', expectedOutput: '5', testFunction: 'return maiorDeDois(5, 5) === 5;' },
      { description: 'Dois negativos', input: 'maiorDeDois(-8, -1)', expectedOutput: '-1', testFunction: 'return maiorDeDois(-8, -1) === -1;' },
    ],
    explanation:
      'Com dois valores, uma comparação basta: se a não é maior, b é maior ou igual. O caso "iguais" não precisa de tratamento especial porque qualquer um dos dois é a resposta. Na prática você usaria Math.max(a, b), que faz exatamente isso.',
  }),

  // Índice nº 19 — Maior e menor de três números
  logica({
    id: 'logica-019-maior-e-menor-de-tres-numeros',
    difficulty: 'intermediario',
    topic,
    title: 'Maior e Menor de Três Números',
    summary: 'Encontre o maior e o menor entre três números.',
    realWorldContext:
      'Um comparador de preços consulta três lojas e destaca a mais cara e a mais barata. Com três valores já não dá para resolver com uma comparação só — é preciso organizar o raciocínio.',
    description:
      'Implemente maiorEMenor(a, b, c), que retorna { maior, menor }. Resolva com comparações (if), sem Math.max/Math.min.',
    goal: 'Encontrar o maior e o menor de três valores com ifs.',
    signature: {
      javascript: 'function maiorEMenor(a, b, c)',
      typescript: 'function maiorEMenor(a: number, b: number, c: number): { maior: number; menor: number }',
    },
    body: `  let maior = a;
  let menor = a;
  if (b > maior) maior = b;
  if (c > maior) maior = c;
  if (b < menor) menor = b;
  if (c < menor) menor = c;
  return { maior, menor };`,
    hints: [
      'Comece supondo que o primeiro valor é ao mesmo tempo o maior e o menor.',
      'Depois compare cada um dos outros com o "campeão" atual e substitua quando achar alguém maior (ou menor).',
    ],
    testCases: [
      { description: 'Ordem qualquer', input: 'maiorEMenor(4, 9, 1)', expectedOutput: '{ maior: 9, menor: 1 }', testFunction: 'const r = maiorEMenor(4, 9, 1); return r.maior === 9 && r.menor === 1;' },
      { description: 'Maior no início', input: 'maiorEMenor(10, 2, 5)', expectedOutput: '{ maior: 10, menor: 2 }', testFunction: 'const r = maiorEMenor(10, 2, 5); return r.maior === 10 && r.menor === 2;' },
      { description: 'Menor no fim', input: 'maiorEMenor(3, 7, -4)', expectedOutput: '{ maior: 7, menor: -4 }', testFunction: 'const r = maiorEMenor(3, 7, -4); return r.maior === 7 && r.menor === -4;' },
      { description: 'Todos iguais', input: 'maiorEMenor(6, 6, 6)', expectedOutput: '{ maior: 6, menor: 6 }', testFunction: 'const r = maiorEMenor(6, 6, 6); return r.maior === 6 && r.menor === 6;' },
    ],
    explanation:
      'O padrão "supõe o primeiro e corrige ao comparar com os demais" é o mesmo que você vai usar para achar o maior de uma lista inteira com um laço (módulos 03 e 04). Ele evita a explosão de casos de tentar escrever todas as combinações (a > b && a > c, ...).',
  }),

  // Índice nº 20 — Três valores em ordem crescente
  logica({
    id: 'logica-020-tres-valores-em-ordem-crescente',
    difficulty: 'intermediario',
    topic,
    title: 'Três Valores em Ordem Crescente',
    summary: 'Coloque três números em ordem crescente usando só comparações e trocas.',
    realWorldContext:
      'Um pódio de corrida ordena os três melhores tempos. Ordenar três valores à mão — compara, troca se estiver fora de ordem — é a semente dos algoritmos de ordenação que você verá adiante.',
    description:
      'Implemente ordenarTres(a, b, c), que retorna um array com os três valores em ordem crescente. Resolva com comparações e trocas, sem usar .sort().',
    goal: 'Ordenar três valores com ifs e trocas.',
    signature: {
      javascript: 'function ordenarTres(a, b, c)',
      typescript: 'function ordenarTres(a: number, b: number, c: number): [number, number, number]',
    },
    body: `  let x = a;
  let y = b;
  let z = c;
  if (x > y) [x, y] = [y, x];
  if (y > z) [y, z] = [z, y];
  if (x > y) [x, y] = [y, x];
  return [x, y, z];`,
    hints: [
      'Compare o 1º com o 2º e troque se estiverem fora de ordem. Depois o 2º com o 3º. Isso já garante que o maior foi para o final.',
      'Falta uma última comparação entre o 1º e o 2º, porque a segunda troca pode ter trazido um valor menor para o meio. A troca pode ser feita com variável auxiliar ou com [x, y] = [y, x].',
    ],
    testCases: [
      { description: 'Ordem inversa', input: 'ordenarTres(3, 2, 1)', expectedOutput: '[1, 2, 3]', testFunction: 'return JSON.stringify(ordenarTres(3, 2, 1)) === "[1,2,3]";' },
      { description: 'Menor no fim', input: 'ordenarTres(5, 8, 1)', expectedOutput: '[1, 5, 8]', testFunction: 'return JSON.stringify(ordenarTres(5, 8, 1)) === "[1,5,8]";' },
      { description: 'Já ordenado', input: 'ordenarTres(1, 2, 3)', expectedOutput: '[1, 2, 3]', testFunction: 'return JSON.stringify(ordenarTres(1, 2, 3)) === "[1,2,3]";' },
      { description: 'Com repetidos e negativo', input: 'ordenarTres(4, -2, 4)', expectedOutput: '[-2, 4, 4]', testFunction: 'return JSON.stringify(ordenarTres(4, -2, 4)) === "[-2,4,4]";' },
    ],
    explanation:
      'Três comparações com troca bastam para ordenar três valores: as duas primeiras levam o maior para o fim e a terceira acerta os dois primeiros. Isso é, em miniatura, o Bubble Sort — que repete essas "passadas" até a lista inteira estar em ordem.',
  }),
  // Índice nº 21 — Aprovado ou reprovado
  logica({
    id: 'logica-021-aprovado-ou-reprovado',
    difficulty: 'basico',
    topic,
    title: 'Aprovado ou Reprovado',
    summary: 'Calcule a média de duas notas e diga se o aluno passou.',
    realWorldContext:
      'O sistema acadêmico publica a situação de cada aluno no fim do semestre. Um >= trocado por > reprova justamente quem tirou a nota mínima — o tipo de bug que gera fila na secretaria.',
    description:
      'Implemente situacao(nota1, nota2): calcule a média das duas notas e retorne "aprovado" se ela for maior ou igual a 7, ou "reprovado" caso contrário.',
    goal: 'Combinar um cálculo com uma decisão (if / else).',
    signature: {
      javascript: 'function situacao(nota1, nota2)',
      typescript: "function situacao(nota1: number, nota2: number): 'aprovado' | 'reprovado'",
    },
    body: `  const media = (nota1 + nota2) / 2;
  if (media >= 7) {
    return 'aprovado';
  }
  return 'reprovado';`,
    hints: [
      'Primeiro calcule a média (lembre dos parênteses). Depois compare com 7.',
      'A média 7 aprova: a comparação é >= 7, não > 7.',
    ],
    testCases: [
      { description: 'Média 8,5', input: 'situacao(8, 9)', expectedOutput: '"aprovado"', testFunction: "return situacao(8, 9) === 'aprovado';" },
      { description: 'Média 5', input: 'situacao(4, 6)', expectedOutput: '"reprovado"', testFunction: "return situacao(4, 6) === 'reprovado';" },
      { description: 'Média exatamente 7', input: 'situacao(6, 8)', expectedOutput: '"aprovado"', testFunction: "return situacao(6, 8) === 'aprovado';" },
      { description: 'Média 6,5', input: 'situacao(10, 3)', expectedOutput: '"reprovado"', testFunction: "return situacao(10, 3) === 'reprovado';" },
    ],
    explanation:
      'Os valores de fronteira (exatamente 7) são onde os bugs moram: > e >= só diferem ali. Sempre que uma regra disser "a partir de", "no mínimo" ou "até", escreva um teste com o valor exato do limite.',
  }),

  // Índice nº 22 — Situação do aluno por faixa
  logica({
    id: 'logica-022-situacao-do-aluno-por-faixa',
    difficulty: 'basico',
    topic,
    title: 'Situação do Aluno por Faixa',
    summary: 'Classifique a média em aprovado, recuperação ou reprovado.',
    realWorldContext:
      'Muitas escolas têm três situações: aprovado direto, recuperação e reprovado. A regra vira uma escada de faixas — e a ordem dos testes decide se a escada funciona.',
    description:
      'Implemente situacaoPorFaixa(media): retorne "aprovado" para média >= 7, "recuperação" para média >= 5 (e menor que 7) e "reprovado" abaixo de 5.',
    goal: 'Encadear faixas com if / else if / else, da maior para a menor.',
    signature: {
      javascript: 'function situacaoPorFaixa(media)',
      typescript: "function situacaoPorFaixa(media: number): 'aprovado' | 'recuperação' | 'reprovado'",
    },
    body: `  if (media >= 7) {
    return 'aprovado';
  } else if (media >= 5) {
    return 'recuperação';
  }
  return 'reprovado';`,
    hints: [
      'Teste a faixa mais alta primeiro. Se a média não é >= 7, no else if você já sabe que ela é menor que 7.',
      'Por isso o segundo teste pode ser só media >= 5 — não precisa repetir "&& media < 7".',
    ],
    testCases: [
      { description: 'Média 9', input: 'situacaoPorFaixa(9)', expectedOutput: '"aprovado"', testFunction: "return situacaoPorFaixa(9) === 'aprovado';" },
      { description: 'Média 7 (limite)', input: 'situacaoPorFaixa(7)', expectedOutput: '"aprovado"', testFunction: "return situacaoPorFaixa(7) === 'aprovado';" },
      { description: 'Média 6,9', input: 'situacaoPorFaixa(6.9)', expectedOutput: '"recuperação"', testFunction: "return situacaoPorFaixa(6.9) === 'recuperação';" },
      { description: 'Média 5 (limite)', input: 'situacaoPorFaixa(5)', expectedOutput: '"recuperação"', testFunction: "return situacaoPorFaixa(5) === 'recuperação';" },
      { description: 'Média 4,9', input: 'situacaoPorFaixa(4.9)', expectedOutput: '"reprovado"', testFunction: "return situacaoPorFaixa(4.9) === 'reprovado';" },
    ],
    explanation:
      'Numa escada de faixas, cada else if só é avaliado se os testes anteriores falharam — isso "carrega" a informação de que a média está abaixo do degrau anterior. Se você testasse media >= 5 primeiro, uma média 9 cairia em recuperação.',
  }),

  // Índice nº 23 — Categoria de votação
  logica({
    id: 'logica-023-categoria-de-votacao',
    difficulty: 'intermediario',
    topic,
    title: 'Categoria de Votação',
    summary: 'Diga se o voto é proibido, facultativo ou obrigatório pela idade.',
    realWorldContext:
      'No Brasil, o voto é obrigatório dos 18 aos 70 anos e facultativo aos 16, 17 e acima de 70. Um formulário de cadastro eleitoral precisa aplicar exatamente essa regra.',
    description:
      'Implemente categoriaDeVoto(idade): retorne "não vota" para menos de 16 anos, "facultativo" para 16 ou 17 anos e para mais de 70, e "obrigatório" de 18 a 70 anos.',
    goal: 'Combinar condições com || (ou) e && (e).',
    signature: {
      javascript: 'function categoriaDeVoto(idade)',
      typescript: "function categoriaDeVoto(idade: number): 'não vota' | 'facultativo' | 'obrigatório'",
    },
    body: `  if (idade < 16) {
    return 'não vota';
  }
  if (idade < 18 || idade > 70) {
    return 'facultativo';
  }
  return 'obrigatório';`,
    hints: [
      'Trate primeiro quem não vota (menos de 16). Daí em diante, todo mundo tem 16 ou mais.',
      'O facultativo tem duas faixas separadas: 16–17 e acima de 70. Uma condição com || (ou) cobre as duas.',
    ],
    testCases: [
      { description: '15 anos', input: 'categoriaDeVoto(15)', expectedOutput: '"não vota"', testFunction: "return categoriaDeVoto(15) === 'não vota';" },
      { description: '16 anos', input: 'categoriaDeVoto(16)', expectedOutput: '"facultativo"', testFunction: "return categoriaDeVoto(16) === 'facultativo';" },
      { description: '18 anos', input: 'categoriaDeVoto(18)', expectedOutput: '"obrigatório"', testFunction: "return categoriaDeVoto(18) === 'obrigatório';" },
      { description: '70 anos', input: 'categoriaDeVoto(70)', expectedOutput: '"obrigatório"', testFunction: "return categoriaDeVoto(70) === 'obrigatório';" },
      { description: '71 anos', input: 'categoriaDeVoto(71)', expectedOutput: '"facultativo"', testFunction: "return categoriaDeVoto(71) === 'facultativo';" },
    ],
    explanation:
      'Quando uma mesma resposta vale para faixas que não são vizinhas, o operador || junta as duas numa condição só. Eliminar primeiro o caso "não vota" simplifica o resto: a condição seguinte não precisa repetir idade >= 16.',
  }),

  // Índice nº 24 — Ano bissexto
  logica({
    id: 'logica-024-ano-bissexto',
    difficulty: 'intermediario',
    topic,
    title: 'Ano Bissexto',
    summary: 'Descubra se um ano é bissexto pela regra do calendário gregoriano.',
    realWorldContext:
      'Agendas, sistemas de folha e de juros dependem de saber se fevereiro tem 29 dias. A regra tem uma exceção da exceção — e já derrubou sistemas reais na virada de 2000.',
    description:
      'Implemente ehBissexto(ano), que retorna true se o ano for bissexto. Regra: é bissexto se for divisível por 4, exceto os divisíveis por 100 — mas os divisíveis por 400 são bissextos.',
    goal: 'Traduzir uma regra com exceções em uma expressão booleana.',
    signature: {
      javascript: 'function ehBissexto(ano)',
      typescript: 'function ehBissexto(ano: number): boolean',
    },
    body: '  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;',
    hints: [
      '"Divisível por 4" é ano % 4 === 0. Junte com "não divisível por 100" usando &&.',
      'A exceção da exceção (divisível por 400) entra com ||: (divisível por 4 e não por 100) ou divisível por 400.',
    ],
    testCases: [
      { description: '2024', input: 'ehBissexto(2024)', expectedOutput: 'true', testFunction: 'return ehBissexto(2024) === true;' },
      { description: '2023', input: 'ehBissexto(2023)', expectedOutput: 'false', testFunction: 'return ehBissexto(2023) === false;' },
      { description: '1900 (divisível por 100)', input: 'ehBissexto(1900)', expectedOutput: 'false', testFunction: 'return ehBissexto(1900) === false;' },
      { description: '2000 (divisível por 400)', input: 'ehBissexto(2000)', expectedOutput: 'true', testFunction: 'return ehBissexto(2000) === true;' },
    ],
    explanation:
      'Uma função que responde sim/não pode retornar a própria expressão booleana, sem if: return condição. Os quatro testes cobrem cada ramo da regra — 2024 (divisível por 4), 2023 (não), 1900 (exceção) e 2000 (exceção da exceção).',
  }),

  // Índice nº 25 — Preço conforme a forma de pagamento
  logica({
    id: 'logica-025-preco-conforme-a-forma-de-pagamento',
    difficulty: 'intermediario',
    topic,
    title: 'Preço Conforme a Forma de Pagamento',
    summary: 'Aplique desconto ou acréscimo de acordo com a forma de pagamento.',
    realWorldContext:
      'Lojas dão desconto no Pix (sem taxa de maquininha) e cobram juros no parcelado. O checkout recalcula o total a cada troca de forma de pagamento.',
    description:
      'Implemente precoPorPagamento(preco, forma). Formas: "pix" → 10% de desconto; "debito" → 5% de desconto; "credito" → preço normal; "parcelado" → 10% de acréscimo.',
    goal: 'Escolher entre várias opções fixas com switch.',
    signature: {
      javascript: 'function precoPorPagamento(preco, forma)',
      typescript: "function precoPorPagamento(preco: number, forma: 'pix' | 'debito' | 'credito' | 'parcelado'): number",
    },
    body: `  switch (forma) {
    case 'pix':
      return preco * 0.9;
    case 'debito':
      return preco * 0.95;
    case 'credito':
      return preco;
    case 'parcelado':
      return preco * 1.1;
  }`,
    typeAssertions: `// @ts-expect-error — "boleto" não é uma forma de pagamento aceita
precoPorPagamento(100, 'boleto');`,
    hints: [
      'Quando a decisão é "qual destas opções fixas?", o switch costuma ficar mais legível que vários if.',
      '10% de desconto é multiplicar por 0.9; 10% de acréscimo é multiplicar por 1.1.',
    ],
    testCases: [
      { description: 'Pix', input: "precoPorPagamento(200, 'pix')", expectedOutput: '180', testFunction: "return Math.abs(precoPorPagamento(200, 'pix') - 180) < 0.001;" },
      { description: 'Débito', input: "precoPorPagamento(200, 'debito')", expectedOutput: '190', testFunction: "return Math.abs(precoPorPagamento(200, 'debito') - 190) < 0.001;" },
      { description: 'Crédito', input: "precoPorPagamento(200, 'credito')", expectedOutput: '200', testFunction: "return Math.abs(precoPorPagamento(200, 'credito') - 200) < 0.001;" },
      { description: 'Parcelado', input: "precoPorPagamento(200, 'parcelado')", expectedOutput: '220', testFunction: "return Math.abs(precoPorPagamento(200, 'parcelado') - 220) < 0.001;" },
    ],
    explanation:
      'O switch compara um valor com uma lista de casos. Com return em cada case, não é preciso break. No TypeScript, o tipo da forma é uma union de literais: o compilador recusa "boleto" na chamada e ainda sabe que o switch cobre todos os casos — por isso não reclama de faltar um return no fim.',
  }),

  // Índice nº 26 — Reajuste por faixa salarial
  logica({
    id: 'logica-026-reajuste-por-faixa-salarial',
    difficulty: 'intermediario',
    topic,
    title: 'Reajuste por Faixa Salarial',
    summary: 'Aplique um percentual de reajuste diferente para cada faixa de salário.',
    realWorldContext:
      'Acordos coletivos costumam dar reajuste maior para quem ganha menos. O RH precisa enquadrar cada salário na faixa certa antes de aplicar o percentual.',
    description:
      'Implemente reajustePorFaixa(salario), que retorna o novo salário: até R$ 2.000 (inclusive) → +15%; até R$ 5.000 (inclusive) → +10%; acima disso → +5%.',
    goal: 'Escolher o percentual pela faixa e então aplicar o reajuste.',
    signature: {
      javascript: 'function reajustePorFaixa(salario)',
      typescript: 'function reajustePorFaixa(salario: number): number',
    },
    body: `  let percentual;
  if (salario <= 2000) {
    percentual = 15;
  } else if (salario <= 5000) {
    percentual = 10;
  } else {
    percentual = 5;
  }
  return salario + salario * percentual / 100;`,
    tsBody: `  let percentual: number;
  if (salario <= 2000) {
    percentual = 15;
  } else if (salario <= 5000) {
    percentual = 10;
  } else {
    percentual = 5;
  }
  return salario + salario * percentual / 100;`,
    hints: [
      'Separe as duas etapas: primeiro descubra o percentual (if / else if / else), depois faça a conta uma vez só.',
      '"Até R$ 2.000 inclusive" é salario <= 2000.',
    ],
    testCases: [
      { description: 'R$ 1.500 (+15%)', input: 'reajustePorFaixa(1500)', expectedOutput: '1725', testFunction: 'return Math.abs(reajustePorFaixa(1500) - 1725) < 0.001;' },
      { description: 'R$ 2.000 (limite, +15%)', input: 'reajustePorFaixa(2000)', expectedOutput: '2300', testFunction: 'return Math.abs(reajustePorFaixa(2000) - 2300) < 0.001;' },
      { description: 'R$ 5.000 (limite, +10%)', input: 'reajustePorFaixa(5000)', expectedOutput: '5500', testFunction: 'return Math.abs(reajustePorFaixa(5000) - 5500) < 0.001;' },
      { description: 'R$ 8.000 (+5%)', input: 'reajustePorFaixa(8000)', expectedOutput: '8400', testFunction: 'return Math.abs(reajustePorFaixa(8000) - 8400) < 0.001;' },
    ],
    explanation:
      'Separar "decidir" de "calcular" evita repetir a fórmula em cada ramo — se a fórmula mudar, você altera um lugar só. No TypeScript, let percentual: number sem valor inicial é aceito porque o compilador confere que todos os caminhos atribuem um valor antes do uso.',
  }),

  // Índice nº 27 — Classificação de IMC
  logica({
    id: 'logica-027-classificacao-de-imc',
    difficulty: 'intermediario',
    topic,
    title: 'Classificação de IMC',
    summary: 'Calcule o IMC e classifique na faixa correspondente.',
    realWorldContext:
      'Apps de saúde e balanças inteligentes calculam o Índice de Massa Corporal e mostram a faixa. A conta é simples, mas envolve potência e uma escada de faixas com limites decimais.',
    description:
      'Implemente classificarImc(peso, altura), com peso em kg e altura em metros. IMC = peso / altura². Retorne "abaixo do peso" (IMC < 18,5), "peso normal" (< 25), "sobrepeso" (< 30) ou "obesidade" (30 ou mais).',
    goal: 'Calcular o IMC e encadear as faixas.',
    signature: {
      javascript: 'function classificarImc(peso, altura)',
      typescript: "function classificarImc(peso: number, altura: number): 'abaixo do peso' | 'peso normal' | 'sobrepeso' | 'obesidade'",
    },
    body: `  const imc = peso / (altura * altura);
  if (imc < 18.5) return 'abaixo do peso';
  if (imc < 25) return 'peso normal';
  if (imc < 30) return 'sobrepeso';
  return 'obesidade';`,
    hints: [
      'Altura ao quadrado é altura * altura (ou altura ** 2). Cuidado: peso / altura * altura não é a mesma coisa.',
      'Com a faixa em ordem crescente e um return em cada if, cada teste já sabe que o IMC passou dos limites anteriores.',
    ],
    testCases: [
      { description: '50 kg, 1,80 m', input: 'classificarImc(50, 1.8)', expectedOutput: '"abaixo do peso"', testFunction: "return classificarImc(50, 1.8) === 'abaixo do peso';" },
      { description: '70 kg, 1,75 m', input: 'classificarImc(70, 1.75)', expectedOutput: '"peso normal"', testFunction: "return classificarImc(70, 1.75) === 'peso normal';" },
      { description: '85 kg, 1,75 m', input: 'classificarImc(85, 1.75)', expectedOutput: '"sobrepeso"', testFunction: "return classificarImc(85, 1.75) === 'sobrepeso';" },
      { description: '100 kg, 1,70 m', input: 'classificarImc(100, 1.7)', expectedOutput: '"obesidade"', testFunction: "return classificarImc(100, 1.7) === 'obesidade';" },
      { description: 'IMC exatamente 25', input: 'classificarImc(100, 2)', expectedOutput: '"sobrepeso"', testFunction: "return classificarImc(100, 2) === 'sobrepeso';" },
    ],
    explanation:
      'peso / altura * altura é avaliado da esquerda para a direita: divide e depois multiplica, devolvendo o próprio peso. Os parênteses em peso / (altura * altura) garantem o quadrado no denominador. O "if com return" em sequência é uma alternativa ao else if quando cada ramo termina a função.',
  }),

  // Índice nº 28 — É possível formar um triângulo?
  logica({
    id: 'logica-028-e-possivel-formar-um-triangulo',
    difficulty: 'intermediario',
    topic,
    title: 'É Possível Formar um Triângulo?',
    summary: 'Verifique se três medidas podem ser os lados de um triângulo.',
    realWorldContext:
      'Softwares de CAD e motores de jogos validam geometria antes de desenhar: três segmentos só fecham um triângulo se nenhum for comprido demais. Sem a validação, o desenho quebra ou o cálculo de área dá absurdo.',
    description:
      'Implemente formaTriangulo(a, b, c), que retorna true se as medidas formam um triângulo: cada lado precisa ser menor que a soma dos outros dois.',
    goal: 'Juntar três condições com &&.',
    signature: {
      javascript: 'function formaTriangulo(a, b, c)',
      typescript: 'function formaTriangulo(a: number, b: number, c: number): boolean',
    },
    body: '  return a < b + c && b < a + c && c < a + b;',
    hints: [
      'Escreva a condição para cada um dos três lados: a < b + c, e o mesmo para b e para c.',
      'As três precisam valer ao mesmo tempo: junte com &&. Se um lado for igual à soma dos outros, os segmentos ficam "deitados" e não formam triângulo.',
    ],
    testCases: [
      { description: '3, 4, 5', input: 'formaTriangulo(3, 4, 5)', expectedOutput: 'true', testFunction: 'return formaTriangulo(3, 4, 5) === true;' },
      { description: '1, 2, 10', input: 'formaTriangulo(1, 2, 10)', expectedOutput: 'false', testFunction: 'return formaTriangulo(1, 2, 10) === false;' },
      { description: 'Lado igual à soma (2, 3, 5)', input: 'formaTriangulo(2, 3, 5)', expectedOutput: 'false', testFunction: 'return formaTriangulo(2, 3, 5) === false;' },
      { description: 'Lado longo no início (10, 2, 1)', input: 'formaTriangulo(10, 2, 1)', expectedOutput: 'false', testFunction: 'return formaTriangulo(10, 2, 1) === false;' },
    ],
    explanation:
      'É a desigualdade triangular. Os testes trocam a posição do lado mais longo de propósito: quem confere só c < a + b acerta (1, 2, 10) mas erra (10, 2, 1). Quando a regra vale "para cada" elemento, garanta que o código confere todos.',
  }),

  // Índice nº 29 — Tipo de triângulo
  logica({
    id: 'logica-029-tipo-de-triangulo',
    difficulty: 'intermediario',
    topic,
    title: 'Tipo de Triângulo',
    summary: 'Classifique um triângulo em equilátero, isósceles ou escaleno.',
    realWorldContext:
      'Validação em camadas é comum em sistemas: primeiro "isso é válido?", depois "de que tipo é?". Aqui, a primeira camada é o exercício anterior.',
    description:
      'Implemente tipoTriangulo(a, b, c). Se as medidas não formam um triângulo, retorne "inválido". Senão, retorne "equilátero" (3 lados iguais), "isósceles" (exatamente 2 iguais) ou "escaleno" (todos diferentes).',
    goal: 'Validar primeiro, classificar depois.',
    signature: {
      javascript: 'function tipoTriangulo(a, b, c)',
      typescript: "function tipoTriangulo(a: number, b: number, c: number): 'inválido' | 'equilátero' | 'isósceles' | 'escaleno'",
    },
    body: `  if (!(a < b + c && b < a + c && c < a + b)) {
    return 'inválido';
  }
  if (a === b && b === c) {
    return 'equilátero';
  }
  if (a === b || b === c || a === c) {
    return 'isósceles';
  }
  return 'escaleno';`,
    hints: [
      'Comece pela validação: se não formar triângulo, retorne "inválido" e pronto.',
      'Teste equilátero antes de isósceles: um triângulo com três lados iguais também tem "dois lados iguais".',
    ],
    testCases: [
      { description: 'Equilátero', input: 'tipoTriangulo(5, 5, 5)', expectedOutput: '"equilátero"', testFunction: "return tipoTriangulo(5, 5, 5) === 'equilátero';" },
      { description: 'Isósceles', input: 'tipoTriangulo(5, 5, 8)', expectedOutput: '"isósceles"', testFunction: "return tipoTriangulo(5, 5, 8) === 'isósceles';" },
      { description: 'Isósceles (1º e 3º iguais)', input: 'tipoTriangulo(6, 4, 6)', expectedOutput: '"isósceles"', testFunction: "return tipoTriangulo(6, 4, 6) === 'isósceles';" },
      { description: 'Escaleno', input: 'tipoTriangulo(3, 4, 5)', expectedOutput: '"escaleno"', testFunction: "return tipoTriangulo(3, 4, 5) === 'escaleno';" },
      { description: 'Inválido', input: 'tipoTriangulo(1, 1, 5)', expectedOutput: '"inválido"', testFunction: "return tipoTriangulo(1, 1, 5) === 'inválido';" },
    ],
    explanation:
      'A ordem dos testes importa quando as categorias se sobrepõem: todo equilátero satisfaz "a === b", então ele precisa ser testado antes do isósceles. E a validação vem primeiro — (1, 1, 5) tem dois lados iguais, mas não é triângulo.',
  }),

  // Índice nº 30 — Aprovação de empréstimo
  logica({
    id: 'logica-030-aprovacao-de-emprestimo',
    difficulty: 'intermediario',
    topic,
    title: 'Aprovação de Empréstimo',
    summary: 'Aprove o empréstimo só se a parcela couber em 30% do salário.',
    realWorldContext:
      'Bancos limitam a parcela a uma fração da renda (a "margem consignável") para o cliente não se endividar demais. A análise de crédito automática aplica essa regra em segundos.',
    description:
      'Implemente aprovarEmprestimo(salario, valor, meses). A parcela é o valor dividido pelo número de meses (sem juros). Retorne true se a parcela for no máximo 30% do salário.',
    goal: 'Calcular a parcela e o limite, e comparar.',
    signature: {
      javascript: 'function aprovarEmprestimo(salario, valor, meses)',
      typescript: 'function aprovarEmprestimo(salario: number, valor: number, meses: number): boolean',
    },
    body: `  const parcela = valor / meses;
  const limite = salario * 0.3;
  return parcela <= limite;`,
    hints: [
      'Calcule a parcela (valor / meses) e o limite (30% do salário) em variáveis separadas.',
      '"No máximo 30%" inclui exatamente 30%: use <=.',
    ],
    testCases: [
      { description: 'Parcela cabe', input: 'aprovarEmprestimo(3000, 12000, 24)', expectedOutput: 'true', testFunction: 'return aprovarEmprestimo(3000, 12000, 24) === true;' },
      { description: 'Parcela alta', input: 'aprovarEmprestimo(2000, 12000, 12)', expectedOutput: 'false', testFunction: 'return aprovarEmprestimo(2000, 12000, 12) === false;' },
      { description: 'Exatamente 30%', input: 'aprovarEmprestimo(2000, 6000, 10)', expectedOutput: 'true', testFunction: 'return aprovarEmprestimo(2000, 6000, 10) === true;' },
    ],
    explanation:
      'Dar nome às grandezas (parcela, limite) transforma a regra de negócio numa comparação legível: parcela <= limite. A expressão de comparação já é um booleano, então pode ser retornada direto.',
  }),

  // Índice nº 31 — Divisível por 3 e por 5
  logica({
    id: 'logica-031-divisivel-por-3-e-por-5',
    difficulty: 'basico',
    topic,
    title: 'Divisível por 3 e por 5',
    summary: 'Verifique se um número é divisível por 3 e por 5 ao mesmo tempo.',
    realWorldContext:
      'Regras de "a cada N" aparecem em todo lugar: brinde a cada 3 compras, frete grátis a cada 5. Quando as duas coincidem, entra o operador de resto com &&.',
    description:
      'Implemente divisivelPor3e5(n), que retorna true se n for divisível por 3 e também por 5.',
    goal: 'Usar % e && na mesma expressão.',
    signature: {
      javascript: 'function divisivelPor3e5(n)',
      typescript: 'function divisivelPor3e5(n: number): boolean',
    },
    body: '  return n % 3 === 0 && n % 5 === 0;',
    hints: [
      'Divisível por 3 significa resto zero: n % 3 === 0.',
      'As duas condições precisam valer juntas: &&.',
    ],
    testCases: [
      { description: '15', input: 'divisivelPor3e5(15)', expectedOutput: 'true', testFunction: 'return divisivelPor3e5(15) === true;' },
      { description: '9 (só por 3)', input: 'divisivelPor3e5(9)', expectedOutput: 'false', testFunction: 'return divisivelPor3e5(9) === false;' },
      { description: '10 (só por 5)', input: 'divisivelPor3e5(10)', expectedOutput: 'false', testFunction: 'return divisivelPor3e5(10) === false;' },
      { description: '45', input: 'divisivelPor3e5(45)', expectedOutput: 'true', testFunction: 'return divisivelPor3e5(45) === true;' },
    ],
    explanation:
      'Ser divisível por 3 e por 5 é o mesmo que ser divisível por 15 (3 e 5 não têm fatores em comum), então n % 15 === 0 também funciona. Os testes com 9 e 10 garantem que não se usou || por engano.',
  }),

  // Índice nº 32 — Número dentro do intervalo
  logica({
    id: 'logica-032-numero-dentro-do-intervalo',
    difficulty: 'basico',
    topic,
    title: 'Número Dentro do Intervalo',
    summary: 'Verifique se um número está entre um mínimo e um máximo (inclusive).',
    realWorldContext:
      'Formulários validam faixas o tempo todo: idade entre 18 e 99, CEP com 8 dígitos, nota entre 0 e 10. É sempre a mesma pergunta: o valor está dentro dos limites?',
    description:
      'Implemente dentroDoIntervalo(n, minimo, maximo), que retorna true se minimo <= n <= maximo.',
    goal: 'Escrever um intervalo fechado com duas comparações e &&.',
    signature: {
      javascript: 'function dentroDoIntervalo(n, minimo, maximo)',
      typescript: 'function dentroDoIntervalo(n: number, minimo: number, maximo: number): boolean',
    },
    body: '  return n >= minimo && n <= maximo;',
    hints: [
      'Na matemática se escreve minimo <= n <= maximo, mas no código são duas comparações separadas.',
      'Junte n >= minimo e n <= maximo com &&.',
    ],
    testCases: [
      { description: 'No meio', input: 'dentroDoIntervalo(5, 1, 10)', expectedOutput: 'true', testFunction: 'return dentroDoIntervalo(5, 1, 10) === true;' },
      { description: 'No limite inferior', input: 'dentroDoIntervalo(1, 1, 10)', expectedOutput: 'true', testFunction: 'return dentroDoIntervalo(1, 1, 10) === true;' },
      { description: 'No limite superior', input: 'dentroDoIntervalo(10, 1, 10)', expectedOutput: 'true', testFunction: 'return dentroDoIntervalo(10, 1, 10) === true;' },
      { description: 'Abaixo', input: 'dentroDoIntervalo(0, 1, 10)', expectedOutput: 'false', testFunction: 'return dentroDoIntervalo(0, 1, 10) === false;' },
      { description: 'Acima', input: 'dentroDoIntervalo(11, 1, 10)', expectedOutput: 'false', testFunction: 'return dentroDoIntervalo(11, 1, 10) === false;' },
    ],
    explanation:
      'Em JS/TS, 1 <= n <= 10 não faz o que parece: avalia (1 <= n), que vira true ou false, e compara esse booleano com 10 (true vira 1, false vira 0) — o resultado é sempre true. No TypeScript isso nem compila, porque não se compara boolean com number. Use sempre duas comparações com &&.',
  }),

  // Índice nº 33 — Dia da semana
  logica({
    id: 'logica-033-dia-da-semana',
    difficulty: 'basico',
    topic,
    title: 'Dia da Semana',
    summary: 'Converta um número de 1 a 7 no nome do dia da semana.',
    realWorldContext:
      'Bancos de dados e APIs costumam guardar o dia da semana como número. Na hora de exibir para o usuário, alguém precisa traduzir 1 em "domingo".',
    description:
      'Implemente diaDaSemana(n): 1 → "domingo", 2 → "segunda", 3 → "terça", 4 → "quarta", 5 → "quinta", 6 → "sexta", 7 → "sábado". Para qualquer outro número, retorne "inválido".',
    goal: 'Mapear valores fixos com switch (incluindo o caso default).',
    signature: {
      javascript: 'function diaDaSemana(n)',
      typescript: 'function diaDaSemana(n: number): string',
    },
    body: `  switch (n) {
    case 1: return 'domingo';
    case 2: return 'segunda';
    case 3: return 'terça';
    case 4: return 'quarta';
    case 5: return 'quinta';
    case 6: return 'sexta';
    case 7: return 'sábado';
    default: return 'inválido';
  }`,
    hints: [
      'Um switch (n) com um case para cada número resolve, e o default pega todo o resto.',
      'Outra saída: um array com os nomes, acessado na posição n - 1 — mas aí você precisa validar o intervalo antes.',
    ],
    testCases: [
      { description: '1', input: 'diaDaSemana(1)', expectedOutput: '"domingo"', testFunction: "return diaDaSemana(1) === 'domingo';" },
      { description: '4', input: 'diaDaSemana(4)', expectedOutput: '"quarta"', testFunction: "return diaDaSemana(4) === 'quarta';" },
      { description: '7', input: 'diaDaSemana(7)', expectedOutput: '"sábado"', testFunction: "return diaDaSemana(7) === 'sábado';" },
      { description: '0 é inválido', input: 'diaDaSemana(0)', expectedOutput: '"inválido"', testFunction: "return diaDaSemana(0) === 'inválido';" },
      { description: '8 é inválido', input: 'diaDaSemana(8)', expectedOutput: '"inválido"', testFunction: "return diaDaSemana(8) === 'inválido';" },
    ],
    explanation:
      'O switch casa um valor com casos fixos e o default é a rede de segurança para entradas inesperadas. Validar entradas fora do esperado (0, 8) é parte do algoritmo, não um detalhe — dados reais sempre trazem surpresas.',
  }),

  // Índice nº 34 — Quantidade de dias do mês
  logica({
    id: 'logica-034-quantidade-de-dias-do-mes',
    difficulty: 'intermediario',
    topic,
    title: 'Quantidade de Dias do Mês',
    summary: 'Diga quantos dias tem um mês, considerando anos bissextos.',
    realWorldContext:
      'Calendários, vencimentos de boleto e cálculo de juros pro rata precisam saber quantos dias tem cada mês. Fevereiro é o caso que exige olhar o ano.',
    description:
      'Implemente diasNoMes(mes, ano), com mes de 1 a 12. Meses 4, 6, 9 e 11 têm 30 dias; fevereiro (2) tem 29 em ano bissexto e 28 nos outros; os demais têm 31.',
    goal: 'Combinar switch (ou ifs) com a regra do ano bissexto.',
    signature: {
      javascript: 'function diasNoMes(mes, ano)',
      typescript: 'function diasNoMes(mes: number, ano: number): number',
    },
    body: `  if (mes === 2) {
    const bissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
    return bissexto ? 29 : 28;
  }
  if (mes === 4 || mes === 6 || mes === 9 || mes === 11) {
    return 30;
  }
  return 31;`,
    hints: [
      'Trate fevereiro à parte: é o único que depende do ano. Reaproveite a regra do bissexto do exercício 24.',
      'Agrupe os meses de 30 dias numa condição com ||; o que sobrar tem 31.',
    ],
    testCases: [
      { description: 'Janeiro', input: 'diasNoMes(1, 2023)', expectedOutput: '31', testFunction: 'return diasNoMes(1, 2023) === 31;' },
      { description: 'Abril', input: 'diasNoMes(4, 2023)', expectedOutput: '30', testFunction: 'return diasNoMes(4, 2023) === 30;' },
      { description: 'Fevereiro de 2024', input: 'diasNoMes(2, 2024)', expectedOutput: '29', testFunction: 'return diasNoMes(2, 2024) === 29;' },
      { description: 'Fevereiro de 2023', input: 'diasNoMes(2, 2023)', expectedOutput: '28', testFunction: 'return diasNoMes(2, 2023) === 28;' },
      { description: 'Fevereiro de 1900', input: 'diasNoMes(2, 1900)', expectedOutput: '28', testFunction: 'return diasNoMes(2, 1900) === 28;' },
      { description: 'Novembro', input: 'diasNoMes(11, 2024)', expectedOutput: '30', testFunction: 'return diasNoMes(11, 2024) === 30;' },
    ],
    explanation:
      'O operador ternário (condição ? a : b) é um if/else compacto que devolve um valor. Reaproveitar a regra do bissexto é o embrião de outra boa prática: no módulo 05, ela viraria uma função própria chamada daqui.',
  }),

  // Índice nº 35 — Valor do ingresso
  logica({
    id: 'logica-035-valor-do-ingresso',
    difficulty: 'intermediario',
    topic,
    title: 'Valor do Ingresso',
    summary: 'Calcule o preço do ingresso de cinema pela idade e pela carteirinha de estudante.',
    realWorldContext:
      'A bilheteria de um cinema aplica gratuidade e meia-entrada por idade e por documento. Várias regras se combinam, e a ordem em que você as verifica muda o resultado.',
    description:
      'Implemente valorIngresso(idade, estudante). A inteira custa R$ 40. Menores de 3 anos não pagam. Crianças até 11 anos, pessoas com 60 ou mais e estudantes (estudante === true) pagam meia (R$ 20).',
    goal: 'Combinar várias regras, verificando primeiro a mais específica.',
    signature: {
      javascript: 'function valorIngresso(idade, estudante)',
      typescript: 'function valorIngresso(idade: number, estudante: boolean): number',
    },
    body: `  const inteira = 40;
  if (idade < 3) {
    return 0;
  }
  if (idade <= 11 || idade >= 60 || estudante) {
    return inteira / 2;
  }
  return inteira;`,
    hints: [
      'Verifique a gratuidade primeiro: um bebê de 2 anos também é "criança até 11 anos", mas não paga nada.',
      'Os três motivos de meia-entrada levam ao mesmo preço: junte-os com ||. O parâmetro estudante já é booleano, não precisa de === true.',
    ],
    testCases: [
      { description: 'Bebê de 2 anos', input: 'valorIngresso(2, false)', expectedOutput: '0', testFunction: 'return valorIngresso(2, false) === 0;' },
      { description: 'Criança de 10 anos', input: 'valorIngresso(10, false)', expectedOutput: '20', testFunction: 'return valorIngresso(10, false) === 20;' },
      { description: 'Adulto', input: 'valorIngresso(30, false)', expectedOutput: '40', testFunction: 'return valorIngresso(30, false) === 40;' },
      { description: 'Estudante adulto', input: 'valorIngresso(22, true)', expectedOutput: '20', testFunction: 'return valorIngresso(22, true) === 20;' },
      { description: 'Idoso de 60 anos', input: 'valorIngresso(60, false)', expectedOutput: '20', testFunction: 'return valorIngresso(60, false) === 20;' },
      { description: 'Adolescente de 12 anos', input: 'valorIngresso(12, false)', expectedOutput: '40', testFunction: 'return valorIngresso(12, false) === 40;' },
    ],
    explanation:
      'Quando regras se sobrepõem (o bebê também é criança), a mais específica vem primeiro. Guardar o preço numa constante (inteira) evita "números mágicos" espalhados: se o preço mudar, muda num lugar só, e a meia continua sendo metade.',
  }),
];

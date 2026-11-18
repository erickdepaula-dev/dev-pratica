import { LogicExercise } from '../../types/exercise';
import { logica } from './logicFactory';

const topic = 'Primeiros Algoritmos';

/**
 * Trilha de Lógica — Módulo 01: Primeiros Algoritmos (índice: exercícios 1 a 15).
 * Enunciados escritos do zero (o material de origem é comercial — ver
 * docs/fase-4-indice-exercicios.md). Os nº 11, 12 e 13 não tinham enunciado na origem:
 * foram criados a partir do tema do módulo (entrada → processamento → saída).
 * Valores com casas decimais são comparados com tolerância (ponto flutuante).
 */
export const logicModule01: LogicExercise[] = [
  // Índice nº 1 — Soma de dois números (piloto da tarefa 4.6)
  logica({
    id: 'logica-001-soma-de-dois-numeros',
    difficulty: 'basico',
    topic,
    title: 'Soma de Dois Números',
    summary: 'Escreva a função que recebe dois números e devolve a soma.',
    realWorldContext:
      'Todo sistema que movimenta valores começa aqui: o caixa de uma padaria soma o preço de dois itens, a planilha soma duas colunas. Entender entrada → processamento → saída é a base de qualquer algoritmo.',
    description:
      'Implemente a função somar(a, b), que recebe dois números e retorna a soma deles. Ela deve funcionar com números negativos e com decimais.',
    goal: 'Retornar a soma dos dois parâmetros.',
    signature: { javascript: 'function somar(a, b)', typescript: 'function somar(a: number, b: number): number' },
    body: '  return a + b;',
    typeAssertions: `// @ts-expect-error — texto não é número: em TS, "2" + 3 não passa despercebido
somar('2', 3);`,
    hints: [
      'Um algoritmo tem entrada (a e b), processamento (a operação) e saída (o return).',
      'O operador de soma é o +. Não esqueça do return: sem ele a função devolve undefined.',
    ],
    testCases: [
      { description: 'Soma de positivos', expectedOutput: '5', testFunction: 'return somar(2, 3) === 5;' },
      { description: 'Soma com negativo', expectedOutput: '-4', testFunction: 'return somar(-10, 6) === -4;' },
      { description: 'Soma de decimais', expectedOutput: '0.75', testFunction: 'return somar(0.5, 0.25) === 0.75;' },
    ],
    explanation:
      'A função recebe os dados (entrada), aplica a operação (processamento) e devolve o resultado com return (saída). Em JavaScript, se um dos valores fosse texto ("2" + 3), o + concatenaria e o resultado seria "23"; na variante TypeScript o compilador recusa essa chamada antes de executar.',
  }),

  // Índice nº 2 — Média de duas notas
  logica({
    id: 'logica-002-media-de-duas-notas',
    difficulty: 'basico',
    topic,
    title: 'Média de Duas Notas',
    summary: 'Calcule a média aritmética das duas notas de um aluno.',
    realWorldContext:
      'O diário de classe de uma escola calcula a média do bimestre a partir das provas. Um erro de precedência aqui reprova quem deveria passar — e ninguém percebe até o boletim sair.',
    description:
      'Implemente media(nota1, nota2), que retorna a média aritmética das duas notas: a soma dividida por 2.',
    goal: 'Retornar (nota1 + nota2) / 2.',
    signature: { javascript: 'function media(nota1, nota2)', typescript: 'function media(nota1: number, nota2: number): number' },
    body: '  return (nota1 + nota2) / 2;',
    hints: [
      'A média de dois valores é a soma deles dividida por 2.',
      'A divisão acontece antes da soma: nota1 + nota2 / 2 divide só a segunda nota. Use parênteses.',
    ],
    testCases: [
      { description: 'Notas 7 e 8', input: 'media(7, 8)', expectedOutput: '7.5', testFunction: 'return media(7, 8) === 7.5;' },
      { description: 'Notas iguais', input: 'media(10, 10)', expectedOutput: '10', testFunction: 'return media(10, 10) === 10;' },
      { description: 'Precedência (0 e 5)', input: 'media(0, 5)', expectedOutput: '2.5', testFunction: 'return media(0, 5) === 2.5;' },
    ],
    explanation:
      'Multiplicação e divisão têm precedência sobre soma e subtração. Sem os parênteses, nota1 + nota2 / 2 calcula nota1 + (nota2 / 2) — com 0 e 5 daria 2.5 por coincidência, mas com 7 e 8 daria 11. Os parênteses forçam a soma primeiro.',
  }),

  // Índice nº 3 — Antecessor e sucessor
  logica({
    id: 'logica-003-antecessor-e-sucessor',
    difficulty: 'basico',
    topic,
    title: 'Antecessor e Sucessor',
    summary: 'Devolva o número que vem antes e o que vem depois de um inteiro.',
    realWorldContext:
      'Paginação de resultados funciona assim: estando na página 5, os botões "anterior" e "próxima" levam às páginas 4 e 6. É a mesma conta, só que com nome de produto.',
    description:
      'Implemente vizinhos(n), que retorna um objeto { antecessor, sucessor } com o inteiro anterior e o seguinte a n.',
    goal: 'Retornar { antecessor: n - 1, sucessor: n + 1 }.',
    signature: {
      javascript: 'function vizinhos(n)',
      typescript: 'function vizinhos(n: number): { antecessor: number; sucessor: number }',
    },
    body: '  return { antecessor: n - 1, sucessor: n + 1 };',
    hints: [
      'O antecessor é n - 1 e o sucessor é n + 1.',
      'Para devolver dois valores de uma vez, retorne um objeto: return { antecessor: ..., sucessor: ... };',
    ],
    testCases: [
      { description: 'Vizinhos de 10', input: 'vizinhos(10)', expectedOutput: '{ antecessor: 9, sucessor: 11 }', testFunction: 'return vizinhos(10).antecessor === 9 && vizinhos(10).sucessor === 11;' },
      { description: 'Vizinhos de 0', input: 'vizinhos(0)', expectedOutput: '{ antecessor: -1, sucessor: 1 }', testFunction: 'return vizinhos(0).antecessor === -1 && vizinhos(0).sucessor === 1;' },
      { description: 'Vizinhos de -5', input: 'vizinhos(-5)', expectedOutput: '{ antecessor: -6, sucessor: -4 }', testFunction: 'return vizinhos(-5).antecessor === -6 && vizinhos(-5).sucessor === -4;' },
    ],
    explanation:
      'Uma função só tem um return, mas ele pode devolver um objeto com vários campos. No TypeScript, o tipo de retorno { antecessor: number; sucessor: number } documenta exatamente o formato — e o compilador acusa se faltar um campo ou se o nome estiver errado.',
  }),

  // Índice nº 4 — Dobro, triplo e metade
  logica({
    id: 'logica-004-dobro-triplo-e-metade',
    difficulty: 'basico',
    topic,
    title: 'Dobro, Triplo e Metade',
    summary: 'A partir de um número, calcule o dobro, o triplo e a metade.',
    realWorldContext:
      'Receitas são escaladas assim: para o dobro de convidados, dobra-se cada ingrediente; para metade, divide-se. Aplicativos de culinária fazem exatamente essas três contas.',
    description:
      'Implemente calcularProporcoes(n), que retorna { dobro, triplo, metade } de n.',
    goal: 'Retornar n * 2, n * 3 e n / 2 num objeto.',
    signature: {
      javascript: 'function calcularProporcoes(n)',
      typescript: 'function calcularProporcoes(n: number): { dobro: number; triplo: number; metade: number }',
    },
    body: `  return {
    dobro: n * 2,
    triplo: n * 3,
    metade: n / 2,
  };`,
    hints: [
      'Dobro é n * 2, triplo é n * 3 e metade é n / 2.',
      'Devolva os três num objeto só, com as chaves dobro, triplo e metade.',
    ],
    testCases: [
      { description: 'Para 10', input: 'calcularProporcoes(10)', expectedOutput: '{ dobro: 20, triplo: 30, metade: 5 }', testFunction: 'const p = calcularProporcoes(10); return p.dobro === 20 && p.triplo === 30 && p.metade === 5;' },
      { description: 'Metade de ímpar', input: 'calcularProporcoes(7)', expectedOutput: '{ dobro: 14, triplo: 21, metade: 3.5 }', testFunction: 'const p = calcularProporcoes(7); return p.dobro === 14 && p.triplo === 21 && p.metade === 3.5;' },
      { description: 'Para 0', input: 'calcularProporcoes(0)', expectedOutput: '{ dobro: 0, triplo: 0, metade: 0 }', testFunction: 'const p = calcularProporcoes(0); return p.dobro === 0 && p.triplo === 0 && p.metade === 0;' },
    ],
    explanation:
      'Em JavaScript e TypeScript a divisão de inteiros não descarta a parte decimal: 7 / 2 é 3.5 (em outras linguagens daria 3). Se você quisesse só a parte inteira, usaria Math.floor(7 / 2).',
  }),

  // Índice nº 5 — Conversão de medidas
  logica({
    id: 'logica-005-conversao-de-medidas',
    difficulty: 'basico',
    topic,
    title: 'Conversão de Medidas',
    summary: 'Converta uma medida em metros para centímetros e milímetros.',
    realWorldContext:
      'Lojas de material de construção vendem por metro, mas o marceneiro trabalha em milímetros. O sistema da loja precisa converter sem errar — um zero a menos vira uma prateleira que não cabe.',
    description:
      'Implemente converterMetros(metros), que retorna { centimetros, milimetros } equivalentes. 1 m = 100 cm = 1000 mm.',
    goal: 'Retornar metros * 100 e metros * 1000.',
    signature: {
      javascript: 'function converterMetros(metros)',
      typescript: 'function converterMetros(metros: number): { centimetros: number; milimetros: number }',
    },
    body: `  return {
    centimetros: metros * 100,
    milimetros: metros * 1000,
  };`,
    hints: [
      'Um metro tem 100 centímetros e 1000 milímetros.',
      'Multiplique a entrada pelo fator de cada unidade e devolva as duas num objeto.',
    ],
    testCases: [
      { description: '1 metro', input: 'converterMetros(1)', expectedOutput: '{ centimetros: 100, milimetros: 1000 }', testFunction: 'const m = converterMetros(1); return m.centimetros === 100 && m.milimetros === 1000;' },
      { description: '2,5 metros', input: 'converterMetros(2.5)', expectedOutput: '{ centimetros: 250, milimetros: 2500 }', testFunction: 'const m = converterMetros(2.5); return m.centimetros === 250 && m.milimetros === 2500;' },
      { description: '0,75 metro', input: 'converterMetros(0.75)', expectedOutput: '{ centimetros: 75, milimetros: 750 }', testFunction: 'const m = converterMetros(0.75); return Math.abs(m.centimetros - 75) < 1e-9 && Math.abs(m.milimetros - 750) < 1e-9;' },
    ],
    explanation:
      'Conversão de unidade é multiplicação por um fator fixo. Um detalhe de computador: números decimais são guardados em binário, então algumas contas dão resultados como 229.99999999999997 em vez de 230 (experimente 2.3 * 100). Por isso, ao comparar decimais, o certo é aceitar uma diferença minúscula em vez de exigir igualdade exata.',
  }),

  // Índice nº 6 — Área e perímetro do retângulo
  logica({
    id: 'logica-006-area-e-perimetro-do-retangulo',
    difficulty: 'basico',
    topic,
    title: 'Área e Perímetro do Retângulo',
    summary: 'Calcule a área e o perímetro de um retângulo a partir da base e da altura.',
    realWorldContext:
      'Para orçar um piso, a loja precisa da área (quantos m² de porcelanato); para o rodapé, do perímetro (quantos metros lineares). Um app de reforma faz as duas contas a partir das medidas do cômodo.',
    description:
      'Implemente retangulo(base, altura), que retorna { area, perimetro }. Área = base × altura; perímetro = 2 × (base + altura).',
    goal: 'Retornar a área e o perímetro num objeto.',
    signature: {
      javascript: 'function retangulo(base, altura)',
      typescript: 'function retangulo(base: number, altura: number): { area: number; perimetro: number }',
    },
    body: `  const area = base * altura;
  const perimetro = 2 * (base + altura);
  return { area, perimetro };`,
    hints: [
      'A área é base * altura. O perímetro é a soma dos quatro lados: base + altura + base + altura.',
      'Guardar cada resultado numa const com nome claro deixa o algoritmo legível. { area, perimetro } é um atalho para { area: area, perimetro: perimetro }.',
    ],
    testCases: [
      { description: 'Cômodo 4 x 3', input: 'retangulo(4, 3)', expectedOutput: '{ area: 12, perimetro: 14 }', testFunction: 'const r = retangulo(4, 3); return r.area === 12 && r.perimetro === 14;' },
      { description: 'Quadrado 5 x 5', input: 'retangulo(5, 5)', expectedOutput: '{ area: 25, perimetro: 20 }', testFunction: 'const r = retangulo(5, 5); return r.area === 25 && r.perimetro === 20;' },
      { description: 'Medidas decimais', input: 'retangulo(2.5, 4)', expectedOutput: '{ area: 10, perimetro: 13 }', testFunction: 'const r = retangulo(2.5, 4); return r.area === 10 && r.perimetro === 13;' },
    ],
    explanation:
      'Dar nome aos resultados intermediários (const area, const perimetro) é o primeiro passo para algoritmos legíveis: quem lê entende a intenção sem decifrar a conta. Repare também nos parênteses em 2 * (base + altura) — sem eles, só a altura seria multiplicada.',
  }),

  // Índice nº 7 — Celsius para Fahrenheit
  logica({
    id: 'logica-007-celsius-para-fahrenheit',
    difficulty: 'basico',
    topic,
    title: 'Celsius para Fahrenheit',
    summary: 'Converta uma temperatura de graus Celsius para Fahrenheit.',
    realWorldContext:
      'Um app de previsão do tempo usado no Brasil e nos EUA guarda a temperatura em uma escala e converte na hora de mostrar. A fórmula é curta, mas a ordem das operações importa.',
    description:
      'Implemente celsiusParaFahrenheit(celsius), que retorna a temperatura em Fahrenheit pela fórmula F = C × 9 / 5 + 32.',
    goal: 'Aplicar F = C × 9 / 5 + 32.',
    signature: {
      javascript: 'function celsiusParaFahrenheit(celsius)',
      typescript: 'function celsiusParaFahrenheit(celsius: number): number',
    },
    body: '  return celsius * 9 / 5 + 32;',
    hints: [
      'A fórmula é F = C × 9 / 5 + 32. Multiplicação e divisão acontecem antes da soma.',
      'Confira com valores conhecidos: a água congela a 0 °C (32 °F) e ferve a 100 °C (212 °F).',
    ],
    testCases: [
      { description: 'Congelamento', input: 'celsiusParaFahrenheit(0)', expectedOutput: '32', testFunction: 'return celsiusParaFahrenheit(0) === 32;' },
      { description: 'Ebulição', input: 'celsiusParaFahrenheit(100)', expectedOutput: '212', testFunction: 'return celsiusParaFahrenheit(100) === 212;' },
      { description: 'Onde as escalas se cruzam', input: 'celsiusParaFahrenheit(-40)', expectedOutput: '-40', testFunction: 'return celsiusParaFahrenheit(-40) === -40;' },
      { description: 'Temperatura do corpo', input: 'celsiusParaFahrenheit(37)', expectedOutput: '98.6', testFunction: 'return Math.abs(celsiusParaFahrenheit(37) - 98.6) < 1e-9;' },
    ],
    explanation:
      'Valores de referência (0 → 32, 100 → 212, -40 → -40) são a melhor forma de conferir uma fórmula: se algum deles falhar, a ordem das operações provavelmente está errada. Testar com casos conhecidos é um hábito que vale para qualquer algoritmo.',
  }),

  // Índice nº 8 — Desconto no produto
  logica({
    id: 'logica-008-desconto-no-produto',
    difficulty: 'basico',
    topic,
    title: 'Desconto no Produto',
    summary: 'Calcule o preço final de um produto depois de um desconto percentual.',
    realWorldContext:
      'Na Black Friday, o e-commerce mostra "de R$ 200 por R$ 180". Quem calcula esse "por" é uma função como a deste exercício — rodando milhares de vezes por minuto.',
    description:
      'Implemente precoComDesconto(preco, percentual), que retorna o preço depois de aplicar o desconto. Ex.: 200 com 10% de desconto → 180.',
    goal: 'Retornar preco - preco * percentual / 100.',
    signature: {
      javascript: 'function precoComDesconto(preco, percentual)',
      typescript: 'function precoComDesconto(preco: number, percentual: number): number',
    },
    body: `  const desconto = preco * percentual / 100;
  return preco - desconto;`,
    hints: [
      'Primeiro calcule quanto vale o desconto: preco * percentual / 100.',
      'Depois subtraia o desconto do preço original.',
    ],
    testCases: [
      { description: '10% em R$ 200', input: 'precoComDesconto(200, 10)', expectedOutput: '180', testFunction: 'return Math.abs(precoComDesconto(200, 10) - 180) < 0.001;' },
      { description: '25% em R$ 80', input: 'precoComDesconto(80, 25)', expectedOutput: '60', testFunction: 'return Math.abs(precoComDesconto(80, 25) - 60) < 0.001;' },
      { description: 'Sem desconto', input: 'precoComDesconto(49.9, 0)', expectedOutput: '49.9', testFunction: 'return Math.abs(precoComDesconto(49.9, 0) - 49.9) < 0.001;' },
      { description: '15% em R$ 59,90', input: 'precoComDesconto(59.9, 15)', expectedOutput: '50.915', testFunction: 'return Math.abs(precoComDesconto(59.9, 15) - 50.915) < 0.001;' },
    ],
    explanation:
      'Percentual é uma fração de 100: 10% de 200 é 200 * 10 / 100 = 20. Outra forma equivalente é preco * (1 - percentual / 100). Separar o valor do desconto numa variável deixa claro o que é o desconto e o que é o preço final — útil quando a tela precisa mostrar os dois.',
  }),

  // Índice nº 9 — Reajuste salarial
  logica({
    id: 'logica-009-reajuste-salarial',
    difficulty: 'basico',
    topic,
    title: 'Reajuste Salarial',
    summary: 'Aplique um reajuste percentual a um salário.',
    realWorldContext:
      'Todo ano o RH aplica o reajuste do dissídio na folha de pagamento. Com centenas de funcionários, a conta precisa estar certa para todos — e é a mesma função para cada um.',
    description:
      'Implemente reajustarSalario(salario, percentual), que retorna o novo salário com o aumento aplicado. Ex.: 2000 com 10% → 2200.',
    goal: 'Retornar salario + salario * percentual / 100.',
    signature: {
      javascript: 'function reajustarSalario(salario, percentual)',
      typescript: 'function reajustarSalario(salario: number, percentual: number): number',
    },
    body: `  const aumento = salario * percentual / 100;
  return salario + aumento;`,
    hints: [
      'O aumento é salario * percentual / 100.',
      'O novo salário é o antigo mais o aumento — o mesmo raciocínio do desconto, com sinal trocado.',
    ],
    testCases: [
      { description: '10% sobre R$ 2.000', input: 'reajustarSalario(2000, 10)', expectedOutput: '2200', testFunction: 'return Math.abs(reajustarSalario(2000, 10) - 2200) < 0.001;' },
      { description: '5,5% sobre R$ 1.800', input: 'reajustarSalario(1800, 5.5)', expectedOutput: '1899', testFunction: 'return Math.abs(reajustarSalario(1800, 5.5) - 1899) < 0.001;' },
      { description: 'Sem reajuste', input: 'reajustarSalario(3500, 0)', expectedOutput: '3500', testFunction: 'return Math.abs(reajustarSalario(3500, 0) - 3500) < 0.001;' },
    ],
    explanation:
      'Aumento e desconto são a mesma conta com sinais opostos. Também daria para escrever salario * (1 + percentual / 100); as duas formas são equivalentes, mas podem diferir na última casa decimal por causa do ponto flutuante — por isso os testes comparam com tolerância de um milésimo.',
  }),

  // Índice nº 10 — Salário com comissão
  logica({
    id: 'logica-010-salario-com-comissao',
    difficulty: 'basico',
    topic,
    title: 'Salário com Comissão',
    summary: 'Some o salário fixo de um vendedor à comissão sobre as vendas do mês.',
    realWorldContext:
      'Concessionárias e lojas de varejo pagam um fixo mais um percentual sobre o que cada vendedor vendeu. O fechamento do mês roda essa conta para a equipe inteira.',
    description:
      'Implemente salarioComComissao(fixo, totalVendas, percentualComissao), que retorna o salário do mês: o fixo mais a comissão sobre o total vendido.',
    goal: 'Retornar fixo + totalVendas * percentualComissao / 100.',
    signature: {
      javascript: 'function salarioComComissao(fixo, totalVendas, percentualComissao)',
      typescript: 'function salarioComComissao(fixo: number, totalVendas: number, percentualComissao: number): number',
    },
    body: `  const comissao = totalVendas * percentualComissao / 100;
  return fixo + comissao;`,
    hints: [
      'A comissão é um percentual do total vendido, não do salário fixo.',
      'Calcule a comissão numa variável e some ao fixo.',
    ],
    testCases: [
      { description: 'Fixo 1.500, vendas 10.000, 5%', input: 'salarioComComissao(1500, 10000, 5)', expectedOutput: '2000', testFunction: 'return Math.abs(salarioComComissao(1500, 10000, 5) - 2000) < 0.001;' },
      { description: 'Mês sem vendas', input: 'salarioComComissao(1500, 0, 5)', expectedOutput: '1500', testFunction: 'return Math.abs(salarioComComissao(1500, 0, 5) - 1500) < 0.001;' },
      { description: 'Comissão de 2,5%', input: 'salarioComComissao(1200, 8000, 2.5)', expectedOutput: '1400', testFunction: 'return Math.abs(salarioComComissao(1200, 8000, 2.5) - 1400) < 0.001;' },
    ],
    explanation:
      'O cuidado aqui é aplicar o percentual sobre a base certa (as vendas). Nomes de parâmetro claros — totalVendas, percentualComissao — evitam exatamente esse tipo de confusão; com nomes como a, b e c, o erro passaria fácil.',
  }),

  // Índice nº 11 — sem enunciado na origem; criado a partir do tema do módulo
  logica({
    id: 'logica-011-idade-em-dias',
    difficulty: 'basico',
    topic,
    title: 'Idade em Dias',
    summary: 'Converta uma idade em anos, meses e dias para o total aproximado de dias.',
    realWorldContext:
      'Sistemas de saúde infantil acompanham bebês por dias de vida, não por anos. A conta exata usa calendário; a aproximada (ano = 365 dias, mês = 30) é o primeiro passo e aparece em muitas estimativas.',
    description:
      'Implemente idadeEmDias(anos, meses, dias), que retorna o total de dias considerando que todo ano tem 365 dias e todo mês tem 30.',
    goal: 'Retornar anos * 365 + meses * 30 + dias.',
    signature: {
      javascript: 'function idadeEmDias(anos, meses, dias)',
      typescript: 'function idadeEmDias(anos: number, meses: number, dias: number): number',
    },
    body: '  return anos * 365 + meses * 30 + dias;',
    hints: [
      'Converta cada parte para dias separadamente: anos * 365 e meses * 30.',
      'Depois some tudo, incluindo os dias que já vieram em dias.',
    ],
    testCases: [
      { description: '1 ano, 2 meses e 10 dias', input: 'idadeEmDias(1, 2, 10)', expectedOutput: '435', testFunction: 'return idadeEmDias(1, 2, 10) === 435;' },
      { description: 'Só dias', input: 'idadeEmDias(0, 0, 15)', expectedOutput: '15', testFunction: 'return idadeEmDias(0, 0, 15) === 15;' },
      { description: '30 anos', input: 'idadeEmDias(30, 0, 0)', expectedOutput: '10950', testFunction: 'return idadeEmDias(30, 0, 0) === 10950;' },
    ],
    explanation:
      'Para somar grandezas diferentes, primeiro converta tudo para a mesma unidade. A precedência ajuda: as multiplicações acontecem antes das somas, então não há parênteses obrigatórios. (A conta exata, com anos bissextos e meses de 28 a 31 dias, usaria datas de verdade — tema para mais adiante.)',
  }),

  // Índice nº 12 — sem enunciado na origem; criado a partir do tema do módulo
  logica({
    id: 'logica-012-segundos-em-horas-minutos-e-segundos',
    difficulty: 'intermediario',
    topic,
    title: 'Segundos em Horas, Minutos e Segundos',
    summary: 'Decomponha uma duração em segundos em horas, minutos e segundos.',
    realWorldContext:
      'Players de vídeo e cronômetros guardam a duração em segundos e mostram "1:01:05". Converter exige divisão inteira e resto — duas ferramentas que aparecem o tempo todo em lógica.',
    description:
      'Implemente decomporSegundos(total), que recebe um número inteiro de segundos e retorna { horas, minutos, segundos }. Ex.: 3665 → { horas: 1, minutos: 1, segundos: 5 }.',
    goal: 'Usar divisão inteira (Math.floor) e resto (%) para separar as unidades.',
    signature: {
      javascript: 'function decomporSegundos(total)',
      typescript: 'function decomporSegundos(total: number): { horas: number; minutos: number; segundos: number }',
    },
    body: `  const horas = Math.floor(total / 3600);
  const resto = total % 3600;
  const minutos = Math.floor(resto / 60);
  const segundos = resto % 60;
  return { horas, minutos, segundos };`,
    hints: [
      'Uma hora tem 3600 segundos. Math.floor(total / 3600) dá as horas completas.',
      'O operador % devolve o resto da divisão: total % 3600 são os segundos que sobram depois de tirar as horas. Repita a ideia com 60 para os minutos.',
    ],
    testCases: [
      { description: '3665 segundos', input: 'decomporSegundos(3665)', expectedOutput: '{ horas: 1, minutos: 1, segundos: 5 }', testFunction: 'const t = decomporSegundos(3665); return t.horas === 1 && t.minutos === 1 && t.segundos === 5;' },
      { description: 'Menos de um minuto', input: 'decomporSegundos(59)', expectedOutput: '{ horas: 0, minutos: 0, segundos: 59 }', testFunction: 'const t = decomporSegundos(59); return t.horas === 0 && t.minutos === 0 && t.segundos === 59;' },
      { description: 'Exatamente 2 horas', input: 'decomporSegundos(7200)', expectedOutput: '{ horas: 2, minutos: 0, segundos: 0 }', testFunction: 'const t = decomporSegundos(7200); return t.horas === 2 && t.minutos === 0 && t.segundos === 0;' },
      { description: 'Um dia menos um segundo', input: 'decomporSegundos(86399)', expectedOutput: '{ horas: 23, minutos: 59, segundos: 59 }', testFunction: 'const t = decomporSegundos(86399); return t.horas === 23 && t.minutos === 59 && t.segundos === 59;' },
    ],
    explanation:
      'Divisão inteira responde "quantos cabem" e o resto responde "quanto sobra". Em JS/TS, / sempre dá decimal, então a divisão inteira é Math.floor(a / b). O padrão "tira o maior bloco, trabalha com o resto" serve para troco em cédulas, conversão de bases e muito mais.',
  }),

  // Índice nº 13 — sem enunciado na origem; criado a partir do tema do módulo
  logica({
    id: 'logica-013-consumo-medio-de-combustivel',
    difficulty: 'basico',
    topic,
    title: 'Consumo Médio de Combustível',
    summary: 'Calcule quantos quilômetros o carro fez por litro numa viagem.',
    realWorldContext:
      'Empresas com frota de veículos acompanham o km/l de cada carro para detectar desperdício ou problema mecânico. O motorista informa a distância e os litros abastecidos; o sistema faz o resto.',
    description:
      'Implemente consumoMedio(distanciaKm, litros), que retorna o consumo médio em km/l: a distância percorrida dividida pelos litros consumidos.',
    goal: 'Retornar distanciaKm / litros.',
    signature: {
      javascript: 'function consumoMedio(distanciaKm, litros)',
      typescript: 'function consumoMedio(distanciaKm: number, litros: number): number',
    },
    body: '  return distanciaKm / litros;',
    hints: [
      'km/l significa "quilômetros divididos por litros".',
      'A ordem da divisão importa: litros / distância dá outra grandeza (litros por km).',
    ],
    testCases: [
      { description: '480 km com 40 l', input: 'consumoMedio(480, 40)', expectedOutput: '12', testFunction: 'return consumoMedio(480, 40) === 12;' },
      { description: '150 km com 12 l', input: 'consumoMedio(150, 12)', expectedOutput: '12.5', testFunction: 'return consumoMedio(150, 12) === 12.5;' },
      { description: '100 km com 8 l', input: 'consumoMedio(100, 8)', expectedOutput: '12.5', testFunction: 'return consumoMedio(100, 8) === 12.5;' },
    ],
    explanation:
      'A unidade do resultado indica a operação: km/l é km dividido por l. Pensar em unidades evita inverter a divisão — um erro comum e silencioso, porque o programa roda e devolve um número plausível.',
  }),

  // Índice nº 14 — Troca de valores
  logica({
    id: 'logica-014-troca-de-valores',
    difficulty: 'basico',
    topic,
    title: 'Troca de Valores',
    summary: 'Troque o conteúdo de duas variáveis entre si.',
    realWorldContext:
      'Algoritmos de ordenação — os que organizam sua lista de contatos ou o ranking de um jogo — trocam elementos de lugar milhões de vezes. Tudo começa com a troca de duas variáveis.',
    description:
      'Implemente trocar(a, b), que retorna os dois valores na ordem invertida, como um array [b, a]. Faça a troca usando variáveis: x recebe o valor de y e y o de x, sem perder nenhum dos dois.',
    goal: 'Retornar [b, a] trocando os valores com uma variável auxiliar (ou desestruturação).',
    signature: {
      javascript: 'function trocar(a, b)',
      typescript: 'function trocar(a: number, b: number): [number, number]',
    },
    body: `  let x = a;
  let y = b;
  const auxiliar = x;
  x = y;
  y = auxiliar;
  return [x, y];`,
    hints: [
      'Se você fizer x = y e depois y = x, os dois ficam com o mesmo valor: o valor original de x se perdeu.',
      'Guarde o valor de x numa variável auxiliar antes de sobrescrevê-lo. (Em JS/TS também existe o atalho [x, y] = [y, x].)',
    ],
    testCases: [
      { description: 'Trocar 1 e 2', input: 'trocar(1, 2)', expectedOutput: '[2, 1]', testFunction: 'const t = trocar(1, 2); return t[0] === 2 && t[1] === 1 && t.length === 2;' },
      { description: 'Valores iguais', input: 'trocar(7, 7)', expectedOutput: '[7, 7]', testFunction: 'const t = trocar(7, 7); return t[0] === 7 && t[1] === 7;' },
      { description: 'Com negativo', input: 'trocar(-3, 10)', expectedOutput: '[10, -3]', testFunction: 'const t = trocar(-3, 10); return t[0] === 10 && t[1] === -3;' },
    ],
    explanation:
      'A variável auxiliar é como um terceiro copo para trocar o líquido de dois copos: sem ele, o primeiro conteúdo se perde. Em JS/TS, a desestruturação [x, y] = [y, x] faz o mesmo numa linha. No TypeScript, o retorno [number, number] é uma tupla: um array de tamanho e tipos fixos.',
  }),

  // Índice nº 15 — Custo final da compra
  logica({
    id: 'logica-015-custo-final-da-compra',
    difficulty: 'basico',
    topic,
    title: 'Custo Final da Compra',
    summary: 'Calcule o total de um pedido: itens vezes preço, mais o frete.',
    realWorldContext:
      'O carrinho de qualquer loja online faz esta conta a cada clique em "+": quantidade vezes preço unitário, mais o frete. É o número que decide se o cliente finaliza a compra.',
    description:
      'Implemente custoFinal(precoUnitario, quantidade, frete), que retorna o valor total do pedido.',
    goal: 'Retornar precoUnitario * quantidade + frete.',
    signature: {
      javascript: 'function custoFinal(precoUnitario, quantidade, frete)',
      typescript: 'function custoFinal(precoUnitario: number, quantidade: number, frete: number): number',
    },
    body: `  const subtotal = precoUnitario * quantidade;
  return subtotal + frete;`,
    hints: [
      'O subtotal é o preço unitário multiplicado pela quantidade.',
      'O frete é cobrado uma vez por pedido, não por item: some-o ao subtotal.',
    ],
    testCases: [
      { description: '3 itens de R$ 20 + R$ 15 de frete', input: 'custoFinal(20, 3, 15)', expectedOutput: '75', testFunction: 'return Math.abs(custoFinal(20, 3, 15) - 75) < 0.001;' },
      { description: 'Frete grátis', input: 'custoFinal(49.9, 2, 0)', expectedOutput: '99.8', testFunction: 'return Math.abs(custoFinal(49.9, 2, 0) - 99.8) < 0.001;' },
      { description: 'Um item só', input: 'custoFinal(120, 1, 22.5)', expectedOutput: '142.5', testFunction: 'return Math.abs(custoFinal(120, 1, 22.5) - 142.5) < 0.001;' },
    ],
    explanation:
      'O erro clássico aqui é (precoUnitario + frete) * quantidade, que cobra o frete de cada item. Ler o enunciado com atenção ("o frete é por pedido") e escolher a ordem certa das operações é metade do trabalho de lógica.',
  }),
];

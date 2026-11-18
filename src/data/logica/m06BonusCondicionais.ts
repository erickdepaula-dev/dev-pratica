import { LogicExercise } from '../../types/exercise';
import { logica } from './logicFactory';

const topic = 'Bônus — Condicionais';

/**
 * Trilha de Lógica — Bônus 02: exercícios extras de condicionais (índice: c01 a c30).
 * Enunciados escritos do zero; a especificação vem de docs/material-apoio/BANCO_EXERCICIOS.md.
 *
 * Só os 17 que acrescentam algo ao módulo 02 estão aqui. Ficaram de fora 8 cuja regra é
 * idêntica a um exercício já existente (par ou ímpar, positivo/negativo/zero, maior de dois,
 * menor de três, situação do aluno, IMC, tipo de triângulo, ano bissexto) e 5 variações mínimas
 * (pode votar, maior de três, menor de dois, empréstimo sem parcelas, divisível por 2 e 3 —
 * esta última é a mesma forma do c12, que ficou). A lista completa está em docs/fase-4-exercicios.md.
 *
 * O que estes 17 treinam e o módulo 02 não cobria: classificação em faixas com domínios variados
 * (preço, energia, imposto, pressão, hora, estoque), um código de letra em vez de número,
 * uma faixa com caso "fora de tudo", e decisões que combinam duas entradas com E e OU.
 */
export const logicModule06: LogicExercise[] = [
  // Índice nº c06 — Faixa etária
  logica({
    id: 'logica-c06-faixa-etaria',
    difficulty: 'basico',
    topic,
    title: 'Faixa Etária',
    summary: 'Classifique uma idade em criança, adolescente, adulto ou idoso.',
    realWorldContext:
      'Toda pesquisa, plano de saúde e sistema de atendimento agrupa gente por faixa de idade. A regra é sempre a mesma forma: intervalos encostados, sem buraco e sem sobreposição — e é aí que aparecem os erros.',
    description:
      'Implemente faixaEtaria(idade), que recebe uma idade inteira não negativa e retorna "criança" (0 a 12), "adolescente" (13 a 17), "adulto" (18 a 59) ou "idoso" (60 ou mais).',
    goal: 'Encadear faixas na ordem certa, sem deixar buraco entre elas.',
    signature: {
      javascript: 'function faixaEtaria(idade)',
      typescript: "function faixaEtaria(idade: number): 'criança' | 'adolescente' | 'adulto' | 'idoso'",
    },
    body: `  if (idade <= 12) {
    return 'criança';
  }
  if (idade <= 17) {
    return 'adolescente';
  }
  if (idade <= 59) {
    return 'adulto';
  }
  return 'idoso';`,
    hints: [
      'Teste as faixas em ordem crescente. Chegando no segundo if, você já sabe que a idade passou de 12 — então basta comparar com o topo da faixa.',
      'Não precisa escrever idade >= 13 && idade <= 17: a condição anterior já garantiu o piso. Repetir o piso é o que costuma criar contradição quando a tabela muda.',
    ],
    testCases: [
      { description: 'Criança', input: 'faixaEtaria(8)', expectedOutput: '"criança"', testFunction: "return faixaEtaria(8) === 'criança';" },
      { description: 'Adolescente', input: 'faixaEtaria(16)', expectedOutput: '"adolescente"', testFunction: "return faixaEtaria(16) === 'adolescente';" },
      { description: 'Adulto', input: 'faixaEtaria(25)', expectedOutput: '"adulto"', testFunction: "return faixaEtaria(25) === 'adulto';" },
      { description: 'Primeiro ano de idoso', input: 'faixaEtaria(60)', expectedOutput: '"idoso"', testFunction: "return faixaEtaria(60) === 'idoso';" },
      { description: 'Todas as fronteiras', input: '0, 12, 13, 17, 18, 59, 60', expectedOutput: 'criança, criança, adolescente, adolescente, adulto, adulto, idoso', testFunction: "return faixaEtaria(0) === 'criança' && faixaEtaria(12) === 'criança' && faixaEtaria(13) === 'adolescente' && faixaEtaria(17) === 'adolescente' && faixaEtaria(18) === 'adulto' && faixaEtaria(59) === 'adulto' && faixaEtaria(60) === 'idoso';" },
    ],
    explanation:
      'O último teste passa por todas as sete fronteiras de uma vez. É o teste que importa: trocar <= por < em qualquer um dos ifs faz uma única idade cair na faixa errada — a de 12 vira adolescente, a de 17 vira adulta — e um teste com valores do meio da faixa (8, 25) nunca pegaria isso.',
  }),

  // Índice nº c08 — Desconto na compra
  logica({
    id: 'logica-c08-desconto-na-compra',
    difficulty: 'intermediario',
    topic,
    title: 'Desconto na Compra',
    summary: 'Devolva o percentual de desconto e o valor final da compra.',
    realWorldContext:
      'O desconto por faixa de valor é o empurrão mais antigo do varejo: gastando um pouco mais, você cai na faixa de cima. Quem programa o caixa precisa devolver as duas coisas — o percentual, que vai no cupom, e o valor final, que vai na maquininha.',
    description:
      'Implemente descontoDaCompra(valor), que retorna { percentual, valorFinal }. O percentual é 0 para compras de até R$ 100, 5 para compras acima de R$ 100 até R$ 300, e 10 acima de R$ 300. Em percentual devolva o número (5, não "5%").',
    goal: 'Escolher a faixa e usar o resultado dela no cálculo seguinte.',
    signature: {
      javascript: 'function descontoDaCompra(valor)',
      typescript: 'function descontoDaCompra(valor: number): { percentual: number; valorFinal: number }',
    },
    body: `  let percentual = 10;
  if (valor <= 100) {
    percentual = 0;
  } else if (valor <= 300) {
    percentual = 5;
  }

  const valorFinal = valor - valor * percentual / 100;
  return { percentual, valorFinal };`,
    hints: [
      'Primeiro descubra o percentual da faixa; o valor final é um cálculo só, feito depois, com o percentual já escolhido.',
      'Não repita a conta dentro de cada if. Multiplicar por (1 - percentual / 100) ou subtrair valor * percentual / 100 dá no mesmo — o que não dá é calcular três vezes e esquecer de atualizar uma delas.',
    ],
    testCases: [
      { description: 'Sem desconto', input: 'descontoDaCompra(80)', expectedOutput: '{ percentual: 0, valorFinal: 80 }', testFunction: 'const r = descontoDaCompra(80); return r.percentual === 0 && Math.abs(r.valorFinal - 80) < 1e-9;' },
      { description: 'Fronteira: 100 ainda é a primeira faixa', input: 'descontoDaCompra(100)', expectedOutput: '{ percentual: 0, valorFinal: 100 }', testFunction: 'const r = descontoDaCompra(100); return r.percentual === 0 && Math.abs(r.valorFinal - 100) < 1e-9;' },
      { description: 'Faixa de 5%', input: 'descontoDaCompra(150)', expectedOutput: '{ percentual: 5, valorFinal: 142.5 }', testFunction: 'const r = descontoDaCompra(150); return r.percentual === 5 && Math.abs(r.valorFinal - 142.5) < 1e-9;' },
      { description: 'Fronteira: 300 ainda é 5%', input: 'descontoDaCompra(300)', expectedOutput: '{ percentual: 5, valorFinal: 285 }', testFunction: 'const r = descontoDaCompra(300); return r.percentual === 5 && Math.abs(r.valorFinal - 285) < 1e-9;' },
      { description: 'Faixa de 10%', input: 'descontoDaCompra(350)', expectedOutput: '{ percentual: 10, valorFinal: 315 }', testFunction: 'const r = descontoDaCompra(350); return r.percentual === 10 && Math.abs(r.valorFinal - 315) < 1e-9;' },
    ],
    explanation:
      'Os dois testes de fronteira (100 e 300) fixam o que a tabela quer dizer com "até": o valor exato fica na faixa de baixo, não na de cima. O percentual volta como número e não como texto porque ele é usado numa conta logo em seguida — devolver "5%" obrigaria quem chamou a desmontar a string para calcular.',
  }),

  // Índice nº c12 — Divisibilidade por 3 e por 5
  logica({
    id: 'logica-c12-divisibilidade-por-3-e-5',
    difficulty: 'basico',
    topic,
    title: 'Divisibilidade por 3 e por 5',
    summary: 'Classifique um número em quatro casos de divisibilidade.',
    realWorldContext:
      'É o coração do jogo FizzBuzz, usado até hoje em entrevista para ver se a pessoa monta uma condição composta sem se enrolar. A pegadinha é a ordem: quem testa "divisível por 3" primeiro nunca chega no caso "por 3 e por 5".',
    description:
      'Implemente divisibilidadePor3e5(n), que retorna "ambos" quando n é divisível por 3 e por 5, "apenas 3" quando só por 3, "apenas 5" quando só por 5, e "nenhum" quando por nenhum dos dois.',
    goal: 'Testar o caso mais específico antes dos casos que ele também satisfaz.',
    signature: {
      javascript: 'function divisibilidadePor3e5(n)',
      typescript: "function divisibilidadePor3e5(n: number): 'ambos' | 'apenas 3' | 'apenas 5' | 'nenhum'",
    },
    body: `  const por3 = n % 3 === 0;
  const por5 = n % 5 === 0;

  if (por3 && por5) {
    return 'ambos';
  }
  if (por3) {
    return 'apenas 3';
  }
  if (por5) {
    return 'apenas 5';
  }
  return 'nenhum';`,
    hints: [
      'Guarde as duas divisibilidades em variáveis booleanas antes de decidir. Fica mais legível e você só calcula cada resto uma vez.',
      'O caso "ambos" tem de ser testado primeiro: 15 é divisível por 3 e também por 5, então ele passaria no if de "apenas 3" se esse viesse antes.',
    ],
    testCases: [
      { description: 'Divisível pelos dois', input: 'divisibilidadePor3e5(15)', expectedOutput: '"ambos"', testFunction: "return divisibilidadePor3e5(15) === 'ambos';" },
      { description: 'Só por 3', input: 'divisibilidadePor3e5(9)', expectedOutput: '"apenas 3"', testFunction: "return divisibilidadePor3e5(9) === 'apenas 3';" },
      { description: 'Só por 5', input: 'divisibilidadePor3e5(10)', expectedOutput: '"apenas 5"', testFunction: "return divisibilidadePor3e5(10) === 'apenas 5';" },
      { description: 'Por nenhum', input: 'divisibilidadePor3e5(7)', expectedOutput: '"nenhum"', testFunction: "return divisibilidadePor3e5(7) === 'nenhum';" },
      { description: 'Outro múltiplo dos dois', input: 'divisibilidadePor3e5(30)', expectedOutput: '"ambos"', testFunction: "return divisibilidadePor3e5(30) === 'ambos';" },
      { description: 'Zero é divisível por tudo', input: 'divisibilidadePor3e5(0)', expectedOutput: '"ambos"', testFunction: "return divisibilidadePor3e5(0) === 'ambos';" },
    ],
    explanation:
      'O teste do zero costuma surpreender: 0 % 3 e 0 % 5 valem ambos 0, então zero é divisível pelos dois e a resposta é "ambos". Matematicamente está certo — zero é múltiplo de qualquer número. E os casos 15 e 30 são os que derrubam a ordem errada dos ifs: com "apenas 3" na frente, os dois respondem "apenas 3".',
  }),

  // Índice nº c15 — Faixa de preço
  logica({
    id: 'logica-c15-faixa-de-preco',
    difficulty: 'basico',
    topic,
    title: 'Faixa de Preço',
    summary: 'Classifique um produto em econômico, intermediário ou premium.',
    realWorldContext:
      'O filtro de faixa de preço de qualquer loja online. O detalhe que decide se o cliente encontra o produto é onde fica o valor exato da borda: um produto de R$ 50 aparece no filtro "até 50" ou no de cima?',
    description:
      'Implemente faixaDePreco(preco), que retorna "econômico" para preços de até R$ 50, "intermediário" para acima de R$ 50 até R$ 150, e "premium" para acima de R$ 150.',
    goal: 'Traduzir "até" e "acima de" em comparações inclusivas e exclusivas.',
    signature: {
      javascript: 'function faixaDePreco(preco)',
      typescript: "function faixaDePreco(preco: number): 'econômico' | 'intermediário' | 'premium'",
    },
    body: `  if (preco <= 50) {
    return 'econômico';
  }
  if (preco <= 150) {
    return 'intermediário';
  }
  return 'premium';`,
    hints: [
      '"Até R$ 50" inclui o 50, então a comparação é <=. "Acima de R$ 50" começa em qualquer valor maior que 50, mesmo 50,01.',
      'Testando em ordem crescente, cada if só precisa do topo da sua faixa — o piso já veio garantido pelo if anterior.',
    ],
    testCases: [
      { description: 'Econômico', input: 'faixaDePreco(40)', expectedOutput: '"econômico"', testFunction: "return faixaDePreco(40) === 'econômico';" },
      { description: 'Fronteira: 50 é econômico', input: 'faixaDePreco(50)', expectedOutput: '"econômico"', testFunction: "return faixaDePreco(50) === 'econômico';" },
      { description: 'Intermediário', input: 'faixaDePreco(120)', expectedOutput: '"intermediário"', testFunction: "return faixaDePreco(120) === 'intermediário';" },
      { description: 'Premium', input: 'faixaDePreco(220)', expectedOutput: '"premium"', testFunction: "return faixaDePreco(220) === 'premium';" },
      { description: 'Centavos acima da fronteira', input: 'faixaDePreco(50.01) e faixaDePreco(150.01)', expectedOutput: 'intermediário e premium', testFunction: "return faixaDePreco(50.01) === 'intermediário' && faixaDePreco(150.01) === 'premium';" },
    ],
    explanation:
      'Preço é um valor com centavos, e o último teste usa isso: 50,01 já saiu da faixa econômica, 150,01 já é premium. Com faixas pensadas só em números redondos é fácil escrever preco < 50 e deixar o produto de R$ 50 cair em "intermediário" — o cliente que filtrou por até 50 não o veria.',
  }),

  // Índice nº c18 — Conceito do aluno
  logica({
    id: 'logica-c18-conceito-do-aluno',
    difficulty: 'basico',
    topic,
    title: 'Conceito do Aluno',
    summary: 'Converta uma nota em conceito de A a D.',
    realWorldContext:
      'Muita escola e universidade publica conceito em vez de nota. A conversão é a mesma classificação em faixas de sempre, só que a ordem das letras anda ao contrário dos números — e isso basta para embaralhar quem escreve no automático.',
    description:
      'Implemente conceitoDaNota(nota), que recebe uma nota de 0 a 10 e retorna "A" (9 ou mais), "B" (de 7 a 8,9), "C" (de 5 a 6,9) ou "D" (menos de 5).',
    goal: 'Classificar em faixas quando o rótulo cresce na direção oposta ao valor.',
    signature: {
      javascript: 'function conceitoDaNota(nota)',
      typescript: "function conceitoDaNota(nota: number): 'A' | 'B' | 'C' | 'D'",
    },
    body: `  if (nota < 5) {
    return 'D';
  }
  if (nota < 7) {
    return 'C';
  }
  if (nota < 9) {
    return 'B';
  }
  return 'A';`,
    hints: [
      'Dá para ir do menor para o maior (D, C, B, A) ou do maior para o menor (A, B, C, D) — escolha um sentido e mantenha. O erro vem de misturar os dois.',
      'As faixas "de 7 a 8,9" e "de 5 a 6,9" existem porque a nota tem uma casa decimal. Pensando em "menor que 9" e "menor que 7" você cobre 8,95 também, sem precisar de caso especial.',
    ],
    testCases: [
      { description: 'Conceito D', input: 'conceitoDaNota(4.5)', expectedOutput: '"D"', testFunction: "return conceitoDaNota(4.5) === 'D';" },
      { description: 'Fronteira: 5 é C', input: 'conceitoDaNota(5)', expectedOutput: '"C"', testFunction: "return conceitoDaNota(5) === 'C';" },
      { description: 'Conceito B', input: 'conceitoDaNota(7.8)', expectedOutput: '"B"', testFunction: "return conceitoDaNota(7.8) === 'B';" },
      { description: 'Fronteira: 9 é A', input: 'conceitoDaNota(9)', expectedOutput: '"A"', testFunction: "return conceitoDaNota(9) === 'A';" },
      { description: 'O valor que a tabela esquece', input: 'conceitoDaNota(8.95)', expectedOutput: '"B"', testFunction: "return conceitoDaNota(8.95) === 'B';" },
      { description: 'Todas as fronteiras', input: '0, 4.9, 5, 6.9, 7, 8.9, 9, 10', expectedOutput: 'D, D, C, C, B, B, A, A', testFunction: "return conceitoDaNota(0) === 'D' && conceitoDaNota(4.9) === 'D' && conceitoDaNota(5) === 'C' && conceitoDaNota(6.9) === 'C' && conceitoDaNota(7) === 'B' && conceitoDaNota(8.9) === 'B' && conceitoDaNota(9) === 'A' && conceitoDaNota(10) === 'A';" },
    ],
    explanation:
      'Escrever a tabela como "menor que" em vez de "de X até Y" resolve um problema que a tabela esconde: o que acontece com 8,95. Pela tabela literal ela não está em nenhuma faixa — nem "até 8,9" nem "9 ou mais". Pela condição nota < 9 ela é B, que é a intenção, e há um teste só para isso: quem escreve nota <= 8.9 devolve "A" para 8,95. O último teste percorre as oito fronteiras e reprova qualquer sinal trocado.',
  }),

  // Índice nº c19 — Temperatura do ambiente
  logica({
    id: 'logica-c19-temperatura-do-ambiente',
    difficulty: 'basico',
    topic,
    title: 'Temperatura do Ambiente',
    summary: 'Classifique uma temperatura em fria, agradável ou quente.',
    realWorldContext:
      'É a lógica de um termostato: abaixo de uma faixa liga o aquecedor, acima liga o ar. A faixa do meio é a única em que o aparelho não faz nada — e ela é definida por dois limites, não por um.',
    description:
      'Implemente classificarTemperatura(celsius), que retorna "fria" abaixo de 18 °C, "agradável" de 18 °C até 27 °C, e "quente" acima de 27 °C.',
    goal: 'Definir uma faixa fechada entre dois limites, ambos inclusivos.',
    signature: {
      javascript: 'function classificarTemperatura(celsius)',
      typescript: "function classificarTemperatura(celsius: number): 'fria' | 'agradável' | 'quente'",
    },
    body: `  if (celsius < 18) {
    return 'fria';
  }
  if (celsius <= 27) {
    return 'agradável';
  }
  return 'quente';`,
    hints: [
      'Atenção à mudança de sinal: a primeira faixa é "abaixo de 18" (exclusiva) e a segunda termina "até 27" (inclusiva). Os dois limites da faixa do meio pertencem a ela.',
      'Não há faixa para temperatura negativa: frio de -5 °C é "fria" do mesmo jeito. A primeira condição já cobre tudo abaixo de 18.',
    ],
    testCases: [
      { description: 'Fria', input: 'classificarTemperatura(14)', expectedOutput: '"fria"', testFunction: "return classificarTemperatura(14) === 'fria';" },
      { description: 'Fronteira de baixo: 18 é agradável', input: 'classificarTemperatura(18)', expectedOutput: '"agradável"', testFunction: "return classificarTemperatura(18) === 'agradável';" },
      { description: 'Fronteira de cima: 27 é agradável', input: 'classificarTemperatura(27)', expectedOutput: '"agradável"', testFunction: "return classificarTemperatura(27) === 'agradável';" },
      { description: 'Quente', input: 'classificarTemperatura(31)', expectedOutput: '"quente"', testFunction: "return classificarTemperatura(31) === 'quente';" },
      { description: 'Temperatura negativa', input: 'classificarTemperatura(-5)', expectedOutput: '"fria"', testFunction: "return classificarTemperatura(-5) === 'fria';" },
      { description: 'Logo depois da fronteira', input: 'classificarTemperatura(27.1)', expectedOutput: '"quente"', testFunction: "return classificarTemperatura(27.1) === 'quente';" },
    ],
    explanation:
      'A faixa do meio é a que concentra os erros, porque tem dois limites e os dois são inclusivos: 18 e 27 são agradáveis, 17,9 é fria e 27,1 é quente. Os quatro testes em volta dessas bordas são o que garante que você não encolheu nem esticou a faixa confortável em um grau.',
  }),

  // Índice nº c20 — Tarifa de energia
  logica({
    id: 'logica-c20-tarifa-de-energia',
    difficulty: 'basico',
    topic,
    title: 'Tarifa de Energia',
    summary: 'Informe a faixa de tarifa pelo consumo em kWh.',
    realWorldContext:
      'A conta de luz usa faixas de consumo justamente para encarecer o excesso. Saber em qual faixa você está é o que explica por que a conta dobra quando o consumo sobe um pouco.',
    description:
      'Implemente faixaDeTarifa(kwh), que retorna "econômica" para consumo de até 100 kWh, "normal" para acima de 100 até 200 kWh, e "alta" para acima de 200 kWh.',
    goal: 'Repetir o padrão de faixas num domínio com unidade.',
    signature: {
      javascript: 'function faixaDeTarifa(kwh)',
      typescript: "function faixaDeTarifa(kwh: number): 'econômica' | 'normal' | 'alta'",
    },
    body: `  if (kwh <= 100) {
    return 'econômica';
  }
  if (kwh <= 200) {
    return 'normal';
  }
  return 'alta';`,
    hints: [
      '"Até 100 kWh" inclui o 100, então use <=.',
      'Consumo zero também é uma entrada válida — casa fechada no mês. Ele cai na primeira faixa sem precisar de tratamento próprio.',
    ],
    testCases: [
      { description: 'Econômica', input: 'faixaDeTarifa(80)', expectedOutput: '"econômica"', testFunction: "return faixaDeTarifa(80) === 'econômica';" },
      { description: 'Fronteira: 100 é econômica', input: 'faixaDeTarifa(100)', expectedOutput: '"econômica"', testFunction: "return faixaDeTarifa(100) === 'econômica';" },
      { description: 'Normal', input: 'faixaDeTarifa(150)', expectedOutput: '"normal"', testFunction: "return faixaDeTarifa(150) === 'normal';" },
      { description: 'Fronteira: 200 é normal', input: 'faixaDeTarifa(200)', expectedOutput: '"normal"', testFunction: "return faixaDeTarifa(200) === 'normal';" },
      { description: 'Alta', input: 'faixaDeTarifa(240)', expectedOutput: '"alta"', testFunction: "return faixaDeTarifa(240) === 'alta';" },
      { description: 'Consumo zero', input: 'faixaDeTarifa(0)', expectedOutput: '"econômica"', testFunction: "return faixaDeTarifa(0) === 'econômica';" },
    ],
    explanation:
      'Mesma estrutura do exercício de faixa de preço, com outra unidade e outros números — e é essa repetição que fixa o padrão. Vale notar o que ele tem de diferente: 201 kWh já é tarifa alta, então a diferença entre 200 e 201 na conta é bem maior que a de 1 kWh de consumo.',
  }),

  // Índice nº c21 — Período do dia
  logica({
    id: 'logica-c21-periodo-do-dia',
    difficulty: 'basico',
    topic,
    title: 'Período do Dia',
    summary: 'Converta uma hora de 0 a 23 no período do dia.',
    realWorldContext:
      '"Bom dia" ou "boa noite" num app, horário de pico num relatório, turno de um plantão. A diferença aqui é que o valor não cresce para sempre: ele dá a volta em 24, e a última faixa fecha no 23.',
    description:
      'Implemente periodoDoDia(hora), que recebe uma hora inteira de 0 a 23 e retorna "madrugada" (0 a 5), "manhã" (6 a 11), "tarde" (12 a 17) ou "noite" (18 a 23).',
    goal: 'Classificar um valor que percorre um ciclo fechado.',
    signature: {
      javascript: 'function periodoDoDia(hora)',
      typescript: "function periodoDoDia(hora: number): 'madrugada' | 'manhã' | 'tarde' | 'noite'",
    },
    body: `  if (hora <= 5) {
    return 'madrugada';
  }
  if (hora <= 11) {
    return 'manhã';
  }
  if (hora <= 17) {
    return 'tarde';
  }
  return 'noite';`,
    hints: [
      'As quatro faixas têm seis horas cada: 0–5, 6–11, 12–17 e 18–23. Testando em ordem, cada if compara só com o topo.',
      'Meia-noite é hora 0 e cai em madrugada; 23 é a última hora da noite. Não existe hora 24.',
    ],
    testCases: [
      { description: 'Madrugada', input: 'periodoDoDia(3)', expectedOutput: '"madrugada"', testFunction: "return periodoDoDia(3) === 'madrugada';" },
      { description: 'Manhã', input: 'periodoDoDia(8)', expectedOutput: '"manhã"', testFunction: "return periodoDoDia(8) === 'manhã';" },
      { description: 'Meio-dia já é tarde', input: 'periodoDoDia(12)', expectedOutput: '"tarde"', testFunction: "return periodoDoDia(12) === 'tarde';" },
      { description: 'Noite', input: 'periodoDoDia(21)', expectedOutput: '"noite"', testFunction: "return periodoDoDia(21) === 'noite';" },
      { description: 'Meia-noite e última hora', input: 'periodoDoDia(0) e periodoDoDia(23)', expectedOutput: 'madrugada e noite', testFunction: "return periodoDoDia(0) === 'madrugada' && periodoDoDia(23) === 'noite';" },
      { description: 'Todas as 24 horas caem em alguma faixa', input: 'periodoDoDia(0) até periodoDoDia(23)', expectedOutput: '6 de cada período', testFunction: "const c = {}; for (let h = 0; h <= 23; h++) { const p = periodoDoDia(h); c[p] = (c[p] || 0) + 1; } return c['madrugada'] === 6 && c['manhã'] === 6 && c['tarde'] === 6 && c['noite'] === 6;" },
    ],
    explanation:
      'O último teste percorre as 24 horas e confere que cada período recebeu exatamente 6 — é um jeito de testar a tabela inteira sem listar hora por hora. Qualquer fronteira deslocada desequilibra a contagem: um período fica com 5 e o vizinho com 7, e o teste reprova sem você precisar adivinhar qual hora errou.',
  }),

  // Índice nº c22 — Categoria do nadador
  logica({
    id: 'logica-c22-categoria-do-nadador',
    difficulty: 'intermediario',
    topic,
    title: 'Categoria do Nadador',
    summary: 'Classifique um atleta em cinco categorias por idade.',
    realWorldContext:
      'Federação esportiva separa atleta por categoria de idade para a competição ser justa. Com cinco faixas o encadeamento fica longo, e aparece uma pergunta que a tabela não responde: e quem é novo demais para a primeira categoria?',
    description:
      'Implemente categoriaDoNadador(idade), que retorna "infantil A" (5 a 7 anos), "infantil B" (8 a 10), "juvenil A" (11 a 13), "juvenil B" (14 a 17) ou "adulto" (18 ou mais). Abaixo de 5 anos não há categoria: retorne "sem categoria".',
    goal: 'Cobrir também o valor que fica fora de todas as faixas da tabela.',
    signature: {
      javascript: 'function categoriaDoNadador(idade)',
      typescript: "function categoriaDoNadador(idade: number): 'sem categoria' | 'infantil A' | 'infantil B' | 'juvenil A' | 'juvenil B' | 'adulto'",
    },
    body: `  if (idade < 5) {
    return 'sem categoria';
  }
  if (idade <= 7) {
    return 'infantil A';
  }
  if (idade <= 10) {
    return 'infantil B';
  }
  if (idade <= 13) {
    return 'juvenil A';
  }
  if (idade <= 17) {
    return 'juvenil B';
  }
  return 'adulto';`,
    hints: [
      'A tabela começa em 5 anos, então o primeiro if cuida de quem está abaixo disso. Resolvido esse caso, o resto é o encadeamento de sempre.',
      'Uma função tem de devolver algo para toda entrada possível. Se a tabela não prevê a entrada, quem escreve a função decide o que devolver — e deixa isso explícito, em vez de cair por acidente na primeira faixa.',
    ],
    testCases: [
      { description: 'Infantil A', input: 'categoriaDoNadador(6)', expectedOutput: '"infantil A"', testFunction: "return categoriaDoNadador(6) === 'infantil A';" },
      { description: 'Infantil B', input: 'categoriaDoNadador(9)', expectedOutput: '"infantil B"', testFunction: "return categoriaDoNadador(9) === 'infantil B';" },
      { description: 'Juvenil A', input: 'categoriaDoNadador(12)', expectedOutput: '"juvenil A"', testFunction: "return categoriaDoNadador(12) === 'juvenil A';" },
      { description: 'Juvenil B', input: 'categoriaDoNadador(15)', expectedOutput: '"juvenil B"', testFunction: "return categoriaDoNadador(15) === 'juvenil B';" },
      { description: 'Adulto', input: 'categoriaDoNadador(22)', expectedOutput: '"adulto"', testFunction: "return categoriaDoNadador(22) === 'adulto';" },
      { description: 'Novo demais para competir', input: 'categoriaDoNadador(3)', expectedOutput: '"sem categoria"', testFunction: "return categoriaDoNadador(3) === 'sem categoria';" },
      { description: 'Todas as fronteiras', input: '4, 5, 7, 8, 10, 11, 13, 14, 17, 18', expectedOutput: 'sem categoria, infantil A, infantil A, infantil B, infantil B, juvenil A, juvenil A, juvenil B, juvenil B, adulto', testFunction: "return categoriaDoNadador(4) === 'sem categoria' && categoriaDoNadador(5) === 'infantil A' && categoriaDoNadador(7) === 'infantil A' && categoriaDoNadador(8) === 'infantil B' && categoriaDoNadador(10) === 'infantil B' && categoriaDoNadador(11) === 'juvenil A' && categoriaDoNadador(13) === 'juvenil A' && categoriaDoNadador(14) === 'juvenil B' && categoriaDoNadador(17) === 'juvenil B' && categoriaDoNadador(18) === 'adulto';" },
    ],
    explanation:
      'A idade de 3 anos é o caso que a tabela do material não prevê, e que a função precisa resolver de qualquer forma. Sem o primeiro if, a criança de 3 anos entraria em "infantil A" — e o erro só apareceria na hora da inscrição. Quando uma tabela tem um piso, o que está abaixo dele é um caso tão real quanto os outros.',
  }),

  // Índice nº c23 — Faixa de imposto
  logica({
    id: 'logica-c23-faixa-de-imposto',
    difficulty: 'basico',
    topic,
    title: 'Faixa de Imposto',
    summary: 'Informe a faixa de imposto pelo salário.',
    realWorldContext:
      'A tabela do imposto de renda funciona assim de verdade, em faixas. Esta é a versão simplificada: devolve só a faixa, não o valor devido — e já basta para mostrar por que um aumento pequeno às vezes incomoda tanto.',
    description:
      'Implemente faixaDeImposto(salario), que retorna "isento" para salário de até R$ 2.000, "7%" para acima de R$ 2.000 até R$ 3.500, e "15%" para acima de R$ 3.500.',
    goal: 'Classificar em faixas quando o rótulo é um texto com símbolo.',
    signature: {
      javascript: 'function faixaDeImposto(salario)',
      typescript: "function faixaDeImposto(salario: number): 'isento' | '7%' | '15%'",
    },
    body: `  if (salario <= 2000) {
    return 'isento';
  }
  if (salario <= 3500) {
    return '7%';
  }
  return '15%';`,
    hints: [
      'As duas primeiras faixas terminam em valor inclusivo ("até"), então as duas comparações são <=.',
      'Aqui o retorno é o rótulo da faixa, texto mesmo — "7%" e "15%" com o símbolo. Se o exercício pedisse o valor do imposto, o retorno seria número.',
    ],
    testCases: [
      { description: 'Isento', input: 'faixaDeImposto(1800)', expectedOutput: '"isento"', testFunction: "return faixaDeImposto(1800) === 'isento';" },
      { description: 'Fronteira: 2000 é isento', input: 'faixaDeImposto(2000)', expectedOutput: '"isento"', testFunction: "return faixaDeImposto(2000) === 'isento';" },
      { description: 'Faixa de 7%', input: 'faixaDeImposto(2800)', expectedOutput: '"7%"', testFunction: "return faixaDeImposto(2800) === '7%';" },
      { description: 'Fronteira: 3500 ainda é 7%', input: 'faixaDeImposto(3500)', expectedOutput: '"7%"', testFunction: "return faixaDeImposto(3500) === '7%';" },
      { description: 'Faixa de 15%', input: 'faixaDeImposto(4200)', expectedOutput: '"15%"', testFunction: "return faixaDeImposto(4200) === '15%';" },
      { description: 'Um real acima da fronteira', input: 'faixaDeImposto(2000.01) e faixaDeImposto(3500.01)', expectedOutput: '7% e 15%', testFunction: "return faixaDeImposto(2000.01) === '7%' && faixaDeImposto(3500.01) === '15%';" },
    ],
    explanation:
      'O último teste mostra o efeito prático da fronteira: um centavo acima de R$ 2.000 muda a faixa inteira. Numa tabela real isso é resolvido com desconto por faixa, justamente para o aumento não sair pela culatra — mas a lógica da classificação é esta, e os dois valores de borda são os que precisam estar certos.',
  }),

  // Índice nº c24 — Turno de estudo pela letra
  logica({
    id: 'logica-c24-turno-de-estudo-pela-letra',
    difficulty: 'basico',
    topic,
    title: 'Turno de Estudo pela Letra',
    summary: 'Converta um código de letra no nome do turno.',
    realWorldContext:
      'Sistema de matrícula guarda o turno como uma letra: M, V ou N. Em algum ponto alguém digita outra coisa, e a função precisa dizer que o código é inválido em vez de devolver um turno errado ou travar.',
    description:
      'Implemente turnoDeEstudo(codigo), que recebe uma letra e retorna "matutino" para M, "vespertino" para V, "noturno" para N e "inválido" para qualquer outro código. Aceite a letra em maiúscula ou minúscula.',
    goal: 'Comparar valores discretos e tratar a entrada fora do esperado.',
    signature: {
      javascript: 'function turnoDeEstudo(codigo)',
      typescript: "function turnoDeEstudo(codigo: string): 'matutino' | 'vespertino' | 'noturno' | 'inválido'",
    },
    body: `  const letra = codigo.toUpperCase();

  if (letra === 'M') {
    return 'matutino';
  }
  if (letra === 'V') {
    return 'vespertino';
  }
  if (letra === 'N') {
    return 'noturno';
  }
  return 'inválido';`,
    hints: [
      'Normalize a entrada antes de comparar: toUpperCase() uma vez no começo evita escrever cada comparação duas vezes.',
      'Aqui as faixas não existem — os valores são discretos, então a comparação é de igualdade. O último return cuida de tudo que não casou com nada.',
    ],
    testCases: [
      { description: 'Matutino', input: "turnoDeEstudo('M')", expectedOutput: '"matutino"', testFunction: "return turnoDeEstudo('M') === 'matutino';" },
      { description: 'Vespertino', input: "turnoDeEstudo('V')", expectedOutput: '"vespertino"', testFunction: "return turnoDeEstudo('V') === 'vespertino';" },
      { description: 'Noturno', input: "turnoDeEstudo('N')", expectedOutput: '"noturno"', testFunction: "return turnoDeEstudo('N') === 'noturno';" },
      { description: 'Código desconhecido', input: "turnoDeEstudo('X')", expectedOutput: '"inválido"', testFunction: "return turnoDeEstudo('X') === 'inválido';" },
      { description: 'Minúscula também vale', input: "turnoDeEstudo('m') e turnoDeEstudo('v')", expectedOutput: 'matutino e vespertino', testFunction: "return turnoDeEstudo('m') === 'matutino' && turnoDeEstudo('v') === 'vespertino';" },
      { description: 'Texto vazio', input: "turnoDeEstudo('')", expectedOutput: '"inválido"', testFunction: "return turnoDeEstudo('') === 'inválido';" },
    ],
    explanation:
      'O teste da letra minúscula é o que justifica o toUpperCase() no começo: sem ele, "m" cairia em "inválido" e o aluno matriculado pela manhã ficaria sem turno. E o texto vazio mostra por que o último return precisa existir — toda entrada que não é M, V nem N tem a mesma resposta, e isso inclui as que você não imaginou.',
  }),

  // Índice nº c25 — Pressão sistólica
  logica({
    id: 'logica-c25-pressao-sistolica',
    difficulty: 'basico',
    topic,
    title: 'Pressão Sistólica',
    summary: 'Classifique a pressão em baixa, normal, elevada ou alta.',
    realWorldContext:
      'Aparelho de pressão de farmácia mostra exatamente isso: o número e a classificação. É um caso em que a faixa do meio tem piso e teto, e as das pontas são abertas de um lado.',
    description:
      'Implemente classificarPressao(sistolica), que retorna "baixa" abaixo de 90, "normal" de 90 até 120, "elevada" acima de 120 até menos de 140, e "alta" para 140 ou mais.',
    goal: 'Montar quatro faixas com limites de tipos diferentes.',
    signature: {
      javascript: 'function classificarPressao(sistolica)',
      typescript: "function classificarPressao(sistolica: number): 'baixa' | 'normal' | 'elevada' | 'alta'",
    },
    body: `  if (sistolica < 90) {
    return 'baixa';
  }
  if (sistolica <= 120) {
    return 'normal';
  }
  if (sistolica < 140) {
    return 'elevada';
  }
  return 'alta';`,
    hints: [
      'Preste atenção em quais limites entram na faixa: 90 e 120 são normais, 140 já é alta. Então os sinais não são todos iguais.',
      'A tabela do material usa números inteiros (121 até 139), mas escrever as condições como "até 120" e "abaixo de 140" cobre também os valores entre eles, sem deixar buraco.',
    ],
    testCases: [
      { description: 'Baixa', input: 'classificarPressao(85)', expectedOutput: '"baixa"', testFunction: "return classificarPressao(85) === 'baixa';" },
      { description: 'Normal', input: 'classificarPressao(110)', expectedOutput: '"normal"', testFunction: "return classificarPressao(110) === 'normal';" },
      { description: 'Elevada', input: 'classificarPressao(135)', expectedOutput: '"elevada"', testFunction: "return classificarPressao(135) === 'elevada';" },
      { description: 'Alta', input: 'classificarPressao(145)', expectedOutput: '"alta"', testFunction: "return classificarPressao(145) === 'alta';" },
      { description: 'Fronteiras da faixa normal', input: 'classificarPressao(90) e classificarPressao(120)', expectedOutput: 'normal e normal', testFunction: "return classificarPressao(90) === 'normal' && classificarPressao(120) === 'normal';" },
      { description: 'Fronteiras de cima', input: 'classificarPressao(121) e classificarPressao(140)', expectedOutput: 'elevada e alta', testFunction: "return classificarPressao(121) === 'elevada' && classificarPressao(140) === 'alta';" },
    ],
    explanation:
      'As quatro fronteiras testadas (90, 120, 121, 140) são o exercício inteiro. A tabela diz "90 até 120" e "121 até 139", e é tentador escrever as condições com esses mesmos números — mas aí 120,5 não cai em nenhuma faixa. Usando <= 120 e < 140 a reta dos números fica coberta sem sobra nem falta.',
  }),

  // Índice nº c26 — Frete grátis
  logica({
    id: 'logica-c26-frete-gratis',
    difficulty: 'intermediario',
    topic,
    title: 'Frete Grátis?',
    summary: 'Decida o frete a partir do valor da compra ou do cliente ser PRIME.',
    realWorldContext:
      'Duas portas para o mesmo benefício: gastar acima do piso, ou ser assinante. O cliente PRIME ganha frete grátis em qualquer compra, e é esse "ou" que muda a estrutura da condição.',
    description:
      'Implemente temFreteGratis(valor, ehPrime), que retorna true quando a compra vale R$ 150 ou mais, ou quando o cliente é PRIME. Nos outros casos, false.',
    goal: 'Usar OU lógico quando qualquer uma das condições já basta.',
    signature: {
      javascript: 'function temFreteGratis(valor, ehPrime)',
      typescript: 'function temFreteGratis(valor: number, ehPrime: boolean): boolean',
    },
    body: '  return valor >= 150 || ehPrime;',
    typeAssertions: `const gratis: boolean = temFreteGratis(200, false);
// @ts-expect-error — o segundo parâmetro é boolean, não o texto 'S' da planilha
temFreteGratis(200, 'S');`,
    hints: [
      'Basta uma das duas condições ser verdadeira, e é isso que o operador || faz. Com && o cliente PRIME só teria frete grátis em compra grande — o contrário da regra.',
      'A expressão já vale true ou false, então pode ir direto no return. O "ou mais" de "R$ 150 ou mais" pede >=.',
    ],
    testCases: [
      { description: 'Compra pequena, cliente comum', input: 'temFreteGratis(80, false)', expectedOutput: 'false', testFunction: 'return temFreteGratis(80, false) === false;' },
      { description: 'Compra grande, cliente comum', input: 'temFreteGratis(200, false)', expectedOutput: 'true', testFunction: 'return temFreteGratis(200, false) === true;' },
      { description: 'Compra pequena, cliente PRIME', input: 'temFreteGratis(90, true)', expectedOutput: 'true', testFunction: 'return temFreteGratis(90, true) === true;' },
      { description: 'Logo abaixo do piso, cliente comum', input: 'temFreteGratis(149, false)', expectedOutput: 'false', testFunction: 'return temFreteGratis(149, false) === false;' },
      { description: 'Exatamente no piso', input: 'temFreteGratis(150, false)', expectedOutput: 'true', testFunction: 'return temFreteGratis(150, false) === true;' },
      { description: 'As duas condições juntas', input: 'temFreteGratis(500, true)', expectedOutput: 'true', testFunction: 'return temFreteGratis(500, true) === true;' },
    ],
    explanation:
      'O terceiro teste é o que separa o || do &&: compra de R$ 90 feita por cliente PRIME tem frete grátis. Com && a resposta seria false, e o benefício da assinatura desapareceria. O par 149/150 fixa o piso inclusivo — e note que o PRIME torna o valor irrelevante, o que é exatamente o que a loja quer vender.',
  }),

  // Índice nº c27 — Faixa de intervalo
  logica({
    id: 'logica-c27-faixa-de-intervalo',
    difficulty: 'intermediario',
    topic,
    title: 'Faixa de Intervalo',
    summary: 'Diga em qual de três intervalos um número cai, ou que está fora de todos.',
    realWorldContext:
      'Classificar um número em intervalos nomeados aparece em sorteio, lote de produção, numeração de poltrona. A diferença em relação às outras tabelas é que aqui existe um lado de fora de verdade: tanto abaixo quanto acima.',
    description:
      'Implemente faixaDoIntervalo(n), que retorna "A" para números de 1 a 10, "B" de 11 a 20, "C" de 21 a 30, e "fora" para qualquer número fora desses intervalos — inclusive os menores que 1.',
    goal: 'Tratar um conjunto de faixas limitado nas duas pontas.',
    signature: {
      javascript: 'function faixaDoIntervalo(n)',
      typescript: "function faixaDoIntervalo(n: number): 'A' | 'B' | 'C' | 'fora'",
    },
    body: `  if (n < 1 || n > 30) {
    return 'fora';
  }
  if (n <= 10) {
    return 'A';
  }
  if (n <= 20) {
    return 'B';
  }
  return 'C';`,
    hints: [
      'Resolva o "fora" primeiro, nas duas pontas de uma vez: menor que 1 ou maior que 30. Depois disso você sabe que o número está entre 1 e 30, e o resto é o encadeamento normal.',
      'A alternativa é deixar o "fora" para o final, mas aí cada faixa precisa de piso e teto. Descartar o fora na entrada deixa o resto bem mais curto.',
    ],
    testCases: [
      { description: 'Faixa A', input: 'faixaDoIntervalo(5)', expectedOutput: '"A"', testFunction: "return faixaDoIntervalo(5) === 'A';" },
      { description: 'Fim da faixa B', input: 'faixaDoIntervalo(20)', expectedOutput: '"B"', testFunction: "return faixaDoIntervalo(20) === 'B';" },
      { description: 'Faixa C', input: 'faixaDoIntervalo(24)', expectedOutput: '"C"', testFunction: "return faixaDoIntervalo(24) === 'C';" },
      { description: 'Acima de tudo', input: 'faixaDoIntervalo(40)', expectedOutput: '"fora"', testFunction: "return faixaDoIntervalo(40) === 'fora';" },
      { description: 'Abaixo de tudo', input: 'faixaDoIntervalo(0) e faixaDoIntervalo(-7)', expectedOutput: 'fora e fora', testFunction: "return faixaDoIntervalo(0) === 'fora' && faixaDoIntervalo(-7) === 'fora';" },
      { description: 'As seis fronteiras internas', input: '1, 10, 11, 20, 21, 30', expectedOutput: 'A, A, B, B, C, C', testFunction: "return faixaDoIntervalo(1) === 'A' && faixaDoIntervalo(10) === 'A' && faixaDoIntervalo(11) === 'B' && faixaDoIntervalo(20) === 'B' && faixaDoIntervalo(21) === 'C' && faixaDoIntervalo(30) === 'C';" },
    ],
    explanation:
      'O zero e o -7 são o teste que a maioria esquece: é fácil pensar só no "acima de 30" e deixar o número pequeno cair na faixa A. Descartar as duas pontas na primeira condição resolve os dois de uma vez — e ainda deixa as três faixas seguintes com uma comparação cada, porque o piso já está garantido.',
  }),

  // Índice nº c28 — Entrada no evento
  logica({
    id: 'logica-c28-entrada-no-evento',
    difficulty: 'intermediario',
    topic,
    title: 'Entrada no Evento',
    summary: 'Decida a entrada a partir da idade e da autorização.',
    realWorldContext:
      'É a regra da portaria de um show: maior de idade entra, menor de 16 não entra de jeito nenhum, e no meio existe a faixa que depende do papel assinado. Três resultados diferentes a partir de duas entradas.',
    description:
      'Implemente entradaPermitida(idade, temAutorizacao), que retorna true para 18 anos ou mais, true para 16 ou 17 anos apenas com autorização, e false abaixo de 16 anos — mesmo com autorização.',
    goal: 'Combinar uma faixa de idade com uma condição extra que só vale nela.',
    signature: {
      javascript: 'function entradaPermitida(idade, temAutorizacao)',
      typescript: 'function entradaPermitida(idade: number, temAutorizacao: boolean): boolean',
    },
    body: `  if (idade >= 18) {
    return true;
  }
  if (idade >= 16) {
    return temAutorizacao;
  }
  return false;`,
    hints: [
      'Trate as três situações em ordem de idade. Na faixa do meio, a resposta é o próprio valor da autorização — não precisa de if para devolver true ou false.',
      'Abaixo de 16 a autorização não vale nada. Se você escrever idade >= 16 && temAutorizacao numa condição única, confira o que acontece com quem tem 14 anos e autorização.',
    ],
    testCases: [
      { description: 'Maior de idade, sem autorização', input: 'entradaPermitida(19, false)', expectedOutput: 'true', testFunction: 'return entradaPermitida(19, false) === true;' },
      { description: 'Dezessete sem autorização', input: 'entradaPermitida(17, false)', expectedOutput: 'false', testFunction: 'return entradaPermitida(17, false) === false;' },
      { description: 'Dezessete com autorização', input: 'entradaPermitida(17, true)', expectedOutput: 'true', testFunction: 'return entradaPermitida(17, true) === true;' },
      { description: 'Quatorze com autorização não entra', input: 'entradaPermitida(14, true)', expectedOutput: 'false', testFunction: 'return entradaPermitida(14, true) === false;' },
      { description: 'Fronteiras de 15 e 16 com autorização', input: 'entradaPermitida(15, true) e entradaPermitida(16, true)', expectedOutput: 'false e true', testFunction: 'return entradaPermitida(15, true) === false && entradaPermitida(16, true) === true;' },
      { description: 'Dezoito dispensa autorização', input: 'entradaPermitida(18, false)', expectedOutput: 'true', testFunction: 'return entradaPermitida(18, false) === true;' },
    ],
    explanation:
      'O teste de 14 anos com autorização é o que importa: a autorização só tem efeito dentro da faixa de 16 e 17. Quem resolve com uma condição única do tipo idade >= 18 || temAutorizacao deixa entrar uma criança de 10 anos com o papel assinado. A faixa do meio devolvendo temAutorizacao direto deixa isso explícito — é só ali que o papel conta.',
  }),

  // Índice nº c29 — Nível de estoque
  logica({
    id: 'logica-c29-nivel-de-estoque',
    difficulty: 'basico',
    topic,
    title: 'Nível de Estoque',
    summary: 'Classifique a quantidade em estoque em quatro níveis.',
    realWorldContext:
      'O semáforo do almoxarifado. A diferença em relação às outras tabelas é que o zero não é "baixo": é uma situação própria, porque sem estoque não se vende, não se promete prazo e o pedido de compra é urgente.',
    description:
      'Implemente nivelDeEstoque(quantidade), que retorna "sem estoque" para 0, "baixo" de 1 a 10, "normal" de 11 a 50, e "alto" para mais de 50.',
    goal: 'Separar o zero como caso próprio, e não como parte da primeira faixa.',
    signature: {
      javascript: 'function nivelDeEstoque(quantidade)',
      typescript: "function nivelDeEstoque(quantidade: number): 'sem estoque' | 'baixo' | 'normal' | 'alto'",
    },
    body: `  if (quantidade === 0) {
    return 'sem estoque';
  }
  if (quantidade <= 10) {
    return 'baixo';
  }
  if (quantidade <= 50) {
    return 'normal';
  }
  return 'alto';`,
    hints: [
      'O zero tem resposta própria, então ele é o primeiro teste — e é uma comparação de igualdade, não de faixa.',
      'Resolvido o zero, a faixa "1 a 10" vira só quantidade <= 10, porque o zero já saiu do caminho.',
    ],
    testCases: [
      { description: 'Sem estoque', input: 'nivelDeEstoque(0)', expectedOutput: '"sem estoque"', testFunction: "return nivelDeEstoque(0) === 'sem estoque';" },
      { description: 'Baixo', input: 'nivelDeEstoque(5)', expectedOutput: '"baixo"', testFunction: "return nivelDeEstoque(5) === 'baixo';" },
      { description: 'Normal', input: 'nivelDeEstoque(25)', expectedOutput: '"normal"', testFunction: "return nivelDeEstoque(25) === 'normal';" },
      { description: 'Alto', input: 'nivelDeEstoque(80)', expectedOutput: '"alto"', testFunction: "return nivelDeEstoque(80) === 'alto';" },
      { description: 'A última unidade ainda é baixo', input: 'nivelDeEstoque(1)', expectedOutput: '"baixo"', testFunction: "return nivelDeEstoque(1) === 'baixo';" },
      { description: 'Fronteiras de 10, 11, 50 e 51', input: '10, 11, 50, 51', expectedOutput: 'baixo, normal, normal, alto', testFunction: "return nivelDeEstoque(10) === 'baixo' && nivelDeEstoque(11) === 'normal' && nivelDeEstoque(50) === 'normal' && nivelDeEstoque(51) === 'alto';" },
    ],
    explanation:
      'Zero e um são o par que ensina o exercício: quantidade 1 é "baixo" e zero é "sem estoque", duas respostas diferentes para números vizinhos. Quem começa a tabela com quantidade <= 10 engole o zero em "baixo" — e o sistema passa a prometer um produto que não existe. Toda vez que uma tabela tem um valor isolado, ele vem antes das faixas.',
  }),

  // Índice nº c30 — Bônus por vendas
  logica({
    id: 'logica-c30-bonus-por-vendas',
    difficulty: 'basico',
    topic,
    title: 'Bônus por Vendas',
    summary: 'Informe a faixa de bônus pelo total vendido.',
    realWorldContext:
      'A comissão por meta de uma equipe de vendas. Fecha o bloco de classificação em faixas, agora com um detalhe de redação: a tabela diz "de R$ 500,00 até R$ 999,99", um teto escrito com centavos.',
    description:
      'Implemente faixaDeBonus(vendas), que retorna "sem bônus" para vendas abaixo de R$ 500, "5%" de R$ 500 até R$ 999,99, e "10%" para R$ 1.000 ou mais.',
    goal: 'Traduzir um teto escrito em centavos para a comparação com o piso seguinte.',
    signature: {
      javascript: 'function faixaDeBonus(vendas)',
      typescript: "function faixaDeBonus(vendas: number): 'sem bônus' | '5%' | '10%'",
    },
    body: `  if (vendas < 500) {
    return 'sem bônus';
  }
  if (vendas < 1000) {
    return '5%';
  }
  return '10%';`,
    hints: [
      'Em vez de comparar com 999,99, compare com o piso da faixa de cima: menor que 1000. Dá o mesmo resultado e cobre valores como 999,995.',
      '"De R$ 500" inclui o 500, e "R$ 1.000 ou mais" inclui o 1000. As duas bordas pertencem à faixa de cima de cada par.',
    ],
    testCases: [
      { description: 'Sem bônus', input: 'faixaDeBonus(300)', expectedOutput: '"sem bônus"', testFunction: "return faixaDeBonus(300) === 'sem bônus';" },
      { description: 'Fronteira: 500 já dá 5%', input: 'faixaDeBonus(500)', expectedOutput: '"5%"', testFunction: "return faixaDeBonus(500) === '5%';" },
      { description: 'Faixa de 5%', input: 'faixaDeBonus(850)', expectedOutput: '"5%"', testFunction: "return faixaDeBonus(850) === '5%';" },
      { description: 'Faixa de 10%', input: 'faixaDeBonus(1600)', expectedOutput: '"10%"', testFunction: "return faixaDeBonus(1600) === '10%';" },
      { description: 'O teto da tabela e o piso seguinte', input: 'faixaDeBonus(999.99) e faixaDeBonus(1000)', expectedOutput: '5% e 10%', testFunction: "return faixaDeBonus(999.99) === '5%' && faixaDeBonus(1000) === '10%';" },
      { description: 'Entre o teto escrito e o piso', input: 'faixaDeBonus(999.995)', expectedOutput: '"5%"', testFunction: "return faixaDeBonus(999.995) === '5%';" },
    ],
    explanation:
      'O último teste é o motivo de comparar com 1000 em vez de 999,99. Escrevendo vendas <= 999.99, o valor 999,995 não cairia em nenhuma das duas primeiras faixas e viria "10%" por acidente. Sempre que uma tabela escreve o teto em centavos, o que ela quer dizer é "abaixo do piso da faixa seguinte" — e é assim que vale escrever a condição.',
  }),
];

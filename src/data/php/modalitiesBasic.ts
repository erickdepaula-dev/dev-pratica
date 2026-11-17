import { Exercise } from '../../types/exercise';

export const phpBasicModalities: Exercise[] = [
  // ==========================================
  // CORRIGIR ERROS (5 exercícios)
  // ==========================================
  {
    id: 'php-basico-debug-02',
    language: 'php',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Strings & Operadores',
    title: 'Depuração: Concatenação com Sobrescrita Acidental em Loop',
    summary: 'Corrija um erro onde a atribuição simples sobrescreve o texto acumulado em vez de concatenar.',
    realWorldContext: 'Ao montar relatórios em lote ou mensagens com múltiplos destinatários, usar "=" em vez de ".=" descarta todo o histórico das iterações anteriores.',
    description: 'A função `montarListaProdutos` deveria concatenar todos os itens da lista separados por vírgula. Porém, ela está retornando apenas o último item! Corrija a instrução de atribuição dentro do laço.',
    goal: 'Substituir o operador de atribuição simples "=" pelo operador de concatenação e atribuição ".=".',
    bugDescription: 'A variável $saida é sobrescrita a cada volta do foreach com "=", resultando apenas no último produto.',
    buggyLineNumbers: [5],
    initialBuggyCode: `<?php

function montarListaProdutos(array $itens): string {
    $saida = "";
    foreach ($itens as $item) {
        // BUG: Sobrescreve em vez de concatenar!
        $saida = $item . ", ";
    }
    return rtrim($saida, ", ");
}

echo montarListaProdutos(["Mouse", "Teclado", "Monitor"]);
`,
    templateCode: `<?php

function montarListaProdutos(array $itens): string {
    $saida = "";
    foreach ($itens as $item) {
        // Corrija a linha abaixo:
        $saida .= $item . ", ";
    }
    return rtrim($saida, ", ");
}

echo montarListaProdutos(["Mouse", "Teclado", "Monitor"]);
`,
    solutionCode: `<?php

function montarListaProdutos(array $itens): string {
    $saida = "";
    foreach ($itens as $item) {
        $saida .= $item . ", ";
    }
    return rtrim($saida, ", ");
}

echo montarListaProdutos(["Mouse", "Teclado", "Monitor"]);`,
    hints: [
      'Dica 1: Em PHP, ".=" concatena o novo valor ao valor existente da string.',
      'Dica 2: Troque "$saida = $item . \", \";" por "$saida .= $item . \", \";".',
    ],
    testCases: [
      {
        description: 'Concatena todos os itens: "Mouse, Teclado, Monitor"',
        expectedOutput: 'Mouse, Teclado, Monitor',
      },
    ],
    validationRules: [
      {
        id: 'rule-concat-assign',
        description: 'Uso do operador de concatenação e atribuição (.=)',
        type: 'contains',
        target: '.=',
      },
    ],
    explanation: 'O operador "=" substitui integralmente o valor armazenado na variável. Para acumular strings iterativamente em laços, o PHP disponibiliza o operador ".=" (concatenação combinada com atribuição).',
  },

  {
    id: 'php-basico-debug-03',
    language: 'php',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Condicionais & Operadores',
    title: 'Depuração: Atribuição Acidental em Estrutura Condicional (if)',
    summary: 'Corrija um erro perigoso onde o operador de atribuição (=) é usado no if em vez da comparação de igualdade (== ou ===).',
    realWorldContext: 'Este é um dos bugs mais traiçoeiros do PHP: "$status = \'inativo\'" dentro de um if sempre avalia como verdadeiro e sobrescreve o valor real da variável.',
    description: 'A função `verificarAcesso` deveria bloquear usuários com status "bloqueado". No entanto, todos os usuários estão sendo marcados como bloqueados e o acesso é sempre reprovado! Corrija o operador de comparação no if.',
    goal: 'Trocar o operador "=" pelo operador de igualdade estrita "===" dentro da condição if.',
    bugDescription: 'O código utiliza $status = "bloqueado" na condição, atribuindo o valor em vez de comparar.',
    buggyLineNumbers: [4],
    initialBuggyCode: `<?php

function verificarAcesso(string $status): string {
    // BUG: Atribuição no if sempre resulta em true e altera $status!
    if ($status = "bloqueado") {
        return "ACESSO NEGADO";
    }
    return "ACESSO PERMITIDO";
}

echo verificarAcesso("ativo"); // Esperado: ACESSO PERMITIDO, mas retorna ACESSO NEGADO
`,
    templateCode: `<?php

function verificarAcesso(string $status): string {
    // Corrija a condição abaixo:
    if ($status === "bloqueado") {
        return "ACESSO NEGADO";
    }
    return "ACESSO PERMITIDO";
}

echo verificarAcesso("ativo");
`,
    solutionCode: `<?php

function verificarAcesso(string $status): string {
    if ($status === "bloqueado") {
        return "ACESSO NEGADO";
    }
    return "ACESSO PERMITIDO";
}

echo verificarAcesso("ativo");`,
    hints: [
      'Dica 1: Um único "=" é atribuição; "==" ou "===" é comparação de igualdade.',
      'Dica 2: Em PHP 8+, prefira sempre igualdade estrita (===).',
    ],
    testCases: [
      {
        description: 'Status ativo retorna "ACESSO PERMITIDO"',
        expectedOutput: 'ACESSO PERMITIDO',
      },
    ],
    validationRules: [
      {
        id: 'rule-strict-equal',
        description: 'Uso de comparação estrita === ou ==',
        type: 'regex',
        target: '===|==',
      },
      {
        id: 'rule-no-single-equal',
        description: 'Sem atribuição simples dentro do if',
        type: 'not_contains',
        target: 'if ($status = "',
      },
    ],
    explanation: 'Em PHP, a atribuição dentro de um if ($status = "bloqueado") atribui a string à variável e avalia a expressão pelo valor atribuído. Como qualquer string não vazia é considerada "truthy", a condição sempre entrava no bloco, independente do valor anterior.',
  },

  {
    id: 'php-basico-debug-04',
    language: 'php',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Laços de Repetição & Arrays',
    title: 'Depuração: Erro Off-By-One (<=) em Laço for com Índices de Array',
    summary: 'Corrija um erro de limite onde o laço tenta acessar uma chave que não existe além do final do array.',
    realWorldContext: 'Em PHP 8+, acessar uma posição inexistente dispara um Warning de "Undefined array key" que quebra rotinas rígidas de CI/CD ou APIs com tipagem restrita.',
    description: 'A função `somarPrecos` itera sobre um array indexado de tamanho N. Porém, o laço for utiliza `$i <= count($precos)`, tentando ler o índice N (que não existe, pois arrays começam em 0)! Corrija a condição de parada.',
    goal: 'Ajustar a condição do loop para $i < count($precos).',
    bugDescription: 'O operador <= faz o loop tentar acessar $precos[3] em um array de 3 elementos (índices 0, 1 e 2).',
    buggyLineNumbers: [5],
    initialBuggyCode: `<?php

function somarPrecos(array $precos): float {
    $total = 0.0;
    // BUG: $i <= count() tenta ler além do último índice!
    for ($i = 0; $i <= count($precos); $i++) {
        $total += $precos[$i];
    }
    return $total;
}

echo somarPrecos([10.0, 20.0, 30.0]);
`,
    templateCode: `<?php

function somarPrecos(array $precos): float {
    $total = 0.0;
    // Corrija a condição de parada do for:
    for ($i = 0; $i < count($precos); $i++) {
        $total += $precos[$i];
    }
    return $total;
}

echo somarPrecos([10.0, 20.0, 30.0]);
`,
    solutionCode: `<?php

function somarPrecos(array $precos): float {
    $total = 0.0;
    for ($i = 0; $i < count($precos); $i++) {
        $total += $precos[$i];
    }
    return $total;
}

echo somarPrecos([10.0, 20.0, 30.0]);`,
    hints: [
      'Dica 1: Arrays com 3 elementos possuem índices 0, 1 e 2.',
      'Dica 2: count($precos) retorna 3. Portanto o último índice é count - 1.',
      'Dica 3: Troque "<=" por "<" na condição do laço for.',
    ],
    testCases: [
      {
        description: 'Soma total de 60.0 sem warning de índice',
        expectedOutput: '60',
      },
    ],
    validationRules: [
      {
        id: 'rule-less-than',
        description: 'Uso de < count($precos)',
        type: 'contains',
        target: '< count($precos)',
      },
    ],
    explanation: 'Como arrays começam no índice 0, o último índice válido é sempre count($array) - 1. Utilizar "<=" faz com que o loop acesse um índice fora dos limites, gerando warnings no PHP 8.',
  },

  {
    id: 'php-basico-debug-05',
    language: 'php',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Funções & Escopo',
    title: 'Depuração: Escopo Local de Variável em Função PHP',
    summary: 'Corrija um erro de escopo onde uma função tenta usar uma variável declarada fora dela sem recebê-la por parâmetro.',
    realWorldContext: 'Diferente de JavaScript onde funções têm acesso automático às variáveis do escopo pai (closure), em PHP as funções têm escopo isolado por padrão.',
    description: 'A função `calcularTaxaServico` tenta multiplicar o valor pela alíquota `$taxaPadrao` que foi declarada fora. Isso gera "Undefined variable $taxaPadrao". Corrija a função para receber a taxa como segundo parâmetro.',
    goal: 'Adicionar float $taxa como parâmetro da função e utilizá-lo no cálculo.',
    bugDescription: 'A variável externa $taxaPadrao não é visível dentro do escopo da função.',
    buggyLineNumbers: [4, 5],
    initialBuggyCode: `<?php

$taxaPadrao = 0.10; // 10%

function calcularTaxaServico(float $valor): float {
    // BUG: $taxaPadrao não existe dentro do escopo local!
    return $valor * $taxaPadrao;
}

echo calcularTaxaServico(100.0);
`,
    templateCode: `<?php

function calcularTaxaServico(float $valor, float $taxa): float {
    // Corrija a função para utilizar a taxa recebida por parâmetro:
    return $valor * $taxa;
}

echo calcularTaxaServico(100.0, 0.10);
`,
    solutionCode: `<?php

function calcularTaxaServico(float $valor, float $taxa): float {
    return $valor * $taxa;
}

echo calcularTaxaServico(100.0, 0.10);`,
    hints: [
      'Dica 1: Em PHP, funções não capturam variáveis globais automaticamente.',
      'Dica 2: A melhor prática é passar os dados necessários via parâmetros tipados: (float $valor, float $taxa).',
    ],
    testCases: [
      {
        description: 'Calcula 10% de 100.0 resultando em 10.0',
        expectedOutput: '10',
      },
    ],
    validationRules: [
      {
        id: 'rule-param',
        description: 'Parâmetro $taxa na assinatura',
        type: 'contains',
        target: '$taxa',
      },
      {
        id: 'rule-multiplication',
        description: 'Multiplicação de $valor por $taxa',
        type: 'contains',
        target: '$valor * $taxa',
      },
    ],
    explanation: 'O PHP isola estritamente o escopo de variáveis dentro de funções. A forma correta e limpa de fornecer dados é através da passagem explícita de parâmetros tipados, evitando o uso anti-pattern de globals.',
  },

  {
    id: 'php-basico-debug-06',
    language: 'php',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Tratamento de Exceções & Divisão por Zero',
    title: 'Depuração: Prevenção de DivisionByZeroError em Média',
    summary: 'Adicione uma cláusula de guarda para evitar que a divisão por zero derrube a execução com DivisionByZeroError no PHP 8.',
    realWorldContext: 'No PHP 8+, dividir por zero dispara um erro fatal (DivisionByZeroError). Proteger cálculos estatísticos contra arrays vazios é requisito indispensável de robustez.',
    description: 'A função `calcularMediaValores` recebe uma lista de números. Se o array for vazio, `count($valores)` é 0 e o PHP lança um erro fatal de divisão por zero! Corrija adicionando uma verificação prévia que retorne 0.0 caso o array esteja vazio.',
    goal: 'Inserir cláusula de guarda: if (empty($valores)) return 0.0;.',
    bugDescription: 'Se o array recebido for vazio, a divisão por count($valores) dispara DivisionByZeroError.',
    buggyLineNumbers: [4],
    initialBuggyCode: `<?php

function calcularMediaValores(array $valores): float {
    // BUG: Se $valores estiver vazio, dispara DivisionByZeroError!
    $soma = array_sum($valores);
    return $soma / count($valores);
}

echo calcularMediaValores([]);
`,
    templateCode: `<?php

function calcularMediaValores(array $valores): float {
    // Adicione a verificação para array vazio antes de dividir:
    if (empty($valores)) {
        return 0.0;
    }
    return array_sum($valores) / count($valores);
}

echo calcularMediaValores([]);
`,
    solutionCode: `<?php

function calcularMediaValores(array $valores): float {
    if (empty($valores)) {
        return 0.0;
    }
    return array_sum($valores) / count($valores);
}

echo calcularMediaValores([]);`,
    hints: [
      'Dica 1: Use if (empty($valores)) ou if (count($valores) === 0) no início da função.',
      'Dica 2: Retorne 0.0 imediatamente para evitar a divisão fatal.',
    ],
    testCases: [
      {
        description: 'Array vazio retorna 0.0 com segurança',
        expectedOutput: '0',
      },
    ],
    validationRules: [
      {
        id: 'rule-guard',
        description: 'Verificação com empty() ou count() === 0',
        type: 'regex',
        target: '(empty\\(\\$valores\\)|count\\(\\$valores\\)\\s*===?\\s*0)',
      },
    ],
    explanation: 'No PHP 8, a divisão por zero não gera apenas um warning; ela interrompe o fluxo com DivisionByZeroError. A cláusula de guarda (guard clause) intercepta o caso degenerado logo no início.',
  },

  // ==========================================
  // PREVER A SAÍDA (5 exercícios)
  // ==========================================
  {
    id: 'php-basico-prever-03',
    language: 'php',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Tipos & Coerção Booleana',
    title: 'Previsão de Saída: Valores Falsy e Conversão Booleana em PHP',
    summary: 'Preveja como o PHP avalia strings como "0", string com espaço " " e texto "false" ao converter para booleano.',
    realWorldContext: 'Uma das maiores pegadinhas no PHP é que (bool)"0" é false, mas (bool)" " (espaço) e (bool)"false" são true! Entender isso evita bugs graves em condicionais de formulários.',
    description: 'Analise as três conversões booleanas abaixo e preveja exatamente o que será impresso na tela.',
    goal: 'Prever a conversão booleana de strings no PHP.',
    templateCode: `<?php

$a = (bool)"0" ? "V" : "F";
$b = (bool)" " ? "V" : "F";
$c = (bool)"false" ? "V" : "F";

echo "{$a}-{$b}-{$c}";
`,
    codeToPredict: `<?php

$a = (bool)"0" ? "V" : "F";
$b = (bool)" " ? "V" : "F";
$c = (bool)"false" ? "V" : "F";

echo "{$a}-{$b}-{$c}";`,
    expectedOutputPrediction: 'F-V-V',
    acceptableOutputPredictions: ['F-V-V', 'F - V - V'],
    solutionCode: `<?php

// Em PHP:
// "0" é FALSY -> F
// " " (espaço) é string não vazia, logo TRUTHY -> V
// "false" é uma string com texto, logo TRUTHY -> V
echo "F-V-V";`,
    hints: [
      'Dica 1: Em PHP, a string com apenas o caractere "0" é uma das poucas strings consideradas falsy.',
      'Dica 2: Qualquer string com pelo menos um caractere que não seja "0" (incluindo espaços ou a palavra "false") é considerada truthy.',
    ],
    testCases: [
      {
        description: 'Imprime "F-V-V"',
        expectedOutput: 'F-V-V',
      },
    ],
    explanation: 'Em PHP, a string "0" é explicitamente definida como falsy pelo interpretador (portanto $a = "F"). Já strings contendo espaço " " ou a palavra "false" são strings não vazias de tamanho > 0, avaliadas como true (portanto $b = "V" e $c = "V"). Resultado: F-V-V.',
  },

  {
    id: 'php-basico-prever-04',
    language: 'php',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Operadores Null Coalescing vs Elvis',
    title: 'Previsão de Saída: Diferença entre Null Coalescing (??) e Elvis (?:)',
    summary: 'Compreenda a diferença crucial entre checar existência de null (??) versus avaliação de valor truthy/falsy (?:).',
    realWorldContext: 'Se um usuário tem pontuação 0, usar $pontos ?: 10 substitui indevidamente o zero por 10! Já $pontos ?? 10 preserva o zero.',
    description: 'Analise o comportamento do operador ?? (null coalescing) e do operador ?: (elvis) sobre a variável $score que vale 0.',
    goal: 'Prever os valores retornados por ?? e ?:.',
    templateCode: `<?php

$score = 0;

$res1 = $score ?? 100;
$res2 = $score ?: 100;

echo "{$res1} | {$res2}";
`,
    codeToPredict: `<?php

$score = 0;

$res1 = $score ?? 100;
$res2 = $score ?: 100;

echo "{$res1} | {$res2}";`,
    expectedOutputPrediction: '0 | 100',
    acceptableOutputPredictions: ['0 | 100', '0|100'],
    solutionCode: `<?php

// $score ?? 100 só usa o padrão se $score for NULL (0 não é null -> 0)
// $score ?: 100 usa o padrão se $score for FALSY (0 é falsy -> 100)
echo "0 | 100";`,
    hints: [
      'Dica 1: O operador ?? só é acionado se a variável for null ou indefinida.',
      'Dica 2: O operador ?: é acionado se o valor for falsy (e 0 é considerado falsy em PHP).',
    ],
    testCases: [
      {
        description: 'Imprime "0 | 100"',
        expectedOutput: '0 | 100',
      },
    ],
    explanation: 'O operador ?? verifica estritamente isset($var) && $var !== null. Como 0 não é null, $res1 recebe 0. O operador ?: (elvis) avalia se a expressão é truthy; como 0 é falsy, $res2 assume o valor alternativo 100. Saída: "0 | 100".',
  },

  {
    id: 'php-basico-prever-05',
    language: 'php',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Operadores de Incremento',
    title: 'Previsão de Saída: Pós-incremento ($x++) vs Pré-incremento (++$x)',
    summary: 'Preveja a ordem de retorno de valor e mutação de variáveis com operadores de incremento.',
    realWorldContext: 'Usar $i++ dentro de índices de arrays associativos ou contadores de repetição é muito frequente em parsing de logs.',
    description: 'Observe o valor impresso durante a execução dos operadores de incremento e preveja a saída.',
    goal: 'Determinar os valores exibidos por pós e pré incremento.',
    templateCode: `<?php

$x = 5;

echo $x++;
echo " - ";
echo ++$x;
`,
    codeToPredict: `<?php

$x = 5;

echo $x++;
echo " - ";
echo ++$x;`,
    expectedOutputPrediction: '5 - 7',
    acceptableOutputPredictions: ['5 - 7', '5-7'],
    solutionCode: `<?php

// 1. $x++ devolve o valor atual (5) e depois incrementa para 6.
// 2. ++$x primeiro incrementa de 6 para 7 e devolve o novo valor (7).
echo "5 - 7";`,
    hints: [
      'Dica 1: $x++ (pós) devolve o valor original e depois incrementa.',
      'Dica 2: ++$x (pré) incrementa primeiro e depois devolve o novo valor.',
    ],
    testCases: [
      {
        description: 'Imprime "5 - 7"',
        expectedOutput: '5 - 7',
      },
    ],
    explanation: 'Na primeira instrução, $x++ entrega o valor atual (5) para o echo e depois eleva $x para 6. Na instrução seguinte, ++$x eleva $x de 6 para 7 e entrega o valor atualizado (7) para o echo. Resultado: "5 - 7".',
  },

  {
    id: 'php-basico-prever-06',
    language: 'php',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Operador Spaceship (<=>)',
    title: 'Previsão de Saída: Operador Nave Espacial (<=>)',
    summary: 'Preveja os três possíveis retornos (-1, 0, 1) do operador de comparação de três vias (Spaceship).',
    realWorldContext: 'O operador <=> é a ferramenta padrão utilizada em funções usort() para ordenar arrays de objetos ou dados complexos em PHP.',
    description: 'Determine o resultado das três comparações separadas por vírgula.',
    goal: 'Prever a saída do operador spaceship em comparações menor, igual e maior.',
    templateCode: `<?php

$a = 10 <=> 20; // menor
$b = 15 <=> 15; // igual
$c = 30 <=> 10; // maior

echo "{$a}, {$b}, {$c}";
`,
    codeToPredict: `<?php

$a = 10 <=> 20;
$b = 15 <=> 15;
$c = 30 <=> 10;

echo "{$a}, {$b}, {$c}";`,
    expectedOutputPrediction: '-1, 0, 1',
    acceptableOutputPredictions: ['-1, 0, 1', '-1,0,1'],
    solutionCode: `<?php

// Se esquerdo < direito -> -1
// Se esquerdo == direito -> 0
// Se esquerdo > direito -> 1
echo "-1, 0, 1";`,
    hints: [
      'Dica 1: Retorna -1 se o primeiro for menor que o segundo.',
      'Dica 2: Retorna 0 se forem iguais.',
      'Dica 3: Retorna 1 se o primeiro for maior que o segundo.',
    ],
    testCases: [
      {
        description: 'Imprime "-1, 0, 1"',
        expectedOutput: '-1, 0, 1',
      },
    ],
    explanation: 'O operador Spaceship (<=>) simplifica comparações para ordenação: retorna -1 quando o operando esquerdo é menor, 0 quando são equivalentes, e 1 quando o operando esquerdo é maior.',
  },

  {
    id: 'php-basico-prever-07',
    language: 'php',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Arrays & Chaves Automáticas',
    title: 'Previsão de Saída: Atribuição Automática de Índices Numéricos',
    summary: 'Preveja como o PHP define o próximo índice numérico após uma chave explícita mais alta.',
    realWorldContext: 'Ao adicionar itens com $array[] em um array que já possui índices numéricos manuais, o PHP sempre escolhe (maior_indice_ja_visto + 1).',
    description: 'Observe as chaves do array e preveja a chave e valor que o último elemento assumirá.',
    goal: 'Prever a chave gerada automaticamente pelo PHP.',
    templateCode: `<?php

$itens = [
    5 => "A",
    "B",
    20 => "C",
    "D",
];

// O elemento "D" assumirá qual índice numérico?
// Chaves: 5 => A, 6 => B, 20 => C, 21 => D
$chaves = array_keys($itens);
echo end($chaves) . ":" . end($itens);
`,
    codeToPredict: `<?php

$itens = [
    5 => "A",
    "B",
    20 => "C",
    "D",
];

$chaves = array_keys($itens);
echo end($chaves) . ":" . end($itens);`,
    expectedOutputPrediction: '21:D',
    acceptableOutputPredictions: ['21:D', '21 : D', '21: D'],
    solutionCode: `<?php

// Após a chave 20 ("C"), o item "D" recebe automaticamente 20 + 1 = 21.
echo "21:D";`,
    hints: [
      'Dica 1: O item "B" assume o índice 6 (5 + 1).',
      'Dica 2: O item "C" tem o índice 20 explícito.',
      'Dica 3: O item "D" assume automaticamente (maior índice existente + 1).',
    ],
    testCases: [
      {
        description: 'Imprime "21:D"',
        expectedOutput: '21:D',
      },
    ],
    explanation: 'Em PHP, quando um novo elemento é inserido sem chave especificada, o índice atribuído é o maior índice numérico inteiro existente no array acrescido de 1. Como o maior índice era 20, o item "D" recebeu o índice 21.',
  },

  // ==========================================
  // DESAFIOS PRÁTICOS (5 exercícios)
  // ==========================================
  {
    id: 'php-basico-desafio-02',
    language: 'php',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Strings & Formatação Financeira',
    title: 'Desafio Prático: Formatador de Moeda Brasileira (R$)',
    summary: 'Construa uma função de formatação de valores monetários no padrão brasileiro (vírgula para centavos e ponto para milhares).',
    realWorldContext: 'Toda aplicação financeira, checkout ou extrato de e-commerce precisa exibir valores formatados no padrão "R$ 1.250,50".',
    description: 'Implemente a função `formatarReal(float $valor): string` utilizando a função nativa `number_format` do PHP.\nRegras:\n1. 2 casas decimais.\n2. Separador de decimais deve ser vírgula (",").\n3. Separador de milhares deve ser ponto ("."). \n4. Prefixo "R$ " antes do valor numérico.',
    goal: 'Formatar o float no padrão R$ X.XXX,XX com number_format.',
    practicalRequirements: [
      'Declarar a função formatarReal(float $valor): string',
      'Usar number_format com 2 casas decimais',
      'Separador decimal vírgula "," e milhar ponto "."',
      'Retornar com o prefixo "R$ "',
    ],
    templateCode: `<?php

function formatarReal(float $valor): string {
    // Formate o valor no padrão R$ 1.500,00
}

// Testes:
echo formatarReal(1500.5) . "\n"; // R$ 1.500,50
echo formatarReal(89.9) . "\n";   // R$ 89,90
`,
    solutionCode: `<?php

function formatarReal(float $valor): string {
    return "R$ " . number_format($valor, 2, ',', '.');
}

echo formatarReal(1500.5);`,
    hints: [
      'Dica 1: A assinatura de number_format é: number_format($valor, 2, ",", ".").',
      'Dica 2: Concatene com "R$ " no início do retorno.',
    ],
    testCases: [
      {
        description: 'Formata 1500.5 como R$ 1.500,50',
        expectedOutput: 'R$ 1.500,50',
      },
    ],
    validationRules: [
      {
        id: 'rule-number-format',
        description: 'Uso de number_format()',
        type: 'contains',
        target: 'number_format',
      },
      {
        id: 'rule-prefix',
        description: 'Prefixo R$ presente',
        type: 'contains',
        target: 'R$',
      },
    ],
    explanation: 'number_format($valor, 2, ",", ".") é a função nativa de alto desempenho do PHP para formatação monetária com precisão de duas casas decimais e separadores regionais.',
  },

  {
    id: 'php-basico-desafio-03',
    language: 'php',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Strings & SEO',
    title: 'Desafio Prático: Gerador de Slug Amigável para URLs',
    summary: 'Construa uma função que converte títulos com espaços e caracteres maiúsculos em slugs limpos e amigáveis para URLs.',
    realWorldContext: 'Em blogs e e-commerces, o título "Curso de PHP 8 Completo" deve virar a URL limpa "curso-de-php-8-completo".',
    description: 'Implemente a função `gerarSlug(string $titulo): string`:\n1. Converter todo o texto para minúsculas (`strtolower`).\n2. Substituir múltiplos espaços consecutivos ou traços por um único hífen ("-").\n3. Remover caracteres que não sejam letras, números ou hífens (`preg_replace("/[^a-z0-9-]/", "", ...)`).\n4. Remover hífens das extremidades (`trim($slug, "-")`).',
    goal: 'Sanitizar títulos e gerar slugs sem espaços nem caracteres especiais.',
    practicalRequirements: [
      'Converter para minúsculas com strtolower',
      'Substituir espaços por hífens com preg_replace ou str_replace',
      'Garantir remoção de caracteres especiais proibidos em URLs',
      'Remover hífens excedentes das pontas com trim',
    ],
    templateCode: `<?php

function gerarSlug(string $titulo): string {
    // 1. Minúsculas
    
    // 2. Substituir espaços por hífen
    
    // 3. Remover caracteres especiais e aparar
}

// Teste:
echo gerarSlug("Aprenda PHP 8 em 2026!"); // aprenda-php-8-em-2026
`,
    solutionCode: `<?php

function gerarSlug(string $titulo): string {
    $limpo = strtolower(trim($titulo));
    $limpo = preg_replace('/[^a-z0-9]+/i', '-', $limpo);
    return trim($limpo, '-');
}

echo gerarSlug("Aprenda PHP 8 em 2026!");`,
    hints: [
      'Dica 1: strtolower() deixa tudo minúsculo.',
      'Dica 2: preg_replace("/[^a-z0-9]+/i", "-", $str) troca qualquer caractere não alfanumérico por hífen.',
      'Dica 3: trim($str, "-") remove hífens que sobrarem no começo ou final.',
    ],
    testCases: [
      {
        description: 'Converte "Aprenda PHP 8 em 2026!" para "aprenda-php-8-em-2026"',
        expectedOutput: 'aprenda-php-8-em-2026',
      },
    ],
    validationRules: [
      {
        id: 'rule-lower',
        description: 'Uso de strtolower() ou mb_strtolower()',
        type: 'contains',
        target: 'strtolower',
      },
      {
        id: 'rule-trim',
        description: 'Uso de trim()',
        type: 'contains',
        target: 'trim',
      },
    ],
    explanation: 'Slugs amigáveis otimizam indexação em mecanismos de busca (SEO) e tornam URLs legíveis e compartilháveis em redes sociais.',
  },

  {
    id: 'php-basico-desafio-04',
    language: 'php',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Condicionais & Regras de Negócio',
    title: 'Desafio Prático: Validador de Elegibilidade para Meia-Entrada',
    summary: 'Implemente uma regra de bilheteria que concede 50% de desconto com base em múltiplos critérios da legislação brasileira.',
    realWorldContext: 'Sistemas de venda de ingressos (cinemas, shows) calculam elegibilidade para meia-entrada considerando idade e declaração de estudante.',
    description: 'Crie a função `temDireitoMeiaEntrada(int $idade, bool $isEstudante, bool $isProfessor): bool`:\nRegras:\n1. Crianças até 12 anos (idade <= 12) têm direito.\n2. Idosos a partir de 60 anos (idade >= 60) têm direito.\n3. Qualquer pessoa com carteirinha de estudante ($isEstudante === true) tem direito.\n4. Professores ($isProfessor === true) têm direito.\n5. Se nenhum dos critérios for atendido, retorna false.',
    goal: 'Construir a expressão lógica combinando os 4 critérios com o operador OU (||).',
    practicalRequirements: [
      'Checar idade <= 12 OU idade >= 60',
      'Checar se $isEstudante é true',
      'Checar se $isProfessor é true',
      'Retornar true se qualquer condição for satisfeita, senão false',
    ],
    templateCode: `<?php

function temDireitoMeiaEntrada(int $idade, bool $isEstudante, bool $isProfessor): bool {
    // Escreva a regra de elegibilidade
}

// Testes:
var_dump(temDireitoMeiaEntrada(25, true, false)); // true (estudante)
var_dump(temDireitoMeiaEntrada(65, false, false)); // true (idoso)
var_dump(temDireitoMeiaEntrada(30, false, false)); // false
`,
    solutionCode: `<?php

function temDireitoMeiaEntrada(int $idade, bool $isEstudante, bool $isProfessor): bool {
    if ($idade <= 12 || $idade >= 60) {
        return true;
    }
    if ($isEstudante || $isProfessor) {
        return true;
    }
    return false;
}

var_dump(temDireitoMeiaEntrada(25, true, false));`,
    hints: [
      'Dica 1: O operador || (OU lógico) é satisfeito se qualquer uma das condições for verdadeira.',
      'Dica 2: Você pode usar cláusulas de guarda retornando true assim que um critério for satisfeito.',
    ],
    testCases: [
      {
        description: 'Estudante de 25 anos tem direito à meia-entrada',
        expectedOutput: 'true',
      },
      {
        description: 'Adulto comum de 30 anos não tem direito',
        expectedOutput: 'false',
      },
    ],
    validationRules: [
      {
        id: 'rule-age-check',
        description: 'Validação de idade <= 12 e >= 60',
        type: 'contains',
        target: '60',
      },
    ],
    explanation: 'A combinação de operadores lógicos booleanos garante que regras de negócio com múltiplos caminhos de aprovação sejam avaliadas com clareza e performance.',
  },

  {
    id: 'php-basico-desafio-05',
    language: 'php',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Strings & Manipulação de Nomes',
    title: 'Desafio Prático: Extrator de Iniciais de Nome Completo',
    summary: 'Construa um componente para gerar as iniciais em maiúsculas de um nome completo, ignorando preposições (de, da, do, dos, e).',
    realWorldContext: 'Avatares de usuários no estilo Google/Slack exibem as iniciais do desenvolvedor quando ele ainda não fez upload de uma foto de perfil.',
    description: 'Implemente a função `extrairIniciais(string $nomeCompleto): string`:\n1. Quebrar o nome em palavras usando `explode(" ", $nomeCompleto)`.\n2. Ignorar preposições comuns em português: ["de", "da", "do", "dos", "das", "e"].\n3. Extrair a primeira letra de cada palavra restante em maiúscula com `strtoupper($palavra[0])`.\n4. Retornar as letras juntas (ex: "Erick Ricardo da Silva" -> "ERS").',
    goal: 'Filtrar preposições e montar a sigla das iniciais em maiúsculas.',
    practicalRequirements: [
      'Dividir palavras com explode',
      'Ignorar preposições da língua portuguesa',
      'Coletar a primeira letra de cada nome válido',
      'Converter para maiúsculas e retornar string combinada',
    ],
    templateCode: `<?php

function extrairIniciais(string $nomeCompleto): string {
    $preposicoes = ['de', 'da', 'do', 'dos', 'das', 'e'];
    // Implemente a extração das iniciais aqui
}

// Teste:
echo extrairIniciais("Erick Ricardo da Silva"); // ERS
echo extrairIniciais("Ana Maria de Souza");   // AMS
`,
    solutionCode: `<?php

function extrairIniciais(string $nomeCompleto): string {
    $preposicoes = ['de', 'da', 'do', 'dos', 'das', 'e'];
    $palavras = explode(' ', trim($nomeCompleto));
    $iniciais = '';

    foreach ($palavras as $palavra) {
        $termo = strtolower($palavra);
        if ($termo !== '' && !in_array($termo, $preposicoes, true)) {
            $iniciais .= strtoupper($palavra[0]);
        }
    }

    return $iniciais;
}

echo extrairIniciais("Erick Ricardo da Silva");`,
    hints: [
      'Dica 1: Use explode(" ", $nomeCompleto) para obter o array de palavras.',
      'Dica 2: in_array(strtolower($palavra), $preposicoes) permite ignorar preposições.',
      'Dica 3: $palavra[0] pega o primeiro caractere da string.',
    ],
    testCases: [
      {
        description: 'Extrai "ERS" de "Erick Ricardo da Silva"',
        expectedOutput: 'ERS',
      },
    ],
    validationRules: [
      {
        id: 'rule-explode',
        description: 'Uso de explode() para quebra de palavras',
        type: 'contains',
        target: 'explode',
      },
      {
        id: 'rule-upper',
        description: 'Uso de strtoupper() para as iniciais',
        type: 'contains',
        target: 'strtoupper',
      },
    ],
    explanation: 'A extração de iniciais desconsiderando partículas conectoras é o padrão da indústria para design de avatares com fallback de texto limpo e profissional.',
  },

  {
    id: 'php-basico-desafio-06',
    language: 'php',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Arrays Associativos & Filtros',
    title: 'Desafio Prático: Totalizador de Itens por Categoria no Carrinho',
    summary: 'Construa uma função que percorre um carrinho de compras e soma apenas os preços dos produtos de uma categoria selecionada.',
    realWorldContext: 'Cupons de desconto que se aplicam apenas a "Livros" ou "Eletrônicos" exigem calcular o subtotal restrito àquela categoria antes de conceder o abatimento.',
    description: 'Crie a função `somarPorCategoria(array $carrinho, string $categoriaDesejada): float`:\n- Cada item é um array associativo com `["nome" => string, "categoria" => string, "preco" => float, "qtd" => int]`.\n- A função deve somar `preco * qtd` de todos os itens cuja categoria seja igual a `$categoriaDesejada`.\n- Se não houver itens daquela categoria, deve retornar `0.0`.',
    goal: 'Iterar sobre o array com foreach, filtrar pela categoria e acumular subtotal.',
    practicalRequirements: [
      'Receber array de produtos e string de categoria',
      'Verificar se $item["categoria"] === $categoriaDesejada',
      'Multiplicar $item["preco"] * $item["qtd"] para cada item compatível',
      'Retornar total acumulado como float',
    ],
    templateCode: `<?php

function somarPorCategoria(array $carrinho, string $categoriaDesejada): float {
    // Acumule o subtotal dos produtos da categoria selecionada
}

// Teste:
$carrinho = [
    ["nome" => "Clean Code", "categoria" => "Livros", "preco" => 80.0, "qtd" => 2],
    ["nome" => "Mouse Gamer", "categoria" => "Hardware", "preco" => 150.0, "qtd" => 1],
    ["nome" => "Refactoring", "categoria" => "Livros", "preco" => 100.0, "qtd" => 1],
];

echo somarPorCategoria($carrinho, "Livros"); // 80*2 + 100*1 = 260.0
`,
    solutionCode: `<?php

function somarPorCategoria(array $carrinho, string $categoriaDesejada): float {
    $total = 0.0;
    foreach ($carrinho as $item) {
        if (isset($item['categoria']) && $item['categoria'] === $categoriaDesejada) {
            $total += ($item['preco'] * $item['qtd']);
        }
    }
    return $total;
}

$carrinho = [
    ["nome" => "Clean Code", "categoria" => "Livros", "preco" => 80.0, "qtd" => 2],
    ["nome" => "Mouse Gamer", "categoria" => "Hardware", "preco" => 150.0, "qtd" => 1],
    ["nome" => "Refactoring", "categoria" => "Livros", "preco" => 100.0, "qtd" => 1],
];

echo somarPorCategoria($carrinho, "Livros");`,
    hints: [
      'Dica 1: Inicie $total = 0.0 antes do foreach.',
      'Dica 2: Dentro do loop, use if ($item["categoria"] === $categoriaDesejada).',
      'Dica 3: Some $item["preco"] * $item["qtd"] à variável $total.',
    ],
    testCases: [
      {
        description: 'Soma total dos Livros resulta em 260.0',
        expectedOutput: '260',
      },
    ],
    validationRules: [
      {
        id: 'rule-foreach',
        description: 'Iteração com foreach sobre o carrinho',
        type: 'contains',
        target: 'foreach',
      },
      {
        id: 'rule-mult',
        description: 'Cálculo de subtotal preço * quantidade',
        type: 'regex',
        target: '\\*\\s*\\$item\\[[\'"]qtd[\'"]\\]',
      },
    ],
    explanation: 'Filtrar coleções de dados antes de aplicar funções de agregação (soma, média) é o fundamento do processamento de dados em backend.',
  },
];

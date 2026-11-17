import { Exercise } from '../../types/exercise';

export const phpBasicExercises: Exercise[] = [
  // 1
  {
    id: 'php-basico-01',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Funções & Operadores',
    title: 'Cálculo de Desconto em E-commerce',
    summary: 'Crie uma função simples que calcula o preço final após aplicar um percentual de desconto.',
    realWorldContext: 'Em lojas virtuais e sistemas de checkout, cálculos de desconto baseados em cupons ou promoções são executados constantemente antes do fechamento do pedido.',
    description: 'Você precisa completar a função `calcularDesconto` que recebe o valor original do produto ($valor) e o percentual de desconto ($percentual). A função deve calcular o desconto e retornar o valor final a ser pago pelo cliente.',
    goal: 'Preencher a fórmula de desconto e a instrução de retorno.',
    templateCode: `<?php

function calcularDesconto(float $valor, float $percentual): float {
    $desconto = $valor * ({{blank_0}});
    {{blank_1}};
}

// Teste da função
$precoFinal = calcularDesconto(200.00, 15.0);
echo "Preço final: R$ " . number_format($precoFinal, 2, ',', '.');
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Cálculo do percentual',
        expectedAnswers: ['$percentual / 100', '$percentual/100', '($percentual / 100)'],
        hint: 'Para transformar uma porcentagem em fração decimal, divida o percentual por 100.',
      },
      {
        id: 'blank_1',
        label: 'Retorno do valor com desconto',
        expectedAnswers: ['return $valor - $desconto', 'return ($valor - $desconto)', 'return $valor-$desconto'],
        hint: 'Use a palavra-chave "return" subtraindo o desconto do valor original.',
      },
    ],
    solutionCode: `<?php

function calcularDesconto(float $valor, float $percentual): float {
    $desconto = $valor * ($percentual / 100);
    return $valor - $desconto;
}

$precoFinal = calcularDesconto(200.00, 15.0);
echo "Preço final: R$ " . number_format($precoFinal, 2, ',', '.');`,
    hints: [
      'Dica 1: O percentual de 15% equivale matematicamente a 15 dividido por 100 (0.15).',
      'Dica 2: A lacuna 0 deve conter a expressão que converte o percentual em decimal ($percentual / 100).',
      'Dica 3: Na lacuna 1, retorne o resultado da subtração do valor original menos o valor calculado em $desconto.',
    ],
    testCases: [
      {
        description: 'calcularDesconto(200, 15) deve resultar em 170.00',
        input: 'valor: 200.00, percentual: 15.0',
        expectedOutput: '170.00',
      },
      {
        description: 'calcularDesconto(100, 50) deve resultar em 50.00',
        input: 'valor: 100.00, percentual: 50.0',
        expectedOutput: '50.00',
      },
    ],
    explanation: 'Em PHP 7 e 8, especificar tipos nos parâmetros e no retorno (float) garante integridade matemática e evita bugs silenciosos de conversão de tipos.',
    alternativeSolutions: [
      {
        title: 'Fórmula Direta em uma única linha',
        code: `function calcularDesconto(float $valor, float $percentual): float {
    return $valor * (1 - ($percentual / 100));
}`,
        explanation: 'Multiplicar diretamente por (1 - taxa) evita a criação da variável intermediária $desconto mantendo a clareza.',
        isRecommended: true,
      },
    ],
  },

  // 2
  {
    id: 'php-basico-02',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Condicionais & Lógica',
    title: 'Verificação de Elegibilidade de Crédito',
    summary: 'Valide condições financeiras usando estruturas condicionais if / else com múltiplos critérios.',
    realWorldContext: 'Sistemas bancários ou de aprovação de pagamentos avaliam score mínimo e renda para aprovar crédito automaticamente.',
    description: 'Complete a verificação que define se um cliente é aprovado para empréstimo. O cliente só é aprovado se tiver idade mínima de 18 anos E score de crédito maior ou igual a 700.',
    goal: 'Preencher a condição lógica combinando dois critérios com o operador E (&&) e a atribuição de status.',
    templateCode: `<?php

function verificarAprovacao(int $idade, int $score): string {
    if ({{blank_0}}) {
        return "APROVADO";
    } {{blank_1}} {
        return "REPROVADO";
    }
}

echo verificarAprovacao(25, 750);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Condição com operador lógico',
        expectedAnswers: [
          '$idade >= 18 && $score >= 700',
          '$score >= 700 && $idade >= 18',
          '($idade >= 18) && ($score >= 700)',
          '$idade >= 18 and $score >= 700',
        ],
        hint: 'Combine a verificação de idade ($idade >= 18) com a de score ($score >= 700) usando &&.',
      },
      {
        id: 'blank_1',
        label: 'Bloco alternativo',
        expectedAnswers: ['else'],
        hint: 'Use a palavra reservada padrão para o caso contrário.',
      },
    ],
    solutionCode: `<?php

function verificarAprovacao(int $idade, int $score): string {
    if ($idade >= 18 && $score >= 700) {
        return "APROVADO";
    } else {
        return "REPROVADO";
    }
}

echo verificarAprovacao(25, 750);`,
    hints: [
      'Dica 1: O operador maior ou igual em PHP é >=.',
      'Dica 2: Para exigir que AMBAS as condições sejam verdadeiras simultaneamente, use o operador lógico &&.',
      'Dica 3: O bloco de fallback quando a condição if for falsa é simplesmente o else.',
    ],
    testCases: [
      {
        description: 'Idade 25 e Score 750 -> APROVADO',
        expectedOutput: 'APROVADO',
      },
      {
        description: 'Idade 17 e Score 800 -> REPROVADO (menor de idade)',
        expectedOutput: 'REPROVADO',
      },
    ],
    explanation: 'O operador && possui maior precedência que o operador and em PHP. No dia a dia profissional, prefira sempre && para evitar surpresas na ordem de avaliação.',
  },

  // 3
  {
    id: 'php-basico-03',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Laços de Repetição',
    title: 'Totalizador de Itens do Carrinho com Foreach',
    summary: 'Percorra um array associativo de produtos e acumule o valor total da compra.',
    realWorldContext: 'Toda plataforma de e-commerce precisa iterar sobre os itens do carrinho para calcular subtotais multiplicando quantidade e preço unitário.',
    description: 'Complete o laço foreach para percorrer os itens e incrementar a variável acumuladora $total multiplicando o preço pela quantidade de cada produto.',
    goal: 'Definir a sintaxe do laço foreach e a operação de soma com multiplicação.',
    templateCode: `<?php

$itens = [
    ['nome' => 'Teclado Mecânico', 'preco' => 250.0, 'qtd' => 2],
    ['nome' => 'Mouse Gamer',     'preco' => 120.0, 'qtd' => 1],
    ['nome' => 'Mousepad XL',     'preco' => 60.0,  'qtd' => 2],
];

$total = 0.0;

foreach ({{blank_0}}) {
    $total += {{blank_1}};
}

echo "Total a pagar: R$ " . $total;
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Definição do foreach',
        expectedAnswers: ['$itens as $item', '$itens as $p'],
        hint: 'Use a sintaxe: $array as $elemento_individual.',
      },
      {
        id: 'blank_1',
        label: 'Cálculo do subtotal do item',
        expectedAnswers: [
          "$item['preco'] * $item['qtd']",
          '$item["preco"] * $item["qtd"]',
          "$item['qtd'] * $item['preco']",
          '$item["qtd"] * $item["preco"]',
        ],
        hint: 'Multiplique o preço ($item[\'preco\']) pela quantidade ($item[\'qtd\']).',
      },
    ],
    solutionCode: `<?php

$itens = [
    ['nome' => 'Teclado Mecânico', 'preco' => 250.0, 'qtd' => 2],
    ['nome' => 'Mouse Gamer',     'preco' => 120.0, 'qtd' => 1],
    ['nome' => 'Mousepad XL',     'preco' => 60.0,  'qtd' => 2],
];

$total = 0.0;

foreach ($itens as $item) {
    $total += $item['preco'] * $item['qtd'];
}

echo "Total a pagar: R$ " . $total;`,
    hints: [
      'Dica 1: O foreach em PHP itera um array atribuindo cada valor a uma variável temporária: foreach ($itens as $item).',
      'Dica 2: Para acessar chaves de arrays associativos, use colchetes e aspas: $item[\'preco\'].',
    ],
    testCases: [
      {
        description: 'Soma total dos 3 itens: (250*2) + (120*1) + (60*2) = 740',
        expectedOutput: '740.0',
      },
    ],
    explanation: 'O loop foreach é a forma mais segura e idiomática de iterar arrays em PHP, pois não exige controle manual de índices numéricos.',
  },

  // 4
  {
    id: 'php-basico-04',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Operadores & Variáveis',
    title: 'Tratamento Seguro com Null Coalescing (??)',
    summary: 'Acesse chaves de arrays potencialmente indefinidas sem gerar warnings no PHP.',
    realWorldContext: 'Em requisições HTTP ($_GET ou configurações), parâmetros podem não ser enviados pelo usuário. O operador ?? define valores padrão elegantes sem precisar de isset().',
    description: 'Complete o resgate do parâmetro page e limit de uma query string simulada, garantindo valores padrão caso não tenham sido informados.',
    goal: 'Utilizar o operador ?? (Null Coalescing) para definir valores default seguros.',
    templateCode: `<?php

$queryParams = [
    'busca' => 'notebook gamer',
];

$paginaAtual = {{blank_0}};
$itensPorPagina = {{blank_1}};

echo "Página: {$paginaAtual}, Limite: {$itensPorPagina}";
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Acesso seguro à página',
        expectedAnswers: [
          "$queryParams['pagina'] ?? 1",
          '$queryParams["pagina"] ?? 1',
        ],
        hint: 'Use a sintaxe $array[\'chave\'] ?? valor_padrao.',
      },
      {
        id: 'blank_1',
        label: 'Acesso seguro ao limite',
        expectedAnswers: [
          "$queryParams['limite'] ?? 20",
          '$queryParams["limite"] ?? 20',
        ],
        hint: 'Use o operador ?? com o valor default 20.',
      },
    ],
    solutionCode: `<?php

$queryParams = [
    'busca' => 'notebook gamer',
];

$paginaAtual = $queryParams['pagina'] ?? 1;
$itensPorPagina = $queryParams['limite'] ?? 20;

echo "Página: {$paginaAtual}, Limite: {$itensPorPagina}";`,
    hints: [
      'Dica 1: O operador ?? foi introduzido no PHP 7 e verifica se a chave existe e não é null.',
    ],
    testCases: [
      {
        description: 'Parâmetro ausente deve assumir o fallback default',
        expectedOutput: 'Página: 1, Limite: 20',
      },
    ],
    explanation: 'O operador ?? simplificou o código e eliminou os erros do tipo Undefined array key.',
  },

  // 5
  {
    id: 'php-basico-05',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Manipulação de Strings',
    title: 'Normalização e Formatação de Nomes',
    summary: 'Remova espaços sobressalentes e normalize a capitalização de nomes de clientes.',
    realWorldContext: 'Usuários frequentemente digitam nomes com espaços antes e depois. É padrão normalizar esses dados antes de gravar no banco.',
    description: 'Complete a função que limpa espaços nas bordas com trim e transforma a primeira letra de cada palavra em maiúscula com ucwords.',
    goal: 'Utilizar as funções nativas de string do PHP para higienizar e formatar nomes.',
    templateCode: `<?php

function normalizarNome(string $nomeBruto): string {
    $limpo = {{blank_0}}($nomeBruto);
    $minusculo = mb_strtolower($limpo, 'UTF-8');
    return {{blank_1}}($minusculo);
}

echo normalizarNome("   carlos alberto da silva   ");
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de limpeza de espaços',
        expectedAnswers: ['trim'],
        hint: 'Função do PHP que apara espaços em branco nas extremidades.',
      },
      {
        id: 'blank_1',
        label: 'Função para capitalizar palavras',
        expectedAnswers: ['ucwords', 'mb_convert_case'],
        hint: 'A função clássica para capitalizar cada palavra é ucwords.',
      },
    ],
    solutionCode: `<?php

function normalizarNome(string $nomeBruto): string {
    $limpo = trim($nomeBruto);
    $minusculo = mb_strtolower($limpo, 'UTF-8');
    return ucwords($minusculo);
}

echo normalizarNome("   carlos alberto da silva   ");`,
    hints: [
      'Dica 1: A função trim() remove espaços das pontas.',
      'Dica 2: ucwords() coloca a primeira letra de cada palavra em maiúscula.',
    ],
    testCases: [
      {
        description: 'Remove espaços externos e capitaliza palavras',
        expectedOutput: 'Carlos Alberto Da Silva',
      },
    ],
    explanation: 'No PHP moderno, sempre prefira funções multibyte (mb_) para lidar adequadamente com caracteres acentuados da língua portuguesa.',
  },

  // 6
  {
    id: 'php-basico-06',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Arrays & Coleções',
    title: 'Validação Estrita de Papéis com in_array',
    summary: 'Valide se a permissão informada está presente em uma lista de papéis válidos.',
    realWorldContext: 'Antes de autorizar uma requisição, sistemas verificam se o perfil do usuário (admin, gestor, cliente) está contido nos papéis permitidos.',
    description: 'Complete a função que verifica de forma estrita se o papel solicitado existe no array de papéis permitidos.',
    goal: 'Utilizar a função in_array com o terceiro argumento strict ($strict = true).',
    templateCode: `<?php

function validarPapel(string $papel): bool {
    $papeisPermitidos = ['admin', 'gerente', 'operador'];
    return {{blank_0}}($papel, $papeisPermitidos, {{blank_1}});
}

var_dump(validarPapel('admin'));
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de busca em array',
        expectedAnswers: ['in_array'],
        hint: 'Função nativa do PHP para verificar se um elemento existe dentro de um array.',
      },
      {
        id: 'blank_1',
        label: 'Checagem estrita (strict mode)',
        expectedAnswers: ['true'],
        hint: 'Passar true no terceiro parâmetro garante que a comparação seja feita com ===.',
      },
    ],
    solutionCode: `<?php

function validarPapel(string $papel): bool {
    $papeisPermitidos = ['admin', 'gerente', 'operador'];
    return in_array($papel, $papeisPermitidos, true);
}`,
    hints: [
      'Dica 1: in_array(mixed $needle, array $haystack, bool $strict = false).',
      'Dica 2: Sempre passe true no 3º parâmetro para evitar vulnerabilidades de type juggling.',
    ],
    testCases: [
      {
        description: 'validarPapel("admin") retorna true',
        expectedOutput: 'true',
      },
    ],
    explanation: 'A comparação padrão do in_array é não-estrita (==). Passar true é essencial para evitar bugs de segurança.',
  },

  // 7
  {
    id: 'php-basico-07',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Strings & Formatação',
    title: 'Formatação de Mensagens de Log com Interpolação',
    summary: 'Monte logs com data, nível de severidade e mensagem utilizando concatenação e interpolação de strings.',
    realWorldContext: 'Sistemas de backend registram milhares de linhas de log por segundo com data, severidade e identificador da transação.',
    description: 'Complete a função de log que recebe o nível (ex: INFO, ERROR) e a mensagem, retornando a linha formatada com o timestamp atual.',
    goal: 'Preencher a chamada da função date() e a interpolação com chaves {$var}.',
    templateCode: `<?php

function formatarLog(string $nivel, string $mensagem): string {
    $dataHora = {{blank_0}}('Y-m-d H:i:s');
    return "[{$dataHora}] [{{blank_1}}]: {$mensagem}" . PHP_EOL;
}

echo formatarLog("INFO", "Usuário autenticado com sucesso.");
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de data do PHP',
        expectedAnswers: ['date'],
        hint: 'Função clássica do PHP para formatar datas e horas.',
      },
      {
        id: 'blank_1',
        label: 'Variável de nível do log',
        expectedAnswers: ['$nivel'],
        hint: 'O parâmetro recebido na função que contém a severidade.',
      },
    ],
    solutionCode: `<?php

function formatarLog(string $nivel, string $mensagem): string {
    $dataHora = date('Y-m-d H:i:s');
    return "[{$dataHora}] [{$nivel}]: {$mensagem}" . PHP_EOL;
}

echo formatarLog("INFO", "Usuário autenticado com sucesso.");`,
    hints: [
      'Dica 1: A função nativa de formatação de data é date().',
      'Dica 2: Dentro de strings com aspas duplas, variáveis podem ser interpoladas como {$variavel}.',
    ],
    testCases: [
      {
        description: 'Gera linha de log estruturada',
        expectedOutput: '[...] [INFO]: Usuário autenticado com sucesso.',
      },
    ],
    explanation: 'Interpolação de variáveis em strings com aspas duplas melhora a legibilidade do código em relação a concatenações excessivas com operador ponto (.).',
  },

  // 8
  {
    id: 'php-basico-08',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Tipos & Comparações',
    title: 'Comparador Estrito de Tokens de Segurança',
    summary: 'Evite armadilhas de coerção automática de tipos (type juggling) comparando strings de forma idêntica.',
    realWorldContext: 'Comparações fracas (==) em autenticação permitiram ataques históricos em PHP onde strings iniciadas em "0e..." eram avaliadas como zero.',
    description: 'Complete a função que compara dois tokens de segurança garantindo que tanto o tipo quanto o valor sejam rigorosamente idênticos.',
    goal: 'Utilizar o operador de identidade estrita (===) ou a função hash_equals.',
    templateCode: `<?php

function verificarToken(string $tokenInformado, string $tokenEsperado): bool {
    // Retorna true somente se forem idênticos em tipo e valor
    return {{blank_0}} {{blank_1}} {{blank_2}};
}

var_dump(verificarToken("auth_sec_123", "auth_sec_123"));
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Primeira variável',
        expectedAnswers: ['$tokenInformado', '$tokenEsperado'],
        hint: 'A variável passada como argumento.',
      },
      {
        id: 'blank_1',
        label: 'Operador de comparação estrita',
        expectedAnswers: ['==='],
        hint: 'Operador de igualdade estrita de 3 caracteres.',
      },
      {
        id: 'blank_2',
        label: 'Segunda variável',
        expectedAnswers: ['$tokenEsperado', '$tokenInformado'],
        hint: 'A outra variável a ser comparada.',
      },
    ],
    solutionCode: `<?php

function verificarToken(string $tokenInformado, string $tokenEsperado): bool {
    return $tokenInformado === $tokenEsperado;
}`,
    hints: [
      'Dica 1: Sempre utilize === em vez de == para evitar conversões silenciosas.',
    ],
    testCases: [
      {
        description: 'Tokens iguais retornam true',
        expectedOutput: 'true',
      },
    ],
    explanation: 'O operador === compara tipo e valor sem fazer coerção implícita, prevenindo vulnerabilidades de type juggling.',
  },

  // 9
  {
    id: 'php-basico-09',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Arrays Associativos',
    title: 'Verificação de Chaves Obrigatórias com array_key_exists',
    summary: 'Valide a presença de chaves em um payload associativo antes de processar os dados.',
    realWorldContext: 'Ao receber dados decodificados de um webhook ou JSON, precisamos verificar se as chaves existem mesmo que o valor armazenado seja null.',
    description: 'Complete a validação que checa se a chave "webhook_url" existe no array de configurações usando array_key_exists.',
    goal: 'Preencher a função array_key_exists com a chave e o array.',
    templateCode: `<?php

$config = [
    'ambiente' => 'producao',
    'webhook_url' => 'https://api.empresa.com/hooks',
];

if ({{blank_0}}('webhook_url', {{blank_1}})) {
    echo "Webhook configurado: " . $config['webhook_url'];
} else {
    echo "Configuração ausente.";
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de checagem de chave',
        expectedAnswers: ['array_key_exists'],
        hint: 'Função nativa que verifica se a chave existe no array.',
      },
      {
        id: 'blank_1',
        label: 'Array pesquisado',
        expectedAnswers: ['$config'],
        hint: 'A variável que armazena as configurações.',
      },
    ],
    solutionCode: `<?php

$config = [
    'ambiente' => 'producao',
    'webhook_url' => 'https://api.empresa.com/hooks',
];

if (array_key_exists('webhook_url', $config)) {
    echo "Webhook configurado: " . $config['webhook_url'];
}`,
    hints: [
      'Dica 1: array_key_exists($chave, $array) retorna true mesmo se o valor for null.',
    ],
    testCases: [
      {
        description: 'Identifica chave existente com sucesso',
        expectedOutput: 'Webhook configurado: https://api.empresa.com/hooks',
      },
    ],
    explanation: 'Diferente de isset(), array_key_exists() retorna true se a chave existir no array, mesmo que seu valor seja explicitamente null.',
  },

  // 10
  {
    id: 'php-basico-10',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Laços de Repetição',
    title: 'Processamento de Fila de Tarefas com While',
    summary: 'Consuma itens de uma pilha/fila até que ela esteja completamente esgotada.',
    realWorldContext: 'Trabalhadores de fila (Queue Workers) em segundo plano consom tarefas em lote executando enquanto houver mensagens pendentes.',
    description: 'Complete o laço while que executa enquanto o array de mensagens não estiver vazio com !empty(), retirando cada item com array_shift().',
    goal: 'Preencher a condição do while e a função array_shift().',
    templateCode: `<?php

$filaMensagens = ['Email #1', 'Email #2', 'Email #3'];
$processadas = 0;

while (!{{blank_0}}($filaMensagens)) {
    $tarefa = {{blank_1}}($filaMensagens);
    $processadas++;
}

echo "Total processadas: " . $processadas;
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de verificação de vazio',
        expectedAnswers: ['empty'],
        hint: 'Função que verifica se uma variável ou array está vazia.',
      },
      {
        id: 'blank_1',
        label: 'Função que extrai o primeiro elemento',
        expectedAnswers: ['array_shift'],
        hint: 'Função do PHP que retira e retorna o primeiro elemento do array (FIFO).',
      },
    ],
    solutionCode: `<?php

$filaMensagens = ['Email #1', 'Email #2', 'Email #3'];
$processadas = 0;

while (!empty($filaMensagens)) {
    $tarefa = array_shift($filaMensagens);
    $processadas++;
}

echo "Total processadas: " . $processadas;`,
    hints: [
      'Dica 1: !empty($array) avalia se há pelo menos um item restante.',
      'Dica 2: array_shift() remove o primeiro elemento de um array e o devolve.',
    ],
    testCases: [
      {
        description: 'Consome todas as 3 mensagens',
        expectedOutput: 'Total processadas: 3',
      },
    ],
    explanation: 'array_shift() implementa a disciplina FIFO (First In, First Out), ideal para simular filas de processamento assíncrono.',
  },

  // 11 - Prever a Saída
  {
    id: 'php-basico-prever-01',
    language: 'php',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Strings & Concatenação',
    title: 'Previsão de Saída: Adição vs Concatenação em PHP',
    summary: 'Analise como o PHP avalia o operador de soma (+) em contraste com o operador de concatenação (.) ao misturar números e strings.',
    realWorldContext: 'Em PHP, a distinção entre somar matematicamente e concatenar textos é uma das pegadinhas mais comuns em relatórios financeiros e mensagens ao usuário.',
    description: 'Observe o trecho de código abaixo. Sem executá-lo, determine exatamente qual será a saída impressa no terminal.',
    goal: 'Prever a saída exata resultante das instruções echo.',
    templateCode: `<?php

$pontos = 15;
$bonus = "5";

echo $pontos + $bonus;
echo " | ";
echo $pontos . $bonus;
`,
    codeToPredict: `<?php

$pontos = 15;
$bonus = "5";

echo $pontos + $bonus;
echo " | ";
echo $pontos . $bonus;`,
    expectedOutputPrediction: '20 | 155',
    acceptableOutputPredictions: ['20 | 155', '20|155'],
    solutionCode: `<?php

$pontos = 15;
$bonus = "5";

echo $pontos + $bonus; // 15 + 5 = 20 (coerção numérica na adição)
echo " | ";
echo $pontos . $bonus; // "15" . "5" = "155" (concatenação de strings com ponto)`,
    hints: [
      'Dica 1: O operador "+" em PHP sempre tenta converter os operandos em números e realizar adição matemática.',
      'Dica 2: O operador "." em PHP é estritamente de concatenação de strings.',
      'Dica 3: O separador " | " é impresso exatamente no meio das duas saídas.',
    ],
    testCases: [
      {
        description: 'Imprime a soma numérica seguida da concatenação textual separada por pipe',
        expectedOutput: '20 | 155',
      },
    ],
    explanation: 'Em PHP, o operador "+" força conversão numérica, resultando em 15 + 5 = 20. Já o operador de concatenação "." converte ambos em strings e os junta, resultando em "155". Portanto, a saída final é "20 | 155".',
  },

  // 12 - Corrigir Erros
  {
    id: 'php-basico-debug-01',
    language: 'php',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Funções & Operadores',
    title: 'Depuração: Precedência de Operadores no Cálculo de Média',
    summary: 'Identifique e corrija um erro clássico de precedência de operadores matemáticos que corrompe o cálculo da média de notas.',
    realWorldContext: 'Erros de precedência aritmética passam despercebidos pelo interpretador (não geram erro de sintaxe), mas geram cálculos de faturamento ou médias completamente incorretos em produção.',
    description: 'Um desenvolvedor júnior escreveu a função `calcularMediaNotas`. O teste com as notas 10, 8 e 6 deveria resultar em 8.0, mas está retornando 20.0! Identifique o erro de precedência de operadores e corrija a linha de cálculo.',
    goal: 'Ajustar o cálculo da média utilizando parênteses para garantir a ordem correta de soma antes da divisão.',
    bugDescription: 'A função retorna 20.0 em vez de 8.0 para as notas (10, 8, 6) porque a divisão é executada antes da soma.',
    buggyLineNumbers: [4],
    initialBuggyCode: `<?php

function calcularMediaNotas(float $n1, float $n2, float $n3): float {
    // BUG: A divisão tem maior precedência que a adição!
    $media = $n1 + $n2 + $n3 / 3;
    return round($media, 1);
}

// Teste esperado: (10 + 8 + 6) / 3 = 24 / 3 = 8.0
echo calcularMediaNotas(10.0, 8.0, 6.0);
`,
    templateCode: `<?php

function calcularMediaNotas(float $n1, float $n2, float $n3): float {
    // Corrija a linha abaixo:
    $media = $n1 + $n2 + $n3 / 3;
    return round($media, 1);
}

echo calcularMediaNotas(10.0, 8.0, 6.0);
`,
    solutionCode: `<?php

function calcularMediaNotas(float $n1, float $n2, float $n3): float {
    $media = ($n1 + $n2 + $n3) / 3;
    return round($media, 1);
}

echo calcularMediaNotas(10.0, 8.0, 6.0);`,
    hints: [
      'Dica 1: Na matemática e no PHP, a divisão "/" é avaliada antes da adição "+".',
      'Dica 2: Sem parênteses, apenas $n3 é dividido por 3: 10 + 8 + (6 / 3) = 18 + 2 = 20.',
      'Dica 3: Envolva a soma ($n1 + $n2 + $n3) entre parênteses para forçar a soma antes da divisão.',
    ],
    testCases: [
      {
        description: 'calcularMediaNotas(10.0, 8.0, 6.0) deve resultar em 8.0',
        expectedOutput: '8.0',
      },
    ],
    validationRules: [
      {
        id: 'rule-parentheses',
        description: 'Uso de parênteses para agrupar a soma ($n1 + $n2 + $n3)',
        type: 'regex',
        target: '\\(\\s*\\$n1\\s*\\+\\s*\\$n2\\s*\\+\\s*\\$n3\\s*\\)',
      },
      {
        id: 'rule-division',
        description: 'Divisão por 3 após o agrupamento da soma',
        type: 'contains',
        target: '/ 3',
      },
    ],
    explanation: 'Em PHP, a divisão possui precedência superior à adição. Envolver ($n1 + $n2 + $n3) em parênteses garante que a soma de todos os termos seja calculada antes da divisão pelo número de notas.',
  },

  // 13 - Código Livre
  {
    id: 'php-basico-codigo-01',
    language: 'php',
    difficulty: 'basico',
    type: 'codigo_livre',
    topic: 'Condicionais & Lógica',
    title: 'Cálculo de Frete Baseado no Peso da Encomenda',
    summary: 'Escreva do zero uma função que calcula a taxa de frete de acordo com faixas de peso pré-estabelecidas.',
    realWorldContext: 'Sistemas de logística e e-commerce utilizam tabelas progressivas de peso para precificar envios.',
    description: 'Escreva a função `calcularTaxaFrete(float $peso): float` seguindo a tabela de frete:\n- Até 1.0 kg (inclusive): R$ 12.00\n- Acima de 1.0 kg até 5.0 kg (inclusive): R$ 25.00\n- Acima de 5.0 kg: R$ 40.00',
    goal: 'Declarar a função calcularTaxaFrete com a tipagem correta e as regras condicionais if / elseif / else.',
    templateCode: `<?php

function calcularTaxaFrete(float $peso): float {
    // Escreva sua lógica aqui
}

// Testes:
echo "Frete 0.8kg: " . calcularTaxaFrete(0.8) . "\n";
echo "Frete 3.5kg: " . calcularTaxaFrete(3.5) . "\n";
echo "Frete 7.0kg: " . calcularTaxaFrete(7.0) . "\n";
`,
    solutionCode: `<?php

function calcularTaxaFrete(float $peso): float {
    if ($peso <= 1.0) {
        return 12.00;
    } elseif ($peso <= 5.0) {
        return 25.00;
    } else {
        return 40.00;
    }
}

echo "Frete 0.8kg: " . calcularTaxaFrete(0.8) . "\n";
echo "Frete 3.5kg: " . calcularTaxaFrete(3.5) . "\n";
echo "Frete 7.0kg: " . calcularTaxaFrete(7.0) . "\n";`,
    hints: [
      'Dica 1: Utilize if ($peso <= 1.0) para a primeira faixa de preço.',
      'Dica 2: Em seguida use elseif ($peso <= 5.0) para a segunda faixa.',
      'Dica 3: O bloco else cobre qualquer peso superior a 5.0 kg retornando 40.00.',
    ],
    testCases: [
      {
        description: 'Peso 0.8kg deve custar 12.00',
        expectedOutput: '12.00',
      },
      {
        description: 'Peso 3.5kg deve custar 25.00',
        expectedOutput: '25.00',
      },
      {
        description: 'Peso 7.0kg deve custar 40.00',
        expectedOutput: '40.00',
      },
    ],
    validationRules: [
      {
        id: 'rule-fn',
        description: 'Declaração da função calcularTaxaFrete',
        type: 'contains',
        target: 'function calcularTaxaFrete',
      },
      {
        id: 'rule-12',
        description: 'Retorno de 12.00 para <= 1kg',
        type: 'contains',
        target: '12',
      },
      {
        id: 'rule-25',
        description: 'Retorno de 25.00 para <= 5kg',
        type: 'contains',
        target: '25',
      },
      {
        id: 'rule-40',
        description: 'Retorno de 40.00 para > 5kg',
        type: 'contains',
        target: '40',
      },
    ],
    explanation: 'A estrutura if / elseif / else em escada garante que as faixas de peso sejam avaliadas em ordem crescente sem redundância de condições.',
  },

  // 14 - Desafio Prático
  {
    id: 'php-basico-desafio-01',
    language: 'php',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Validação & Regras de Negócio',
    title: 'Desafio Prático: Validador de Senha Forte no Cadastro',
    summary: 'Implemente uma função de validação de senha corporativa aplicando 4 regras de segurança essenciais.',
    realWorldContext: 'Garantir senhas com entropia mínima no momento do cadastro é a primeira linha de defesa contra ataques de força bruta e dicionário.',
    description: 'Você recebeu a tarefa de criar a função `validarSenhaForte(string $senha): bool` que deve validar:\n1. Mínimo de 8 caracteres.\n2. Pelo menos uma letra maiúscula (preg_match("/[A-Z]/", ...)).\n3. Pelo menos uma letra minúscula (preg_match("/[a-z]/", ...)).\n4. Pelo menos um dígito numérico (preg_match("/[0-9]/", ...)).\nRetorne true se todas as regras forem satisfeitas ou false se alguma falhar.',
    goal: 'Combinar strlen() e preg_match() para validar todas as 4 regras de segurança.',
    practicalRequirements: [
      'Comprimento mínimo de 8 caracteres (strlen($senha) >= 8)',
      'Conter ao menos uma letra maiúscula (A-Z)',
      'Conter ao menos uma letra minúscula (a-z)',
      'Conter ao menos um dígito numérico (0-9)',
      'Retornar valor booleano estrito (true ou false)',
    ],
    templateCode: `<?php

function validarSenhaForte(string $senha): bool {
    // 1. Verificar tamanho mínimo de 8 caracteres
    
    // 2. Verificar presença de maiúscula, minúscula e número
    
    // 3. Retornar true ou false
}

// Testes:
var_dump(validarSenhaForte("Dev@2026")); // deve ser true
var_dump(validarSenhaForte("fraca123")); // deve ser false (sem maiúscula)
`,
    solutionCode: `<?php

function validarSenhaForte(string $senha): bool {
    if (strlen($senha) < 8) {
        return false;
    }
    if (!preg_match('/[A-Z]/', $senha)) {
        return false;
    }
    if (!preg_match('/[a-z]/', $senha)) {
        return false;
    }
    if (!preg_match('/[0-9]/', $senha)) {
        return false;
    }
    return true;
}

var_dump(validarSenhaForte("Dev@2026")); // true
var_dump(validarSenhaForte("fraca123")); // false`,
    hints: [
      'Dica 1: Use strlen($senha) < 8 como primeira cláusula de guarda (early return).',
      'Dica 2: A regex "/[A-Z]/" testa a presença de pelo menos uma letra maiúscula.',
      'Dica 3: Retorne false assim que qualquer critério falhar para economizar processamento.',
    ],
    testCases: [
      {
        description: 'validarSenhaForte("Dev@2026") é válida',
        expectedOutput: 'true',
      },
      {
        description: 'validarSenhaForte("fraca123") é inválida (sem maiúscula)',
        expectedOutput: 'false',
      },
    ],
    validationRules: [
      {
        id: 'rule-strlen',
        description: 'Verificação de comprimento com strlen()',
        type: 'contains',
        target: 'strlen',
      },
      {
        id: 'rule-upper',
        description: 'Expressão regular para maiúsculas [A-Z]',
        type: 'regex',
        target: '\\[A-Z\\]',
      },
      {
        id: 'rule-lower',
        description: 'Expressão regular para minúsculas [a-z]',
        type: 'regex',
        target: '\\[a-z\\]',
      },
      {
        id: 'rule-digit',
        description: 'Expressão regular para dígitos [0-9]',
        type: 'regex',
        target: '(\\[0-9\\]|\\\\d)',
      },
    ],
    explanation: 'O padrão de "Cláusulas de Guarda" (Guard Clauses) testa condições de falha primeiro e retorna imediatamente, deixando o fluxo principal limpo e legível.',
  },
];


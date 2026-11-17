import { Exercise } from '../types/exercise';

export const phpExercises: Exercise[] = [
  // BÁSICO 1: Função e Operadores Matemáticos
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
        placeholder: '$percentual / 100',
        expectedAnswers: ['$percentual / 100', '$percentual/100', '($percentual / 100)'],
        hint: 'Para transformar uma porcentagem em fração decimal, divida o percentual por 100.',
      },
      {
        id: 'blank_1',
        label: 'Retorno do valor com desconto',
        placeholder: 'return $valor - $desconto',
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
echo "Preço final: R$ " . number_format($precoFinal, 2, ',', '.');
// Saída: Preço final: R$ 170,00`,
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
    explanation: 'Em PHP 7 e 8, especificar tipos nos parâmetros e no retorno (`float`) garante integridade matemática e evita bugs silenciosos de conversão de tipos.',
    alternativeSolutions: [
      {
        title: 'Fórmula Direta em uma única linha',
        code: `function calcularDesconto(float $valor, float $percentual): float {
    return $valor * (1 - ($percentual / 100));
}`,
        explanation: 'Multiplicar diretamente por `(1 - taxa)` evita a criação da variável intermediária `$desconto`, economizando linhas de código mantendo a clareza.',
        isRecommended: true,
      },
    ],
  },

  // BÁSICO 2: Condicionais e Operador Ternário
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
        placeholder: '$idade >= 18 && $score >= 700',
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
        placeholder: 'else',
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

echo verificarAprovacao(25, 750); // Saída: APROVADO`,
    hints: [
      'Dica 1: O operador "maior ou igual" em PHP é >=.',
      'Dica 2: Para exigir que AMBAS as condições sejam verdadeiras simultaneamente, use o operador lógico &&.',
      'Dica 3: O bloco de fallback quando a condição if for falsa é simplesmente o "else".',
    ],
    testCases: [
      {
        description: 'Idade 25 e Score 750 -> APROVADO',
        input: 'idade: 25, score: 750',
        expectedOutput: 'APROVADO',
      },
      {
        description: 'Idade 17 e Score 800 -> REPROVADO (menor de idade)',
        input: 'idade: 17, score: 800',
        expectedOutput: 'REPROVADO',
      },
      {
        description: 'Idade 30 e Score 650 -> REPROVADO (score insuficiente)',
        input: 'idade: 30, score: 650',
        expectedOutput: 'REPROVADO',
      },
    ],
    explanation: 'O operador `&&` possui maior precedência que o operador `and` em PHP. No dia a dia profissional, prefira sempre `&&` para evitar surpresas na ordem de avaliação.',
    alternativeSolutions: [
      {
        title: 'Operador Ternário',
        code: `function verificarAprovacao(int $idade, int $score): string {
    return ($idade >= 18 && $score >= 700) ? "APROVADO" : "REPROVADO";
}`,
        explanation: 'O operador ternário condicional (? :) torna a função muito concisa e legível quando a lógica se resume a retornar uma dentre duas strings.',
        isRecommended: true,
      },
    ],
  },

  // BÁSICO 3: Laços de Repetição e Acumulador
  {
    id: 'php-basico-03',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Laços de Repetição',
    title: 'Totalizador de Itens do Carrinho com Foreach',
    summary: 'Percorra um array associativo de produtos e acumule o valor total da compra.',
    realWorldContext: 'Toda plataforma de e-commerce precisa iterar sobre os itens do carrinho para calcular subtotais multiplicando quantidade e preço unitário.',
    description: 'Complete o laço `foreach` para percorrer os itens e incrementar a variável acumuladora `$total` multiplicando o preço pela quantidade de cada produto.',
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
        placeholder: '$itens as $item',
        expectedAnswers: ['$itens as $item', '$itens as $p'],
        hint: 'Use a sintaxe: $array as $elemento_individual.',
      },
      {
        id: 'blank_1',
        label: 'Cálculo do subtotal do item',
        placeholder: "$item['preco'] * $item['qtd']",
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

echo "Total a pagar: R$ " . $total; // Saída: Total a pagar: R$ 740`,
    hints: [
      'Dica 1: O foreach em PHP itera um array atribuindo cada valor a uma variável temporária: foreach ($itens as $item).',
      'Dica 2: Para acessar chaves de arrays associativos, use colchetes e aspas: $item[\'preco\'].',
      'Dica 3: Multiplique o preço pela quantidade com o operador de multiplicação (*).',
    ],
    testCases: [
      {
        description: 'Soma total dos 3 itens: (250*2) + (120*1) + (60*2) = 740',
        expectedOutput: '740.0',
      },
    ],
    explanation: 'O loop `foreach` é a forma mais segura e idiomática de iterar arrays em PHP, pois não exige controle manual de índices numéricos e lida perfeitamente com arrays associativos.',
    alternativeSolutions: [
      {
        title: 'Usando array_reduce',
        code: `$total = array_reduce($itens, function(float $acc, array $item): float {
    return $acc + ($item['preco'] * $item['qtd']);
}, 0.0);`,
        explanation: '`array_reduce` é a abordagem funcional moderna para reduzir coleções a um único valor escalar acumulado.',
      },
    ],
  },

  // BÁSICO 4: Null Coalescing Operator (??)
  {
    id: 'php-basico-04',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Operadores & Variáveis',
    title: 'Tratamento Seguro de Parâmetros com Null Coalescing (??)',
    summary: 'Acesse chaves de arrays ou variáveis potencialmente indefinidas sem gerar warnings de Notice/Warning no PHP.',
    realWorldContext: 'Em requisições HTTP ($_GET ou configurações), parâmetros podem não ser enviados pelo usuário. O operador ?? define valores padrão elegantes sem precisar de isset().',
    description: 'Complete o resgate do parâmetro `page` e `limit` de uma query string simulada, garantindo valores padrão caso não tenham sido informados.',
    goal: 'Utilizar o operador ?? (Null Coalescing) para definir valores default seguros.',
    templateCode: `<?php

$queryParams = [
    'busca' => 'notebook gamer',
    // 'pagina' não foi informada
];

// Se 'pagina' existir no array usa seu valor, senão usa 1 como padrão
$paginaAtual = {{blank_0}};

// Se 'limite' não existir, assume 20
$itensPorPagina = {{blank_1}};

echo "Página: {$paginaAtual}, Limite: {$itensPorPagina}";
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Acesso seguro à página',
        placeholder: "$queryParams['pagina'] ?? 1",
        expectedAnswers: [
          "$queryParams['pagina'] ?? 1",
          '$queryParams["pagina"] ?? 1',
          "isset($queryParams['pagina']) ? $queryParams['pagina'] : 1",
        ],
        hint: 'Use a sintaxe $array[\'chave\'] ?? valor_padrao.',
      },
      {
        id: 'blank_1',
        label: 'Acesso seguro ao limite',
        placeholder: "$queryParams['limite'] ?? 20",
        expectedAnswers: [
          "$queryParams['limite'] ?? 20",
          '$queryParams["limite"] ?? 20',
          "isset($queryParams['limite']) ? $queryParams['limite'] : 20",
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
      'Dica 1: O operador ?? foi introduzido no PHP 7 e verifica se a variável/chave existe e não é null.',
      'Dica 2: A sintaxe é: $variavel ?? $fallback.',
    ],
    testCases: [
      {
        description: 'Parâmetro ausente deve assumir o fallback default',
        expectedOutput: 'Página: 1, Limite: 20',
      },
    ],
    explanation: 'Antes do PHP 7, era obrigatório escrever `isset($array[\'chave\']) ? $array[\'chave\'] : default`. O operador `??` simplificou drasticamente o código e eliminou os erros do tipo `Undefined array key`.',
  },

  // BÁSICO 5: Manipulação de Strings
  {
    id: 'php-basico-05',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Manipulação de Strings',
    title: 'Normalização e Formatação de Nomes',
    summary: 'Remova espaços sobressalentes e normalize a capitalização de nomes de clientes.',
    realWorldContext: 'Usuários frequentemente digitam nomes com espaços antes e depois ("  joão da silva  ") ou com letras em caixa alta indesejada. É padrão normalizar esses dados antes de gravar no banco.',
    description: 'Complete a função que limpa espaços nas bordas com `trim` e transforma a primeira letra de cada palavra em maiúscula com `mb_convert_case` ou `ucwords`.',
    goal: 'Utilizar as funções nativas de string do PHP para higienizar e formatar nomes.',
    templateCode: `<?php

function normalizarNome(string $nomeBruto): string {
    // 1. Remove espaços no início e final
    $limpo = {{blank_0}}($nomeBruto);
    
    // 2. Converte tudo para minúsculas primeiro
    $minusculo = mb_strtolower($limpo, 'UTF-8');
    
    // 3. Converte a primeira letra de cada palavra para maiúscula
    return {{blank_1}}($minusculo);
}

echo normalizarNome("   carlos alberto da silva   ");
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de limpeza de espaços',
        placeholder: 'trim',
        expectedAnswers: ['trim'],
        hint: 'Função do PHP que apara espaços em branco nas extremidades.',
      },
      {
        id: 'blank_1',
        label: 'Função para capitalizar palavras',
        placeholder: 'mb_convert_case',
        expectedAnswers: ['ucwords', 'mb_convert_case'],
        hint: 'A função clássica para capitalizar cada palavra é "ucwords" ou "mb_convert_case".',
      },
    ],
    solutionCode: `<?php

function normalizarNome(string $nomeBruto): string {
    $limpo = trim($nomeBruto);
    $minusculo = mb_strtolower($limpo, 'UTF-8');
    return ucwords($minusculo);
}

echo normalizarNome("   carlos alberto da silva   ");
// Saída: Carlos Alberto Da Silva`,
    hints: [
      'Dica 1: A função trim() remove espaços, tabs e quebras de linha das pontas de uma string.',
      'Dica 2: ucwords() coloca a primeira letra de cada palavra em maiúscula.',
    ],
    testCases: [
      {
        description: 'Remove espaços externos e capitaliza palavras',
        input: '"   carlos alberto da silva   "',
        expectedOutput: 'Carlos Alberto Da Silva',
      },
    ],
    explanation: 'No desenvolvimento PHP moderno com acentuação e caracteres em português, utilize sempre as funções da extensão `mbstring` (como `mb_strtolower`) para não quebrar caracteres acentuados como "á", "ç" e "õ".',
  },

  // BÁSICO 6: Arrays e Verificação in_array
  {
    id: 'php-basico-06',
    language: 'php',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Arrays & Coleções',
    title: 'Validação de Papéis de Usuário (RBAC)',
    summary: 'Valide se a permissão informada está presente em uma lista de papéis válidos.',
    realWorldContext: 'Antes de autorizar uma requisição, sistemas verificam se o perfil do usuário (admin, gestor, cliente) está contido nos papéis permitidos.',
    description: 'Complete a função que verifica de forma estrita se o papel solicitado existe no array de papéis permitidos.',
    goal: 'Utilizar a função in_array com o terceiro argumento strict ($strict = true).',
    templateCode: `<?php

function validarPapel(string $papel): bool {
    $papeisPermitidos = ['admin', 'gerente', 'operador'];
    
    // Verifica de forma estrita (tipo e valor)
    return {{blank_0}}($papel, $papeisPermitidos, {{blank_1}});
}

var_dump(validarPapel('admin')); // deve retornar true
var_dump(validarPapel('hacker')); // deve retornar false
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de busca em array',
        placeholder: 'in_array',
        expectedAnswers: ['in_array'],
        hint: 'A função nativa do PHP para verificar se um elemento existe dentro de um array.',
      },
      {
        id: 'blank_1',
        label: 'Checagem estrita (strict mode)',
        placeholder: 'true',
        expectedAnswers: ['true'],
        hint: 'Passar true no terceiro parâmetro garante que a comparação seja feita com ===.',
      },
    ],
    solutionCode: `<?php

function validarPapel(string $papel): bool {
    $papeisPermitidos = ['admin', 'gerente', 'operador'];
    return in_array($papel, $papeisPermitidos, true);
}

var_dump(validarPapel('admin')); // bool(true)
var_dump(validarPapel('hacker')); // bool(false)`,
    hints: [
      'Dica 1: A assinatura da função é: in_array(mixed $needle, array $haystack, bool $strict = false).',
      'Dica 2: Sempre passe true no 3º parâmetro para evitar vulnerabilidades de type juggling (ex: 0 igualando strings).',
    ],
    testCases: [
      {
        description: 'validarPapel("admin") retorna true',
        input: 'admin',
        expectedOutput: 'true',
      },
      {
        description: 'validarPapel("hacker") retorna false',
        input: 'hacker',
        expectedOutput: 'false',
      },
    ],
    explanation: 'Em PHP, a função `in_array` por padrão faz comparação não-estrita (`==`). Isso é uma armadilha comum que pode causar falhas graves de segurança. Sempre passe `true` como 3º argumento para habilitar o modo estrito (`===`).',
  },

  // INTERMEDIÁRIO 1: Validação de Formulário com filter_var
  {
    id: 'php-inter-01',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Validação & Formulários',
    title: 'Sanitização e Validação de E-mail de Cadastro',
    summary: 'Sanitize e valide um endereço de e-mail enviado por formulário usando as constantes e filtros do PHP.',
    realWorldContext: 'Nunca confie nos dados vindos de $_POST ou formulários HTML. Validar e-mail no backend com filter_var é requisito obrigatório contra dados maliciosos e erros de digitação.',
    description: 'Complete a função que primeiro remove caracteres proibidos com `FILTER_SANITIZE_EMAIL` e em seguida valida a estrutura com `FILTER_VALIDATE_EMAIL`.',
    goal: 'Aplicar a função filter_var com as constantes de sanitização e validação nativas.',
    templateCode: `<?php

function validarEmailCadastro(string $emailBruto): ?string {
    // 1. Sanitiza removendo caracteres inválidos para e-mail
    $emailLimpo = filter_var($emailBruto, {{blank_0}});
    
    // 2. Valida se o formato RFC é válido
    if (filter_var($emailLimpo, {{blank_1}}) !== false) {
        return $emailLimpo;
    }
    
    return null; // E-mail inválido
}

$resultado = validarEmailCadastro("   usuario+promocao@empresa.com.br  ");
echo $resultado ? "E-mail válido: {$resultado}" : "E-mail inválido";
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Filtro de sanitização',
        placeholder: 'FILTER_SANITIZE_EMAIL',
        expectedAnswers: ['FILTER_SANITIZE_EMAIL'],
        hint: 'Constante do PHP para sanitizar endereços de e-mail.',
      },
      {
        id: 'blank_1',
        label: 'Filtro de validação',
        placeholder: 'FILTER_VALIDATE_EMAIL',
        expectedAnswers: ['FILTER_VALIDATE_EMAIL'],
        hint: 'Constante do PHP para validar formato de e-mail.',
      },
    ],
    solutionCode: `<?php

function validarEmailCadastro(string $emailBruto): ?string {
    $emailLimpo = filter_var($emailBruto, FILTER_SANITIZE_EMAIL);
    if (filter_var($emailLimpo, FILTER_VALIDATE_EMAIL) !== false) {
        return $emailLimpo;
    }
    return null;
}

$resultado = validarEmailCadastro("usuario@empresa.com.br");
echo $resultado;`,
    hints: [
      'Dica 1: O PHP possui constantes globais para filtros, todas iniciadas por FILTER_.',
      'Dica 2: Para sanitizar: FILTER_SANITIZE_EMAIL. Para validar: FILTER_VALIDATE_EMAIL.',
    ],
    testCases: [
      {
        description: 'Valida e-mail correto com sucesso',
        input: 'usuario@empresa.com.br',
        expectedOutput: 'usuario@empresa.com.br',
      },
      {
        description: 'Rejeita e-mail com formato inválido',
        input: 'email_sem_arroba.com',
        expectedOutput: 'null',
      },
    ],
    explanation: 'A função `filter_var` é a maneira oficial recomendada pelo PHP para validar e-mails, URLs e números inteiros, superando expressões regulares caseiras que frequentemente falham em casos especiais como subdomínios e tags (+promoção).',
  },

  // INTERMEDIÁRIO 2: Manipulação Funcional com array_filter e array_map
  {
    id: 'php-inter-02',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Manipulação de Arrays',
    title: 'Pipeline de Produtos Ativos com array_filter',
    summary: 'Filtre apenas os produtos ativos em estoque e extraia seus nomes com funções funcionais de alta ordem.',
    realWorldContext: 'Em listagens de API para frontends (como SPAs React/Vue), o backend filtra registros inativos ou esgotados e projeta apenas os campos relevantes.',
    description: 'Complete o pipeline que primeiro filtra os produtos com `ativo === true` e quantidade > 0 usando `array_filter`, e depois extrai apenas os nomes com `array_column` ou `array_map`.',
    goal: 'Compor array_filter e array_column para manipulação elegante de arrays associativos.',
    templateCode: `<?php

$catalogo = [
    ['id' => 1, 'nome' => 'Monitor 27', 'preco' => 1200, 'ativo' => true,  'estoque' => 5],
    ['id' => 2, 'nome' => 'Cabo HDMI',  'preco' => 35,   'ativo' => false, 'estoque' => 20],
    ['id' => 3, 'nome' => 'Headset Pro', 'preco' => 350,  'ativo' => true,  'estoque' => 0],
    ['id' => 4, 'nome' => 'Webcam HD',   'preco' => 210,  'ativo' => true,  'estoque' => 12],
];

// Filtra produtos ativos com estoque > 0
$disponiveis = {{blank_0}}($catalogo, function(array $item): bool {
    return $item['ativo'] === true && $item['estoque'] > 0;
});

// Extrai somente a coluna de nomes
$nomesDisponiveis = {{blank_1}}($disponiveis, 'nome');

print_r($nomesDisponiveis);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de filtragem funcional',
        placeholder: 'array_filter',
        expectedAnswers: ['array_filter'],
        hint: 'Função do PHP que filtra elementos através de uma função de callback booleana.',
      },
      {
        id: 'blank_1',
        label: 'Função de extração de coluna',
        placeholder: 'array_column',
        expectedAnswers: ['array_column'],
        hint: 'Função extremamente performática do PHP que retorna os valores de uma coluna específica de um array multi-dimensional.',
      },
    ],
    solutionCode: `<?php

$catalogo = [
    ['id' => 1, 'nome' => 'Monitor 27', 'preco' => 1200, 'ativo' => true,  'estoque' => 5],
    ['id' => 2, 'nome' => 'Cabo HDMI',  'preco' => 35,   'ativo' => false, 'estoque' => 20],
    ['id' => 3, 'nome' => 'Headset Pro', 'preco' => 350,  'ativo' => true,  'estoque' => 0],
    ['id' => 4, 'nome' => 'Webcam HD',   'preco' => 210,  'ativo' => true,  'estoque' => 12],
];

$disponiveis = array_filter($catalogo, function(array $item): bool {
    return $item['ativo'] === true && $item['estoque'] > 0;
});

$nomesDisponiveis = array_column($disponiveis, 'nome');
print_r($nomesDisponiveis); // ['Monitor 27', 'Webcam HD']`,
    hints: [
      'Dica 1: array_filter($array, $callback) preserva as chaves originais que retornarem true.',
      'Dica 2: array_column($array, $chave) extrai diretamente um array simples de valores correspondentes à chave.',
    ],
    testCases: [
      {
        description: 'Retorna apenas produtos com ativo=true e estoque>0 ("Monitor 27" e "Webcam HD")',
        expectedOutput: '["Monitor 27", "Webcam HD"]',
      },
    ],
    explanation: 'Combinar `array_filter` com `array_column` é muito mais expressivo e rápido do que escrever laços `foreach` aninhados com `if` e pushes manuais em arrays temporários.',
  },

  // INTERMEDIÁRIO 3: POO - Classe e Encapsulamento
  {
    id: 'php-inter-03',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Orientação a Objetos',
    title: 'Encapsulamento de Conta Bancária',
    summary: 'Construa uma classe com modificadores de acesso corretos e validação em operações de saque.',
    realWorldContext: 'Encapsulamento protege o estado interno de objetos financeiros, garantindo que o saldo nunca fique negativo por acesso externo indevido.',
    description: 'Complete a classe `ContaBancaria`. O atributo `$saldo` deve ser privado (`private`). No método `sacar`, verifique se o valor solicitado é positivo e não ultrapassa o saldo antes de debitar.',
    goal: 'Definir o modificador de acesso private e a condição de saque seguro.',
    templateCode: `<?php

class ContaBancaria {
    {{blank_0}} float $saldo;

    public function __construct(float $saldoInicial = 0.0) {
        $this->saldo = max(0.0, $saldoInicial);
    }

    public function sacar(float $valor): bool {
        if ({{blank_1}}) {
            $this->saldo -= $valor;
            return true;
        }
        return false;
    }

    public function getSaldo(): float {
        return $this->saldo;
    }
}

$conta = new ContaBancaria(500.0);
$sucesso = $conta->sacar(150.0);
echo "Saque efetuado: " . ($sucesso ? "SIM" : "NAO") . " | Saldo: " . $conta->getSaldo();
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Modificador de visibilidade restrito',
        placeholder: 'private',
        expectedAnswers: ['private'],
        hint: 'Use a palavra-chave que impede que o atributo seja lido ou alterado fora da classe.',
      },
      {
        id: 'blank_1',
        label: 'Validação de saldo suficiente',
        placeholder: '$valor > 0 && $valor <= $this->saldo',
        expectedAnswers: [
          '$valor > 0 && $valor <= $this->saldo',
          '$valor <= $this->saldo && $valor > 0',
          '$this->saldo >= $valor && $valor > 0',
          '$valor > 0 && $this->saldo >= $valor',
        ],
        hint: 'O valor deve ser maior que zero E menor ou igual ao saldo atual ($this->saldo).',
      },
    ],
    solutionCode: `<?php

class ContaBancaria {
    private float $saldo;

    public function __construct(float $saldoInicial = 0.0) {
        $this->saldo = max(0.0, $saldoInicial);
    }

    public function sacar(float $valor): bool {
        if ($valor > 0 && $valor <= $this->saldo) {
            $this->saldo -= $valor;
            return true;
        }
        return false;
    }

    public function getSaldo(): float {
        return $this->saldo;
    }
}

$conta = new ContaBancaria(500.0);
$sucesso = $conta->sacar(150.0);
echo "Saldo final: " . $conta->getSaldo(); // 350`,
    hints: [
      'Dica 1: Propriedades protegidas com private só podem ser manipuladas pelos métodos internos da própria classe.',
      'Dica 2: Para acessar propriedades do próprio objeto use $this->nomeDaPropriedade.',
      'Dica 3: É essencial garantir tanto que o valor seja positivo ($valor > 0) quanto que haja saldo ($valor <= $this->saldo).',
    ],
    testCases: [
      {
        description: 'Saque de 150 em saldo de 500 resulta em saldo 350',
        expectedOutput: 'Saldo final: 350',
      },
    ],
    explanation: 'O modificador `private` impede manipulações arbitrárias como `$conta->saldo = 999999;`, garantindo que todas as mudanças passem pelas regras de negócio dos métodos públicos.',
  },

  // INTERMEDIÁRIO 4: Conexão e Preparação PDO
  {
    id: 'php-inter-04',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'PDO & Banco de Dados',
    title: 'Consulta Segura com Prepared Statement no PDO',
    summary: 'Execute consultas parametrizadas contra injeção de SQL usando a biblioteca nativa PDO.',
    realWorldContext: 'SQL Injection é uma das maiores vulnerabilidades de segurança web (OWASP Top 10). Usar PDO com prepared statements e placeholders é a defesa padrão do ecossistema PHP.',
    description: 'Complete a execução da consulta com PDO: primeiro prepare o statement SQL com o placeholder `:id`, e em seguida execute passando o array associativo de parâmetros.',
    goal: 'Utilizar os métodos prepare() e execute() do objeto PDO.',
    templateCode: `<?php

function buscarUsuarioPorId(PDO $pdo, int $id): ?array {
    $sql = "SELECT id, nome, email, ativo FROM usuarios WHERE id = :id LIMIT 1";
    
    // 1. Prepara a query SQL com segurança
    $stmt = $pdo->{{blank_0}}($sql);
    
    // 2. Executa passando os parâmetros vinculados
    $stmt->{{blank_1}}(['id' => $id]);
    
    // 3. Retorna o registro como array associativo ou null
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    return $usuario ?: null;
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método de preparação PDO',
        placeholder: 'prepare',
        expectedAnswers: ['prepare'],
        hint: 'Método do objeto PDO que analisa a sintaxe SQL e compila a instrução no banco.',
      },
      {
        id: 'blank_1',
        label: 'Método de execução da instrução',
        placeholder: 'execute',
        expectedAnswers: ['execute'],
        hint: 'Método que envia os valores dos placeholders e executa a busca de fato.',
      },
    ],
    solutionCode: `<?php

function buscarUsuarioPorId(PDO $pdo, int $id): ?array {
    $sql = "SELECT id, nome, email, ativo FROM usuarios WHERE id = :id LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $id]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    return $usuario ?: null;
}`,
    hints: [
      'Dica 1: O fluxo seguro em PDO consiste sempre em: $pdo->prepare() seguido de $stmt->execute().',
      'Dica 2: Nunca concatene variáveis diretamente na string SQL (ex: "...WHERE id = " . $id), pois isso abre brecha para SQL Injection.',
    ],
    testCases: [
      {
        description: 'Prepara e executa a consulta associando parâmetros',
        expectedOutput: 'array com dados do usuário ou null',
      },
    ],
    explanation: 'Ao usar `prepare()` e `execute()`, o banco de dados trata os parâmetros estritamente como dados literais e nunca como código executável, neutralizando qualquer tentativa de injeção SQL.',
  },

  // INTERMEDIÁRIO 5: Tratamento de Exceções (Try / Catch)
  {
    id: 'php-inter-05',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Tratamento de Erros',
    title: 'Tratamento de Exceções Customizadas com Try-Catch',
    summary: 'Capture e trate erros de validação lançando e interceptando exceções no fluxo de trabalho.',
    realWorldContext: 'Aplicações profissionais nunca exibem erros brutos para o usuário final nem deixam scripts "morrerem" com fatal errors. Exceções permitem capturar falhas e registrar logs adequadamente.',
    description: 'Complete o bloco `try/catch` que intercepta a exceção `InvalidArgumentException` e exibe sua mensagem amigável através de `$e->getMessage()`.',
    goal: 'Escrever a sintaxe try, o tipo de exceção capturada e a chamada getMessage().',
    templateCode: `<?php

function validarCpf(string $cpf): string {
    $limpo = preg_replace('/\\D/', '', $cpf);
    if (strlen($limpo) !== 11) {
        throw new InvalidArgumentException("O CPF informado deve conter exatamente 11 dígitos numéricos.");
    }
    return $limpo;
}

{{blank_0}} {
    $cpfValido = validarCpf("123.456.78");
    echo "CPF válido: " . $cpfValido;
} catch ({{blank_1}} $e) {
    echo "Erro de validação: " . $e->{{blank_2}}();
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Início do bloco protegido',
        placeholder: 'try',
        expectedAnswers: ['try'],
        hint: 'Palavra-chave que inicia o bloco monitorado por erros.',
      },
      {
        id: 'blank_1',
        label: 'Classe da exceção esperada',
        placeholder: 'InvalidArgumentException',
        expectedAnswers: ['InvalidArgumentException', 'Exception', 'Throwable'],
        hint: 'Nome da classe de exceção lançada na função validarCpf.',
      },
      {
        id: 'blank_2',
        label: 'Método para resgatar a mensagem de erro',
        placeholder: 'getMessage',
        expectedAnswers: ['getMessage'],
        hint: 'Método padrão de instâncias Exception para obter a mensagem descritiva.',
      },
    ],
    solutionCode: `<?php

try {
    $cpfValido = validarCpf("123.456.78");
    echo "CPF válido: " . $cpfValido;
} catch (InvalidArgumentException $e) {
    echo "Erro de validação: " . $e->getMessage();
}`,
    hints: [
      'Dica 1: O bloco se inicia com try { ... } e se encerra com catch (TipoDaExcecao $e) { ... }.',
      'Dica 2: Em PHP, todos os objetos derivados de Exception possuem o método getMessage().',
    ],
    testCases: [
      {
        description: 'Captura o erro e imprime a mensagem amigável',
        expectedOutput: 'Erro de validação: O CPF informado deve conter exatamente 11 dígitos numéricos.',
      },
    ],
    explanation: 'Em PHP moderno, o lançamento de exceções (`throw new ...`) desacopla a detecção do erro de sua apresentação visual ou log, permitindo que a camada de controle trate o erro sem interromper abruptamente o servidor.',
  },

  // INTERMEDIÁRIO 6: Gerenciamento de Sessão e Autenticação
  {
    id: 'php-inter-06',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Sessões & Autenticação',
    title: 'Autenticação e Proteção de Rota com Sessões',
    summary: 'Inicie uma sessão segura, grave dados do usuário autenticado e proteja áreas restritas.',
    realWorldContext: 'Sessões PHP mantêm o estado do usuário logado entre requisições HTTP sem expor senhas. Toda área restrita precisa verificar se a chave de autenticação existe na superglobal $_SESSION.',
    description: 'Complete a função que verifica se a sessão já foi iniciada com `session_status()` e inicia com `session_start()`, depois verifica se o usuário está logado.',
    goal: 'Utilizar session_start() e checagem de $_SESSION[\'usuario_id\'].',
    templateCode: `<?php

function protegerAreaRestrita(): void {
    // 1. Inicia a sessão se ainda não estiver ativa
    if (session_status() === PHP_SESSION_NONE) {
        {{blank_0}}();
    }

    // 2. Verifica se a variável de sessão de autenticação NÃO existe
    if (!isset({{blank_1}}['usuario_id'])) {
        // Redireciona para o login
        header('Location: /login.php');
        exit;
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de inicialização de sessão',
        placeholder: 'session_start',
        expectedAnswers: ['session_start'],
        hint: 'Função nativa do PHP que cria ou restaura uma sessão.',
      },
      {
        id: 'blank_1',
        label: 'Superglobal de sessão',
        placeholder: '$_SESSION',
        expectedAnswers: ['$_SESSION', '$_SESSION'],
        hint: 'Superglobal do PHP que armazena dados em memória no servidor para o usuário.',
      },
    ],
    solutionCode: `<?php

function protegerAreaRestrita(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    if (!isset($_SESSION['usuario_id'])) {
        header('Location: /login.php');
        exit;
    }
}`,
    hints: [
      'Dica 1: session_start() deve ser chamada antes de qualquer saída de conteúdo no navegador.',
      'Dica 2: A superglobal $_SESSION armazena arrays associativos persistentes por cookie PHPSESSID.',
      'Dica 3: Sempre chame exit ou die() após um header Location para impedir que o resto do script continue executando.',
    ],
    testCases: [
      {
        description: 'Redireciona caso $_SESSION["usuario_id"] não esteja definido',
        expectedOutput: 'Redirecionamento para /login.php',
      },
    ],
    explanation: 'Verificar `session_status() === PHP_SESSION_NONE` antes de chamar `session_start()` evita o erro clássico "Notice: session_start(): A session had already been started".',
  },

  // AVANÇADO 1: Transações no PDO (Segurança Crítica)
  {
    id: 'php-avancado-01',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'PDO & Transações',
    title: 'Transferência Bancária Atômica com Transações PDO',
    summary: 'Implemente atomicidade em operações de banco de dados com beginTransaction, commit e rollBack.',
    realWorldContext: 'Se um sistema subtrai dinheiro de uma conta mas falha antes de creditar na conta de destino, o dinheiro desaparece. Transações ACID garantem que ou tudo é salvo ou nada é alterado.',
    description: 'Complete o bloco transacional do PDO: inicie a transação, confirme as alterações se tudo correr bem (`commit`), ou desfaça tudo no bloco catch (`rollBack`).',
    goal: 'Dominar os três métodos transacionais essenciais do PDO.',
    templateCode: `<?php

function transferirValores(PDO $pdo, int $origemId, int $destinoId, float $valor): bool {
    try {
        // 1. Inicia a transação atômica
        $pdo->{{blank_0}}();

        // Debita da conta de origem
        $stmtDebito = $pdo->prepare("UPDATE contas SET saldo = saldo - :val WHERE id = :id");
        $stmtDebito->execute(['val' => $valor, 'id' => $origemId]);

        // Credita na conta de destino
        $stmtCredito = $pdo->prepare("UPDATE contas SET saldo = saldo + :val WHERE id = :id");
        $stmtCredito->execute(['val' => $valor, 'id' => $destinoId]);

        // 2. Confirma as alterações definitivamente no banco de dados
        $pdo->{{blank_1}}();
        return true;

    } catch (PDOException $e) {
        // 3. Desfaz qualquer alteração pendente em caso de erro
        $pdo->{{blank_2}}();
        error_log("Falha na transferência: " . $e->getMessage());
        return false;
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Início da transação',
        placeholder: 'beginTransaction',
        expectedAnswers: ['beginTransaction'],
        hint: 'Método PDO que desativa o modo auto-commit e inicia a transação.',
      },
      {
        id: 'blank_1',
        label: 'Confirmação da transação',
        placeholder: 'commit',
        expectedAnswers: ['commit'],
        hint: 'Método PDO que efetiva permanentemente as operações.',
      },
      {
        id: 'blank_2',
        label: 'Reversão da transação',
        placeholder: 'rollBack',
        expectedAnswers: ['rollBack', 'rollback'],
        hint: 'Método PDO que reverte todas as instruções executadas na transação.',
      },
    ],
    solutionCode: `<?php

function transferirValores(PDO $pdo, int $origemId, int $destinoId, float $valor): bool {
    try {
        $pdo->beginTransaction();

        $stmtDebito = $pdo->prepare("UPDATE contas SET saldo = saldo - :val WHERE id = :id");
        $stmtDebito->execute(['val' => $valor, 'id' => $origemId]);

        $stmtCredito = $pdo->prepare("UPDATE contas SET saldo = saldo + :val WHERE id = :id");
        $stmtCredito->execute(['val' => $valor, 'id' => $destinoId]);

        $pdo->commit();
        return true;
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Falha na transferência: " . $e->getMessage());
        return false;
    }
}`,
    hints: [
      'Dica 1: O método para abrir a transação é beginTransaction().',
      'Dica 2: Para salvar com sucesso quando não há erros, chama-se commit().',
      'Dica 3: Se houver exceção PDOException, rollBack() garante que o banco volte ao estado inicial intacto.',
    ],
    testCases: [
      {
        description: 'Executa as operações atomicamente e garante reversão em caso de exceção',
        expectedOutput: 'true ou rollback em caso de erro',
      },
    ],
    explanation: 'O recurso de transações do PDO implementa as propriedades ACID (Atomicidade, Consistência, Isolamento e Durabilidade). É indispensável em sistemas de pedidos, estoques e pagamentos.',
  },

  // AVANÇADO 2: Injeção de Dependências e Interfaces (SOLID)
  {
    id: 'php-avancado-02',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'POO & SOLID',
    title: 'Inversão de Dependência com Interfaces (SOLID - DIP)',
    summary: 'Desacople a lógica de checkout de um gateway de pagamento específico criando contratos através de interfaces.',
    realWorldContext: 'Sistemas corporativos trocam de operadora de cartão (Stripe, Pagar.me, Mercado Pago) sem reescrever a classe de Pedido. Isso só é possível injetando uma Interface.',
    description: 'Complete a implementação da classe `ProcessadorPedido`. O construtor deve receber uma instância que implemente a interface `GatewayPagamentoInterface` e chamá-la no método `finalizar`.',
    goal: 'Aplicar tipagem por Interface no construtor e invocar o método polimórfico.',
    templateCode: `<?php

interface GatewayPagamentoInterface {
    public function cobrar(float $valor, string $tokenCartao): bool;
}

class ProcessadorPedido {
    // 1. Tipagem por interface para desacoplamento
    private {{blank_0}} $gateway;

    public function __construct({{blank_0}} $gateway) {
        $this->gateway = $gateway;
    }

    public function finalizar(float $valorTotal, string $tokenCartao): bool {
        // 2. Chama a cobrança polimórfica no gateway injetado
        return $this->gateway->{{blank_1}}($valorTotal, $tokenCartao);
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Tipo da interface no construtor',
        placeholder: 'GatewayPagamentoInterface',
        expectedAnswers: ['GatewayPagamentoInterface'],
        hint: 'Use o nome exato da interface como tipo da propriedade e do argumento.',
      },
      {
        id: 'blank_1',
        label: 'Método do contrato da interface',
        placeholder: 'cobrar',
        expectedAnswers: ['cobrar'],
        hint: 'Nome do método declarado na interface GatewayPagamentoInterface.',
      },
    ],
    solutionCode: `<?php

interface GatewayPagamentoInterface {
    public function cobrar(float $valor, string $tokenCartao): bool;
}

class ProcessadorPedido {
    private GatewayPagamentoInterface $gateway;

    public function __construct(GatewayPagamentoInterface $gateway) {
        $this->gateway = $gateway;
    }

    public function finalizar(float $valorTotal, string $tokenCartao): bool {
        return $this->gateway->cobrar($valorTotal, $tokenCartao);
    }
}`,
    hints: [
      'Dica 1: Dependa de abstrações (interfaces), não de implementações concretas (Dependency Inversion Principle).',
      'Dica 2: A propriedade $this->gateway recebe qualquer classe que implemente a interface GatewayPagamentoInterface.',
    ],
    testCases: [
      {
        description: 'Permite injetar mocks ou múltiplos gateways sem alterar ProcessadorPedido',
        expectedOutput: 'true',
      },
    ],
    explanation: 'Ao aplicar o princípio DIP do SOLID, você pode criar facilmente mocks para testes unitários com PHPUnit sem precisar conectar com operadoras de cartão reais.',
  },

  // AVANÇADO 3: Traits e Reutilização Horizontal de Código
  {
    id: 'php-avancado-03',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'POO Avançada',
    title: 'Auditoria de Ações com Traits no PHP',
    summary: 'Compartilhe funcionalidades de log e auditoria entre classes distintas sem violar a herança única.',
    realWorldContext: 'Como o PHP possui herança simples (uma classe só herda de um único pai), Traits permitem reaproveitar métodos transversais como Log, Notificações ou Timestamps em diferentes entidades.',
    description: 'Complete a classe `Produto` para que ela reutilize o trait `AuditavelTrait` usando a palavra-chave `use`, e invoque o método herdado.',
    goal: 'Declarar o uso de Trait dentro de uma classe PHP e chamar o método da trait.',
    templateCode: `<?php

trait AuditavelTrait {
    public function registrarLog(string $acao): void {
        $timestamp = date('Y-m-d H:i:s');
        echo "[LOG {$timestamp}] Ação realizada: {$acao}" . PHP_EOL;
    }
}

class Produto {
    // 1. Inclui o Trait na classe
    {{blank_0}} AuditavelTrait;

    private string $nome;

    public function __construct(string $nome) {
        $this->nome = $nome;
        // 2. Invoca o método fornecido pelo Trait
        $this->{{blank_1}}("Produto '{$nome}' instanciado.");
    }
}

$prod = new Produto("Smartphone 5G");
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Palavra-chave para incluir Trait',
        placeholder: 'use',
        expectedAnswers: ['use'],
        hint: 'Palavra-chave dentro do corpo da classe para incorporar uma trait.',
      },
      {
        id: 'blank_1',
        label: 'Chamada do método da Trait',
        placeholder: 'registrarLog',
        expectedAnswers: ['registrarLog'],
        hint: 'Método definido na trait AuditavelTrait.',
      },
    ],
    solutionCode: `<?php

trait AuditavelTrait {
    public function registrarLog(string $acao): void {
        $timestamp = date('Y-m-d H:i:s');
        echo "[LOG {$timestamp}] Ação realizada: {$acao}" . PHP_EOL;
    }
}

class Produto {
    use AuditavelTrait;

    private string $nome;

    public function __construct(string $nome) {
        $this->nome = $nome;
        $this->registrarLog("Produto '{$nome}' instanciado.");
    }
}

$prod = new Produto("Smartphone 5G");`,
    hints: [
      'Dica 1: Dentro da classe, use use NomeDaTrait; para importar todos os métodos e propriedades.',
      'Dica 2: Uma vez importada a Trait, seus métodos passam a se comportar como métodos normais de $this.',
    ],
    testCases: [
      {
        description: 'Dispara o log de criação do produto através do método da trait',
        expectedOutput: '[LOG ...] Ação realizada: Produto Smartphone 5G instanciado.',
      },
    ],
    explanation: 'Traits são o mecanismo do PHP para herança horizontal. Elas reduzem duplicação de código em casos como timestamp de criação (`created_at`), formatação de slugs ou geração de logs.',
  },

  // AVANÇADO 4: Arquitetura Service & Repository
  {
    id: 'php-avancado-04',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Arquitetura de Software',
    title: 'Separação de Camadas: Service e Repository',
    summary: 'Separe as regras de negócio das consultas diretas ao banco de dados utilizando o padrão Repository.',
    realWorldContext: 'Em frameworks modernos (Laravel, Symfony) ou código profissional puro, consultas SQL residem em Repositórios e regras de negócio residem em Serviços, evitando código "espaguete".',
    description: 'Complete o `UsuarioService` que valida se o e-mail já existe antes de autorizar o cadastro através do `UsuarioRepository`.',
    goal: 'Integrar a camada de serviço com a chamada ao repositório correspondente.',
    templateCode: `<?php

class UsuarioService {
    private UsuarioRepository $repository;

    public function __construct(UsuarioRepository $repository) {
        $this->repository = $repository;
    }

    public function cadastrar(string $nome, string $email, string $senha): array {
        // 1. Verifica se já existe um usuário cadastrado com este e-mail
        $usuarioExistente = $this->repository->{{blank_0}}($email);
        if ($usuarioExistente !== null) {
            throw new Exception("E-mail já se encontra em uso.");
        }

        // 2. Criptografa a senha com hash seguro do PHP (Argon2id ou Bcrypt)
        $senhaHash = password_hash($senha, {{blank_1}});

        // 3. Salva através do repositório
        return $this->repository->criar([
            'nome' => $nome,
            'email' => $email,
            'senha' => $senhaHash,
        ]);
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método de busca no repositório',
        placeholder: 'buscarPorEmail',
        expectedAnswers: ['buscarPorEmail', 'findByEmail'],
        hint: 'Método semântico comum no repositório para localizar por e-mail.',
      },
      {
        id: 'blank_1',
        label: 'Algoritmo padrão de hash do PHP',
        placeholder: 'PASSWORD_DEFAULT',
        expectedAnswers: ['PASSWORD_DEFAULT', 'PASSWORD_BCRYPT', 'PASSWORD_ARGON2ID'],
        hint: 'Constante nativa do PHP recomendada para password_hash.',
      },
    ],
    solutionCode: `<?php

class UsuarioService {
    private UsuarioRepository $repository;

    public function __construct(UsuarioRepository $repository) {
        $this->repository = $repository;
    }

    public function cadastrar(string $nome, string $email, string $senha): array {
        $usuarioExistente = $this->repository->buscarPorEmail($email);
        if ($usuarioExistente !== null) {
            throw new Exception("E-mail já se encontra em uso.");
        }

        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

        return $this->repository->criar([
            'nome' => $nome,
            'email' => $email,
            'senha' => $senhaHash,
        ]);
    }
}`,
    hints: [
      'Dica 1: O repositório encapsula o SQL e expõe métodos limpos como buscarPorEmail($email).',
      'Dica 2: Nunca use md5() ou sha1() para senhas! A função correta do PHP é password_hash($senha, PASSWORD_DEFAULT).',
    ],
    testCases: [
      {
        description: 'Impede duplicação de e-mails e gera hash seguro de senha',
        expectedOutput: 'Usuário cadastrado com sucesso ou Exceção de duplicidade',
      },
    ],
    explanation: '`password_hash` com `PASSWORD_DEFAULT` escolhe automaticamente o algoritmo de criptografia mais seguro suportado pela versão instalada do PHP (atualmente Bcrypt ou Argon2), com sal (salt) gerado aleatoriamente.',
  },

  // AVANÇADO 5: Endpoint REST e Resposta JSON com HTTP Headers
  {
    id: 'php-avancado-05',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'APIs & Web Services',
    title: 'Construção de Endpoint de API RESTful em PHP',
    summary: 'Configure os cabeçalhos HTTP adequados, o status code correto e a serialização JSON da resposta.',
    realWorldContext: 'APIs PHP atendem aplicativos móveis e frontends modernos. Enviar o Content-Type correto e os códigos de status HTTP (200, 201, 400, 404, 500) é a base dos padrões REST.',
    description: 'Complete o script que define o cabeçalho JSON com `header()`, define o código de resposta HTTP 200 com `http_response_code()` e serializa a resposta com `json_encode()`.',
    goal: 'Emitir o header Content-Type application/json e converter dados com json_encode.',
    templateCode: `<?php

// 1. Define o cabeçalho para informar ao cliente que a resposta é JSON
{{blank_0}}('Content-Type: application/json; charset=utf-8');

// 2. Define o código de sucesso HTTP 200
{{blank_1}}(200);

$dadosResposta = [
    'status' => 'sucesso',
    'dados' => [
        'id' => 104,
        'nome' => 'Relatório Mensal',
        'gerado_em' => date('Y-m-d\\TH:i:sP')
    ]
];

// 3. Serializa o array em string JSON
echo {{blank_2}}($dadosResposta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de cabeçalho HTTP',
        placeholder: 'header',
        expectedAnswers: ['header'],
        hint: 'Função do PHP utilizada para enviar cabeçalhos HTTP puros.',
      },
      {
        id: 'blank_1',
        label: 'Função de código de status HTTP',
        placeholder: 'http_response_code',
        expectedAnswers: ['http_response_code'],
        hint: 'Função do PHP para obter ou definir o código de resposta HTTP.',
      },
      {
        id: 'blank_2',
        label: 'Função de conversão para JSON',
        placeholder: 'json_encode',
        expectedAnswers: ['json_encode'],
        hint: 'Função que transforma arrays ou objetos em JSON string.',
      },
    ],
    solutionCode: `<?php

header('Content-Type: application/json; charset=utf-8');
http_response_code(200);

$dadosResposta = [
    'status' => 'sucesso',
    'dados' => [
        'id' => 104,
        'nome' => 'Relatório Mensal',
        'gerado_em' => date('Y-m-d\\TH:i:sP')
    ]
];

echo json_encode($dadosResposta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);`,
    hints: [
      'Dica 1: A função header() deve ser enviada antes de qualquer eco ou espaço em branco.',
      'Dica 2: http_response_code(200) define o HTTP status code padrão de sucesso.',
      'Dica 3: JSON_UNESCAPED_UNICODE evita que caracteres acentuados como "ç" e "ã" virem códigos unicode como \\u00e3.',
    ],
    testCases: [
      {
        description: 'Retorna payload JSON válido com status 200',
        expectedOutput: '{"status": "sucesso", ...}',
      },
    ],
    explanation: 'Ao usar as flags `JSON_UNESCAPED_UNICODE` e `JSON_PRETTY_PRINT`, as respostas da sua API permanecem legíveis tanto para humanos quanto para os parsers de frontends modernos.',
  },

  // AVANÇADO 6: Sanitização contra XSS e htmlspecialchars
  {
    id: 'php-avancado-06',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Segurança & Proteção Web',
    title: 'Prevenção de Ataques XSS com htmlspecialchars',
    summary: 'Sanitize dados fornecidos por usuários antes de renderizá-los em templates HTML.',
    realWorldContext: 'Cross-Site Scripting (XSS) permite que invasores executem JavaScript malicioso no navegador de outros clientes. Escapar caracteres especiais como < e > é a regra número 1 ao exibir conteúdo.',
    description: 'Complete a função que escapa caracteres especiais usando `htmlspecialchars` com a flag `ENT_QUOTES` e encoding UTF-8.',
    goal: 'Invocar htmlspecialchars com os parâmetros de segurança recomendados.',
    templateCode: `<?php

function escaparHtml(string $entrada): string {
    // Escapa aspas simples e duplas, tags <script>, etc.
    return {{blank_0}}($entrada, {{blank_1}}, 'UTF-8');
}

$comentarioUsuario = "<script>alert('Ataque XSS!');</script> Olá mundo!";
echo escaparHtml($comentarioUsuario);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de escape HTML',
        placeholder: 'htmlspecialchars',
        expectedAnswers: ['htmlspecialchars'],
        hint: 'A função nativa mais importante do PHP para prevenção de XSS ao renderizar HTML.',
      },
      {
        id: 'blank_1',
        label: 'Flag de segurança para aspas',
        placeholder: 'ENT_QUOTES',
        expectedAnswers: ['ENT_QUOTES', 'ENT_QUOTES | ENT_HTML5'],
        hint: 'Flag que instrui o PHP a escapar tanto aspas duplas quanto aspas simples.',
      },
    ],
    solutionCode: `<?php

function escaparHtml(string $entrada): string {
    return htmlspecialchars($entrada, ENT_QUOTES, 'UTF-8');
}

$comentarioUsuario = "<script>alert('Ataque XSS!');</script> Olá mundo!";
echo escaparHtml($comentarioUsuario);
// Saída: &lt;script&gt;alert(&#039;Ataque XSS!&#039;);&lt;/script&gt; Olá mundo!`,
    hints: [
      'Dica 1: A função htmlspecialchars converte caracteres especiais em entidades HTML (&lt;, &gt;, etc).',
      'Dica 2: Por padrão, ela não escapava aspas simples a menos que você passe a flag ENT_QUOTES.',
      'Dica 3: Sempre declare o charset \'UTF-8\' explicitamente.',
    ],
    testCases: [
      {
        description: 'Converte tags < e > em entidades HTML seguras',
        expectedOutput: '&lt;script&gt;alert(&#039;Ataque XSS!&#039;);&lt;/script&gt; Olá mundo!',
      },
    ],
    explanation: 'Ao renderizar qualquer conteúdo vindo de banco de dados ou formulário dentro do HTML, `htmlspecialchars($valor, ENT_QUOTES, \'UTF-8\')` neutraliza completamente a injeção de scripts sem distorcer o texto original.',
  },

  // EXERCÍCIO DE CÓDIGO LIVRE PHP 1 (Intermediário): Validação de CPF
  {
    id: 'php-codigo-01',
    language: 'php',
    difficulty: 'intermediario',
    type: 'codigo_livre',
    topic: 'Algoritmos & Validação',
    title: 'Formatador e Validador de CNPJ ou CPF',
    summary: 'Escreva uma função que limpa caracteres não-numéricos de uma chave e valida sua extensão.',
    realWorldContext: 'Sistemas fiscais e de faturamento precisam limpar máscaras (pontos, traços, barras) de documentos enviados por formulários antes de salvar no banco de dados.',
    description: 'Implemente uma função chamada `sanitizarDocumento(string $documento): string` que remove qualquer caractere que não seja número e retorna a string contendo apenas os dígitos numéricos.',
    goal: 'Criar uma função completa em PHP usando preg_replace.',
    templateCode: `<?php

/**
 * Remove qualquer caractere não numérico de um documento (CPF ou CNPJ).
 * Exemplo: "123.456.789-00" -> "12345678900"
 */
function sanitizarDocumento(string $documento): string {
    // Escreva sua solução aqui
    
}

// Teste rápido
echo sanitizarDocumento("123.456.789-00");
`,
    solutionCode: `<?php

function sanitizarDocumento(string $documento): string {
    return preg_replace('/\\D/', '', $documento);
}

echo sanitizarDocumento("123.456.789-00"); // Saída: 12345678900`,
    hints: [
      'Dica 1: A expressão regular \\D corresponde a qualquer caractere que NÃO seja um dígito numérico de 0 a 9.',
      'Dica 2: A função preg_replace($padrao, $substituto, $texto) substitui todas as ocorrências do padrão.',
    ],
    testCases: [
      {
        description: 'Remove pontos e traços de CPF',
        input: '123.456.789-00',
        expectedOutput: '12345678900',
      },
      {
        description: 'Remove barras e pontos de CNPJ',
        input: '12.345.678/0001-90',
        expectedOutput: '12345678000190',
      },
    ],
    explanation: 'A expressão regular `/\\D/` (com barra invertida dupla em strings PHP `\'/\\D/\'`) é a maneira mais concisa e performática de isolar apenas dígitos em strings de qualquer formato.',
  },

  // EXERCÍCIO DE CÓDIGO LIVRE PHP 2 (Avançado): Paginação de Resultados
  {
    id: 'php-codigo-02',
    language: 'php',
    difficulty: 'avancado',
    type: 'codigo_livre',
    topic: 'Algoritmos & APIs',
    title: 'Cálculo de Metadados de Paginação para APIs',
    summary: 'Construa uma função que calcula páginas totais, offset de SQL e navegação para endpoints REST.',
    realWorldContext: 'Toda listagem com milhares de registros precisa paginar consultas SQL usando LIMIT e OFFSET, retornando metadados completos para o frontend montar os botões de próxima e anterior.',
    description: 'Implemente uma função `calcularPaginacao(int $totalItens, int $paginaAtual, int $porPagina): array` que retorne um array associativo com as chaves: `total_itens`, `por_pagina`, `pagina_atual`, `total_paginas`, `offset`, `tem_proxima` (bool), e `tem_anterior` (bool).',
    goal: 'Criar a função completa de cálculo de offset e total de páginas com ceil().',
    templateCode: `<?php

function calcularPaginacao(int $totalItens, int $paginaAtual, int $porPagina = 10): array {
    // Calcule o total de páginas com ceil()
    // Calcule o offset para a query SQL: (pagina - 1) * porPagina
    // Retorne o array com as chaves especificadas
    
}
`,
    solutionCode: `<?php

function calcularPaginacao(int $totalItens, int $paginaAtual, int $porPagina = 10): array {
    $totalPaginas = (int) max(1, ceil($totalItens / $porPagina));
    $paginaAtual = max(1, min($paginaAtual, $totalPaginas));
    $offset = ($paginaAtual - 1) * $porPagina;

    return [
        'total_itens'   => $totalItens,
        'por_pagina'    => $porPagina,
        'pagina_atual'  => $paginaAtual,
        'total_paginas' => $totalPaginas,
        'offset'        => $offset,
        'tem_anterior'  => $paginaAtual > 1,
        'tem_proxima'   => $paginaAtual < $totalPaginas,
    ];
}`,
    hints: [
      'Dica 1: O total de páginas é o teto da divisão: ceil($totalItens / $porPagina).',
      'Dica 2: O OFFSET da query SQL é ($paginaAtual - 1) * $porPagina.',
      'Dica 3: Certifique-se de que se houver 0 itens, o total de páginas seja no mínimo 1.',
    ],
    testCases: [
      {
        description: 'Calcula paginação para 45 itens com 10 por página na página 2',
        input: 'totalItens: 45, paginaAtual: 2, porPagina: 10',
        expectedOutput: 'total_paginas: 5, offset: 10, tem_anterior: true, tem_proxima: true',
      },
    ],
    explanation: 'Esta estrutura de metadados segue a especificação padrão adotada por ferramentas como Laravel Pagination e JSON:API, facilitando a vida do frontend ao construir tabelas e paginações.',
  },
];

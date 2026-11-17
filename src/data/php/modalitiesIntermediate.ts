import { Exercise } from '../../types/exercise';

export const phpIntermediateModalities: Exercise[] = [
  // ==========================================
  // CORRIGIR ERROS (5 exercícios)
  // ==========================================
  {
    id: 'php-inter-debug-02',
    language: 'php',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'POO & Encapsulamento',
    title: 'Depuração: Violação de Encapsulamento em Propriedade Privada',
    summary: 'Corrija um erro fatal disparado ao tentar acessar diretamente uma propriedade privada fora do escopo da classe.',
    realWorldContext: 'Em orientação a objetos profissional, propriedades privadas protegem o estado interno contra mutações imprevisíveis. O acesso deve ser feito através de métodos getters e setters públicos.',
    description: 'Um desenvolvedor tentou acessar `$conta->saldo` diretamente fora da classe, disparando o erro fatal "Cannot access private property ContaBancaria::$saldo". Adicione um método getter público `getSaldo(): float` na classe e utilize-o.',
    goal: 'Criar o getter público getSaldo() e utilizá-lo para ler o saldo de forma segura.',
    bugDescription: 'A propriedade $saldo é privada e não pode ser lida com $conta->saldo de fora da classe.',
    buggyLineNumbers: [13],
    initialBuggyCode: `<?php

class ContaBancaria {
    private float $saldo;

    public function __construct(float $saldoInicial) {
        $this->saldo = $saldoInicial;
    }
}

$conta = new ContaBancaria(1500.0);
// BUG FATAL: Tentativa de leitura direta de propriedade privada!
echo "Saldo: " . $conta->saldo;
`,
    templateCode: `<?php

class ContaBancaria {
    private float $saldo;

    public function __construct(float $saldoInicial) {
        $this->saldo = $saldoInicial;
    }

    // Adicione o método getter público aqui:
    public function getSaldo(): float {
        return $this->saldo;
    }
}

$conta = new ContaBancaria(1500.0);
echo "Saldo: " . $conta->getSaldo();
`,
    solutionCode: `<?php

class ContaBancaria {
    private float $saldo;

    public function __construct(float $saldoInicial) {
        $this->saldo = $saldoInicial;
    }

    public function getSaldo(): float {
        return $this->saldo;
    }
}

$conta = new ContaBancaria(1500.0);
echo "Saldo: " . $conta->getSaldo();`,
    hints: [
      'Dica 1: Declare o método "public function getSaldo(): float" dentro da classe.',
      'Dica 2: No lugar de $conta->saldo, chame $conta->getSaldo().',
    ],
    testCases: [
      {
        description: 'Lê saldo via getter exibindo "Saldo: 1500"',
        expectedOutput: 'Saldo: 1500',
      },
    ],
    validationRules: [
      {
        id: 'rule-getter',
        description: 'Declaração do método getSaldo()',
        type: 'contains',
        target: 'function getSaldo',
      },
      {
        id: 'rule-call-getter',
        description: 'Invocação via $conta->getSaldo()',
        type: 'contains',
        target: 'getSaldo()',
      },
    ],
    explanation: 'O princípio do encapsulamento em POO determina que os atributos de uma classe devem ser privados para impedir modificações arbitrárias. O acesso controlado é exposto via métodos públicos de leitura (getters).',
  },

  {
    id: 'php-inter-debug-03',
    language: 'php',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'PDO & Fetch Modes',
    title: 'Depuração: Duplicação de Memória com Modo Fetch Padrão em PDO',
    summary: 'Corrija uma consulta PDO que retorna dados duplicados (índices numéricos e associativos juntos) por falta de PDO::FETCH_ASSOC.',
    realWorldContext: 'Por padrão, o PDO utiliza PDO::FETCH_BOTH, duplicando em memória cada coluna retornada do banco (como número e como nome). Em APIs REST que serializam com json_encode, isso dobra o tráfego de rede indevidamente.',
    description: 'A função `listarUsuarios` deve retornar apenas chaves nomeadas (array associativo). Atualmente ela não especifica o modo de fetch no método `fetchAll()`. Corrija passando `PDO::FETCH_ASSOC`.',
    goal: 'Garantir o uso explícito de $stmt->fetchAll(PDO::FETCH_ASSOC).',
    bugDescription: 'fetchAll() sem parâmetro utiliza FETCH_BOTH, duplicando todas as colunas com índices numéricos redundantes.',
    buggyLineNumbers: [6],
    initialBuggyCode: `<?php

function listarUsuarios(PDO $pdo): array {
    $stmt = $pdo->query("SELECT id, nome FROM usuarios");
    // BUG: Sem PDO::FETCH_ASSOC, duplica memória com índices numéricos e associativos
    return $stmt->fetchAll();
}
`,
    templateCode: `<?php

function listarUsuarios(PDO $pdo): array {
    $stmt = $pdo->query("SELECT id, nome FROM usuarios");
    // Especifique o modo estritamente associativo:
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
`,
    solutionCode: `<?php

function listarUsuarios(PDO $pdo): array {
    $stmt = $pdo->query("SELECT id, nome FROM usuarios");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
`,
    hints: [
      'Dica 1: Passe a constante PDO::FETCH_ASSOC como argumento em fetchAll().',
    ],
    testCases: [
      {
        description: 'Retorna array exclusivamente associativo com PDO::FETCH_ASSOC',
        expectedOutput: 'Array associativo',
      },
    ],
    validationRules: [
      {
        id: 'rule-fetch-assoc',
        description: 'Uso de PDO::FETCH_ASSOC',
        type: 'contains',
        target: 'PDO::FETCH_ASSOC',
      },
    ],
    explanation: 'Definir explicitamente PDO::FETCH_ASSOC instrui o driver a indexar cada linha do resultado unicamente pelo nome da coluna, economizando até 50% de consumo de memória em consultas volumosas.',
  },

  {
    id: 'php-inter-debug-04',
    language: 'php',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Sessões & Headers HTTP',
    title: 'Depuração: session_start() com Erro de "Headers Already Sent"',
    summary: 'Corrija um erro comum onde saída de texto antes do session_start() impede o envio do cookie de sessão.',
    realWorldContext: 'Sessões no PHP utilizam cabeçalhos HTTP (Set-Cookie). Qualquer echo, espaço em branco ou HTML enviado antes de session_start() dispara a mensagem "Cannot start session when headers already sent".',
    description: 'No script abaixo, um echo foi acidentalmente emitido antes de chamar `session_start()`. Reorganize as instruções para que a inicialização da sessão aconteça antes de qualquer saída para o navegador.',
    goal: 'Mover session_start() para a primeira linha executável do script.',
    bugDescription: 'Saída de texto antes de session_start() quebra o envio de cabeçalhos de cookies.',
    buggyLineNumbers: [3, 5],
    initialBuggyCode: `<?php

// BUG: Saída de conteúdo antes de session_start()!
echo "<!-- Cabeçalho da página -->\n";

session_start();
$_SESSION['usuario_logado'] = true;
`,
    templateCode: `<?php

// session_start() DEVE ser chamado antes de qualquer saída de conteúdo:
session_start();
$_SESSION['usuario_logado'] = true;

echo "<!-- Cabeçalho da página -->\n";
`,
    solutionCode: `<?php

session_start();
$_SESSION['usuario_logado'] = true;

echo "<!-- Cabeçalho da página -->\n";`,
    hints: [
      'Dica 1: session_start() precisa enviar o header Set-Cookie com o ID da sessão.',
      'Dica 2: Chame session_start() no topo absoluto do script, antes de qualquer comando echo ou print.',
    ],
    testCases: [
      {
        description: 'Sessão iniciada com sucesso antes da emissão de output',
        expectedOutput: 'Sessão configurada',
      },
    ],
    validationRules: [
      {
        id: 'rule-session-start',
        description: 'session_start() no início',
        type: 'contains',
        target: 'session_start();',
      },
    ],
    explanation: 'Como o protocolo HTTP envia cabeçalhos antes do corpo da resposta, o PHP precisa emitir os cookies de sessão antes de qualquer byte de conteúdo ser despachado para a saída.',
  },

  {
    id: 'php-inter-debug-05',
    language: 'php',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Segurança & Criptografia',
    title: 'Depuração: Comparação Insegura de Hash de Senha com "=="',
    summary: 'Substitua a comparação ingênua de strings pelo método oficial e criptograficamente seguro password_verify().',
    realWorldContext: 'Senhas criptografadas com BCRYPT ou ARGON2ID possuem salt dinâmico e formato específico. Usar "==" ou "md5" é uma falha de segurança gravíssima (vulnerável a rainbow tables e timing attacks).',
    description: 'A função `autenticarUsuario` está comparando o hash do banco diretamente com `$senhaDigitada` usando o operador `==`. Corrija a função para utilizar a API nativa de senhas do PHP: `password_verify($senhaDigitada, $hashDoBanco)`.',
    goal: 'Utilizar password_verify() para validar a senha em tempo constante.',
    bugDescription: 'Comparação de hash com == é falha e não decifra os hashes gerados por password_hash().',
    buggyLineNumbers: [4],
    initialBuggyCode: `<?php

function autenticarUsuario(string $senhaDigitada, string $hashDoBanco): bool {
    // BUG GRAVE DE SEGURANÇA: Comparação com == em vez de password_verify!
    return $senhaDigitada == $hashDoBanco;
}
`,
    templateCode: `<?php

function autenticarUsuario(string $senhaDigitada, string $hashDoBanco): bool {
    // Utilize a função oficial do PHP para validação de senhas:
    return password_verify($senhaDigitada, $hashDoBanco);
}
`,
    solutionCode: `<?php

function autenticarUsuario(string $senhaDigitada, string $hashDoBanco): bool {
    return password_verify($senhaDigitada, $hashDoBanco);
}
`,
    hints: [
      'Dica 1: A função password_verify($senhaPlana, $hash) faz o cálculo matemático e a comparação segura.',
    ],
    testCases: [
      {
        description: 'Validação segura com password_verify',
        expectedOutput: 'true',
      },
    ],
    validationRules: [
      {
        id: 'rule-password-verify',
        description: 'Uso da função password_verify()',
        type: 'contains',
        target: 'password_verify',
      },
    ],
    explanation: 'password_verify() é a única forma correta de validar senhas criptografadas com password_hash(). Ela extrai o algoritmo, custo e salt embutidos no hash e executa uma comparação resistente a ataques de tempo (timing attacks).',
  },

  {
    id: 'php-inter-debug-06',
    language: 'php',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Datas & DateTimeImmutable',
    title: 'Depuração: Mutação Involuntária de Instâncias DateTime',
    summary: 'Corrija um bug clássico onde métodos de adição de intervalo em DateTime mutam o objeto original em vez de gerar uma nova data.',
    realWorldContext: 'A classe DateTime clássica do PHP é mutável: ao fazer $data->add(...), a data original muda! Em contratos financeiros (data de início vs data de vencimento), deve-se usar sempre DateTimeImmutable.',
    description: 'A função `calcularVencimento` deveria devolver uma data 30 dias após o início sem alterar `$dataInicio`. No entanto, como usa `DateTime`, o início também foi alterado para o vencimento! Corrija substituindo `DateTime` por `DateTimeImmutable`.',
    goal: 'Substituir DateTime por DateTimeImmutable para garantir imutabilidade temporal.',
    bugDescription: 'DateTime muta in-place a data original quando add() é executado.',
    buggyLineNumbers: [3],
    initialBuggyCode: `<?php

function calcularVencimento(string $dataInicioStr): array {
    // BUG: DateTime é mutável!
    $inicio = new DateTime($dataInicioStr);
    $vencimento = $inicio->add(new DateInterval('P30D'));

    return [
        'inicio' => $inicio->format('Y-m-d'),
        'vencimento' => $vencimento->format('Y-m-d')
    ];
}
`,
    templateCode: `<?php

function calcularVencimento(string $dataInicioStr): array {
    // Use a classe imutável recomendada para PHP moderno:
    $inicio = new DateTimeImmutable($dataInicioStr);
    $vencimento = $inicio->add(new DateInterval('P30D'));

    return [
        'inicio' => $inicio->format('Y-m-d'),
        'vencimento' => $vencimento->format('Y-m-d')
    ];
}
`,
    solutionCode: `<?php

function calcularVencimento(string $dataInicioStr): array {
    $inicio = new DateTimeImmutable($dataInicioStr);
    $vencimento = $inicio->add(new DateInterval('P30D'));

    return [
        'inicio' => $inicio->format('Y-m-d'),
        'vencimento' => $vencimento->format('Y-m-d')
    ];
}
`,
    hints: [
      'Dica 1: Troque "new DateTime(" por "new DateTimeImmutable(".',
      'Dica 2: DateTimeImmutable->add() retorna uma nova instância, preservando o valor de $inicio intacto.',
    ],
    testCases: [
      {
        description: 'Início permanece inalterado e vencimento avança 30 dias',
        expectedOutput: 'inicio !== vencimento',
      },
    ],
    validationRules: [
      {
        id: 'rule-immutable',
        description: 'Uso de DateTimeImmutable',
        type: 'contains',
        target: 'DateTimeImmutable',
      },
    ],
    explanation: 'DateTimeImmutable é a melhor prática recomendada em PHP 8+. Qualquer operação matemática (add, sub, modify) retorna uma nova instância com a alteração, garantindo que a data original nunca seja adulterada.',
  },

  // ==========================================
  // PREVER A SAÍDA (5 exercícios)
  // ==========================================
  {
    id: 'php-inter-prever-02',
    language: 'php',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'PHP 8 & Operador Nullsafe (?->)',
    title: 'Previsão de Saída: Operador Nullsafe (?->) no PHP 8',
    summary: 'Preveja como o operador ?-> previne o fatal error de "Call to a member function on null".',
    realWorldContext: 'Antes do PHP 8, encadear métodos ($cliente->getEndereco()->getCidade()) exigia múltiplos if (!empty(...)) aninhados. O operador nullsafe simplifica o acesso encadeado com retorno null automático.',
    description: 'Observe o encadeamento com nullsafe em um objeto cliente cujo endereço é null. Preveja o que o operador null coalescing imprimirá.',
    goal: 'Prever a saída do operador nullsafe encadeado.',
    templateCode: `<?php

class Cliente {
    public function getEndereco(): ?object {
        return null; // Não possui endereço cadastrado
    }
}

$cliente = new Cliente();
// Se getEndereco() for null, o método getCidade() não é chamado e a expressão resulta em null
$cidade = $cliente->getEndereco()?->getCidade() ?? "Não informada";

echo $cidade;
`,
    codeToPredict: `<?php

class Cliente {
    public function getEndereco(): ?object {
        return null;
    }
}

$cliente = new Cliente();
$cidade = $cliente->getEndereco()?->getCidade() ?? "Não informada";

echo $cidade;`,
    expectedOutputPrediction: 'Não informada',
    acceptableOutputPredictions: ['Não informada', 'Nao informada'],
    solutionCode: `<?php

// $cliente->getEndereco() retorna null
// ?->getCidade() interrompe a cadeia sem disparar erro fatal
// O operador ?? atribui "Não informada"
echo "Não informada";`,
    hints: [
      'Dica 1: Quando a parte esquerda do ?-> é null, a chamada do método seguinte é cancelada e retorna null imediatamente.',
      'Dica 2: O operador ?? assume o valor da direita quando a expressão é null.',
    ],
    testCases: [
      {
        description: 'Imprime "Não informada"',
        expectedOutput: 'Não informada',
      },
    ],
    explanation: 'O operador nullsafe (?->) avalia o operando à esquerda. Se for null, o restante da cadeia de métodos é abortado sem lançar o clássico Fatal Error do PHP 7, devolvendo null para o operador coalescente.',
  },

  {
    id: 'php-inter-prever-03',
    language: 'php',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'POO & Cópia de Objetos por Referência',
    title: 'Previsão de Saída: Atribuição de Objetos por Referência vs Clone',
    summary: 'Entenda por que atribuir um objeto a uma nova variável ($b = $a) aponta para a mesma referência em memória.',
    realWorldContext: 'Em PHP 5+, variáveis que contêm objetos guardam identificadores de referência. Alterar uma propriedade em $b afeta $a, a menos que a palavra-chave clone seja utilizada.',
    description: 'Analise a alteração de propriedade do objeto e preveja o valor impresso de `$obj1->valor`.',
    goal: 'Prever a mutação compartilhada em objetos sem clone.',
    templateCode: `<?php

class Caixa {
    public int $valor = 10;
}

$obj1 = new Caixa();
$obj2 = $obj1; // Aponta para a mesma instância em memória!
$obj2->valor = 50;

echo $obj1->valor;
`,
    codeToPredict: `<?php

class Caixa {
    public int $valor = 10;
}

$obj1 = new Caixa();
$obj2 = $obj1;
$obj2->valor = 50;

echo $obj1->valor;`,
    expectedOutputPrediction: '50',
    acceptableOutputPredictions: ['50'],
    solutionCode: `<?php

// Em PHP, $obj2 = $obj1 copia o handle do objeto, não o objeto em si.
// Modificar $obj2 altera o mesmo objeto acessado por $obj1.
echo 50;`,
    hints: [
      'Dica 1: Em PHP, objetos são atribuídos por referência de handle.',
      'Dica 2: Para criar uma cópia independente seria necessário $obj2 = clone $obj1.',
    ],
    testCases: [
      {
        description: 'Imprime 50',
        expectedOutput: '50',
      },
    ],
    explanation: 'Ao atribuir uma variável contendo um objeto a outra ($obj2 = $obj1), ambas passam a apontar para a mesma instância em memória. Alterar $obj2->valor altera também o valor lido através de $obj1.',
  },

  {
    id: 'php-inter-prever-04',
    language: 'php',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'PHP 8 & Expressão match',
    title: 'Previsão de Saída: Comparação Estrita (===) na Expressão match',
    summary: 'Descubra como a expressão match do PHP 8 difere do switch ao utilizar checagem estrita de tipos.',
    realWorldContext: 'O switch clássico do PHP faz comparações frouxas (==), convertendo tipos e causando bugs. O match faz estritamente ===, exigindo correspondência de tipo exata.',
    description: 'Analise o valor "1" (string) sendo avaliado na expressão match contra o número 1 (inteiro). Preveja a saída.',
    goal: 'Prever a divergência entre string e inteiro na expressão match.',
    templateCode: `<?php

$codigo = "1"; // string com o caractere "1"

$resultado = match ($codigo) {
    1 => "NUMERO_UM",
    "1" => "STRING_UM",
    default => "OUTRO",
};

echo $resultado;
`,
    codeToPredict: `<?php

$codigo = "1";

$resultado = match ($codigo) {
    1 => "NUMERO_UM",
    "1" => "STRING_UM",
    default => "OUTRO",
};

echo $resultado;`,
    expectedOutputPrediction: 'STRING_UM',
    acceptableOutputPredictions: ['STRING_UM'],
    solutionCode: `<?php

// A expressão match faz comparação estrita (===):
// "1" === 1 é false
// "1" === "1" é true -> "STRING_UM"
echo "STRING_UM";`,
    hints: [
      'Dica 1: O switch tradicional do PHP casaria com 1 (int) por coerção fraca.',
      'Dica 2: A expressão match exige estritamente que tipo e valor coincidam ("1" === "1").',
    ],
    testCases: [
      {
        description: 'Imprime "STRING_UM"',
        expectedOutput: 'STRING_UM',
      },
    ],
    explanation: 'Diferente do switch tradicional (que usa == e casaria com o primeiro 1 inteiro), a expressão match introduzida no PHP 8 executa comparação estrita (===), garantindo que a string "1" case apenas com o ramo de string.',
  },

  {
    id: 'php-inter-prever-05',
    language: 'php',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Tratamento de Exceções & Finally',
    title: 'Previsão de Saída: Ordem de Execução do Bloco finally',
    summary: 'Preveja a ordem dos prints quando um bloco try/catch captura uma exceção e executa o finally.',
    realWorldContext: 'O bloco finally é sempre executado, quer tenha havido exceção ou não, sendo utilizado para fechar conexões com banco, descritores de arquivo ou desbloquear semáforos.',
    description: 'Acompanhe o fluxo da exceção e preveja a sequência das três letras impressas.',
    goal: 'Determinar a ordem exata de execução de try, catch e finally.',
    templateCode: `<?php

$log = [];

try {
    $log[] = "A";
    throw new Exception("Falha de teste");
    $log[] = "B"; // nunca executado
} catch (Exception $e) {
    $log[] = "C";
} finally {
    $log[] = "D";
}

echo implode("-", $log);
`,
    codeToPredict: `<?php

$log = [];

try {
    $log[] = "A";
    throw new Exception("Falha");
    $log[] = "B";
} catch (Exception $e) {
    $log[] = "C";
} finally {
    $log[] = "D";
}

echo implode("-", $log);`,
    expectedOutputPrediction: 'A-C-D',
    acceptableOutputPredictions: ['A-C-D', 'A - C - D'],
    solutionCode: `<?php

// 1. Entra no try: adiciona "A"
// 2. Lança exceção: pula a linha "B" e salta para o catch: adiciona "C"
// 3. Executa o bloco de limpeza finally: adiciona "D"
echo "A-C-D";`,
    hints: [
      'Dica 1: As instruções após o throw dentro do try são ignoradas.',
      'Dica 2: O bloco finally é executado logo após o catch.',
    ],
    testCases: [
      {
        description: 'Imprime "A-C-D"',
        expectedOutput: 'A-C-D',
      },
    ],
    explanation: 'Ao lançar a exceção, o interpretador interrompe imediatamente o try (pulando "B") e desvia para o catch correspondente (adicionando "C"). Ao término do tratamento, o bloco finally é executado de forma garantida (adicionando "D").',
  },

  {
    id: 'php-inter-prever-06',
    language: 'php',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Arrays & Funções de Callback',
    title: 'Previsão de Saída: array_map vs array_filter',
    summary: 'Preveja a contagem de elementos resultantes ao encadear transformações com array_filter e array_map.',
    realWorldContext: 'Processar listas de pedidos filtrando os inativos e mapeando para seus valores monetários é uma das tarefas mais comuns do dia a dia.',
    description: 'Analise o array de números [1, 2, 3, 4, 5], filtre os ímpares e multiplique por 2. Preveja a soma final dos valores com array_sum.',
    goal: 'Prever a soma dos números pares multiplicados por 2.',
    templateCode: `<?php

$numeros = [1, 2, 3, 4, 5];

// Filtra apenas os números pares ($n % 2 === 0)
$pares = array_filter($numeros, fn($n) => $n % 2 === 0); // [2, 4]

// Multiplica cada par por 2
$dobrados = array_map(fn($n) => $n * 2, $pares); // [4, 8]

echo array_sum($dobrados);
`,
    codeToPredict: `<?php

$numeros = [1, 2, 3, 4, 5];

$pares = array_filter($numeros, fn($n) => $n % 2 === 0);
$dobrados = array_map(fn($n) => $n * 2, $pares);

echo array_sum($dobrados);`,
    expectedOutputPrediction: '12',
    acceptableOutputPredictions: ['12'],
    solutionCode: `<?php

// Pares: 2 e 4
// Dobrados: 4 e 8
// Soma: 4 + 8 = 12
echo 12;`,
    hints: [
      'Dica 1: O array_filter seleciona 2 e 4.',
      'Dica 2: O array_map dobra esses valores para 4 e 8.',
      'Dica 3: array_sum([4, 8]) resulta em 12.',
    ],
    testCases: [
      {
        description: 'Imprime 12',
        expectedOutput: '12',
      },
    ],
    explanation: 'array_filter($numeros) extrai os elementos cujo módulo da divisão por 2 é zero ([2, 4]). Em seguida, array_map multiplica cada item por 2 ([4, 8]). A soma total com array_sum resulta em 12.',
  },

  // ==========================================
  // DESAFIOS PRÁTICOS (5 exercícios)
  // ==========================================
  {
    id: 'php-inter-desafio-02',
    language: 'php',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'PDO & Arquitetura de Dados',
    title: 'Desafio Prático: Repositório de Usuário com Inserção Segura em PDO',
    summary: 'Construa uma classe de repositório que prepara a instrução SQL de inserção e retorna o ID recém-criado com lastInsertId().',
    realWorldContext: 'Separar o acesso a banco de dados em classes Repository é o padrão da arquitetura limpa (Clean Architecture / Domain-Driven Design) em projetos PHP.',
    description: 'Crie a classe `UsuarioRepository` com o método `public function criar(PDO $pdo, string $nome, string $email): int`:\n1. Preparar a query: `INSERT INTO usuarios (nome, email) VALUES (:nome, :email)`.\n2. Executar passando o array `[\':nome\' => $nome, \':email\' => $email]`.\n3. Retornar `(int)$pdo->lastInsertId()`.',
    goal: 'Implementar a persistência parametrizada segura e retornar o ID gerado.',
    practicalRequirements: [
      'Classe nomeada UsuarioRepository',
      'Método criar(PDO $pdo, string $nome, string $email): int',
      'Uso obrigatório de $pdo->prepare() com placeholders',
      'Execução parametrizada com execute()',
      'Retorno do ID inteiro gerado via (int)$pdo->lastInsertId()',
    ],
    templateCode: `<?php

class UsuarioRepository {
    public function criar(PDO $pdo, string $nome, string $email): int {
        // Implemente a inserção segura com prepared statement e devolva o lastInsertId
    }
}
`,
    solutionCode: `<?php

class UsuarioRepository {
    public function criar(PDO $pdo, string $nome, string $email): int {
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email) VALUES (:nome, :email)");
        $stmt->execute([
            ':nome' => $nome,
            ':email' => $email,
        ]);
        return (int)$pdo->lastInsertId();
    }
}
`,
    hints: [
      'Dica 1: Use $stmt = $pdo->prepare("INSERT INTO usuarios ...").',
      'Dica 2: Passe os parâmetros no método execute([":nome" => $nome, ...]).',
      'Dica 3: Use (int)$pdo->lastInsertId() para o retorno tipado.',
    ],
    testCases: [
      {
        description: 'Repositório insere usuário com prepared statement e retorna int',
        expectedOutput: 'id retornado como inteiro',
      },
    ],
    validationRules: [
      {
        id: 'rule-class-repo',
        description: 'Declaração da classe UsuarioRepository',
        type: 'contains',
        target: 'class UsuarioRepository',
      },
      {
        id: 'rule-prepare',
        description: 'Uso de $pdo->prepare()',
        type: 'contains',
        target: 'prepare',
      },
      {
        id: 'rule-last-id',
        description: 'Uso de lastInsertId()',
        type: 'contains',
        target: 'lastInsertId',
      },
    ],
    explanation: 'O padrão Repository encapsula a lógica de persistência e isola as queries SQL do restante da aplicação, facilitando testes automatizados com mocks e manutenção futura.',
  },

  {
    id: 'php-inter-desafio-03',
    language: 'php',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Sessões & Segurança',
    title: 'Desafio Prático: Autenticação Segura com Regeneração de Sessão',
    summary: 'Construa a rotina de pós-login que regenera o ID de sessão para blindar a aplicação contra ataques de fixação de sessão.',
    realWorldContext: 'Ataques de Fixação de Sessão (Session Fixation) ocorrem quando um invasor induz o usuário a logar com um ID pré-existente. Chamar session_regenerate_id(true) no momento do login destrói a sessão antiga e gera um novo identificador inatacável.',
    description: 'Crie a função `iniciarSessaoAutenticada(int $usuarioId, string $email): void`:\n1. Verificar se a sessão já está ativa (`session_status() === PHP_SESSION_ACTIVE`); se não estiver, chamar `session_start()`.\n2. Regenerar o ID da sessão apagando a antiga: `session_regenerate_id(true)`.\n3. Salvar `$_SESSION["usuario_id"] = $usuarioId` e `$_SESSION["email"] = $email`.\n4. Gravar `$_SESSION["login_timestamp"] = time()`.',
    goal: 'Proteger a sessão contra fixação com session_regenerate_id(true).',
    practicalRequirements: [
      'Garantir sessão ativa com session_start()',
      'Invocar session_regenerate_id(true) para invalidar o cookie antigo',
      'Salvar usuario_id e email no array $_SESSION',
      'Registrar timestamp do login com time()',
    ],
    templateCode: `<?php

function iniciarSessaoAutenticada(int $usuarioId, string $email): void {
    // 1. Garantir session_start()
    
    // 2. Regenerar ID de sessão
    
    // 3. Gravar dados na $_SESSION
}
`,
    solutionCode: `<?php

function iniciarSessaoAutenticada(int $usuarioId, string $email): void {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    session_regenerate_id(true);

    $_SESSION['usuario_id'] = $usuarioId;
    $_SESSION['email'] = $email;
    $_SESSION['login_timestamp'] = time();
}
`,
    hints: [
      'Dica 1: session_regenerate_id(true) com parâmetro booleano true apaga o arquivo temporário da sessão antiga.',
      'Dica 2: Preencha as chaves de $_SESSION logo após a regeneração.',
    ],
    testCases: [
      {
        description: 'Sessão regenerada e chaves registradas',
        expectedOutput: 'Sessão blindada contra fixação',
      },
    ],
    validationRules: [
      {
        id: 'rule-regenerate',
        description: 'Uso de session_regenerate_id(true)',
        type: 'contains',
        target: 'session_regenerate_id(true)',
      },
      {
        id: 'rule-session-var',
        description: 'Gravação na variável superglobal $_SESSION',
        type: 'contains',
        target: '$_SESSION',
      },
    ],
    explanation: 'Regenerar o ID de sessão na transição de privilégios (especialmente após login com credenciais válidas) é uma exigência das diretrizes de segurança da OWASP para mitigar o roubo de sessões.',
  },

  {
    id: 'php-inter-desafio-04',
    language: 'php',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Segurança & Uploads',
    title: 'Desafio Prático: Validador de Upload de Arquivo por Tamanho e Extensão',
    summary: 'Construa uma rotina de validação de uploads que inspeciona o código de erro, o tamanho máximo em bytes e extensões permitidas.',
    realWorldContext: 'Nunca confie no arquivo enviado em $_FILES["foto"]. Hackers costumam subir scripts maliciosos .php disfarçados ou enviar arquivos gigantescos para causar negação de serviço (DoS).',
    description: 'Implemente a função `validarUpload(array $arquivoUpload, int $maxBytes, array $extensoesPermitidas): array`:\n- Se `$arquivoUpload["error"] !== UPLOAD_ERR_OK`, retornar `["valido" => false, "motivo" => "Erro no upload"]`.\n- Se `$arquivoUpload["size"] > $maxBytes`, retornar `["valido" => false, "motivo" => "Arquivo excede o tamanho permitido"]`.\n- Extrair a extensão do nome do arquivo (`pathinfo($arquivoUpload["name"], PATHINFO_EXTENSION)`) em minúsculas e checar se está contida em `$extensoesPermitidas`.\n- Se a extensão for inválida, retornar `["valido" => false, "motivo" => "Extensão não autorizada"]`.\n- Se passar em tudo, retornar `["valido" => true, "extensao" => $ext]`.',
    goal: 'Validar integridade de uploads com base em código de erro, tamanho e extensão segura.',
    practicalRequirements: [
      'Checar se error === UPLOAD_ERR_OK',
      'Validar se size <= maxBytes',
      'Extrair extensão com pathinfo(..., PATHINFO_EXTENSION)',
      'Checar com in_array em $extensoesPermitidas',
      'Retornar array com status booleano e mensagem',
    ],
    templateCode: `<?php

function validarUpload(array $arquivoUpload, int $maxBytes, array $extensoesPermitidas): array {
    // Implemente a validação completa do upload
}
`,
    solutionCode: `<?php

function validarUpload(array $arquivoUpload, int $maxBytes, array $extensoesPermitidas): array {
    if (!isset($arquivoUpload['error']) || $arquivoUpload['error'] !== UPLOAD_ERR_OK) {
        return ['valido' => false, 'motivo' => 'Erro no upload'];
    }

    if ($arquivoUpload['size'] > $maxBytes) {
        return ['valido' => false, 'motivo' => 'Arquivo excede o tamanho permitido'];
    }

    $ext = strtolower(pathinfo($arquivoUpload['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $extensoesPermitidas, true)) {
        return ['valido' => false, 'motivo' => 'Extensão não autorizada'];
    }

    return ['valido' => true, 'extensao' => $ext];
}
`,
    hints: [
      'Dica 1: Use a constante nativa UPLOAD_ERR_OK (que equivale a 0).',
      'Dica 2: pathinfo($name, PATHINFO_EXTENSION) extrai apenas a terminação (ex: "png").',
      'Dica 3: Sempre aplique strtolower() na extensão antes da comparação.',
    ],
    testCases: [
      {
        description: 'Arquivo PDF de 500KB validado com sucesso',
        expectedOutput: 'valido => true',
      },
    ],
    validationRules: [
      {
        id: 'rule-pathinfo',
        description: 'Uso de pathinfo com PATHINFO_EXTENSION',
        type: 'contains',
        target: 'PATHINFO_EXTENSION',
      },
      {
        id: 'rule-upload-ok',
        description: 'Checagem de UPLOAD_ERR_OK',
        type: 'contains',
        target: 'UPLOAD_ERR_OK',
      },
    ],
    explanation: 'Validação defensiva de uploads no servidor é a barreira crítica contra ataques de Remote Code Execution (RCE) causados por upload de arquivos PHP maliciosos na pasta pública da aplicação.',
  },

  {
    id: 'php-inter-desafio-05',
    language: 'php',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Cálculos Financeiros & Regras de Negócio',
    title: 'Desafio Prático: Simulador de Parcelamento com Juros Simples',
    summary: 'Construa um simulador de parcelas de checkout com juros percentuais mensais e arredondamento financeiro.',
    realWorldContext: 'Sistemas de checkout e maquininhas de cartão calculam parcelamentos em 1x a 12x com taxas configuráveis pelo lojista.',
    description: 'Implemente a função `calcularParcelamento(float $valorTotal, int $numParcelas, float $taxaMensalPercentual): array`:\n- Se `$numParcelas === 1`: sem juros, valor da parcela = `$valorTotal`.\n- Se `$numParcelas > 1`: aplicar juros simples sobre o total: `$totalComJuros = $valorTotal * (1 + ($taxaMensalPercentual / 100) * $numParcelas)`.\n- O valor de cada parcela deve ser arredondado para duas casas: `round($totalComJuros / $numParcelas, 2)`.\n- Retornar array associativo: `["parcelas" => $numParcelas, "valor_parcela" => $valorParcela, "total" => round($valorParcela * $numParcelas, 2)]`.',
    goal: 'Calcular parcelamento e devolver array financeiro estruturado.',
    practicalRequirements: [
      'Tratar compra à vista em 1x sem acréscimo de juros',
      'Calcular juros proporcionais ao número de parcelas para > 1x',
      'Arredondar parcelas para duas casas com round(..., 2)',
      'Retornar chaves: parcelas, valor_parcela, total',
    ],
    templateCode: `<?php

function calcularParcelamento(float $valorTotal, int $numParcelas, float $taxaMensalPercentual): array {
    // Calcule o parcelamento de acordo com as regras
}

// Teste:
print_r(calcularParcelamento(1000.0, 3, 2.0)); // 3x com 2% ao mês
`,
    solutionCode: `<?php

function calcularParcelamento(float $valorTotal, int $numParcelas, float $taxaMensalPercentual): array {
    if ($numParcelas <= 1) {
        return [
            'parcelas' => 1,
            'valor_parcela' => round($valorTotal, 2),
            'total' => round($valorTotal, 2),
        ];
    }

    $jurosTotal = ($taxaMensalPercentual / 100) * $numParcelas;
    $totalComJuros = $valorTotal * (1 + $jurosTotal);
    $valorParcela = round($totalComJuros / $numParcelas, 2);

    return [
        'parcelas' => $numParcelas,
        'valor_parcela' => $valorParcela,
        'total' => round($valorParcela * $numParcelas, 2),
    ];
}
`,
    hints: [
      'Dica 1: Para 1x retorne o valor original sem aplicar taxas.',
      'Dica 2: Use round($num, 2) para manter precisão de centavos.',
    ],
    testCases: [
      {
        description: 'Calcula 3x com juros simples',
        expectedOutput: 'parcelas => 3',
      },
    ],
    validationRules: [
      {
        id: 'rule-round',
        description: 'Uso de round() para centavos',
        type: 'contains',
        target: 'round',
      },
    ],
    explanation: 'Cálculos de parcelamento requerem tratamento cuidadoso de centavos para evitar discrepâncias contábeis na conciliação financeira do fechamento do carrinho.',
  },

  {
    id: 'php-inter-desafio-06',
    language: 'php',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'PDO & Segurança Avançada',
    title: 'Desafio Prático: Sanitizador de Ordenação Dinâmica em SQL com Whitelist',
    summary: 'Construa uma função segura para montar cláusulas ORDER BY em PDO sem permitir injeção SQL em nomes de coluna.',
    realWorldContext: 'Em PDO, placeholders preparados (:coluna) funcionam APENAS para valores literais de dados (WHERE nome = :nome), mas NÃO podem ser usados em nomes de colunas ou comandos (ORDER BY :coluna falha ou não protege). A única forma segura de permitir ordenação dinâmica é com Lista Branca (Whitelist).',
    description: 'Implemente a função `montarOrderBySeguro(string $colunaSolicitada, string $direcaoSolicitada): string`:\n- Colunas permitidas (Whitelist): `["id", "nome", "preco", "criado_em"]`.\n- Se `$colunaSolicitada` não estiver na whitelist, utilizar a coluna padrão `"id"`.\n- Direções permitidas: `["ASC", "DESC"]` (em maiúsculas).\n- Se `$direcaoSolicitada` for diferente de "DESC", utilizar `"ASC"`.\n- Retornar a string no formato `"ORDER BY {$colunaSegura} {$direcaoSegura}"`.',
    goal: 'Proteger cláusulas ORDER BY contra SQL Injection via whitelist estrita.',
    practicalRequirements: [
      'Validar coluna solicitada contra whitelist de colunas',
      'Definir fallback seguro para "id" se coluna não permitida',
      'Validar direção apenas para ASC ou DESC',
      'Retornar string formatada "ORDER BY coluna DIRECAO"',
    ],
    templateCode: `<?php

function montarOrderBySeguro(string $colunaSolicitada, string $direcaoSolicitada): string {
    $colunasPermitidas = ['id', 'nome', 'preco', 'criado_em'];
    // Implemente a validação com whitelist aqui
}

// Testes:
echo montarOrderBySeguro("preco", "desc"); // ORDER BY preco DESC
echo montarOrderBySeguro("senha_admin; DROP TABLE", "ASC"); // ORDER BY id ASC (ataque neutralizado)
`,
    solutionCode: `<?php

function montarOrderBySeguro(string $colunaSolicitada, string $direcaoSolicitada): string {
    $colunasPermitidas = ['id', 'nome', 'preco', 'criado_em'];

    $colunaSegura = in_array($colunaSolicitada, $colunasPermitidas, true)
        ? $colunaSolicitada
        : 'id';

    $direcaoSegura = strtoupper(trim($direcaoSolicitada)) === 'DESC'
        ? 'DESC'
        : 'ASC';

    return "ORDER BY {$colunaSegura} {$direcaoSegura}";
}
`,
    hints: [
      'Dica 1: in_array($colunaSolicitada, $colunasPermitidas, true) rejeita qualquer coluna fora da lista.',
      'Dica 2: Use operador ternário para atribuir "id" quando a coluna for inválida.',
    ],
    testCases: [
      {
        description: 'Ataque de injeção em coluna é neutralizado e cai no padrão "id"',
        expectedOutput: 'ORDER BY id ASC',
      },
    ],
    validationRules: [
      {
        id: 'rule-whitelist',
        description: 'Uso de in_array com lista branca',
        type: 'contains',
        target: 'in_array',
      },
      {
        id: 'rule-order-return',
        description: 'Retorno com ORDER BY formatado',
        type: 'contains',
        target: 'ORDER BY',
      },
    ],
    explanation: 'Como o PDO não permite vincular identificadores de schema (tabelas e colunas) via parâmetros preparados, a técnica de Lista Branca (Whitelist) é o padrão ouro de segurança para ordenação e paginação dinâmica.',
  },
];

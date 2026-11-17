import { Exercise } from '../../types/exercise';

export const phpAdvancedModalities: Exercise[] = [
  // ==========================================
  // CORRIGIR ERROS (5 exercícios)
  // ==========================================
  {
    id: 'php-avancado-debug-02',
    language: 'php',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Segurança & SQL Injection',
    title: 'Depuração: Sanitização Segura de ORDER BY Dinâmico no PDO',
    summary: 'Corrija vulnerabilidade de SQL Injection em cláusulas ORDER BY onde placeholders com "?" não funcionam.',
    realWorldContext: 'No PDO, placeholders preparados vinculam apenas valores literais, e NÃO identificadores (nomes de colunas ou direções ASC/DESC). Passar inputs de ordenação diretamente na query abre brechas críticas de SQL Injection.',
    description: 'Um desenvolvedor concatenou a coluna de ordenação recebida do usuário diretamente na consulta SQL: "ORDER BY " . $coluna. Como o PDO não aceita parâmetros preparados em cláusulas estruturais, utilize uma lista branca (whitelist) rígida com correspondência estrita e lance uma InvalidArgumentException se a coluna não for permitida.',
    goal: 'Validar a coluna contra uma whitelist restrita de campos permitidos antes de concatenar na query SQL.',
    bugDescription: 'A variável de ordenação é concatenada sem validação na query, permitindo injeção de comandos SQL arbitrários.',
    buggyLineNumbers: [7],
    initialBuggyCode: `<?php

function listarUsuariosOrdenados(PDO $pdo, string $colunaOrdenacao): array {
    // BUG CRÍTICO: Placeholders não funcionam em identificadores e concatenar é inseguro!
    $sql = "SELECT id, nome, email FROM usuarios ORDER BY " . $colunaOrdenacao;
    $stmt = $pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
`,
    templateCode: `<?php

function listarUsuariosOrdenados(PDO $pdo, string $colunaOrdenacao): array {
    $colunasPermitidas = ['nome', 'email', 'criado_em'];
    
    // Corrija aqui: se $colunaOrdenacao não estiver em $colunasPermitidas, lance InvalidArgumentException
    if (!in_array($colunaOrdenacao, $colunasPermitidas, true)) {
        throw new InvalidArgumentException("Coluna de ordenação inválida");
    }

    $sql = "SELECT id, nome, email FROM usuarios ORDER BY " . $colunaOrdenacao;
    $stmt = $pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
`,
    solutionCode: `<?php

function listarUsuariosOrdenados(PDO $pdo, string $colunaOrdenacao): array {
    $colunasPermitidas = ['nome', 'email', 'criado_em'];
    if (!in_array($colunaOrdenacao, $colunasPermitidas, true)) {
        throw new InvalidArgumentException("Coluna de ordenação inválida");
    }

    $sql = "SELECT id, nome, email FROM usuarios ORDER BY " . $colunaOrdenacao;
    $stmt = $pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
`,
    hints: [
      'Crie um array com as colunas autorizadas: ["nome", "email", "criado_em"].',
      'Utilize in_array($colunaOrdenacao, $colunasPermitidas, true) para comparação estrita.',
      'Se a coluna não for autorizada, dispare throw new InvalidArgumentException("Coluna de ordenação inválida");'
    ],
    testCases: [
      {
        description: 'Valida coluna permitida e bloqueia injeção',
        expectedOutput: 'OK',
      }
    ],
    explanation: 'Placeholders do PDO não podem ser utilizados em nomes de tabelas ou colunas de ORDER BY. A proteção padrão recomendada pela OWASP é a validação com whitelist estrita.',
    validationRules: [
      { id: 'rule-in-array', type: 'contains', target: 'in_array', description: 'Uso de in_array estrito' },
      { id: 'rule-exception', type: 'contains', target: 'InvalidArgumentException', description: 'Lançamento de InvalidArgumentException' },
      { id: 'rule-whitelist', type: 'contains', target: 'colunasPermitidas', description: 'Definição da whitelist de colunas' }
    ]
  },
  {
    id: 'php-avancado-debug-03',
    language: 'php',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Autenticação & JWT',
    title: 'Depuração: Vulnerabilidade de Algoritmo "none" em Token JWT',
    summary: 'Corrija um validador de JWT que aceita tokens com cabeçalho de assinatura desativada (alg "none").',
    realWorldContext: 'Uma falha histórica famosa em bibliotecas de JWT permitia que invasores alterassem o cabeçalho para "alg": "none", fazendo com que o servidor ignorasse a checagem da assinatura criptográfica e concedesse acesso de administrador.',
    description: 'A função verificarTokenJWT decodifica o cabeçalho do token e valida o HMAC-SHA256, mas se o invasor enviar alg: "none", ela aceita a verificação sem calcular a assinatura! Garanta que o algoritmo seja estritamente verificado contra "HS256".',
    goal: 'Rejeitar qualquer token cujo cabeçalho não especifique explicitamente o algoritmo HS256.',
    bugDescription: 'Se o cabeçalho tiver alg === "none", a função ignora a checagem hash_hmac e valida o token forjado.',
    buggyLineNumbers: [10],
    initialBuggyCode: `<?php

function verificarTokenJWT(string $jwt, string $chaveSecreta): bool {
    $partes = explode('.', $jwt);
    if (count($partes) !== 3) return false;
    [$headerB64, $payloadB64, $assinaturaB64] = $partes;
    
    $header = json_decode(base64_decode($headerB64), true);
    
    // BUG CRÍTICO: Aceita alg "none" sem checagem de assinatura!
    if (($header['alg'] ?? '') === 'none') {
        return true; 
    }

    $assinaturaCalculada = hash_hmac('sha256', "$headerB64.$payloadB64", $chaveSecreta, false);
    return hash_equals($assinaturaCalculada, base64_decode($assinaturaB64));
}
`,
    templateCode: `<?php

function verificarTokenJWT(string $jwt, string $chaveSecreta): bool {
    $partes = explode('.', $jwt);
    if (count($partes) !== 3) return false;
    [$headerB64, $payloadB64, $assinaturaB64] = $partes;
    
    $header = json_decode(base64_decode($headerB64), true);
    
    // Corrija aqui: Rejeite se o alg NÃO for exatamente 'HS256'
    if (($header['alg'] ?? '') !== 'HS256') {
        return false;
    }

    $assinaturaCalculada = hash_hmac('sha256', "$headerB64.$payloadB64", $chaveSecreta, false);
    return hash_equals($assinaturaCalculada, base64_decode($assinaturaB64));
}
`,
    solutionCode: `<?php

function verificarTokenJWT(string $jwt, string $chaveSecreta): bool {
    $partes = explode('.', $jwt);
    if (count($partes) !== 3) return false;
    [$headerB64, $payloadB64, $assinaturaB64] = $partes;
    
    $header = json_decode(base64_decode($headerB64), true);
    if (($header['alg'] ?? '') !== 'HS256') {
        return false;
    }

    $assinaturaCalculada = hash_hmac('sha256', "$headerB64.$payloadB64", $chaveSecreta, false);
    return hash_equals($assinaturaCalculada, base64_decode($assinaturaB64));
}
`,
    hints: [
      'Substitua o if que retorna true no algoritmo "none" por uma rejeição expressa.',
      'Verifique se ($header["alg"] ?? "") !== "HS256" e retorne false imediatamente.'
    ],
    testCases: [
      {
        description: 'Rejeita algoritmo none e valida HS256',
        expectedOutput: 'true',
      }
    ],
    explanation: 'Sempre exija explicitamente o algoritmo esperado pelo servidor. Nunca permita que o cliente dite a ausência de criptografia em tokens de autorização.',
    validationRules: [
      { id: 'rule-alg', type: 'contains', target: "!== 'HS256'", description: 'Exigência estrita do algoritmo HS256' },
      { id: 'rule-hash-equals', type: 'contains', target: 'hash_equals', description: 'Uso de hash_equals contra timing attacks' }
    ]
  },
  {
    id: 'php-avancado-debug-04',
    language: 'php',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Arquitetura & IoC Container',
    title: 'Depuração: Detecção de Dependência Cíclica no Container de Injeção',
    summary: 'Evite recursão infinita e estouro de pilha (Stack Overflow) detectando ciclos de injeção de dependência.',
    realWorldContext: 'Em frameworks modernos (Laravel, Symfony), se o Serviço A depende do Serviço B e o Serviço B depende do Serviço A, a resolução recursiva congela a aplicação se não houver detecção de ciclo.',
    description: 'O método resolve do Container instancia classes recursivamente, mas trava em loop infinito quando há dependência cíclica. Mantenha um rastreador $resolvendo = [] durante a pilha e lance uma RuntimeException ao detectar que uma classe já está sendo resolvida.',
    goal: 'Verificar se a classe já está na lista de classes atualmente em resolução antes de continuar.',
    bugDescription: 'O container chama resolve() indefinidamente sem rastrear a cadeia de chamadas atual, causando crash do processo PHP.',
    buggyLineNumbers: [6],
    initialBuggyCode: `<?php

class SimpleContainer {
    private array $bindings = [];

    public function get(string $id) {
        // BUG: Não rastreia instâncias em andamento!
        return $this->resolve($id);
    }

    private function resolve(string $id) {
        $reflection = new ReflectionClass($id);
        $constructor = $reflection->getConstructor();
        if (!$constructor) return new $id();

        $args = [];
        foreach ($constructor->getParameters() as $param) {
            $type = $param->getType();
            $args[] = $this->resolve($type->getName());
        }
        return $reflection->newInstanceArgs($args);
    }
}
`,
    templateCode: `<?php

class SimpleContainer {
    private array $bindings = [];
    private array $resolvendo = [];

    public function get(string $id) {
        return $this->resolve($id);
    }

    private function resolve(string $id) {
        // Corrija aqui: Se $id já estiver em $this->resolvendo, lance RuntimeException
        if (isset($this->resolvendo[$id])) {
            throw new RuntimeException("Dependência cíclica detectada: " . $id);
        }

        $this->resolvendo[$id] = true;

        try {
            $reflection = new ReflectionClass($id);
            $constructor = $reflection->getConstructor();
            if (!$constructor) return new $id();

            $args = [];
            foreach ($constructor->getParameters() as $param) {
                $type = $param->getType();
                $args[] = $this->resolve($type->getName());
            }
            return $reflection->newInstanceArgs($args);
        } finally {
            unset($this->resolvendo[$id]);
        }
    }
}
`,
    solutionCode: `<?php

class SimpleContainer {
    private array $bindings = [];
    private array $resolvendo = [];

    public function get(string $id) {
        return $this->resolve($id);
    }

    private function resolve(string $id) {
        if (isset($this->resolvendo[$id])) {
            throw new RuntimeException("Dependência cíclica detectada: " . $id);
        }

        $this->resolvendo[$id] = true;

        try {
            $reflection = new ReflectionClass($id);
            $constructor = $reflection->getConstructor();
            if (!$constructor) return new $id();

            $args = [];
            foreach ($constructor->getParameters() as $param) {
                $type = $param->getType();
                $args[] = $this->resolve($type->getName());
            }
            return $reflection->newInstanceArgs($args);
        } finally {
            unset($this->resolvendo[$id]);
        }
    }
}
`,
    hints: [
      'Utilize o array $this->resolvendo[$id] para registrar que a classe está sendo processada.',
      'Lance RuntimeException antes de descer na recursão caso o ID já exista no array.',
      'No bloco finally, faça unset($this->resolvendo[$id]) para liberar a pilha.'
    ],
    testCases: [
      {
        description: 'Detecta ciclo de injeção A -> B -> A',
        expectedOutput: 'RuntimeException',
      }
    ],
    explanation: 'Containers de injeção profissionais utilizam pilha de resolução temporária. Usar o bloco finally assegura que a classe saia da pilha mesmo quando exceções de construção ocorrerem.',
    validationRules: [
      { id: 'rule-cycle-ex', type: 'contains', target: 'RuntimeException', description: 'Lançamento de RuntimeException no ciclo' },
      { id: 'rule-resolvendo', type: 'contains', target: 'resolvendo', description: 'Rastreio com array resolvendo' },
      { id: 'rule-finally', type: 'contains', target: 'finally', description: 'Limpeza no bloco finally' }
    ]
  },
  {
    id: 'php-avancado-debug-05',
    language: 'php',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Concorrência & Bloqueio',
    title: 'Depuração: Liberação Garantida de Lock em Mutex com flock',
    summary: 'Evite deadlocks em arquivos de lock liberando o recurso adequadamente mesmo em casos de falha.',
    realWorldContext: 'Em processamento concorrente de filas no PHP (como consumidores de cron e workers), locks de arquivo garantem exclusão mútua. Se um processo falha sem liberar LOCK_UN e fechar o handle, outros workers ficam travados.',
    description: 'A função executarComLock obtém um bloqueio exclusivo com flock($fp, LOCK_EX | LOCK_NB). No entanto, se o callback $tarefa disparar uma exceção, o arquivo nunca é desbloqueado. Envolva a execução do callback em try...finally garantindo o desbloqueio.',
    goal: 'Garantir que flock LOCK_UN e fclose ocorram no bloco finally.',
    bugDescription: 'Se $tarefa() lançar exceção, o código pula o flock(LOCK_UN) e o fclose, prendendo o lock no sistema operacional.',
    buggyLineNumbers: [10],
    initialBuggyCode: `<?php

function executarComLock(string $caminhoLock, callable $tarefa): mixed {
    $fp = fopen($caminhoLock, 'c+');
    if (!flock($fp, LOCK_EX | LOCK_NB)) {
        fclose($fp);
        throw new RuntimeException("Processo já em execução!");
    }

    // BUG: Se $tarefa() disparar exceção, o lock nunca é liberado!
    $resultado = $tarefa();

    flock($fp, LOCK_UN);
    fclose($fp);
    return $resultado;
}
`,
    templateCode: `<?php

function executarComLock(string $caminhoLock, callable $tarefa): mixed {
    $fp = fopen($caminhoLock, 'c+');
    if (!flock($fp, LOCK_EX | LOCK_NB)) {
        fclose($fp);
        throw new RuntimeException("Processo já em execução!");
    }

    // Corrija aqui utilizando try ... finally
    try {
        return $tarefa();
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}
`,
    solutionCode: `<?php

function executarComLock(string $caminhoLock, callable $tarefa): mixed {
    $fp = fopen($caminhoLock, 'c+');
    if (!flock($fp, LOCK_EX | LOCK_NB)) {
        fclose($fp);
        throw new RuntimeException("Processo já em execução!");
    }

    try {
        return $tarefa();
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}
`,
    hints: [
      'Envolva a invocação do $tarefa() em um bloco try.',
      'Coloque flock($fp, LOCK_UN) e fclose($fp) dentro de um bloco finally para garantir a execução mesmo em caso de exceções.'
    ],
    testCases: [
      {
        description: 'Libera o descritor de arquivo mesmo após erro',
        expectedOutput: 'LOCK_UN',
      }
    ],
    explanation: 'Recursos do sistema operacional (file descriptors, sockets, mutexes) precisam ser liberados incondicionalmente através de blocos try/finally.',
    validationRules: [
      { id: 'rule-finally-lock', type: 'contains', target: 'finally', description: 'Uso de bloco finally' },
      { id: 'rule-lock-un', type: 'contains', target: 'LOCK_UN', description: 'Chamada com flag LOCK_UN' },
      { id: 'rule-fclose', type: 'contains', target: 'fclose', description: 'Fechamento do descritor com fclose' }
    ]
  },
  {
    id: 'php-avancado-debug-06',
    language: 'php',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Memória & Geradores',
    title: 'Depuração: Esgotamento de Memória ao Ler Arquivo Grande sem Generator',
    summary: 'Corrija um serviço de importação que usa file() em arquivos gigantes, substituindo-o por um Generator com fgets.',
    realWorldContext: 'Tentar carregar arquivos de log ou exportações CSV de centenas de megabytes com file() ou file_get_contents() esgota o memory_limit do PHP fatalmente. Usar Generators permite consumo sob demanda com consumo constante de memória.',
    description: 'A função lerLinhasArquivo utiliza file($caminho) carregando todo o conteúdo na RAM de uma só vez. Altere a função para usar fopen, um loop while (($linha = fgets($handle)) !== false) e yield trim($linha), liberando o handle ao final.',
    goal: 'Transformar a função em um Generator que lê linha a linha via yield.',
    bugDescription: 'A função file() tenta alocar todo o arquivo de 500MB em memória de uma vez só, causando Fatal Error de Memory Limit.',
    buggyLineNumbers: [4],
    initialBuggyCode: `<?php

function lerLinhasArquivo(string $caminho): array {
    // BUG: Esgota a memória do PHP em arquivos grandes!
    $todasAsLinhas = file($caminho, FILE_IGNORE_NEW_LINES);
    return $todasAsLinhas;
}
`,
    templateCode: `<?php

function lerLinhasArquivo(string $caminho): Generator {
    $handle = fopen($caminho, 'r');
    if (!$handle) {
        throw new RuntimeException("Não foi possível abrir o arquivo");
    }

    // Corrija aqui: itere com fgets e faça yield de cada linha
    try {
        while (($linha = fgets($handle)) !== false) {
            yield trim($linha);
        }
    } finally {
        fclose($handle);
    }
}
`,
    solutionCode: `<?php

function lerLinhasArquivo(string $caminho): Generator {
    $handle = fopen($caminho, 'r');
    if (!$handle) {
        throw new RuntimeException("Não foi possível abrir o arquivo");
    }

    try {
        while (($linha = fgets($handle)) !== false) {
            yield trim($linha);
        }
    } finally {
        fclose($handle);
    }
}
`,
    hints: [
      'Altere o retorno para Generator.',
      'Use fopen($caminho, "r") para abrir o arquivo como stream.',
      'Utilize while (($linha = fgets($handle)) !== false) { yield trim($linha); }'
    ],
    testCases: [
      {
        description: 'Itera sob demanda com consumo de memória O(1)',
        expectedOutput: 'Generator',
      }
    ],
    explanation: 'Generators transmitem dados via streaming. Em vez de criar um array com 1 milhão de posições na memória RAM, o PHP processa um registro por vez.',
    validationRules: [
      { id: 'rule-gen-return', type: 'contains', target: 'Generator', description: 'Retorno do tipo Generator' },
      { id: 'rule-yield-stmt', type: 'contains', target: 'yield', description: 'Instrução yield para emissão contínua' },
      { id: 'rule-fgets-loop', type: 'contains', target: 'fgets', description: 'Leitura de stream com fgets' }
    ]
  },

  // ==========================================
  // PREVER SAÍDA (5 exercícios)
  // ==========================================
  {
    id: 'php-avancado-prever-02',
    language: 'php',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Geradores & Yield From',
    title: 'Prever Saída: Delegação de Geradores com yield from e Chaves',
    summary: 'Descubra a saída gerada por múltiplos generators encadeados usando yield from e chaves associativas.',
    realWorldContext: 'yield from delega a iteração para outro Generator, Traversable ou array diretamente, mantendo a performance e o streaming de dados entre camadas arquiteturais.',
    description: 'Analise o fluxo dos dois geradores abaixo. Note como yield from delega os elementos. Qual é o texto exato impresso pelo implode ao final?',
    goal: 'Identificar a saída final concatenada da sequência de geradores.',
    templateCode: '',
    solutionCode: 'DEV-OPS-QA',
    hints: [
      'yield from esgota primeiro o gerador delegado antes de prosseguir.',
      'O separador utilizado no implode é um hífen "-".'
    ],
    testCases: [
      {
        description: 'Saída concatenada dos geradores delegados',
        expectedOutput: 'DEV-OPS-QA'
      }
    ],
    codeToPredict: `<?php

function prefixos(): Generator {
    yield "DEV";
    yield "OPS";
}

function tarefas(): Generator {
    yield from prefixos();
    yield "QA";
}

$resultado = [];
foreach (tarefas() as $item) {
    $resultado[] = $item;
}

echo implode("-", $resultado);
`,
    expectedOutputPrediction: 'DEV-OPS-QA',
    acceptableOutputPredictions: ['DEV-OPS-QA'],
    explanation: 'A função tarefas() delega inicialmente a iteração para prefixos(), que emite sucessivamente "DEV" e "OPS". Em seguida, tarefas() emite seu próprio valor "QA". O array final contém ["DEV", "OPS", "QA"], que concatenado com traço resulta em "DEV-OPS-QA".'
  },
  {
    id: 'php-avancado-prever-03',
    language: 'php',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'PHP 8 Enums & Métodos',
    title: 'Prever Saída: Backed Enums com Métodos e Match Expressions',
    summary: 'Determine o status retornado por um Enum com métodos de negócio integrados.',
    realWorldContext: 'Enums no PHP 8.1+ são tipos de primeira classe completos que podem implementar interfaces, definir métodos e realizar validações seguras.',
    description: 'Observe o Enum StatusPedido com backing type string e o método podeCancelar(). Qual é a saída exata impressa ao testar os dois pedidos?',
    goal: 'Calcular a saída booleana (convertida para texto) de chamadas a métodos em Enums do PHP 8.1.',
    templateCode: '',
    solutionCode: 'SIM|NAO',
    hints: [
      'PAGO permite cancelamento segundo o match (retorna true).',
      'StatusPedido::from("E") mapeia para ENVIADO, que não permite cancelamento (retorna false).'
    ],
    testCases: [
      {
        description: 'Resultado dos cancelamentos nos Enums',
        expectedOutput: 'SIM|NAO'
      }
    ],
    codeToPredict: `<?php

enum StatusPedido: string {
    case PENDENTE = 'P';
    case PAGO = 'PG';
    case ENVIADO = 'E';

    public function podeCancelar(): bool {
        return match($this) {
            self::PENDENTE, self::PAGO => true,
            self::ENVIADO => false,
        };
    }
}

$status1 = StatusPedido::PAGO;
$status2 = StatusPedido::from('E');

$res1 = $status1->podeCancelar() ? 'SIM' : 'NAO';
$res2 = $status2->podeCancelar() ? 'SIM' : 'NAO';

echo "{$res1}|{$res2}";
`,
    expectedOutputPrediction: 'SIM|NAO',
    acceptableOutputPredictions: ['SIM|NAO'],
    explanation: 'StatusPedido::PAGO cai no primeiro braço do match, retornando true ("SIM"). StatusPedido::from("E") instancia StatusPedido::ENVIADO, cujo match retorna false ("NAO"). A saída unida pelo pipe é "SIM|NAO".'
  },
  {
    id: 'php-avancado-prever-04',
    language: 'php',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Metaprogramação & PHP 8 Attributes',
    title: 'Prever Saída: Leitura de Metadados com PHP 8 Attributes e Reflection',
    summary: 'Descubra o valor inspecionado via ReflectionAttribute a partir de classes anotadas.',
    realWorldContext: 'Attributes nativos substituem PHPDoc annotations em frameworks modernos como Symfony e Laravel para rotas, ORM mapping e injeção de dependência.',
    description: 'Analise o código abaixo que declara o atributo #[Rota] e o utiliza no controller. A ReflectionClass extrai o atributo e lê a propriedade caminho. O que será exibido?',
    goal: 'Identificar a rota extraída via ReflectionAttribute no PHP 8.',
    templateCode: '',
    solutionCode: 'POST:/api/usuarios',
    hints: [
      'O método Rota foi invocado com argumentos nomeados.',
      'A ordem da concatenação é $instancia->metodo seguido de dois pontos e $instancia->caminho.'
    ],
    testCases: [
      {
        description: 'Metadados de rota extraídos via reflexão',
        expectedOutput: 'POST:/api/usuarios'
      }
    ],
    codeToPredict: `<?php

#[Attribute]
class Rota {
    public function __construct(public string $caminho, public string $metodo = 'GET') {}
}

#[Rota('/api/usuarios', metodo: 'POST')]
class UsuarioController {}

$ref = new ReflectionClass(UsuarioController::class);
$atributos = $ref->getAttributes(Rota::class);
$instancia = $atributos[0]->newInstance();

echo $instancia->metodo . ":" . $instancia->caminho;
`,
    expectedOutputPrediction: 'POST:/api/usuarios',
    acceptableOutputPredictions: ['POST:/api/usuarios'],
    explanation: 'A classe UsuarioController possui o atributo #[Rota("/api/usuarios", metodo: "POST")]. A chamada newInstance() instancia o atributo com os argumentos passados. A propriedade metodo é "POST" e o caminho é "/api/usuarios", resultando em "POST:/api/usuarios".'
  },
  {
    id: 'php-avancado-prever-05',
    language: 'php',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Fibers & Concorrência Cooperativa',
    title: 'Prever Saída: Ciclo de Vida de uma Fiber no PHP 8.1',
    summary: 'Determine a sequência de suspensões e retomadas em uma corrotina Fiber nativa.',
    realWorldContext: 'Fibers formam a base para frameworks assíncronos não bloqueantes em PHP (como Revolt e Amp v3), permitindo suspender e retomar pilhas de execução de forma cooperativa.',
    description: 'Acompanhe as chamadas de start(), suspend() e resume(). Preste atenção em quais valores são transmitidos de dentro e de fora da Fiber durante as pausas.',
    goal: 'Prever a concatenação de estados da Fiber durante a execução cooperativa.',
    templateCode: '',
    solutionCode: 'Inicio->A->Pausa1->B->C->Fim',
    hints: [
      'Fiber::suspend() passa o argumento de saída de volta para a chamada start() ou resume() do chamador.',
      'fiber->resume("B") entrega a string "B" como resultado da expressão Fiber::suspend().'
    ],
    testCases: [
      {
        description: 'Sequência cronológica da corrotina Fiber',
        expectedOutput: 'Inicio->A->Pausa1->B->C->Fim'
      }
    ],
    codeToPredict: `<?php

$saida = [];

$fiber = new Fiber(function (): void {
    global $saida;
    $saida[] = "A";
    $valorExterno = Fiber::suspend("Pausa1");
    $saida[] = $valorExterno;
    $saida[] = "C";
});

$saida[] = "Inicio";
$resPausa = $fiber->start();
$saida[] = $resPausa;
$fiber->resume("B");
$saida[] = "Fim";

echo implode("->", $saida);
`,
    expectedOutputPrediction: 'Inicio->A->Pausa1->B->C->Fim',
    acceptableOutputPredictions: ['Inicio->A->Pausa1->B->C->Fim'],
    explanation: '1. "Inicio" é adicionado. 2. fiber->start() inicia a corrotina, que adiciona "A" e chama suspend("Pausa1"). 3. O valor retornado por start() é "Pausa1", adicionado à saída principal. 4. resume("B") envia "B" de volta para a Fiber, que o atribui a $valorExterno e adiciona "B" e "C". 5. A Fiber finaliza e o fluxo principal adiciona "Fim". Resultado: Inicio->A->Pausa1->B->C->Fim.'
  },
  {
    id: 'php-avancado-prever-06',
    language: 'php',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'WeakMap & Coletor de Lixo',
    title: 'Prever Saída: Desalocação Automática de Objetos com WeakMap',
    summary: 'Descubra a contagem de elementos de um WeakMap após a remoção da referência de um objeto.',
    realWorldContext: 'WeakMap permite associar dados a objetos sem impedir que o coletor de lixo (GC) os destrua, sendo fundamental para evitar vazamentos de memória em caches de ORM e Identity Maps.',
    description: 'Analise como o WeakMap armazena metadados para instâncias da classe Entidade. O que acontece com a contagem count($map) após $e1 ser atribuído a null?',
    goal: 'Prever a contagem de chaves ativas no WeakMap antes e depois da destruição do objeto.',
    templateCode: '',
    solutionCode: '2:1',
    hints: [
      'WeakMap não retém referências fortes de objetos.',
      'Quando $e1 vira null, sua chave é removida imediatamente do WeakMap.'
    ],
    testCases: [
      {
        description: 'Contagens antes e depois do GC',
        expectedOutput: '2:1'
      }
    ],
    codeToPredict: `<?php

class Entidade {
    public function __construct(public int $id) {}
}

$map = new WeakMap();

$e1 = new Entidade(1);
$e2 = new Entidade(2);

$map[$e1] = "cache_1";
$map[$e2] = "cache_2";

$contagem1 = count($map);

$e1 = null;

$contagem2 = count($map);

echo "{$contagem1}:{$contagem2}";
`,
    expectedOutputPrediction: '2:1',
    acceptableOutputPredictions: ['2:1'],
    explanation: 'Inicialmente o WeakMap contém 2 chaves associadas a $e1 e $e2. Ao atribuir $e1 = null, a contagem de referências do primeiro objeto chega a zero e o coletor de lixo o destrói. O WeakMap remove automaticamente a entrada correspondente, deixando count($map) igual a 1. A saída é "2:1".'
  },

  // ==========================================
  // DESAFIO PRÁTICO (5 exercícios)
  // ==========================================
  {
    id: 'php-avancado-desafio-02',
    language: 'php',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Padrões PSR & Middlewares',
    title: 'Desafio Prático: Pipeline de Middlewares Estilo PSR-15',
    summary: 'Implemente um executor de fila de middlewares sequenciais que intercepta requisições HTTP e gera respostas.',
    realWorldContext: 'Toda arquitetura moderna de microsserviços e APIs em PHP (como Slim Framework, Mezzio e Laravel) organiza autenticação, CORS, rate limiting e logs em uma cadeia encadeada de middlewares.',
    description: 'Crie uma classe MiddlewarePipeline que armazena middlewares chamáveis function(array $req, callable $proximo): array. O método processar(array $requisicao) deve encadear a execução na ordem em que foram adicionados.',
    goal: 'Executar uma pilha de middlewares encadeados em cebola (onion architecture).',
    practicalRequirements: [
      'O método adicionar(callable $middleware): self deve enfileirar o middleware.',
      'O método processar(array $requisicao): array deve iniciar a execução encadeada.',
      'Cada middleware recebe ($requisicao, $proximo) e pode modificar a requisição antes ou a resposta depois da chamada de $proximo($requisicao).',
      'Caso todos os middlewares chamem $proximo, o retorno base deve ser ["status" => 200, "requisicao" => $requisicao].'
    ],
    testCases: [
      {
        description: 'Deve executar middleware de cabeçalho e chegar ao handler final',
        input: 'pipeline com middleware que adiciona cabeçalho X-App',
        expectedOutput: '{"status":200,"headers":{"X-App":"DevPratica"}}'
      }
    ],
    templateCode: `<?php

class MiddlewarePipeline {
    private array $middlewares = [];

    public function adicionar(callable $middleware): self {
        $this->middlewares[] = $middleware;
        return $this;
    }

    public function processar(array $requisicao): array {
        $indice = 0;
        $executar = function(array $req) use (&$executar, &$indice) {
            if ($indice >= count($this->middlewares)) {
                return ['status' => 200, 'requisicao' => $req];
            }
            $middleware = $this->middlewares[$indice++];
            return $middleware($req, $executar);
        };

        return $executar($requisicao);
    }
}
`,
    solutionCode: `<?php

class MiddlewarePipeline {
    private array $middlewares = [];

    public function adicionar(callable $middleware): self {
        $this->middlewares[] = $middleware;
        return $this;
    }

    public function processar(array $requisicao): array {
        $indice = 0;
        $executar = function(array $req) use (&$executar, &$indice) {
            if ($indice >= count($this->middlewares)) {
                return ['status' => 200, 'requisicao' => $req];
            }
            $middleware = $this->middlewares[$indice++];
            return $middleware($req, $executar);
        };

        return $executar($requisicao);
    }
}
`,
    hints: [
      'Você pode modelar a chamada recursiva onde $proximo invoca o próximo índice da fila.',
      'Lembre-se de retornar o array resultante em cada etapa.'
    ],
    explanation: 'Pipelines PSR-15 permitem injetar comportamentos transversais (cross-cutting concerns) sem acoplar a lógica dos controladores.',
    validationRules: [
      { id: 'rule-pipeline-class', type: 'contains', target: 'class MiddlewarePipeline', description: 'Declaração da classe MiddlewarePipeline' },
      { id: 'rule-adicionar', type: 'contains', target: 'adicionar', description: 'Implementação do método adicionar' },
      { id: 'rule-processar', type: 'contains', target: 'processar', description: 'Implementação do método processar' }
    ]
  },
  {
    id: 'php-avancado-desafio-03',
    language: 'php',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Algoritmos & Rate Limiting',
    title: 'Desafio Prático: Token Bucket Rate Limiter em Memória',
    summary: 'Construa um limitador de taxa de requisições baseado no consagrado algoritmo Token Bucket.',
    realWorldContext: 'APIs públicas de alta escala utilizam Token Bucket para tolerar picos controlados (bursts) enquanto garantem uma taxa média estrita de chamadas por segundo para proteger a infraestrutura.',
    description: 'Crie a classe TokenBucketRateLimiter com capacidade máxima $capacidade e taxa de recarga $taxaPorSegundo. Ao chamar consumir(float $tempoAtual, int $tokens = 1): bool, calcule os novos tokens acumulados proporcionalmente ao tempo decorrido.',
    goal: 'Calcular a reposição contínua de tokens no tempo e autorizar ou recusar a operação.',
    practicalRequirements: [
      '__construct(int $capacidade, float $taxaPorSegundo, float $tempoInicial)',
      'A capacidade inicial começa com o valor máximo de tokens.',
      'Ao chamar consumir(), adicione ($tempoAtual - $ultimoTempo) * $taxaPorSegundo ao saldo de tokens, sem ultrapassar a capacidade máxima.',
      'Se o saldo de tokens for >= $tokens solicitados, subtraia e retorne true. Caso contrário, retorne false.'
    ],
    testCases: [
      {
        description: 'Deve permitir consumir tokens disponíveis e recusar quando esgotado',
        input: 'capacidade 2, taxa 1/s, 3 consumos imediatos',
        expectedOutput: 'true, true, false'
      }
    ],
    templateCode: `<?php

class TokenBucketRateLimiter {
    private float $tokens;
    private float $ultimoTempo;

    public function __construct(
        private int $capacidade,
        private float $taxaPorSegundo,
        float $tempoInicial
    ) {
        $this->tokens = (float) $capacidade;
        $this->ultimoTempo = $tempoInicial;
    }

    public function consumir(float $tempoAtual, int $tokens = 1): bool {
        $tempoDecorrido = max(0.0, $tempoAtual - $this->ultimoTempo);
        $this->tokens = min((float)$this->capacidade, $this->tokens + ($tempoDecorrido * $this->taxaPorSegundo));
        $this->ultimoTempo = $tempoAtual;

        if ($this->tokens >= $tokens) {
            $this->tokens -= $tokens;
            return true;
        }

        return false;
    }
}
`,
    solutionCode: `<?php

class TokenBucketRateLimiter {
    private float $tokens;
    private float $ultimoTempo;

    public function __construct(
        private int $capacidade,
        private float $taxaPorSegundo,
        float $tempoInicial
    ) {
        $this->tokens = (float) $capacidade;
        $this->ultimoTempo = $tempoInicial;
    }

    public function consumir(float $tempoAtual, int $tokens = 1): bool {
        $tempoDecorrido = max(0.0, $tempoAtual - $this->ultimoTempo);
        $this->tokens = min((float)$this->capacidade, $this->tokens + ($tempoDecorrido * $this->taxaPorSegundo));
        $this->ultimoTempo = $tempoAtual;

        if ($this->tokens >= $tokens) {
            $this->tokens -= $tokens;
            return true;
        }

        return false;
    }
}
`,
    hints: [
      'Calcule $tempoDecorrido = max(0, $tempoAtual - $this->ultimoTempo).',
      'Novos tokens: min($this->capacidade, $this->tokens + $tempoDecorrido * $this->taxaPorSegundo).',
      'Atualize $this->ultimoTempo com $tempoAtual a cada chamada.'
    ],
    explanation: 'Token bucket é o algoritmo padrão para proteção contra DDoS e abusos de API por sua simplicidade de cálculo proporcional e baixo custo de memória.',
    validationRules: [
      { id: 'rule-token-bucket', type: 'contains', target: 'class TokenBucketRateLimiter', description: 'Declaração da classe TokenBucketRateLimiter' },
      { id: 'rule-consumir', type: 'contains', target: 'consumir', description: 'Implementação do método consumir' },
      { id: 'rule-min-cap', type: 'contains', target: 'min', description: 'Uso de min() para delimitar a capacidade' }
    ]
  },
  {
    id: 'php-avancado-desafio-04',
    language: 'php',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Padrão CQRS & Command Bus',
    title: 'Desafio Prático: Command Bus Desacoplado com Handlers',
    summary: 'Construa um barramento de comandos que despacha comandos para seus respectivos handlers sem acoplamento direto.',
    realWorldContext: 'Em arquiteturas limpas (Clean Architecture e DDD), o Command Bus separa a intenção do usuário (Comando) de sua execução (Handler), facilitando testes unitários e transações atômicas.',
    description: 'Implemente a classe CommandBus. Ela deve possuir registrar(string $comandoClass, mixed $handler): void e despachar(object $comando): mixed.',
    goal: 'Criar um despachante de comandos tipados para seus respectivos handlers.',
    practicalRequirements: [
      'registrar(string $comandoClass, mixed $handler): void associa uma classe de comando ao handler.',
      'despachar(object $comando): mixed localiza o handler registrado para get_class($comando).',
      'Se não houver handler registrado, lance RuntimeException.',
      'Se o handler for um objeto com método handle(), invoque $handler->handle($comando).'
    ],
    testCases: [
      {
        description: 'Deve despachar comando de criar usuário para o handler registrado',
        input: 'Comando CriarUsuario("Erick", "erick@email.com")',
        expectedOutput: 'ID do usuário gerado'
      }
    ],
    templateCode: `<?php

class CommandBus {
    private array $handlers = [];

    public function registrar(string $comandoClass, mixed $handler): void {
        $this->handlers[$comandoClass] = $handler;
    }

    public function despachar(object $comando): mixed {
        $classe = get_class($comando);
        if (!isset($this->handlers[$classe])) {
            throw new RuntimeException("Handler não registrado para " . $classe);
        }

        $handler = $this->handlers[$classe];
        if (is_callable($handler)) {
            return $handler($comando);
        }
        if (is_object($handler) && method_exists($handler, 'handle')) {
            return $handler->handle($comando);
        }

        throw new RuntimeException("Handler inválido para " . $classe);
    }
}
`,
    solutionCode: `<?php

class CommandBus {
    private array $handlers = [];

    public function registrar(string $comandoClass, mixed $handler): void {
        $this->handlers[$comandoClass] = $handler;
    }

    public function despachar(object $comando): mixed {
        $classe = get_class($comando);
        if (!isset($this->handlers[$classe])) {
            throw new RuntimeException("Handler não registrado para " . $classe);
        }

        $handler = $this->handlers[$classe];
        if (is_callable($handler)) {
            return $handler($comando);
        }
        if (is_object($handler) && method_exists($handler, 'handle')) {
            return $handler->handle($comando);
        }

        throw new RuntimeException("Handler inválido para " . $classe);
    }
}
`,
    hints: [
      'Use get_class($comando) para obter o nome qualificado da classe.',
      'Valide com isset($this->handlers[$classe]) e lance RuntimeException caso ausente.',
      'Use method_exists($handler, "handle") para invocar handlers baseados em classe.'
    ],
    explanation: 'O Command Bus isola a orquestração de transações e regras de negócio da camada de apresentação (controllers ou console commands).',
    validationRules: [
      { id: 'rule-bus-class', type: 'contains', target: 'class CommandBus', description: 'Declaração da classe CommandBus' },
      { id: 'rule-get-class', type: 'contains', target: 'get_class', description: 'Uso de get_class para tipagem dinâmica' },
      { id: 'rule-despachar', type: 'contains', target: 'despachar', description: 'Implementação do método despachar' }
    ]
  },
  {
    id: 'php-avancado-desafio-05',
    language: 'php',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Eventos & Prioridades PSR-14',
    title: 'Desafio Prático: Event Dispatcher com Prioridade e Interrupção',
    summary: 'Construa um despachante de eventos onde ouvintes podem ser ordenados por prioridade e o fluxo pode ser interrompido.',
    realWorldContext: 'Sistemas corporativos usam Event Dispatchers para acoplar módulos assincronamente (ex: auditoria, disparo de e-mails, emissão de nota fiscal). Ouvintes prioritários como checagem antifraude podem interromper a cadeia antes da entrega.',
    description: 'Crie a classe EventDispatcher. Ela deve permitir registrar listeners via ouvir(string $eventoNome, callable $ouvinte, int $prioridade = 0). Ao disparar disparar(object $evento): object, ordene os ouvintes da maior para a menor prioridade.',
    goal: 'Executar listeners de eventos em ordem de prioridade respeitando cancelamento de propagação.',
    practicalRequirements: [
      'ouvir(string $eventoNome, callable $ouvinte, int $prioridade = 0): void',
      'Prioridades maiores executam primeiro (ex: prioridade 10 antes de prioridade 0).',
      'disparar(object $evento): object despacha o evento para os listeners da classe get_class($evento).',
      'Se method_exists($evento, "isPropagationStopped") && $evento->isPropagationStopped(), pare a iteração e retorne o evento.'
    ],
    testCases: [
      {
        description: 'Deve executar ouvintes em ordem decrescente de prioridade',
        input: 'Listener A (prio 1), Listener B (prio 10)',
        expectedOutput: 'B executa antes de A'
      }
    ],
    templateCode: `<?php

class EventDispatcher {
    private array $ouvintes = [];

    public function ouvir(string $eventoNome, callable $ouvinte, int $prioridade = 0): void {
        $this->ouvintes[$eventoNome][] = [
            'callback' => $ouvinte,
            'prioridade' => $prioridade
        ];
    }

    public function disparar(object $evento): object {
        $nome = get_class($evento);
        if (empty($this->ouvintes[$nome])) {
            return $evento;
        }

        $lista = $this->ouvintes[$nome];
        usort($lista, fn($a, $b) => $b['prioridade'] <=> $a['prioridade']);

        foreach ($lista as $item) {
            if (method_exists($evento, 'isPropagationStopped') && $evento->isPropagationStopped()) {
                break;
            }
            ($item['callback'])($evento);
        }

        return $evento;
    }
}
`,
    solutionCode: `<?php

class EventDispatcher {
    private array $ouvintes = [];

    public function ouvir(string $eventoNome, callable $ouvinte, int $prioridade = 0): void {
        $this->ouvintes[$eventoNome][] = [
            'callback' => $ouvinte,
            'prioridade' => $prioridade
        ];
    }

    public function disparar(object $evento): object {
        $nome = get_class($evento);
        if (empty($this->ouvintes[$nome])) {
            return $evento;
        }

        $lista = $this->ouvintes[$nome];
        usort($lista, fn($a, $b) => $b['prioridade'] <=> $a['prioridade']);

        foreach ($lista as $item) {
            if (method_exists($evento, 'isPropagationStopped') && $evento->isPropagationStopped()) {
                break;
            }
            ($item['callback'])($evento);
        }

        return $evento;
    }
}
`,
    hints: [
      'Use usort com spaceship operator <=> comparando $b["prioridade"] <=> $a["prioridade"].',
      'Verifique isPropagationStopped() antes de invocar cada callback.'
    ],
    explanation: 'A especificação PSR-14 padroniza o despache de eventos em PHP, e o conceito de StoppableEvent permite cancelar cadeias em caso de validações falhas.',
    validationRules: [
      { id: 'rule-dispatcher-class', type: 'contains', target: 'class EventDispatcher', description: 'Declaração da classe EventDispatcher' },
      { id: 'rule-usort-prio', type: 'contains', target: 'usort', description: 'Ordenação de prioridades com usort' },
      { id: 'rule-stoppable', type: 'contains', target: 'isPropagationStopped', description: 'Checagem de parada de propagação' }
    ]
  },
  {
    id: 'php-avancado-desafio-06',
    language: 'php',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Design Patterns & Circuit Breaker',
    title: 'Desafio Prático: Padrão Circuit Breaker para Resiliência de APIs',
    summary: 'Construa um Circuit Breaker com três estados (CLOSED, OPEN, HALF_OPEN) para proteger chamadas externas.',
    realWorldContext: 'Em microsserviços, quando uma API externa parceira (ex: gateway de pagamento) começa a falhar repetidamente, o Circuit Breaker abre imediatamente sem enviar novas requisições, evitando consumo inútil de threads e timeouts.',
    description: 'Implemente a classe CircuitBreaker com os estados CLOSED, OPEN e HALF_OPEN.',
    goal: 'Implementar a máquina de estados completa do Circuit Breaker em PHP.',
    practicalRequirements: [
      'Estados: "CLOSED", "OPEN", "HALF_OPEN".',
      '__construct(int $limiteFalhas = 3, float $tempoRecuperacaoSegundos = 10.0)',
      'executar(callable $acao, float $agora): mixed',
      'Se OPEN e ($agora - $tempoAbertura) < $tempoRecuperacao, lance RuntimeException("Circuito ABERTO")',
      'Se falhas atingirem o limite, mude o estado para OPEN e grave o timestamp da abertura.'
    ],
    testCases: [
      {
        description: 'Deve abrir o circuito após atingir o limite de falhas consecutivas',
        input: '3 falhas seguidas com limite 3',
        expectedOutput: 'Lança RuntimeException("Circuito ABERTO") na 4ª tentativa'
      }
    ],
    templateCode: `<?php

class CircuitBreaker {
    private string $estado = 'CLOSED';
    private int $contadorFalhas = 0;
    private float $tempoAbertura = 0.0;

    public function __construct(
        private int $limiteFalhas = 3,
        private float $tempoRecuperacaoSegundos = 10.0
    ) {}

    public function getEstado(): string {
        return $this->estado;
    }

    public function executar(callable $acao, float $agora): mixed {
        if ($this->estado === 'OPEN') {
            if (($agora - $this->tempoAbertura) >= $this->tempoRecuperacaoSegundos) {
                $this->estado = 'HALF_OPEN';
            } else {
                throw new RuntimeException("Circuito ABERTO");
            }
        }

        try {
            $resultado = $acao();
            $this->estado = 'CLOSED';
            $this->contadorFalhas = 0;
            return $resultado;
        } catch (Throwable $e) {
            $this->contadorFalhas++;
            if ($this->contadorFalhas >= $this->limiteFalhas || $this->estado === 'HALF_OPEN') {
                $this->estado = 'OPEN';
                $this->tempoAbertura = $agora;
            }
            throw $e;
        }
    }
}
`,
    solutionCode: `<?php

class CircuitBreaker {
    private string $estado = 'CLOSED';
    private int $contadorFalhas = 0;
    private float $tempoAbertura = 0.0;

    public function __construct(
        private int $limiteFalhas = 3,
        private float $tempoRecuperacaoSegundos = 10.0
    ) {}

    public function getEstado(): string {
        return $this->estado;
    }

    public function executar(callable $acao, float $agora): mixed {
        if ($this->estado === 'OPEN') {
            if (($agora - $this->tempoAbertura) >= $this->tempoRecuperacaoSegundos) {
                $this->estado = 'HALF_OPEN';
            } else {
                throw new RuntimeException("Circuito ABERTO");
            }
        }

        try {
            $resultado = $acao();
            $this->estado = 'CLOSED';
            $this->contadorFalhas = 0;
            return $resultado;
        } catch (Throwable $e) {
            $this->contadorFalhas++;
            if ($this->contadorFalhas >= $this->limiteFalhas || $this->estado === 'HALF_OPEN') {
                $this->estado = 'OPEN';
                $this->tempoAbertura = $agora;
            }
            throw $e;
        }
    }
}
`,
    hints: [
      'Se o estado for OPEN e o tempo decorrido for suficiente, altere para HALF_OPEN.',
      'Se for OPEN e o tempo não tiver passado, lance RuntimeException imediatamente.',
      'No bloco catch, incremente o contador de falhas e abra o circuito caso atinja o limite.'
    ],
    explanation: 'Circuit Breaker protege a aplicação contra falhas em cascata quando serviços externos ficam instáveis ou fora do ar.',
    validationRules: [
      { id: 'rule-cb-class', type: 'contains', target: 'class CircuitBreaker', description: 'Declaração da classe CircuitBreaker' },
      { id: 'rule-half-open', type: 'contains', target: 'HALF_OPEN', description: 'Transição para HALF_OPEN' },
      { id: 'rule-cb-exception', type: 'contains', target: 'RuntimeException', description: 'Lançamento de exceção quando aberto' }
    ]
  }
];

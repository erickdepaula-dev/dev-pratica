import { Exercise } from '../../types/exercise';

export const phpAdvancedExercises: Exercise[] = [
  // 1
  {
    id: 'php-avancado-01',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Banco de Dados & Transações PDO',
    title: 'Transação Bancária Segura com PDO e Rollback',
    summary: 'Implemente uma transferência atômica com beginTransaction, commit e rollBack no PDO.',
    realWorldContext: 'Em sistemas financeiros e pagamentos, transferências entre contas precisam de garantias ACID. Se qualquer query falhar ou o servidor cair, tudo deve ser cancelado via rollback.',
    description: 'Complete o método transferirFundos que inicia a transação atômica, executa o débito e o crédito, e confirma (commit) ou desfaz (rollBack) em caso de exceção.',
    goal: 'Controlar o ciclo de vida de uma transação PDO com tratamento de erros.',
    templateCode: `<?php

function transferirFundos(PDO $pdo, int $origemId, int $destinoId, float $valor): bool {
    try {
        {{blank_0}};

        $stmtDebito = $pdo->prepare("UPDATE contas SET saldo = saldo - :valor WHERE id = :id AND saldo >= :valor");
        $stmtDebito->execute([':valor' => $valor, ':id' => $origemId]);

        if ($stmtDebito->rowCount() === 0) {
            throw new Exception("Saldo insuficiente na conta de origem.");
        }

        $stmtCredito = $pdo->prepare("UPDATE contas SET saldo = saldo + :valor WHERE id = :id");
        $stmtCredito->execute([':valor' => $valor, ':id' => $destinoId]);

        {{blank_1}};
        return true;
    } catch (Throwable $e) {
        {{blank_2}};
        error_log("Falha na transferência: " . $e->getMessage());
        return false;
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Início da transação',
        expectedAnswers: ['$pdo->beginTransaction()', '$pdo->beginTransaction();'],
        hint: 'Método do PDO que inicia uma transação no banco de dados.',
      },
      {
        id: 'blank_1',
        label: 'Confirmação da transação',
        expectedAnswers: ['$pdo->commit()', '$pdo->commit();'],
        hint: 'Método do PDO que grava permanentemente as alterações da transação.',
      },
      {
        id: 'blank_2',
        label: 'Reversão em caso de erro',
        expectedAnswers: ['$pdo->rollBack()', '$pdo->rollback()', '$pdo->rollBack();', '$pdo->rollback();'],
        hint: 'Método do PDO que desfaz todas as alterações ocorridas durante a transação.',
      },
    ],
    solutionCode: `<?php

function transferirFundos(PDO $pdo, int $origemId, int $destinoId, float $valor): bool {
    try {
        $pdo->beginTransaction();

        $stmtDebito = $pdo->prepare("UPDATE contas SET saldo = saldo - :valor WHERE id = :id AND saldo >= :valor");
        $stmtDebito->execute([':valor' => $valor, ':id' => $origemId]);

        if ($stmtDebito->rowCount() === 0) {
            throw new Exception("Saldo insuficiente na conta de origem.");
        }

        $stmtCredito = $pdo->prepare("UPDATE contas SET saldo = saldo + :valor WHERE id = :id");
        $stmtCredito->execute([':valor' => $valor, ':id' => $destinoId]);

        $pdo->commit();
        return true;
    } catch (Throwable $e) {
        $pdo->rollBack();
        error_log("Falha na transferência: " . $e->getMessage());
        return false;
    }
}`,
    hints: [
      'Dica 1: $pdo->beginTransaction() desativa o autocommit temporariamente.',
      'Dica 2: $pdo->commit() aplica as mudanças e restaura o modo de conexão.',
      'Dica 3: $pdo->rollBack() reverte o banco ao estado anterior ao início da transação.',
    ],
    testCases: [
      {
        description: 'Transação executada com commit em caso de sucesso',
        expectedOutput: 'true',
      },
      {
        description: 'Transação revertida com rollBack em saldo insuficiente',
        expectedOutput: 'false',
      },
    ],
    explanation: 'Transações com PDO são fundamentais em sistemas corporativos para evitar inconsistências financeiras e de estoque.',
  },

  // 2
  {
    id: 'php-avancado-02',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Arquitetura & SOLID',
    title: 'Injeção de Dependência e Repository Pattern',
    summary: 'Desacople a lógica de negócio do banco de dados injetando uma interface no construtor com PHP 8+.',
    realWorldContext: 'No SOLID (D - Dependency Inversion), módulos de alto nível não devem depender de módulos de baixo nível, mas sim de abstrações como interfaces.',
    description: 'Complete a classe UserService utilizando promoção de propriedades do PHP 8+ para injetar UserRepositoryInterface.',
    goal: 'Injetar a interface no construtor e persistir os dados através dela.',
    templateCode: `<?php

interface UserRepositoryInterface {
    public function findByEmail(string $email): ?array;
    public function save(array $userData): int;
}

class UserService {
    public function __construct(
        {{blank_0}}
    ) {}

    public function register(string $name, string $email, string $rawPassword): int {
        if ($this->userRepository->findByEmail($email) !== null) {
            throw new InvalidArgumentException("E-mail já registrado.");
        }

        $hash = password_hash($rawPassword, PASSWORD_ARGON2ID);
        {{blank_1}};
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Injeção com propriedade promovida',
        expectedAnswers: [
          'private readonly UserRepositoryInterface $userRepository',
          'private UserRepositoryInterface $userRepository',
          'protected readonly UserRepositoryInterface $userRepository',
        ],
        hint: 'Declare a visibilidade e o tipo da interface UserRepositoryInterface.',
      },
      {
        id: 'blank_1',
        label: 'Chamada do repositório',
        expectedAnswers: [
          'return $this->userRepository->save([\'name\' => $name, \'email\' => $email, \'password\' => $hash])',
          'return $this->userRepository->save(["name" => $name, "email" => $email, "password" => $hash])',
        ],
        hint: 'Invoque $this->userRepository->save(...) passando o array com os dados.',
      },
    ],
    solutionCode: `<?php

interface UserRepositoryInterface {
    public function findByEmail(string $email): ?array;
    public function save(array $userData): int;
}

class UserService {
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function register(string $name, string $email, string $rawPassword): int {
        if ($this->userRepository->findByEmail($email) !== null) {
            throw new InvalidArgumentException("E-mail já registrado.");
        }

        $hash = password_hash($rawPassword, PASSWORD_ARGON2ID);
        return $this->userRepository->save(['name' => $name, 'email' => $email, 'password' => $hash]);
    }
}`,
    hints: [
      'Dica 1: No PHP 8.1+, "private readonly Interface $propriedade" protege contra reatribuições.',
      'Dica 2: O método save retorna o ID gerado do novo usuário.',
    ],
    testCases: [
      {
        description: 'UserService registra e persiste através da interface',
        expectedOutput: 'ID do usuário retornado',
      },
    ],
    explanation: 'A injeção de dependência combinada com o padrão Repository permite trocar o banco ou criar testes unitários com mocks facilmente.',
  },

  // 3
  {
    id: 'php-avancado-03',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Design Patterns',
    title: 'Padrão Strategy para Gateways de Pagamento',
    summary: 'Implemente múltiplos métodos de pagamento (Pix, Cartão, Boleto) sem if/else encadeados.',
    realWorldContext: 'Sistemas modernos de e-commerce precisam trocar ou adicionar gateways de pagamento em tempo de execução sem mexer na regra do checkout.',
    description: 'Preencha o tipo da interface recebida no setter e a chamada polimórfica que executa o pagamento.',
    goal: 'Aplicar o padrão Strategy para delegar o processamento financeiro.',
    templateCode: `<?php

interface PaymentStrategyInterface {
    public function pay(float $amount): array;
}

class CheckoutService {
    public function __construct(
        private PaymentStrategyInterface $strategy
    ) {}

    public function setStrategy({{blank_0}}): void {
        $this->strategy = $strategy;
    }

    public function processOrder(float $total): array {
        {{blank_1}};
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Tipagem do parâmetro de estratégia',
        expectedAnswers: [
          'PaymentStrategyInterface $strategy',
        ],
        hint: 'Use a interface PaymentStrategyInterface como type-hint.',
      },
      {
        id: 'blank_1',
        label: 'Execução da estratégia',
        expectedAnswers: [
          'return $this->strategy->pay($total)',
        ],
        hint: 'Chame o método pay da estratégia ativa passando o total.',
      },
    ],
    solutionCode: `<?php

interface PaymentStrategyInterface {
    public function pay(float $amount): array;
}

class CheckoutService {
    public function __construct(
        private PaymentStrategyInterface $strategy
    ) {}

    public function setStrategy(PaymentStrategyInterface $strategy): void {
        $this->strategy = $strategy;
    }

    public function processOrder(float $total): array {
        return $this->strategy->pay($total);
    }
}`,
    hints: [
      'Dica 1: O método setStrategy permite alterar a forma de pagamento em tempo de execução.',
      'Dica 2: A chamada polimórfica $this->strategy->pay($total) não precisa saber qual classe concreta está operando.',
    ],
    testCases: [
      {
        description: 'Processamento delegando para a estratégia correta',
        expectedOutput: 'Array com status de pagamento retornado',
      },
    ],
    explanation: 'O padrão Strategy atende ao Princípio Aberto/Fechado (Open/Closed Principle) do SOLID: aberto para extensão, fechado para modificação.',
  },

  // 4
  {
    id: 'php-avancado-04',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Arquitetura & Web',
    title: 'Middleware Pipeline de Autenticação PSR-15',
    summary: 'Construa um manipulador de requisições encadeado que valida o cabeçalho Authorization.',
    realWorldContext: 'Em frameworks como Laravel, Slim e Symfony, middlewares interceptam e inspecionam requisições HTTP antes de chegarem aos controllers.',
    description: 'Complete o middleware que verifica se o token Bearer existe e repassa a requisição enriquecida com o id do usuário para o próximo handler.',
    goal: 'Validar token no cabeçalho e invocar o próximo manipulador na cadeia.',
    templateCode: `<?php

interface RequestHandlerInterface {
    public function handle(array $request): array;
}

class AuthMiddleware {
    public function process(array $request, RequestHandlerInterface $next): array {
        $token = $request['headers']['Authorization'] ?? null;

        if ({{blank_0}}) {
            return [
                'status' => 401,
                'body'   => ['erro' => 'Não autorizado: Token Bearer ausente']
            ];
        }

        $request['user_id'] = 42;
        {{blank_1}};
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Validação do cabeçalho de token',
        expectedAnswers: [
          '!$token || !str_starts_with($token, "Bearer ")',
          '!$token || !str_starts_with($token, \'Bearer \')',
          'empty($token) || !str_starts_with($token, "Bearer ")',
          'empty($token) || !str_starts_with($token, \'Bearer \')',
        ],
        hint: 'Verifique se $token é vazio ou se não começa com "Bearer " usando str_starts_with.',
      },
      {
        id: 'blank_1',
        label: 'Repasse para o próximo handler',
        expectedAnswers: [
          'return $next->handle($request)',
        ],
        hint: 'Invoque $next->handle($request) para continuar a execução do pipeline.',
      },
    ],
    solutionCode: `<?php

interface RequestHandlerInterface {
    public function handle(array $request): array;
}

class AuthMiddleware {
    public function process(array $request, RequestHandlerInterface $next): array {
        $token = $request['headers']['Authorization'] ?? null;

        if (!$token || !str_starts_with($token, 'Bearer ')) {
            return [
                'status' => 401,
                'body'   => ['erro' => 'Não autorizado: Token Bearer ausente']
            ];
        }

        $request['user_id'] = 42;
        return $next->handle($request);
    }
}`,
    hints: [
      'Dica 1: str_starts_with() foi introduzido no PHP 8 e é a forma mais rápida de checar prefixos.',
      'Dica 2: Se a autenticação passar, retorne o resultado de $next->handle($request).',
    ],
    testCases: [
      {
        description: 'Requisição sem token retorna HTTP 401',
        expectedOutput: 'status 401',
      },
      {
        description: 'Requisição com Bearer avança para o próximo handler',
        expectedOutput: 'next->handle chamado com user_id',
      },
    ],
    explanation: 'Middlewares em pipeline criam camadas defensivas reutilizáveis para autenticação, rate limiting e logging.',
  },

  // 5
  {
    id: 'php-avancado-05',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Tratamento de Erros & DDD',
    title: 'Hierarquia de Exceções de Domínio e Status HTTP',
    summary: 'Modele exceções de negócio com códigos HTTP embutidos para APIs limpas e previsíveis.',
    realWorldContext: 'Erros de domínio (como SaldoInsuficiente ou CupomExpirado) não são falhas técnicas 500 do servidor, mas regras de negócio violadas que devem retornar 422 ou 400 com JSON sem vazar dados confidenciais.',
    description: 'Estenda a classe base DomainException e use o operador instanceof no handler para mapear o status.',
    goal: 'Criar exceção personalizada com status HTTP dinâmico.',
    templateCode: `<?php

abstract class DomainException extends Exception {
    abstract public function getHttpStatusCode(): int;
}

class SaldoInsuficienteException {{blank_0}} {
    public function __construct(float $saldo, float $valor) {
        parent::__construct("Saldo insuficiente ({$saldo}) para saque de {$valor}.");
    }

    public function getHttpStatusCode(): int {
        return 422;
    }
}

class ApiExceptionHandler {
    public static function render(Throwable $e): array {
        {{blank_1}};

        return [
            'status' => $status,
            'erro'   => $e->getMessage()
        ];
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Herança da classe base de domínio',
        expectedAnswers: [
          'extends DomainException',
        ],
        hint: 'Use a palavra extends com DomainException.',
      },
      {
        id: 'blank_1',
        label: 'Verificação com ternário e instanceof',
        expectedAnswers: [
          '$status = $e instanceof DomainException ? $e->getHttpStatusCode() : 500',
          '$status = ($e instanceof DomainException) ? $e->getHttpStatusCode() : 500',
        ],
        hint: 'Se $e for instanceof DomainException pegue o status HTTP dela, senão retorne 500.',
      },
    ],
    solutionCode: `<?php

abstract class DomainException extends Exception {
    abstract public function getHttpStatusCode(): int;
}

class SaldoInsuficienteException extends DomainException {
    public function __construct(float $saldo, float $valor) {
        parent::__construct("Saldo insuficiente ({$saldo}) para saque de {$valor}.");
    }

    public function getHttpStatusCode(): int {
        return 422;
    }
}

class ApiExceptionHandler {
    public static function render(Throwable $e): array {
        $status = $e instanceof DomainException ? $e->getHttpStatusCode() : 500;

        return [
            'status' => $status,
            'erro'   => $e->getMessage()
        ];
    }
}`,
    hints: [
      'Dica 1: O operador instanceof verifica polimorficamente se o objeto descende da classe pai.',
      'Dica 2: HTTP 422 (Unprocessable Entity) é o código REST padrão para erros de regra de negócio.',
    ],
    testCases: [
      {
        description: 'SaldoInsuficienteException retorna status 422',
        expectedOutput: 'status 422',
      },
    ],
    explanation: 'Exceções ricas desacoplam os controllers da formatação de respostas de erro em APIs REST.',
  },

  // 6
  {
    id: 'php-avancado-06',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'PHP 8.1+ Enums Tipados',
    title: 'Modelagem de Status com Backed Enums e Match',
    summary: 'Substitua constantes soltas por Backed Enums do PHP 8.1 com métodos de regras de transição.',
    realWorldContext: 'Status de pedidos (pendente, enviado, cancelado) antes eram strings vulneráveis a erros de digitação. Com PHP 8.1 Enums, você ganha checagem estática total e métodos associados.',
    description: 'Declare o enum tipado com string e complete o método que verifica se o pedido pode ser cancelado.',
    goal: 'Criar um Backed Enum string e usar a expressão match.',
    templateCode: `<?php

enum StatusPedido: {{blank_0}} {
    case PENDENTE    = 'pendente';
    case PROCESSANDO = 'processando';
    case ENVIADO     = 'enviado';
    case ENTREGUE    = 'entregue';
    case CANCELADO   = 'cancelado';

    public function podeCancelar(): bool {
        {{blank_1}};
    }
}

$status = StatusPedido::from('pendente');
echo $status->podeCancelar() ? 'Cancelamento permitido' : 'Não cancelável';
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Tipo escalar do Enum',
        expectedAnswers: ['string'],
        hint: 'Declare o tipo escalar string após os dois pontos.',
      },
      {
        id: 'blank_1',
        label: 'Expressão match para validação',
        expectedAnswers: [
          'return match($this) { self::PENDENTE, self::PROCESSANDO => true, default => false }',
          'return match ($this) { self::PENDENTE, self::PROCESSANDO => true, default => false }',
          'return in_array($this, [self::PENDENTE, self::PROCESSANDO], true)',
        ],
        hint: 'Use a expressão match($this) retornando true para PENDENTE e PROCESSANDO.',
      },
    ],
    solutionCode: `<?php

enum StatusPedido: string {
    case PENDENTE    = 'pendente';
    case PROCESSANDO = 'processando';
    case ENVIADO     = 'enviado';
    case ENTREGUE    = 'entregue';
    case CANCELADO   = 'cancelado';

    public function podeCancelar(): bool {
        return match($this) {
            self::PENDENTE, self::PROCESSANDO => true,
            default => false
        };
    }
}

$status = StatusPedido::from('pendente');
echo $status->podeCancelar() ? 'Cancelamento permitido' : 'Não cancelável';`,
    hints: [
      'Dica 1: Backed Enums aceitam string ou int.',
      'Dica 2: A expressão match é exaustiva e não necessita de break.',
    ],
    testCases: [
      {
        description: 'Status PENDENTE permite cancelamento',
        expectedOutput: 'Cancelamento permitido',
      },
    ],
    explanation: 'Enums eliminam números mágicos e strings dispersas no código, unificando a integridade do banco com a orientação a objetos.',
  },

  // 7
  {
    id: 'php-avancado-07',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Segurança & Criptografia',
    title: 'Assinatura e Validação HMAC SHA-256 de Webhooks',
    summary: 'Assine payloads com hash_hmac e compare com hash_equals para evitar timing attacks.',
    realWorldContext: 'Provedores como Stripe, Mercado Pago e GitHub usam assinaturas HMAC no header para garantir que o webhook realmente partiu do servidor deles e não de um atacante.',
    description: 'Complete as funções para gerar a assinatura HMAC-SHA256 e validar em tempo constante.',
    goal: 'Aplicar hash_hmac e hash_equals para comunicação segura.',
    templateCode: `<?php

function assinarPayload(string $payloadJson, string $secretKey): string {
    {{blank_0}};
}

function validarAssinatura(string $payloadJson, string $assinaturaRecebida, string $secretKey): bool {
    $esperada = assinarPayload($payloadJson, $secretKey);
    {{blank_1}};
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Cálculo do hash HMAC',
        expectedAnswers: [
          'return hash_hmac("sha256", $payloadJson, $secretKey)',
          'return hash_hmac(\'sha256\', $payloadJson, $secretKey)',
        ],
        hint: 'Use a função nativa hash_hmac com algoritmo "sha256".',
      },
      {
        id: 'blank_1',
        label: 'Comparação em tempo constante',
        expectedAnswers: [
          'return hash_equals($esperada, $assinaturaRecebida)',
          'return hash_equals($assinaturaRecebida, $esperada)',
        ],
        hint: 'Nunca use === para segredos; use a função hash_equals nativa.',
      },
    ],
    solutionCode: `<?php

function assinarPayload(string $payloadJson, string $secretKey): string {
    return hash_hmac('sha256', $payloadJson, $secretKey);
}

function validarAssinatura(string $payloadJson, string $assinaturaRecebida, string $secretKey): bool {
    $esperada = assinarPayload($payloadJson, $secretKey);
    return hash_equals($esperada, $assinaturaRecebida);
}`,
    hints: [
      'Dica 1: hash_hmac("sha256", $data, $key) gera uma chave hexadecimal.',
      'Dica 2: hash_equals() protege o sistema contra ataques de temporização (timing attack).',
    ],
    testCases: [
      {
        description: 'Validação de webhook autêntico retorna true',
        expectedOutput: 'true',
      },
    ],
    explanation: 'A comparação estrita === interrompe a checagem no primeiro caractere divergente, permitindo que atacantes descubram o segredo medindo microssegundos de resposta. hash_equals resolve isso.',
  },

  // 8
  {
    id: 'php-avancado-08',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Arquitetura & Eventos',
    title: 'Despachante de Eventos Desacoplado (Event Dispatcher)',
    summary: 'Construa um despachante de eventos onde múltiplos ouvintes escutam e processam ações.',
    realWorldContext: 'Ao finalizar uma compra, você precisa emitir nota, baixar estoque e enviar e-mail. Fazer tudo isso no mesmo método cria um código espaguete gigante. O Event Dispatcher separa tudo em ouvintes independentes.',
    description: 'Complete o método dispatch que itera sobre a lista de callbacks registrados e os executa.',
    goal: 'Implementar a iteração do array de listeners.',
    templateCode: `<?php

class EventDispatcher {
    private array $listeners = [];

    public function listen(string $event, callable $listener): void {
        $this->listeners[$event][] = $listener;
    }

    public function dispatch(string $event, object $eventData): void {
        if (!isset($this->listeners[$event])) {
            return;
        }

        {{blank_0}}
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Execução de todos os ouvintes',
        expectedAnswers: [
          'foreach ($this->listeners[$event] as $listener) { $listener($eventData); }',
          'foreach ($this->listeners[$event] as $listener) {\n            $listener($eventData);\n        }',
        ],
        hint: 'Use foreach percorrendo $this->listeners[$event] e execute $listener($eventData).',
      },
    ],
    solutionCode: `<?php

class EventDispatcher {
    private array $listeners = [];

    public function listen(string $event, callable $listener): void {
        $this->listeners[$event][] = $listener;
    }

    public function dispatch(string $event, object $eventData): void {
        if (!isset($this->listeners[$event])) {
            return;
        }

        foreach ($this->listeners[$event] as $listener) {
            $listener($eventData);
        }
    }
}`,
    hints: [
      'Dica 1: Callables em PHP podem ser executados com a sintaxe de função regular $listener($eventData).',
      'Dica 2: Cada listener recebe o mesmo objeto de evento para reagir de forma assíncrona ou sequencial.',
    ],
    testCases: [
      {
        description: 'Listeners registrados são executados no dispatch',
        expectedOutput: 'Todos os callbacks invocados',
      },
    ],
    explanation: 'Event-driven architecture é padrão nos ecossistemas modernos de PHP para manter classes enxutas e focadas em uma única responsabilidade.',
  },

  // 9
  {
    id: 'php-avancado-09',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Filas & Background Jobs',
    title: 'Serialização de Jobs de Fila Assíncrona',
    summary: 'Modele o contrato de Jobs e serialize os parâmetros em JSON para persistência em mensageria.',
    realWorldContext: 'Serviços como Redis e RabbitMQ exigem payloads de fila em JSON contendo o nome da classe do Job e seus parâmetros para que workers em background processem tarefas pesadas.',
    description: 'Preencha a identificação da classe e o retorno serializado com json_encode.',
    goal: 'Obter a classe do Job e formatar a mensagem da fila.',
    templateCode: `<?php

interface JobInterface {
    public function handle(): void;
    public function getPayload(): array;
}

class QueueManager {
    public function push(JobInterface $job): string {
        $message = [
            'job_class'  => {{blank_0}},
            'payload'    => $job->getPayload(),
            'queued_at'  => time()
        ];

        {{blank_1}};
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Nome da classe do Job',
        expectedAnswers: [
          '$job::class',
          'get_class($job)',
        ],
        hint: 'Obtenha a classe usando $job::class ou get_class($job).',
      },
      {
        id: 'blank_1',
        label: 'Serialização da mensagem',
        expectedAnswers: [
          'return json_encode($message)',
        ],
        hint: 'Use a função nativa json_encode passando o array $message.',
      },
    ],
    solutionCode: `<?php

interface JobInterface {
    public function handle(): void;
    public function getPayload(): array;
}

class QueueManager {
    public function push(JobInterface $job): string {
        $message = [
            'job_class'  => $job::class,
            'payload'    => $job->getPayload(),
            'queued_at'  => time()
        ];

        return json_encode($message);
    }
}`,
    hints: [
      'Dica 1: Em PHP 8+, $job::class funciona diretamente em instâncias.',
      'Dica 2: O worker do outro lado lê o JSON, instancia a classe indicada e chama ->handle().',
    ],
    testCases: [
      {
        description: 'Gera payload JSON válido com a classe e dados',
        expectedOutput: 'JSON com job_class e payload',
      },
    ],
    explanation: 'Mensageria e filas assíncronas evitam timeouts HTTP ao processar uploads, e-mails e relatórios pesados.',
  },

  // 10
  {
    id: 'php-avancado-10',
    language: 'php',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Banco de Dados & PDO',
    title: 'Query Dinâmica Segura com Filtros Parametrizados',
    summary: 'Construa uma consulta SELECT com múltiplos filtros opcionais sem risco de injeção SQL.',
    realWorldContext: 'Telas de busca em relatórios e e-commerces combinam múltiplos campos opcionais (nome, preço, status). Concatenar valores diretamente na string SQL cria falhas graves de SQL Injection.',
    description: 'Prepare a instrução dinâmica no PDO e execute vinculando o array associativo de parâmetros.',
    goal: 'Preparar e executar consulta com binds nomeados dinâmicos.',
    templateCode: `<?php

function filtrarProdutos(PDO $pdo, array $filtros): array {
    $sql = "SELECT id, nome, preco FROM produtos WHERE 1=1";
    $params = [];

    if (!empty($filtros['termo'])) {
        $sql .= " AND nome LIKE :termo";
        $params[':termo'] = '%' . $filtros['termo'] . '%';
    }

    if (isset($filtros['preco_max'])) {
        $sql .= " AND preco <= :preco_max";
        $params[':preco_max'] = (float)$filtros['preco_max'];
    }

    {{blank_0}};
    {{blank_1}};

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Preparação do PDOStatement',
        expectedAnswers: [
          '$stmt = $pdo->prepare($sql)',
        ],
        hint: 'Use $pdo->prepare($sql) para compilar a consulta.',
      },
      {
        id: 'blank_1',
        label: 'Execução com parâmetros nomeados',
        expectedAnswers: [
          '$stmt->execute($params)',
        ],
        hint: 'Execute o statement passando $params.',
      },
    ],
    solutionCode: `<?php

function filtrarProdutos(PDO $pdo, array $filtros): array {
    $sql = "SELECT id, nome, preco FROM produtos WHERE 1=1";
    $params = [];

    if (!empty($filtros['termo'])) {
        $sql .= " AND nome LIKE :termo";
        $params[':termo'] = '%' . $filtros['termo'] . '%';
    }

    if (isset($filtros['preco_max'])) {
        $sql .= " AND preco <= :preco_max";
        $params[':preco_max'] = (float)$filtros['preco_max'];
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}`,
    hints: [
      'Dica 1: O truque WHERE 1=1 permite adicionar cláusulas AND sem condicionais extras de sintaxe.',
      'Dica 2: Passar $params em execute($params) sanitiza todos os tipos de dados automaticamente.',
    ],
    testCases: [
      {
        description: 'Retorna array associativo com os resultados filtrados',
        expectedOutput: 'Array de produtos',
      },
    ],
    explanation: 'A combinação de WHERE 1=1 com parâmetros dinâmicos em PDO é uma técnica limpa e segura contra injeção SQL em filtros de pesquisa.',
  },

  // 11 - Corrigir Erros (Transação PDO)
  {
    id: 'php-avancado-debug-01',
    language: 'php',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'PDO & Transações',
    title: 'Depuração: Ausência de Rollback em Transação Financeira PDO',
    summary: 'Corrija um erro gravíssimo de integridade onde uma exceção deixa a conexão em estado inconsistente por falta de rollback.',
    realWorldContext: 'Em transferências bancárias ou estornos de pedido, se a segunda operação falhar, a primeira NÃO pode persistir no banco. Chamar $pdo->rollBack() no bloco catch é obrigatório.',
    description: 'O método `transferirSaldo` abaixo inicia uma transação com `$pdo->beginTransaction()`. No entanto, se ocorrer um erro durante o débito ou crédito, o bloco `catch` apenas relança a exceção sem desfazer as alterações pendentes! Corrija adicionando o rollback da transação.',
    goal: 'Garantir que $pdo->rollBack() seja invocado antes de relançar ou registrar a exceção no bloco catch.',
    bugDescription: 'O bloco catch não chama $pdo->rollBack(), deixando a transação aberta ou incompleta em caso de falha.',
    buggyLineNumbers: [13, 14],
    initialBuggyCode: `<?php

function transferirSaldo(PDO $pdo, int $origemId, int $destinoId, float $valor): void {
    $pdo->beginTransaction();
    try {
        // Débito
        $stmtDebito = $pdo->prepare("UPDATE contas SET saldo = saldo - :v WHERE id = :id");
        $stmtDebito->execute([':v' => $valor, ':id' => $origemId]);

        // Crédito
        $stmtCredito = $pdo->prepare("UPDATE contas SET saldo = saldo + :v WHERE id = :id");
        $stmtCredito->execute([':v' => $valor, ':id' => $destinoId]);

        $pdo->commit();
    } catch (Throwable $e) {
        // BUG CRÍTICO: Falta desfazer a transação!
        throw $e;
    }
}
`,
    templateCode: `<?php

function transferirSaldo(PDO $pdo, int $origemId, int $destinoId, float $valor): void {
    $pdo->beginTransaction();
    try {
        $stmtDebito = $pdo->prepare("UPDATE contas SET saldo = saldo - :v WHERE id = :id");
        $stmtDebito->execute([':v' => $valor, ':id' => $origemId]);

        $stmtCredito = $pdo->prepare("UPDATE contas SET saldo = saldo + :v WHERE id = :id");
        $stmtCredito->execute([':v' => $valor, ':id' => $destinoId]);

        $pdo->commit();
    } catch (Throwable $e) {
        // Desfaça a transação com segurança:
        $pdo->rollBack();
        throw $e;
    }
}
`,
    solutionCode: `<?php

function transferirSaldo(PDO $pdo, int $origemId, int $destinoId, float $valor): void {
    $pdo->beginTransaction();
    try {
        $stmtDebito = $pdo->prepare("UPDATE contas SET saldo = saldo - :v WHERE id = :id");
        $stmtDebito->execute([':v' => $valor, ':id' => $origemId]);

        $stmtCredito = $pdo->prepare("UPDATE contas SET saldo = saldo + :v WHERE id = :id");
        $stmtCredito->execute([':v' => $valor, ':id' => $destinoId]);

        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}
`,
    hints: [
      'Dica 1: O método inverso de $pdo->commit() é $pdo->rollBack().',
      'Dica 2: Chame $pdo->rollBack() logo no início do bloco catch antes de throw $e.',
    ],
    testCases: [
      {
        description: 'Transação desfeita com rollBack() em caso de exceção',
        expectedOutput: '$pdo->rollBack() executado no catch',
      },
    ],
    validationRules: [
      {
        id: 'rule-rollback',
        description: 'Invocação do método $pdo->rollBack()',
        type: 'contains',
        target: 'rollBack',
      },
    ],
    explanation: 'Transações em bancos relacionais garantem atomicidade (princípio ACID). Se qualquer etapa do bloco try lançar uma exceção, o rollBack() desfaz imediatamente todas as alterações parciais.',
  },

  // 12 - Prever a Saída (Late Static Binding)
  {
    id: 'php-avancado-prever-01',
    language: 'php',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'POO Avançada & Late Static Binding',
    title: 'Previsão de Saída: self:: vs static:: (Late Static Binding)',
    summary: 'Preveja a diferença crucial de escopo entre self:: e static:: na resolução estática em tempo de execução.',
    realWorldContext: 'Frameworks modernos como Laravel (Eloquent ORM) e Symfony usam Late Static Binding intensamente para permitir que métodos estáticos da classe base instanciem ou consultem a subclasse correta.',
    description: 'Analise as classes `Model` e `Usuario`. Observe a diferença entre o método que usa `self::getNomeTabela()` e o método que usa `static::getNomeTabela()`. Preveja a saída exata impressa.',
    goal: 'Prever a resolução de nomes de classe estática no PHP 8.',
    templateCode: `<?php

class Model {
    public static function getNomeTabela(): string {
        return "tabela_base";
    }

    public static function testarSelf(): string {
        return self::getNomeTabela();
    }

    public static function testarStatic(): string {
        return static::getNomeTabela();
    }
}

class Usuario extends Model {
    public static function getNomeTabela(): string {
        return "usuarios";
    }
}

echo Usuario::testarSelf() . " | " . Usuario::testarStatic();
`,
    codeToPredict: `<?php

class Model {
    public static function getNomeTabela(): string {
        return "tabela_base";
    }

    public static function testarSelf(): string {
        return self::getNomeTabela();
    }

    public static function testarStatic(): string {
        return static::getNomeTabela();
    }
}

class Usuario extends Model {
    public static function getNomeTabela(): string {
        return "usuarios";
    }
}

echo Usuario::testarSelf() . " | " . Usuario::testarStatic();`,
    expectedOutputPrediction: 'tabela_base | usuarios',
    acceptableOutputPredictions: ['tabela_base | usuarios', 'tabela_base|usuarios'],
    solutionCode: `<?php

// self:: sempre resolve para a classe onde foi escrito (Model -> "tabela_base")
// static:: resolve para a classe chamada em tempo de execução (Usuario -> "usuarios")
echo Usuario::testarSelf() . " | " . Usuario::testarStatic(); // "tabela_base | usuarios"`,
    hints: [
      'Dica 1: "self" faz binding prematuro em tempo de compilação, apontando sempre para a classe onde o método foi definido (Model).',
      'Dica 2: "static" faz Late Static Binding em tempo de execução, referenciando a classe que invocou o método (Usuario).',
      'Dica 3: O separador é " | ".',
    ],
    testCases: [
      {
        description: 'Imprime "tabela_base | usuarios"',
        expectedOutput: 'tabela_base | usuarios',
      },
    ],
    explanation: 'Late Static Binding (introduzido com a palavra-chave "static::") resolve o método com base na classe chamada em tempo de execução (Usuario), enquanto "self::" fica preso à classe onde o método foi originalmente declarado (Model).',
  },

  // 13 - Desafio Prático (Middleware RBAC)
  {
    id: 'php-avancado-desafio-01',
    language: 'php',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Arquitetura & Segurança',
    title: 'Desafio Prático: Middleware de Controle de Acesso Baseado em Perfis (RBAC)',
    summary: 'Construa um componente de middleware que intercepta requisições, valida permissões por perfil e rejeita acessos não autorizados.',
    realWorldContext: 'APIs corporativas protegem rotas com middlewares de autorização. Usuários comuns não podem acessar endpoints com perfil "admin" ou "financeiro".',
    description: 'Implemente a classe `RbacMiddleware` com o método `public function autorizar(array $usuario, array $perfisPermitidos): bool`.\nRegras:\n1. Se $usuario não possuir a chave "perfil" ou "ativo", retornar false.\n2. Se $usuario["ativo"] for false, retornar false.\n3. Se o perfil do usuário (ex: "admin") estiver contido em $perfisPermitidos (usando in_array), retornar true.\n4. Caso contrário, retornar false.',
    goal: 'Criar a classe e método de autorização RBAC com tipagem estrita e validação de perfil.',
    practicalRequirements: [
      'Classe nomeada RbacMiddleware',
      'Método público autorizar(array $usuario, array $perfisPermitidos): bool',
      'Verificar se o usuário está ativo ($usuario["ativo"] === true)',
      'Checar permissão com in_array($usuario["perfil"], $perfisPermitidos)',
      'Retornar booleano estrito',
    ],
    templateCode: `<?php

class RbacMiddleware {
    public function autorizar(array $usuario, array $perfisPermitidos): bool {
        // Implemente as regras de verificação aqui
    }
}

// Testes:
$middleware = new RbacMiddleware();
$adminUser = ['id' => 1, 'nome' => 'Ana', 'perfil' => 'admin', 'ativo' => true];
$regularUser = ['id' => 2, 'nome' => 'Bruno', 'perfil' => 'cliente', 'ativo' => true];

var_dump($middleware->autorizar($adminUser, ['admin', 'gerente'])); // true
var_dump($middleware->autorizar($regularUser, ['admin'])); // false
`,
    solutionCode: `<?php

class RbacMiddleware {
    public function autorizar(array $usuario, array $perfisPermitidos): bool {
        if (!isset($usuario['perfil']) || !isset($usuario['ativo'])) {
            return false;
        }

        if ($usuario['ativo'] !== true) {
            return false;
        }

        return in_array($usuario['perfil'], $perfisPermitidos, true);
    }
}

$middleware = new RbacMiddleware();
$adminUser = ['id' => 1, 'nome' => 'Ana', 'perfil' => 'admin', 'ativo' => true];
$regularUser = ['id' => 2, 'nome' => 'Bruno', 'perfil' => 'cliente', 'ativo' => true];

var_dump($middleware->autorizar($adminUser, ['admin', 'gerente'])); // true
var_dump($middleware->autorizar($regularUser, ['admin'])); // false`,
    hints: [
      'Dica 1: Use !isset($usuario["perfil"]) || !isset($usuario["ativo"]) para validar a estrutura do array.',
      'Dica 2: Verifique se $usuario["ativo"] === true antes de prosseguir.',
      'Dica 3: in_array($usuario["perfil"], $perfisPermitidos, true) realiza checagem estrita de tipos.',
    ],
    testCases: [
      {
        description: 'Usuário admin ativo autorizado em rota com permissão admin',
        expectedOutput: 'true',
      },
      {
        description: 'Usuário cliente ativo rejeitado em rota exclusiva de admin',
        expectedOutput: 'false',
      },
    ],
    validationRules: [
      {
        id: 'rule-class',
        description: 'Declaração da classe RbacMiddleware',
        type: 'contains',
        target: 'class RbacMiddleware',
      },
      {
        id: 'rule-method',
        description: 'Declaração do método autorizar',
        type: 'contains',
        target: 'function autorizar',
      },
      {
        id: 'rule-in-array',
        description: 'Uso de in_array para checar perfis',
        type: 'contains',
        target: 'in_array',
      },
    ],
    explanation: 'O padrão RBAC (Role-Based Access Control) desacopla a regra de verificação de permissão do controlador principal, centralizando a política de segurança da aplicação.',
  },
];


import { Exercise } from '../../types/exercise';

export const phpDevProjects: Exercise[] = [
  {
    id: 'php-dev-01',
    language: 'php',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto Full-Stack: FinTech & Assinaturas',
    title: 'API de Checkout & Assinaturas Recorrentes SaaS',
    summary: 'Desenvolva o módulo central de cobrança recorrente, transações seguras e processamento de webhooks a partir das especificações do PO.',
    realWorldContext: 'SaaS moderno com cobrança por cartão e Pix que precisa renovar assinaturas mensalmente, lidar com falhas de pagamento e manter registro auditável de cobranças.',
    description: 'Você recebeu do Product Owner o documento de requisitos levantado com a diretoria do cliente "NexusPay". Sua missão como desenvolvedor backend PHP é estruturar o serviço de assinaturas aplicando arquitetura em camadas (Controller, Service, Repository), controle de concorrência com chave de idempotência e transações no PDO.',
    goal: 'Implementar a lógica de criação de assinatura, renovação automática e tratamento de webhook idempotente.',
    projectBrief: {
      clientName: 'NexusPay Soluções Financeiras',
      poName: 'Mariana Duarte (Lead Product Owner)',
      businessContext: 'A NexusPay está lançando sua nova plataforma de assinaturas para clientes corporativos. O sistema deve cobrar planos mensais ou anuais, garantir que uma cobrança nunca seja duplicada se a conexão falhar (idempotência), e registrar todo evento financeiro para conformidade fiscal.',
      userStories: [
        {
          asA: 'Cliente final',
          iWant: 'escolher um plano (Básico, Pro ou Enterprise) e assinar com cartão ou Pix',
          soThat: 'eu tenha acesso imediato aos recursos premium da plataforma.'
        },
        {
          asA: 'Sistema de Cobrança (Cron/Worker)',
          iWant: 'identificar assinaturas que venceram hoje e disparar a tentativa de renovação',
          soThat: 'o faturamento continue contínuo e assinaturas inadimplentes sejam suspensas após 3 tentativas.'
        },
        {
          asA: 'Auditor Fiscal e Financeiro',
          iWant: 'um log imutável de transações com ID da cobrança, chave de idempotência e status',
          soThat: 'haja conciliação bancária precisa sem divergências de centavos.'
        }
      ],
      functionalRequirements: [
        'RF01: O sistema deve validar a chave de Idempotency-Key presente no cabeçalho antes de qualquer débito.',
        'RF02: A criação de assinatura deve vincular o ID do cliente, o ID do plano e a data do próximo ciclo.',
        'RF03: Transações com o banco devem usar PDO com beginTransaction e rollBack para evitar cobranças órfãs.',
        'RF04: Webhook de confirmação de pagamento deve atualizar o status da fatura para "paga" e renovar a data de validade da assinatura (+30 dias para mensal).',
        'RF05: Em caso de recusa de cartão, a assinatura entra em status "tentativa_falha" e registra histórico para retry.'
      ],
      nonFunctionalRequirements: [
        'RNF01: Resposta da API de criação em menos de 200ms.',
        'RNF02: Código PHP 8.2+ estritamente tipado (declare(strict_types=1)).',
        'RNF03: Tratamento de exceções com hierarquia de erros de domínio (DomainException).',
        'RNF04: Senhas ou tokens de cartão nunca devem ser persistidos em log puro (mascaramento PCI-DSS).'
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'Validação da chave de Idempotência rejeita requisições duplicadas em menos de 24h.' },
        { id: 'ac-2', label: 'Assinatura é persistida com status "ativa" e data_proxima_cobranca calculada corretamente.' },
        { id: 'ac-3', label: 'Transação PDO reverte completamente se houver falha na inserção da fatura ou histórico.' },
        { id: 'ac-4', label: 'Webhook externo atualiza a assinatura e gera registro na tabela de auditoria com timestamp.' }
      ],
      databaseSchema: `-- Esquema Relacional PostgreSQL / MySQL (InnoDB)
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE planos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    valor_centavos INT NOT NULL,
    intervalo_meses INT DEFAULT 1
);

CREATE TABLE assinaturas (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES clientes(id),
    plano_id INT NOT NULL REFERENCES planos(id),
    status VARCHAR(30) NOT NULL DEFAULT 'pendente', -- pendente, ativa, inadimplente, cancelada
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_proxima_cobranca DATE NOT NULL,
    cartao_token VARCHAR(255) NULL
);

CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    assinatura_id INT NOT NULL REFERENCES assinaturas(id),
    idempotency_key VARCHAR(120) UNIQUE NOT NULL,
    valor_centavos INT NOT NULL,
    status VARCHAR(30) NOT NULL, -- sucesso, falha, estornado
    gateway_response JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      architectureNotes: 'Adote o padrão Clean Architecture / DDD simplificado: Divida em Entidades (Assinatura, Transação), Repositórios (AssinaturaRepository) e Serviços de Domínio (SubscriptionService). Utilize Injeção de Dependências.'
    },
    templateCode: `<?php
declare(strict_types=1);

namespace App\\Services;

use PDO;
use Exception;
use Throwable;

interface GatewayPagamentoInterface {
    public function cobrar(int $valorCentavos, string $tokenCartao): array;
}

interface AssinaturaRepositoryInterface {
    public function buscarPorId(int $id): ?array;
    public function criarAssinatura(int $clienteId, int $planoId, string $status, string $proximaCobranca): int;
    public function registrarTransacao(int $assinaturaId, string $idempotencyKey, int $valor, string $status): void;
    public function transacaoJaProcessada(string $idempotencyKey): bool;
}

class SubscriptionService {
    public function __construct(
        private readonly PDO $pdo,
        private readonly AssinaturaRepositoryInterface $repository,
        private readonly GatewayPagamentoInterface $gateway
    ) {}

    /**
     * Cria e cobra a primeira mensalidade da assinatura com segurança transacional e idempotência.
     */
    public function criarAssinaturaComCobranca(
        int $clienteId,
        int $planoId,
        int $valorCentavos,
        string $tokenCartao,
        string $idempotencyKey
    ): array {
        // 1. Validar idempotência
        if ($this->repository->transacaoJaProcessada($idempotencyKey)) {
            return ['sucesso' => false, 'motivo' => 'Requisicao duplicada (idempotencia)'];
        }

        // 2. Iniciar transação no banco
        $this->pdo->beginTransaction();

        try {
            // TODO: Chame o gateway de pagamento
            $cobranca = $this->gateway->cobrar($valorCentavos, $tokenCartao);

            if ($cobranca['status'] !== 'aprovado') {
                throw new Exception("Pagamento recusado pela operadora: " . ($cobranca['mensagem'] ?? 'Erro'));
            }

            // TODO: Calcular data da próxima cobrança (+30 dias)
            $proximaCobranca = date('Y-m-d', strtotime('+30 days'));

            // TODO: Criar a assinatura no banco
            $assinaturaId = $this->repository->criarAssinatura($clienteId, $planoId, 'ativa', $proximaCobranca);

            // TODO: Registrar a transação vinculada com a chave de idempotência
            $this->repository->registrarTransacao($assinaturaId, $idempotencyKey, $valorCentavos, 'sucesso');

            $this->pdo->commit();

            return [
                'sucesso' => true,
                'assinatura_id' => $assinaturaId,
                'proxima_cobranca' => $proximaCobranca
            ];
        } catch (Throwable $e) {
            $this->pdo->rollBack();
            return [
                'sucesso' => false,
                'motivo' => $e->getMessage()
            ];
        }
    }
}
`,
    solutionCode: `<?php
declare(strict_types=1);

namespace App\\Services;

use PDO;
use Exception;
use Throwable;

class SubscriptionService {
    public function __construct(
        private readonly PDO $pdo,
        private readonly AssinaturaRepositoryInterface $repository,
        private readonly GatewayPagamentoInterface $gateway
    ) {}

    public function criarAssinaturaComCobranca(
        int $clienteId,
        int $planoId,
        int $valorCentavos,
        string $tokenCartao,
        string $idempotencyKey
    ): array {
        if ($this->repository->transacaoJaProcessada($idempotencyKey)) {
            return ['sucesso' => false, 'motivo' => 'Requisicao duplicada (idempotencia)'];
        }

        $this->pdo->beginTransaction();

        try {
            $cobranca = $this->gateway->cobrar($valorCentavos, $tokenCartao);

            if ($cobranca['status'] !== 'aprovado') {
                throw new Exception("Pagamento recusado pela operadora: " . ($cobranca['mensagem'] ?? 'Erro desconhecido'));
            }

            $proximaCobranca = date('Y-m-d', strtotime('+30 days'));
            $assinaturaId = $this->repository->criarAssinatura($clienteId, $planoId, 'ativa', $proximaCobranca);
            $this->repository->registrarTransacao($assinaturaId, $idempotencyKey, $valorCentavos, 'sucesso');

            $this->pdo->commit();

            return [
                'sucesso' => true,
                'assinatura_id' => $assinaturaId,
                'proxima_cobranca' => $proximaCobranca
            ];
        } catch (Throwable $e) {
            $this->pdo->rollBack();
            return [
                'sucesso' => false,
                'motivo' => $e->getMessage()
            ];
        }
    }
}`,
    hints: [
      'Valide a chave de idempotência antes de disparar qualquer cobrança de cartão no gateway para prevenir cobrança duplicada.',
      'A transação do banco deve proteger a inserção da assinatura e da transação; se a gravação local falhar após o débito, registre para estorno imediato.',
      'Sempre armazene valores monetários em inteiros (centavos) para evitar imprecisões de arredondamento de float no PHP.'
    ],
    testCases: [
      {
        description: 'Assinatura criada com sucesso retorna ID e status ativa',
        expectedOutput: 'sucesso: true, assinatura_id gerado',
      },
      {
        description: 'Requisição com mesma chave de idempotência é rejeitada',
        expectedOutput: 'Requisicao duplicada (idempotencia)',
      }
    ],
    explanation: 'Em sistemas SaaS de missão crítica, a união de Idempotency Keys com transações ACID no PDO é o que separa um checkout vulnerável a cobranças fantasmas de uma arquitetura enterprise robusta.'
  },

  {
    id: 'php-dev-02',
    language: 'php',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto Backend: Gestão de Ordens de Serviço (FieldOps)',
    title: 'Máquina de Estados & Workflow de Ordens de Serviço',
    summary: 'Implemente a máquina de estados que valida as transições permitidas (Aberta -> Agendada -> Em Atendimento -> Concluída) e calcula horas técnicas trabalhadas.',
    realWorldContext: 'Plataforma para empresas de suporte técnico e manutenção predial onde técnicos atualizam chamados em tempo real pelo celular.',
    description: 'O PO do projeto levantou as regras de negócio com o gerente de operações da "FieldOps Brasil". Uma ordem de serviço só pode seguir um caminho estrito de transições, com registro de técnico responsável, apontamento de tempo e validação de checklist antes do encerramento.',
    goal: 'Construir a classe de controle de fluxo de Ordem de Serviço com máquina de estados finita e validação de regras.',
    projectBrief: {
      clientName: 'FieldOps Tecnologia em Serviços',
      poName: 'Carlos Eduardo (Senior PO - Operações & Logística)',
      businessContext: 'A FieldOps opera mais de 1.200 técnicos em campo diariamente. Erros de status (como pular direto para concluída sem ter iniciado o atendimento ou sem checklist assinado) geravam prejuízos em auditorias contratuais e reclamações dos clientes corporativos.',
      userStories: [
        {
          asA: 'Coordenador de Operações',
          iWant: 'distribuir uma ordem aberta para um técnico específico e agendar a data/hora',
          soThat: 'o cliente receba notificação e o técnico veja o chamado em sua escala.'
        },
        {
          asA: 'Técnico de Campo',
          iWant: 'fazer o check-in (iniciar atendimento) e preencher o laudo com foto/itens verificados',
          soThat: 'o tempo em trânsito e o tempo em serviço sejam cronometrados com precisão.'
        },
        {
          asA: 'Cliente Corporativo',
          iWant: 'assinar digitalmente a ordem na finalização e receber o laudo com o total de horas',
          soThat: 'haja transparência nos valores faturados por hora técnica.'
        }
      ],
      functionalRequirements: [
        'RF01: Apenas as seguintes transições de status são válidas: ABERTA -> AGENDADA; AGENDADA -> EM_ANDAMENTO; EM_ANDAMENTO -> CONCLUIDA; e de qualquer status anterior para CANCELADA.',
        'RF02: Não é permitido concluir uma OS sem que ela tenha passado pelo status EM_ANDAMENTO com timestamp de início registrado.',
        'RF03: O cálculo de duração deve computar a diferença exata em minutos entre o início e o término.',
        'RF04: Deve registrar em log de histórico o usuário que realizou cada mudança de estado.'
      ],
      nonFunctionalRequirements: [
        'RNF01: Lógica encapsulada com Enums do PHP 8.1 para os Status.',
        'RNF02: Lançamento de OrdemServicoTransicaoInvalidaException em tentativas de salto de estado.',
        'RNF03: Testabilidade unitária sem dependência direta de banco de dados.'
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'Tentativa de transição ABERTA -> CONCLUIDA lança exceção com mensagem explicativa.' },
        { id: 'ac-2', label: 'Transição para AGENDADA exige técnico_id válido e data futura.' },
        { id: 'ac-3', label: 'Conclusão calcula tempo decorrido e status muda para CONCLUIDA.' },
        { id: 'ac-4', label: 'Cancelamento é aceito com justificativa obrigatória de no mínimo 15 caracteres.' }
      ],
      databaseSchema: `CREATE TABLE ordens_servico (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    cliente_id INT NOT NULL,
    tecnico_id INT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ABERTA',
    descricao_problema TEXT NOT NULL,
    data_agendada TIMESTAMP NULL,
    iniciado_em TIMESTAMP NULL,
    finalizado_em TIMESTAMP NULL,
    duracao_minutos INT NULL,
    justificativa_cancelamento TEXT NULL
);

CREATE TABLE os_historico_estados (
    id SERIAL PRIMARY KEY,
    os_id INT NOT NULL REFERENCES ordens_servico(id),
    status_anterior VARCHAR(30) NOT NULL,
    status_novo VARCHAR(30) NOT NULL,
    autor_id INT NOT NULL,
    motivo VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      architectureNotes: 'Implemente o State Pattern ou uma máquina de estados baseada em Enum com método `podeTransitarPara(StatusOS $novoStatus): bool` e `validarTransicao()`. Mantenha a regra pura no domínio.'
    },
    templateCode: `<?php
declare(strict_types=1);

namespace App\\Domain;

use InvalidArgumentException;
use DateTimeImmutable;

enum StatusOS: string {
    case ABERTA         = 'ABERTA';
    case AGENDADA       = 'AGENDADA';
    case EM_ANDAMENTO   = 'EM_ANDAMENTO';
    case CONCLUIDA      = 'CONCLUIDA';
    case CANCELADA      = 'CANCELADA';

    public function transicoesPermitidas(): array {
        return match($this) {
            self::ABERTA       => [self::AGENDADA, self::CANCELADA],
            self::AGENDADA     => [self::EM_ANDAMENTO, self::CANCELADA],
            self::EM_ANDAMENTO => [self::CONCLUIDA, self::CANCELADA],
            self::CONCLUIDA, self::CANCELADA => []
        };
    }
}

class OrdemServico {
    private StatusOS $status;
    private ?int $tecnicoId = null;
    private ?DateTimeImmutable $iniciadoEm = null;
    private ?DateTimeImmutable $finalizadoEm = null;
    private ?int $duracaoMinutos = null;

    public function __construct(
        private readonly int $id,
        private readonly string $codigo,
        private readonly int $clienteId,
        private readonly string $descricao
    ) {
        $this->status = StatusOS::ABERTA;
    }

    public function agendar(int $tecnicoId, DateTimeImmutable $dataHora): void {
        $this->garantirTransicaoValida(StatusOS::AGENDADA);
        $this->tecnicoId = $tecnicoId;
        $this->status = StatusOS::AGENDADA;
    }

    public function iniciarAtendimento(DateTimeImmutable $inicio): void {
        $this->garantirTransicaoValida(StatusOS::EM_ANDAMENTO);
        $this->iniciadoEm = $inicio;
        $this->status = StatusOS::EM_ANDAMENTO;
    }

    public function concluirAtendimento(DateTimeImmutable $fim): void {
        $this->garantirTransicaoValida(StatusOS::CONCLUIDA);
        
        // TODO: Calcule a duração em minutos entre $this->iniciadoEm e $fim
        $intervalo = $this->iniciadoEm->diff($fim);
        $this->duracaoMinutos = ($intervalo->days * 24 * 60) + ($intervalo->h * 60) + $intervalo->i;
        
        $this->finalizadoEm = $fim;
        $this->status = StatusOS::CONCLUIDA;
    }

    private function garantirTransicaoValida(StatusOS $proximo): void {
        if (!in_array($proximo, $this->status->transicoesPermitidas(), true)) {
            throw new InvalidArgumentException("Transição ilegal de {$this->status->value} para {$proximo->value}");
        }
    }

    public function getStatus(): StatusOS { return $this->status; }
    public function getDuracaoMinutos(): ?int { return $this->duracaoMinutos; }
}
`,
    solutionCode: `<?php
declare(strict_types=1);

namespace App\\Domain;

use InvalidArgumentException;
use DateTimeImmutable;

enum StatusOS: string {
    case ABERTA         = 'ABERTA';
    case AGENDADA       = 'AGENDADA';
    case EM_ANDAMENTO   = 'EM_ANDAMENTO';
    case CONCLUIDA      = 'CONCLUIDA';
    case CANCELADA      = 'CANCELADA';

    public function transicoesPermitidas(): array {
        return match($this) {
            self::ABERTA       => [self::AGENDADA, self::CANCELADA],
            self::AGENDADA     => [self::EM_ANDAMENTO, self::CANCELADA],
            self::EM_ANDAMENTO => [self::CONCLUIDA, self::CANCELADA],
            self::CONCLUIDA, self::CANCELADA => []
        };
    }
}

class OrdemServico {
    private StatusOS $status;
    private ?int $tecnicoId = null;
    private ?DateTimeImmutable $iniciadoEm = null;
    private ?DateTimeImmutable $finalizadoEm = null;
    private ?int $duracaoMinutos = null;

    public function __construct(
        private readonly int $id,
        private readonly string $codigo,
        private readonly int $clienteId,
        private readonly string $descricao
    ) {
        $this->status = StatusOS::ABERTA;
    }

    public function agendar(int $tecnicoId, DateTimeImmutable $dataHora): void {
        $this->garantirTransicaoValida(StatusOS::AGENDADA);
        $this->tecnicoId = $tecnicoId;
        $this->status = StatusOS::AGENDADA;
    }

    public function iniciarAtendimento(DateTimeImmutable $inicio): void {
        $this->garantirTransicaoValida(StatusOS::EM_ANDAMENTO);
        $this->iniciadoEm = $inicio;
        $this->status = StatusOS::EM_ANDAMENTO;
    }

    public function concluirAtendimento(DateTimeImmutable $fim): void {
        $this->garantirTransicaoValida(StatusOS::CONCLUIDA);
        
        $intervalo = $this->iniciadoEm->diff($fim);
        $this->duracaoMinutos = ($intervalo->days * 24 * 60) + ($intervalo->h * 60) + $intervalo->i;
        
        $this->finalizadoEm = $fim;
        $this->status = StatusOS::CONCLUIDA;
    }

    private function garantirTransicaoValida(StatusOS $proximo): void {
        if (!in_array($proximo, $this->status->transicoesPermitidas(), true)) {
            throw new InvalidArgumentException("Transição ilegal de {$this->status->value} para {$proximo->value}");
        }
    }

    public function getStatus(): StatusOS { return $this->status; }
    public function getDuracaoMinutos(): ?int { return $this->duracaoMinutos; }
}`,
    hints: [
      'Encapsular as transições permitidas no próprio Enum impede que regras de status fiquem espalhadas em dezenas de controllers.',
      'O método diff() de DateTimeImmutable gera um DateInterval seguro sem problemas de fuso horário.'
    ],
    testCases: [
      {
        description: 'Fluxo ABERTA -> AGENDADA -> EM_ANDAMENTO -> CONCLUIDA concluído com cálculo de minutos',
        expectedOutput: 'status: CONCLUIDA, duracao calculada',
      },
      {
        description: 'Transição direta ABERTA -> CONCLUIDA lança InvalidArgumentException',
        expectedOutput: 'Exceção de transição ilegal',
      }
    ],
    explanation: 'Máquinas de estado embutidas nas entidades de domínio garantem integridade inquebrável, mesmo sob concorrência e acessos múltiplos de API.'
  },

  {
    id: 'php-dev-03',
    language: 'php',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto Enterprise: Controle de Acesso RBAC & Auditoria LGPD',
    title: 'Módulo RBAC (Role-Based Access Control) com Trilha de Auditoria',
    summary: 'Construa um interceptor de permissões baseado em papéis e permissões granulares com gravação obrigatória de trilha de auditoria para conformidade LGPD.',
    realWorldContext: 'Sistemas corporativos na área de saúde e governo necessitam comprovar quem acessou ou modificou dados sensíveis com carimbo de tempo e IP do requisitante.',
    description: 'O Product Owner de Segurança e Compliance especificou os requisitos para autorização granular de usuários. O sistema deve verificar permissões específicas como "paciente.prontuario.ler" em vez de apenas checar se o usuário é "admin".',
    goal: 'Criar a classe de autorização RBAC e o decorator de auditoria de acessos.',
    projectBrief: {
      clientName: 'OmniHealth Hospitalar',
      poName: 'Beatriz Vasconcelos (PO - Segurança e Compliance)',
      businessContext: 'A OmniHealth gerencia 4 hospitais e precisa atender às diretrizes rígidas da LGPD e auditoria do CFM. Médicos, residentes e recepcionistas têm níveis de acesso totalmente distintos. Qualquer acesso a prontuário deve ser registrado com identificador do usuário e timestamp.',
      userStories: [
        {
          asA: 'Médico Plantonista',
          iWant: 'ter acesso de leitura e escrita aos prontuários dos pacientes da minha ala',
          soThat: 'eu registre prescrições e laudos durante o atendimento.'
        },
        {
          asA: 'Recepcionista',
          iWant: 'acessar apenas os dados cadastrais (nome, convênio, telefone) sem ver prontuário clínico',
          soThat: 'o sigilo médico seja rigorosamente preservado.'
        },
        {
          asA: 'Auditor de Segurança',
          iWant: 'consultar o histórico de acessos por paciente para investigar possíveis vazamentos',
          soThat: 'a instituição comprove conformidade perante órgãos reguladores.'
        }
      ],
      functionalRequirements: [
        'RF01: Um usuário possui múltiplos Papéis (Roles), e cada Papel possui múltiplas Permissões (Permissions).',
        'RF02: A verificação canAccess(string $permissao): bool deve retornar true se QUALQUER papel do usuário contiver a permissão.',
        'RF03: Sempre que canAccess() for executado para dados sensíveis, um evento de auditoria deve ser registrado com resultado (PERMITIDO/NEGADO).',
        'RF04: Suporte a cache em memória das permissões do usuário durante o ciclo de vida da requisição para alta performance.'
      ],
      nonFunctionalRequirements: [
        'RNF01: Resolução de permissões em tempo O(1) usando arrays associativos (chaves como hash set).',
        'RNF02: Falha segura: em caso de qualquer ambiguidade ou erro, o acesso deve ser NEGADO por padrão.',
        'RNF03: Código compatível com injeção de dependência via PSR-11 container.'
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'Médico com papel CLINICO consegue ler e prescrever medicamentos.' },
        { id: 'ac-2', label: 'Recepcionista é bloqueada ao tentar acessar permissão paciente.prontuario.ler.' },
        { id: 'ac-3', label: 'Acesso negado gera log de segurança com severidade WARNING e ID do usuário.' },
        { id: 'ac-4', label: 'Permissões duplicadas entre papéis são resolvidas sem erro.' }
      ],
      databaseSchema: `CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(255)
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) UNIQUE NOT NULL, -- ex: paciente.prontuario.ler
    descricao VARCHAR(255)
);

CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NULL,
    status VARCHAR(20) NOT NULL, -- GRANTED, DENIED
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      architectureNotes: 'Separe a verificação de autorização da gravação de auditoria utilizando o padrão Decorator ou disparando um evento de domínio assíncrono.'
    },
    templateCode: `<?php
declare(strict_types=1);

namespace App\\Security;

interface AuditLoggerInterface {
    public function log(int $userId, string $permissao, bool $concedido, string $ip): void;
}

class RbacAuthorizer {
    /** @var array<string, bool> */
    private array $permissaoCache = [];

    public function __construct(
        private readonly int $userId,
        private readonly array $papeis, // ex: ['MEDICO', 'PLANTONISTA']
        private readonly array $mapaPapelPermissoes, // ex: ['MEDICO' => ['paciente.ler', 'prescricao.criar']]
        private readonly AuditLoggerInterface $auditLogger,
        private readonly string $clientIp
    ) {
        $this->inicializarPermissoes();
    }

    private function inicializarPermissoes(): void {
        foreach ($this->papeis as $papel) {
            if (isset($this->mapaPapelPermissoes[$papel])) {
                foreach ($this->mapaPapelPermissoes[$papel] as $perm) {
                    $this->permissaoCache[$perm] = true;
                }
            }
        }
    }

    public function canAccess(string $permissao): bool {
        $permitido = isset($this->permissaoCache[$permissao]);

        // Registrar auditoria para LGPD
        $this->auditLogger->log($this->userId, $permissao, $permitido, $this->clientIp);

        return $permitido;
    }
}
`,
    solutionCode: `<?php
declare(strict_types=1);

namespace App\\Security;

class RbacAuthorizer {
    private array $permissaoCache = [];

    public function __construct(
        private readonly int $userId,
        private readonly array $papeis,
        private readonly array $mapaPapelPermissoes,
        private readonly AuditLoggerInterface $auditLogger,
        private readonly string $clientIp
    ) {
        $this->inicializarPermissoes();
    }

    private function inicializarPermissoes(): void {
        foreach ($this->papeis as $papel) {
            if (isset($this->mapaPapelPermissoes[$papel])) {
                foreach ($this->mapaPapelPermissoes[$papel] as $perm) {
                    $this->permissaoCache[$perm] = true;
                }
            }
        }
    }

    public function canAccess(string $permissao): bool {
        $permitido = isset($this->permissaoCache[$permissao]);
        $this->auditLogger->log($this->userId, $permissao, $permitido, $this->clientIp);
        return $permitido;
    }
}`,
    hints: [
      'Indexar permissões como chaves de array ($cache[$perm] = true) permite checagem O(1) via isset().',
      'Auditoria de autorização deve registrar tanto concessões quanto recusas para detecção de anomalias.'
    ],
    testCases: [
      {
        description: 'Usuário com papel MEDICO tem acesso a paciente.ler com auditoria GRANTED',
        expectedOutput: 'true, log registrado',
      },
      {
        description: 'Usuário sem a permissão tem acesso negado e auditoria DENIED',
        expectedOutput: 'false, log registrado',
      }
    ],
    explanation: 'Em sistemas enterprise modernos, RBAC granular e rastreamento de acessos são requisitos legais inegociáveis para segurança da informação e auditoria governamental.'
  }
];

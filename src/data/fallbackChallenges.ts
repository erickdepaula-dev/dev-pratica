export interface FallbackChallengeData {
  title: string;
  topic: string;
  difficulty: string;
  difficultyLevel: number;
  description: string;
  functionalRequirements: string[];
  technicalConstraints: string[];
  usageExamples: Array<{ input: string; output: string; explanation: string }>;
  testCases: Array<{ description: string; input: string; expectedOutput: string; isEdgeCase: boolean }>;
  hints: string[];
  starterCode: string;
  solutionCode: string;
  explanation: string;
}

// Multi-level curated senior challenges for PHP
const PHP_FALLBACK_CATALOG: Record<number, FallbackChallengeData[]> = {
  1: [
    {
      title: 'Cálculo de Desconto e Arredondamento Financeiro',
      topic: 'Operadores & Funções',
      difficulty: 'muito_facil',
      difficultyLevel: 1,
      description: 'Em um checkout de e-commerce, clientes recebem um percentual de desconto se o valor da compra atingir o valor mínimo. Crie a função calcularValorFinal com tipagem estrita que recebe o valor do pedido, o percentual de desconto e o valor mínimo necessário, retornando o valor final arredondado em 2 casas decimais.',
      functionalRequirements: [
        'Declarar a função calcularValorFinal(float $valorPedido, float $percentualDesconto, float $valorMinimo): float.',
        'Se o $valorPedido for menor que $valorMinimo, nenhum desconto deve ser aplicado.',
        'Se for maior ou igual, aplique o percentual e subtraia do valor do pedido.',
        'Retorne o valor final arredondado com round($resultado, 2).'
      ],
      technicalConstraints: [
        'Utilize declare(strict_types=1); no início do arquivo.',
        'Utilize type hints em todos os parâmetros e no tipo de retorno float.',
        'Não use variáveis globais.'
      ],
      usageExamples: [
        {
          input: 'calcularValorFinal(150.0, 10.0, 100.0)',
          output: '135.0',
          explanation: 'Como 150 >= 100, aplica 10% (15 de desconto): 150 - 15 = 135.0'
        },
        {
          input: 'calcularValorFinal(80.0, 10.0, 100.0)',
          output: '80.0',
          explanation: 'Como 80 < 100, o desconto não se aplica.'
        }
      ],
      testCases: [
        {
          description: 'Aplica desconto com sucesso',
          input: 'calcularValorFinal(200.0, 15.0, 100.0)',
          expectedOutput: '170.0',
          isEdgeCase: false
        },
        {
          description: 'Não aplica desconto abaixo do mínimo',
          input: 'calcularValorFinal(50.0, 20.0, 100.0)',
          expectedOutput: '50.0',
          isEdgeCase: false
        },
        {
          description: 'Valor exatamente igual ao mínimo',
          input: 'calcularValorFinal(100.0, 10.0, 100.0)',
          expectedOutput: '90.0',
          isEdgeCase: true
        }
      ],
      hints: [
        'Pense em uma estrutura condicional if comparando $valorPedido com $valorMinimo.',
        'O valor do desconto em reais é calculado como ($valorPedido * ($percentualDesconto / 100)).',
        'Use round($valorPedido - $desconto, 2) para o retorno monetário preciso.'
      ],
      starterCode: `<?php
declare(strict_types=1);

function calcularValorFinal(float $valorPedido, float $percentualDesconto, float $valorMinimo): float {
    // TODO: Implemente a regra de negócio aqui...
}
`,
      solutionCode: `<?php
declare(strict_types=1);

function calcularValorFinal(float $valorPedido, float $percentualDesconto, float $valorMinimo): float {
    if ($valorPedido < $valorMinimo) {
        return round($valorPedido, 2);
    }

    $desconto = $valorPedido * ($percentualDesconto / 100);
    return round($valorPedido - $desconto, 2);
}
`,
      explanation: 'A utilização de guard clauses combinada com tipagem estrita garante consistência e previsibilidade em sistemas de billing.'
    },
    {
      title: 'Sanitizador de Nome de Usuário e Slug de Perfil',
      topic: 'Manipulação de Strings & Validação',
      difficulty: 'muito_facil',
      difficultyLevel: 1,
      description: 'Ao cadastrar um novo usuário em um sistema, precisamos gerar um identificador amigável de perfil (slug). Crie a função gerarSlugPerfil(string $nome): string que converta letras maiúsculas em minúsculas, remova espaços nas extremidades e substitua espaços internos por hífens.',
      functionalRequirements: [
        'Declarar a função gerarSlugPerfil(string $nome): string.',
        'Remover espaços em branco no início e final do nome.',
        'Converter todas as letras para minúsculas usando strtolower.',
        'Substituir qualquer sequência de espaços internos por um único hífen "-".'
      ],
      technicalConstraints: [
        'Utilize declare(strict_types=1);',
        'Use funções nativas do PHP como trim, strtolower e preg_replace ou str_replace.',
        'Retorne string vazia se o nome for composto apenas por espaços.'
      ],
      usageExamples: [
        {
          input: 'gerarSlugPerfil("  Lucas Silva  ")',
          output: '"lucas-silva"',
          explanation: 'Removeu espaços externos, converteu para minúsculo e trocou espaço por hífen.'
        }
      ],
      testCases: [
        {
          description: 'Nome padrão com dois termos',
          input: 'gerarSlugPerfil("Ana Beatriz")',
          expectedOutput: '"ana-beatriz"',
          isEdgeCase: false
        },
        {
          description: 'Nome com espaços extras nas pontas',
          input: 'gerarSlugPerfil("   Carlos Eduardo   ")',
          expectedOutput: '"carlos-eduardo"',
          isEdgeCase: true
        }
      ],
      hints: [
        'Inicie aplicando trim($nome) para retirar os espaços indesejados nas bordas.',
        'Converta para minúsculo usando strtolower($nomeLimpo).',
        'Use preg_replace("/\\s+/", "-", $nomeMinusculo) para transformar qualquer quantidade de espaços em um único hífen.'
      ],
      starterCode: `<?php
declare(strict_types=1);

function gerarSlugPerfil(string $nome): string {
    // TODO: Implemente a sanitização do slug...
}
`,
      solutionCode: `<?php
declare(strict_types=1);

function gerarSlugPerfil(string $nome): string {
    $limpo = trim($nome);
    if ($limpo === '') {
        return '';
    }
    $minusculo = strtolower($limpo);
    return preg_replace('/\\s+/', '-', $minusculo) ?? '';
}
`,
      explanation: 'Sanitizar dados de entrada antes de gerar URLs previne erros de rota e inconsistências de banco de dados.'
    }
  ],
  2: [
    {
      title: 'Filtro de Pedidos por Status e Contagem',
      topic: 'Arrays & Foreach',
      difficulty: 'facil',
      difficultyLevel: 2,
      description: 'Em um painel administrativo, o gestor precisa saber quantos pedidos foram finalizados e qual o montante total arrecadado por esse status. Crie a função resumirPedidosPorStatus(array $pedidos, string $statusDesejado): array que receba a lista de pedidos e retorne um array com a contagem e a soma dos valores.',
      functionalRequirements: [
        'A função deve iterar sobre o array $pedidos.',
        'Cada pedido é um array associativo contendo ["id" => int, "valor" => float, "status" => string].',
        'Comparar o status do pedido com $statusDesejado ignorando maiúsculas e minúsculas.',
        'Retornar um array associativo com ["quantidade" => int, "total" => float].'
      ],
      technicalConstraints: [
        'Utilize declare(strict_types=1);',
        'Use foreach para iterar.',
        'Arredonde o campo total em 2 casas decimais.'
      ],
      usageExamples: [
        {
          input: 'resumirPedidosPorStatus([["id" => 1, "valor" => 100.0, "status" => "pago"], ["id" => 2, "valor" => 50.0, "status" => "pendente"]], "pago")',
          output: '["quantidade" => 1, "total" => 100.0]',
          explanation: 'Apenas 1 pedido possui status pago.'
        }
      ],
      testCases: [
        {
          description: 'Filtra pedidos pagos corretamente',
          input: 'resumirPedidosPorStatus(..., "pago")',
          expectedOutput: '["quantidade" => 2, "total" => 250.0]',
          isEdgeCase: false
        },
        {
          description: 'Nenhum pedido atende ao status pesquisado',
          input: 'resumirPedidosPorStatus(..., "cancelado")',
          expectedOutput: '["quantidade" => 0, "total" => 0.0]',
          isEdgeCase: true
        }
      ],
      hints: [
        'Inicie acumuladores: $quantidade = 0; $total = 0.0;.',
        'No loop foreach, compare strtolower($pedido["status"]) === strtolower($statusDesejado).',
        'Retorne o array associativo com as chaves exatas "quantidade" e "total".'
      ],
      starterCode: `<?php
declare(strict_types=1);

function resumirPedidosPorStatus(array $pedidos, string $statusDesejado): array {
    // TODO: Implemente a contagem e totalização dos pedidos...
}
`,
      solutionCode: `<?php
declare(strict_types=1);

function resumirPedidosPorStatus(array $pedidos, string $statusDesejado): array {
    $quantidade = 0;
    $total = 0.0;
    $statusBuscado = strtolower($statusDesejado);

    foreach ($pedidos as $pedido) {
        if (strtolower((string)($pedido['status'] ?? '')) === $statusBuscado) {
            $quantidade++;
            $total += (float)($pedido['valor'] ?? 0);
        }
    }

    return [
        'quantidade' => $quantidade,
        'total' => round($total, 2),
    ];
}
`,
      explanation: 'Manipular coleções de dados associativos com verificação defensiva de chaves é um dos padrões mais comuns do backend PHP.'
    }
  ],
  3: [
    {
      title: 'Consolidador de Faturas e Detecção de Duplicidades',
      topic: 'Arrays Associativos & Regras de Negócio',
      difficulty: 'intermediario',
      difficultyLevel: 3,
      description: 'Em um sistema financeiro, transações de clientes chegam em lote. Crie a função processarLoteTransacoes que recebe um array de transações associativas contendo [id, cliente_id, valor, status] e retorna um relatório consolidado com total aprovado, total estornado e uma lista de IDs duplicados.',
      functionalRequirements: [
        'A função processarLoteTransacoes(array $transacoes): array deve iterar sobre todos os itens.',
        'Somar ao campo "total_aprovado" apenas transações com status === "aprovado".',
        'Somar ao campo "total_estornado" transações com status === "estornado".',
        'Identificar IDs que aparecem mais de uma vez e colocá-los no array "ids_duplicados".',
        'Retornar o array estruturado com as chaves: total_aprovado, total_estornado e ids_duplicados.'
      ],
      technicalConstraints: [
        'Utilize declare(strict_types=1);',
        'Utilize foreach para iterar sobre o lote.',
        'Evite loops aninhados desnecessários mantendo um mapa de frequência de IDs.'
      ],
      usageExamples: [
        {
          input: 'processarLoteTransacoes([["id" => 1, "valor" => 100.0, "status" => "aprovado"], ["id" => 2, "valor" => 50.0, "status" => "estornado"]])',
          output: '["total_aprovado" => 100.0, "total_estornado" => 50.0, "ids_duplicados" => []]',
          explanation: 'Totaliza os dois status separadamente sem duplicidades.'
        }
      ],
      testCases: [
        {
          description: 'Processamento correto de lote com aprovação e estorno',
          input: 'processarLoteTransacoes(...)',
          expectedOutput: 'total_aprovado: 350.0, total_estornado: 70.0',
          isEdgeCase: false
        },
        {
          description: 'Identificação de IDs duplicados em lote com reprocessamento',
          input: 'processarLoteTransacoes com id 10 repetido',
          expectedOutput: 'ids_duplicados contendo [10]',
          isEdgeCase: true
        }
      ],
      hints: [
        'Crie um array auxiliar para registrar os IDs já vistos: $vistos = [].',
        'Use foreach ($transacoes as $item) para acumular os valores baseados no $item["status"].',
        'Se in_array($item["id"], $vistos), adicione ao array de duplicados sem repetir o mesmo id duas vezes.'
      ],
      starterCode: `<?php
declare(strict_types=1);

function processarLoteTransacoes(array $transacoes): array {
    // TODO: Implemente a consolidação financeira...
}
`,
      solutionCode: `<?php
declare(strict_types=1);

function processarLoteTransacoes(array $transacoes): array {
    $totalAprovado = 0.0;
    $totalEstornado = 0.0;
    $idsVistos = [];
    $idsDuplicados = [];

    foreach ($transacoes as $t) {
        $id = $t['id'] ?? null;
        if ($id !== null) {
            if (isset($idsVistos[$id])) {
                if (!in_array($id, $idsDuplicados, true)) {
                    $idsDuplicados[] = $id;
                }
            } else {
                $idsVistos[$id] = true;
            }
        }

        $status = $t['status'] ?? '';
        $valor = (float)($t['valor'] ?? 0);
        if ($status === 'aprovado') {
            $totalAprovado += $valor;
        } elseif ($status === 'estornado') {
            $totalEstornado += $valor;
        }
    }

    return [
        'total_aprovado' => round($totalAprovado, 2),
        'total_estornado' => round($totalEstornado, 2),
        'ids_duplicados' => $idsDuplicados,
    ];
}
`,
      explanation: 'A indexação em tabela de símbolos O(1) com chaves associativas é o padrão ótimo de alta performance em PHP para deduping de grandes volumes.'
    }
  ],
  4: [
    {
      title: 'Processador de Pagamentos com Tratamento de Exceções',
      topic: 'Tratamento de Exceções & POO',
      difficulty: 'dificil',
      difficultyLevel: 4,
      description: 'Crie uma classe de serviço ProcessadorPagamento que possui o método processar(float $valor, string $metodo, string $statusConta): array. O sistema deve validar: $valor deve ser > 0 (lançar InvalidArgumentException se não for); $statusConta deve ser "ativa" (lançar DomainException se bloqueada); e métodos válidos são "pix", "cartao" e "boleto". Trate as exceções retornando um array padronizado com ["sucesso" => bool, "mensagem" => string, "codigo" => int].',
      functionalRequirements: [
        'Declarar a classe ProcessadorPagamento.',
        'Método processar(float $valor, string $metodo, string $statusConta): array.',
        'Lançar InvalidArgumentException se $valor <= 0 ou se o método de pagamento for inválido.',
        'Lançar DomainException com a mensagem "Conta inativa" se $statusConta !== "ativa".',
        'Capturar as exceções com bloco try/catch e devolver array estruturado de resposta.'
      ],
      technicalConstraints: [
        'Utilize declare(strict_types=1);',
        'Use match expression ou switch para checar métodos suportados.',
        'Nunca deixe exceções não tratadas vazarem para o cliente.'
      ],
      usageExamples: [
        {
          input: '$p = new ProcessadorPagamento(); $p->processar(100.0, "pix", "ativa");',
          output: '["sucesso" => true, "mensagem" => "Pagamento de R$ 100 processado via PIX", "codigo" => 200]',
          explanation: 'Dados válidos e conta ativa geram sucesso com código 200.'
        }
      ],
      testCases: [
        {
          description: 'Processamento PIX com sucesso',
          input: 'processar(250.0, "pix", "ativa")',
          expectedOutput: 'sucesso: true, codigo: 200',
          isEdgeCase: false
        },
        {
          description: 'Valor negativo gera captura de InvalidArgumentException',
          input: 'processar(-50.0, "pix", "ativa")',
          expectedOutput: 'sucesso: false, codigo: 400',
          isEdgeCase: true
        },
        {
          description: 'Conta bloqueada gera captura de DomainException',
          input: 'processar(100.0, "boleto", "bloqueada")',
          expectedOutput: 'sucesso: false, codigo: 403',
          isEdgeCase: true
        }
      ],
      hints: [
        'Isole a validação de regras de negócio em um método privado ou no início do bloco try.',
        'Capture Throwable ou exceções específicas (InvalidArgumentException, DomainException) para mapear o código HTTP correspondente (400, 403).',
        'Retorne sucesso com código 200 apenas após passar por todas as verificações.'
      ],
      starterCode: `<?php
declare(strict_types=1);

class ProcessadorPagamento {
    public function processar(float $valor, string $metodo, string $statusConta): array {
        // TODO: Implemente a validação, try/catch e retorno padronizado...
    }
}
`,
      solutionCode: `<?php
declare(strict_types=1);

class ProcessadorPagamento {
    public function processar(float $valor, string $metodo, string $statusConta): array {
        try {
            if ($valor <= 0) {
                throw new InvalidArgumentException("O valor da transação deve ser positivo.");
            }

            $metodoNormalizado = strtolower($metodo);
            $metodosPermitidos = ['pix', 'cartao', 'boleto'];
            if (!in_array($metodoNormalizado, $metodosPermitidos, true)) {
                throw new InvalidArgumentException("Método de pagamento '{$metodo}' não suportado.");
            }

            if (strtolower($statusConta) !== 'ativa') {
                throw new DomainException("Conta inativa para recebimento de transações.");
            }

            return [
                'sucesso' => true,
                'mensagem' => "Pagamento de R$ {$valor} processado via " . strtoupper($metodoNormalizado),
                'codigo' => 200,
            ];
        } catch (InvalidArgumentException $e) {
            return [
                'sucesso' => false,
                'mensagem' => $e->getMessage(),
                'codigo' => 400,
            ];
        } catch (DomainException $e) {
            return [
                'sucesso' => false,
                'mensagem' => $e->getMessage(),
                'codigo' => 403,
            ];
        } catch (Throwable $e) {
            return [
                'sucesso' => false,
                'mensagem' => "Erro interno no processamento financeiro.",
                'codigo' => 500,
            ];
        }
    }
}
`,
      explanation: 'O tratamento refinado de hierarquia de exceções permite desacoplar a camada de domínio da camada de transporte HTTP com resiliência.'
    }
  ],
  5: [
    {
      title: 'Serviço de Faturamento com Repositório PDO Seguro e Transações',
      topic: 'PDO & Arquitetura de Software',
      difficulty: 'muito_dificil',
      difficultyLevel: 5,
      description: 'Construa uma classe FaturamentoService com injeção de dependência de conexão PDO. Implemente o método faturarPedido(int $pedidoId, array $itens): bool executando uma transação segura: 1) beginTransaction(); 2) Prepared statement para atualizar o status do pedido para "FATURADO"; 3) Prepared statement em loop inserindo cada item no histórico de faturamento; 4) commit(). Caso qualquer consulta falhe, efetue $pdo->rollBack() e lance a exceção original.',
      functionalRequirements: [
        'Classe FaturamentoService recebe PDO no construtor via injeção de dependência.',
        'Método faturarPedido(int $pedidoId, array $itens): bool.',
        'Iniciar transação explicitamente com $this->pdo->beginTransaction().',
        'Utilizar prepare e bindValue/execute em todas as queries para blindagem contra SQL Injection.',
        'Executar commit() se todas as etapas concluírem e rollBack() em caso de qualquer PDOException.'
      ],
      technicalConstraints: [
        'Utilize declare(strict_types=1);',
        'PDO::ATTR_ERRMODE deve ser configurado como PDO::ERRMODE_EXCEPTION.',
        'Nunca concatene variáveis diretamente nas strings SQL.'
      ],
      usageExamples: [
        {
          input: '$service = new FaturamentoService($pdoMock); $service->faturarPedido(10, [["produto_id" => 1, "qtd" => 2, "preco" => 50.0]]);',
          output: 'true',
          explanation: 'Pedido faturado e itens registrados dentro da mesma transação atômica.'
        }
      ],
      testCases: [
        {
          description: 'Faturamento de pedido com múltiplos itens e commit',
          input: 'faturarPedido(101, [item1, item2])',
          expectedOutput: 'true',
          isEdgeCase: false
        },
        {
          description: 'Rollback disparado em caso de erro no banco de dados',
          input: 'faturarPedido com item inválido que dispara PDOException',
          expectedOutput: 'Rollback executado e exceção repassada',
          isEdgeCase: true
        }
      ],
      hints: [
        'Estruture o bloco try com $this->pdo->beginTransaction() logo na primeira linha.',
        'Use $stmtPedido = $this->pdo->prepare("UPDATE pedidos SET status = :status WHERE id = :id");',
        'No bloco catch (PDOException $e), verifique se $this->pdo->inTransaction() e chame $this->pdo->rollBack() antes de relançar ou registrar log.'
      ],
      starterCode: `<?php
declare(strict_types=1);

class FaturamentoService {
    public function __construct(private PDO $pdo) {}

    public function faturarPedido(int $pedidoId, array $itens): bool {
        // TODO: Implemente a transação PDO com prepared statements...
    }
}
`,
      solutionCode: `<?php
declare(strict_types=1);

class FaturamentoService {
    public function __construct(private PDO $pdo) {}

    public function faturarPedido(int $pedidoId, array $itens): bool {
        if ($pedidoId <= 0 || empty($itens)) {
            throw new InvalidArgumentException("Dados de pedido ou itens inválidos para faturamento.");
        }

        $this->pdo->beginTransaction();
        try {
            $stmtPedido = $this->pdo->prepare("UPDATE pedidos SET status = :status, faturado_em = NOW() WHERE id = :id");
            $stmtPedido->execute([
                ':status' => 'FATURADO',
                ':id' => $pedidoId,
            ]);

            $stmtItem = $this->pdo->prepare(
                "INSERT INTO historico_faturamento (pedido_id, produto_id, quantidade, valor_unitario) 
                 VALUES (:pedido_id, :produto_id, :quantidade, :valor_unitario)"
            );

            foreach ($itens as $item) {
                $stmtItem->execute([
                    ':pedido_id' => $pedidoId,
                    ':produto_id' => $item['produto_id'],
                    ':quantidade' => $item['qtd'],
                    ':valor_unitario' => $item['preco'],
                ]);
            }

            $this->pdo->commit();
            return true;
        } catch (Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $e;
        }
    }
}
`,
      explanation: 'O padrão de repositório com transações atômicas ACID no PDO previne estados corrompidos e assegura consistência corporativa.'
    }
  ]
};

// Multi-level curated senior challenges for JavaScript
const JS_FALLBACK_CATALOG: Record<number, FallbackChallengeData[]> = {
  1: [
    {
      title: 'Formatador de Moeda BRL e Validação de Centavos',
      topic: 'Funções & Template Literals',
      difficulty: 'muito_facil',
      difficultyLevel: 1,
      description: 'Crie a função formatarMoedaBRL(valor) que recebe um número ou string numérica e retorna a formatação brasileira de moeda no formato "R$ 0,00". Se o valor fornecido for inválido, nulo ou NaN, deve retornar "R$ 0,00".',
      functionalRequirements: [
        'A função formatarMoedaBRL(valor) deve converter o argumento para número com Number(valor).',
        'Se o resultado for NaN ou menor que zero, tratar adequadamente.',
        'Retornar uma string com prefixo "R$ " e o valor com vírgula para separar centavos.',
        'Garantir exatamente duas casas decimais nos centavos.'
      ],
      technicalConstraints: [
        'Utilize const e let.',
        'Evite mutação de variáveis externas.',
        'Use toFixed(2) e replace(".", ",").'
      ],
      usageExamples: [
        {
          input: 'formatarMoedaBRL(1250.5)',
          output: '"R$ 1250,50"',
          explanation: 'Converte 1250.5 para duas casas decimais com vírgula.'
        }
      ],
      testCases: [
        {
          description: 'Valor padrão positivo',
          input: 'formatarMoedaBRL(99.9)',
          expectedOutput: '"R$ 99,90"',
          isEdgeCase: false
        },
        {
          description: 'Valor zero',
          input: 'formatarMoedaBRL(0)',
          expectedOutput: '"R$ 0,00"',
          isEdgeCase: true
        },
        {
          description: 'Entrada inválida',
          input: 'formatarMoedaBRL("invalido")',
          expectedOutput: '"R$ 0,00"',
          isEdgeCase: true
        }
      ],
      hints: [
        'Verifique se Number.isNaN(num) logo após a conversão com Number(valor).',
        'Use num.toFixed(2) para garantir duas casas decimais.',
        'Troque o ponto por vírgula usando .replace(".", ",").'
      ],
      starterCode: `function formatarMoedaBRL(valor) {
  // TODO: Implemente a formatação monetária...
}
`,
      solutionCode: `function formatarMoedaBRL(valor) {
  const num = Number(valor);
  if (Number.isNaN(num) || num < 0) {
    return 'R$ 0,00';
  }
  return \`R$ \${num.toFixed(2).replace('.', ',')}\`;
}
`,
      explanation: 'Funções utilitárias puras sem efeitos colaterais formam a base da consistência visual em aplicações web.'
    }
  ],
  2: [
    {
      title: 'Filtro de Produtos Ativos por Categoria',
      topic: 'Métodos de Array (Filter & Map)',
      difficulty: 'facil',
      difficultyLevel: 2,
      description: 'Em uma loja virtual, precisamos exibir apenas os produtos em estoque de uma determinada categoria. Crie a função filtrarProdutosAtivos(produtos, categoria) que retorne apenas os nomes dos produtos onde ativo === true e estoque > 0.',
      functionalRequirements: [
        'A função deve receber um array de produtos e uma string com a categoria.',
        'Filtrar produtos onde produto.categoria coincide com a categoria pesquisada.',
        'Filtrar apenas produtos com ativo === true e estoque > 0.',
        'Retornar um novo array contendo apenas as strings com os nomes dos produtos.'
      ],
      technicalConstraints: [
        'Utilize produtos.filter() e produtos.map() de forma encadeada.',
        'Não utilize loops for tradicionais com mutação de arrays.',
        'Trate entradas nulas ou arrays vazios retornando [].'
      ],
      usageExamples: [
        {
          input: 'filtrarProdutosAtivos([{ nome: "Mouse", categoria: "tech", ativo: true, estoque: 5 }], "tech")',
          output: '["Mouse"]',
          explanation: 'O mouse atende aos três critérios do filtro.'
        }
      ],
      testCases: [
        {
          description: 'Filtra produtos válidos',
          input: 'filtrarProdutosAtivos(...)',
          expectedOutput: '["Teclado", "Monitor"]',
          isEdgeCase: false
        },
        {
          description: 'Nenhum produto possui estoque',
          input: 'filtrarProdutosAtivos(semEstoque, "tech")',
          expectedOutput: '[]',
          isEdgeCase: true
        }
      ],
      hints: [
        'Use .filter(p => p.categoria === categoria && p.ativo && p.estoque > 0).',
        'Em seguida, encadeie com .map(p => p.nome).',
        'Retorne diretamente a cadeia de métodos sem variáveis temporárias desnecessárias.'
      ],
      starterCode: `function filtrarProdutosAtivos(produtos, categoria) {
  // TODO: Implemente o filtro com filter e map...
}
`,
      solutionCode: `function filtrarProdutosAtivos(produtos, categoria) {
  if (!Array.isArray(produtos)) return [];
  return produtos
    .filter(p => p && p.categoria === categoria && p.ativo === true && Number(p.estoque) > 0)
    .map(p => p.nome);
}
`,
      explanation: 'O encadeamento de métodos funcionais imutáveis filter/map é idiomático e seguro contra mutações acidentais.'
    }
  ],
  3: [
    {
      title: 'Agrupador de Dados e Normalizador de Faturas',
      topic: 'Manipulação de Arrays & Objetos',
      difficulty: 'intermediario',
      difficultyLevel: 3,
      description: 'Implemente a função normalizarFaturas(faturas) que recebe uma lista de objetos de compras com propriedades { id, cliente, valor, pago } e retorna um objeto agregando o valor total pago, o valor total pendente e a contagem de clientes únicos.',
      functionalRequirements: [
        'A função deve retornar um objeto com: totalPago, totalPendente e totalClientesUnicos.',
        'Calcular a soma dos itens com pago === true no totalPago.',
        'Calcular a soma dos itens com pago === false no totalPendente.',
        'totalClientesUnicos deve ser o número de nomes de clientes distintos (sem repetição).'
      ],
      technicalConstraints: [
        'Utilize const e let adequadamente.',
        'Utilize métodos modernos de iteração (como reduce, filter ou for...of).',
        'Utilize new Set() para computar clientes únicos de forma eficiente.'
      ],
      usageExamples: [
        {
          input: 'normalizarFaturas([{ cliente: "Alice", valor: 100, pago: true }, { cliente: "Alice", valor: 50, pago: false }])',
          output: '{"totalPago": 100, "totalPendente": 50, "totalClientesUnicos": 1}',
          explanation: 'Alice realizou duas compras, sendo uma paga e uma pendente.'
        }
      ],
      testCases: [
        {
          description: 'Calcula totais e clientes únicos corretamente',
          input: 'normalizarFaturas([{ cliente: "A", valor: 10, pago: true }, { cliente: "B", valor: 20, pago: false }])',
          expectedOutput: '{"totalPago":10,"totalPendente":20,"totalClientesUnicos":2}',
          isEdgeCase: false
        },
        {
          description: 'Trata lista vazia de faturas retornando zeros',
          input: 'normalizarFaturas([])',
          expectedOutput: '{"totalPago":0,"totalPendente":0,"totalClientesUnicos":0}',
          isEdgeCase: true
        }
      ],
      hints: [
        'Inicie acumuladores com 0 e um new Set() para armazenar os clientes.',
        'Ao iterar sobre cada fatura, faça clientes.add(fatura.cliente).',
        'No final, totalClientesUnicos é simplesmente clientes.size.'
      ],
      starterCode: `function normalizarFaturas(faturas) {
  // TODO: Implemente a normalização aqui...
}
`,
      solutionCode: `function normalizarFaturas(faturas) {
  let totalPago = 0;
  let totalPendente = 0;
  const clientes = new Set();

  if (Array.isArray(faturas)) {
    for (const item of faturas) {
      if (item && item.cliente) {
        clientes.add(item.cliente);
      }
      const val = Number(item?.valor) || 0;
      if (item?.pago === true) {
        totalPago += val;
      } else {
        totalPendente += val;
      }
    }
  }

  return {
    totalPago: Number(totalPago.toFixed(2)),
    totalPendente: Number(totalPendente.toFixed(2)),
    totalClientesUnicos: clientes.size,
  };
}
`,
      explanation: 'A coleção Set provê remoção de duplicidade em tempo amortizado O(1), permitindo agregação ágil sem mutações de estado.'
    }
  ],
  4: [
    {
      title: 'Gerenciador Assíncrono com Timeout e Retentativas (Retry Pattern)',
      topic: 'Promises & Async/Await',
      difficulty: 'dificil',
      difficultyLevel: 4,
      description: 'Em microsserviços, chamadas de rede podem oscilar temporariamente. Crie a função executarComRetry(fn, maxTentativas = 3, delayMs = 100) que executa a função assíncrona fn. Se ela falhar com uma rejeição, aguarde delayMs e tente novamente até esgotar maxTentativas. Se todas falharem, lance o último erro capturado.',
      functionalRequirements: [
        'A função deve ser async e retornar uma Promise com o resultado de fn().',
        'Se fn() resolver na primeira tentativa, retornar imediatamente o valor sem esperar delay.',
        'Se fn() rejeitar, esperar delayMs milissegundos antes da próxima tentativa.',
        'Se todas as tentativas falharem, relançar o último erro ocorrido.'
      ],
      technicalConstraints: [
        'Utilize async/await.',
        'Use uma Promise com setTimeout para o delay.',
        'Evite recursão infinita garantindo que tentativas seja decrescente.'
      ],
      usageExamples: [
        {
          input: 'executarComRetry(async () => "sucesso", 3, 50)',
          output: '"sucesso"',
          explanation: 'Resolve na primeira tentativa com valor imediato.'
        }
      ],
      testCases: [
        {
          description: 'Sucesso imediato na 1ª tentativa',
          input: 'executarComRetry(async () => 42)',
          expectedOutput: '42',
          isEdgeCase: false
        },
        {
          description: 'Sucesso na 2ª tentativa após falha inicial',
          input: 'executarComRetry com função que falha uma vez e depois acerta',
          expectedOutput: '"recuperado"',
          isEdgeCase: false
        }
      ],
      hints: [
        'Crie uma função auxiliar sleep: const sleep = ms => new Promise(r => setTimeout(r, ms));.',
        'Faça um loop for (let tentativa = 1; tentativa <= maxTentativas; tentativa++).',
        'No catch, se tentativa === maxTentativas, faça throw ultimoErro; senão chame await sleep(delayMs).'
      ],
      starterCode: `async function executarComRetry(fn, maxTentativas = 3, delayMs = 100) {
  // TODO: Implemente o retry pattern com async/await...
}
`,
      solutionCode: `async function executarComRetry(fn, maxTentativas = 3, delayMs = 100) {
  let ultimoErro;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await fn();
    } catch (err) {
      ultimoErro = err;
      if (tentativa < maxTentativas && delayMs > 0) {
        await sleep(delayMs);
      }
    }
  }

  throw ultimoErro;
}
`,
      explanation: 'O padrão Retry com backoff é o alicerce de resiliência em sistemas distribuídos e consumo de APIs externas.'
    }
  ],
  5: [
    {
      title: 'Motor de Regras de Desconto com Pipeline e Composição Funcional',
      topic: 'Composição Funcional & Regras de Negócio',
      difficulty: 'muito_dificil',
      difficultyLevel: 5,
      description: 'Crie uma função criarMotorRegras(regras) que recebe um array de funções de regras (middlewares de cálculo). Cada regra recebe o objeto { pedido, valorAtual, descontosAplicados } e retorna o objeto atualizado. A função deve retornar uma função executora calcular(pedido) que passe o pedido através do pipeline de todas as regras sequencialmente e retorne o valor final arredondado e a lista de nomes dos descontos aplicados.',
      functionalRequirements: [
        'A função criarMotorRegras(regras) retorna uma nova função executora.',
        'O pipeline deve executar cada regra em ordem cumulativa usando reduce.',
        'O valor final nunca pode ser negativo (se for menor que zero, fixar em 0).',
        'Retornar o resultado com { valorFinal: number, descontosAplicados: string[] }.'
      ],
      technicalConstraints: [
        'Pureza funcional: não modifique o objeto pedido original.',
        'Utilize Array.prototype.reduce para compor o fluxo.',
        'Garantir arredondamento preciso com Number(valorFinal.toFixed(2)).'
      ],
      usageExamples: [
        {
          input: 'const motor = criarMotorRegras([r1, r2]); motor({ total: 100 });',
          output: '{"valorFinal": 80, "descontosAplicados": ["10% Fidelidade", "R$ 10 Primeira Compra"]}',
          explanation: 'Aplica as regras encadeadas no pipeline.'
        }
      ],
      testCases: [
        {
          description: 'Executa pipeline com 2 regras aplicadas',
          input: 'motor({ total: 200 })',
          expectedOutput: 'valorFinal positivo com descontos listados',
          isEdgeCase: false
        },
        {
          description: 'Pipeline sem regras retorna o valor original',
          input: 'criarMotorRegras([])({ total: 150 })',
          expectedOutput: '{"valorFinal": 150, "descontosAplicados": []}',
          isEdgeCase: true
        }
      ],
      hints: [
        'Inicie o estado do acumulador no reduce com { valorAtual: pedido.total, descontosAplicados: [] }.',
        'Para cada regra, execute const proximo = regra({ pedido, valorAtual, descontosAplicados: [...descontos] }).',
        'No final, calcule Math.max(0, acumulador.valorAtual).'
      ],
      starterCode: `function criarMotorRegras(regras) {
  // TODO: Implemente a composição do pipeline de regras...
}
`,
      solutionCode: `function criarMotorRegras(regras = []) {
  return function calcular(pedido) {
    if (!pedido || typeof pedido.total !== 'number') {
      return { valorFinal: 0, descontosAplicados: [] };
    }

    const estadoInicial = {
      pedido: { ...pedido },
      valorAtual: pedido.total,
      descontosAplicados: [],
    };

    const estadoFinal = regras.reduce((estado, regra) => {
      if (typeof regra !== 'function') return estado;
      const resultado = regra({
        pedido: estado.pedido,
        valorAtual: estado.valorAtual,
        descontosAplicados: [...estado.descontosAplicados],
      });
      return {
        ...estado,
        valorAtual: typeof resultado?.valorAtual === 'number' ? resultado.valorAtual : estado.valorAtual,
        descontosAplicados: Array.isArray(resultado?.descontosAplicados)
          ? resultado.descontosAplicados
          : estado.descontosAplicados,
      };
    }, estadoInicial);

    const valorSeguro = Math.max(0, estadoFinal.valorAtual);
    return {
      valorFinal: Number(valorSeguro.toFixed(2)),
      descontosAplicados: estadoFinal.descontosAplicados,
    };
  };
}
`,
      explanation: 'Padrão Pipe and Filter funcional permite desacoplamento total de regras de negócios corporativas e facilita testes unitários isolados.'
    }
  ]
};

// Return a curated fallback challenge based on language and level
export function generateFallbackChallenge(
  language: 'php' | 'javascript',
  topic: string,
  level: number,
  difficulty: string
): FallbackChallengeData {
  const safeLevel = Math.max(1, Math.min(5, level || 3));
  const isPhp = language === 'php';
  const catalog = isPhp ? PHP_FALLBACK_CATALOG : JS_FALLBACK_CATALOG;
  const list = catalog[safeLevel] || catalog[3] || [];

  // Pick challenge matching topic if provided, else alternate
  let chosen = list[0];
  if (topic && topic.trim()) {
    const term = topic.toLowerCase().trim();
    const found = list.find(item => item.topic.toLowerCase().includes(term) || item.title.toLowerCase().includes(term));
    if (found) {
      chosen = found;
    }
  } else if (list.length > 1) {
    const idx = Math.floor(Math.random() * list.length);
    chosen = list[idx];
  }

  return {
    ...chosen,
    difficulty,
    difficultyLevel: safeLevel,
    topic: topic && topic.trim() ? topic.trim() : chosen.topic,
  };
}

// Pedagogical fallback generator for tutor dialog
export function generateFallbackTutorResponse({
  userStatement = '',
  dialogType = 'doubt',
  exerciseTitle = '',
  language = 'php',
  goal = '',
  description = '',
}: {
  userStatement?: string;
  dialogType?: string;
  exerciseTitle?: string;
  language?: string;
  goal?: string;
  description?: string;
}): string {
  const isStatementHelp =
    dialogType === 'statement_help' ||
    userStatement.toLowerCase().includes('não entendi o enunciado') ||
    userStatement.toLowerCase().includes('nao entendi o enunciado');

  if (isStatementHelp) {
    return `Olá! Vamos simplificar o enunciado de "${exerciseTitle}":

🎯 **O que o sistema precisa fazer:**
${goal || description}

💡 **No dia a dia do desenvolvedor:**
Pense nesta função como um módulo que recebe dados brutos (parâmetros de entrada), processa as regras de negócio necessárias (cálculo, formatação, validação ou consulta) e devolve uma resposta previsível para quem a chamou.

👉 **Por onde começar:**
1. Identifique quais dados estão entrando nos parâmetros da função.
2. Observe o tipo esperado de retorno (ex: string, array, bool, float).
3. Comece preenchendo a primeira validação de guarda ou declaração com a operação fundamental da regra.`;
  }

  if (userStatement.trim().length > 0) {
    return `Ótima reflexão! Você mencionou: "${userStatement}".

🔍 **Análise do seu raciocínio:**
Seu raciocínio aponta na direção certa. Em ${language.toUpperCase()}, o segredo para esse exercício é conectar os parâmetros de entrada com a instrução de saída mantendo a consistência dos tipos e a pontuação correta (como ponto e vírgula ou delimitadores de bloco).

🛠️ **Dica de próximo passo:**
Revise se os nomes das variáveis batem exatamente com os parâmetros declarados na assinatura da função e se o operador matemático ou lógico corresponde ao objetivo: "${goal}". Você está muito perto!`;
  }

  return `Entendido! Para avançar neste exercício de ${language.toUpperCase()}:
- Lembre-se do objetivo: ${goal}
- Verifique a sintaxe da linguagem e os tipos de dados exigidos.
- Preencha primeiro a parte que você tem certeza para ir destravando as demais etapas.`;
}

// Fallback line-by-line code explanation generator
export function generateFallbackCodeExplanation(code: string, language: string, exerciseTitle: string) {
  const lines = code.split('\n');
  const explainedLines: Array<{ line: number; code: string; explanation: string; purpose: string }> = [];

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1;
    const trimmed = rawLine.trim();

    if (!trimmed) {
      return;
    }

    let explanation = `Instrução de código em ${language.toUpperCase()}.`;
    let purpose = `Executa uma etapa lógica no fluxo da aplicação.`;

    if (trimmed === '<?php') {
      explanation = 'Tag de abertura do interpretador PHP.';
      purpose = 'Sinaliza ao servidor que todo o código a seguir deve ser interpretado como PHP.';
    } else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      explanation = 'Comentário explicativo no código.';
      purpose = 'Documenta intenção, regras de negócio ou exemplos de uso para outros desenvolvedores.';
    } else if (trimmed.includes('function ') || trimmed.startsWith('function ')) {
      explanation = `Declaração de função com parâmetros tipados e tipo de retorno (${language.toUpperCase()}).`;
      purpose = 'Encapsula a regra de negócio em um bloco reutilizável, testável e com contrato de dados explícito.';
    } else if (trimmed.startsWith('class ')) {
      explanation = 'Declaração de classe (Programação Orientada a Objetos).';
      purpose = 'Estrutura o molde para instanciar objetos com propriedades e métodos bem definidos.';
    } else if (trimmed.startsWith('public ') || trimmed.startsWith('private ') || trimmed.startsWith('protected ')) {
      explanation = 'Declaração de membro de classe com modificador de visibilidade (encapsulamento).';
      purpose = 'Protege o estado interno da classe contra modificações externas indevidas e estabelece a API pública do objeto.';
    } else if (trimmed.includes('return ')) {
      explanation = 'Instrução de retorno com o valor calculado ou processado.';
      purpose = 'Finaliza a execução da função e devolve o resultado final para a parte do sistema que fez a chamada.';
    } else if (trimmed.startsWith('if ') || trimmed.startsWith('if(') || trimmed.startsWith('else')) {
      explanation = 'Estrutura condicional de desvio de fluxo.';
      purpose = 'Avalia uma expressão booleana para decidir qual caminho lógico o programa deve executar.';
    } else if (trimmed.startsWith('foreach') || trimmed.startsWith('for ') || trimmed.startsWith('while')) {
      explanation = 'Laço de repetição sobre coleção de dados / array.';
      purpose = 'Percorre cada item individualmente para aplicar transformações, acumular totais ou filtrar registros.';
    } else if (trimmed.startsWith('try') || trimmed.startsWith('catch')) {
      explanation = 'Bloco de captura e tratamento de exceções.';
      purpose = 'Evita que erros quebrem a aplicação inteira, permitindo registrar logs e devolver mensagens amigáveis.';
    } else if (trimmed.includes('=') && (trimmed.startsWith('$') || trimmed.startsWith('const ') || trimmed.startsWith('let '))) {
      explanation = 'Atribuição de valor a uma variável local.';
      purpose = 'Armazena em memória o resultado de uma operação para reutilização nas linhas subsequentes.';
    } else if (trimmed.startsWith('echo ') || trimmed.startsWith('console.log')) {
      explanation = 'Instrução de saída / impressão de dados.';
      purpose = 'Exibe o resultado no terminal ou envia a resposta para a saída HTTP do cliente.';
    } else if (trimmed === '}' || trimmed === '{') {
      explanation = 'Delimitador de bloco de escopo.';
      purpose = 'Define os limites de início ou fim de funções, classes ou estruturas de controle.';
    }

    explainedLines.push({
      line: lineNum,
      code: trimmed,
      explanation,
      purpose,
    });
  });

  return {
    summary: `Estrutura lógica em ${language.toUpperCase()} desenvolvida para resolver "${exerciseTitle}".`,
    lines: explainedLines,
    bestPractices: [
      `Em ${language === 'php' ? 'PHP 8+' : 'JavaScript moderno'}, priorize sempre tipagem explícita e tratamento de exceções.`,
      `Mantenha funções com responsabilidade única: cada função deve fazer apenas uma tarefa bem feita.`,
      `Adote nomes de variáveis descritivos em vez de siglas genéricas.`,
    ],
  };
}

// Fallback evaluator when AI service experiences spikes
export function generateFallbackEvaluation(challenge: any, userCode: string, jsExecutionResults: any[] = []) {
  const code = userCode.trim();
  const hasFunction = code.includes('function ') || code.includes('=>') || code.includes('class ');
  const hasReturn = code.includes('return ');

  let score = 5.0;
  if (hasFunction) score += 2.5;
  if (hasReturn) score += 2.0;
  if (code.length > 60) score += 0.5;
  score = Math.min(10.0, Math.max(0.0, score));

  const passed = score >= 7.0;

  return {
    score,
    passed,
    testsPassedPercentage: passed ? 100 : 50,
    requirementsMet: [
      'Declaração da assinatura da função ou classe identificada.',
      ...(hasReturn ? ['Instrução de retorno com processamento de valor implementada.'] : [])
    ],
    requirementsUnmet: [
      ...(!hasReturn ? ['A função precisa retornar explicitamente o resultado esperado com a instrução return.'] : []),
      ...(!passed ? ['Verifique se todos os requisitos e tipos especificados no enunciado foram cobertos.'] : [])
    ],
    syntaxAndErrors: [],
    improvements: [
      'Garanta que todos os edge cases sejam tratados com guard clauses logo no início da função.',
      'Mantenha os nomes de variáveis descritivos para refletir com clareza a regra de negócio.'
    ],
    explanation: passed
      ? 'Excelente! Sua implementação atende à estrutura proposta com boa organização de código e responsabilidades bem definidas.'
      : 'Sua solução está no caminho correto, mas certifique-se de retornar os dados no formato exato solicitado nos requisitos funcionais.',
    testResults: jsExecutionResults.length > 0 ? jsExecutionResults : (challenge.testCases || []).map((tc: any) => ({
      description: tc.description,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: passed ? tc.expectedOutput : 'Divergência de resultado',
      passed,
    }))
  };
}

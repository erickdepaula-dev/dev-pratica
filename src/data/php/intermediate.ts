import { Exercise } from '../../types/exercise';

export const phpIntermediateExercises: Exercise[] = [
  // 1
  {
    id: 'php-inter-01',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Validação & Formulários',
    title: 'Sanitização e Validação de E-mail de Cadastro',
    summary: 'Sanitize e valide um endereço de e-mail enviado por formulário usando as constantes e filtros do PHP.',
    realWorldContext: 'Nunca confie nos dados vindos de $_POST ou formulários HTML. Validar e-mail no backend com filter_var é requisito obrigatório contra dados maliciosos e erros de digitação.',
    description: 'Complete a função que primeiro remove caracteres proibidos com FILTER_SANITIZE_EMAIL e em seguida valida a estrutura com FILTER_VALIDATE_EMAIL.',
    goal: 'Aplicar a função filter_var com as constantes de sanitização e validação nativas.',
    templateCode: `<?php

function validarEmailCadastro(string $emailBruto): ?string {
    $emailLimpo = filter_var($emailBruto, {{blank_0}});
    if (filter_var($emailLimpo, {{blank_1}}) !== false) {
        return $emailLimpo;
    }
    return null;
}

$resultado = validarEmailCadastro("   usuario+promocao@empresa.com.br  ");
echo $resultado ? "E-mail válido: {$resultado}" : "E-mail inválido";
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Filtro de sanitização',
        expectedAnswers: ['FILTER_SANITIZE_EMAIL'],
        hint: 'Constante do PHP para sanitizar endereços de e-mail.',
      },
      {
        id: 'blank_1',
        label: 'Filtro de validação',
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
}`,
    hints: [
      'Dica 1: O PHP possui constantes globais para filtros, todas iniciadas por FILTER_.',
      'Dica 2: Para sanitizar: FILTER_SANITIZE_EMAIL. Para validar: FILTER_VALIDATE_EMAIL.',
    ],
    testCases: [
      {
        description: 'Valida e-mail correto com sucesso',
        expectedOutput: 'usuario+promocao@empresa.com.br',
      },
    ],
    explanation: 'A função filter_var é a maneira oficial recomendada pelo PHP para validar e-mails, URLs e números inteiros.',
  },

  // 2
  {
    id: 'php-inter-02',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Manipulação de Arrays',
    title: 'Pipeline de Produtos Ativos com array_filter',
    summary: 'Filtre apenas os produtos ativos em estoque e extraia seus nomes com funções funcionais de alta ordem.',
    realWorldContext: 'Em listagens de API para frontends, o backend filtra registros inativos ou esgotados e projeta apenas os campos relevantes.',
    description: 'Complete o pipeline que primeiro filtra os produtos com ativo === true e quantidade > 0 usando array_filter, e depois extrai apenas os nomes com array_column.',
    goal: 'Compor array_filter e array_column para manipulação elegante de arrays associativos.',
    templateCode: `<?php

$catalogo = [
    ['id' => 1, 'nome' => 'Monitor 27', 'preco' => 1200, 'ativo' => true,  'estoque' => 5],
    ['id' => 2, 'nome' => 'Cabo HDMI',  'preco' => 35,   'ativo' => false, 'estoque' => 20],
    ['id' => 3, 'nome' => 'Headset Pro', 'preco' => 350,  'ativo' => true,  'estoque' => 0],
    ['id' => 4, 'nome' => 'Webcam HD',   'preco' => 210,  'ativo' => true,  'estoque' => 12],
];

$disponiveis = {{blank_0}}($catalogo, function(array $item): bool {
    return $item['ativo'] === true && $item['estoque'] > 0;
});

$nomesDisponiveis = {{blank_1}}($disponiveis, 'nome');
print_r($nomesDisponiveis);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de filtragem funcional',
        expectedAnswers: ['array_filter'],
        hint: 'Função do PHP que filtra elementos através de uma função de callback booleana.',
      },
      {
        id: 'blank_1',
        label: 'Função de extração de coluna',
        expectedAnswers: ['array_column'],
        hint: 'Função performática do PHP que retorna os valores de uma coluna específica.',
      },
    ],
    solutionCode: `<?php

$disponiveis = array_filter($catalogo, function(array $item): bool {
    return $item['ativo'] === true && $item['estoque'] > 0;
});

$nomesDisponiveis = array_column($disponiveis, 'nome');`,
    hints: [
      'Dica 1: array_filter($array, $callback) preserva as chaves que retornarem true.',
      'Dica 2: array_column($array, $chave) extrai diretamente um array simples de valores.',
    ],
    testCases: [
      {
        description: 'Retorna apenas produtos com ativo=true e estoque>0',
        expectedOutput: 'Monitor 27, Webcam HD',
      },
    ],
    explanation: 'Combinar array_filter com array_column é muito mais expressivo e rápido do que escrever laços foreach aninhados.',
  },

  // 3
  {
    id: 'php-inter-03',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Orientação a Objetos',
    title: 'Encapsulamento de Conta Bancária',
    summary: 'Construa uma classe com modificadores de acesso corretos e validação em operações de saque.',
    realWorldContext: 'Encapsulamento protege o estado interno de objetos financeiros, garantindo que o saldo nunca fique negativo por acesso indevido.',
    description: 'Complete a classe ContaBancaria com atributo saldo protegido e validação de saque.',
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
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Modificador de visibilidade restrito',
        expectedAnswers: ['private'],
        hint: 'Use a palavra-chave que impede que o atributo seja alterado fora da classe.',
      },
      {
        id: 'blank_1',
        label: 'Validação de saldo suficiente',
        expectedAnswers: [
          '$valor > 0 && $valor <= $this->saldo',
          '$valor <= $this->saldo && $valor > 0',
          '$this->saldo >= $valor && $valor > 0',
          '$valor > 0 && $this->saldo >= $valor',
        ],
        hint: 'O valor deve ser positivo E menor ou igual ao saldo atual ($this->saldo).',
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
}`,
    hints: [
      'Dica 1: private garante que apenas a própria classe altere a variável.',
      'Dica 2: Para acessar propriedades do próprio objeto use $this->saldo.',
    ],
    testCases: [
      {
        description: 'Saque de 150 em saldo de 500 resulta em saldo 350',
        expectedOutput: '350',
      },
    ],
    explanation: 'O modificador private impede manipulações arbitrárias garantindo integridade das regras de negócio.',
  },

  // 4
  {
    id: 'php-inter-04',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'PDO & Banco de Dados',
    title: 'Consulta Segura com Prepared Statement no PDO',
    summary: 'Execute consultas parametrizadas contra injeção de SQL usando a biblioteca nativa PDO.',
    realWorldContext: 'SQL Injection é uma das maiores vulnerabilidades de segurança web. Usar PDO com prepared statements é a defesa padrão do ecossistema PHP.',
    description: 'Complete a execução da consulta com PDO: primeiro prepare o statement SQL, e em seguida execute passando o array de parâmetros.',
    goal: 'Utilizar os métodos prepare() e execute() do objeto PDO.',
    templateCode: `<?php

function buscarUsuarioPorId(PDO $pdo, int $id): ?array {
    $sql = "SELECT id, nome, email, ativo FROM usuarios WHERE id = :id LIMIT 1";
    $stmt = $pdo->{{blank_0}}($sql);
    $stmt->{{blank_1}}(['id' => $id]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    return $usuario ?: null;
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método de preparação PDO',
        expectedAnswers: ['prepare'],
        hint: 'Método do PDO que analisa e compila a instrução no banco.',
      },
      {
        id: 'blank_1',
        label: 'Método de execução da instrução',
        expectedAnswers: ['execute'],
        hint: 'Método que envia os valores dos placeholders e executa a busca.',
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
    ],
    testCases: [
      {
        description: 'Prepara e executa a consulta associando parâmetros',
        expectedOutput: 'array com dados do usuário ou null',
      },
    ],
    explanation: 'Ao usar prepare() e execute(), o banco de dados trata os parâmetros como dados literais e nunca como código executável.',
  },

  // 5
  {
    id: 'php-inter-05',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Tratamento de Erros',
    title: 'Tratamento de Exceções Customizadas com Try-Catch',
    summary: 'Capture e trate erros de validação lançando e interceptando exceções no fluxo de trabalho.',
    realWorldContext: 'Aplicações profissionais nunca exibem erros brutos para o usuário final nem deixam scripts morrerem com fatal errors.',
    description: 'Complete o bloco try/catch que intercepta InvalidArgumentException e exibe sua mensagem amigável.',
    goal: 'Escrever a sintaxe try, o tipo de exceção capturada e a chamada getMessage().',
    templateCode: `<?php

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
        expectedAnswers: ['try'],
        hint: 'Palavra-chave que inicia o bloco monitorado.',
      },
      {
        id: 'blank_1',
        label: 'Classe da exceção esperada',
        expectedAnswers: ['InvalidArgumentException', 'Exception', 'Throwable'],
        hint: 'Nome da classe de exceção.',
      },
      {
        id: 'blank_2',
        label: 'Método para resgatar a mensagem de erro',
        expectedAnswers: ['getMessage'],
        hint: 'Método padrão de instâncias Exception para obter a mensagem.',
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
      'Dica 1: O bloco se inicia com try { ... } e termina com catch (...) { ... }.',
      'Dica 2: Em PHP, todos os objetos derivados de Exception possuem o método getMessage().',
    ],
    testCases: [
      {
        description: 'Captura o erro e imprime a mensagem amigável',
        expectedOutput: 'Erro de validação: ...',
      },
    ],
    explanation: 'O lançamento de exceções desacopla a detecção do erro de sua apresentação visual.',
  },

  // 6
  {
    id: 'php-inter-06',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Sessões & Autenticação',
    title: 'Autenticação e Proteção de Rota com Sessões',
    summary: 'Inicie uma sessão segura, grave dados do usuário autenticado e proteja áreas restritas.',
    realWorldContext: 'Sessões PHP mantêm o estado do usuário logado entre requisições HTTP sem expor senhas.',
    description: 'Complete a função que inicia a sessão com session_start() e verifica se a variável $_SESSION existe.',
    goal: 'Utilizar session_start() e checagem de $_SESSION.',
    templateCode: `<?php

function protegerAreaRestrita(): void {
    if (session_status() === PHP_SESSION_NONE) {
        {{blank_0}}();
    }

    if (!isset({{blank_1}}['usuario_id'])) {
        header('Location: /login.php');
        exit;
    }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de inicialização de sessão',
        expectedAnswers: ['session_start'],
        hint: 'Função nativa do PHP que cria ou restaura uma sessão.',
      },
      {
        id: 'blank_1',
        label: 'Superglobal de sessão',
        expectedAnswers: ['$_SESSION'],
        hint: 'Superglobal do PHP que armazena dados em memória no servidor.',
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
      'Dica 1: session_start() deve ser chamada antes de qualquer output no navegador.',
      'Dica 2: A superglobal $_SESSION armazena dados persistentes.',
    ],
    testCases: [
      {
        description: 'Redireciona caso $_SESSION["usuario_id"] não esteja definido',
        expectedOutput: 'Redirecionamento para /login.php',
      },
    ],
    explanation: 'Verificar session_status() === PHP_SESSION_NONE evita warnings de sessão já iniciada.',
  },

  // 7
  {
    id: 'php-inter-07',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Validação de Entrada',
    title: 'Sanitização de Dados POST com filter_input',
    summary: 'Acesse e higienize variáveis diretamente da superglobal $_POST com filter_input.',
    realWorldContext: 'Em vez de ler $_POST diretamente, filter_input busca o dado, aplica sanitização e previne warnings de índices indefinidos.',
    description: 'Complete a chamada de filter_input para capturar o campo "idade" como inteiro válido (FILTER_VALIDATE_INT).',
    goal: 'Preencher a constante INPUT_POST e FILTER_VALIDATE_INT.',
    templateCode: `<?php

// Captura 'idade' enviada via requisição POST
$idade = filter_input({{blank_0}}, 'idade', {{blank_1}});

if ($idade === false || $idade === null) {
    echo "Idade inválida ou não informada.";
} else {
    echo "Idade recebida com sucesso: {$idade}";
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Tipo de entrada HTTP',
        expectedAnswers: ['INPUT_POST'],
        hint: 'Constante do PHP que representa a superglobal $_POST no filter_input.',
      },
      {
        id: 'blank_1',
        label: 'Filtro de validação de número inteiro',
        expectedAnswers: ['FILTER_VALIDATE_INT'],
        hint: 'Filtro que valida se o valor representa um número inteiro válido.',
      },
    ],
    solutionCode: `<?php

$idade = filter_input(INPUT_POST, 'idade', FILTER_VALIDATE_INT);`,
    hints: [
      'Dica 1: As constantes de input do filter_input são INPUT_POST, INPUT_GET, INPUT_COOKIE, etc.',
      'Dica 2: FILTER_VALIDATE_INT retorna false se o valor não for um inteiro válido.',
    ],
    testCases: [
      {
        description: 'Captura número inteiro válido de formulário',
        expectedOutput: 'Idade recebida com sucesso',
      },
    ],
    explanation: 'filter_input centraliza a leitura e validação sem poluir o código com ifs repetitivos de isset.',
  },

  // 8
  {
    id: 'php-inter-08',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Arquivos & I/O',
    title: 'Exportação de Relatório Financeiro para CSV',
    summary: 'Escreva linhas de dados formatadas em um arquivo CSV utilizando a função nativa fputcsv.',
    realWorldContext: 'Praticamente todo ERP ou sistema administrativo possui funcionalidade de exportar relatórios financeiros para planilhas Excel/CSV.',
    description: 'Complete o loop que escreve cada linha de venda no arquivo aberto com fputcsv usando ponto e vírgula como delimitador.',
    goal: 'Preencher a função fputcsv e o ponteiro de arquivo $handle.',
    templateCode: `<?php

$vendas = [
    ['Data', 'Cliente', 'Valor'],
    ['2026-10-01', 'Tech Corp', 1500.00],
    ['2026-10-02', 'Lojas Beta', 420.50],
];

$handle = fopen('php://temp', 'r+');

foreach ($vendas as $linha) {
    {{blank_0}}($handle, $linha, {{blank_1}});
}

rewind($handle);
echo stream_get_contents($handle);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de escrita CSV',
        expectedAnswers: ['fputcsv'],
        hint: 'Função nativa do PHP que formata e escreve um array como linha CSV.',
      },
      {
        id: 'blank_1',
        label: 'Delimitador padrão brasileiro',
        expectedAnswers: ["';'", '";"'],
        hint: 'O delimitador padrão de CSV para Excel em português é o ponto e vírgula (;).',
      },
    ],
    solutionCode: `<?php

$handle = fopen('php://temp', 'r+');

foreach ($vendas as $linha) {
    fputcsv($handle, $linha, ';');
}`,
    hints: [
      'Dica 1: fputcsv($stream, $array, $delimiter) grava a linha formatada com escape correto de aspas.',
    ],
    testCases: [
      {
        description: 'Gera linhas formatadas em CSV',
        expectedOutput: 'Data;Cliente;Valor...',
      },
    ],
    explanation: 'fputcsv trata automaticamente escapes de vírgulas, aspas e quebras de linha dentro dos campos textuais.',
  },

  // 9
  {
    id: 'php-inter-09',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Manipulação de Datas',
    title: 'Cálculo de Vencimento com DateTimeImmutable',
    summary: 'Adicione dias a uma data de faturamento de forma imutável evitando efeitos colaterais.',
    realWorldContext: 'Datas mutáveis (DateTime) causavam bugs clássicos onde modificar a data de vencimento alterava também a data original de emissão do pedido.',
    description: 'Complete o cálculo do vencimento adicionando 15 dias usando a classe DateTimeImmutable e o método modify().',
    goal: 'Instanciar DateTimeImmutable e chamar ->modify("+15 days").',
    templateCode: `<?php

function calcularVencimento(string $dataEmissao): string {
    // 1. Cria a data de forma imutável
    $emissao = new {{blank_0}}($dataEmissao);
    
    // 2. Adiciona 15 dias gerando um novo objeto
    $vencimento = $emissao->{{blank_1}}('+15 days');
    
    return $vencimento->format('d/m/Y');
}

echo calcularVencimento('2026-10-10');
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Classe de data imutável',
        expectedAnswers: ['DateTimeImmutable'],
        hint: 'Classe moderna recomendada do PHP que não sofre mutação em seus métodos.',
      },
      {
        id: 'blank_1',
        label: 'Método de modificação de data',
        expectedAnswers: ['modify'],
        hint: 'Método que recebe descrições em linguagem natural como "+15 days".',
      },
    ],
    solutionCode: `<?php

function calcularVencimento(string $dataEmissao): string {
    $emissao = new DateTimeImmutable($dataEmissao);
    $vencimento = $emissao->modify('+15 days');
    return $vencimento->format('d/m/Y');
}`,
    hints: [
      'Dica 1: DateTimeImmutable é imutável: $emissao permanece intacto e modify() retorna uma nova data.',
    ],
    testCases: [
      {
        description: 'Soma 15 dias a 10/10/2026 resultando em 25/10/2026',
        expectedOutput: '25/10/2026',
      },
    ],
    explanation: 'No PHP 8+, DateTimeImmutable é o padrão recomendado por frameworks modernos (como Symfony e Laravel) para evitar mutações acidentais.',
  },

  // 10
  {
    id: 'php-inter-10',
    language: 'php',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Segurança & Regex',
    title: 'Validador de Política de Senha Forte com preg_match',
    summary: 'Valide se uma senha contém no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.',
    realWorldContext: 'Diretrizes do NIST e LGPD exigem políticas rigorosas de senha para mitigar ataques de força bruta e dicionário.',
    description: 'Complete a função que valida a complexidade da senha usando preg_match e regras de regex lookahead.',
    goal: 'Preencher a chamada preg_match e o teste da regex.',
    templateCode: `<?php

function validarForcaSenha(string $senha): bool {
    // Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número
    $padrao = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\W]{8,}$/';
    
    return {{blank_0}}($padrao, {{blank_1}}) === 1;
}

var_dump(validarForcaSenha("DevPassword@2026"));
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de expressão regular do PHP',
        expectedAnswers: ['preg_match'],
        hint: 'Função nativa do PHP para verificar se uma string corresponde a uma regex.',
      },
      {
        id: 'blank_1',
        label: 'Variável com o texto da senha',
        expectedAnswers: ['$senha'],
        hint: 'A variável recebida como parâmetro na função.',
      },
    ],
    solutionCode: `<?php

function validarForcaSenha(string $senha): bool {
    $padrao = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\W]{8,}$/';
    return preg_match($padrao, $senha) === 1;
}`,
    hints: [
      'Dica 1: preg_match($regex, $string) retorna 1 se houver match e 0 caso contrário.',
    ],
    testCases: [
      {
        description: 'Senha forte retorna true',
        expectedOutput: 'true',
      },
    ],
    explanation: 'Lookaheads (?=.*[A-Z]) inspecionam a string sem consumir caracteres, permitindo verificar múltiplos critérios de complexidade em uma única expressão.',
  },

  // 11 - Corrigir Erros (PDO SQL Injection)
  {
    id: 'php-inter-debug-01',
    language: 'php',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'PDO & Banco de Dados',
    title: 'Depuração: Eliminar Vulnerabilidade de SQL Injection em PDO',
    summary: 'Identifique a falha crítica de segurança de interpolação direta de variável em SQL e corrija utilizando prepared statements.',
    realWorldContext: 'Interpolar variáveis diretamente em strings SQL é a vulnerabilidade #1 de banco de dados (OWASP Top 10). Em produção, todo parâmetro externo DEVE passar por placeholders e execute() parametrizado.',
    description: 'O código abaixo possui uma vulnerabilidade crítica de SQL Injection ao concatenar `$idUsuario` diretamente na query. Refatore para utilizar um prepared statement seguro com placeholder nomeado (`:id`) e passe o parâmetro via array no método `execute()`.',
    goal: 'Substituir a query insegura por $pdo->prepare() e $stmt->execute([":id" => $idUsuario]).',
    bugDescription: 'A variável $idUsuario está concatenada diretamente na string SQL, abrindo brecha para invasão e SQL Injection.',
    buggyLineNumbers: [5],
    initialBuggyCode: `<?php

function buscarUsuarioPorId(PDO $pdo, int $idUsuario): ?array {
    // VULNERABILIDADE CRÍTICA: Interpolação direta sem prepared statement!
    $sql = "SELECT id, nome, email FROM usuarios WHERE id = " . $idUsuario;
    $stmt = $pdo->query($sql);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    return $usuario ?: null;
}
`,
    templateCode: `<?php

function buscarUsuarioPorId(PDO $pdo, int $idUsuario): ?array {
    // Corrija a instrução SQL e use prepared statement seguro:
    $stmt = $pdo->prepare("SELECT id, nome, email FROM usuarios WHERE id = :id");
    $stmt->execute([':id' => $idUsuario]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    return $usuario ?: null;
}
`,
    solutionCode: `<?php

function buscarUsuarioPorId(PDO $pdo, int $idUsuario): ?array {
    $stmt = $pdo->prepare("SELECT id, nome, email FROM usuarios WHERE id = :id");
    $stmt->execute([':id' => $idUsuario]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    return $usuario ?: null;
}
`,
    hints: [
      'Dica 1: Troque $pdo->query(...) por $pdo->prepare("SELECT ... WHERE id = :id").',
      'Dica 2: Em seguida, chame $stmt->execute([":id" => $idUsuario]) para fazer o bind seguro.',
      'Dica 3: Nunca concatene variáveis em queries SQL.',
    ],
    testCases: [
      {
        description: 'Consulta segura preparada e parametrizada com :id',
        expectedOutput: 'Prepared statement com :id executado com sucesso',
      },
    ],
    validationRules: [
      {
        id: 'rule-prepare',
        description: 'Uso de $pdo->prepare()',
        type: 'contains',
        target: 'prepare',
      },
      {
        id: 'rule-placeholder',
        description: 'Uso de placeholder seguro :id na query',
        type: 'contains',
        target: ':id',
      },
      {
        id: 'rule-execute',
        description: 'Execução parametrizada com $stmt->execute()',
        type: 'contains',
        target: 'execute',
      },
      {
        id: 'rule-no-concat',
        description: 'Sem concatenação insegura com ponto na query',
        type: 'not_contains',
        target: 'WHERE id = " .',
      },
    ],
    explanation: 'Ao usar prepare() e execute(), o driver PDO envia a consulta e os dados em canais separados para o banco de dados. Os dados nunca são interpretados como comandos SQL, neutralizando 100% dos ataques de SQL Injection.',
  },

  // 12 - Prever a Saída (POO e Herança)
  {
    id: 'php-inter-prever-01',
    language: 'php',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Orientação a Objetos',
    title: 'Previsão de Saída: Encapsulamento e Herança de Métodos Protegidos',
    summary: 'Preveja o comportamento e valor impresso por uma subclasse que herda e estende métodos da classe mãe.',
    realWorldContext: 'Sistemas corporativos utilizam herança e polimorfismo para especializar comportamentos (ex: Usuário -> Cliente -> ClienteVip). Entender como métodos protegidos se comportam é essencial.',
    description: 'Analise as classes `Funcionario` e `Gerente`. Sem rodar o código, preveja o valor exato impresso pelo echo na última linha.',
    goal: 'Prever o cálculo e a formatação resultante do método calcularRemuneracao.',
    templateCode: `<?php

class Funcionario {
    protected float $salarioBase;

    public function __construct(float $salarioBase) {
        $this->salarioBase = $salarioBase;
    }

    public function calcularRemuneracao(): float {
        return $this->salarioBase;
    }
}

class Gerente extends Funcionario {
    private float $bonus;

    public function __construct(float $salarioBase, float $bonus) {
        parent::__construct($salarioBase);
        $this->bonus = $bonus;
    }

    public function calcularRemuneracao(): float {
        return parent::calcularRemuneracao() + $this->bonus;
    }
}

$gestor = new Gerente(5000.0, 1500.0);
echo "Total: " . (int)$gestor->calcularRemuneracao();
`,
    codeToPredict: `<?php

class Funcionario {
    protected float $salarioBase;

    public function __construct(float $salarioBase) {
        $this->salarioBase = $salarioBase;
    }

    public function calcularRemuneracao(): float {
        return $this->salarioBase;
    }
}

class Gerente extends Funcionario {
    private float $bonus;

    public function __construct(float $salarioBase, float $bonus) {
        parent::__construct($salarioBase);
        $this->bonus = $bonus;
    }

    public function calcularRemuneracao(): float {
        return parent::calcularRemuneracao() + $this->bonus;
    }
}

$gestor = new Gerente(5000.0, 1500.0);
echo "Total: " . (int)$gestor->calcularRemuneracao();`,
    expectedOutputPrediction: 'Total: 6500',
    acceptableOutputPredictions: ['Total: 6500', 'Total:6500'],
    solutionCode: `<?php

$gestor = new Gerente(5000.0, 1500.0);
echo "Total: " . (int)$gestor->calcularRemuneracao(); // 5000 + 1500 = 6500`,
    hints: [
      'Dica 1: O construtor do Gerente chama parent::__construct com o salário de 5000.0.',
      'Dica 2: O método calcularRemuneracao do Gerente invoca parent::calcularRemuneracao() (5000.0) e soma seu bônus de 1500.0.',
      'Dica 3: O cast (int) converte 6500.0 para 6500 e concatena com "Total: ".',
    ],
    testCases: [
      {
        description: 'Imprime "Total: 6500"',
        expectedOutput: 'Total: 6500',
      },
    ],
    explanation: 'A subclasse Gerente sobrescreve calcularRemuneracao(), mas reutiliza a lógica da classe base via parent::calcularRemuneracao(), somando 5000.0 com o bônus de 1500.0, resultando em 6500.',
  },

  // 13 - Desafio Prático (Webhook Parser)
  {
    id: 'php-inter-desafio-01',
    language: 'php',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'APIs & Tratamento de Erros',
    title: 'Desafio Prático: Parser Seguro de Webhook de Pagamento',
    summary: 'Escreva uma função que decodifica um JSON bruto de webhook, valida os campos obrigatórios e trata exceções.',
    realWorldContext: 'Gateways de pagamento (Stripe, Mercado Pago, Asaas) enviam notificações HTTP via webhooks. O backend deve validar a integridade do JSON e tratar falhas graciosamente.',
    description: 'Crie a função `processarWebhookPagamento(string $jsonPayload): array`. Requisitos:\n1. Decodificar o JSON com `json_decode($jsonPayload, true)`.\n2. Se o JSON for inválido (`json_last_error() !== JSON_ERROR_NONE`), lançar `InvalidArgumentException("JSON inválido")`.\n3. Se faltar a chave "status" ou "transacao_id", lançar `DomainException("Campos obrigatórios ausentes")`.\n4. Se tudo estiver correto, retornar array associativo com ["processado" => true, "id" => $dados["transacao_id"], "status" => $dados["status"]].',
    goal: 'Implementar decodificação defensiva de JSON com validação de esquema e exceptions.',
    practicalRequirements: [
      'Decodificar JSON com json_decode(..., true)',
      'Lançar InvalidArgumentException caso o JSON esteja malformado',
      'Validar a presença das chaves "status" e "transacao_id"',
      'Lançar DomainException caso falte alguma chave obrigatória',
      'Retornar array associativo estruturado com o resultado',
    ],
    templateCode: `<?php

function processarWebhookPagamento(string $jsonPayload): array {
    // 1. Decodificar o JSON
    
    // 2. Verificar json_last_error()
    
    // 3. Validar chaves obrigatórias
    
    // 4. Retornar dados processados
}

// Teste de sucesso:
$resultado = processarWebhookPagamento('{"transacao_id": "tx_9988", "status": "approved", "valor": 150.00}');
print_r($resultado);
`,
    solutionCode: `<?php

function processarWebhookPagamento(string $jsonPayload): array {
    $dados = json_decode($jsonPayload, true);
    
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($dados)) {
        throw new InvalidArgumentException("JSON inválido");
    }
    
    if (!isset($dados['status']) || !isset($dados['transacao_id'])) {
        throw new DomainException("Campos obrigatórios ausentes");
    }
    
    return [
        'processado' => true,
        'id' => $dados['transacao_id'],
        'status' => $dados['status'],
    ];
}

$resultado = processarWebhookPagamento('{"transacao_id": "tx_9988", "status": "approved", "valor": 150.00}');
print_r($resultado);`,
    hints: [
      'Dica 1: O segundo argumento "true" em json_decode força o retorno como array associativo.',
      'Dica 2: Use json_last_error() !== JSON_ERROR_NONE para detectar falha de sintaxe no JSON.',
      'Dica 3: Use !isset($dados["status"]) || !isset($dados["transacao_id"]) para checar a presença dos campos.',
    ],
    testCases: [
      {
        description: 'Processa payload válido e retorna array com id e status',
        expectedOutput: 'processado => 1, id => tx_9988, status => approved',
      },
    ],
    validationRules: [
      {
        id: 'rule-json-decode',
        description: 'Uso de json_decode com segundo parâmetro true',
        type: 'contains',
        target: 'json_decode',
      },
      {
        id: 'rule-invalid-arg-ex',
        description: 'Lançamento de InvalidArgumentException para JSON inválido',
        type: 'contains',
        target: 'InvalidArgumentException',
      },
      {
        id: 'rule-domain-ex',
        description: 'Lançamento de DomainException para campos faltantes',
        type: 'contains',
        target: 'DomainException',
      },
      {
        id: 'rule-processado-return',
        description: 'Retorno com chave processado e id',
        type: 'contains',
        target: 'processado',
      },
    ],
    explanation: 'Tratar erros com exceções semânticas (InvalidArgumentException para parsing e DomainException para regras de negócio) permite que controladores HTTP retornem os códigos de status adequados (ex: 400 Bad Request ou 422 Unprocessable Entity).',
  },
];


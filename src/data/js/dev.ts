import { Exercise } from '../../types/exercise';

export const jsDevProjects: Exercise[] = [
  {
    id: 'js-dev-01',
    language: 'javascript',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto Full-Frontend: Offline-First & Sincronização IndexedDB',
    title: 'Módulo de Persistência Offline-First com IndexedDB e Fila de Sincronização',
    summary: 'Construa a camada de armazenamento local e sincronização resiliente para operadores em campo sem internet contínua.',
    realWorldContext: 'Vendedores e técnicos externos visitam galpões ou áreas rurais sem sinal de celular. Eles precisam cadastrar clientes e pedidos localmente, e quando a conexão voltar, o app sincroniza tudo automaticamente.',
    description: 'O PO do projeto levantou as necessidades com a equipe comercial da "VendasMobile". Sua missão é criar a classe de gerenciamento do IndexedDB nativo (abrir banco, salvar rascunho de pedido e recuperar fila de sincronização pendente).',
    goal: 'Implementar a inicialização do IndexedDB e os métodos de salvar pedido e listar itens pendentes.',
    projectBrief: {
      clientName: 'VendasMobile Logística & Varejo',
      poName: 'Rodrigo Mendonça (Senior PO - Mobile & Offline Systems)',
      businessContext: 'A empresa possui 400 representantes comerciais no Brasil todo. Antes, se o representante ficasse sem sinal no cliente, perdia o pedido ou anotava em papel. O novo app web deve gravar tudo instantaneamente no IndexedDB local e despachar quando o evento window.online disparar.',
      userStories: [
        {
          asA: 'Representante de Vendas',
          iWant: 'salvar pedidos mesmo estando em modo avião ou sem sinal 4G',
          soThat: 'eu não perca a negociação nem dependa de papel.'
        },
        {
          asA: 'Sistema de Sincronização',
          iWant: 'detectar a reconexão à internet e despachar os pedidos pendentes em lote ordenado',
          soThat: 'a fábrica comece a separar os produtos o mais rápido possível.'
        },
        {
          asA: 'Gerente Comercial',
          iWant: 'garantir que nenhum pedido seja enviado duplicado',
          soThat: 'o cliente não receba mercadoria duas vezes nem seja cobrado a mais.'
        }
      ],
      functionalRequirements: [
        'RF01: Abrir e versionar o banco IndexedDB ("VendasMobileDB", v1) criando as Object Stores: "pedidos" e "sync_queue".',
        'RF02: Método salvarPedidoLocal(pedido): grava o registro com chave uuid e status "pendente_sync".',
        'RF03: Método obterFilaSincronizacao(): retorna apenas os registros cujo status seja "pendente_sync".',
        'RF04: Método marcarComoSincronizado(pedidoId): atualiza o status para "sincronizado" e grava timestamp do servidor.'
      ],
      nonFunctionalRequirements: [
        'RNF01: Uso estrito de Promises encapsulando a API baseada em callbacks do IndexedDB nativo.',
        'RNF02: Tratamento de erros em transações (onabort e onerror).',
        'RNF03: Sem dependências externas pesadas; código puro JavaScript Vanilla ES2022.'
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'Criação das stores "pedidos" com keyPath "id" e índice por "status".' },
        { id: 'ac-2', label: 'Salvar pedido localmente resolve Promise com sucesso e ID gravado.' },
        { id: 'ac-3', label: 'obterFilaSincronizacao() filtra exclusivamente itens não sincronizados.' },
        { id: 'ac-4', label: 'Falha de transação aciona rollback automático sem corromper dados.' }
      ],
      databaseSchema: `/* Esquema Conceitual IndexedDB */
Database: "VendasMobileDB", Versão: 1

Object Store: "pedidos"
- keyPath: "id" (string UUID)
- Índices:
  - "status" (unique: false)
  - "criadoEm" (unique: false)

Object Store: "sync_queue"
- keyPath: "id" (autoIncrement: true)
- Índices:
  - "pedidoId" (unique: true)
  - "tentativas" (unique: false)`,
      architectureNotes: 'Isole a persistência em um Singleton ou classe de serviço `OfflineStorageService`. Evite expor a API de baixo nível do IDBRequest diretamente para os componentes de tela.'
    },
    templateCode: `// Implementação do Serviço de Armazenamento Offline com IndexedDB
class OfflineStorageService {
  constructor(dbName = 'VendasMobileDB', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  // 1. Inicializa o banco de dados e cria as Object Stores
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('pedidos')) {
          const store = db.createObjectStore('pedidos', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  // 2. Salva um novo pedido na Object Store
  async salvarPedidoLocal(pedido) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['pedidos'], 'readwrite');
      const store = tx.objectStore('pedidos');

      const registro = {
        ...pedido,
        status: 'pendente_sync',
        criadoEm: new Date().toISOString()
      };

      const request = store.put(registro);

      request.onsuccess = () => resolve(registro);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  // 3. Obtém todos os pedidos pendentes de sincronização
  async obterFilaSincronizacao() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['pedidos'], 'readonly');
      const store = tx.objectStore('pedidos');
      const index = store.index('status');
      const request = index.getAll('pendente_sync');

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }
}
`,
    solutionCode: `class OfflineStorageService {
  constructor(dbName = 'VendasMobileDB', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('pedidos')) {
          const store = db.createObjectStore('pedidos', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => reject(event.target.error);
    });
  }

  async salvarPedidoLocal(pedido) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['pedidos'], 'readwrite');
      const store = tx.objectStore('pedidos');

      const registro = {
        ...pedido,
        status: 'pendente_sync',
        criadoEm: new Date().toISOString()
      };

      const request = store.put(registro);
      request.onsuccess = () => resolve(registro);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async obterFilaSincronizacao() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['pedidos'], 'readonly');
      const store = tx.objectStore('pedidos');
      const index = store.index('status');
      const request = index.getAll('pendente_sync');

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }
}`,
    hints: [
      'IndexedDB é assíncrono baseado em eventos DOM (onsuccess, onerror). Envolva cada operação em new Promise() para permitir uso limpo com async/await.',
      'Usar índices (como index("status")) permite fazer queries diretas com getAll("pendente_sync") sem escanear todo o banco na memória.'
    ],
    testCases: [
      {
        description: 'Inicializa banco e salva registro com status pendente_sync',
        expectedOutput: 'Registro salvo no IndexedDB',
      },
      {
        description: 'obterFilaSincronizacao retorna apenas pedidos pendentes',
        expectedOutput: 'Lista filtrada por índice',
      }
    ],
    explanation: 'IndexedDB é a espinha dorsal de PWAs e aplicações web offline-first reais, permitindo armazenar gigabytes de dados estruturados no cliente com suporte a transações ACID.'
  },

  {
    id: 'js-dev-02',
    language: 'javascript',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto Frontend: Kanban Drag & Drop com Command Pattern (Undo/Redo)',
    title: 'Quadro Kanban com Drag & Drop Nativo e Histórico Desfazer/Refazer (Undo/Redo)',
    summary: 'Desenvolva a lógica de movimentação de cartões entre colunas com suporte a Ctrl+Z usando o padrão de projeto Command.',
    realWorldContext: 'Ferramentas de produtividade como Trello, Jira e Linear exigem que o usuário possa mover tarefas com fluidez e reverter erros imediatamente com Undo/Redo.',
    description: 'A Product Owner da "AgileFlow" detalhou os requisitos para a reorganização de tarefas no quadro. Quando um cartão é arrastado para outra coluna, o sistema deve executar um comando que guarda o estado anterior para permitir reversão instantânea.',
    goal: 'Construir a classe CommandManager e o comando MoverCartaoCommand para o quadro Kanban.',
    projectBrief: {
      clientName: 'AgileFlow Soluções em Produtividade',
      poName: 'Fernanda Albuquerque (Lead PO - Ferramentas de Produtividade)',
      businessContext: 'Usuários do AgileFlow reclamavam que arrastavam cartões para a coluna errada por engano e não sabiam onde o cartão estava antes. A funcionalidade de Desfazer (Ctrl+Z) e Refazer (Ctrl+Y) tornou-se prioritária no backlog do produto.',
      userStories: [
        {
          asA: 'Membro do Time Ágil',
          iWant: 'arrastar um cartão de "Em Progresso" para "Revisão"',
          soThat: 'a equipe saiba em tempo real qual é a fase atual da entrega.'
        },
        {
          asA: 'Usuário distraído',
          iWant: 'pressionar Ctrl+Z para desfazer o último movimento do cartão',
          soThat: 'ele volte exatamente para a coluna e posição anterior sem confusão.'
        },
        {
          asA: 'Líder Técnico',
          iWant: 'um limite máximo configurável no histórico de histórico (ex: últimas 50 ações)',
          soThat: 'o navegador não sofra com consumo descontrolado de memória.'
        }
      ],
      functionalRequirements: [
        'RF01: Implementar o Command Pattern com interface: execute() e undo().',
        'RF02: Classe CommandManager mantém duas pilhas: undoStack e redoStack.',
        'RF03: Ao executar um novo comando, a pilha redoStack deve ser limpa.',
        'RF04: O comando MoverCartaoCommand guarda a colunaOrigem, colunaDestino, cardId e posições anteriores.'
      ],
      nonFunctionalRequirements: [
        'RNF01: Limite máximo de histórico (capacidade = 30 comandos).',
        'RNF02: Operações puras e imutáveis ao manipular o estado dos cartões.',
        'RNF03: Métodos canUndo() e canRedo() para habilitar/desabilitar botões na UI.'
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'Executar comando move cartão para a coluna destino.' },
        { id: 'ac-2', label: 'undo() restaura o cartão para a coluna e posição de origem.' },
        { id: 'ac-3', label: 'redo() reaplica o movimento com fidelidade.' },
        { id: 'ac-4', label: 'Pilha não excede o limite máximo estipulado (descarta o comando mais antigo).' }
      ],
      databaseSchema: `/* Estado JSON do Quadro */
{
  "quadroId": "board-101",
  "colunas": {
    "todo": ["card-1", "card-2"],
    "in_progress": ["card-3"],
    "done": ["card-4"]
  },
  "cartoes": {
    "card-1": { "titulo": "Criar API", "responsavel": "Lucas" },
    "card-2": { "titulo": "Testar Auth", "responsavel": "Julia" }
  }
}`,
      architectureNotes: 'O padrão Command transforma a ação do usuário em um objeto contendo todo o contexto necessário para refazer ou desfazer. Essa mesma estrutura viabiliza sincronização colaborativa via WebSockets.'
    },
    templateCode: `// Gerenciador de Comandos (Undo / Redo)
class CommandManager {
  constructor(limiteMaximo = 30) {
    this.limiteMaximo = limiteMaximo;
    this.undoStack = [];
    this.redoStack = [];
  }

  executar(comando) {
    comando.execute();
    this.undoStack.push(comando);
    if (this.undoStack.length > this.limiteMaximo) {
      this.undoStack.shift(); // Remove o mais antigo
    }
    this.redoStack = []; // Limpa redo após nova ação
  }

  desfazer() {
    if (!this.podeDesfazer()) return;
    const comando = this.undoStack.pop();
    comando.undo();
    this.redoStack.push(comando);
  }

  refazer() {
    if (!this.podeRefazer()) return;
    const comando = this.redoStack.pop();
    comando.execute();
    this.undoStack.push(comando);
  }

  podeDesfazer() { return this.undoStack.length > 0; }
  podeRefazer() { return this.redoStack.length > 0; }
}

// Comando concreto para mover cartão entre colunas
class MoverCartaoCommand {
  constructor(quadroState, cardId, colunaOrigem, colunaDestino) {
    this.quadroState = quadroState;
    this.cardId = cardId;
    this.colunaOrigem = colunaOrigem;
    this.colunaDestino = colunaDestino;
  }

  execute() {
    // Remove da origem
    const origem = this.quadroState.colunas[this.colunaOrigem];
    const index = origem.indexOf(this.cardId);
    if (index > -1) origem.splice(index, 1);

    // Adiciona no destino
    this.quadroState.colunas[this.colunaDestino].push(this.cardId);
  }

  undo() {
    // Reverte: remove do destino e retorna para a origem
    const destino = this.quadroState.colunas[this.colunaDestino];
    const index = destino.indexOf(this.cardId);
    if (index > -1) destino.splice(index, 1);

    this.quadroState.colunas[this.colunaOrigem].push(this.cardId);
  }
}
`,
    solutionCode: `class CommandManager {
  constructor(limiteMaximo = 30) {
    this.limiteMaximo = limiteMaximo;
    this.undoStack = [];
    this.redoStack = [];
  }

  executar(comando) {
    comando.execute();
    this.undoStack.push(comando);
    if (this.undoStack.length > this.limiteMaximo) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  desfazer() {
    if (!this.podeDesfazer()) return;
    const comando = this.undoStack.pop();
    comando.undo();
    this.redoStack.push(comando);
  }

  refazer() {
    if (!this.podeRefazer()) return;
    const comando = this.redoStack.pop();
    comando.execute();
    this.undoStack.push(comando);
  }

  podeDesfazer() { return this.undoStack.length > 0; }
  podeRefazer() { return this.redoStack.length > 0; }
}`,
    hints: [
      'Ao executar uma ação nova, a pilha de refazer (redoStack) DEVE ser zerada, pois o fluxo de histórico bifurcou.',
      'O comando deve guardar apenas as informações estritamente necessárias para o rollback para não inflar a memória.'
    ],
    testCases: [
      {
        description: 'Mover cartão executa e desfazer retorna à coluna inicial',
        expectedOutput: 'Cartão restaurado para colunaOrigem',
      },
      {
        description: 'Refazer reaplica a movimentação no quadro',
        expectedOutput: 'Cartão presente em colunaDestino',
      }
    ],
    explanation: 'O padrão Command é amplamente utilizado em editores gráficos (Figma, Photoshop) e interfaces ricas para gerenciar transações de tela reversíveis.'
  },

  {
    id: 'js-dev-03',
    language: 'javascript',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto Frontend/SDK: Cliente HTTP Resiliente com Refresh Token Atômico',
    title: 'SDK de API com Interceptors e Renovação Atômica de Token JWT',
    summary: 'Construa um cliente HTTP que renova tokens expirados (HTTP 401) e retenta requisições pausadas sem disparar múltiplos refreshs concorrentes.',
    realWorldContext: 'Se 5 chamadas de API dispararem simultaneamente e o token JWT estiver expirado, apenas UM pedido de refresh deve ir ao servidor. As outras 4 chamadas devem aguardar na fila e ser re-executadas com o novo token.',
    description: 'O PO de Plataforma e APIs da "CloudBridge" especificou o comportamento de autenticação do SDK cliente. O SDK deve interceptar status 401, acionar o endpoint de refresh token, atualizar o cabeçalho Authorization e reenviar as requisições pendentes.',
    goal: 'Implementar a fila de espera atômica de refresh token no cliente HTTP.',
    projectBrief: {
      clientName: 'CloudBridge Developer Platform',
      poName: 'Lucas Portela (PO - SDKs & Developer Experience)',
      businessContext: 'Clientes da CloudBridge estavam recebendo "Sessão Expirada" indevidamente quando múltiplas abas ou múltiplos componentes React solicitavam dados ao mesmo tempo. Cada componente disparava seu próprio /auth/refresh, invalidando o token dos outros.',
      userStories: [
        {
          asA: 'Desenvolvedor consumindo o SDK',
          iWant: 'fazer chamadas api.get("/dados") sem me preocupar com expiração de token JWT',
          soThat: 'a experiência de navegação do usuário final seja fluida e sem deslogues repentinos.'
        },
        {
          asA: 'Servidor de Autenticação (OAuth/OIDC)',
          iWant: 'receber apenas UMA requisição de refresh por ciclo de expiração',
          soThat: 'o banco de dados e o Redis não sofram sobrecarga de rotação de chaves.'
        }
      ],
      functionalRequirements: [
        'RF01: Anexar token Bearer em todas as requisições automaticamente.',
        'RF02: Se a requisição responder HTTP 401, enfileirar a requisição e verificar se um refresh já está em andamento.',
        'RF03: Se nenhum refresh estiver ativo, disparar renovarToken() e guardar a Promise única.',
        'RF04: Quando o novo token chegar, resolver todas as requisições da fila com o novo token.',
        'RF05: Se o refresh falhar, rejeitar todas as requisições na fila e disparar evento de logout.'
      ],
      nonFunctionalRequirements: [
        'RNF01: Fila baseada em array de resolvers de Promise.',
        'RNF02: Prevenção total de condições de corrida (Race Conditions).',
        'RNF03: Tempo de espera limite para o refresh de 10 segundos.'
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'Múltiplas requisições simultâneas com token expirado resultam em exatamente 1 chamada de refresh.' },
        { id: 'ac-2', label: 'Todas as requisições originais são reenviadas e retornam dados com sucesso.' },
        { id: 'ac-3', label: 'Se o refresh falhar, o callback onAuthError é disparado.' }
      ],
      databaseSchema: `/* Contrato de Tokens */
Token de Acesso (Access Token): JWT (vida útil de 15 minutos)
Token de Atualização (Refresh Token): Chave opaca persistida em HttpOnly Cookie ou SecureStorage (vida útil de 30 dias)`,
      architectureNotes: 'Utilize o padrão Single-Flight / Mutex com Promises em memória para compartilhar a Promise de renovação entre todas as chamadas em voo.'
    },
    templateCode: `class ApiClient {
  constructor(baseUrl, authProvider) {
    this.baseUrl = baseUrl;
    this.authProvider = authProvider; // { getAccessToken(), refreshAccessToken(), logout() }
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  onRefreshed(novoToken) {
    this.refreshSubscribers.forEach(callback => callback(novoToken));
    this.refreshSubscribers = [];
  }

  async request(endpoint, options = {}) {
    const token = await this.authProvider.getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': \`Bearer \${token}\` } : {}),
      ...options.headers,
    };

    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, { ...options, headers });

    // Se o token expirou
    if (response.status === 401) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;

        try {
          const novoToken = await this.authProvider.refreshAccessToken();
          this.isRefreshing = false;
          this.onRefreshed(novoToken);
        } catch (erro) {
          this.isRefreshing = false;
          this.refreshSubscribers = [];
          this.authProvider.logout();
          throw erro;
        }
      }

      // Aguarda na fila até o refresh terminar
      const retryToken = await new Promise(resolve => {
        this.refreshSubscribers.push(resolve);
      });

      return this.request(endpoint, {
        ...options,
        headers: { ...options.headers, Authorization: \`Bearer \${retryToken}\` }
      });
    }

    return response.json();
  }
}
`,
    solutionCode: `class ApiClient {
  constructor(baseUrl, authProvider) {
    this.baseUrl = baseUrl;
    this.authProvider = authProvider;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  onRefreshed(novoToken) {
    this.refreshSubscribers.forEach(callback => callback(novoToken));
    this.refreshSubscribers = [];
  }

  async request(endpoint, options = {}) {
    const token = await this.authProvider.getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': \`Bearer \${token}\` } : {}),
      ...options.headers,
    };

    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, { ...options, headers });

    if (response.status === 401) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;

        try {
          const novoToken = await this.authProvider.refreshAccessToken();
          this.isRefreshing = false;
          this.onRefreshed(novoToken);
        } catch (erro) {
          this.isRefreshing = false;
          this.refreshSubscribers = [];
          this.authProvider.logout();
          throw erro;
        }
      }

      const retryToken = await new Promise(resolve => {
        this.refreshSubscribers.push(resolve);
      });

      return this.request(endpoint, {
        ...options,
        headers: { ...options.headers, Authorization: \`Bearer \${retryToken}\` }
      });
    }

    return response.json();
  }
}`,
    hints: [
      'O segredo do refresh atômico é guardar os "resolvers" das Promises pendentes em um array (refreshSubscribers).',
      'Quando o novo token chega, invocar cada resolver libera todas as requisições simultaneamente com o novo token atualizado.'
    ],
    testCases: [
      {
        description: 'Trata 401, renova token uma única vez e retenta chamada com sucesso',
        expectedOutput: 'Dados da requisição retornados',
      }
    ],
    explanation: 'A renovação atômica com fila de inscritos (subscribers queue) é o padrão adotado por bibliotecas como Axios Interceptors para garantir zero deslogues acidentais.'
  }
];

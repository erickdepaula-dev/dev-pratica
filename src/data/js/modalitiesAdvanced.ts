import { Exercise } from '../../types/exercise';

export const jsAdvancedModalities: Exercise[] = [
  // ==========================================
  // CORRIGIR ERROS (5 exercícios)
  // ==========================================
  {
    id: 'js-avancado-debug-02',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Assincronismo & Race Condition',
    title: 'Depuração: Condição de Corrida em Autocomplete com AbortController',
    summary: 'Evite respostas defasadas sobrescrevendo buscas recentes usando AbortController.',
    realWorldContext: 'Em campos de busca, se o usuário digita "re" e depois "react", a requisição de "re" pode demorar mais na rede e responder DEPOIS da busca de "react", exibindo dados defasados. AbortController cancela a requisição anterior.',
    description: 'A função buscarSugestoes dispara requisições via fetch. Mantenha um controllerAtivo no escopo externo. Se já existir uma requisição em andamento, chame controllerAtivo.abort(). Crie um novo AbortController, passe signal para o fetch e trate AbortError.',
    goal: 'Cancelar requisições anteriores ativas para garantir apenas a resposta mais recente.',
    bugDescription: 'Requisições mais antigas que demoram mais na rede sobrescrevem a resposta da busca mais atual.',
    buggyLineNumbers: [4],
    initialBuggyCode: `let controllerAtivo = null;

async function buscarSugestoes(termo, fetchFn) {
  // BUG: Não cancela a requisição anterior na rede!
  const resposta = await fetchFn(\`/api/busca?q=\${termo}\`);
  return resposta.json();
}
`,
    templateCode: `let controllerAtivo = null;

async function buscarSugestoes(termo, fetchFn) {
  if (controllerAtivo) {
    controllerAtivo.abort();
  }
  controllerAtivo = new AbortController();

  try {
    const resposta = await fetchFn(\`/api/busca?q=\${termo}\`, {
      signal: controllerAtivo.signal
    });
    return await resposta.json();
  } catch (erro) {
    if (erro.name === 'AbortError') {
      return null;
    }
    throw erro;
  }
}
`,
    solutionCode: `let controllerAtivo = null;

async function buscarSugestoes(termo, fetchFn) {
  if (controllerAtivo) {
    controllerAtivo.abort();
  }
  controllerAtivo = new AbortController();

  try {
    const resposta = await fetchFn(\`/api/busca?q=\${termo}\`, {
      signal: controllerAtivo.signal
    });
    return await resposta.json();
  } catch (erro) {
    if (erro.name === 'AbortError') {
      return null;
    }
    throw erro;
  }
}
`,
    hints: [
      'Chame controllerAtivo.abort() se ele existir.',
      'Instancie controllerAtivo = new AbortController(); e passe { signal: controllerAtivo.signal }.',
      'Trate if (erro.name === "AbortError") return null;'
    ],
    testCases: [
      {
        description: 'Cancela requisição pendente com AbortController',
        expectedOutput: 'AbortController',
        testFunction: `
          let abortado = false;
          const mockFetch = (url, opts) => {
            if (opts?.signal) {
              opts.signal.addEventListener('abort', () => abortado = true);
            }
            return new Promise(() => {}); // never resolves
          };
          buscarSugestoes("a", mockFetch);
          buscarSugestoes("b", mockFetch);
          return abortado;
        `
      }
    ],
    explanation: 'AbortController permite sinalizar cancelamento cooperativo de requisições HTTP fetch e tarefas assíncronas no navegador e no Node.js.',
    validationRules: [
      { id: 'rule-abort-ctrl', type: 'contains', target: 'AbortController', description: 'Instanciação de AbortController' },
      { id: 'rule-signal', type: 'contains', target: 'signal:', description: 'Passagem do sinal de cancelamento' }
    ]
  },
  {
    id: 'js-avancado-debug-03',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Metaprogramação & Proxy',
    title: 'Depuração: Perda de Contexto em Getters com Proxy sem Reflect.get',
    summary: 'Corrija um Proxy que acessa propriedades usando target[prop] em vez de repassar o receiver com Reflect.get.',
    realWorldContext: 'Ao criar proxies de observabilidade ou reatividade (como no Vue 3), acessar target[prop] desvincula getters de propriedades computadas, fazendo o this dentro do getter apontar para o target cru e não para o proxy envelopado.',
    description: 'No Proxy abaixo, o trap get retorna target[prop]. Isso quebra quando o objeto possui um getter que lê outra propriedade do próprio Proxy. Altere o retorno do trap para usar Reflect.get(target, prop, receiver).',
    goal: 'Utilizar Reflect.get com o argumento receiver para preservar o contexto do Proxy.',
    bugDescription: 'target[prop] ignora o receiver, impedindo que getters de propriedades computadas acessem o Proxy.',
    buggyLineNumbers: [4],
    initialBuggyCode: `function criarObjetoReativo(alvo) {
  return new Proxy(alvo, {
    get(target, prop, receiver) {
      console.log(\`Lendo: \${String(prop)}\`);
      // BUG: target[prop] quebra o receiver em getters aninhados!
      return target[prop];
    }
  });
}
`,
    templateCode: `function criarObjetoReativo(alvo) {
  return new Proxy(alvo, {
    get(target, prop, receiver) {
      console.log(\`Lendo: \${String(prop)}\`);
      // Corrija usando Reflect.get:
      return Reflect.get(target, prop, receiver);
    }
  });
}
`,
    solutionCode: `function criarObjetoReativo(alvo) {
  return new Proxy(alvo, {
    get(target, prop, receiver) {
      console.log(\`Lendo: \${String(prop)}\`);
      return Reflect.get(target, prop, receiver);
    }
  });
}
`,
    hints: [
      'Substitua return target[prop] por return Reflect.get(target, prop, receiver);',
      'Reflect.get garante que o this dentro de qualquer getter aponte para o receiver (o Proxy).'
    ],
    testCases: [
      {
        description: 'Preserva receiver em propriedades computadas (getters)',
        expectedOutput: 'Reflect.get',
        testFunction: `
          const obj = { get total() { return 100; } };
          const proxy = criarObjetoReativo(obj);
          return proxy.total === 100;
        `
      }
    ],
    explanation: 'A API Reflect espelha os traps do Proxy e o terceiro argumento "receiver" direciona o escopo "this" de getters para o próprio Proxy intermediário.',
    validationRules: [
      { id: 'rule-reflect-get', type: 'contains', target: 'Reflect.get(target, prop, receiver)', description: 'Uso de Reflect.get com receiver' }
    ]
  },
  {
    id: 'js-avancado-debug-04',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Serialização & BigInt / Ciclos',
    title: 'Depuração: TypeError em JSON.stringify com BigInt',
    summary: 'Corrija erro fatal ao tentar serializar objetos com inteiros gigantes (BigInt) fornecendo uma função replacer.',
    realWorldContext: 'Sistemas que lidam com IDs do Twitter/Snowflake, criptografia ou transações de blockchain utilizam BigInt. JSON.stringify dispara TypeError fatal se encontrar um BigInt sem um replacer customizado.',
    description: 'A função serializarPayload recebe dados com IDs do tipo BigInt. Ao chamar JSON.stringify, o ambiente dispara TypeError. Forneça uma função replacer que converte valores typeof valor === "bigint" para valor.toString().',
    goal: 'Evitar TypeError tratando BigInt na função replacer do JSON.stringify.',
    bugDescription: 'JSON.stringify não possui serialização padrão para BigInt e quebra em tempo de execução.',
    buggyLineNumbers: [3],
    initialBuggyCode: `function serializarPayload(dados) {
  // BUG: Dispara TypeError se houver qualquer BigInt!
  return JSON.stringify(dados);
}
`,
    templateCode: `function serializarPayload(dados) {
  // Corrija passando uma função replacer que converte BigInt em string:
  return JSON.stringify(dados, (chave, valor) => {
    return typeof valor === 'bigint' ? valor.toString() : valor;
  });
}
`,
    solutionCode: `function serializarPayload(dados) {
  return JSON.stringify(dados, (chave, valor) => {
    return typeof valor === 'bigint' ? valor.toString() : valor;
  });
}
`,
    hints: [
      'O segundo parâmetro de JSON.stringify é um replacer: (key, value) => ...',
      'Se typeof valor === "bigint", retorne valor.toString(), caso contrário retorne valor.'
    ],
    testCases: [
      {
        description: 'Serializa objeto com BigInt sem TypeError',
        expectedOutput: '{"id":"9007199254740993"}',
        testFunction: `
          const r = serializarPayload({ id: BigInt("9007199254740993") });
          return r === '{"id":"9007199254740993"}';
        `
      }
    ],
    explanation: 'Por padrão, JSON não possui especificação nativa para tipos numéricos de 64/128 bits além do padrão double. O replacer é a forma padrão de interoperabilidade.',
    validationRules: [
      { id: 'rule-bigint-check', type: 'contains', target: "typeof valor === 'bigint'", description: 'Checagem de tipo bigint' },
      { id: 'rule-bigint-tostring', type: 'contains', target: 'valor.toString()', description: 'Conversão com toString()' }
    ]
  },
  {
    id: 'js-avancado-debug-05',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Concorrência & Mutex Assíncrono',
    title: 'Depuração: Bloqueio Permanente em Mutex por Exceção sem Release',
    summary: 'Evite deadlocks em travas assíncronas liberando o lock no bloco finally.',
    realWorldContext: 'Em operações de banco de dados ou escrita em arquivo onde apenas uma operação assíncrona pode rodar por vez, esquecer de liberar a trava em caso de erro trava todas as operações seguintes da fila.',
    description: 'A função executarSecaoCritica adquire um lock com await mutex.adquirir(). Se a função tarefa() falhar, o método mutex.liberar() nunca é chamado, congelando a aplicação. Envolva em try...finally garantindo que mutex.liberar() execute sempre.',
    goal: 'Garantir liberação da trava via bloco finally.',
    bugDescription: 'Se tarefa() lançar erro, mutex.liberar() é pulado e novos processos ficam bloqueados eternamente.',
    buggyLineNumbers: [6],
    initialBuggyCode: `async function executarSecaoCritica(mutex, tarefa) {
  await mutex.adquirir();

  // BUG: Se tarefa() disparar exceção, mutex nunca é liberado!
  const resultado = await tarefa();
  mutex.liberar();
  return resultado;
}
`,
    templateCode: `async function executarSecaoCritica(mutex, tarefa) {
  await mutex.adquirir();

  try {
    return await tarefa();
  } finally {
    // Corrija liberando no bloco finally
    mutex.liberar();
  }
}
`,
    solutionCode: `async function executarSecaoCritica(mutex, tarefa) {
  await mutex.adquirir();

  try {
    return await tarefa();
  } finally {
    mutex.liberar();
  }
}
`,
    hints: [
      'Envolva o await tarefa() em um bloco try.',
      'No bloco finally, invoque mutex.liberar();'
    ],
    testCases: [
      {
        description: 'Chama mutex.liberar() mesmo quando a tarefa lança exceção',
        expectedOutput: 'liberou',
        testFunction: `
          let liberou = false;
          const mockMutex = { adquirir: () => Promise.resolve(), liberar: () => { liberou = true; } };
          return executarSecaoCritica(mockMutex, () => { throw new Error("ops"); }).catch(() => liberou);
        `
      }
    ],
    explanation: 'Blocos try...finally garantem que recursos de exclusão mútua e descritores sejam devolvidos ao sistema operacional ou fila de controle.',
    validationRules: [
      { id: 'rule-finally', type: 'contains', target: 'finally', description: 'Uso de bloco finally' },
      { id: 'rule-liberar', type: 'contains', target: 'mutex.liberar()', description: 'Chamada de mutex.liberar()' }
    ]
  },
  {
    id: 'js-avancado-debug-06',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'DOM & Memory Leaks com Listeners',
    title: 'Depuração: Vazamento de Memória por EventListener sem Remoção',
    summary: 'Corrija listeners registrados repetidamente em elementos DOM utilizando a opção { once: true } ou cleanup.',
    realWorldContext: 'Em SPAs, componentes que montam e desmontam sem remover listeners de eventos globais retêm referências a closures antigas gerando vazamentos massivos de RAM.',
    description: 'A função ouvirPrimeiroClique adiciona um ouvinte de clique no botão que só deve rodar uma vez. No entanto, o desenvolvedor não removeu o listener nem usou { once: true }, acumulando chamadas a cada clique futuro. Corrija passando a opção { once: true } no addEventListener.',
    goal: 'Configurar o ouvinte com a flag { once: true } nativa.',
    bugDescription: 'O ouvinte continua ativo e disparando callbacks infinitamente a cada clique.',
    buggyLineNumbers: [4],
    initialBuggyCode: `function ouvirPrimeiroClique(elemento, callback) {
  // BUG: Não usa cleanup nem { once: true }, disparando em todos os cliques!
  elemento.addEventListener('click', () => {
    callback();
  });
}
`,
    templateCode: `function ouvirPrimeiroClique(elemento, callback) {
  // Corrija adicionando o terceiro parâmetro { once: true }:
  elemento.addEventListener('click', () => {
    callback();
  }, { once: true });
}
`,
    solutionCode: `function ouvirPrimeiroClique(elemento, callback) {
  elemento.addEventListener('click', () => {
    callback();
  }, { once: true });
}
`,
    hints: [
      'O método addEventListener aceita um objeto de opções como terceiro parâmetro.',
      'Adicione { once: true } para que o navegador desregistre automaticamente o listener após o primeiro disparo.'
    ],
    testCases: [
      {
        description: 'Registra listener com opção once: true',
        expectedOutput: 'true',
        testFunction: `
          let optRecebida = null;
          const mockEl = { addEventListener: (t, cb, opt) => { optRecebida = opt; } };
          ouvirPrimeiroClique(mockEl, () => {});
          return optRecebida?.once === true;
        `
      }
    ],
    explanation: 'A opção { once: true } é padrão W3C implementado em todos os navegadores modernos, eliminando a necessidade de chamar removeEventListener manualmente.',
    validationRules: [
      { id: 'rule-once-opt', type: 'contains', target: '{ once: true }', description: 'Opção { once: true } no addEventListener' }
    ]
  },

  // ==========================================
  // PREVER SAÍDA (5 exercícios)
  // ==========================================
  {
    id: 'js-avancado-prever-02',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Geradores & Delegação com yield*',
    title: 'Prever Saída: Delegação de Iteração com yield* e Retorno de Expressão',
    summary: 'Descubra a saída gerada por múltiplos geradores encadeados com yield* e valores de retorno.',
    realWorldContext: 'yield* delega o controle da iteração para outro gerador ou iterável, permitindo compor pipelines complexos de dados sem carregar tudo em memória.',
    description: 'Acompanhe a execução do gerador composto. Qual é o texto unificado retornado?',
    goal: 'Prever a sequência de valores emitidos pela delegação de geradores.',
    templateCode: '',
    solutionCode: '1,2,3,4',
    hints: [
      'yield* emite sucessivamente os valores com yield do gerador chamado.',
      'O valor retornado pelo return dentro do gerador não é emitido pelo spread [...].'
    ],
    testCases: [
      {
        description: 'Emissão de valores do gerador composto',
        expectedOutput: '1,2,3,4'
      }
    ],
    codeToPredict: `function* subGerador() {
  yield 2;
  yield 3;
  return "IGNORADO";
}

function* geradorPrincipal() {
  yield 1;
  yield* subGerador();
  yield 4;
}

const resultado = [...geradorPrincipal()];
console.log(resultado.join(","));
`,
    expectedOutputPrediction: '1,2,3,4',
    acceptableOutputPredictions: ['1,2,3,4'],
    explanation: 'O gerador principal emite 1. Em seguida, yield* delega para subGerador, que emite 2 e 3. O valor retornado por "return" no subGerador não faz parte da iteração do spread [...]. Por fim, geradorPrincipal emite 4. O array resultante é [1, 2, 3, 4], impresso como "1,2,3,4".'
  },
  {
    id: 'js-avancado-prever-03',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Metaprogramação & Symbol.toPrimitive',
    title: 'Prever Saída: Coerção Customizada com Symbol.toPrimitive',
    summary: 'Acompanhe como o Symbol.toPrimitive controla a conversão do objeto para number, string e default.',
    realWorldContext: 'Symbol.toPrimitive é um well-known symbol do JavaScript que permite sobrescrever a forma como objetos se comportam em operações aritméticas e concatenações.',
    description: 'Analise o comportamento do objeto moeda quando submetido a soma numérica +moeda e interpolação de string. Qual é o texto gerado?',
    goal: 'Prever os valores retornados pelo método Symbol.toPrimitive baseado no argumento hint.',
    templateCode: '',
    solutionCode: '150|R$ 100',
    hints: [
      'Number() aciona a hint "number".',
      'String() aciona a hint "string".'
    ],
    testCases: [
      {
        description: 'Coerção conforme o hint recebido',
        expectedOutput: '150|R$ 100'
      }
    ],
    codeToPredict: `const moeda = {
  valor: 100,
  simbolo: "R$",
  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      return this.valor;
    }
    if (hint === "string") {
      return \`\${this.simbolo} \${this.valor}\`;
    }
    return this.valor;
  }
};

const num = Number(moeda) + 50;
const str = String(moeda);

console.log(\`\${num}|\${str}\`);
`,
    expectedOutputPrediction: '150|R$ 100',
    acceptableOutputPredictions: ['150|R$ 100'],
    explanation: 'Number(moeda) invoca o Symbol.toPrimitive com hint "number", retornando 100, que somado a 50 resulta em 150. String(moeda) invoca com hint "string", retornando "R$ 100". A saída combinada é "150|R$ 100".'
  },
  {
    id: 'js-avancado-prever-04',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Metaprogramação & Proxy Dinâmico',
    title: 'Prever Saída: Interceptação de Propriedades Inexistentes com Proxy',
    summary: 'Veja como um Proxy pode interceptar e responder dinamicamente a propriedades não declaradas.',
    realWorldContext: 'Proxies dinâmicos são a base de construtores de queries fluidas (como Prisma ou Knex) e bibliotecas de internacionalização (i18n).',
    description: 'Observe o objeto dicionario envelopado por Proxy. O que acontece ao ler propriedades que não existem?',
    goal: 'Identificar a interceptação de fallback retornada pelo trap get do Proxy.',
    templateCode: '',
    solutionCode: 'Olá Mundo / [FALTA_TRADUCAO: adeus]',
    hints: [
      'dicionario.ola foi atribuído e existe no target.',
      'dicionario.adeus não existe e cai no retorno dinâmico do Proxy.'
    ],
    testCases: [
      {
        description: 'Interceptação dinâmica de chaves inexistentes',
        expectedOutput: 'Olá Mundo / [FALTA_TRADUCAO: adeus]'
      }
    ],
    codeToPredict: `const dicionario = new Proxy({}, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    return \`[FALTA_TRADUCAO: \${String(prop)}]\`;
  }
});

dicionario.ola = "Olá Mundo";

console.log(\`\${dicionario.ola} / \${dicionario.adeus}\`);
`,
    expectedOutputPrediction: 'Olá Mundo / [FALTA_TRADUCAO: adeus]',
    acceptableOutputPredictions: ['Olá Mundo / [FALTA_TRADUCAO: adeus]'],
    explanation: 'A propriedade dicionario.ola existe no target, retornando "Olá Mundo". A propriedade dicionario.adeus não existe no target ("adeus" in target é false), acionando o retorno dinâmico "[FALTA_TRADUCAO: adeus]". A saída final é "Olá Mundo / [FALTA_TRADUCAO: adeus]".'
  },
  {
    id: 'js-avancado-prever-05',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Event Loop & queueMicrotask',
    title: 'Prever Saída: Prioridade com queueMicrotask e Promise',
    summary: 'Acompanhe a ordem estrita de esvaziamento da fila de microtarefas.',
    realWorldContext: 'queueMicrotask() permite agendar código para rodar antes que o navegador pinte a tela e antes de macrotasks (como setTimeout), de maneira explícita e padronizada.',
    description: 'Analise a ordem em que os logs síncronos, queueMicrotask e setTimeout são processados. Qual é a saída impressa no console?',
    goal: 'Determinar a precedência entre síncrono, microtarefas e macrotarefas.',
    templateCode: '',
    solutionCode: 'A\nE\nC\nD\nB',
    hints: [
      'Códigos síncronos rodam imediatamente (A, E).',
      'queueMicrotask e Promise.then entram na fila de microtasks antes do setTimeout.'
    ],
    testCases: [
      {
        description: 'Ordem de microtasks versus setTimeout',
        expectedOutput: 'A\nE\nC\nD\nB'
      }
    ],
    codeToPredict: `console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

queueMicrotask(() => {
  console.log("C");
});

Promise.resolve().then(() => {
  console.log("D");
});

console.log("E");
`,
    expectedOutputPrediction: 'A\nE\nC\nD\nB',
    acceptableOutputPredictions: ['A\nE\nC\nD\nB', 'A, E, C, D, B'],
    explanation: '1. Síncrono executa primeiro: "A" e depois "E". 2. Fila de microtarefas roda a seguir em ordem FIFO: "C" (agendado por queueMicrotask) e depois "D" (agendado por Promise.then). 3. Macrotarefa roda por último: "B" (setTimeout). Saída: A, E, C, D, B.'
  },
  {
    id: 'js-avancado-prever-06',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Estruturas de Dados & WeakRef',
    title: 'Prever Saída: Restrição de Tipos em Chaves de WeakMap',
    summary: 'Observe a retenção fraca de referências em coleções WeakMap.',
    realWorldContext: 'WeakMap é a única estrutura em JS que não previne a coleta de lixo de objetos usados como chaves, sendo vital para armazenamento de dados privados de instâncias.',
    description: 'Acompanhe o armazenamento de metadados em um WeakMap. Note que chaves do WeakMap não podem ser tipos primitivos.',
    goal: 'Identificar a restrição de tipos de chave permitidos em WeakMap.',
    templateCode: '',
    solutionCode: 'TYPE_ERROR',
    hints: [
      'WeakMap aceita apenas instâncias de objetos como chave.',
      'Passar uma string causa um TypeError.'
    ],
    testCases: [
      {
        description: 'TypeError ao usar primitiva como chave de WeakMap',
        expectedOutput: 'TYPE_ERROR'
      }
    ],
    codeToPredict: `const mapa = new WeakMap();
let obj = { id: 1 };

mapa.set(obj, "Meta Info");

try {
  mapa.set("chave_texto", "Valor");
  console.log("SUCESSO");
} catch (erro) {
  console.log(erro instanceof TypeError ? "TYPE_ERROR" : "ERRO");
}
`,
    expectedOutputPrediction: 'TYPE_ERROR',
    acceptableOutputPredictions: ['TYPE_ERROR'],
    explanation: 'WeakMap aceita estritamente apenas objetos como chave. Tentar passar um tipo primitivo como "chave_texto" lança imediatamente um TypeError ("Invalid value used as weak map key"). O catch captura e imprime "TYPE_ERROR".'
  },

  // ==========================================
  // DESAFIO PRÁTICO (5 exercícios)
  // ==========================================
  {
    id: 'js-avancado-desafio-02',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Design Patterns & EventEmitter',
    title: 'Desafio Prático: EventEmitter Completo com Cancelamento e Método once()',
    summary: 'Construa um publicador/assinante de eventos desacoplado com métodos on, once, emit e off.',
    realWorldContext: 'O padrão EventEmitter é o alicerce do ecossistema Node.js (streams, sockets, http) e de bibliotecas de arquitetura orientada a eventos no frontend.',
    description: 'Crie a classe MeuEventEmitter. Ela deve possuir os métodos on(evento, callback), once(evento, callback), off(evento, callback) e emit(evento, ...args). O método on deve retornar uma função de cancelamento que remove o ouvinte.',
    goal: 'Implementar o padrão Publicador/Assinante com desinscrição fluida.',
    practicalRequirements: [
      'on(evento, callback): registra o ouvinte e retorna função unsubscribe.',
      'once(evento, callback): registra um ouvinte que executa uma única vez e é automaticamente removido.',
      'off(evento, callback): remove um ouvinte específico.',
      'emit(evento, ...args): executa todos os ouvintes registrados para o evento passando os argumentos.'
    ],
    testCases: [
      {
        description: 'Deve executar ouvinte registrado via on e parar após unsubscribe',
        expectedOutput: '1',
        testFunction: `
          const ee = new MeuEventEmitter();
          let cont = 0;
          const unsub = ee.on("teste", () => cont++);
          ee.emit("teste");
          unsub();
          ee.emit("teste");
          return cont === 1;
        `
      }
    ],
    templateCode: `class MeuEventEmitter {
  constructor() {
    this.eventos = new Map();
  }

  on(evento, callback) {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, []);
    }
    this.eventos.get(evento).push(callback);

    return () => {
      this.off(evento, callback);
    };
  }

  off(evento, callback) {
    if (!this.eventos.has(evento)) return;
    const lista = this.eventos.get(evento).filter(cb => cb !== callback);
    this.eventos.set(evento, lista);
  }

  once(evento, callback) {
    const wrapper = (...args) => {
      this.off(evento, wrapper);
      callback(...args);
    };
    return this.on(evento, wrapper);
  }

  emit(evento, ...args) {
    if (!this.eventos.has(evento)) return;
    const lista = [...this.eventos.get(evento)];
    for (const fn of lista) {
      fn(...args);
    }
  }
}
`,
    solutionCode: `class MeuEventEmitter {
  constructor() {
    this.eventos = new Map();
  }

  on(evento, callback) {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, []);
    }
    this.eventos.get(evento).push(callback);

    return () => {
      this.off(evento, callback);
    };
  }

  off(evento, callback) {
    if (!this.eventos.has(evento)) return;
    const lista = this.eventos.get(evento).filter(cb => cb !== callback);
    this.eventos.set(evento, lista);
  }

  once(evento, callback) {
    const wrapper = (...args) => {
      this.off(evento, wrapper);
      callback(...args);
    };
    return this.on(evento, wrapper);
  }

  emit(evento, ...args) {
    if (!this.eventos.has(evento)) return;
    const lista = [...this.eventos.get(evento)];
    for (const fn of lista) {
      fn(...args);
    }
  }
}
`,
    hints: [
      'Mantenha os ouvintes em um Map onde cada chave armazena um array de callbacks.',
      'Faça uma cópia dos ouvintes ao chamar emit() com [...lista] para evitar erros se um listener se desinscrever durante a execução.'
    ],
    explanation: 'O padrão Observer/PubSub desacopla emissores de eventos dos consumidores, favorecendo arquiteturas modulares testáveis.',
    validationRules: [
      { id: 'rule-on-emit', type: 'contains', target: 'this.eventos', description: 'Armazenamento dos eventos' },
      { id: 'rule-once', type: 'contains', target: 'once(', description: 'Implementação do método once' }
    ]
  },
  {
    id: 'js-avancado-desafio-03',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Resiliência & Retry com Backoff',
    title: 'Desafio Prático: Retry Assíncrono com Backoff Exponencial',
    summary: 'Construa um mecanismo de retentativas para operações de rede que falham temporariamente.',
    realWorldContext: 'Requisições a microsserviços ou bancos podem sofrer intermitências momentâneas. O backoff exponencial aumenta o tempo de espera a cada falha (ex: 100ms, 200ms, 400ms) evitando sobrecarregar o servidor.',
    description: 'Crie a função executarComRetry(tarefaAssincrona, maxTentativas = 3, delayBaseMs = 100). Se a tarefa resolver com sucesso, retorne seu resultado. Se lançar erro e ainda restarem tentativas, aguarde delayBaseMs * 2^(tentativa - 1) milissegundos e tente novamente.',
    goal: 'Repetir a operação assíncrona com atraso exponencial progressivo.',
    practicalRequirements: [
      'Executar a tarefaAssincrona().',
      'Em caso de sucesso, retornar o valor imediatamente.',
      'Em caso de falha, se tentativa < maxTentativas, aguardar delayBaseMs * 2^(tentativa - 1).',
      'Se todas as tentativas falharem, relançar a exceção original.'
    ],
    testCases: [
      {
        description: 'Recupera na segunda tentativa após falha inicial',
        expectedOutput: 'OK',
        testFunction: `
          let tentativas = 0;
          const tarefa = async () => {
            tentativas++;
            if (tentativas === 1) throw new Error("Falha temporária");
            return "OK";
          };
          return executarComRetry(tarefa, 3, 20).then(r => r === "OK");
        `
      }
    ],
    templateCode: `async function executarComRetry(tarefaAssincrona, maxTentativas = 3, delayBaseMs = 100) {
  let ultimoErro;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await tarefaAssincrona();
    } catch (erro) {
      ultimoErro = erro;
      if (tentativa === maxTentativas) break;

      const tempoEspera = delayBaseMs * Math.pow(2, tentativa - 1);
      await new Promise(resolve => setTimeout(resolve, tempoEspera));
    }
  }

  throw ultimoErro;
}
`,
    solutionCode: `async function executarComRetry(tarefaAssincrona, maxTentativas = 3, delayBaseMs = 100) {
  let ultimoErro;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await tarefaAssincrona();
    } catch (erro) {
      ultimoErro = erro;
      if (tentativa === maxTentativas) break;

      const tempoEspera = delayBaseMs * Math.pow(2, tentativa - 1);
      await new Promise(resolve => setTimeout(resolve, tempoEspera));
    }
  }

  throw ultimoErro;
}
`,
    hints: [
      'Use um laço for de 1 até maxTentativas.',
      'Aguarde o delay com await new Promise(r => setTimeout(r, delay)).',
      'O tempo de espera pode ser calculado com delayBaseMs * Math.pow(2, tentativa - 1).'
    ],
    explanation: 'Backoff exponencial com delay progressivo evita ataques inadvertidos de negação de serviço por clientes tentando reconectar simultaneamente.',
    validationRules: [
      { id: 'rule-retry-loop', type: 'contains', target: 'for (let', description: 'Laço de retentativa' },
      { id: 'rule-backoff-pow', type: 'contains', target: 'Math.pow', description: 'Cálculo de potência para backoff exponencial' }
    ]
  },
  {
    id: 'js-avancado-desafio-04',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Concorrência & Mutex',
    title: 'Desafio Prático: Implementação de um Mutex Assíncrono',
    summary: 'Construa um Mutex para garantir que apenas uma Promise execute uma seção crítica de código por vez.',
    realWorldContext: 'Quando múltiplos eventos disparam leitura e escrita em um mesmo arquivo de banco embarcado (ex: SQLite ou JSON em disco), a concorrência corrompe os dados sem um semáforo de exclusão mútua.',
    description: 'Crie a classe AsyncMutex. Ela deve possuir o método adquirir(): Promise<void> e liberar(): void. Ao chamar adquirir(), se a trava estiver desocupada, marque-a como ocupada e resolva imediatamente. Se estiver ocupada, enfileire a Promise.',
    goal: 'Controlar a exclusão mútua assíncrona via fila de Promises.',
    practicalRequirements: [
      'adquirir(): Promise<void> bloqueia chamadas concorrentes enfileirando seus resolves.',
      'liberar(): void transfere a trava para o próximo da fila ou libera o estado.',
      'Garantir execução sequencial FIFO (First In, First Out).'
    ],
    testCases: [
      {
        description: 'Executa 2 tarefas concorrentes em série perfeita',
        expectedOutput: 'true',
        testFunction: `
          const mutex = new AsyncMutex();
          const ordem = [];
          const t1 = async () => {
            await mutex.adquirir();
            await new Promise(r => setTimeout(r, 40));
            ordem.push("T1");
            mutex.liberar();
          };
          const t2 = async () => {
            await mutex.adquirir();
            ordem.push("T2");
            mutex.liberar();
          };
          return Promise.all([t1(), t2()]).then(() => ordem.join(",") === "T1,T2");
        `
      }
    ],
    templateCode: `class AsyncMutex {
  constructor() {
    this.ocupado = false;
    this.fila = [];
  }

  adquirir() {
    if (!this.ocupado) {
      this.ocupado = true;
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.fila.push(resolve);
    });
  }

  liberar() {
    if (this.fila.length > 0) {
      const proximo = this.fila.shift();
      proximo();
    } else {
      this.ocupado = false;
    }
  }
}
`,
    solutionCode: `class AsyncMutex {
  constructor() {
    this.ocupado = false;
    this.fila = [];
  }

  adquirir() {
    if (!this.ocupado) {
      this.ocupado = true;
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.fila.push(resolve);
    });
  }

  liberar() {
    if (this.fila.length > 0) {
      const proximo = this.fila.shift();
      proximo();
    } else {
      this.ocupado = false;
    }
  }
}
`,
    hints: [
      'Mantenha uma fila de callbacks resolve na propriedade this.fila = [].',
      'Quando liberar() for chamado, faça this.fila.shift()() para desbloquear o próximo da fila.'
    ],
    explanation: 'Em ambientes assíncronos single-thread, mutexes baseados em filas de Promise geram exclusão mútua não bloqueante confiável.',
    validationRules: [
      { id: 'rule-mutex-shift', type: 'contains', target: 'this.fila.shift()', description: 'Desenfileiramento de Promises' },
      { id: 'rule-mutex-promise', type: 'contains', target: 'new Promise(resolve', description: 'Criação de Promise pendente para fila' }
    ]
  },
  {
    id: 'js-avancado-desafio-05',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Gerenciamento de Estado & Undo/Redo',
    title: 'Desafio Prático: Store de Estado com Histórico de Desfazer e Refazer',
    summary: 'Construa um container de estado que armazena snapshots permitindo undo() e redo().',
    realWorldContext: 'Editores de imagem (Figma), editores de texto (Google Docs) e formulários avançados exigem botões "Desfazer" (Ctrl+Z) e "Refazer" (Ctrl+Y) para reverter alterações do usuário com segurança.',
    description: 'Implemente a classe UndoRedoStore(estadoInicial). Métodos: obterEstado(), definirEstado(novoEstado), desfazer(): boolean e refazer(): boolean.',
    goal: 'Criar histórico de estados reversível com pilhas de passado e futuro.',
    practicalRequirements: [
      'definirEstado(novo): guarda cópia do estado atual no passado e limpa futuro.',
      'desfazer(): se passado estiver vazio, retorna false; senão move atual para futuro e restaura anterior.',
      'refazer(): se futuro estiver vazio, retorna false; senão move atual para passado e restaura próximo.',
      'obterEstado(): retorna o estado corrente.'
    ],
    testCases: [
      {
        description: 'Desfaz e refaz alterações de estado com precisão',
        expectedOutput: 'true',
        testFunction: `
          const store = new UndoRedoStore("v1");
          store.definirEstado("v2");
          store.definirEstado("v3");
          store.desfazer();
          const r1 = store.obterEstado() === "v2";
          store.refazer();
          const r2 = store.obterEstado() === "v3";
          return r1 && r2;
        `
      }
    ],
    templateCode: `class UndoRedoStore {
  constructor(estadoInicial) {
    this.atual = estadoInicial;
    this.passado = [];
    this.futuro = [];
  }

  obterEstado() {
    return this.atual;
  }

  definirEstado(novoEstado) {
    this.passado.push(this.atual);
    this.atual = novoEstado;
    this.futuro = [];
  }

  desfazer() {
    if (this.passado.length === 0) return false;
    this.futuro.push(this.atual);
    this.atual = this.passado.pop();
    return true;
  }

  refazer() {
    if (this.futuro.length === 0) return false;
    this.passado.push(this.atual);
    this.atual = this.futuro.pop();
    return true;
  }
}
`,
    solutionCode: `class UndoRedoStore {
  constructor(estadoInicial) {
    this.atual = estadoInicial;
    this.passado = [];
    this.futuro = [];
  }

  obterEstado() {
    return this.atual;
  }

  definirEstado(novoEstado) {
    this.passado.push(this.atual);
    this.atual = novoEstado;
    this.futuro = [];
  }

  desfazer() {
    if (this.passado.length === 0) return false;
    this.futuro.push(this.atual);
    this.atual = this.passado.pop();
    return true;
  }

  refazer() {
    if (this.futuro.length === 0) return false;
    this.passado.push(this.atual);
    this.atual = this.futuro.pop();
    return true;
  }
}
`,
    hints: [
      'Mantenha dois arrays: this.passado = [] e this.futuro = [].',
      'Ao alterar o estado, lembre-se de limpar o futuro (this.futuro = []).',
      'Ao desfazer, faça this.passado.pop() e guarde o atual em this.futuro.'
    ],
    explanation: 'A arquitetura Memento com duas pilhas LIFO modela com precisão o comportamento universal de desfazer e refazer em interfaces modernas.',
    validationRules: [
      { id: 'rule-undo-pop', type: 'contains', target: 'this.passado.pop()', description: 'Remoção com pop() do histórico passado' },
      { id: 'rule-redo-pop', type: 'contains', target: 'this.futuro.pop()', description: 'Remoção com pop() do histórico futuro' }
    ]
  },
  {
    id: 'js-avancado-desafio-06',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Concorrência & Pool de Tarefas',
    title: 'Desafio Prático: Pool de Concorrência Assíncrona (p-limit)',
    summary: 'Limite a quantidade máxima de Promises executando simultaneamente em lotes de requisições.',
    realWorldContext: 'Disparar Promise.all em uma lista de 5.000 requisições causa erro de ECONNRESET ou bloqueio de firewall. O limitador de concorrência permite processar todos os itens mantendo no máximo N requisições ativas simultâneas.',
    description: 'Crie a função executarComLimite(tarefas, limiteConcorrencia). Ela recebe um array de funções assíncronas tarefas = [() => Promise, ...] e retorna uma Promise com os resultados preservando a ordem original.',
    goal: 'Executar tarefas assíncronas mantendo teto fixo de concorrência.',
    practicalRequirements: [
      'Se o array tarefas for vazio, retorne [].',
      'No máximo limiteConcorrencia tarefas podem estar em execução ao mesmo tempo.',
      'Conforme uma tarefa termina, a próxima da fila é imediatamente iniciada.',
      'O array final retornado deve preservar a ordem original dos índices das tarefas.'
    ],
    testCases: [
      {
        description: 'Processa 4 tarefas respeitando concorrência máxima de 2',
        expectedOutput: '[10,20,30,40]',
        testFunction: `
          const t = [
            () => Promise.resolve(10),
            () => Promise.resolve(20),
            () => Promise.resolve(30),
            () => Promise.resolve(40)
          ];
          return executarComLimite(t, 2).then(r => JSON.stringify(r) === "[10,20,30,40]");
        `
      }
    ],
    templateCode: `async function executarComLimite(tarefas, limiteConcorrencia) {
  if (tarefas.length === 0) return [];
  const resultados = new Array(tarefas.length);
  let indiceAtual = 0;

  async function trabalhador() {
    while (indiceAtual < tarefas.length) {
      const indice = indiceAtual++;
      resultados[indice] = await tarefas[indice]();
    }
  }

  const trabalhadores = [];
  const totalTrabalhadores = Math.min(limiteConcorrencia, tarefas.length);
  for (let i = 0; i < totalTrabalhadores; i++) {
    trabalhadores.push(trabalhador());
  }

  await Promise.all(trabalhadores);
  return resultados;
}
`,
    solutionCode: `async function executarComLimite(tarefas, limiteConcorrencia) {
  if (tarefas.length === 0) return [];
  const resultados = new Array(tarefas.length);
  let indiceAtual = 0;

  async function trabalhador() {
    while (indiceAtual < tarefas.length) {
      const indice = indiceAtual++;
      resultados[indice] = await tarefas[indice]();
    }
  }

  const trabalhadores = [];
  const totalTrabalhadores = Math.min(limiteConcorrencia, tarefas.length);
  for (let i = 0; i < totalTrabalhadores; i++) {
    trabalhadores.push(trabalhador());
  }

  await Promise.all(trabalhadores);
  return resultados;
}
`,
    hints: [
      'Você pode instanciar uma quantidade fixa de workers (funções assíncronas concorrentes).',
      'Cada worker consome tarefas incrementando um índice compartilhado.',
      'Aguarde todos os workers com Promise.all(trabalhadores).'
    ],
    explanation: 'Concurrency pools evitam saturação do pool de conexões HTTP e contenção de CPU mantendo throughput máximo estável.',
    validationRules: [
      { id: 'rule-worker-all', type: 'contains', target: 'Promise.all(trabalhadores)', description: 'Sincronização dos trabalhadores com Promise.all' },
      { id: 'rule-min-workers', type: 'contains', target: 'Math.min(limiteConcorrencia', description: 'Controle da quantidade máxima de concorrência' }
    ]
  }
];

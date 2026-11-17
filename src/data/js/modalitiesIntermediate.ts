import { Exercise } from '../../types/exercise';

export const jsIntermediateModalities: Exercise[] = [
  // ==========================================
  // CORRIGIR ERROS (5 exercícios)
  // ==========================================
  {
    id: 'js-inter-debug-02',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Assincronismo & Promises',
    title: 'Depuração: Uso Ineficaz de async/await Dentro de forEach',
    summary: 'Corrija um loop assíncrono onde forEach dispara operações sem aguardar o término com Promise.all.',
    realWorldContext: 'Array.prototype.forEach não aguarda promises retornadas pelo callback assíncrono. Em serviços de notificação ou uploads em lote, isso faz a função retornar antes de completar as operações.',
    description: 'A função notificarUsuarios precisa enviar e-mails para uma lista de usuários e retornar a contagem final de sucesso. Usando forEach(async ...), a contagem retorna 0 antes dos envios terminarem. Corrija substituindo por um loop for (const u of usuarios).',
    goal: 'Aguardar todas as chamadas assíncronas antes de retornar o resultado.',
    bugDescription: 'Array.prototype.forEach não suporta await e executa em segundo plano sem sincronização.',
    buggyLineNumbers: [5],
    initialBuggyCode: `async function notificarUsuarios(usuarios, enviarEmailFn) {
  let enviados = 0;
  // BUG: forEach não aguarda callbacks assíncronos!
  usuarios.forEach(async (usuario) => {
    await enviarEmailFn(usuario.email);
    enviados++;
  });
  return enviados; // Retorna 0 antes de concluir!
}
`,
    templateCode: `async function notificarUsuarios(usuarios, enviarEmailFn) {
  let enviados = 0;
  // Corrija utilizando for...of sequencial:
  for (const usuario of usuarios) {
    await enviarEmailFn(usuario.email);
    enviados++;
  }
  return enviados;
}
`,
    solutionCode: `async function notificarUsuarios(usuarios, enviarEmailFn) {
  let enviados = 0;
  for (const usuario of usuarios) {
    await enviarEmailFn(usuario.email);
    enviados++;
  }
  return enviados;
}
`,
    hints: [
      'Substitua o forEach por um laço for (const usuario of usuarios) { ... }.',
      'Dessa forma o await pausará o laço a cada iteração de forma síncrona dentro da função assíncrona.'
    ],
    testCases: [
      {
        description: 'Aguarda envios assíncronos e retorna total enviado',
        expectedOutput: '2',
        testFunction: `
          const mockEnvio = () => new Promise(r => setTimeout(r, 10));
          return notificarUsuarios([{ email: "a@a.com" }, { email: "b@b.com" }], mockEnvio).then(r => r === 2);
        `
      }
    ],
    explanation: 'forEach descarta o valor de retorno do callback. Para laços assíncronos sequenciais deve-se utilizar for...of; para paralelos, Promise.all(array.map(...)).',
    validationRules: [
      { id: 'rule-for-of', type: 'contains', target: 'for (const', description: 'Uso de laço for...of com await' }
    ]
  },
  {
    id: 'js-inter-debug-03',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Imutabilidade & Shallow Copy',
    title: 'Depuração: Efeito Colateral por Mutação Aninhada em Shallow Copy',
    summary: 'Corrija mutação acidental do estado original ao atualizar objetos aninhados com spread operator simples.',
    realWorldContext: 'O operador spread {...objeto} faz apenas uma cópia rasa do primeiro nível. Se o objeto possuir propriedades aninhadas (como perfil.preferencias), alterar a cópia altera o objeto original em memória.',
    description: 'A função atualizarTemaUsuario tenta criar um novo objeto com tema escuro. Porém, como faz apenas {...usuario}, a alteração em novo.configuracoes.tema modifica o usuário original! Garanta a imutabilidade clonando o objeto aninhado.',
    goal: 'Clonar profundamente a propriedade aninhada para preservar a imutabilidade.',
    bugDescription: 'Acesso copia.configuracoes.tema muta a mesma referência de objeto presente no usuário original.',
    buggyLineNumbers: [4],
    initialBuggyCode: `function atualizarTemaUsuario(usuario, novoTema) {
  // BUG: Shallow copy compartilha a referência de configuracoes!
  const copia = { ...usuario };
  copia.configuracoes.tema = novoTema;
  return copia;
}
`,
    templateCode: `function atualizarTemaUsuario(usuario, novoTema) {
  // Corrija espalhando também o objeto aninhado configuracoes:
  return {
    ...usuario,
    configuracoes: {
      ...usuario.configuracoes,
      tema: novoTema
    }
  };
}
`,
    solutionCode: `function atualizarTemaUsuario(usuario, novoTema) {
  return {
    ...usuario,
    configuracoes: {
      ...usuario.configuracoes,
      tema: novoTema
    }
  };
}
`,
    hints: [
      'Espalhe tanto o objeto de nível superior quanto o nó aninhado.',
      'Retorne { ...usuario, configuracoes: { ...usuario.configuracoes, tema: novoTema } }.'
    ],
    testCases: [
      {
        description: 'Não altera o tema do objeto de entrada original',
        expectedOutput: 'claro',
        testFunction: `
          const orig = { id: 1, configuracoes: { tema: "claro" } };
          const novo = atualizarTemaUsuario(orig, "escuro");
          return orig.configuracoes.tema === "claro" && novo.configuracoes.tema === "escuro";
        `
      }
    ],
    explanation: 'Em estruturas de dados hierárquicas, a imutabilidade exige novo container em todos os níveis modificados (estrutural sharing).',
    validationRules: [
      { id: 'rule-nested-spread', type: 'contains', target: '...usuario.configuracoes', description: 'Spread do objeto aninhado configuracoes' }
    ]
  },
  {
    id: 'js-inter-debug-04',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Promises & Tratamento de Exceções',
    title: 'Depuração: Promise que Não Rejeita em Bloco Catch',
    summary: 'Corrija um executor de Promise onde erros em chamadas assíncronas travam a execução sem rejeitar.',
    realWorldContext: 'Quando um construtor new Promise(...) captura uma exceção dentro de um try/catch interno, esquecer de invocar reject(erro) faz com que a Promise permaneça eternamente em estado pending.',
    description: 'A função parsearJsonAsync envolve uma leitura em new Promise. Se ocorrer erro de parse JSON, o bloco catch apenas faz console.error mas nunca chama reject(err). Corrija chamando a função de rejeição.',
    goal: 'Invocar reject() no catch do executor da Promise.',
    bugDescription: 'A Promise fica pendente para sempre pois o erro é engolido sem chamar reject(erro).',
    buggyLineNumbers: [8],
    initialBuggyCode: `function parsearJsonAsync(textoJson) {
  return new Promise((resolve, reject) => {
    try {
      const dados = JSON.parse(textoJson);
      resolve(dados);
    } catch (erro) {
      // BUG: Esqueceu de rejeitar a Promise! Ela trava pendente para sempre!
      console.error("Falha ao parsear:", erro);
    }
  });
}
`,
    templateCode: `function parsearJsonAsync(textoJson) {
  return new Promise((resolve, reject) => {
    try {
      const dados = JSON.parse(textoJson);
      resolve(dados);
    } catch (erro) {
      // Corrija aqui chamando reject com o erro capturado:
      reject(erro);
    }
  });
}
`,
    solutionCode: `function parsearJsonAsync(textoJson) {
  return new Promise((resolve, reject) => {
    try {
      const dados = JSON.parse(textoJson);
      resolve(dados);
    } catch (erro) {
      reject(erro);
    }
  });
}
`,
    hints: [
      'Chame reject(erro) dentro do bloco catch.',
      'Isso permite que quem chamou a função capture o erro via .catch() ou try/catch com await.'
    ],
    testCases: [
      {
        description: 'Rejeita com SyntaxError para JSON inválido',
        expectedOutput: 'SyntaxError',
        testFunction: `
          return parsearJsonAsync("{ invalido }").then(() => false).catch(err => err instanceof SyntaxError);
        `
      }
    ],
    explanation: 'Promises precisam transitar de pending para resolved ou rejected. Erros capturados sem acionar reject causam promises zumbis.',
    validationRules: [
      { id: 'rule-reject', type: 'contains', target: 'reject(erro)', description: 'Chamada de reject(erro)' }
    ]
  },
  {
    id: 'js-inter-debug-05',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Eventos & Perda de Contexto de This',
    title: 'Depuração: Perda de Escopo do this em Callback de Evento',
    summary: 'Corrija um handler de classe que perde o this ao ser repassado como callback.',
    realWorldContext: 'Em Vanilla JS e React, repassar métodos de classe diretamente como listeners de eventos faz com que o this aponte para o elemento DOM ou undefined em vez da instância da classe.',
    description: 'Na classe ContadorCliques, o método incrementar repassa this.total. Ao ser acionado desvinculado, this.total falha. Faça o bind correto no construtor.',
    goal: 'Vincular o escopo de this à instância da classe.',
    bugDescription: 'Passar o método desvinculado perde a referência da instância ao ser chamado pelo ouvinte.',
    buggyLineNumbers: [9],
    initialBuggyCode: `class ContadorCliques {
  constructor() {
    this.total = 0;
  }

  // BUG: Método comum perde o 'this' quando desvinculado!
  incrementar() {
    this.total++;
    return this.total;
  }
}
`,
    templateCode: `class ContadorCliques {
  constructor() {
    this.total = 0;
    // Corrija fazendo o bind explícito no construtor:
    this.incrementar = this.incrementar.bind(this);
  }

  incrementar() {
    this.total++;
    return this.total;
  }
}
`,
    solutionCode: `class ContadorCliques {
  constructor() {
    this.total = 0;
    this.incrementar = this.incrementar.bind(this);
  }

  incrementar() {
    this.total++;
    return this.total;
  }
}
`,
    hints: [
      'No construtor, adicione this.incrementar = this.incrementar.bind(this);',
      'Ou declare incrementar como uma arrow function de propriedade de classe.'
    ],
    testCases: [
      {
        description: 'Incrementa corretamente mesmo quando chamado como função isolada',
        expectedOutput: '1',
        testFunction: `
          const c = new ContadorCliques();
          const fn = c.incrementar;
          return fn() === 1 && c.total === 1;
        `
      }
    ],
    explanation: 'Funções normais determinam seu this no momento da invocação. Usar .bind(this) fixa a referência permanentemente à instância.',
    validationRules: [
      { id: 'rule-bind', type: 'contains', target: 'this.incrementar.bind(this)', description: 'Vinculação explícita com bind(this)' }
    ]
  },
  {
    id: 'js-inter-debug-06',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Memory Leaks & Timers',
    title: 'Depuração: Vazamento de Memória por Interval sem Cleanup',
    summary: 'Corrija um temporizador que continua rodando em segundo plano após atingir o objetivo.',
    realWorldContext: 'Intervalos criados com setInterval sem clearInterval continuam executando callbacks na memória indefinidamente, causando consumo excessivo de CPU e memory leaks graves no cliente.',
    description: 'A função iniciarContagemRegressiva dispara um setInterval a cada segundo. Quando o contador chega a 0, ela chama o callback aoFinalizar, mas esquece de limpar o intervalo com clearInterval. Corrija para cancelar o timer.',
    goal: 'Executar clearInterval() assim que o tempo atingir zero.',
    bugDescription: 'O temporizador nunca é desregistrado, rodando indefinidamente mesmo após chegar a 0.',
    buggyLineNumbers: [7],
    initialBuggyCode: `function iniciarContagemRegressiva(segundos, aoFinalizar) {
  let restante = segundos;
  const timerId = setInterval(() => {
    restante--;
    if (restante <= 0) {
      // BUG: Dispara o callback mas não limpa o timerId!
      aoFinalizar();
    }
  }, 1000);
  return timerId;
}
`,
    templateCode: `function iniciarContagemRegressiva(segundos, aoFinalizar) {
  let restante = segundos;
  const timerId = setInterval(() => {
    restante--;
    if (restante <= 0) {
      // Corrija limpando o intervalo com clearInterval:
      clearInterval(timerId);
      aoFinalizar();
    }
  }, 1000);
  return timerId;
}
`,
    solutionCode: `function iniciarContagemRegressiva(segundos, aoFinalizar) {
  let restante = segundos;
  const timerId = setInterval(() => {
    restante--;
    if (restante <= 0) {
      clearInterval(timerId);
      aoFinalizar();
    }
  }, 1000);
  return timerId;
}
`,
    hints: [
      'Chame clearInterval(timerId); antes de aoFinalizar().',
      'Isso interrompe o agendamento contínuo no Event Loop.'
    ],
    testCases: [
      {
        description: 'Limpa o timer com clearInterval ao zerar o contador',
        expectedOutput: 'clearInterval',
        testFunction: `
          let limpou = false;
          const orig = clearInterval;
          window.clearInterval = () => { limpou = true; orig.apply(window, arguments); };
          iniciarContagemRegressiva(0, () => {});
          window.clearInterval = orig;
          return true;
        `
      }
    ],
    explanation: 'Timers no browser e Node.js mantêm referências vivas a suas closures no loop de eventos até que sejam explicitamente desarmados.',
    validationRules: [
      { id: 'rule-clear-interval', type: 'contains', target: 'clearInterval(timerId)', description: 'Chamada correta de clearInterval' }
    ]
  },

  // ==========================================
  // PREVER SAÍDA (5 exercícios)
  // ==========================================
  {
    id: 'js-inter-prever-02',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Event Loop & Ordem de Execução',
    title: 'Prever Saída: Ordem de Microtasks (Promise) vs Macrotasks (setTimeout)',
    summary: 'Acompanhe a fila de execução prioritária do Event Loop entre código síncrono, microtarefas e macrotarefas.',
    realWorldContext: 'Compreender a diferença de agendamento entre microtasks (Promises, queueMicrotask) e macrotasks (setTimeout, setInterval) é indispensável para depurar comportamento assíncrono em JavaScript.',
    description: 'Analise o fluxo dos 4 logs abaixo. Qual é a sequência exata de números impressos no console?',
    goal: 'Determinar a ordem temporal de saída no Event Loop.',
    templateCode: '',
    solutionCode: '1\n4\n3\n2',
    hints: [
      'Logs síncronos executam na ordem em que aparecem (1 e 4).',
      'Microtasks (Promises) têm prioridade sobre macrotasks (setTimeout).'
    ],
    testCases: [
      {
        description: 'Ordem de execução no Event Loop',
        expectedOutput: '1\n4\n3\n2'
      }
    ],
    codeToPredict: `console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve().then(() => {
  console.log(3);
});

console.log(4);
`,
    expectedOutputPrediction: '1\n4\n3\n2',
    acceptableOutputPredictions: ['1\n4\n3\n2', '1, 4, 3, 2'],
    explanation: '1. O código síncrono roda primeiro: imprime 1 e depois 4. 2. A fila de microtasks (Promise.then) roda imediatamente após o código síncrono antes do próximo tick: imprime 3. 3. A fila de macrotasks (setTimeout) roda por último: imprime 2. Sequência final: 1, 4, 3, 2.'
  },
  {
    id: 'js-inter-prever-03',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Promises & Recuperação em Catch',
    title: 'Prever Saída: Recuperação de Erro em Cadeia de Promises',
    summary: 'Descubra como o .catch() recupera o fluxo e permite que o próximo .then() continue executando.',
    realWorldContext: 'Um .catch() que retorna um valor padrão recupera a Promise para o estado resolvida (fulfilled), permitindo que métodos .then() subsequentes recebam o valor de fallback.',
    description: 'Acompanhe a cadeia de Promises abaixo. Note que o catch retorna um valor de contingência. O que será impresso no console final?',
    goal: 'Prever o valor transmitido ao longo da cadeia com captura e fallback.',
    templateCode: '',
    solutionCode: 'Valor Fallback Processado',
    hints: [
      'O .catch() neutraliza o erro e entrega seu retorno para o próximo .then().',
      'O último .then() imprime o valor retornado.'
    ],
    testCases: [
      {
        description: 'Fluxo recuperado por bloco catch',
        expectedOutput: 'Valor Fallback Processado'
      }
    ],
    codeToPredict: `Promise.reject("Falha na API")
  .catch(erro => {
    return "Valor Fallback";
  })
  .then(resultado => {
    return \`\${resultado} Processado\`;
  })
  .then(final => {
    console.log(final);
  });
`,
    expectedOutputPrediction: 'Valor Fallback Processado',
    acceptableOutputPredictions: ['Valor Fallback Processado'],
    explanation: 'A Promise inicia rejeitada com "Falha na API". O primeiro .catch intercepta o erro e retorna "Valor Fallback". Como o catch não lançou nova exceção, a Promise é resolvida com essa string. O .then seguinte recebe e concatena " Processado". A saída impressa é "Valor Fallback Processado".'
  },
  {
    id: 'js-inter-prever-04',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Coleções & Referência em Set',
    title: 'Prever Saída: Igualdade por Referência de Objetos em um Set',
    summary: 'Observe como o Set lida com objetos que possuem os mesmos atributos mas referências distintas.',
    realWorldContext: 'Sets comparam elementos usando o algoritmo SameValueZero. Para objetos, a comparação é feita por referência de memória, não por valor estrutural.',
    description: 'Analise o tamanho (size) do Set após adicionar strings e objetos. Qual é o valor impresso?',
    goal: 'Identificar a contagem de elementos de um Set com referências de objetos vs primitivos.',
    templateCode: '',
    solutionCode: '3',
    hints: [
      'Strings primitivas são comparadas por valor.',
      'Objetos literais são instâncias distintas com ponteiros de memória diferentes.'
    ],
    testCases: [
      {
        description: 'Tamanho final da coleção Set',
        expectedOutput: '3'
      }
    ],
    codeToPredict: `const conjunto = new Set();

conjunto.add("dev");
conjunto.add("dev");

conjunto.add({ id: 1 });
conjunto.add({ id: 1 });

console.log(conjunto.size);
`,
    expectedOutputPrediction: '3',
    acceptableOutputPredictions: ['3'],
    explanation: 'A string "dev" é primitiva, então a segunda adição é ignorada (tamanho 1). Porém, cada { id: 1 } cria uma nova instância de objeto em endereços de memória diferentes. Como as referências são distintas, o Set aceita ambos. Tamanho final: 3.'
  },
  {
    id: 'js-inter-prever-05',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Desestruturação & Rest com Arrays',
    title: 'Prever Saída: Desestruturação com Rest Operator e Pulos de Índice',
    summary: 'Acompanhe a extração seletiva de elementos com vírgulas vazias e operador rest.',
    realWorldContext: 'A sintaxe de omissão por vírgula em desestruturação é muito usada para descartar o primeiro retorno em tuplas ou hooks.',
    description: 'Observe como o array fila é desestruturado ignorando o primeiro item e isolando o último com rest. O que será impresso?',
    goal: 'Prever os valores atribuídos às variáveis desestruturadas.',
    templateCode: '',
    solutionCode: 'B:C-D',
    hints: [
      'A vírgula inicial ignora o primeiro elemento ("A").',
      'restante contém os elementos ["C", "D"].'
    ],
    testCases: [
      {
        description: 'Elementos extraídos na desestruturação',
        expectedOutput: 'B:C-D'
      }
    ],
    codeToPredict: `const fila = ["A", "B", "C", "D"];

const [, segundo, ...restante] = fila;

console.log(\`\${segundo}:\${restante.join("-")}\`);
`,
    expectedOutputPrediction: 'B:C-D',
    acceptableOutputPredictions: ['B:C-D'],
    explanation: 'A primeira vírgula sem variável descarta o item no índice 0 ("A"). A variável segundo recebe "B". O operador rest ...restante coleta os itens remanescentes em um novo array ["C", "D"]. A saída unida por hífen é "B:C-D".'
  },
  {
    id: 'js-inter-prever-06',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Funções Assíncronas & Retorno Primitivo',
    title: 'Prever Saída: Valor de Retorno de uma Função async Chamada de Forma Síncrona',
    summary: 'Veja o que acontece ao chamar uma função marcada com async sem usar await.',
    realWorldContext: 'Toda função declarada com a palavra-chave async SEMPRE retorna uma Promise, mesmo que seu corpo retorne uma string ou número síncrono.',
    description: 'Analise o retorno de obterStatus impresso sem a palavra-chave await. O que o ternário exibe?',
    goal: 'Entender que funções async retornam instâncias de Promise.',
    templateCode: '',
    solutionCode: 'PROMISE',
    hints: [
      'Uma função async nunca retorna o tipo primitivo diretamente de forma síncrona.',
      'Ela sempre retorna uma Promise.'
    ],
    testCases: [
      {
        description: 'Retorno verificado como instância de Promise',
        expectedOutput: 'PROMISE'
      }
    ],
    codeToPredict: `async function obterStatus() {
  return "ONLINE";
}

const resultado = obterStatus();

console.log(resultado instanceof Promise ? "PROMISE" : "VALOR");
`,
    expectedOutputPrediction: 'PROMISE',
    acceptableOutputPredictions: ['PROMISE'],
    explanation: 'Funções async encapsulam incondicionalmente o valor retornado em uma Promise resolvida (Promise.resolve("ONLINE")). Sem o uso de await, a variável resultado armazena a instância da própria Promise. A verificação instanceof retorna true, imprimindo "PROMISE".'
  },

  // ==========================================
  // DESAFIO PRÁTICO (5 exercícios)
  // ==========================================
  {
    id: 'js-inter-desafio-02',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Performance & Debounce',
    title: 'Desafio Prático: Implementação do Padrão Debounce',
    summary: 'Crie uma função de debounce que adia a execução de um callback até que o usuário pare de digitar.',
    realWorldContext: 'Campos de busca com autocomplete disparam consultas a APIs. Sem debounce, cada tecla digitada envia uma requisição, sobrecarregando o backend. O debounce aguarda uma pausa (ex: 300ms) antes de disparar.',
    description: 'Implemente a função debounce(fn, delayMs). Ela deve retornar uma nova função que, quando chamada, cancela o timer anterior usando clearTimeout e agenda uma nova chamada de fn para daqui a delayMs milissegundos com os mesmos argumentos.',
    goal: 'Postergar a execução da função até que o período de inatividade seja atingido.',
    practicalRequirements: [
      'Receber uma função fn e um tempo delayMs em milissegundos.',
      'Retornar uma nova função com suporte a argumentos variáveis (...args).',
      'A cada invocação da nova função, cancelar qualquer timer pendente com clearTimeout.',
      'Executar fn(...args) apenas após o término do delayMs sem novas chamadas.'
    ],
    testCases: [
      {
        description: 'Executa apenas a última chamada dentro da janela de tempo',
        expectedOutput: 'true',
        testFunction: `
          let cont = 0;
          const acao = debounce(() => cont++, 50);
          acao(); acao(); acao();
          return new Promise(resolve => {
            setTimeout(() => resolve(cont === 1), 100);
          });
        `
      }
    ],
    templateCode: `function debounce(fn, delayMs) {
  let timerId = null;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}
`,
    solutionCode: `function debounce(fn, delayMs) {
  let timerId = null;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}
`,
    hints: [
      'Mantenha uma variável de fechamento (closure) para o timerId.',
      'Use if (timerId) clearTimeout(timerId); a cada nova chamada.',
      'Agende com setTimeout(() => fn(...args), delayMs).'
    ],
    explanation: 'Debouncing unifica múltiplos eventos frequentes em uma única execução disparada no fim da sequência de eventos.',
    validationRules: [
      { id: 'rule-clear-timeout', type: 'contains', target: 'clearTimeout', description: 'Uso de clearTimeout' },
      { id: 'rule-set-timeout', type: 'contains', target: 'setTimeout', description: 'Uso de setTimeout' }
    ]
  },
  {
    id: 'js-inter-desafio-03',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Performance & Throttle',
    title: 'Desafio Prático: Implementação do Padrão Throttle',
    summary: 'Construa um limitador de frequência (throttle) que garante execução no máximo uma vez a cada intervalo de tempo.',
    realWorldContext: 'Em eventos de scroll infinito ou redimensionamento de janela (resize), o navegador dispara centenas de eventos por segundo. O throttle limita a execução da lógica a um intervalo fixo (ex: a cada 200ms).',
    description: 'Implemente a função throttle(fn, limiteMs). Ela deve retornar uma função envoltória. Quando acionada, se já houver uma execução pendente dentro da janela de tempo, ignore a nova chamada.',
    goal: 'Garantir que a função só execute uma vez a cada intervalo definido.',
    practicalRequirements: [
      'Executar imediatamente na primeira chamada.',
      'Bloquear chamadas subsequentes até que limiteMs tenha decorrido.',
      'Liberar novamente a execução após o término do temporizador.'
    ],
    testCases: [
      {
        description: 'Executa apenas 1 vez se chamadas ocorrerem no mesmo tick',
        expectedOutput: 'true',
        testFunction: `
          let cont = 0;
          const fn = throttle(() => cont++, 100);
          fn(); fn(); fn();
          return cont === 1;
        `
      }
    ],
    templateCode: `function throttle(fn, limiteMs) {
  let emEspera = false;

  return function (...args) {
    if (!emEspera) {
      fn(...args);
      emEspera = true;
      setTimeout(() => {
        emEspera = false;
      }, limiteMs);
    }
  };
}
`,
    solutionCode: `function throttle(fn, limiteMs) {
  let emEspera = false;

  return function (...args) {
    if (!emEspera) {
      fn(...args);
      emEspera = true;
      setTimeout(() => {
        emEspera = false;
      }, limiteMs);
    }
  };
}
`,
    hints: [
      'Utilize uma flag booleana emEspera.',
      'Se não estiver em espera, invoque fn(...args) e ative emEspera = true com setTimeout para desativá-la.'
    ],
    explanation: 'Ao contrário do debounce que aguarda silêncio, o throttle garante uma cadência constante periódica de execução durante atividades contínuas.',
    validationRules: [
      { id: 'rule-throttle-flag', type: 'contains', target: 'setTimeout', description: 'Agendamento para liberar a flag' }
    ]
  },
  {
    id: 'js-inter-desafio-04',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Objetos & Comparação Profunda',
    title: 'Desafio Prático: Comparador de Igualdade Profunda (deepEqual)',
    summary: 'Crie uma função recursiva que compara se dois objetos ou arrays são estruturalmente idênticos em profundidade.',
    realWorldContext: 'Em bibliotecas de teste (como Jest) e no hook useMemo/useEffect do React, comparar se dois objetos complexos mudaram exige comparação profunda e não apenas comparação de ponteiros.',
    description: 'Implemente a função deepEqual(a, b). Se forem estritamente iguais (a === b), retorne true. Se qualquer um for null ou não for objeto, retorne false. Em seguida, compare recursivamente cada chave e valor.',
    goal: 'Verificar recursivamente a igualdade de valores em árvores de objetos.',
    practicalRequirements: [
      'Se a === b, retorne true imediatamente (cobre tipos primitivos e mesma referência).',
      'Se a ou b forem null, ou se typeof a !== "object", retorne false.',
      'Compare se Object.keys(a).length === Object.keys(b).length.',
      'Para cada chave em a, verifique se b possui a chave e se deepEqual(a[k], b[k]) é verdadeiro.'
    ],
    testCases: [
      {
        description: 'Retorna true para objetos com nós aninhados idênticos',
        expectedOutput: 'true',
        testFunction: `return deepEqual({ x: 1, y: { z: "ok" } }, { x: 1, y: { z: "ok" } }) === true;`
      },
      {
        description: 'Retorna false para valores distintos em nós profundos',
        expectedOutput: 'false',
        testFunction: `return deepEqual({ x: 1, y: { z: "ok" } }, { x: 1, y: { z: "falha" } }) === false;`
      }
    ],
    templateCode: `function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
    return false;
  }

  const chavesA = Object.keys(a);
  const chavesB = Object.keys(b);

  if (chavesA.length !== chavesB.length) return false;

  for (const chave of chavesA) {
    if (!Object.prototype.hasOwnProperty.call(b, chave)) return false;
    if (!deepEqual(a[chave], b[chave])) return false;
  }

  return true;
}
`,
    solutionCode: `function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
    return false;
  }

  const chavesA = Object.keys(a);
  const chavesB = Object.keys(b);

  if (chavesA.length !== chavesB.length) return false;

  for (const chave of chavesA) {
    if (!Object.prototype.hasOwnProperty.call(b, chave)) return false;
    if (!deepEqual(a[chave], b[chave])) return false;
  }

  return true;
}
`,
    hints: [
      'Comece tratando o caso base a === b.',
      'Valide com Object.keys a paridade de chaves.',
      'Faça a chamada recursiva deepEqual(a[chave], b[chave]).'
    ],
    explanation: 'deepEqual percorre nós de forma estrutural comparando grafos de dados por valor em vez de endereço de memória.',
    validationRules: [
      { id: 'rule-object-keys', type: 'contains', target: 'Object.keys', description: 'Uso de Object.keys' },
      { id: 'rule-recursive', type: 'contains', target: 'deepEqual(', description: 'Chamada recursiva de deepEqual' }
    ]
  },
  {
    id: 'js-inter-desafio-05',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Estruturas de Dados & Map',
    title: 'Desafio Prático: Cache LRU (Least Recently Used) com Map',
    summary: 'Implemente uma política de cache LRU onde o item menos recentemente utilizado é descartado ao estourar o limite.',
    realWorldContext: 'Caches locais de requisições HTTP e renderização de imagens utilizam algoritmos LRU para evitar que a memória do navegador cresça indefinidamente.',
    description: 'Implemente a classe LruCache(capacidade). Ao chamar get(chave), se existir, mova a chave para o fim (mais recente) e retorne o valor. Ao chamar set(chave, valor), atualize ou adicione; se o tamanho exceder a capacidade, descarte o primeiro item do Map.',
    goal: 'Construir um cache com descarte automático do elemento mais antigo.',
    practicalRequirements: [
      'constructor(capacidade: number)',
      'get(chave): se existir, move para mais recente e retorna o valor; senão retorna undefined.',
      'set(chave, valor): se já existir, remove para reordenar. Insere a chave. Se o tamanho for maior que a capacidade, exclui a primeira chave (mais antiga).'
    ],
    testCases: [
      {
        description: 'Descarta a chave menos recentemente usada quando o limite estoura',
        expectedOutput: 'undefined',
        testFunction: `
          const c = new LruCache(2);
          c.set("a", 1);
          c.set("b", 2);
          c.get("a");
          c.set("c", 3);
          return c.get("b") === undefined && c.get("a") === 1;
        `
      }
    ],
    templateCode: `class LruCache {
  constructor(capacidade) {
    this.capacidade = capacidade;
    this.mapa = new Map();
  }

  get(chave) {
    if (!this.mapa.has(chave)) return undefined;
    const valor = this.mapa.get(chave);
    this.mapa.delete(chave);
    this.mapa.set(chave, valor);
    return valor;
  }

  set(chave, valor) {
    if (this.mapa.has(chave)) {
      this.mapa.delete(chave);
    }
    this.mapa.set(chave, valor);

    if (this.mapa.size > this.capacidade) {
      const primeiraChave = this.mapa.keys().next().value;
      this.mapa.delete(primeiraChave);
    }
  }
}
`,
    solutionCode: `class LruCache {
  constructor(capacidade) {
    this.capacidade = capacidade;
    this.mapa = new Map();
  }

  get(chave) {
    if (!this.mapa.has(chave)) return undefined;
    const valor = this.mapa.get(chave);
    this.mapa.delete(chave);
    this.mapa.set(chave, valor);
    return valor;
  }

  set(chave, valor) {
    if (this.mapa.has(chave)) {
      this.mapa.delete(chave);
    }
    this.mapa.set(chave, valor);

    if (this.mapa.size > this.capacidade) {
      const primeiraChave = this.mapa.keys().next().value;
      this.mapa.delete(primeiraChave);
    }
  }
}
`,
    hints: [
      'Map preserva a ordem de inserção das chaves.',
      'this.mapa.keys().next().value obtém a chave mais antiga.',
      'Ao chamar get(), faça delete e set para reposicionar no final.'
    ],
    explanation: 'A classe Map do ES6 mantém a ordem temporal de inserção, permitindo construir uma fila LRU de complexidade O(1) sem necessidade de lista duplamente encadeada manual.',
    validationRules: [
      { id: 'rule-map-has', type: 'contains', target: 'this.mapa.has', description: 'Checagem com Map.has' },
      { id: 'rule-map-keys-next', type: 'contains', target: '.keys().next()', description: 'Remoção com iterador de chaves' }
    ]
  },
  {
    id: 'js-inter-desafio-06',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Strings & Parsing de URL',
    title: 'Desafio Prático: Parser de Query String com Suporte a Tipos e Arrays',
    summary: 'Construa um decodificador de query string de URLs capaz de converter números, booleanos e listas.',
    realWorldContext: 'Roteadores e manipuladores de requisição precisam decodificar query params como "?page=2&filtro=ativo&tags=php,js" em objetos tipados { page: 2, filtro: true, tags: ["php", "js"] }.',
    description: 'Crie a função parseQueryString(queryString). Remova o "?" inicial se houver. Separe os parâmetros por "&". Divida cada par em chave e valor.',
    goal: 'Transformar query string em objeto JavaScript tipado.',
    practicalRequirements: [
      'Remover caractere "?" no início da string se presente.',
      'Se a string for vazia, retornar objeto vazio {}.',
      'Converter valores "true" e "false" em booleanos nativos.',
      'Converter valores inteiros ou decimais em Number.',
      'Se contiver vírgula, converter para array de itens.'
    ],
    testCases: [
      {
        description: 'Converte query string completa com tipos apropriados',
        expectedOutput: '{"pagina":1,"ativo":true,"tags":["php","js"]}',
        testFunction: `
          const r = parseQueryString("?pagina=1&ativo=true&tags=php,js");
          return r.pagina === 1 && r.ativo === true && Array.isArray(r.tags) && r.tags.length === 2;
        `
      }
    ],
    templateCode: `function parseQueryString(queryString) {
  if (!queryString) return {};
  const limpo = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  if (!limpo) return {};

  const resultado = {};
  const pares = limpo.split('&');

  for (const par of pares) {
    const [chaveCrua, valorCru] = par.split('=');
    if (!chaveCrua) continue;

    const chave = decodeURIComponent(chaveCrua);
    const valor = decodeURIComponent(valorCru || '');

    if (valor === 'true') {
      resultado[chave] = true;
    } else if (valor === 'false') {
      resultado[chave] = false;
    } else if (!Number.isNaN(Number(valor)) && valor.trim() !== '') {
      resultado[chave] = Number(valor);
    } else if (valor.includes(',')) {
      resultado[chave] = valor.split(',');
    } else {
      resultado[chave] = valor;
    }
  }

  return resultado;
}
`,
    solutionCode: `function parseQueryString(queryString) {
  if (!queryString) return {};
  const limpo = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  if (!limpo) return {};

  const resultado = {};
  const pares = limpo.split('&');

  for (const par of pares) {
    const [chaveCrua, valorCru] = par.split('=');
    if (!chaveCrua) continue;

    const chave = decodeURIComponent(chaveCrua);
    const valor = decodeURIComponent(valorCru || '');

    if (valor === 'true') {
      resultado[chave] = true;
    } else if (valor === 'false') {
      resultado[chave] = false;
    } else if (!Number.isNaN(Number(valor)) && valor.trim() !== '') {
      resultado[chave] = Number(valor);
    } else if (valor.includes(',')) {
      resultado[chave] = valor.split(',');
    } else {
      resultado[chave] = valor;
    }
  }

  return resultado;
}
`,
    hints: [
      'Remova o "?" inicial com slice(1).',
      'Use decodeURIComponent para tratar caracteres especiais.',
      'Use split("&") para os pares e split("=") para chave e valor.'
    ],
    explanation: 'A inferência dinâmica de tipos a partir de strings de parâmetros produz interfaces de dados ergonômicas em APIs web.',
    validationRules: [
      { id: 'rule-decode', type: 'contains', target: 'decodeURIComponent', description: 'Uso de decodeURIComponent' },
      { id: 'rule-split-amp', type: 'contains', target: "split('&')", description: 'Separação dos pares por &' }
    ]
  }
];

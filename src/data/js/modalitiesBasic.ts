import { Exercise } from '../../types/exercise';

export const jsBasicModalities: Exercise[] = [
  // ==========================================
  // CORRIGIR ERROS (5 exercícios)
  // ==========================================
  {
    id: 'js-basico-debug-02',
    language: 'javascript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Tipos & Validação Numérica',
    title: 'Depuração: Verificação Incorreta de NaN com Operador de Igualdade',
    summary: 'Corrija a verificação de valores inválidos usando Number.isNaN em vez de igualdade estrita.',
    realWorldContext: 'Em JavaScript, NaN é o único valor na linguagem que NÃO é estritamente igual a si mesmo (NaN === NaN é false). Comparar com === gera bugs silenciosos em cálculos financeiros e formulários.',
    description: 'A função calcularMedia deveria validar se uma nota numérica convertida é válida. O código atual usa nota === NaN, o que nunca retorna true. Substitua pelo método nativo confiável Number.isNaN(nota).',
    goal: 'Substituir nota === NaN por Number.isNaN(nota).',
    bugDescription: 'Comparar diretamente com NaN com "===" sempre resulta em false.',
    buggyLineNumbers: [6],
    initialBuggyCode: `function calcularMedia(notas) {
  let soma = 0;
  for (const item of notas) {
    const nota = Number(item);
    // BUG: NaN === NaN é SEMPRE false em JavaScript!
    if (nota === NaN) {
      return null;
    }
    soma += nota;
  }
  return Number((soma / notas.length).toFixed(2));
}
`,
    templateCode: `function calcularMedia(notas) {
  let soma = 0;
  for (const item of notas) {
    const nota = Number(item);
    // Corrija aqui usando Number.isNaN
    if (Number.isNaN(nota)) {
      return null;
    }
    soma += nota;
  }
  return Number((soma / notas.length).toFixed(2));
}
`,
    solutionCode: `function calcularMedia(notas) {
  let soma = 0;
  for (const item of notas) {
    const nota = Number(item);
    if (Number.isNaN(nota)) {
      return null;
    }
    soma += nota;
  }
  return Number((soma / notas.length).toFixed(2));
}
`,
    hints: [
      'Em JavaScript utilize Number.isNaN(valor) para checar se o resultado é NaN.',
      'Nunca compare valor === NaN diretamente.'
    ],
    testCases: [
      {
        description: 'Retorna null quando há item inválido na lista',
        expectedOutput: 'null',
        testFunction: `return calcularMedia([10, "invalido", 8]) === null;`
      }
    ],
    explanation: 'NaN possui a particularidade na especificação ECMAScript (IEEE 754) de nunca ser igual a nenhum valor, nem mesmo a si próprio. Number.isNaN() avalia corretamente.',
    validationRules: [
      { id: 'rule-is-nan', type: 'contains', target: 'Number.isNaN', description: 'Uso de Number.isNaN' }
    ]
  },
  {
    id: 'js-basico-debug-03',
    language: 'javascript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Arrays & Métodos Mutáveis',
    title: 'Depuração: Sobrescrita de Array pelo Retorno do push()',
    summary: 'Corrija um erro comum onde o array é substituído pelo novo tamanho numérico retornado por push().',
    realWorldContext: 'O método Array.prototype.push() adiciona itens ao fim do array e retorna o novo número total de elementos (length), e NÃO o array. Atribuir lista = lista.push() converte o array em número.',
    description: 'Na função adicionarNotificacao, o desenvolvedor fez copia = copia.push(novaMsg). Isso transforma a variável em um número inteiro! Corrija para invocar copia.push(novaMsg) sem reatribuir.',
    goal: 'Invocar push() sem reatribuir a variável ao seu retorno.',
    bugDescription: 'copia = copia.push() sobrescreve o array com o novo length numérico.',
    buggyLineNumbers: [4],
    initialBuggyCode: `function adicionarNotificacao(mensagens, novaMsg) {
  let copia = [...mensagens];
  // BUG: push() retorna o length numérico, sobrescrevendo a cópia!
  copia = copia.push(novaMsg);
  return copia;
}
`,
    templateCode: `function adicionarNotificacao(mensagens, novaMsg) {
  const copia = [...mensagens];
  // Corrija chamando copia.push sem reatribuir:
  copia.push(novaMsg);
  return copia;
}
`,
    solutionCode: `function adicionarNotificacao(mensagens, novaMsg) {
  const copia = [...mensagens];
  copia.push(novaMsg);
  return copia;
}
`,
    hints: [
      'Chame copia.push(novaMsg); como uma instrução separada sem sinal de atribuição =.',
      'O retorno de push é um número, por isso a reatribuição quebrava a função.'
    ],
    testCases: [
      {
        description: 'Adiciona item preservando o array',
        expectedOutput: '["Alerta 1", "Alerta 2"]',
        testFunction: `
          const r = adicionarNotificacao(["Alerta 1"], "Alerta 2");
          return Array.isArray(r) && r.length === 2 && r[1] === "Alerta 2";
        `
      }
    ],
    explanation: 'Métodos mutáveis como push, pop, shift e unshift alteram o array no lugar (in-place) e retornam o length ou o elemento removido, nunca a nova coleção.',
    validationRules: [
      { id: 'rule-push', type: 'contains', target: 'copia.push', description: 'Chamada direta de copia.push' }
    ]
  },
  {
    id: 'js-basico-debug-04',
    language: 'javascript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Tipos & Concatenação Acidental',
    title: 'Depuração: Concatenação de Strings em Vez de Soma Aritmética',
    summary: 'Corrija soma em carrinho onde números recebidos como string são concatenados como texto.',
    realWorldContext: 'Valores vindos de inputs HTML chegam ao JavaScript no evento onChange como strings ("25.50"). O operador + concatena em vez de somar se não houver conversão explícita.',
    description: 'A função calcularTotalCarrinho recebe uma lista de produtos e acumula os subtotais. Como o preço unitário vem como string da API, total += item.preco gera strings longas em vez da soma real. Converta para Number(item.preco) antes de somar.',
    goal: 'Converter valores para Number para garantir soma numérica.',
    bugDescription: 'Preços em formato string causam concatenação textual com o operador +.',
    buggyLineNumbers: [5],
    initialBuggyCode: `function calcularTotalCarrinho(itens) {
  let total = 0;
  for (const item of itens) {
    // BUG: item.preco é string, causando concatenação textual
    total += item.preco;
  }
  return total;
}
`,
    templateCode: `function calcularTotalCarrinho(itens) {
  let total = 0;
  for (const item of itens) {
    // Corrija convertendo item.preco explicitamente para Number:
    total += Number(item.preco);
  }
  return total;
}
`,
    solutionCode: `function calcularTotalCarrinho(itens) {
  let total = 0;
  for (const item of itens) {
    total += Number(item.preco);
  }
  return total;
}
`,
    hints: [
      'Utilize Number(item.preco) antes de somar.',
      'Certifique-se de que o total acumule números reais.'
    ],
    testCases: [
      {
        description: 'Soma valores numéricos a partir de strings',
        expectedOutput: '30',
        testFunction: `return calcularTotalCarrinho([{ preco: "10" }, { preco: "20" }]) === 30;`
      }
    ],
    explanation: 'O operador + é sobrecarregado em JS: se qualquer operando for string, ele atua como concatenador de texto. A conversão explícita com Number() assegura a operação aritmética.',
    validationRules: [
      { id: 'rule-number-cast', type: 'contains', target: 'Number(item.preco)', description: 'Conversão explícita com Number()' }
    ]
  },
  {
    id: 'js-basico-debug-05',
    language: 'javascript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Objetos & Optional Chaining',
    title: 'Depuração: TypeError ao Acessar Propriedade Aninhada Indefinida',
    summary: 'Previna erros "Cannot read properties of undefined" com encadeamento opcional (?.) e fallback.',
    realWorldContext: 'Respostas de APIs podem omitir nós secundários (como endereço ou perfil de usuário). Acessar usuario.endereco.cidade dispara TypeError fatal se endereco for nulo ou omitido.',
    description: 'A função obterCidadeCliente quebra quando o cliente não possui o nó endereco. Utilize optional chaining cliente?.endereco?.cidade com fallback de operador de coalescência nula ?? "Não informada".',
    goal: 'Usar optional chaining e nullish coalescing para evitar crash por propriedade inexistente.',
    bugDescription: 'Acesso direto a cliente.endereco.cidade falha com TypeError quando endereco é undefined.',
    buggyLineNumbers: [3],
    initialBuggyCode: `function obterCidadeCliente(cliente) {
  // BUG: Dispara TypeError se endereco for undefined!
  return cliente.endereco.cidade;
}
`,
    templateCode: `function obterCidadeCliente(cliente) {
  // Corrija utilizando encadeamento opcional (?.) e coalescência nula (??):
  return cliente?.endereco?.cidade ?? "Não informada";
}
`,
    solutionCode: `function obterCidadeCliente(cliente) {
  return cliente?.endereco?.cidade ?? "Não informada";
}
`,
    hints: [
      'Substitua os pontos por ?. para checar cliente?.endereco?.cidade.',
      'Adicione ?? "Não informada" para quando a cidade não estiver definida.'
    ],
    testCases: [
      {
        description: 'Retorna fallback amigável quando nó aninhado falta',
        expectedOutput: 'Não informada',
        testFunction: `return obterCidadeCliente({ nome: "Erick" }) === "Não informada";`
      }
    ],
    explanation: 'O encadeamento opcional (?.) curto-circuita a navegação retornando undefined sem estourar TypeError caso o nó intermediário seja null ou undefined.',
    validationRules: [
      { id: 'rule-chaining', type: 'contains', target: '?.', description: 'Uso de encadeamento opcional ?.' },
      { id: 'rule-coalesce', type: 'contains', target: '??', description: 'Uso de nullish coalescing ??' }
    ]
  },
  {
    id: 'js-basico-debug-06',
    language: 'javascript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Funções & Retorno Ausente',
    title: 'Depuração: Retorno Ausente em Bloco de Arrow Function com Chaves',
    summary: 'Corrija arrow functions com chaves {} que retornam undefined por falta da palavra-chave return.',
    realWorldContext: 'Arrow functions com corpo de bloco { ... } exigem a palavra-chave return explícita. Omitir o return faz com que a função retorne undefined, quebrando métodos como map() e filter().',
    description: 'A função dobrarValores deveria transformar uma lista de números dobrando cada item. No entanto, por ter chaves sem return, ela está gerando um array de [undefined, undefined]. Adicione o return explícito.',
    goal: 'Adicionar return explícito no corpo da arrow function.',
    bugDescription: 'Corpo da arrow function possui chaves mas não possui declaração return, resultando em undefined.',
    buggyLineNumbers: [3],
    initialBuggyCode: `function dobrarValores(numeros) {
  // BUG: Arrow function com chaves sem a instrução return!
  return numeros.map(num => {
    num * 2;
  });
}
`,
    templateCode: `function dobrarValores(numeros) {
  // Corrija retornando o valor explicitamente:
  return numeros.map(num => {
    return num * 2;
  });
}
`,
    solutionCode: `function dobrarValores(numeros) {
  return numeros.map(num => {
    return num * 2;
  });
}
`,
    hints: [
      'Adicione a instrução return antes de num * 2.',
      'Arrow functions com chaves exigem a declaração return explícita.'
    ],
    testCases: [
      {
        description: 'Dobra valores do array corretamente',
        expectedOutput: '[4, 10, 16]',
        testFunction: `
          const r = dobrarValores([2, 5, 8]);
          return JSON.stringify(r) === "[4,10,16]";
        `
      }
    ],
    explanation: 'Arrow functions possuem retorno implícito apenas quando seu corpo é uma expressão direta sem chaves. Ao abrir chaves {}, a palavra-chave return se torna obrigatória.',
    validationRules: [
      { id: 'rule-return-or-expr', type: 'contains', target: 'return num * 2', description: 'Instrução return dentro do map' }
    ]
  },

  // ==========================================
  // PREVER SAÍDA (5 exercícios)
  // ==========================================
  {
    id: 'js-basico-prever-02',
    language: 'javascript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Tipos & Typeof Primitivos',
    title: 'Prever Saída: Comportamento de typeof com null, undefined e Array',
    summary: 'Identifique o resultado exato do operador typeof para tipos fundamentais em JavaScript.',
    realWorldContext: 'typeof null retornar "object" é um dos comportamentos históricos mais famosos do JavaScript. Saber identificar tipos reais previne erros de tipagem em runtime.',
    description: 'Analise as 3 operações com typeof abaixo. O que será impresso no console unido por barras verticais?',
    goal: 'Prever os valores retornados por typeof para null, array e undefined.',
    templateCode: '',
    solutionCode: 'object|object|undefined',
    hints: [
      'typeof null resulta em "object".',
      'typeof em um array também resulta em "object".'
    ],
    testCases: [
      {
        description: 'Verifica tipos avaliados por typeof',
        expectedOutput: 'object|object|undefined'
      }
    ],
    codeToPredict: `const a = typeof null;
const b = typeof [];
const c = typeof undefined;

console.log(\`\${a}|\${b}|\${c}\`);
`,
    expectedOutputPrediction: 'object|object|undefined',
    acceptableOutputPredictions: ['object|object|undefined'],
    explanation: 'Por razões históricas na implementação do JS, typeof null é "object". Arrays também são instâncias de Object, logo typeof [] é "object". Já typeof undefined é "undefined". Resultado: "object|object|undefined".'
  },
  {
    id: 'js-basico-prever-03',
    language: 'javascript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Operadores & Coerção Implícita',
    title: 'Prever Saída: Coerção Mista com Operadores + e -',
    summary: 'Descubra como o JavaScript alterna entre concatenação e cálculo matemático.',
    realWorldContext: 'O operador + prioriza concatenação quando um dos lados é string. Já o operador - força a conversão numérica de ambos os lados.',
    description: 'Analise a expressão matemática e textual abaixo. Qual é o valor impresso no console?',
    goal: 'Calcular a saída após avaliação sequencial com coerção de tipos.',
    templateCode: '',
    solutionCode: '100',
    hints: [
      'A primeira operação é uma concatenação de texto.',
      'A segunda operação força a subtração numérica.'
    ],
    testCases: [
      {
        description: 'Avaliação sequencial de operadores',
        expectedOutput: '100'
      }
    ],
    codeToPredict: `const res1 = "10" + 5;
const res2 = res1 - 5;

console.log(res2);
`,
    expectedOutputPrediction: '100',
    acceptableOutputPredictions: ['100'],
    explanation: '"10" + 5 gera a string "105" por concatenação textual. Em seguida, "105" - 5 força a conversão numérica da string "105" para o número 105, subtraindo 5 e resultando no número 100.'
  },
  {
    id: 'js-basico-prever-04',
    language: 'javascript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Operadores Lógicos || vs ??',
    title: 'Prever Saída: Diferença entre OR (||) e Coalescência Nula (??)',
    summary: 'Determine a diferença fundamental de comportamento com valores falsy como 0 e string vazia.',
    realWorldContext: 'O operador || considera qualquer valor falsy (0, "", false, null, undefined) como gatilho para o fallback. O operador ?? só aciona o fallback para null e undefined, preservando valores legítimos como 0 ou false.',
    description: 'Observe o tratamento da variável pontos = 0 com os operadores || e ??. Qual é a saída exata?',
    goal: 'Identificar a diferença de avaliação entre valores falsy e nulos.',
    templateCode: '',
    solutionCode: '10:0',
    hints: [
      'O operador || descarta o número 0 pois ele é falsy.',
      'O operador ?? mantém o número 0 pois ele não é null nem undefined.'
    ],
    testCases: [
      {
        description: 'Diferenciação entre falsy e nullish',
        expectedOutput: '10:0'
      }
    ],
    codeToPredict: `const pontos = 0;

const fallbackOu = pontos || 10;
const fallbackNullish = pontos ?? 10;

console.log(\`\${fallbackOu}:\${fallbackNullish}\`);
`,
    expectedOutputPrediction: '10:0',
    acceptableOutputPredictions: ['10:0'],
    explanation: '0 é considerado falsy pelo operador ||, portanto ele retorna o lado direito 10. Porém, 0 NÃO é nulo nem indefinido, então o operador ?? preserva o valor 0. A saída é "10:0".'
  },
  {
    id: 'js-basico-prever-05',
    language: 'javascript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Arrays & Imutabilidade com slice vs splice',
    title: 'Prever Saída: Mutação de Array com slice vs splice',
    summary: 'Veja o impacto de métodos que alteram o array original em relação aos métodos imutáveis.',
    realWorldContext: 'Em React e gerenciamento de estado moderno, mutar o array original diretamente via splice() causa bugs de renderização. Métodos imutáveis como slice() retornam novas instâncias.',
    description: 'Acompanhe a operação em frutas. Note que slice não altera o array, enquanto splice o altera. Qual é o tamanho final do array frutas e o item retornado?',
    goal: 'Prever a mutação sofrida pelo array original após splice().',
    templateCode: '',
    solutionCode: '3|2|Banana',
    hints: [
      'slice(1, 3) extrai 2 itens e não muta o array.',
      'splice(1, 1) remove 1 item e altera o array original, reduzindo length de 4 para 3.'
    ],
    testCases: [
      {
        description: 'Verifica mutação de array original',
        expectedOutput: '3|2|Banana'
      }
    ],
    codeToPredict: `const frutas = ["Maçã", "Banana", "Uva", "Laranja"];

const fatia = frutas.slice(1, 3);
const removidos = frutas.splice(1, 1);

console.log(\`\${frutas.length}|\${fatia.length}|\${removidos[0]}\`);
`,
    expectedOutputPrediction: '3|2|Banana',
    acceptableOutputPredictions: ['3|2|Banana'],
    explanation: 'frutas.slice(1, 3) retorna ["Banana", "Uva"] (length 2) sem alterar o array original. Em seguida, frutas.splice(1, 1) remove 1 elemento a partir do índice 1 ("Banana"), alterando frutas para 3 elementos (["Maçã", "Uva", "Laranja"]). A saída é "3|2|Banana".'
  },
  {
    id: 'js-basico-prever-06',
    language: 'javascript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Desestruturação com Renomeação e Default',
    title: 'Prever Saída: Desestruturação com Renomeação e Valores Padrão',
    summary: 'Acompanhe o mapeamento de propriedades com nomes alternativos e fallback em objetos.',
    realWorldContext: 'A desestruturação de parâmetros de configuração em bibliotecas modernas permite definir aliases de variáveis e valores de contingência em uma única linha legível.',
    description: 'Analise a desestruturação do objeto usuario. O que será exibido no console?',
    goal: 'Calcular os valores das variáveis resultantes da desestruturação.',
    templateCode: '',
    solutionCode: '42 - Erick Ricardo (Desenvolvedor)',
    hints: [
      'codigo recebe 42.',
      'cargo usa o fallback padrão "Desenvolvedor".'
    ],
    testCases: [
      {
        description: 'Variáveis renomeadas e com valor padrão',
        expectedOutput: '42 - Erick Ricardo (Desenvolvedor)'
      }
    ],
    codeToPredict: `const usuario = {
  id: 42,
  nomeCompleto: "Erick Ricardo"
};

const {
  id: codigo,
  nomeCompleto: nome,
  cargo = "Desenvolvedor"
} = usuario;

console.log(\`\${codigo} - \${nome} (\${cargo})\`);
`,
    expectedOutputPrediction: '42 - Erick Ricardo (Desenvolvedor)',
    acceptableOutputPredictions: ['42 - Erick Ricardo (Desenvolvedor)'],
    explanation: 'id é renomeado para codigo (valor 42). nomeCompleto é renomeado para nome ("Erick Ricardo"). cargo não existe no objeto original, então assume o valor padrão "Desenvolvedor". A saída final é "42 - Erick Ricardo (Desenvolvedor)".'
  },

  // ==========================================
  // DESAFIO PRÁTICO (5 exercícios)
  // ==========================================
  {
    id: 'js-basico-desafio-02',
    language: 'javascript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Strings & Regex',
    title: 'Desafio Prático: Gerador de Slug Amigável para URLs',
    summary: 'Construa uma função que transforma títulos com acentos e espaços em URLs amigáveis (slugs).',
    realWorldContext: 'Sistemas de blog e e-commerce precisam gerar URLs amigáveis como "/artigos/aprendendo-javascript-moderno" a partir do título digitado pelo usuário.',
    description: 'Crie a função gerarSlug(titulo) que recebe uma string, converte para minúsculas, remove acentos usando .normalize("NFD"), substitui espaços e caracteres especiais por um único hífen -, e remove hifens das pontas (trim).',
    goal: 'Retornar uma string formatada em padrão kebab-case sem acentos.',
    practicalRequirements: [
      'Deve converter o texto para minúsculas.',
      'Deve decompor e remover acentos diacríticos (ex: "é" vira "e", "ç" vira "c").',
      'Deve substituir espaços ou caracteres não alfanuméricos por hífens.',
      'Não deve conter múltiplos hífens consecutivos (ex: "---" vira "-").',
      'Não deve começar nem terminar com hífen.'
    ],
    testCases: [
      {
        description: 'Converte título com acentuação e espaços em slug limpo',
        expectedOutput: 'aprendendo-javascript-no-devpratica',
        testFunction: `return gerarSlug("Aprendendo JavaScript no DevPrática!") === "aprendendo-javascript-no-devpratica";`
      }
    ],
    templateCode: `function gerarSlug(titulo) {
  // Implemente a conversão:
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
`,
    solutionCode: `function gerarSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
`,
    hints: [
      'Normalize os acentos com .normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").',
      'Substitua qualquer caractere não alfanumérico por hífen com /[^a-z0-9]+/g.',
      'Remova hífens nas extremidades com /^-+|-+$/g.'
    ],
    explanation: 'A normalização Unicode NFD decompõe caracteres acentuados em caractere base + marca diacrítica, permitindo descartar marcas com regex com facilidade.',
    validationRules: [
      { id: 'rule-normalize', type: 'contains', target: 'normalize', description: 'Uso de normalize("NFD")' },
      { id: 'rule-lower', type: 'contains', target: 'toLowerCase', description: 'Uso de toLowerCase()' }
    ]
  },
  {
    id: 'js-basico-desafio-03',
    language: 'javascript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Segurança & Escapamento HTML',
    title: 'Desafio Prático: Sanitizador de Entidades HTML contra XSS',
    summary: 'Implemente uma função que escapa caracteres perigosos prevenindo injeções de script no navegador.',
    realWorldContext: 'Inserir dados fornecidos pelo usuário em nós HTML sem sanitizar permite que invasores injetem scripts maliciosos (<script>, alert, roubo de cookies) caracterizando ataques de Cross-Site Scripting (XSS).',
    description: 'Crie a função escaparHtml(str) que substitui os 5 caracteres críticos pelas suas entidades HTML correspondentes: & por &amp;, < por &lt;, > por &gt;, " por &quot; e \' por &#39;.',
    goal: 'Converter caracteres perigosos em entidades HTML seguras.',
    practicalRequirements: [
      'Substituir "&" por "&amp;" (deve ser o primeiro para evitar duplos escapes).',
      'Substituir "<" por "&lt;".',
      'Substituir ">" por "&gt;".',
      'Substituir \'"\' por "&quot;".',
      'Substituir "\'" por "&#39;".'
    ],
    testCases: [
      {
        description: 'Escapa tag script maliciosa',
        expectedOutput: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
        testFunction: `return escaparHtml('<script>alert("xss")</script>') === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';`
      }
    ],
    templateCode: `function escaparHtml(str) {
  const mapa = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, m => mapa[m]);
}
`,
    solutionCode: `function escaparHtml(str) {
  const mapa = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, m => mapa[m]);
}
`,
    hints: [
      'Você pode usar um mapa de caracteres com regex /[&<>"\']/g.',
      'Ou encadear substituições começando sempre pelo "&".'
    ],
    explanation: 'Escapar caracteres especiais impede o navegador de interpretar dados de entrada de usuários como marcação executável do DOM.',
    validationRules: [
      { id: 'rule-replace', type: 'contains', target: 'replace', description: 'Uso de replace' },
      { id: 'rule-amp', type: 'contains', target: '&amp;', description: 'Substituição por &amp;' }
    ]
  },
  {
    id: 'js-basico-desafio-04',
    language: 'javascript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Arrays & Agrupamento de Dados',
    title: 'Desafio Prático: Agrupamento de Transações Financeiras por Categoria',
    summary: 'Construa um agrupador de despesas utilizando reduce para consolidar relatórios contábeis.',
    realWorldContext: 'Dashboards financeiros precisam receber uma lista plana de despesas e agrupá-las por categorias (Alimentação, Moradia, Transporte) para renderizar gráficos e tabelas consolidadas.',
    description: 'Crie a função agruparPorCategoria(transacoes). Ela recebe um array de objetos { id, descricao, categoria, valor } e retorna um objeto onde cada chave é a categoria e o valor é a soma numérica total daquela categoria.',
    goal: 'Retornar um objeto de somatórios indexado pelas categorias.',
    practicalRequirements: [
      'A função deve utilizar Array.prototype.reduce().',
      'Se uma categoria não existir no acumulador, inicialize-a com 0.',
      'Some o valor de cada transação à respectiva categoria.',
      'Retorne o objeto agrupado com números arredondados ou inteiros.'
    ],
    testCases: [
      {
        description: 'Soma valores por categoria corretamente',
        expectedOutput: '{"Alimentação":150,"Transporte":50}',
        testFunction: `
          const t = [
            { id: 1, categoria: "Alimentação", valor: 100 },
            { id: 2, categoria: "Transporte", valor: 50 },
            { id: 3, categoria: "Alimentação", valor: 50 }
          ];
          const r = agruparPorCategoria(t);
          return r["Alimentação"] === 150 && r["Transporte"] === 50;
        `
      }
    ],
    templateCode: `function agruparPorCategoria(transacoes) {
  return transacoes.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + item.valor;
    return acc;
  }, {});
}
`,
    solutionCode: `function agruparPorCategoria(transacoes) {
  return transacoes.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + item.valor;
    return acc;
  }, {});
}
`,
    hints: [
      'Inicie o reduce com um objeto vazio {} como valor inicial.',
      'Faça acc[item.categoria] = (acc[item.categoria] || 0) + item.valor;'
    ],
    explanation: 'Array.prototype.reduce é o canivete suíço para transformação de matrizes planas em tabelas agregadas multidimensionais.',
    validationRules: [
      { id: 'rule-reduce', type: 'contains', target: 'reduce', description: 'Uso de Array.prototype.reduce' }
    ]
  },
  {
    id: 'js-basico-desafio-05',
    language: 'javascript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Datas & Cálculo Temporal',
    title: 'Desafio Prático: Calculadora de Dias Restantes até o Prazo',
    summary: 'Calcule a quantidade exata de dias inteiros entre duas datas no formato YYYY-MM-DD.',
    realWorldContext: 'Em sistemas de gerenciamento de tarefas e entregas (Jira, Trello), o cálculo de SLA e dias restantes para o prazo de entrega orienta a priorização da equipe.',
    description: 'Crie a função calcularDiasRestantes(dataInicial, dataFinal). Ambas chegam no formato "AAAA-MM-DD". A função deve converter as strings para Date, calcular a diferença em milissegundos, dividir pela quantidade de ms em um dia (1000 * 60 * 60 * 24) e retornar um número inteiro arredondado para baixo.',
    goal: 'Calcular a diferença de dias inteiros entre duas datas.',
    practicalRequirements: [
      'Receber dataInicial e dataFinal como strings (ex: "2026-03-01", "2026-03-10").',
      'Instanciar objetos new Date().',
      'Diferença calculada em milissegundos dividida por (1000 * 60 * 60 * 24).',
      'Retornar valor inteiro usando Math.floor().'
    ],
    testCases: [
      {
        description: 'Calcula 9 dias entre 01/03 e 10/03',
        expectedOutput: '9',
        testFunction: `return calcularDiasRestantes("2026-03-01", "2026-03-10") === 9;`
      }
    ],
    templateCode: `function calcularDiasRestantes(dataInicial, dataFinal) {
  const d1 = new Date(dataInicial);
  const d2 = new Date(dataFinal);
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.floor((d2 - d1) / msPorDia);
}
`,
    solutionCode: `function calcularDiasRestantes(dataInicial, dataFinal) {
  const d1 = new Date(dataInicial);
  const d2 = new Date(dataFinal);
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.floor((d2 - d1) / msPorDia);
}
`,
    hints: [
      'Subtrair dois objetos Date em JS calcula a diferença em milissegundos.',
      'Divida o resultado por 86.400.000 ms (1000 * 60 * 60 * 24).'
    ],
    explanation: 'Instâncias de Date em operações aritméticas são convertidas automaticamente para timestamp Unix em milissegundos via valueOf().',
    validationRules: [
      { id: 'rule-date', type: 'contains', target: 'new Date', description: 'Instanciação com new Date' },
      { id: 'rule-floor', type: 'contains', target: 'Math.floor', description: 'Arredondamento com Math.floor' }
    ]
  },
  {
    id: 'js-basico-desafio-06',
    language: 'javascript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Validação & Regex',
    title: 'Desafio Prático: Validador de E-mail Corporativo',
    summary: 'Crie uma função para validar sintaxe de e-mail e checar se pertence ao domínio autorizado da empresa.',
    realWorldContext: 'Sistemas corporativos B2B costumam restringir o cadastro e login exclusivamente para colaboradores que utilizem seus e-mails institucionais (ex: "@empresa.com.br").',
    description: 'Crie a função validarEmailCorporativo(email, dominioEsperado). Ela deve verificar se o e-mail possui formato sintático válido e se termina exatamente com @ seguido de dominioEsperado. Retorne true ou false.',
    goal: 'Validar sintaxe básica e pertencimento ao domínio informado.',
    practicalRequirements: [
      'Deve validar formato básico de e-mail (texto@dominio.extensao).',
      'Deve verificar se termina com "@" + dominioEsperado de forma case-insensitive.',
      'Deve retornar false se o e-mail for vazio ou formato inválido.'
    ],
    testCases: [
      {
        description: 'Aceita e-mail corporativo válido',
        expectedOutput: 'true',
        testFunction: `return validarEmailCorporativo("erick@empresa.com.br", "empresa.com.br") === true;`
      },
      {
        description: 'Rejeita e-mail público não corporativo',
        expectedOutput: 'false',
        testFunction: `return validarEmailCorporativo("erick@gmail.com", "empresa.com.br") === false;`
      }
    ],
    templateCode: `function validarEmailCorporativo(email, dominioEsperado) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!regex.test(email)) return false;

  return email.toLowerCase().endsWith("@" + dominioEsperado.toLowerCase());
}
`,
    solutionCode: `function validarEmailCorporativo(email, dominioEsperado) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!regex.test(email)) return false;

  return email.toLowerCase().endsWith("@" + dominioEsperado.toLowerCase());
}
`,
    hints: [
      'Valide o formato básico com regex.',
      'Utilize email.toLowerCase().endsWith("@" + dominioEsperado.toLowerCase()).'
    ],
    explanation: 'A validação combina checagem de estrutura RFC com verificação de sufixo corporativo usando endsWith.',
    validationRules: [
      { id: 'rule-ends-with', type: 'contains', target: 'endsWith', description: 'Uso de endsWith para conferir domínio' }
    ]
  }
];

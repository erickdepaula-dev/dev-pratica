import { TsExercise } from '../../types/exercise';

/**
 * Trilha TypeScript — modalidades do nível avançado:
 * 5 corrigir_erros, 5 prever_saida, 5 desafio_pratico.
 * IDs: `ts-avancado-<slug>` (checado pelo tipo TsExercise<'avancado'>).
 * Todo o código assume `strict: true`.
 */
export const tsAdvancedModalities: TsExercise<'avancado'>[] = [
  // ==========================================
  // CORRIGIR ERROS (5)
  // ==========================================
  {
    id: 'ts-avancado-debug-switch-nao-exaustivo',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Discriminated Unions',
    title: 'Depuração: Novo Caso Esquecido no Switch',
    summary: 'Um tipo novo foi adicionado à união e a checagem de exaustividade acusou o switch.',
    realWorldContext:
      'O time adicionou o frete "retirada" (retirar na loja). A checagem com never apontou o cálculo que ninguém lembrou de atualizar — antes que um cliente visse "NaN" no checkout.',
    description:
      'A união Frete ganhou o membro retirada. Trate esse caso no switch: retirada na loja custa 0. Não remova a checagem com never.',
    goal: 'Tratar o novo membro da união mantendo a checagem de exaustividade.',
    bugDescription: "Type '{ modo: \"retirada\"; loja: string; }' is not assignable to type 'never'.",
    buggyLineNumbers: [14],
    initialBuggyCode: `type Frete =
  | { modo: 'correios'; pesoKg: number }
  | { modo: 'motoboy'; distanciaKm: number }
  | { modo: 'retirada'; loja: string };

function custoFrete(f: Frete): number {
  switch (f.modo) {
    case 'correios':
      return 20 + f.pesoKg * 2;
    case 'motoboy':
      return 8 + f.distanciaKm * 1.5;
    default: {
      // Garante que todos os modos foram tratados
      const naoTratado: never = f;
      throw new Error('Frete desconhecido: ' + JSON.stringify(naoTratado));
    }
  }
}

console.log(custoFrete({ modo: 'retirada', loja: 'Centro' }));
`,
    templateCode: `type Frete =
  | { modo: 'correios'; pesoKg: number }
  | { modo: 'motoboy'; distanciaKm: number }
  | { modo: 'retirada'; loja: string };

function custoFrete(f: Frete): number {
  switch (f.modo) {
    case 'correios':
      return 20 + f.pesoKg * 2;
    case 'motoboy':
      return 8 + f.distanciaKm * 1.5;
    default: {
      // Garante que todos os modos foram tratados
      const naoTratado: never = f;
      throw new Error('Frete desconhecido: ' + JSON.stringify(naoTratado));
    }
  }
}

console.log(custoFrete({ modo: 'retirada', loja: 'Centro' }));
`,
    solutionCode: `type Frete =
  | { modo: 'correios'; pesoKg: number }
  | { modo: 'motoboy'; distanciaKm: number }
  | { modo: 'retirada'; loja: string };

function custoFrete(f: Frete): number {
  switch (f.modo) {
    case 'correios':
      return 20 + f.pesoKg * 2;
    case 'motoboy':
      return 8 + f.distanciaKm * 1.5;
    case 'retirada':
      return 0;
    default: {
      const naoTratado: never = f;
      throw new Error('Frete desconhecido: ' + JSON.stringify(naoTratado));
    }
  }
}

console.log(custoFrete({ modo: 'retirada', loja: 'Centro' }));
`,
    hints: [
      'A mensagem diz que um membro chegou ao default: qual?',
      'Adicione case "retirada": return 0; antes do default.',
    ],
    testCases: [
      { description: 'Retirada custa 0', expectedOutput: '0', testFunction: `return custoFrete({ modo: 'retirada', loja: 'Centro' }) === 0;` },
      { description: 'Correios continua igual', expectedOutput: '26', testFunction: `return custoFrete({ modo: 'correios', pesoKg: 3 }) === 26;` },
    ],
    explanation:
      'Esse erro é a checagem de exaustividade funcionando: o membro retirada chegava ao default, então f não era never. O conserto certo é tratar o caso — remover a linha com never apagaria o alarme para os próximos membros.',
    validationRules: [{ id: 'rule-never', type: 'contains', target: ': never', description: 'Mantém a checagem de exaustividade' }],
  },
  {
    id: 'ts-avancado-debug-chave-string',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'keyof & Indexed Access Types',
    title: 'Depuração: Indexando um Objeto com string Genérica',
    summary: 'Um objeto sem index signature é acessado com uma chave do tipo string.',
    realWorldContext:
      'Ordenar uma tabela pela coluna clicada é comum. Se a coluna for tipada como string, qualquer texto passa — inclusive colunas que não existem.',
    description:
      'valorDaColuna recebe coluna: string e faz linha[coluna], que não compila. Corrija o tipo do parâmetro para aceitar só as chaves de Linha.',
    goal: 'Usar keyof para tipar uma chave dinâmica.',
    bugDescription: "Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Linha'.",
    buggyLineNumbers: [8],
    initialBuggyCode: `interface Linha {
  produto: string;
  quantidade: number;
  preco: number;
}

function valorDaColuna(linha: Linha, coluna: string): string | number {
  return linha[coluna];
}

console.log(valorDaColuna({ produto: 'Mouse', quantidade: 2, preco: 80 }, 'preco'));
`,
    templateCode: `interface Linha {
  produto: string;
  quantidade: number;
  preco: number;
}

function valorDaColuna(linha: Linha, coluna: string): string | number {
  return linha[coluna];
}

console.log(valorDaColuna({ produto: 'Mouse', quantidade: 2, preco: 80 }, 'preco'));
`,
    solutionCode: `interface Linha {
  produto: string;
  quantidade: number;
  preco: number;
}

function valorDaColuna(linha: Linha, coluna: keyof Linha): string | number {
  return linha[coluna];
}

console.log(valorDaColuna({ produto: 'Mouse', quantidade: 2, preco: 80 }, 'preco'));
`,
    typeAssertions: `// @ts-expect-error — "desconto" não é coluna de Linha
valorDaColuna({ produto: 'a', quantidade: 1, preco: 1 }, 'desconto');`,
    hints: [
      'keyof Linha é "produto" | "quantidade" | "preco".',
      'Evite "as any" ou index signatures: elas aceitariam colunas inexistentes.',
    ],
    testCases: [
      { description: 'Lê a coluna preco', expectedOutput: '80', testFunction: `return valorDaColuna({ produto: 'Mouse', quantidade: 2, preco: 80 }, 'preco') === 80;` },
    ],
    explanation:
      'Uma string qualquer pode não ser chave do objeto, por isso o acesso é recusado (TS7053). keyof Linha restringe aos nomes existentes e ainda dá autocompletar na chamada.',
    validationRules: [{ id: 'rule-keyof', type: 'contains', target: 'keyof Linha', description: 'Usa keyof Linha' }],
  },
  {
    id: 'ts-avancado-debug-anotacao-vs-satisfies',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'satisfies',
    title: 'Depuração: Anotação que Alarga o Tipo Demais',
    summary: 'Uma anotação de tipo apaga informação que o código usa depois.',
    realWorldContext:
      'Tokens de design (cores e espaçamentos) misturam strings e listas. Anotar o objeto com um tipo amplo faz o compilador "esquecer" que primaria é string.',
    description:
      'A anotação Record<string, Token> faz paleta.primaria ser string | number[], e toUpperCase não compila. Troque a anotação por satisfies, mantendo a validação dos valores.',
    goal: 'Substituir a anotação por satisfies.',
    bugDescription: "Property 'toUpperCase' does not exist on type 'Token'.",
    buggyLineNumbers: [8],
    initialBuggyCode: `type Token = string | number[];

const paleta: Record<string, Token> = {
  primaria: '#6366f1',
  espacamentos: [4, 8, 16],
};

console.log(paleta.primaria.toUpperCase());
`,
    templateCode: `type Token = string | number[];

const paleta: Record<string, Token> = {
  primaria: '#6366f1',
  espacamentos: [4, 8, 16],
};

console.log(paleta.primaria.toUpperCase());
`,
    solutionCode: `type Token = string | number[];

const paleta = {
  primaria: '#6366f1',
  espacamentos: [4, 8, 16],
} satisfies Record<string, Token>;

console.log(paleta.primaria.toUpperCase());
`,
    typeAssertions: `const total: number = paleta.espacamentos.length;`,
    hints: [
      'Remova ": Record<string, Token>" e coloque "satisfies Record<string, Token>" depois do objeto.',
      'Com satisfies, cada propriedade mantém seu tipo inferido.',
    ],
    testCases: [
      { description: 'Cor em maiúsculas', expectedOutput: '#6366F1', testFunction: `return paleta.primaria.toUpperCase() === '#6366F1';` },
    ],
    explanation:
      'A anotação substitui o tipo inferido pelo tipo declarado, mais amplo. satisfies valida contra o mesmo tipo, mas preserva o inferido: primaria continua string e espacamentos continua number[].',
    validationRules: [{ id: 'rule-satisfies', type: 'contains', target: 'satisfies', description: 'Usa satisfies' }],
  },
  {
    id: 'ts-avancado-debug-template-literal',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Template Literal Types',
    title: 'Depuração: Valor Fora do Padrão de um Template Literal Type',
    summary: 'Um valor não respeita o formato exigido por um template literal type.',
    realWorldContext:
      'APIs de estilo e de layout exigem unidades ("16px", "1.5rem"). Um número sem unidade passaria em JavaScript e quebraria o layout silenciosamente.',
    description:
      'O tipo Medida exige um número seguido de "px" ou "rem". Corrija o valor de padding inválido para "12px" (mesmo número, com unidade).',
    goal: 'Ajustar o valor ao padrão do template literal type.',
    bugDescription: 'Type \'"12"\' is not assignable to type \'`${number}px` | `${number}rem`\'.',
    buggyLineNumbers: [5],
    initialBuggyCode: `type Medida = \`\${number}px\` | \`\${number}rem\`;

const estilo: { margem: Medida; padding: Medida } = {
  margem: '1.5rem',
  padding: '12',
};

console.log(estilo.margem, estilo.padding);
`,
    templateCode: `type Medida = \`\${number}px\` | \`\${number}rem\`;

const estilo: { margem: Medida; padding: Medida } = {
  margem: '1.5rem',
  padding: '12',
};

console.log(estilo.margem, estilo.padding);
`,
    solutionCode: `type Medida = \`\${number}px\` | \`\${number}rem\`;

const estilo: { margem: Medida; padding: Medida } = {
  margem: '1.5rem',
  padding: '12px',
};

console.log(estilo.margem, estilo.padding);
`,
    typeAssertions: `// @ts-expect-error — "em" não está no padrão
const errada: Medida = '2em';`,
    hints: [
      '\`\${number}px\` aceita qualquer número seguido de "px".',
      'Basta acrescentar a unidade ao valor de padding.',
    ],
    testCases: [
      { description: 'Padding com unidade', expectedOutput: '12px', testFunction: `return estilo.padding === '12px';` },
    ],
    explanation:
      'Template literal types podem conter tipos como number e string nas lacunas, descrevendo formatos de texto. "12" não termina em px nem em rem, então é recusado na compilação.',
  },
  {
    id: 'ts-avancado-debug-resultado-sem-checar',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Discriminated Unions',
    title: 'Depuração: Usando o Valor de um Result sem Checar ok',
    summary: 'O código lê .valor de um Result sem antes confirmar que a operação deu certo.',
    realWorldContext:
      'Em vez de lançar exceções, muitas bases retornam { ok: true, valor } ou { ok: false, erro }. O padrão só protege se o código checar ok antes de usar o valor.',
    description:
      'exibirSaldo lê resultado.valor diretamente. Corrija: se ok for true, retorne "Saldo: <valor>"; senão, retorne "Erro: <erro>".',
    goal: 'Estreitar o Result pelo discriminante ok.',
    bugDescription: "Property 'valor' does not exist on type 'Result<number>'.",
    buggyLineNumbers: [4],
    initialBuggyCode: `type Result<T> = { ok: true; valor: T } | { ok: false; erro: string };

function exibirSaldo(resultado: Result<number>): string {
  return 'Saldo: ' + resultado.valor;
}

console.log(exibirSaldo({ ok: false, erro: 'conta bloqueada' }));
`,
    templateCode: `type Result<T> = { ok: true; valor: T } | { ok: false; erro: string };

function exibirSaldo(resultado: Result<number>): string {
  return 'Saldo: ' + resultado.valor;
}

console.log(exibirSaldo({ ok: false, erro: 'conta bloqueada' }));
`,
    solutionCode: `type Result<T> = { ok: true; valor: T } | { ok: false; erro: string };

function exibirSaldo(resultado: Result<number>): string {
  if (resultado.ok) {
    return 'Saldo: ' + resultado.valor;
  }
  return 'Erro: ' + resultado.erro;
}

console.log(exibirSaldo({ ok: false, erro: 'conta bloqueada' }));
`,
    hints: [
      'ok é o discriminante (literal true ou false).',
      'Dentro de if (resultado.ok), o tipo vira { ok: true; valor: T }.',
    ],
    testCases: [
      { description: 'Erro é exibido', expectedOutput: 'Erro: conta bloqueada', testFunction: `return exibirSaldo({ ok: false, erro: 'conta bloqueada' }) === 'Erro: conta bloqueada';` },
      { description: 'Sucesso mostra o saldo', expectedOutput: 'Saldo: 250', testFunction: `return exibirSaldo({ ok: true, valor: 250 }) === 'Saldo: 250';` },
    ],
    explanation:
      'O discriminante pode ser booleano. Checar resultado.ok estreita para o ramo de sucesso; no restante, só sobra o ramo de erro. Sem a checagem, a tela mostraria "Saldo: undefined".',
  },

  // ==========================================
  // PREVER SAÍDA (5)
  // ==========================================
  {
    id: 'ts-avancado-prever-satisfies-runtime',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'satisfies',
    title: 'Previsão de Saída: satisfies, as e Anotação em Runtime',
    summary: 'Compare o efeito em runtime das três formas de "tipar" um valor.',
    realWorldContext:
      'Em revisões de código, é comum discutir anotação vs. as vs. satisfies. A diferença está só no compilador — em runtime o valor é exatamente o mesmo.',
    description: 'Três objetos iguais, tipados de três formas diferentes. Qual é a saída?',
    goal: 'Entender que satisfies, as e anotações não alteram valores.',
    codeToPredict: `interface Config { modo: 'dev' | 'prod'; porta: number }

const a: Config = { modo: 'dev', porta: 3000 };
const b = { modo: 'dev', porta: 3000 } as Config;
const c = { modo: 'dev', porta: 3000 } satisfies Config;

console.log(JSON.stringify(a) === JSON.stringify(b), JSON.stringify(b) === JSON.stringify(c));
console.log(a === b);
`,
    templateCode: `interface Config { modo: 'dev' | 'prod'; porta: number }

const a: Config = { modo: 'dev', porta: 3000 };
const b = { modo: 'dev', porta: 3000 } as Config;
const c = { modo: 'dev', porta: 3000 } satisfies Config;

console.log(JSON.stringify(a) === JSON.stringify(b), JSON.stringify(b) === JSON.stringify(c));
console.log(a === b);
`,
    expectedOutputPrediction: 'true true\nfalse',
    solutionCode: `interface Config { modo: 'dev' | 'prod'; porta: number }

const a: Config = { modo: 'dev', porta: 3000 };
const b = { modo: 'dev', porta: 3000 } as Config;
const c = { modo: 'dev', porta: 3000 } satisfies Config;

console.log(JSON.stringify(a) === JSON.stringify(b), JSON.stringify(b) === JSON.stringify(c));
console.log(a === b);
`,
    hints: [
      'Anotações, as e satisfies são apagados na compilação.',
      'Objetos diferentes nunca são === entre si, mesmo com o mesmo conteúdo.',
    ],
    testCases: [],
    explanation:
      'No JavaScript emitido, as três linhas viram o mesmo objeto literal: o conteúdo serializado é idêntico. a === b é false porque são dois objetos distintos na memória. A diferença entre as formas é só o que o compilador checa e infere.',
  },
  {
    id: 'ts-avancado-prever-uniao-discriminada',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Discriminated Unions',
    title: 'Previsão de Saída: Somando Áreas de Formas',
    summary: 'Siga um switch sobre uma discriminated union dentro de um reduce.',
    realWorldContext:
      'Editores gráficos e calculadoras de obra somam áreas de formas diferentes. Cada forma tem campos próprios, e o discriminante escolhe a fórmula.',
    description: 'Qual é a saída?',
    goal: 'Seguir o narrowing de uma discriminated union em runtime.',
    codeToPredict: `type Forma =
  | { tipo: 'quadrado'; lado: number }
  | { tipo: 'retangulo'; base: number; altura: number }
  | { tipo: 'triangulo'; base: number; altura: number };

function area(f: Forma): number {
  switch (f.tipo) {
    case 'quadrado': return f.lado * f.lado;
    case 'retangulo': return f.base * f.altura;
    case 'triangulo': return (f.base * f.altura) / 2;
  }
}

const formas: Forma[] = [
  { tipo: 'quadrado', lado: 3 },
  { tipo: 'retangulo', base: 2, altura: 5 },
  { tipo: 'triangulo', base: 4, altura: 3 },
];

console.log(formas.map(area).join('+'), '=', formas.reduce((s, f) => s + area(f), 0));
`,
    templateCode: `type Forma =
  | { tipo: 'quadrado'; lado: number }
  | { tipo: 'retangulo'; base: number; altura: number }
  | { tipo: 'triangulo'; base: number; altura: number };

function area(f: Forma): number {
  switch (f.tipo) {
    case 'quadrado': return f.lado * f.lado;
    case 'retangulo': return f.base * f.altura;
    case 'triangulo': return (f.base * f.altura) / 2;
  }
}

const formas: Forma[] = [
  { tipo: 'quadrado', lado: 3 },
  { tipo: 'retangulo', base: 2, altura: 5 },
  { tipo: 'triangulo', base: 4, altura: 3 },
];

console.log(formas.map(area).join('+'), '=', formas.reduce((s, f) => s + area(f), 0));
`,
    expectedOutputPrediction: '9+10+6 = 25',
    solutionCode: `type Forma =
  | { tipo: 'quadrado'; lado: number }
  | { tipo: 'retangulo'; base: number; altura: number }
  | { tipo: 'triangulo'; base: number; altura: number };

function area(f: Forma): number {
  switch (f.tipo) {
    case 'quadrado': return f.lado * f.lado;
    case 'retangulo': return f.base * f.altura;
    case 'triangulo': return (f.base * f.altura) / 2;
  }
}

const formas: Forma[] = [
  { tipo: 'quadrado', lado: 3 },
  { tipo: 'retangulo', base: 2, altura: 5 },
  { tipo: 'triangulo', base: 4, altura: 3 },
];

console.log(formas.map(area).join('+'), '=', formas.reduce((s, f) => s + area(f), 0));
`,
    hints: [
      'Quadrado: 3 × 3. Retângulo: 2 × 5. Triângulo: 4 × 3 ÷ 2.',
      'console.log separa os argumentos com espaço.',
    ],
    testCases: [],
    explanation:
      'As áreas são 9, 10 e 6, somando 25. Repare que retangulo e triangulo têm os mesmos campos: só o discriminante tipo diferencia as fórmulas — e o switch cobre todos os casos, então a função sempre retorna number.',
  },
  {
    id: 'ts-avancado-prever-never-runtime',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Discriminated Unions',
    title: 'Previsão de Saída: A Rede de Segurança do never em Runtime',
    summary: 'Veja o que acontece quando um dado fora do tipo chega ao default exaustivo.',
    realWorldContext:
      'Mesmo com tipos perfeitos, APIs externas podem enviar um valor novo antes do frontend ser atualizado. O throw no default exaustivo transforma isso num erro claro, e não num comportamento silencioso.',
    description:
      'Um valor que não pertence à união chega à função (simulando um JSON externo). Qual é a saída?',
    goal: 'Entender o papel em runtime do default com never.',
    codeToPredict: `type Nivel = 'info' | 'erro';

function icone(nivel: Nivel): string {
  switch (nivel) {
    case 'info': return 'ℹ';
    case 'erro': return '✖';
    default: {
      const desconhecido: never = nivel;
      throw new Error('Nível não tratado: ' + desconhecido);
    }
  }
}

const vindoDaApi: Nivel = JSON.parse('"alerta"');

try {
  console.log(icone('info'));
  console.log(icone(vindoDaApi));
} catch (e) {
  console.log(e instanceof Error ? e.message : 'erro');
}
`,
    templateCode: `type Nivel = 'info' | 'erro';

function icone(nivel: Nivel): string {
  switch (nivel) {
    case 'info': return 'ℹ';
    case 'erro': return '✖';
    default: {
      const desconhecido: never = nivel;
      throw new Error('Nível não tratado: ' + desconhecido);
    }
  }
}

const vindoDaApi: Nivel = JSON.parse('"alerta"');

try {
  console.log(icone('info'));
  console.log(icone(vindoDaApi));
} catch (e) {
  console.log(e instanceof Error ? e.message : 'erro');
}
`,
    expectedOutputPrediction: 'ℹ\nNível não tratado: alerta',
    solutionCode: `type Nivel = 'info' | 'erro';

function icone(nivel: Nivel): string {
  switch (nivel) {
    case 'info': return 'ℹ';
    case 'erro': return '✖';
    default: {
      const desconhecido: never = nivel;
      throw new Error('Nível não tratado: ' + desconhecido);
    }
  }
}

const vindoDaApi: Nivel = JSON.parse('"alerta"');

try {
  console.log(icone('info'));
  console.log(icone(vindoDaApi));
} catch (e) {
  console.log(e instanceof Error ? e.message : 'erro');
}
`,
    hints: [
      'JSON.parse devolve any, então "alerta" entra como Nivel sem checagem.',
      'Em runtime, "alerta" não casa com nenhum case e cai no default.',
    ],
    testCases: [],
    explanation:
      'O primeiro log mostra o ícone de info. O segundo valor não pertence à união, mas entrou via any; em runtime ele cai no default, que lança o erro capturado pelo catch. A checagem com never protege na compilação; o throw protege contra dados que escaparam do sistema de tipos.',
  },
  {
    id: 'ts-avancado-prever-mapped-runtime',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Mapped Types',
    title: 'Previsão de Saída: Mapped Type na Prática com Object.fromEntries',
    summary: 'Preveja um objeto transformado em runtime cujo tipo é descrito por um mapped type.',
    realWorldContext:
      'Gerar getters, flags ou versões "Upper" de objetos de configuração é comum. O mapped type descreve o resultado; Object.fromEntries faz a transformação.',
    description: 'Qual é a saída?',
    goal: 'Relacionar um mapped type com a transformação feita em runtime.',
    codeToPredict: `type Dobrado<T> = { [K in keyof T]: number };

function dobrar<T extends Record<string, number>>(obj: T): Dobrado<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([chave, valor]) => [chave, valor * 2])
  ) as Dobrado<T>;
}

const limites = { minimo: 5, maximo: 50 };
const dobrados = dobrar(limites);

console.log(JSON.stringify(dobrados), limites.maximo);
`,
    templateCode: `type Dobrado<T> = { [K in keyof T]: number };

function dobrar<T extends Record<string, number>>(obj: T): Dobrado<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([chave, valor]) => [chave, valor * 2])
  ) as Dobrado<T>;
}

const limites = { minimo: 5, maximo: 50 };
const dobrados = dobrar(limites);

console.log(JSON.stringify(dobrados), limites.maximo);
`,
    expectedOutputPrediction: '{"minimo":10,"maximo":100} 50',
    solutionCode: `type Dobrado<T> = { [K in keyof T]: number };

function dobrar<T extends Record<string, number>>(obj: T): Dobrado<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([chave, valor]) => [chave, valor * 2])
  ) as Dobrado<T>;
}

const limites = { minimo: 5, maximo: 50 };
const dobrados = dobrar(limites);

console.log(JSON.stringify(dobrados), limites.maximo);
`,
    hints: [
      'Object.fromEntries cria um objeto NOVO.',
      'O original não é alterado.',
    ],
    testCases: [],
    explanation:
      'Cada valor é dobrado num objeto novo; limites continua com maximo 50. Note o "as Dobrado<T>": Object.fromEntries devolve um tipo genérico demais, e aqui o cast é aceitável porque a função garante a forma em runtime. Mapped types descrevem a forma; quem a produz é o código.',
  },
  {
    id: 'ts-avancado-prever-template-literal-runtime',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Template Literal Types',
    title: 'Previsão de Saída: Gerando Nomes de Eventos',
    summary: 'Preveja os nomes gerados por uma função cujo retorno é um template literal type.',
    realWorldContext:
      'Bibliotecas de estado geram tipos de ação como "pedido/criado" a partir de entidades e verbos. O tipo garante o formato; a função monta as strings.',
    description: 'Qual é a saída?',
    goal: 'Relacionar template literal types com template strings em runtime.',
    codeToPredict: `type Entidade = 'pedido' | 'cliente';
type Verbo = 'criado' | 'removido';
type NomeEvento = \`\${Entidade}/\${Verbo}\`;

function evento(e: Entidade, v: Verbo): NomeEvento {
  return \`\${e}/\${v}\`;
}

const todos: NomeEvento[] = [];
for (const e of ['pedido', 'cliente'] as const) {
  for (const v of ['criado', 'removido'] as const) {
    todos.push(evento(e, v));
  }
}

console.log(todos.length, todos[1], todos[todos.length - 1]);
`,
    templateCode: `type Entidade = 'pedido' | 'cliente';
type Verbo = 'criado' | 'removido';
type NomeEvento = \`\${Entidade}/\${Verbo}\`;

function evento(e: Entidade, v: Verbo): NomeEvento {
  return \`\${e}/\${v}\`;
}

const todos: NomeEvento[] = [];
for (const e of ['pedido', 'cliente'] as const) {
  for (const v of ['criado', 'removido'] as const) {
    todos.push(evento(e, v));
  }
}

console.log(todos.length, todos[1], todos[todos.length - 1]);
`,
    expectedOutputPrediction: '4 pedido/removido cliente/removido',
    solutionCode: `type Entidade = 'pedido' | 'cliente';
type Verbo = 'criado' | 'removido';
type NomeEvento = \`\${Entidade}/\${Verbo}\`;

function evento(e: Entidade, v: Verbo): NomeEvento {
  return \`\${e}/\${v}\`;
}

const todos: NomeEvento[] = [];
for (const e of ['pedido', 'cliente'] as const) {
  for (const v of ['criado', 'removido'] as const) {
    todos.push(evento(e, v));
  }
}

console.log(todos.length, todos[1], todos[todos.length - 1]);
`,
    hints: [
      'São 2 entidades × 2 verbos.',
      'A ordem segue os loops: o verbo varia mais rápido.',
    ],
    testCases: [],
    explanation:
      'Os loops geram pedido/criado, pedido/removido, cliente/criado e cliente/removido. O tipo NomeEvento tem exatamente essas 4 combinações — o compilador aceita o retorno da template string porque o contexto é um template literal type.',
  },

  // ==========================================
  // DESAFIOS PRÁTICOS (5)
  // ==========================================
  {
    id: 'ts-avancado-desafio-result',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Discriminated Unions',
    title: 'Desafio Prático: Tipo Result e Composição sem Exceções',
    summary: 'Implemente funções que trabalham com Result<T> em vez de lançar exceções.',
    realWorldContext:
      'Validações em cadeia (CPF → idade → limite de crédito) ficam frágeis com try/catch espalhado. Um tipo Result torna o erro parte da assinatura.',
    description:
      'Implemente: sucesso(valor) e falha(erro), que constroem um Result; parseIdade(texto), que retorna sucesso com a idade se for inteiro entre 0 e 130, senão falha com "Idade inválida"; e mapear(r, fn), que aplica fn ao valor se for sucesso e repassa a falha intacta.',
    goal: 'Construir e compor Results com narrowing pelo discriminante.',
    practicalRequirements: [
      'Result<T> = { ok: true; valor: T } | { ok: false; erro: string }.',
      'parseIdade aceita só inteiros de 0 a 130 (texto vazio é inválido).',
      'mapear é genérica: mapear<T, U>(r: Result<T>, fn: (v: T) => U): Result<U>.',
      'Não lançar exceções.',
    ],
    templateCode: `type Result<T> = { ok: true; valor: T } | { ok: false; erro: string };

function sucesso<T>(valor: T): Result<T> {
  // Implemente aqui
}

function falha<T = never>(erro: string): Result<T> {
  // Implemente aqui
}

function parseIdade(texto: string): Result<number> {
  // Implemente aqui
}

function mapear<T, U>(r: Result<T>, fn: (v: T) => U): Result<U> {
  // Implemente aqui
}
`,
    solutionCode: `type Result<T> = { ok: true; valor: T } | { ok: false; erro: string };

function sucesso<T>(valor: T): Result<T> {
  return { ok: true, valor };
}

function falha<T = never>(erro: string): Result<T> {
  return { ok: false, erro };
}

function parseIdade(texto: string): Result<number> {
  if (texto.trim() === '') return falha('Idade inválida');
  const n = Number(texto);
  if (!Number.isInteger(n) || n < 0 || n > 130) return falha('Idade inválida');
  return sucesso(n);
}

function mapear<T, U>(r: Result<T>, fn: (v: T) => U): Result<U> {
  return r.ok ? sucesso(fn(r.valor)) : r;
}
`,
    typeAssertions: `const r: Result<string> = mapear(parseIdade('30'), n => 'Idade: ' + n);
// @ts-expect-error — valor só existe após checar ok
r.valor;`,
    hints: [
      'sucesso e falha só montam os objetos literais.',
      'Number("") é 0, por isso o texto vazio precisa ser tratado antes.',
      'Em mapear, a falha pode ser repassada como está: { ok: false; erro } serve como Result<U>.',
    ],
    testCases: [
      { description: 'Idade válida', expectedOutput: '{ ok: true, valor: 42 }', testFunction: `const r = parseIdade('42'); return r.ok === true && r.valor === 42;` },
      { description: 'Texto inválido e vazio', expectedOutput: 'Idade inválida', testFunction: `const a = parseIdade('abc'); const b = parseIdade(''); return !a.ok && a.erro === 'Idade inválida' && !b.ok;` },
      { description: 'Fora do intervalo e decimal', expectedOutput: 'falha', testFunction: `return !parseIdade('200').ok && !parseIdade('30.5').ok;` },
      { description: 'mapear aplica a função no sucesso', expectedOutput: 'Idade: 30', testFunction: `const r = mapear(parseIdade('30'), n => 'Idade: ' + n); return r.ok && r.valor === 'Idade: 30';` },
      { description: 'mapear repassa a falha', expectedOutput: 'Idade inválida', testFunction: `let chamou = false; const r = mapear(parseIdade('x'), n => { chamou = true; return n; }); return !r.ok && r.erro === 'Idade inválida' && !chamou;` },
    ],
    explanation:
      'O Result coloca o caminho de erro na assinatura: quem chama não consegue ler valor sem checar ok. O parâmetro padrão T = never em falha permite que a falha seja usada como Result de qualquer tipo, o que deixa mapear simples.',
  },
  {
    id: 'ts-avancado-desafio-selecionar-campos',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'keyof & Indexed Access Types',
    title: 'Desafio Prático: Função selecionar com Pick Inferido',
    summary: 'Implemente uma versão tipada de "pick" que devolve exatamente os campos pedidos.',
    realWorldContext:
      'Respostas de API costumam expor só alguns campos de uma entidade. Uma função selecionar bem tipada impede que o código acesse um campo que não foi incluído.',
    description:
      'Implemente selecionar(obj, chaves) que retorna um novo objeto apenas com as chaves pedidas. O tipo de retorno é Pick<T, K>.',
    goal: 'Implementar uma função genérica com K extends keyof T e retorno Pick<T, K>.',
    practicalRequirements: [
      'Assinatura: selecionar<T extends object, K extends keyof T>(obj: T, chaves: K[]): Pick<T, K>.',
      'O objeto retornado é novo e contém só as chaves pedidas.',
      'Chaves repetidas não causam problema.',
    ],
    templateCode: `function selecionar<T extends object, K extends keyof T>(obj: T, chaves: K[]): Pick<T, K> {
  // Implemente aqui
}
`,
    solutionCode: `function selecionar<T extends object, K extends keyof T>(obj: T, chaves: K[]): Pick<T, K> {
  const resultado = {} as Pick<T, K>;
  for (const chave of chaves) {
    resultado[chave] = obj[chave];
  }
  return resultado;
}
`,
    typeAssertions: `const usuario = { id: 1, nome: 'Ana', senha: 'x' };
const publico = selecionar(usuario, ['id', 'nome']);
const nome: string = publico.nome;
// @ts-expect-error — senha não foi selecionada
publico.senha;
// @ts-expect-error — "email" não é chave de usuario
selecionar(usuario, ['email']);`,
    hints: [
      'Comece com um objeto vazio tipado como Pick<T, K> (aqui o "as" é necessário, pois ele ainda está vazio).',
      'Percorra as chaves copiando obj[chave] para o resultado.',
    ],
    testCases: [
      { description: 'Copia só as chaves pedidas', expectedOutput: '{"id":1,"nome":"Ana"}', testFunction: `return JSON.stringify(selecionar({ id: 1, nome: 'Ana', senha: 'x' }, ['id', 'nome'])) === '{"id":1,"nome":"Ana"}';` },
      { description: 'Retorna objeto novo', expectedOutput: 'objeto diferente', testFunction: `const o = { a: 1 }; return selecionar(o, ['a']) !== o;` },
      { description: 'Lista vazia gera objeto vazio', expectedOutput: '{}', testFunction: `return Object.keys(selecionar({ a: 1 }, [])).length === 0;` },
    ],
    explanation:
      'K extends keyof T faz o compilador validar as chaves na chamada e inferir K como a união das chaves passadas. Pick<T, K> descreve exatamente o objeto resultante — publico.senha vira erro de compilação.',
  },
  {
    id: 'ts-avancado-desafio-maquina-estados',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Discriminated Unions',
    title: 'Desafio Prático: Máquina de Estados de um Pedido',
    summary: 'Modele estados e transições de um pedido com discriminated unions.',
    realWorldContext:
      'Um pedido não pode ser enviado sem estar pago, nem cancelado depois de entregue. Uma máquina de estados explícita evita transições impossíveis que geram estorno e retrabalho.',
    description:
      'Implemente transicionar(estado, evento). Regras: aguardando_pagamento + pagar → pago (com pagoEm do evento); pago + enviar → enviado (com codigoRastreio do evento); aguardando_pagamento ou pago + cancelar → cancelado (com o motivo). Qualquer outra combinação mantém o estado atual (mesmo objeto).',
    goal: 'Implementar as transições válidas e ignorar as inválidas.',
    practicalRequirements: [
      'Usar o discriminante status do estado e o tipo do evento.',
      'pagar só vale em aguardando_pagamento; enviar só vale em pago.',
      'cancelar vale em aguardando_pagamento e pago, nunca em enviado ou cancelado.',
      'Transição inválida retorna o próprio estado recebido.',
    ],
    templateCode: `type EstadoPedido =
  | { status: 'aguardando_pagamento' }
  | { status: 'pago'; pagoEm: string }
  | { status: 'enviado'; pagoEm: string; codigoRastreio: string }
  | { status: 'cancelado'; motivo: string };

type EventoPedido =
  | { tipo: 'pagar'; data: string }
  | { tipo: 'enviar'; codigoRastreio: string }
  | { tipo: 'cancelar'; motivo: string };

function transicionar(estado: EstadoPedido, evento: EventoPedido): EstadoPedido {
  // Implemente aqui
  return estado;
}
`,
    solutionCode: `type EstadoPedido =
  | { status: 'aguardando_pagamento' }
  | { status: 'pago'; pagoEm: string }
  | { status: 'enviado'; pagoEm: string; codigoRastreio: string }
  | { status: 'cancelado'; motivo: string };

type EventoPedido =
  | { tipo: 'pagar'; data: string }
  | { tipo: 'enviar'; codigoRastreio: string }
  | { tipo: 'cancelar'; motivo: string };

function transicionar(estado: EstadoPedido, evento: EventoPedido): EstadoPedido {
  switch (evento.tipo) {
    case 'pagar':
      return estado.status === 'aguardando_pagamento' ? { status: 'pago', pagoEm: evento.data } : estado;
    case 'enviar':
      return estado.status === 'pago'
        ? { status: 'enviado', pagoEm: estado.pagoEm, codigoRastreio: evento.codigoRastreio }
        : estado;
    case 'cancelar':
      return estado.status === 'aguardando_pagamento' || estado.status === 'pago'
        ? { status: 'cancelado', motivo: evento.motivo }
        : estado;
  }
}
`,
    typeAssertions: `const e: EstadoPedido = transicionar({ status: 'aguardando_pagamento' }, { tipo: 'pagar', data: '2026-11-17' });
// @ts-expect-error — estado "pago" exige pagoEm
const invalido: EstadoPedido = { status: 'pago' };`,
    hints: [
      'Faça um switch no tipo do evento e, dentro, cheque o status atual.',
      'Em "enviar", depois de checar estado.status === "pago", o TypeScript libera estado.pagoEm.',
      'Para transições inválidas, retorne o próprio estado.',
    ],
    testCases: [
      { description: 'Pagar um pedido aguardando', expectedOutput: 'pago', testFunction: `const e = transicionar({ status: 'aguardando_pagamento' }, { tipo: 'pagar', data: 'd1' }); return e.status === 'pago' && e.pagoEm === 'd1';` },
      { description: 'Enviar um pedido pago mantém pagoEm', expectedOutput: 'enviado', testFunction: `const e = transicionar({ status: 'pago', pagoEm: 'd1' }, { tipo: 'enviar', codigoRastreio: 'BR123' }); return e.status === 'enviado' && e.codigoRastreio === 'BR123' && e.pagoEm === 'd1';` },
      { description: 'Não envia pedido não pago', expectedOutput: 'mesmo estado', testFunction: `const s = { status: 'aguardando_pagamento' }; return transicionar(s, { tipo: 'enviar', codigoRastreio: 'X' }) === s;` },
      { description: 'Não cancela pedido enviado', expectedOutput: 'mesmo estado', testFunction: `const s = { status: 'enviado', pagoEm: 'd', codigoRastreio: 'X' }; return transicionar(s, { tipo: 'cancelar', motivo: 'm' }) === s;` },
      { description: 'Cancela pedido pago', expectedOutput: 'cancelado', testFunction: `const e = transicionar({ status: 'pago', pagoEm: 'd' }, { tipo: 'cancelar', motivo: 'desistiu' }); return e.status === 'cancelado' && e.motivo === 'desistiu';` },
    ],
    explanation:
      'Cada estado carrega só os dados que fazem sentido nele: não existe "enviado" sem codigoRastreio. As transições estreitam estado e evento ao mesmo tempo, e o compilador impede, por exemplo, ler estado.pagoEm sem antes confirmar que o pedido foi pago.',
  },
  {
    id: 'ts-avancado-desafio-classe-css',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Template Literal Types',
    title: 'Desafio Prático: Classes CSS Tipadas com Template Literals',
    summary: 'Gere nomes de classe CSS cujo formato é garantido pelo tipo de retorno.',
    realWorldContext:
      'Design systems geram classes como "btn-sm-primary". Com template literal types, um componente nunca pede uma variante inexistente (como "btn-xl-primary").',
    description:
      'Implemente classeBotao(tamanho, variante, desabilitado?) que retorna "btn-<tamanho>-<variante>" e, se desabilitado for true, acrescenta " is-disabled". O tipo ClasseBotao já está definido.',
    goal: 'Retornar uma string que respeita o template literal type.',
    practicalRequirements: [
      'Assinatura: (tamanho: Tamanho, variante: Variante, desabilitado?: boolean) => ClasseBotao.',
      'Formato: "btn-<tamanho>-<variante>".',
      'Com desabilitado = true, acrescentar " is-disabled" ao final.',
    ],
    templateCode: `type Tamanho = 'sm' | 'md' | 'lg';
type Variante = 'primary' | 'ghost';
type ClasseBase = \`btn-\${Tamanho}-\${Variante}\`;
type ClasseBotao = ClasseBase | \`\${ClasseBase} is-disabled\`;

function classeBotao(tamanho: Tamanho, variante: Variante, desabilitado = false): ClasseBotao {
  // Implemente aqui
}
`,
    solutionCode: `type Tamanho = 'sm' | 'md' | 'lg';
type Variante = 'primary' | 'ghost';
type ClasseBase = \`btn-\${Tamanho}-\${Variante}\`;
type ClasseBotao = ClasseBase | \`\${ClasseBase} is-disabled\`;

function classeBotao(tamanho: Tamanho, variante: Variante, desabilitado = false): ClasseBotao {
  const base: ClasseBase = \`btn-\${tamanho}-\${variante}\`;
  return desabilitado ? \`\${base} is-disabled\` : base;
}
`,
    typeAssertions: `const c: ClasseBotao = classeBotao('sm', 'primary');
// @ts-expect-error — "xl" não é um Tamanho
classeBotao('xl', 'primary');
// @ts-expect-error — formato fora do padrão
const errada: ClasseBotao = 'button-sm-primary';`,
    hints: [
      'Monte a base com uma template string: \`btn-\${tamanho}-\${variante}\`.',
      'Anotar a constante como ClasseBase ajuda o compilador a manter o tipo literal.',
    ],
    testCases: [
      { description: 'Classe básica', expectedOutput: 'btn-md-ghost', testFunction: `return classeBotao('md', 'ghost') === 'btn-md-ghost';` },
      { description: 'Classe desabilitada', expectedOutput: 'btn-lg-primary is-disabled', testFunction: `return classeBotao('lg', 'primary', true) === 'btn-lg-primary is-disabled';` },
    ],
    explanation:
      'Quando uma template string aparece onde o tipo esperado é um template literal type, o TypeScript a verifica contra esse padrão. As 6 combinações de ClasseBase (3 tamanhos × 2 variantes) e suas versões desabilitadas formam o conjunto exato de retornos possíveis.',
  },
  {
    id: 'ts-avancado-desafio-deep-readonly',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Mapped Types',
    title: 'Desafio Prático: DeepReadonly e Congelamento Profundo',
    summary: 'Una um mapped type recursivo a uma implementação de Object.freeze profundo.',
    realWorldContext:
      'O estado inicial de uma aplicação (feature flags, configurações) deve ser imutável em todos os níveis. readonly e Object.freeze só protegem o primeiro nível.',
    description:
      'Complete o tipo DeepReadonly<T> (readonly recursivo em objetos) e implemente congelar(obj), que aplica Object.freeze em todo objeto aninhado e devolve o objeto tipado como DeepReadonly<T>.',
    goal: 'Escrever um mapped type recursivo e a função correspondente.',
    practicalRequirements: [
      'DeepReadonly<T> torna readonly todas as propriedades, recursivamente, quando T é objeto.',
      'congelar aplica Object.freeze ao objeto e a todos os objetos aninhados.',
      'Retorna o mesmo objeto recebido (já congelado).',
    ],
    templateCode: `type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

function congelar<T extends object>(obj: T): DeepReadonly<T> {
  // Implemente aqui: congele cada valor que for objeto e depois o próprio obj
  return obj as DeepReadonly<T>;
}
`,
    solutionCode: `type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

function congelar<T extends object>(obj: T): DeepReadonly<T> {
  for (const valor of Object.values(obj)) {
    if (typeof valor === 'object' && valor !== null && !Object.isFrozen(valor)) {
      congelar(valor);
    }
  }
  return Object.freeze(obj) as DeepReadonly<T>;
}
`,
    typeAssertions: `const flags = congelar({ ui: { tema: 'escuro' }, limites: [1, 2] });
const tema: string = flags.ui.tema;
// @ts-expect-error — readonly também no nível aninhado
flags.ui.tema = 'claro';
// @ts-expect-error — arrays aninhados também ficam readonly
flags.limites.push(3);`,
    hints: [
      'Percorra Object.values(obj) e chame congelar recursivamente para cada objeto.',
      'Object.freeze só afeta o primeiro nível — por isso a recursão.',
      'O "as DeepReadonly<T>" é necessário: o compilador não consegue provar sozinho que o freeze recursivo produz esse tipo.',
    ],
    testCases: [
      { description: 'Congela o objeto raiz', expectedOutput: 'true', testFunction: `const o = congelar({ a: 1 }); return Object.isFrozen(o);` },
      { description: 'Congela objetos aninhados', expectedOutput: 'true', testFunction: `const o = congelar({ a: { b: { c: 1 } } }); return Object.isFrozen(o.a) && Object.isFrozen(o.a.b);` },
      { description: 'Congela arrays aninhados', expectedOutput: 'true', testFunction: `const o = congelar({ lista: [1, 2] }); return Object.isFrozen(o.lista);` },
      { description: 'Devolve o mesmo objeto', expectedOutput: 'mesma referência', testFunction: `const o = { a: 1 }; return congelar(o) === o;` },
    ],
    explanation:
      'O tipo e a função andam juntos: DeepReadonly impede alterações no código TypeScript, e o freeze recursivo impede alterações em runtime (inclusive por código JavaScript sem tipos). Mapped types recursivos são a base de utilitários como DeepPartial em bibliotecas de formulário.',
  },
];

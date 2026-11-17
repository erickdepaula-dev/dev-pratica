/**
 * Verificador de conteúdo da trilha TypeScript.
 *
 * Usa o MESMO núcleo de compilação e o MESMO pipeline do app (src/services/typescript),
 * então o que passa aqui é exatamente o que o aluno verá passar no navegador.
 *
 * Uso: npm run check:ts [-- filtro-de-id]
 *
 * Para cada exercício TS:
 * - a solução oficial passa no pipeline completo (compila em strict, executa, passa nos
 *   testes e nas próprias validationRules; typeAssertions são respeitadas);
 * - lacunas: o template preenchido com as respostas esperadas compila e as regex aceitam
 *   as respostas;
 * - corrigir_erros: o código bugado NÃO passa, e o erro do compilador cai em buggyLineNumbers;
 * - prever_saida: a saída real bate com o gabarito;
 * - prever_erro_de_tipo: o trecho tem UM erro, na linha e com o código do gabarito.
 */
import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tsExercises } from '../src/data/ts/index';
import { normalizeOutputText } from '../src/services/evaluator';
import { compileTypeScript, type LibFiles, type LibSourceCache, type TypeScriptModule } from '../src/services/typescript/compilerCore';
import { runInSandbox, runPipeline, type CompileFn } from '../src/services/typescript/pipeline';
import type { Exercise } from '../src/types/exercise';

const require = createRequire(import.meta.url);
const ts = require('typescript-browser') as TypeScriptModule;

function loadLibs(): LibFiles {
  const libDir = dirname(require.resolve('typescript-browser/lib/lib.es2022.d.ts'));
  const files = readdirSync(libDir).filter(f => /^lib\.(es|decorators).*\.d\.ts$/.test(f));
  return Object.fromEntries(files.map(f => [f, readFileSync(join(libDir, f), 'utf8')]));
}

const libs = loadLibs();
const cache: LibSourceCache = new Map();
const compile: CompileFn = (code, typeAssertions) => compileTypeScript(ts, libs, code, { typeAssertions, cache });

function fillBlanks(ex: Exercise): string {
  let code = ex.templateCode;
  for (const b of ex.blanks ?? []) code = code.split(`{{${b.id}}}`).join(b.expectedAnswers[0] ?? '');
  return code;
}

async function check(ex: Exercise): Promise<string[]> {
  const issues: string[] = [];
  if (ex.hints.length < 2) issues.push('menos de 2 dicas');

  // Solução oficial: pipeline completo
  const sol = await runPipeline(ex, ex.solutionCode, compile);
  if (!sol.passed) {
    const falhas = sol.testCaseResults.filter(t => !t.passed).map(t => `${t.description}: ${t.error ?? t.output ?? ''}`);
    issues.push(`solução reprovada no pipeline (${sol.scorePercent}%): ${falhas.join(' | ')}`);
  }

  if (ex.type === 'lacunas') {
    if (!ex.blanks?.length) issues.push('lacunas sem blanks');
    for (const b of ex.blanks ?? []) {
      if (!ex.templateCode.includes(`{{${b.id}}}`)) issues.push(`${b.id} não está no template`);
      if (b.validationRegex) {
        for (const ans of b.expectedAnswers) {
          if (!new RegExp(b.validationRegex, 'i').test(ans)) issues.push(`${b.id}: regex não aceita "${ans}"`);
        }
      }
    }
    const filled = compile(fillBlanks(ex), ex.typeAssertions);
    if (filled.diagnostics.length) issues.push(`template preenchido não compila: ${filled.diagnostics.map(d => `L${d.line} TS${d.code}`).join(', ')}`);
  }

  if (ex.type === 'corrigir_erros') {
    if (!ex.initialBuggyCode) issues.push('sem initialBuggyCode');
    else {
      const bug = await runPipeline(ex, ex.initialBuggyCode, compile);
      if (bug.passed) issues.push('código bugado passa no pipeline (o bug não é detectável)');
      const errLines = (bug.diagnostics ?? []).filter(d => d.origin === 'codigo').map(d => d.line);
      const expected = ex.buggyLineNumbers ?? [];
      if (errLines.length && expected.length && !errLines.some(l => expected.includes(l))) {
        issues.push(`buggyLineNumbers ${expected} ≠ linhas com erro ${errLines}`);
      }
    }
  }

  if (ex.type === 'prever_saida') {
    const c = compile(ex.codeToPredict ?? '');
    if (c.diagnostics.length) issues.push(`codeToPredict não compila: ${c.diagnostics.map(d => `L${d.line} TS${d.code}`).join(', ')}`);
    const logs: string[] = [];
    try {
      await runInSandbox(c.js, '', logs);
    } catch (e) {
      issues.push(`codeToPredict lança erro: ${(e as Error).message}`);
    }
    const actual = logs.join('\n');
    const accepted = [ex.expectedOutputPrediction ?? '', ...(ex.acceptableOutputPredictions ?? [])];
    if (!accepted.some(e => normalizeOutputText(e) === normalizeOutputText(actual))) {
      issues.push(`saída real "${actual.replace(/\n/g, '⏎')}" ≠ gabarito "${ex.expectedOutputPrediction}"`);
    }
  }

  if (ex.type === 'prever_erro_de_tipo') {
    const desafio = ex.typeErrorChallenge;
    if (!desafio) issues.push('sem typeErrorChallenge');
    else {
      const c = compile(ex.codeToPredict ?? '');
      const first = c.diagnostics.find(d => d.origin === 'codigo');
      if (!first) issues.push('codeToPredict compila sem erros (deveria ter um erro de tipo)');
      else {
        if (first.line !== desafio.errorLine) issues.push(`primeiro erro na linha ${first.line}, gabarito diz ${desafio.errorLine} (${first.message})`);
        if (first.code !== desafio.errorCode) issues.push(`primeiro erro é TS${first.code}, gabarito diz TS${desafio.errorCode}`);
      }
      if (c.diagnostics.filter(d => d.origin === 'codigo').length > 1) issues.push(`mais de um erro no trecho (${c.diagnostics.length}); a resposta ficaria ambígua`);
      if (desafio.correctReason < 0 || desafio.correctReason >= desafio.reasonOptions.length) issues.push('correctReason fora das alternativas');
    }
  }

  if (['desafio_pratico', 'codigo_livre', 'corrigir_erros'].includes(ex.type) && !ex.testCases.some(t => t.testFunction)) {
    issues.push('sem testFunction executável');
  }
  return issues;
}

async function main(): Promise<void> {
  const filter = process.argv[2];
  const seen = new Set<string>();
  const summary: Record<string, number> = {};
  let problems = 0;
  const started = Date.now();

  for (const ex of tsExercises) {
    if (filter && !ex.id.includes(filter)) continue;
    const issues = await check(ex);
    if (seen.has(ex.id)) issues.push('ID duplicado');
    seen.add(ex.id);
    const key = `${ex.difficulty}/${ex.type}`;
    summary[key] = (summary[key] ?? 0) + 1;
    if (issues.length) {
      problems += issues.length;
      console.log(`✗ ${ex.id}\n  - ${issues.join('\n  - ')}`);
    }
  }

  console.table(summary);
  console.log(`${seen.size} exercícios verificados em ${((Date.now() - started) / 1000).toFixed(1)} s, ${problems} problema(s).`);
  process.exit(problems ? 1 : 0);
}

void main();

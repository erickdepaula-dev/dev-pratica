/**
 * Núcleo da compilação de TypeScript — PURO e compartilhado entre o app (navegador)
 * e o verificador de conteúdo (`scripts/check-ts-exercises.ts`, Node).
 *
 * Quem chama fornece o módulo do compilador (`typescript-browser`, TS 5.x — o TS 7 do
 * lint é nativo e não tem API JS) e o conteúdo das `lib.*.d.ts`. Assim as regras de
 * compilação são idênticas nos dois ambientes e o gabarito dos exercícios nunca diverge.
 *
 * Regras (definidas ao validar o conteúdo — ver docs/fase-2-typescript.md):
 * - `strict: true`, `target: ES2022`, só `lib.es2022.d.ts` (sem DOM — evita colisões como
 *   a global `name`) + um ambiente mínimo declarando `console`.
 * - Saída como *script* (`module: None`, `moduleDetection: legacy`): sem `export {}`,
 *   executável com `new Function` como no avaliador de JS.
 * - `typeAssertions` ficam numa função nunca chamada: são checadas, nunca executadas.
 */
import type * as TS from 'typescript-browser';
import type { DiagnosticOrigin, TsCompileOutput, TsDiagnostic } from '../../types/typescriptEvaluation';

export type TypeScriptModule = typeof TS;

/** Nome do arquivo → conteúdo, para as `lib.*.d.ts` (ex.: "lib.es2022.d.ts"). */
export type LibFiles = Readonly<Record<string, string>>;

const MAIN_FILE = 'main.ts';
const AMBIENT_FILE = 'ambient.d.ts';
const AMBIENT_SOURCE = 'declare const console: { log(...args: unknown[]): void; error(...args: unknown[]): void };';
const ASSERTIONS_OPEN = 'function __typeAssertions(): void {';

export function compilerOptions(ts: TypeScriptModule): TS.CompilerOptions {
  return {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    lib: ['lib.es2022.d.ts'],
    module: ts.ModuleKind.None,
    moduleDetection: ts.ModuleDetectionKind.Legacy,
    noEmitOnError: false,
    types: [],
    newLine: ts.NewLineKind.LineFeed,
  };
}

/** Código do aluno + testes de tipo numa função nunca chamada (escopo isolado). */
export function buildSource(userCode: string, typeAssertions?: string): { source: string; userLineCount: number } {
  const normalized = userCode.replace(/\r\n/g, '\n');
  const userLineCount = normalized.split('\n').length;
  if (!typeAssertions) return { source: normalized, userLineCount };
  return { source: `${normalized}\n${ASSERTIONS_OPEN}\n${typeAssertions}\n}\n`, userLineCount };
}

/**
 * Cache de SourceFiles das libs: parsear ~800 KB de .d.ts a cada verificação seria o
 * custo dominante. Os arquivos das libs são imutáveis, então o cache vale para a sessão.
 */
export type LibSourceCache = Map<string, TS.SourceFile>;

export function compileTypeScript(
  ts: TypeScriptModule,
  libs: LibFiles,
  userCode: string,
  options: { typeAssertions?: string; cache?: LibSourceCache } = {}
): TsCompileOutput {
  const started = Date.now();
  const opts = compilerOptions(ts);
  const { source, userLineCount } = buildSource(userCode, options.typeAssertions);
  const cache = options.cache ?? new Map<string, TS.SourceFile>();

  const own: Record<string, string> = { [MAIN_FILE]: source, [AMBIENT_FILE]: AMBIENT_SOURCE };
  let js = '';

  const host: TS.CompilerHost = {
    getSourceFile: (fileName, languageVersion) => {
      if (own[fileName] !== undefined) return ts.createSourceFile(fileName, own[fileName], languageVersion);
      const libText = libs[fileName];
      if (libText === undefined) return undefined;
      let cached = cache.get(fileName);
      if (!cached) {
        cached = ts.createSourceFile(fileName, libText, languageVersion);
        cache.set(fileName, cached);
      }
      return cached;
    },
    getDefaultLibFileName: () => 'lib.es2022.d.ts',
    getDefaultLibLocation: () => '',
    writeFile: (fileName, text) => {
      if (fileName.endsWith('.js')) js = text;
    },
    getCurrentDirectory: () => '',
    getDirectories: () => [],
    fileExists: fileName => own[fileName] !== undefined || libs[fileName] !== undefined,
    readFile: fileName => own[fileName] ?? libs[fileName],
    getCanonicalFileName: fileName => fileName,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
  };

  const program = ts.createProgram([MAIN_FILE, AMBIENT_FILE], opts, host);
  const raw = [...program.getSyntacticDiagnostics(), ...program.getSemanticDiagnostics(), ...program.getGlobalDiagnostics()];
  program.emit();

  const diagnostics: TsDiagnostic[] = raw
    .filter(d => d.file === undefined || d.file.fileName === MAIN_FILE)
    .map(d => toDiagnostic(ts, d, userLineCount));

  return { diagnostics, js, durationMs: Date.now() - started };
}

function toDiagnostic(ts: TypeScriptModule, d: TS.Diagnostic, userLineCount: number): TsDiagnostic {
  const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
  if (!d.file || d.start === undefined) {
    return { line: 0, column: 0, code: d.code, message, origin: 'codigo' };
  }
  const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
  const line1 = line + 1;
  // Linhas além do código do aluno pertencem ao bloco de typeAssertions
  // (a primeira delas é a abertura da função __typeAssertions).
  const origin: DiagnosticOrigin = line1 > userLineCount ? 'teste_de_tipo' : 'codigo';
  const relativeLine = origin === 'codigo' ? line1 : line1 - userLineCount - 1;
  return { line: relativeLine, column: character + 1, code: d.code, message, origin };
}

/** "Linha 3 · TS2322: Type 'string' is not assignable..." */
export function formatDiagnostic(d: TsDiagnostic): string {
  const where = d.origin === 'teste_de_tipo' ? `Teste de tipo, linha ${d.line}` : `Linha ${d.line}`;
  return `${where} · TS${d.code}: ${d.message}`;
}

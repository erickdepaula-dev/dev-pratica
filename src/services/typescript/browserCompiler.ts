/**
 * Carregamento do compilador TypeScript no navegador — sob demanda.
 *
 * O compilador (~3,5 MB minificado) e as lib.*.d.ts (um único chunk) só são baixados na
 * primeira vez que um exercício TS é avaliado (import() dinâmico): nada disso entra
 * no bundle inicial. Depois, tudo fica em memória (inclusive as libs já parseadas).
 */
import type { CompileFn } from './pipeline';
import { compileTypeScript, type LibFiles, type LibSourceCache, type TypeScriptModule } from './compilerCore';

interface LoadedCompiler {
  ts: TypeScriptModule;
  libs: LibFiles;
  cache: LibSourceCache;
}

let loading: Promise<LoadedCompiler> | null = null;

/** Carrega (uma única vez) o compilador e as libs. */
export function loadTypeScriptCompiler(): Promise<LoadedCompiler> {
  if (!loading) {
    loading = Promise.all([import('typescript-browser'), import('./libFiles')])
      .then(([mod, { LIB_FILES: libs }]) => {
        // O pacote é CommonJS: dependendo do bundler, a API vem em default.
        const ts = ('createProgram' in mod ? mod : (mod as { default: TypeScriptModule }).default) as TypeScriptModule;
        return { ts, libs, cache: new Map() };
      })
      .catch(err => {
        loading = null; // permite tentar de novo (ex.: falha de rede no download do chunk)
        throw err;
      });
  }
  return loading;
}

/** Função de compilação pronta para o pipeline. */
export async function getBrowserCompileFn(): Promise<CompileFn> {
  const { ts, libs, cache } = await loadTypeScriptCompiler();
  return (code, typeAssertions) => compileTypeScript(ts, libs, code, { typeAssertions, cache });
}

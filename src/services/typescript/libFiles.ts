/**
 * Conteúdo das lib.*.d.ts usadas pela configuração de compilação (target/lib ES2022).
 * Este módulo inteiro é carregado sob demanda (import() em browserCompiler.ts), então as
 * libs viram UM chunk separado, baixado só na primeira avaliação de TypeScript.
 * Só entram es5 → es2022 e decorators (referenciadas por lib.es2022.d.ts).
 */
import type { LibFiles } from './compilerCore';

const modules = import.meta.glob<string>(
  [
    '/node_modules/typescript-browser/lib/lib.es5.d.ts',
    '/node_modules/typescript-browser/lib/lib.es20{15,16,17,18,19,20,21,22}*.d.ts',
    '/node_modules/typescript-browser/lib/lib.decorators*.d.ts',
  ],
  { query: '?raw', import: 'default', eager: true }
);

export const LIB_FILES: LibFiles = Object.fromEntries(
  Object.entries(modules).map(([path, content]) => [path.slice(path.lastIndexOf('/') + 1), content])
);

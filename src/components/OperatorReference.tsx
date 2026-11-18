import React from 'react';
import { OPERATOR_GROUPS, OPERATOR_PRECEDENCE } from '../data/referencia';

interface OperatorReferenceProps {
  /** Versão do workspace: sem a coluna de Portugol e com espaçamento menor. */
  compact?: boolean;
}

/** Guia rápido de operadores (Fase 4.6): no StudyGuide e como consulta dentro do workspace. */
export const OperatorReference: React.FC<OperatorReferenceProps> = ({ compact = false }) => (
  <div className={compact ? 'space-y-3' : 'space-y-5'}>
    <div className={compact ? 'space-y-3' : 'grid grid-cols-1 lg:grid-cols-2 gap-4'}>
      {OPERATOR_GROUPS.map(group => (
        <div key={group.title} className="space-y-1.5">
          <h4 className="text-xs font-bold text-primary">{group.title}</h4>
          <div className="overflow-x-auto rounded-lg border border-subtle bg-canvas">
            <table className="w-full text-[11px] sm:text-xs">
              <thead>
                <tr className="text-muted text-left">
                  <th scope="col" className="px-2 py-1.5 font-semibold">JS/TS</th>
                  {!compact && <th scope="col" className="px-2 py-1.5 font-semibold">Portugol</th>}
                  <th scope="col" className="px-2 py-1.5 font-semibold">Significado</th>
                  <th scope="col" className="px-2 py-1.5 font-semibold">Exemplo</th>
                  <th scope="col" className="px-2 py-1.5 font-semibold">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map(row => (
                  <tr key={row.operator} className="border-t border-subtle/70 align-top">
                    <td className="px-2 py-1.5 font-mono text-accent whitespace-nowrap">{row.operator}</td>
                    {!compact && <td className="px-2 py-1.5 font-mono text-muted whitespace-nowrap">{row.portugol}</td>}
                    <td className="px-2 py-1.5 text-primary">{row.meaning}</td>
                    <td className="px-2 py-1.5 font-mono text-primary whitespace-nowrap">{row.example}</td>
                    <td className="px-2 py-1.5 font-mono text-success whitespace-nowrap">{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {group.note && <p className="text-[11px] text-muted leading-relaxed">⚠️ {group.note}</p>}
        </div>
      ))}
    </div>
    <div className="space-y-1.5">
      <h4 className="text-xs font-bold text-primary">Precedência (o que é calculado primeiro)</h4>
      <ol className="flex flex-wrap gap-1.5 text-[11px] font-mono">
        {OPERATOR_PRECEDENCE.map((item, i) => (
          <li key={item} className="px-2 py-1 rounded-md bg-canvas border border-subtle text-primary">
            <span className="text-muted mr-1">{i + 1}.</span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  </div>
);

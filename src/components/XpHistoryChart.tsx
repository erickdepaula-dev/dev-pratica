import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Table2, ChartColumn } from 'lucide-react';
import { UserProgress } from '../types/exercise';
import { collectXpEvents, xpByDay, XpDay } from '../services/xp';
import { getFortalezaDateString } from '../utils/dateUtils';

interface XpHistoryChartProps {
  progress: UserProgress;
  /** Quantos dias mostrar (terminando hoje). */
  days?: number;
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/** Últimos N dias no fuso de Fortaleza, do mais antigo para hoje. */
function lastDates(days: number): string[] {
  const now = Date.now();
  // Fortaleza não tem horário de verão: subtrair 24h por dia é seguro.
  return Array.from({ length: days }, (_, i) => getFortalezaDateString(new Date(now - (days - 1 - i) * 86_400_000)));
}

function formatDay(date: string): { short: string; long: string } {
  const [y, m, d] = date.split('-').map(Number);
  const weekday = DIAS_SEMANA[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return { short: String(d), long: `${weekday}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}` };
}

/** Topo "redondo" do eixo Y (10, 20, 50, 100, 200...). */
function niceMax(value: number): number {
  if (value <= 10) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find(s => s * magnitude >= value) ?? 10;
  return step * magnitude;
}

/**
 * Histórico de XP por dia (série única → sem legenda; o título nomeia a série).
 * Barras com topo arredondado de 4px e 2px de respiro entre colunas; tooltip por coluna,
 * com a coluna inteira como área de foco/hover; alternância para tabela.
 */
export const XpHistoryChart: React.FC<XpHistoryChartProps> = ({ progress, days = 14 }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const data: XpDay[] = useMemo(
    () => xpByDay(collectXpEvents(progress), lastDates(days), iso => getFortalezaDateString(new Date(iso))),
    [progress, days]
  );
  const total = data.reduce((sum, d) => sum + d.xp, 0);
  const max = niceMax(Math.max(...data.map(d => d.xp)));
  const ticks = [max, max / 2, 0];
  const active = hovered !== null ? data[hovered] : null;

  return (
    <section aria-labelledby="xp-historico-titulo" className="rounded-card border border-subtle bg-surface/40 p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="xp-historico-titulo" className="text-base font-bold text-primary">
            XP por dia
          </h2>
          <p className="text-xs text-muted">Últimos {days} dias · fuso America/Fortaleza</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xl font-black font-mono tabular-nums text-primary">{total}</div>
            <div className="text-[11px] text-muted">XP no período</div>
          </div>
          <button
            type="button"
            onClick={() => setShowTable(v => !v)}
            aria-pressed={showTable}
            className="p-2 rounded-control border border-subtle text-muted hover:text-primary hover:border-accent-from/40 transition-colors"
            title={showTable ? 'Ver como gráfico' : 'Ver como tabela'}
          >
            {showTable ? <ChartColumn className="w-4 h-4" /> : <Table2 className="w-4 h-4" />}
            <span className="sr-only">{showTable ? 'Ver como gráfico' : 'Ver como tabela'}</span>
          </button>
        </div>
      </div>

      {showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <caption className="sr-only">XP ganho por dia nos últimos {days} dias</caption>
            <thead>
              <tr className="text-muted text-left border-b border-subtle">
                <th className="py-1.5 font-semibold">Dia</th>
                <th className="py-1.5 font-semibold text-right">XP</th>
                <th className="py-1.5 font-semibold text-right">Conclusões</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map(d => (
                <tr key={d.date} className="border-b border-subtle/50">
                  <td className="py-1.5 text-primary">{formatDay(d.date).long}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-primary">{d.xp}</td>
                  <td className="py-1.5 text-right font-mono tabular-nums text-muted">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-2">
          {/* Eixo Y (recessivo) */}
          <div className="flex flex-col justify-between text-[10px] font-mono text-muted/70 h-40 pb-5 text-right w-8 shrink-0" aria-hidden="true">
            {ticks.map(t => (
              <span key={t} className="leading-none">
                {t}
              </span>
            ))}
          </div>

          <div className="relative flex-1 min-w-0">
            {/* Grade */}
            <div className="absolute inset-x-0 top-0 h-35 flex flex-col justify-between pointer-events-none" aria-hidden="true">
              {ticks.map(t => (
                <div key={t} className={t === 0 ? 'border-t border-subtle' : 'border-t border-dashed border-subtle/50'} />
              ))}
            </div>

            {/* Colunas */}
            <ol className="relative flex items-end h-40" aria-label="XP por dia">
              {data.map((d, i) => {
                const label = formatDay(d.date);
                const heightPercent = (d.xp / max) * 100;
                return (
                  <li key={d.date} className="flex-1 h-full min-w-0">
                    <button
                      type="button"
                      className="group w-full h-full flex flex-col justify-end items-stretch px-px focus-visible:outline-offset-0"
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(i)}
                      onBlur={() => setHovered(null)}
                      aria-label={`${label.long}: ${d.xp} XP em ${d.count} conclusão(ões)`}
                    >
                      <span className="relative block h-35 flex-none w-full max-w-7 mx-auto">
                        <motion.span
                          className={`absolute inset-x-0 bottom-0 rounded-t-[4px] origin-bottom transition-[filter] ${
                            hovered === i ? 'brightness-125' : ''
                          }`}
                          style={{ height: `${heightPercent}%`, backgroundColor: 'var(--accent-from)' }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.02 }}
                        />
                      </span>
                      <span
                        className={`h-5 flex items-end justify-center text-[10px] font-mono ${
                          i === data.length - 1 ? 'text-primary font-bold' : 'text-muted/70'
                        }`}
                      >
                        {label.short}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Tooltip */}
            {active && hovered !== null && (
              <div
                role="tooltip"
                className="absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-control border border-subtle bg-canvas px-2.5 py-1.5 text-[11px] shadow-card whitespace-nowrap pointer-events-none"
                style={{ left: `${((hovered + 0.5) / data.length) * 100}%` }}
              >
                <div className="text-muted">{formatDay(active.date).long}</div>
                <div className="text-primary font-semibold font-mono">
                  {active.xp} XP · {active.count} {active.count === 1 ? 'conclusão' : 'conclusões'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

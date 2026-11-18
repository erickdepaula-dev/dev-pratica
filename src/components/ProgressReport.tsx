import React, { useState } from 'react';
import { UserProgress, Track } from '../types/exercise';
import { allExercises, getExercisesByTrack } from '../data';
import { getSelectedTrack } from '../utils/track';
import { getTrackTheme } from '../utils/exerciseTheme';
import { BadgeGrid } from './BadgeGrid';
import { XpHistoryChart } from './XpHistoryChart';
import { BADGES } from '../services/badges';
import { exportProgressJSON, importProgressJSON, resetProgress } from '../services/storage';

interface ProgressReportProps {
  progress: UserProgress;
  onSelectTrack: (track: Track) => void;
  onStartExercise: (id: string) => void;
  onProgressUpdated: (newProgress: UserProgress) => void;
}

export const ProgressReport: React.FC<ProgressReportProps> = ({
  progress,
  onSelectTrack,
  onStartExercise,
  onProgressUpdated,
}) => {
  const currentTrack = getSelectedTrack(progress);
  const langExercises = getExercisesByTrack(currentTrack);

  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Group performance by topic
  const topicStats = React.useMemo(() => {
    const stats: Record<string, { total: number; completed: number; attempts: number }> = {};

    langExercises.forEach(ex => {
      if (!stats[ex.topic]) {
        stats[ex.topic] = { total: 0, completed: 0, attempts: 0 };
      }
      stats[ex.topic].total += 1;
      if (progress.completedIds.includes(ex.id)) {
        stats[ex.topic].completed += 1;
      }
      const att = progress.attempts[ex.id];
      if (att) {
        stats[ex.topic].attempts += att.attemptsCount;
      }
    });

    return Object.entries(stats).map(([topic, data]) => ({
      topic,
      ...data,
      percent: Math.round((data.completed / data.total) * 100),
    }));
  }, [langExercises, progress]);

  // Topics needing reinforcement (where completed < total)
  const weakTopics = topicStats.filter(t => t.completed < t.total);

  // Recent history
  const historyItems = React.useMemo(() => {
    return Object.values(progress.attempts)
      .map(attempt => {
        const ex = allExercises.find(e => e.id === attempt.exerciseId);
        return {
          ...attempt,
          exercise: ex,
        };
      })
      .filter(item => item.exercise !== undefined)
      .sort((a, b) => new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime());
  }, [progress.attempts]);

  // Export progress download
  const handleExport = () => {
    const jsonStr = exportProgressJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devpratica-progresso-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import progress handler
  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const success = importProgressJSON(importText);
    if (success) {
      setImportStatus('Progresso restaurado com sucesso!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setImportStatus('Arquivo JSON inválido. Verifique o conteúdo.');
    }
  };

  const handleReset = () => {
    const fresh = resetProgress();
    onProgressUpdated(fresh);
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Title & Data Sync Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-subtle">
        <div>
          <div className="flex items-center gap-2 text-xs text-accent font-medium mb-1">
            <span>Relatório Analítico</span>
            <span aria-hidden="true">·</span>
            <span>{getTrackTheme(currentTrack).name}</span>
            <span aria-hidden="true">·</span>
            <span>Histórico Local Persistente</span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">
            Seu Progresso & Evolução Técnica
          </h1>
        </div>

        {/* Persistence Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 rounded-lg border border-subtle bg-surface text-primary hover:text-primary hover:bg-surface-hover text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>↓</span>
            <span>Exportar Backup (JSON)</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="px-3.5 py-1.5 rounded-lg border border-subtle bg-surface text-primary hover:text-primary hover:bg-surface-hover text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>↑</span>
            <span>Restaurar Backup</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-lg border border-danger/30 bg-danger/10 text-danger hover:bg-danger/10 text-xs font-semibold transition-colors"
          >
            Zerar Dados
          </button>
        </div>
      </div>

      {/* Import Drawer */}
      {showImportBox && (
        <div className="p-4 rounded-xl border border-accent-from/30 bg-surface space-y-3">
          <h3 className="text-sm font-bold text-primary">Restaurar Progresso a partir de JSON</h3>
          <p className="text-xs text-muted">Cole abaixo o conteúdo do arquivo JSON exportado anteriormente:</p>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            rows={4}
            className="w-full p-3 bg-canvas border border-subtle rounded-lg text-xs font-mono text-primary outline-none focus:border-accent-from"
            placeholder='{ "completedIds": [...], ... }'
          />
          <div className="flex items-center justify-between">
            {importStatus && <span className="text-xs text-success">{importStatus}</span>}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowImportBox(false)}
                className="px-3 py-1.5 text-xs text-muted hover:text-primary"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-1.5 rounded-lg bg-accent-from hover:bg-accent-from text-primary text-xs font-semibold"
              >
                Restaurar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Histórico de XP por dia (Fase 3) */}
      <XpHistoryChart progress={progress} />

      {/* Conquistas (Fase 3) */}
      <section id="conquistas" aria-labelledby="conquistas-titulo" className="rounded-card border border-subtle bg-surface/40 p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 id="conquistas-titulo" className="text-base font-bold text-primary">Conquistas</h2>
          <span className="text-xs font-mono text-muted">
            {(progress.badges ?? []).length} de {BADGES.length} desbloqueadas
          </span>
        </div>
        <BadgeGrid badges={progress.badges ?? []} />
      </section>

      {/* Top Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Topic Breakdown */}
        <div className="rounded-xl border border-subtle bg-surface/40 p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-primary">Domínio por Assunto ({getTrackTheme(currentTrack).name})</h2>
            <p className="text-xs text-muted">Distribuição do seu avanço em cada tema do dia a dia</p>
          </div>

          <div className="space-y-3 pt-2">
            {topicStats.map(stat => (
              <div key={stat.topic} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-primary">{stat.topic}</span>
                  <span className="font-mono text-muted tabular-nums">
                    {stat.completed}/{stat.total} ({stat.percent}%)
                  </span>
                </div>
                <div className="w-full bg-surface-hover rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-accent-from h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${stat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reinforcement Recommendations */}
        <div className="rounded-xl border border-subtle bg-surface/40 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-primary">Assuntos Recomendados para Reforço</h2>
            <p className="text-xs text-muted">Tópicos com exercícios pendentes para dominar o ciclo completo</p>

            <div className="space-y-3 pt-4">
              {weakTopics.length === 0 ? (
                <div className="p-4 rounded-lg bg-success/10 border border-success/30 text-success text-xs text-center">
                  🎉 Parabéns! Você concluiu todos os tópicos disponíveis de {getTrackTheme(currentTrack).name}.
                </div>
              ) : (
                weakTopics.slice(0, 4).map(w => {
                  const pendingEx = langExercises.find(
                    e => e.topic === w.topic && !progress.completedIds.includes(e.id)
                  );
                  return (
                    <div
                      key={w.topic}
                      className="p-3 rounded-lg border border-subtle bg-canvas flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-primary">{w.topic}</div>
                        <div className="text-[11px] text-muted">
                          {w.total - w.completed} exercício(s) pendente(s)
                        </div>
                      </div>
                      {pendingEx && (
                        <button
                          onClick={() => onStartExercise(pendingEx.id)}
                          className="px-3 py-1 rounded-md bg-accent-from/80 hover:bg-accent-from text-primary font-medium text-xs whitespace-nowrap transition-colors"
                        >
                          Praticar →
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 bg-canvas/60 rounded-lg border border-subtle/80 text-xs text-muted mt-4">
            💡 Dica de estudo: No PHP, a combinação de PDO com prepared statements e injeção de dependências é o diferencial mais valorizado em entrevistas e código legado.
          </div>
        </div>
      </div>

      {/* Activity History Table */}
      <div className="rounded-xl border border-subtle bg-surface/30 overflow-hidden">
        <div className="p-5 border-b border-subtle">
          <h2 className="text-base font-bold text-primary">Histórico Detalhado de Resoluções</h2>
          <p className="text-xs text-muted">Todas as tentativas registradas com data e status</p>
        </div>

        {historyItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted">
            Nenhuma tentativa registrada ainda. Comece a resolver exercícios para construir seu histórico!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-subtle bg-canvas/60 text-muted font-semibold">
                  <th className="py-3 px-4">Exercício</th>
                  <th className="py-3 px-4">Linguagem</th>
                  <th className="py-3 px-4">Nível</th>
                  <th className="py-3 px-4">Tentativas</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Última Ação</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle/60">
                {historyItems.map((item, idx) => {
                  const ex = item.exercise!;
                  const isDone = item.passed;
                  const dateFormatted = new Date(item.lastAttemptAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={idx} className="hover:bg-surface/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-primary">
                        {ex.title}
                      </td>
                      <td className="py-3 px-4 uppercase font-mono text-accent">
                        {ex.language}
                      </td>
                      <td className="py-3 px-4 capitalize text-muted">
                        {ex.difficulty}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-primary">
                        {item.attemptsCount}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${isDone ? 'text-success' : 'text-warning'}`}>
                          {isDone ? '✓ Concluído' : '○ Em Aberto'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted font-mono tabular-nums">
                        {dateFormatted}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onStartExercise(ex.id)}
                          className="text-xs text-accent hover:text-accent font-semibold"
                        >
                          Revisar →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal to Reset Progress */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl border border-subtle bg-surface p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-danger">Zerar todo o progresso?</h3>
            <p className="text-xs text-primary leading-relaxed">
              Esta ação apagará todas as resoluções salvas, histórico de tentativas e sequência de estudos no seu navegador. Essa ação não pode ser desfeita, a menos que você tenha exportado um backup JSON.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-surface-hover hover:bg-subtle text-primary text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-danger hover:bg-danger text-primary text-xs font-semibold transition-colors"
              >
                Sim, Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

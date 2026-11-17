import React, { useState } from 'react';
import { UserProgress, Language } from '../types/exercise';
import { allExercises, getExercisesByLanguage } from '../data';
import { exportProgressJSON, importProgressJSON, resetProgress } from '../services/storage';

interface ProgressReportProps {
  progress: UserProgress;
  onSelectLanguage: (lang: Language) => void;
  onStartExercise: (id: string) => void;
  onProgressUpdated: (newProgress: UserProgress) => void;
}

export const ProgressReport: React.FC<ProgressReportProps> = ({
  progress,
  onSelectLanguage,
  onStartExercise,
  onProgressUpdated,
}) => {
  const currentLang = progress.selectedLanguage;
  const langExercises = getExercisesByLanguage(currentLang);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1">
            <span>Relatório Analítico</span>
            <span aria-hidden="true">·</span>
            <span className="uppercase">{currentLang}</span>
            <span aria-hidden="true">·</span>
            <span>Histórico Local Persistente</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Seu Progresso & Evolução Técnica
          </h1>
        </div>

        {/* Persistence Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>↓</span>
            <span>Exportar Backup (JSON)</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>↑</span>
            <span>Restaurar Backup</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-lg border border-rose-900/60 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 text-xs font-semibold transition-colors"
          >
            Zerar Dados
          </button>
        </div>
      </div>

      {/* Import Drawer */}
      {showImportBox && (
        <div className="p-4 rounded-xl border border-indigo-900/60 bg-slate-900 space-y-3">
          <h3 className="text-sm font-bold text-white">Restaurar Progresso a partir de JSON</h3>
          <p className="text-xs text-slate-400">Cole abaixo o conteúdo do arquivo JSON exportado anteriormente:</p>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            rows={4}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
            placeholder='{ "completedIds": [...], ... }'
          />
          <div className="flex items-center justify-between">
            {importStatus && <span className="text-xs text-emerald-400">{importStatus}</span>}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowImportBox(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Restaurar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Topic Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Domínio por Assunto ({currentLang.toUpperCase()})</h2>
            <p className="text-xs text-slate-400">Distribuição do seu avanço em cada tema do dia a dia</p>
          </div>

          <div className="space-y-3 pt-2">
            {topicStats.map(stat => (
              <div key={stat.topic} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{stat.topic}</span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {stat.completed}/{stat.total} ({stat.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${stat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reinforcement Recommendations */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Assuntos Recomendados para Reforço</h2>
            <p className="text-xs text-slate-400">Tópicos com exercícios pendentes para dominar o ciclo completo</p>

            <div className="space-y-3 pt-4">
              {weakTopics.length === 0 ? (
                <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 text-xs text-center">
                  🎉 Parabéns! Você concluiu todos os tópicos disponíveis de {currentLang.toUpperCase()}.
                </div>
              ) : (
                weakTopics.slice(0, 4).map(w => {
                  const pendingEx = langExercises.find(
                    e => e.topic === w.topic && !progress.completedIds.includes(e.id)
                  );
                  return (
                    <div
                      key={w.topic}
                      className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{w.topic}</div>
                        <div className="text-[11px] text-slate-500">
                          {w.total - w.completed} exercício(s) pendente(s)
                        </div>
                      </div>
                      {pendingEx && (
                        <button
                          onClick={() => onStartExercise(pendingEx.id)}
                          className="px-3 py-1 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium text-xs whitespace-nowrap transition-colors"
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

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-400 mt-4">
            💡 Dica de estudo: No PHP, a combinação de PDO com prepared statements e injeção de dependências é o diferencial mais valorizado em entrevistas e código legado.
          </div>
        </div>
      </div>

      {/* Activity History Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Histórico Detalhado de Resoluções</h2>
          <p className="text-xs text-slate-400">Todas as tentativas registradas com data e status</p>
        </div>

        {historyItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Nenhuma tentativa registrada ainda. Comece a resolver exercícios para construir seu histórico!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Exercício</th>
                  <th className="py-3 px-4">Linguagem</th>
                  <th className="py-3 px-4">Nível</th>
                  <th className="py-3 px-4">Tentativas</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Última Ação</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
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
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {ex.title}
                      </td>
                      <td className="py-3 px-4 uppercase font-mono text-indigo-400">
                        {ex.language}
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-400">
                        {ex.difficulty}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                        {item.attemptsCount}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${isDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {isDone ? '✓ Concluído' : '○ Em Aberto'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono tabular-nums">
                        {dateFormatted}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onStartExercise(ex.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-rose-400">Zerar todo o progresso?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Esta ação apagará todas as resoluções salvas, histórico de tentativas e sequência de estudos no seu navegador. Essa ação não pode ser desfeita, a menos que você tenha exportado um backup JSON.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
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

import React from 'react';
import { UserProgress, Language } from '../types/exercise';
import { getExercisesByLanguage } from '../data';
import { calculateEffectiveStreak } from '../services/storage';
import { getCurrentWeekDays, getFortalezaDateString } from '../utils/dateUtils';
import { getDifficultyTheme, getExerciseTypeTheme } from '../utils/exerciseTheme';

interface DashboardProps {
  progress: UserProgress;
  onSelectLanguage: (lang: Language) => void;
  onStartExercise: (exerciseId: string) => void;
  onNavigateToExercises: () => void;
  onNavigateToProgress: () => void;
  onNavigateToGuide: () => void;
  onNavigateToAiChallenges?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onSelectLanguage,
  onStartExercise,
  onNavigateToExercises,
  onNavigateToProgress,
  onNavigateToGuide,
  onNavigateToAiChallenges,
}) => {
  const currentLang = progress.selectedLanguage;
  const langExercises = getExercisesByLanguage(currentLang);
  const totalInLang = langExercises.length;

  const completedInLang = langExercises.filter(ex =>
    progress.completedIds.includes(ex.id)
  ).length;

  const overallPercent = totalInLang > 0 ? Math.round((completedInLang / totalInLang) * 100) : 0;

  // Next suggested uncompleted exercise
  const nextExercise = langExercises.find(ex => !progress.completedIds.includes(ex.id));

  // Global counts for both tracks
  const phpExercises = getExercisesByLanguage('php');
  const phpTotal = phpExercises.length;
  const phpDone = phpExercises.filter(e => progress.completedIds.includes(e.id)).length;
  const phpPercent = phpTotal > 0 ? Math.round((phpDone / phpTotal) * 100) : 0;

  const jsExercises = getExercisesByLanguage('javascript');
  const jsTotal = jsExercises.length;
  const jsDone = jsExercises.filter(e => progress.completedIds.includes(e.id)).length;
  const jsPercent = jsTotal > 0 ? Math.round((jsDone / jsTotal) * 100) : 0;

  // Streak calculations (America/Fortaleza)
  const streakInfo = calculateEffectiveStreak(progress.streak);
  const weekDays = getCurrentWeekDays(progress.streak?.activeDates || []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* 1. Saudação Curta & Identificação da Linguagem Ativa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <span>DevPrática</span>
            <span className="text-slate-600">·</span>
            <span>Trilha {currentLang === 'php' ? 'PHP (Prioritária)' : 'JavaScript'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Olá, Desenvolvedor 👋
          </h1>
          <p className="text-xs text-slate-400">
            Foco no aprendizado prático com exercícios interativos e problemas reais de produção.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Fuso: America/Fortaleza</span>
        </div>
      </div>

      {/* Grid: 2. Ofensiva em Destaque & 3. Card Principal de Continuação */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* 2. Ofensiva em Destaque (5 colunas) */}
        <div className="md:col-span-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Ofensiva de Estudos
              </span>
              <span className="text-2xl">🔥</span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tabular-nums">
                {streakInfo.count}
              </span>
              <span className="text-sm font-semibold text-amber-300">
                {streakInfo.count === 1 ? 'dia consecutivo' : 'dias consecutivos'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {streakInfo.isActiveToday ? (
                <span className="text-emerald-400 font-medium">
                  ✓ Atividade concluída hoje! Sua ofensiva foi mantida.
                </span>
              ) : streakInfo.isAtRisk ? (
                <span className="text-amber-300 font-medium">
                  ⚡ Sequência de ontem preservada! Conclua um exercício hoje para somar mais 1 dia.
                </span>
              ) : (
                <span className="text-slate-400">
                  A ofensiva começa em 1 dia assim que você concluir o seu primeiro exercício.
                </span>
              )}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Regra: 1 dia por calendário (Fortaleza)</span>
            <span className="font-mono text-amber-400/80">Hoje: {getFortalezaDateString()}</span>
          </div>
        </div>

        {/* 3. Card Principal de Continuação dos Estudos (7 colunas) */}
        <div className="md:col-span-7 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 p-5 shadow-lg flex flex-col justify-between">
          {nextExercise ? (
            <>
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Próximo Exercício Recomendado
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${
                      getExerciseTypeTheme(nextExercise.type).badgeClass
                    }`}
                  >
                    {getExerciseTypeTheme(nextExercise.type).label}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-1.5 line-clamp-1">
                  {nextExercise.title}
                </h2>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {nextExercise.summary}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className={`font-medium ${getDifficultyTheme(nextExercise.difficulty).textClass}`}>
                    {getDifficultyTheme(nextExercise.difficulty).label}
                  </span>
                  <span>·</span>
                  <span>{nextExercise.topic}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  Progresso na trilha: <strong className="text-white font-mono">{completedInLang}/{totalInLang}</strong>
                </span>
                <button
                  onClick={() => onStartExercise(nextExercise.id)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continuar Estudos</span>
                  <span>→</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-6 text-center space-y-3">
              <span className="text-3xl">🏆</span>
              <h3 className="text-base font-bold text-white">Parabéns! Trilha {currentLang.toUpperCase()} Concluída</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Você concluiu todos os {totalInLang} desafios desta linguagem. Alterne para a outra trilha ou revise suas soluções.
              </p>
              <button
                onClick={onNavigateToExercises}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Revisar Exercícios
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Seletor de Linguagem & 5. Progresso Resumido por Linguagem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PHP Card */}
        <div
          onClick={() => onSelectLanguage('php')}
          className={`cursor-pointer rounded-xl border p-4 transition-all ${
            currentLang === 'php'
              ? 'border-indigo-500/70 bg-indigo-950/20 shadow-md ring-1 ring-indigo-500/20'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐘</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">PHP</h3>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    Principal
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Backend, PDO, POO, Sessões & CRUD</span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-slate-200">
              {phpDone}/{phpTotal}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 mb-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${phpPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{phpPercent}% concluído</span>
            <span>{phpTotal - phpDone} restantes</span>
          </div>
        </div>

        {/* JavaScript Card */}
        <div
          onClick={() => onSelectLanguage('javascript')}
          className={`cursor-pointer rounded-xl border p-4 transition-all ${
            currentLang === 'javascript'
              ? 'border-amber-500/70 bg-amber-950/20 shadow-md ring-1 ring-amber-500/20'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">JavaScript</h3>
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    Complementar
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">ES6+, Promises, Métodos de Array & Async</span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-slate-200">
              {jsDone}/{jsTotal}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 mb-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${jsPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{jsPercent}% concluído</span>
            <span>{jsTotal - jsDone} restantes</span>
          </div>
        </div>
      </div>

      {/* 6. Visão Semanal dos Dias de Estudo */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Visão Semanal de Estudos</span>
            <span className="text-slate-400">(Segunda a Domingo)</span>
          </div>
          <span className="text-[11px] text-slate-500">Dias com pelo menos 1 exercício concluído</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => (
            <div
              key={day.dateStr}
              className={`rounded-lg p-2.5 text-center flex flex-col items-center justify-center transition-all ${
                day.isToday
                  ? 'border border-indigo-500/60 bg-indigo-950/30'
                  : 'border border-slate-800/80 bg-slate-950/50'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-semibold mb-1">{day.dayShort}</span>
              <span className="text-xs font-bold text-slate-200 mb-1.5">{day.dayNumber}</span>
              {day.hasActivity ? (
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                  ✓
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-600">
                  ○
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. Desafios de Programação com IA Banner */}
      {onNavigateToAiChallenges && (
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/40 p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300">
              <span>✨</span>
              <span>Novidade • Gerador de Desafios Técnicos</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Quer treinar com problemas reais do mercado?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Deixe a IA atuar como desenvolvedor sênior criando desafios sob medida para PHP e JavaScript, com requisitos claros, casos de teste e avaliação automática de 0 a 10.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToAiChallenges}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Gerar Desafio com IA</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* 8. Acesso Rápido às Demais Áreas da Plataforma */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
        <button
          onClick={onNavigateToExercises}
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all text-left flex items-center justify-between cursor-pointer group"
        >
          <div>
            <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              Catálogo Geral →
            </div>
            <div className="text-[11px] text-slate-400">Trilha curricular completa</div>
          </div>
          <span className="text-base">📚</span>
        </button>

        {onNavigateToAiChallenges && (
          <button
            onClick={onNavigateToAiChallenges}
            className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-950/40 transition-all text-left flex items-center justify-between cursor-pointer group"
          >
            <div>
              <div className="text-xs font-bold text-indigo-300 group-hover:text-white transition-colors">
                Desafios com IA →
              </div>
              <div className="text-[11px] text-slate-400">Problemas práticos customizados</div>
            </div>
            <span className="text-base">✨</span>
          </button>
        )}

        <button
          onClick={onNavigateToProgress}
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all text-left flex items-center justify-between cursor-pointer group"
        >
          <div>
            <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              Métricas & Streak →
            </div>
            <div className="text-[11px] text-slate-400">Taxa de acerto e histórico</div>
          </div>
          <span className="text-base">📊</span>
        </button>

        <button
          onClick={onNavigateToGuide}
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all text-left flex items-center justify-between cursor-pointer group"
        >
          <div>
            <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              Guia de Estudo →
            </div>
            <div className="text-[11px] text-slate-400">Boas práticas e arquitetura</div>
          </div>
          <span className="text-base">💡</span>
        </button>
      </div>
    </div>
  );
};

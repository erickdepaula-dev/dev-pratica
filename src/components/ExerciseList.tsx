import React, { useState, useMemo, useEffect } from 'react';
import { Exercise, Language, Difficulty, ExerciseType, UserProgress } from '../types/exercise';
import { getExercisesByLanguage, getAvailableTopics } from '../data';

interface ExerciseListProps {
  progress: UserProgress;
  onSelectLanguage: (lang: Language) => void;
  onSelectExercise: (exerciseId: string) => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  progress,
  onSelectLanguage,
  onSelectExercise,
}) => {
  const currentLang = progress.selectedLanguage;
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'todos'>('todos');
  const [selectedTopic, setSelectedTopic] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<ExerciseType | 'todos'>('todos');
  const [selectedStatus, setSelectedStatus] = useState<'todos' | 'concluidos' | 'pendentes'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const exercises = useMemo(() => {
    return getExercisesByLanguage(currentLang);
  }, [currentLang]);

  const availableTopics = useMemo(() => {
    return getAvailableTopics(currentLang);
  }, [currentLang]);

  useEffect(() => {
    setSelectedTopic('todos');
  }, [currentLang]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      // Difficulty
      if (selectedDifficulty !== 'todos' && ex.difficulty !== selectedDifficulty) {
        return false;
      }
      // Topic
      if (selectedTopic !== 'todos' && ex.topic !== selectedTopic) {
        return false;
      }
      // Type
      if (selectedType !== 'todos' && ex.type !== selectedType) {
        return false;
      }
      // Status
      const isDone = progress.completedIds.includes(ex.id);
      if (selectedStatus === 'concluidos' && !isDone) {
        return false;
      }
      if (selectedStatus === 'pendentes' && isDone) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ex.title.toLowerCase().includes(q);
        const matchesSummary = ex.summary.toLowerCase().includes(q);
        const matchesTopic = ex.topic.toLowerCase().includes(q);
        const matchesDescription = ex.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesTopic && !matchesDescription) {
          return false;
        }
      }
      return true;
    });
  }, [exercises, selectedDifficulty, selectedTopic, selectedType, selectedStatus, searchQuery, progress.completedIds]);

  const getTypeMeta = (type: ExerciseType) => {
    switch (type) {
      case 'lacunas':
        return { label: 'Lacunas', badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'corrigir_erros':
        return { label: 'Corrigir Erro', badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      case 'prever_saida':
        return { label: 'Prever Saída', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'desafio_pratico':
        return { label: 'Desafio Prático', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'codigo_livre':
        return { label: 'Código Livre', badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      default:
        return { label: 'Exercício', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      {/* Top Filter and Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
            <span>Catálogo de Desafios</span>
            <span aria-hidden="true">·</span>
            <span className="uppercase">{currentLang}</span>
            <span aria-hidden="true">·</span>
            <span>{filteredExercises.length} de {exercises.length}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Exercícios em {currentLang === 'php' ? 'PHP' : 'JavaScript'}
          </h1>
          <p className="text-xs text-slate-400">
            Alternância de formatos: preencha lacunas, corrija bugs, preveja saídas e resolva desafios práticos.
          </p>
        </div>

        {/* Quick Language Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center">
            <button
              onClick={() => onSelectLanguage('php')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentLang === 'php'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🐘 PHP (Principal)
            </button>
            <button
              onClick={() => onSelectLanguage('javascript')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentLang === 'javascript'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ JavaScript
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-3">
        {/* Row 1: Search & Level & Status */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, assunto, palavra-chave..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
          </div>

          {/* Difficulty Segmented */}
          <div className="flex flex-wrap items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            {(['todos', 'basico', 'intermediario', 'avancado', 'dev'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors whitespace-nowrap ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff === 'todos' ? 'Todos os Níveis' : diff === 'dev' ? 'DEV (PO)' : diff}
              </button>
            ))}
          </div>

          {/* Status Segmented */}
          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            {(['todos', 'pendentes', 'concluidos'] as const).map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap capitalize ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Modalidade (Type) Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Modalidade:</span>
          {(
            [
              { id: 'todos', label: 'Todos os Formatos' },
              { id: 'lacunas', label: 'Lacunas' },
              { id: 'corrigir_erros', label: 'Corrigir Erro' },
              { id: 'prever_saida', label: 'Prever Saída' },
              { id: 'codigo_livre', label: 'Código Livre' },
              { id: 'desafio_pratico', label: 'Desafios Práticos' },
            ] as const
          ).map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id as any)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                selectedType === t.id
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Row 3: Topic Dropdown Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <label
              htmlFor="select-topic"
              className="text-[11px] text-slate-400 font-medium whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="text-xs">🏷️</span>
              <span>Assunto:</span>
            </label>

            <div className="relative min-w-[240px] max-w-sm flex-1 sm:flex-initial">
              <select
                id="select-topic"
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="todos">Todos os Assuntos ({availableTopics.length} disponíveis)</option>
                {availableTopics.map(topic => {
                  const topicCount = exercises.filter(e => e.topic === topic).length;
                  return (
                    <option key={topic} value={topic}>
                      {topic} ({topicCount})
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {selectedTopic !== 'todos' && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 px-2.5 py-1 rounded-lg text-xs">
                  <span className="font-medium">{selectedTopic}</span>
                  <button
                    onClick={() => setSelectedTopic('todos')}
                    className="hover:text-white ml-0.5 text-indigo-400 hover:text-white font-bold leading-none"
                    title="Remover filtro de assunto"
                    aria-label="Remover filtro de assunto"
                  >
                    ×
                  </button>
                </span>
                <button
                  onClick={() => setSelectedTopic('todos')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                >
                  Limpar
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 self-end sm:self-auto">
            Mostrando <span className="font-semibold text-slate-300">{filteredExercises.length}</span> de{' '}
            <span className="text-slate-300">{exercises.length}</span> exercícios
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center space-y-3">
          <p className="text-sm text-slate-400">Nenhum exercício encontrado com os filtros selecionados.</p>
          <button
            onClick={() => {
              setSelectedDifficulty('todos');
              setSelectedTopic('todos');
              setSelectedType('todos');
              setSelectedStatus('todos');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map(ex => {
            const isCompleted = progress.completedIds.includes(ex.id);
            const attempt = progress.attempts[ex.id];
            const typeMeta = getTypeMeta(ex.type);

            return (
              <div
                key={ex.id}
                onClick={() => onSelectExercise(ex.id)}
                className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-500/50 hover:bg-slate-900/70 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="capitalize font-semibold text-slate-300">
                      {ex.difficulty === 'dev' ? 'DEV • Projeto PO' : ex.difficulty}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${typeMeta.badgeColor}`}>
                      {typeMeta.label}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mb-1.5 line-clamp-1">
                    {ex.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                    {ex.summary}
                  </p>

                  <div className="text-[11px] text-slate-500 font-medium">
                    Tópico: {ex.topic}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={isCompleted ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                      {isCompleted ? '✓ Concluído' : '○ Pendente'}
                    </span>
                    {attempt && attempt.attemptsCount > 0 && !isCompleted && (
                      <span className="text-amber-400/80 text-[11px]">({attempt.attemptsCount}x)</span>
                    )}
                  </div>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform font-bold text-xs">
                    {isCompleted ? 'Revisar →' : 'Resolver →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, CircleCheckBig, Circle, Search, Tag, X } from 'lucide-react';
import { Exercise, Language, Difficulty, ExerciseType, UserProgress } from '../types/exercise';
import { getExercisesByLanguage, getAvailableTopics } from '../data';
import { getDifficultyTheme, getExerciseTypeTheme, getLanguageTheme } from '../utils/exerciseTheme';
import { LanguagePills } from './LanguagePills';

interface ExerciseListProps {
  progress: UserProgress;
  onSelectLanguage: (lang: Language) => void;
  onSelectExercise: (exerciseId: string) => void;
}

type StatusFilter = 'todos' | 'concluidos' | 'pendentes';

interface ChipOption<T extends string> {
  id: T;
  label: string;
}

const DIFFICULTY_OPTIONS: ChipOption<Difficulty | 'todos'>[] = [
  { id: 'todos', label: 'Todos os níveis' },
  { id: 'basico', label: getDifficultyTheme('basico').label },
  { id: 'intermediario', label: getDifficultyTheme('intermediario').label },
  { id: 'avancado', label: getDifficultyTheme('avancado').label },
  { id: 'dev', label: 'DEV (PO)' },
];

const STATUS_OPTIONS: ChipOption<StatusFilter>[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendentes', label: 'Pendentes' },
  { id: 'concluidos', label: 'Concluídos' },
];

const TYPE_OPTIONS: ChipOption<ExerciseType | 'todos'>[] = [
  { id: 'todos', label: 'Todos os formatos' },
  ...(['lacunas', 'corrigir_erros', 'prever_saida', 'codigo_livre', 'desafio_pratico'] as const).map(type => ({
    id: type,
    label: getExerciseTypeTheme(type).shortLabel,
  })),
];

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-from';

interface ChipGroupProps<T extends string> {
  /** Identificador único do grupo — usado no layoutId do indicador. */
  groupId: string;
  label: string;
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Grupo de chips de seleção única; o chip ativo recebe o gradiente assinatura. */
function ChipGroup<T extends string>({ groupId, label, options, value, onChange }: ChipGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      {options.map(option => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.id)}
            className={`relative px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap cursor-pointer transition-colors ${FOCUS_RING} ${
              isActive
                ? 'border-transparent text-white'
                : 'border-subtle bg-canvas/60 text-muted hover:text-primary hover:border-accent-from/40'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={`chip-${groupId}`}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                className="absolute inset-0 rounded-full bg-gradient-accent shadow-glow"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  attemptsCount: number;
  onSelect: () => void;
  /** Repassado ao elemento raiz — exigido pelo AnimatePresence mode="popLayout". */
  ref?: React.Ref<HTMLButtonElement>;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, isCompleted, attemptsCount, onSelect, ref }) => {
  const typeTheme = getExerciseTypeTheme(exercise.type);
  const difficultyTheme = getDifficultyTheme(exercise.difficulty);

  return (
    <motion.button
      ref={ref}
      type="button"
      layout="position"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onSelect}
      className={`group text-left cursor-pointer rounded-card border border-subtle bg-surface p-4 shadow-card flex flex-col justify-between transition-[border-color,box-shadow,background-color] duration-200 hover:border-accent-from/40 hover:shadow-glow hover:bg-surface-hover ${FOCUS_RING}`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 text-xs mb-2">
          <span className={`font-semibold ${difficultyTheme.textClass}`}>{difficultyTheme.label}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${typeTheme.badgeClass}`}>
            {typeTheme.shortLabel}
          </span>
        </div>

        <h3 className="text-sm font-bold text-primary group-hover:text-accent transition-colors mb-1.5 line-clamp-1">
          {exercise.title}
        </h3>

        <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-2.5">{exercise.summary}</p>

        <div className="text-[11px] text-muted/80 font-medium line-clamp-1">Tópico: {exercise.topic}</div>
      </div>

      <div className="w-full pt-3 mt-3 border-t border-subtle flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="text-success font-semibold flex items-center gap-1">
              <CircleCheckBig className="w-3.5 h-3.5" aria-hidden="true" /> Concluído
            </span>
          ) : (
            <span className="text-muted flex items-center gap-1">
              <Circle className="w-3.5 h-3.5" aria-hidden="true" /> Pendente
            </span>
          )}
          {attemptsCount > 0 && !isCompleted && (
            <span className="text-warning text-[11px]">({attemptsCount}x)</span>
          )}
        </div>
        <span className="text-accent font-bold text-xs flex items-center gap-1">
          {isCompleted ? 'Revisar' : 'Resolver'}
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
      </div>
    </motion.button>
  );
};

interface EmptyStateProps {
  activeFilters: string[];
  onClear: () => void;
}

/** Estado vazio ilustrado: lupa sobre um "arquivo de código" vazio. */
const EmptyState: React.FC<EmptyStateProps> = ({ activeFilters, onClear }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    className="rounded-card border border-dashed border-subtle bg-surface/40 px-6 py-12 flex flex-col items-center text-center gap-4"
  >
    <svg width="132" height="104" viewBox="0 0 132 104" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="empty-state-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--accent-from)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--accent-to)' }} />
        </linearGradient>
      </defs>
      {/* Arquivo */}
      <rect x="18" y="8" width="70" height="88" rx="10" style={{ fill: 'var(--bg-surface-hover)', stroke: 'var(--border-subtle)' }} strokeWidth="2" />
      <rect x="30" y="24" width="28" height="5" rx="2.5" style={{ fill: 'var(--border-subtle)' }} />
      <rect x="30" y="36" width="44" height="5" rx="2.5" style={{ fill: 'var(--border-subtle)' }} />
      <rect x="38" y="48" width="30" height="5" rx="2.5" style={{ fill: 'var(--border-subtle)' }} />
      <rect x="30" y="60" width="20" height="5" rx="2.5" style={{ fill: 'var(--border-subtle)' }} />
      {/* Lupa */}
      <circle cx="88" cy="62" r="20" style={{ fill: 'var(--bg-base)' }} stroke="url(#empty-state-accent)" strokeWidth="5" />
      <path d="M102 77 L118 93" stroke="url(#empty-state-accent)" strokeWidth="7" strokeLinecap="round" />
      <path d="M81 56 L95 68 M95 56 L81 68" style={{ stroke: 'var(--text-muted)' }} strokeWidth="3" strokeLinecap="round" />
    </svg>

    <div className="space-y-1">
      <h3 className="text-sm font-bold text-primary">Nenhum exercício encontrado</h3>
      <p className="text-xs text-muted max-w-sm">
        Nenhum exercício combina com todos os filtros ao mesmo tempo. Tente remover algum deles.
      </p>
    </div>

    {activeFilters.length > 0 && (
      <ul className="flex flex-wrap justify-center gap-1.5" aria-label="Filtros ativos">
        {activeFilters.map(filter => (
          <li key={filter} className="text-[11px] px-2 py-0.5 rounded-full border border-subtle bg-canvas/60 text-muted">
            {filter}
          </li>
        ))}
      </ul>
    )}

    <button
      type="button"
      onClick={onClear}
      className={`px-4 py-2 rounded-control bg-gradient-accent text-white text-xs font-semibold shadow-glow transition-[filter] hover:brightness-110 cursor-pointer ${FOCUS_RING}`}
    >
      Limpar todos os filtros
    </button>
  </motion.div>
);

export const ExerciseList: React.FC<ExerciseListProps> = ({ progress, onSelectLanguage, onSelectExercise }) => {
  const currentLang = progress.selectedLanguage;
  const langTheme = getLanguageTheme(currentLang);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'todos'>('todos');
  const [selectedTopic, setSelectedTopic] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<ExerciseType | 'todos'>('todos');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const exercises = useMemo(() => getExercisesByLanguage(currentLang), [currentLang]);
  const availableTopics = useMemo(() => getAvailableTopics(currentLang), [currentLang]);

  useEffect(() => {
    setSelectedTopic('todos');
  }, [currentLang]);

  const filteredExercises = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return exercises.filter(ex => {
      if (selectedDifficulty !== 'todos' && ex.difficulty !== selectedDifficulty) return false;
      if (selectedTopic !== 'todos' && ex.topic !== selectedTopic) return false;
      if (selectedType !== 'todos' && ex.type !== selectedType) return false;

      const isDone = progress.completedIds.includes(ex.id);
      if (selectedStatus === 'concluidos' && !isDone) return false;
      if (selectedStatus === 'pendentes' && isDone) return false;

      if (query) {
        const haystack = [ex.title, ex.summary, ex.topic, ex.description].join(' ').toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [exercises, selectedDifficulty, selectedTopic, selectedType, selectedStatus, searchQuery, progress.completedIds]);

  const activeFilters = [
    selectedDifficulty !== 'todos' && DIFFICULTY_OPTIONS.find(o => o.id === selectedDifficulty)?.label,
    selectedStatus !== 'todos' && STATUS_OPTIONS.find(o => o.id === selectedStatus)?.label,
    selectedType !== 'todos' && TYPE_OPTIONS.find(o => o.id === selectedType)?.label,
    selectedTopic !== 'todos' && selectedTopic,
    searchQuery.trim() && `“${searchQuery.trim()}”`,
  ].filter((f): f is string => Boolean(f));

  const clearAllFilters = () => {
    setSelectedDifficulty('todos');
    setSelectedTopic('todos');
    setSelectedType('todos');
    setSelectedStatus('todos');
    setSearchQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-subtle">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="text-gradient-accent">Catálogo de desafios</span>
            <span className="text-muted" aria-hidden="true">
              ·
            </span>
            <span className="text-muted">
              {filteredExercises.length} de {exercises.length}
            </span>
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tight">Exercícios em {langTheme.name}</h1>
          <p className="text-xs text-muted">
            Alternância de formatos: preencha lacunas, corrija bugs, preveja saídas e resolva desafios práticos.
          </p>
        </div>

        <div className="self-start md:self-auto">
          <LanguagePills
            selectedLanguage={currentLang}
            onSelectLanguage={onSelectLanguage}
            indicatorId="catalog-lang-indicator"
            showFullName
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-card border border-subtle bg-surface p-4 space-y-3 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, assunto, palavra-chave..."
            aria-label="Buscar exercícios"
            className="w-full pl-9 pr-9 py-2 bg-canvas border border-subtle rounded-control text-xs text-primary placeholder:text-muted/70 focus:outline-none focus:border-accent-from focus:ring-2 focus:ring-accent-from/30 transition-[border-color,box-shadow]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Limpar busca"
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted hover:text-primary cursor-pointer ${FOCUS_RING}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid gap-3 lg:grid-cols-[auto_1fr] lg:items-center">
          <span className="text-[11px] text-muted font-medium">Nível</span>
          <ChipGroup
            groupId="difficulty"
            label="Filtrar por nível"
            options={DIFFICULTY_OPTIONS}
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
          />

          <span className="text-[11px] text-muted font-medium">Status</span>
          <ChipGroup
            groupId="status"
            label="Filtrar por status"
            options={STATUS_OPTIONS}
            value={selectedStatus}
            onChange={setSelectedStatus}
          />

          <span className="text-[11px] text-muted font-medium">Modalidade</span>
          <ChipGroup
            groupId="type"
            label="Filtrar por modalidade"
            options={TYPE_OPTIONS}
            value={selectedType}
            onChange={setSelectedType}
          />
        </div>

        {/* Assunto */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-subtle">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <label
              htmlFor="select-topic"
              className="text-[11px] text-muted font-medium whitespace-nowrap flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Assunto</span>
            </label>

            <div className="relative w-full sm:w-auto sm:min-w-[240px] max-w-sm">
              <select
                id="select-topic"
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="w-full bg-canvas border border-subtle hover:border-accent-from/40 text-primary text-xs rounded-control px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-accent-from focus:ring-2 focus:ring-accent-from/30 transition-colors cursor-pointer"
              >
                <option value="todos">Todos os assuntos ({availableTopics.length} disponíveis)</option>
                {availableTopics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic} ({exercises.filter(e => e.topic === topic).length})
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted"
                aria-hidden="true"
              />
            </div>

            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className={`text-[11px] text-muted hover:text-primary underline underline-offset-2 rounded cursor-pointer ${FOCUS_RING}`}
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="text-[11px] text-muted self-end sm:self-auto" aria-live="polite">
            Mostrando <span className="font-semibold text-primary">{filteredExercises.length}</span> de{' '}
            <span className="text-primary">{exercises.length}</span> exercícios
          </div>
        </div>
      </div>

      {/* Grade de exercícios */}
      <AnimatePresence mode="wait" initial={false}>
        {filteredExercises.length === 0 ? (
          <EmptyState key="empty" activeFilters={activeFilters} onClear={clearAllFilters} />
        ) : (
          <motion.div
            key="grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredExercises.map(ex => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  isCompleted={progress.completedIds.includes(ex.id)}
                  attemptsCount={progress.attempts[ex.id]?.attemptsCount ?? 0}
                  onSelect={() => onSelectExercise(ex.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

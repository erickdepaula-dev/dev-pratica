import React from 'react';
import { motion, Variants } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleCheckBig,
  Library,
  ListTodo,
  LucideIcon,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { UserProgress, Language } from '../types/exercise';
import { getExercisesByLanguage } from '../data';
import { calculateEffectiveStreak } from '../services/storage';
import { getCurrentWeekDays, getFortalezaDateString } from '../utils/dateUtils';
import { getDifficultyTheme, getExerciseTypeTheme, getLanguageTheme } from '../utils/exerciseTheme';
import { ProgressRing } from './ProgressRing';

interface DashboardProps {
  progress: UserProgress;
  onSelectLanguage: (lang: Language) => void;
  onStartExercise: (exerciseId: string) => void;
  onNavigateToExercises: () => void;
  onNavigateToProgress: () => void;
  onNavigateToGuide: () => void;
  onNavigateToAiChallenges?: () => void;
}

/** Trilhas exibidas no grid de progresso, na ordem. A trilha TS entra aqui na Fase 2. */
const TRACKS: Language[] = ['php', 'javascript'];

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-from';

/** Card base: superfície + borda sutil + brilho no hover. */
const CARD =
  'rounded-card border border-subtle bg-surface shadow-card transition-[border-color,box-shadow,background-color] duration-200';
const CARD_HOVER = 'hover:border-accent-from/40 hover:shadow-glow hover:bg-surface-hover';

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  hint: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, hint }) => (
  <motion.div variants={itemVariants} className={`${CARD} ${CARD_HOVER} p-4`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</span>
      <Icon className="w-4 h-4 text-accent-to" aria-hidden="true" />
    </div>
    <div className="text-2xl font-black text-primary font-mono tabular-nums">{value}</div>
    <div className="text-[11px] text-muted mt-0.5">{hint}</div>
  </motion.div>
);

interface TrackCardProps {
  language: Language;
  isActive: boolean;
  done: number;
  total: number;
  onSelect: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ language, isActive, done, total, onSelect }) => {
  const theme = getLanguageTheme(language);
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <motion.button
      type="button"
      variants={itemVariants}
      onClick={onSelect}
      aria-pressed={isActive}
      className={`${CARD} p-4 text-left cursor-pointer ${FOCUS_RING} ${
        isActive ? theme.activeClass : CARD_HOVER
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl" aria-hidden="true">
            {theme.emoji}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-primary">{theme.name}</h3>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${theme.tagClass}`}>
                {theme.tag}
              </span>
            </div>
            <span className="text-[11px] text-muted line-clamp-1">{theme.description}</span>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-primary shrink-0">
          {done}/{total}
        </span>
      </div>

      {/* Barra animada com scaleX (evita animar width) */}
      <div className="w-full bg-subtle rounded-full h-2 mb-1.5 overflow-hidden">
        <motion.div
          className={`h-2 rounded-full origin-left ${theme.barClass}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: percent / 100 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-muted">
        <span>{percent}% concluído</span>
        <span>{total - done} restantes</span>
      </div>
    </motion.button>
  );
};

/** Placeholder da trilha TypeScript até a Fase 2. */
const UpcomingTrackCard: React.FC = () => (
  <motion.div
    variants={itemVariants}
    className="rounded-card border border-dashed border-subtle bg-surface/50 p-4 flex flex-col justify-between"
  >
    <div className="flex items-center gap-2.5 mb-3">
      <span className="w-8 h-8 rounded-md bg-surface-hover border border-subtle flex items-center justify-center font-mono text-xs font-black text-muted">
        TS
      </span>
      <div>
        <h3 className="font-bold text-sm text-primary">TypeScript</h3>
        <span className="text-[11px] text-muted">Tipos, generics e utilitários</span>
      </div>
    </div>
    <span className="self-start text-[10px] uppercase font-bold tracking-wider text-muted bg-surface-hover border border-subtle px-2 py-0.5 rounded">
      Em breve
    </span>
  </motion.div>
);

interface QuickLinkProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const QuickLink: React.FC<QuickLinkProps> = ({ icon: Icon, title, subtitle, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${CARD} ${CARD_HOVER} group p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer ${FOCUS_RING}`}
  >
    <div className="min-w-0">
      <div className="text-xs font-bold text-primary group-hover:text-accent-to transition-colors flex items-center gap-1">
        {title}
        <ArrowRight
          className="w-3 h-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </div>
      <div className="text-[11px] text-muted">{subtitle}</div>
    </div>
    <Icon className="w-4 h-4 text-muted group-hover:text-accent-to transition-colors shrink-0" aria-hidden="true" />
  </button>
);

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
  const currentTheme = getLanguageTheme(currentLang);
  const langExercises = getExercisesByLanguage(currentLang);
  const totalInLang = langExercises.length;
  const completedInLang = langExercises.filter(ex => progress.completedIds.includes(ex.id)).length;
  const overallPercent = totalInLang > 0 ? (completedInLang / totalInLang) * 100 : 0;

  // Próximo exercício não concluído da trilha ativa
  const nextExercise = langExercises.find(ex => !progress.completedIds.includes(ex.id));

  const trackStats = TRACKS.map(language => {
    const exercises = getExercisesByLanguage(language);
    return {
      language,
      total: exercises.length,
      done: exercises.filter(e => progress.completedIds.includes(e.id)).length,
    };
  });
  const totalDone = trackStats.reduce((sum, t) => sum + t.done, 0);
  const totalAll = trackStats.reduce((sum, t) => sum + t.total, 0);

  // Ofensiva (America/Fortaleza)
  const streakInfo = calculateEffectiveStreak(progress.streak);
  const weekDays = getCurrentWeekDays(progress.streak?.activeDates || []);
  const activeDaysCount = progress.streak?.activeDates?.length ?? 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 font-sans"
    >
      {/* 1. Saudação e trilha ativa */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-subtle"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="text-gradient-accent">DevPrática</span>
            <span className="text-muted">·</span>
            <span className="text-muted">
              Trilha {currentTheme.name} ({currentTheme.tag})
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-primary tracking-tight">Olá, Desenvolvedor 👋</h1>
          <p className="text-xs text-muted">
            Foco no aprendizado prático com exercícios interativos e problemas reais de produção.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-surface border border-subtle px-3 py-1.5 rounded-control text-xs text-muted">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse motion-reduce:animate-none" />
          <span>Fuso: America/Fortaleza</span>
        </div>
      </motion.div>

      {/* 2. Continuar de onde parei — destaque com borda em gradiente */}
      <motion.div variants={itemVariants} className="rounded-card p-px bg-gradient-accent shadow-glow">
        <div className="rounded-[calc(var(--radius-card)-1px)] bg-surface bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--accent-from)_22%,transparent),transparent_60%)] p-5 sm:p-6">
          {nextExercise ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <ProgressRing percent={overallPercent} label={`Progresso na trilha ${currentTheme.name}`} />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gradient-accent">
                    Continuar de onde parei
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border ${
                      getExerciseTypeTheme(nextExercise.type).badgeClass
                    }`}
                  >
                    {getExerciseTypeTheme(nextExercise.type).label}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-primary mb-1 line-clamp-1">{nextExercise.title}</h2>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-2">{nextExercise.summary}</p>

                <div className="flex items-center gap-2 text-[11px] text-muted">
                  <span className={`font-medium ${getDifficultyTheme(nextExercise.difficulty).textClass}`}>
                    {getDifficultyTheme(nextExercise.difficulty).label}
                  </span>
                  <span>·</span>
                  <span>{nextExercise.topic}</span>
                  <span>·</span>
                  <span className="font-mono">
                    {completedInLang}/{totalInLang}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartExercise(nextExercise.id)}
                className={`group shrink-0 px-5 py-3 rounded-control bg-gradient-accent text-white text-sm font-bold shadow-glow transition-[filter,transform] hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${FOCUS_RING}`}
              >
                <span>Continuar estudos</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </button>
            </div>
          ) : (
            <div className="py-4 text-center space-y-3">
              <Trophy className="w-8 h-8 mx-auto text-warning" aria-hidden="true" />
              <h3 className="text-base font-bold text-primary">Parabéns! Trilha {currentTheme.name} concluída</h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Você concluiu todos os {totalInLang} desafios desta linguagem. Alterne para outra trilha ou revise
                suas soluções.
              </p>
              <button
                type="button"
                onClick={onNavigateToExercises}
                className={`px-4 py-2 rounded-control bg-surface-hover border border-subtle hover:border-accent-from/40 text-primary text-xs font-semibold transition-colors cursor-pointer ${FOCUS_RING}`}
              >
                Revisar exercícios
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* 3. Estatísticas */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={CircleCheckBig}
          label="Na trilha"
          value={`${completedInLang}`}
          hint={`de ${totalInLang} em ${currentTheme.name}`}
        />
        <StatCard icon={ListTodo} label="Restantes" value={totalInLang - completedInLang} hint="nesta trilha" />
        <StatCard icon={Trophy} label="Total geral" value={totalDone} hint={`de ${totalAll} exercícios`} />
        <StatCard icon={CalendarDays} label="Dias de estudo" value={activeDaysCount} hint="com exercício concluído" />
      </motion.div>

      {/* 4. Ofensiva e semana (refinados na tarefa 1.4) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <motion.div
          variants={itemVariants}
          className="md:col-span-5 rounded-card border border-streak-from/30 bg-surface bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--streak-from)_14%,transparent),transparent_70%)] p-5 shadow-card flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-streak-from">Ofensiva de estudos</span>
              <span className="text-2xl" aria-hidden="true">
                🔥
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-black text-primary font-mono tabular-nums">
                {streakInfo.count}
              </span>
              <span className="text-sm font-semibold text-streak-from">
                {streakInfo.count === 1 ? 'dia consecutivo' : 'dias consecutivos'}
              </span>
            </div>

            <p className="text-xs leading-relaxed">
              {streakInfo.isActiveToday ? (
                <span className="text-success font-medium">✓ Atividade concluída hoje! Sua ofensiva foi mantida.</span>
              ) : streakInfo.isAtRisk ? (
                <span className="text-warning font-medium">
                  ⚡ Sequência de ontem preservada! Conclua um exercício hoje para somar mais 1 dia.
                </span>
              ) : (
                <span className="text-muted">
                  A ofensiva começa em 1 dia assim que você concluir o seu primeiro exercício.
                </span>
              )}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-subtle text-[11px] text-muted flex items-center justify-between gap-2">
            <span>Regra: 1 dia por calendário (Fortaleza)</span>
            <span className="font-mono text-streak-from whitespace-nowrap">Hoje: {getFortalezaDateString()}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={`${CARD} md:col-span-7 p-5 space-y-3`}>
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
            <span className="font-bold text-primary">Visão semanal de estudos</span>
            <span className="text-[11px] text-muted">Dias com pelo menos 1 exercício concluído</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekDays.map(day => (
              <div
                key={day.dateStr}
                className={`rounded-control py-2.5 text-center flex flex-col items-center justify-center border ${
                  day.isToday ? 'border-accent-from/60 bg-accent-from/10' : 'border-subtle bg-canvas/60'
                }`}
              >
                <span className="text-[10px] text-muted font-semibold mb-1">{day.dayShort}</span>
                <span className="text-xs font-bold text-primary mb-1.5">{day.dayNumber}</span>
                {day.hasActivity ? (
                  <span className="w-5 h-5 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-[10px] text-success font-bold">
                    ✓
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-subtle flex items-center justify-center text-[10px] text-muted">
                    ○
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 5. Progresso por trilha, lado a lado */}
      <section aria-labelledby="tracks-heading" className="space-y-3">
        <motion.h2
          variants={itemVariants}
          id="tracks-heading"
          className="text-xs font-bold uppercase tracking-wider text-muted"
        >
          Suas trilhas
        </motion.h2>
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trackStats.map(track => (
            <TrackCard
              key={track.language}
              language={track.language}
              isActive={currentLang === track.language}
              done={track.done}
              total={track.total}
              onSelect={() => onSelectLanguage(track.language)}
            />
          ))}
          <UpcomingTrackCard />
        </motion.div>
      </section>

      {/* 6. Banner de Desafios com IA */}
      {onNavigateToAiChallenges && (
        <motion.div
          variants={itemVariants}
          className={`${CARD} bg-[radial-gradient(ellipse_at_right,color-mix(in_srgb,var(--accent-to)_18%,transparent),transparent_65%)] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
        >
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-from/10 border border-accent-from/30 text-[11px] font-semibold text-accent-to">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              <span>Novidade • Gerador de Desafios Técnicos</span>
            </div>
            <h3 className="text-base font-bold text-primary">Quer treinar com problemas reais do mercado?</h3>
            <p className="text-xs text-muted leading-relaxed">
              Deixe a IA atuar como desenvolvedor sênior criando desafios sob medida para PHP e JavaScript, com
              requisitos claros, casos de teste e avaliação automática de 0 a 10.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToAiChallenges}
            className={`group shrink-0 px-4 py-2.5 rounded-control bg-gradient-accent text-white text-xs font-bold shadow-glow transition-[filter,transform] hover:brightness-110 active:scale-95 flex items-center gap-2 cursor-pointer ${FOCUS_RING}`}
          >
            <span>Gerar desafio com IA</span>
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      )}

      {/* 7. Acesso rápido */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickLink
          icon={Library}
          title="Catálogo geral"
          subtitle="Trilha curricular completa"
          onClick={onNavigateToExercises}
        />
        {onNavigateToAiChallenges && (
          <QuickLink
            icon={Sparkles}
            title="Desafios com IA"
            subtitle="Problemas práticos customizados"
            onClick={onNavigateToAiChallenges}
          />
        )}
        <QuickLink
          icon={ChartNoAxesColumnIncreasing}
          title="Métricas & streak"
          subtitle="Taxa de acerto e histórico"
          onClick={onNavigateToProgress}
        />
        <QuickLink
          icon={BookOpen}
          title="Guia de estudo"
          subtitle="Boas práticas e arquitetura"
          onClick={onNavigateToGuide}
        />
      </motion.div>
    </motion.div>
  );
};

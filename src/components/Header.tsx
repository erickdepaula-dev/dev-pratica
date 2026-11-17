import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Code2,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Menu,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import { Language, UserProgress } from '../types/exercise';
import { User } from 'firebase/auth';
import { calculateEffectiveStreak } from '../services/storage';

export type ActiveTab = 'dashboard' | 'exercicios' | 'desafios_ia' | 'progresso' | 'guia';

interface NavItem {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Painel', shortLabel: 'Painel', icon: LayoutDashboard },
  { id: 'exercicios', label: 'Exercícios', shortLabel: 'Exercícios', icon: Code2 },
  { id: 'desafios_ia', label: 'Desafios com IA', shortLabel: 'Desafios IA', icon: Sparkles },
  { id: 'progresso', label: 'Progresso', shortLabel: 'Progresso', icon: ChartNoAxesColumnIncreasing },
  { id: 'guia', label: 'Guia de Estudo', shortLabel: 'Guia', icon: BookOpen },
];

interface LanguageOption {
  id: Language;
  label: string;
  emoji: string;
  title: string;
}

/** Ordem e rótulos das trilhas. A trilha TypeScript (Fase 2) entra aqui. */
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'php', label: 'PHP', emoji: '🐘', title: 'PHP - Linguagem Principal de Estudo' },
  { id: 'javascript', label: 'JS', emoji: '⚡', title: 'JavaScript - Linguagem Secundária' },
];

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-from';

const INDICATOR_TRANSITION = { type: 'spring', stiffness: 500, damping: 38 } as const;

interface HeaderProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onContinueNext: () => void;
  totalCompleted: number;
  totalExercises: number;
  progress: UserProgress;
  currentUser: User | null;
  isSyncing: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onManualSync: () => void;
  /** Espaço reservado para a barra de XP (Fase 3). Não renderiza nada se omitido. */
  xpSlot?: React.ReactNode;
}

interface LanguagePillsProps {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  /** Precisa ser único por instância para não "voar" entre o desktop e o menu mobile. */
  indicatorId: string;
}

const LanguagePills: React.FC<LanguagePillsProps> = ({ selectedLanguage, onSelectLanguage, indicatorId }) => (
  <div
    role="radiogroup"
    aria-label="Trilha de linguagem"
    className="flex items-center p-0.5 bg-canvas border border-subtle rounded-full"
  >
    {LANGUAGE_OPTIONS.map(lang => {
      const isActive = selectedLanguage === lang.id;
      return (
        <button
          key={lang.id}
          type="button"
          role="radio"
          aria-checked={isActive}
          onClick={() => onSelectLanguage(lang.id)}
          title={lang.title}
          className={`relative px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap cursor-pointer transition-colors ${FOCUS_RING} ${
            isActive ? 'text-white' : 'text-muted hover:text-primary'
          }`}
        >
          {isActive && (
            <motion.span
              layoutId={indicatorId}
              transition={INDICATOR_TRANSITION}
              className="absolute inset-0 rounded-full bg-gradient-accent shadow-glow"
            />
          )}
          <span className="relative flex items-center gap-1">
            <span aria-hidden="true">{lang.emoji}</span>
            <span>{lang.label}</span>
          </span>
        </button>
      );
    })}
  </div>
);

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  selectedLanguage,
  onSelectLanguage,
  onContinueNext,
  progress,
  currentUser,
  isSyncing,
  onLogin,
  onLogout,
  onManualSync,
  xpSlot,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const streak = calculateEffectiveStreak(progress.streak).count;

  // Fecha menus com Esc e o menu do usuário ao clicar fora.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  const handleChangeTab = (tab: ActiveTab) => {
    setShowMobileMenu(false);
    onChangeTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-subtle bg-canvas/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Marca */}
          <button
            type="button"
            onClick={() => handleChangeTab('dashboard')}
            className={`group flex items-center gap-2.5 shrink-0 rounded-lg cursor-pointer ${FOCUS_RING}`}
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-accent shadow-glow flex items-center justify-center font-mono font-bold text-white text-sm transition-transform group-hover:scale-105">
              &gt;_
            </span>
            <span className="text-lg font-bold tracking-tight text-primary whitespace-nowrap">DevPrática</span>
          </button>

          {/* Navegação desktop */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChangeTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${FOCUS_RING} ${
                    isActive ? 'text-white' : 'text-muted hover:text-primary hover:bg-surface-hover'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      transition={INDICATOR_TRANSITION}
                      className="absolute inset-0 rounded-full bg-gradient-accent shadow-glow"
                    />
                  )}
                  {/* md: só ícone · lg: rótulo curto · xl: ícone + rótulo completo */}
                  <span className="relative flex items-center gap-1.5" title={item.label}>
                    <Icon className="w-4 h-4 lg:hidden xl:block" aria-hidden="true" />
                    <span className="sr-only lg:not-sr-only lg:whitespace-nowrap xl:hidden">{item.shortLabel}</span>
                    <span className="hidden xl:inline">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Área direita: XP (Fase 3), ofensiva, linguagem, conta */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {xpSlot && <div className="hidden lg:block">{xpSlot}</div>}

            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-streak-from/10 border border-streak-from/30 text-xs font-semibold text-streak-from"
              title={`${streak} dias consecutivos de estudos`}
            >
              <span aria-hidden="true">🔥</span>
              <span className="tabular-nums font-mono">{streak}</span>
              <span className="hidden sm:inline text-[11px] font-normal">dias</span>
            </div>

            <div className="hidden sm:block">
              <LanguagePills
                selectedLanguage={selectedLanguage}
                onSelectLanguage={onSelectLanguage}
                indicatorId="lang-active-indicator"
              />
            </div>

            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu(open => !open)}
                  aria-expanded={showUserMenu}
                  aria-haspopup="menu"
                  className={`flex items-center gap-2 py-1 px-2.5 rounded-full border border-success/40 bg-success/10 text-xs hover:bg-success/20 transition-colors cursor-pointer ${FOCUS_RING}`}
                  title="Conectado e sincronizado no Firebase"
                >
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse motion-reduce:animate-none" />
                  <span className="font-semibold text-primary truncate max-w-[80px] sm:max-w-[130px]">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuário'}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 origin-top-right rounded-card border border-subtle bg-surface p-3 shadow-card z-50 space-y-3"
                    >
                      <div className="text-xs space-y-1 pb-2 border-b border-subtle">
                        <div className="font-bold text-primary truncate">{currentUser.displayName || 'Estudante'}</div>
                        <div className="text-[11px] text-muted truncate">{currentUser.email}</div>
                        <div className="text-[10px] text-success pt-1">✓ Progresso sincronizado no Firestore</div>
                      </div>

                      <div className="space-y-1">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setShowUserMenu(false);
                            onManualSync();
                          }}
                          disabled={isSyncing}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium text-primary hover:bg-surface-hover transition-colors flex items-center justify-between cursor-pointer disabled:opacity-60 ${FOCUS_RING}`}
                        >
                          <span>Sincronizar agora</span>
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin motion-reduce:animate-none' : ''}`}
                            aria-hidden="true"
                          />
                        </button>

                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setShowUserMenu(false);
                            onLogout();
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium text-danger hover:bg-danger/10 transition-colors flex items-center justify-between cursor-pointer ${FOCUS_RING}`}
                        >
                          <span>Desconectar</span>
                          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={onLogin}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent-from/40 bg-accent-from/10 hover:bg-accent-from/20 text-xs font-semibold text-primary transition-colors cursor-pointer ${FOCUS_RING}`}
                title="Entrar com Google para salvar seus dias e progresso no Firebase Firestore"
              >
                <span className="hidden sm:inline">Salvar no Firebase</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onContinueNext}
              className={`hidden xl:inline-flex items-center px-4 py-1.5 text-xs font-semibold text-white bg-gradient-accent rounded-full shadow-glow transition-[filter,transform] hover:brightness-110 active:scale-95 whitespace-nowrap cursor-pointer ${FOCUS_RING}`}
            >
              Continuar
            </button>

            {/* Botão do menu mobile */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(open => !open)}
              aria-expanded={showMobileMenu}
              aria-controls="mobile-menu"
              aria-label={showMobileMenu ? 'Fechar menu' : 'Abrir menu'}
              className={`md:hidden p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer ${FOCUS_RING}`}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden absolute inset-x-0 top-full border-b border-subtle bg-canvas shadow-card"
          >
            <nav aria-label="Navegação principal" className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(item => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleChangeTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-control text-sm font-medium cursor-pointer transition-colors ${FOCUS_RING} ${
                      isActive ? 'text-white' : 'text-muted hover:text-primary hover:bg-surface-hover'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mobile-nav-active-indicator"
                        transition={INDICATOR_TRANSITION}
                        className="absolute inset-0 rounded-control bg-gradient-accent"
                      />
                    )}
                    <Icon className="relative w-4 h-4" aria-hidden="true" />
                    <span className="relative">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="sm:hidden flex items-center justify-between gap-3 px-4 pb-4 pt-1 border-t border-subtle mt-1">
              <span className="text-xs text-muted pt-3">Trilha</span>
              <div className="pt-3">
                <LanguagePills
                  selectedLanguage={selectedLanguage}
                  onSelectLanguage={onSelectLanguage}
                  indicatorId="mobile-lang-active-indicator"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

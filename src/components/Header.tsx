import React, { useState } from 'react';
import { Language, UserProgress } from '../types/exercise';
import { User } from 'firebase/auth';
import { calculateEffectiveStreak } from '../services/storage';

export type ActiveTab = 'dashboard' | 'exercicios' | 'desafios_ia' | 'progresso' | 'guia';

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
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  selectedLanguage,
  onSelectLanguage,
  onContinueNext,
  totalCompleted,
  totalExercises,
  progress,
  currentUser,
  isSyncing,
  onLogin,
  onLogout,
  onManualSync,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const streakInfo = calculateEffectiveStreak(progress.streak);
  const streak = streakInfo.count;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onChangeTab('dashboard')}
              className="text-left group flex items-center gap-2.5 focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-mono font-bold text-white text-base shadow-sm">
                &gt;_
              </div>
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                DevPrática
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              onClick={() => onChangeTab('dashboard')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Painel
            </button>

            <button
              onClick={() => onChangeTab('exercicios')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'exercicios'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Exercícios
            </button>

            <button
              onClick={() => onChangeTab('desafios_ia')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'desafios_ia'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent text-indigo-300 hover:text-white'
              }`}
            >
              <span>✨</span>
              <span>Desafios com IA</span>
            </button>

            <button
              onClick={() => onChangeTab('progresso')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'progresso'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Progresso
            </button>

            <button
              onClick={() => onChangeTab('guia')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                activeTab === 'guia'
                  ? 'border-indigo-500 text-white font-semibold'
                  : 'border-transparent'
              }`}
            >
              Guia de Estudo
            </button>
          </nav>

          {/* Right Area: Language Switcher, Streak & Firebase Cloud Sync */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300"
              title={`${streak} dias consecutivos de estudos`}
            >
              <span>🔥</span>
              <span className="tabular-nums font-mono">{streak}</span>
              <span className="hidden sm:inline text-[11px] font-normal text-amber-400/80">dias</span>
            </div>

            {/* Language Segmented Selector */}
            <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => onSelectLanguage('php')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                  selectedLanguage === 'php'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="PHP - Linguagem Principal de Estudo"
              >
                <span>🐘</span>
                <span>PHP</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectLanguage('javascript')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer ${
                  selectedLanguage === 'javascript'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="JavaScript - Linguagem Secundária"
              >
                <span>⚡</span>
                <span>JS</span>
              </button>
            </div>

            {/* Firebase Cloud Sync Status & Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-xs text-emerald-300 hover:bg-emerald-950/40 transition-colors cursor-pointer"
                  title="Conectado e sincronizado no Firebase"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-slate-200 truncate max-w-[90px] sm:max-w-[130px]">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuário'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Firebase</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50 space-y-3">
                    <div className="text-xs space-y-1 pb-2 border-b border-slate-800">
                      <div className="font-bold text-white truncate">{currentUser.displayName || 'Estudante'}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-emerald-400 pt-1 flex items-center gap-1">
                        <span>✓</span> Progresso sincronizado no Firestore
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          onManualSync();
                        }}
                        disabled={isSyncing}
                        className="w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span>Sincronizar Agora</span>
                        {isSyncing ? (
                          <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>🔄</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
                      >
                        Desconectar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/30 hover:bg-indigo-900/40 text-xs font-semibold text-indigo-200 transition-colors cursor-pointer"
                title="Entrar com Google para salvar seus dias e progresso no Firebase Firestore"
              >
                <span>🔥</span>
                <span className="hidden sm:inline">Salvar no Firebase</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={onContinueNext}
              className="hidden lg:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Continuar
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 text-xs text-slate-400 font-medium overflow-x-auto">
          <button
            onClick={() => onChangeTab('dashboard')}
            className={`py-1 px-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : ''}`}
          >
            Painel
          </button>
          <button
            onClick={() => onChangeTab('exercicios')}
            className={`py-1 px-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'exercicios' ? 'text-indigo-400 font-bold' : ''}`}
          >
            Exercícios
          </button>
          <button
            onClick={() => onChangeTab('desafios_ia')}
            className={`py-1 px-1.5 cursor-pointer whitespace-nowrap flex items-center gap-1 ${activeTab === 'desafios_ia' ? 'text-indigo-400 font-bold' : 'text-indigo-300'}`}
          >
            <span>✨</span>
            <span>Desafios IA</span>
          </button>
          <button
            onClick={() => onChangeTab('progresso')}
            className={`py-1 px-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'progresso' ? 'text-indigo-400 font-bold' : ''}`}
          >
            Progresso
          </button>
          <button
            onClick={() => onChangeTab('guia')}
            className={`py-1 px-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'guia' ? 'text-indigo-400 font-bold' : ''}`}
          >
            Guia
          </button>
        </div>
      </div>
    </header>
  );
};

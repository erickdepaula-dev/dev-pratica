/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header, ActiveTab } from './components/Header';
import { SyncToast, ToastMessage, ToastTone } from './components/SyncToast';
import { PageSkeleton } from './components/PageSkeleton';
import { XpBar } from './components/XpBar';
import { totalXp } from './services/xp';
import { BADGES } from './services/badges';
import { Dashboard } from './components/Dashboard';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseWorkspace } from './components/ExerciseWorkspace';
import { ProgressReport } from './components/ProgressReport';
import { StudyGuide } from './components/StudyGuide';
import { AiChallengesHub } from './components/AiChallenges/AiChallengesHub';
import { AiChallengeWorkspace } from './components/AiChallenges/AiChallengeWorkspace';
import { Track, UserProgress } from './types/exercise';
import { getLogicLanguage, getSelectedTrack, resolveLogicExercise, trackOf } from './utils/track';
import { AiChallenge } from './types/aiChallenge';
import {
  loadUserProgress,
  setSelectedTrack,
  setLogicLanguage,
  saveUserProgress,
} from './services/storage';
import {
  allExercises,
  getExerciseById,
  getExercisesByTrack,
} from './data';
import { auth, loginWithGoogle, logoutFirebase, consumeRedirectLogin } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  syncProgressToFirestore,
  loadProgressFromFirestore,
} from './services/firestoreSync';

/**
 * Traduz um erro de autenticação do Firebase em uma frase que diga ao usuário o que fazer.
 * Usado nos dois caminhos de login (pop-up e retorno do redirecionamento).
 */
function descreverErroDeLogin(error: unknown): string {
  const { code } = (error ?? {}) as { code?: string };
  switch (code) {
    case 'auth/unauthorized-domain':
      // O domínio atual não está em Firebase → Authentication → Settings → Authorized domains.
      return `Login bloqueado: o domínio ${window.location.hostname} não está autorizado no Firebase (ver docs/DEPLOY.md).`;
    case 'auth/popup-blocked':
      return 'O navegador bloqueou o pop-up e o redirecionamento não pôde começar. Permita pop-ups para este site e tente de novo.';
    case 'auth/web-storage-unsupported':
    case 'auth/operation-not-supported-in-this-environment':
      return 'O navegador está bloqueando o armazenamento que o login precisa. Permita cookies para este site e tente de novo.';
    case 'auth/network-request-failed':
      return 'Falha de rede ao autenticar. Verifique a conexão e tente de novo.';
    default:
      return `Não foi possível autenticar no momento${code ? ` (${code})` : ''}. Tente novamente.`;
  }
}

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [activeAiChallenge, setActiveAiChallenge] = useState<AiChallenge | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  // true só enquanto o progresso é baixado do Firestore (mostra o skeleton).
  const [isCloudLoading, setIsCloudLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastIdRef = useRef(0);

  // Exibe um toast; o fechamento automático é controlado pelo <SyncToast>.
  const triggerToast = useCallback((message: string, tone: ToastTone = 'success') => {
    toastIdRef.current += 1;
    setToast({ id: toastIdRef.current, message, tone });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  // Recolhe um login por redirecionamento pendente (o caminho usado quando o pop-up
  // é bloqueado). Só aqui os erros desse fluxo aparecem; sem esta chamada o usuário
  // voltaria do Google à tela de login sem nenhuma explicação. Quando dá certo, quem
  // carrega o progresso é o onAuthStateChanged logo abaixo.
  useEffect(() => {
    let ativo = true;
    consumeRedirectLogin().catch((error: unknown) => {
      if (ativo) {
        triggerToast(descreverErroDeLogin(error), 'error');
      }
    });
    return () => {
      ativo = false;
    };
  }, [triggerToast]);

  // Sync state on mount and listen to Firebase Auth
  useEffect(() => {
    const local = loadUserProgress();
    setProgress(local);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        setIsCloudLoading(true);
        try {
          const cloudProgress = await loadProgressFromFirestore();
          if (cloudProgress) {
            setProgress(cloudProgress);
            triggerToast('Progresso e ofensiva sincronizados do Firebase!');
          }
        } catch (e) {
          console.error('Falha ao carregar do Firestore:', e);
          triggerToast('Não foi possível carregar o progresso da nuvem. Usando dados locais.', 'error');
        } finally {
          setIsSyncing(false);
          setIsCloudLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Badges já vistas nesta sessão — para anunciar só as recém-desbloqueadas.
  const knownBadgesRef = useRef<Set<string>>(new Set((progress.badges ?? []).map(b => b.id)));
  useEffect(() => {
    const known = knownBadgesRef.current;
    const fresh = (progress.badges ?? []).filter(b => !known.has(b.id));
    if (fresh.length === 0) return;
    fresh.forEach(b => known.add(b.id));
    const names = fresh
      .map(b => BADGES.find(def => def.id === b.id))
      .filter((def): def is (typeof BADGES)[number] => Boolean(def))
      .map(def => def.icon + ' ' + def.name);
    if (names.length > 0) {
      triggerToast(
        names.length === 1 ? 'Conquista desbloqueada: ' + names[0] : 'Conquistas desbloqueadas: ' + names.join(', '),
        'conquista'
      );
    }
  }, [progress.badges, triggerToast]);

  // Update progress handler that also pushes to Firestore if logged in
  const handleProgressUpdated = useCallback((newProgress: UserProgress) => {
    setProgress(newProgress);
    saveUserProgress(newProgress);

    if (auth.currentUser) {
      syncProgressToFirestore(newProgress).catch(err => {
        console.warn('Falha no sync em background com Firestore:', err);
      });
    }
  }, []);

  const handleSelectTrack = (track: Track) => {
    handleProgressUpdated(setSelectedTrack(track));
  };

  const handleStartExercise = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
  };

  const handleBackToList = () => {
    setSelectedExerciseId(null);
    setActiveTab('exercicios');
  };

  // Firebase auth actions
  const handleLogin = async () => {
    try {
      setIsSyncing(true);
      const outcome = await loginWithGoogle();

      if (outcome.status === 'redirecionando') {
        // A página vai navegar para o Google agora; o progresso é carregado na volta,
        // pelo onAuthStateChanged.
        triggerToast('Pop-up bloqueado — redirecionando para o Google...', 'info');
        return;
      }

      // 'cancelado': o usuário fechou a janela de propósito, não há nada a dizer.
      if (outcome.status !== 'ok') {
        return;
      }

      setIsCloudLoading(true);
      try {
        const cloudProgress = await loadProgressFromFirestore();
        if (cloudProgress) {
          setProgress(cloudProgress);
        }
        triggerToast(`Bem-vindo, ${outcome.user.displayName || 'Dev'}! Dados sincronizados.`);
      } catch {
        // O login deu certo; o que falhou foi a nuvem (Firestore). O progresso segue salvo
        // neste navegador — não é um erro de autenticação.
        triggerToast(
          `Bem-vindo, ${outcome.user.displayName || 'Dev'}! Login feito, mas a nuvem não respondeu: seu progresso continua salvo neste navegador.`,
          'error'
        );
      } finally {
        setIsCloudLoading(false);
      }
    } catch (error: unknown) {
      triggerToast(descreverErroDeLogin(error), 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutFirebase();
      setCurrentUser(null);
      triggerToast('Desconectado do Firebase. Progresso mantido localmente.', 'info');
    } catch (e) {
      console.error('Erro de logout:', e);
    }
  };

  const handleManualSync = async () => {
    if (!auth.currentUser) return;
    setIsSyncing(true);
    try {
      await syncProgressToFirestore(progress);
      const updated = await loadProgressFromFirestore();
      if (updated) {
        setProgress(updated);
      }
      triggerToast('Sincronização com o Firestore concluída com sucesso!');
    } catch (e) {
      console.error('Erro de sincronização manual:', e);
      triggerToast('Erro ao sincronizar com o Firestore.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Exercícios de Lógica são montados na linguagem preferida (JS ou TS) — ver utils/track.ts
  const rawSelectedExercise = selectedExerciseId ? getExerciseById(selectedExerciseId) : null;
  const selectedExercise = rawSelectedExercise
    ? resolveLogicExercise(rawSelectedExercise, getLogicLanguage(progress))
    : null;
  const currentTrackExercises = getExercisesByTrack(
    selectedExercise ? trackOf(selectedExercise) : getSelectedTrack(progress)
  );

  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col font-sans selection:bg-accent-from/30 selection:text-primary">
      <SyncToast toast={toast} onDismiss={dismissToast} />

      {/* Top Bar Header */}
      <Header
        activeTab={selectedExercise ? 'exercicios' : activeAiChallenge ? 'desafios_ia' : activeTab}
        onChangeTab={tab => {
          setSelectedExerciseId(null);
          setActiveAiChallenge(null);
          setActiveTab(tab);
        }}
        selectedTrack={getSelectedTrack(progress)}
        onSelectTrack={handleSelectTrack}
        totalCompleted={progress.completedIds.length}
        totalExercises={allExercises.length}
        progress={progress}
        currentUser={currentUser}
        isSyncing={isSyncing}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onManualSync={handleManualSync}
        xpSlot={<XpBar xp={totalXp(progress)} />}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-16">
        {isCloudLoading && !selectedExercise && !activeAiChallenge ? (
          <PageSkeleton />
        ) : selectedExercise ? (
          <ExerciseWorkspace
            // A troca de linguagem na Lógica remonta o workspace (código e estado são por linguagem)
            key={selectedExercise.id + ':' + selectedExercise.language}
            exercise={selectedExercise}
            onChangeLogicLanguage={language => handleProgressUpdated(setLogicLanguage(language))}
            progress={progress}
            allExercisesInTrack={currentTrackExercises}
            onBackToList={handleBackToList}
            onNavigateToExercise={id => setSelectedExerciseId(id)}
            onProgressUpdated={handleProgressUpdated}
          />
        ) : activeAiChallenge ? (
          <AiChallengeWorkspace
            challenge={activeAiChallenge}
            progress={progress}
            onBackToHub={() => setActiveAiChallenge(null)}
            onProgressUpdated={handleProgressUpdated}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                progress={progress}
                onSelectTrack={handleSelectTrack}
                onStartExercise={handleStartExercise}
                onNavigateToExercises={() => setActiveTab('exercicios')}
                onNavigateToProgress={() => setActiveTab('progresso')}
                onNavigateToGuide={() => setActiveTab('guia')}
                onNavigateToAiChallenges={() => setActiveTab('desafios_ia')}
              />
            )}

            {activeTab === 'exercicios' && (
              <ExerciseList
                progress={progress}
                onSelectTrack={handleSelectTrack}
                onSelectExercise={handleStartExercise}
              />
            )}

            {activeTab === 'desafios_ia' && (
              <AiChallengesHub
                progress={progress}
                onSelectChallenge={ch => setActiveAiChallenge(ch)}
                onProgressUpdated={handleProgressUpdated}
              />
            )}

            {activeTab === 'progresso' && (
              <ProgressReport
                progress={progress}
                onSelectTrack={handleSelectTrack}
                onStartExercise={handleStartExercise}
                onProgressUpdated={handleProgressUpdated}
              />
            )}

            {activeTab === 'guia' && (
              <StudyGuide
                onStartTrack={lang => {
                  handleSelectTrack(lang);
                  setActiveTab('exercicios');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Clean Developer Footer */}
      <footer className="border-t border-subtle/80 bg-canvas py-6 text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted">DevPrática PHP, JS & TS</span>
            <span aria-hidden="true">·</span>
            <span>Plataforma interativa com foco em código real, PO briefs e persistência no Firebase</span>
          </div>

          <div className="flex items-center gap-4 text-muted">
            <button
              onClick={() => {
                setSelectedExerciseId(null);
                setActiveAiChallenge(null);
                setActiveTab('exercicios');
              }}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Exercícios
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setSelectedExerciseId(null);
                setActiveAiChallenge(null);
                setActiveTab('desafios_ia');
              }}
              className="hover:text-primary transition-colors cursor-pointer text-accent"
            >
              Desafios com IA
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setSelectedExerciseId(null);
                setActiveAiChallenge(null);
                setActiveTab('progresso');
              }}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Meu Progresso
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setSelectedExerciseId(null);
                setActiveAiChallenge(null);
                setActiveTab('guia');
              }}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Guia de Estudos
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

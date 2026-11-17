/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header, ActiveTab } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseWorkspace } from './components/ExerciseWorkspace';
import { ProgressReport } from './components/ProgressReport';
import { StudyGuide } from './components/StudyGuide';
import { AiChallengesHub } from './components/AiChallenges/AiChallengesHub';
import { AiChallengeWorkspace } from './components/AiChallenges/AiChallengeWorkspace';
import { Language, UserProgress } from './types/exercise';
import { AiChallenge } from './types/aiChallenge';
import {
  loadUserProgress,
  setSelectedLanguage,
  saveUserProgress,
} from './services/storage';
import {
  allExercises,
  getExerciseById,
  getExercisesByLanguage,
} from './data';
import { auth, loginWithGoogle, logoutFirebase } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  syncProgressToFirestore,
  loadProgressFromFirestore,
} from './services/firestoreSync';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [activeAiChallenge, setActiveAiChallenge] = useState<AiChallenge | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Show temporary toast message
  const triggerToast = (msg: string) => {
    setSyncToast(msg);
    setTimeout(() => setSyncToast(null), 3500);
  };

  // Sync state on mount and listen to Firebase Auth
  useEffect(() => {
    const local = loadUserProgress();
    setProgress(local);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          const cloudProgress = await loadProgressFromFirestore();
          if (cloudProgress) {
            setProgress(cloudProgress);
            triggerToast('Progresso e ofensiva sincronizados do Firebase!');
          }
        } catch (e) {
          console.error('Falha ao carregar do Firestore:', e);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleSelectLanguage = (lang: Language) => {
    const updated = setSelectedLanguage(lang);
    handleProgressUpdated(updated);
  };

  const handleStartExercise = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
  };

  const handleBackToList = () => {
    setSelectedExerciseId(null);
    setActiveTab('exercicios');
  };

  const handleContinueNext = () => {
    const langExercises = getExercisesByLanguage(progress.selectedLanguage);
    const nextUncompleted = langExercises.find(ex => !progress.completedIds.includes(ex.id)) || langExercises[0];
    if (nextUncompleted) {
      setSelectedExerciseId(nextUncompleted.id);
    } else {
      setActiveTab('exercicios');
    }
  };

  // Firebase auth actions
  const handleLogin = async () => {
    try {
      setIsSyncing(true);
      const user = await loginWithGoogle();
      if (user) {
        const cloudProgress = await loadProgressFromFirestore();
        if (cloudProgress) {
          setProgress(cloudProgress);
        }
        triggerToast(`Bem-vindo, ${user.displayName || 'Dev'}! Dados sincronizados.`);
      }
      // If user is null, user simply cancelled or closed the auth window voluntarily
    } catch (error: any) {
      if (error?.code === 'auth/popup-blocked' || error?.message === 'POPUP_BLOCKED') {
        triggerToast('Janela pop-up bloqueada. Permita pop-ups no navegador para autenticar.');
      } else {
        triggerToast('Não foi possível autenticar no momento. Tente novamente.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutFirebase();
      setCurrentUser(null);
      triggerToast('Desconectado do Firebase. Progresso mantido localmente.');
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
      triggerToast('Erro ao sincronizar com o Firestore.');
    } finally {
      setIsSyncing(false);
    }
  };

  const selectedExercise = selectedExerciseId ? getExerciseById(selectedExerciseId) : null;
  const currentTrackExercises = getExercisesByLanguage(
    selectedExercise ? selectedExercise.language : progress.selectedLanguage
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-indigo-500/40 bg-slate-900 p-3.5 shadow-2xl text-xs text-white flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-emerald-400">🔥</span>
          <span>{syncToast}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        activeTab={selectedExercise ? 'exercicios' : activeAiChallenge ? 'desafios_ia' : activeTab}
        onChangeTab={tab => {
          setSelectedExerciseId(null);
          setActiveAiChallenge(null);
          setActiveTab(tab);
        }}
        selectedLanguage={progress.selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
        onContinueNext={handleContinueNext}
        totalCompleted={progress.completedIds.length}
        totalExercises={allExercises.length}
        progress={progress}
        currentUser={currentUser}
        isSyncing={isSyncing}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onManualSync={handleManualSync}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-16">
        {selectedExercise ? (
          <ExerciseWorkspace
            exercise={selectedExercise}
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
                onSelectLanguage={handleSelectLanguage}
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
                onSelectLanguage={handleSelectLanguage}
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
                onSelectLanguage={handleSelectLanguage}
                onStartExercise={handleStartExercise}
                onProgressUpdated={handleProgressUpdated}
              />
            )}

            {activeTab === 'guia' && (
              <StudyGuide
                onStartTrack={lang => {
                  handleSelectLanguage(lang);
                  setActiveTab('exercicios');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Clean Developer Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">DevPrática PHP & JS</span>
            <span aria-hidden="true">·</span>
            <span>Plataforma interativa com foco em código real, PO briefs e persistência no Firebase</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                setSelectedExerciseId(null);
                setActiveAiChallenge(null);
                setActiveTab('exercicios');
              }}
              className="hover:text-white transition-colors cursor-pointer"
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
              className="hover:text-white transition-colors cursor-pointer text-indigo-400"
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
              className="hover:text-white transition-colors cursor-pointer"
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
              className="hover:text-white transition-colors cursor-pointer"
            >
              Guia de Estudos
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

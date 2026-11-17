import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { UserProgress } from '../types/exercise';
import { loadUserProgress, migrateProgress, saveUserProgress } from './storage';
import type { AiChallengeAttempt } from '../types/aiChallenge';
import type { UnlockedBadge } from '../types/gamification';
import { isLanguage } from '../utils/language';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Recursively cleans an object or array for Firestore storage.
 * Firestore setDoc/updateDoc strictly rejects 'undefined' values.
 * This ensures all undefined keys are omitted and undefined values converted to null.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter(item => item !== undefined)
      .map(item => sanitizeForFirestore(item)) as any;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result as T;
}

/**
 * Syncs user progress to Firestore for the currently logged-in user.
 */
export async function syncProgressToFirestore(progress: UserProgress): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const userDocRef = doc(db, 'users', user.uid);
  try {
    const rawPayload = {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      selectedLanguage: progress.selectedLanguage,
      currentStreak: progress.streak.currentStreak,
      lastActiveDate: progress.streak.lastActiveDate,
      activeDates: progress.streak.activeDates,
      completedIds: progress.completedIds,
      attempts: progress.attempts,
      aiChallenges: progress.aiChallenges || {},
      badges: progress.badges ?? [],
      updatedAt: new Date().toISOString(),
    };

    const cleanPayload = sanitizeForFirestore(rawPayload);
    await setDoc(userDocRef, cleanPayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

interface MergeableAttempt {
  passed: boolean;
  completedAt?: string | null;
  xpEarned?: number;
}

/**
 * Mescla registros por id. Em conflito, a nuvem prevalece, exceto que: uma conclusão nunca
 * é desfeita, e o XP congelado e a data de conclusão mais antiga são preservados.
 */
function mergeById<T extends MergeableAttempt>(local: Record<string, T>, cloud: Record<string, T>): Record<string, T> {
  const merged: Record<string, T> = { ...local };
  for (const [id, remote] of Object.entries(cloud)) {
    const own = local[id];
    if (!own) {
      merged[id] = remote;
      continue;
    }
    const completedDates = [own.completedAt, remote.completedAt].filter((d): d is string => Boolean(d)).sort();
    merged[id] = {
      ...own,
      ...remote,
      passed: own.passed || remote.passed,
      completedAt: completedDates[0] ?? null,
      xpEarned: remote.xpEarned ?? own.xpEarned,
    };
  }
  return merged;
}

function mergeBadges(local: UnlockedBadge[], cloud: UnlockedBadge[]): UnlockedBadge[] {
  const byId = new Map<string, UnlockedBadge>();
  for (const badge of [...local, ...cloud]) {
    const current = byId.get(badge.id);
    if (!current || badge.unlockedAt < current.unlockedAt) byId.set(badge.id, badge);
  }
  return [...byId.values()];
}

/**
 * Loads user progress from Firestore and merges with local progress.
 * Preserves the most recent active study session and union of completed exercises.
 */
export async function loadProgressFromFirestore(): Promise<UserProgress | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const userDocRef = doc(db, 'users', user.uid);
  try {
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      // First time user, save current local progress to Firestore
      const local = loadUserProgress();
      await syncProgressToFirestore(local);
      return local;
    }

    const data = docSnap.data();
    const local = loadUserProgress();

    // Merge completed IDs (union)
    const mergedCompleted = Array.from(new Set([
      ...(local.completedIds || []),
      ...(data.completedIds || []),
    ]));

    // Merge active dates
    const mergedActiveDates = Array.from(new Set([
      ...(local.streak?.activeDates || []),
      ...(data.activeDates || []),
    ])).sort();

    // Intelligent streak merge: compare lastActiveDate (YYYY-MM-DD)
    const localDate = local.streak?.lastActiveDate || '';
    const cloudDate = (data.lastActiveDate as string) || '';
    let finalStreak = 0;
    let finalLastActiveDate = '';

    if (cloudDate > localDate) {
      finalStreak = data.currentStreak || 0;
      finalLastActiveDate = cloudDate;
    } else if (localDate > cloudDate) {
      finalStreak = local.streak?.currentStreak || 0;
      finalLastActiveDate = localDate;
    } else {
      finalStreak = Math.max(data.currentStreak || 0, local.streak?.currentStreak || 0);
      finalLastActiveDate = localDate || cloudDate;
    }

    // Merge attempts (a nuvem prevalece por tentativa, mas o XP congelado e a conclusão
    // nunca se perdem: um registro da nuvem anterior à Fase 3 não tem xpEarned)
    const mergedAttempts = mergeById(local.attempts || {}, (data.attempts || {}) as UserProgress['attempts']);

    // Merge AI challenges (mesma regra)
    const mergedAiChallenges = mergeById(
      local.aiChallenges || {},
      (data.aiChallenges || {}) as Record<string, AiChallengeAttempt>
    );

    // Badges: união por id, mantendo a data de desbloqueio mais antiga
    const mergedBadges = mergeBadges(local.badges ?? [], Array.isArray(data.badges) ? (data.badges as UnlockedBadge[]) : []);

    const merged: UserProgress = {
      selectedLanguage: isLanguage(data.selectedLanguage) ? data.selectedLanguage : local.selectedLanguage,
      completedIds: mergedCompleted,
      attempts: mergedAttempts,
      aiChallenges: mergedAiChallenges,
      streak: {
        currentStreak: finalStreak,
        lastActiveDate: finalLastActiveDate,
        activeDates: mergedActiveDates,
      },
      badges: mergedBadges,
    };

    // XP retroativo e badges para o que veio da nuvem (Fase 3)
    const migrated = migrateProgress(merged).progress;
    saveUserProgress(migrated);
    return migrated;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    return null;
  }
}

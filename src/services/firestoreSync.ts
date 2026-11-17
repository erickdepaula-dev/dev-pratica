import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { UserProgress } from '../types/exercise';
import { loadUserProgress, saveUserProgress } from './storage';

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
      updatedAt: new Date().toISOString(),
    };

    const cleanPayload = sanitizeForFirestore(rawPayload);
    await setDoc(userDocRef, cleanPayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
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

    // Merge attempts
    const mergedAttempts = {
      ...(local.attempts || {}),
      ...(data.attempts || {}),
    };

    // Merge AI challenges
    const mergedAiChallenges = {
      ...(local.aiChallenges || {}),
      ...(data.aiChallenges || {}),
    };

    const merged: UserProgress = {
      selectedLanguage: (data.selectedLanguage as any) || local.selectedLanguage || 'php',
      completedIds: mergedCompleted,
      attempts: mergedAttempts,
      aiChallenges: mergedAiChallenges,
      streak: {
        currentStreak: finalStreak,
        lastActiveDate: finalLastActiveDate,
        activeDates: mergedActiveDates,
      },
    };

    saveUserProgress(merged);
    return merged;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    return null;
  }
}

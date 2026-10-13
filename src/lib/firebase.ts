import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  getDocFromServer,
  setDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { TeacherProfile, EvaluationCategory } from '../types/evaluation';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Primary admin email as specified in user brief
export const PRIMARY_ADMIN_EMAIL = 'warakornmick1@gmail.com';

export function isAuthorizedAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  const email = user.email.trim().toLowerCase();
  return email === PRIMARY_ADMIN_EMAIL.toLowerCase();
}

// Firestore instance
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Connection test on boot (Firebase Integration Skill mandatory check)
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or starting up.');
    }
    return false;
  }
}

// Kick off connection check
testConnection();

// Sign In with Google
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// Sign Out
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Firestore paths
const CONFIG_DOC_PATH = 'evaluation_config';
const CONFIG_DOC_ID = 'default_profile';
const CATEGORIES_COL_PATH = 'categories';
const LEGACY_CATEGORIES_DOC_ID = 'default_categories';

import { sanitizeProfileImages, sanitizeCategoryImages, compressDataUrlSafely } from '../utils/imageCompression';

const QUOTA_STORAGE_KEY = 'firestore_daily_quota_exhausted_v1';

function getStoredQuotaExhausted(): boolean {
  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Daily write quota resets every 24h (UTC midnight), verify date
      const today = new Date().toISOString().slice(0, 10);
      if (data.date === today && data.exhausted) {
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}

let isDailyQuotaExhausted = getStoredQuotaExhausted();

export function setDailyQuotaExhausted(): void {
  isDailyQuotaExhausted = true;
  try {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify({ date: today, exhausted: true }));
  } catch {
    // ignore
  }
}

export function isQuotaExhausted(): boolean {
  return isDailyQuotaExhausted || getStoredQuotaExhausted();
}

export function resetQuotaExhausted(): void {
  isDailyQuotaExhausted = false;
  try {
    localStorage.removeItem(QUOTA_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Save profile to Firestore with automatic compression & size sanitation (enforces <1MB limit)
 */
export async function saveProfileToFirestore(profile: TeacherProfile, user: User | null): Promise<TeacherProfile> {
  if (!isAuthorizedAdmin(user)) {
    throw new Error('เฉพาะผู้ดูแลระบบ (warakornmick1@gmail.com) เท่านั้นที่สามารถบันทึกข้อมูลได้');
  }

  // 1. Sanitize and compress all profile image data URLs to guarantee document stays well within 1MB quota
  let sanitizedProfile = await sanitizeProfileImages(profile);

  // 2. Extra safety guard: check total payload size
  let payloadLength = JSON.stringify(sanitizedProfile).length;
  if (payloadLength > 800 * 1024) {
    console.warn(`Profile payload is ${Math.round(payloadLength / 1024)}KB, performing secondary safety compression...`);
    if (sanitizedProfile.bgImageUrl && sanitizedProfile.bgImageUrl.startsWith('data:image/')) {
      sanitizedProfile.bgImageUrl = await compressDataUrlSafely(
        sanitizedProfile.bgImageUrl,
        800,
        500,
        0.5,
        100 * 1024
      );
    }
    payloadLength = JSON.stringify(sanitizedProfile).length;
    if (payloadLength > 950 * 1024) {
      console.warn('Profile payload still near 1MB, dropping oversized background image to avoid Firestore error');
      sanitizedProfile.bgImageUrl = '';
    }
  }

  if (isDailyQuotaExhausted) {
    console.warn('Firestore write skipped: daily write quota reached. Local persistence (IndexedDB) is active.');
    return sanitizedProfile;
  }

  try {
    const profileRef = doc(db, CONFIG_DOC_PATH, CONFIG_DOC_ID);
    await setDoc(profileRef, {
      ...sanitizedProfile,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.email ?? 'admin'
    }, { merge: true });
  } catch (err: any) {
    if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
      isDailyQuotaExhausted = true;
      console.warn('Firestore daily write quota reached (Free Tier limit). Active local storage (IndexedDB) will preserve all data.');
      return sanitizedProfile;
    }
    throw err;
  }

  return sanitizedProfile;
}

/**
 * Save a single category to Firestore (/categories/{categoryId})
 * Automatically sanitizes & compresses attached evidence images to guarantee < 800KB size.
 */
export async function saveSingleCategoryToFirestore(category: EvaluationCategory, user: User | null): Promise<EvaluationCategory> {
  if (!isAuthorizedAdmin(user)) {
    throw new Error('เฉพาะผู้ดูแลระบบ (warakornmick1@gmail.com) เท่านั้นที่สามารถบันทึกข้อมูลได้');
  }

  const sanitizedCat = await sanitizeCategoryImages(category);

  if (isDailyQuotaExhausted) {
    console.warn('Firestore write skipped: daily write quota reached. Local persistence (IndexedDB) is active.');
    return sanitizedCat;
  }

  try {
    const catRef = doc(db, CATEGORIES_COL_PATH, sanitizedCat.id);
    await setDoc(catRef, {
      ...sanitizedCat,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.email ?? 'admin'
    }, { merge: true });
  } catch (err: any) {
    if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
      isDailyQuotaExhausted = true;
      console.warn('Firestore daily write quota reached. Active local storage (IndexedDB) will preserve all data.');
      return sanitizedCat;
    }
    throw err;
  }

  return sanitizedCat;
}

/**
 * Save all categories & criteria to Firestore
 * Uses writeBatch to store each category in /categories/{categoryId} so no single document exceeds 1MB limit.
 */
export async function saveCategoriesToFirestore(categories: EvaluationCategory[], user: User | null): Promise<EvaluationCategory[]> {
  if (!isAuthorizedAdmin(user)) {
    throw new Error('เฉพาะผู้ดูแลระบบ (warakornmick1@gmail.com) เท่านั้นที่สามารถบันทึกข้อมูลได้');
  }

  // Pre-sanitize all categories in parallel to guarantee zero 1MB overflow
  const sanitizedCategories = await Promise.all(
    categories.map(cat => sanitizeCategoryImages(cat))
  );

  if (isDailyQuotaExhausted) {
    console.warn('Firestore batch write skipped: daily write quota reached. Local persistence (IndexedDB) is active.');
    return sanitizedCategories;
  }

  try {
    // Write to /categories/{categoryId}
    const batch = writeBatch(db);
    for (const cat of sanitizedCategories) {
      const catRef = doc(db, CATEGORIES_COL_PATH, cat.id);
      batch.set(catRef, {
        ...cat,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email ?? 'admin'
      }, { merge: true });
    }
    await batch.commit();
  } catch (err: any) {
    if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
      isDailyQuotaExhausted = true;
      console.warn('Firestore daily write quota reached. Active local storage (IndexedDB) will preserve all data.');
      return sanitizedCategories;
    }
    throw err;
  }

  return sanitizedCategories;
}

/**
 * Real-time listener for public readers and admins
 */
export function subscribeToEvaluationData(
  onProfileUpdate: (profile: TeacherProfile) => void,
  onCategoriesUpdate: (categories: EvaluationCategory[]) => void
) {
  // Listen to profile
  const unsubProfile = onSnapshot(doc(db, CONFIG_DOC_PATH, CONFIG_DOC_ID), (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && data.name) {
        onProfileUpdate(data as TeacherProfile);
      }
    }
  }, (err) => {
    console.warn('Firestore profile subscription note:', err.message);
  });

  // Listen to /categories collection (each category as a document)
  const unsubCategoriesCol = onSnapshot(collection(db, CATEGORIES_COL_PATH), (snapshot) => {
    if (!snapshot.empty) {
      const loaded: EvaluationCategory[] = [];
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as EvaluationCategory;
        if (item && item.id && item.domain) {
          loaded.push(item);
        }
      });

      // Sort categories: Domain 1 ('behavior' 1-6) then Domain 2 ('performance' 1-6)
      loaded.sort((a, b) => {
        if (a.domain === b.domain) {
          return a.orderNumber - b.orderNumber;
        }
        return a.domain === 'behavior' ? -1 : 1;
      });

      if (loaded.length > 0) {
        onCategoriesUpdate(loaded);
      }
    }
  }, (err) => {
    console.warn('Firestore categories collection subscription note:', err.message);
  });

  return () => {
    unsubProfile();
    unsubCategoriesCol();
  };
}

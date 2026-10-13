/**
 * Robust IndexedDB client storage with localStorage fallback.
 * Allows storing megabytes of evaluation evidence, photos, and criteria without quota exceptions.
 */

const DB_NAME = 'TeacherEvalStorageDB';
const STORE_NAME = 'eval_store';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveToPersistentStorage<T>(key: string, value: T): Promise<void> {
  // 1. Try IndexedDB first (virtually unlimited quota)
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to localStorage:', err);
  }

  // 2. Also try localStorage for synchronous fast boot (if size allows)
  try {
    const serialized = JSON.stringify(value);
    // Only attempt if reasonably sized to avoid QuotaExceededError
    if (serialized.length < 3.5 * 1024 * 1024) {
      localStorage.setItem(key, serialized);
    }
  } catch {
    // Quota exceeded, ignore since IndexedDB already persisted it
  }
}

export async function loadFromPersistentStorage<T>(key: string): Promise<T | null> {
  // 1. Try IndexedDB
  try {
    const db = await openDB();
    const result = await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });

    if (result !== null && result !== undefined) {
      return result;
    }
  } catch (err) {
    console.warn('IndexedDB load failed, falling back to localStorage:', err);
  }

  // 2. Fallback to localStorage
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {
    // ignore
  }

  return null;
}

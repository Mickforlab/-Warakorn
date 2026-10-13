import { useState, useEffect, useCallback, useRef } from 'react';
import {
  EvaluationCategory,
  TeacherProfile,
  EvidenceFile,
  EvidenceImage,
  EvaluationDomainType
} from '../types/evaluation';
import { initialCategories, initialTeacherProfile } from '../data/initialData';
import {
  subscribeToEvaluationData,
  saveProfileToFirestore,
  saveCategoriesToFirestore,
  saveSingleCategoryToFirestore,
  isAuthorizedAdmin,
  PRIMARY_ADMIN_EMAIL,
  isQuotaExhausted
} from '../lib/firebase';
import { saveToPersistentStorage, loadFromPersistentStorage } from '../utils/storage';
import { sanitizeProfileImages } from '../utils/imageCompression';
import { User } from 'firebase/auth';

const STORAGE_KEY = 'teacher_eval_lamborghini_warakorn_v1';

/**
 * Merges incoming categories (e.g. from Firestore or IndexedDB) with current categories in state,
 * strictly PRESERVING all uploaded evidence files and images so that remote snapshots
 * never delete user evidence on page reload.
 */
function mergeCategoriesPreservingEvidence(
  currentCats: EvaluationCategory[],
  incomingCats: EvaluationCategory[]
): EvaluationCategory[] {
  if (!incomingCats || incomingCats.length === 0) return currentCats;
  if (!currentCats || currentCats.length === 0) return incomingCats;

  const currentMap = new Map(currentCats.map((c) => [c.id, c]));

  return incomingCats.map((incomingCat) => {
    const currentCat = currentMap.get(incomingCat.id);
    if (!currentCat) return incomingCat;

    const currentCriteriaMap = new Map(currentCat.criteria.map((cr) => [cr.id, cr]));

    const mergedCriteria = incomingCat.criteria.map((incomingCrit) => {
      const currentCrit = currentCriteriaMap.get(incomingCrit.id);
      if (!currentCrit) return incomingCrit;

      // 1. Files: union of incoming & current (by id or url)
      const allFiles = [...incomingCrit.files];
      for (const cf of currentCrit.files) {
        const alreadyIn = allFiles.some((f) => f.id === cf.id || (f.url && f.url === cf.url));
        if (!alreadyIn) {
          allFiles.push(cf);
        }
      }

      // 2. Images: union of incoming & current (by id or url)
      const allImages = [...incomingCrit.images];
      for (const ci of currentCrit.images) {
        const alreadyIn = allImages.some((img) => img.id === ci.id || (img.url && img.url === ci.url));
        if (!alreadyIn) {
          allImages.push(ci);
        }
      }

      return {
        ...incomingCrit,
        currentScore:
          typeof incomingCrit.currentScore === 'number'
            ? incomingCrit.currentScore
            : currentCrit.currentScore,
        evaluatorNotes: incomingCrit.evaluatorNotes || currentCrit.evaluatorNotes || '',
        files: allFiles,
        images: allImages
      };
    });

    return {
      ...incomingCat,
      criteria: mergedCriteria
    };
  });
}

export function useEvaluationStore(currentUser: User | null = null, isLoadingAuth = false) {
  const isAdmin = isAuthorizedAdmin(currentUser);

  const [profile, setProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      if (saved) return { ...initialTeacherProfile, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return initialTeacherProfile;
  });

  const [categories, setCategories] = useState<EvaluationCategory[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return initialCategories;
  });

  // Only authorized admin can activate isEditMode (preserve saved preference during initial auth loading)
  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_editmode`);
      if (saved) {
        return Boolean(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [activeDomain, setActiveDomain] = useState<EvaluationDomainType>('behavior');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCriterionId, setSelectedCriterionId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'synced' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const isSavingLocally = useRef(false);

  // Turn off edit mode automatically ONLY once auth has completed loading and user is not admin
  useEffect(() => {
    if (!isLoadingAuth && !isAdmin && isEditMode) {
      setIsEditMode(false);
      localStorage.setItem(`${STORAGE_KEY}_editmode`, 'false');
    }
  }, [isLoadingAuth, isAdmin, isEditMode]);

  // Load from persistent IndexedDB storage if localStorage was empty or incomplete on mount
  useEffect(() => {
    loadFromPersistentStorage<TeacherProfile>(`${STORAGE_KEY}_profile`).then((savedProfile) => {
      if (savedProfile) {
        setProfile((prev) => ({
          ...initialTeacherProfile,
          ...prev,
          ...savedProfile,
          tiktokUrl: savedProfile.tiktokUrl || prev.tiktokUrl || initialTeacherProfile.tiktokUrl,
          facebookUrl: savedProfile.facebookUrl || prev.facebookUrl || initialTeacherProfile.facebookUrl,
        }));
      }
    });

    loadFromPersistentStorage<EvaluationCategory[]>(`${STORAGE_KEY}_categories`).then((savedCats) => {
      if (savedCats && savedCats.length > 0) {
        setCategories((prev) => mergeCategoriesPreservingEvidence(prev, savedCats));
      }
    });
  }, []);

  // Subscribe to Firestore for real-time updates across all users/devices
  useEffect(() => {
    const unsubscribe = subscribeToEvaluationData(
      (remoteProfile) => {
        if (remoteProfile) {
          // If the admin is actively modifying local state, don't clobber in-flight edits
          if (isSavingLocally.current) return;

          setProfile((prev) => {
            // Smart merge: Update teacher profile info from remote,
            // but protect local custom media (bgImageUrl, logoUrl, avatarUrl) if remote has empty/whitespace values.
            const merged: TeacherProfile = {
              ...initialTeacherProfile,
              ...prev,
              ...remoteProfile,
              bgImageUrl:
                remoteProfile.bgImageUrl && remoteProfile.bgImageUrl.trim().length > 0
                  ? remoteProfile.bgImageUrl
                  : prev.bgImageUrl || '',
              bgOpacity:
                typeof remoteProfile.bgOpacity === 'number'
                  ? remoteProfile.bgOpacity
                  : prev.bgOpacity ?? 35,
              bgBlur:
                typeof remoteProfile.bgBlur === 'number'
                  ? remoteProfile.bgBlur
                  : prev.bgBlur ?? 0,
              showVectorOverlay:
                typeof remoteProfile.showVectorOverlay === 'boolean'
                  ? remoteProfile.showVectorOverlay
                  : prev.showVectorOverlay ?? true,
              fontSizeScale:
                typeof remoteProfile.fontSizeScale === 'number'
                  ? remoteProfile.fontSizeScale
                  : prev.fontSizeScale ?? 100,
              isFullPageBg:
                typeof remoteProfile.isFullPageBg === 'boolean'
                  ? remoteProfile.isFullPageBg
                  : prev.isFullPageBg ?? true,
              logoUrl:
                remoteProfile.logoUrl && remoteProfile.logoUrl.trim().length > 0
                  ? remoteProfile.logoUrl
                  : prev.logoUrl || '',
              avatarUrl:
                remoteProfile.avatarUrl && remoteProfile.avatarUrl.trim().length > 0
                  ? remoteProfile.avatarUrl
                  : prev.avatarUrl || '',
              tiktokUrl: remoteProfile.tiktokUrl || prev.tiktokUrl || initialTeacherProfile.tiktokUrl,
              facebookUrl: remoteProfile.facebookUrl || prev.facebookUrl || initialTeacherProfile.facebookUrl,
            };

            saveToPersistentStorage(`${STORAGE_KEY}_profile`, merged);
            return merged;
          });
        }
      },
      (remoteCategories) => {
        if (remoteCategories && remoteCategories.length > 0) {
          // If the admin is actively modifying local state, don't clobber in-flight edits
          if (isSavingLocally.current) return;
          setCategories((prev) => {
            const merged = mergeCategoriesPreservingEvidence(prev, remoteCategories);
            saveToPersistentStorage(`${STORAGE_KEY}_categories`, merged);
            return merged;
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Auto-compress local profile if it has legacy oversized image data URLs (> 200KB)
  useEffect(() => {
    const hasOversizedBg = profile.bgImageUrl && profile.bgImageUrl.startsWith('data:image/') && profile.bgImageUrl.length > 200 * 1024;
    const hasOversizedLogo = profile.logoUrl && profile.logoUrl.startsWith('data:image/') && profile.logoUrl.length > 100 * 1024;
    const hasOversizedAvatar = profile.avatarUrl && profile.avatarUrl.startsWith('data:image/') && profile.avatarUrl.length > 100 * 1024;

    if (hasOversizedBg || hasOversizedLogo || hasOversizedAvatar) {
      sanitizeProfileImages(profile).then((sanitized) => {
        setProfile(sanitized);
        saveToPersistentStorage(`${STORAGE_KEY}_profile`, sanitized);
      });
    }
  }, [profile.bgImageUrl, profile.logoUrl, profile.avatarUrl]);

  // Save profile to persistent local storage and sync to Firestore if admin (and quota not exhausted)
  useEffect(() => {
    saveToPersistentStorage(`${STORAGE_KEY}_profile`, profile);

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isAdmin && currentUser && !isQuotaExhausted()) {
      const timer = setTimeout(async () => {
        try {
          setSyncStatus('saving');
          setSyncError(null);
          const sanitizedProfile = await saveProfileToFirestore(profile, currentUser);
          setSyncStatus('synced');
          // If profile was compressed/sanitized, sync back to local state
          if (
            sanitizedProfile &&
            (sanitizedProfile.bgImageUrl !== profile.bgImageUrl ||
              sanitizedProfile.logoUrl !== profile.logoUrl ||
              sanitizedProfile.avatarUrl !== profile.avatarUrl)
          ) {
            setProfile(sanitizedProfile);
            saveToPersistentStorage(`${STORAGE_KEY}_profile`, sanitizedProfile);
          }
        } catch (err: any) {
          console.warn('Profile sync note:', err);
          if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
            setSyncStatus('synced');
          } else {
            setSyncStatus('error');
            setSyncError(err?.message || 'ไม่สามารถบันทึกโปรไฟล์ขึ้นคลาวด์ได้');
          }
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [profile, isAdmin, currentUser]);

  // Save categories to persistent local storage (IndexedDB & localStorage)
  // NOTE: Selective Firestore writes occur per-category on user edits or on explicit cloud sync.
  // This prevents feedback write loops and avoids consuming Firebase daily write quotas.
  useEffect(() => {
    saveToPersistentStorage(`${STORAGE_KEY}_categories`, categories);
  }, [categories]);

  // Auto-save edit mode to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_editmode`, JSON.stringify(isEditMode));
    } catch {
      // ignore
    }
  }, [isEditMode]);

  // Auto-sync profile to cloud when admin signs in
  useEffect(() => {
    if (isAdmin && currentUser && !isQuotaExhausted()) {
      saveProfileToFirestore(profile, currentUser)
        .then((sanitized) => {
          if (sanitized) {
            setProfile(sanitized);
            saveToPersistentStorage(`${STORAGE_KEY}_profile`, sanitized);
          }
        })
        .catch(console.warn);
    }
  }, [isAdmin, currentUser]);

  // Force full cloud sync on demand
  const forceSyncToCloud = useCallback(async () => {
    if (!isAdmin || !currentUser) {
      setSyncError(`เฉพาะผู้ดูแลระบบ (${PRIMARY_ADMIN_EMAIL}) เท่านั้นที่สามารถบันทึกขึ้นคลาวด์ได้`);
      setSyncStatus('error');
      return false;
    }

    try {
      setSyncStatus('saving');
      const [sanitizedProfile, sanitizedCategories] = await Promise.all([
        saveProfileToFirestore(profile, currentUser),
        saveCategoriesToFirestore(categories, currentUser)
      ]);
      if (sanitizedProfile) {
        setProfile(sanitizedProfile);
        saveToPersistentStorage(`${STORAGE_KEY}_profile`, sanitizedProfile);
      }
      if (sanitizedCategories) {
        setCategories(sanitizedCategories);
        saveToPersistentStorage(`${STORAGE_KEY}_categories`, sanitizedCategories);
      }
      setSyncStatus('synced');
      return true;
    } catch (err: any) {
      console.warn('Force sync note:', err);
      if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
        setSyncStatus('synced');
        return true;
      }
      setSyncStatus('error');
      setSyncError(err?.message || 'บันทึกขึ้นคลาวด์ไม่สำเร็จ');
      return false;
    }
  }, [isAdmin, currentUser, profile, categories]);

  // Update profile with immediate persistent storage save
  const updateProfile = useCallback((updates: Partial<TeacherProfile>) => {
    isSavingLocally.current = true;
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      saveToPersistentStorage(`${STORAGE_KEY}_profile`, updated);
      return updated;
    });

    setTimeout(() => {
      isSavingLocally.current = false;
    }, 1500);
  }, []);

  // Update specific criterion
  const updateCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    updates: {
      currentScore?: number;
      evaluatorNotes?: string;
      title?: string;
      description?: string;
    }
  ) => {
    isSavingLocally.current = true;
    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        const newCat = {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              ...updates
            };
          })
        };
        // Instant category sync if admin (only 1 write, skipped if quota reached)
        if (isAdmin && currentUser && !isQuotaExhausted()) {
          saveSingleCategoryToFirestore(newCat, currentUser).catch(console.warn);
        }
        return newCat;
      });
      saveToPersistentStorage(`${STORAGE_KEY}_categories`, updated);
      return updated;
    });
  }, [isAdmin, currentUser]);

  // Add file to a criterion with instant save
  const addFileToCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    file: Omit<EvidenceFile, 'id'>
  ) => {
    isSavingLocally.current = true;
    const newFile: EvidenceFile = {
      ...file,
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      dateAdded: new Date().toLocaleDateString('th-TH')
    };

    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        const newCat = {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              files: [...crit.files, newFile]
            };
          })
        };
        // Instant save to Firestore for this category!
        if (isAdmin && currentUser) {
          setSyncStatus('saving');
          saveSingleCategoryToFirestore(newCat, currentUser)
            .then(() => setSyncStatus('synced'))
            .catch((err) => {
              console.error('Instant file save failed:', err);
              setSyncStatus('error');
              setSyncError(err?.message || 'บันทึกไฟล์ขึ้นคลาวด์ไม่สำเร็จ');
            });
        }
        return newCat;
      });
      saveToPersistentStorage(`${STORAGE_KEY}_categories`, updated);
      return updated;
    });
  }, [isAdmin, currentUser]);

  // Delete file from criterion
  const removeFileFromCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    fileId: string
  ) => {
    isSavingLocally.current = true;
    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        const newCat = {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              files: crit.files.filter(f => f.id !== fileId)
            };
          })
        };
        if (isAdmin && currentUser && !isQuotaExhausted()) {
          saveSingleCategoryToFirestore(newCat, currentUser).catch(console.warn);
        }
        return newCat;
      });
      saveToPersistentStorage(`${STORAGE_KEY}_categories`, updated);
      return updated;
    });
  }, [isAdmin, currentUser]);

  // Add image to a criterion with instant save
  const addImageToCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    image: Omit<EvidenceImage, 'id'>
  ) => {
    isSavingLocally.current = true;
    const newImage: EvidenceImage = {
      ...image,
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      dateTaken: image.dateTaken || new Date().toLocaleDateString('th-TH')
    };

    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        const newCat = {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              images: [...crit.images, newImage]
            };
          })
        };
        // Instant save to Firestore for this category!
        if (isAdmin && currentUser) {
          setSyncStatus('saving');
          saveSingleCategoryToFirestore(newCat, currentUser)
            .then((sanitizedCat) => {
              setSyncStatus('synced');
              if (sanitizedCat) {
                setCategories((curr) =>
                  curr.map((c) => (c.id === sanitizedCat.id ? sanitizedCat : c))
                );
              }
            })
            .catch((err) => {
              console.error('Instant image save failed:', err);
              setSyncStatus('error');
              setSyncError(err?.message || 'บันทึกรูปภาพขึ้นคลาวด์ไม่สำเร็จ');
            });
        }
        return newCat;
      });
      saveToPersistentStorage(`${STORAGE_KEY}_categories`, updated);
      return updated;
    });
  }, [isAdmin, currentUser]);

  // Add multiple images to criterion in a single batch update
  const addMultipleImagesToCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    images: Array<Omit<EvidenceImage, 'id'>>
  ) => {
    if (!images || images.length === 0) return;
    isSavingLocally.current = true;
    const timestamp = Date.now();
    const newImages: EvidenceImage[] = images.map((img, idx) => ({
      ...img,
      id: `img_${timestamp}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      dateTaken: img.dateTaken || new Date().toLocaleDateString('th-TH')
    }));

    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        const newCat = {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              images: [...crit.images, ...newImages]
            };
          })
        };
        // Instant atomic save to Firestore for this category
        if (isAdmin && currentUser) {
          setSyncStatus('saving');
          saveSingleCategoryToFirestore(newCat, currentUser)
            .then((sanitizedCat) => {
              setSyncStatus('synced');
              if (sanitizedCat) {
                setCategories((curr) =>
                  curr.map((c) => (c.id === sanitizedCat.id ? sanitizedCat : c))
                );
              }
            })
            .catch((err) => {
              console.error('Instant multi-images save failed:', err);
              setSyncStatus('error');
              setSyncError(err?.message || 'บันทึกรูปภาพหลายรายการขึ้นคลาวด์ไม่สำเร็จ');
            });
        }
        return newCat;
      });
      saveToPersistentStorage(`${STORAGE_KEY}_categories`, updated);
      return updated;
    });
  }, [isAdmin, currentUser]);

  // Delete image from criterion
  const removeImageFromCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    imageId: string
  ) => {
    isSavingLocally.current = true;
    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        const newCat = {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              images: crit.images.filter(img => img.id !== imageId)
            };
          })
        };
        if (isAdmin && currentUser && !isQuotaExhausted()) {
          saveSingleCategoryToFirestore(newCat, currentUser).catch(console.warn);
        }
        return newCat;
      });
      saveToPersistentStorage(`${STORAGE_KEY}_categories`, updated);
      return updated;
    });
  }, [isAdmin, currentUser]);

  // Calculate scores
  const getCategoryScore = useCallback((category: EvaluationCategory) => {
    if (!category.criteria || category.criteria.length === 0) return 0;
    const sum = category.criteria.reduce((acc, c) => acc + (c.currentScore || 0), 0);
    const maxCriteriaSum = category.criteria.reduce((acc, c) => acc + (c.maxScore || 4), 0);
    if (maxCriteriaSum === 0) return 0;
    const weighted = (sum / maxCriteriaSum) * category.maxScore;
    return Math.round(weighted * 100) / 100;
  }, []);

  // Split categories by domain
  const behaviorCategories = categories.filter(c => c.domain === 'behavior');
  const performanceCategories = categories.filter(c => c.domain === 'performance');

  const behaviorScore = behaviorCategories.reduce((acc, cat) => acc + getCategoryScore(cat), 0);
  const performanceScore = performanceCategories.reduce((acc, cat) => acc + getCategoryScore(cat), 0);
  const totalScore = Math.round((behaviorScore + performanceScore) * 100) / 100;

  // Stats
  const totalFiles = categories.reduce(
    (acc, cat) => acc + cat.criteria.reduce((cAcc, cr) => cAcc + (cr.files?.length || 0), 0),
    0
  );

  const totalImages = categories.reduce(
    (acc, cat) => acc + cat.criteria.reduce((cAcc, cr) => cAcc + (cr.images?.length || 0), 0),
    0
  );

  const totalCriteria = categories.reduce(
    (acc, cat) => acc + (cat.criteria?.length || 0),
    0
  );

  // Export JSON backup
  const exportBackupJSON = useCallback(() => {
    const backupData = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      primaryAdminEmail: PRIMARY_ADMIN_EMAIL,
      profile,
      categories
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher_evaluation_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [profile, categories]);

  // Import JSON backup
  const importBackupJSON = useCallback(async (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.profile && parsed.categories) {
        setProfile(parsed.profile);
        setCategories(parsed.categories);
        saveToPersistentStorage(`${STORAGE_KEY}_profile`, parsed.profile);
        saveToPersistentStorage(`${STORAGE_KEY}_categories`, parsed.categories);

        // If admin, immediately push to cloud
        if (isAdmin && currentUser) {
          setSyncStatus('saving');
          try {
            await Promise.all([
              saveProfileToFirestore(parsed.profile, currentUser),
              saveCategoriesToFirestore(parsed.categories, currentUser)
            ]);
            setSyncStatus('synced');
          } catch (err: any) {
            setSyncStatus('error');
            setSyncError(err?.message || 'นำเข้าสำเร็จในเครื่อง แต่ไม่สามารถส่งขึ้นคลาวด์ได้');
          }
        }
        return { success: true };
      }
      return { success: false, error: 'รูปแบบไฟล์ไม่ถูกต้อง ไม่มีข้อมูล profile หรือ categories' };
    } catch {
      return { success: false, error: 'ไม่สามารถอ่านไฟล์ JSON ได้' };
    }
  }, [isAdmin, currentUser]);

  // Reset to default initial state
  const resetToDefault = useCallback(() => {
    setProfile(initialTeacherProfile);
    setCategories(initialCategories);
    localStorage.removeItem(`${STORAGE_KEY}_profile`);
    localStorage.removeItem(`${STORAGE_KEY}_categories`);
    saveToPersistentStorage(`${STORAGE_KEY}_profile`, initialTeacherProfile);
    saveToPersistentStorage(`${STORAGE_KEY}_categories`, initialCategories);
  }, []);

  return {
    profile,
    categories,
    isEditMode: isAdmin ? isEditMode : false,
    setIsEditMode: (val: boolean) => {
      if (!isAdmin) return;
      setIsEditMode(val);
    },
    activeDomain,
    setActiveDomain,
    searchQuery,
    setSearchQuery,
    selectedCriterionId,
    setSelectedCriterionId,
    updateProfile,
    updateCriterion,
    addFileToCriterion,
    removeFileFromCriterion,
    addImageToCriterion,
    addMultipleImagesToCriterion,
    removeImageFromCriterion,
    getCategoryScore,
    behaviorCategories,
    performanceCategories,
    behaviorScore: Math.round(behaviorScore * 100) / 100,
    performanceScore: Math.round(performanceScore * 100) / 100,
    totalScore,
    totalFiles,
    totalImages,
    totalCriteria,
    exportBackupJSON,
    importBackupJSON,
    resetToDefault,
    syncStatus,
    syncError,
    forceSyncToCloud,
    isAdmin
  };
}

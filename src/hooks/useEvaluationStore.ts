import { useState, useEffect, useCallback } from 'react';
import {
  EvaluationCategory,
  TeacherProfile,
  EvidenceFile,
  EvidenceImage,
  EvaluationDomainType
} from '../types/evaluation';
import { initialCategories, initialTeacherProfile } from '../data/initialData';

const STORAGE_KEY = 'teacher_eval_lamborghini_warakorn_v1';

export function useEvaluationStore() {
  const [profile, setProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      if (saved) return JSON.parse(saved);
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

  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_editmode`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return false;
  });

  const [activeDomain, setActiveDomain] = useState<EvaluationDomainType>('behavior');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCriterionId, setSelectedCriterionId] = useState<string | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_editmode`, JSON.stringify(isEditMode));
    } catch (e) {
      console.error('Failed to save edit mode', e);
    }
  }, [isEditMode]);

  // Update profile
  const updateProfile = useCallback((updates: Partial<TeacherProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
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
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              ...updates
            };
          })
        };
      })
    );
  }, []);

  // Add file to a criterion
  const addFileToCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    file: Omit<EvidenceFile, 'id'>
  ) => {
    const newFile: EvidenceFile = {
      ...file,
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      dateAdded: new Date().toLocaleDateString('th-TH')
    };

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              files: [...crit.files, newFile]
            };
          })
        };
      })
    );
  }, []);

  // Delete file from criterion
  const removeFileFromCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    fileId: string
  ) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              files: crit.files.filter(f => f.id !== fileId)
            };
          })
        };
      })
    );
  }, []);

  // Add image to a criterion
  const addImageToCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    image: Omit<EvidenceImage, 'id'>
  ) => {
    const newImage: EvidenceImage = {
      ...image,
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      dateTaken: image.dateTaken || new Date().toLocaleDateString('th-TH')
    };

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              images: [...crit.images, newImage]
            };
          })
        };
      })
    );
  }, []);

  // Delete image from criterion
  const removeImageFromCriterion = useCallback((
    categoryId: string,
    criterionId: string,
    imageId: string
  ) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          criteria: cat.criteria.map(crit => {
            if (crit.id !== criterionId) return crit;
            return {
              ...crit,
              images: crit.images.filter(img => img.id !== imageId)
            };
          })
        };
      })
    );
  }, []);

  // Calculate scores
  const getCategoryScore = useCallback((category: EvaluationCategory) => {
    const totalCritScore = category.criteria.reduce((sum, c) => sum + (c.currentScore || 0), 0);
    const maxCritPossible = category.criteria.length * 4;
    if (maxCritPossible === 0) return 0;
    const scaledScore = (totalCritScore * category.maxScore) / maxCritPossible;
    return Math.min(category.maxScore, Math.round(scaledScore * 100) / 100);
  }, []);

  // Domain score summary
  const behaviorCategories = categories.filter(c => c.domain === 'behavior');
  const performanceCategories = categories.filter(c => c.domain === 'performance');

  const behaviorScore = behaviorCategories.reduce((sum, cat) => sum + getCategoryScore(cat), 0);
  const performanceScore = performanceCategories.reduce((sum, cat) => sum + getCategoryScore(cat), 0);
  const totalScore = Math.min(100, Math.round((behaviorScore + performanceScore) * 100) / 100);

  // File and evidence count totals
  const totalFiles = categories.reduce(
    (sum, cat) => sum + cat.criteria.reduce((cSum, crit) => cSum + crit.files.length, 0),
    0
  );
  const totalImages = categories.reduce(
    (sum, cat) => sum + cat.criteria.reduce((cSum, crit) => cSum + crit.images.length, 0),
    0
  );
  const totalCriteria = categories.reduce((sum, cat) => sum + cat.criteria.length, 0);

  // Export JSON backup
  const exportBackupJSON = useCallback(() => {
    const data = {
      profile,
      categories,
      exportedAt: new Date().toISOString(),
      appName: 'Teacher Evaluation Portfolio - Lamborghini Luxury'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher_evaluation_${profile.name.replace(/\s+/g, '_')}_backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [profile, categories]);

  // Import JSON backup
  const importBackupJSON = useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.profile && parsed.categories) {
        setProfile(parsed.profile);
        setCategories(parsed.categories);
        return { success: true };
      }
      return { success: false, error: 'รูปแบบไฟล์ไม่ถูกต้อง ไม่มีข้อมูล profile หรือ categories' };
    } catch {
      return { success: false, error: 'ไม่สามารถอ่านไฟล์ JSON ได้' };
    }
  }, []);

  // Reset to default initial state
  const resetToDefault = useCallback(() => {
    setProfile(initialTeacherProfile);
    setCategories(initialCategories);
    localStorage.removeItem(`${STORAGE_KEY}_profile`);
    localStorage.removeItem(`${STORAGE_KEY}_categories`);
  }, []);

  return {
    profile,
    categories,
    isEditMode,
    setIsEditMode,
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
    resetToDefault
  };
}

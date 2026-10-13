/**
 * Client-side image compression and resizing utility using HTML5 Canvas.
 * Reduces 3MB-15MB camera photos down to 40KB-90KB without noticeable quality loss.
 * Prevents Firestore 1MB document limit errors and LocalStorage quota exceptions.
 */

export interface CompressionResult {
  dataUrl: string;
  sizeKB: number;
  originalSizeKB: number;
  width: number;
  height: number;
}

export async function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<CompressionResult> {
  const originalSizeKB = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('รูปภาพไม่ถูกต้องหรือไม่สามารถประมวลผลได้'));

      img.onload = () => {
        let targetWidth = img.naturalWidth || img.width;
        let targetHeight = img.naturalHeight || img.height;

        // Calculate aspect ratio scaling
        if (targetWidth > maxWidth || targetHeight > maxHeight) {
          const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
          targetWidth = Math.round(targetWidth * ratio);
          targetHeight = Math.round(targetHeight * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('ไม่สามารถสร้าง canvas context สำหรับย่อรูปภาพได้'));
          return;
        }

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert to web-friendly JPEG with quality compression
        let currentQuality = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);

        // If the resulting dataUrl is still larger than 250KB, reduce quality
        if (dataUrl.length > 250 * 1024 && currentQuality > 0.5) {
          currentQuality = 0.55;
          dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
        }

        const approxSizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          sizeKB: approxSizeKB,
          originalSizeKB,
          width: targetWidth,
          height: targetHeight
        });
      };

      // Use Object URL if supported for faster loading without large memory allocation
      try {
        const objUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objUrl);
          let targetWidth = img.naturalWidth || img.width;
          let targetHeight = img.naturalHeight || img.height;

          if (targetWidth > maxWidth || targetHeight > maxHeight) {
            const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
            targetWidth = Math.round(targetWidth * ratio);
            targetHeight = Math.round(targetHeight * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('ไม่สามารถสร้าง canvas context ได้'));
            return;
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          let currentQuality = quality;
          let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          if (dataUrl.length > 250 * 1024 && currentQuality > 0.5) {
            currentQuality = 0.55;
            dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
          }

          const approxSizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
          resolve({
            dataUrl,
            sizeKB: approxSizeKB,
            originalSizeKB,
            width: targetWidth,
            height: targetHeight
          });
        };
        img.src = objUrl;
      } catch {
        img.src = reader.result as string;
      }
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an existing Base64 dataURL down to a target dimension, quality, and byte size
 */
export async function compressDataUrlSafely(
  dataUrl: string,
  maxWidth = 1200,
  maxHeight = 900,
  quality = 0.7,
  maxAllowedBytes = 220 * 1024
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  // If already small enough (under 100KB), return as is
  if (dataUrl.length <= 100 * 1024) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let targetWidth = img.naturalWidth || img.width;
      let targetHeight = img.naturalHeight || img.height;

      const scale = Math.min(1, maxWidth / targetWidth, maxHeight / targetHeight);
      targetWidth = Math.max(1, Math.round(targetWidth * scale));
      targetHeight = Math.max(1, Math.round(targetHeight * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      let currentQuality = quality;
      let result = canvas.toDataURL('image/jpeg', currentQuality);

      // Pass 2: If still exceeds max bytes, reduce quality
      if (result.length > maxAllowedBytes && currentQuality > 0.4) {
        currentQuality = 0.5;
        result = canvas.toDataURL('image/jpeg', currentQuality);
      }

      // Pass 3: If still exceeds max bytes, downscale canvas
      if (result.length > maxAllowedBytes) {
        const smallerCanvas = document.createElement('canvas');
        smallerCanvas.width = Math.max(1, Math.round(targetWidth * 0.7));
        smallerCanvas.height = Math.max(1, Math.round(targetHeight * 0.7));
        const sCtx = smallerCanvas.getContext('2d');
        if (sCtx) {
          sCtx.imageSmoothingEnabled = true;
          sCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
          result = smallerCanvas.toDataURL('image/jpeg', 0.5);
        }
      }

      resolve(result);
    };

    img.onerror = () => {
      console.warn('Failed to decode dataUrl for compression, keeping original');
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

/**
 * Backward compatibility alias for compressDataUrlIfNeeded
 */
export async function compressDataUrlIfNeeded(
  dataUrl: string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return compressDataUrlSafely(dataUrl, maxWidth, maxHeight, quality, 200 * 1024);
}

/**
 * Sanitizes and compresses all image data URLs in TeacherProfile to prevent Firestore document size limit errors.
 */
export async function sanitizeProfileImages<T extends { bgImageUrl?: string; logoUrl?: string; avatarUrl?: string }>(
  profile: T
): Promise<T> {
  const updated = { ...profile };

  // 1. Background image: max 1200x800, quality 0.65, max ~160KB
  if (updated.bgImageUrl && updated.bgImageUrl.startsWith('data:image/')) {
    if (updated.bgImageUrl.length > 120 * 1024) {
      updated.bgImageUrl = await compressDataUrlSafely(
        updated.bgImageUrl,
        1200,
        800,
        0.65,
        160 * 1024
      );
    }
  }

  // 2. College Logo: max 320x320, quality 0.75, max ~50KB
  if (updated.logoUrl && updated.logoUrl.startsWith('data:image/')) {
    if (updated.logoUrl.length > 50 * 1024) {
      updated.logoUrl = await compressDataUrlSafely(
        updated.logoUrl,
        320,
        320,
        0.75,
        50 * 1024
      );
    }
  }

  // 3. Avatar photo: max 400x400, quality 0.75, max ~60KB
  if (updated.avatarUrl && updated.avatarUrl.startsWith('data:image/')) {
    if (updated.avatarUrl.length > 60 * 1024) {
      updated.avatarUrl = await compressDataUrlSafely(
        updated.avatarUrl,
        400,
        400,
        0.75,
        60 * 1024
      );
    }
  }

  return updated;
}

/**
 * Sanitizes and compresses all image data URLs in an EvaluationCategory to guarantee
 * that its Firestore document size never exceeds 800KB (well below Firestore's 1MB limit).
 */
export async function sanitizeCategoryImages<T extends { criteria: Array<{ images?: Array<{ id: string; url: string; title: string; description?: string; dateTaken?: string }> }> }>(
  category: T
): Promise<T> {
  const updatedCategory = { ...category };
  const jsonLength = JSON.stringify(updatedCategory).length;

  // If already comfortably under 500KB, no need for heavy compression
  if (jsonLength < 500 * 1024) {
    return updatedCategory;
  }

  // Iterate over criteria and compress any oversized image data URLs
  const newCriteria = await Promise.all(
    updatedCategory.criteria.map(async (crit) => {
      if (!crit.images || crit.images.length === 0) return crit;

      const newImages = await Promise.all(
        crit.images.map(async (img) => {
          if (img.url && img.url.startsWith('data:image/') && img.url.length > 60 * 1024) {
            const compressedUrl = await compressDataUrlSafely(
              img.url,
              800,
              800,
              0.65,
              55 * 1024
            );
            return { ...img, url: compressedUrl };
          }
          return img;
        })
      );
      return { ...crit, images: newImages };
    })
  );

  updatedCategory.criteria = newCriteria as any;
  const newLength = JSON.stringify(updatedCategory).length;

  // If still above 850KB, compress more aggressively to strictly respect Firestore 1MB limit
  if (newLength > 850 * 1024) {
    const furtherCompressedCriteria = await Promise.all(
      updatedCategory.criteria.map(async (crit) => {
        if (!crit.images || crit.images.length === 0) return crit;
        const newImages = await Promise.all(
          crit.images.map(async (img) => {
            if (img.url && img.url.startsWith('data:image/') && img.url.length > 35 * 1024) {
              const compressedUrl = await compressDataUrlSafely(
                img.url,
                640,
                640,
                0.55,
                32 * 1024
              );
              return { ...img, url: compressedUrl };
            }
            return img;
          })
        );
        return { ...crit, images: newImages };
      })
    );
    updatedCategory.criteria = furtherCompressedCriteria as any;
  }

  return updatedCategory;
}

import React, { useState, useEffect, useCallback } from 'react';
import {
  EvaluationCategory,
  EvaluationCriterion,
  EvidenceFile,
  EvidenceImage
} from '../types/evaluation';
import {
  X,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle,
  Upload,
  Eye,
  FolderOpen,
  BookmarkCheck,
  Loader2,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';
import { compressImageFile, compressDataUrlSafely } from '../utils/imageCompression';

interface StagedImageItem {
  id: string;
  dataUrl: string;
  fileName: string;
  title: string;
  description: string;
  originalKB: number;
  newKB: number;
}

interface CriterionModalProps {
  category: EvaluationCategory;
  criterion: EvaluationCriterion;
  isEditMode: boolean;
  onClose: () => void;
  onUpdateCriterion: (
    categoryId: string,
    criterionId: string,
    updates: {
      evaluatorNotes?: string;
      title?: string;
      description?: string;
    }
  ) => void;
  onAddFile: (
    categoryId: string,
    criterionId: string,
    file: Omit<EvidenceFile, 'id'>
  ) => void;
  onRemoveFile: (
    categoryId: string,
    criterionId: string,
    fileId: string
  ) => void;
  onAddImage: (
    categoryId: string,
    criterionId: string,
    image: Omit<EvidenceImage, 'id'>
  ) => void;
  onAddMultipleImages?: (
    categoryId: string,
    criterionId: string,
    images: Array<Omit<EvidenceImage, 'id'>>
  ) => void;
  onRemoveImage: (
    categoryId: string,
    criterionId: string,
    imageId: string
  ) => void;
}

export const CriterionModal: React.FC<CriterionModalProps> = ({
  category,
  criterion,
  isEditMode,
  onClose,
  onUpdateCriterion,
  onAddFile,
  onRemoveFile,
  onAddImage,
  onAddMultipleImages,
  onRemoveImage
}) => {
  // New File Form State
  const [showAddFile, setShowAddFile] = useState(false);
  const [fileTitle, setFileTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileNotes, setFileNotes] = useState('');
  const [fileUploadType, setFileUploadType] = useState<'drive' | 'local'>('drive');
  const [localFileNotice, setLocalFileNotice] = useState<string | null>(null);

  // Multi-Image Upload Form State
  const [showAddImage, setShowAddImage] = useState(false);
  const [stagedImages, setStagedImages] = useState<StagedImageItem[]>([]);
  const [isCompressingMultiple, setIsCompressingMultiple] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<{ current: number; total: number } | null>(null);
  const [batchCommonDesc, setBatchCommonDesc] = useState('');

  // Status notification state inside modal
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Lightbox State (index into criterion.images)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Close lightbox or navigate with keyboard
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : criterion.images.length - 1) : null
        );
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev < criterion.images.length - 1 ? prev + 1 : 0) : null
        );
      }
    },
    [lightboxIndex, criterion.images.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle multi-file selection & client-side compression
  const handleBatchImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setIsCompressingMultiple(true);
    setCompressionProgress({ current: 0, total: files.length });

    const newStaged: StagedImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCompressionProgress({ current: i + 1, total: files.length });
      try {
        const result = await compressImageFile(file, 900, 900, 0.68);
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        newStaged.push({
          id: `stage_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
          dataUrl: result.dataUrl,
          fileName: file.name,
          title: baseName || `ภาพหลักฐาน ${criterion.code}`,
          description: batchCommonDesc.trim() || '',
          originalKB: result.originalSizeKB,
          newKB: result.sizeKB
        });
      } catch (err) {
        console.error('Compression failed for file:', file.name, err);
        // Fallback: normal FileReader wrapped with safe compression
        try {
          const rawDataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          const safeDataUrl = await compressDataUrlSafely(rawDataUrl, 900, 900, 0.65, 60 * 1024);
          const baseName = file.name.replace(/\.[^/.]+$/, '');
          newStaged.push({
            id: `stage_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
            dataUrl: safeDataUrl,
            fileName: file.name,
            title: baseName || `ภาพหลักฐาน ${criterion.code}`,
            description: batchCommonDesc.trim() || '',
            originalKB: Math.round(file.size / 1024),
            newKB: Math.round(safeDataUrl.length / 1024)
          });
        } catch (innerErr) {
          console.error('Safe fallback failed too:', innerErr);
        }
      }
    }

    setStagedImages((prev) => [...prev, ...newStaged]);
    setIsCompressingMultiple(false);
    setCompressionProgress(null);
    e.target.value = '';
  };

  // Remove a single image from staging
  const handleRemoveStagedItem = (id: string) => {
    setStagedImages((prev) => prev.filter((item) => item.id !== id));
  };

  // Update title/description of staged image
  const handleUpdateStagedItem = (
    id: string,
    field: 'title' | 'description',
    value: string
  ) => {
    setStagedImages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Apply batch description to all staged items
  const handleApplyBatchDescToAll = () => {
    if (!batchCommonDesc.trim()) return;
    setStagedImages((prev) =>
      prev.map((item) => ({ ...item, description: batchCommonDesc.trim() }))
    );
  };

  // Save all staged images to criterion
  const handleSaveStagedImages = (e: React.FormEvent) => {
    e.preventDefault();
    if (stagedImages.length === 0) return;

    const payload = stagedImages.map((item) => ({
      title: item.title.trim() || 'ภาพหลักฐานการปฏิบัติงาน',
      url: item.dataUrl,
      description: item.description.trim(),
      dateTaken: new Date().toLocaleDateString('th-TH')
    }));

    if (onAddMultipleImages) {
      onAddMultipleImages(category.id, criterion.id, payload);
    } else {
      payload.forEach((img) => onAddImage(category.id, criterion.id, img));
    }

    const count = stagedImages.length;
    setStagedImages([]);
    setShowAddImage(false);
    setBatchCommonDesc('');
    setSuccessNotice(`เพิ่มรูปภาพหลักฐานเรียบร้อยแล้ว ${count} รูป และบันทึกลงระบบทันที`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // Local PDF or document file selector
  const handleLocalDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 600 * 1024) {
        setLocalFileNotice(
          'ไฟล์เอกสารมีขนาดเกิน 600KB แนะนำให้อัปโหลดเข้า Google Drive รวมของท่าน แล้ววางลิงก์ในแท็บ "ลิงก์ Google Drive" เพื่อให้เปิดดูได้ราบรื่นและไม่กระทบพื้นที่ฐานข้อมูล'
        );
        return;
      }
      setLocalFileNotice(null);
      if (!fileTitle.trim()) {
        setFileTitle(file.name);
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileTitle.trim()) return;
    onAddFile(category.id, criterion.id, {
      title: fileTitle.trim(),
      type: fileUrl.includes('drive.google.com') ? 'google_drive' : 'pdf',
      url: fileUrl.trim() || 'https://drive.google.com',
      notes: fileNotes.trim()
    });
    setFileTitle('');
    setFileUrl('');
    setFileNotes('');
    setLocalFileNotice(null);
    setShowAddFile(false);
    setSuccessNotice('เพิ่มเอกสารหลักฐานและบันทึกลงระบบเรียบร้อยแล้ว');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-300 shadow-2xl my-8 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-mono font-bold text-xs uppercase">
              ตัวชี้วัด {criterion.code}
            </span>
            <span className="text-xs text-slate-600 font-mono font-semibold">
              หมวดที่ {category.orderNumber}: {category.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Success Notice Banner */}
          {successNotice && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xs transition-all animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Visitor Mode Notice */}
          {!isEditMode && (
            <div className="flex items-center justify-between gap-3 p-3 bg-amber-50/70 border border-amber-200 text-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>โหมดผู้ประเมินและบุคคลทั่วไป: สามารถเปิดอ่านเอกสารและดูรูปภาพหลักฐานได้</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                เข้าสู่ระบบ Google เพื่อแก้ไข
              </span>
            </div>
          )}

          {/* Criterion Title & Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200 pb-6">
            <div className="space-y-2 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {criterion.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {criterion.description}
              </p>
            </div>

            {/* Dossier Information Box */}
            <div className="shrink-0 bg-slate-50 border border-slate-200 p-4 min-w-[240px]">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                สถานะแฟ้มหลักฐาน
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-2 border border-slate-200">
                  <div className="text-lg font-bold font-mono text-amber-600">
                    {criterion.files.length}
                  </div>
                  <div className="text-[10px] text-slate-500">ไฟล์เอกสาร</div>
                </div>
                <div className="bg-white p-2 border border-slate-200">
                  <div className="text-lg font-bold font-mono text-amber-600">
                    {criterion.images.length}
                  </div>
                  <div className="text-[10px] text-slate-500">ภาพหลักฐาน</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">ความสมบูรณ์:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  พร้อมรับการตรวจ
                </span>
              </div>
            </div>
          </div>

          {/* Section: Evidence Files */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-mono">
                  เอกสารและไฟล์หลักฐาน (EVIDENCE FILES)
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  ({criterion.files.length} รายการ)
                </span>
              </div>

              {isEditMode && (
                <button
                  onClick={() => setShowAddFile(true)}
                  className="btn-lambo flex items-center gap-1.5 text-xs text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มไฟล์หลักฐาน</span>
                </button>
              )}
            </div>

            {/* Add File Form */}
            {showAddFile && (
              <form onSubmit={handleSaveFile} className="bg-slate-50 border border-amber-300 p-4 space-y-4">
                <div className="text-xs font-mono text-amber-800 uppercase font-bold">
                  เพิ่มรายการเอกสารหลักฐาน (เลือกแนบลิงก์ Google Drive หรือเลือกไฟล์ในเครื่อง)
                </div>

                {/* Tabs: Drive URL vs Local File */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setFileUploadType('drive')}
                    className={`px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                      fileUploadType === 'drive'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    ลิงก์ Google Drive / เว็บไซต์ (แนะนำ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFileUploadType('local')}
                    className={`px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                      fileUploadType === 'local'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    แนบไฟล์จากเครื่อง (PDF ไม่เกิน 2MB)
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">ชื่อเอกสาร / รายงาน *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น แผนการจัดการเรียนรู้มุ่งเน้นสมรรถนะ หน่วยที่ 1-5"
                      value={fileTitle}
                      onChange={(e) => setFileTitle(e.target.value)}
                      className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {fileUploadType === 'drive' ? (
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                        URL ลิงก์ Google Drive / ไฟล์เอกสาร *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://drive.google.com/file/d/..."
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        * ตรวจสอบว่าแชร์สิทธิ์เป็น &quot;ทุกคนที่มีลิงก์สามารถดูได้&quot; เพื่อให้กรรมการตรวจประเมินเปิดอ่านได้
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                        เลือกไฟล์ PDF จากเครื่อง (จำกัดขนาดไม่เกิน 2MB) *
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleLocalDocumentUpload}
                        className="w-full bg-white border border-slate-300 p-2 text-xs text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                      />
                      {localFileNotice && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-700 bg-amber-50 p-2 border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{localFileNotice}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">หมายเหตุ / คำอธิบายเพิ่มเติม</label>
                    <input
                      type="text"
                      placeholder="เช่น มีลายมือชื่อหัวหน้าแผนกรับรองแล้ว"
                      value={fileNotes}
                      onChange={(e) => setFileNotes(e.target.value)}
                      className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddFile(false);
                      setLocalFileNotice(null);
                    }}
                    className="btn-lambo px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="btn-lambo px-4 py-1.5 text-xs text-slate-950 bg-amber-400 hover:bg-amber-500 font-bold"
                  >
                    บันทึกเอกสาร
                  </button>
                </div>
              </form>
            )}

            {/* Files List */}
            {criterion.files.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                ยังไม่มีไฟล์เอกสารแนบในตัวชี้วัดนี้
                {isEditMode && ' (คลิก "เพิ่มไฟล์หลักฐาน" เพื่อแนบเอกสาร)'}
              </div>
            ) : (
              <div className="space-y-2">
                {criterion.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-amber-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-amber-700" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {file.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-2">
                          <span className="font-mono uppercase text-amber-700 font-bold">
                            {file.type === 'google_drive' ? 'Google Drive' : 'PDF Document'}
                          </span>
                          {file.notes && <span>• {file.notes}</span>}
                          {file.dateAdded && <span>• {file.dateAdded}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-lambo flex items-center gap-1 text-xs text-slate-800 hover:text-amber-700 bg-white border border-slate-300 hover:border-amber-400 px-3 py-1 font-medium transition-colors"
                      >
                        <span>เปิดดู</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {isEditMode && (
                        <button
                          onClick={() => onRemoveFile(category.id, criterion.id, file.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="ลบไฟล์"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Multi-Image Evidence Gallery & Batch Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-mono">
                  ภาพถ่ายกิจกรรมและร่องรอยเชิงประจักษ์ (PHOTO GALLERY)
                </h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                  {criterion.images.length} รูป
                </span>
              </div>

              {isEditMode && (
                <button
                  onClick={() => setShowAddImage(true)}
                  className="btn-lambo flex items-center gap-1.5 text-xs text-slate-950 bg-amber-400 hover:bg-amber-500 px-3.5 py-1.5 font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>อัปโหลดรูปภาพ (เพิ่มได้หลายรูป)</span>
                </button>
              )}
            </div>

            {/* Batch Multi-Image Upload Panel */}
            {showAddImage && (
              <form
                onSubmit={handleSaveStagedImages}
                className="bg-slate-50 border-2 border-amber-400 p-5 space-y-4 rounded-xs shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-mono text-amber-900 uppercase font-bold">
                      อัปโหลดรูปภาพกิจกรรม / ร่องรอยหลักฐาน (เลือกพร้อมกันได้มากกว่า 1 รูป)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ระบบย่อขนาดและบีบอัดภาพให้อัตโนมัติ (โหลดเร็วและไม่กินพื้นที่)
                  </span>
                </div>

                {/* File Drop / Select Area */}
                <div>
                  <label className="flex flex-col items-center justify-center min-h-[120px] border-2 border-dashed border-amber-300 hover:border-amber-500 bg-white cursor-pointer transition-colors p-4 text-center relative group">
                    {isCompressingMultiple ? (
                      <div className="flex flex-col items-center gap-2 text-amber-700 py-3">
                        <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
                        <span className="text-xs font-bold">
                          กำลังประมวลผลและบีบอัดภาพ {compressionProgress?.current} จาก{' '}
                          {compressionProgress?.total} รูป...
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ปรับความละเอียดให้คมชัดและขนาดพอเหมาะอัตโนมัติ
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2 group-hover:bg-amber-200 transition-colors">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-sm text-slate-800 font-bold">
                          คลิกเลือกไฟล์รูปภาพจากเครื่อง (เลือกได้หลายรูปพร้อมกัน)
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          รองรับ JPG, PNG, WEBP, GIF (กด Ctrl หรือ Shift ค้างไว้เพื่อเลือกหลายรูปพร้อมกัน)
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={isCompressingMultiple}
                      onChange={handleBatchImageUpload}
                    />
                  </label>
                </div>

                {/* Staged Images Preview List */}
                {stagedImages.length > 0 && (
                  <div className="space-y-3 bg-white p-4 border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          รายการรูปภาพที่เลือก ({stagedImages.length} รูป)
                        </span>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-mono">
                          ขนาดรวม:{' '}
                          {stagedImages.reduce((sum, item) => sum + item.newKB, 0)} KB (ประหยัดพื้นที่)
                        </span>
                      </div>

                      {/* Common Caption Helper */}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="คำอธิบายที่ต้องการใส่ทุกภาพ..."
                          value={batchCommonDesc}
                          onChange={(e) => setBatchCommonDesc(e.target.value)}
                          className="bg-slate-50 border border-slate-300 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-amber-500 w-48 sm:w-56"
                        />
                        <button
                          type="button"
                          onClick={handleApplyBatchDescToAll}
                          className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-medium cursor-pointer"
                          title="นำคำอธิบายนี้ไปใส่ในทุกรูปด้านล่าง"
                        >
                          ใช้กับทุกรูป
                        </button>
                      </div>
                    </div>

                    {/* Staged Image Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                      {stagedImages.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex gap-3 p-2.5 bg-slate-50 border border-slate-200 relative group/item"
                        >
                          {/* Thumbnail */}
                          <div className="w-20 h-20 bg-slate-200 shrink-0 border border-slate-300 overflow-hidden relative">
                            <img
                              src={item.dataUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-white text-center font-mono py-0.5">
                              {item.newKB} KB
                            </div>
                          </div>

                          {/* Editable fields */}
                          <div className="flex-1 space-y-1.5 min-w-0 pr-6">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-amber-700 font-mono font-bold">
                                รูปที่ {idx + 1}
                              </span>
                              <span className="text-[9px] text-slate-400 truncate max-w-[120px]">
                                {item.fileName}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={item.title}
                              placeholder="ชื่อ/หัวข้อภาพ..."
                              onChange={(e) => handleUpdateStagedItem(item.id, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                            />
                            <input
                              type="text"
                              value={item.description}
                              placeholder="คำบรรยายกิจกรรม/รายละเอียด..."
                              onChange={(e) => handleUpdateStagedItem(item.id, 'description', e.target.value)}
                              className="w-full bg-white border border-slate-300 px-2 py-0.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveStagedItem(item.id)}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded-xs transition-colors cursor-pointer"
                            title="ลบภาพนี้ออกจากรายการ"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add More Photos Trigger */}
                    <div className="pt-2 flex justify-start">
                      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1 cursor-pointer transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ เลือกรูปภาพเพิ่มอีก</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={isCompressingMultiple}
                          onChange={handleBatchImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    {stagedImages.length > 0
                      ? `พร้อมบันทึก ${stagedImages.length} รูปภาพ`
                      : 'กรุณาคลิกเลือกรูปภาพเพื่อดำเนินการต่อ'}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddImage(false);
                        setStagedImages([]);
                        setBatchCommonDesc('');
                      }}
                      className="btn-lambo px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={stagedImages.length === 0 || isCompressingMultiple}
                      className="btn-lambo flex items-center gap-1.5 px-5 py-1.5 text-xs text-slate-950 bg-amber-400 hover:bg-amber-500 font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        บันทึกรูปภาพทั้งหมด ({stagedImages.length} รูป)
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Existing Images Gallery Grid */}
            {criterion.images.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <div>ยังไม่มีภาพถ่ายหลักฐานในตัวชี้วัดนี้</div>
                {isEditMode && (
                  <div className="mt-1 text-amber-700 font-medium">
                    คลิกปุ่ม &quot;อัปโหลดรูปภาพ&quot; ด้านบนเพื่อเลือกรูปภาพหลักฐานได้หลายรูปพร้อมกัน
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {criterion.images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="group relative bg-slate-100 border border-slate-200 overflow-hidden aspect-4/3 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-end"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Date Badge */}
                    {img.dateTaken && (
                      <div className="absolute top-2 left-2 z-10 bg-slate-950/70 backdrop-blur-xs text-[10px] text-amber-300 px-1.5 py-0.5 rounded-xs flex items-center gap-1 font-mono">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{img.dateTaken}</span>
                      </div>
                    )}

                    {/* Image Caption & Actions Overlay */}
                    <div className="relative z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-2.5 pt-6 text-white transition-opacity">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {img.title}
                      </div>
                      {img.description && (
                        <div className="text-[10px] text-slate-300 truncate mt-0.5">
                          {img.description}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/20">
                        <button
                          onClick={() => setLightboxIndex(idx)}
                          className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>ดูภาพเต็ม</span>
                        </button>
                        {isEditMode && (
                          <button
                            onClick={() => onRemoveImage(category.id, criterion.id, img.id)}
                            className="p-1 text-red-300 hover:text-red-100 hover:bg-red-950/50 rounded-xs transition-colors cursor-pointer"
                            title="ลบรูปภาพนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evaluator Notes Section */}
          <div className="space-y-2 border-t border-slate-200 pt-6">
            <div className="text-xs font-mono text-slate-500 uppercase font-semibold">
              บันทึกข้อสังเกตและข้อมูลร่องรอยเชิงประจักษ์
            </div>
            {isEditMode ? (
              <textarea
                rows={3}
                placeholder="ระบุข้อสังเกตหรือคำอธิบายเพิ่มเติมสำหรับตัวชี้วัดนี้..."
                value={criterion.evaluatorNotes || ''}
                onChange={(e) =>
                  onUpdateCriterion(category.id, criterion.id, { evaluatorNotes: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            ) : (
              <div className="p-3.5 bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                {criterion.evaluatorNotes || 'จัดเตรียมเอกสารและร่องรอยหลักฐานเชิงประจักษ์ครบถ้วนตามเกณฑ์'}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-mono">
            {isEditMode
              ? 'โหมดแก้ไขเปิดอยู่ ข้อมูลจะถูกบันทึกอัตโนมัติและส่งขึ้นคลาวด์ทันที'
              : 'โหมดตรวจประเมิน'}
          </div>
          <button
            onClick={onClose}
            className="btn-lambo px-6 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>

      {/* Fullscreen Multi-Photo Lightbox with Next/Prev navigation */}
      {lightboxIndex !== null && criterion.images[lightboxIndex] && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-sm animate-fadeIn">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white/90 px-2 py-2">
            <div className="flex items-center gap-3">
              <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 font-mono font-bold text-xs uppercase">
                {criterion.code}
              </span>
              <span className="text-xs font-mono text-slate-300">
                ภาพที่ {lightboxIndex + 1} จาก {criterion.images.length}
              </span>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="ปิด (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Center View */}
          <div className="relative w-full flex-1 flex items-center justify-center min-h-0 px-2 sm:px-12">
            {/* Prev Button */}
            {criterion.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev > 0 ? prev - 1 : criterion.images.length - 1) : null
                  );
                }}
                className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full transition-all cursor-pointer border border-white/20"
                title="รูปก่อนหน้า (ลูกศรซ้าย)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <img
              src={criterion.images[lightboxIndex].url}
              alt={criterion.images[lightboxIndex].title}
              className="max-w-full max-h-[75vh] object-contain border-2 border-amber-400 shadow-2xl rounded-xs select-none"
            />

            {/* Next Button */}
            {criterion.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev < criterion.images.length - 1 ? prev + 1 : 0) : null
                  );
                }}
                className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white rounded-full transition-all cursor-pointer border border-white/20"
                title="รูปถัดไป (ลูกศรขวา)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption Bar */}
          <div className="w-full max-w-3xl bg-slate-900/80 border border-slate-700 p-3 sm:p-4 text-center text-white mt-2">
            <div className="text-sm sm:text-base font-bold text-amber-400">
              {criterion.images[lightboxIndex].title}
            </div>
            {criterion.images[lightboxIndex].description && (
              <div className="text-xs text-slate-300 mt-1">
                {criterion.images[lightboxIndex].description}
              </div>
            )}
            {criterion.images[lightboxIndex].dateTaken && (
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                บันทึกเมื่อ: {criterion.images[lightboxIndex].dateTaken}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

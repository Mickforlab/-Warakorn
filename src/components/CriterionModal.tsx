import React, { useState } from 'react';
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
  BookmarkCheck
} from 'lucide-react';

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
  onRemoveImage
}) => {
  // New File Form State
  const [showAddFile, setShowAddFile] = useState(false);
  const [fileTitle, setFileTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileNotes, setFileNotes] = useState('');

  // New Image Form State
  const [showAddImage, setShowAddImage] = useState(false);
  const [imageTitle, setImageTitle] = useState('');
  const [imageDesc, setImageDesc] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Lightbox State
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  // File Upload to Base64 Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
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
    setShowAddFile(false);
  };

  const handleSaveImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewImage && !imageTitle.trim()) return;
    onAddImage(category.id, criterion.id, {
      title: imageTitle.trim() || 'ภาพหลักฐานการปฏิบัติงาน',
      url: previewImage || '',
      description: imageDesc.trim(),
      dateTaken: new Date().toLocaleDateString('th-TH')
    });
    setImageTitle('');
    setImageDesc('');
    setPreviewImage(null);
    setShowAddImage(false);
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
            <div className="bg-slate-50 border border-slate-200 p-4 shrink-0 min-w-[200px]">
              <div className="text-[11px] font-mono text-slate-500 uppercase">
                ประเภทการประเมิน
              </div>
              <div className="text-base font-bold text-amber-700 mt-1 flex items-center gap-1.5 font-mono">
                <BookmarkCheck className="w-4 h-4 text-amber-600" />
                <span>ตัวชี้วัดที่ {criterion.code}</span>
              </div>
              <div className="text-xs text-slate-700 mt-1 font-medium">
                {category.domain === 'behavior' ? 'ด้านการปฏิบัติตน' : 'ด้านการปฏิบัติงาน'}
              </div>
              <div className="text-[11px] text-emerald-700 mt-2 pt-2 border-t border-slate-200 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>พร้อมให้คณะกรรมการตรวจ</span>
              </div>
            </div>
          </div>

          {/* Verification Methods & Evidence Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 border border-slate-200">
            {/* Methods */}
            <div>
              <div className="text-xs font-mono text-amber-700 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-600" />
                <span>วิธีการประเมินและร่องรอย</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {criterion.evidenceMethods.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">✔</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Document Checklist */}
            <div>
              <div className="text-xs font-mono text-sky-700 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>เอกสารและหลักฐานอ้างอิงที่ตรวจสอบ</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {criterion.evidenceDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold">▪</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Google Drive Files & Document Attachments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-mono">
                  เอกสารและแฟ้มข้อมูลแนบ (EVIDENCE FILES)
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
                  <span>เพิ่มไฟล์ / ลิงก์ Drive</span>
                </button>
              )}
            </div>

            {/* Add File Form */}
            {showAddFile && (
              <form onSubmit={handleSaveFile} className="bg-slate-50 border border-amber-300 p-4 space-y-3">
                <div className="text-xs font-mono text-amber-800 uppercase font-bold">
                  แนบเอกสารหรือวางลิงก์ Google Drive
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">ชื่อเอกสาร / รายงาน *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น บันทึกการลงเวลาปฏิบัติราชการ.pdf"
                      value={fileTitle}
                      onChange={(e) => setFileTitle(e.target.value)}
                      className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">ลิงก์ Google Drive หรือ URL ไฟล์</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1 font-medium">คำอธิบายเพิ่มเติม / หมายเหตุ</label>
                  <input
                    type="text"
                    placeholder="เช่น ตรวจสอบหน้า 4-12 สำหรับผลการทดสอบ"
                    value={fileNotes}
                    onChange={(e) => setFileNotes(e.target.value)}
                    className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddFile(false)}
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

            {/* File List */}
            {criterion.files.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                ยังไม่มีไฟล์เอกสารแนบในตัวชี้วัดนี้
                {isEditMode && ' (คลิกปุ่ม "เพิ่มไฟล์ / ลิงก์ Drive" เพื่อแนบเอกสาร)'}
              </div>
            ) : (
              <div className="space-y-2">
                {criterion.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="w-8 h-8 bg-sky-100 flex items-center justify-center shrink-0 text-sky-700">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-amber-700 transition-colors flex items-center gap-1.5 truncate"
                        >
                          <span className="truncate">{file.title}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        {file.notes && (
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {file.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-lambo text-xs text-slate-800 bg-white hover:bg-amber-400 hover:text-slate-950 border border-slate-300 px-3 py-1.5 transition-colors font-bold"
                      >
                        เปิดดู
                      </a>
                      {isEditMode && (
                        <button
                          onClick={() => onRemoveFile(category.id, criterion.id, file.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
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

          {/* Section: Evidence Images Gallery & Direct Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-mono">
                  ภาพถ่ายกิจกรรมและร่องรอยเชิงประจักษ์ (PHOTO GALLERY)
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  ({criterion.images.length} รูป)
                </span>
              </div>

              {isEditMode && (
                <button
                  onClick={() => setShowAddImage(true)}
                  className="btn-lambo flex items-center gap-1.5 text-xs text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>อัปโหลดรูปภาพ</span>
                </button>
              )}
            </div>

            {/* Add Image Form */}
            {showAddImage && (
              <form onSubmit={handleSaveImage} className="bg-slate-50 border border-amber-300 p-4 space-y-4">
                <div className="text-xs font-mono text-amber-800 uppercase font-bold">
                  อัปโหลดภาพถ่ายกิจกรรมหรือหลักฐานร่องรอย
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File Picker */}
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">เลือกรูปภาพจากเครื่อง *</label>
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white cursor-pointer transition-colors p-4 text-center">
                      <Upload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-800 font-bold">คลิกเลือกไฟล์รูปภาพ (JPG, PNG)</span>
                      <span className="text-[10px] text-slate-500">บันทึกลงเว็บทันที</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                    </label>
                  </div>

                  {/* Preview box */}
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">ตัวอย่างภาพ</label>
                    <div className="h-32 bg-white border border-slate-300 flex items-center justify-center overflow-hidden">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">ยังไม่ได้เลือกรูป</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">คำบรรยายใต้ภาพ</label>
                    <input
                      type="text"
                      placeholder="เช่น ภาพการสาธิตการเชื่อมมิก/ทิกแก่ผู้เรียน"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                      className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">รายละเอียดเพิ่มเติม</label>
                    <input
                      type="text"
                      placeholder="เช่น โรงฝึกงานช่างเชื่อม ภาคเรียนที่ 1"
                      value={imageDesc}
                      onChange={(e) => setImageDesc(e.target.value)}
                      className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddImage(false);
                      setPreviewImage(null);
                    }}
                    className="btn-lambo px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={!previewImage}
                    className="btn-lambo px-4 py-1.5 text-xs text-slate-950 bg-amber-400 hover:bg-amber-500 font-bold disabled:opacity-50"
                  >
                    บันทึกรูปภาพ
                  </button>
                </div>
              </form>
            )}

            {/* Images Grid */}
            {criterion.images.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                ยังไม่มีภาพถ่ายหลักฐานในตัวชี้วัดนี้
                {isEditMode && ' (คลิก "อัปโหลดรูปภาพ" เพื่อเพิ่มรูป)'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {criterion.images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative bg-slate-100 border border-slate-200 overflow-hidden aspect-4/3"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                      <div className="text-xs font-semibold text-white truncate">
                        {img.title}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <button
                          onClick={() => setActiveLightboxImg(img.url)}
                          className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>ดูภาพเต็ม</span>
                        </button>
                        {isEditMode && (
                          <button
                            onClick={() => onRemoveImage(category.id, criterion.id, img.id)}
                            className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
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
            {isEditMode ? 'โหมดแก้ไขเปิดอยู่ ข้อมูลจะถูกบันทึกอัตโนมัติ' : 'โหมดตรวจประเมิน'}
          </div>
          <button
            onClick={onClose}
            className="btn-lambo px-6 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>

      {/* Lightbox for full image view */}
      {activeLightboxImg && (
        <div
          onClick={() => setActiveLightboxImg(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={activeLightboxImg}
            alt="Enlarged"
            className="max-w-full max-h-[90vh] object-contain border-2 border-amber-400 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

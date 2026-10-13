import React, { useState } from 'react';
import { TeacherProfile } from '../types/evaluation';
import { X, Upload, Sliders, Image as ImageIcon, RotateCcw, Check, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompression';

interface BackgroundCustomizerModalProps {
  profile: TeacherProfile;
  onUpdateBackground: (settings: {
    bgImageUrl?: string;
    bgOpacity?: number;
    bgBlur?: number;
    showVectorOverlay?: boolean;
  }) => void;
  onClose: () => void;
}

export const BackgroundCustomizerModal: React.FC<BackgroundCustomizerModalProps> = ({
  profile,
  onUpdateBackground,
  onClose
}) => {
  const [bgImageUrl, setBgImageUrl] = useState<string>(profile.bgImageUrl || '');
  const [bgOpacity, setBgOpacity] = useState<number>(profile.bgOpacity ?? 35);
  const [bgBlur, setBgBlur] = useState<number>(profile.bgBlur ?? 0);
  const [showVectorOverlay, setShowVectorOverlay] = useState<boolean>(profile.showVectorOverlay ?? true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const showSuccessFeedback = (msg: string) => {
    setSaveFeedback(msg);
    setTimeout(() => {
      setSaveFeedback(null);
    }, 3500);
  };

  // File Upload to Base64 with compression (safe ~50-90KB)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setSaveFeedback(null);
    try {
      const result = await compressImageFile(file, 1000, 700, 0.62);
      setBgImageUrl(result.dataUrl);
      onUpdateBackground({
        bgImageUrl: result.dataUrl,
        bgOpacity,
        bgBlur,
        showVectorOverlay
      });
      showSuccessFeedback(`บันทึกรูปภาพจากคอมพิวเตอร์เรียบร้อย (${result.sizeKB} KB)`);
    } catch (err) {
      console.warn('Background image standard compression failed, attempting safe data URL fallback:', err);
      try {
        const rawUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
          reader.readAsDataURL(file);
        });
        const compressed = await compressImageFile(file, 800, 500, 0.50).then(r => r.dataUrl).catch(() => rawUrl);
        const safeUrl = compressed.length > 250 * 1024 ? '' : compressed;
        if (!safeUrl) {
          alert('ไฟล์รูปภาพมีขนาดใหญ่เกินไป กรุณาเลือกไฟล์ JPG/PNG ที่มีขนาดไม่เกิน 5MB');
          return;
        }
        setBgImageUrl(safeUrl);
        onUpdateBackground({
          bgImageUrl: safeUrl,
          bgOpacity,
          bgBlur,
          showVectorOverlay
        });
        showSuccessFeedback('บันทึกรูปภาพพื้นหลังเรียบร้อย');
      } catch {
        alert('ไม่สามารถประมวลผลไฟล์รูปภาพได้');
      }
    } finally {
      setIsUploading(false);
      // Reset input value so re-selecting same file triggers onChange
      e.target.value = '';
    }
  };

  const handleOpacityChange = (val: number) => {
    setBgOpacity(val);
    onUpdateBackground({
      bgImageUrl,
      bgOpacity: val,
      bgBlur,
      showVectorOverlay
    });
  };

  const handleBlurChange = (val: number) => {
    setBgBlur(val);
    onUpdateBackground({
      bgImageUrl,
      bgOpacity,
      bgBlur: val,
      showVectorOverlay
    });
  };

  const handleToggleVector = (checked: boolean) => {
    setShowVectorOverlay(checked);
    onUpdateBackground({
      bgImageUrl,
      bgOpacity,
      bgBlur,
      showVectorOverlay: checked
    });
  };

  // High-Tech Welding Presets
  const presets = [
    {
      name: 'หุ่นยนต์เชื่อมเลเซอร์ความแม่นยำสูง',
      tag: 'Robotic Laser Welding',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'ช่างเชื่อมโลหะ TIG / MIG ประกายไฟ',
      tag: 'Industrial Arc Welding',
      url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'โครงสร้างโลหะ 3D Metal Additive',
      tag: '3D Lattice Structure',
      url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80'
    },
    {
      name: 'โรงงานหุ่นยนต์และระบบเชื่อมอัตโนมัติ',
      tag: 'Smart Manufacturing Lab',
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80'
    }
  ];

  const handleSelectPreset = (url: string) => {
    setBgImageUrl(url);
    onUpdateBackground({
      bgImageUrl: url,
      bgOpacity,
      bgBlur,
      showVectorOverlay
    });
    showSuccessFeedback('บันทึกรูปภาพธีมงานเชื่อมแล้ว');
  };

  const handleClearImage = () => {
    setBgImageUrl('');
    onUpdateBackground({
      bgImageUrl: '',
      bgOpacity,
      bgBlur,
      showVectorOverlay
    });
    showSuccessFeedback('ลบรูปภาพพื้นหลังออกแล้ว (ใช้พื้นหลังเวกเตอร์)');
  };

  const handleReset = () => {
    setBgImageUrl('');
    setBgOpacity(35);
    setBgBlur(0);
    setShowVectorOverlay(true);
    onUpdateBackground({
      bgImageUrl: '',
      bgOpacity: 35,
      bgBlur: 0,
      showVectorOverlay: true
    });
    showSuccessFeedback('คืนค่าพื้นหลังเวกเตอร์ตั้งต้นเรียบร้อย');
  };

  const handleSaveAndClose = () => {
    onUpdateBackground({
      bgImageUrl,
      bgOpacity,
      bgBlur,
      showVectorOverlay
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-300 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-mono text-amber-800 uppercase font-bold tracking-wider">
              ตั้งค่ารูปพื้นหลัง & ความโปร่งแสง (BACKGROUND & OPACITY SETTINGS)
            </span>
          </div>
          <button
            onClick={handleSaveAndClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Feedback Banner */}
        {saveFeedback && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Active Background Summary Card */}
          <div className="bg-white border-2 border-slate-200 p-4 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-16 h-12 bg-slate-100 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center relative">
                {bgImageUrl ? (
                  <img
                    src={bgImageUrl}
                    alt="Current Background"
                    className="w-full h-full object-cover"
                    style={{
                      opacity: bgOpacity / 100,
                      filter: bgBlur > 0 ? `blur(${Math.min(bgBlur, 4)}px)` : 'none'
                    }}
                  />
                ) : (
                  <div className="text-[10px] text-slate-400 font-mono text-center p-1 font-bold">
                    VECTOR
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {bgImageUrl ? 'ภาพพื้นหลังที่กำลังใช้งาน' : 'ภาพพื้นหลังเวกเตอร์เริ่มต้น (ไม่มีรูปภาพ)'}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  ความโปร่งแสง: {bgOpacity}% · ความเบลอ: {bgBlur}px {showVectorOverlay ? '· ซ้อนลายเส้นหุ่นยนต์' : ''}
                </div>
              </div>
            </div>

            {bgImageUrl && (
              <button
                type="button"
                onClick={handleClearImage}
                className="btn-lambo inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer shrink-0"
                title="ลบรูปภาพนี้ออก"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ลบรูป</span>
              </button>
            )}
          </div>

          {/* Section 1: Live Opacity & Blur Controls */}
          <div className="bg-slate-50 border border-slate-200 p-5 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>ระดับความโปร่งแสงของรูปพื้นหลัง (Opacity)</span>
                </label>
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                  {bgOpacity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={bgOpacity}
                onChange={(e) => handleOpacityChange(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0% (ขาวล้วน)</span>
                <span>20% (จางโปร่งแสง)</span>
                <span>40% (แนะนำอ่านสบายตา)</span>
                <span>75% (ปานกลาง)</span>
                <span>100% (เข้มเต็มที่)</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                {[15, 30, 50, 75, 100].map((presetVal) => (
                  <button
                    key={presetVal}
                    type="button"
                    onClick={() => handleOpacityChange(presetVal)}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                      bgOpacity === presetVal
                        ? 'bg-amber-400 text-slate-950 border-amber-500'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-amber-400'
                    }`}
                  >
                    {presetVal}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>ความเบลอของรูปพื้นหลัง (Background Blur)</span>
                </label>
                <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 border border-sky-200">
                  {bgBlur}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={bgBlur}
                onChange={(e) => handleBlurChange(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-200"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0px (คมชัดเดิม)</span>
                <span>ช่วยให้อ่านตัวอักษรได้ชัดเจนขึ้น</span>
                <span>15px (เบลอนุ่มนวล)</span>
              </div>
            </div>

            {/* Checkbox for Vector Robot Arm Overlay */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  ซ้อนกราฟิกหุ่นยนต์เชื่อมหกแกน & โครงสร้าง 3D Additive
                </div>
                <div className="text-[11px] text-slate-500">
                  แสดงลายเส้นเวกเตอร์เทคโนโลยีงานเชื่อมซ้อนทับบนรูปภาพ
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVectorOverlay}
                  onChange={(e) => handleToggleVector(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Section 2: Choose or Upload Custom Image */}
          <div className="space-y-4">
            <div className="text-xs font-mono text-slate-500 uppercase font-bold">
              เลือกหรืออัปโหลดรูปพื้นหลังใหม่ (BACKGROUND IMAGE SOURCE)
            </div>

            {/* Upload Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed ${isUploading ? 'border-amber-400 bg-amber-50/50 cursor-wait' : 'border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 cursor-pointer'} transition-colors text-center`}>
                {isUploading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-amber-600 animate-spin mb-2" />
                    <span className="text-xs font-bold text-slate-900">กำลังประมวลผลและบีบอัดภาพ...</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">ปรับขนาดให้คมชัดและโหลดเร็ว</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-amber-600 mb-2" />
                    <span className="text-xs font-bold text-slate-900">อัปโหลดรูปจากเครื่องคอมพิวเตอร์</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">JPG, PNG หรือ WebP (ภาพงานเชื่อม / หุ่นยนต์)</span>
                    <span className="text-[10px] text-amber-700 font-semibold mt-1 bg-amber-100/60 px-2 py-0.5 rounded">ระบบบันทึกภาพอัตโนมัติ</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {/* Direct URL Input */}
              <div className="p-4 bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">หรือวางลิงก์รูปภาพ (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://.../welding_wallpaper.jpg"
                    value={bgImageUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBgImageUrl(val);
                      onUpdateBackground({
                        bgImageUrl: val,
                        bgOpacity,
                        bgBlur,
                        showVectorOverlay
                      });
                    }}
                    className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-2">
                  สามารถใส่ลิงก์ภาพจาก Google Drive หรือเว็บไซต์ภาพงานเชื่อมได้
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Presets */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-500 uppercase font-bold">
              ชุดภาพงานเชื่อมและเทคโนโลยีสำเร็จรูป (WELDING & TECH PRESETS)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`p-3 border transition-all cursor-pointer flex items-center gap-3 ${
                    bgImageUrl === preset.url
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="w-16 h-12 bg-slate-200 overflow-hidden shrink-0">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {preset.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {preset.tag}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 flex flex-wrap justify-between items-center gap-3 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="btn-lambo flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>คืนค่าพื้นหลังเวกเตอร์ตั้งต้น</span>
            </button>

            <button
              onClick={handleSaveAndClose}
              className="btn-lambo flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกและเสร็จสิ้น</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

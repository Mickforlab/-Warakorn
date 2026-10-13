import React, { useState } from 'react';
import { TeacherProfile } from '../types/evaluation';
import { X, Upload, Sliders, Image as ImageIcon, RotateCcw, Check, Eye } from 'lucide-react';

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

  // File Upload to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setBgImageUrl(result);
        onUpdateBackground({
          bgImageUrl: result,
          bgOpacity,
          bgBlur,
          showVectorOverlay
        });
      };
      reader.readAsDataURL(file);
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
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
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
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 cursor-pointer transition-colors text-center">
                <Upload className="w-6 h-6 text-amber-600 mb-2" />
                <span className="text-xs font-bold text-slate-900">อัปโหลดรูปจากเครื่องคอมพิวเตอร์</span>
                <span className="text-[11px] text-slate-500 mt-0.5">JPG, PNG หรือ WebP (ภาพงานเชื่อม / หุ่นยนต์)</span>
                <input
                  type="file"
                  accept="image/*"
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
                      setBgImageUrl(e.target.value);
                      onUpdateBackground({
                        bgImageUrl: e.target.value,
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

          {/* Reset button */}
          <div className="pt-2 flex justify-between items-center border-t border-slate-200">
            <button
              onClick={handleReset}
              className="btn-lambo flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>คืนค่าพื้นหลังเวกเตอร์ตั้งต้น</span>
            </button>

            <button
              onClick={onClose}
              className="btn-lambo px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs"
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

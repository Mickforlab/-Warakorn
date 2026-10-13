import React from 'react';
import { Type, ZoomIn, ZoomOut } from 'lucide-react';

interface FontSizeControllerProps {
  currentScale?: number;
  onScaleChange: (scale: number) => void;
  className?: string;
}

export const FontSizeController: React.FC<FontSizeControllerProps> = ({
  currentScale = 100,
  onScaleChange,
  className = ''
}) => {
  const scales = [85, 90, 100, 110, 120, 130, 140];

  const handleDecrease = () => {
    const currentIndex = scales.indexOf(currentScale);
    if (currentIndex > 0) {
      onScaleChange(scales[currentIndex - 1]);
    } else if (currentIndex === -1) {
      // Find closest lower scale
      const lower = [...scales].reverse().find(s => s < currentScale);
      onScaleChange(lower ?? 85);
    } else {
      onScaleChange(85);
    }
  };

  const handleIncrease = () => {
    const currentIndex = scales.indexOf(currentScale);
    if (currentIndex !== -1 && currentIndex < scales.length - 1) {
      onScaleChange(scales[currentIndex + 1]);
    } else if (currentIndex === -1) {
      // Find closest higher scale
      const higher = scales.find(s => s > currentScale);
      onScaleChange(higher ?? 140);
    } else {
      onScaleChange(140);
    }
  };

  const handleReset = () => {
    onScaleChange(100);
  };

  return (
    <div
      className={`inline-flex items-center gap-0.5 bg-slate-100 hover:bg-slate-50 border border-slate-300 p-0.5 text-slate-800 shadow-xs transition-colors ${className}`}
      title="ปรับขนาดตัวอักษร (A- / A+) หรือคลิก % เพื่อคืนค่า 100%"
    >
      <div className="hidden md:flex items-center pl-1.5 pr-0.5 text-slate-400">
        <Type className="w-3 h-3" />
      </div>

      <button
        type="button"
        onClick={handleDecrease}
        disabled={currentScale <= 85}
        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-white active:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer select-none"
        title="ลดขนาดตัวอักษร (A-)"
      >
        <span className="font-mono text-[11px]">A-</span>
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="px-1.5 py-0.5 font-mono text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:bg-amber-100/60 transition-colors min-w-[38px] text-center select-none cursor-pointer"
        title="ขนาดตัวอักษรปัจจุบัน (คลิกเพื่อรีเซ็ตเป็น 100%)"
      >
        {currentScale}%
      </button>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={currentScale >= 140}
        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-white active:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer select-none"
        title="เพิ่มขนาดตัวอักษร (A+)"
      >
        <span className="font-mono text-[13px]">A+</span>
      </button>
    </div>
  );
};

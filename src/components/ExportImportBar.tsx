import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';

interface ExportImportBarProps {
  onExport: () => void;
  onImport: (jsonString: string) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  onReset: () => void;
  isEditMode: boolean;
}

export const ExportImportBar: React.FC<ExportImportBarProps> = ({
  onExport,
  onImport,
  onReset,
  isEditMode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        if (content) {
          try {
            const res = await onImport(content);
            if (res.success) {
              setImportStatus('นำเข้าข้อมูลสำเร็จเรียบร้อย');
              setTimeout(() => setImportStatus(null), 4000);
            } else {
              setImportStatus(`ผิดพลาด: ${res.error || 'ไฟล์ไม่ถูกต้อง'}`);
              setTimeout(() => setImportStatus(null), 5000);
            }
          } catch (err: any) {
            setImportStatus(`ผิดพลาด: ${err?.message || 'ไม่สามารถนำเข้าข้อมูลได้'}`);
            setTimeout(() => setImportStatus(null), 5000);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetConfirm = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้น?')) {
      onReset();
    }
  };

  return (
    <div className="bg-slate-100 border-t border-slate-200 py-6 px-6">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Status and Auto-save notes */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
          <span>ระบบบันทึกข้อมูลอัตโนมัติ (Persistent Auto-Save & Cloud Sync Active)</span>
          {importStatus && (
            <span className="text-sky-700 font-semibold bg-sky-50 px-2.5 py-0.5 border border-sky-200">
              {importStatus}
            </span>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Export JSON */}
          <button
            onClick={onExport}
            className="btn-lambo flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer shadow-xs"
            title="ดาวน์โหลดไฟล์สำรองข้อมูล JSON สำหรับเก็บไว้หรือย้ายเครื่อง"
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span>สำรองข้อมูล (EXPORT JSON)</span>
          </button>

          {/* Import JSON */}
          {isEditMode && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-lambo flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer shadow-xs"
                title="นำเข้าข้อมูลจากไฟล์สำรอง JSON"
              >
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>นำเข้าข้อมูล (IMPORT JSON)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Reset to Initial Data */}
              <button
                onClick={handleResetConfirm}
                className="btn-lambo flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 bg-white border border-slate-300 hover:border-red-300 transition-colors cursor-pointer shadow-xs"
                title="รีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้น"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตข้อมูลเริ่มต้น</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { TeacherProfile } from '../types/evaluation';
import { X, Save, Upload, RotateCcw } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface EditProfileModalProps {
  profile: TeacherProfile;
  onSave: (updated: Partial<TeacherProfile>) => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...profile });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-300 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 border-b border-slate-200">
          <div className="text-xs font-mono text-amber-800 uppercase font-bold tracking-wider">
            แก้ไขข้อมูลผู้รับการประเมิน & ตราสัญลักษณ์ (PROFILE & LOGO SETTINGS)
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Logo Customizer */}
          <div className="p-4 bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-mono text-amber-800 uppercase font-bold">
              ตราสัญลักษณ์สถานศึกษา (COLLEGE LOGO)
            </div>
            <div className="flex items-center gap-4">
              <AppLogo customLogoUrl={formData.logoUrl} size={64} />
              <div className="flex-1 space-y-2">
                <div className="text-xs text-slate-600">
                  ตราสัญลักษณ์วิทยาลัยการอาชีพวังไกลกังวล (สามารถอัปโหลดไฟล์รูปภาพใหม่หรือใช้ตราทางการ)
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="btn-lambo inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>อัปโหลดรูป LOGO จากเครื่อง</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: "" }))}
                      className="btn-lambo inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-300"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>คืนค่าตราทางการ</span>
                    </button>
                  )}
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="หรือวาง URL รูปภาพ LOGO ที่ต้องการใช้งาน..."
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ชื่อ-นามสกุล ผู้รับการประเมิน *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ตำแหน่ง *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                สถานศึกษา *
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                สังกัด
              </label>
              <input
                type="text"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                แผนกวิชา / สาขา
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                การประเมินครั้งที่ (เลขอารบิก)
              </label>
              <input
                type="text"
                value={formData.evaluationRound}
                onChange={(e) => setFormData({ ...formData, evaluationRound: e.target.value })}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                วันที่ / ปีการศึกษา
              </label>
              <input
                type="text"
                value={formData.evaluationDate}
                onChange={(e) => setFormData({ ...formData, evaluationDate: e.target.value })}
                className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              ลิงก์ Google Drive รวมแฟ้มเอกสารหลักฐานทั้งหมด
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/drive/folders/..."
              value={formData.googleDriveMainLink}
              onChange={(e) => setFormData({ ...formData, googleDriveMainLink: e.target.value })}
              className="w-full bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              คณะกรรมการสามารถคลิกปุ่มบนแถบเมนูด้านบนเพื่อเปิดเข้าดูโฟลเดอร์ Google Drive นี้ได้ทันที
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              ข้อความสรุปวิสัยทัศน์ / แนวทางการปฏิบัติหน้าที่
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-lambo px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn-lambo flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการแก้ไข</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

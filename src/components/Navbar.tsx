import React from 'react';
import { AppLogo } from './AppLogo';
import { FontSizeController } from './FontSizeController';
import { ExternalLink, Edit3, CheckCircle2, Sliders } from 'lucide-react';
import { TeacherProfile } from '../types/evaluation';

interface NavbarProps {
  profile: TeacherProfile;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenEditProfile: () => void;
  onOpenBackgroundCustomizer: () => void;
  onScaleChange: (scale: number) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  isEditMode,
  onToggleEditMode,
  onOpenEditProfile,
  onOpenBackgroundCustomizer,
  onScaleChange,
  onScrollToSection
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand & Identity with Interactive Logo Upload/Change */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div
            onClick={isEditMode ? onOpenEditProfile : undefined}
            className={`relative group ${isEditMode ? 'cursor-pointer' : ''} w-[60px] h-[57.2375px] flex items-center justify-center`}
            title={isEditMode ? 'คลิกเพื่อเปลี่ยนรูป LOGO' : 'ตราสัญลักษณ์สถานศึกษา'}
          >
            <AppLogo customLogoUrl={profile.logoUrl} size={54} />
            {isEditMode && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-bold px-1 py-0.5 rounded shadow-xs uppercase tracking-tighter">
                แก้ LOGO
              </span>
            )}
          </div>
          <button
            onClick={() => onScrollToSection('hero')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-600 uppercase font-bold">
              PORTFOLIO · EVALUATION
            </div>
            <div className="text-sm sm:text-base font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors whitespace-nowrap">
              {profile.name}
            </div>
          </button>
        </div>

        {/* Zone 2: Clean Navigation Links with Arabic Numerals */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onScrollToSection('hero')}
            className="hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            ภาพรวม
          </button>
          <button
            onClick={() => onScrollToSection('domain-behavior')}
            className="hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            ด้านที่ 1: การปฏิบัติตน
          </button>
          <button
            onClick={() => onScrollToSection('domain-performance')}
            className="hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            ด้านที่ 2: การปฏิบัติงาน
          </button>
          <button
            onClick={() => onScrollToSection('evaluation-framework')}
            className="hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            โครงสร้าง 12 หมวดหมู่
          </button>
          <button
            onClick={() => onScrollToSection('evidence-vault')}
            className="hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            คลังเอกสาร & Drive
          </button>
        </nav>

        {/* Zone 3: Font Sizer, Background Customizer, Edit Mode & Drive */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Global Font Size Controller (A- / 100% / A+) */}
          <FontSizeController
            currentScale={profile.fontSizeScale ?? 100}
            onScaleChange={onScaleChange}
          />

          {/* Quick Background Customizer Button (Only in Edit Mode) */}
          {isEditMode && (
            <button
              onClick={onOpenBackgroundCustomizer}
              className="btn-lambo flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-amber-50 border border-slate-300 hover:border-amber-400 transition-colors cursor-pointer shadow-xs"
              title="ตั้งค่าภาพพื้นหลัง"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xl:inline">ภาพพื้นหลัง</span>
            </button>
          )}

          {/* Edit Mode Toggle */}
          <button
            onClick={onToggleEditMode}
            className={`btn-lambo flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
              isEditMode
                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300 hover:border-slate-400'
            }`}
            title="เปิด/ปิด โหมดแก้ไขข้อมูลและรูปภาพ"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden md:inline">
              {isEditMode ? 'โหมดแก้ไข' : 'แก้ไขข้อมูล'}
            </span>
            {isEditMode && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
          </button>

          {/* Quick Edit Profile Details */}
          {isEditMode && (
            <button
              onClick={onOpenEditProfile}
              className="btn-lambo hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:border-amber-500 transition-colors cursor-pointer"
            >
              แก้ไขโปรไฟล์ & LOGO
            </button>
          )}

          {/* Primary Action: Google Drive Link */}
          <a
            href={profile.googleDriveMainLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lambo flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 sm:px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap shadow-sm"
          >
            <span>Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};

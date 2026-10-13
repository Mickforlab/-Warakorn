import React from 'react';
import { AppLogo } from './AppLogo';
import { FontSizeController } from './FontSizeController';
import { AuthControl } from './AuthControl';
import { ExternalLink, Edit3, CheckCircle2, Sliders, Cloud, RefreshCw, AlertCircle, Share2 } from 'lucide-react';
import { TeacherProfile } from '../types/evaluation';
import { User } from 'firebase/auth';
import { NavbarSocialLinks } from './SocialChannels';

interface NavbarProps {
  profile: TeacherProfile;
  isEditMode: boolean;
  isAdmin: boolean;
  currentUser: User | null;
  isLoadingAuth: boolean;
  authError: string | null;
  syncStatus?: 'idle' | 'saving' | 'synced' | 'error';
  syncError?: string | null;
  onForceSync?: () => void;
  primaryAdminEmail: string;
  onLogin: () => void;
  onLogout: () => void;
  onClearError: () => void;
  onToggleEditMode: () => void;
  onOpenEditProfile: () => void;
  onOpenBackgroundCustomizer: () => void;
  onScaleChange: (scale: number) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenShare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  isEditMode,
  isAdmin,
  currentUser,
  isLoadingAuth,
  authError,
  syncStatus = 'idle',
  syncError,
  onForceSync,
  primaryAdminEmail,
  onLogin,
  onLogout,
  onClearError,
  onToggleEditMode,
  onOpenEditProfile,
  onOpenBackgroundCustomizer,
  onScaleChange,
  onScrollToSection,
  onOpenShare
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Brand & Identity with Interactive Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            onClick={isAdmin && isEditMode ? onOpenEditProfile : undefined}
            className={`relative group ${isAdmin && isEditMode ? 'cursor-pointer' : ''} w-[60px] h-[57.2375px] flex items-center justify-center`}
            title={isAdmin && isEditMode ? 'คลิกเพื่อเปลี่ยนรูป LOGO' : 'ตราสัญลักษณ์สถานศึกษา'}
          >
            <AppLogo customLogoUrl={profile.logoUrl} size={54} />
            {isAdmin && isEditMode && (
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

        {/* Zone 2: Navigation Links with Arabic Numerals */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-600">
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

        {/* Zone 3: Font Sizer, Auth, Admin Controls & Drive */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Social Media Links (TikTok & Facebook) */}
          <NavbarSocialLinks
            tiktokUrl={profile.tiktokUrl}
            facebookUrl={profile.facebookUrl}
          />

          {/* Cloud Sync Status (Only visible to logged-in Admin) */}
          {isAdmin && (
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-500 pr-1">
              {syncStatus === 'saving' && (
                <span className="flex items-center gap-1 text-amber-600">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>บันทึกลง Cloud...</span>
                </span>
              )}
              {syncStatus === 'synced' && (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ซิงค์เรียบร้อย</span>
                </span>
              )}
              {syncStatus === 'error' && (
                <button
                  onClick={onForceSync}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 border border-red-200 transition-colors cursor-pointer"
                  title={syncError || 'เกิดข้อผิดพลาดในการบันทึก คลิกเพื่อลองซิงค์ใหม่'}
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>บันทึกไม่สำเร็จ (ลองใหม่)</span>
                </button>
              )}
            </div>
          )}

          {/* Global Font Size Controller (A- / 100% / A+) */}
          <FontSizeController
            currentScale={profile.fontSizeScale ?? 100}
            onScaleChange={onScaleChange}
          />

          {/* Admin-only Controls: Background Customizer & Edit Profile */}
          {isAdmin && isEditMode && (
            <>
              <button
                onClick={onOpenBackgroundCustomizer}
                className="btn-lambo flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-amber-50 border border-slate-300 hover:border-amber-400 transition-colors cursor-pointer shadow-xs"
                title="ตั้งค่าภาพพื้นหลัง"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden xl:inline">ภาพพื้นหลัง</span>
              </button>

              <button
                onClick={onOpenEditProfile}
                className="btn-lambo hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:border-amber-500 transition-colors cursor-pointer"
              >
                แก้ไขโปรไฟล์ & LOGO
              </button>
            </>
          )}

          {/* Admin-only Edit Mode Toggle (Only visible if logged in as Admin) */}
          {isAdmin && (
            <button
              onClick={onToggleEditMode}
              className={`btn-lambo flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border cursor-pointer transition-colors ${
                isEditMode
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-300 hover:border-slate-400'
              }`}
              title="เปิด/ปิด โหมดแก้ไขข้อมูลและรูปภาพ"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">
                {isEditMode ? 'โหมดแก้ไข' : 'แก้ไขข้อมูล'}
              </span>
              {isEditMode && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
            </button>
          )}

          {/* Google Auth Control: Login / Profile / Logout */}
          <AuthControl
            currentUser={currentUser}
            isLoadingAuth={isLoadingAuth}
            isAdmin={isAdmin}
            authError={authError}
            onLogin={onLogin}
            onLogout={onLogout}
            onClearError={onClearError}
            primaryAdminEmail={primaryAdminEmail}
          />

          {/* Share Button (Only visible to the owner/admin) */}
          {isAdmin && onOpenShare && (
            <button
              onClick={onOpenShare}
              className="btn-lambo flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-amber-50 border border-slate-300 hover:border-amber-400 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              title="แชร์เว็บไซต์ หรือสร้าง QR Code สำหรับคณะกรรมการประเมิน"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">แชร์เว็บ</span>
            </button>
          )}

          {/* Primary Action: Google Drive Link (Accessible to Everyone) */}
          <a
            href={profile.googleDriveMainLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lambo flex items-center gap-1.5 sm:gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 sm:px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap shadow-sm"
            title="เปิด Google Drive คลังเอกสารหลักฐานทั้งหมด"
          >
            <span>Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};

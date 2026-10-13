import React from 'react';
import { TeacherProfile } from '../types/evaluation';
import { ExternalLink, Award, CheckCircle, ChevronDown, Sparkles, ShieldCheck, Sliders } from 'lucide-react';
import { AppLogo } from './AppLogo';
import { WeldingTechBackground } from './WeldingTechBackground';

interface HeroSectionProps {
  profile: TeacherProfile;
  totalFiles: number;
  totalImages: number;
  isEditMode: boolean;
  onExplore: () => void;
  onOpenEditProfile: () => void;
  onOpenBackgroundCustomizer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  totalFiles,
  totalImages,
  isEditMode,
  onExplore,
  onOpenEditProfile,
  onOpenBackgroundCustomizer
}) => {
  return (
    <section id="hero" className="relative min-h-[85vh] flex flex-col justify-center bg-white/40 backdrop-blur-[2px] border-b border-slate-200/80 overflow-hidden px-6 py-16">
      <div className="max-w-[1440px] mx-auto w-full relative z-10">
        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Big Typographic Impact */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-500 uppercase font-semibold">
                <span className="text-[13.8px]">แบบประเมินการเตรียมความพร้อมและพัฒนาอย่างเข้ม</span>
                <span>·</span>
                <span className="text-amber-700 font-bold">{profile.evaluationRound}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.05] uppercase">
                {profile.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-lg sm:text-xl font-normal text-slate-800 pt-2">
                <span className="text-amber-700 font-bold">{profile.position}</span>
                <span className="text-slate-400">·</span>
                <span className="font-medium">{profile.institution}</span>
              </div>
              <div className="text-sm text-slate-600 font-medium">
                สังกัด {profile.affiliation} · {profile.department}
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-700 max-w-2xl leading-relaxed pt-2">
              {profile.bio}
            </p>

            {/* CTAs in High-Tech Amber & Slate */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExplore}
                className="btn-lambo flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-4 text-sm font-bold tracking-wider uppercase cursor-pointer transition-colors shadow-md hover:shadow-lg"
              >
                <span>สำรวจแฟ้มผลงาน (EXPLORE DOSSIER)</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <a
                href={profile.googleDriveMainLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lambo flex items-center gap-2 bg-white/90 hover:bg-white text-slate-800 border-2 border-slate-300 hover:border-slate-800 px-6 py-4 text-sm font-bold tracking-wider uppercase transition-colors shadow-sm"
              >
                <span>เปิดแฟ้ม GOOGLE DRIVE</span>
                <ExternalLink className="w-4 h-4 text-amber-600" />
              </a>

              {/* Edit Mode Quick Profile Action Button */}
              {isEditMode && (
                <>
                  <button
                    onClick={onOpenEditProfile}
                    className="btn-lambo flex items-center gap-2 bg-white/90 hover:bg-slate-100 text-slate-800 border border-slate-300 px-5 py-4 text-sm font-semibold cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>แก้ไขข้อมูลส่วนตัว & LOGO</span>
                  </button>
                  <button
                    onClick={onOpenBackgroundCustomizer}
                    className="btn-lambo flex items-center gap-2 bg-white/90 hover:bg-slate-100 text-slate-800 border border-slate-300 px-5 py-4 text-sm font-semibold cursor-pointer shadow-xs"
                    title="เปลี่ยนภาพพื้นหลัง"
                  >
                    <Sliders className="w-4 h-4 text-amber-600" />
                    <span>เปลี่ยนภาพพื้นหลัง</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: High-Prestige Official Evaluation Card (White/Elevated) */}
          <div className="lg:col-span-5">
            <div className="relative bg-white/90 backdrop-blur-md border border-slate-200 p-8 space-y-6 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              {/* Corner High-Tech Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-24 h-4 bg-amber-500 rotate-45 translate-x-7 -translate-y-2" />
              </div>

              {/* Profile Card Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-6">
                <div>
                  <div className="text-[11px] font-mono text-amber-700 uppercase tracking-widest font-bold">
                    OFFICIAL DOSSIER
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">
                    {profile.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    ประเมินรอบ {profile.evaluationRound} · {profile.evaluationDate}
                  </div>
                </div>
                <AppLogo customLogoUrl={profile.logoUrl} size={58} />
              </div>

              {/* Status Highlight Banner */}
              <div className="bg-slate-50 p-5 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                    สถานะเอกสารและร่องรอยหลักฐาน
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>พร้อมรับการตรวจประเมิน</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-sky-700 font-semibold font-mono bg-sky-50 px-2 py-0.5 border border-sky-200">
                    เกณฑ์ ก.ค.ศ. สอศ.
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 font-mono">
                    {profile.evaluationRound}
                  </div>
                </div>
              </div>

              {/* Evaluation Structure Overview in Arabic Numerals */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-800">ด้านที่ 1: การปฏิบัติตน</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono font-medium">6 หมวดการประเมิน</span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-800">ด้านที่ 2: การปฏิบัติงาน</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono font-medium">6 หมวดการประเมิน</span>
                </div>
              </div>

              {/* Fast Stats Row in Arabic Numerals */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center border-t border-slate-200">
                <div className="p-2.5 bg-slate-50 border border-slate-100">
                  <div className="text-xl font-bold text-slate-900 font-mono">12</div>
                  <div className="text-[11px] text-slate-500">หมวดหมู่หลัก</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100">
                  <div className="text-xl font-bold text-slate-900 font-mono">44</div>
                  <div className="text-[11px] text-slate-500">ตัวชี้วัดย่อย</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100">
                  <div className="text-xl font-bold text-amber-600 font-mono">{totalFiles}</div>
                  <div className="text-[11px] text-slate-500">เอกสาร & ไฟล์แนบ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

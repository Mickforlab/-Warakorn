/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useEvaluationStore } from './hooks/useEvaluationStore';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EvaluationFramework } from './components/EvaluationFramework';
import { CategoryCard } from './components/CategoryCard';
import { CriterionModal } from './components/CriterionModal';
import { EditProfileModal } from './components/EditProfileModal';
import { BackgroundCustomizerModal } from './components/BackgroundCustomizerModal';
import { WeldingTechBackground } from './components/WeldingTechBackground';
import { ExportImportBar } from './components/ExportImportBar';
import { Footer } from './components/Footer';
import { FloatingSocialDock } from './components/SocialChannels';
import { ShareModal } from './components/ShareModal';
import {
  EvaluationCategory,
  EvaluationCriterion
} from './types/evaluation';
import {
  Search,
  ExternalLink,
  FolderOpen,
  FileText,
  Filter,
  ShieldCheck,
  Briefcase,
  Lock,
  Sparkles
} from 'lucide-react';

export default function App() {
  const {
    currentUser,
    isLoadingAuth,
    isAdmin,
    authError,
    login,
    logout,
    clearError,
    primaryAdminEmail
  } = useFirebaseAuth();

  const {
    profile,
    categories,
    isEditMode,
    setIsEditMode,
    activeDomain,
    setActiveDomain,
    searchQuery,
    setSearchQuery,
    updateProfile,
    updateCriterion,
    addFileToCriterion,
    removeFileFromCriterion,
    addImageToCriterion,
    addMultipleImagesToCriterion,
    removeImageFromCriterion,
    behaviorCategories,
    performanceCategories,
    totalFiles,
    totalImages,
    exportBackupJSON,
    importBackupJSON,
    resetToDefault,
    syncStatus,
    syncError,
    forceSyncToCloud
  } = useEvaluationStore(currentUser, isLoadingAuth);

  // Active Criterion Modal state
  const [selectedItem, setSelectedItem] = useState<{
    category: EvaluationCategory;
    criterion: EvaluationCriterion;
  } | null>(null);

  // Edit Profile Modal state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Background Customizer Modal state
  const [isBgCustomizerOpen, setIsBgCustomizerOpen] = useState(false);

  // Share & QR Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Apply Root font scaling to documentElement so all Tailwind rem-based typography scales dynamically
  useEffect(() => {
    const scale = profile.fontSizeScale ?? 100;
    document.documentElement.style.fontSize = `${scale}%`;
  }, [profile.fontSizeScale]);

  // Filtered categories based on active domain and search
  const currentDomainCategories =
    activeDomain === 'behavior' ? behaviorCategories : performanceCategories;

  const filteredCategories = currentDomainCategories.map((cat) => {
    if (!searchQuery.trim()) return cat;
    const query = searchQuery.toLowerCase();
    const matchingCriteria = cat.criteria.filter(
      (crit) =>
        crit.code.toLowerCase().includes(query) ||
        crit.title.toLowerCase().includes(query) ||
        crit.description.toLowerCase().includes(query) ||
        crit.evidenceDocuments.some((doc) => doc.toLowerCase().includes(query))
    );
    return {
      ...cat,
      criteria: matchingCriteria
    };
  }).filter((cat) => cat.criteria.length > 0);

  // Smooth scroll helper
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'domain-behavior') {
      setActiveDomain('behavior');
      if (searchQuery) setSearchQuery('');
      setTimeout(() => {
        const el = document.getElementById('evaluation-explorer');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else if (sectionId === 'domain-performance') {
      setActiveDomain('performance');
      if (searchQuery) setSearchQuery('');
      setTimeout(() => {
        const el = document.getElementById('evaluation-explorer');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className="min-h-screen relative bg-white text-slate-900 selection:bg-amber-400 selection:text-black transition-all duration-150"
      style={{ fontSize: `${profile.fontSizeScale ?? 100}%` }}
    >
      {/* High-Tech Welding & Custom Wallpaper Background Mounted at Root (Applies to all pages/sections) */}
      <WeldingTechBackground
        customBgUrl={profile.bgImageUrl}
        opacity={profile.bgOpacity ?? 35}
        blur={profile.bgBlur ?? 0}
        showVectorOverlay={profile.showVectorOverlay ?? true}
        isFixed={true}
      />

      {/* 3-Zone High-Tech Navigation with Firebase Auth, Font Sizer & Background Controls */}
      <Navbar
        profile={profile}
        isEditMode={isEditMode}
        isAdmin={isAdmin}
        currentUser={currentUser}
        isLoadingAuth={isLoadingAuth}
        authError={authError}
        syncStatus={syncStatus}
        syncError={syncError}
        onForceSync={forceSyncToCloud}
        primaryAdminEmail={primaryAdminEmail}
        onLogin={login}
        onLogout={logout}
        onClearError={clearError}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenBackgroundCustomizer={() => setIsBgCustomizerOpen(true)}
        onScaleChange={(scale) => updateProfile({ fontSizeScale: scale })}
        onScrollToSection={handleScrollToSection}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Admin Logged-in Notice Ribbon */}
      {isAdmin && isEditMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm sticky top-20 z-40">
          <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-950 rounded-full animate-ping" />
              <span>
                คุณกำลังอยู่ใน <strong className="font-bold uppercase tracking-wider">โหมดแก้ไขข้อมูล (Admin Edit Mode)</strong> — เข้าสู่ระบบในนาม <strong className="font-mono">{currentUser?.email}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="underline hover:opacity-80 cursor-pointer"
              >
                แก้ไขโปรไฟล์
              </button>
              <button
                onClick={() => setIsBgCustomizerOpen(true)}
                className="underline hover:opacity-80 cursor-pointer"
              >
                ปรับแต่งภาพพื้นหลัง
              </button>
              <button
                onClick={() => setIsEditMode(false)}
                className="bg-slate-950 text-white px-2.5 py-1 text-[11px] font-bold rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ออกจากโหมดแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10">
        {/* Hero Stage (White Theme with Robotic Welding Tech & Custom Background) */}
        <HeroSection
          profile={profile}
          isAdmin={isAdmin}
          isEditMode={isEditMode}
          onExplore={() => handleScrollToSection('evaluation-framework')}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onOpenBackgroundCustomizer={() => setIsBgCustomizerOpen(true)}
          onOpenShare={() => setIsShareModalOpen(true)}
          totalFiles={totalFiles}
          totalImages={totalImages}
        />

        {/* Evaluation 12-Category High-Tech Framework */}
        <div id="evaluation-framework">
          <EvaluationFramework
            categories={categories}
            onSelectDomain={(domain) => {
              handleScrollToSection(domain === 'behavior' ? 'domain-behavior' : 'domain-performance');
            }}
            onSelectCategory={(catId) => {
              const targetCategory = categories.find((c) => c.id === catId);
              if (targetCategory) {
                setActiveDomain(targetCategory.domain);
                if (searchQuery) setSearchQuery('');
                setTimeout(() => {
                  const el = document.getElementById(`category-${catId}`) || document.getElementById(`cat-${catId}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    el.classList.add('ring-2', 'ring-amber-500', 'transition-all');
                    setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500'), 2500);
                  } else {
                    const explorer = document.getElementById('evaluation-explorer');
                    explorer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 80);
              }
            }}
          />
        </div>

        {/* Category Explorer Section */}
        <section id="evaluation-explorer" className="py-12 px-6">
          <div className="max-w-[1440px] mx-auto">
            {/* Domain Tabs & Filter Bar */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-4 sm:p-5 mb-8 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Domain Selector Tabs with Arabic numbers */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="tab-domain-behavior"
                    onClick={() => {
                      setActiveDomain('behavior');
                    }}
                    className={`btn-lambo flex items-center gap-2.5 px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      activeDomain === 'behavior'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>ด้านที่ 1: ด้านการปฏิบัติตน ({behaviorCategories.length} หมวดหมู่)</span>
                  </button>

                  <button
                    id="tab-domain-performance"
                    onClick={() => {
                      setActiveDomain('performance');
                    }}
                    className={`btn-lambo flex items-center gap-2.5 px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      activeDomain === 'performance'
                        ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>ด้านที่ 2: ด้านการปฏิบัติงาน ({performanceCategories.length} หมวดหมู่)</span>
                  </button>
                </div>

                {/* Search / Filter Input */}
                <div className="relative min-w-[280px] sm:min-w-[340px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาเกณฑ์, ตัวชี้วัด, หรือหลักฐาน..."
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List of Categories in Active Domain */}
            <div className="space-y-6">
              {filteredCategories.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-12 text-center text-slate-500">
                  <p className="text-sm">ไม่พบเกณฑ์การประเมินที่ตรงกับคำค้นหา "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs text-amber-600 hover:underline font-bold"
                  >
                    ล้างการค้นหา
                  </button>
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <div key={cat.id} id={`category-${cat.id}`}>
                    <CategoryCard
                      category={cat}
                      isEditMode={isEditMode}
                      onSelectCriterion={(catObj, critObj) =>
                        setSelectedItem({ category: catObj, criterion: critObj })
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Global Evidence & Google Drive Vault Section */}
        <section id="evidence-vault" className="py-12 px-6 bg-slate-50/90 border-t border-slate-200">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 mb-1">
                  OFFICIAL EVIDENCE ARCHIVE · ว.PA
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  คลังเอกสาร & ลิงก์ GOOGLE DRIVE
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  ศูนย์รวมโฟลเดอร์และไฟล์หลักฐานการประเมินแยกตามหมวดหมู่ เชื่อมโยงตรงสู่ Google Drive เพื่อการตรวจประเมิน
                </p>
              </div>

              {/* Main Drive Access Button */}
              <a
                href={profile.googleDriveMainLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lambo flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3 text-xs font-bold tracking-wider uppercase transition-all shadow-md shrink-0"
              >
                <FolderOpen className="w-4 h-4" />
                <span>เข้าสู่ GOOGLE DRIVE หลักทั้งหมด</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Grid of Category Folders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white p-4 border border-slate-200 hover:border-amber-400 transition-all shadow-xs flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                      <span className="font-bold text-amber-600">หมวดหมู่ที่ {cat.code}</span>
                      <span>คะแนนเต็ม {cat.maxScore}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
                      {cat.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 mb-4">
                      {cat.criteria.reduce((s, c) => s + c.files.length, 0)} ไฟล์เอกสาร ·{' '}
                      {cat.criteria.reduce((s, c) => s + c.images.length, 0)} รูปภาพหลักฐาน
                    </div>
                  </div>

                  <a
                    href={profile.googleDriveMainLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-amber-50 hover:text-amber-950 p-2 border border-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      เปิดดูโฟลเดอร์หมวด {cat.code}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating / Sticky Quick Action & Backup Bar */}
      <ExportImportBar
        onExport={exportBackupJSON}
        onImport={importBackupJSON}
        onReset={resetToDefault}
        isEditMode={isEditMode}
      />

      {/* Footer */}
      <Footer profile={profile} />

      {/* Floating Quick Social Access (TikTok & Facebook) */}
      <FloatingSocialDock
        tiktokUrl={profile.tiktokUrl}
        facebookUrl={profile.facebookUrl}
      />

      {/* Criterion Detail Modal */}
      {selectedItem && (
        <CriterionModal
          category={selectedItem.category}
          criterion={
            categories
              .find((c) => c.id === selectedItem.category.id)
              ?.criteria.find((cr) => cr.id === selectedItem.criterion.id) ||
            selectedItem.criterion
          }
          isEditMode={isEditMode}
          onClose={() => setSelectedItem(null)}
          onUpdateCriterion={updateCriterion}
          onAddFile={addFileToCriterion}
          onRemoveFile={removeFileFromCriterion}
          onAddImage={addImageToCriterion}
          onAddMultipleImages={addMultipleImagesToCriterion}
          onRemoveImage={removeImageFromCriterion}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          profile={profile}
          onSave={updateProfile}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* Background & Opacity Customizer Modal */}
      {isBgCustomizerOpen && (
        <BackgroundCustomizerModal
          profile={profile}
          onUpdateBackground={updateProfile}
          onClose={() => setIsBgCustomizerOpen(false)}
        />
      )}

      {/* Share & QR Code Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        teacherName={profile.name}
      />
    </div>
  );
}

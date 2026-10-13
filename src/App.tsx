/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useEvaluationStore } from './hooks/useEvaluationStore';
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
  Briefcase
} from 'lucide-react';

export default function App() {
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
    removeImageFromCriterion,
    behaviorCategories,
    performanceCategories,
    totalFiles,
    totalImages,
    exportBackupJSON,
    importBackupJSON,
    resetToDefault
  } = useEvaluationStore();

  // Active Criterion Modal state
  const [selectedItem, setSelectedItem] = useState<{
    category: EvaluationCategory;
    criterion: EvaluationCriterion;
  } | null>(null);

  // Edit Profile Modal state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Background Customizer Modal state
  const [isBgCustomizerOpen, setIsBgCustomizerOpen] = useState(false);

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
      const el = document.getElementById('evaluation-explorer');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'domain-performance') {
      setActiveDomain('performance');
      const el = document.getElementById('evaluation-explorer');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
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

      {/* 3-Zone High-Tech Navigation with Font Sizer & Background Controls */}
      <Navbar
        profile={profile}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenBackgroundCustomizer={() => setIsBgCustomizerOpen(true)}
        onScaleChange={(scale) => updateProfile({ fontSizeScale: scale })}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        {/* Hero Stage (White Theme with Robotic Welding Tech & Custom Background) */}
        <HeroSection
          profile={profile}
          totalFiles={totalFiles}
          totalImages={totalImages}
          isEditMode={isEditMode}
          onExplore={() => handleScrollToSection('evaluation-explorer')}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onOpenBackgroundCustomizer={() => setIsBgCustomizerOpen(true)}
        />

        {/* Evaluation Framework (2 Domains, 12 Categories - Arabic Numerals) */}
        <EvaluationFramework
          categories={categories}
          onSelectCategory={(catId) => {
            const cat = categories.find((c) => c.id === catId);
            if (cat) {
              setActiveDomain(cat.domain);
              handleScrollToSection('evaluation-explorer');
            }
          }}
        />

        {/* Interactive Evaluation Explorer & Domain Tabs */}
        <section id="evaluation-explorer" className="py-20 px-6 max-w-[1440px] mx-auto">
          {/* Domain Selection Tabs (Arabic Numerals) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 border-b border-slate-200 pb-6 mb-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveDomain('behavior')}
                className={`btn-lambo flex items-center gap-3 px-6 py-4 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                  activeDomain === 'behavior'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>ด้านที่ 1: การปฏิบัติตน (6 หมวดหมู่)</span>
              </button>

              <button
                onClick={() => setActiveDomain('performance')}
                className={`btn-lambo flex items-center gap-3 px-6 py-4 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer border ${
                  activeDomain === 'performance'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-300'
                }`}
              >
                <Briefcase className="w-4 h-4 text-amber-700" />
                <span>ด้านที่ 2: การปฏิบัติงาน (6 หมวดหมู่)</span>
              </button>
            </div>

            {/* Keyword Search Filter */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหารหัส / หัวข้อ / ตัวชี้วัด..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categories Grid / List */}
          {filteredCategories.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <Filter className="w-8 h-8 mx-auto text-amber-500" />
              <div className="text-base text-slate-800 font-bold">ไม่พบตัวชี้วัดที่ตรงกับคำค้นหา "{searchQuery}"</div>
              <button
                onClick={() => setSearchQuery('')}
                className="btn-lambo text-xs text-slate-950 bg-amber-400 px-4 py-2 font-bold cursor-pointer"
              >
                ล้างคำค้นหา
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isEditMode={isEditMode}
                  onSelectCriterion={(cat, crit) =>
                    setSelectedItem({ category: cat, criterion: crit })
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* Evidence Vault & Google Drive Central Hub Section (Light High-Tech) */}
        <section id="evidence-vault" className="py-20 bg-slate-50/70 backdrop-blur-xs border-t border-slate-200 px-6">
          <div className="max-w-[1440px] mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-700 uppercase tracking-widest font-bold mb-2">
                  <FolderOpen className="w-4 h-4 text-amber-600" />
                  <span>CENTRAL EVIDENCE VAULT & GOOGLE DRIVE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight uppercase">
                  คลังแฟ้มเอกสารและร่องรอยหลักฐานรวม
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                  รวบรวมไฟล์และโฟลเดอร์ Google Drive ทั้งหมดที่ผูกกับตัวชี้วัด อำนวยความสะดวกให้คณะกรรมการเปิดตรวจสอบได้ทันที
                </p>
              </div>

              <a
                href={profile.googleDriveMainLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lambo flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-sm"
              >
                <FolderOpen className="w-4 h-4" />
                <span>เปิดโฟลเดอร์ DRIVE หลัก</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Evidence Files List Across All Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.flatMap((cat) =>
                cat.criteria.flatMap((crit) =>
                  crit.files.map((file) => ({
                    ...file,
                    criterionCode: crit.code,
                    criterionTitle: crit.title,
                    categoryTitle: cat.title,
                    categoryOrder: cat.orderNumber
                  }))
                )
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 hover:border-amber-400 p-5 flex flex-col justify-between transition-colors shadow-xs group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span className="text-amber-700 font-bold">
                        ตัวชี้วัด {item.criterionCode}
                      </span>
                      <span>หมวดที่ {item.categoryOrder}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                      {item.title}
                    </h4>

                    {item.notes && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-sky-700 font-mono flex items-center gap-1 font-medium">
                      <FileText className="w-3 h-3 text-sky-600" />
                      <span>Google Drive File</span>
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-lambo text-xs text-slate-800 bg-slate-100 hover:bg-amber-400 hover:text-slate-950 px-3 py-1.5 transition-colors font-bold flex items-center gap-1"
                    >
                      <span>เปิดเอกสาร</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
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
    </div>
  );
}

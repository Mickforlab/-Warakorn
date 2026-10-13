import React from 'react';
import { EvaluationCategory, EvaluationCriterion } from '../types/evaluation';
import { FileText, Image as ImageIcon, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CategoryCardProps {
  category: EvaluationCategory;
  isEditMode: boolean;
  onSelectCriterion: (category: EvaluationCategory, criterion: EvaluationCriterion) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isEditMode,
  onSelectCriterion
}) => {
  return (
    <div
      id={`cat-${category.id}`}
      className="bg-white border border-slate-200 hover:border-slate-300 transition-all p-6 sm:p-8 space-y-6 shadow-sm"
    >
      {/* Category Header (Light Theme & Arabic Numbers) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider">
              หมวดที่ {category.orderNumber}
            </span>
            <span className="text-xs font-mono text-slate-500 tracking-wider uppercase font-semibold">
              {category.domain === 'behavior' ? 'ด้านการปฏิบัติตน' : 'ด้านการปฏิบัติงาน'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {category.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {category.subtitle}
          </p>
        </div>

        {/* Readiness Info Box */}
        <div className="bg-slate-50 border border-slate-200 p-4 text-right shrink-0 min-w-[160px]">
          <div className="text-[11px] font-mono text-slate-500 uppercase">
            จำนวนตัวชี้วัด
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {category.criteria.length} <span className="text-xs text-slate-500 font-normal">รายการ</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-mono mt-1 flex items-center justify-end gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>มีร่องรอยหลักฐาน</span>
          </div>
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-3">
        {category.criteria.map((criterion) => {
          const hasFiles = criterion.files.length > 0;
          const hasImages = criterion.images.length > 0;

          return (
            <div
              key={criterion.id}
              className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-400 p-4 transition-all shadow-xs"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Criterion Info */}
                <div
                  onClick={() => onSelectCriterion(category, criterion)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-sm font-bold text-amber-700 shrink-0">
                      {criterion.code}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                      {criterion.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed pl-6">
                    {criterion.description}
                  </p>

                  {/* Metadata Chips in Arabic Numerals */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2.5 pl-6">
                    {hasFiles && (
                      <span className="flex items-center gap-1 text-sky-700 font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span>เอกสาร {criterion.files.length} รายการ</span>
                      </span>
                    )}
                    {hasImages && (
                      <span className="flex items-center gap-1 text-amber-700 font-medium">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>ภาพกิจกรรม {criterion.images.length} รูป</span>
                      </span>
                    )}
                    <span className="text-slate-400">
                      {criterion.evidenceMethods.slice(0, 3).join(' · ')}
                    </span>
                  </div>
                </div>

                {/* Open Detail Button */}
                <div className="flex items-center gap-3 shrink-0 pl-6 md:pl-0 border-t md:border-t-0 border-slate-200 pt-3 md:pt-0">
                  <button
                    onClick={() => onSelectCriterion(category, criterion)}
                    className="btn-lambo flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 px-4 py-2.5 transition-colors cursor-pointer uppercase tracking-wider shadow-xs"
                  >
                    <span>ดูหลักฐานและเอกสาร</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

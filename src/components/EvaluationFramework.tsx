import React from 'react';
import { EvaluationCategory } from '../types/evaluation';
import { Layers, ShieldCheck, Briefcase, ChevronRight, FileCheck } from 'lucide-react';

interface EvaluationFrameworkProps {
  categories: EvaluationCategory[];
  onSelectCategory?: (categoryId: string) => void;
}

export const EvaluationFramework: React.FC<EvaluationFrameworkProps> = ({
  categories,
  onSelectCategory
}) => {
  const behaviorCategories = categories.filter(c => c.domain === 'behavior');
  const performanceCategories = categories.filter(c => c.domain === 'performance');

  return (
    <section id="evaluation-framework" className="py-20 bg-slate-50/70 backdrop-blur-xs border-b border-slate-200 px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-700 uppercase tracking-widest font-bold mb-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>OFFICIAL EVALUATION FRAMEWORK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight uppercase">
              โครงสร้างเกณฑ์การประเมิน 2 ด้าน 12 หมวดหมู่
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              แบบประเมินการเตรียมความพร้อมและพัฒนาอย่างเข้ม ตำแหน่งครูผู้ช่วย สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา
            </p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm p-4 flex items-center gap-6 shrink-0">
            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase">รวมทั้งหมด</div>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                12 <span className="text-sm font-normal text-slate-500">หมวดหมู่</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <div className="text-[11px] font-mono text-slate-500 uppercase">ตัวชี้วัดเชิงประจักษ์</div>
              <div className="text-2xl font-bold text-amber-600 font-mono">
                44 <span className="text-sm font-normal text-slate-500">รายการ</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Domain Matrix with Arabic Numerals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Domain 1: Behavior */}
          <div className="bg-white border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs font-mono">
                  1
                </div>
                <div>
                  <span className="text-xs font-mono text-amber-700 tracking-wider uppercase font-semibold">
                    DOMAIN 1
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    ด้านการปฏิบัติตน (6 หมวดหมู่)
                  </h3>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">29 ตัวชี้วัด</span>
            </div>

            <div className="space-y-3">
              {behaviorCategories.map((cat, idx) => {
                const totalFiles = cat.criteria.reduce((s, c) => s + c.files.length, 0);

                return (
                  <div
                    key={cat.id}
                    onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                    className="group bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 p-4 transition-colors cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-amber-700 font-bold mt-0.5">
                        {idx + 1}.
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                          {cat.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {cat.criteria.length} ตัวชี้วัด · เอกสารแนบ {totalFiles} ไฟล์
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-900 transition-colors shrink-0">
                      <span>ตรวจสอบ</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Domain 2: Performance */}
          <div className="bg-white border border-slate-200 p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-xs font-mono">
                  2
                </div>
                <div>
                  <span className="text-xs font-mono text-sky-700 tracking-wider uppercase font-semibold">
                    DOMAIN 2
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    ด้านการปฏิบัติงาน (6 หมวดหมู่)
                  </h3>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">15 ตัวชี้วัด</span>
            </div>

            <div className="space-y-3">
              {performanceCategories.map((cat, idx) => {
                const totalFiles = cat.criteria.reduce((s, c) => s + c.files.length, 0);

                return (
                  <div
                    key={cat.id}
                    onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                    className="group bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-400 p-4 transition-colors cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-sky-700 font-bold mt-0.5">
                        {idx + 1}.
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors">
                          {cat.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {cat.criteria.length} ตัวชี้วัด · เอกสารแนบ {totalFiles} ไฟล์
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-900 transition-colors shrink-0">
                      <span>ตรวจสอบ</span>
                      <ChevronRight className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

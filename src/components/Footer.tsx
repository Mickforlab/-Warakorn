import React from 'react';
import { AppLogo } from './AppLogo';
import { TeacherProfile } from '../types/evaluation';
import { ExternalLink } from 'lucide-react';

interface FooterProps {
  profile: TeacherProfile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-14 px-6 text-slate-400">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <AppLogo customLogoUrl={profile.logoUrl} size={48} />
          <div>
            <div className="text-sm font-bold text-white tracking-wide uppercase">
              {profile.name} · {profile.position}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {profile.institution} · {profile.affiliation}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-slate-500">รอบการประเมิน:</span>{' '}
            <span className="text-white font-medium">{profile.evaluationRound}</span>
          </div>
          <div>
            <span className="text-slate-500">วันที่ประเมิน:</span>{' '}
            <span className="text-white font-medium">{profile.evaluationDate}</span>
          </div>
          <a
            href={profile.googleDriveMainLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold"
          >
            <span>Google Drive รวม</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} แบบประเมินการเตรียมความพร้อมและพัฒนาอย่างเข้ม ตำแหน่งครูผู้ช่วย. วิทยาลัยการอาชีพวังไกลกังวล.
        </div>
        <div className="font-mono text-[10px] tracking-wider uppercase text-slate-400">
          WELDING & ROBOTICS ENGINEERING DOSSIER · PRECISION INDUSTRIAL SHOWCASE
        </div>
      </div>
    </footer>
  );
};

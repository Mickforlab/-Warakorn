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
          <div className="flex items-center gap-2">
            <a
              href={profile.tiktokUrl || 'https://www.tiktok.com/@weldingwangklaikangwon'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-black text-white rounded border border-slate-700 hover:border-pink-500 transition-colors shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.36 0 .7.07 1.01.2V9.45a6.34 6.34 0 0 0-1.01-.08A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.28 8.28 0 0 0 4.84 1.55v-3.45a4.83 4.83 0 0 1-1.08-.46z" />
              </svg>
              <span>TikTok</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href={profile.facebookUrl || 'https://www.facebook.com/profile.php?id=100082966278654'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] hover:bg-blue-700 text-white rounded transition-colors shadow-xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3 text-blue-200" />
            </a>
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

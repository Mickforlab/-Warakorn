import React from 'react';
import { ExternalLink, Play, ThumbsUp, Radio } from 'lucide-react';

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.36 0 .7.07 1.01.2V9.45a6.34 6.34 0 0 0-1.01-.08A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.28 8.28 0 0 0 4.84 1.55v-3.45a4.83 4.83 0 0 1-1.08-.46z" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface SocialProps {
  tiktokUrl?: string;
  facebookUrl?: string;
  className?: string;
}

const DEFAULT_TIKTOK = 'https://www.tiktok.com/@weldingwangklaikangwon';
const DEFAULT_FACEBOOK = 'https://www.facebook.com/profile.php?id=100082966278654';

/**
 * Large, eye-catching Hero Social Showcase
 */
export const HeroSocialChannels: React.FC<SocialProps> = ({
  tiktokUrl = DEFAULT_TIKTOK,
  facebookUrl = DEFAULT_FACEBOOK,
  className = ''
}) => {
  return (
    <div className={`space-y-3 pt-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200">
          <Radio className="w-3 h-3 text-amber-600 animate-pulse" />
          <span>ช่องทางติดตามสื่อกิจกรรม & ผลงาน</span>
        </span>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          (วิดีโอสาธิตการเชื่อม & ภาพบรรยากาศการเรียนการสอน)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* TikTok Showcase Button */}
        <a
          href={tiktokUrl || DEFAULT_TIKTOK}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-2 border-slate-800 hover:border-pink-500 transition-all duration-200 shadow-md hover:shadow-[0_8px_25px_rgba(254,44,85,0.25)] hover:-translate-y-0.5"
          title="เปิดรับชม TikTok: @weldingwangklaikangwon"
        >
          {/* Subtle neon glow corner */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-pink-500/20 to-cyan-500/20 pointer-events-none" />

          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-black flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-pink-500 shadow-inner group-hover:scale-105 transition-transform">
              <span className="relative">
                <TikTokIcon className="w-6 h-6 text-[#25F4EE] absolute -translate-x-[1px] -translate-y-[1px] opacity-75" />
                <TikTokIcon className="w-6 h-6 text-[#FE2C55] absolute translate-x-[1px] translate-y-[1px] opacity-75" />
                <TikTokIcon className="w-6 h-6 text-white relative z-10" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-wide text-white group-hover:text-pink-400 transition-colors">
                  TikTok
                </span>
                <span className="text-[10px] bg-pink-500/30 text-pink-300 font-mono font-semibold px-1.5 py-0.2 rounded uppercase">
                  คลิปวิดีโอ
                </span>
              </div>
              <div className="text-xs text-slate-300 truncate font-mono mt-0.5">
                @weldingwangklaikangwon
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-pink-400 font-bold shrink-0 pl-2 group-hover:translate-x-0.5 transition-transform">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden xs:inline">ดูคลิป</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </a>

        {/* Facebook Showcase Button */}
        <a
          href={facebookUrl || DEFAULT_FACEBOOK}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white border-2 border-blue-500 hover:border-blue-400 transition-all duration-200 shadow-md hover:shadow-[0_8px_25px_rgba(24,119,242,0.35)] hover:-translate-y-0.5"
          title="เปิด Facebook: แผนกวิชาช่างเชื่อมโลหะ วิทยาลัยการอาชีพวังไกลกังวล"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white flex items-center justify-center shrink-0 border border-blue-300 shadow-inner group-hover:scale-105 transition-transform">
              <FacebookIcon className="w-6 h-6 text-[#1877F2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-wide text-white group-hover:text-blue-100 transition-colors">
                  Facebook
                </span>
                <span className="text-[10px] bg-white/20 text-white font-mono font-semibold px-1.5 py-0.2 rounded uppercase">
                  เพจกิจกรรม
                </span>
              </div>
              <div className="text-xs text-blue-100 truncate mt-0.5">
                แผนกวิชาช่างเชื่อมโลหะ วังไกลกังวล
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-blue-100 font-bold shrink-0 pl-2 group-hover:translate-x-0.5 transition-transform">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">ดูเพจ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </a>
      </div>
    </div>
  );
};

/**
 * Compact Navbar quick links
 */
export const NavbarSocialLinks: React.FC<SocialProps> = ({
  tiktokUrl = DEFAULT_TIKTOK,
  facebookUrl = DEFAULT_FACEBOOK
}) => {
  return (
    <div className="hidden lg:flex items-center gap-1.5 border-r border-slate-200 pr-2 mr-1">
      <a
        href={tiktokUrl || DEFAULT_TIKTOK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-sm border border-slate-800 transition-all hover:scale-105 shadow-xs"
        title="TikTok: @weldingwangklaikangwon"
      >
        <TikTokIcon className="w-3.5 h-3.5 text-pink-400" />
        <span className="font-mono text-[11px]">TikTok</span>
      </a>

      <a
        href={facebookUrl || DEFAULT_FACEBOOK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1877F2] hover:bg-blue-700 text-white text-xs font-bold rounded-sm transition-all hover:scale-105 shadow-xs"
        title="Facebook: แผนกวิชาช่างเชื่อมโลหะ วังไกลกังวล"
      >
        <FacebookIcon className="w-3.5 h-3.5" />
        <span className="font-mono text-[11px]">Facebook</span>
      </a>
    </div>
  );
};

/**
 * Floating Quick-Access Social Dock (Fixed on page for maximum discoverability)
 */
export const FloatingSocialDock: React.FC<SocialProps> = ({
  tiktokUrl = DEFAULT_TIKTOK,
  facebookUrl = DEFAULT_FACEBOOK
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 print:hidden">
      {isExpanded ? (
        <div className="bg-white/95 backdrop-blur-md border-2 border-slate-300 p-2.5 shadow-2xl space-y-2 max-w-[280px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ช่องทางติดตามผลงาน</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-slate-700 text-xs px-1 hover:bg-slate-100 rounded cursor-pointer"
              title="ย่อแถบนี้"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {/* TikTok */}
            <a
              href={tiktokUrl || DEFAULT_TIKTOK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 p-2 bg-slate-950 hover:bg-black text-white text-xs rounded transition-all hover:translate-x-1 shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <TikTokIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-[12px] leading-tight">TikTok แผนกช่างเชื่อม</div>
                  <div className="text-[10px] text-slate-300 font-mono">@weldingwangklaikangwon</div>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-pink-400" />
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl || DEFAULT_FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 p-2 bg-[#1877F2] hover:bg-blue-700 text-white text-xs rounded transition-all hover:translate-x-1 shadow-xs group"
            >
              <div className="flex items-center gap-2">
                <FacebookIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-[12px] leading-tight">Facebook เพจแผนก</div>
                  <div className="text-[10px] text-blue-100">ช่างเชื่อมโลหะ วังไกลกังวล</div>
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-blue-200 group-hover:text-white" />
            </a>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 bg-slate-950 text-white px-3 py-2 border-2 border-amber-500 shadow-xl text-xs font-bold hover:bg-slate-900 transition-transform hover:scale-105 cursor-pointer"
          title="แสดงช่องทาง TikTok & Facebook"
        >
          <div className="flex items-center -space-x-1">
            <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center border border-pink-500">
              <TikTokIcon className="w-3 h-3 text-pink-400" />
            </span>
            <span className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center border border-white">
              <FacebookIcon className="w-3 h-3 text-white" />
            </span>
          </div>
          <span>TikTok & Facebook</span>
        </button>
      )}
    </div>
  );
};

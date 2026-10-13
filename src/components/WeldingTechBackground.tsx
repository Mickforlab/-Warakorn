import React from 'react';

interface WeldingTechBackgroundProps {
  customBgUrl?: string;
  opacity?: number; // 0 - 100
  blur?: number; // 0 - 20 px
  showVectorOverlay?: boolean;
  isFixed?: boolean;
}

export const WeldingTechBackground: React.FC<WeldingTechBackgroundProps> = ({
  customBgUrl,
  opacity = 35,
  blur = 0,
  showVectorOverlay = true,
  isFixed = true
}) => {
  const normalizedOpacity = Math.max(0, Math.min(100, opacity)) / 100;

  return (
    <div className={`${isFixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none overflow-hidden select-none z-0`}>
      {/* Precision Tech Grid Base */}
      <div className="absolute inset-0 bg-tech-grid opacity-60" />

      {/* User Custom Background Image (if configured) */}
      {customBgUrl && customBgUrl.trim().length > 0 && (
        <div
          className="absolute inset-0 w-full h-full transition-opacity duration-300"
          style={{
            opacity: normalizedOpacity,
            filter: blur > 0 ? `blur(${blur}px)` : 'none'
          }}
        >
          <img
            src={customBgUrl}
            alt="Welding Technology Wallpaper"
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      {/* Radiant Tech Ambiance Glows */}
      <div className="absolute -top-32 right-10 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[130px]" />
      <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-1/4 w-[700px] h-[400px] bg-amber-300/10 rounded-full blur-[140px]" />

      {/* Vector Illustration: Industrial Robot Arm Welding & 3D Printed Metal Lattice */}
      {(showVectorOverlay || !customBgUrl) && (
        <svg
          className="absolute right-0 top-0 w-full max-w-[850px] h-auto transition-opacity duration-300"
          style={{
            opacity: customBgUrl ? Math.min(normalizedOpacity, 0.45) : normalizedOpacity
          }}
          viewBox="0 0 900 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="armMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="laserBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="1" />
            </linearGradient>

            <radialGradient id="sparkArc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="30%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ================= 3D PRINTED METAL LATTICE STRUCTURE ================= */}
          <g id="3d-metal-lattice" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 3">
            {/* Isometric Lattice Cube Layer 1 */}
            <path d="M500 520 L620 460 L740 520 L620 580 Z" fill="rgba(241, 245, 249, 0.4)" />
            <path d="M500 620 L620 560 L740 620 L620 680 Z" fill="rgba(226, 232, 240, 0.4)" />
            <line x1="500" y1="520" x2="500" y2="620" stroke="#64748B" strokeWidth="1.5" />
            <line x1="620" y1="460" x2="620" y2="560" stroke="#64748B" strokeWidth="1.5" />
            <line x1="740" y1="520" x2="740" y2="620" stroke="#64748B" strokeWidth="1.5" />
            <line x1="620" y1="580" x2="620" y2="680" stroke="#64748B" strokeWidth="1.5" />

            {/* Diagonal internal struts (Additive Manufacturing) */}
            <line x1="500" y1="520" x2="620" y2="680" stroke="#F59E0B" strokeWidth="1" strokeDasharray="none" />
            <line x1="740" y1="520" x2="620" y2="680" stroke="#0284C7" strokeWidth="1" strokeDasharray="none" />
            <line x1="620" y1="460" x2="500" y2="620" stroke="#F59E0B" strokeWidth="1" strokeDasharray="none" />
            <line x1="620" y1="460" x2="740" y2="620" stroke="#0284C7" strokeWidth="1" strokeDasharray="none" />

            {/* Secondary Lattice Node */}
            <path d="M380 570 L500 510 L620 570 L500 630 Z" fill="rgba(248, 250, 252, 0.3)" />
            <line x1="380" y1="570" x2="380" y2="670" stroke="#94A3B8" />
            <line x1="500" y1="510" x2="500" y2="610" stroke="#94A3B8" />
            <line x1="500" y1="630" x2="500" y2="730" stroke="#94A3B8" />
          </g>

          {/* Workpiece Metal Welding Seam */}
          <line x1="450" y1="515" x2="620" y2="460" stroke="#D97706" strokeWidth="3" />
          <line x1="450" y1="515" x2="620" y2="460" stroke="#FEF08A" strokeWidth="1.2" strokeDasharray="4 2" />

          {/* ================= ROBOTIC WELDING ARM ================= */}
          <g id="robot-base">
            <rect x="740" y="40" width="130" height="40" rx="0" fill="url(#armMetal)" stroke="#334155" strokeWidth="2" />
            <circle cx="805" cy="80" r="30" fill="#334155" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="805" cy="80" r="14" fill="#0F172A" />
          </g>

          {/* Upper Robotic Arm Boom */}
          <g id="upper-arm">
            <polygon points="805,80 670,180 655,160 790,60" fill="url(#armMetal)" stroke="#1E293B" strokeWidth="2" />
            <line x1="770" y1="110" x2="685" y2="175" stroke="#F59E0B" strokeWidth="4" />
            <circle cx="660" cy="170" r="26" fill="#1E293B" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="660" cy="170" r="10" fill="#F1F5F9" />
          </g>

          {/* Forearm Boom */}
          <g id="forearm">
            <polygon points="660,170 550,330 535,315 645,155" fill="url(#armMetal)" stroke="#1E293B" strokeWidth="2" />
            <circle cx="542" cy="322" r="20" fill="#334155" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="542" cy="322" r="8" fill="#0F172A" />
          </g>

          {/* Wrist Articulator */}
          <g id="wrist-articulator">
            <polygon points="542,322 510,400 495,392 528,314" fill="#1E293B" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="502" cy="396" r="14" fill="#334155" stroke="#F59E0B" strokeWidth="1.5" />
          </g>

          {/* Welding Torch Nozzle */}
          <g id="welding-torch">
            <polygon points="502,396 470,470 460,464 492,390" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
            <polygon points="470,470 460,490 455,487 465,467" fill="#B45309" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="457" y1="488" x2="452" y2="502" stroke="#FEF08A" strokeWidth="2" />
          </g>

          {/* Arc Plasma & Sparks */}
          <g id="welding-sparks" className="animate-spark">
            <circle cx="452" cy="502" r="45" fill="url(#sparkArc)" />
            <circle cx="452" cy="502" r="16" fill="#FFFFFF" />
            <circle cx="452" cy="502" r="7" fill="#FEF08A" />

            <line x1="500" y1="400" x2="452" y2="502" stroke="url(#laserBeam)" strokeWidth="1.5" strokeDasharray="3 3" />

            <path d="M452 502 Q420 480 390 495 M452 502 Q430 450 410 440 M452 502 Q470 470 490 460 M452 502 Q460 540 440 570 M452 502 Q420 520 380 515 M452 502 Q480 520 510 540" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="390" cy="495" r="3.5" fill="#FEF08A" />
            <circle cx="410" cy="440" r="2.5" fill="#FBBF24" />
            <circle cx="490" cy="460" r="3" fill="#F59E0B" />
            <circle cx="440" cy="570" r="2.5" fill="#FBBF24" />
            <circle cx="380" cy="515" r="3" fill="#FEF08A" />
            <circle cx="510" cy="540" r="3" fill="#F59E0B" />
            <circle cx="430" cy="470" r="2" fill="#FFFFFF" />
            <circle cx="475" cy="495" r="2" fill="#FFFFFF" />
          </g>

          {/* Technical Dimension Guides */}
          <g id="dimension-guides" stroke="#94A3B8" strokeWidth="0.8">
            <line x1="350" y1="570" x2="350" y2="670" />
            <line x1="340" y1="570" x2="360" y2="570" />
            <line x1="340" y1="670" x2="360" y2="670" />
            <text x="315" y="625" fill="#64748B" fontSize="11" fontFamily="monospace">Z: 100mm</text>

            <text x="560" y="440" fill="#F59E0B" fontSize="12" fontFamily="monospace" fontWeight="bold">PRECISION ARC: 24.5V / 180A</text>
            <text x="560" y="458" fill="#64748B" fontSize="10" fontFamily="monospace">ROBOTIC AXIS: J1-J6 SYNCHRONIZED</text>
          </g>
        </svg>
      )}
    </div>
  );
};

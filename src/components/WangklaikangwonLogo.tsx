import React from 'react';

interface WangklaikangwonLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const WangklaikangwonLogo: React.FC<WangklaikangwonLogoProps> = ({
  className = '',
  size = 48,
  showText = false
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(147,51,234,0.35)]"
      >
        <defs>
          {/* Metallic Purple & Platinum Bezel Gradients */}
          <linearGradient id="purpleRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7E22CE" />
            <stop offset="25%" stopColor="#C084FC" />
            <stop offset="50%" stopColor="#581C87" />
            <stop offset="75%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#3B0764" />
          </linearGradient>

          <radialGradient id="discGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </radialGradient>

          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="35%" stopColor="#EAB308" />
            <stop offset="70%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>

          <linearGradient id="goldGleam" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          <linearGradient id="garudaRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="blueRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Outer Metallic Purple 3D Beveled Ring */}
        <circle cx="200" cy="200" r="195" fill="url(#purpleRingGrad)" />
        <circle cx="200" cy="200" r="185" fill="#FFFFFF" stroke="#9333EA" strokeWidth="3" />
        <circle cx="200" cy="200" r="180" fill="url(#discGrad)" />

        {/* Inner Subtle Drop Shadow Ring */}
        <circle cx="200" cy="200" r="176" fill="none" stroke="#CBD5E1" strokeWidth="2" />

        {/* ================= ROYAL CROWN (พระมหาพิชัยมงกุฎ) ================= */}
        {/* Rays */}
        <g id="crown-rays">
          <path d="M200 35 L200 15 M188 42 L175 25 M212 42 L225 25 M178 50 L160 38 M222 50 L240 38" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />
        </g>
        {/* Crown Body */}
        <path d="M185 85 L193 45 L200 35 L207 45 L215 85 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1.5" />
        <path d="M175 95 L225 95 L220 85 L180 85 Z" fill="url(#goldGleam)" stroke="#B45309" strokeWidth="1" />
        <ellipse cx="200" cy="65" rx="10" ry="6" fill="#FACC15" />
        <circle cx="200" cy="48" r="4" fill="#DC2626" />

        {/* ================= TIERED UMBRELLAS (ฉัตรทอง ๕ ชั้น ซ้าย-ขวา) ================= */}
        {/* Left Umbrella */}
        <g id="left-umbrella">
          {/* Spire */}
          <line x1="135" y1="75" x2="135" y2="260" stroke="url(#goldGrad)" strokeWidth="4" />
          {/* 5 Tiers */}
          <path d="M127 100 Q135 94 143 100 L140 108 L130 108 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
          <path d="M123 118 Q135 110 147 118 L144 126 L126 126 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
          <path d="M120 138 Q135 128 150 138 L147 146 L123 146 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
          <path d="M117 158 Q135 148 153 158 L150 166 L120 166 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
          <path d="M114 178 Q135 166 156 178 L152 186 L118 186 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
        </g>

        {/* Right Umbrella */}
        <g id="right-umbrella">
          {/* Spire */}
          <line x1="265" y1="75" x2="265" y2="260" stroke="url(#goldGrad)" strokeWidth="4" />
          {/* 5 Tiers */}
          <path d="M257 100 Q265 94 273 100 L270 108 L260 108 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
          <path d="M253 118 Q265 110 277 118 L274 126 L256 126 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
          <path d="M250 138 Q265 128 280 138 L277 146 L253 146 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
          <path d="M247 158 Q265 148 283 158 L280 166 L250 166 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
          <path d="M244 178 Q265 166 286 178 L282 186 L248 186 Z" fill="url(#goldGleam)" stroke="#854D0E" strokeWidth="0.8" />
        </g>

        {/* ================= CENTRAL MEDALLION & CHAKRA ================= */}
        <g id="central-chakra">
          {/* Blue Medallion */}
          <circle cx="200" cy="172" r="36" fill="#1E3A8A" stroke="url(#goldGrad)" strokeWidth="4" />
          <circle cx="200" cy="172" r="28" fill="#2563EB" />
          {/* Inner Golden Monogram & Insignia */}
          <circle cx="200" cy="172" r="16" fill="none" stroke="url(#goldGrad)" strokeWidth="3" />
          <path d="M194 163 C198 160 206 160 208 166 C210 172 195 174 200 181 C203 186 210 184 212 180" stroke="url(#goldGleam)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="196" cy="172" r="3.5" fill="#EF4444" />
          <circle cx="204" cy="172" r="3.5" fill="#22C55E" />
        </g>

        {/* ================= RED GARUDA (พญาครุฑ) ================= */}
        <g id="red-garuda">
          {/* Left Wing Spread */}
          <path
            d="M200 215 C175 185 145 190 148 220 C150 235 170 245 195 242 Z"
            fill="url(#garudaRed)"
            stroke="#991B1B"
            strokeWidth="1.5"
          />
          {/* Right Wing Spread */}
          <path
            d="M200 215 C225 185 255 190 252 220 C250 235 230 245 205 242 Z"
            fill="url(#garudaRed)"
            stroke="#991B1B"
            strokeWidth="1.5"
          />
          {/* Wing Feathers Layer */}
          <path d="M152 205 Q175 220 190 228 M248 205 Q225 220 210 228" stroke="#FEE2E2" strokeWidth="1.5" />
          {/* Torso & Head */}
          <ellipse cx="200" cy="235" rx="14" ry="20" fill="url(#garudaRed)" stroke="#7F1D1D" strokeWidth="1.5" />
          <circle cx="200" cy="216" r="11" fill="url(#garudaRed)" stroke="#7F1D1D" strokeWidth="1.5" />
          {/* Golden Crown of Garuda */}
          <path d="M196 210 L200 202 L204 210 Z" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
          {/* Beak */}
          <path d="M198 217 L200 223 L202 217 Z" fill="#FACC15" />
          {/* Legs & Claws Gripping Base */}
          <path d="M188 252 L193 268 L199 265 M212 252 L207 268 L201 265" stroke="url(#goldGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* ================= LEFT HERALDIC LION (ราชสีห์ดำ) ================= */}
        <g id="black-lion">
          <path
            d="M102 215 C96 200 110 185 124 190 C130 192 135 205 132 216 C128 226 132 238 126 250 C120 258 108 260 102 248 C98 238 105 226 102 215 Z"
            fill="#1E1E1E"
            stroke="url(#goldGrad)"
            strokeWidth="2"
          />
          {/* Tail & Mane Details */}
          <path d="M96 220 Q84 195 92 180" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="120" cy="195" r="3" fill="#DC2626" />
        </g>

        {/* ================= RIGHT HERALDIC LION (คชสีห์ทอง) ================= */}
        <g id="gold-lion">
          <path
            d="M298 215 C304 200 290 185 276 190 C270 192 265 205 268 216 C272 226 268 238 274 250 C280 258 292 260 298 248 C302 238 295 226 298 215 Z"
            fill="url(#goldGleam)"
            stroke="#B45309"
            strokeWidth="2"
          />
          {/* Tail & Mane Details */}
          <path d="M304 220 Q316 195 308 180" stroke="#B45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="280" cy="195" r="3" fill="#DC2626" />
        </g>

        {/* ================= WAVES & BASE PEDESTAL ================= */}
        <path
          d="M135 265 C160 250 185 275 200 262 C215 275 240 250 265 265 C255 278 145 278 135 265 Z"
          fill="#38BDF8"
          stroke="#0284C7"
          strokeWidth="1.5"
        />

        {/* Golden Ornamental Ribbon Banner */}
        <path
          d="M75 265 Q200 300 325 265 L315 285 Q200 320 85 285 Z"
          fill="url(#goldGrad)"
          stroke="#B45309"
          strokeWidth="1.5"
        />

        {/* ================= CURVED NAME TEXT (วิทยาลัยการอาชีพวังไกลกังวล) ================= */}
        <path
          id="textCurve"
          d="M60 305 Q200 380 340 305"
          fill="none"
        />
        <text
          fill="#1E3A8A"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          fontSize="24"
          fontWeight="bold"
          letterSpacing="1.2"
          className="font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        >
          <textPath href="#textCurve" startOffset="50%" textAnchor="middle">
            วิทยาลัยการอาชีพวังไกลกังวล
          </textPath>
        </text>

        {/* Tiny Royal Stars */}
        <circle cx="68" cy="298" r="4" fill="#EAB308" />
        <circle cx="332" cy="298" r="4" fill="#EAB308" />
      </svg>
    </div>
  );
};

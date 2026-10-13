import React from 'react';

interface LamborghiniEmblemProps {
  className?: string;
  size?: number;
}

export const LamborghiniEmblem: React.FC<LamborghiniEmblemProps> = ({ className = '', size = 32 }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size * 1.15 }}>
      {/* Sharp Hexagonal / Shield Vector Outline */}
      <svg
        viewBox="0 0 100 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,192,0,0.3)]"
      >
        {/* Shield background */}
        <polygon
          points="50,2 96,18 84,94 50,113 16,94 4,18"
          fill="#121212"
          stroke="#FFC000"
          strokeWidth="3.5"
        />
        {/* Inner subtle frame */}
        <polygon
          points="50,8 90,22 80,88 50,105 20,88 10,22"
          fill="#000000"
          stroke="rgba(255,192,0,0.3)"
          strokeWidth="1.5"
        />
        {/* Stylized Charging Bull Silhouette in Pure Gold */}
        <path
          d="M32 40 C35 34, 45 32, 50 36 C54 39, 58 37, 65 34 C67 38, 64 43, 68 47 C72 52, 75 56, 73 62 C70 68, 62 66, 58 72 C55 77, 56 83, 50 86 C46 82, 47 75, 43 72 C38 68, 30 70, 28 62 C26 55, 30 50, 33 46 Z"
          fill="#FFC000"
        />
        {/* Horns & Dynamic Accent */}
        <path
          d="M30 35 Q24 28 20 30 Q25 35 28 39 Z"
          fill="#FFC000"
        />
        <path
          d="M68 33 Q74 26 78 28 Q74 34 70 38 Z"
          fill="#FFC000"
        />
      </svg>
    </div>
  );
};

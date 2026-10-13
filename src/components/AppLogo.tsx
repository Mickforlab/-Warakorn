import React from 'react';
import { WangklaikangwonLogo } from './WangklaikangwonLogo';

interface AppLogoProps {
  customLogoUrl?: string;
  size?: number;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  customLogoUrl,
  size = 48,
  className = ''
}) => {
  if (customLogoUrl && customLogoUrl.trim().length > 0) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden border-2 border-[#9333EA]/60 shadow-[0_0_15px_rgba(147,51,234,0.3)] bg-white ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={customLogoUrl}
          alt="วิทยาลัยการอาชีพวังไกลกังวล"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return <WangklaikangwonLogo size={size} className={className} />;
};

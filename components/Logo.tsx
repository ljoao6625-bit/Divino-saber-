
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", variant = 'full' }) => {
  return (
    <div className={`flex items-center space-x-4 ${variant === 'full' ? '' : 'justify-center'}`}>
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
          <defs>
            <linearGradient id="trophyGradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            <filter id="premiumShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
              <feOffset dx="1" dy="1" />
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadow" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            </filter>
          </defs>
          
          {/* Base do Troféu */}
          <rect x="30" y="78" width="40" height="6" rx="2" fill="url(#trophyGradient)" filter="url(#premiumShadow)" />
          <path d="M40 78 L42 70 L58 70 L60 78 Z" fill="url(#trophyGradient)" filter="url(#premiumShadow)" opacity="0.9" />
          
          {/* Haste Central */}
          <rect x="47" y="58" width="6" height="12" fill="url(#trophyGradient)" filter="url(#premiumShadow)" />
          
          {/* Cálice Principal */}
          <path d="M30 20 C30 20 30 58 50 58 C70 58 70 20 70 20 L30 20 Z" fill="url(#trophyGradient)" filter="url(#premiumShadow)" />
          
          {/* Alças do Troféu - Ultra Minimalistas */}
          <path d="M30 25 C22 25 22 45 30 45" stroke="url(#trophyGradient)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M70 25 C78 25 78 45 70 45" stroke="url(#trophyGradient)" strokeWidth="3" strokeLinecap="round" fill="none" />
          
          {/* Brilho de Destaque */}
          <path d="M40 25 Q50 30 60 25" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      </div>
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">DIVINO<span className="text-blue-600">SABER</span></span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">IFRN PREPARATÓRIO</span>
        </div>
      )}
    </div>
  );
};

export default Logo;

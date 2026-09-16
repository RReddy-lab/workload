import React from 'react';

interface WorkLoadLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'crest' | 'flat' | 'monogram';
}

export const WorkLoadLogo: React.FC<WorkLoadLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-md select-none"
      >
        <defs>
          {/* Deep Forest Gradient */}
          <linearGradient id="wl-emerald-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A13" />
            <stop offset="50%" stopColor="#13261C" />
            <stop offset="100%" stopColor="#08140E" />
          </linearGradient>

          {/* Liquid Gold Gradient - High Contrast */}
          <linearGradient id="wl-gold-bright" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D1" />
            <stop offset="25%" stopColor="#E5C378" />
            <stop offset="60%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#8E6A2B" />
          </linearGradient>

          {/* Deep Bronze Gold */}
          <linearGradient id="wl-gold-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D9B46A" />
            <stop offset="70%" stopColor="#947332" />
            <stop offset="100%" stopColor="#5E461A" />
          </linearGradient>

          {/* Crimson Royal Seal Accent */}
          <linearGradient id="wl-crimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B2C47" />
            <stop offset="100%" stopColor="#5C1423" />
          </linearGradient>

          {/* Inner Shadow / Glow */}
          <filter id="wl-inner-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#FFE39F" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Geometric Frame: Octagonal Chamfered Hexagon with Double Inset */}
        <path
          d="M 36 6 L 84 6 L 114 36 L 114 84 L 84 114 L 36 114 L 6 84 L 6 36 Z"
          fill="url(#wl-emerald-bg)"
          stroke="url(#wl-gold-bright)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inset Concentric Border Line */}
        <path
          d="M 39 12 L 81 12 L 108 39 L 108 81 L 81 108 L 39 108 L 12 81 L 12 39 Z"
          fill="none"
          stroke="url(#wl-gold-bright)"
          strokeWidth="1"
          strokeOpacity="0.5"
          strokeDasharray="4 2"
        />

        {/* Central Geometric Interlocking Logo: Interwoven W & L Origami Crown */}
        <g id="geometric-woven-emblem" filter="url(#wl-inner-glow)">
          {/* Left Wing Ribbon (Descending part of 'W') */}
          <path
            d="M 24 35 L 38 35 L 48 65 L 38 65 Z"
            fill="url(#wl-gold-bright)"
          />
          {/* Left Inner Valley Ribbon */}
          <path
            d="M 38 65 L 48 65 L 60 42 L 53 42 Z"
            fill="url(#wl-gold-dark)"
          />

          {/* Center Vertex Diamond (The Crown Apex) */}
          <polygon
            points="60,26 68,36 60,46 52,36"
            fill="url(#wl-gold-bright)"
            stroke="#08140E"
            strokeWidth="1.2"
          />

          {/* Right Inner Valley Ribbon */}
          <path
            d="M 60 42 L 67 42 L 72 65 L 62 65 Z"
            fill="url(#wl-gold-bright)"
          />
          {/* Right Wing Ribbon (Ascending part of 'W') */}
          <path
            d="M 82 35 L 96 35 L 82 65 L 72 65 Z"
            fill="url(#wl-gold-dark)"
          />

          {/* Interlocking 'L' Base Ribbon Foundation */}
          <path
            d="M 34 72 L 86 72 L 92 84 L 28 84 Z"
            fill="url(#wl-gold-bright)"
            stroke="#08140E"
            strokeWidth="0.8"
          />

          {/* Geometric Facet Highlight: Interlocking Foundation Key */}
          <polygon
            points="48,72 60,60 72,72 60,80"
            fill="url(#wl-gold-bright)"
            stroke="#08140E"
            strokeWidth="1"
          />

          {/* Royal Seal Dot in the Foundation Key */}
          <circle
            cx="60"
            cy="70"
            r="3"
            fill="url(#wl-crimson)"
            stroke="#FFF2D1"
            strokeWidth="0.8"
          />
        </g>

        {/* Corner Micro-filigrees */}
        <circle cx="36" cy="6" r="1.5" fill="#FFE39F" />
        <circle cx="84" cy="6" r="1.5" fill="#FFE39F" />
        <circle cx="114" cy="36" r="1.5" fill="#FFE39F" />
        <circle cx="114" cy="84" r="1.5" fill="#FFE39F" />
        <circle cx="84" cy="114" r="1.5" fill="#FFE39F" />
        <circle cx="36" cy="114" r="1.5" fill="#FFE39F" />
        <circle cx="6" cy="84" r="1.5" fill="#FFE39F" />
        <circle cx="6" cy="36" r="1.5" fill="#FFE39F" />
      </svg>
    </div>
  );
};

import React from 'react';

export default function IndianRailwaysLogo({ size = 72, className = "" }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="Indian Railways • भारतीय रेल"
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        className="drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Crimson/Red Circle */}
        <circle cx="60" cy="60" r="56" fill="#be123c" stroke="#facc15" strokeWidth="2.5" />
        
        {/* Decorative inner beaded ring */}
        <circle cx="60" cy="60" r="51" fill="#9f1239" stroke="#fde047" strokeWidth="1" strokeDasharray="2 3" />
        <circle cx="60" cy="60" r="47" fill="#881337" />

        {/* Text Arc / Ring representation */}
        {/* Top Arc text: INDIAN RAILWAYS */}
        <path
          id="textPathTop"
          d="M 20 60 A 40 40 0 0 1 100 60"
          fill="none"
          stroke="none"
        />
        {/* Bottom Arc text: भारतीय रेल */}
        <path
          id="textPathBottom"
          d="M 100 60 A 40 40 0 0 1 20 60"
          fill="none"
          stroke="none"
        />

        {/* Inner Blue Shield / Chakra backdrop */}
        <circle cx="60" cy="60" r="36" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />

        {/* Ashoka Chakra 24-spoke stylized center */}
        <circle cx="60" cy="60" r="28" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
        
        {/* Crossed Flags in center */}
        {/* Flag 1: Indian Tricolor left */}
        <line x1="60" y1="62" x2="42" y2="42" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <polygon points="42,42 48,38 46,46" fill="#f97316" />
        {/* Flag 2: Railway Flag right */}
        <line x1="60" y1="62" x2="78" y2="42" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <polygon points="78,42 72,38 74,46" fill="#10b981" />

        {/* Train Locomotive silhouette */}
        <g transform="translate(42, 52)">
          {/* Engine cabin */}
          <rect x="4" y="6" width="28" height="15" rx="3" fill="#ffffff" />
          <rect x="7" y="9" width="7" height="6" rx="1" fill="#0284c7" />
          <rect x="16" y="9" width="6" height="6" rx="1" fill="#0284c7" />
          <rect x="24" y="9" width="5" height="6" rx="1" fill="#0284c7" />
          {/* Cow catcher / pilot */}
          <polygon points="2,21 34,21 30,25 6,25" fill="#facc15" />
          {/* Wheels */}
          <circle cx="9" cy="24" r="3" fill="#334155" stroke="#f8fafc" strokeWidth="1" />
          <circle cx="18" cy="24" r="3" fill="#334155" stroke="#f8fafc" strokeWidth="1" />
          <circle cx="27" cy="24" r="3" fill="#334155" stroke="#f8fafc" strokeWidth="1" />
          {/* Headlight */}
          <circle cx="33" cy="14" r="2" fill="#fbbf24" />
        </g>

        {/* Ashoka Lion Capital Emblem Top Symbol */}
        <g transform="translate(52, 21)">
          {/* Pillar capital */}
          <rect x="3" y="10" width="10" height="2" fill="#facc15" />
          <rect x="4" y="4" width="8" height="6" rx="1" fill="#fde047" />
          {/* 3 visible lion heads stylized */}
          <circle cx="5" cy="5" r="2.2" fill="#fef08a" />
          <circle cx="8" cy="3.5" r="2.5" fill="#ffffff" />
          <circle cx="11" cy="5" r="2.2" fill="#fef08a" />
        </g>

        {/* Outer text representations */}
        <text fontSize="5.5" fontWeight="bold" fill="#fef08a" letterSpacing="1">
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            INDIAN RAILWAYS
          </textPath>
        </text>
        <text fontSize="5.8" fontWeight="bold" fill="#fef08a" letterSpacing="1">
          <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
            भारतीय रेल
          </textPath>
        </text>

        {/* Golden star accents on sides */}
        <circle cx="22" cy="60" r="2" fill="#facc15" />
        <circle cx="98" cy="60" r="2" fill="#facc15" />
      </svg>
    </div>
  );
}

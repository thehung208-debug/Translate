import React from 'react';

export default function ProtonIcon({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Core Proton Gradient: Violet Purple to Vibrant Peach */}
        <linearGradient id="protonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>

        <linearGradient id="orbitPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>

        <linearGradient id="orbitPeach" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>
      </defs>

      {/* Orbit 1: Peach glow */}
      <ellipse cx="50" cy="50" rx="42" ry="17" stroke="url(#orbitPeach)" strokeWidth="3.5" opacity="0.8" transform="rotate(35 50 50)" />
      {/* Orbit 2: Purple glow */}
      <ellipse cx="50" cy="50" rx="42" ry="17" stroke="url(#orbitPurple)" strokeWidth="3.5" opacity="0.8" transform="rotate(-35 50 50)" />
      {/* Orbit 3: Mixed accent */}
      <ellipse cx="50" cy="50" rx="42" ry="17" stroke="#F472B6" strokeWidth="2.5" opacity="0.6" transform="rotate(90 50 50)" />

      {/* Central Proton Particle */}
      <circle cx="50" cy="50" r="18" fill="url(#protonGrad)" filter="drop-shadow(0 2px 6px rgba(251, 113, 133, 0.45))" />

      {/* Characteristic Positive Charge (+) */}
      <path d="M50 39V61M39 50H61" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

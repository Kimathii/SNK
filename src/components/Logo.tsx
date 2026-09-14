import React from 'react'
import './Logo.css'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  whiteBgFeet?: boolean
}

/**
 * Official SNK Brand Logo:
 * - S: Green (#2ECC71)
 * - N: Yellow (#F5C518)
 * - K: Periwinkle / Purple-Blue (#545BE8)
 * - Feet: Vibrant orange-red (#FF4422) toddler footprints with crisp black outline
 */
export default function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <span className={`snk-brand-logo snk-brand-logo--${size} ${className}`} aria-label="SNK">
      <svg
        viewBox="0 0 176 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="snk-brand-logo__svg"
        role="img"
        aria-hidden="true"
      >
        {/* Letter 'S' - Green */}
        <text
          x="3"
          y="44"
          className="snk-logo-letter snk-logo-letter--s"
        >
          S
        </text>

        {/* Letter 'N' - Warm Yellow */}
        <text
          x="37"
          y="44"
          className="snk-logo-letter snk-logo-letter--n"
        >
          N
        </text>

        {/* Letter 'K' - Royal / Indigo Blue */}
        <text
          x="75"
          y="44"
          className="snk-logo-letter snk-logo-letter--k"
        >
          K
        </text>

        {/* Footprint 1 (Left / Higher footprint) */}
        <g transform="translate(122, 5) rotate(-14 14 18)">
          {/* Main Sole & Heel */}
          <path
            d="M9 13 C7 18 5 24 7 29 C9 34 16 35 18 31 C20 27 18 20 18 16 C18 13 14 11 11 12 C10 12.3 9.5 12.6 9 13 Z"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Big Toe */}
          <ellipse
            cx="8"
            cy="8"
            rx="3.4"
            ry="4.2"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
          {/* Toe 2 */}
          <ellipse
            cx="14"
            cy="7"
            rx="2.6"
            ry="3.4"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
          {/* Toe 3 */}
          <ellipse
            cx="18.5"
            cy="8.5"
            rx="2.2"
            ry="2.8"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
          {/* Toe 4 */}
          <ellipse
            cx="22"
            cy="11"
            rx="1.9"
            ry="2.4"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
          {/* Pinky Toe */}
          <ellipse
            cx="24.5"
            cy="14"
            rx="1.6"
            ry="2.0"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
        </g>

        {/* Footprint 2 (Right / Lower footprint) */}
        <g transform="translate(141, 15) rotate(16 14 18)">
          {/* Main Sole & Heel */}
          <path
            d="M17 13 C19 18 21 24 19 29 C17 34 10 35 8 31 C6 27 8 20 8 16 C8 13 12 11 15 12 C16 12.3 16.5 12.6 17 13 Z"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Big Toe */}
          <ellipse
            cx="18"
            cy="8"
            rx="3.4"
            ry="4.2"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
          {/* Toe 2 */}
          <ellipse
            cx="12"
            cy="7"
            rx="2.6"
            ry="3.4"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
          {/* Toe 3 */}
          <ellipse
            cx="7.5"
            cy="8.5"
            rx="2.2"
            ry="2.8"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
          {/* Toe 4 */}
          <ellipse
            cx="4"
            cy="11"
            rx="1.9"
            ry="2.4"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
          {/* Pinky Toe */}
          <ellipse
            cx="1.5"
            cy="14"
            rx="1.6"
            ry="2.0"
            fill="#FF381E"
            stroke="#1A1A1A"
            strokeWidth="2.2"
          />
        </g>
      </svg>
    </span>
  )
}

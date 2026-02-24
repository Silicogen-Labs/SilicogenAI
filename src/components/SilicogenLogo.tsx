import { type SVGProps, useState } from "react";

interface SilicogenLogoProps extends SVGProps<SVGSVGElement> {
  showText?: boolean;
  size?: number;
}

/**
 * Pixel-art terminal-style logo: robot mascot + optional "SILICOGEN" text.
 * Uses CSS variables to adapt to light/dark themes.
 */
const SilicogenLogo = ({ showText = true, size = 40, ...props }: SilicogenLogoProps) => {
  const [hovered, setHovered] = useState(false);
  const mascotWidth = 56;
  const textWidth = showText ? 160 : 0;
  const gap = showText ? 12 : 0;
  const totalWidth = mascotWidth + gap + textWidth;
  const height = 40;

  const s = size / height;

  // Theme-aware colors using CSS variables
  const stroke = "hsl(var(--accent))";
  const fillFaint = "hsl(var(--accent) / 0.04)";
  const fillBody = "hsl(var(--accent) / 0.15)";
  const fillLimb = "hsl(var(--accent) / 0.1)";
  const fillSolid = "hsl(var(--accent))";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${height}`}
      width={totalWidth * s}
      height={size}
      fill="none"
      aria-label="Silicogen logo"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
      {...props}
    >
      {/* Glow filter */}
      <defs>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ===== MASCOT (pixel robot) ===== */}
      <g filter="url(#logo-glow)">
        {/* Head — outer border */}
        <rect x="6" y="2" width="44" height="26" rx="3" ry="3"
          stroke={stroke} strokeWidth="1.5" fill="none" />
        <rect x="9" y="5" width="38" height="20" rx="1.5" ry="1.5"
          stroke={stroke} strokeWidth="0.8" fill={fillFaint} />

        {/* Left eye */}
        <g stroke={stroke} strokeWidth="1.8" strokeLinecap="square" fill="none">
          {hovered ? (
            <line x1="17" y1="15" x2="24" y2="15">
              <animate attributeName="x1" from="18" to="17" dur="0.15s" fill="freeze" />
              <animate attributeName="x2" from="18" to="24" dur="0.15s" fill="freeze" />
            </line>
          ) : (
            <>
              <line x1="18" y1="11" x2="23" y2="15" />
              <line x1="23" y1="15" x2="18" y2="19" />
            </>
          )}
        </g>

        {/* Right eye */}
        {hovered ? (
          <line x1="33" y1="15" x2="40" y2="15"
            stroke={stroke} strokeWidth="1.8" strokeLinecap="square" />
        ) : (
          <circle cx="36" cy="15" r={3} fill={fillSolid} opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Smile */}
        <path
          d={hovered ? "M22 20 Q28 26 34 20" : "M24 21 Q28 24 32 21"}
          stroke={stroke} strokeWidth="1.2"
          fill="none" strokeLinecap="round"
          style={{ transition: "d 0.2s ease" }}
        />

        {/* Body */}
        <rect x="16" y="29" width="24" height="8" rx="1"
          fill={fillBody} stroke={stroke} strokeWidth="0.8" />

        {/* Left arm */}
        <rect x="8" y="30" width="8" height="5" rx="1"
          fill={fillLimb} stroke={stroke} strokeWidth="0.6" />

        {/* Right arm */}
        <g style={{
          transformOrigin: "40px 32px",
          transition: "transform 0.15s ease",
        }}>
          <rect x="40" y="30" width="8" height="5" rx="1"
            fill={fillLimb} stroke={stroke} strokeWidth="0.6" />
          {hovered && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 44 32;-8 44 30;6 44 30;-6 44 30;0 44 32"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
        </g>

        {/* Legs */}
        <rect x="19" y="37" width="6" height="3" rx="0.5"
          fill={fillLimb} stroke={stroke} strokeWidth="0.5" />
        <rect x="31" y="37" width="6" height="3" rx="0.5"
          fill={fillLimb} stroke={stroke} strokeWidth="0.5" />
      </g>

      {/* ===== PIXEL TEXT "SILICOGEN" ===== */}
      {showText && (
        <g transform={`translate(${mascotWidth + gap}, 0)`}>
          <g fill={fillSolid} filter="url(#logo-glow)">
            {/* S */}
            <g transform="translate(0,8)">
              <rect x="0" y="0" width="12" height="3" />
              <rect x="0" y="0" width="3" height="12" />
              <rect x="0" y="9" width="12" height="3" />
              <rect x="9" y="9" width="3" height="12" />
              <rect x="0" y="18" width="12" height="3" />
            </g>
            {/* I */}
            <g transform="translate(16,8)">
              <rect x="0" y="0" width="9" height="3" />
              <rect x="3" y="0" width="3" height="21" />
              <rect x="0" y="18" width="9" height="3" />
            </g>
            {/* L */}
            <g transform="translate(28,8)">
              <rect x="0" y="0" width="3" height="21" />
              <rect x="0" y="18" width="12" height="3" />
            </g>
            {/* I */}
            <g transform="translate(43,8)">
              <rect x="0" y="0" width="9" height="3" />
              <rect x="3" y="0" width="3" height="21" />
              <rect x="0" y="18" width="9" height="3" />
            </g>
            {/* C */}
            <g transform="translate(55,8)">
              <rect x="0" y="0" width="12" height="3" />
              <rect x="0" y="0" width="3" height="21" />
              <rect x="0" y="18" width="12" height="3" />
            </g>
            {/* O */}
            <g transform="translate(70,8)">
              <rect x="0" y="0" width="12" height="3" />
              <rect x="0" y="0" width="3" height="21" />
              <rect x="9" y="0" width="3" height="21" />
              <rect x="0" y="18" width="12" height="3" />
            </g>
            {/* G */}
            <g transform="translate(86,8)">
              <rect x="0" y="0" width="12" height="3" />
              <rect x="0" y="0" width="3" height="21" />
              <rect x="0" y="18" width="12" height="3" />
              <rect x="9" y="9" width="3" height="12" />
              <rect x="6" y="9" width="6" height="3" />
            </g>
            {/* E */}
            <g transform="translate(102,8)">
              <rect x="0" y="0" width="12" height="3" />
              <rect x="0" y="0" width="3" height="21" />
              <rect x="0" y="9" width="9" height="3" />
              <rect x="0" y="18" width="12" height="3" />
            </g>
            {/* N */}
            <g transform="translate(118,8)">
              <rect x="0" y="0" width="3" height="21" />
              <rect x="3" y="3" width="3" height="3" />
              <rect x="6" y="6" width="3" height="3" />
              <rect x="9" y="9" width="3" height="3" />
              <rect x="12" y="0" width="3" height="21" />
            </g>
          </g>
        </g>
      )}
    </svg>
  );
};

export default SilicogenLogo;

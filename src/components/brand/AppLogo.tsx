import React from "react";

interface AppLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  isDark?: boolean;
}

export default function AppLogo({
  size = 40,
  showText = true,
  textColor = "currentColor",
  isDark = true,
}: AppLogoProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.28 }}>
      {/* 3D Isometric Hex-Link Badge */}
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "800px",
          flexShrink: 0,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: "drop-shadow(0 8px 16px rgba(99, 102, 241, 0.45))",
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          className="hover:scale-105"
        >
          <defs>
            {/* 3D Gradients */}
            <linearGradient id="logoGradA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="logoGradB" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="logoGradC" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 3D Isometric Hexagon Base */}
          <polygon
            points="50,6 90,28 90,72 50,94 10,72 10,28"
            fill={isDark ? "#131B2E" : "#FFFFFF"}
            stroke="url(#logoGradA)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Isometric Facet Shadows for 3D Volume */}
          <polygon
            points="50,6 90,28 50,50 10,28"
            fill="url(#logoGradA)"
            fillOpacity="0.88"
          />
          <polygon
            points="50,50 90,28 90,72 50,94"
            fill="url(#logoGradB)"
            fillOpacity="0.82"
          />
          <polygon
            points="50,50 10,28 10,72 50,94"
            fill="url(#logoGradA)"
            fillOpacity="0.65"
          />

          {/* Interlocking Central "M" Hyperlink Node with Self-Drawing Animation (Technique 8 & 10) */}
          <path
            d="M30 64 L30 38 L50 54 L70 38 L70 64"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="svg-self-draw"
          />

          {/* Glowing Connective Satellite Nodes with Pulsing (Technique 11) */}
          <circle cx="50" cy="54" r="5" fill="#FFFFFF" className="animate-ping" opacity="0.7" />
          <circle cx="50" cy="54" r="5" fill="#FFFFFF" />
          <circle cx="30" cy="38" r="4" fill="#34D399" className="animate-pulse" />
          <circle cx="70" cy="38" r="4" fill="#F59E0B" className="animate-pulse" />
          <circle cx="50" cy="20" r="3.5" fill="#FFFFFF" opacity="0.9" />

          {/* Real-time Dynamic Sparkle (Technique 1) */}
          <polygon
            points="50,14 52,18 56,20 52,22 50,26 48,22 44,20 48,18"
            fill="#FFFFFF"
            className="animate-spin-slow"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif",
                fontSize: size * 0.54,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: textColor,
              }}
            >
              Micro
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif",
                fontSize: size * 0.54,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                background: "linear-gradient(135deg, #6366F1, #10B981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Link
            </span>
            <span
              style={{
                fontSize: size * 0.22,
                fontWeight: 800,
                color: "#10B981",
                background: "rgba(16, 185, 129, 0.15)",
                padding: "2px 5px",
                borderRadius: "6px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                marginLeft: 2,
              }}
            >
              3D
            </span>
          </div>
          <span
            style={{
              fontSize: size * 0.22,
              fontWeight: 600,
              color: isDark ? "#94A3B8" : "#64748B",
              letterSpacing: "0.4px",
              marginTop: 1,
            }}
          >
            Gujarat Micro-Gigs
          </span>
        </div>
      )}
    </div>
  );
}

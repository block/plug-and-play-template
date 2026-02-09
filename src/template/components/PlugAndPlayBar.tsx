import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../styles";

interface PlugAndPlayBarProps {
  height?: number;
}

// V3-style Plug & Play bar - at the very bottom (position 0)
export const PlugAndPlayBar: React.FC<PlugAndPlayBarProps> = ({
  height = 200,
}) => {
  const frame = useCurrentFrame();
  const playPulse = 1 + Math.sin(frame * 0.15) * 0.05;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height,
        background: `linear-gradient(180deg, ${colors.teal} 0%, ${colors.tealDark} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "0 40px",
      }}
    >
      {/* Plug */}
      <span
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: colors.black,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        Plug
      </span>

      {/* Plug icon */}
      <svg width="36" height="50" viewBox="0 0 36 50" style={{ marginRight: -8 }}>
        <rect x="8" y="0" width="6" height="18" fill={colors.black} rx="2" />
        <rect x="22" y="0" width="6" height="18" fill={colors.black} rx="2" />
        <rect x="4" y="14" width="28" height="14" fill={colors.black} rx="4" />
        <rect x="12" y="26" width="12" height="16" fill={colors.black} rx="3" />
        <circle cx="18" cy="46" r="4" fill={colors.black} />
      </svg>

      {/* Play button circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `3px solid ${colors.black}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${playPulse})`,
          backgroundColor: "transparent",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <polygon points="6,3 20,12 6,21" fill={colors.orange} />
        </svg>
      </div>

      {/* Play */}
      <span
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: colors.black,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        Play
      </span>
    </div>
  );
};

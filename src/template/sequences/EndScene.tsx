import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Img, staticFile } from "remotion";
import { VisibleMovingDots } from "../components/MovingDots";
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";
import { colors, plugAndPlayBarHeight } from "../styles";

interface EndSceneProps {
  docsUrl: string;
  tutorialTitle: string;
}

export const EndScene: React.FC<EndSceneProps> = ({ docsUrl, tutorialTitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card entrance animation
  const cardProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const cardY = interpolate(cardProgress, [0, 1], [100, 0]);
  const cardOpacity = interpolate(cardProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Gentle floating animation only - no tilt
  const floatY = Math.sin(frame * 0.06) * 6;

  // Underline draw animation
  const underlineProgress = spring({
    frame: frame - 50,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  // Glow pulse
  const glowIntensity = 0.3 + Math.sin(frame * 0.08) * 0.15;

  // CTA fade in
  const ctaOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Clean extension name - remove "Extension" if already present, then add it back
  const extensionName = tutorialTitle
    .replace(" | goose", "")
    .replace(/ Extension$/i, "")
    .replace(/ extension$/i, "");

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      {/* Moving dots background */}
      <VisibleMovingDots />

      {/* Main content area - above the bar */}
      <AbsoluteFill
        style={{
          bottom: plugAndPlayBarHeight,
          height: `calc(100% - ${plugAndPlayBarHeight}px)`,
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 50,
            zIndex: 1,
          }}
        >
          {/* Goose Logo */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              marginBottom: -40,
              zIndex: 10,
            }}
          >
            <Img
              src={staticFile("goose-logo-white.png")}
              style={{ width: 180, height: 180, objectFit: "contain" }}
            />
          </div>

          {/* Floating Card - clean, no 3D tilt */}
          <div
            style={{
              transform: `translateY(${cardY + floatY}px)`,
              opacity: cardOpacity,
              width: 800,
              backgroundColor: colors.white,
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: `
                0 20px 60px rgba(0, 0, 0, 0.4),
                0 0 60px rgba(78, 205, 196, ${glowIntensity})
              `,
            }}
          >
              {/* Card content */}
              <div style={{ padding: "50px 50px 45px 50px" }}>
                {/* Extension name with animated underline */}
                <div style={{ position: "relative", display: "inline-block", marginBottom: 18 }}>
                  <span
                    style={{
                      fontSize: 44,
                      fontWeight: 800,
                      color: colors.black,
                      fontFamily: "'Inter', sans-serif",
                      display: "block",
                    }}
                  >
                    {extensionName}
                  </span>
                  {/* Animated underline */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: -6,
                      left: 0,
                      height: 5,
                      width: `${underlineProgress * 100}%`,
                      background: `linear-gradient(90deg, ${colors.teal} 0%, #3BA99C 100%)`,
                      borderRadius: 3,
                      boxShadow: `0 0 12px ${colors.teal}`,
                    }}
                  />
                </div>

                <p
                  style={{
                    fontSize: 28,
                    color: "#555",
                    fontFamily: "'Inter', sans-serif",
                    margin: 0,
                    marginBottom: 24,
                    lineHeight: 1.4,
                  }}
                >
                  Add this MCP Server as a goose Extension
                </p>

                {/* URL with globe icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 20px",
                    backgroundColor: "rgba(78, 205, 196, 0.1)",
                    borderRadius: 14,
                    width: "fit-content",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={colors.teal}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  <span
                    style={{
                      fontSize: 22,
                      color: colors.teal,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    block.github.io/goose
                  </span>
                </div>
              </div>

            {/* Bottom accent bar */}
            <div
              style={{
                height: 6,
                background: `linear-gradient(90deg, ${colors.teal} 0%, ${colors.orange} 100%)`,
              }}
            />
          </div>

        </div>
      </AbsoluteFill>

      {/* Plug & Play bar at bottom */}
      <PlugAndPlayBar />
    </AbsoluteFill>
  );
};

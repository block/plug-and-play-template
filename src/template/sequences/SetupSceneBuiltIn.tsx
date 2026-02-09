import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { colors, plugAndPlayBarHeight } from "../styles";
import { VisibleMovingDots } from "../components/MovingDots";
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";

interface SetupSceneBuiltInProps {
  extensionName?: string;
  extensionDescription?: string;
}

export const SetupSceneBuiltIn: React.FC<SetupSceneBuiltInProps> = ({
  extensionName = "Developer",
  extensionDescription = "General development tools useful for software engineering.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timing
  const modalAppearFrame = 15;
  const toggleStartFrame = 60;
  const toggleCompleteFrame = 90;
  const successFrame = 120;

  // Modal scale animation
  const modalScale = spring({
    frame: frame - modalAppearFrame,
    fps,
    config: {
      damping: 15,
      stiffness: 150,
      mass: 0.8,
    },
  });

  const modalOpacity = interpolate(
    frame,
    [modalAppearFrame, modalAppearFrame + 10],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // Toggle animation
  const toggleProgress = interpolate(
    frame,
    [toggleStartFrame, toggleCompleteFrame],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  // Success checkmark animation
  const successScale = spring({
    frame: frame - successFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const successOpacity = interpolate(
    frame,
    [successFrame, successFrame + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Glow pulse for success
  const glowPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.6, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
      }}
    >
      {/* Moving dots background */}
      <VisibleMovingDots />

      {/* Dark overlay for better contrast - leave space for PlugAndPlayBar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: plugAndPlayBarHeight,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Modal */}
      {frame >= modalAppearFrame && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            paddingBottom: plugAndPlayBarHeight + 20,
          }}
        >
          <div
            style={{
              width: "95%",
              backgroundColor: "#1a1a1a",
              borderRadius: 28,
              padding: 56,
              transform: `scale(${modalScale})`,
              opacity: modalOpacity,
              boxShadow: frame >= successFrame && toggleProgress >= 1
                ? `0 0 ${60 * glowPulse}px ${colors.teal}40, 0 0 ${120 * glowPulse}px ${colors.teal}20`
                : "0 25px 70px rgba(0, 0, 0, 0.5)",
              border: `1px solid ${frame >= successFrame && toggleProgress >= 1 ? colors.teal : "#333"}`,
              transition: "border-color 0.3s ease",
            }}
          >
            {/* Header */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "white",
                marginBottom: 16,
                fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Built-in Extension
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#888",
                marginBottom: 56,
                fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Enable this extension with one click
            </div>

            {/* Extension Card */}
            <div
              style={{
                backgroundColor: "#252525",
                borderRadius: 20,
                padding: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: `1px solid ${toggleProgress >= 1 ? colors.teal : "#333"}`,
                transition: "border-color 0.3s ease",
              }}
            >
              {/* Left side - Extension info */}
              <div style={{ flex: 1, marginRight: 36 }}>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 600,
                    color: "white",
                    marginBottom: 16,
                    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  {extensionName}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    color: "#999",
                    lineHeight: 1.4,
                    fontFamily: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  {extensionDescription}
                </div>
              </div>

              {/* Right side - Toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                {/* Settings gear icon */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.5,
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </div>

                {/* Toggle Switch */}
                <div
                  style={{
                    width: 96,
                    height: 52,
                    backgroundColor: interpolate(toggleProgress, [0, 1], [0, 1]) > 0.5 ? colors.teal : "#444",
                    borderRadius: 26,
                    padding: 4,
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    position: "relative",
                  }}
                >
                  {/* Toggle knob */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: "white",
                      borderRadius: "50%",
                      transform: `translateX(${interpolate(toggleProgress, [0, 1], [0, 44])}px)`,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Success Message */}
            {frame >= successFrame && (
              <div
                style={{
                  marginTop: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 18,
                  opacity: successOpacity,
                  transform: `scale(${successScale})`,
                }}
              >
                {/* Checkmark circle */}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: colors.teal,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 600,
                    color: colors.teal,
                    fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  Extension Enabled!
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* Plug and Play Bar */}
      <PlugAndPlayBar />
    </AbsoluteFill>
  );
};

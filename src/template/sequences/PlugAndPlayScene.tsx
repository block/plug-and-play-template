import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { VisibleMovingDots } from "../components/MovingDots";
import { GradientBorder } from "../components/GradientBorder";
import { colors } from "../styles";

type PlugAndPlaySceneProps = {
  badgeLine: string; // e.g. "multi-perspective reasoning"
};

export const PlugAndPlayScene: React.FC<PlugAndPlaySceneProps> = ({ badgeLine }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations - V1 style
  const plugEnter = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const playEnter = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const connectionLine = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const playButtonPulse = 1 + Math.sin(frame * 0.2) * 0.08;

  // Spark effect
  const sparkOpacity =
    frame > 35
      ? interpolate(Math.sin((frame - 35) * 0.5), [-1, 1], [0.3, 1])
      : 0;

  const taglineOpacity = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineTranslateY = interpolate(frame, [45, 55], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <GradientBorder>
        <AbsoluteFill style={{ backgroundColor: colors.black }}>
          {/* Moving dots background */}
          <VisibleMovingDots />

          {/* Background glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(78, 205, 196, 0.15) 0%, transparent 70%)`,
            }}
          />

          {/* Main content */}
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 40,
              }}
            >
              {/* Plug & Play visual */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                }}
              >
                {/* PLUG side */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: `scale(${plugEnter}) translateX(${(1 - plugEnter) * -50}px)`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 100,
                      fontWeight: 800,
                      color: colors.teal,
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Plug
                  </span>

                  {/* Plug icon */}
                  <svg width="80" height="100" viewBox="0 0 80 100">
                    {/* Prongs */}
                    <rect x="20" y="0" width="12" height="35" fill={colors.teal} rx="4" />
                    <rect x="48" y="0" width="12" height="35" fill={colors.teal} rx="4" />
                    {/* Body */}
                    <rect x="15" y="30" width="50" height="25" fill={colors.teal} rx="6" />
                    {/* Cable */}
                    <rect x="32" y="52" width="16" height="30" fill={colors.teal} rx="4" />
                    {/* Connection point */}
                    <circle
                      cx="40"
                      cy="90"
                      r="10"
                      fill={colors.teal}
                      style={{
                        filter:
                          sparkOpacity > 0
                            ? `drop-shadow(0 0 ${10 * sparkOpacity}px ${colors.teal})`
                            : "none",
                      }}
                    />
                  </svg>
                </div>

                {/* Connection line */}
                <div
                  style={{
                    width: 100,
                    height: 4,
                    backgroundColor: colors.teal,
                    transform: `scaleX(${connectionLine})`,
                    transformOrigin: "left",
                    boxShadow: sparkOpacity > 0 ? `0 0 20px ${colors.teal}` : "none",
                  }}
                />

                {/* PLAY side */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: `scale(${playEnter}) translateX(${(1 - playEnter) * 50}px)`,
                  }}
                >
                  {/* Play button */}
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      border: `4px solid ${colors.orange}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `scale(${playButtonPulse})`,
                      boxShadow: `0 0 30px rgba(255, 107, 53, 0.3)`,
                    }}
                  >
                    <svg width="50" height="50" viewBox="0 0 24 24">
                      <polygon points="6,3 20,12 6,21" fill={colors.orange} />
                    </svg>
                  </div>

                  <span
                    style={{
                      fontSize: 100,
                      fontWeight: 800,
                      color: colors.orange,
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: "-0.02em",
                      marginTop: 10,
                    }}
                  >
                    Play
                  </span>
                </div>
              </div>

              {/* Tagline */}
              <div style={{ opacity: taglineOpacity, transform: `translateY(${taglineTranslateY}px)` }}>
                <span
                  style={{
                    fontSize: 36,
                    color: colors.textSecondary,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    textAlign: "center",
                    maxWidth: 1200,
                    lineHeight: 1.25,
                  }}
                >
                  {badgeLine}
                </span>
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </GradientBorder>
    </AbsoluteFill>
  );
};

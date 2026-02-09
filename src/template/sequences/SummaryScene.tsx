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
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";
import { colors, plugAndPlayBarHeight } from "../styles";

interface SummarySceneProps {
  resultBullets?: string[];
}

export const SummaryScene: React.FC<SummarySceneProps> = ({
  resultBullets = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <GradientBorder>
        <AbsoluteFill style={{ backgroundColor: colors.black }}>
          <VisibleMovingDots />

          <AbsoluteFill
            style={{
              paddingBottom: plugAndPlayBarHeight,
              justifyContent: "center",
              alignItems: "center",
              padding: 50,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 36, maxWidth: 950 }}>
              {/* Consensus header */}
              <div style={{ textAlign: "center", transform: `scale(${headerScale})` }}>
                <span
                  style={{
                    fontSize: 52,
                    fontWeight: 800,
                    color: colors.teal,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  🎉 Council Consensus
                </span>
              </div>

              {/* Main insight box */}
              <div
                style={{
                  backgroundColor: "rgba(78, 205, 196, 0.1)",
                  borderRadius: 24,
                  padding: 36,
                  border: `2px solid ${colors.teal}`,
                  opacity: interpolate(frame, [20, 45], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  transform: `translateY(${interpolate(frame, [20, 45], [20, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}px)`,
                }}
              >
                <p
                  style={{
                    fontSize: 34,
                    fontWeight: 600,
                    color: colors.white,
                    fontFamily: "'Inter', sans-serif",
                    textAlign: "center",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  The real skill gap isn't coding{" "}
                  <span style={{ color: colors.orange }}>or</span> orchestration
                </p>
              </div>

              {/* The intersection insight */}
              <div
                style={{
                  opacity: interpolate(frame, [60, 85], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  transform: `scale(${interpolate(frame, [60, 85], [0.9, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 20,
                  }}
                >
                  <span style={{ fontSize: 48 }}>💻</span>
                  <span style={{ fontSize: 56, fontWeight: 800, color: colors.teal, fontFamily: "'Inter', sans-serif" }}>+</span>
                  <span style={{ fontSize: 48 }}>🎭</span>
                  <span style={{ fontSize: 56, fontWeight: 800, color: colors.teal, fontFamily: "'Inter', sans-serif" }}>=</span>
                  <span style={{ fontSize: 48 }}>🚀</span>
                </div>
              </div>

              {/* Final statement (HARDCODED) */}
              <div
                style={{
                  textAlign: "center",
                  opacity: interpolate(frame, [100, 125], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <p
                  style={{
                    fontSize: 28,
                    color: colors.textSecondary,
                    fontFamily: "'Inter', sans-serif",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  "If you don't understand coding, you'll never truly know how to orchestrate"
                </p>
              </div>

              {/* Optional bullets */}
              {resultBullets.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {resultBullets.map((bullet, i) => {
                    const bulletStart = 150 + i * 30;
                    const opacity = interpolate(frame, [bulletStart, bulletStart + 20], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    });
                    const translateX = interpolate(frame, [bulletStart, bulletStart + 20], [-30, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    });

                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          opacity,
                          transform: `translateX(${translateX}px)`,
                          marginBottom: 14,
                        }}
                      >
                        <span style={{ fontSize: 28 }}>✅</span>
                        <span
                          style={{
                            fontSize: 26,
                            fontWeight: 500,
                            color: colors.white,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {bullet}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </AbsoluteFill>

          <PlugAndPlayBar />
        </AbsoluteFill>
      </GradientBorder>
    </AbsoluteFill>
  );
};

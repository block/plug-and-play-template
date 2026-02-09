import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { VisibleMovingDots } from "../components/MovingDots";
import { GradientBorder } from "../components/GradientBorder";
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";
import { colors, plugAndPlayBarHeight } from "../styles";

interface ExplainerSceneProps {
  explainerLines: string[];
}

export const ExplainerScene: React.FC<ExplainerSceneProps> = ({
  explainerLines,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <GradientBorder>
        <AbsoluteFill style={{ backgroundColor: colors.black }}>
          {/* Moving dots background */}
          <VisibleMovingDots />

          {/* Content */}
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 60,
              paddingBottom: plugAndPlayBarHeight + 60,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 60,
                maxWidth: 900,
              }}
            >
              {explainerLines.map((line, i) => {
                const startFrame = i * 60;
                const lineOpacity = interpolate(
                  frame,
                  [startFrame, startFrame + 30],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const lineY = interpolate(
                  frame,
                  [startFrame, startFrame + 30],
                  [40, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                return (
                  <div
                    key={i}
                    style={{
                      opacity: lineOpacity,
                      transform: `translateY(${lineY}px)`,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 24,
                    }}
                  >
                    {/* Number badge */}
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: i === 0 ? colors.teal : colors.orange,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: colors.black,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {i + 1}
                      </span>
                    </div>

                    {/* Text */}
                    <span
                      style={{
                        fontSize: 42,
                        fontWeight: 500,
                        color: colors.white,
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.4,
                      }}
                    >
                      {line}
                    </span>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>

          {/* Plug & Play bar */}
          <PlugAndPlayBar />
        </AbsoluteFill>
      </GradientBorder>
    </AbsoluteFill>
  );
};

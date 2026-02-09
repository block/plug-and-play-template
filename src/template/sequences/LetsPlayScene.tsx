import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { VisibleMovingDots } from "../components/MovingDots";
import { GradientBorder } from "../components/GradientBorder";
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";
import { colors, plugAndPlayBarHeight } from "../styles";

// "Now, let's play" transition scene
export const LetsPlayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const playScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Pulsing play button
  const pulse = 1 + Math.sin(frame * 0.2) * 0.08;

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
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 50,
              }}
            >
              {/* "Now, let's" text */}
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 600,
                  color: colors.white,
                  fontFamily: "'Inter', sans-serif",
                  opacity: interpolate(frame, [0, 20], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  transform: `scale(${textScale})`,
                }}
              >
                Now, let's
              </span>

              {/* Big PLAY button */}
              <div
                style={{
                  transform: `scale(${playScale * pulse})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "40px 80px",
                  backgroundColor: colors.teal,
                  borderRadius: 40,
                  boxShadow: `0 15px 60px rgba(78, 205, 196, 0.5)`,
                }}
              >
                {/* Play triangle */}
                <svg width="60" height="60" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" fill={colors.black} />
                </svg>
                <span
                  style={{
                    fontSize: 80,
                    fontWeight: 800,
                    color: colors.black,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  PLAY
                </span>
              </div>
            </div>
          </AbsoluteFill>

          <PlugAndPlayBar />
        </AbsoluteFill>
      </GradientBorder>
    </AbsoluteFill>
  );
};

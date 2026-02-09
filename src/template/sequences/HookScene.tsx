import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, Img, staticFile } from "remotion";
import { VisibleMovingDots } from "../components/MovingDots";
import { GradientBorder } from "../components/GradientBorder";
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";
import { colors, plugAndPlayBarHeight } from "../styles";

interface HookSceneProps {
  hookText: string;
  mcpServerName: string;
}

export const HookScene: React.FC<HookSceneProps> = ({
  hookText,
  mcpServerName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split hook text into lines
  const lines = hookText.split("\n");

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Background pulse effect
  const bgPulse = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.02, 0.05]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <GradientBorder>
        <AbsoluteFill style={{ backgroundColor: colors.black }}>
          {/* Moving dots background */}
          <VisibleMovingDots />

          {/* Subtle radial gradient */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 50% 40%, rgba(78, 205, 196, ${bgPulse}) 0%, transparent 60%)`,
            }}
          />

          {/* Content */}
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: plugAndPlayBarHeight,
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
          {/* Goose Logo */}
          {/* Goose Logo */}
          <div style={{ transform: `scale(${logoScale})` }}>
            <Img
              src={staticFile("goose-logo-white.png")}
              style={{
                width: 180,
                height: 180,
                objectFit: "contain",
              }}
            />
          </div>

              {/* Hook Text */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  padding: "0 50px",
                }}
              >
                {lines.map((line, i) => {
                  const lineOpacity = interpolate(
                    frame,
                    [20 + i * 15, 35 + i * 15],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );
                  const lineY = interpolate(
                    frame,
                    [20 + i * 15, 35 + i * 15],
                    [30, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );

                  return (
                    <span
                      key={i}
                      style={{
                        fontSize: i === 0 ? 52 : 64,
                        fontWeight: i === 0 ? 400 : 700,
                        color: colors.white,
                        textAlign: "center",
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.2,
                        opacity: lineOpacity,
                        transform: `translateY(${lineY}px)`,
                      }}
                    >
                      {line}
                    </span>
                  );
                })}
              </div>

              {/* MCP Server Name Badge */}
              <div
                style={{
                  opacity: interpolate(frame, [55, 70], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  transform: `scale(${interpolate(frame, [55, 70], [0.8, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })})`,
                }}
              >
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: colors.teal,
                    backgroundColor: "rgba(78, 205, 196, 0.1)",
                    padding: "16px 32px",
                    borderRadius: 50,
                    border: `2px solid ${colors.teal}`,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  ✦ {mcpServerName} MCP Server
                </span>
              </div></div></AbsoluteFill>

          {/* Plug & Play bar at bottom */}
          <PlugAndPlayBar />
        </AbsoluteFill>
      </GradientBorder>
    </AbsoluteFill>
  );
};

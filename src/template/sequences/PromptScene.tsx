import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Img, staticFile } from "remotion";
import { VisibleMovingDots } from "../components/MovingDots";
import { GradientBorder } from "../components/GradientBorder";
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";
import { colors, plugAndPlayBarHeight } from "../styles";

interface PromptSceneProps {
  promptText: string;
}

// V1 Prompt Scene - Goose Desktop style (NOT terminal), WITH gradient border
export const PromptScene: React.FC<PromptSceneProps> = ({ promptText }) => {
  const frame = useCurrentFrame();

  // Typing animation
  const charsToShow = Math.floor(
    interpolate(frame, [30, 30 + promptText.length * 1.5], [0, promptText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const cursorVisible = Math.sin(frame * 0.4) > 0;
  const typingComplete = charsToShow >= promptText.length;

  // Window animation
  const windowOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const windowScale = interpolate(frame, [0, 15], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <GradientBorder>
        <AbsoluteFill style={{ backgroundColor: colors.black }}>
          {/* Moving dots */}
          <VisibleMovingDots />

          {/* Goose Desktop Window - V1 style */}
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
              paddingBottom: plugAndPlayBarHeight + 40,
            }}
          >
        <div
          style={{
            width: "95%",
            height: "75%",
            backgroundColor: "#1a1a1a",
            borderRadius: 20,
            overflow: "hidden",
            opacity: windowOpacity,
            transform: `scale(${windowScale})`,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Window title bar */}
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#FF5F57" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#28CA41" }} />
            </div>
            <span
              style={{
                fontSize: 16,
                color: "#888",
                fontFamily: "'Inter', sans-serif",
                marginLeft: 10,
              }}
            >
              Goose Desktop
            </span>
          </div>

          {/* Chat area */}
          <div
            style={{
              flex: 1,
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {/* Goose logo in corner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 40,
              }}
            >
              <Img
                src={staticFile("goose-logo-white.png")}
                style={{ width: 50, height: 50, objectFit: "contain" }}
              />
              <span
                style={{
                  fontSize: 20,
                  color: colors.textSecondary,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Ready to help
              </span>
            </div>

            {/* User prompt */}
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: "85%",
                backgroundColor: "#333",
                borderRadius: 20,
                borderBottomRightRadius: 6,
                padding: "24px 32px",
              }}
            >
              <p
                style={{
                  fontSize: 36,
                  color: colors.white,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {promptText.slice(0, charsToShow)}
                {!typingComplete && cursorVisible && (
                  <span style={{ color: colors.teal }}>|</span>
                )}
              </p>
            </div>

            {/* "Goose is working" indicator */}
            {typingComplete && (
              <div
                style={{
                  marginTop: 30,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: interpolate(
                    frame,
                    [30 + promptText.length * 1.5, 30 + promptText.length * 1.5 + 15],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  ),
                }}
              >
                <Img
                  src={staticFile("goose-logo-white.png")}
                  style={{
                    width: 30,
                    height: 30,
                    objectFit: "contain",
                  }}
                />
                <span
                  style={{
                    fontSize: 20,
                    color: colors.teal,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  goose is working on it...
                </span>
                {/* Animated dots */}
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: colors.teal,
                        opacity: interpolate(
                          Math.sin((frame + i * 10) * 0.2),
                          [-1, 1],
                          [0.3, 1]
                        ),
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input bar at bottom */}
          <div
            style={{
              padding: "20px 30px",
              backgroundColor: "#2a2a2a",
              borderTop: "1px solid #333",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 16,
                color: "#666",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span>⌘↑/⌘↓ to navigate messages</span>
            </div>
          </div>
        </div>
          </AbsoluteFill>

          {/* Plug & Play bar */}
          <PlugAndPlayBar />
        </AbsoluteFill>
      </GradientBorder>
    </AbsoluteFill>
  );
};

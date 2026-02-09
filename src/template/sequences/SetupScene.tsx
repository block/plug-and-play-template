import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { VisibleMovingDots } from "../components/MovingDots";
import { GradientBorder } from "../components/GradientBorder";
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";
import { colors, plugAndPlayBarHeight } from "../styles";

interface SetupSceneProps {
  extensionName: string;
  extensionCommand: string;
}

// V4 Setup Scene with TYPE: STDIO field and Extension Added animation
export const SetupScene: React.FC<SetupSceneProps> = ({
  extensionName,
  extensionCommand,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Modal animation - clean, no tilt
  const modalScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Typing animations
  const nameChars = Math.floor(
    interpolate(frame, [25, 25 + extensionName.length * 2.5], [0, extensionName.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const commandStart = 25 + extensionName.length * 2.5 + 15;
  const commandChars = Math.floor(
    interpolate(frame, [commandStart, commandStart + extensionCommand.length * 1.8], [0, extensionCommand.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const cursorBlink = Math.sin(frame * 0.4) > 0;
  const typingComplete = commandChars >= extensionCommand.length;

  // Extension Added animation
  const showExtensionAdded = frame > 200;
  const extensionAddedScale = showExtensionAdded
    ? spring({
        frame: frame - 200,
        fps,
        config: { damping: 10, stiffness: 100 },
      })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <GradientBorder>
        <AbsoluteFill style={{ backgroundColor: colors.black }}>
          {/* Moving dots */}
          <VisibleMovingDots />

          {/* Dimmed overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: plugAndPlayBarHeight,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />

          {/* Modal */}
          <AbsoluteFill
            style={{
              paddingBottom: plugAndPlayBarHeight,
              justifyContent: "center",
              alignItems: "center",
              padding: 30,
            }}
          >
            <div
              style={{
                width: "90%",
                backgroundColor: colors.white,
                borderRadius: 22,
                padding: 32,
                transform: `scale(${modalScale})`,
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 28,
                  paddingBottom: 18,
                  borderBottom: "2px solid #E8E8E8",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: colors.teal,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: colors.black,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Add Extension
                </span>
              </div>

              {/* Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Extension Name */}
                <div>
                  <label
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 8,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Extension Name
                  </label>
                  <div
                    style={{
                      padding: "14px 18px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 10,
                      border: "2px solid #E0E0E0",
                      fontSize: 22,
                      fontFamily: "'Inter', sans-serif",
                      color: colors.black,
                      minHeight: 26,
                    }}
                  >
                    {extensionName.slice(0, nameChars)}
                    {nameChars < extensionName.length && nameChars > 0 && cursorBlink && (
                      <span style={{ color: colors.teal }}>|</span>
                    )}
                  </div>
                </div>

                {/* Command */}
                <div>
                  <label
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 8,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Command
                  </label>
                  <div
                    style={{
                      padding: "14px 18px",
                      backgroundColor: "#1a1a1a",
                      borderRadius: 10,
                      border: "2px solid #333",
                      fontSize: 18,
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      color: colors.teal,
                      minHeight: 26,
                      wordBreak: "break-all",
                    }}
                  >
                    {extensionCommand.slice(0, commandChars)}
                    {commandChars < extensionCommand.length && commandChars > 0 && cursorBlink && (
                      <span style={{ color: colors.orange }}>|</span>
                    )}
                  </div>
                </div>

                {/* Type - STDIO */}
                <div>
                  <label
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 8,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Type
                  </label>
                  <div
                    style={{
                      padding: "14px 18px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 10,
                      border: "2px solid #E0E0E0",
                      fontSize: 18,
                      fontFamily: "'Inter', sans-serif",
                      color: colors.black,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>STDIO</span>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#666">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 }}>
                {/* Extension Added message */}
                {showExtensionAdded && (
                  <div
                    style={{
                      transform: `scale(${extensionAddedScale})`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={colors.teal}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span
                      style={{
                        fontSize: 20,
                        color: colors.teal,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Extension Added!
                    </span>
                  </div>
                )}

                <div
                  style={{
                    padding: "12px 32px",
                    backgroundColor: typingComplete ? colors.teal : "#ccc",
                    borderRadius: 10,
                    fontSize: 18,
                    fontWeight: 600,
                    color: colors.white,
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: typingComplete ? `0 4px 18px rgba(78, 205, 196, 0.4)` : "none",
                  }}
                >
                  Save Changes
                </div>
              </div>
            </div>
          </AbsoluteFill>

          {/* Teal bar */}
          <PlugAndPlayBar />
        </AbsoluteFill>
      </GradientBorder>
    </AbsoluteFill>
  );
};

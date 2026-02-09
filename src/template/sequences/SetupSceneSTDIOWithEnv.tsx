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

interface EnvVariable {
  name: string;
  value: string;
}

interface SetupSceneSTDIOWithEnvProps {
  extensionName: string;
  extensionCommand: string;
  envVars: EnvVariable[];
}

// Setup Scene for STDIO extensions with environment variables
export const SetupSceneSTDIOWithEnv: React.FC<SetupSceneSTDIOWithEnvProps> = ({
  extensionName,
  extensionCommand,
  envVars,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Modal animation - clean, no tilt
  const modalScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Typing animations for name
  const nameChars = Math.floor(
    interpolate(frame, [25, 25 + extensionName.length * 2.5], [0, extensionName.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Typing animation for command
  const commandStart = 25 + extensionName.length * 2.5 + 15;
  const commandChars = Math.floor(
    interpolate(
      frame,
      [commandStart, commandStart + extensionCommand.length * 1.8],
      [0, extensionCommand.length],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  // Calculate when command typing is done
  const commandTypingDone = commandStart + extensionCommand.length * 1.8;

  // Env variables typing - each variable types after the previous
  const getEnvVarProgress = (index: number) => {
    const envStartBase = commandTypingDone + 20;
    const timePerVar = 80; // frames per env variable
    const varStart = envStartBase + index * timePerVar;

    const env = envVars[index];
    const nameEnd = varStart + env.name.length * 2;
    const valueStart = nameEnd + 10;
    const valueEnd = valueStart + env.value.length * 1.5;
    const addButtonFrame = valueEnd + 15;

    const nameCharsLocal = Math.floor(
      interpolate(frame, [varStart, nameEnd], [0, env.name.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );

    const valueCharsLocal = Math.floor(
      interpolate(frame, [valueStart, valueEnd], [0, env.value.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );

    const showAddButton = frame > addButtonFrame;
    const addButtonScale = showAddButton
      ? spring({
          frame: frame - addButtonFrame,
          fps,
          config: { damping: 12, stiffness: 150 },
        })
      : 0;

    return {
      nameChars: nameCharsLocal,
      valueChars: valueCharsLocal,
      showAddButton,
      addButtonScale,
      isComplete: frame > addButtonFrame + 10,
    };
  };

  const cursorBlink = Math.sin(frame * 0.4) > 0;

  // Check if all typing is complete
  const lastEnvIndex = envVars.length - 1;
  const lastEnvProgress = lastEnvIndex >= 0 ? getEnvVarProgress(lastEnvIndex) : null;
  const allTypingComplete = lastEnvProgress
    ? lastEnvProgress.isComplete
    : commandChars >= extensionCommand.length;

  // Extension Added animation
  const extensionAddedDelay = lastEnvProgress
    ? commandTypingDone + 20 + envVars.length * 80 + 30
    : commandTypingDone + 30;

  const showExtensionAdded = frame > extensionAddedDelay;
  const extensionAddedScale = showExtensionAdded
    ? spring({
        frame: frame - extensionAddedDelay,
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
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* Modal */}
          <AbsoluteFill
            style={{
              paddingBottom: plugAndPlayBarHeight,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                width: "95%",
                backgroundColor: colors.white,
                borderRadius: 28,
                padding: 44,
                transform: `scale(${modalScale})`,
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.5)",
                maxHeight: "85%",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 32,
                  paddingBottom: 20,
                  borderBottom: "3px solid #E8E8E8",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: colors.teal,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: colors.black,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Add Extension
                </span>
              </div>

              {/* Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {/* Extension Name */}
                <div>
                  <label
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 10,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Extension Name
                  </label>
                  <div
                    style={{
                      padding: "16px 20px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 12,
                      border: "2px solid #E0E0E0",
                      fontSize: 26,
                      fontFamily: "'Inter', sans-serif",
                      color: colors.black,
                      minHeight: 30,
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
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 10,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Command
                  </label>
                  <div
                    style={{
                      padding: "16px 20px",
                      backgroundColor: "#1a1a1a",
                      borderRadius: 12,
                      border: "2px solid #333",
                      fontSize: 22,
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      color: colors.teal,
                      minHeight: 30,
                      wordBreak: "break-all",
                    }}
                  >
                    {extensionCommand.slice(0, commandChars)}
                    {commandChars < extensionCommand.length && commandChars > 0 && cursorBlink && (
                      <span style={{ color: colors.orange }}>|</span>
                    )}
                  </div>
                </div>

                {/* Environment Variables Section */}
                {frame >= commandTypingDone + 20 && (
                  <div>
                    <label
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#666",
                        marginBottom: 10,
                        display: "block",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Environment Variables
                    </label>

                    {envVars.map((env, index) => {
                      const progress = getEnvVarProgress(index);

                      // Only show row if we've started typing it
                      if (frame < commandTypingDone + 20 + index * 80) return null;

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            gap: 12,
                            marginBottom: 12,
                            alignItems: "center",
                          }}
                        >
                          {/* Variable Name */}
                          <div
                            style={{
                              flex: 1,
                              padding: "14px 18px",
                              backgroundColor: "#F5F5F5",
                              borderRadius: 10,
                              border: "2px solid #E0E0E0",
                              fontSize: 20,
                              fontFamily: "'SF Mono', 'Fira Code', monospace",
                              color: colors.black,
                              minHeight: 26,
                            }}
                          >
                            {env.name.slice(0, progress.nameChars)}
                            {progress.nameChars < env.name.length &&
                              progress.nameChars > 0 &&
                              cursorBlink && <span style={{ color: colors.teal }}>|</span>}
                            {progress.nameChars === 0 && (
                              <span style={{ color: "#999" }}>Variable name</span>
                            )}
                          </div>

                          {/* Variable Value */}
                          <div
                            style={{
                              flex: 1.5,
                              padding: "14px 18px",
                              backgroundColor: "#1a1a1a",
                              borderRadius: 10,
                              border: "2px solid #333",
                              fontSize: 20,
                              fontFamily: "'SF Mono', 'Fira Code', monospace",
                              color: colors.orange,
                              minHeight: 26,
                              wordBreak: "break-all",
                            }}
                          >
                            {env.value.slice(0, progress.valueChars)}
                            {progress.valueChars < env.value.length &&
                              progress.valueChars > 0 &&
                              cursorBlink && <span style={{ color: colors.teal }}>|</span>}
                            {progress.valueChars === 0 &&
                              progress.nameChars >= env.name.length && (
                                <span style={{ color: "#666" }}>Value</span>
                              )}
                          </div>

                          {/* Add Button */}
                          <div
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: 12,
                              backgroundColor: progress.showAddButton ? colors.teal : "#E0E0E0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transform: `scale(${progress.showAddButton ? progress.addButtonScale : 1})`,
                              boxShadow: progress.showAddButton
                                ? `0 4px 12px rgba(78, 205, 196, 0.4)`
                                : "none",
                            }}
                          >
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill={progress.showAddButton ? "white" : "#999"}
                            >
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Type - STDIO */}
                <div>
                  <label
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 10,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Type
                  </label>
                  <div
                    style={{
                      padding: "16px 20px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 12,
                      border: "2px solid #E0E0E0",
                      fontSize: 22,
                      fontFamily: "'Inter', sans-serif",
                      color: colors.black,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>STDIO</span>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="#666">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                {/* Extension Added message */}
                {showExtensionAdded && (
                  <div
                    style={{
                      transform: `scale(${extensionAddedScale})`,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <svg width="34" height="34" viewBox="0 0 24 24" fill={colors.teal}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span
                      style={{
                        fontSize: 26,
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
                    padding: "16px 40px",
                    backgroundColor: allTypingComplete ? colors.teal : "#ccc",
                    borderRadius: 12,
                    fontSize: 24,
                    fontWeight: 600,
                    color: colors.white,
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: allTypingComplete ? `0 6px 24px rgba(78, 205, 196, 0.4)` : "none",
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

export default SetupSceneSTDIOWithEnv;

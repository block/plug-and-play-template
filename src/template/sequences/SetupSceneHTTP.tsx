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

interface SetupSceneHTTPProps {
  extensionName: string;
  endpoint: string; // ✅ matches config.setup.endpoint
}

// Setup Scene for HTTP/HTTPS extensions - shows Endpoint instead of Command, Type: HTTP
export const SetupSceneHTTP: React.FC<SetupSceneHTTPProps> = ({
  extensionName,
  endpoint,
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
    interpolate(
      frame,
      [25, 25 + extensionName.length * 2.5],
      [0, extensionName.length],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  );

  const endpointStart = 25 + extensionName.length * 2.5 + 15;
  const endpointChars = Math.floor(
    interpolate(
      frame,
      [endpointStart, endpointStart + endpoint.length * 1.8],
      [0, endpoint.length],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  );

  const cursorBlink = Math.sin(frame * 0.4) > 0;
  const typingComplete = endpointChars >= endpoint.length;

  // ✅ Make "Extension Added!" appear after typing finishes (not a fixed frame)
  const endpointTypingDone = endpointStart + endpoint.length * 1.8;
  const extensionAddedDelay = Math.ceil(endpointTypingDone + 30);

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
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 36,
                  paddingBottom: 24,
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
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {/* Extension Name */}
                <div>
                  <label
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 12,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Extension Name
                  </label>
                  <div
                    style={{
                      padding: "18px 22px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 12,
                      border: "2px solid #E0E0E0",
                      fontSize: 28,
                      fontFamily: "'Inter', sans-serif",
                      color: colors.black,
                      minHeight: 34,
                    }}
                  >
                    {extensionName.slice(0, nameChars)}
                    {nameChars < extensionName.length &&
                      nameChars > 0 &&
                      cursorBlink && <span style={{ color: colors.teal }}>|</span>}
                  </div>
                </div>

                {/* Endpoint */}
                <div>
                  <label
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 12,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Endpoint
                  </label>
                  <div
                    style={{
                      padding: "18px 22px",
                      backgroundColor: "#1a1a1a",
                      borderRadius: 12,
                      border: "2px solid #333",
                      fontSize: 24,
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      color: colors.teal,
                      minHeight: 34,
                      wordBreak: "break-all",
                    }}
                  >
                    {endpoint.slice(0, endpointChars)}
                    {endpointChars < endpoint.length &&
                      endpointChars > 0 &&
                      cursorBlink && <span style={{ color: colors.orange }}>|</span>}
                  </div>
                </div>

                {/* Type - HTTP */}
                <div>
                  <label
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 12,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Type
                  </label>
                  <div
                    style={{
                      padding: "18px 22px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 12,
                      border: "2px solid #E0E0E0",
                      fontSize: 24,
                      fontFamily: "'Inter', sans-serif",
                      color: colors.black,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>HTTP</span>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#666">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div
                style={{
                  marginTop: 36,
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
                    backgroundColor: typingComplete ? colors.teal : "#ccc",
                    borderRadius: 12,
                    fontSize: 24,
                    fontWeight: 600,
                    color: colors.white,
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: typingComplete ? `0 6px 24px rgba(78, 205, 196, 0.4)` : "none",
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

export default SetupSceneHTTP;

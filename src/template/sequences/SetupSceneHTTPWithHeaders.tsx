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

interface RequestHeader {
  name: string;
  value: string;
}

interface SetupSceneHTTPWithHeadersProps {
  extensionName: string;
  endpoint: string;
  requestHeaders: RequestHeader[];
}

// Setup Scene for HTTP/HTTPS extensions with request headers
export const SetupSceneHTTPWithHeaders: React.FC<SetupSceneHTTPWithHeadersProps> = ({
  extensionName,
  endpoint,
  requestHeaders,
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

  // Typing animation for endpoint
  const endpointStart = 25 + extensionName.length * 2.5 + 15;
  const endpointChars = Math.floor(
    interpolate(
      frame,
      [endpointStart, endpointStart + endpoint.length * 1.8],
      [0, endpoint.length],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  // Calculate when endpoint typing is done
  const endpointTypingDone = endpointStart + endpoint.length * 1.8;

  // Request headers typing - each header types after the previous
  const getHeaderProgress = (index: number) => {
    const headerStartBase = endpointTypingDone + 20;
    const timePerHeader = 80; // frames per header
    const headerStart = headerStartBase + index * timePerHeader;

    const header = requestHeaders[index];
    const nameEnd = headerStart + header.name.length * 2;
    const valueStart = nameEnd + 10;
    const valueEnd = valueStart + header.value.length * 1.5;
    const addButtonFrame = valueEnd + 15;

    const nameCharsLocal = Math.floor(
      interpolate(frame, [headerStart, nameEnd], [0, header.name.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );

    const valueCharsLocal = Math.floor(
      interpolate(frame, [valueStart, valueEnd], [0, header.value.length], {
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
  const lastHeaderIndex = requestHeaders.length - 1;
  const lastHeaderProgress = lastHeaderIndex >= 0 ? getHeaderProgress(lastHeaderIndex) : null;
  const allTypingComplete = lastHeaderProgress
    ? lastHeaderProgress.isComplete
    : endpointChars >= endpoint.length;

  // Extension Added animation
  const extensionAddedDelay = lastHeaderProgress
    ? endpointTypingDone + 20 + requestHeaders.length * 80 + 30
    : endpointTypingDone + 30;

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
              backgroundColor: "rgba(0, 0, 0, 0.25)",
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
                maxHeight: "85%",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                  paddingBottom: 16,
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
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Extension Name */}
                <div>
                  <label
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 6,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Extension Name
                  </label>
                  <div
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 10,
                      border: "2px solid #E0E0E0",
                      fontSize: 20,
                      fontFamily: "'Inter', sans-serif",
                      color: colors.black,
                      minHeight: 24,
                    }}
                  >
                    {extensionName.slice(0, nameChars)}
                    {nameChars < extensionName.length && nameChars > 0 && cursorBlink && (
                      <span style={{ color: colors.teal }}>|</span>
                    )}
                  </div>
                </div>

                {/* Endpoint */}
                <div>
                  <label
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 6,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Endpoint
                  </label>
                  <div
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "#1a1a1a",
                      borderRadius: 10,
                      border: "2px solid #333",
                      fontSize: 16,
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      color: colors.teal,
                      minHeight: 24,
                      wordBreak: "break-all",
                    }}
                  >
                    {endpoint.slice(0, endpointChars)}
                    {endpointChars < endpoint.length && endpointChars > 0 && cursorBlink && (
                      <span style={{ color: colors.orange }}>|</span>
                    )}
                  </div>
                </div>

                {/* Request Headers Section */}
                {frame >= endpointTypingDone + 20 && (
                  <div>
                    <label
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#666",
                        marginBottom: 6,
                        display: "block",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Request Headers
                    </label>

                    {requestHeaders.map((header, index) => {
                      const progress = getHeaderProgress(index);

                      // Only show row if we've started typing it
                      if (frame < endpointTypingDone + 20 + index * 80) return null;

                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            gap: 10,
                            marginBottom: 10,
                            alignItems: "center",
                          }}
                        >
                          {/* Header Name */}
                          <div
                            style={{
                              flex: 1,
                              padding: "10px 14px",
                              backgroundColor: "#F5F5F5",
                              borderRadius: 8,
                              border: "2px solid #E0E0E0",
                              fontSize: 16,
                              fontFamily: "'SF Mono', 'Fira Code', monospace",
                              color: colors.black,
                              minHeight: 20,
                            }}
                          >
                            {header.name.slice(0, progress.nameChars)}
                            {progress.nameChars < header.name.length &&
                              progress.nameChars > 0 &&
                              cursorBlink && <span style={{ color: colors.teal }}>|</span>}
                            {progress.nameChars === 0 && (
                              <span style={{ color: "#999" }}>Header name</span>
                            )}
                          </div>

                          {/* Header Value */}
                          <div
                            style={{
                              flex: 1.5,
                              padding: "10px 14px",
                              backgroundColor: "#1a1a1a",
                              borderRadius: 8,
                              border: "2px solid #333",
                              fontSize: 16,
                              fontFamily: "'SF Mono', 'Fira Code', monospace",
                              color: colors.orange,
                              minHeight: 20,
                              wordBreak: "break-all",
                            }}
                          >
                            {header.value.slice(0, progress.valueChars)}
                            {progress.valueChars < header.value.length &&
                              progress.valueChars > 0 &&
                              cursorBlink && <span style={{ color: colors.teal }}>|</span>}
                            {progress.valueChars === 0 &&
                              progress.nameChars >= header.name.length && (
                                <span style={{ color: "#666" }}>Value</span>
                              )}
                          </div>

                          {/* Add Button */}
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
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
                              width="24"
                              height="24"
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

                {/* Type - HTTP */}
                <div>
                  <label
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#666",
                      marginBottom: 6,
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Type
                  </label>
                  <div
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 10,
                      border: "2px solid #E0E0E0",
                      fontSize: 16,
                      fontFamily: "'Inter', sans-serif",
                      color: colors.black,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>HTTP</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 16,
                }}
              >
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
                    backgroundColor: allTypingComplete ? colors.teal : "#ccc",
                    borderRadius: 10,
                    fontSize: 18,
                    fontWeight: 600,
                    color: colors.white,
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: allTypingComplete ? `0 4px 18px rgba(78, 205, 196, 0.4)` : "none",
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

export default SetupSceneHTTPWithHeaders;

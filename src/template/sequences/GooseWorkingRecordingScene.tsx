import React from "react";
import {
  AbsoluteFill,
  Video,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  staticFile,
} from "remotion";
import { VisibleMovingDots } from "../components/MovingDots";
import { GradientBorder } from "../components/GradientBorder";
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";
import { colors, plugAndPlayBarHeight } from "../styles";

interface GooseWorkingRecordingSceneProps {
  /** Path or URL to the screen recording video */
  recordingSrc: string;
  /** Optional title to display above the recording */
  title?: string;
  /** Optional subtitle/description below the title */
  subtitle?: string;
  /** Start time in seconds to begin playing the recording (default: 0) */
  startFrom?: number;
  /** Playback rate for the recording (default: 1, use >1 for speedup) */
  playbackRate?: number;
  /** Whether to show the title overlay (default: false) */
  showTitle?: boolean;
  /** Volume of the recording (0-1, default: 0 for silent) */
  volume?: number;
  /** Whether to show the recording indicator (default: true) */
  showRecordingIndicator?: boolean;
}

/**
 * Realistic MacBook Pro frame component
 */
const MacBookProFrame: React.FC<{
  children: React.ReactNode;
  screenWidth: number;
  screenHeight: number;
  scale: number;
  frame: number;
  tilt?: boolean;
}> = ({ children, screenWidth, screenHeight, scale, frame, tilt = false }) => {
  // MacBook Pro proportions
  const bezelTop = 28;
  const bezelSide = 12;
  const bezelBottom = 12;
  const bodyRadius = 16;
  const screenRadius = 8;
  
  const bodyWidth = screenWidth + bezelSide * 2;
  const bodyHeight = screenHeight + bezelTop + bezelBottom;
  
  // Hinge/base dimensions
  const baseWidth = bodyWidth + 20;
  const baseHeight = 10;
  const baseFrontWidth = bodyWidth + 40;
  const baseFrontHeight = 5;

  // Subtle animation for screen glow - gentle pulse
  const glowPulse = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [0.7, 0.85]
  );

  // 3D tilt transform
  const tiltTransform = tilt 
    ? `scale(${scale}) perspective(2000px) rotateX(8deg) rotateY(-2deg)`
    : `scale(${scale})`;

  return (
    <div
      style={{
        transform: tiltTransform,
        transformOrigin: "center center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transformStyle: "preserve-3d",
      }}
    >
      {/* MacBook Pro Lid/Screen */}
      <div
        style={{
          width: bodyWidth,
          height: bodyHeight,
          background: "linear-gradient(145deg, #2d2d2f 0%, #1a1a1c 100%)",
          borderRadius: bodyRadius,
          padding: `${bezelTop}px ${bezelSide}px ${bezelBottom}px`,
          boxSizing: "border-box",
          boxShadow: `
            inset 0 0 0 1px rgba(255,255,255,0.08),
            0 0 ${100 * glowPulse}px rgba(78, 205, 196, ${glowPulse * 0.6}),
            0 0 ${180 * glowPulse}px rgba(78, 205, 196, ${glowPulse * 0.3}),
            0 0 ${250 * glowPulse}px rgba(78, 205, 196, ${glowPulse * 0.15}),
            0 30px 60px rgba(0,0,0,0.5),
            0 10px 20px rgba(0,0,0,0.3)
          `,
          position: "relative",
        }}
      >
        {/* Notch with camera */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 22,
            backgroundColor: "#1a1a1c",
            borderRadius: "0 0 12px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Camera lens */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "radial-gradient(circle, #1a3a1a 0%, #0a1a0a 60%, #050a05 100%)",
              boxShadow: "inset 0 0 2px rgba(0,255,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          />
        </div>

        {/* Screen */}
        <div
          style={{
            width: screenWidth,
            height: screenHeight,
            backgroundColor: "#000",
            borderRadius: screenRadius,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {children}
        </div>
      </div>


    </div>
  );
};

/**
 * GooseWorkingRecordingScene - A V7-styled scene for displaying screen recordings
 * of goose performing tasks in a MacBook Pro-style frame.
 */
export const GooseWorkingRecordingScene: React.FC<GooseWorkingRecordingSceneProps> = ({
  recordingSrc,
  title,
  subtitle,
  startFrom = 0,
  playbackRate = 1,
  showTitle = false,
  volume = 0,
  showRecordingIndicator = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Device scale-in animation
  const deviceScale = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 14,
      stiffness: 70,
      mass: 1,
    },
  });

  // Recording indicator blink
  const recordingBlink = Math.sin(frame * 0.15) > 0;

  // Reserve space for captions above the PlugAndPlayBar
  const captionSpace = 150;

  // Calculate dimensions - leave room for captions
  const availableHeight = 1920 - plugAndPlayBarHeight - captionSpace - 80; // padding
  const availableWidth = 1080 - 60; // padding
  
  // Screen dimensions - sized to fit with caption space
  const screenHeight = Math.min(availableHeight - 60, 1200); // leave room for laptop base
  const screenWidth = Math.min(availableWidth - 50, 900);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <GradientBorder>
        <AbsoluteFill style={{ backgroundColor: colors.black }}>
          {/* Animated background dots */}
          <VisibleMovingDots />

          {/* Main content area */}
          <AbsoluteFill
            style={{
              paddingBottom: plugAndPlayBarHeight + captionSpace,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Optional Title section */}
            {showTitle && title && (
              <div
                style={{
                  opacity: interpolate(frame, [0, 20], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  marginBottom: 20,
                  textAlign: "center",
                  zIndex: 10,
                }}
              >
                <h2
                  style={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: colors.white,
                    fontFamily: "'Inter', sans-serif",
                    margin: 0,
                    marginBottom: subtitle ? 8 : 0,
                    textShadow: `0 0 40px ${colors.teal}60`,
                  }}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p
                    style={{
                      fontSize: 24,
                      fontWeight: 400,
                      color: colors.textSecondary,
                      fontFamily: "'Inter', sans-serif",
                      margin: 0,
                    }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* MacBook Pro with video */}
            <MacBookProFrame
              screenWidth={screenWidth}
              screenHeight={screenHeight}
              scale={Math.min(deviceScale, 1)}
              frame={frame}
              tilt={false}
            >
              <Video
                src={staticFile(recordingSrc)}
                startFrom={Math.round(startFrom * fps)}
                playbackRate={playbackRate}
                volume={volume}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  backgroundColor: "#000",
                }}
              />
            </MacBookProFrame>

            {/* Recording indicator */}
            {showRecordingIndicator && (
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  right: 45,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: interpolate(frame, [20, 40], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: recordingBlink ? "#FF3B30" : "#FF3B3080",
                    boxShadow: recordingBlink 
                      ? "0 0 10px #FF3B30, 0 0 20px #FF3B3060" 
                      : "none",
                    transition: "all 0.1s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "'Inter', sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Recording
                </span>
              </div>
            )}
          </AbsoluteFill>

          {/* Plug & Play bar at bottom */}
          <PlugAndPlayBar />
        </AbsoluteFill>
      </GradientBorder>
    </AbsoluteFill>
  );
};

export default GooseWorkingRecordingScene;

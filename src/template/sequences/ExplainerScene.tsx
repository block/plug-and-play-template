import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, Img, staticFile } from "remotion";
import { VisibleMovingDots } from "../components/MovingDots";
import { GradientBorder } from "../components/GradientBorder";
import { PlugAndPlayBar } from "../components/PlugAndPlayBar";
import { colors, plugAndPlayBarHeight } from "../styles";

interface ExplainerSceneProps {
  explainerLines: string[];
}

// Animation timing constants
const CHARS_PER_FRAME = 0.8; // Slower typewriter speed (was 1.5)
const BADGE_DELAY = 10; // frames before text starts after badge
const CHECKMARK_BUFFER = 30; // frames to show checkmark before next line
const FINAL_HOLD = 45; // extra frames at the end to hold the completed state
const EMOJI_INTRO = 25; // frames for emoji to appear before bullets start

// Helper to calculate required duration for explainer scene
export const calculateExplainerDuration = (lines: string[]): number => {
  let totalFrames = EMOJI_INTRO; // Start with emoji intro time
  
  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length;
    const typingFrames = Math.ceil(lineLength / CHARS_PER_FRAME);
    const lineTotal = BADGE_DELAY + typingFrames + CHECKMARK_BUFFER;
    totalFrames += lineTotal;
  }
  
  // Add final hold time
  totalFrames += FINAL_HOLD;
  
  return totalFrames;
};

// Helper to colorize key words in a line
const colorizeText = (text: string) => {
  // Keywords to highlight with colors
  const tealKeywords = ["install", "enable", "connect", "start", "open", "click", "select", "choose", "add", "run", "launch"];
  const orangeKeywords = ["extension", "goose", "config", "setup", "settings", "api", "key", "token", "mcp", "server", "tool"];
  
  const words = text.split(" ");
  
  return (
    <>
      {words.map((word, wordIndex) => {
        const lowerWord = word.toLowerCase().replace(/[^a-z]/g, "");
        let color = colors.white;
        
        if (tealKeywords.some(kw => lowerWord.includes(kw))) {
          color = colors.teal;
        } else if (orangeKeywords.some(kw => lowerWord.includes(kw))) {
          color = colors.orange;
        }
        
        return (
          <React.Fragment key={wordIndex}>
            <span style={{ color }}>{word}</span>
            {wordIndex < words.length - 1 ? " " : ""}
          </React.Fragment>
        );
      })}
    </>
  );
};

// Cute goose cursor component with glow effect
const GooseCursor: React.FC<{ visible: boolean; frame: number }> = ({ visible, frame }) => {
  if (!visible) return null;
  
  // Bobbing animation
  const bob = Math.sin(frame * 0.4) * 3;
  
  // Pulsing glow effect (like a cursor blink but smoother)
  const glowIntensity = 0.5 + Math.sin(frame * 0.2) * 0.5; // 0 to 1
  const glowSize = 8 + glowIntensity * 8; // 8px to 16px
  const glowOpacity = 0.4 + glowIntensity * 0.4; // 0.4 to 0.8
  
  return (
    <span
      style={{
        display: "inline-block",
        marginLeft: 8,
        transform: `translateY(${bob}px)`,
        verticalAlign: "middle",
        position: "relative",
      }}
    >
      {/* Glow layer */}
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 32 + glowSize * 2,
          height: 32 + glowSize * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.teal}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      {/* Goose icon */}
      <Img
        src={staticFile("goose.svg")}
        style={{
          width: 32,
          height: 32,
          filter: `invert(1) drop-shadow(0 0 ${glowSize}px ${colors.teal})`,
          position: "relative",
          zIndex: 1,
        }}
      />
    </span>
  );
};

// Emoji header delay (appears before first bullet)
const EMOJI_DURATION = 25;

export const ExplainerScene: React.FC<ExplainerSceneProps> = ({
  explainerLines,
}) => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Calculate cumulative start frames based on actual line lengths
  // Now offset by EMOJI_DURATION so emoji appears first
  const getStartFrame = (lineIndex: number): number => {
    let startFrame = EMOJI_DURATION; // Start after emoji
    for (let i = 0; i < lineIndex; i++) {
      const lineLength = explainerLines[i].length;
      const typingFrames = Math.ceil(lineLength / CHARS_PER_FRAME);
      startFrame += BADGE_DELAY + typingFrames + CHECKMARK_BUFFER;
    }
    return startFrame;
  };

  // Emoji animation - Typewriter drop with squish
  const dropDuration = 12; // frames to fall
  const squishDuration = 8; // frames for squish effect
  
  // Drop from above
  const emojiY = interpolate(
    frame,
    [0, dropDuration],
    [-150, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  
  // Squish effect on landing (wider and shorter)
  const squishX = interpolate(
    frame,
    [dropDuration, dropDuration + squishDuration / 2, dropDuration + squishDuration],
    [1, 1.3, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const squishY = interpolate(
    frame,
    [dropDuration, dropDuration + squishDuration / 2, dropDuration + squishDuration],
    [1, 0.7, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  
  // Slight rotation on drop (like a stamp)
  const emojiRotate = interpolate(
    frame,
    [0, dropDuration],
    [-15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  
  // Opacity (instant appear)
  const emojiOpacity = frame >= 0 ? 1 : 0;

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
              padding: 50,
              paddingBottom: plugAndPlayBarHeight + 50,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 50,
                maxWidth: 950,
                alignItems: "center",
              }}
            >
              {/* Notepad emoji header - typewriter drop animation */}
              <div
                style={{
                  fontSize: 80,
                  transform: `translateY(${emojiY}px) rotate(${emojiRotate}deg) scaleX(${squishX}) scaleY(${squishY})`,
                  opacity: emojiOpacity,
                  marginBottom: 60,
                  marginTop: -80,
                }}
              >
                📝
              </div>

              {/* Bullet points */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 50,
                  width: "100%",
                }}
              >
                {explainerLines.map((line, i) => {
                  const startFrame = getStartFrame(i);
                  
                  // Badge bouncy spring animation
                  const badgeScale = spring({
                    frame: frame - startFrame,
                    fps,
                    config: {
                      damping: 10,
                      stiffness: 150,
                      mass: 0.5,
                    },
                  });
                  
                  // Typewriter effect - how many chars to show
                  const typewriterFrame = frame - startFrame - BADGE_DELAY;
                  const charsToShow = Math.max(0, Math.floor(typewriterFrame * CHARS_PER_FRAME));
                  const displayText = line.slice(0, charsToShow);
                  const isComplete = charsToShow >= line.length;
                  
                  // Checkmark animation (appears when typing is done)
                  const typingDuration = Math.ceil(line.length / CHARS_PER_FRAME);
                  const checkmarkDelay = BADGE_DELAY + typingDuration + 10;
                  const checkmarkScale = spring({
                    frame: frame - startFrame - checkmarkDelay,
                    fps,
                    config: {
                      damping: 12,
                      stiffness: 200,
                      mass: 0.4,
                    },
                  });
                  const showCheckmark = frame >= startFrame + checkmarkDelay;

                  // Overall row visibility
                  const rowVisible = frame >= startFrame;

                  return (
                    <div
                      key={i}
                      style={{
                        opacity: rowVisible ? 1 : 0,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 28,
                      }}
                    >
                      {/* Number badge / Checkmark - bouncy pop in */}
                      <div
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          backgroundColor: showCheckmark && isComplete 
                            ? colors.teal 
                            : (i === 0 ? colors.teal : colors.orange),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transform: `scale(${badgeScale})`,
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        {showCheckmark && isComplete ? (
                          <span
                            style={{
                              fontSize: 40,
                              fontWeight: 700,
                              color: colors.black,
                              transform: `scale(${checkmarkScale})`,
                              display: "flex",
                            }}
                          >
                            ✓
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: 36,
                              fontWeight: 700,
                              color: colors.black,
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {i + 1}
                          </span>
                        )}
                      </div>

                      {/* Text - typewriter with colored words */}
                      <span
                        style={{
                          fontSize: 52,
                          fontWeight: 500,
                          color: colors.white,
                          fontFamily: "'Inter', sans-serif",
                          lineHeight: 1.4,
                          minHeight: "1.4em",
                        }}
                      >
                        {colorizeText(displayText)}
                        {/* Cute goose cursor while typing */}
                        <GooseCursor 
                          visible={!isComplete && typewriterFrame > 0} 
                          frame={frame} 
                        />
                      </span>
                    </div>
                  );
                })}
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

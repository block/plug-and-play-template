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

const councilMembers = [
  { name: "Pragmatist", emoji: "🎯", color: "#4ECDC4" },
  { name: "Visionary", emoji: "🔮", color: "#9B59B6" },
  { name: "Skeptic", emoji: "🤔", color: "#E74C3C" },
  { name: "Optimist", emoji: "✨", color: "#F1C40F" },
  { name: "Analyst", emoji: "📊", color: "#3498DB" },
  { name: "Creative", emoji: "🎨", color: "#E91E63" },
  { name: "Realist", emoji: "⚖️", color: "#95A5A6" },
  { name: "Strategist", emoji: "♟️", color: "#2ECC71" },
  { name: "System Thinker", emoji: "🧩", color: "#FF9800" },
];

// V7 Demo Scene - 20 seconds (600 frames)
// Phase 1: 0-100 frames - sampling intro
// Phase 2: 100-300 frames - each member reasoning
// Phase 3: 300-450 frames - different perspectives
// Phase 4: 450-600 frames - voting & consensus
export const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase =
    frame < 100 ? 1 :
    frame < 300 ? 2 :
    frame < 450 ? 3 :
    4;

  const getTitleText = () => {
    switch (phase) {
      case 1: return "⚡ Sampling in Action";
      case 2: return "💬 Each Member Reasoning";
      case 3: return "🧠 Different Perspectives";
      case 4: return "🗳️ Voting & Consensus";
      default: return "";
    }
  };

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
              padding: 30,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
              {/* Title */}
              <div
                style={{
                  opacity: interpolate(frame, [0, 20], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: 700,
                    color: colors.white,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {getTitleText()}
                </span>
              </div>

              {/* Council grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 24,
                }}
              >
                {councilMembers.map((member, i) => {
                  const delay = i * 6;
                  const memberScale = spring({
                    frame: frame - delay,
                    fps,
                    config: { damping: 12, stiffness: 100 },
                  });

                  // Speaking animation
                  const cycleLength = phase === 2 ? 25 : phase === 3 ? 20 : 18;
                  const speakingIndex = Math.floor((frame - 100) / cycleLength) % 9;
                  const isSpeaking = (phase === 2 || phase === 3) && speakingIndex === i;

                  // Voting animation
                  const voteDelay = 450 + i * 15;
                  const hasVoted = phase === 4 && frame > voteDelay;

                  // Sampling pulse
                  const samplingPulse =
                    (phase === 1 || phase === 2) && frame > 30 + i * 8
                      ? 1 + Math.sin((frame - 30 - i * 8) * 0.15) * 0.05
                      : 1;

                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                        transform: `scale(${memberScale * samplingPulse})`,
                      }}
                    >
                      <div
                        style={{
                          width: 110,
                          height: 110,
                          borderRadius: "50%",
                          backgroundColor: member.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 52,
                          boxShadow: isSpeaking
                            ? `0 0 30px ${member.color}, 0 0 60px ${member.color}40`
                            : `0 4px 15px rgba(0,0,0,0.3)`,
                          border: hasVoted ? `4px solid ${colors.teal}` : "3px solid transparent",
                          transform: isSpeaking ? "scale(1.15)" : "scale(1)",
                          transition: "transform 0.2s ease",
                        }}
                      >
                        {member.emoji}
                      </div>

                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: isSpeaking ? colors.white : colors.textSecondary,
                          fontFamily: "'Inter', sans-serif",
                          textAlign: "center",
                        }}
                      >
                        {member.name}
                      </span>

                      {hasVoted && <span style={{ fontSize: 24 }}>✅</span>}
                    </div>
                  );
                })}
              </div>

              {/* Speaking bubble */}
              {(phase === 2 || phase === 3) && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "16px 28px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    opacity: interpolate(
                      frame % (phase === 2 ? 25 : 20),
                      [0, 4, 18, 25],
                      [0, 1, 1, 0]
                    ),
                    maxWidth: 800,
                  }}
                >
                  <p
                    style={{
                      fontSize: 24,
                      color: colors.white,
                      fontFamily: "'Inter', sans-serif",
                      textAlign: "center",
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    {phase === 2
                      ? "Starting own conversation with LLM..."
                      : "Reasoning from unique perspective..."}
                  </p>
                </div>
              )}

              {/* Voting progress */}
              {phase === 4 && (
                <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 28, color: colors.white, fontFamily: "'Inter', sans-serif" }}>
                    Votes cast: {Math.min(9, Math.floor((frame - 450) / 15) + 1)} / 9
                  </span>
                </div>
              )}
            </div>
          </AbsoluteFill>

          <PlugAndPlayBar />
        </AbsoluteFill>
      </GradientBorder>
    </AbsoluteFill>
  );
};

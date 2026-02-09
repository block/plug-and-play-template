import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, plugAndPlayBarHeight } from "../styles";

export interface Word {
  word: string;
  start: number;
  end: number;
}

export interface Caption {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  words: Word[];
}

// Captions with word-level timestamps from Whisper
export const captions: Caption[] = [
  {
    id: 1,
    startTime: 0,
    endTime: 3.52,
    text: "Why trust one AI opinion when you could get nine?",
    words: [
      { word: "Why", start: 0.0, end: 0.64 },
      { word: "trust", start: 0.64, end: 1.14 },
      { word: "one", start: 1.14, end: 1.58 },
      { word: "AI", start: 1.58, end: 1.9 },
      { word: "opinion", start: 1.9, end: 2.36 },
      { word: "when", start: 2.36, end: 2.72 },
      { word: "you", start: 2.72, end: 2.84 },
      { word: "could", start: 2.84, end: 2.98 },
      { word: "get", start: 2.98, end: 3.18 },
      { word: "nine?", start: 3.18, end: 3.52 },
    ],
  },
  {
    id: 2,
    startTime: 4.22,
    endTime: 7.22,
    text: "Let's plug and play to see MCP sampling in action.",
    words: [
      { word: "Let's", start: 4.22, end: 4.38 },
      { word: "plug", start: 4.38, end: 4.54 },
      { word: "and", start: 4.54, end: 4.7 },
      { word: "play", start: 4.7, end: 4.9 },
      { word: "to", start: 4.9, end: 5.14 },
      { word: "see", start: 5.14, end: 5.5 },
      { word: "MCP", start: 5.5, end: 6.08 },
      { word: "sampling", start: 6.08, end: 6.58 },
      { word: "in", start: 6.58, end: 6.82 },
      { word: "action.", start: 6.82, end: 7.22 },
    ],
  },
  {
    id: 3,
    startTime: 7.92,
    endTime: 13.12,
    text: "First, let's provide Goose with the command it needs to run the Council of Mine MCP server.",
    words: [
      { word: "First,", start: 7.92, end: 8.08 },
      { word: "let's", start: 8.46, end: 8.64 },
      { word: "provide", start: 8.64, end: 8.84 },
      { word: "Goose", start: 8.84, end: 9.2 },
      { word: "with", start: 9.2, end: 9.36 },
      { word: "the", start: 9.36, end: 9.48 },
      { word: "command", start: 9.48, end: 9.78 },
      { word: "it", start: 9.78, end: 10.1 },
      { word: "needs", start: 10.1, end: 10.4 },
      { word: "to", start: 10.4, end: 10.66 },
      { word: "run", start: 10.66, end: 10.86 },
      { word: "the", start: 10.86, end: 11.02 },
      { word: "Council", start: 11.02, end: 11.44 },
      { word: "of", start: 11.44, end: 11.76 },
      { word: "Mine", start: 11.76, end: 11.96 },
      { word: "MCP", start: 11.96, end: 12.7 },
      { word: "server.", start: 12.7, end: 13.12 },
    ],
  },
  {
    id: 4,
    startTime: 13.72,
    endTime: 16.48,
    text: "Normally, MCP tools just return data.",
    words: [
      { word: "Normally,", start: 13.72, end: 14.18 },
      { word: "MCP", start: 14.54, end: 14.96 },
      { word: "tools", start: 14.96, end: 15.32 },
      { word: "just", start: 15.32, end: 15.78 },
      { word: "return", start: 15.78, end: 16.12 },
      { word: "data.", start: 16.12, end: 16.48 },
    ],
  },
  {
    id: 5,
    startTime: 16.9,
    endTime: 22.42,
    text: "However, with sampling, tools can ask the LLM I configured in Goose to reason for them.",
    words: [
      { word: "However,", start: 16.9, end: 17.2 },
      { word: "with", start: 17.46, end: 17.62 },
      { word: "sampling,", start: 17.62, end: 18.0 },
      { word: "tools", start: 18.36, end: 18.56 },
      { word: "can", start: 18.56, end: 18.8 },
      { word: "ask", start: 18.8, end: 19.3 },
      { word: "the", start: 19.3, end: 19.56 },
      { word: "LLM", start: 19.56, end: 20.04 },
      { word: "I", start: 20.04, end: 20.36 },
      { word: "configured", start: 20.36, end: 20.78 },
      { word: "in", start: 20.78, end: 21.04 },
      { word: "Goose", start: 21.04, end: 21.34 },
      { word: "to", start: 21.34, end: 21.82 },
      { word: "reason", start: 21.82, end: 22.04 },
      { word: "for", start: 22.04, end: 22.26 },
      { word: "them.", start: 22.26, end: 22.42 },
    ],
  },
  {
    id: 6,
    startTime: 22.29,
    endTime: 23.21,
    text: "Now, let's play.",
    words: [
      { word: "Now,", start: 22.29, end: 22.49 },
      { word: "let's", start: 22.71, end: 23.05 },
      { word: "play.", start: 23.05, end: 23.21 },
    ],
  },
  {
    id: 7,
    startTime: 24.62,
    endTime: 31.58,
    text: "Hey Goose, start a Council of Mine to debate on whether the real skill gap in AI is coding or orchestration.",
    words: [
      { word: "Hey", start: 24.62, end: 24.8 },
      { word: "Goose,", start: 24.8, end: 25.24 },
      { word: "start", start: 25.46, end: 25.78 },
      { word: "a", start: 25.78, end: 25.94 },
      { word: "Council", start: 25.94, end: 26.28 },
      { word: "of", start: 26.28, end: 26.44 },
      { word: "Mine", start: 26.44, end: 26.58 },
      { word: "to", start: 26.58, end: 26.78 },
      { word: "debate", start: 26.78, end: 27.58 },
      { word: "on", start: 27.58, end: 27.88 },
      { word: "whether", start: 27.88, end: 28.1 },
      { word: "the", start: 28.1, end: 28.38 },
      { word: "real", start: 28.38, end: 28.66 },
      { word: "skill", start: 28.66, end: 28.92 },
      { word: "gap", start: 28.92, end: 29.2 },
      { word: "in", start: 29.2, end: 29.4 },
      { word: "AI", start: 29.4, end: 29.78 },
      { word: "is", start: 29.78, end: 30.14 },
      { word: "coding", start: 30.14, end: 30.72 },
      { word: "or", start: 30.72, end: 31.58 },
      { word: "orchestration.", start: 30.72, end: 31.58 },
    ],
  },
  {
    id: 8,
    startTime: 32.12,
    endTime: 33.88,
    text: "What's happening here is sampling.",
    words: [
      { word: "What's", start: 32.12, end: 32.6 },
      { word: "happening", start: 32.6, end: 32.88 },
      { word: "here", start: 32.88, end: 33.22 },
      { word: "is", start: 33.22, end: 33.4 },
      { word: "sampling.", start: 33.4, end: 33.88 },
    ],
  },
  {
    id: 9,
    startTime: 34.5,
    endTime: 38.46,
    text: "Each Council member starts its own conversation with the LLM.",
    words: [
      { word: "Each", start: 34.5, end: 34.74 },
      { word: "Council", start: 34.74, end: 35.16 },
      { word: "member", start: 35.16, end: 35.52 },
      { word: "starts", start: 35.52, end: 35.92 },
      { word: "its", start: 35.92, end: 36.24 },
      { word: "own", start: 36.24, end: 36.54 },
      { word: "conversation", start: 36.54, end: 37.12 },
      { word: "with", start: 37.12, end: 37.78 },
      { word: "the", start: 37.78, end: 38.0 },
      { word: "LLM.", start: 38.0, end: 38.46 },
    ],
  },
  {
    id: 10,
    startTime: 39.18,
    endTime: 42.34,
    text: "Now, each one will reason from a different perspective.",
    words: [
      { word: "Now,", start: 39.18, end: 39.44 },
      { word: "each", start: 39.8, end: 40.06 },
      { word: "one", start: 40.06, end: 40.38 },
      { word: "will", start: 40.38, end: 40.64 },
      { word: "reason", start: 40.64, end: 40.98 },
      { word: "from", start: 40.98, end: 41.22 },
      { word: "a", start: 41.22, end: 41.36 },
      { word: "different", start: 41.36, end: 41.62 },
      { word: "perspective.", start: 41.62, end: 42.34 },
    ],
  },
  {
    id: 11,
    startTime: 42.76,
    endTime: 46.82,
    text: "We have the pragmatist, the visionary, the system thinker, etc.",
    words: [
      { word: "We", start: 42.76, end: 42.96 },
      { word: "have", start: 42.96, end: 43.1 },
      { word: "the", start: 43.1, end: 43.24 },
      { word: "pragmatist,", start: 43.24, end: 44.0 },
      { word: "the", start: 44.2, end: 44.28 },
      { word: "visionary,", start: 44.28, end: 44.72 },
      { word: "the", start: 45.0, end: 45.06 },
      { word: "system", start: 45.06, end: 45.44 },
      { word: "thinker,", start: 45.44, end: 45.96 },
      { word: "etc.", start: 46.16, end: 46.82 },
    ],
  },
  {
    id: 12,
    startTime: 47.86,
    endTime: 51.38,
    text: "They compare perspectives, vote, and look for common ground.",
    words: [
      { word: "They", start: 47.86, end: 47.98 },
      { word: "compare", start: 47.98, end: 48.32 },
      { word: "perspectives,", start: 48.32, end: 49.02 },
      { word: "vote,", start: 49.52, end: 49.72 },
      { word: "and", start: 50.04, end: 50.1 },
      { word: "look", start: 50.1, end: 50.3 },
      { word: "for", start: 50.3, end: 50.56 },
      { word: "common", start: 50.74, end: 50.96 },
      { word: "ground.", start: 50.96, end: 51.38 },
    ],
  },
  {
    id: 13,
    startTime: 51.38,
    endTime: 57.16,
    text: "As you can see, the Council agrees the real skill gap isn't coding or orchestration.",
    words: [
      { word: "As", start: 51.38, end: 52.22 },
      { word: "you", start: 52.22, end: 52.4 },
      { word: "can", start: 52.4, end: 52.54 },
      { word: "see,", start: 52.54, end: 52.8 },
      { word: "the", start: 52.96, end: 53.02 },
      { word: "Council", start: 53.02, end: 53.36 },
      { word: "agrees", start: 53.36, end: 53.74 },
      { word: "the", start: 53.74, end: 54.38 },
      { word: "real", start: 54.38, end: 54.6 },
      { word: "skill", start: 54.6, end: 54.86 },
      { word: "gap", start: 54.86, end: 55.1 },
      { word: "isn't", start: 55.1, end: 55.68 },
      { word: "coding", start: 55.68, end: 55.98 },
      { word: "or", start: 55.98, end: 56.46 },
      { word: "orchestration.", start: 56.46, end: 57.16 },
    ],
  },
  {
    id: 14,
    startTime: 57.72,
    endTime: 59.36,
    text: "It's at the intersection of both.",
    words: [
      { word: "It's", start: 57.72, end: 57.94 },
      { word: "at", start: 57.94, end: 58.14 },
      { word: "the", start: 58.14, end: 58.3 },
      { word: "intersection", start: 58.3, end: 58.78 },
      { word: "of", start: 58.78, end: 59.14 },
      { word: "both.", start: 59.14, end: 59.36 },
    ],
  },
  {
    id: 15,
    startTime: 59.9,
    endTime: 63.76,
    text: "If you don't understand coding, you'll never truly know how to orchestrate.",
    words: [
      { word: "If", start: 59.9, end: 60.08 },
      { word: "you", start: 60.08, end: 60.2 },
      { word: "don't", start: 60.2, end: 60.34 },
      { word: "understand", start: 60.34, end: 60.74 },
      { word: "coding,", start: 60.74, end: 61.16 },
      { word: "you'll", start: 61.4, end: 61.54 },
      { word: "never", start: 61.54, end: 61.8 },
      { word: "truly", start: 61.8, end: 62.18 },
      { word: "know", start: 62.18, end: 62.54 },
      { word: "how", start: 62.54, end: 63.02 },
      { word: "to", start: 63.02, end: 63.28 },
      { word: "orchestrate.", start: 63.28, end: 63.76 },
    ],
  },
  {
    id: 16,
    startTime: 64.6,
    endTime: 69.4,
    text: "To get started, visit block.github.io/goose.",
    words: [
      { word: "To", start: 64.6, end: 64.88 },
      { word: "get", start: 64.88, end: 65.04 },
      { word: "started,", start: 65.04, end: 65.5 },
      { word: "visit", start: 65.82, end: 66.02 },
      { word: "block.github.io/goose.", start: 66.02, end: 69.4 },
    ],
  },
];

interface CaptionsProps {
  offsetFrames?: number;
  style?: "bottom" | "center";
  fontSize?: number;
  showBackground?: boolean;
  maxWordsPerLine?: number;

  /**
   * ✅ Option A: captions ONLY render when provided by the video config.
   * (No fallback to the default `captions` array.)
   */
  captionsData?: Caption[];
}

// Helper to chunk words into groups
const chunkWords = (words: Word[], maxWords: number): Word[][] => {
  const chunks: Word[][] = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords));
  }
  return chunks;
};

/**
 * ✅ Option A helper:
 * Only render captions when captionsData is provided and non-empty.
 */
const resolveCaptionsData = (captionsData?: Caption[]) => {
  if (!captionsData || captionsData.length === 0) return null;
  return captionsData;
};

export const Captions: React.FC<CaptionsProps> = ({
  offsetFrames = 0,
  style = "bottom",
  fontSize = 54,
  showBackground = true,
  maxWordsPerLine = 4,
  captionsData,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = resolveCaptionsData(captionsData);
  if (!data) return null;

  const currentTime = (frame - offsetFrames) / fps;

  // Find current caption
  const currentCaption = data.find(
    (caption) => currentTime >= caption.startTime && currentTime < caption.endTime
  );

  if (!currentCaption || frame < offsetFrames) {
    return null;
  }

  // Chunk words into lines of maxWordsPerLine
  const wordChunks = chunkWords(currentCaption.words, maxWordsPerLine);

  // Find which chunk is currently active based on time
  const currentChunkIndex = wordChunks.findIndex((chunk) => {
    const chunkStart = chunk[0].start;
    const chunkEnd = chunk[chunk.length - 1].end;
    return currentTime >= chunkStart && currentTime < chunkEnd;
  });

  const activeChunk =
    currentChunkIndex >= 0 ? wordChunks[currentChunkIndex] : wordChunks[0];

  if (!activeChunk) return null;

  const chunkStart = activeChunk[0].start;
  const chunkEnd = activeChunk[activeChunk.length - 1].end;
  const chunkDuration = chunkEnd - chunkStart;

  // For very short chunks, just show at full opacity
  const opacity =
    chunkDuration < 0.3
      ? 1
      : interpolate(
          currentTime,
          [chunkStart, chunkStart + 0.1, chunkEnd - 0.1, chunkEnd],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

  const scale = spring({
    frame: Math.floor((currentTime - chunkStart) * fps),
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const positionStyles: React.CSSProperties =
    style === "bottom"
      ? {
          position: "absolute",
          bottom: plugAndPlayBarHeight + 80,
          left: 40,
          right: 40,
        }
      : {
          position: "absolute",
          top: "50%",
          left: 40,
          right: 40,
          transform: "translateY(-50%)",
        };

  return (
    <div
      style={{
        ...positionStyles,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: showBackground ? "rgba(0, 0, 0, 0.75)" : "transparent",
          padding: showBackground ? "20px 36px" : "0",
          borderRadius: 16,
          opacity,
          transform: `scale(${scale})`,
          maxWidth: "95%",
        }}
      >
        <div
          style={{
            fontSize,
            fontWeight: 600,
            color: colors.white,
            textAlign: "center",
            lineHeight: 1.4,
            fontFamily:
              "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
            textShadow: showBackground ? "none" : "0 2px 10px rgba(0, 0, 0, 0.8)",
          }}
        >
          {activeChunk.map((w) => w.word).join(" ")}
        </div>
      </div>
    </div>
  );
};

// Karaoke-style captions with precise word-level highlighting
export const KaraokeCaptions: React.FC<CaptionsProps> = ({
  offsetFrames = 0,
  style = "bottom",
  fontSize = 54,
  showBackground = true,
  maxWordsPerLine = 4,
  captionsData,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = resolveCaptionsData(captionsData);
  if (!data) return null;

  const currentTime = (frame - offsetFrames) / fps;

  // Find current caption
  const currentCaption = data.find(
    (caption) => currentTime >= caption.startTime && currentTime < caption.endTime
  );

  if (!currentCaption || frame < offsetFrames) {
    return null;
  }

  // Chunk words into lines of maxWordsPerLine
  const wordChunks = chunkWords(currentCaption.words, maxWordsPerLine);

  // Find which chunk is currently active based on time
  const currentChunkIndex = wordChunks.findIndex((chunk) => {
    const chunkStart = chunk[0].start;
    const chunkEnd = chunk[chunk.length - 1].end;
    return currentTime >= chunkStart && currentTime < chunkEnd;
  });

  const activeChunk =
    currentChunkIndex >= 0 ? wordChunks[currentChunkIndex] : wordChunks[0];

  if (!activeChunk) return null;

  const chunkStart = activeChunk[0].start;
  const chunkEnd = activeChunk[activeChunk.length - 1].end;
  const chunkDuration = chunkEnd - chunkStart;

  // For very short chunks, just show at full opacity
  const opacity =
    chunkDuration < 0.3
      ? 1
      : interpolate(
          currentTime,
          [chunkStart, chunkStart + 0.1, chunkEnd - 0.1, chunkEnd],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

  const positionStyles: React.CSSProperties =
    style === "bottom"
      ? {
          position: "absolute",
          bottom: plugAndPlayBarHeight + 80,
          left: 40,
          right: 40,
        }
      : {
          position: "absolute",
          top: "50%",
          left: 40,
          right: 40,
          transform: "translateY(-50%)",
        };

  return (
    <div
      style={{
        ...positionStyles,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: showBackground ? "rgba(0, 0, 0, 0.75)" : "transparent",
          padding: showBackground ? "20px 36px" : "0",
          borderRadius: 16,
          opacity,
          maxWidth: "95%",
        }}
      >
        <div
          style={{
            fontSize,
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.4,
            fontFamily:
              "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {activeChunk.map((wordObj, index) => {
            const isHighlighted = currentTime >= wordObj.start;

            return (
              <span
                key={index}
                style={{
                  color: isHighlighted ? colors.teal : colors.white,
                  transition: "color 0.05s ease",
                  marginRight: "0.3em",
                }}
              >
                {wordObj.word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Captions;

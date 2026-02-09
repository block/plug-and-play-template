// src/Root.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Composition,
  staticFile,
  delayRender,
  continueRender,
} from "remotion";

import { parseMedia } from "@remotion/media-parser";

import { PlugAndPlayVideo, getSetupDuration } from "./template/PlugAndPlayVideo";
import { timing } from "./template/styles";
import type { VideoConfig } from "./template/config";

import { councilOfMineConfigV7 } from "./template/config";
import { currentConfigV7 } from "./videos/current";

const FPS = 30;

// Calculate the actual content duration based on config
const calculateContentDuration = (config: VideoConfig): number => {
  // Prompt duration calculation (mirrors PlugAndPlayVideo.tsx)
  const promptTextLength = config.promptText?.length ?? 0;
  const typingStart = 30;
  const framesPerChar = 1.5;
  const typingEnd = typingStart + Math.ceil(promptTextLength * framesPerChar);
  const workingFadeIn = 15;
  const workingHold = 90;
  const promptDuration = typingEnd + workingFadeIn + workingHold;

  // Setup duration (dynamic based on type)
  const setupDuration = getSetupDuration(config.setup);

  // Explainer duration (optional)
  const explainerLines = config.explainerLines ?? [];
  const hasExplainer = explainerLines.length > 0;
  const explainerDuration = hasExplainer ? timing.explainerDuration : 0;

  // Summary duration (optional)
  const summary = config.summary ?? { type: "none" as const };
  const hasSummary = summary.type !== "none";
  const summaryDuration = hasSummary ? timing.summaryDuration : 0;

  // Results duration (dynamic for recordings)
  let resultsDuration = timing.resultsDuration;
  if (config.results.type === "recording" && config.results.durationInSeconds) {
    resultsDuration = Math.ceil(config.results.durationInSeconds * FPS) + 30;
  }

  // Total content duration
  const totalFrames =
    timing.hookDuration +
    timing.plugAndPlayDuration +
    setupDuration +
    explainerDuration +
    timing.letsPlayDuration +
    promptDuration +
    resultsDuration +
    summaryDuration +
    timing.endDuration;

  return totalFrames;
};

const useAudioFrames = (audioSrc?: string) => {
  const [frames, setFrames] = useState<number | null>(null);

  useEffect(() => {
    if (!audioSrc) {
      setFrames(null);
      return;
    }

    const handle = delayRender("Loading audio duration");

    parseMedia({
      src: staticFile(audioSrc),
      fields: { durationInSeconds: true },
    })
      .then((data) => {
        const dur = data.durationInSeconds;

        // ✅ duration can be null → fall back safely
        if (dur == null) {
          setFrames(null);
          continueRender(handle);
          return;
        }

        const audioFrames = Math.ceil(dur * FPS);
        setFrames(audioFrames);
        continueRender(handle);
      })
      .catch(() => {
        // ✅ audio missing / parse failure → fallback
        setFrames(null);
        continueRender(handle);
      });
  }, [audioSrc]);

  return frames;
};

const DynamicComposition: React.FC<{
  id: string;
  config: VideoConfig;
}> = ({ id, config }) => {
  const audioFrames = useAudioFrames(config.audioSrc);

  const duration = useMemo(() => {
    // Calculate actual content duration from config
    const contentDuration = calculateContentDuration(config);
    
    // If we have audio, use the longer of content or audio duration
    if (audioFrames) {
      return Math.max(contentDuration, audioFrames);
    }
    
    // No audio: use calculated content duration
    return contentDuration;
  }, [config, audioFrames]);

  return (
    <Composition
      id={id}
      component={PlugAndPlayVideo as React.FC<any>}
      durationInFrames={duration}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ config }}
    />
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <DynamicComposition
        id="PlugAndPlay-Template"
        config={councilOfMineConfigV7}
      />

      <DynamicComposition
        id="PlugAndPlay-Current"
        config={currentConfigV7}
      />
    </>
  );
};

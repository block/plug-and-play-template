// src/template/PlugAndPlayVideo.tsx
import React from "react";
import { AbsoluteFill, Sequence, staticFile, Audio } from "remotion";

import { HookScene } from "./sequences/HookScene";
import { PlugAndPlayScene } from "./sequences/PlugAndPlayScene";
import { ExplainerScene, calculateExplainerDuration } from "./sequences/ExplainerScene";
import { LetsPlayScene } from "./sequences/LetsPlayScene";
import { PromptScene } from "./sequences/PromptScene";
import { EndScene } from "./sequences/EndScene";
// import { EndSceneV2 } from "./sequences/EndSceneV2";
import { KaraokeCaptions } from "./components/Captions";

import type { VideoConfig, SetupConfig } from "./config";
import { timing, colors } from "./styles";

import { SetupRouter } from "./sequences/SetupRouter";
import { ResultsRouter } from "./sequences/ResultsRouter";
import { SummaryRouter } from "./sequences/SummaryRouter";

// ------------------------------
// Dynamic Setup duration helpers
// ------------------------------
const SETUP_BASE = 25; // name typing starts ~ frame 25 in your setup scenes
const NAME_FRAMES_PER_CHAR = 2.5;
const COMMAND_FRAMES_PER_CHAR = 1.8;
const ENDPOINT_FRAMES_PER_CHAR = 1.8;

const BETWEEN_FIELDS_GAP = 15; // name -> command/endpoint gap
const AFTER_MAIN_FIELD_GAP = 20; // before env/headers section
const ROW_TIME = 80; // frames per env var / header row (matches your scenes)
const AFTER_LAST_ROW_PAD = 30; // buffer before "Extension Added!"
const TAIL_HOLD = 90; // breathing room after animations
const MIN_SETUP_DURATION = timing.setupDuration; // keep original feel as a floor

export const getSetupDuration = (setup: SetupConfig) => {
  const nameDone = SETUP_BASE + Math.ceil(setup.extensionName.length * NAME_FRAMES_PER_CHAR);

  switch (setup.type) {
    case "builtin": {
      // If your builtin scene is basically fixed, keep the default timing.
      return Math.max(MIN_SETUP_DURATION, 150);
    }

    case "stdio": {
      const commandStart = nameDone + BETWEEN_FIELDS_GAP;
      const commandDone = commandStart + Math.ceil(setup.extensionCommand.length * COMMAND_FRAMES_PER_CHAR);

      // Small pad for button settle + "Extension Added!"
      const total = commandDone + 30 + TAIL_HOLD;
      return Math.max(MIN_SETUP_DURATION, Math.ceil(total));
    }

    case "stdio_with_env": {
      const commandStart = nameDone + BETWEEN_FIELDS_GAP;
      const commandDone = commandStart + Math.ceil(setup.extensionCommand.length * COMMAND_FRAMES_PER_CHAR);

      const rows = (setup.envVars?.length ?? 0) * ROW_TIME;

      // Mirrors your scene’s extensionAddedDelay structure
      const extensionAddedDelay =
        (setup.envVars?.length ?? 0) > 0
          ? commandDone + AFTER_MAIN_FIELD_GAP + rows + AFTER_LAST_ROW_PAD
          : commandDone + AFTER_LAST_ROW_PAD;

      const total = extensionAddedDelay + TAIL_HOLD;
      return Math.max(MIN_SETUP_DURATION, Math.ceil(total));
    }

    case "http": {
      const endpointStart = nameDone + BETWEEN_FIELDS_GAP;
      const endpointDone = endpointStart + Math.ceil(setup.endpoint.length * ENDPOINT_FRAMES_PER_CHAR);

      const total = endpointDone + 30 + TAIL_HOLD;
      return Math.max(MIN_SETUP_DURATION, Math.ceil(total));
    }

    case "http_with_headers": {
      const endpointStart = nameDone + BETWEEN_FIELDS_GAP;
      const endpointDone = endpointStart + Math.ceil(setup.endpoint.length * ENDPOINT_FRAMES_PER_CHAR);

      const rows = (setup.requestHeaders?.length ?? 0) * ROW_TIME;

      const extensionAddedDelay =
        (setup.requestHeaders?.length ?? 0) > 0
          ? endpointDone + AFTER_MAIN_FIELD_GAP + rows + AFTER_LAST_ROW_PAD
          : endpointDone + AFTER_LAST_ROW_PAD;

      const total = extensionAddedDelay + TAIL_HOLD;
      return Math.max(MIN_SETUP_DURATION, Math.ceil(total));
    }

    default: {
      const _never: never = setup;
      return MIN_SETUP_DURATION;
    }
  }
};

interface PlugAndPlayVideoProps {
  config: VideoConfig;
}

export const PlugAndPlayVideo: React.FC<PlugAndPlayVideoProps> = ({ config }) => {
  // ------------------------------
  // Check for timing overrides (for audio sync)
  // ------------------------------
  const overrides = config.timingOverrides ?? {};

  // ------------------------------
  // Prompt duration (typing + working hold)
  // ------------------------------
  const promptTextLength = config.promptText?.length ?? 0;

  const typingStart = 30;
  const framesPerChar = 1.5;
  const typingEnd = typingStart + Math.ceil(promptTextLength * framesPerChar);

  const workingFadeIn = 15;

  // How long "goose is working…" stays on screen AFTER fade-in
  const workingHold = 90; // 3 seconds @ 30fps

  const defaultPromptDuration = typingEnd + workingFadeIn + workingHold;

  // ------------------------------
  // Dynamic Setup duration
  // ------------------------------
  const defaultSetupDuration = getSetupDuration(config.setup);

  // ------------------------------
  // Explainer optional (dynamic duration based on content)
  // ------------------------------
  const explainerLines = config.explainerLines ?? [];
  const hasExplainer = explainerLines.length > 0;
  const defaultExplainerDuration = hasExplainer ? calculateExplainerDuration(explainerLines) : 0;

  // ------------------------------
  // Summary optional
  // ------------------------------
  const summary = config.summary ?? { type: "none" as const };
  const hasSummary = summary.type !== "none";
  const defaultSummaryDuration = hasSummary ? timing.summaryDuration : 0;

  // ------------------------------
  // Dynamic Results duration (for recordings)
  // ------------------------------
  const getDefaultResultsDuration = () => {
    if (config.results.type === "recording" && config.results.durationInSeconds) {
      // Convert seconds to frames, add small buffer
      return Math.ceil(config.results.durationInSeconds * timing.fps) + 30;
    }
    // Default for bullets/visuals
    return timing.resultsDuration;
  };
  const defaultResultsDuration = getDefaultResultsDuration();

  // ------------------------------
  // Apply timing overrides (for audio sync)
  // ------------------------------
  const hookDuration = overrides.hookDuration ?? timing.hookDuration;
  const plugAndPlayDuration = overrides.plugAndPlayDuration ?? timing.plugAndPlayDuration;
  const setupDuration = overrides.setupDuration ?? defaultSetupDuration;
  const explainerDuration = overrides.explainerDuration ?? defaultExplainerDuration;
  const letsPlayDuration = overrides.letsPlayDuration ?? timing.letsPlayDuration;
  const promptDuration = overrides.promptDuration ?? defaultPromptDuration;
  const resultsDuration = overrides.resultsDuration ?? defaultResultsDuration;
  const summaryDuration = overrides.summaryDuration ?? defaultSummaryDuration;

  // ------------------------------
  // Start frames
  // ------------------------------
  const hookStart = 0;
  const plugAndPlayStart = hookStart + hookDuration;

  const setupStart = plugAndPlayStart + plugAndPlayDuration;

  // explainer should start after Setup finishes
  const explainerStart = setupStart + setupDuration;

  const letsPlayStart = explainerStart + explainerDuration;

  const promptStart = letsPlayStart + letsPlayDuration;

  const resultsStart = promptStart + promptDuration;

  const summaryStart = resultsStart + resultsDuration;

  const endStart = summaryStart + summaryDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      {/* 1) Hook */}
      <Sequence from={hookStart} durationInFrames={hookDuration}>
        <HookScene hookText={config.hookText} mcpServerName={config.mcpServerName} />
      </Sequence>

      {/* 2) Plug & Play */}
      <Sequence from={plugAndPlayStart} durationInFrames={plugAndPlayDuration}>
        <PlugAndPlayScene badgeLine={config.badgeLine} />
      </Sequence>

      {/* 3) Setup (dynamic duration) */}
      <Sequence from={setupStart} durationInFrames={setupDuration}>
        <SetupRouter setup={config.setup} />
      </Sequence>

      {/* 4) Explainer (optional) */}
      {hasExplainer && (
        <Sequence from={explainerStart} durationInFrames={explainerDuration}>
          <ExplainerScene explainerLines={explainerLines} />
        </Sequence>
      )}

      {/* 5) Let's Play */}
      <Sequence from={letsPlayStart} durationInFrames={letsPlayDuration}>
        <LetsPlayScene />
      </Sequence>

      {/* 6) Prompt (dynamic duration) */}
      <Sequence from={promptStart} durationInFrames={promptDuration}>
        <PromptScene promptText={config.promptText} />
      </Sequence>

      {/* 7) Results (dynamic duration for recordings) */}
      <Sequence from={resultsStart} durationInFrames={resultsDuration}>
        <ResultsRouter results={config.results} closingLines={config.closingLines} />
      </Sequence>

      {/* 8) Summary (optional) */}
      {hasSummary && (
        <Sequence from={summaryStart} durationInFrames={summaryDuration}>
          <SummaryRouter summary={summary} />
        </Sequence>
      )}

      {/* 9) End - extends to fill remaining time */}
      <Sequence from={endStart}>
        <EndScene docsUrl={config.docsUrl} tutorialTitle={config.tutorialTitle} />
        {/* <EndSceneV2 docsUrl={config.docsUrl} tutorialTitle={config.tutorialTitle} /> */}
      </Sequence>

      {/* Background music (always plays, lower volume) */}
      <Audio src={staticFile("backgroundMusic.mp3")} volume={0.7} loop />

      {/* Audio voiceover (optional) */}
      {config.audioSrc ? (
        <Audio src={staticFile(config.audioSrc)} volume={1} />
      ) : null}

      {/* Karaoke captions (optional) */}
      {config.captionsData ? (
        <KaraokeCaptions captionsData={config.captionsData} />
      ) : null}
      
    </AbsoluteFill>
  );
};

export default PlugAndPlayVideo;

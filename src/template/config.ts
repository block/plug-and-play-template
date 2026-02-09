// src/template/config.ts

import type { Caption } from "./components/Captions";
import { captions as templateCaptions } from "./components/Captions";

export type NameValuePair = { name: string; value: string };

export type SetupConfig =
  | {
      type: "builtin"; // Built-in extension (toggle)
      extensionName: string;
      extensionDescription: string;
    }
  | {
      type: "stdio"; // External extension (install command)
      extensionName: string;
      extensionCommand: string;
    }
  | {
      type: "stdio_with_env"; // External extension (install command + env vars)
      extensionName: string;
      extensionCommand: string;
      envVars: NameValuePair[];
    }
  | {
      type: "http"; // HTTP extension (endpoint only)
      extensionName: string;
      endpoint: string;
    }
  | {
      type: "http_with_headers"; // HTTP extension (endpoint + headers)
      extensionName: string;
      endpoint: string;
      requestHeaders: NameValuePair[];
    };

export type ResultConfig =
  | {
      type: "recording";
      recordingPath: string; // e.g. "videos/my-mcp/results.mp4"
      durationInSeconds?: number; // Goose gets this via ffprobe - determines how long Results scene plays
    }
  | {
      type: "bullets";
      bullets: string[];
    }
  | {
      type: "visuals";
      // Goose will create a custom scene based on this.
      description?: string;
      // goose can name the generated component and import it.
      componentName?: string;
    };

export type SummaryConfig =
  | { type: "none" }
  | { type: "bullets"; lines: string[]; title?: string }
  | { type: "visuals"; componentName?: string; description?: string };

// Optional timing overrides (in frames @ 30fps) to sync with audio
export interface TimingOverrides {
  hookDuration?: number;
  plugAndPlayDuration?: number;
  setupDuration?: number;
  explainerDuration?: number;
  letsPlayDuration?: number;
  promptDuration?: number;
  resultsDuration?: number;
  summaryDuration?: number;
  endDuration?: number;
}

export interface VideoConfig {
  hookText: string;

  mcpServerName: string;
  badgeLine: string;

  setup: SetupConfig;

  explainerLines?: string[];

  promptText: string;

  // results router
  results: ResultConfig;

  // Optional closing summary before EndScene
  closingLines?: string[];

  summary?: SummaryConfig;

  captionsData?: Caption[];

  audioSrc?: string;

  docsUrl: string;
  tutorialTitle: string;

  // Optional timing overrides to sync with audio cues
  timingOverrides?: TimingOverrides;
}

export const councilOfMineConfigV7: VideoConfig = {
  hookText: "Why trust one AI opinion...\nwhen you could get nine?",
  mcpServerName: "Council of Mine",
  badgeLine: "multi-perspective reasoning",

  setup: {
    type: "stdio",
    extensionName: "council of mine",
    extensionCommand: "npx -y @anthropic/council-of-mine",
  },

  explainerLines: [
    "MCP tools normally just return data",
    "With sampling, tools ask the LLM to reason",
  ],

  promptText:
    "Start a council debate on whether the real skill gap in AI is coding or orchestration",

  results: {
    type: "visuals",
    description:
      "Show a Council of Mine style animation: council members debate, vote, and converge on consensus.",
    componentName: "DemoScene",
  },

  summary: {
    type: "visuals",
    description:
      "As you can see, the council agrees, the real skill gap isn't coding or orchestration. It's at the intersection of both. If you don't understand coding, you'll never truly know how to orchestrate.",
    componentName: "SummaryScene",
  },

  closingLines: [],

  captionsData: templateCaptions,

  audioSrc: "voiceover-trimmed.wav",

  docsUrl: "block.github.io/goose",
  tutorialTitle: "Council of Mine Extension | goose",
};

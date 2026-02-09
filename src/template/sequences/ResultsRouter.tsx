// ResultsRouter.tsx
import React from "react";
import type { ResultConfig } from "../config";

import { GooseWorkingRecordingScene } from "./GooseWorkingRecordingScene";
import { ExplainerScene } from "./ExplainerScene";

// Import template visuals
import { DemoScene } from "./DemoScene";


// Registry of custom visuals
const VISUAL_SCENES: Record<string, React.FC> = {
  DemoScene,
};

export const ResultsRouter: React.FC<{
  results: ResultConfig;
  closingLines?: string[];
}> = ({ results }) => {
  switch (results.type) {
    case "recording":
      return (
        <GooseWorkingRecordingScene
          recordingSrc={results.recordingPath}
        />
      );

    case "bullets":
      return <ExplainerScene explainerLines={results.bullets} />;

    case "visuals": {
      const Comp = results.componentName
        ? VISUAL_SCENES[results.componentName]
        : null;

      if (!Comp) return null;

      return <Comp />;
    }

    default:
      return null;
  }
};

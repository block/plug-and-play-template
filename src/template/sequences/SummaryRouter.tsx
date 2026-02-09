import React from "react";

import type { SummaryConfig } from "../config";

// Reuse ExplainerScene for bullets summary
import { ExplainerScene } from "./ExplainerScene";

// Template visuals example
import { SummaryScene } from "./SummaryScene";

// User video visuals
import { GitMCPSummaryScene } from "../../videos/GitMCP/sequences/GitMCPSummaryScene";

// All summary visuals should accept these props
export type SummaryVisualProps = {
    description?: string; resultBullets?: string[]
};

const SUMMARY_VISUALS_REGISTRY: Record<string, React.FC<SummaryVisualProps>> = {
  SummaryScene,
  GitMCPSummaryScene,
};

export const SummaryRouter: React.FC<{ summary: SummaryConfig }> = ({ summary }) => {
  switch (summary.type) {
    case "none": {
      return null;
    }

    case "bullets": {
      return <ExplainerScene explainerLines={summary.lines} />;
    }

    case "visuals": {
      const name = summary.componentName;

      if (!name) {
        return (
          <div
            style={{
              padding: 40,
              color: "white",
              fontFamily: "Inter, system-ui, sans-serif",
              background: "rgba(255,0,0,0.2)",
              border: "2px solid rgba(255,0,0,0.6)",
              borderRadius: 16,
              margin: 40,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
              Missing summary.componentName
            </div>
            <div style={{ fontSize: 18, opacity: 0.9 }}>
              This video requested <b>summary.type: "visuals"</b> but no componentName was provided. Description:
            </div>
            <div style={{ marginTop: 12, fontSize: 16, opacity: 0.85 }}>
              {summary.description}
            </div>
          </div>
        );
      }

      const Visual = SUMMARY_VISUALS_REGISTRY[name];

      if (!Visual) {
        return (
          <div
            style={{
              padding: 40,
              color: "white",
              fontFamily: "Inter, system-ui, sans-serif",
              background: "rgba(255,107,53,0.15)",
              border: "2px solid rgba(255,107,53,0.5)",
              borderRadius: 16,
              margin: 40,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
              Unknown summary visuals component: {name}
            </div>
            <div style={{ fontSize: 18, opacity: 0.9 }}>
              Add it to <code>SUMMARY_VISUALS_REGISTRY</code> in SummaryRouter.tsx (and import it at the top). Description:
            </div>
            <div style={{ marginTop: 12, fontSize: 16, opacity: 0.85 }}>
              {summary.description}
            </div>
          </div>
        );
      }

      return <Visual />;
    }

    default: {
      const _never: never = summary;
      return null;
    }
  }
};

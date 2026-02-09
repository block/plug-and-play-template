// src/template/sequences/SetupRouter.tsx
import React from "react";

import type { SetupConfig } from "../config";

// Your existing setup scenes:
import { SetupScene } from "./SetupScene";
import { SetupSceneBuiltIn } from "./SetupSceneBuiltIn";
import { SetupSceneHTTP } from "./SetupSceneHTTP";
import { SetupSceneHTTPWithHeaders } from "./SetupSceneHTTPWithHeaders";
import { SetupSceneSTDIOWithEnv } from "./SetupSceneSTDIOWithEnv";

export const SetupRouter: React.FC<{ setup: SetupConfig }> = ({ setup }) => {
  switch (setup.type) {
    case "builtin":
      return <SetupSceneBuiltIn extensionName={setup.extensionName} extensionDescription={setup.extensionDescription} />;

    case "stdio":
      return (
        <SetupScene
          extensionName={setup.extensionName}
          extensionCommand={setup.extensionCommand}
        />
      );

    case "stdio_with_env":
      return (
        <SetupSceneSTDIOWithEnv
          extensionName={setup.extensionName}
          extensionCommand={setup.extensionCommand}
          envVars={setup.envVars}
        />
      );

    case "http":
      return <SetupSceneHTTP extensionName={setup.extensionName} endpoint={setup.endpoint} />;

    case "http_with_headers":
      return (
        <SetupSceneHTTPWithHeaders
        extensionName={setup.extensionName}
        endpoint={setup.endpoint}
        requestHeaders={setup.requestHeaders}
        />
      );

    default: {
      // Exhaustiveness check (TypeScript will error if a case is missing)
      const _never: never = setup;
      return null;
    }
  }
};

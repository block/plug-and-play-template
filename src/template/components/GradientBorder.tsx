import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, dimensions } from "../styles";

interface GradientBorderProps {
  children: React.ReactNode;
}

export const GradientBorder: React.FC<GradientBorderProps> = ({ children }) => {
  const frame = useCurrentFrame();

  // Animate gradient rotation
  const rotation = frame * 2;

  return (
    <div
      style={{
        position: "relative",
        width: dimensions.width,
        height: dimensions.height,
        overflow: "hidden",
      }}
    >
      {/* Animated gradient border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: dimensions.borderWidth,
          background: `linear-gradient(${rotation}deg, ${colors.gradientStart}, ${colors.gradientEnd}, ${colors.gradientStart})`,
          borderRadius: dimensions.borderRadius,
        }}
      >
        {/* Inner black background */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: colors.black,
            borderRadius: dimensions.borderRadius - dimensions.borderWidth / 2,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

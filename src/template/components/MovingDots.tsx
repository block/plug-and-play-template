import React from "react";
import { useCurrentFrame } from "remotion";
import { dimensions } from "../styles";

interface DotProps {
  x: number;
  y: number;
  opacity: number;
}

const Dot: React.FC<DotProps> = ({ x, y, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 4,
      height: 4,
      borderRadius: "50%",
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    }}
  />
);

export const VisibleMovingDots: React.FC = () => {
  const frame = useCurrentFrame();
  const dots: DotProps[] = [];

  // Create a grid of dots that move slowly
  const spacing = 35;
  const rows = Math.ceil(dimensions.height / spacing) + 2;
  const cols = Math.ceil(dimensions.width / spacing) + 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Offset movement based on position for wave effect
      const offsetX = Math.sin((frame * 0.02) + (row * 0.3)) * 8;
      const offsetY = Math.cos((frame * 0.015) + (col * 0.3)) * 8;

      const x = (col * spacing) + offsetX - spacing;
      const y = (row * spacing) + offsetY - spacing;

      // Vary opacity based on position and time - visible
      const baseOpacity = 0.12;
      const variation = Math.sin((frame * 0.03) + (row * 0.2) + (col * 0.2)) * 0.06;

      dots.push({
        x,
        y,
        opacity: baseOpacity + variation,
      });
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {dots.map((dot, i) => (
        <Dot key={i} {...dot} />
      ))}
    </div>
  );
};

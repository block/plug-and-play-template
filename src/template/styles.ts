// V7 Styles - YouTube Short Format
export const colors = {
  background: '#0d0d0d',
  black: '#000000',
  white: '#ffffff',
  teal: '#4ECDC4',
  tealDark: '#3BA99C',
  orange: '#FF6B35',
  gradientStart: '#4ECDC4',
  gradientEnd: '#FF6B35',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
};

export const dimensions = {
  width: 1080, // Vertical video width
  height: 1920, // Vertical video height
  borderWidth: 12,
  borderRadius: 40,
};

// Plug & Play bar at bottom
export const plugAndPlayBarHeight = 200;

// V7 Timing - Synced to 70 seconds / 2100 frames
export const timing = {
  fps: 30,
  
  // Scene durations in frames (30fps)
  hookDuration: 150,           // 0:00-0:05 (5 sec) - "Why trust one AI opinion..."
  plugAndPlayDuration: 90,     // 0:05-0:08 (3 sec) - "Let's plug and play..."
  setupDuration: 210,          // 0:08-0:15 (7 sec) - "First, let's provide goose..."
  explainerDuration: 219,      // 0:15-0:25 (10 sec) - "Normally MCP tools..." 
  letsPlayDuration: 72,        // 0:25-0:28 (3 sec) - "Now, let's play"
  promptDuration: 219,         // 0:28-0:35 (7 sec) - "Hey goose, start a council..."
  resultsDuration: 600,        // 0:35-0:55 (20 sec) - Council deliberating, voting
  summaryDuration: 300,        // 0:55-1:05 (10 sec) - "As you can see, the council agrees..."
  endDuration: 160,            // 1:05-1:10 (5 sec) - "To get started..."
};

// Total duration in frames (70 seconds = 2100 frames)
export const totalDurationFrames = 
  timing.hookDuration +
  timing.plugAndPlayDuration +
  timing.setupDuration +
  timing.explainerDuration +
  timing.letsPlayDuration +
  timing.promptDuration +
  timing.resultsDuration +
  timing.summaryDuration +
  timing.endDuration;

export const fonts = {
  primary: 'Inter, system-ui, sans-serif',
  mono: 'JetBrains Mono, monospace',
};

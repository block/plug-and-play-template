# Plug & Play Video Template

Create consistent, branded Plug & Play videos for MCP extension demos using Remotion + Goose.

---

## 🎬 What This Is

This repo is the official Plug & Play video template.

It gives you:

- 🔒 Locked branding (colors, fonts, layout, animation)
- 🧱 Reusable scene structure
- 🧠 Goose-powered video generation with audio syncing
- 🎙 Automatic captions via Whisper
- 🔁 Template vs Current preview toggle

You never edit the template.  
You only create configs.

---

## 🚀 Quick Start

### Prerequisites

1. **Goose** with Skills and Developer extensions enabled
2. **ffmpeg** (for audio processing):
   ```bash
   # macOS
   brew install ffmpeg
   
   # Linux
   sudo apt-get install ffmpeg
   ```
3. **Whisper** (for captions):
   ```bash
   pip3 install openai-whisper
   ```
4. Install Remotion skill in Goose:
   ```bash
   npx skills add remotion-dev/skills
   ```
5. Clone this repo:
   ```bash
   git clone https://github.com/block/plug-and-play-template
   cd plug-and-play-template
   npm install
   ```

---

## ▶ Run the Video Studio

```bash
npm start
```

This launches the Remotion desktop preview.

You will see two videos:

- **PlugAndPlay-Template** → example reference
- **PlugAndPlay-Current** → your active video

Goose automatically updates the Current video.

---

## 🤖 Create a Video with Goose

Open Goose and use the Plug & Play recipe.

Say something like:

> Create a Plug & Play video

Goose will collect:

- Extension slug (e.g., `councilOfMine`)
- MCP server name (e.g., `Council of Mine`)
- Badge line (e.g., `multi-perspective reasoning`)
- Hook text (2 lines)
- Setup type (built-in, STDIO, STDIO + env vars, HTTP, HTTP + headers)
- Explainer lines (optional)
- Prompt text
- Results type (bullets, screen recording, or custom visuals)
- Summary type (none, bullets, or custom visuals)
- Voiceover audio file (optional, can add later)

Then Goose generates your config, creates any custom visuals, and activates it as Current.

No manual editing required.

---

## 📁 Project Structure

```
plug-and-play-template/
├── src/
│   ├── template/           🔒 LOCKED — never edit
│   │   ├── components/     # Shared UI (MovingDots, GradientBorder, PlugAndPlayBar, Captions)
│   │   ├── sequences/      # Scene components + routers
│   │   ├── styles.ts       # Colors, dimensions, timing
│   │   └── config.ts       # TypeScript types + example config
│   │
│   ├── videos/             📝 Your generated videos
│   │   ├── current.ts      ← Active pointer
│   │   └── <your-video>/
│   │       ├── config.ts       # Video configuration
│   │       ├── captions.ts     # Auto-generated captions
│   │       └── sequences/      # Custom visual components
│   │
│   └── Root.tsx
│
├── public/
│   ├── template/           # Template assets
│   └── <your-video>/       # Your video assets (audio, recordings)
│
└── package.json
```

---

## 🎥 Video Scene Structure

Each Plug & Play video follows this sequence:

| Scene | Purpose |
|-------|---------|
| Hook | Attention-grabbing opener (2 lines) |
| Plug & Play | Brand transition with badge line |
| Setup | Extension installation (5 types supported) |
| Explainer | Optional teaching points (1-4 lines) |
| Let's Play | Transition to demo |
| Prompt | Typewriter effect showing the prompt |
| Results | Bullets, screen recording, or custom visuals |
| Summary | Optional wrap-up (bullets or custom visuals) |
| End | Call to action with docs URL |

---

## 🎙 Voiceover & Captions Workflow

### Adding Audio

1. Record your voiceover
2. Enhance it at [Adobe Podcast](https://podcast.adobe.com/enhance)
3. Provide the audio file to Goose

### What Goose Does Automatically

1. Runs Whisper to generate word-level timestamps
2. Trims trailing silence from audio
3. Auto-generates karaoke-style captions
4. Syncs video scenes to audio cues

### Audio Sync Cues

Goose looks for these phrases to align scenes:

- "Let's play" / "Now let's play" → LetsPlayScene
- Your prompt text → PromptScene
- "To get started" / "visit block.github.io/goose" → EndScene

### Collaborative Syncing

If auto-sync can't find all cues, Goose will:

1. Show you a timestamped transcript
2. Ask you to identify scene boundaries
3. Let you correct any misheard words
4. Iterate until timing is perfect

---

## 🛠 Commands

```bash
npm start              # Launch Remotion studio
npm install            # Install dependencies
npx remotion render    # Render video (or let Goose handle it)
```

---

## 🧠 Config Format

```ts
interface VideoConfig {
  hookText: string;
  mcpServerName: string;
  badgeLine: string;

  setup: SetupConfig;  // Union type: builtin | stdio | stdio_with_env | http | http_with_headers

  explainerLines?: string[];

  promptText: string;

  results: ResultConfig;  // Union type: bullets | recording | visuals

  summary?: SummaryConfig;  // Union type: none | bullets | visuals

  captionsData?: Caption[];
  audioSrc?: string;

  docsUrl: string;
  tutorialTitle: string;
}
```

### Setup Types

```ts
type SetupConfig =
  | { type: "builtin"; extensionName: string; extensionDescription: string }
  | { type: "stdio"; extensionName: string; extensionCommand: string }
  | { type: "stdio_with_env"; extensionName: string; extensionCommand: string; envVars: NameValuePair[] }
  | { type: "http"; extensionName: string; endpoint: string }
  | { type: "http_with_headers"; extensionName: string; endpoint: string; requestHeaders: NameValuePair[] };
```

### Results Types

```ts
type ResultConfig =
  | { type: "bullets"; bullets: string[] }
  | { type: "recording"; recordingPath: string; durationInSeconds?: number }
  | { type: "visuals"; description?: string; componentName?: string };
```

### Summary Types

```ts
type SummaryConfig =
  | { type: "none" }
  | { type: "bullets"; lines: string[]; title?: string }
  | { type: "visuals"; description?: string; componentName?: string };
```

You don't edit this manually — Goose writes it.

---

## 🎨 Custom Visuals

When Goose creates custom visuals for Results or Summary, they follow this structure:

- Wrapped in `<GradientBorder>` (animated teal/orange border)
- Include `<VisibleMovingDots />` background
- Include `<PlugAndPlayBar />` at bottom
- Use colors from `template/styles.ts`

Custom visuals are placed in:
```
src/videos/<your-video>/sequences/<ComponentName>.tsx
```

And registered in the appropriate router (`ResultsRouter.tsx` or `SummaryRouter.tsx`).

---

## 🔒 Template Rules

**Never modify:**
```
src/template/
```

**Only create/edit:**
```
src/videos/<your-video>/
public/<your-video>/
```

Template styling is locked to preserve brand consistency.

---
---

## 🤝 Contributing Reusable Sequences

Created a custom visual that could benefit the whole team?

1. Open a PR moving your sequence from `src/videos/<your-video>/sequences/` to `src/template/sequences/`
2. Update the relevant router (`ResultsRouter.tsx` or `SummaryRouter.tsx`) to include it as a template option

Template sequences should be generic and reusable across multiple videos.

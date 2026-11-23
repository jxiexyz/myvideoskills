# PuppetKit Character Lab Guide

The **Character Lab** is an interactive browser playground for inspecting the character rig, testing every body motion, previewing all 16 expressions, combining independent channels, and verifying rest-pose recovery.

## Opening the Character Lab
1. Run `npm run dev` (starts Vite on port `3000`).
2. Open:
   - `http://localhost:3000/` — Full Character Lab (includes live Three.js stage, Rig Debug overlay, 16-Expression Contact Sheet generator, and Character Switcher).
   - `http://localhost:3000/demo/character-lab/index.html` — Standalone vanilla JS Character Lab.
   - `http://localhost:3000/demo/heroine.html` & `http://localhost:3000/render/` — Preserved legacy demos and frame capture harness.

## Key Features
- **Character Switcher**: Switch live between `Main Character (Heroine)` (4 directional views) and `Minimal Starter (Demo Rig)` (front-only rig; non-front views gracefully disable).
- **4-Direction View Presets (`Front`, `Back`, `Top`, `Bottom`)**: Accessible from both the top studio toolbar and the inspector's **View Presets** card, with selectable crossfade **Blend** durations (`0ms` instant, `250ms`, `400ms`). Switching views mid-animation keeps every active channel at its exact normalized phase.
- **Independent Camera Framing**: Toggle between `Full Body` and `Face Zoom` / `Head Zoom` independently of the active character direction.
- **Synchronized 4-View Sheet (`4-View Sync`)**: Captures all 4 directional views side-by-side at the exact same animation phase. Includes 8 scenario presets (`Walk + Wave + Happy`, `Walk Cycle`, `Run Cycle`, `Jump Apex`, `Crouch Hold`, `Celebrating`, `Confused Shrug`, `Rest Pose`), an interactive `0%–99%` phase scrubber (`0%`/`25%`/`50%`/`75%` snap buttons), and honest `NATIVE` / `ADAPTED` / `LIMITED` badges. Click any tile to jump straight to that view live on stage.
- **16-Expression Sheet (`16-Expr Sheet`)**: Renders all 16 expressions directly from the active Three.js Front rig into a labeled 4×4 grid (automatically restoring your previous view direction afterward).
- **Active-View Rig Debug Overlay**: Displays real-time Three.js pivot markers, parent-child bone connectors, de-overlapped joint rotation labels in degrees, and the active view's part hierarchy tree (automatically updates whenever switching between `Front`, `Back`, `Top`, and `Bottom`).
- **Per-View Motion Support Indicators**: Motion buttons display subtle color indicators and tooltips when viewing `Back`, `Top`, or `Bottom` (sky dot = `adapted`, amber dot = `limited`).
- **Multi-Channel Testing & Transport Strip**: Combine `Base`, `Locomotion`, `Head`, `Gesture`, and `Expression` freely, with real-time `View` + channel readout, `Speed` slider (`0.25x`–`2.0x`), `Loop` toggle, `Blink` auto-toggle, `Talk` mouth overlay toggle, `Pause/Resume`, `Stop`, and `Reset Pose`.


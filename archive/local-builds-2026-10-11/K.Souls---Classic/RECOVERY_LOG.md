# Kinetic Souls: Lost Feature Recovery Log

*This document tracks features, mechanics, and code that were developed AFTER the Master Reconstruction Document was completed, which were lost and need to be rebuilt.*

## Pending Recoveries
*(Summaries from previous AI chats will be logged here before reconstruction)*

### 1. TS Strict Linter Cleanup & Editor Desyncs
- **Concept:** Fixing strict `"noUnusedLocals"` errors that caused `DrawUI.ts` to glow red, alongside Editor/TS Server desyncs.
- **Required Code Changes:** Removed orphaned imports (`CHAR_RADIUS`, `getTeamColor`) from `src/render/DrawUI.ts`.
- **Documentation:** Added Section 4 to `KNOWN_BUGS.md` explaining TS Linter strict rules, and updated `CHANGELOG.md` to v0.0.7.

### 2. Build Pipeline & Vite Stabilization
- **Concept:** Fixing the Vercel/Electron "blank screen" build errors and package manager dependency warnings.
- **Required Code Changes:** 
  - Pinned `vite` to `^7.0.0` in `package.json` to fix `@tailwindcss/vite` peer dependency errors.
  - Added `@vitejs/plugin-react` and `@types/node` to `package.json` dev dependencies.
  - Added `base: './'` to `vite.config.ts` for Electron `file://` protocol support, along with full JSDoc comments.
- **Documentation:** Logged Build System instructions in `GAME_MANUAL.md` (Section 10) and updated `CHANGELOG.md` to v0.0.8.

### 3. KineticSouls.tsx Monolith Restoration (Context Desync)
- **Concept:** Restoring missing UI sandbox features and custom physics modifiers that were lost due to a file rollback/overwrite.
- **Required Code Changes (`src/pages/KineticSouls.tsx`):**
  - **Hooks:** Restored `refColMode`, `refHpBar`, and `refDmgStyle` inside the main component and added them to the `refs` useMemo object.
  - **Physics Modes:** Re-injected logic into `processCollision()` to handle `refs.colMode.current` ("phantom" for zero collision, "bouncy" for 1.8 restitution, "heavy" for 0.2 restitution).
  - **HP Bar UI:** Re-injected rendering logic for `refs.hpBar.current` ("thick", "segmented", "hidden", or fallback to standard).
  - **Damage Text UI:** Re-injected rendering logic for `refs.dmgStyle.current` ("comic" tilted Impact font, "neon" glowing white/shadow, "hidden", or standard).
- **Documentation:** Logged "Context Desync" recovery steps as Section 5 in `KNOWN_BUGS.md`.

### 4. AI Brainstorming Transfer Pipeline
- **Concept:** Offloading creative brainstorming to external AI chats to prevent context dilution/monolith freezing in the main engineering chat.
- **Required Code Changes:** 
  - Created `GEMINI_TRANSFER_DOC.md` containing the sandbox philosophy, engine constraints, and strict output formatting rules.
  - Appended Rule #12 to `GEMINI_NOTES.md` (SOP) to establish the Brainstorming & Idea Transfer Loop.

---

## Session: Engine Stabilization & UI Sandbox Restoration
*Summary of chat session features and code blocks built:*

### 1. TS Linter & Workspace Cleanups
- **Code:** Removed orphaned imports (`CHAR_RADIUS`, `getTeamColor`) from `src/render/DrawUI.ts`.
- **Docs:** Logged strict TypeScript rule fixes in `KNOWN_BUGS.md` and updated `CHANGELOG.md` to v0.0.7.

### 2. Vite Build Pipeline & pnpm Stabilization
- **Code:** Pinned `vite` to `^7.0.0` and `@vitejs/plugin-react` to `^4.3.0` in `package.json` to fix Tailwind peer dependency issues.
- **Code:** Injected full JSDoc explanations into `vite.config.ts` for Electron's `file://` protocol (`base: './'`).
- **Docs:** Added Section 10 (Build System & Electron) to `GAME_MANUAL.md` and updated `CHANGELOG.md` to v0.0.8.

### 3. Ultimate Sandbox Restoration (`KineticSouls.tsx`)
- **Hooks:** Re-established `refColMode`, `refHpBar`, and `refDmgStyle` in the main loop to prevent crashing.
- **Physics Sandbox:** Added logic to `processCollision()` for `phantom` (no collision), `bouncy` (1.8 restitution), and `heavy` (0.2 restitution).
- **UI Styles:** Rebuilt rendering blocks for `segmented` / `thick` HP bars, and `comic` / `neon` floating damage text. Fixed duplicated `if/else` block.
- **Docs:** Logged "Context Desync" in `KNOWN_BUGS.md` as Section 5.

### 4. AI Brainstorming Transfer Pipeline
- **Code:** Created `GEMINI_TRANSFER_DOC.md` as an isolated prompting system for safe brainstorming outside the coding chat.
- **Docs:** Added Rule #12 to `GEMINI_NOTES.md` to ensure future ideas are strictly evaluated for 2D Canvas Physics limits.

---

## Session: Advanced UI Recovery & Editor Stabilization
*Detailed breakdown of features recovered from the VS Code freeze & context desync.*

### 1. Editor Desync & Strict Linter
- **Fix:** Resolved "Ghost Tab" issues where moved files (like `DrawUI.ts` to `src/render/`) threw TS errors.
- **Code:** Removed unused variables (`CHAR_RADIUS`, `getTeamColor`, `drawRawChar`, `MAX_HP`, `getCharSprite`) from `KineticSouls.tsx` and `DrawUI.ts` to satisfy strict compiler rules.

### 2. PNPM & Electron Build Fixes
- **Fix:** Resolved `ERR_PNPM_NO_GLOBAL_BIN_DIR` and `@tailwindcss/vite` peer dependency warnings by explicitly pinning Vite.
- **Dependencies:** Added `"vite": "^7.0.0"`, `"@vitejs/plugin-react": "^4.3.0"`, and `"@types/node": "^22.0.0"` to `package.json`.
- **Config:** Added JSDoc and `base: './'` to `vite.config.ts` to fix the Electron `file://` protocol blank screen.

### 3. Ultimate Sandbox Visuals (`KineticSouls.tsx` Context Desync)
- **Missing Hooks:** Restored `refColMode`, `refHpBar`, and `refDmgStyle` in the `useMemo` refs block.
- **Physics Sandbox:** Added `colMode` checks in `processCollision`: `"phantom"` (returns early), `"bouncy"` (1.8 restitution), and `"heavy"` (0.2 restitution).
- **HP Bars:** Rebuilt the `if (state2.hud)` render block for `"thick"` (with shield track), `"segmented"` (dynamically sizing for bosses), and `"hidden"`.
- **Float Text:** Rebuilt the `for (const t of dataRef.texts.current)` block to support `"comic"` (rotated, bold Impact) and `"neon"` (white text, colored shadowBlur).
- **Safe Application:** Broke these patches down into 5 bite-sized chunks to successfully bypass a VS Code Editor freeze.

---

## Session: Vite Stabilization, Monolith Context Desync, & AI Workflow
*Detailed summary of data lost and recovered during the pnpm / editor freeze session.*

### 1. Build Pipeline & Strict Linter Recovery
- **Vite & Electron Fix:** Restored `base: './'` in `vite.config.ts` with full JSDoc explanations to prevent Electron 404 "Blank Screen" errors.
- **PNPM Dependencies:** Permanently stabilized the environment by pinning `vite` to `^7.0.0` to fix Tailwind peer dependencies, and adding `@vitejs/plugin-react` and `@types/node` to `package.json`.
- **Strict Linter Fix:** Cleaned out orphaned imports (`MAX_HP`, `drawRawChar`, etc.) that were turning `KineticSouls.tsx` red after the `src/render/` folder restructuring.

### 2. Ultimate Sandbox Restoration (`KineticSouls.tsx`)
- **Missing State Hooks:** Re-injected `refColMode`, `refHpBar`, and `refDmgStyle` to fix live menu crashes.
- **Physics Sandbox:** Restored collision logic for `"phantom"` (phasing), `"bouncy"` (1.8x restitution), and `"heavy"` (0.2x restitution) modifiers.
- **UI Sandbox:** Restored the canvas rendering code for `"thick"` and `"segmented"` boss HP bars, alongside `"comic"` (tilted Impact font) and `"neon"` (glowing shadows) damage text.

### 3. AI Brainstorming Transfer System
- **Concept:** Created an isolated prompting system to allow external AI brainstorming without diluting the core engine's coding context window.
- **Transfer Doc:** Built `GEMINI_TRANSFER_DOC.md` containing the game's core philosophy ("The Ultimate Sandbox"), 2D Canvas engine constraints, and strict AI output formatting rules.
- **SOP Update:** Added Rule #12 to `GEMINI_NOTES.md` establishing the "Brainstorming & Idea Transfer Loop" to safely ingest external ideas.
---

### 5. New Sandbox Features (from `Untitled-1.zip`)
- **Kinetic Class: The Splinter-Bot**
  - **Concept:** A fragile glass-cannon that breaks into a swarm of 3 smaller, faster "Micro-Splinter" clones upon taking heavy damage.
  - **Logic:** On damage > threshold, destroy original and instantiate 3 clones at the same (x, y). Clones have 33% mass/radius and inherit velocity with a random scatter vector.
  - **Render:** Original is a hollow triangle; clones are smaller, filled triangles.

- **Environment Modifier: The Pinball Matrix**
  - **Concept:** Static, high-bounciness bumpers that inject kinetic energy into the arena.
  - **Logic:** Spawn static entities with `restitution > 1.0` (e.g., 1.8). When a Kinetic hits them, it shoots off faster than it hit.
  - **Render:** Minimalist, hollow circles that flash bright and increase stroke width on impact.

- **Broken Sabre Modifier: The Tesla Sabre (Br/Kn)**
  - **Concept:** A snapped weapon that acts as a mobile lightning rod, chaining damage.
  - **Logic:** Every 60 ticks, scan for entities within `Zap_R`. Apply a "jitter" velocity to disrupt AI. Effect can chain up to 3 jumps.
  - **Render:** Draw sharp, erratic `ctx.lineTo()` paths from the Sabre to affected Kinetics.

- **God Action: Chronos Shift**
  - **Concept:** A toggled "Matrix" slow-motion mode.
  - **Logic:** Introduce a global `timeScale` variable. On activation, ease `timeScale` to 0.15. Multiply all velocity applications by `timeScale`. Director's mouse inputs must ignore `timeScale`.
  - **Render:** Apply a subtle color-inversion or a semi-transparent blue overlay to the canvas.

---

## Session: Physics Engine & Collision Stabilization
- **Fix:** Restored mathematically accurate 2D impulse resolution scaling in `handleCollision` (using inverted mass totals) to fix characters losing bounciness/momentum.
- **Fix:** Removed accidental teammate velocity halving bug (`a.vx *= -0.5`) that severely broke AI momentum.
- **Fix:** Implemented strict `?.` null-checks for `.parts` access during collisions to prevent silent canvas black-screen crashes. Documented in v0.0.12.
- **Fix:** Extracted `updateBehaviors()` out of the entity iteration loop to restore AI tracking without exponential thrust exhaustion.
- **Fix:** Converted hardcoded per-frame friction into delta-time scaled exponential decay (`Math.pow(DRAG, timeAdj)`) so momentum is perfectly maintained on high refresh rate monitors.

---

## Session: Render Bleed & Camera Shake Stabilization
- **Fix:** Added missing `shakeFrames` decrement logic to prevent the canvas from permanently shaking after main menu kinetics collide.
- **Fix:** Restricted `drawWorld()` rendering strictly to `game`, `menu`, and `over` screens so background simulations don't bleed onto the Bestiary and Settings UI.
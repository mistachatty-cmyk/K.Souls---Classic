# Kinetic Souls: Session Recovery Summary

*This document tracks features, mechanics, and code that were developed, which may have been lost and need to be rebuilt.*

---

## Session Summary

### 1. TS Strict Linter Cleanup & Editor Desyncs
- **Concept:** Fixing strict `"noUnusedLocals"` errors that caused files like `DrawUI.ts` to glow red, and resolving editor desync issues after major folder restructuring.
- **Required Code Changes:** Removed orphaned imports (`CHAR_RADIUS`, `getTeamColor`) from `src/render/DrawUI.ts`.
- **Troubleshooting:** Identified that restarting the TS Server (`Ctrl+Shift+P`) is the primary fix for "ghost" errors after moving files.
- **Documentation:** Added Section 4 to `KNOWN_BUGS.md` explaining TS Linter strict rules and updated `CHANGELOG.md` to v0.0.7.

### 2. Build Pipeline & Vite Stabilization
- **Concept:** Fixing the Vercel/Electron "blank screen" build errors and resolving `pnpm` peer dependency warnings.
- **Required Code Changes:** 
  - Pinned `vite` to `^7.0.0` in `package.json` to fix `@tailwindcss/vite` peer dependency errors.
  - Added missing `vite`, `@vitejs/plugin-react`, and `@types/node` to `package.json` dev dependencies to satisfy pnpm's strict resolution.
  - Added `base: './'` to `vite.config.ts` for Electron `file://` protocol support, along with full JSDoc comments explaining the fix.
- **Documentation:** Logged Build System instructions in `GAME_MANUAL.md` (Section 10) and updated `CHANGELOG.md` to v0.0.8.

### 3. KineticSouls.tsx Monolith Restoration (Context Desync)
- **Concept:** Restoring missing UI sandbox features and custom physics modifiers that were lost due to a file rollback/overwrite during our session.
- **Required Code Changes (`src/pages/KineticSouls.tsx`):**
  - **Hooks:** Restored `refColMode`, `refHpBar`, and `refDmgStyle` inside the main component and added them to the `refs` useMemo object.
  - **Physics Modes:** Re-injected logic into `processCollision()` to handle `refs.colMode.current` ("phantom" for zero collision, "bouncy" for 1.8 restitution, "heavy" for 0.2 restitution).
  - **HP Bar UI:** Re-injected rendering logic for `refs.hpBar.current` ("thick", "segmented", "hidden", or fallback to standard).
  - **Damage Text UI:** Re-injected rendering logic for `refs.dmgStyle.current` ("comic" tilted Impact font, "neon" glowing white/shadow, "hidden", or standard).
  - **Cleanup:** Removed a duplicated code block for floating text styles that was accidentally pasted twice.
- **Documentation:** Logged "Context Desync" recovery steps as Section 5 in `KNOWN_BUGS.md`.

### 4. AI Brainstorming Transfer Pipeline
- **Concept:** Creating a system to offload creative brainstorming to external AI chats to prevent context dilution and freezing in the main engineering chat.
- **Required Code Changes:** 
  - Created `GEMINI_TRANSFER_DOC.md` containing the sandbox philosophy, engine constraints, and strict output formatting rules for the other AI.
  - Appended Rule #12 to `GEMINI_NOTES.md` (our SOP) to establish the official "Brainstorming & Idea Transfer Loop," ensuring any approved ideas are logged back into the master docs.

---

*End of session summary. This content can be appended to your master recovery document.*

---

## Session Log: UI Sandbox, Build Pipeline, and AI Workflow

### 1. TS Strict Linter & Editor Desync Cleanup
- **Concept:** Addressed strict `"noUnusedLocals"` compiler errors that caused valid files to glow red, and resolved editor "ghost tab" desync issues after our major folder restructuring.
- **Code Changes:** Removed orphaned imports (`CHAR_RADIUS`, `getTeamColor`) from `src/render/DrawUI.ts`.
- **Documentation:** Added Section 4 to `KNOWN_BUGS.md` explaining TS Linter strict rules and updated `CHANGELOG.md`.

### 2. Build Pipeline & Vite Stabilization
- **Concept:** Fixed the Vercel/Electron "blank screen" build errors and resolved strict `pnpm` peer dependency warnings.
- **Code Changes:** 
  - Modified `package.json` to explicitly pin `"vite": "^7.0.0"` (fixing `@tailwindcss/vite` peer dependency issues).
  - Added missing `devDependencies`: `@vitejs/plugin-react` and `@types/node` to satisfy pnpm's strict resolution.
  - Modified `vite.config.ts` to include `base: './'` ensuring relative asset pathing for Electron's `file://` protocol.
- **Documentation:** Logged Build System/Electron integration details as Section 10 in `GAME_MANUAL.md`.

### 3. KineticSouls.tsx Monolith Restoration (Context Desync Fix)
- **Concept:** Restored the Ultimate Sandbox UI features and custom physics modifiers that were wiped out due to a file rollback/overwrite.
- **Code Changes:**
  - **State Hooks:** Re-injected `refColMode`, `refHpBar`, and `refDmgStyle` into the main component and linked them to the `refs` useMemo object.
  - **Physics Modes:** Updated `processCollision()` to handle `refs.colMode.current`:
    - `"phantom"` (zero collision phasing).
    - `"bouncy"` (1.8 restitution multiplier).
    - `"heavy"` (0.2 restitution multiplier).
  - **HP Bar UI:** Injected rendering logic for `"thick"`, `"segmented"`, and `"hidden"` health bars.
  - **Damage Text UI:** Injected rendering logic for `"comic"` (tilted Impact font), `"neon"` (glowing white/shadow), and `"hidden"` floating damage text styles.
  - **Cleanup:** Removed a duplicated `if/else` block inside the floating damage text rendering loop.
- **Documentation:** Logged the "Context Desync/Missing Refs" error as Section 5 in `KNOWN_BUGS.md`.

### 4. AI Brainstorming Transfer Pipeline
- **Concept:** Created an isolated prompting system to allow external AI brainstorming without diluting the core engine's coding context window.
- **Code Changes:**
  - Created `GEMINI_TRANSFER_DOC.md` containing the game's core philosophy ("The Ultimate Sandbox"), 2D Canvas engine constraints, and strict AI output formatting rules.
  - Updated `GEMINI_NOTES.md` (SOP) to establish Rule #12: "Brainstorming & Idea Transfer Loop," ensuring any approved ideas are merged back into the master docs.
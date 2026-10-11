# Changelog

All notable changes to Kinetic Souls will be documented in this file.

## [v0.0.13] - Render Bleed & Camera Stabilization

### Fixed
- **Infinite Screen Shake**: Added a decay loop for `state.shakeFrames` in the main game loop to ensure the screen stops shaking after the initial impact frames expire.
- **Menu Canvas Bleed**: Wrapped `drawWorld()` and camera tracking logic in strict screen state checks so the background physics simulation no longer renders over the Bestiary or Settings pages.

## [v0.0.12] - Engine Physics & Collision Stabilization

### Fixed
- **Broken Momentum Transfer**: Repaired the impulse logic in the collision handler. Replaced the simplified/broken formula with proper 2D impulse resolution scaling against individual character masses (`1/a.mass + 1/b.mass`), restoring realistic sandbox bounce physics.
- **Teammate Friction Glitch**: Removed an accidental block of code that manually halved and reversed velocity (`a.vx *= -0.5`) whenever two teammates touched, which severely broke AI momentum and caused unnatural clumping.
- **Part Undefined Crashes (Silent Canvas Black-Screen)**: Added strict `?.` null-checks to the part-targeting arrays (`a.parts?.[Math.floor...]`) during collision damage evaluation to prevent the `requestAnimationFrame` loop from fatally crashing when entities spawned without fully generated part arrays.
- **AI Steering Overload**: Extracted `updateBehaviors()` outside the entity rendering loop, fixing an $O(N^2)$ bug that caused AI to instantly exhaust all thrust and sit idle.
- **Frame-Rate Dependent Friction**: Replaced hardcoded per-frame drag with delta-time scaled exponential decay (`Math.pow(DRAG, timeAdj)`), restoring continuous momentum across all monitor refresh rates (60Hz to 240Hz).

## [v0.0.11] - Kinetic Styles & Render Safety

### Added
- **Kinetic Styles System**: Fully integrated "Classic", "HD", and "Sabre" rendering logic into `DrawEntities.ts`. Classic uses nostalgic flat dots/outlines, HD adds radial gradients and glowing eyes, while Sabre maintains the modern weapon/visor rendering.

### Fixed
- **Black Screen Crash Protection**: Implemented strict safe-guards in `DrawEntities.ts` (`const parts = c.parts || [];`). Prevents `requestAnimationFrame` loop from totally crashing to a black screen if the renderer encounters an entity before its parts arrays are fully generated.

## [v0.0.10] - Engine Stabilization & Black Screen Fixes

### Fixed
- **Render Loop Black Screen (gameLoop Crash):** Fixed a fatal exception where `aPart.type` was being accessed before verifying if the character actually had generated `.parts`. This caused `requestAnimationFrame` to silently die, leaving the canvas black. Added safe fallback damage calculations.
- **React Syntax Crash (White Screen):** Fixed a fatal strict compiler error where an `else if` directly followed an `else` block in the render loop.
- **Sabre Physics Syntax Error:** Corrected an invalid double `else` statement in the `s.vy` sabre physics fallback.
- **Missing Fallback Gravity:** Adjusted the sabre logic and Kinetic gravity fallback to properly respect top-down friction mechanics rather than side-view gravity dragging them to the bottom wall.

---

## [v0.0.9] - Input Stabilization & Menu Bug Fixes

### Added
- **Menu Physics Wall Toggle**: Added a dedicated option in the "Menu & System" settings to toggle the classic invisible ceiling physics boundary for the Main Menu sandbox on or off.

### Fixed
- **Stale Coordinates Bug**: Handled a critical issue where touchpads and stylus interactions didn't update `mouseRef.current`, blocking menu interactions and making "Start Game" buttons unclickable.
- **React Crash Bug**: Put `resetCharIdCounter()` into a `try/catch` to avoid the application silently crashing on start if the spawner system isn't fully in sync.
- **Invisible Wall Spawning Bug**: Kinetics previously popped out of existence in the menu because their `Y` coordinates were constrained to `SCOREBOARD_H`. They now spawn offscreen and enter smoothly.
- **Sabres & Projectile Ceiling Bug**: Lifted the ceiling boundaries for entities in the main menu so they can freely traverse the whole screen.

## [v0.0.8] - Build Configuration Documentation

### Documented
- **Vite Config**: Added comprehensive JSDoc annotations to `vite.config.ts` explaining the necessity of `base: './'` for Electron's `file://` protocol and the React plugin integrations.
- **Package Dependencies**: Added missing `vite` and `@vitejs/plugin-react` dependencies to `package.json` to resolve strict pnpm module resolution errors.

---

## [v0.0.7] - Strict Linter & Documentation Synchronization

### Fixed
- **TypeScript Strict Linter Errors**: Removed orphaned imports (`CHAR_RADIUS`, `getTeamColor`) from `DrawUI.ts` that were triggering `"noUnusedLocals"` strict compiler errors.
- **Documentation Checkpoint**: Expanded `KNOWN_BUGS.md` to document strict TypeScript compilation rules and how to handle orphaned imports.

---

## [v0.0.6] - Engine & Build Stabilization

### Fixed
- **Electron Blank Screen**: Added `base: './'` to `vite.config.ts` so Vite generates relative asset paths, fixing the white screen when launching the compiled Electron app.
- **TypeScript Config Scope**: Added `vite.config.ts` to the `tsconfig.json` includes array to resolve isolated file errors.
- **Directory Structure**: Fully migrated engine files into their correct `src/core` and `src/render` domains to resolve import path resolution issues.

---

## [v0.0.5] - The Ultimate Sandbox Update

### Added
- **Screensaver Mode**: A toggleable mode that disables AI and combat, letting Kinetics bounce perfectly around the screen like a DVD logo.
- **Modular Collision Physics**: Added "Standard", "Phantoms" (classic phasing bug), "Super Bouncy", and "Lead Weights" toggleable physical interaction styles.
- **Modular HP Bar Styles**: Choose between "Standard", "Thick", "Segmented", and "Hidden" health bars.
- **Modular Floating Text Styles**: Customize floating damage, heal, and kill text with "Standard", "Comic Book", "Neon Glow", and "Hidden" styles.

### Fixed
- **State Desync Crash**: Fixed a fatal crash where missing `useRef` states for the new UI dropdowns caused the app to instantly fail.
- **Pause Menu Interactivity**: Repositioned the pause menu click logic to the correct event handler, restoring mouse interactivity.
- **Menu Drag Handle**: Fixed the `useEffect` event listeners so the Live Modifier sidebar can be seamlessly resized.

---

## [v0.0.4] - Target: Bug Fixes & Stabilization

### Fixed
- **Live LoK Modifier Menu**: Fixed JSX `onChange` handlers so that the in-game settings panel (Mode, Theme, Environment) updates the game state instantly.
- **Physics Engine**: Reverted broken modifications to the `processCollision()` and velocity calculations. Movement, hit detection, and spawn behaviors have been restored.
- **Splash Text Logic**: Replaced the hardcoded string with proper randomized array selection from `SPLASH_ARCHIVE`.
- **Tactical Map (Minimap)**: Restored screen-space click detection so players can navigate the camera via the bottom-right map.
- **Title Animation**: Restored the sine-wave pulsating effect on the Main Menu title.

---

## [v0.0.3] - Engine Foundations
### Added
- Implementation of the core `gameLoop` with delta-time.
- Entity rendering and object pooling optimizations.
- Base Bestiary UI and Main Menu structuring.

---

## [v0.0.2] - Visual System Mapping
### Added
- Extracted `VISUAL_GAME_REFERENCE.md` for UI components.
- Mapped theme colors to characters and environments.
- Established React canvas bridge for game rendering.

- All React source code belongs inside `artifacts/kinetic-souls/src/`.
- To run the dev server, always use the root `pnpm dev` or `npm run dev` command. Do not run `vite` from the root directory, as it will fail.

---

## 4. Strict TypeScript Linter (Red Files due to Unused Variables)

**Description:**
A file (like `DrawUI.ts`) is completely underlined in red, but the game still visually runs, or Vite throws a terminal error regarding unused imports.

**Cause:**
The project's `tsconfig.json` enforces strict linting with `"noUnusedLocals": true` and `"noUnusedParameters": true`. Any imported variable, interface, or declared parameter that is not explicitly used in the file will cause a hard compiler error.

**How to Fix:**
Remove the unused imports at the top of the file, or if it is an unused parameter required by a signature, prefix it with an underscore (e.g., `_myParam`) or use the `void myParam;` escape hatch to suppress the error.

# Modular Engine Systems

This document tracks features that have been decoupled from the monolithic `KineticSouls.tsx` architecture into independent, reusable modules. These systems are designed to be easily copy-pasted into other React/HTML5 Canvas games.

## 🎮 HapticSystem (`src/systems/HapticSystem.ts`)
**Description:** A safe, plug-and-play wrapper for the experimental HTML5 Gamepad `vibrationActuator` API.
**Features:**
- Iterates through connected gamepads to trigger "dual-rumble" effects.
- Contains safe fallbacks (try/catch blocks) so unsupported browsers/devices (like iOS Safari) do not crash the game loop.
- Prigigured presets: `lightHit()`, `mediumHit()`, `explosion()`, and `massiveExplosion()`.

---

## 💳 Animated Purchase System
**Description:** A decoupled visual ticking system for handling in-game currency transactions and inventory unlocks.
**Features:**
- Smoothly interpolates currency deduction over time using a non-blocking fast interval (`30ms`).
- Synchronizes the player's overall wallet deduction precisely with the target item's cost reduction.
- Dynamically updates item button UI mapping (`#00ff00` for affordable, `#ff4444` for too expensive).
- Fires visual rainbow particle celebrations across the viewport and intense haptic feedback (via `HapticSystem`) upon successful unlock completion.
- Locks out simultaneous purchases globally (`activePurchase` state guard) to prevent race conditions or negative balances.

---

## ♻️ ObjectPoolSystem (`src/systems/ObjectPoolSystem.ts`)
**Description:** A generic array memory management utility to eliminate JS Garbage Collection stutters in loop-heavy canvas games.
**Features:**
- Checks for objects with `active: false` or `dead: true` properties dynamically.
- Executes a `mutator` callback to surgically overwrite properties, avoiding full object reallocations.
- Implements hard limits (e.g., `MAX_PARTICLES`) to ensure array arrays never cause RAM memory leaks.

---

## 🚧 Future Extraction Roadmap
*(These systems are currently hardcoded inside `KineticSouls.tsx` but have been structured for easy future extraction)*

1. **SpatialPartitionGrid:** The logic handling `optGrid` maps entities to grid cells (`Math.floor(x / GRID_CELL_SIZE)`), turning `O(N^2)` physics collisions into `O(N)` checks. Easily portable to any 2D canvas game.
2. **ThemeRenderer:** The canvas routines dictating `wireframe_matrix`, `glassmorphism`, and `neon` UI drawing patterns.
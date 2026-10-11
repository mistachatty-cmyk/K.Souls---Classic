# Kinetic Souls - Known Bugs & Fixes

This document serves as a tracking list for common to advanced bugs encountered during development, along with their causes and solutions. It is designed to help us quickly identify and resolve recurring issues when they break in the future.

---

## 1. The "I love you Tan-Moka" Bug (Splash Text Hardcoded)

**Description:**
The game's main menu splash text fails to randomly generate a new phrase from the archive on startup. Instead, it statically displays the string `"I love you Tan-Moka"` every time the game is loaded.

**Cause:**
This occurs when the state initialization for `currentSplash` in `src/pages/KineticSouls.tsx` is accidentally overwritten (often during debugging or refactoring) with a hardcoded string, bypassing the logic meant to pull a random element from the `SPLASH_ARCHIVE` array.

**How to Fix:**
1. Open `src/pages/KineticSouls.tsx`.
2. Locate the `useState` initialization for `currentSplash`.
3. Replace the hardcoded string with the random array selector logic.

*Incorrect Code:*
```typescript
const [currentSplash] = useState("I love you Tan-Moka");
```

```typescript
const [currentSplash] = useState(SPLASH_ARCHIVE[Math.floor(Math.random() * SPLASH_ARCHIVE.length)]);
```

---

## 2. Vite HMR (Hot Module Replacement) Fails to Update Browser

**Description:**
The browser refuses to update the UI when saving changes to `KineticSouls.tsx`, even when the Vite server is running. This forces manual reloads or worse, caching issues.

**Cause:**
Vite relies on a structured workspace environment. If the `artifacts/kinetic-souls/` directory lacks its own `package.json` specifying `"type": "module"` and proper `"dev"` script, Vite's pre-bundling can silently fail to establish the WebSocket connection needed for HMR.

**How to Fix:**
Ensure `artifacts/kinetic-souls/package.json` exists with at least:
```json
{
  "name": "kinetic-souls",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

---

## 3. Vercel (Viscreal) Fails to Deploy the Testing Branch

**Description:**
When connecting the repository to Vercel, the build fails, or it deploys a blank directory instead of the live game.

**Cause:**
Vercel looks at the root of the repository for `package.json` to determine the build command. Since the actual Vite app is nested in `artifacts/kinetic-souls/`, Vercel doesn't know where to find the source code or the output `dist` folder.

**How to Fix:**
A `vercel.json` file must exist at the root of the repository to explicitly tell Vercel where the app lives and what commands to run:
```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "pnpm run build",
  "outputDirectory": "artifacts/kinetic-souls/dist"
}
```**How to Fix:**
Remove the unused imports at the top of the file, or if it is an unused parameter required by a signature, prefix it with an underscore (e.g., `_myParam`) or use the `void myParam;` escape hatch to suppress the error.

---

## 5. Teammate Friction Glitch & Momentum Loss

**Description:**
Characters of the same team bunch up and suddenly lose all momentum, acting as if they are stuck in mud when they touch each other. The sandbox loses its "bounciness."

**Cause:**
A leftover piece of collision logic manually halving velocity (`a.vx *= -0.5`) when `a.team === b.team`. In addition, using a broken restitution formula `(2 * dot * restitution) / totalMass` instead of proper 2D impulse resolution scaling against individual character masses (`1/a.mass + 1/b.mass`).

**How to Fix:**
Remove artificial friction blocks in the collision loop. Always use inverted mass totals for realistic sandbox bounce physics and momentum transfer.

---

## 6. High Refresh Rate Momentum Loss & Erratic AI

**Description:**
Characters fly in and suddenly stop. They lose all continuous momentum and sit idly in the arena. The issue is especially prominent on high-refresh-rate monitors (120Hz/144Hz+).

**Cause:**
1) Frame-rate dependent friction (`c.vx *= DRAG` applied per frame instead of being scaled to delta time). 2) `updateBehaviors()` was accidentally nested inside the main character loop, evaluating exponentially and exhausting AI steering instantly.

**How to Fix:**
Use exponential decay for friction based on time adjusted delta (`timeAdj`): `c.vx *= Math.pow(DRAG, timeAdj)`. Ensure `updateBehaviors()` is called only once per physics step, entirely outside the `for (const c of ...)` loop.

---

## 7. Menu Canvas Bleed & Infinite Shake

**Description:**
The screen shakes endlessly after the first hit, and Kinetics are visible floating over non-gameplay screens like the Bestiary and Settings menus.

**Cause:**
1) `state.shakeFrames` lacked a decrementing tick in the main loop. 2) `drawWorld()` was placed outside screen conditional blocks, causing it to blindly paint the physics sandbox over the top of all React or UI layers regardless of the current screen.

**How to Fix:**
Implement `if (state.shakeFrames > 0) state.shakeFrames--;` in the main `gameLoop`. Wrap `drawWorld()` and camera tracking in `if (screen === "game" || screen === "menu" || screen === "over")`.

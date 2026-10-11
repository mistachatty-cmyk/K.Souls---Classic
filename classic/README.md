# Kinetic Souls (Classic)

The main build. Canvas auto-battle arena (React 19 + Vite + TypeScript), single game file
`src/pages/KineticSouls.tsx`. Source = `K.Souls---Classic` branch `main` (Apr 2026),
the same game that is live at gsix.online/games/kinetic-souls-classic.
(A byte-for-byte copy of the live bundle is in `../archive/live-classic-2026-04/`.)

## Run
```
cd classic
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # clean
npm run build      # -> dist/
```
Deploy on Vercel: set the project **Root Directory = `classic`** (uses `classic/vercel.json`).
No Replit env vars (`PORT`, `BASE_PATH`) are needed any more.

## What this MVP pass changed (vs `main`)
- Standalone lean `package.json` (only react/react-dom/vite/ts); the old shadcn/electron/tailwind
  config is kept in `legacy-config/` (unused by the game).
- Page title / name: **Kinetic Souls (Classic)**.
- **LOK Game Modifiers menu fixed.** Drawn buttons and click areas used different geometry
  (x offset up to 40px, 3-row overlap of MODIFIER with ENVIRONMENT hid "Magnet"/"Necromancy").
  Draw and click now share one layout (`LOK_LAYOUT`/`lokButtonRect`). Focus Cam is now drawn.
  Choices now also update live game state, not just the menu refs.
- **Settings menu fixed.** Click rows used a 36px pitch while rows were drawn at 32px, so toggles
  below row 1 hit the wrong switch. Draw and click share `SETTINGS_TOGGLES`/`settingsButtonRect`.
  Removed 3 phantom toggles that did not exist in game state.
- Removed ignored scroll arguments (the menus never scrolled).
- Type errors 19 -> 0 (`WeaponStyle` "none", `ScreenState` "replay", unions, camera `snapNext`, etc.).
- Removed dead `"heavy"` modifier check (not a real modifier).

## Verified in a browser (Playwright, Chromium)
- Main menu renders the Classic look; LOK menu has no overlaps.
- Pick Titans / Magnet in the LOK menu -> Start -> HUD shows `[MOD: TITANS ...]`, Titan-size fighter.
- In-game Live Mods panel (M key): changing the Modifier dropdown mid-match updates the HUD immediately.
- Window resize keeps the canvas scaled; no console errors.

## Known issues / not done
- "Pieces fly everywhere when moved (PC + mobile)": **not reproduced** in headless tests
  (resize + mouse sweep). Need the exact steps/device.
- Hand of God: grabs a fighter (`draggingId`) but nothing moves it. Not implemented.
- Best-kill replay screen exists (`refBestReplay`, "replay" branch) but is never entered.
- Settings menu has no scrolling (26 toggles all fit).
- Sprint 01/05 features (Snarl Construct, Wilderness Grid, Gravity Well, Mitosis, Scrap-Mage,
  Slipstream, Caustic Core, Marionette) are not implemented — specs in `../docs/specs/`.
- Bundle is a single 5.3k-line file; split into modules after MVP.

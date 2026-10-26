# Kinetic Souls 2 (alpha)

Next-generation Kinetic Souls: **Classic look**, modular engine, and all content merged into one build.
Source lineage: local build v0.1.9.x (`archive/local-builds-2026-10-11/K.Souls---Classic/artifacts/kinetic-souls`).
Kinetic Souls (Classic) lives separately in `../classic/` and stays the stable, finished game.

## Run
```
cd ks2
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # 0 errors
npm run build      # -> dist/
```
Vercel: project `ksouls2`, **Root Directory = `ks2`** (uses `ks2/vercel.json`). No env vars required.

## Layout
`src/pages/KineticSouls.tsx` (React shell, game loop) · `src/render/` (DrawUI, DrawEntities, DrawWorld) ·
`src/systems/` (Input, Behaviors, Spawner, Particles) · `src/game/` (types, constants, utils) · `src/core/`.

## What the MVP pass changed
- Restored the missing dev dependencies (vite, @vitejs/plugin-react, typescript) so it builds again.
- Repaired 59 garbled UTF-8 strings in `src/render/DrawUI.ts` (e.g. `âš¡` -> `⚡`).
- LOK menu: scrollable content is clipped above a solid footer, so BACK no longer covers list items and
  hidden buttons can't be clicked.
- Merged 13 splash messages from older builds.
- Removed stray files; `manifest.json` no longer references missing icons (fixes the page-load 404).

## Verified in a browser (Chromium/Playwright)
Classic-look menu; LOK menu pick (Titans) -> match HUD shows `[MOD: TITANS ...]`; scrolling shows every environment
(Solar Flares, Magnetic, Void Storm) and AI Aggression; **LOK MODS** side panel changes the modifier live
(`[MOD: MAGNET ...]`); two fighters spawn and fight; no console errors.

## Not yet tested / known gaps
Host/Join Game (network UI), XXL mode, Mobile UI button on a real phone, replay, Boss Rush. See `../docs/ROADMAP.md`.

## Character models
Default style = **V2 / HD** (`hd`). Settings offer Block, Classic, V2 / HD, and V3 / Sabre; the selected
style applies to every fighter and is saved locally. When embedded on GSix, signed-in players also sync
the preference to their account through the parent page.

## Alpha availability
- Solo play is available without an account.
- Host / Join currently has no network transport. The menu explains that these options are unavailable
  and offers local play instead; invite codes are not generated or accepted.
- LoK Passport, currency, and title purchases are not connected to live services and are not presented
  as available game features.

# Local builds audit (from the Drive zip "Kinetic Souls -.zip", 553 MB, 2026-10-11)

The zip held three folders. ~1.2 GB of it was `node_modules`. A filtered 7 MB copy (no node_modules, .git, .env,
private files) is saved in `../archive/local-builds-2026-10-11/`.
`.env` files (they contain `PORT, BASE_PATH, DATABASE_URL, NODE_ENV` keys) and one personal text file were deliberately
**not** copied. Rotate the `DATABASE_URL` credential if it is real — an older `.env` is also committed on GitHub `main`/`master`.

## Versions found

| ID | Where | Lines | What it is |
|---|---|---|---|
| **L4** | `K.Souls---Classic/artifacts/kinetic-souls` (local git, 12 commits, last 2026-08-09; docs say v0.1.9.9) | 3,416 page + modules (`render/DrawUI.ts` 89 KB, `DrawEntities.ts`, `DrawWorld.ts`, `systems/Input.ts`, `Behaviors.ts`, `Spawner.ts`, `Particles.ts`, `game/types.ts`) | **Newest and richest Classic line.** Classic look + Host/Join Game, XXL Mode, LOK MODS + MOBILE UI buttons, categorised themes, more modifiers/environments, sabres, essences, rift portals, boss rush, replay |
| L5 | `.../kinetic-souls-backup`, `-src-backup-2026042x` (4 copies) | 2,400-2,467 | older snapshots of L4 (Apr 27) |
| L1 | `Kinetic Souls -/KineticSouls.tsx` (flat) | 5,718 | monolith **v0.8.5 "Director's Sandbox"**; no Classic menu, no Live Mods panel |
| L2/L3 | `Kinetic Souls -/src/pages`, `Kinetic-Souls/artifacts/...` | 4,212 | August single-file game (same family as GitHub `master`, the one on ksouls2) |
| G1 | GitHub `K.Souls---Classic` `main` (live on gsix.online) | 5,346 | April monolith, "1v1 AUTO BATTLE ARENA" Classic look. Basis of `classic/` MVP |
| G2 | GitHub `master` | 4,226 | = L2/L3 |
| builds | `KineticSouls_Build.zip`, `KineticSouls_Chaos_Build.zip` | bundles ~277 KB | compiled bundles (backed up under archive) |

## Feature check (keyword hits in code; docs claim more than code has)

| Feature (from FEATURE_DOCUMENTATION.md) | L4 modular | G1 live Classic | G2/L2/L3 | L1 flat |
|---|---|---|---|---|
| Classic menu look | yes | yes | no | no |
| Rift portals | yes (24) | yes (10) | few | few |
| Essences | yes (47) | yes (10) | yes | no |
| Sabres (broken-weapon system) | **yes (43)** | few (5) | no | no |
| XXL mode | **yes (88)** | no | no | no |
| Boss Rush | partial (3) | no | no | no |
| Director's-cut replay | yes | yes (never entered) | no | no |
| Focus cam | yes | yes | no | no |
| Host / Join (networking UI) | **yes** | no | no | no |
| Mobile UI button, LOK MODS button | **yes** | Live Mods panel (M) only | no | no |
| Weather, Combo counter, Weapon mastery, Kinetic fusion, Ambient soundtrack, Challenge tower, Voice commands, Modding workshop, Networked leaderboards | **documented but 0 code hits in every version** | | | |
| Sprint 01/05 specs (Snarl, Wilderness Grid, Gravity Well, Mitosis, Scrap-Mage, Slipstream, Caustic Core, Marionette) | not implemented anywhere | | | |

## L4 build/run status (tested in a browser)
- Typecheck: 0 errors. **But `package.json` lost its deps**: no `vite`, `@vitejs/plugin-react`, `typescript` (only puppeteer + react). `npm run build` fails until they are re-added. With them added it builds (414 KB bundle) and runs.
- Menu renders the Classic look with extra buttons (screenshot: `archive/screenshots/local-modular-v019-menu.png`).
- **Mojibake**: 26 strings in `src/render/DrawUI.ts` are double-encoded UTF-8 (e.g. `âš¡ THEME`, `â”€â”€`). Fix = re-decode (latin-1 -> utf-8).
- **LOK menu overflows the canvas**: theme list runs past the bottom, BACK button overlaps ENVIRONMENT, categories clipped (`...lok-menu-bugs.png`). Needs a scrolling/paged layout with shared draw/click geometry (the same bug class fixed in `classic/`).
- One 404 on page load (missing asset, likely favicon).
- Stray files: `Untitled-1.zip`, `Untitled-3.txt`, empty `pages/DrawUI.ts`, duplicated `K.Souls---Classic/K.Souls---Classic/...` copies, 5 backup zips (~1 MB each).

## Recommendation
Make **L4 the base** (it is Classic's real latest line with the features you remember), port in the fixes already proven on G1 (shared LOK/Settings layout, live state sync), restore deps, fix encoding, make the LOK menu scroll, then build the sprint features on top. Keep G1/`classic/` MVP as the safe fallback until L4 passes the same browser checks.

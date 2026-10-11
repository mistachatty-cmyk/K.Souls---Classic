# Kinetic Souls — build & feature audit (Oct 2026)

> **CORRECTION (later in session):** Classic's source *is* in git: `K.Souls---Classic` branch `main`
> (`src/pages/KineticSouls.tsx`, 5,346 lines / 210 KB, "1v1 AUTO BATTLE ARENA" menu). It is the same game family as the
> August single-file game (`master`, 142 KB), which is a **smaller, older-style fork missing most features**
> (no Classic menu, no rich Live Mods panel, no replay/focus cam, etc.). The "modular v0.0.8" folder inside the
> Vercel upload is an extra copy of project files, not the served game. **Decision (owner): Classic = main build,
> named "Kinetic Souls (Classic)". Work lives in `classic/` on this branch.** See `classic/README.md`.
> The Aug single-file game and its menu fixes (below) are kept for reference only.


Scope: GitHub repos `K.Souls---Classic`, `Kinetic-Souls`, Vercel deployments, gsix.online pages.
**Not yet audited:** the local folders `C:\Kinetic Souls -`, `C:\Kinetic-Souls`, `C:\K.Souls---Classic` (not reachable from the cloud session; push them to branches or upload zips).

## 1. What is actually live

| gsix.online page | Host (Vercel project) | Build | Lineage |
|---|---|---|---|
| `/games/kinetic-souls-classic` ("Kinetic Souls 1", preferred look) | `kinetic-souls-classic.vercel.app` | Apr 2026 deploy `dpl_ChZPXnaEqNTd4AbZSuDGU71jvbKi`, uploaded from a local folder (Vercel meta says `c2d974c`, but that commit has no game source) | **A – modular engine** (CHANGELOG v0.0.8: `src/core`, `src/render`, `DrawUI.ts`, Electron notes). Source exists only on Vercel. |
| `/games/kinetic-souls-2-alpha` | `ksouls2.vercel.app` | Aug 2026 deploy built from `K.Souls---Classic` master `b4a82c9` | **B – single-file** `KineticSouls.tsx` (~140 KB) |

- gsix-hub (Next.js, repo `Gsixhub`, prod `gsix.online`) only links/embeds those two hosts.
- Every newer deploy on both projects is ERROR; they came from branch `claude/lok-designskill1-creation` (design-skill docs, not game code).
- `kinetic-souls-api-server` is a stray unused project.
- Lineage A has no copy in git — if that Vercel deployment is deleted the source is lost. **Back it up first.**

## 2. Lineage B across repos

| Source | `KineticSouls.tsx` | Notes |
|---|---|---|
| `Kinetic-Souls` `main` = `KineticStable2` | 140,831 B (blob `20c0d51`) | no Vercel config |
| `K.Souls---Classic` master `b4a82c9` (live on ksouls2) | pre-Aug-9 fixes | has `vercel.json` |
| `K.Souls---Classic` master `7ac90b1` | 141,997 B | + mobile scaling, splash random, Realistic Physics toggle, LOK menu → live state, TS fixes. **Never deployed READY.** |
| this branch `claude/nice-galileo-9ho2qd` | master + fixes below | |

## 3. Feature matrix (lineage B only; A not yet inspected)

| Feature | Status in B | Notes |
|---|---|---|
| 9 LOK modifiers (none, sudden_death, titans, shrinking_arena, vampire_kiss, necromancy, magnet, repel, lok_bounty) | Implemented in game loop | Titans HUD tag confirmed in browser |
| 7 environments (ice, blackhole, lava, storm, bouncy, wrap, blackout) | Referenced in loop | Not individually play-tested |
| LOK menu (main-menu screen) | **Was broken, fixed here** | see §4 |
| In-game "Live Mods" panel (M key) | **Was missing modifier/env controls; added here** | God actions revive/mutate/infect still do nothing (§5) |
| Hand of God drag | **Broken (no-op)** | sets `draggingId`, nothing moves the unit |
| Realistic Physics toggle | Present (master only), default off | |
| "heavy" modifier mass | Removed in master (`mass = 1`) | `heavy` is not in `LokModifier` anyway |
| Mobile controls toggle | Present | |
| Sprint 01: Snarl Construct, Wilderness Grid, Gravity Well, Exponential Mitosis | **Missing** | spec: `1_Kinetic_Souls.md` |
| Sprint 05: Scrap-Mage, Slipstream Corridors, Caustic Core, Director's Marionette | **Missing** | spec: `KINETIC_SOULS_Sandbox_Expansion_Sprint_05.md` |

## 4. Bugs found

1. **LOK menu buttons overlapped (both repos).** The 25-item THEME list wraps into 4 columns (540 px wide) inside a 290 px column, so columns 3–4 drew on top of the MODIFIER column. One click hit both a theme and a modifier — picking Titans silently switched the theme to "Hacker". **Fixed:** one shared layout (`LOK_LAYOUT` / `lokButtonRect`) for draw and click; no overlaps.
2. **LOK menu hit boxes sat 12 px below the drawn buttons** (draw `startY=58`, click `startY=70`). **Fixed** by the same shared layout.
3. **Live Mods panel (in-game, M key) had no LOK modifier or environment selector** — only god actions/spawn. **Fixed:** modifier + environment rows added, updating both `refs` and `stateRef` live.
4. **Panel only opens with the M key** — unreachable on mobile. *Not fixed.*
5. **Canvas stretches to full window width in master** and clips the skin picker under it (old `main` kept a centred 900 px frame). *Not fixed — needs your call (§6).*
6. **Redundant `pointerdown` listener** added next to `click`, never removed (cleanup passes the wrong function). In testing a Settings toggle still flipped once, so impact unconfirmed. *Left as is.*
7. **Classic (lineage A) pieces flying everywhere when dragged on PC and mobile** — reported by owner; source not yet read. *Open.*

## 5. Known gaps
- God actions `revive`, `mutate`, `infect` have no implementation in the EXECUTE handler.
- `.env` is committed in `K.Souls---Classic` root — check for secrets and rotate.

## 6. Decisions needed
- Base build: Classic (A) look vs single-file (B). Decide after A's source is in git and matrixed.
- Canvas: fixed 900 px frame on desktop, scale down only on small screens (recommended)?

## 7. Next steps
1. Push the three C:\ folders (or upload zips); back up deployment `dpl_ChZP…` source to git.
2. Extend this matrix to lineage A and every local build.
3. Fix Hand of God / Classic fling, then port Sprint 01/05 features onto the chosen base.
4. Redeploy one Vercel project (`ksouls2`), retire the stray ones.

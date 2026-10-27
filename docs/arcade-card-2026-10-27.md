# GSix arcade cards — 2026-10-27

Owner: Codex. Status: ready for review. Goal: expose both existing Souls menu simulations without menus, input controls or account prompts in GSix arcade cards.

`classic/src/pages/KineticSouls.tsx` and `ks2/src/pages/KineticSouls.tsx` recognize `?embed=card`. They seed a small arena, reuse the same simulation/rendering paths, and present just the canvas. Ordinary game entry remains unchanged. `quality=balanced` caps rendering at 30 fps; Lok uses 60 fps. Hidden documents skip simulation/rendering work. Each view sends `gsix-card-ready` after its first rendered frame. GSix unloads the frame on exit and validates readiness origin/source.

Validation: both standalone packages pass TypeScript and production builds. Local Chromium renders one canvas and zero buttons for each, with no page errors; real frames were captured as hub static thumbnails. No gameplay logic, saved progression or source art was replaced.

Rollout: deploy the Classic project from `classic/` and KS2 from `ks2/`, then merge the Gsixhub quality/preview integration. Until the game endpoint is deployed, the hub's readiness gate retains its static thumbnail. Verify production hosts and a touch device after deployment.

# Merge log: everything into Kinetic Souls 2 (`ks2/`)

Base = local modular v0.1.9.x. Compared against Classic GitHub `main` (G1 = `classic/`), the August single-file game (B) and the
flat v0.8.5 build (L1). Method: diff of type unions (themes, modifiers, environments, cameras, weapons), splash archive, settings keys.

| Item | ks2 | Other builds | Decision |
|---|---|---|---|
| Themes | 43 | G1/B/L1 subsets | nothing to port |
| LOK modifiers | 12 | G1/B: 9; L1 also had a dead `"heavy"` | nothing to port (`heavy` was never real) |
| Environments | 18 | 7-8 elsewhere | nothing to port |
| Cameras / weapons / kinetic types | 5 / 5 / 32 | fewer | nothing to port |
| Splash messages | 41 | G1/B 30, L1 34 | **ported 13 missing lines** |
| Perf options (`optCache/Delta/Gravity/Grid/Pool/SmartSpawn`) | in state (types.ts) | G1/B expose as Settings toggles | already present, check Settings UI shows them |
| `realisticPhysics` toggle (B only) | n/a (ks2 has PHYSICS MODE cycle) | flag only, never implemented | skipped |
| LOK menu geometry bug (overlap / click offset) | not present (shared data), footer overlap fixed | present in G1/B | fixed in both builds |
| Replay screen | present | G1 has code but never entered | verify in ks2 |
| Classic look | default `classicMenu` = true | G1 | keep |

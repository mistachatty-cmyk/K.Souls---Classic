# Roadmap

## Now (both games)
- Kinetic Souls (Classic) `classic/`: stable fallback, finished game. Keep fixing bugs only.
- Kinetic Souls 2 `ks2/`: lead build. Finish verification of XXL, Host/Join, Mobile UI, replay, Boss Rush.

## Ecosystem (future update for BOTH games)
- **LokTokens**: earn tokens from matches (kills, wins, Director score) via the shared token economy.
  Integration guide: Lok-EcoSystsem `LokToken EcoSystem/APP_INTEGRATION_GUIDE.md` (first integration: 616 Survivor).
- **Passport / profile**: replace the stub "Connect LoK Passport" button with the real flow; show LoK Coins in HUD.
- **Platform plug-in**: SDK + manifest per `LOK_PLATFORMS.md` (`universe-sdk/`), card/binder sync, public lore on gsix.online.
- Keep game logic independent of the SDK (adapter module), so Classic and KS2 share one integration.

## Features documented but not built anywhere
Weather system, combo counter, weapon mastery tracks, kinetic fusion, ambient soundtrack, challenge tower mode,
voice commands, modding workshop, networked leaderboards (see `FEATURE_DOCUMENTATION.md` in the local snapshot).

## Sprint specs (docs/specs)
Sprint 01: Snarl Construct, Wilderness Grid, Gravity Well, Exponential Mitosis.
Sprint 05: Scrap-Mage, Slipstream Corridors, Caustic Core, Director's Marionette (also finishes Hand of God).
Suggested order: Mitosis, Slipstream, Marionette, Wilderness Grid, Gravity Well, Caustic Core, Snarl Construct, Scrap-Mage.

## Bugs
- Classic: "pieces fly everywhere when moved" (PC + mobile) — not reproduced, need steps/device.
- Classic: Hand of God no-op; replay screen never entered.
- Repo: committed `.env` in K.Souls---Classic main/master (rotate DATABASE_URL); junk root files; stray Vercel projects.

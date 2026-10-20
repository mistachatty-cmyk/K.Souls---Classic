# Kinetic Souls 2 roadmap

## MVP target

Ship a dependable solo alpha with guest play, a clear start/pause/end/rematch loop, accessible settings, V2 / HD as the fresh fighter default, and optional GSix account sync. KS2 keeps its own combat and progression; GSix supplies identity and community surfaces.

## Current release slice

- Fighter style options: Block, Classic, V2 / HD, and V3 / Sabre. Guest preference is stored locally; the GSix parent page owns account synchronization.
- Host/Join is marked unavailable because no online lobby transport is connected. Local modes remain playable.
- Passport, currency, and title purchasing are not connected to an account service and must not be presented as real purchases.
- Match records are submitted as client-reported casual alpha data. They are not authoritative rankings and cannot award currency or competitive rewards; account milestones are descriptive progress only.

## Work order

1. Release the settings/account bridge after the API schema is applied to the confirmed database and the GSix and game deployments point to the reviewed sources.
2. Complete solo-alpha UX and device checks: first-run tutorial, mode selection, input hints, pause, result, rematch, mobile touch, keyboard, portrait fallback, reduced motion, and screen-reader settings.
3. Validate the casual match-result contract, duplicate submission handling, public mode-filtered records, and account milestones derived from accepted records. Keep this separate from the reward economy until authoritative server-side gameplay validation exists.
4. Add replay/result review and finish Boss Rush; then take one tested feature slice at a time from `docs/specs/SPRINT_01.md` and `docs/specs/SPRINT_05.md`.
5. Consider seasonal challenges and multiplayer only after service contracts, abuse controls, and monitoring are ready.

## Later feature candidates

Suggested gameplay order after the solo-alpha release: Mitosis, Slipstream, Marionette, Wilderness Grid, Gravity Well, Caustic Core, Snarl Construct, and Scrap-Mage. Review each design against the current engine before implementation. Weather, weapon mastery, fusion, soundtrack, challenge tower, voice commands, and modding workshop remain ideas rather than shipped features.

## Release blockers

- Confirm and apply the Drizzle schema for account settings and match results to the intended database. The API repo currently uses `pnpm --filter @workspace/db run push`; do not point it at an unverified production database.
- Correct the Vercel project roots/source links before deployment. Verify API, GSix parent, and KS2 are released in that order.
- The repository previously tracked a root `.env`; it is now ignored and removed from the index on the working branch. Rotate any credential it contained with its provider and review repository history separately; do not publish secret values.
- Verify guest play and signed-in account sync in the embedded GSix route after preview deployment.

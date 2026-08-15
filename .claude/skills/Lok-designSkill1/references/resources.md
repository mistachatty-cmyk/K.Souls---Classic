# Resource Catalog

Organized by category. Each entry: link, what it is, and when to reach for it.
Add new entries under the right category, or start a new category (add it to
the list in SKILL.md too) if nothing fits.

## Lok ecosystem quick map

Confirmed by reading `package.json` in each repo (2026-08-15), not guessed:

- **LokBook** ([mistachatty-cmyk/LokBook](https://github.com/mistachatty-cmyk/LokBook)) — hand-drawn flipbook social app. Already depends on `gsap`, `perfect-freehand`, `@supabase/supabase-js`, `@tauri-apps/*`, `vite-plugin-pwa`, `qrcode`.
- **LokLingu** ([mistachatty-cmyk/LokLingu](https://github.com/mistachatty-cmyk/LokLingu)) — language-learning app with voice mode + character-drawing mode. Monorepo using Zod, Drizzle ORM, Radix UI, Framer Motion (via the `Motion` entry below), Tailwind.
- **Lok-EcoSystsem** ("LokServices") — shared backend/eco-system repo (Supabase-backed).

The entries below marked **(already in use)** are things these apps already
depend on — kept here so future sessions know the pattern exists before
reinventing it. Everything else is a candidate to pull in.

---

## Claude / agent efficiency

- **[claude-cookbooks](https://github.com/anthropics/claude-cookbooks)** —
  Anthropic's official worked examples: prompt caching, tool use, agents,
  retrieval, evaluation. Use when optimizing token/cost efficiency, building
  a new agentic feature, or checking the "recommended" pattern before hand-
  rolling one.
- **[claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)**
  / **[claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript)**
  — Official SDKs for building custom Claude-powered agents outside Claude
  Code itself. Use if a Lok app ever needs its own embedded agent (e.g. an
  in-app assistant) rather than calling the API by hand.
- For general "what's the current best way to do X with Claude/the API"
  questions (pricing, caching, streaming, tool schemas), prefer the built-in
  **`claude-api`** skill already installed in this environment over
  re-deriving it here — it's kept current independently of this catalog.

---

## 3D / Three.js

- **[threejs-skills](https://github.com/cloudai-x/threejs-skills)** —
  Collection of Three.js skills/techniques and reusable patterns. Use when
  scoping a Three.js scene, effect, or interaction and you want a working
  reference pattern instead of building from scratch.

---

## Animation (web & general JS)

- **[anime.js](https://github.com/juliangarnier/anime)** — Lightweight JS
  animation engine covering CSS properties, SVG, DOM attributes, and JS
  objects with a single consistent API. Use for general-purpose UI/element
  animation on the web that doesn't need a full timeline/motion-graphics
  engine.
- **[Motion](https://github.com/motiondivision/motion)** — Production-grade
  animation library for the web (successor/rebrand of Framer Motion),
  supports React and vanilla JS. Use for React UI animation, gestures, layout
  transitions, and spring physics.
- **[Motion Canvas](https://github.com/motion-canvas/motion-canvas)** —
  TypeScript-driven animation engine for precisely programmed, code-based
  animation videos (think: explainer/programmatic motion graphics, not live
  UI). Use when the deliverable is a rendered animation video, not runtime
  UI motion.
- **[GitHub Topic: animation](https://github.com/topics/animation)** — Broad
  index of animation-related repos across languages/frameworks. Use as a
  starting point to discover options when nothing else in this list fits the
  specific need.
- **[GSAP](https://github.com/greensock/GSAP)** *(already in use — LokBook)*
  — Industry-standard JS animation/timeline engine, framework-agnostic. Use
  for anything LokBook's existing GSAP timelines could extend (Battle/Rush
  sequencing, transitions), and as the default choice for complex, precisely
  sequenced non-React animation elsewhere.

## Animation (mobile / native)

- **[Lottie (Android)](https://github.com/airbnb/lottie-android)** — Renders
  Adobe After Effects animations (exported as JSON via Bodymovin) natively
  on Android. Use when a designer hands over an After Effects animation and
  it needs to run in a native Android app (there are sibling Lottie libs for
  iOS/web — check for those if the target platform differs).

## Scroll & page transition effects

- **[ScrollReveal](https://github.com/jlmakes/scrollreveal)** — Simple
  scroll-triggered reveal animations for web pages, no dependencies. Use for
  lightweight "fade/slide in as you scroll" effects without pulling in a
  full animation engine.
- **[barba.js](https://github.com/barbajs/barba)** — Smooth, app-like page
  transitions for traditional multi-page websites (no SPA framework
  required). Use when a static/multi-page site needs fluid transitions
  between full page loads.

---

## Hand-drawn / freehand canvas rendering

- **[perfect-freehand](https://github.com/steveruizok/perfect-freehand)**
  *(already in use — LokBook)* — Generates natural, pressure-sensitive
  freehand strokes from input points; this is what powers LokBook's Studio
  drawing and the `.lok` format's stroke data. Reference before touching
  `src/engine/` drawing code or `LOK_PERFECT_FREEHAND_SPEC.md`.
- **[rough.js](https://github.com/rough-stuff/rough)** — Renders shapes/
  fills in a hand-drawn, sketchy style on canvas or SVG. Use for sketchy UI
  chrome or bot-drawn art that should look intentionally imperfect (e.g.
  LokBook's Battle bots), as a lighter alternative to hand-authoring that
  look with perfect-freehand.
- **[Excalidraw](https://github.com/excalidraw/excalidraw)** — Full
  hand-drawn-style whiteboard app/engine, open source. Use as a reference
  implementation for infinite-canvas UX, shape tools, or collaborative
  drawing features beyond what perfect-freehand alone covers.
- **[tldraw](https://github.com/tldraw/tldraw)** — Infinite-canvas SDK
  (drag/resize/select/multiplayer primitives) for React. Use if a Lok app
  ever needs a full canvas editor shell rather than a single fixed drawing
  surface — heavier than react-konva, but comes with the editor UX built in.

---

## Handwriting & character-stroke practice

- **[hanzi-writer](https://github.com/chanind/hanzi-writer)** — Animates
  correct stroke order and scores user-drawn strokes for CJK characters.
  Directly relevant to LokLingu's Draw Mode ("dynamic stroke matching") —
  check this before building custom stroke-scoring logic, especially for
  any CJK-language lessons.

---

## Data schema & ORM

- **[Zod](https://github.com/colinhacks/zod)** *(already in use — LokLingu,
  `lib/api-zod`)* — TypeScript-first schema validation. Use for any new
  API payload or form-input validation in LokLingu or Lok-EcoSystsem so it
  stays consistent with the existing shared schemas.
- **[Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)** *(already
  in use — LokLingu, `lib/db`)* — Lightweight, type-safe SQL ORM. Use for
  any new Postgres table/query in LokLingu's backend rather than reaching
  for a different ORM or raw SQL.

---

## UI primitives

- **[Radix UI](https://github.com/radix-ui/primitives)** *(already in use —
  LokLingu)* — Unstyled, accessible React component primitives (dialogs,
  dropdowns, tooltips, etc.). Use for any new interactive component in
  LokLingu so accessibility and behavior stay consistent with existing UI.

---

## Desktop & installable-web packaging

- **[Tauri](https://github.com/tauri-apps/tauri)** *(already in use —
  LokBook, Steam build)* — Rust-backed desktop app shell, much lighter than
  Electron. Reference for anything touching LokBook's `tauri:dev` /
  `tauri:build` / Steam packaging path.
- **[vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa)**
  *(already in use — LokBook)* — Vite plugin for installable/offline PWA
  support (manifest, service worker). Reference for LokBook's "Add to home
  screen" flow or any new offline-capable Lok web app.

---

## Data visualization

- **[G2](https://github.com/antvis/G2)** — Grammar-of-graphics based
  charting engine from AntV. Use for expressive, composable statistical
  charts on the web, especially when you need chart types or grammar-based
  flexibility beyond typical "pick a chart type" libraries.

---

## Pixel art & sprite tooling

- **[Aseprite](https://github.com/aseprite/aseprite)** — Animated sprite
  and pixel-art editor with a scripting API and CLI (great for batch sprite
  sheet export/processing). Use for creating or editing pixel-art sprites,
  tile sets, or sprite-sheet animations, or for scripting art pipeline
  tasks (e.g. auto-exporting sheets from `.aseprite` source files).

---

## Canvas & React integration

- **[react-konva](https://github.com/konvajs/react-konva)** — React
  bindings for the Konva 2D canvas library. Use for building interactive
  canvas graphics (drag/drop, shapes, layered scenes) inside a React app
  without dropping to raw canvas APIs.

---

## Localization / word & language datasets

- **[all-words-in-all-languages](https://github.com/eymenefealtun/all-words-in-all-languages)**
  — Bulk word-list datasets across many languages. Use for seeding
  dictionaries, wordlists, or vocabulary data (e.g. word-guessing games,
  language tools) when you need raw word data rather than translations.
- **[language-database](https://github.com/wikitongues/language-database)**
  (Wikitongues) — Structured database of the world's languages. Use when you
  need metadata about languages themselves (names, codes, regions, status)
  rather than word lists.
- **[OpenLanguageInfo](https://github.com/WonderFlags/OpenLanguageInfo)** —
  Open dataset of language information. Use alongside/instead of
  wikitongues' database depending on which fields/coverage you need — check
  both if doing anything language-metadata related.

---

## Claude / AI-assisted design references

- **[awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design)**
  — Curated list of design resources, prompts, and workflows for building
  with Claude. Use when looking for Claude-specific design patterns, prompt
  approaches, or curated tool lists rather than general web resources.

---

## Adding new resources

When adding an entry, keep the same three-part shape: **link**, **one-line
description of what it is**, **one-line "use when" guidance**. Keep entries
short — this file is a lookup index, not documentation. If a resource spans
multiple categories, list it once under the primary one and cross-reference
from the other with a short note.

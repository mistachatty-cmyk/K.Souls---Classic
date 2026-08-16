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

## Canvas UI components — **default for new shader/fluid/canvas effects**

- **[Canvas UI](https://canvasui.dev)** *(default choice — check this
  first)* — Open source library of creative canvas components: real HTML
  rendered inside a `<canvas>` element with WebGL/shader effects (fluid
  sims, distortion, etc.) running over it, while the underlying content
  stays interactive. No screenshots/iframes/DOM-to-image hacks. Ships in
  React, Solid, Preact, Vue, Svelte, and vanilla TS — pick one, every
  component follows the same API. Distributed via a shadcn-style registry:
  installing drops the source file straight into the project (you own and
  can edit the code, nothing to version-lock). Docs:
  https://canvasui.dev/docs/installation — first component to try:
  Liquid (https://canvasui.dev/docs/components/liquid).
  - **Use for**: decorative/ambient visual effects layered over real UI —
    liquid/fluid backgrounds, shader-driven transitions, distortion effects
    on cards or hero sections. Good fit for LokBook's Shop/Feed chrome or
    LokLingu's celebratory/streak moments.
  - **Don't use for**: the actual drawing surface in LokBook's Studio —
    that's perfect-freehand's job (see above); Canvas UI is for effects
    *around* content, not freehand input capture.
  - **Caveat — browser support**: built on the `html-in-canvas` browser
    API, which is experimental. Locally it needs Chrome with the
    `chrome://flags/#canvas-draw-element` flag enabled; in production it
    needs the site registered for Chrome's origin trial (token served via
    meta tag or HTTP header, domain-bound — canvasui.dev's own token only
    works for canvasui.dev, a Lok domain would need its own). Components
    detect support at runtime and fall back to plain HTML automatically —
    safe to ship, but don't promise WebGL-effect parity across browsers/
    users without the trial token set up.
  - **Caveat — framework versions**: React components target **React 19**,
    Solid 1.9, Preact 10, Vue 3.5, Svelte 5. LokBook is currently on
    **React 18.3.1** — check for a version bump or React-19-specific
    breakage before installing a React Canvas UI component there; LokLingu
    isn't confirmed on React 19 either, so check its version too.
    TypeScript is recommended since components ship as typed source.
  - **Install (CLI, per framework)**:
    ```sh
    npx shadcn@latest init          # once per project, if not already using shadcn
    npx shadcn@latest add @canvas-ui/liquid-react   # or -solid, -preact, -vue, -svelte, -vanilla
    ```
    Lands in `components/canvasui/` (Svelte: `src/lib/components/canvasui/`
    so the `$lib` import resolves). Manual install: copy the framework-
    specific code block straight from the component's docs page.
  - **Usage** — wrap the UI the effect should run over, props are live:
    ```tsx
    import { Liquid } from "@/components/canvasui/Liquid";
    <Liquid rainbow style={{ height: 480 }}><YourContent /></Liquid>
    ```
  - **MCP server** (https://canvasui.dev/docs/mcp): the `@canvas-ui`
    namespace works with the general **shadcn MCP server**, not a
    Canvas-UI-specific one — one setup covers every shadcn registry a
    project uses, not just this one. Set up per-repo (it's a project-level
    `.mcp`/client config, not something this catalog entry can turn on by
    itself):
    ```sh
    npx shadcn@latest mcp init --client claude   # Claude Code
    ```
    Then restart Claude Code and use `/mcp` to confirm the server is up.
    (Also supports `--client cursor`, `vscode`, `opencode`; Codex is
    manual — add an `[mcp_servers.shadcn]` block to `~/.codex/config.toml`.)
    Optional: pin the registry explicitly in the project's
    `components.json`:
    ```json
    { "registries": { "@canvas-ui": "https://canvasui.dev/r/{name}.json" } }
    ```
    Once configured, prompts like "show me the components in the
    @canvas-ui registry" or "add liquid from @canvas-ui to my hero
    section" let Claude browse/install components directly instead of
    relying on this catalog entry staying current by hand. Worth doing in
    a Lok app repo (LokBook, LokLingu) once Canvas UI actually gets used
    there — no need to set this up in `K.Souls---Classic` or
    `lokDesignSkill`, since neither installs UI components this way.

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

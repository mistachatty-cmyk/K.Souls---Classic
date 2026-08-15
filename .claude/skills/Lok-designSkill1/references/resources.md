# Resource Catalog

Organized by category. Each entry: link, what it is, and when to reach for it.
Add new entries under the right category, or start a new category (add it to
the list in SKILL.md too) if nothing fits.

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

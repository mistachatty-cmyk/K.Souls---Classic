---
name: Lok-designSkill1
description: Curated catalog of external reference repos/libraries for design, animation, 3D, data-viz, pixel art, localization, and Claude/agent-building efficiency — a personal "know what tool exists for this" cheat sheet, including a stack map of the Lok apps (LokBook, LokLingu, Lok-EcoSystsem/LokServices) so recommendations match what they already depend on. Consult this whenever the user is starting a design, animation, UI motion, 3D/Three.js, data visualization, sprite/pixel-art, hand-drawn canvas, character/stroke-matching, scroll effect, in-game localization/word-list task, or asks "what's a good library/tool for X" in those areas or for Claude/Anthropic API efficiency — even if they don't name a tool directly. Also use it when the user wants to add a new reference resource to their list — this skill's reference file is meant to grow over time. Not tied to any single project; applies across sessions and repos.
---

# Lok-designSkill1 — Design & Animation Resource Catalog

A running list of external repos and libraries worth knowing about for design,
animation, 3D, data-viz, and content work. This is a **reference catalog**, not
a code library: it doesn't ship scripts or run anything. Its job is to help
you (Claude) point to the right existing tool instead of reinventing one, and
to help the user grow a personal toolbox over time.

## How to use this skill

1. When a task touches one of the categories below (animation, 3D, data-viz,
   pixel art, localization/word data, scroll effects, canvas rendering, or
   Claude-specific design references), open `references/resources.md` and
   scan the relevant category before suggesting an approach or a library from
   memory. The catalog may have a better or more current answer than your
   training data.
2. Pick the resource that matches the *actual* need — e.g. don't reach for a
   heavyweight animation engine when the user just wants a CSS scroll
   reveal, and don't suggest a mobile library (Lottie for Android) for a web
   task. Check the "use when" notes in the catalog, not just the name.
3. Tell the user which resource you're pulling from and why, with a link, so
   they can go straight to the source.
4. If the user gives you a new repo/library URL and wants it remembered for
   later, add it to `references/resources.md` under the right category (or a
   new one) following the existing format. Ask which category it belongs in
   if it's not obvious. This file is meant to keep growing — treat additions
   as a normal, expected part of using this skill, not a special favor.

## Defaults for new work

Some entries in the catalog aren't just "an option" — they're the starting
point unless there's a specific reason not to use them:

- **Canvas UI** (see the catalog entry) is the default for any new
  fluid/shader/WebGL-over-HTML visual effect across Lok apps — check it
  before hand-rolling a shader or fluid sim. It renders real interactive
  HTML underneath the effect and degrades gracefully where the underlying
  browser API isn't supported yet, so reaching for it doesn't risk breaking
  the app for users on unsupported browsers. It's for decorative/ambient
  effects layered over UI, not a replacement for LokBook's core
  perfect-freehand drawing engine.

## Categories in the catalog

- Lok ecosystem quick map (what LokBook/LokLingu/Lok-EcoSystsem already use)
- Claude / agent efficiency
- 3D / Three.js
- Animation (web & general JS)
- Animation (mobile / native)
- Hand-drawn / freehand canvas rendering
- Handwriting & character-stroke practice
- Data schema & ORM
- UI primitives
- Desktop & installable-web packaging
- Canvas UI components (default for shader/fluid/WebGL-over-HTML effects)
- Scroll & page transition effects
- Data visualization
- Pixel art & sprite tooling
- Canvas & React integration
- Localization / word & language datasets
- Claude / AI-assisted design references

See `references/resources.md` for the full list with descriptions and "use
when" guidance for each entry. Entries tagged **(already in use)** mean a Lok
app already depends on that library — check current usage before adding a
competing one.

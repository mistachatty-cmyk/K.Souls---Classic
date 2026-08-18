---
name: Lok-designSkill1
description: Curated catalog of external reference repos/libraries for design, animation, 3D, data-viz, pixel art, localization, and Claude/agent-building efficiency, PLUS an active Design Director workflow (benchmark analysis of reference images/styles, a Creator-Critic-Validator loop, and structured image-generation / motion-graphic-storyboard prompts) for turning design requests into professional, non-generic output. Consult this whenever the user is starting a design, animation, UI motion, 3D/Three.js, data visualization, sprite/pixel-art, hand-drawn canvas, character/stroke-matching, scroll effect, in-game localization/word-list task, wants something designed/critiqued/mocked-up, hands over a reference image/screenshot/brand style to match, asks for an image-generation prompt (Midjourney/DALL-E/Stable Diffusion) or a motion graphic storyboard — including open-ended requests like "help me generate images" or "I need some art for X" with no brief yet, where this skill offers ready fill-in templates instead of guessing — or asks "what's a good library/tool for X" in those areas or for Claude/Anthropic API efficiency — even if they don't name a tool directly. Also use it when the user wants to add a new reference resource to their list — this skill's reference file is meant to grow over time. Not tied to any single project; applies across sessions and repos.
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

## Design Director mode

The catalog above answers "what tool exists for this." This section is
about *how to think* when the task is actually producing a design — a
layout, a UI concept, an image-generation prompt, or a motion-graphic
storyboard — rather than picking a library. Apply it whenever a request is
asking you to create or critique something visual, not just look something
up. It doesn't require the user to say a magic phrase first; treat it as
how this skill designs by default.

The point of all three rules below is the same: generic output happens when
a model guesses at "good design" from vibes instead of grounding itself in
either a real reference or a real critique pass. Each rule closes one of
those gaps.

**1. Benchmark before you guess.** If the user hands you a reference image,
link, or named brand/style, don't eyeball it and move on — actually break
it down before producing anything: type (weights, tracking, scale
relationships), exact color values (not "blue," the hex), spacing/
whitespace rhythm, elevation/shadow use, and hierarchy (what draws the eye
first, second, third). Name these specifics back to the user as part of
your output, not just silently in your head — it's how they can tell you
actually looked rather than pattern-matched to "modern minimal app."
Without a reference, say so and pick a defensible direction instead of
inventing a fake benchmark.

**2. Critique your own first draft before showing it.** Don't ship the
first thing you generate. Run it through three passes internally:
  - *Creator* — produce the initial layout/concept/prompt.
  - *Critic* — read your own output the way a design lead would: is the
    letter-spacing doing something intentional or just default? Is there
    an actual hierarchy or is everything competing for attention? Is this
    specific to the brief, or would it look the same for any brand ("AI
    slop")? Name the concrete problems, not a vague "could be better."
  - *Validator* — fix what the critique surfaced, and only stop once the
    result would hold up if a real designer reviewed it, not just "looks
    fine at a glance."
  You don't need to narrate all three passes to the user — show the
  refined result, and mention the direction you rejected only when it's
  useful context (e.g. "went bolder on the headline than a typical AI
  layout would, since your reference uses hierarchy aggressively").

**3. Image-gen and motion prompts need the same specificity.** When asked
for an image-generation prompt (Midjourney/DALL-E/Stable Diffusion/local
models), don't hand back a vague mood description — write a prompt that
locks in style, lighting, composition, and any established "look" (a named
aesthetic/style recipe from earlier in the conversation) so repeated
prompts stay consistent with each other. For motion graphics, break the
result into a frame-by-frame or beat-by-beat storyboard with actual timing
(seconds), easing (ease-in/out, spring, linear — and why), and transition
types between beats — enough that someone could hand it to an animator
without follow-up questions.

If the request is open-ended — "help me generate images," "I need some art
for X," anything without a specific brief yet — don't wait for the user to
structure it themselves. Open `references/image-prompt-templates.md` and
offer the matching fill-in-the-blank template (general image, recurring
character/mascot, UI/product asset, or motion keyframe), filled in with
your best guess from context and confirmed with the user, rather than
either interrogating them for every field or generating from one vague
sentence. Add a new template there if a recurring shape of request doesn't
fit the existing four.

**When the deliverable is a real artboard, not just a description or
prompt** — a UI mockup, landing page, poster, invitation layout, or similar
— use the **`design`** skill (Claude Design canvas) to actually produce it
as an editable artboard, applying the benchmark/critique process above
before you generate it. For static poster/art-style output, `canvas-design`
is the equivalent for PNG/PDF art. This skill supplies the judgment; those
skills supply the output format.

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

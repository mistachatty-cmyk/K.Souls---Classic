# Image-Generation Prompt Templates

Fill-in-the-blank starting points for turning a vague "help me generate an
image" into a prompt that's actually specific enough to produce a
consistent, non-generic result. Offer the matching template (filled in with
your best guess from context, then confirmed with the user) rather than
either demanding a full spec up front or generating from a one-line mood
description.

When someone says "help me generate images" (or similarly open-ended —
"I need some art for X," "can you make me an image of Y") with little
detail, don't jump straight to writing a prompt. Ask 2-3 short questions —
what it's for, whether there's a reference/existing style recipe to match
(check if one's already been established earlier in the conversation), and
which platform (Midjourney, DALL-E, Stable Diffusion/local model) — then
return the filled-in template below as a draft, run through the Benchmark
and Critique rules in `SKILL.md` before showing it. If the user just wants
to move fast and skip the questions, make reasonable assumptions, state
them, and generate anyway.

---

## 1. General / one-off image

```
Subject: [what's actually in frame]
Style / aesthetic recipe: [named style, artist reference, or "match the
  established Lok style" — reuse a recipe name verbatim if one exists so
  future prompts stay consistent]
Composition & framing: [close-up / wide / centered / rule-of-thirds / etc.]
Lighting: [golden hour, studio softbox, neon rim light, ambient candlelight...]
Color palette: [named palette or hex values if locked to a brand]
Mood / atmosphere: [one or two words that aren't generic — "cozy" is weak,
  "warm and a little cluttered, lived-in" is specific]
Camera / lens (if photographic): [35mm, macro, wide-angle distortion, etc.]
Rendering / detail cues: [photorealistic / painterly / flat vector / etc.]
Aspect ratio: [1:1, 16:9, 9:16...]
Avoid: [anything the model tends to add unprompted that you don't want —
  extra limbs, text artifacts, a specific cliché composition]
```

Platform-specific tail:
- **Midjourney**: append `--ar {ratio} --style {raw/expressive} --v {version}`.
- **DALL-E**: write it as one flowing natural-language sentence/paragraph
  rather than a labeled list — DALL-E responds better to prose.
- **Stable Diffusion / local models**: split into a positive prompt (the
  template above, comma-separated) and a negative prompt (the "Avoid" line),
  and note sampler/steps/CFG only if the user's setup needs them specified.

---

## 2. Recurring character / mascot (style-recipe locked)

Use this whenever the same character needs to look consistent across many
generations — e.g. LokBook's Blot.

```
Character name & role: [who they are, what they do in the app]
Defining visual traits (must appear every time): [shape language, colors,
  signature feature — the 2-3 things that make it recognizably "them"]
Style recipe name: [give it a short reusable name, e.g. "Blot-ink-v1", so
  later prompts can just say "in the Blot-ink-v1 style" instead of
  re-describing everything]
Pose / action (this generation only): [what's different this time]
Background / setting: [where they are for this specific image]
Consistency notes: [what must stay pixel-identical vs. what's allowed to
  vary — e.g. "ink-blob shape and eye style are fixed, expression can change"]
```

After generating, confirm the locked traits actually held — that's the
Critic pass for character work specifically: compare against the last
accepted version of this character, not just "does this look nice."

---

## 3. UI / product / marketing asset

For app icons, store listing assets, hero images, social cards — anywhere
the image needs to fit a specific slot and read correctly at its real size.

```
Asset type & exact dimensions: [e.g. 1024x1024 app icon, 1200x630 social
  card — get the real target size, not a guess]
Brand palette: [hex values — pull from the Lok app's actual theme/constants
  file if this is for LokBook/LokLingu rather than guessing]
Typography style cues (if text appears in-image): [weight, general feel —
  actual text-in-image is often better added afterward in a real design
  tool than baked in by the generator, mention this tradeoff if relevant]
Background treatment: [transparent, solid brand color, gradient, scene...]
Where it's used / seen at what size: [app icon seen at 60px needs way
  simpler detail than a hero banner seen full-screen — this changes the brief]
```

---

## 4. Motion-graphic keyframe (single storyboard frame)

For generating a reference image of one beat in a storyboard built under
the Design Director motion-graphics rule in `SKILL.md`.

```
Scene / beat number: [where this sits in the sequence]
Subject and action: [what's happening at this exact moment]
Camera movement implied: [static / push-in / pan — even a still image can
  imply motion direction through framing]
Style consistency: [must match the style recipe used for other frames in
  this same storyboard — name it]
```

---

## Adding a template

If a recurring image-request shape doesn't fit the four above (e.g. a
LokLingu lesson-illustration template, a LokBook seed/pattern template),
add a new numbered section here following the same fill-in-the-blank
format. Keep each template to the fields that actually change the output —
don't pad it with fields that'll always get the same answer.

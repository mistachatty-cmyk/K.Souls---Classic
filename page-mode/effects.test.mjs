import test from "node:test";
import assert from "node:assert/strict";
import { pageEffects } from "./effects.mjs";

test("full page effects preserve the normal combat presentation", () => {
  assert.deepEqual(pageEffects("full", false), { particles: 1, shake: 1, animated: true });
});

test("low effects reduce decoration without changing combat values", () => {
  assert.deepEqual(pageEffects("low", false), { particles: 0.3, shake: 0.2, animated: true });
});

test("reduced motion disables shaking and ambient animation", () => {
  assert.deepEqual(pageEffects("full", true), { particles: 0.3, shake: 0, animated: false });
  assert.deepEqual(pageEffects("low", true), { particles: 0.3, shake: 0, animated: false });
});

test("unknown effect settings fall back to full effects", () => {
  assert.deepEqual(pageEffects("other", false), { particles: 1, shake: 1, animated: true });
});

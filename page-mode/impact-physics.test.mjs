import assert from "node:assert/strict";
import { test } from "node:test";
import { impactImpulse, normalizeImpactDirection } from "./impact-physics.mjs";

test("impact direction preserves incoming direction and normalizes magnitude", () => {
  assert.deepEqual(normalizeImpactDirection(8, 0), [1, 0]);
  const diagonal = normalizeImpactDirection(3, 4);
  assert.ok(Math.abs(diagonal[0] - 0.6) < 1e-9);
  assert.ok(Math.abs(diagonal[1] - 0.8) < 1e-9);
});

test("missing or invalid impact direction gets a safe upward fallback", () => {
  assert.deepEqual(normalizeImpactDirection(0, 0), [0, -1]);
  assert.deepEqual(normalizeImpactDirection(Number.NaN, 1), [0, -1]);
});

test("prop recoil scales with force but remains bounded", () => {
  assert.equal(impactImpulse(-1), 0);
  assert.equal(impactImpulse(5), 1.4000000000000001);
  assert.equal(impactImpulse(1000), 8);
  assert.equal(impactImpulse(Number.NaN), 0);
});

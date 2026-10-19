import assert from "node:assert/strict";
import { test } from "node:test";
import { fighterTargetRecoil, impactImpulse, normalizeImpactDirection, resolveTargetContact } from "./impact-physics.mjs";

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

test("fighter target recoil reflects only velocity into the surface", () => {
  assert.deepEqual(fighterTargetRecoil(10, 4, -1, 0, 0.9), { vx: -9, vy: 4 });
  const vertical = fighterTargetRecoil(10, 4, 0, -1, 0.9);
  assert.equal(vertical.vx, 10);
  assert.ok(Math.abs(vertical.vy + 3.6) < 1e-9);
  assert.deepEqual(fighterTargetRecoil(10, 4, -1, 0, 1.2), { vx: -12, vy: 4 });
});

test("fighter target recoil leaves outward/tangential motion and invalid normals safe", () => {
  assert.deepEqual(fighterTargetRecoil(10, 4, 1, 0, 0.9), { vx: 10, vy: 4 });
  assert.deepEqual(fighterTargetRecoil(0, 4, -1, 0, 0.9), { vx: 0, vy: 4 });
  assert.deepEqual(fighterTargetRecoil(10, 4, 0, 0, 0.9), { vx: 10, vy: 4 });
});

test("page target contact returns an outward normal and resolves an entering fighter", () => {
  assert.deepEqual(resolveTargetContact(91, 50, 100, 20, 80, 60, 10), {
    x: 100, y: 50, normalX: -1, normalY: 0, fighterX: 89.99, fighterY: 50,
  });
});

test("fighters embedded in a page target eject through the nearest edge", () => {
  assert.deepEqual(resolveTargetContact(140, 45, 100, 20, 80, 60, 10), {
    x: 140, y: 20, normalX: 0, normalY: -1, fighterX: 140, fighterY: 9.99,
  });
});

test("page target contact ignores distant or invalid boxes", () => {
  assert.equal(resolveTargetContact(20, 20, 100, 20, 80, 60, 10), null);
  assert.equal(resolveTargetContact(Number.NaN, 20, 100, 20, 80, 60, 10), null);
  assert.equal(resolveTargetContact(20, 20, 100, 20, -1, 60, 10), null);
});

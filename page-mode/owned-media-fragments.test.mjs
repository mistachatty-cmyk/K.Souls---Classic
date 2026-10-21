import test from "node:test";
import assert from "node:assert/strict";
import { createSegmentField, applyImpact } from "./segment-field.mjs";
import { mediaMaskAlpha, containedMediaPlacement } from "./owned-media-fragments.mjs";

test("owned media mask makes only removed cells transparent", () => {
  const field = createSegmentField(48, 48, "digital");
  applyImpact(field, { targetId: 1, x: 24, y: 24, directionX: 0, directionY: 1, damage: 2 });
  const mask = mediaMaskAlpha(field);
  assert.equal(mask.width, 3);
  assert.equal(mask.height, 3);
  assert.equal(mask.alpha[4], 0);
  assert.equal(mask.alpha[0], 255);
});

test("a fragment uses the source media's contained placement", () => {
  const placement = containedMediaPlacement(400, 200, 200, 200, 50, 75);
  assert.deepEqual(placement, { x: -50, y: -25, width: 200, height: 100 });
  assert.equal(containedMediaPlacement(0, 200, 200, 200, 0, 0), null);
});

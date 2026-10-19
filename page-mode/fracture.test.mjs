import assert from "node:assert/strict";
import { test } from "node:test";
import { createFracturePattern } from "./fracture.mjs";

test("fracture details are deterministic for replayable impacts", () => {
  const first = createFracturePattern(180, 100, 90, 50, 1, 0.2, 1, 1234);
  assert.deepEqual(first, createFracturePattern(180, 100, 90, 50, 1, 0.2, 1, 1234));
  assert.notDeepEqual(first, createFracturePattern(180, 100, 90, 50, 1, 0.2, 1, 9876));
});

test("fracture segments remain bounded to the target and have a capped count", () => {
  const segments = createFracturePattern(120, 60, -30, 90, -1, 0, 9, 42);
  assert.ok(segments.length > 0 && segments.length <= 32);
  for (const segment of segments) {
    for (const [x, y] of [[segment.x1, segment.y1], [segment.x2, segment.y2]]) {
      assert.ok(x >= 0 && x <= 120);
      assert.ok(y >= 0 && y <= 60);
    }
  }
});

test("invalid dimensions or non-finite impact data safely produce no geometry", () => {
  assert.deepEqual(createFracturePattern(0, 20, 5, 5, 1, 0, 1, 1), []);
  assert.deepEqual(createFracturePattern(20, 20, Number.NaN, 5, 1, 0, 1, 1), []);
});

import test from "node:test";
import assert from "node:assert/strict";
import { creatorStageBottom, creatorFloorTop } from "./creator-stage.mjs";

test("a prop stages against the visible lane instead of a long document floor", () => {
  const bottom = creatorStageBottom(200, 132, 710, 4000);
  assert.equal(bottom, 686);
  assert.equal(creatorFloorTop(bottom, 132, 4000), 554);
});

test("drag placement gets a new document-space floor and does not track later scrolling", () => {
  const original = creatorStageBottom(200, 132, 710, 4000);
  const moved = creatorStageBottom(2350, 132, 2710, 4000);
  assert.equal(moved, 2686);
  assert.equal(creatorFloorTop(original, 132, 4000), 554);
  assert.equal(creatorFloorTop(moved, 132, 4000), 2554);
});

test("short pages and malformed saved floors remain bounded", () => {
  assert.equal(creatorStageBottom(200, 132, 710, 710), 686);
  assert.equal(creatorStageBottom(600, 132, 710, 710), 702);
  assert.equal(creatorFloorTop(Infinity, 132, 710), 570);
});

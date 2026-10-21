import test from "node:test";
import assert from "node:assert/strict";
import { applyImpact, createSegmentField } from "./segment-field.mjs";
import { captureDestructionState, snapshotOpeningRects } from "./destruction-replay.mjs";

test("paused replay retains the opening and chunk positions from each sample", () => {
  const field = createSegmentField(64, 64, "digital");
  const target = { id: 7, x: 100, y: 200, width: 64, height: 64, field, destroyed: false };
  const early = captureDestructionState([target], [], []);
  const hit = applyImpact(field, { targetId: 7, x: 24, y: 24, directionX: 1, directionY: 0, damage: 2 });
  const chunk = { x: 130, y: 230, width: 16, height: 16, angle: 0.2, material: "digital", color: "#fff", sourceTargetId: 7, mediaX: 16, mediaY: 16 };
  const late = captureDestructionState([target], [], [chunk]);
  chunk.x = 300;
  applyImpact(field, { targetId: 7, x: 40, y: 40, directionX: 1, directionY: 0, damage: 3 });
  assert.equal(early.fields.length, 0);
  assert.equal(late.chunks[0].x, 130);
  assert.equal(late.chunks[0].sourceTargetId, 7);
  assert.equal(late.chunks[0].mediaX, 16);
  assert.deepEqual(snapshotOpeningRects(late.fields[0]).map(rect => [rect.x, rect.y]), hit.openings.map(rect => [100 + rect.x, 200 + rect.y]));
});

test("replay damage storage is bounded and copied", () => {
  const areas = Array.from({ length: 300 }, (_, i) => ({ targetId: i + 1, x: i, y: 0, width: 16, height: 16 }));
  const chunks = Array.from({ length: 80 }, (_, i) => ({ x: i, y: 0, width: 16, height: 16, angle: 0, material: "stone", color: "#aaa" }));
  const state = captureDestructionState([], areas, chunks);
  assert.equal(state.areas.length, 256);
  assert.equal(state.chunks.length, 48);
  areas[299].x = -1; chunks[79].x = -1;
  assert.equal(state.areas.at(-1).x, 299);
  assert.equal(state.chunks.at(-1).x, 79);
});

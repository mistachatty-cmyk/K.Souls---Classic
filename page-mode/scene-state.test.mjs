import test from "node:test";
import assert from "node:assert/strict";
import { createSegmentField, applyImpact, isSegmentSolid } from "./segment-field.mjs";
import { captureSceneField, restoreSceneField, savedVideoTime } from "./scene-state.mjs";

test("local scene copies damaged cells and unfinished stress without holding the original Map", () => {
  const field = createSegmentField(64, 48, "glass");
  applyImpact(field, { targetId: 1, x: 24, y: 24, directionX: 1, directionY: 0, damage: 2 });
  const snapshot = captureSceneField(field);
  const restored = restoreSceneField(snapshot, 64, 48, "glass");
  assert.equal(snapshot.version, 1);
  assert.equal(restored.removedCount, field.removedCount);
  assert.equal(isSegmentSolid(restored, 24, 24), false);
  assert.deepEqual([...restored.cells], [...field.cells]);
  field.cells.clear();
  assert.notEqual(restored.cells.size, 0);
});

test("old or oversized saved fields cannot allocate arbitrary geometry", () => {
  assert.equal(restoreSceneField(undefined, 64, 48, "glass"), null);
  assert.equal(restoreSceneField({ version: 9, cells: [] }, 64, 48, "glass"), null);
  const field = createSegmentField(64, 48, "glass");
  const snapshot = captureSceneField(field);
  assert.equal(restoreSceneField({ ...snapshot, cells: Array.from({ length: 193 }, (_, key) => [key, 0, true]) }, 64, 48, "glass"), null);
  assert.equal(restoreSceneField({ ...snapshot, cells: [[999, 0, true]] }, 64, 48, "glass"), null);
  assert.equal(restoreSceneField(snapshot, 70, 48, "glass"), null);
});

test("saved video time accepts finite nonnegative positions only", () => {
  assert.equal(savedVideoTime(3.125, 8), 3.125);
  assert.equal(savedVideoTime(20, 8), 8);
  assert.equal(savedVideoTime(-1, 8), 0);
  assert.equal(savedVideoTime(Infinity, 8), 0);
});

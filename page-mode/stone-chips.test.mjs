import test from "node:test";
import assert from "node:assert/strict";
import { createStoneChipPolygons } from "./stone-chips.mjs";

test("stone chips are a deterministic, compact, bounded burst", () => {
  const first = createStoneChipPolygons(180, 100, 88, 52, 5, 913);
  assert.deepEqual(first, createStoneChipPolygons(180, 100, 88, 52, 5, 913));
  assert.ok(first.length >= 4 && first.length <= 6);
  for (const polygon of first) {
    assert.ok(polygon.length >= 4 && polygon.length <= 6);
    for (const point of polygon) {
      assert.ok(point.x >= 0 && point.x <= 180);
      assert.ok(point.y >= 0 && point.y <= 100);
      assert.ok(Math.hypot(point.x - 88, point.y - 52) <= 36);
    }
    const area = Math.abs(polygon.reduce((sum, point, index) => {
      const next = polygon[(index + 1) % polygon.length];
      return sum + point.x * next.y - next.x * point.y;
    }, 0) / 2);
    assert.ok(area > 1);
  }
});

test("stone chip geometry clamps edge impacts and rejects invalid targets", () => {
  assert.deepEqual(createStoneChipPolygons(0, 10, 0, 0), []);
  assert.deepEqual(createStoneChipPolygons(10, Number.NaN, 0, 0), []);
  const chips = createStoneChipPolygons(30, 18, -50, 90, 20, 0);
  assert.ok(chips.length >= 3 && chips.length <= 6);
  assert.ok(chips.flat().every(point => point.x >= 0 && point.x <= 30 && point.y >= 0 && point.y <= 18));
});

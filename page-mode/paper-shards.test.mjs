import test from "node:test";
import assert from "node:assert/strict";
import { createPaperTearPolygons } from "./paper-shards.mjs";

const signedArea = polygon => polygon.reduce((sum, point, index) => {
  const next = polygon[(index + 1) % polygon.length];
  return sum + point.x * next.y - next.x * point.y;
}, 0) / 2;

test("paper tears form two bounded, deterministic strips with a shared seam", () => {
  const first = createPaperTearPolygons(240, 96, 118, 48, 1234);
  const second = createPaperTearPolygons(240, 96, 118, 48, 1234);

  assert.deepEqual(first, second);
  assert.equal(first.length, 2);
  for (const polygon of first) {
    assert.ok(polygon.length >= 8);
    for (const point of polygon) {
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y));
      assert.ok(point.x >= 0 && point.x <= 240);
      assert.ok(point.y >= 0 && point.y <= 96);
    }
    assert.ok(Math.abs(signedArea(polygon)) > 1);
  }

  const totalArea = first.reduce((sum, polygon) => sum + Math.abs(signedArea(polygon)), 0);
  assert.ok(Math.abs(totalArea - 240 * 96) < 0.01);
  assert.deepEqual(first[0].slice(2).reverse(), first[1].slice(0, -2));
});

test("paper tear geometry rejects invalid targets and clamps impact", () => {
  assert.deepEqual(createPaperTearPolygons(0, 30, 1, 1, 0), []);
  assert.deepEqual(createPaperTearPolygons(Number.NaN, 30, 1, 1, 0), []);
  assert.deepEqual(createPaperTearPolygons(30, Number.POSITIVE_INFINITY, 1, 1, 0), []);
  const polygons = createPaperTearPolygons(50, 20, -400, 400, 0);
  assert.equal(polygons.length, 2);
  assert.ok(polygons.flat().every(point => point.x >= 0 && point.x <= 50 && point.y >= 0 && point.y <= 20));
});

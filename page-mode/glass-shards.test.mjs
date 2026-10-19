import assert from "node:assert/strict";
import { test } from "node:test";
import { createGlassShardPolygons } from "./glass-shards.mjs";

test("glass shards form a deterministic triangle fan inside the target", () => {
  const shards = createGlassShardPolygons(240, 140, 90, 54, 12, 0xabc123);
  assert.equal(shards.length, 12);
  assert.deepEqual(shards, createGlassShardPolygons(240, 140, 90, 54, 12, 0xabc123));
  let coveredArea = 0;
  for (const shard of shards) {
    assert.equal(shard.length, 3);
    for (const point of shard) {
      assert.ok(point.x >= 0 && point.x <= 240);
      assert.ok(point.y >= 0 && point.y <= 140);
    }
    const [a, b, c] = shard;
    const area = Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2;
    assert.ok(area > 0.01, "shards must not collapse to a line");
    coveredArea += area;
  }
  assert.ok(Math.abs(coveredArea - 240 * 140) < 0.01, "the fan should tile the media rectangle without gaps");
});

test("glass shard geometry clamps edge impacts and caps shard count", () => {
  const shards = createGlassShardPolygons(80, 50, -20, 80, 40, 7);
  assert.equal(shards.length, 24);
  for (const point of shards.flat()) {
    assert.ok(point.x >= 0 && point.x <= 80);
    assert.ok(point.y >= 0 && point.y <= 50);
  }
});

test("invalid target sizes do not create glass shards", () => {
  assert.deepEqual(createGlassShardPolygons(0, 10, 0, 5, 12, 1), []);
  assert.deepEqual(createGlassShardPolygons(10, 10, Number.NaN, 5, 12, 1), []);
});

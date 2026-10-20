import test from "node:test";
import assert from "node:assert/strict";
import { createDigitalTearBlocks } from "./digital-tear.mjs";

test("digital tear blocks are deterministic, compact, and clipped", () => {
  const blocks = createDigitalTearBlocks(180, 100, 91, 47, 8, 74);
  assert.deepEqual(blocks, createDigitalTearBlocks(180, 100, 91, 47, 8, 74));
  assert.ok(blocks.length >= 4 && blocks.length <= 8);
  for (const block of blocks) {
    assert.ok(block.width >= 2 && block.width <= 18);
    assert.ok(block.height >= 1 && block.height <= 3);
    assert.ok(block.x >= 0 && block.x + block.width <= 180);
    assert.ok(block.y >= 0 && block.y + block.height <= 100);
    assert.ok(Math.abs(block.x + block.width / 2 - 91) <= 24);
    assert.ok(Math.abs(block.y + block.height / 2 - 47) <= 18);
  }
});

test("digital tear geometry clamps edge hits and rejects invalid inputs", () => {
  assert.deepEqual(createDigitalTearBlocks(0, 10, 0, 0), []);
  assert.deepEqual(createDigitalTearBlocks(10, Number.NaN, 0, 0), []);
  const edge = createDigitalTearBlocks(24, 16, -90, 40, 99, 0);
  assert.ok(edge.length >= 3 && edge.length <= 8);
  assert.ok(edge.every(block => block.x >= 0 && block.y >= 0 && block.x + block.width <= 24 && block.y + block.height <= 16));
});

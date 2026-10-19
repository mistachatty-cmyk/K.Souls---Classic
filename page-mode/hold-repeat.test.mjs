import test from "node:test";
import assert from "node:assert/strict";
import { advanceHeldSpawns, startHeldSpawn } from "./hold-repeat.mjs";

test("keyboard auto-repeat keeps one held key and schedules a spawn every 150 ms", () => {
  const held = new Map();

  assert.equal(startHeldSpawn(held, "a", 1, 100), true);
  assert.equal(startHeldSpawn(held, "a", 1, 120), false, "OS key-repeat must not reset the repeat timer");
  assert.deepEqual(advanceHeldSpawns(held, 249), []);
  assert.deepEqual(advanceHeldSpawns(held, 250).map(([key, value]) => [key, value.side]), [["a", 1]]);
  assert.deepEqual(advanceHeldSpawns(held, 399), []);
  assert.deepEqual(advanceHeldSpawns(held, 400).map(([key, value]) => [key, value.side]), [["a", 1]]);

  held.delete("a");
  assert.deepEqual(advanceHeldSpawns(held, 1000), [], "keyup stops future spawns");
});

test("left and right keys can be held and repeated independently", () => {
  const held = new Map();
  startHeldSpawn(held, "a", 1, 0);
  startHeldSpawn(held, "l", 2, 75);

  assert.deepEqual(advanceHeldSpawns(held, 150).map(([, value]) => value.side), [1]);
  assert.deepEqual(advanceHeldSpawns(held, 225).map(([, value]) => value.side), [2]);
});

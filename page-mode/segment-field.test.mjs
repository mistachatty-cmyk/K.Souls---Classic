import test from "node:test";
import assert from "node:assert/strict";
import { applyImpact, applySegmentImpact, createSegmentField, isSegmentSolid, resolveSegmentContact, segmentOpeningRects } from "./segment-field.mjs";

test("repeated local impacts open only their own part of a live target", () => {
  const field = createSegmentField(64, 64, "digital");
  assert.ok(field);
  assert.equal(isSegmentSolid(field, 24, 24), true);
  assert.equal(applySegmentImpact(field, 24, 24, 1, 0, 0.8).removedCells.length, 0);
  const result = applySegmentImpact(field, 24, 24, 1, 0, 0.8);
  assert.deepEqual(result.removedCells.map(cell => [cell.x, cell.y, cell.width, cell.height]), [[16, 16, 16, 16]]);
  assert.equal(isSegmentSolid(field, 24, 24), false);
  assert.equal(isSegmentSolid(field, 40, 24), true);
  assert.deepEqual(segmentOpeningRects(field), result.removedCells);
});

test("fighter and projectile queries agree with the visible opening", () => {
  const field = createSegmentField(64, 64, "glass");
  assert.ok(field);
  applySegmentImpact(field, 24, 24, 1, 0, 1.3);
  assert.equal(resolveSegmentContact(field, 24, 24, 100, 200, 3), null);
  assert.equal(isSegmentSolid(field, 24, 24), false);
  const contact = resolveSegmentContact(field, 40, 24, 100, 200, 3);
  assert.ok(contact);
  assert.ok(Number.isFinite(contact.normalX));
  assert.ok(Number.isFinite(contact.fighterX));
});

test("damage field stays bounded and rejects malformed geometry", () => {
  assert.equal(createSegmentField(NaN, 64, "paper"), null);
  const field = createSegmentField(1000, 1000, "stone", 16, 5);
  assert.ok(field);
  for (let x = 8; x < 300; x += 16) applySegmentImpact(field, x, 8, 1, 0, 9);
  assert.ok(field.cells.size <= 5);
  assert.equal(applySegmentImpact(field, Infinity, 8, 1, 0, 9).removedCells.length, 0);
  assert.equal(isSegmentSolid(field, -1, 8), false);
});

test("versioned impact returns clustered physical pieces and rejects invalid input", () => {
  const field = createSegmentField(64, 64, "digital");
  const invalid = applyImpact(field, { targetId: 1, x: NaN, y: 24, directionX: 1, directionY: 0, damage: 8 });
  assert.equal(invalid.detachedChunks.length, 0);
  const result = applyImpact(field, { targetId: 1, x: 24, y: 24, directionX: 1, directionY: 0, damage: 8 });
  assert.equal(result.version, 1);
  assert.equal(result.targetId, 1);
  assert.ok(result.removedCells.length > 1);
  assert.ok(result.detachedChunks.length <= 4);
  assert.equal(result.detachedChunks.reduce((sum, chunk) => sum + chunk.cells.length, 0), result.removedCells.length);
  assert.ok(result.detachedChunks.every(chunk => chunk.mass > 0 && chunk.width > 0 && chunk.height > 0));
});

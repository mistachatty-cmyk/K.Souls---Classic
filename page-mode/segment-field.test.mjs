import test from "node:test";
import assert from "node:assert/strict";
import { applyImpact, applySegmentImpact, chunkSilhouette, createSegmentField, isSegmentSolid, resolveSegmentContact, segmentOpeningRects } from "./segment-field.mjs";

test("a broad glass burst keeps the detached cross instead of filling its corners", () => {
  const field = createSegmentField(96, 96, "glass");
  const result = applyImpact(field, { targetId: 1, x: 40, y: 40, directionX: 1, directionY: -0.6, damage: 3 });
  const piece = result.detachedChunks.find(chunk => chunk.cells.length > 1);
  assert.ok(piece);
  const cells = chunkSilhouette(piece);
  assert.equal(cells?.length, 5);
  assert.equal(cells.reduce((area, cell) => area + cell.width * cell.height, 0), 5 * 16 * 16);
  assert.equal(piece.width * piece.height, 9 * 16 * 16);
  assert.equal(cells.some(cell => cell.x === 0 && cell.y === 0), false);
  assert.equal(chunkSilhouette({ ...piece, cells: Array.from({ length: 33 }, () => piece.cells[0]) }), null);
});

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
  assert.equal(createSegmentField(100000, 100000, "digital"), null);
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

test("a surviving island detaches only when cuts separate it from every edge", () => {
  const field = createSegmentField(48, 48, "stone");
  for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
    if ((row === 1 && col === 1) || (row === 2 && col === 2)) continue;
    field.cells.set(row * field.cols + col, { stress: 3, removed: true }); field.removedCount++;
  }
  assert.equal(isSegmentSolid(field, 24, 24), true);
  const result = applyImpact(field, { targetId: 1, x: 40, y: 40, directionX: 1, directionY: 0, damage: 3 });
  assert.equal(isSegmentSolid(field, 24, 24), false);
  assert.ok(result.removedCells.some(cell => cell.x === 16 && cell.y === 16));
  assert.ok(result.detachedChunks.some(chunk => chunk.cells.some(cell => cell.x === 16 && cell.y === 16)));
  const capped = createSegmentField(48, 48, "stone", 16, 8);
  for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
    if ((row === 1 && col === 1) || (row === 2 && col === 2)) continue;
    capped.cells.set(row * capped.cols + col, { stress: 3, removed: true }); capped.removedCount++;
  }
  applyImpact(capped, { targetId: 1, x: 40, y: 40, directionX: 1, directionY: 0, damage: 3 });
  assert.equal(capped.cells.size, 8);
  assert.equal(isSegmentSolid(capped, 24, 24), true);
});

import test from "node:test";
import assert from "node:assert/strict";
import { createSegmentField, applySegmentImpact } from "./segment-field.mjs";
import { sortTargetsFrontFirst, underlyingTargetForPoint, descendantLayersByElement, visibleOpeningRects } from "./layers.mjs";

const node = parentElement => ({ parentElement });
const target = (id, element, field = null) => ({ id, element, x: 0, y: 0, width: 64, height: 64, destroyed: false, field });

test("nested child is contacted before its parent", () => {
  const parentNode = node(null), childNode = node(parentNode);
  const parent = target(1, parentNode), child = target(2, childNode);
  assert.deepEqual(sortTargetsFrontFirst([parent, child]).map(item => item.id), [2, 1]);
  assert.deepEqual(sortTargetsFrontFirst([child, parent]).map(item => item.id), [2, 1]);
});

test("child opening reveals its solid parent, then the arena if parent opens", () => {
  const parentNode = node(null), childNode = node(parentNode);
  const parentField = createSegmentField(64, 64, "digital");
  const parent = target(1, parentNode, parentField), child = target(2, childNode);
  const targets = new Map([[parentNode, parent], [childNode, child]]);
  assert.equal(underlyingTargetForPoint(child, targets, 24, 24), parent);
  applySegmentImpact(parentField, 24, 24, 1, 0, 2);
  assert.equal(underlyingTargetForPoint(child, targets, 24, 24), null);
  assert.equal(underlyingTargetForPoint(child, targets, 40, 24), parent);
});

test("a parent opening keeps an intact child visible, including partial overlaps", () => {
  const parentNode = node(null), childNode = node(parentNode), grandchildNode = node(childNode);
  const parent = target(1, parentNode, createSegmentField(64, 64, "digital"));
  const child = { ...target(2, childNode, createSegmentField(32, 32, "digital")), x: 16, y: 16, width: 32, height: 32 };
  const grandchild = { ...target(3, grandchildNode), x: 16, y: 16, width: 16, height: 16, destroyed: true };
  const targets = new Map([[parentNode, parent], [childNode, child], [grandchildNode, grandchild]]);
  const descendants = descendantLayersByElement(targets);
  const opening = { x: 0, y: 0, width: 64, height: 64 };
  const area = rects => rects.reduce((sum, rect) => sum + rect.width * rect.height, 0);
  assert.equal(area(visibleOpeningRects(parent, descendants, opening)), 64 * 64 - 32 * 32);
  applySegmentImpact(child.field, 8, 8, 1, 0, 2);
  assert.equal(area(visibleOpeningRects(parent, descendants, opening)), 64 * 64 - 32 * 32 + 16 * 16);
  grandchild.destroyed = false;
  assert.equal(area(visibleOpeningRects(parent, descendants, opening)), 64 * 64 - 32 * 32);
});

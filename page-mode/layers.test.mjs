import test from "node:test";
import assert from "node:assert/strict";
import { createSegmentField, applySegmentImpact } from "./segment-field.mjs";
import { sortTargetsFrontFirst, underlyingTargetForPoint } from "./layers.mjs";

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

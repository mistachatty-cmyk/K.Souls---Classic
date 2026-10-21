import { isSegmentSolid } from "./segment-field.mjs";

function isAncestor(ancestor, element) {
  for (let node = element?.parentElement; node; node = node.parentElement) if (node === ancestor) return true;
  return false;
}

/** DOM descendants paint over ancestors; process their solid contact first. */
export function sortTargetsFrontFirst(targets) {
  return [...targets].sort((a, b) => isAncestor(a.element, b.element) ? 1 : isAncestor(b.element, a.element) ? -1 : 0);
}

/** Find the next surviving page layer under a hole. The host DOM remains untouched. */
export function underlyingTargetForPoint(target, targetMap, x, y) {
  for (let node = target.element?.parentElement; node; node = node.parentElement) {
    const candidate = targetMap.get(node);
    if (!candidate || candidate.destroyed || x < candidate.x || y < candidate.y || x >= candidate.x + candidate.width || y >= candidate.y + candidate.height) continue;
    if (!candidate.field || isSegmentSolid(candidate.field, x - candidate.x, y - candidate.y)) return candidate;
  }
  return null;
}

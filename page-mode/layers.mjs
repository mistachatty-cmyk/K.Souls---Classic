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

/** Index nested page layers once for a draw, then keep solid children over parent holes. */
export function descendantLayersByElement(targetMap) {
  const descendants = new Map();
  for (const target of targetMap.values()) {
    for (let node = target.element?.parentElement; node; node = node.parentElement) {
      if (!targetMap.has(node)) continue;
      if (!descendants.has(node)) descendants.set(node, []);
      descendants.get(node).push(target);
    }
  }
  return descendants;
}

function subtractRect(area, solid) {
  const left = Math.max(area.x, solid.x), top = Math.max(area.y, solid.y);
  const right = Math.min(area.x + area.width, solid.x + solid.width);
  const bottom = Math.min(area.y + area.height, solid.y + solid.height);
  if (right <= left || bottom <= top) return [area];
  return [
    { x: area.x, y: area.y, width: area.width, height: top - area.y },
    { x: area.x, y: bottom, width: area.width, height: area.y + area.height - bottom },
    { x: area.x, y: top, width: left - area.x, height: bottom - top },
    { x: right, y: top, width: area.x + area.width - right, height: bottom - top },
  ].filter(rect => rect.width > 0 && rect.height > 0);
}

/** Subtract surviving child geometry from an opening without touching the host DOM. */
export function visibleOpeningRects(target, descendants, opening) {
  let visible = [opening];
  for (const child of descendants.get(target.element) ?? []) {
    if (child.destroyed || !visible.length) continue;
    if (!visible.some(rect => rect.x < child.x + child.width && rect.x + rect.width > child.x
      && rect.y < child.y + child.height && rect.y + rect.height > child.y)) continue;
    const field = child.field;
    const solids = [];
    if (!field?.removedCount) solids.push({ x: child.x, y: child.y, width: child.width, height: child.height });
    else {
      const left = Math.min(...visible.map(rect => rect.x)), top = Math.min(...visible.map(rect => rect.y));
      const right = Math.max(...visible.map(rect => rect.x + rect.width));
      const bottom = Math.max(...visible.map(rect => rect.y + rect.height));
      const firstRow = Math.max(0, Math.floor((top - child.y) / field.cellSize));
      const lastRow = Math.min(field.rows - 1, Math.floor((bottom - child.y - 0.001) / field.cellSize));
      const firstCol = Math.max(0, Math.floor((left - child.x) / field.cellSize));
      const lastCol = Math.min(field.cols - 1, Math.floor((right - child.x - 0.001) / field.cellSize));
      for (let row = firstRow; row <= lastRow; row++) {
        let start = -1;
        for (let col = firstCol; col <= lastCol + 1; col++) {
          const solid = col <= lastCol && isSegmentSolid(field, col * field.cellSize, row * field.cellSize);
          if (solid && start < 0) start = col;
          if (!solid && start >= 0) {
            const x = start * field.cellSize, end = Math.min(child.width, col * field.cellSize);
            solids.push({ x: child.x + x, y: child.y + row * field.cellSize,
              width: end - x, height: Math.min(field.cellSize, child.height - row * field.cellSize) });
            start = -1;
          }
        }
      }
    }
    for (const solid of solids) visible = visible.flatMap(rect => subtractRect(rect, solid));
  }
  return visible;
}

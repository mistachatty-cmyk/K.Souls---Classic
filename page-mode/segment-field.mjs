import { resolveTargetContact } from "./impact-physics.mjs";

const thresholds = { glass: 1.25, paper: 1.5, stone: 2.5, digital: 1.5 };
const finite = (...values) => values.every(Number.isFinite);

/** Sparse, target-local solid-cell field. Unallocated cells are solid. */
export function createSegmentField(width, height, material, cellSize = 16, maxCells = 192) {
  if (!finite(width, height, cellSize, maxCells) || width <= 0 || height <= 0 || cellSize < 4 || maxCells < 1) return null;
  const cols = Math.ceil(width / cellSize), rows = Math.ceil(height / cellSize);
  if (cols * rows > 4096) return null;
  return { width, height, material, cellSize, maxCells: Math.min(192, Math.floor(maxCells)), cols, rows, removedCount: 0, cells: new Map() };
}

function cellRect(field, col, row) {
  const x = col * field.cellSize, y = row * field.cellSize;
  return { x, y, width: Math.min(field.cellSize, field.width - x), height: Math.min(field.cellSize, field.height - y) };
}

export function isSegmentSolid(field, x, y) {
  if (!field || !finite(x, y) || x < 0 || y < 0 || x >= field.width || y >= field.height) return false;
  const col = Math.floor(x / field.cellSize), row = Math.floor(y / field.cellSize);
  return !field.cells.get(row * field.cols + col)?.removed;
}

/** Deposit one bounded impact; returns only cells removed by this impact. */
export function applySegmentImpact(field, x, y, directionX, directionY, damage) {
  const removedCells = [];
  if (!field || !finite(x, y, directionX, directionY, damage) || damage <= 0 || x < 0 || y < 0 || x >= field.width || y >= field.height) return { removedCells };
  const col = Math.floor(x / field.cellSize), row = Math.floor(y / field.cellSize);
  const magnitude = Math.hypot(directionX, directionY) || 1;
  const dx = directionX / magnitude, dy = directionY / magnitude;
  const spread = field.material === "glass" ? [0.5, 0.5] : field.material === "paper" ? [0.48, 0.12] : field.material === "stone" ? [0.08, 0.08] : [0.22, 0.22];
  const neighbors = [[0, 0, 1], [1, 0, spread[0] + Math.max(0, dx) * 0.2], [-1, 0, spread[0] + Math.max(0, -dx) * 0.2], [0, 1, spread[1] + Math.max(0, dy) * 0.2], [0, -1, spread[1] + Math.max(0, -dy) * 0.2]];
  const threshold = thresholds[field.material] ?? thresholds.digital;
  for (const [offsetX, offsetY, factor] of neighbors) {
    const cx = col + offsetX, cy = row + offsetY;
    if (cx < 0 || cy < 0 || cx >= field.cols || cy >= field.rows) continue;
    const key = cy * field.cols + cx;
    let cell = field.cells.get(key);
    if (!cell) {
      if (field.cells.size >= field.maxCells) continue;
      cell = { stress: 0, removed: false };
      field.cells.set(key, cell);
    }
    if (cell.removed) continue;
    cell.stress += damage * factor;
    if (cell.stress >= threshold) {
      cell.removed = true;
      field.removedCount++;
      removedCells.push(cellRect(field, cx, cy));
    }
  }
  return { removedCells };
}

export const DESTRUCTION_WORLD_VERSION = 1;
export const MAX_CHUNK_SILHOUETTE_CELLS = 32;

/** Target-local removed cells become bounded rects relative to a chunk's top-left. */
export function chunkSilhouette(piece) {
  if (!piece || !Array.isArray(piece.cells) || piece.cells.length < 2 || piece.cells.length > MAX_CHUNK_SILHOUETTE_CELLS
      || !finite(piece.x, piece.y, piece.width, piece.height) || piece.width <= 0 || piece.height <= 0) return null;
  let area = 0;
  const cells = [];
  for (const cell of piece.cells) {
    if (!cell || !finite(cell.x, cell.y, cell.width, cell.height) || cell.width <= 0 || cell.height <= 0
        || cell.x < piece.x || cell.y < piece.y || cell.x + cell.width > piece.x + piece.width || cell.y + cell.height > piece.y + piece.height) return null;
    area += cell.width * cell.height;
    cells.push({ x: cell.x - piece.x, y: cell.y - piece.y, width: cell.width, height: cell.height });
  }
  return area < piece.width * piece.height ? cells : null;
}

/** Circle contact against the same rotated cells drawn for a physical chunk. */
export function chunkTouchesCircle(chunk, x, y, radius) {
  if (!chunk || !finite(chunk.x, chunk.y, chunk.width, chunk.height, chunk.angle, x, y, radius)
      || chunk.width <= 0 || chunk.height <= 0 || radius < 0) return false;
  const dx = x - chunk.x, dy = y - chunk.y;
  if (Math.hypot(dx, dy) > Math.hypot(chunk.width, chunk.height) / 2 + radius) return false;
  const cos = Math.cos(chunk.angle), sin = Math.sin(chunk.angle);
  const localX = dx * cos + dy * sin + chunk.width / 2;
  const localY = -dx * sin + dy * cos + chunk.height / 2;
  const cells = chunk.cells?.length ? chunk.cells : [{ x: 0, y: 0, width: chunk.width, height: chunk.height }];
  for (const cell of cells) {
    const nearestX = Math.max(cell.x, Math.min(localX, cell.x + cell.width));
    const nearestY = Math.max(cell.y, Math.min(localY, cell.y + cell.height));
    if ((localX - nearestX) ** 2 + (localY - nearestY) ** 2 <= radius ** 2) return true;
  }
  return false;
}

function detachUnsupportedCells(field) {
  if (field.removedCount < 4) return [];
  const total = field.cols * field.rows, visited = new Uint8Array(total), queue = [];
  const solid = key => !field.cells.get(key)?.removed;
  for (let key = 0; key < total; key++) {
    const col = key % field.cols, row = Math.floor(key / field.cols);
    if (col !== 0 && row !== 0 && col !== field.cols - 1 && row !== field.rows - 1) continue;
    if (solid(key) && !visited[key]) { visited[key] = 1; queue.push(key); }
  }
  const neighbors = key => {
    const col = key % field.cols, row = Math.floor(key / field.cols), result = [];
    if (col > 0) result.push(key - 1);
    if (col + 1 < field.cols) result.push(key + 1);
    if (row > 0) result.push(key - field.cols);
    if (row + 1 < field.rows) result.push(key + field.cols);
    return result;
  };
  for (let cursor = 0; cursor < queue.length; cursor++) for (const next of neighbors(queue[cursor])) {
    if (visited[next] || !solid(next)) continue;
    visited[next] = 1; queue.push(next);
  }
  const detached = [];
  for (let key = 0; key < total; key++) {
    if (visited[key] || !solid(key)) continue;
    const component = [key]; visited[key] = 1;
    for (let cursor = 0; cursor < component.length; cursor++) for (const next of neighbors(component[cursor])) {
      if (visited[next] || !solid(next)) continue;
      visited[next] = 1; component.push(next);
    }
    const missing = component.filter(id => !field.cells.has(id)).length;
    if (field.cells.size + missing > field.maxCells) continue;
    for (const id of component) {
      field.cells.set(id, { stress: 0, removed: true }); field.removedCount++;
      detached.push(cellRect(field, id % field.cols, Math.floor(id / field.cols)));
    }
  }
  return detached;
}

/** Versioned boundary between game combat and page geometry. Coordinates are target-local. */
export function applyImpact(field, impact) {
  const empty = { version: DESTRUCTION_WORLD_VERSION, targetId: impact?.targetId ?? 0, removedCells: [], openings: [], detachedChunks: [], wholeTargetBreak: false };
  if (!field || !impact || !Number.isSafeInteger(impact.targetId) || impact.targetId < 1) return empty;
  const removedCells = applySegmentImpact(field, impact.x, impact.y, impact.directionX, impact.directionY, impact.damage).removedCells;
  if (!removedCells.length) return empty;
  removedCells.push(...detachUnsupportedCells(field));
  const remaining = new Set(removedCells.map(cell => `${cell.x}:${cell.y}`));
  const detachedChunks = [];
  for (const first of removedCells) {
    const firstKey = `${first.x}:${first.y}`;
    if (!remaining.has(firstKey)) continue;
    const queue = [first], cells = [];
    remaining.delete(firstKey);
    while (queue.length) {
      const cell = queue.pop(); cells.push(cell);
      for (const [dx, dy] of [[field.cellSize, 0], [-field.cellSize, 0], [0, field.cellSize], [0, -field.cellSize]]) {
        const neighbor = removedCells.find(candidate => candidate.x === cell.x + dx && candidate.y === cell.y + dy);
        if (neighbor && remaining.delete(`${neighbor.x}:${neighbor.y}`)) queue.push(neighbor);
      }
    }
    const x = Math.min(...cells.map(cell => cell.x)), y = Math.min(...cells.map(cell => cell.y));
    const width = Math.max(...cells.map(cell => cell.x + cell.width)) - x;
    const height = Math.max(...cells.map(cell => cell.y + cell.height)) - y;
    const area = cells.reduce((sum, cell) => sum + cell.width * cell.height, 0);
    if (detachedChunks.length < 4) detachedChunks.push({ x, y, width, height, mass: Math.max(0.25, area / 256), cells });
    else {
      const last = detachedChunks[3], right = Math.max(last.x + last.width, x + width), bottom = Math.max(last.y + last.height, y + height);
      last.x = Math.min(last.x, x); last.y = Math.min(last.y, y);
      last.width = right - last.x; last.height = bottom - last.y;
      last.mass += Math.max(0.25, area / 256); last.cells.push(...cells);
    }
  }
  return { ...empty, removedCells, openings: removedCells, detachedChunks };
}

export function segmentOpeningRects(field) {
  if (!field) return [];
  return [...field.cells.entries()].filter(([, cell]) => cell.removed)
    .sort(([a], [b]) => a - b)
    .map(([key]) => cellRect(field, key % field.cols, Math.floor(key / field.cols)));
}

/** Find contact against nearby surviving cells; keep the rectangle fast path until a hole opens. */
export function resolveSegmentContact(field, localX, localY, targetX, targetY, radius) {
  if (!field || !finite(localX, localY, targetX, targetY, radius) || radius <= 0) return null;
  const fighterX = targetX + localX, fighterY = targetY + localY;
  if (!field.removedCount) return resolveTargetContact(fighterX, fighterY, targetX, targetY, field.width, field.height, radius);
  const minCol = Math.max(0, Math.floor((localX - radius) / field.cellSize));
  const maxCol = Math.min(field.cols - 1, Math.floor((localX + radius) / field.cellSize));
  const minRow = Math.max(0, Math.floor((localY - radius) / field.cellSize));
  const maxRow = Math.min(field.rows - 1, Math.floor((localY + radius) / field.cellSize));
  let nearest = null, displacement = Infinity;
  for (let row = minRow; row <= maxRow; row++) for (let col = minCol; col <= maxCol; col++) {
    if (field.cells.get(row * field.cols + col)?.removed) continue;
    const rect = cellRect(field, col, row);
    const contact = resolveTargetContact(fighterX, fighterY, targetX + rect.x, targetY + rect.y, rect.width, rect.height, radius);
    if (!contact) continue;
    const distance = Math.hypot(contact.fighterX - fighterX, contact.fighterY - fighterY);
    if (distance < displacement) { nearest = contact; displacement = distance; }
  }
  return nearest;
}

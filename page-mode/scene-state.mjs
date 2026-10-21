import { createSegmentField } from "./segment-field.mjs";

export const SCENE_FIELD_VERSION = 1;
const materials = new Set(["glass", "paper", "stone", "digital"]);

/** Copy only bounded structural state; media bytes are stored separately in local IndexedDB. */
export function captureSceneField(field) {
  if (!field || field.cells.size > 192) return null;
  return {
    version: SCENE_FIELD_VERSION, width: field.width, height: field.height,
    material: field.material, cellSize: field.cellSize,
    cells: [...field.cells].map(([key, cell]) => [key, Math.min(1000, Math.max(0, cell.stress)), !!cell.removed]),
  };
}

/** Reject unknown, mismatched, or unbounded local records before rebuilding collision. */
export function restoreSceneField(saved, width, height, material) {
  if (!saved || saved.version !== SCENE_FIELD_VERSION || !materials.has(material)
    || saved.material !== material || !Number.isFinite(saved.width) || !Number.isFinite(saved.height)
    || Math.abs(saved.width - width) > 0.01
    || Math.abs(saved.height - height) > 0.01 || !Array.isArray(saved.cells)
    || saved.cells.length > 192) return null;
  const field = createSegmentField(width, height, material, saved.cellSize);
  if (!field) return null;
  const maxKey = field.cols * field.rows, seen = new Set();
  for (const entry of saved.cells) {
    if (!Array.isArray(entry) || entry.length !== 3) return null;
    const [key, stress, removed] = entry;
    if (!Number.isSafeInteger(key) || key < 0 || key >= maxKey || seen.has(key)
      || !Number.isFinite(stress) || stress < 0 || stress > 1000 || typeof removed !== "boolean") return null;
    seen.add(key);
    field.cells.set(key, { stress, removed });
    if (removed) field.removedCount++;
  }
  return field;
}

export function savedVideoTime(rawTime, duration) {
  if (!Number.isFinite(rawTime) || rawTime < 0) return 0;
  return Number.isFinite(duration) && duration >= 0 ? Math.min(rawTime, duration) : rawTime;
}

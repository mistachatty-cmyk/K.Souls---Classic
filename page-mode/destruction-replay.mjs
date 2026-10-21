/** Compact, immutable samples for the in-match timeline. No DOM nodes or media are stored. */
export function captureDestructionState(targets, areas, chunks) {
  const fields = [];
  for (const target of targets) {
    if (fields.length >= 16) break;
    const field = target.field;
    if (target.destroyed || !field?.removedCount) continue;
    const removed = [...field.cells.entries()].filter(([, cell]) => cell.removed).map(([key]) => key).sort((a, b) => a - b).slice(0, 192);
    fields.push({ targetId: target.id, x: target.x, y: target.y, width: field.width, height: field.height, cellSize: field.cellSize, cols: field.cols, removed });
  }
  return {
    fields,
    areas: areas.slice(-256).map(area => ({ ...area })),
    chunks: chunks.slice(-48).map(chunk => ({ x: chunk.x, y: chunk.y, width: chunk.width, height: chunk.height, angle: chunk.angle, material: chunk.material, color: chunk.color,
      sourceTargetId: chunk.sourceTargetId, mediaX: chunk.mediaX, mediaY: chunk.mediaY })),
  };
}

export function snapshotOpeningRects(field) {
  if (!field || !Number.isFinite(field.cellSize) || field.cellSize <= 0 || !Number.isSafeInteger(field.cols) || field.cols <= 0) return [];
  return field.removed.map(key => {
    const localX = key % field.cols * field.cellSize, localY = Math.floor(key / field.cols) * field.cellSize;
    return { x: field.x + localX, y: field.y + localY, width: Math.min(field.cellSize, field.width - localX), height: Math.min(field.cellSize, field.height - localY), targetId: field.targetId };
  }).filter(rect => rect.width > 0 && rect.height > 0);
}

export function countDestructionWork(targets, chunks) {
  let activeTargets = 0;
  let damagedTargets = 0;
  let activeCells = 0;
  let removedCells = 0;
  for (const target of targets) {
    if (target.destroyed) continue;
    activeTargets++;
    if (!target.field) continue;
    damagedTargets++;
    activeCells += target.field.cells.size;
    removedCells += target.field.removedCount;
  }
  return { activeTargets, damagedTargets, activeCells, removedCells, chunks };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { countDestructionWork } from './frame-diagnostics.mjs';

test('destruction diagnostics count only live targets and their allocated cells', () => {
  const targets = [
    { destroyed: false },
    { destroyed: false, field: { cells: new Map([[1, {}], [2, {}]]), removedCount: 1 } },
    { destroyed: true, field: { cells: new Map([[3, {}]]), removedCount: 1 } },
  ];
  assert.deepEqual(countDestructionWork(targets, 4), {
    activeTargets: 2, damagedTargets: 1, activeCells: 2, removedCells: 1, chunks: 4,
  });
});

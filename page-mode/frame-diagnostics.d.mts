export type ProfileTarget = { destroyed: boolean; field?: { cells: Map<number, unknown>; removedCount: number } };
export function countDestructionWork(targets: Iterable<ProfileTarget>, chunks: number): { activeTargets: number; damagedTargets: number; activeCells: number; removedCells: number; chunks: number };

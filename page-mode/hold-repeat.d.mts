export type HeldSpawn = { side: 1 | 2; lastSpawnAt: number };
export const HOLD_REPEAT_MS: number;
export function startHeldSpawn<K extends string | number>(held: Map<K, HeldSpawn>, key: K, side: 1 | 2, now: number): boolean;
export function advanceHeldSpawns<K extends string | number>(held: Map<K, HeldSpawn>, now: number, interval?: number): Array<[K, HeldSpawn]>;

export type DigitalTearBlock = { x: number; y: number; width: number; height: number };
export function createDigitalTearBlocks(width: number, height: number, impactX: number, impactY: number, requestedCount?: number, seed?: number): DigitalTearBlock[];

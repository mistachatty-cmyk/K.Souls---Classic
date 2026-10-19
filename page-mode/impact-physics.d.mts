export function normalizeImpactDirection(x: number, y: number): [number, number];
export function impactImpulse(force: number): number;
export function fighterTargetRecoil(vx: number, vy: number, normalX: number, normalY: number, restitution?: number): { vx: number; vy: number };
export function resolveTargetContact(fighterX: number, fighterY: number, targetX: number, targetY: number, width: number, height: number, radius: number): { x: number; y: number; normalX: number; normalY: number; fighterX: number; fighterY: number } | null;

export function normalizeImpactDirection(x, y) {
  const magnitude = Math.hypot(x, y);
  if (!Number.isFinite(magnitude) || magnitude < 0.001) return [0, -1];
  return [x / magnitude, y / magnitude];
}

export function impactImpulse(force) {
  return Number.isFinite(force) ? Math.max(0, Math.min(8, force * 0.28)) : 0;
}

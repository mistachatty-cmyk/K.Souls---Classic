export function normalizeImpactDirection(x, y) {
  const magnitude = Math.hypot(x, y);
  if (!Number.isFinite(magnitude) || magnitude < 0.001) return [0, -1];
  return [x / magnitude, y / magnitude];
}

export function impactImpulse(force) {
  return Number.isFinite(force) ? Math.max(0, Math.min(8, force * 0.28)) : 0;
}

export function fighterTargetRecoil(vx, vy, normalX, normalY, restitution = 0.9) {
  if (![vx, vy, normalX, normalY, restitution].every(Number.isFinite)) {
    return { vx: Number.isFinite(vx) ? vx : 0, vy: Number.isFinite(vy) ? vy : 0 };
  }
  if (Math.hypot(normalX, normalY) < 0.001) return { vx, vy };
  const [nx, ny] = normalizeImpactDirection(normalX, normalY);
  const incoming = vx * nx + vy * ny;
  if (incoming >= 0) return { vx, vy };
  const bounce = Math.max(0, Math.min(1.2, restitution));
  const impulse = (1 + bounce) * incoming;
  return { vx: vx - impulse * nx, vy: vy - impulse * ny };
}

export function resolveTargetContact(fighterX, fighterY, targetX, targetY, width, height, radius) {
  if (![fighterX, fighterY, targetX, targetY, width, height, radius].every(Number.isFinite) || width <= 0 || height <= 0 || radius <= 0) return null;
  const right = targetX + width, bottom = targetY + height;
  const closestX = Math.max(targetX, Math.min(fighterX, right));
  const closestY = Math.max(targetY, Math.min(fighterY, bottom));
  let dx = fighterX - closestX, dy = fighterY - closestY;
  const distance = Math.hypot(dx, dy);
  if (distance >= radius) return null;
  let normalX, normalY, contactX = closestX, contactY = closestY;
  if (distance < 0.001) {
    const edges = [
      { distance: fighterX - targetX, normalX: -1, normalY: 0, x: targetX, y: closestY },
      { distance: right - fighterX, normalX: 1, normalY: 0, x: right, y: closestY },
      { distance: fighterY - targetY, normalX: 0, normalY: -1, x: closestX, y: targetY },
      { distance: bottom - fighterY, normalX: 0, normalY: 1, x: closestX, y: bottom },
    ];
    const edge = edges.reduce((nearest, candidate) => candidate.distance < nearest.distance ? candidate : nearest);
    ({ normalX, normalY, x: contactX, y: contactY } = edge);
    dx = normalX; dy = normalY;
  } else {
    normalX = dx / distance; normalY = dy / distance;
  }
  return {
    x: contactX, y: contactY, normalX, normalY,
    fighterX: contactX + normalX * (radius + 0.01),
    fighterY: contactY + normalY * (radius + 0.01),
  };
}

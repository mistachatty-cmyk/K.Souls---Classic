const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function randomFor(seed) {
  let value = (seed >>> 0) || 1;
  return () => {
    value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
}

/** Build a bounded, repeatable radial fracture around a page-target impact. */
export function createFracturePattern(width, height, impactX, impactY, directionX, directionY, strength = 1, seed = 1) {
  if (![width, height, impactX, impactY, directionX, directionY, strength].every(Number.isFinite) || width <= 0 || height <= 0) return [];
  const rand = randomFor(seed);
  const cx = clamp(impactX, 0, width), cy = clamp(impactY, 0, height);
  const magnitude = Math.hypot(directionX, directionY);
  const angleIn = magnitude > 0.001 ? Math.atan2(directionY / magnitude, directionX / magnitude) : -Math.PI / 2;
  const impactStrength = clamp(strength, 0.2, 1.6);
  const reach = Math.min(Math.hypot(width, height) * 0.44, Math.min(width, height) * (0.12 + impactStrength * 0.2));
  const spokes = Math.round(6 + impactStrength * 2);
  const segments = [];
  const point = (x, y) => ({ x: clamp(x, 0, width), y: clamp(y, 0, height) });

  for (let i = 0; i < spokes; i++) {
    const angle = angleIn + (Math.PI * 2 * i / spokes) + (rand() - 0.5) * 0.24;
    const alignment = Math.max(0, Math.cos(angle - angleIn));
    const length = reach * (0.58 + rand() * 0.34) * (0.7 + alignment * 0.3);
    const startT = 0.04 + rand() * 0.07;
    const start = point(cx + Math.cos(angle) * length * startT, cy + Math.sin(angle) * length * startT);
    const end = point(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
    segments.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, branch: false });

    for (const t of [0.34 + rand() * 0.08, 0.66 + rand() * 0.08]) {
      const branchBaseX = cx + Math.cos(angle) * length * t;
      const branchBaseY = cy + Math.sin(angle) * length * t;
      const side = rand() < 0.5 ? -1 : 1;
      const branchAngle = angle + side * (0.44 + rand() * 0.3);
      const branchLength = length * (0.17 + rand() * 0.12) * (1 - t * 0.55);
      const branchStart = point(branchBaseX, branchBaseY);
      const branchEnd = point(branchBaseX + Math.cos(branchAngle) * branchLength, branchBaseY + Math.sin(branchAngle) * branchLength);
      segments.push({ x1: branchStart.x, y1: branchStart.y, x2: branchEnd.x, y2: branchEnd.y, branch: true });
    }
  }
  return segments.slice(0, 30);
}

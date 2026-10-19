const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function randomFor(seed) {
  let value = (seed >>> 0) || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
}

/** Create a compact, repeatable cluster of chunky chips around a stone impact. */
export function createStoneChipPolygons(width, height, impactX, impactY, requestedCount = 5, seed = 1) {
  if (![width, height, impactX, impactY].every(Number.isFinite) || width <= 0 || height <= 0) return [];
  const count = Math.round(clamp(Number.isFinite(requestedCount) ? requestedCount : 5, 3, 6));
  const rand = randomFor(seed);
  const center = { x: clamp(impactX, 0, width), y: clamp(impactY, 0, height) };
  const reach = Math.max(2, Math.min(18, width * 0.2, height * 0.28));
  const maxRadius = Math.max(2, Math.min(8, width * 0.11, height * 0.18));
  const polygons = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 2 * (i + rand() * 0.45) / count;
    const distance = reach * (0.22 + rand() * 0.58);
    const chipCenter = {
      x: clamp(center.x + Math.cos(angle) * distance, 0, width),
      y: clamp(center.y + Math.sin(angle) * distance, 0, height),
    };
    const radius = maxRadius * (0.62 + rand() * 0.38);
    const sides = 4 + Math.floor(rand() * 3);
    const rotation = angle + rand() * 0.8;
    const polygon = [];
    for (let vertex = 0; vertex < sides; vertex++) {
      const vertexAngle = rotation + Math.PI * 2 * vertex / sides;
      const irregularity = 0.68 + rand() * 0.32;
      polygon.push({
        x: clamp(chipCenter.x + Math.cos(vertexAngle) * radius * irregularity, 0, width),
        y: clamp(chipCenter.y + Math.sin(vertexAngle) * radius * irregularity, 0, height),
      });
    }
    polygons.push(polygon);
  }
  return polygons;
}

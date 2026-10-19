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

/** Create a repeatable, clipped triangle fan for media breaking at an impact. */
export function createGlassShardPolygons(width, height, impactX, impactY, requestedCount = 14, seed = 1) {
  if (![width, height, impactX, impactY].every(Number.isFinite) || width <= 0 || height <= 0) return [];
  const count = Math.round(clamp(Number.isFinite(requestedCount) ? requestedCount : 14, 6, 24));
  const rand = randomFor(seed);
  const perimeter = width * 2 + height * 2;
  const sideLengths = [width, height, width, height];
  const extras = count - sideLengths.length;
  const allocations = sideLengths.map(length => extras * length / perimeter);
  const edgeCounts = allocations.map(Math.floor);
  let remaining = extras - edgeCounts.reduce((sum, amount) => sum + amount, 0);
  const remainderOrder = allocations.map((amount, index) => ({ index, fraction: amount - edgeCounts[index] }))
    .sort((a, b) => b.fraction - a.fraction);
  for (let i = 0; i < remaining; i++) edgeCounts[remainderOrder[i].index]++;
  const center = {
    x: clamp(impactX, width * 0.04, width * 0.96),
    y: clamp(impactY, height * 0.04, height * 0.96),
  };
  const vertices = [{ x: 0, y: 0 }];
  for (let side = 0; side < sideLengths.length; side++) {
    const internalCount = edgeCounts[side];
    for (let i = 0; i < internalCount; i++) {
      const spacing = 1 / (internalCount + 1);
      const position = (i + 1) * spacing + (rand() - 0.5) * spacing * 0.32;
      if (side === 0) vertices.push({ x: width * position, y: 0 });
      else if (side === 1) vertices.push({ x: width, y: height * position });
      else if (side === 2) vertices.push({ x: width * (1 - position), y: height });
      else vertices.push({ x: 0, y: height * (1 - position) });
    }
    if (side === 0) vertices.push({ x: width, y: 0 });
    else if (side === 1) vertices.push({ x: width, y: height });
    else if (side === 2) vertices.push({ x: 0, y: height });
  }
  return vertices.map((point, index) => [center, point, vertices[(index + 1) % count]]);
}

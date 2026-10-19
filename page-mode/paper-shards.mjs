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

/** Split a page rectangle into two complementary, repeatable paper strips. */
export function createPaperTearPolygons(width, height, impactX, impactY, seed = 1) {
  if (![width, height, impactX, impactY].every(Number.isFinite) || width <= 0 || height <= 0) return [];
  const rand = randomFor(seed);
  const centerY = clamp(impactY, height * 0.18, height * 0.82);
  const amplitude = Math.min(8, height * 0.12);
  const divisions = Math.max(4, Math.min(12, Math.ceil(width / 36)));
  const seam = [];
  for (let i = 0; i <= divisions; i++) {
    const x = width * i / divisions;
    const edgeFade = Math.min(1, i / 2, (divisions - i) / 2);
    const impactBias = 1 - Math.min(1, Math.abs(x - clamp(impactX, 0, width)) / Math.max(1, width * 0.65));
    const jitter = (rand() - 0.5) * amplitude * 2 * edgeFade;
    seam.push({ x, y: clamp(centerY + jitter * (0.7 + impactBias * 0.3), 0, height) });
  }

  const upper = [{ x: 0, y: 0 }, { x: width, y: 0 }, ...seam.slice().reverse()];
  const lower = [...seam, { x: width, y: height }, { x: 0, y: height }];
  return [upper, lower];
}

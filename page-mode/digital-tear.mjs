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

/** Create clipped pixel bars around an impact for a digital page target. */
export function createDigitalTearBlocks(width, height, impactX, impactY, requestedCount = 6, seed = 1) {
  if (![width, height, impactX, impactY].every(Number.isFinite) || width <= 0 || height <= 0) return [];
  const count = Math.round(clamp(Number.isFinite(requestedCount) ? requestedCount : 6, 3, 8));
  const rand = randomFor(seed);
  const centerX = clamp(impactX, 0, width);
  const centerY = clamp(impactY, 0, height);
  const blocks = [];

  for (let i = 0; i < count; i++) {
    const blockWidth = Math.min(width, 2 + Math.floor(rand() * Math.min(17, Math.max(1, width - 1))));
    const blockHeight = Math.min(height, 1 + Math.floor(rand() * Math.min(3, Math.max(1, height - 1))));
    const x = clamp(centerX - blockWidth / 2 + (rand() - 0.5) * 42, 0, width - blockWidth);
    const y = clamp(centerY + (rand() - 0.5) * 34, 0, height - blockHeight);
    blocks.push({ x, y, width: blockWidth, height: blockHeight });
  }
  return blocks;
}

export const HOLD_REPEAT_MS = 150;

/** Start one hold. Repeated browser keydown events leave the original timer intact. */
export function startHeldSpawn(held, key, side, now) {
  if (held.has(key)) return false;
  held.set(key, { side, lastSpawnAt: now });
  return true;
}

/** Return due held inputs and advance their clocks without catch-up bursts. */
export function advanceHeldSpawns(held, now, interval = HOLD_REPEAT_MS) {
  const due = [];
  for (const [key, input] of held) {
    if (now - input.lastSpawnAt < interval) continue;
    input.lastSpawnAt = now;
    due.push([key, input]);
  }
  return due;
}

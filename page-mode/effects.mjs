export function pageEffects(mode, reducedMotion) {
  if (reducedMotion) return { particles: 0.3, shake: 0, animated: false };
  if (mode === "low") return { particles: 0.3, shake: 0.2, animated: true };
  return { particles: 1, shake: 1, animated: true };
}

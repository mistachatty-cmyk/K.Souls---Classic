export type PageEffectMode = "full" | "low";
export function pageEffects(mode: PageEffectMode | string, reducedMotion: boolean): { particles: number; shake: number; animated: boolean };

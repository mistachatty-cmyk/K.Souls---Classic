import type { KineticModelStyle } from "./types";

export const KINETIC_MODEL_STYLE_KEY = "kinetic-souls.model-style.v1";
export const DEFAULT_KINETIC_MODEL_STYLE: KineticModelStyle = "hd";
const MODEL_STYLES: readonly KineticModelStyle[] = ["block", "classic", "hd", "sabre"];

export function isKineticModelStyle(value: unknown): value is KineticModelStyle {
  return typeof value === "string" && MODEL_STYLES.includes(value as KineticModelStyle);
}

export function readKineticModelStyle(): KineticModelStyle {
  try {
    const saved = window.localStorage.getItem(KINETIC_MODEL_STYLE_KEY);
    return isKineticModelStyle(saved) ? saved : DEFAULT_KINETIC_MODEL_STYLE;
  } catch {
    return DEFAULT_KINETIC_MODEL_STYLE;
  }
}

export function writeKineticModelStyle(style: KineticModelStyle): void {
  try {
    window.localStorage.setItem(KINETIC_MODEL_STYLE_KEY, style);
  } catch {
    // The game still works when browser storage is unavailable.
  }
}

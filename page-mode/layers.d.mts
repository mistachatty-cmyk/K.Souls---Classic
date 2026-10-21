import type { SegmentField } from "./segment-field.mjs";
export type LayerTarget = { element: Element; x: number; y: number; width: number; height: number; destroyed: boolean; field?: SegmentField };
export function sortTargetsFrontFirst<T extends LayerTarget>(targets: T[]): T[];
export function underlyingTargetForPoint<T extends LayerTarget>(target: T, targetMap: Map<Element, T>, x: number, y: number): T | null;

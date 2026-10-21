import type { PageMaterial } from "./materials.mjs";
import type { SegmentField } from "./segment-field.mjs";
export type SavedSceneField = { version: 1; width: number; height: number; material: PageMaterial; cellSize: number; cells: Array<[number, number, boolean]> };
export const SCENE_FIELD_VERSION: 1;
export function captureSceneField(field: SegmentField | null | undefined): SavedSceneField | null;
export function restoreSceneField(saved: unknown, width: number, height: number, material: PageMaterial): SegmentField | null;
export function savedVideoTime(rawTime: number, duration: number): number;

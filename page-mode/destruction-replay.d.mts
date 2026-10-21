import type { SegmentField, SegmentRect } from "./segment-field.mjs";
import type { PageMaterial } from "./materials.mjs";
export type ReplayArea = SegmentRect & { targetId: number };
export type ReplayChunk = SegmentRect & { angle: number; material: PageMaterial; color: string };
export type ReplayField = { targetId: number; x: number; y: number; width: number; height: number; cellSize: number; cols: number; removed: number[] };
export type DestructionState = { fields: ReplayField[]; areas: ReplayArea[]; chunks: ReplayChunk[] };
export function captureDestructionState(targets: Array<{ id: number; x: number; y: number; destroyed: boolean; field?: SegmentField }>, areas: ReplayArea[], chunks: ReplayChunk[]): DestructionState;
export function snapshotOpeningRects(field: ReplayField): Array<SegmentRect & { targetId: number }>;

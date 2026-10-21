import type { SegmentField } from "./segment-field.mjs";
export function mediaMaskAlpha(field: SegmentField | null): { width: number; height: number; alpha: Uint8Array } | null;
export function containedMediaPlacement(sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number, pieceX: number, pieceY: number): { x: number; y: number; width: number; height: number } | null;

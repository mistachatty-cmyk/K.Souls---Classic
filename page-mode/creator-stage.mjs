/** A placed prop keeps a fixed document-space floor near the viewport where it was placed. */
export function creatorStageBottom(placementY, height, viewportBottom, documentBottom) {
  if (![placementY, height, viewportBottom, documentBottom].every(Number.isFinite)
    || height <= 0 || documentBottom <= 0) return 0;
  return Math.max(0, Math.min(documentBottom - 8, Math.max(placementY + height, viewportBottom - 24)));
}

export function creatorFloorTop(stageBottom, height, documentBottom) {
  if (!Number.isFinite(height) || height <= 0 || !Number.isFinite(documentBottom) || documentBottom <= 0) return 0;
  const bottom = Number.isFinite(stageBottom) ? stageBottom : documentBottom - 8;
  return Math.max(0, Math.min(bottom, documentBottom - 8) - height);
}

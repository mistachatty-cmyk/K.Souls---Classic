/** A tiny alpha mask for a sandbox object's cell field. The source pixels stay local. */
export function mediaMaskAlpha(field) {
  if (!field || field.cols < 1 || field.rows < 1) return null;
  const alpha = new Uint8Array(field.cols * field.rows).fill(255);
  for (const [key, cell] of field.cells) if (cell.removed && key >= 0 && key < alpha.length) alpha[key] = 0;
  return { width: field.cols, height: field.rows, alpha };
}

/** Destination of an object-fit:contain frame, relative to a detached piece. */
export function containedMediaPlacement(sourceWidth, sourceHeight, targetWidth, targetHeight, pieceX, pieceY) {
  if (![sourceWidth, sourceHeight, targetWidth, targetHeight, pieceX, pieceY].every(Number.isFinite)
      || sourceWidth <= 0 || sourceHeight <= 0 || targetWidth <= 0 || targetHeight <= 0) return null;
  const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = sourceWidth * scale, height = sourceHeight * scale;
  return { x: (targetWidth - width) / 2 - pieceX, y: (targetHeight - height) / 2 - pieceY, width, height };
}

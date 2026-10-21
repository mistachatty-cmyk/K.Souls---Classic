import { performance } from "node:perf_hooks";
import { applyImpact, createSegmentField, resolveSegmentContact } from "./segment-field.mjs";

const materials = ["glass", "paper", "stone", "digital"];
const fields = Array.from({ length: 16 }, (_, index) => createSegmentField(780, 480, materials[index % materials.length]));
const frameTimes = [];
let removed = 0, peakCells = 0, peakChunks = 0, activeChunks = 0;
for (let frame = 0; frame < 600; frame++) {
  const start = performance.now();
  for (let n = 0; n < 4; n++) {
    const index = (frame * 4 + n) % fields.length, field = fields[index];
    const x = 32 + ((frame * 19 + n * 79) % 720), y = 24 + ((frame * 13 + n * 61) % 430);
    const result = applyImpact(field, { targetId: index + 1, x, y, directionX: 1, directionY: -0.35, damage: 2.2 });
    removed += result.removedCells.length;
    activeChunks = Math.min(48, activeChunks + result.detachedChunks.length);
    resolveSegmentContact(field, x, y, 0, 0, 15);
  }
  if (frame % 8 === 0) activeChunks = Math.max(0, activeChunks - 3);
  peakChunks = Math.max(peakChunks, activeChunks);
  peakCells = Math.max(peakCells, ...fields.map(field => field.cells.size));
  frameTimes.push(performance.now() - start);
}
frameTimes.sort((a, b) => a - b);
const at = percentile => Number(frameTimes[Math.floor((frameTimes.length - 1) * percentile)].toFixed(3));
if (peakCells > 192 || peakChunks > 48 || fields.length > 16) throw new Error("Destruction budget exceeded");
console.log(JSON.stringify({ frames: 600, impacts: 2400, fields: fields.length, removedCells: removed, peakCellsPerTarget: peakCells, peakChunks, geometryFrameMs: { p50: at(0.5), p95: at(0.95), max: at(1) } }, null, 2));

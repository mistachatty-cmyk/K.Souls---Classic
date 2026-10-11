import { ARENA_W, ARENA_H, SCOREBOARD_H, GRID_CELL_SIZE, BASE_PARTS } from "../game/constants";
import type { GameState, ThemeMode, GameMode, OpponentMode, LokModifier, CameraMode, WeaponStyle, Environment, ViewMode, WeaponType, KineticType, SkinType, Character } from "../game/types";
import { drawWeapon, renderChar } from "./DrawEntities";

// ─── THEME BACKGROUND DRAW ───────────────────────────────────────────────────
/**
 * Draws the dynamic background for the entire game, including menus and the arena.
 * Each theme has a distinct color palette and optional ambient effects (e.g., floating pixels, gradients).
 * 
 * @param ctx The Canvas 2D Context
 * @param theme The active ThemeMode (e.g., 'classic', 'neon', 'blood_moon')
 * @param ts The current timestamp from requestAnimationFrame (used for animations)
 * @param w The width of the area to fill
 * @param h The height of the area to fill
 * @param yOff The vertical offset (usually 0 for menus, SCOREBOARD_H for the arena)
 */
export function drawThemeBackground(
  ctx: CanvasRenderingContext2D,
  theme: ThemeMode,
  ts: number,
  w: number,
  h: number,
  yOff: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, yOff, w, h);
  ctx.clip();

  if (theme === "blood_moon") {
    const pulse = 0.5 + 0.5 * Math.sin(ts * 0.001);
    const r = Math.floor(60 + pulse * 30);
    ctx.fillStyle = `rgb(${r},0,0)`;
    ctx.fillRect(0, yOff, w, h);
    ctx.fillStyle = `rgba(255,80,0,${0.15 + pulse * 0.1})`;
    ctx.beginPath();
    ctx.arc(w * 0.75, yOff + h * 0.2, 80 + pulse * 20, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 30; i++) {
      const sx = ((i * 137 + ts * 0.01) % w);
      const sy = yOff + (i * 97) % h;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.2 * Math.sin(ts * 0.002 + i)})`;
      ctx.fillRect(sx, sy, 1, 1);
    }
  } else if (theme === "rgb_cycle") {
    const hue = (ts * 0.05) % 360;
    ctx.fillStyle = `hsl(${hue}, 60%, 8%)`;
    ctx.fillRect(0, yOff, w, h);
    const grd = ctx.createLinearGradient(0, yOff, w, yOff + h);
    grd.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.08)`);
    grd.addColorStop(1, `hsla(${(hue + 180) % 360}, 100%, 50%, 0.08)`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "celestial_forge") {
    ctx.fillStyle = "#04000f";
    ctx.fillRect(0, yOff, w, h);
    for (let i = 0; i < 50; i++) {
      const sx = (i * 179) % w;
      const sy = yOff + (i * 113) % h;
      const brightness = 0.4 + 0.6 * Math.sin(ts * 0.003 + i);
      ctx.fillStyle = `rgba(180,200,255,${brightness * 0.6})`;
      ctx.fillRect(sx, sy, 1 + (i % 2), 1 + (i % 2));
    }
    ctx.fillStyle = "rgba(0,80,200,0.05)";
    const cx2 = w / 2 + Math.sin(ts * 0.001) * 80;
    const cy2 = yOff + h / 2 + Math.cos(ts * 0.0008) * 60;
    const grd2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 200);
    grd2.addColorStop(0, "rgba(100,150,255,0.15)");
    grd2.addColorStop(1, "transparent");
    ctx.fillStyle = grd2;
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "synthwave") {
    ctx.fillStyle = "#0d001a";
    ctx.fillRect(0, yOff, w, h);
    const grd3 = ctx.createLinearGradient(0, yOff + h * 0.3, 0, yOff + h);
    grd3.addColorStop(0, "rgba(80,0,120,0.6)");
    grd3.addColorStop(1, "rgba(180,0,80,0.8)");
    ctx.fillStyle = grd3;
    ctx.fillRect(0, yOff + h * 0.5, w, h * 0.5);
    ctx.strokeStyle = "rgba(255,0,255,0.4)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < w; gx += 40) {
      ctx.beginPath();
      ctx.moveTo(gx, yOff + h * 0.5);
      ctx.lineTo(w / 2, yOff + h);
      ctx.stroke();
    }
    for (let gy = 0; gy < h * 0.5; gy += 30) {
      const progress = gy / (h * 0.5);
      const lineY = yOff + h * 0.5 + gy;
      ctx.globalAlpha = progress * 0.6;
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(w, lineY);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,220,0,0.6)";
    ctx.beginPath();
    ctx.arc(w / 2, yOff + h * 0.25, 50, 0, Math.PI * 2);
    ctx.fill();
  } else if (theme === "wireframe_matrix") {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, yOff, w, h);
    ctx.strokeStyle = "rgba(0,255,0,0.15)";
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx < w; gx += GRID_CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(gx, yOff);
      ctx.lineTo(gx, yOff + h);
      ctx.stroke();
    }
    for (let gy = 0; gy < h; gy += GRID_CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, yOff + gy);
      ctx.lineTo(w, yOff + gy);
      ctx.stroke();
    }
  } else if (theme === "glassmorphism") {
    const grd4 = ctx.createLinearGradient(0, yOff, w, yOff + h);
    grd4.addColorStop(0, "#1a1a2e");
    grd4.addColorStop(1, "#16213e");
    ctx.fillStyle = grd4;
    ctx.fillRect(0, yOff, w, h);
    for (let i = 0; i < 5; i++) {
      const bx = ((i * 200 + ts * 0.02) % (w + 200)) - 100;
      const by = yOff + (i * 150) % h;
      const bgrd = ctx.createRadialGradient(bx, by, 0, bx, by, 150);
      bgrd.addColorStop(
        0,
        i % 2 === 0 ? "rgba(255,100,100,0.06)" : "rgba(100,100,255,0.06)",
      );
      bgrd.addColorStop(1, "transparent");
      ctx.fillStyle = bgrd;
      ctx.fillRect(0, yOff, w, h);
    }
  } else if (theme === "paper_sketch") {
    ctx.fillStyle = "#f5f0e8";
    ctx.fillRect(0, yOff, w, h);
    ctx.strokeStyle = "rgba(100,80,60,0.08)";
    ctx.lineWidth = 1;
    for (let gy = 0; gy < h; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, yOff + gy);
      ctx.lineTo(w, yOff + gy);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(200,150,120,0.12)";
    for (let gx = 0; gx < w; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, yOff);
      ctx.lineTo(gx, yOff + h);
      ctx.stroke();
    }
  } else if (theme === "abyss" || theme === "hacker") {
    ctx.fillStyle = theme === "hacker" ? "#000800" : "#000";
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "cyberpunk") {
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, yOff, w, h);
    ctx.strokeStyle = "rgba(255, 0, 128, 0.25)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < w; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, yOff); ctx.lineTo(gx, yOff + h); ctx.stroke();
    }
    ctx.strokeStyle = "rgba(0, 255, 255, 0.25)";
    for (let gy = 0; gy < h; gy += 40) {
      ctx.beginPath(); ctx.moveTo(0, yOff + gy); ctx.lineTo(w, yOff + gy); ctx.stroke();
    }
    // Floating tech specs
    ctx.fillStyle = "rgba(255, 255, 0, 0.15)";
    for (let i = 0; i < 20; i++) {
       ctx.fillRect((i * 87 + ts * 0.05) % w, yOff + (i * 93) % h, 10 + (i % 20), 4);
    }
  } else if (theme === "ethereal") {
    ctx.fillStyle = "#f0f4f8";
    ctx.fillRect(0, yOff, w, h);
    const grd = ctx.createLinearGradient(0, yOff, 0, yOff + h);
    grd.addColorStop(0, "rgba(200, 230, 255, 0.8)");
    grd.addColorStop(1, "rgba(255, 255, 255, 0.1)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, yOff, w, h);
    for (let i = 0; i < 15; i++) {
       const ox = (i * 300 + ts * 0.01) % (w + 100) - 50;
       const oy = yOff + (i * 200 + Math.sin(ts * 0.001 + i) * 50) % h;
       ctx.beginPath();
       ctx.arc(ox, oy, 40 + i * 5, 0, Math.PI * 2);
       ctx.fillStyle = "rgba(150, 210, 255, 0.08)";
       ctx.fill();
    }
  } else if (theme === "wasteland") {
    ctx.fillStyle = "#2b2218";
    ctx.fillRect(0, yOff, w, h);
    const grd = ctx.createLinearGradient(0, yOff, w, yOff + h);
    grd.addColorStop(0, "rgba(120, 80, 40, 0.3)");
    grd.addColorStop(1, "rgba(40, 25, 10, 0.8)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, yOff, w, h);
    ctx.fillStyle = "rgba(200, 150, 100, 0.2)";
    for(let i = 0; i < 50; i++) {
       ctx.fillRect((i * 123 + ts * 0.04) % w, yOff + (i * 321 + ts * 0.02) % h, 2, 2);
    }
  } else if (theme === "void") {
    ctx.fillStyle = "#020005";
    ctx.fillRect(0, yOff, w, h);
    const pulse = Math.sin(ts * 0.001) * 0.5 + 0.5;
    const grd = ctx.createRadialGradient(w/2, yOff + h/2, 0, w/2, yOff + h/2, 200 + pulse * 100);
    grd.addColorStop(0, "rgba(80, 0, 150, 0.2)");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(0, yOff, w, h);
    ctx.fillStyle = "rgba(150, 50, 255, 0.5)";
    for (let i = 0; i < 30; i++) {
       ctx.beginPath();
       ctx.arc((i * 173) % w, yOff + (i * 231 + ts * 0.01) % h, 1 + Math.sin(ts * 0.005 + i), 0, Math.PI * 2);
       ctx.fill();
    }
  } else if (theme === "outrun") {
    const grd = ctx.createLinearGradient(0, yOff, 0, yOff + h);
    grd.addColorStop(0, "#000022");
    grd.addColorStop(0.5, "#440044");
    grd.addColorStop(0.55, "#ff0055");
    grd.addColorStop(1, "#000000");
    ctx.fillStyle = grd;
    ctx.fillRect(0, yOff, w, h);
    ctx.fillStyle = "#ffaa00";
    ctx.beginPath(); ctx.arc(w/2, yOff + h * 0.5, 80, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#000022";
    for(let i = 0; i < 5; i++) ctx.fillRect(w/2 - 90, yOff + h * 0.5 - (i * 12) - 5, 180, 3 + i * 1.5);
    ctx.strokeStyle = "rgba(0, 255, 255, 0.6)";
    ctx.lineWidth = 1.5;
    const horizon = yOff + h * 0.55;
    for(let i = -w; i <= w * 2; i += 40) {
       ctx.beginPath(); ctx.moveTo(w/2, horizon); ctx.lineTo(i, yOff + h); ctx.stroke();
    }
    for(let j = 0; j < h * 0.45; j += 15) {
       const progress = j / (h * 0.45);
       const yPos = horizon + Math.pow(progress, 2) * (h * 0.45);
       ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(w, yPos); ctx.stroke();
    }
  } else if (theme === "frostbite") {
    const grd = ctx.createLinearGradient(0, yOff, w, yOff + h);
    grd.addColorStop(0, "#dbeef5");
    grd.addColorStop(1, "#8bbdd9");
    ctx.fillStyle = grd;
    ctx.fillRect(0, yOff, w, h);
    const vig = ctx.createRadialGradient(w/2, yOff + h/2, h/4, w/2, yOff + h/2, h);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(1, "rgba(255,255,255,0.9)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, yOff, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    for(let i = 0; i < 40; i++) {
       ctx.beginPath();
       ctx.arc((i * 99 + Math.sin(ts * 0.001 + i) * 20) % w, yOff + (i * 151 + ts * 0.03) % h, 1 + (i % 2), 0, Math.PI * 2);
       ctx.fill();
    }
  } else if (theme === "solaris") {
    ctx.fillStyle = "#1a0d00";
    ctx.fillRect(0, yOff, w, h);
    const sunPulse = Math.sin(ts * 0.001) * 20;
    const grd = ctx.createRadialGradient(w/2, yOff + h/2, 50, w/2, yOff + h/2, 400 + sunPulse);
    grd.addColorStop(0, "#ff8800");
    grd.addColorStop(0.2, "#ff4400");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, yOff, w, h);
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "rgba(255, 200, 0, 0.1)";
    for (let i = 0; i < 10; i++) {
      const lineY = yOff + (ts * 0.05 + i * 100) % h;
      ctx.beginPath(); ctx.moveTo(0, lineY); ctx.lineTo(w, lineY); ctx.stroke();
    }
  } else if (theme === "deepsea") {
    ctx.fillStyle = "#000b1a";
    ctx.fillRect(0, yOff, w, h);
    for (let i = 0; i < 20; i++) {
      const bx = (i * 137 + ts * 0.01) % w;
      const by = yOff + (i * 243 - ts * 0.02) % h;
      ctx.beginPath(); ctx.arc(bx, by, 2 + (i % 5), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 255, 255, 0.15)";
      ctx.fill();
    }
    const rayGrd = ctx.createLinearGradient(0, yOff, w, yOff + h);
    rayGrd.addColorStop(0, "rgba(0, 255, 255, 0.1)");
    rayGrd.addColorStop(1, "transparent");
    ctx.fillStyle = rayGrd;
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "liminal") {
    ctx.fillStyle = "#d1d1d1";
    ctx.fillRect(0, yOff, w, h);
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    ctx.strokeRect(40, yOff + 40, w - 80, h - 80);
    ctx.beginPath(); ctx.moveTo(0, yOff + h/2); ctx.lineTo(w, yOff + h/2); ctx.stroke();
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#000";
    ctx.font = "8px monospace";
    ctx.fillText("SECTOR-04 // STABLE", 10, yOff + 20);
  } else if (theme === "nebula") {
    ctx.fillStyle = "#05000a";
    ctx.fillRect(0, yOff, w, h);
    for (let i = 0; i < 3; i++) {
      const nx = (w/2) + Math.sin(ts * 0.0002 + i) * 100;
      const ny = yOff + (h/2) + Math.cos(ts * 0.0003 + i) * 100;
      const nGrd = ctx.createRadialGradient(nx, ny, 0, nx, ny, 300);
      nGrd.addColorStop(0, i === 0 ? "rgba(255, 0, 255, 0.15)" : i === 1 ? "rgba(0, 100, 255, 0.15)" : "rgba(255, 0, 100, 0.15)");
      nGrd.addColorStop(1, "transparent");
      ctx.fillStyle = nGrd;
      ctx.fillRect(0, yOff, w, h);
    }
  } else if (theme === "matrix_reloaded") {
    ctx.fillStyle = "#000800";
    ctx.fillRect(0, yOff, w, h);
    ctx.font = "10px monospace";
    ctx.fillStyle = "rgba(0, 255, 60, 0.25)";
    for (let i = 0; i < 40; i++) {
      const dropX = (i * 23) % w;
      const dropY = (ts * (0.05 + (i % 5) * 0.02) + i * 100) % h;
      const char = String.fromCharCode(0x30a0 + Math.random() * 96);
      ctx.fillText(char, dropX, yOff + dropY);
    }
    ctx.strokeStyle = "rgba(0, 255, 60, 0.05)";
    for (let gx = 0; gx < w; gx += 30) {
      ctx.beginPath(); ctx.moveTo(gx, yOff); ctx.lineTo(gx, yOff + h); ctx.stroke();
    }
  } else if (theme === "stellar_drift") {
    ctx.fillStyle = "#00020a";
    ctx.fillRect(0, yOff, w, h);
    for (let i = 0; i < 60; i++) {
      const speed = 0.05 + (i % 10) * 0.05;
      const sx = (i * 157 + ts * speed) % w;
      const sy = yOff + (i * 211) % h;
      const size = 1 + (i % 3);
      ctx.fillStyle = `rgba(200, 220, 255, ${0.3 + (i % 5) * 0.1})`;
      ctx.fillRect(sx, sy, size, size);
    }
    const coreGrd = ctx.createRadialGradient(w/2, yOff + h/2, 0, w/2, yOff + h/2, 400);
    coreGrd.addColorStop(0, "rgba(50, 0, 100, 0.2)");
    coreGrd.addColorStop(1, "transparent");
    ctx.fillStyle = coreGrd;
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "neon_pulse") {
    ctx.fillStyle = "#050010";
    ctx.fillRect(0, yOff, w, h);
    const pulse = Math.sin(ts * 0.002) * 0.5 + 0.5;
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + pulse * 0.1})`;
    ctx.lineWidth = 2;
    for (let r = 50; r < w; r += 100) {
      ctx.beginPath();
      ctx.arc(w/2, yOff + h/2, r + pulse * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (theme === "obsidian_shard") {
    ctx.fillStyle = "#0a0a0c";
    ctx.fillRect(0, yOff, w, h);
    ctx.strokeStyle = "rgba(100, 100, 110, 0.15)";
    for (let i = 0; i < 15; i++) {
      const x = (i * 123) % w;
      const y = yOff + (i * 321) % h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 50, y + 80);
      ctx.lineTo(x - 20, y + 100);
      ctx.closePath();
      ctx.stroke();
    }
  } else if (theme === "neon" || theme === "glitch" || theme === "neon_abyss") {
    ctx.fillStyle = "#0a0014";
    ctx.fillRect(0, yOff, w, h);
    for (let i = 0; i < 40; i++) {
      const hue = (ts * 0.1 + i * 9) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%, 0.08)`;
      ctx.fillRect((i * 37) % w, yOff + (i * 23) % h, 30 + (i % 20), 30 + (i % 20));
    }
  } else if (theme === "overdrive") {
    const ig = ctx.createLinearGradient(0, yOff, 0, yOff + h);
    ig.addColorStop(0, "#1a0000");
    ig.addColorStop(1, "#300500");
    ctx.fillStyle = ig;
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "neon_overdrive") {
    ctx.fillStyle = "#0a0014";
    ctx.fillRect(0, yOff, w, h);
    for (let i = 0; i < 40; i++) {
      const hue = (ts * 0.1 + i * 9) % 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%, 0.08)`;
      ctx.fillRect((i * 37) % w, yOff + (i * 23) % h, 30 + (i % 20), 30 + (i % 20));
    }
  } else if (theme === "retro_wave") {
    // Retro Wave: 80s synth wave aesthetic
    const grd = ctx.createLinearGradient(0, yOff, 0, yOff + h);
    grd.addColorStop(0, "#0d001a");
    grd.addColorStop(0.5, "#1a0033");
    grd.addColorStop(1, "#330066");
    ctx.fillStyle = grd;
    ctx.fillRect(0, yOff, w, h);
    // Sun/circle
    ctx.fillStyle = "rgba(255, 100, 0, 0.3)";
    ctx.beginPath();
    ctx.arc(w * 0.5, yOff + h * 0.3, 60, 0, Math.PI * 2);
    ctx.fill();
    // Grid lines
    ctx.strokeStyle = "rgba(0, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    for (let gy = yOff + h * 0.4; gy < yOff + h; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }
    for (let gx = 0; gx < w; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, yOff + h * 0.4);
      ctx.lineTo(w/2, yOff + h);
      ctx.stroke();
    }
  } else if (theme === "pixel_dream") {
    // Pixel Dream: Dreamy pixel art style
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, yOff, w, h);
    // Pixel grid
    const pixelSize = 8;
    ctx.fillStyle = "rgba(100, 100, 200, 0.1)";
    for (let px = 0; px < w; px += pixelSize) {
      for (let py = yOff; py < yOff + h; py += pixelSize) {
        if ((px + py) % (pixelSize * 2) === 0) {
          ctx.fillRect(px, py, pixelSize, pixelSize);
        }
      }
    }
    // Floating pixels
    for (let i = 0; i < 30; i++) {
      const px = (i * 113 + ts * 0.02) % w;
      const py = yOff + (i * 97 + Math.sin(ts * 0.001 + i) * 20) % h;
      ctx.fillStyle = `rgba(150, 200, 255, ${0.2 + 0.1 * Math.sin(ts * 0.002 + i)})`;
      ctx.fillRect(px, py, 4, 4);
    }
  } else if (theme === "celestial") {
    ctx.fillStyle = "#090918";
    ctx.fillRect(0, yOff, w, h);
    for (let i = 0; i < 40; i++) {
      const sx2 = (i * 211) % w;
      const sy2 = yOff + (i * 157) % h;
      const b2 = 0.3 + 0.7 * Math.sin(ts * 0.002 + i * 0.8);
      ctx.fillStyle = `rgba(255,255,200,${b2 * 0.5})`;
      ctx.fillRect(sx2, sy2, 1, 1);
    }
  } else if (theme === "classic") {
    ctx.fillStyle = "#080814";
    ctx.fillRect(0, yOff, w, h);
  } else {
    ctx.fillStyle = "#1a1a2a";
    ctx.fillRect(0, yOff, w, h);
  }
  ctx.restore();
}

// ─── DRAW BUTTON ─────────────────────────────────────────────────────────────
/**
 * Universal button drawing function used across all menus.
 * Handles theming, hover states, active states, and classic vs modern aesthetics.
 * 
 * @param ctx The Canvas 2D Context
 * @param text The label text to display on the button
 * @param x Top-left X coordinate
 * @param y Top-left Y coordinate
 * @param w Width of the button
 * @param h Height of the button
 * @param hover Whether the user's cursor is currently over the button
 * @param theme The active theme (changes button border/fill colors)
 * @param active Whether the button represents a currently selected state
 * @param isClassic If true, uses the blocky, retro aesthetic
 */
export function drawBtn(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  hover: boolean,
  theme: ThemeMode = "classic",
  active: boolean = false,
  isClassic: boolean = false
) {
  if (isClassic) {
    if (theme === "gameboy") {
      ctx.fillStyle = hover ? "#0f380f" : active ? "#306230" : "#8bac0f";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#0f380f";
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = active || hover ? "#9bbc0f" : "#0f380f";
    } else if (theme === "gilded" || theme === "lokmod") {
      ctx.fillStyle = hover ? "#553300" : active ? "#aa8800" : "#221100";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = active ? "#ffd700" : "#aa8800";
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = active || hover ? "#ffffff" : "#ffd700";
    } else {
      ctx.fillStyle = hover ? "#aa5500" : active ? "#443388" : "#222244";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = active ? "#9966ff" : "#445566";
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = active || hover ? "white" : "#8899aa";
    }
    ctx.font = hover ? "bold 13px monospace" : "11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + w / 2, y + h / 2);
    return;
  }

  const accent =
    theme === "neon" || theme === "neon_abyss" || theme === "cyberpunk"
      ? "#00ffff"
      : theme === "gameboy"
        ? "#9bbc0f"
        : theme === "runesite" || theme === "runesite_ultimate"
          ? "#b12a2a"
          : theme === "gsix"
            ? "#00f0ff"
            : theme === "gilded" || theme === "lokmod"
              ? "#ffd700"
              : theme === "blood_moon" || theme === "outrun" || theme === "infernal"
                ? "#ff0000"
                : theme === "synthwave"
                  ? "#ff00ff"
                  : theme === "celestial_forge" || theme === "frostbite"
                    ? "#00ffff"
                    : theme === "ethereal"
                      ? "#aaddff"
                      : theme === "wasteland"
                        ? "#ffaa55"
                        : theme === "void"
                          ? "#aa00ff"
                          : theme === "solaris"
                        ? "#ffaa00"
                        : theme === "deepsea"
                          ? "#00ffff"
                          : theme === "liminal"
                            ? "#ff0000"
                            : theme === "nebula"
                              ? "#ff00ff"
                              : theme === "matrix_reloaded"
                                ? "#00ff3c"
                                : theme === "stellar_drift"
                                  ? "#aaddff"
                                  : theme === "neon_pulse"
                                    ? "#00ffff"
                                    : theme === "obsidian_shard"
                                      ? "#888899"
                                      : "#6688ff";
  ctx.fillStyle = active
    ? accent
    : hover
      ? "rgba(255,255,255,0.18)"
      : "rgba(0,0,0,0.55)";
  ctx.strokeStyle = active ? "#fff" : hover ? accent : "rgba(255,255,255,0.3)";
  ctx.lineWidth = active || hover ? 2 : 1;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = active ? "#000" : "#fff";
  ctx.font = `bold ${Math.min(13, h * 0.5)}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + w / 2, y + h / 2);
}

// ─── MAIN MENU ───────────────────────────────────────────────────────────────
/**
 * Draws the Classic (Retro) Main Menu.
 * Features blocky buttons, optional ambient particles, pulsating titles, and a centralized layout.
 * 
 * @param ctx Canvas context
 * @param mode Current selected Game Mode
 * @param opp Current selected Opponent Mode
 * @param mouse Current mouse coordinates for hover states
 * @param ts Animation timestamp
 * @param state Full GameState reference for checking optional visual toggles
 * @param currentSplash Randomized splash text string
 */
export function drawClassicMainMenu(
  ctx: CanvasRenderingContext2D,
  mode: GameMode,
  opp: OpponentMode,
  mouse: { x: number; y: number },
  ts: number,
  state: GameState,
  currentSplash: string
) {
  const W = ARENA_W;
  const H = ARENA_H + SCOREBOARD_H;

  drawThemeBackground(ctx, state.theme, ts, W, H, 0);

  if (state.menuGrid) {
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, H);
      ctx.stroke();
    }
    for (let i = 0; i < H; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(W, i);
      ctx.stroke();
    }
  }

  if (state.menuDrift) {
    const drift = (ts * 0.02) % H;
    for (let i = 0; i < 40; i++) {
      const x = (i * 67 + 13) % W;
      const staticY = i * 83 + 7;
      let y = (staticY - drift) % H;
      if (y < 0) y += H;
      ctx.fillStyle = `rgba(80,60,150,${0.1 + (i % 5) * 0.04})`;
      ctx.fillRect(x, y, 6, 6);
     }
   }
    if (state.menuParticles && state.particleStyle !== "none") {
      if (state.particleStyle === "original") {
        const fall = (ts * 0.05) % H;
        for (let i = 0; i < 30; i++) {
          const x = (i * 89 + 31) % W;
          const staticY = i * 50 + 10;
          let y = (staticY + fall) % H;
          ctx.fillStyle = `rgba(200,200,255,${0.2 + (i % 4) * 0.1})`;
          ctx.fillRect(x, y, 2, 2);
        }
      } else if (state.particleStyle === "new") {
        for (let i = 0; i < 40; i++) {
          const x = (i * 73 + 17) % W;
          const offset = ((ts * 0.02) + i * 41) % H;
          ctx.fillStyle = "rgba(200,200,255,0.3)";
          if (i % 2 === 0) ctx.fillRect(x, offset, 2, 2);
          else ctx.fillRect(x, H - offset, 2, 2);
        }
     } else if (state.particleStyle === "sparkle") {
       const fall = (ts * 0.05) % H;
       for (let i = 0; i < 30; i++) {
         const x = (i * 89 + 31) % W;
         const staticY = i * 50 + 10;
         let y = (staticY + fall) % H;
         ctx.fillStyle = `rgba(255,255,200,${0.3 + (i % 3) * 0.2})`;
         ctx.fillRect(x, y, 3, 3);
       }
     } else if (state.particleStyle === "snow") {
       const fall = (ts * 0.03) % H;
       for (let i = 0; i < 50; i++) {
         const x = (i * 67 + 20) % W;
         const staticY = i * 30 + 5;
         let y = (staticY + fall) % H;
         ctx.fillStyle = `rgba(255,255,255,${0.4 + (i % 3) * 0.2})`;
         ctx.beginPath();
         ctx.arc(x, y, 1.5, 0, Math.PI * 2);
         ctx.fill();
       }
     }
   }

   ctx.textAlign = "center";

  if (state.menuTitleCircles) {
    ctx.save();
    ctx.strokeStyle = "rgba(200, 150, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(W / 2, 140, 100 + Math.sin(ts * 0.001) * 10, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(W / 2, 140, 120 + Math.cos(ts * 0.0015) * 10, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  if (state.menuPulse && state.titleStyle !== "minimal") {
    const pulse = 1 + Math.sin(ts / 150) * 0.03;
    ctx.translate(W / 2, 142);
    ctx.scale(pulse, pulse);
    ctx.translate(-W / 2, -142);
  }

  const titleY1 = 115 + Math.sin(ts * 0.002) * 5;
  const titleY2 = 170 + Math.sin(ts * 0.002 + 0.5) * 5;

  switch (state.titleStyle) {
    case "advanced":
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.font = "bold 64px monospace";
      ctx.fillText("KINETIC", W / 2 + 8, titleY1 + 8);
      ctx.fillText("SOULS", W / 2 + 8, titleY2 + 8);
      break;
    case "standard":
      ctx.fillStyle = "#441188";
      ctx.font = "bold 64px monospace";
      ctx.fillText("KINETIC", W / 2 + 4, titleY1 + 4);
      ctx.fillStyle = "#ccaaff";
      ctx.fillText("KINETIC", W / 2, titleY1);
      ctx.fillStyle = "#883300";
      ctx.font = "bold 64px monospace";
      ctx.fillText("SOULS", W / 2 + 4, titleY2 + 4);
      ctx.fillStyle = "#ff9944";
      ctx.fillText("SOULS", W / 2, titleY2);
      break;
    case "neon":
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ff00ff";
      ctx.fillStyle = "#ff00ff";
      ctx.font = "bold 64px monospace";
      ctx.fillText("KINETIC", W / 2, titleY1);
      ctx.shadowColor = "#00ffff";
      ctx.fillStyle = "#00ffff";
      ctx.fillText("SOULS", W / 2, titleY2);
      ctx.shadowBlur = 0;
      break;
    case "retro":
      ctx.fillStyle = "#0f0";
      ctx.font = "bold 64px monospace";
      ctx.fillText("KINETIC", W / 2, titleY1);
      ctx.fillText("SOULS", W / 2, titleY2);
      break;
    case "glitch":
      const offset = Math.sin(ts * 0.01) * 3;
      ctx.fillStyle = "#ff0000";
      ctx.fillText("KINETIC", W / 2 + offset, titleY1);
      ctx.fillStyle = "#00ff00";
      ctx.fillText("KINETIC", W / 2 - offset, titleY1);
      ctx.fillStyle = "#ff9944";
      ctx.fillText("KINETIC", W / 2, titleY1);
      ctx.fillStyle = "#ff0000";
      ctx.fillText("SOULS", W / 2 + offset, titleY2);
      ctx.fillStyle = "#00ff00";
      ctx.fillText("SOULS", W / 2 - offset, titleY2);
      ctx.fillStyle = "#ff9944";
      ctx.fillText("SOULS", W / 2, titleY2);
      break;
    case "minimal":
      ctx.fillStyle = "#fff";
      ctx.font = "bold 32px monospace";
      ctx.fillText("KINETIC SOULS", W / 2, 142);
      break;
    case "pixel":
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#ccaaff";
      ctx.font = "bold 64px monospace";
      ctx.fillText("KINETIC", W / 2, titleY1);
      ctx.fillStyle = "#ff9944";
      ctx.fillText("SOULS", W / 2, titleY2);
      ctx.imageSmoothingEnabled = true;
      break;
  }
  ctx.restore();

  ctx.save();
  const pulse = state.menuPulse ? 1 + Math.sin(ts / 150) * 0.03 : 1;
  ctx.translate(W / 2, 215);
  ctx.scale(pulse, pulse);
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(255, 215, 0, 0.6)";
  ctx.fillStyle = "#ffff00";
  ctx.font = "bold 15px monospace";
  ctx.fillText(currentSplash, 0, 0);
  ctx.restore();

  ctx.shadowBlur = 0;

  ctx.fillStyle = "#888";
  ctx.font = "bold 15px monospace";
  ctx.fillText("1 v 1   A U T O   B A T T L E   A R E N A", W / 2, 250);

  // Kinetic Souls 2 badge: keeps the Classic look but is clearly the "2" build
  ctx.save();
  ctx.textAlign = "left";
  ctx.font = "bold 64px monospace";
  ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#ffd700";
  ctx.fillText("2", W / 2 + 112, titleY2);
  ctx.shadowBlur = 0;
  ctx.font = "bold 11px monospace";
  ctx.fillStyle = "rgba(255, 215, 0, 0.85)";
  ctx.fillText("ALPHA", W / 2 + 114, titleY2 + 16);
  ctx.restore();
  ctx.fillStyle = "#aaa";
  ctx.font = "bold 16px monospace";
  ctx.fillText("GAME MODE", W / 2, 270);

  const modeHover1 = mouse.x >= W / 2 - 130 && mouse.x <= W / 2 - 15 && mouse.y >= 285 && mouse.y <= 321;
  drawBtn(ctx, "Timer: 2 Mins", W / 2 - 130, 285, 115, 36, modeHover1, state.theme, mode === "timer", true);

  const modeHover2 = mouse.x >= W / 2 + 15 && mouse.x <= W / 2 + 130 && mouse.y >= 285 && mouse.y <= 321;
  drawBtn(ctx, "Score: 10 Pts", W / 2 + 15, 285, 115, 36, modeHover2, state.theme, mode === "score", true);

  ctx.fillStyle = "#aaa";
  ctx.font = "bold 16px monospace";
  ctx.fillText("OPPONENT", W / 2, 358);

  const oppHover1 = mouse.x >= W / 2 - 130 && mouse.x <= W / 2 - 15 && mouse.y >= 373 && mouse.y <= 409;
  drawBtn(ctx, "Player vs Player", W / 2 - 130, 373, 115, 36, oppHover1, state.theme, opp === "pvp", true);

  const oppHover2 = mouse.x >= W / 2 + 15 && mouse.x <= W / 2 + 130 && mouse.y >= 373 && mouse.y <= 409;
  drawBtn(ctx, "Player vs Bot", W / 2 + 15, 373, 115, 36, oppHover2, state.theme, opp === "bot", true);

  const hostHover = mouse.x >= W / 2 - 130 && mouse.x <= W / 2 - 15 && mouse.y >= 415 && mouse.y <= 445;
  drawBtn(ctx, "Host Game", W / 2 - 130, 415, 115, 30, hostHover, state.theme, false, true);

  const joinHover = mouse.x >= W / 2 + 15 && mouse.x <= W / 2 + 130 && mouse.y >= 415 && mouse.y <= 445;
  drawBtn(ctx, "Join Game", W / 2 + 15, 415, 115, 30, joinHover, state.theme, false, true);

  const startHover = mouse.x >= W / 2 - 155 && mouse.x <= W / 2 - 5 && mouse.y >= 455 && mouse.y <= 499;
  drawBtn(ctx, "START GAME", W / 2 - 155, 455, 150, 44, startHover, state.theme, true, true);

  const xxlHover = mouse.x >= W / 2 + 5 && mouse.x <= W / 2 + 155 && mouse.y >= 455 && mouse.y <= 499;
  drawBtn(ctx, "XXL MODE", W / 2 + 5, 455, 150, 44, xxlHover, state.theme, false, true);

  const bestiaryHover = mouse.x >= W / 2 - 75 && mouse.x <= W / 2 + 75 && mouse.y >= 510 && mouse.y <= 540;
  drawBtn(ctx, "BESTIARY", W / 2 - 75, 510, 150, 30, bestiaryHover, state.theme, false, true);

  ctx.fillStyle = "#666";
  ctx.font = "12px monospace";
  ctx.textBaseline = "middle";
  ctx.fillText("P1: Press [A] to spawn  |  P2: Press [L] to spawn", W / 2, 545);
  ctx.fillText("Characters bounce around and fight automatically!", W / 2, 565);
  ctx.textBaseline = "alphabetic";

  const lokHover = mouse.x >= W - 160 && mouse.x <= W - 10 && mouse.y >= H - 40 && mouse.y <= H - 10;
  ctx.fillStyle = lokHover ? "#ffe033" : "#ffd700";
  ctx.fillRect(W - 160, H - 40, 150, 30);
  ctx.strokeStyle = "#aa8800";
  ctx.lineWidth = 1;
  ctx.strokeRect(W - 160, H - 40, 150, 30);
  ctx.fillStyle = "#000";
  ctx.font = "bold 12px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("LoK Game Modifiers", W - 85, H - 25);

  const setHover = mouse.x >= 10 && mouse.x <= 160 && mouse.y >= H - 40 && mouse.y <= H - 10;
  ctx.fillStyle = setHover ? "#aaccff" : "#88aaff";
  ctx.fillRect(10, H - 40, 150, 30);
  ctx.strokeStyle = "#4466aa";
  ctx.lineWidth = 1;
  ctx.strokeRect(10, H - 40, 150, 30);
  ctx.fillStyle = "#000";
  ctx.font = "bold 12px monospace";
  ctx.fillText("Menu Settings", 85, H - 25);
  ctx.textBaseline = "alphabetic";
}

/**
 * Draws the Modern (Alternative) Main Menu.
 * Features sleek buttons, cleaner typography, and left-aligned option columns.
 * Completely respects all visual toggles (Particles, Title Styles, Rings) just like the Classic menu.
 * 
 * @param ctx Canvas context
 * @param mode Current selected Game Mode
 * @param opp Current selected Opponent Mode
 * @param mouse Current mouse coordinates for hover states
 * @param ts Animation timestamp
 * @param state Full GameState reference for checking optional visual toggles
 * @param currentSplash Randomized splash text string
 */
export function drawModernMainMenu(
  ctx: CanvasRenderingContext2D,
  mode: GameMode,
  opp: OpponentMode,
  mouse: { x: number; y: number },
  ts: number,
  state: GameState,
  currentSplash: string
) {
  const W = ARENA_W;
  const H = ARENA_H + SCOREBOARD_H;
  const theme = state.theme;

  drawThemeBackground(ctx, theme, ts, W, H, 0);

  if (state.menuGrid) {
    ctx.strokeStyle =
      theme === "gameboy"
        ? "rgba(15,56,15,0.25)"
        : theme === "paper_sketch"
          ? "rgba(0,0,0,0.08)"
          : "rgba(100,120,255,0.08)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += GRID_CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    for (let gy = 0; gy < H; gy += GRID_CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }
  }

  if (state.menuDrift) {
    const drift = (ts * 0.02) % H;
    for (let i = 0; i < 40; i++) {
      const x = (i * 67 + 13) % W;
      const staticY = i * 83 + 7;
      let y = (staticY - drift) % H;
      if (y < 0) y += H;
      ctx.fillStyle = `rgba(80,60,150,${0.1 + (i % 5) * 0.04})`;
      ctx.fillRect(x, y, 6, 6);
    }
  }
   if (state.menuParticles && state.particleStyle !== "none") {
     if (state.particleStyle === "original") {
        const fall = (ts * 0.05) % H;
        for (let i = 0; i < 30; i++) {
          const x = (i * 89 + 31) % W;
          const staticY = i * 50 + 10;
          let y = (staticY + fall) % H;
          ctx.fillStyle = `rgba(200,200,255,${0.2 + (i % 4) * 0.1})`;
          ctx.fillRect(x, y, 2, 2);
        }
     } else if (state.particleStyle === "new") {
        for (let i = 0; i < 40; i++) {
          const x = (i * 73 + 17) % W;
          const offset = ((ts * 0.02) + i * 41) % H;
          ctx.fillStyle = "rgba(200,200,255,0.3)";
          if (i % 2 === 0) ctx.fillRect(x, offset, 2, 2);
          else ctx.fillRect(x, H - offset, 2, 2);
        }
     }
   }

  if (state.menuTitleCircles) {
    ctx.save();
    ctx.strokeStyle = "rgba(200, 150, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(W / 2, 54, 80 + Math.sin(ts * 0.001) * 10, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(W / 2, 54, 100 + Math.cos(ts * 0.0015) * 10, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  if (state.menuPulse && state.titleStyle !== "minimal") {
    const scalePulse = 1 + Math.sin(ts / 150) * 0.03;
    ctx.translate(W / 2, 54);
    ctx.scale(scalePulse, scalePulse);
    ctx.translate(-W / 2, -54);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  switch (state.titleStyle) {
    case "neon":
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00ffff";
      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 48px monospace";
      ctx.fillText("KINETIC SOULS", W / 2, 30);
      ctx.shadowBlur = 0;
      break;
    case "retro":
      ctx.fillStyle = "#0f0";
      ctx.font = "bold 48px monospace";
      ctx.fillText("KINETIC SOULS", W / 2, 30);
      break;
    case "glitch":
      const offset = Math.sin(ts * 0.01) * 3;
      ctx.font = "bold 48px monospace";
      ctx.fillStyle = "#ff0000";
      ctx.fillText("KINETIC SOULS", W / 2 + offset, 30);
      ctx.fillStyle = "#00ff00";
      ctx.fillText("KINETIC SOULS", W / 2 - offset, 30);
      ctx.fillStyle = "#ffffff";
      ctx.fillText("KINETIC SOULS", W / 2, 30);
      break;
    case "minimal":
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "32px sans-serif";
      ctx.fillText("KINETIC SOULS", W / 2, 40);
      break;
    case "pixel":
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px monospace";
      ctx.fillText("KINETIC SOULS", W / 2, 30);
      ctx.imageSmoothingEnabled = true;
      break;
    case "advanced":
    case "standard":
    default:
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px monospace";
      ctx.fillText("KINETIC SOULS", W / 2, 30);
      break;
  }
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "12px monospace";
  ctx.fillText("Welcome back, Sire.", W / 2, 84);

  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.font = "11px monospace";
  const splash = currentSplash;
  ctx.fillText(splash, W / 2, 100);

  const bw = 160, bh = 34, gapY = 10;
  const col1X = W / 2 - bw - 10;
  const col2X = W / 2 + 10;

  const modeButtons: { label: string; value: GameMode }[] = [
    { label: "⏱ Timer", value: "timer" },
    { label: "🏆 Score", value: "score" },
    { label: "♾ Unlimited", value: "unlimited" },
    { label: "🧟 Horde", value: "horde" },
    { label: "🦠 Infection", value: "infection" },
  ];
  const oppButtons: { label: string; value: string }[] = [
    { label: "👥 PvP", value: "pvp" },
    { label: "🤖 vs Bot", value: "bot" },
    { label: "⚔ FFA", value: "ffa" },
    { label: "🌐 Host Game", value: "host" },
    { label: "🔗 Join Game", value: "join" },
  ];

  let sY = 130;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "10px monospace";
  ctx.textAlign = "left";
  ctx.fillText("MODE", col1X, sY);
  ctx.textAlign = "left";
  ctx.fillText("OPPONENT", col2X, sY);
  sY += 14;

  const maxRows = Math.max(modeButtons.length, oppButtons.length);
  for (let i = 0; i < maxRows; i++) {
    if (modeButtons[i]) {
      const bx = col1X, by = sY + i * (bh + gapY);
      const hover =
        mouse.x >= bx &&
        mouse.x <= bx + bw &&
        mouse.y >= by &&
        mouse.y <= by + bh;
      drawBtn(ctx, modeButtons[i].label, bx, by, bw, bh, hover, theme, mode === modeButtons[i].value);
    }
    if (oppButtons[i]) {
      const bx = col2X, by = sY + i * (bh + gapY);
      const hover =
        mouse.x >= bx &&
        mouse.x <= bx + bw &&
        mouse.y >= by &&
        mouse.y <= by + bh;
      drawBtn(ctx, oppButtons[i].label, bx, by, bw, bh, hover, theme, opp === oppButtons[i].value);
    }
  }

  sY += maxRows * (bh + gapY) + 16;

  const bigBtns: { label: string; y: number }[] = [
    { label: "▶  START GAME", y: sY },
    { label: "🌌 XXL ARENA", y: sY + bh + gapY },
    { label: "⚙  LOK MENU", y: sY + (bh + gapY) * 2 },
    { label: "🎨 SETTINGS", y: sY + (bh + gapY) * 3 },
    { label: "📖 BESTIARY", y: sY + (bh + gapY) * 4 },
  ];
  const bbW = 340, bbH = 34;
  const bbX = W / 2 - bbW / 2;
  for (const btn of bigBtns) {
    const hover =
      mouse.x >= bbX &&
      mouse.x <= bbX + bbW &&
      mouse.y >= btn.y &&
      mouse.y <= btn.y + bbH;
    drawBtn(ctx, btn.label, bbX, btn.y, bbW, bbH, hover, theme);
  }

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "10px monospace";
  ctx.textAlign = "center";
  ctx.fillText(
    "A = Spawn P1 · L = Spawn P2 · Q = Auto · P = Pause · M = Live Mods",
    W / 2,
    H - 14,
  );
}

export function drawMainMenu(
  ctx: CanvasRenderingContext2D,
  mode: GameMode,
  opp: OpponentMode,
  mouse: { x: number; y: number },
  ts: number,
  state: GameState,
  currentSplash: string
) {
  if (state.classicMenu) {
    drawClassicMainMenu(ctx, mode, opp, mouse, ts, state, currentSplash);
  } else {
    drawModernMainMenu(ctx, mode, opp, mouse, ts, state, currentSplash);
  }
}

// ─── LOK MENU DATA ───────────────────────────────────────────────────────────
export const LOK_MENU_DATA = [
  {
    label: "THEME", key: "theme", col: 0, row: 0,
    items: [
      { label: "── CORE ──", value: "header" },
      { label: "Classic", value: "classic" },
      { label: "GSix", value: "gsix" },
      { label: "Runesite", value: "runesite" },
      { label: "Runesite Ult", value: "runesite_ultimate" },
      { label: "Gilded", value: "gilded" },
      { label: "LokMod", value: "lokmod" },
      
      { label: "── RETRO ──", value: "header" },
      { label: "Gameboy", value: "gameboy" },
      { label: "Neon", value: "neon" },
      { label: "Synthwave", value: "synthwave" },
      { label: "Outrun", value: "outrun" },
      { label: "Comic Book", value: "comic" },
      { label: "Paper", value: "paper_sketch" },
      
      { label: "── DARK ──", value: "header" },
      { label: "Abyss", value: "abyss" },
      { label: "The Void", value: "void" },
      { label: "Vampire", value: "vampire" },
      { label: "Blood Moon", value: "blood_moon" },
      { label: "Infernal", value: "infernal" },
      { label: "Overdrive", value: "overdrive" },
      { label: "Monochrome", value: "monochrome" },
      
      { label: "── SCI-FI ──", value: "header" },
      { label: "Cyberpunk", value: "cyberpunk" },
      { label: "Hacker", value: "hacker" },
      { label: "Glitch", value: "glitch" },
      { label: "Matrix", value: "wireframe_matrix" },
      { label: "Neon Abyss", value: "neon_abyss" },
      { label: "Neon OD", value: "neon_overdrive" },
      { label: "Glass", value: "glassmorphism" },
      
      { label: "── FANTASY ──", value: "header" },
      { label: "Ethereal", value: "ethereal" },
      { label: "Celestial", value: "celestial" },
      { label: "Cel. Forge", value: "celestial_forge" },
      
      { label: "── WORLD ──", value: "header" },
      { label: "Oceanic", value: "oceanic" },
      { label: "Wasteland", value: "wasteland" },
      { label: "Frostbite", value: "frostbite" },
      { label: "Solaris", value: "solaris" },
      { label: "Deepsea", value: "deepsea" },
      { label: "Liminal", value: "liminal" },
      { label: "Nebula", value: "nebula" },
      { label: "Matrix Rld", value: "matrix_reloaded" },
      { label: "Stellar", value: "stellar_drift" },
      { label: "Neon Pulse", value: "neon_pulse" },
      { label: "Obsidian", value: "obsidian_shard" },
      { label: "RGB Cycle", value: "rgb_cycle" },
    ]
  },
  {
    label: "MODIFIER", key: "mod", col: 1, row: 0,
    items: [
      { label: "None", value: "none" },
      { label: "Sudden Death", value: "sudden_death" },
      { label: "Titans", value: "titans" },
      { label: "Shrinking", value: "shrinking_arena" },
      { label: "Vampire Kiss", value: "vampire_kiss" },
      { label: "Necromancy", value: "necromancy" },
      { label: "AI Magnetic", value: "magnet" },
      { label: "AI Repel", value: "repel" },
      { label: "LoK Bounty", value: "lok_bounty" },
      { label: "Roaming Sink", value: "gravity_well" },
      { label: "Time Dist", value: "time_distortion" },
      { label: "Chaos Vtx", value: "chaos_vortex" },
    ]
  },
  {
    label: "CAMERA", key: "cam", col: 2, row: 0,
    items: [
      { label: "Static", value: "static" },
      { label: "Dynamic", value: "dynamic" },
      { label: "Action", value: "action" },
      { label: "Enhanced", value: "enhanced" },
    ]
  },
  {
    label: "WEAPONS", key: "wep", col: 2, row: 1,
    items: [
      { label: "Standard", value: "standard" },
      { label: "Roulette", value: "roulette" },
      { label: "Melee Mash", value: "melee_mash" },
      { label: "Ranged", value: "ranged_test" },
    ]
  },
  {
    label: "ENVIRONMENT", key: "env", col: 1, row: 1,
    items: [
      { label: "None", value: "none" },
      { label: "Ice Rink", value: "ice" },
      { label: "Central Void", value: "blackhole" },
      { label: "Lava Floor", value: "lava" },
      { label: "Storm", value: "storm" },
      { label: "Bouncy", value: "bouncy" },
      { label: "Wraparound", value: "wrap" },
      { label: "Blackout", value: "blackout" },
      { label: "Solar Flares", value: "solar_flares" },
      { label: "Magnetic", value: "magnetic_fields" },
      { label: "Void Storm", value: "void_storm" },
    ]
  },
  {
    label: "VIEW MODE", key: "view", col: 2, row: 2,
    items: [
      { label: "Standard", value: "standard" },
      { label: "Theater", value: "theater" },
      { label: "Cinematic", value: "cinematic" },
    ]
  },
  {
    label: "AI AGGRESSION", key: "aiAggressive", col: 1, row: 2,
    items: [
      { label: "Classic Bounce", value: false },
      { label: "Hyper Chaos", value: true },
    ]
  }
];

// ─── LOK MENU ────────────────────────────────────────────────────────────────
/**
 * Draws the LoK Live Game Modifiers Menu (accessible both in-game and from the main menu).
 * Renders options in a column-based layout. Supports scrolling and hover states.
 * 
 * @param ctx Canvas context
 * @param state GameState for value checking
 * @param scrollY Current scroll offset for navigating long menus
 */
export function drawLokMenu(
  ctx: CanvasRenderingContext2D,
  mode: GameMode,
  theme: ThemeMode,
  mod: LokModifier,
  cam: CameraMode,
  wep: WeaponStyle,
  env: Environment,
  view: ViewMode,
  mouse: { x: number; y: number },
  state: GameState,
  ts: number,
  scrollY: number
) {
  void mode; void ts;
  const W = ARENA_W, H = ARENA_H + SCOREBOARD_H;
  drawThemeBackground(ctx, theme, ts, W, H, 0);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px monospace";
  ctx.textAlign = "center";
  ctx.fillText("⚙ LOK GAME MODIFIERS", W / 2, 22);

  const valueMap: Record<string, string | boolean> = {
     theme, mod, cam, wep, env, view, aiAggressive: state.aiAggressive
  };

  const colW = 290, colGap = 10;
  const startX = (W - (colW * 3 + colGap * 2)) / 2;
  const startY = 58 + scrollY;
  const bh = 24, bw = 130, gap = 5;
  const colY = [startY, startY, startY];

  // Scrollable content is clipped between the title (y<46) and the footer bar (y>H-60),
  // so BACK never covers list items and clicks there can't hit hidden buttons.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 46, W, H - 46 - 60);
  ctx.clip();

  for (const sec of LOK_MENU_DATA) {
    const colsInSec = sec.key === "theme" ? 2 : 1;
    const maxRows = Math.ceil(sec.items.length / colsInSec);
    
    const baseX = startX + sec.col * (colW + colGap);
    const baseY = colY[sec.col];
    
    ctx.fillStyle = "rgba(20, 10, 30, 0.7)";
    ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(baseX - 8, baseY - 20, (bw + gap) * colsInSec + 12, (maxRows * (bh + 3)) + 36, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 13px monospace";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
    ctx.textAlign = "left";
    ctx.fillText("⚡ " + sec.label, baseX, baseY - 4);
    ctx.shadowBlur = 0;

    sec.items.forEach((item, i) => {
      const col2 = Math.floor(i / maxRows);
      const row2 = i % maxRows;
      const bx = baseX + col2 * (bw + gap);
      const by = baseY + 12 + row2 * (bh + 3);

      if (item.value === "header") {
         ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
         ctx.font = "bold 11px monospace";
         ctx.textAlign = "center";
         ctx.fillText(item.label, bx + bw/2, by + bh/2 + 4);
         return;
      }

      const hover =
        mouse.x >= bx &&
        mouse.x <= bx + bw &&
        mouse.y >= by &&
        mouse.y <= by + bh;
      
      drawBtn(ctx, item.label, bx, by, bw, bh, hover, theme, valueMap[sec.key] === item.value);
    });
    
    colY[sec.col] = baseY + (maxRows * (bh + 3)) + 36 + 20;
  }
  ctx.restore();

  // Footer bar (solid) with the BACK button; scroll hint
  ctx.fillStyle = "rgba(8, 8, 20, 0.96)";
  ctx.fillRect(0, H - 60, W, 60);
  ctx.strokeStyle = "rgba(255, 215, 0, 0.35)";
  ctx.beginPath(); ctx.moveTo(0, H - 60); ctx.lineTo(W, H - 60); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "10px monospace";
  ctx.textAlign = "left";
  ctx.fillText("Scroll / drag to see more", 12, H - 26);

  const backW = 160, backH = 36;
  const backX = W / 2 - backW / 2, backY = H - 50;
  const bHover = mouse.x >= backX && mouse.x <= backX + backW && mouse.y >= backY && mouse.y <= backY + backH;
  drawBtn(ctx, "◀ BACK TO MENU", backX, backY, backW, backH, bHover, theme, false, state.classicMenu);
}

export const SETTINGS_DATA: {
  group: string;
  items: { label: string; key: any; type: "toggle" | "cycle"; desc: string }[];
}[] = [
  {
    group: "VISUALS & RENDERING",
    items: [
      { label: "HUD", key: "hud", type: "toggle", desc: "Toggle Heads-Up Display elements" },
      { label: "Trails", key: "trails", type: "toggle", desc: "Enable motion trails for projectiles" },
      { label: "Motion Blur", key: "motionBlur", type: "toggle", desc: "Adds smooth blur to fast movement" },
      { label: "CRT Filter", key: "crtFilter", type: "toggle", desc: "Simulate classic CRT screen artifacts" },
      { label: "VHS Filter", key: "vhsFilter", type: "toggle", desc: "Adds VHS tape aesthetic distortion" },
      { label: "Invert Filter", key: "invertFilter", type: "toggle", desc: "Invert the entire screen color palette" },
      { label: "Arena Ads", key: "ads", type: "toggle", desc: "Display dynamic background advertisements" },
      { label: "HP Bars", key: "hpBarStyle", type: "cycle", desc: "Change the visual style of entity health bars" },
      { label: "Text Style", key: "floatingTextStyle", type: "cycle", desc: "Change appearance of floating combat text" },
      { label: "Parallax Grid", key: "parallaxGrid", type: "toggle", desc: "Grid has depth and moves with camera" },
      { label: "Reactive Grid", key: "reactiveGrid", type: "toggle", desc: "Grid reacts to entities on it" },
      { label: "Pixel Perfect", key: "pixelPerfect", type: "toggle", desc: "Crisp pixel rendering (no anti-alias)" },
      { label: "Neon Afterimage", key: "neonAfterimage", type: "toggle", desc: "Glow trails behind moving entities" },
      { label: "Weapon Trails", key: "weaponTrails", type: "toggle", desc: "Trails behind weapon swings" },
      { label: "Dynamic Arena", key: "dynamicArena", type: "toggle", desc: "Arena background animates" },
      { label: "Soul Echoes", key: "soulEchoes", type: "toggle", desc: "Ghosts leave echo trails" },
      { label: "Critical Flash", key: "criticalFlash", type: "toggle", desc: "Screen flashes on critical hits" },
      { label: "Audio Visualizer", key: "audioVisualizer", type: "toggle", desc: "Show audio waveform in background" },
      { label: "Bestiary Sprites", key: "bestiarySprites", type: "toggle", desc: "Show unit sprites in bestiary" },
      { label: "Bestiary Boss FX", key: "bestiaryBossFx", type: "toggle", desc: "Boss effects in bestiary" },
      { label: "Arena Title", key: "arenaTitle", type: "toggle", desc: "Show title overlay in arena" },
      { label: "Minimap Logo", key: "minimapLogo", type: "toggle", desc: "Show logo on minimap" },
      { label: "Show Minimap", key: "showMinimap", type: "toggle", desc: "Toggles the display of the tactical radar map." },
      { label: "Minimap Position", key: "minimapPosition", type: "cycle", desc: "Change the on-screen location of the minimap." },
      { label: "Passport Border", key: "passportBorder", type: "toggle", desc: "Fancy borders on unit cards" },
      { label: "Title Style", key: "titleStyle", type: "cycle", desc: "Change the KINETIC SOULS title appearance" },
    ]
  },
  {
    group: "GAMEPLAY MODIFIERS",
    items: [
      { label: "AI Magnetic", key: "aiMagnetic", type: "toggle", desc: "AI units are attracted to the player" },
      { label: "AI Dash", key: "aiDash", type: "toggle", desc: "AI units dash to close distance" },
      { label: "Hand of God", key: "handOfGod", type: "toggle", desc: "Divine intervention in combat" },
      { label: "Moon Gravity", key: "moonGravity", type: "toggle", desc: "Low gravity physics environment" },
      { label: "Anti Gravity", key: "antiGravity", type: "toggle", desc: "Entities float upward" },
      { label: "Exploding Corpses", key: "explodingCorpses", type: "toggle", desc: "Enemies explode upon defeat" },
      { label: "Slo-Mo Kills", key: "sloMoKills", type: "toggle", desc: "Time slows down during final hits" },
      { label: "Rainbow Blood", key: "rainbowBlood", type: "toggle", desc: "Units bleed in color gradients" },
      { label: "Physics", key: "physicsMode", type: "cycle", desc: "Choose global physics simulation behavior" },
      { label: "Trick Shots", key: "trickShots", type: "toggle", desc: "Enable curved momentum and major contact bonuses" },
      { label: "Fruit Ninja FX", key: "fruitNinjaFx", type: "toggle", desc: "Slice effects on hit" },
      { label: "Time Dilation", key: "timeDilation", type: "toggle", desc: "Slow motion on special moves" },
      { label: "Gravity Inversion", key: "gravityInversion", type: "toggle", desc: "Flip gravity periodically" },
      { label: "Chaos Theory", key: "chaosTheory", type: "toggle", desc: "Random events during combat" },
      { label: "Chaos Mode", key: "chaosMode", type: "toggle", desc: "Pure chaos - everything random" },
      { label: "AI Aggressive", key: "aiAggressive", type: "toggle", desc: "AI attacks more frequently" },
    ]
  },
  {
    group: "ARENA SCALING (XXL)",
    items: [
      { label: "XXL Mode", key: "xxlMode", type: "toggle", desc: "Enable extra large arena with scaling" },
      { label: "XXL Scale", key: "xxlScale", type: "cycle", desc: "Multiplier for the XXL Mode arena size" },
      { label: "Cam Speed", key: "cameraSpeed", type: "cycle", desc: "How fast the camera tracks and zooms" },
      { label: "Uncapped XXL", key: "xxlPopcap", type: "toggle", desc: "Removes standard entity spawn delays in XXL" },
      { label: "Cinematic Zoom", key: "cinematicZoom", type: "toggle", desc: "Adds dramatic ease-in to camera movements" }
    ]
  },
  {
    group: "MENU & SYSTEM",
    items: [
        { label: "Menu Grid", key: "menuGrid", type: "toggle", desc: "Enable grid overlay on menu screens" },
        { label: "Menu Particles", key: "menuParticles", type: "toggle", desc: "Enable background menu particles" },
        { label: "Menu Drift", key: "menuDrift", type: "toggle", desc: "Enable gentle background movement" },
        { label: "Menu CRT", key: "menuCRT", type: "toggle", desc: "Apply CRT effect to menus" },
        { label: "Menu Pulse", key: "menuPulse", type: "toggle", desc: "Menus will pulse with the theme" },
        { label: "Title Circles", key: "menuTitleCircles", type: "toggle", desc: "Show fluctuating circles around title" },
        { label: "Menu Sim", key: "menuSimulator", type: "toggle", desc: "Run a simulation in the background" },
        { label: "Classic Menu", key: "classicMenu", type: "toggle", desc: "Use the legacy retro menu style" },
        { label: "Screensaver", key: "screensaverMode", type: "toggle", desc: "Enable idle screensaver mode" },
        { label: "Debug Grid", key: "optGridDebug", type: "toggle", desc: "Visually render the spatial partitioning grid" },
        { label: "Menu Advanced Title", key: "menuAdvancedTitle", type: "toggle", desc: "Fancy animated title on menus" },
        { label: "Minimap Text Pulse", key: "minimapTextPulse", type: "toggle", desc: "Minimap text pulses" },
        { label: "Lok Background", key: "lokBackgroundEnabled", type: "toggle", desc: "Show background in Lok menu" },
        { label: "Bounty Ends Game", key: "bountyEndsGame", type: "toggle", desc: "Bounty mode ends game on capture" },
        { label: "Show Version", key: "showVersionText", type: "toggle", desc: "Show version number on screen" },
        { label: "Theme Notify", key: "themeNotifyEnabled", type: "toggle", desc: "Show theme name popup when cycling" },
        { label: "Particle Style", key: "particleStyle", type: "cycle", desc: "Change the menu particle appearance" },
      ]
  }
];


/**
 * Draws the comprehensive Settings Menu.
 * FIXES: (1) Theme-aware colors. (2) "Main Menu" button at top-left, always visible.
 * (3) Scroll clip never traps the back button. (4) Scroll position indicator on right edge.
 */
export function drawSettingsMenu(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  ts: number,
  mouse: { x: number; y: number },
  scrollY: number = 0
) {
  const W = ARENA_W, H = ARENA_H + SCOREBOARD_H;
  drawThemeBackground(ctx, state.theme, ts, W, H, 0);

  const theme = state.theme;
  const accentColor =
    theme === "neon" || theme === "neon_abyss" || theme === "cyberpunk" || theme === "gsix" ? "#00ffff" :
    theme === "gameboy" ? "#9bbc0f" :
    theme === "runesite" || theme === "runesite_ultimate" ? "#cc4444" :
    theme === "gilded" || theme === "lokmod" ? "#ffd700" :
    theme === "blood_moon" || theme === "infernal" || theme === "overdrive" ? "#ff4444" :
    theme === "synthwave" ? "#ff00ff" :
    theme === "void" ? "#aa00ff" :
    theme === "paper_sketch" || theme === "comic" ? "#333" :
    "#6688ff";
  const headerTextColor = theme === "gameboy" ? "#0f380f" : theme === "paper_sketch" || theme === "comic" ? "#111" : "#fff";
  const headerBg =
    theme === "gameboy" ? "rgba(139,172,15,0.97)" :
    theme === "paper_sketch" || theme === "comic" ? "rgba(245,238,220,0.97)" :
    theme === "gilded" || theme === "lokmod" ? "rgba(16,8,0,0.97)" :
    "rgba(8,6,20,0.97)";
  const cardBg = theme === "paper_sketch" || theme === "comic" ? "rgba(255,255,255,0.65)" : theme === "gameboy" ? "rgba(139,172,15,0.25)" : "rgba(16,12,28,0.72)";
  const cardActiveBg =
    theme === "neon" || theme === "neon_abyss" || theme === "cyberpunk" || theme === "gsix" ? "rgba(0,255,255,0.12)" :
    theme === "blood_moon" || theme === "infernal" || theme === "overdrive" ? "rgba(255,40,0,0.15)" :
    theme === "gameboy" ? "rgba(15,56,15,0.55)" :
    "rgba(0,255,136,0.13)";
  const cardActiveStroke =
    theme === "neon" || theme === "neon_abyss" || theme === "cyberpunk" || theme === "gsix" ? "#00ffff" :
    theme === "blood_moon" || theme === "infernal" || theme === "overdrive" ? "#ff4444" :
    theme === "gameboy" ? "#0f380f" :
    theme === "gilded" || theme === "lokmod" ? "#ffd700" :
    "#00ff88";
  const enabledTextColor =
    theme === "neon" || theme === "neon_abyss" ? "#00ffff" :
    theme === "blood_moon" || theme === "infernal" || theme === "overdrive" ? "#ff6644" :
    theme === "gameboy" ? "#0f380f" :
    theme === "gilded" || theme === "lokmod" ? "#ffd700" :
    "#00ff88";

  // HEADER BAR (never clipped)
  const HEADER_H = 56;
  ctx.fillStyle = headerBg;
  ctx.fillRect(0, 0, W, HEADER_H);
  ctx.strokeStyle = accentColor; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, HEADER_H); ctx.lineTo(W, HEADER_H); ctx.stroke();

  ctx.fillStyle = accentColor; ctx.font = "bold 22px monospace"; ctx.textAlign = "center";
  ctx.shadowBlur = 10; ctx.shadowColor = accentColor;
  ctx.fillText("\u2699 SYSTEM CONFIGURATION", W / 2, 34);
  ctx.shadowBlur = 0;

  // MAIN MENU BUTTON (click zone x:12-182, y:11-45)
  const mmBtnW = 170, mmBtnH = 34, mmBtnX = 12, mmBtnY = 11;
  const mmHover = mouse.x >= mmBtnX && mouse.x <= mmBtnX + mmBtnW && mouse.y >= mmBtnY && mouse.y <= mmBtnY + mmBtnH;
  ctx.fillStyle = mmHover ? accentColor : "rgba(0,0,0,0.55)";
  ctx.strokeStyle = accentColor; ctx.lineWidth = mmHover ? 2 : 1.5;
  ctx.beginPath(); ctx.roundRect(mmBtnX, mmBtnY, mmBtnW, mmBtnH, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = mmHover ? "#000" : headerTextColor;
  ctx.font = "bold 13px monospace"; ctx.textAlign = "center";
  ctx.fillText("\u25c0 MAIN MENU", mmBtnX + mmBtnW / 2, mmBtnY + mmBtnH / 2 + 5);

  ctx.fillStyle = "rgba(255,255,255,0.28)"; ctx.font = "10px monospace"; ctx.textAlign = "right";
  ctx.fillText("\u25bc scroll or drag to see all options", W - 14, 48);

  // SCROLLABLE CONTENT (clipped below header only)
  const SCROLL_TOP = HEADER_H + 4;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, SCROLL_TOP, W, H - SCROLL_TOP); ctx.clip();

  const cardW = 210, cardH = 50, gap = 8, cols = 4;
  const startX = (W - (cols * cardW + (cols - 1) * gap)) / 2;
  let currentY = SCROLL_TOP + 16 + scrollY;

  SETTINGS_DATA.forEach(group => {
    ctx.fillStyle = `${accentColor}1a`;
    ctx.fillRect(startX - 8, currentY - 14, cols * cardW + (cols - 1) * gap + 16, 19);
    ctx.fillStyle = accentColor; ctx.font = "bold 13px monospace"; ctx.textAlign = "left";
    ctx.fillText("\u25b8 " + group.group, startX, currentY);
    currentY += 22;

    group.items.forEach((item, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const bx = startX + col * (cardW + gap), by = currentY + row * (cardH + gap);
      if (by + cardH < SCROLL_TOP || by > H + 100) return;

      const hover = mouse.x >= bx && mouse.x <= bx + cardW && mouse.y >= by && mouse.y <= by + cardH;
      const val = (state as any)[item.key];
      const active = item.type === "toggle" ? val === true : true;

      ctx.fillStyle = hover ? "rgba(255,255,255,0.15)" : (active && item.type === "toggle" ? cardActiveBg : cardBg);
      ctx.strokeStyle = hover ? "#fff" : (active && item.type === "toggle" ? cardActiveStroke : "rgba(255,255,255,0.14)");
      ctx.lineWidth = hover ? 1.5 : 1;
      ctx.beginPath(); ctx.roundRect(bx, by, cardW, cardH, 5); ctx.fill(); ctx.stroke();

      if (active && item.type === "toggle") { ctx.fillStyle = cardActiveStroke; ctx.fillRect(bx, by + 2, 3, cardH - 4); }

      ctx.fillStyle = active ? headerTextColor : "#777"; ctx.font = "bold 12px monospace"; ctx.textAlign = "left";
      ctx.fillText(item.label, bx + 10, by + 19);
      ctx.font = "10px monospace";
      if (item.type === "toggle") {
        ctx.fillStyle = active ? enabledTextColor : "#555";
        ctx.fillText(active ? "\u25cf ON" : "\u25cb OFF", bx + 10, by + 35);
      } else {
        ctx.fillStyle = accentColor;
        ctx.fillText("\u00bb " + String(val ?? "standard").toUpperCase().replace(/_/g, " "), bx + 10, by + 35);
      }

      if (hover && item.desc) {
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = "11px monospace";
        const tw = Math.min(ctx.measureText(item.desc).width + 24, 380);
        const tx = Math.min(W - tw - 10, Math.max(10, mouse.x - tw / 2));
        const ty2 = Math.min(H - 34, Math.max(SCROLL_TOP + 10, mouse.y + 16));
        ctx.fillStyle = "rgba(0,0,0,0.92)"; ctx.strokeStyle = accentColor; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(tx, ty2, tw, 24, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.textAlign = "center";
        ctx.fillText(item.desc, tx + tw / 2, ty2 + 15);
        ctx.restore();
      }
    });
    currentY += Math.ceil(group.items.length / cols) * (cardH + gap) + 28;
  });
  ctx.restore();

  // SCROLL POSITION INDICATOR (right edge)
  const estimatedContentH = SETTINGS_DATA.reduce((sum, g) =>
    sum + Math.ceil(g.items.length / cols) * (cardH + gap) + 22 + 28, 0);
  const visibleH = H - SCROLL_TOP;
  if (estimatedContentH > visibleH) {
    const scrollRatio = Math.min(1, Math.abs(scrollY) / Math.max(1, estimatedContentH - visibleH));
    const thumbH = Math.max(40, (visibleH / estimatedContentH) * visibleH);
    const thumbY = SCROLL_TOP + scrollRatio * (visibleH - thumbH);
    ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(W - 6, SCROLL_TOP, 4, visibleH);
    ctx.fillStyle = accentColor; ctx.globalAlpha = 0.45;
    ctx.beginPath(); ctx.roundRect(W - 6, thumbY, 4, thumbH, 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ─── GAME OVER ───────────────────────────────────────────────────────────────
/**
 * Draws the Match Conclusion / Game Over screen.
 * Displays the winner, final scores, and aggregate match statistics.
 */
export function drawGameOver(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  mouse: { x: number; y: number }
) {
  const W = ARENA_W, H = ARENA_H + SCOREBOARD_H;
  if (state.classicMenu) {
    ctx.fillStyle = "#080814";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#ccaaff";
    ctx.font = "bold 48px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", W / 2, 120);
    ctx.fillStyle = "#ffee88";
    ctx.font = "bold 32px monospace";
    ctx.fillText(state.winner, W / 2, 180);

    ctx.fillStyle = "rgba(10, 5, 20, 0.85)";
    ctx.fillRect(W / 2 - 280, 240, 560, 160);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - 280, 240, 560, 160);

    ctx.fillStyle = "#ff6655";
    ctx.font = "bold 26px monospace";
    ctx.fillText(`P1 Kills: ${state.p1Score}`, W / 2 - 140, 290);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px monospace";
    ctx.fillText("VS", W / 2, 290);
    ctx.fillStyle = "#5599ff";
    ctx.font = "bold 26px monospace";
    ctx.fillText(`Enemy Kills: ${state.p2Score}`, W / 2 + 140, 290);

    ctx.fillStyle = "#aaa";
    ctx.font = "14px monospace";
    ctx.fillText(`Peak Fighters: ${state.stats.maxChars}  |  Total Damage: ${Math.floor(state.stats.totalDmg)}`, W / 2, 360);

    const hover = mouse.x >= W / 2 - 90 && mouse.x <= W / 2 + 90 && mouse.y >= 440 && mouse.y <= 488;
    drawBtn(ctx, "MAIN MENU", W / 2 - 90, 440, 180, 48, hover, state.theme, false, true);
  } else {
    ctx.fillStyle = "rgba(0,0,0,0.82)";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    if (state.menuPulse) {
      const pulse = 1 + Math.sin(Date.now() / 150) * 0.03;
      ctx.translate(W / 2, H / 2 - 100);
      ctx.scale(pulse, pulse);
      ctx.translate(-W / 2, -(H / 2 - 100));
    }
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 44px monospace";
    ctx.textAlign = "center";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffd700";
    ctx.fillText("GAME OVER", W / 2, H / 2 - 100);
    ctx.shadowBlur = 0;
    ctx.restore();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px monospace";
    ctx.fillText(state.winner, W / 2, H / 2 - 50);

    ctx.font = "18px monospace";
    ctx.fillStyle = "#ff6655";
    ctx.fillText(`P1 Score: ${state.p1Score}`, W / 2, H / 2);
    ctx.fillStyle = "#5599ff";
    ctx.fillText(`P2 Score: ${state.p2Score}`, W / 2, H / 2 + 30);
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText(`Director Score: ${state.directorScore}`, W / 2, H / 2 + 60);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "13px monospace";
    ctx.fillText("Max Fighters: " + state.stats.maxChars, W / 2, H / 2 + 100);
    ctx.fillText("Total Damage: " + Math.floor(state.stats.totalDmg), W / 2, H / 2 + 120);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px monospace";
    ctx.fillText("[ Press ENTER or click to return to menu ]", W / 2, H / 2 + 165);
  }
}

// ─── BESTIARY ────────────────────────────────────────────────────────────────
export const BESTIARY_ENTRIES: {
  id: string;
  name: string;
  role: string;
  hp: string;
  spd: string;
  weapon: string;
  lore: string;
  color: string;
  boss: boolean;
  group: "Standard Kinetics" | "Lok's Bestiary" | "Sabres" | "Br/Kn Sabres" | "Minions/MiniSouls";
  skin?: SkinType;
}[] = [
  { id: "standard", name: "Kinetic Standard", role: "Warrior", hp: "20", spd: "Normal", weapon: "Varies", lore: "The backbone of every arena. Balanced, reliable, unpredictable.", color: "#ff6655", boss: false, group: "Standard Kinetics" },
  { id: "tank", name: "Iron Tank", role: "Defender", hp: "40", spd: "Slow", weapon: "Mace", lore: "Built for endurance. Takes hits so allies don't have to.", color: "#8888ff", boss: false, group: "Standard Kinetics" },
  { id: "assassin", name: "Shadow Reaper", role: "Striker", hp: "10", spd: "Very Fast", weapon: "Katana", lore: "Strikes before you see it coming. Paper HP, lethal blade.", color: "#ff00aa", boss: false, group: "Standard Kinetics" },
  { id: "sniper", name: "Horizon Marksman", role: "Ranged", hp: "20", spd: "Normal", weapon: "Blaster", lore: "Keeps distance. Picks off threats with cold precision.", color: "#00ffff", boss: false, group: "Standard Kinetics" },
  { id: "ninja", name: "Void Ninja", role: "Skirmisher", hp: "20", spd: "Fast", weapon: "Dagger", lore: "Flickers between spaces. Hard to pin down, impossible to ignore.", color: "#cc00ff", boss: false, group: "Standard Kinetics" },
  { id: "ghost", name: "Wraith Echo", role: "Haunter", hp: "20", spd: "Fast", weapon: "Scythe", lore: "Barely there. Half in this world, fully lethal.", color: "#aaddff", boss: false, group: "Standard Kinetics", skin: "ghost" },
  { id: "zombie", name: "Revenant Husk", role: "Swarm", hp: "1", spd: "Slow", weapon: "Brawl", lore: "One hit and it drops. But they come in waves. Always waves.", color: "#33ff33", boss: false, group: "Standard Kinetics" },
  { id: "shield", name: "Bastion Guard", role: "Bulwark", hp: "20+15S", spd: "Slow", weapon: "Standard", lore: "Energy shielded. You must break the barrier before the soul.", color: "#00aaff", boss: false, group: "Standard Kinetics" },
  { id: "mage", name: "LoK Caster", role: "BOSS", hp: "30+", spd: "Slow", weapon: "Fireball", lore: "Commands the unseen forces. A boss unit. Respect accordingly.", color: "#ff8800", boss: true, group: "Standard Kinetics" },
  { id: "necromancer", name: "Death Weaver", role: "BOSS", hp: "40+", spd: "Normal", weapon: "Scythe", lore: "Raises the fallen. The longer the fight, the stronger it becomes.", color: "#aa00ff", boss: true, group: "Standard Kinetics" },
  { id: "giant", name: "Titan Behemoth", role: "BOSS", hp: "80+", spd: "Very Slow", weapon: "Hammer", lore: "One hit changes the match. Its shadow is a warning.", color: "#ff4400", boss: true, group: "Standard Kinetics" },
  { id: "juggernaut", name: "The Juggernaut", role: "BOSS", hp: "60+", spd: "Crawl", weapon: "Axe", lore: "Doesn't stop. Can't be turned. Walls bounce off it.", color: "#cc4400", boss: true, group: "Standard Kinetics" },
  { id: "null", name: "NULL Entity", role: "BOSS", hp: "30+", spd: "Frozen", weapon: "None", lore: "It should not exist here. Massive. Immovable. Watching.", color: "#555555", boss: true, group: "Standard Kinetics" },
  { id: "bounty", name: "Bounty Target", role: "Special", hp: "15", spd: "Fast", weapon: "None", lore: "Worth more than a kill. Catch it before the enemy does.", color: "#ffd700", boss: false, group: "Standard Kinetics" },
  { id: "angel", name: "Seraphim Angel", role: "Summoner", hp: "25", spd: "Slow", weapon: "None", lore: "A divine presence. Manifests cherubs to mend the wounds of the worthy.", color: "#ffffaa", boss: false, group: "Standard Kinetics" },
  { id: "volatile", name: "Volatile Core", role: "Saboteur", hp: "5", spd: "Very Fast", weapon: "None", lore: "Unstable, frantic, and rushing toward the nearest crowd. Its death is its ultimate weapon.", color: "#ff2222", boss: false, group: "Lok's Bestiary" },
  { id: "gravity", name: "Gravity Architect", role: "Controller", hp: "25", spd: "Slow", weapon: "Standard", lore: "Bends space to its will. Where it walks, the arena itself begins to collapse.", color: "#8800ff", boss: false, group: "Lok's Bestiary" },
  { id: "vanguard", name: "Vanguard Lancer", role: "Piercer", hp: "25", spd: "Burst", weapon: "Spear", lore: "Momentum is its master. It only knows how to charge forward in devastating straight lines.", color: "#aaddff", boss: false, group: "Lok's Bestiary" },
  { id: "weaver", name: "Aura Weaver", role: "Support", hp: "15", spd: "Normal", weapon: "Rapier", lore: "Mends the broken. In an arena of infinite death, it brings a fleeting spark of life.", color: "#00ff88", boss: false, group: "Lok's Bestiary" },
  { id: "hivemind", name: "The Hivemind", role: "BOSS", hp: "60+", spd: "Very Slow", weapon: "Whip", lore: "A singular consciousness fractured into a thousand vessels. Kill the head, or drown in the swarm.", color: "#ff8800", boss: true, group: "Lok's Bestiary" },
  { id: "glitch_chrono", name: "Chrono-Glitch", role: "Anomaly", hp: "20", spd: "Teleport", weapon: "Dagger", lore: "Desynchronized from the server tick-rate. It exists where it shouldn't.", color: "#ff00ff", boss: false, group: "Lok's Bestiary" },
  { id: "vampire_lord", name: "Vampire Lord", role: "BOSS", hp: "50+", spd: "Fast", weapon: "Scythe", lore: "Drains the life force of its victims to sustain its own immortal core.", color: "#ff0044", boss: true, group: "Lok's Bestiary", skin: "ghost" },
  { id: "bat", name: "Vampiric Bat", role: "Minion", hp: "7", spd: "Fast", weapon: "None", lore: "A lesser soul bound to a Vampire Lord. Swarms and distracts.", color: "#ff0044", boss: false, group: "Minions/MiniSouls", skin: "ghost" },
  { id: "cherub", name: "Cherub", role: "Minion", hp: "10", spd: "Fast", weapon: "None", lore: "A fragile manifestation of healing light. Seeks out the injured.", color: "#ffffaa", boss: false, group: "Minions/MiniSouls", skin: "ghost" },
  { id: "w_katana", name: "Katana Sabre", role: "Weapon", hp: "--", spd: "Fast", weapon: "katana", lore: "Swift strikes with devastating cutting arcs.", color: "#aaaaaa", boss: false, group: "Sabres" },
  { id: "w_hammer", name: "Heavy Hammer", role: "Weapon", hp: "--", spd: "Slow", weapon: "hammer", lore: "Crushes armor and disrupts kinetic shielding.", color: "#aaaaaa", boss: false, group: "Sabres" },
  { id: "w_scythe", name: "Reaper Scythe", role: "Weapon", hp: "--", spd: "Normal", weapon: "scythe", lore: "Wide sweeps that catch multiple sweeps.", color: "#aaaaaa", boss: false, group: "Sabres" },
  { id: "w_blaster", name: "Plasma Blaster", role: "Weapon", hp: "--", spd: "Ranged", weapon: "blaster", lore: "Fires condensed energy projectiles from afar.", color: "#aaaaaa", boss: false, group: "Sabres" },
  { id: "brkn_fire", name: "Br/Kn Fire", role: "Relic", hp: "--", spd: "Volatile", weapon: "katana", lore: "Leaves a trail of searing plasma. Highly unstable.", color: "#ff0000", boss: true, group: "Br/Kn Sabres" },
  { id: "brkn_frost", name: "Br/Kn Frost", role: "Relic", hp: "--", spd: "Absolute Zero", weapon: "spear", lore: "Freezes kinetic cores on contact.", color: "#00ffff", boss: true, group: "Br/Kn Sabres" },
  { id: "brkn_vortex", name: "Br/Kn Vortex", role: "Relic", hp: "--", spd: "Singularity", weapon: "scythe", lore: "Tears space. Pulls victims into the void.", color: "#aa00ff", boss: true, group: "Br/Kn Sabres" }
];

/**
 * Draws the interactive Bestiary / Codex menu.
 * Displays all kinetic types, bosses, and sabres with animated lore cards and optional live sprite rendering.
 * 
 * @param scrollY Current vertical scroll offset
 */
export function drawBestiary(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  mouse: { x: number; y: number },
  ts: number,
  scrollY: number,
) {
  const W = ARENA_W, H = ARENA_H + SCOREBOARD_H;
  ctx.fillStyle = "#08080f";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(100,100,255,0.1)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx < W; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, H);
    ctx.stroke();
  }
  for (let gy = 0; gy < H; gy += 40) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 76, W, H - 76 - 60);
  ctx.clip();

  const cardW = 400, cardH = 120, cols = 2, gap = 16;
  const totalW = cols * cardW + gap;
  const startX = (W - totalW) / 2;
  let currentY = 76 + scrollY + 20;

  const groups = ["Standard Kinetics", "Lok's Bestiary", "Minions/MiniSouls", "Sabres", "Br/Kn Sabres"];

  groups.forEach(groupName => {
    const entries = BESTIARY_ENTRIES.filter(e => e.group === groupName);
    if (entries.length === 0) return;

    ctx.fillStyle = groupName.includes("LoK") || groupName.includes("Br/Kn") ? "#ff4444" : "#ffd700";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(groupName.toUpperCase(), W / 2, currentY);

    if (groupName.includes("Lok")) {
       ctx.fillStyle = "rgba(255,255,255,0.5)";
       ctx.font = "10px monospace";
       ctx.fillText("Marked as too dangerous. Deployed only during special events.", W / 2, currentY + 20);
       currentY += 20;
    }
    if (groupName.includes("Br/Kn")) {
       ctx.fillStyle = "rgba(255,255,255,0.5)";
       ctx.font = "10px monospace";
       ctx.fillText("Ancient reality-bending weapons. Highly volatile.", W / 2, currentY + 20);
       currentY += 20;
    }

    currentY += 30;

    entries.forEach((entry, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gap);
      const cy = currentY + row * (cardH + gap);

      if (cy + cardH < 0 || cy > H) return;

      const hover =
        mouse.x >= cx &&
        mouse.x <= cx + cardW &&
        mouse.y >= cy &&
        mouse.y <= cy + cardH;

      ctx.fillStyle = entry.boss
        ? hover
          ? "rgba(120,40,0,0.8)"
          : "rgba(80,20,0,0.7)"
        : hover
          ? "rgba(30,30,60,0.9)"
          : "rgba(15,15,35,0.8)";
      ctx.strokeStyle = entry.boss ? "#ffd700" : hover ? entry.color : "rgba(255,255,255,0.12)";
      ctx.lineWidth = entry.boss ? 2 : 1;
      ctx.fillRect(cx, cy, cardW, cardH);
      ctx.strokeRect(cx, cy, cardW, cardH);

      ctx.fillStyle = entry.color;
      ctx.font = `bold 14px monospace`;
      ctx.textAlign = "left";
      ctx.fillText(entry.name, cx + 12, cy + 18);

      if (entry.boss) {
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 10px monospace";
        ctx.fillText("👑 BOSS", cx + cardW - 90, cy + 18);
      }

      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "10px monospace";
      ctx.fillText(`Role: ${entry.role}  ·  HP: ${entry.hp}`, cx + 12, cy + 36);
      ctx.fillText(`SPD: ${entry.spd}  ·  WPN: ${entry.weapon}`, cx + 12, cy + 50);

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "11px monospace";
      
      const words = entry.lore.split(" ");
      let line = "";
      let loreY = cy + 68;
      for (const w of words) {
        if (ctx.measureText(line + w + " ").width > cardW - 130) {
          ctx.fillText(line, cx + 12, loreY);
          line = w + " ";
          loreY += 14;
        } else {
          line += w + " ";
        }
      }
      ctx.fillText(line, cx + 12, loreY);

      ctx.fillStyle = entry.color;
      ctx.fillRect(cx, cy, 4, cardH);

      if (state.bestiarySprites) {
        ctx.save();
        const spriteX = cx + cardW - 55;
        const spriteY = cy + cardH / 2;
        ctx.translate(spriteX, spriteY);

        // Draw a soft subtle backdrop for the sprite so they pop visually!
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.fillStyle = entry.boss ? "rgba(255, 215, 0, 0.15)" : "rgba(255, 255, 255, 0.05)";
        ctx.fill();

        if (entry.boss && state.bestiaryBossFx) {
          ctx.save();
          ctx.globalCompositeOperation = "screen";
          for (let p = 0; p < 40; p++) {
            const pTs = ts + p * 150;
            const px = Math.sin(pTs * 0.002 + p) * 22;
            const py = (Math.cos(pTs * 0.0015 + p) * 5) - ((pTs * 0.05) % 40) + 15;
            const alpha = Math.max(0, 1 - Math.abs(py - 15) / 40);
            ctx.fillStyle = entry.color;
            ctx.globalAlpha = alpha * 0.6;
            ctx.beginPath();
            ctx.arc(px, py, 1.8 + (p % 3), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        if (entry.group === "Sabres" || entry.group === "Br/Kn Sabres") {
          let wCol1 = "#aaaaaa", wCol2 = "#555555";
          if (entry.id === "brkn_fire") { wCol1 = "#ff0000"; wCol2 = "#ffaa00"; ctx.shadowBlur = 10; ctx.shadowColor = wCol1; }
          else if (entry.id === "brkn_frost") { wCol1 = "#00ffff"; wCol2 = "#0088ff"; ctx.shadowBlur = 10; ctx.shadowColor = wCol1; }
          else if (entry.id === "brkn_vortex") { wCol1 = "#aa00ff"; wCol2 = "#440088"; ctx.shadowBlur = 10; ctx.shadowColor = wCol1; }

        if (entry.group === "Br/Kn Sabres" && state.bestiaryBossFx) {
          ctx.save();
          ctx.globalCompositeOperation = "screen";
          for (let p = 0; p < 15; p++) {
            const pTs = ts + p * 200;
            const px = Math.sin(pTs * 0.003 + p) * 20;
            const py = Math.cos(pTs * 0.002 + p) * 20;
            ctx.fillStyle = wCol1;
            ctx.globalAlpha = Math.max(0, 0.4 - Math.abs(px)/50);
            ctx.beginPath();
            ctx.arc(px, py, 1.5 + (p%2), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

          ctx.rotate(-Math.PI / 4);
          ctx.translate(0, 10);
          drawWeapon(ctx, entry.weapon as WeaponType, 1.2, wCol1, wCol2, state.theme, ts);
        } else {
          const kType = entry.id as KineticType;
          let finalScale = 1.1;
          if (kType === "giant") finalScale = 1.8;
          if (kType === "juggernaut") finalScale = 1.5;
          if (kType === "tank") finalScale = 1.3;
          if (kType === "assassin") finalScale = 1.0;
          if (kType === "ninja") finalScale = 1.2;
          if (kType === "bounty") finalScale = 1.3;
          const renderScale = Math.min(finalScale, 1.5);

          let wepStr = entry.weapon.toLowerCase();
          if (wepStr === "varies" || wepStr === "brawl" || wepStr === "none") wepStr = "none";

          const dummyChar: Character = {
            id: -1, team: 1, x: 0, y: 0, vx: 0, vy: 0, angle: -Math.PI / 6, angularV: 0,
            hp: 1, maxHp: 1, flashFrames: 0, dead: false,
            parts: BASE_PARTS.map(p => ({ ...p, ox: p.ox * renderScale, oy: p.oy * renderScale, r: p.r * renderScale })),
            trail: [], scale: renderScale,
            weapon: wepStr as WeaponType,
            kineticType: kType, skin: entry.skin || "default",
            stunTime: 0, cooldown: 0, shieldHp: 0, contacts: 0, mass: 1, isBoss: entry.boss, customTimer: 0,
            originalWeapon: wepStr as WeaponType, sabreTimer: 0, tossedTimer: 0
          };
          renderChar(ctx, dummyChar, false, 1, state.theme, false, false, ts, (state as any).kineticStyle);
        }
        ctx.restore();
      }
    });

    const rows = Math.ceil(entries.length / cols);
    currentY += rows * (cardH + gap) + 40;
  });

  ctx.restore();

  ctx.fillStyle = "#08080f";
  ctx.fillRect(0, 0, W, 76);

  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 28px monospace";
  ctx.textAlign = "center";
  ctx.shadowBlur = 12;
  ctx.shadowColor = "#ffd700";
  ctx.fillText("📖 BESTIARY — KINETIC SOULS", W / 2, 26);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "10px monospace";
  ctx.fillText(`${BESTIARY_ENTRIES.length} entries found`, W / 2, 44);

  const toggleW = 140, toggleH = 26;
  const toggleX = W - toggleW - 20, toggleY = 14;
  const toggleHover = mouse.x >= toggleX && mouse.x <= toggleX + toggleW && mouse.y >= toggleY && mouse.y <= toggleY + toggleH;
  drawBtn(ctx, state.bestiarySprites ? "☑ SHOW SPRITES" : "☐ SHOW SPRITES", toggleX, toggleY, toggleW, toggleH, toggleHover, state.theme, state.bestiarySprites, state.classicMenu);

  const fxToggleX = toggleX - toggleW - 10;
  const fxToggleHover = mouse.x >= fxToggleX && mouse.x <= fxToggleX + toggleW && mouse.y >= toggleY && mouse.y <= toggleY + toggleH;
  drawBtn(ctx, state.bestiaryBossFx ? "☑ BOSS FX" : "☐ BOSS FX", fxToggleX, toggleY, toggleW, toggleH, fxToggleHover, state.theme, state.bestiaryBossFx, state.classicMenu);

  ctx.fillStyle = "#08080f";
  ctx.fillRect(0, H - 60, W, 60);

  const backW = 140, backH = 32;
  const backX = W / 2 - backW / 2, backY = H - 42;
  const bHover =
    mouse.x >= backX &&
    mouse.x <= backX + backW &&
    mouse.y >= backY &&
    mouse.y <= backY + backH;

  if (state.classicMenu) {
    drawBtn(ctx, "◀ BACK TO MENU", backX, backY, backW, backH, bHover, state.theme, false, true);
  } else {
    ctx.fillStyle = bHover ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.7)";
    ctx.strokeStyle = bHover ? "#fff" : "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.fillRect(backX, backY, backW, backH);
    ctx.strokeRect(backX, backY, backW, backH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("◀ BACK TO MENU", backX + backW / 2, backY + backH / 2 + 5);
  }
}

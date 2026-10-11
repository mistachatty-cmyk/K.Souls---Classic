import { ARENA_W, ARENA_H, SCOREBOARD_H, GRID_CELL_SIZE, BASE_PARTS } from "../game/constants";
import type { GameState, ThemeMode, GameMode, OpponentMode, LokModifier, CameraMode, WeaponStyle, Environment, ViewMode, WeaponType, KineticType, SkinType, Character } from "../game/types";
import { drawWeapon, renderChar } from "./DrawEntities";

// ─── THEME BACKGROUND DRAW ───────────────────────────────────────────────────
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
  } else if (theme === "neon" || theme === "glitch" || theme === "neon_abyss" || theme === "neon_overdrive") {
    ctx.fillStyle = "#030308";
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "gameboy") {
    ctx.fillStyle = "#9bbc0f";
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "runesite" || theme === "runesite_ultimate") {
    ctx.fillStyle = theme === "runesite_ultimate" ? "#1a0a00" : "#1a1a0a";
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "gsix") {
    ctx.fillStyle = "#050508";
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "gilded" || theme === "lokmod") {
    ctx.fillStyle = "#1a1000";
    ctx.fillRect(0, yOff, w, h);
    const gg = ctx.createLinearGradient(0, yOff, w, yOff + h);
    gg.addColorStop(0, "rgba(200,160,0,0.05)");
    gg.addColorStop(1, "rgba(100,80,0,0.1)");
    ctx.fillStyle = gg;
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "vampire") {
    ctx.fillStyle = "#0d0000";
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "oceanic") {
    const og = ctx.createLinearGradient(0, yOff, 0, yOff + h);
    og.addColorStop(0, "#001833");
    og.addColorStop(1, "#002855");
    ctx.fillStyle = og;
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "infernal" || theme === "overdrive") {
    const ig = ctx.createLinearGradient(0, yOff, 0, yOff + h);
    ig.addColorStop(0, "#1a0000");
    ig.addColorStop(1, "#300500");
    ctx.fillStyle = ig;
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "monochrome") {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, yOff, w, h);
  } else if (theme === "comic") {
    ctx.fillStyle = "#ffe8c0";
    ctx.fillRect(0, yOff, w, h);
    ctx.fillStyle = "rgba(200,150,80,0.08)";
    for (let i = 0; i < w; i += 6) {
      for (let j = 0; j < h; j += 6) {
        if ((i + j) % 12 === 0) ctx.fillRect(i, yOff + j, 3, 3);
      }
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
  if (state.menuParticles) {
    const fall = (ts * 0.05) % H;
    for (let i = 0; i < 30; i++) {
      const x = (i * 89 + 31) % W;
      const staticY = i * 50 + 10;
      let y = (staticY + fall) % H;
      ctx.fillStyle = `rgba(200,200,255,${0.2 + (i % 4) * 0.1})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  ctx.textAlign = "center";

  ctx.save();
  ctx.strokeStyle = "rgba(200, 150, 255, 0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(W / 2, 140, 100 + Math.sin(ts * 0.001) * 10, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(W / 2, 140, 120 + Math.cos(ts * 0.0015) * 10, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();

  ctx.save();
  if (state.menuPulse) {
    const pulse = 1 + Math.sin(ts / 150) * 0.03;
    ctx.translate(W / 2, 142);
    ctx.scale(pulse, pulse);
    ctx.translate(-W / 2, -142);
  }

  const titleY1 = 115 + Math.sin(ts * 0.002) * 5;
  const titleY2 = 170 + Math.sin(ts * 0.002 + 0.5) * 5;

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

  const startHover = mouse.x >= W / 2 - 75 && mouse.x <= W / 2 + 75 && mouse.y >= 440 && mouse.y <= 484;
  drawBtn(ctx, "START GAME", W / 2 - 75, 440, 150, 44, startHover, state.theme, true, true);

  const bestiaryHover = mouse.x >= W / 2 - 75 && mouse.x <= W / 2 + 75 && mouse.y >= 495 && mouse.y <= 525;
  drawBtn(ctx, "BESTIARY", W / 2 - 75, 495, 150, 30, bestiaryHover, state.theme, false, true);

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
  if (state.menuParticles) {
    const fall = (ts * 0.05) % H;
    for (let i = 0; i < 30; i++) {
      const x = (i * 89 + 31) % W;
      const staticY = i * 50 + 10;
      let y = (staticY + fall) % H;
      ctx.fillStyle = `rgba(200,200,255,${0.2 + (i % 4) * 0.1})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  const pulse = 0.85 + 0.15 * Math.sin(ts * 0.002);
  const titleColor =
    theme === "gameboy"
      ? "#9bbc0f"
      : theme === "blood_moon"
        ? "#ff2200"
        : theme === "synthwave"
          ? "#ff00ff"
          : theme === "celestial_forge"
            ? "#00ffff"
            : theme === "gilded" || theme === "lokmod"
              ? "#ffd700"
              : "#ffffff";

  ctx.save();
  if (state.menuPulse) {
    const scalePulse = 1 + Math.sin(ts / 150) * 0.03;
    ctx.translate(W / 2, 54);
    ctx.scale(scalePulse, scalePulse);
    ctx.translate(-W / 2, -54);
  }

  ctx.shadowBlur = state.menuPulse ? 20 * pulse : 0;
  ctx.shadowColor = titleColor;
  ctx.fillStyle = titleColor;
  ctx.font = "bold 48px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("KINETIC SOULS", W / 2, 30);
  ctx.shadowBlur = 0;
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
  const oppButtons: { label: string; value: OpponentMode }[] = [
    { label: "👥 PvP", value: "pvp" },
    { label: "🤖 vs Bot", value: "bot" },
    { label: "⚔ FFA", value: "ffa" },
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
    { label: "⚙  LOK MENU", y: sY + bh + gapY },
    { label: "🎨 SETTINGS", y: sY + (bh + gapY) * 2 },
    { label: "📖 BESTIARY", y: sY + (bh + gapY) * 3 },
  ];
  const bbW = 340, bbH = 36;
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
      { label: "Magnet", value: "magnet" },
      { label: "Repel", value: "repel" },
      { label: "LoK Bounty", value: "lok_bounty" },
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
      { label: "Black Hole", value: "blackhole" },
      { label: "Lava Floor", value: "lava" },
      { label: "Storm", value: "storm" },
      { label: "Bouncy", value: "bouncy" },
      { label: "Wraparound", value: "wrap" },
      { label: "Blackout", value: "blackout" },
    ]
  },
  {
    label: "VIEW MODE", key: "view", col: 2, row: 2,
    items: [
      { label: "Standard", value: "standard" },
      { label: "Theater", value: "theater" },
      { label: "Cinematic", value: "cinematic" },
    ]
  }
];

// ─── LOK MENU ────────────────────────────────────────────────────────────────
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

  const valueMap: Record<string, string> = {
     theme, mod, cam, wep, env, view
  };

  const colW = 290, colGap = 10;
  const startX = (W - (colW * 3 + colGap * 2)) / 2;
  const startY = 58 + scrollY;
  const bh = 24, bw = 130, gap = 5;

  for (const sec of LOK_MENU_DATA) {
    const baseX = startX + sec.col * (colW + colGap);
    const baseY = startY + sec.row * 170;

    const maxRows = sec.key === "theme" ? 20 : 7;
    
    ctx.fillStyle = "rgba(20, 10, 30, 0.7)";
    ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const colsInSec = sec.key === "theme" ? 2 : 1;
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
  }

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
    ]
  },
  {
    group: "GAMEPLAY MODIFIERS",
    items: [
      { label: "AI Magnetic", key: "aiMagnetic", type: "toggle", desc: "AI units are attracted to the player" },
      { label: "Hand of God", key: "handOfGod", type: "toggle", desc: "Divine intervention in combat" },
      { label: "Moon Gravity", key: "moonGravity", type: "toggle", desc: "Low gravity physics environment" },
      { label: "Exploding Corpses", key: "explodingCorpses", type: "toggle", desc: "Enemies explode upon defeat" },
      { label: "Slo-Mo Kills", key: "sloMoKills", type: "toggle", desc: "Time slows down during final hits" },
      { label: "Rainbow Blood", key: "rainbowBlood", type: "toggle", desc: "Units bleed in color gradients" },
      { label: "Physics", key: "physicsMode", type: "cycle", desc: "Choose global physics simulation behavior" },
      { label: "Trick Shots", key: "trickShots", type: "toggle", desc: "Enable curved momentum and major contact bonuses" },
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
      { label: "Menu Sim", key: "menuSimulator", type: "toggle", desc: "Run a simulation in the background" },
      { label: "Classic Menu", key: "classicMenu", type: "toggle", desc: "Use the legacy retro menu style" },
      { label: "Screensaver", key: "screensaverMode", type: "toggle", desc: "Enable idle screensaver mode" },
      { label: "Debug Grid", key: "optGridDebug", type: "toggle", desc: "Visually render the spatial partitioning grid" },
    ]
  }
];

export function drawSettingsMenu(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  ts: number,
  mouse: { x: number; y: number },
  scrollY: number = 0
) {
  const W = ARENA_W, H = ARENA_H + SCOREBOARD_H;
  drawThemeBackground(ctx, state.theme, ts, W, H, 0);

  // Header
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px monospace";
  ctx.textAlign = "center";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "rgba(255,255,255,0.5)";
  ctx.fillText("🎨 SYSTEM CONFIGURATION", W / 2, 35);
  ctx.shadowBlur = 0;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 60, W, H - 120);
  ctx.clip();

  let currentY = 80 + scrollY;
  const cardW = 210, cardH = 50, gap = 8, cols = 4;
  const startX = (W - (cols * cardW + (cols - 1) * gap)) / 2;

  SETTINGS_DATA.forEach(group => {
    // Group Header
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "left";
    ctx.fillText(group.group, startX, currentY);
    currentY += 20;

    group.items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const bx = startX + col * (cardW + gap);
      const by = currentY + row * (cardH + gap);
      const hover = mouse.x >= bx && mouse.x <= bx + cardW && mouse.y >= by && mouse.y <= by + cardH;
      
      const val = state[item.key];
      const active = item.type === "toggle" ? val === true : true;

      // Card Background
      ctx.fillStyle = hover ? "rgba(255,255,255,0.15)" : "rgba(20,20,30,0.6)";
      if (active && item.type === "toggle") ctx.fillStyle = hover ? "rgba(0,255,136,0.25)" : "rgba(0,255,136,0.15)";
      
      ctx.strokeStyle = active ? "#00ff88" : "rgba(255,255,255,0.2)";
      if (hover) ctx.strokeStyle = "#fff";
      
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, by, cardW, cardH, 4);
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = active ? "#fff" : "#888";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "left";
      ctx.fillText(item.label, bx + 10, by + 18);

      // Status/Value
      ctx.fillStyle = active ? "#00ff88" : "#666";
      ctx.font = "10px monospace";
      if (item.type === "toggle") {
        ctx.fillText(active ? "● ENABLED" : "○ DISABLED", bx + 10, by + 34);
      } else {
        const cycleVal = (val as string).toUpperCase();
        ctx.fillStyle = "#ffd700";
        ctx.fillText("» " + (cycleVal || "STANDARD"), bx + 10, by + 34);
      }

      // Hover Description Tooltip
      if (hover) {
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0); // Reset for tooltip
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 1;
        const tw = ctx.measureText(item.desc).width + 20;
        const tx = Math.min(W - tw - 10, Math.max(10, mouse.x - tw / 2));
        const ty = Math.min(H - 40, mouse.y + 20);
        ctx.fillRect(tx, ty, tw, 25);
        ctx.strokeRect(tx, ty, tw, 25);
        ctx.fillStyle = "#fff";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(item.desc, tx + tw / 2, ty + 16);
        ctx.restore();
      }
    });

    currentY += Math.ceil(group.items.length / cols) * (cardH + gap) + 30;
  });

  ctx.restore();

  const backW = 120, backH = 30;
  const backX = W / 2 - backW / 2, backY = H - 44;
  const bHover = mouse.x >= backX && mouse.x <= backX + backW && mouse.y >= backY && mouse.y <= backY + backH;

  if (state.classicMenu) {
    drawBtn(ctx, "◀ BACK", backX, backY, backW, backH, bHover, state.theme, false, true);
  } else {
    ctx.fillStyle = bHover ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.6)";
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    ctx.fillRect(backX, backY, backW, backH);
    ctx.strokeRect(backX, backY, backW, backH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("◀ BACK", backX + backW / 2, backY + backH / 2 + 5);
  }
}

// ─── GAME OVER ───────────────────────────────────────────────────────────────
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

    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 44px monospace";
    ctx.textAlign = "center";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffd700";
    ctx.fillText("GAME OVER", W / 2, H / 2 - 100);
    ctx.shadowBlur = 0;

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
          renderChar(ctx, dummyChar, false, 1, state.theme, false, false, ts);
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

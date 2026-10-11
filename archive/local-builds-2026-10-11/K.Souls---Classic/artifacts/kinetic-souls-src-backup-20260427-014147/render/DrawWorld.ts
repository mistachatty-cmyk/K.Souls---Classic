import { ARENA_W, ARENA_H, SCOREBOARD_H, CHAR_RADIUS } from "../game/constants";
import type { GameState, Character, ThemeMode, Essence, Particle, Ghost, Projectile, FloatingText, Sabre, LokModifier, Drop } from "../game/types";
import { getTeamColor, renderChar, drawHpBar, drawGhost, drawSkin, drawWeapon } from "./DrawEntities";
import { drawBtn } from "./DrawUI";

export function drawWorld(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  data: {
    chars: Character[];
    parts: Particle[];
    ghosts: Ghost[];
    texts: FloatingText[];
    bombs: Drop[];
    projs: Projectile[];
    essences: Essence[];
    sabres: Sabre[];
  },
  ts: number,
  mouse: { x: number; y: number; isDown: boolean },
  godAction: string,
  cam: { x: number; y: number; zoom: number },
) {
  // Camera Shake & Transform
  const camShakeX = state.shakeFrames > 0 ? (Math.random() - 0.5) * 6 : 0;
  const camShakeY = state.shakeFrames > 0 ? (Math.random() - 0.5) * 6 : 0;

  ctx.save();
  ctx.beginPath(); 
  ctx.rect(0, SCOREBOARD_H, ARENA_W, ARENA_H); 
  ctx.clip();
  
  ctx.translate(camShakeX, camShakeY);
  ctx.translate(ARENA_W / 2, SCOREBOARD_H + ARENA_H / 2);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.x, -cam.y);

  // 1. Ads
  if (state.ads) {
    const adText1 = " 🍕 Party Bites 🍕 • 🎬 GSix Productions 🎬 • 💩 Big Dookie Time 💩 • 🏐 Haicuu Experience 🏐 • 🤝 WeChange 🤝 • 🔑 Lok 🔑 ";
    const adText2 = " 🔑 Lok 🔑 • 🤝 WeChange 🤝 • 🏐 Haicuu Experience 🏐 • 💩 Big Dookie Time 💩 • 🎬 GSix Productions 🎬 • 🍕 Party Bites 🍕 ";
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, SCOREBOARD_H, ARENA_W, 24);
    ctx.fillRect(0, SCOREBOARD_H + ARENA_H - 24, ARENA_W, 24);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "left";
    const tw = 800;
    const offset1 = -((ts * 0.05) % tw);
    const offset2 = ((ts * 0.05) % tw) - tw;
    ctx.fillText(adText1 + adText1 + adText1, offset1, SCOREBOARD_H + 16);
    ctx.fillText(adText2 + adText2 + adText2, offset2, SCOREBOARD_H + ARENA_H - 8);
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffd700";
    ctx.fillStyle = "rgba(255, 215, 0, 0.1)";
    ctx.font = "bold 64px monospace";
    ctx.textAlign = "center";
    ctx.fillText("KINETIC SOULS", ARENA_W / 2, SCOREBOARD_H + ARENA_H / 2);
    ctx.shadowBlur = 0;
  }

  // 2. Essences
  for (const e of data.essences) {
    if (!e.active) continue;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    ctx.globalAlpha = Math.max(0, e.life / e.maxLife) * 0.7;
    ctx.fillStyle = e.color;
    ctx.fillRect(-4, -4, 8, 8);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // 3. Characters
  for (const c of data.chars) {
    if (c.dead) continue;
    // Bounds check
    if (c.x < -100 || c.x > ARENA_W + 100 || c.y < SCOREBOARD_H - 100 || c.y > SCOREBOARD_H + ARENA_H + 100) continue;

    // Trails
    if (state.trails && c.trail.length > 1) {
      for (let ti = 0; ti < c.trail.length; ti++) {
        const tf = c.trail[ti];
        const alpha = (ti / c.trail.length) * 0.35;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(tf.x, tf.y);
        ctx.rotate(tf.angle);
        const trailColor = getTeamColor(c.team, state.theme, c.kineticType, ts);
        ctx.fillStyle = trailColor;
        if (c.skin !== "default") {
          drawSkin(ctx, c, trailColor, c.skin, c.scale, false, state.theme, state.devMode);
        } else {
          for (const p of c.parts) {
            ctx.fillRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2);
          }
        }
        ctx.restore();
      }
    }

    const flash = c.flashFrames > 0;
    renderChar(ctx, c, flash, 1, state.theme, state.devMode, state.optCache, ts);

    if (state.hud) {
      drawHpBar(ctx, c, state.modifier, state.devMode, state.theme, state.hpBarStyle);
    }

    if (c.isLocked && c.lockTimer) {
       ctx.save();
       ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(1, c.lockTimer / 1000)})`;
       ctx.lineWidth = 2;
       ctx.beginPath();
       const s = CHAR_RADIUS * c.scale + 4;
       ctx.strokeRect(c.x - s, c.y - s, s * 2, s * 2);
       ctx.restore();
    }
  }

  // 4. Particles
  for (const p of data.parts) {
    if (!p.active) continue;
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;

  // 5. Barriers
  if (state.barriers) {
     ctx.save();
     ctx.lineCap = "round";
     for (const b of state.barriers) {
        ctx.strokeStyle = `rgba(34, 197, 94, ${Math.min(1, b.life / 2000)})`;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke();
     }
     ctx.restore();
  }

  // 6. God Action Area
  if (mouse.isDown && state.dragStartX !== undefined && state.dragStartY !== undefined) {
     ctx.save();
     if (godAction === "area_lock") {
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
        ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
        ctx.lineWidth = 2;
        ctx.fillRect(state.dragStartX, state.dragStartY, mouse.x - state.dragStartX, mouse.y - state.dragStartY);
        ctx.strokeRect(state.dragStartX, state.dragStartY, mouse.x - state.dragStartX, mouse.y - state.dragStartY);
     } else if (godAction === "architect_pen") {
        ctx.strokeStyle = "rgba(34, 197, 94, 0.8)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(state.dragStartX, state.dragStartY); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
     }
     ctx.restore();
  }

  // 7. Ghosts
  for (const g of data.ghosts) {
    if (!g.active) continue;
    drawGhost(ctx, g, state.devMode, state.theme);
  }

  // 8. Projectiles
  for (const proj of data.projs) {
    if (!proj.active) continue;
    ctx.fillStyle = proj.type === "fireball" ? "#ff6600" : proj.color;
    ctx.shadowBlur = proj.type === "fireball" ? 8 : 4;
    ctx.shadowColor = proj.color;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.type === "fireball" ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 9. Texts
  if (state.floatingTextStyle !== "hidden") {
    for (const t of data.texts) {
      if (!t.active) continue;
      const alpha2 = Math.max(0, t.life / t.maxLife);
      ctx.globalAlpha = alpha2;
      const style = state.floatingTextStyle;

      if (t.isSplat) {
        ctx.fillStyle = t.color;
        ctx.beginPath();
        for (let si = 0; si < 10; si++) {
          const a2 = (si * Math.PI * 2) / 10;
          const r2 = si % 2 === 0 ? 14 : 7;
          ctx.lineTo(t.x + Math.cos(a2) * r2, t.y + Math.sin(a2) * r2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(t.text, t.x, t.y + 4);
      } else {
        ctx.fillStyle = t.color;
        ctx.textAlign = "center";
        if (style === "comic") {
          ctx.font = "bold 16px 'Comic Sans MS', cursive";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
          ctx.strokeText(t.text, t.x, t.y);
        } else if (style === "neon") {
          ctx.font = "bold 14px monospace";
          ctx.shadowBlur = 12;
          ctx.shadowColor = t.color;
        } else {
          ctx.font = "bold 14px monospace";
        }
        ctx.fillText(t.text, t.x, t.y);
        ctx.shadowBlur = 0;
      }
    }
  }
  ctx.globalAlpha = 1;

  // 10. Sabres
  for (const s of data.sabres) {
    if (!s.active) continue;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    ctx.translate(0, 25 * s.scale);
    ctx.globalAlpha = Math.min(1, s.life / 500);
    let wCol1 = "#aaaaaa", wCol2 = "#555555";
    if (s.isBrkn) {
      if (s.element === "fire") { wCol1 = "#ff0000"; wCol2 = "#ffaa00"; }
      else if (s.element === "frost") { wCol1 = "#00ffff"; wCol2 = "#0088ff"; }
      else if (s.element === "vortex") { wCol1 = "#aa00ff"; wCol2 = "#440088"; }
      ctx.shadowBlur = 10; ctx.shadowColor = wCol1;
    }
    drawWeapon(ctx, s.weapon, s.scale, wCol1, wCol2, state.theme, ts);
    ctx.restore();
  }

  ctx.restore();
}

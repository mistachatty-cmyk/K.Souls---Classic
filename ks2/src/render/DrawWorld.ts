import { ARENA_W, ARENA_H, SCOREBOARD_H, CHAR_RADIUS } from "../game/constants";
import type { GameState, Character, ThemeMode, Essence, Particle, Ghost, Projectile, FloatingText, Sabre, LokModifier, Drop, Portal } from "../game/types";
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
     portals: Portal[];
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

  const xxlM = parseInt((state as any).xxlScale) || 3;
  const worldW = (state as any).xxlMode ? ARENA_W * xxlM : ARENA_W;
  const worldH = (state as any).xxlMode ? ARENA_H * xxlM : ARENA_H;
  const worldX = (state as any).xxlMode ? -ARENA_W * ((xxlM - 1) / 2) : 0;
  const worldY = (state as any).xxlMode ? SCOREBOARD_H - ARENA_H * ((xxlM - 1) / 2) : SCOREBOARD_H;

  // 1. Ads
  if (state.ads) {
    const adText1 = " 🍕 Party Bites 🍕 • 🎬 GSix Productions 🎬 • 💩 Big Dookie Time 💩 • 🏐 Haicuu Experience 🏐 • 🤝 WeChange 🤝 • 🔑 Lok 🔑 ";
    const adText2 = " 🔑 Lok 🔑 • 🤝 WeChange 🤝 • 🏐 Haicuu Experience 🏐 • 💩 Big Dookie Time 💩 • 🎬 GSix Productions 🎬 • 🍕 Party Bites 🍕 ";
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(worldX, worldY, worldW, 24);
    ctx.fillRect(worldX, worldY + worldH - 24, worldW, 24);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "left";
    const tw = 800;
    const offset1 = worldX - ((ts * 0.05) % tw);
    const offset2 = worldX + ((ts * 0.05) % tw) - tw;
    
    // Repeat text enough times to cover the screen
    let repAd1 = adText1, repAd2 = adText2;
    for(let r=0; r<((state as any).xxlMode ? 9 : 3); r++) { repAd1 += adText1; repAd2 += adText2; }
    
    ctx.fillText(repAd1, offset1, worldY + 16);
    ctx.fillText(repAd2, offset2, worldY + worldH - 8);
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffd700";
    ctx.fillStyle = "rgba(255, 215, 0, 0.1)";
    ctx.font = "bold 64px monospace";
    ctx.textAlign = "center";
    ctx.fillText("KINETIC SOULS 2", worldX + worldW / 2, worldY + worldH / 2);
    ctx.shadowBlur = 0;
  }

  // 1.1 New Environment Effects
  if (state.environment === "solar_flares") {
    if (Math.random() < 0.05) {
      const fx = worldX + Math.random() * worldW;
      const fy = worldY + Math.random() * worldH;
      ctx.fillStyle = "rgba(255, 100, 0, 0.3)";
      ctx.beginPath(); ctx.arc(fx, fy, 30 + Math.random() * 50, 0, Math.PI * 2); ctx.fill();
    }
  } else if (state.environment === "magnetic_fields") {
    ctx.strokeStyle = "rgba(100, 180, 255, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5 * ((state as any).xxlMode ? 3 : 1); i++) {
      const y = worldY + (ts * 0.05 + i * 120) % worldH;
      ctx.beginPath(); ctx.moveTo(worldX, y); ctx.lineTo(worldX + worldW, y); ctx.stroke();
    }
  } else if (state.environment === "void_storm") {
    ctx.fillStyle = "rgba(40, 0, 80, 0.06)";
    if (Math.random() < 0.1) {
      ctx.fillRect(worldX, worldY, worldW, worldH);
    }
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
    const cullW = (state as any).xxlMode ? ARENA_W * ((xxlM - 1) / 2) + 100 : 100;
    const cullH = (state as any).xxlMode ? ARENA_H * ((xxlM - 1) / 2) + 100 : 100;
    if (c.x < -cullW || c.x > ARENA_W + cullW || c.y < SCOREBOARD_H - cullH || c.y > SCOREBOARD_H + ARENA_H + cullH) continue;

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
    renderChar(ctx, c, flash, 1, state.theme, state.devMode, state.optCache, ts, (state as any).kineticStyle);

    if (state.hud) {
      drawHpBar(ctx, c, state.modifier, state.devMode, state.theme, state.hpBarStyle);
    }

    if ((c as any).isLocked && (c as any).lockTimer) {
       ctx.save();
       ctx.strokeStyle = `rgba(59, 130, 246, ${Math.min(1, (c as any).lockTimer / 1000)})`;
       ctx.lineWidth = 2;
       ctx.beginPath();
       const s = CHAR_RADIUS * c.scale + 4;
       ctx.strokeRect(c.x - s, c.y - s, s * 2, s * 2);
       ctx.restore();
    }
  }

   // 4. Essences
   for (const e of data.essences) {
     if (!e.active) continue;
     ctx.save();
     ctx.translate(e.x, e.y);
     ctx.rotate(e.angle);
     ctx.globalAlpha = Math.max(0, e.life / e.maxLife) * 0.8;
     ctx.fillStyle = e.color;
     // Draw essence as a rotating, glowing orb
     ctx.beginPath();
     ctx.arc(0, 0, 6, 0, Math.PI * 2);
     ctx.fill();
     // Inner glow
     ctx.fillStyle = "rgba(255,255,255,0.6)";
     ctx.beginPath();
     ctx.arc(0, 0, 3, 0, Math.PI * 2);
     ctx.fill();
     ctx.restore();
   }
   
   // 5. Particles
   for (const p of data.parts) {
     if (!p.active) continue;
     const alpha = Math.max(0, p.life / p.maxLife);
     ctx.globalAlpha = alpha;
     ctx.fillStyle = p.color;
     ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
   }
   ctx.globalAlpha = 1;
   
   // 6. Portals
   for (const portal of data.portals) {
     if (!portal.active) continue;
     ctx.save();
     ctx.translate(portal.x, portal.y);
     // Portal pulsating effect
     const pulse = 0.5 + 0.5 * Math.sin(ts * 0.005);
     const size = portal.size * (0.8 + pulse * 0.2);
     ctx.globalAlpha = 0.6;
     ctx.fillStyle = portal.color;
     ctx.beginPath();
     ctx.arc(0, 0, size, 0, Math.PI * 2);
     ctx.fill();
     // Portal ring
     ctx.strokeStyle = "rgba(255,255,255,0.8)";
     ctx.lineWidth = 2;
     ctx.beginPath();
     ctx.arc(0, 0, size + 2, 0, Math.PI * 2);
     ctx.stroke();
     // Inner swirl
     ctx.strokeStyle = "rgba(255,255,255,0.4)";
     for (let i = 0; i < 3; i++) {
       const angle = ts * 0.002 + i * Math.PI * 0.5;
       ctx.beginPath();
       ctx.arc(0, 0, size * 0.7, angle, angle + Math.PI * 0.3);
       ctx.stroke();
     }
     ctx.restore();
   }

  // 5. Barriers
  if ((state as any).barriers) {
     ctx.save();
     ctx.lineCap = "round";
     for (const b of (state as any).barriers) {
        ctx.strokeStyle = `rgba(34, 197, 94, ${Math.min(1, b.life / 2000)})`;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke();
     }
     ctx.restore();
  }

  // 6. God Action Area
  const st = state as any;
  if (mouse.isDown && st.dragStartX !== undefined && st.dragStartY !== undefined) {
     ctx.save();
     if (godAction === "area_lock") {
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
        ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
        ctx.lineWidth = 2;
        ctx.fillRect(st.dragStartX, st.dragStartY, mouse.x - st.dragStartX, mouse.y - st.dragStartY);
        ctx.strokeRect(st.dragStartX, st.dragStartY, mouse.x - st.dragStartX, mouse.y - st.dragStartY);
     } else if (godAction === "architect_pen") {
        ctx.strokeStyle = "rgba(34, 197, 94, 0.8)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(st.dragStartX, st.dragStartY); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
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

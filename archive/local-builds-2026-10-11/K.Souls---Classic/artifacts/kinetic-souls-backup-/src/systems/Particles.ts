import { MAX_PARTICLES } from "../game/constants";
import type { Particle, Essence, GameState, ThemeMode, KineticType } from "../game/types";
import { getTeamColor } from "../render/DrawEntities";

export function pushParticle(
  x: number, y: number, vx: number, vy: number, life: number, color: string, size: number, pool: Particle[], usePool: boolean,
) {
  if (pool.length >= MAX_PARTICLES) return;
  if (usePool) {
    const deadP = pool.find((p) => !p.active);
    if (deadP) {
      deadP.x = x; deadP.y = y; deadP.vx = vx; deadP.vy = vy; deadP.life = life; deadP.maxLife = life; deadP.color = color; deadP.size = size; deadP.active = true;
      return;
    }
  }
  pool.push({ x, y, vx, vy, life, maxLife: life, color, size, active: true });
}

export function pushEssence(
  x: number, y: number, color: string, pool: Essence[], usePool: boolean,
) {
  const vx = (Math.random() - 0.5) * 8;
  const vy = (Math.random() - 0.5) * 8;
  const life = 200 + Math.random() * 100;
  if (usePool) {
    const deadE = pool.find((e) => !e.active);
    if (deadE) {
      deadE.x = x; deadE.y = y; deadE.vx = vx; deadE.vy = vy; deadE.life = life; deadE.maxLife = life; deadE.color = color; deadE.angle = 0; deadE.rotSpeed = (Math.random() - 0.5) * 0.2; deadE.active = true;
      return;
    }
  }
  pool.push({ x, y, vx, vy, life, maxLife: life, color, angle: 0, rotSpeed: (Math.random() - 0.5) * 0.2, active: true });
}

export function spawnExplosion(
  x: number, y: number, team: number, theme: ThemeMode, state: GameState, pool: Particle[], kType: KineticType = "standard",
) {
  const color = getTeamColor(team, theme, kType, 0);
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * 4 + 1;
    pushParticle(
      x, y, Math.cos(angle) * spd, Math.sin(angle) * spd, 20 + Math.random() * 20,
      state.rainbowBlood ? `hsl(${Math.random() * 360}, 100%, 50%)` : color,
      3 + Math.random() * 4, pool, state.optPool,
    );
  }
}
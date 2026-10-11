import type { Character, GameState, Particle, Drop } from "../game/types";
import { pushParticle } from "./Particles";
import { spawnCharacter, getCharIdCounter } from "./Spawner";
import { GRID_CELL_SIZE } from "../game/constants";

/**
 * Behavior System
 * Handles AI steering and special abilities for different Kinetic types.
 */
export function updateBehaviors(
  chars: Character[],
  state: GameState,
  dt: number,
  parts: Particle[],
  spawnText: (x: number, y: number, text: string, color: string) => void,
  bombs: Drop[],
  timestamp: number
) {
  // Optional Spatial Partitioning Grid specifically scoped for AI seeking loops
  let aiGrid: Map<string, Character[]> | null = null;
  if (state.optGrid && chars.length > 30) {
    aiGrid = new Map();
    for (const c of chars) {
      if (c.dead) continue;
      const cx = Math.floor(c.x / GRID_CELL_SIZE);
      const cy = Math.floor(c.y / GRID_CELL_SIZE);
      const key = `${cx},${cy}`;
      if (!aiGrid.has(key)) aiGrid.set(key, []);
      aiGrid.get(key)!.push(c);
    }
  }

  for (const c of chars) {
    if (c.dead) continue;

    // 1. Screensaver Mode Override
    // In screensaver mode, kinetics don't have AI steering or combat intent.
    if (state.screensaverMode) {
      c.stunTime = 0; 
      continue; 
    }

    // 2. AI Seeking Logic
    // Only seek if not stunned and not a specialized non-combat type.
    if (c.kineticType !== "null" && c.stunTime <= 0 && !(c.kineticType === "bat" && c.masterId !== undefined) && c.kineticType !== "cherub") {
      let targetX = -1, targetY = -1;
      let bestDist = Infinity;

      // Spatial Grid Search (O(1) localized checks)
      if (aiGrid) {
        const cx = Math.floor(c.x / GRID_CELL_SIZE);
        const cy = Math.floor(c.y / GRID_CELL_SIZE);
        for (let ox = -2; ox <= 2; ox++) {
          for (let oy = -2; oy <= 2; oy++) {
            const cell = aiGrid.get(`${cx + ox},${cy + oy}`);
            if (cell) {
              for (const other of cell) {
                if (other.dead || other.team === c.team || other.id === c.id) continue;
                const d = Math.hypot(c.x - other.x, c.y - other.y);
                if (d < bestDist) { bestDist = d; targetX = other.x; targetY = other.y; }
              }
            }
          }
        }
      }

      // Fallback Global O(N) Search if grid optimization missed or is disabled
      if (bestDist === Infinity) {
        for (const other of chars) {
          if (other.dead || other.team === c.team || other.id === c.id) continue;
          const d = Math.hypot(c.x - other.x, c.y - other.y);
          if (d < bestDist) { bestDist = d; targetX = other.x; targetY = other.y; }
        }
      }

      if (targetX >= 0 && bestDist !== Infinity) {
        const dx = targetX - c.x, dy = targetY - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          let aiSpeed = c.isBoss ? 0.35 : 0.2;
          if (c.kineticType === "assassin" || c.kineticType === "ninja") aiSpeed = 0.45;
          if (c.kineticType === "tank" || c.kineticType === "juggernaut") aiSpeed = 0.15;
          if (c.kineticType === "giant") aiSpeed = 0.1;
          if (c.kineticType === "volatile") aiSpeed = 0.6;
          if (c.kineticType === "drone") aiSpeed = 0.55;
          if (c.kineticType === "wasp") aiSpeed = 0.7;
          c.vx += (dx / dist) * aiSpeed;
          c.vy += (dy / dist) * aiSpeed;
        }
      }
    }

    // 3. Special Ability Logic
    if (c.kineticType === "gravity") {
      c.customTimer -= dt;
      if (c.customTimer <= 0) {
        c.customTimer = 5000 + Math.random() * 3000;
        bombs.push({ type: "blackhole", x: c.x, y: c.y, timer: 3000, maxTimer: 3000, active: true, radius: 150 });
      }
    } else if (c.kineticType === "vanguard") {
      c.customTimer -= dt;
      if (c.customTimer <= 0) {
        c.customTimer = 3000 + Math.random() * 2000;
        c.vx += Math.cos(c.angle) * 15;
        c.vy += Math.sin(c.angle) * 15;
        for(let i=0; i<5; i++) pushParticle(c.x, c.y, (Math.random()-0.5)*2, (Math.random()-0.5)*2, 20, "#fff", 5, parts, state.optPool);
      }
    } else if (c.kineticType === "weaver") {
      c.customTimer -= dt;
      if (c.customTimer <= 0) {
        c.customTimer = 4000;
        chars.forEach(ally => {
          if (!ally.dead && ally.team === c.team && Math.hypot(ally.x - c.x, ally.y - c.y) < 150) {
            ally.hp = Math.min(ally.maxHp, ally.hp + 10);
            spawnText(ally.x, ally.y - 10, "+10", "#00ff88");
          }
        });
        for (let a = 0; a < Math.PI * 2; a += 0.5) {
          pushParticle(c.x, c.y, Math.cos(a)*4, Math.sin(a)*4, 30, "#00ff88", 3, parts, state.optPool);
        }
      }
    } else if (c.kineticType === "hivemind") {
      c.customTimer -= dt;
      if (c.customTimer <= 0) {
        c.customTimer = 3000;
        for(let i=0; i<2; i++) {
          const drone = spawnCharacter(c.team, state.modifier, chars, false, state.optPool, "none", state.fighterSpeed, c.x + (Math.random()-0.5)*40, c.y + (Math.random()-0.5)*40, "zombie");
          drone.maxHp = 1; drone.hp = 1; drone.scale = 0.6;
          if (!state.optPool || drone.id >= getCharIdCounter() - 1) chars.push(drone);
        }
      }
    } else if (c.kineticType === "vampire_lord") {
      if (c.customTimer === 0) {
        c.customTimer = 1;
        for (let i = 0; i < 7; i++) {
          const bat = spawnCharacter(c.team, state.modifier, chars, false, state.optPool, "none", state.fighterSpeed, c.x + (Math.random() - 0.5) * 40, c.y + (Math.random() - 0.5) * 40, "bat", "ghost", false, c.id);
          if (!state.optPool || bat.id >= getCharIdCounter() - 1) chars.push(bat);
        }
      }
    } else if (c.kineticType === "bat" && c.masterId !== undefined) {
      const master = chars.find(m => m.id === c.masterId && !m.dead);
      if (master) {
        const dx = master.x - c.x;
        const dy = master.y - c.y;
        const dist = Math.hypot(dx, dy);
        const targetDist = 45 * master.scale;
        if (dist > 0) {
          const nx = dx / dist, ny = dy / dist;
          c.vx += nx * (dist - targetDist) * 0.05;
          c.vy += ny * (dist - targetDist) * 0.05;
          c.vx += -ny * 0.6;
          c.vy += nx * 0.6;
        }
      } else {
        c.hp -= 0.05 * state.timeScale; 
      }
    } else if (c.kineticType === "angel") {
      c.customTimer -= dt;
      if (c.customTimer <= 0) {
        c.customTimer = 6000;
        const myCherubs = chars.filter(x => !x.dead && x.kineticType === "cherub" && x.masterId === c.id).length;
        if (myCherubs < 3) {
          const cherub = spawnCharacter(c.team, state.modifier, chars, false, state.optPool, "none", state.fighterSpeed, c.x + (Math.random() - 0.5) * 40, c.y + (Math.random() - 0.5) * 40, "cherub", "ghost", false, c.id);
          if (!state.optPool || cherub.id >= getCharIdCounter() - 1) chars.push(cherub);
        }
      }
    } else if (c.kineticType === "cherub") {
      c.customTimer -= dt;
      if (c.customTimer <= 0) {
        c.customTimer = 2000;
        let healed = false;
        chars.forEach(ally => {
          if (!ally.dead && ally.team === c.team && ally.id !== c.id && Math.hypot(ally.x - c.x, ally.y - c.y) < 60 && ally.hp < ally.maxHp) {
            ally.hp = Math.min(ally.maxHp, ally.hp + 5);
            spawnText(ally.x, ally.y - 10, "+5", "#ffffaa");
            healed = true;
          }
        });
        if (healed) for (let i = 0; i < 5; i++) pushParticle(c.x, c.y, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, 20, "#ffffaa", 3, parts, state.optPool);
      }
      let targetAlly = null, minHpPct = 1.0;
      for (const ally of chars) {
        if (ally.dead || ally.team !== c.team || ally.id === c.id) continue;
        const hpPct = ally.hp / ally.maxHp;
        if (hpPct < minHpPct) { minHpPct = hpPct; targetAlly = ally; }
      }
      if (targetAlly && minHpPct < 1.0) {
        const dx = targetAlly.x - c.x, dy = targetAlly.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 20) { c.vx += (dx / dist) * 0.4; c.vy += (dy / dist) * 0.4; }
      } else if (c.masterId !== undefined) {
        const master = chars.find(m => m.id === c.masterId && !m.dead);
        if (master) {
          const dx = master.x - c.x, dy = master.y - c.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 50) { c.vx += (dx / dist) * 0.3; c.vy += (dy / dist) * 0.3; }
        } else c.hp -= 0.1 * state.timeScale;
      }
    } else if (c.kineticType === "wasp") {
      // High-frequency zig-zag
      c.vx += Math.sin(timestamp * 0.02) * 2;
      c.vy += Math.cos(timestamp * 0.02) * 2;
    } else if (c.kineticType === "spore") {
      // Trail of green spores
      if (Math.random() < 0.1 * state.timeScale) {
        pushParticle(c.x, c.y, (Math.random()-0.5), (Math.random()-0.5), 40, "#88ff88", 2, parts, state.optPool);
      }
    } else if (c.kineticType === "fragment") {
      c.angularV += 0.05 * state.timeScale;
    }
  }
}

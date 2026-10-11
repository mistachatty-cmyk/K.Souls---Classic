import { ARENA_W, ARENA_H, SCOREBOARD_H, CHAR_RADIUS, BASE_PARTS } from "../game/constants";
import type { Character, LokModifier, WeaponType, KineticType, SkinType, WeaponStyle } from "../game/types";

let charIdCounter = 0;

export function resetCharIdCounter() {
  charIdCounter = 0;
}

export function getCharIdCounter(): number {
  return charIdCounter;
}

export function getPartDamage(type: "head" | "body" | "arm" | "leg"): number {
  if (type === "head") return 5;
  if (type === "body") return 3;
  return 1;
}

export function getRandomWeapon(): WeaponType {
  const weps: WeaponType[] = [
    "standard", "dagger", "spear", "hammer", "scythe", 
    "axe", "katana", "mace", "whip", "rapier", "blaster", "fireball"
  ];
  return weps[Math.floor(Math.random() * weps.length)];
}

export function spawnCharacter(
  team: number,
  modifier: LokModifier,
  existingChars: Character[],
  useSmartSpawn: boolean,
  usePool: boolean,
  weaponStyle: WeaponStyle,
  fighterSpeed: number,
  overrideX?: number,
  overrideY?: number,
  kType: KineticType = "standard",
  skinOverride: SkinType = "default",
  isBoss: boolean = false,
  masterId?: number,
): Character {
  let scale = 1;
  let baseHp = 20;
  let speed = 1.0 * fighterSpeed;
  let shieldHp = 0;
  let mass = 1.0;

  if (modifier === "titans") {
    scale *= 1.5;
    baseHp *= 2;
    speed *= 0.8;
    mass *= 2;
  } else if (modifier === "sudden_death") {
    baseHp = 1;
  }

  let weapon: WeaponType = "standard";
  if (weaponStyle === "roulette") {
    weapon = getRandomWeapon();
  } else if (weaponStyle === "melee_mash") {
    const melees: WeaponType[] = ["dagger", "spear", "hammer", "scythe", "axe", "katana", "mace", "whip", "rapier"];
    weapon = melees[Math.floor(Math.random() * melees.length)];
  } else if (weaponStyle === "ranged_test") {
    weapon = Math.random() > 0.5 ? "blaster" : "fireball";
  }

  const speedMult = 1;

  if (kType === "assassin") {
    scale *= 0.8;
    baseHp *= 0.5;
    speed *= 1.3;
    weapon = "katana";
    mass *= 0.5;
  } else if (kType === "ninja") {
    scale *= 0.9;
    speed *= 1.5;
    weapon = "dagger";
    mass *= 0.7;
  } else if (kType === "tank") {
    scale *= 1.3;
    baseHp *= 2;
    speed *= 0.7;
    weapon = "mace";
    mass *= 2;
  } else if (kType === "sniper") {
    weapon = "blaster";
    speed *= 0.9;
  } else if (kType === "mage") {
    weapon = "fireball";
    speed *= 0.8;
    isBoss = true;
  } else if (kType === "zombie") {
    speed *= 0.6;
    weapon = "standard";
  } else if (kType === "ghost") {
    speed *= 1.4;
    mass *= 0.2;
    weapon = "scythe";
    skinOverride = "ghost";
  } else if (kType === "shield") {
    shieldHp = 15;
    weapon = "standard";
    speed *= 0.8;
    mass *= 1.5;
  } else if (kType === "necromancer") {
    shieldHp = 10;
    weapon = "scythe";
    speed *= 1.2;
    isBoss = true;
  } else if (kType === "null") {
    weapon = "standard";
    speed *= 0.1;
    mass *= 5;
    isBoss = true;
  } else if (kType === "bounty") {
    scale *= 1.2;
    baseHp = 15;
    speed *= 1.5;
    weapon = "none";
    mass *= 1.5;
  } else if (kType === "volatile") {
    baseHp = 5;
    speed *= 1.8;
    mass *= 0.5;
    weapon = "none";
  } else if (kType === "gravity") {
    baseHp = 25;
    speed *= 0.6;
    weapon = "standard";
  } else if (kType === "vanguard") {
    baseHp = 25;
    speed *= 1.5;
    mass *= 2;
    weapon = "spear";
  } else if (kType === "weaver") {
    baseHp = 15;
    weapon = "rapier";
  } else if (kType === "hivemind") {
    baseHp = 60; speed *= 0.2; mass *= 3; weapon = "whip"; isBoss = true;
  } else if (kType === "glitch_chrono") {
    baseHp = 20; speed *= 1.2; weapon = "dagger";
  } else if (kType === "vampire_lord") {
    baseHp = 50; speed *= 1.3; weapon = "scythe"; isBoss = true; scale *= 1.1; mass *= 1.5;
  } else if (kType === "bat") {
    baseHp = 7; speed *= 1.5; weapon = "none"; scale *= 0.5; mass *= 0.3; skinOverride = "ghost";
  } else if (kType === "angel") {
    baseHp = 25; speed *= 0.9; weapon = "none"; mass *= 1.2;
  } else if (kType === "cherub") {
    baseHp = 10; speed *= 1.2; weapon = "none"; scale *= 0.5; mass *= 0.3; skinOverride = "ghost";
  } else if (kType === "drone") {
    baseHp = 10; speed *= 1.5; weapon = "blaster"; scale *= 0.5; mass *= 0.5;
  } else if (kType === "wasp") {
    baseHp = 5; speed *= 2.0; weapon = "dagger"; scale *= 0.4; mass *= 0.3;
  } else if (kType === "fragment") {
    baseHp = 15; speed *= 1.0; weapon = "none"; scale *= 0.6; mass *= 1.2;
  } else if (kType === "spore") {
    baseHp = 20; speed *= 0.5; weapon = "none"; scale *= 0.7; mass *= 1.0;
  }

  if (isBoss) {
    baseHp = Math.ceil(baseHp * 1.5);
    scale *= 1.15;
  }

  let x = overrideX ?? ARENA_W / 2;
  let y = overrideY ?? SCOREBOARD_H + ARENA_H / 2;

  if (overrideX === undefined) {
    if (team === 1) {
      x = 40 * scale;
      y = SCOREBOARD_H + 40 * scale + Math.random() * (ARENA_H - 80 * scale);
    } else if (team === 2) {
      x = ARENA_W - 40 * scale;
      y = SCOREBOARD_H + 40 * scale + Math.random() * (ARENA_H - 80 * scale);
    } else if (team === 3) {
      x = 40 * scale + Math.random() * (ARENA_W - 80 * scale);
      y = SCOREBOARD_H + 40 * scale;
    } else if (team === 4) {
      x = 40 * scale + Math.random() * (ARENA_W - 80 * scale);
      y = SCOREBOARD_H + ARENA_H - 40 * scale;
    } else {
      x = ARENA_W / 2 + (Math.random() - 0.5) * 100;
      y = SCOREBOARD_H + ARENA_H / 2 + (Math.random() - 0.5) * 100;
    }

    if (useSmartSpawn) {
      for (let attempt = 0; attempt < 5; attempt++) {
        let overlap = false;
        for (const other of existingChars) {
          if (other.dead) continue;
          if (
            Math.hypot(x - other.x, y - other.y) <
            CHAR_RADIUS * scale + CHAR_RADIUS * other.scale
          ) {
            overlap = true;
            break;
          }
        }
        if (!overlap) break;
        x += (Math.random() - 0.5) * 40;
        y += (Math.random() - 0.5) * 40;
      }
    }
  }

  const angle = Math.random() * Math.PI * 2;
  if (weapon === "spear" || weapon === "axe" || weapon === "mace") speed *= 0.7;
  if (weapon === "katana" || weapon === "dagger" || weapon === "rapier") speed *= 1.3;

  let vx = (Math.random() - 0.5) * speed * 2;
  let vy = (Math.random() - 0.5) * speed * 2;
  if (overrideX === undefined) {
    if (team === 1) vx = Math.abs(vx);
    if (team === 2) vx = -Math.abs(vx);
    if (team === 3) vy = Math.abs(vy);
    if (team === 4) vy = -Math.abs(vy);
  }

  let angularV = (Math.random() - 0.5) * 0.12 * speedMult;
  if (weapon === "dagger") angularV *= 2;
  if (weapon === "katana") angularV *= 2.5;
  if (weapon === "scythe" || weapon === "whip") angularV *= 1.5;
  if (kType === "vanguard") angularV *= 0.2;

  const scaledParts = BASE_PARTS.map((p) => ({
    ...p,
    ox: p.ox * scale,
    oy: p.oy * scale,
    r: p.r * scale,
  }));

  if (usePool) {
    const deadChar = existingChars.find((c) => c.dead);
    if (deadChar) {
      deadChar.team = team; deadChar.x = x; deadChar.y = y; deadChar.vx = vx;
      deadChar.vy = vy; deadChar.angle = angle; deadChar.angularV = angularV;
      deadChar.hp = baseHp; deadChar.maxHp = baseHp; deadChar.flashFrames = 0;
      deadChar.dead = false; deadChar.parts = scaledParts; deadChar.trail = [];
      deadChar.scale = scale; deadChar.weapon = weapon; deadChar.kineticType = kType;
      deadChar.skin = skinOverride; deadChar.stunTime = 0; deadChar.cooldown = 0;
      deadChar.shieldHp = shieldHp; deadChar.contacts = 0; deadChar.mass = mass;
      deadChar.isBoss = isBoss; deadChar.customTimer = 0; deadChar.masterId = masterId;
      deadChar.originalWeapon = weapon; deadChar.sabreTimer = 0;
      return deadChar;
    }
  }
  return {
    id: charIdCounter++, team, x, y, vx, vy, angle, angularV, hp: baseHp,
    maxHp: baseHp, flashFrames: 0, dead: false, parts: scaledParts, trail: [],
    scale, weapon, kineticType: kType, skin: skinOverride, stunTime: 0,
    cooldown: 0, shieldHp, contacts: 0, mass, isBoss, customTimer: 0,
    masterId, originalWeapon: weapon, sabreTimer: 0, tossedTimer: 0,
  };
}
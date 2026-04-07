import { useEffect, useRef, useCallback, useState } from "react";

const ARENA_W = 900;
const ARENA_H = 560;
const CHAR_RADIUS = 14;
const MAX_HP = 20;
const SPAWN_SPEED = 2.8;
const BOT_MIN_INTERVAL = 2000;
const BOT_MAX_INTERVAL = 4000;
const SCOREBOARD_H = 60;
const GRID_CELL_SIZE = 60;
const MAX_PARTICLES = 350;

const SPLASH_ARCHIVE = [
  "LOK HORIZON: Connecting...",
  "THEEEee ULtimatee everything-everywhere-all-at-once auto-battler?",
  "Why choose a variant when you can build the ULTIMATE?",
  "🦉 Lok: Focus on what matters.",
  "💰 COIN MODE: Greed is a weapon.",
  "GSix: Gilded Protocol - Authorized.",
  "Br/kn State: THE SOUL OF THE MACHINE.",
  "4-Tone Puke: Pure Retro DMG.",
  "Everything-Everywhere-All-At-Once.",
  "Liquidate the System.",
  "Welcome back, Eric.",
  "Welcome back, Cante.",
  "Welcome back, Miss N.",
  "Welcome back, Sire.",
  "Must build additional pylons.",
  "The only way to win is to not lose.",
  "Howa bout a pickle you nasty",
  "W.O.W Service Initiated",
  "Have you seen Moka?",
  "I love you Tan-Moka",
  "MCallie Named her BumbleBee...",
  "It's okay to be sad and happy, it grows you ^^",
  "I like saying hungry hungry hippo but I don't mean to offend",
  "Hello World!",
  "Ima Cookie MOnster",
  "You're a good person, I like you",
  "Ultimate Arena Smash Bro's",
  "Horizon Protocol Engaged.",
  "Essence limits: Unbound.",
  "We are the architects of the arena.",
];

type GameMode = "timer" | "score" | "horde" | "infection" | "unlimited";
type OpponentMode = "pvp" | "bot" | "ffa";
type ThemeMode =
  | "classic"
  | "neon"
  | "gameboy"
  | "abyss"
  | "runesite"
  | "runesite_ultimate"
  | "gsix"
  | "gilded"
  | "lokmod"
  | "hacker"
  | "synthwave"
  | "vampire"
  | "oceanic"
  | "infernal"
  | "glitch"
  | "monochrome"
  | "celestial"
  | "overdrive"
  | "comic"
  | "neon_abyss"
  | "rgb_cycle"
  | "glassmorphism"
  | "wireframe_matrix"
  | "celestial_forge"
  | "blood_moon"
  | "neon_overdrive"
  | "paper_sketch";

type LokModifier =
  | "none"
  | "sudden_death"
  | "titans"
  | "shrinking_arena"
  | "vampire_kiss"
  | "necromancy"
  | "magnet"
  | "repel"
  | "lok_bounty";

type CameraMode = "static" | "dynamic" | "action" | "enhanced" | "focus";
type ViewMode = "standard" | "theater" | "cinematic";
type MinimapPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "top-center"
  | "center";
type WeaponStyle = "standard" | "roulette" | "melee_mash" | "ranged_test";
type Environment =
  | "none"
  | "ice"
  | "blackhole"
  | "lava"
  | "storm"
  | "bouncy"
  | "wrap"
  | "blackout";
type ScreenState = "menu" | "lok_menu" | "settings_menu" | "game" | "over" | "bestiary";
type WeaponType =
  | "standard"
  | "dagger"
  | "spear"
  | "hammer"
  | "scythe"
  | "axe"
  | "katana"
  | "mace"
  | "whip"
  | "rapier"
  | "blaster"
  | "fireball"
  | "none";
type JuiceLevel = "off" | "normal" | "super";
type KineticType =
  | "standard"
  | "tank"
  | "assassin"
  | "sniper"
  | "giant"
  | "zombie"
  | "shield"
  | "null"
  | "necromancer"
  | "ninja"
  | "mage"
  | "ghost"
  | "juggernaut"
  | "bounty"
  | "volatile"
  | "gravity"
  | "vanguard"
  | "weaver"
  | "hivemind"
  | "glitch_chrono";

type SkinType =
  | "default"
  | "tea"
  | "pacman"
  | "ghost"
  | "ballman"
  | "fallguys"
  | "food"
  | "voxel"
  | "mecha"
  | "diamond"
  | "skull"
  | "robot";

type LokPassportData = {
  connected: boolean;
  username: string;
  lokCoins: number;
  equippedBackground: string | null;
  inventory: string[];
};

interface GameState {
  mode: GameMode;
  opponent: OpponentMode;
  theme: ThemeMode;
  modifier: LokModifier;
  camera: CameraMode;
  viewMode: ViewMode;
  minimapPosition: MinimapPosition;
  weaponStyle: WeaponStyle;
  environment: Environment;
  p1Score: number;
  p2Score: number;
  directorScore: number;
  timeLeft: number;
  scoreLimit: number;
  fighterSpeed: number;
  running: boolean;
  over: boolean;
  paused: boolean;
  p1Auto: boolean;
  devMode: boolean;
  winner: string;
  hitPause: number;
  shakeFrames: number;
  timeScale: number;
  stats: { maxChars: number; totalDmg: number };
  juice: JuiceLevel;
  hud: boolean;
  trails: boolean;
  motionBlur: boolean;
  ads: boolean;
  crtFilter: boolean;
  vhsFilter: boolean;
  invertFilter: boolean;
  aiMagnetic: boolean;
  handOfGod: boolean;
  optCache: boolean;
  optDelta: boolean;
  optGravity: boolean;
  optSmartSpawn: boolean;
  optGrid: boolean;
  optPool: boolean;
  actionCamTeam: number;
  actionCamIndex: number;
  draggingId: number | null;
  shrinkingZone: number;
  fpsTarget: number;
  menuParticles: boolean;
  menuDrift: boolean;
  menuGrid: boolean;
  menuPulse: boolean;
  menuCRT: boolean;
  moonGravity: boolean;
  explodingCorpses: boolean;
  sloMoKills: boolean;
  rainbowBlood: boolean;
  parallaxGrid: boolean;
  reactiveGrid: boolean;
  classicMenu: boolean;
  lokBackgroundEnabled: boolean;
  stormAngle: number;
  menuSimulator: boolean;
  minimapTextPulse: boolean;
  bountyEndsGame: boolean;
  lokMenuPosition: "left" | "right";
  lokMenuHoverCycle: boolean;
  dimKnockout: boolean;
  focusTargetId: number | null;
  focusZoom: number;
}

interface Part {
  ox: number;
  oy: number;
  r: number;
  type: "head" | "body" | "arm" | "leg";
}
interface TrailFrame {
  x: number;
  y: number;
  angle: number;
}
interface Character {
  id: number;
  team: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularV: number;
  hp: number;
  maxHp: number;
  flashFrames: number;
  dead: boolean;
  parts: Part[];
  trail: TrailFrame[];
  scale: number;
  weapon: WeaponType;
  kineticType: KineticType;
  skin: SkinType;
  stunTime: number;
  cooldown: number;
  shieldHp: number;
  contacts: number;
  mass: number;
  isBoss?: boolean;
  customTimer: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  active: boolean;
}
interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  team: number;
  active: boolean;
  type: "laser" | "fireball";
}
interface Ghost {
  x: number;
  y: number;
  team: number;
  vy: number;
  life: number;
  maxLife: number;
  scored: boolean;
  active: boolean;
}
interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
  vy: number;
  active: boolean;
  isSplat?: boolean;
}
interface KillFeedMsg {
  text: string;
  life: number;
  color: string;
  active: boolean;
}
interface Drop {
  type: "bomb" | "blackhole" | "medkit" | "freeze" | "nuke";
  x: number;
  y: number;
  timer: number;
  maxTimer: number;
  active: boolean;
  radius: number;
}
interface Essence {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  angle: number;
  rotSpeed: number;
  active: boolean;
}

const BASE_PARTS: Part[] = [
  { ox: 0, oy: -20, r: 7, type: "head" },
  { ox: 0, oy: -6, r: 9, type: "body" },
  { ox: -12, oy: -8, r: 5, type: "arm" },
  { ox: 12, oy: -8, r: 5, type: "arm" },
  { ox: -6, oy: 6, r: 5, type: "leg" },
  { ox: 6, oy: 6, r: 5, type: "leg" },
];

function getPartDamage(type: "head" | "body" | "arm" | "leg"): number {
  if (type === "head") return 5;
  if (type === "body") return 3;
  if (type === "arm") return 2;
  return 1;
}

let charIdCounter = 0;

const ObjectPoolSystem = {
  acquire: <T extends { active: boolean }>(
    pool: T[],
    usePool: boolean,
    maxSize: number,
    create: () => T,
    init: (item: T) => void
  ) => {
    if (usePool) {
      const deadItem = pool.find((i) => !i.active);
      if (deadItem) {
        init(deadItem);
        deadItem.active = true;
        return;
      }
    }
    if (maxSize > 0 && pool.length >= maxSize) return;
    const newItem = create();
    init(newItem);
    newItem.active = true;
    pool.push(newItem);
  }
};

function getRandomWeapon(): WeaponType {
  const types: WeaponType[] = [
    "standard",
    "dagger",
    "spear",
    "hammer",
    "scythe",
    "axe",
    "katana",
    "mace",
    "whip",
    "rapier",
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function spawnCharacter(
  team: number,
  modifier: LokModifier,
  existingChars: Character[],
  useSmartSpawn: boolean,
  usePool: boolean,
  wStyle: WeaponStyle,
  speedMult: number,
  overrideX?: number,
  overrideY?: number,
  kType: KineticType = "standard",
  skinOverride: SkinType = "default",
  forceBoss: boolean = false,
): Character {
  let scale = modifier === "titans" ? 2.5 : 1;
  let baseHp =
    modifier === "sudden_death" ||
    modifier === "shrinking_arena" ||
    kType === "zombie"
      ? 1
      : modifier === "titans"
        ? MAX_HP * 3
        : MAX_HP;
  let speed = (SPAWN_SPEED + Math.random() * 1.5) * speedMult;
  let weapon: WeaponType = "standard";
  let shieldHp = 0;
  let mass = modifier === "heavy" ? 3 : 1;
  let isBoss = forceBoss;

  if (wStyle === "roulette" || wStyle === "melee_mash")
    weapon = getRandomWeapon();
  else if (wStyle === "ranged_test") weapon = "blaster";

  if (kType === "giant") {
    scale *= 2.5;
    baseHp *= 4;
    speed *= 0.5;
    weapon = "hammer";
    mass *= 3;
    isBoss = true;
  } else if (kType === "juggernaut") {
    scale *= 1.5;
    baseHp *= 3;
    speed *= 0.4;
    weapon = "axe";
    mass *= 4;
    isBoss = true;
  } else if (kType === "assassin") {
    scale *= 0.8;
    baseHp = Math.max(1, Math.floor(baseHp / 2));
    speed *= 1.8;
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
  if (weapon === "katana" || weapon === "dagger" || weapon === "rapier")
    speed *= 1.3;

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
      deadChar.team = team;
      deadChar.x = x;
      deadChar.y = y;
      deadChar.vx = vx;
      deadChar.vy = vy;
      deadChar.angle = angle;
      deadChar.angularV = angularV;
      deadChar.hp = baseHp;
      deadChar.maxHp = baseHp;
      deadChar.flashFrames = 0;
      deadChar.dead = false;
      deadChar.parts = scaledParts;
      deadChar.trail = [];
      deadChar.scale = scale;
      deadChar.weapon = weapon;
      deadChar.kineticType = kType;
      deadChar.skin = skinOverride;
      deadChar.stunTime = 0;
      deadChar.cooldown = 0;
      deadChar.shieldHp = shieldHp;
      deadChar.contacts = 0;
      deadChar.mass = mass;
      deadChar.isBoss = isBoss;
      deadChar.customTimer = 0;
      return deadChar;
    }
  }
  return {
    id: charIdCounter++,
    team,
    x,
    y,
    vx,
    vy,
    angle,
    angularV,
    hp: baseHp,
    maxHp: baseHp,
    flashFrames: 0,
    dead: false,
    parts: scaledParts,
    trail: [],
    scale,
    weapon,
    kineticType: kType,
    skin: skinOverride,
    stunTime: 0,
    cooldown: 0,
    shieldHp,
    contacts: 0,
    mass,
    isBoss,
    customTimer: 0,
  };
}

function getTeamColor(
  team: number,
  theme: ThemeMode,
  kType: KineticType = "standard",
  ts: number = 0,
): string {
  if (kType === "bounty") return "#ffd700";
  if (kType === "null") return "#555555";
  if (kType === "zombie" || team === 5) return "#33ff33";
  if (kType === "necromancer") return "#aa00ff";
  if (kType === "volatile") return "#ff2222";
  if (kType === "gravity") return "#8800ff";
  if (kType === "vanguard") return "#aaddff";
  if (kType === "weaver") return "#00ff88";
  if (kType === "hivemind") return "#ff8800";
  if (kType === "glitch_chrono") return "#ff00ff";

  if (theme === "rgb_cycle" || theme === "neon_overdrive")
    return `hsl(${(ts * 0.1 + team * 90) % 360}, 100%, 60%)`;
  if (theme === "wireframe_matrix")
    return team === 1 ? "#00ff00" : team === 2 ? "#00aa00" : "#aaffaa";
  if (theme === "glassmorphism")
    return team === 1
      ? "rgba(255, 80, 80, 0.7)"
      : team === 2
        ? "rgba(80, 150, 255, 0.7)"
        : "rgba(80, 255, 80, 0.7)";
  if (theme === "blood_moon")
    return team === 1 ? "#ff0000" : team === 2 ? "#cc0000" : "#880000";
  if (theme === "celestial_forge")
    return team === 1 ? "#00ffff" : team === 2 ? "#ffcc00" : "#ffffff";
  if (theme === "paper_sketch") return "#000000";
  if (theme === "gameboy") return team === 1 ? "#306230" : "#0f380f";
  if (theme === "runesite" || theme === "runesite_ultimate")
    return team === 1
      ? "#b12a2a"
      : team === 2
        ? "#2a52b1"
        : team === 3
          ? "#2ab144"
          : "#b1a82a";
  if (theme === "gsix")
    return team === 1
      ? "#00f0ff"
      : team === 2
        ? "#cccccc"
        : team === 3
          ? "#ffffff"
          : "#444444";
  if (theme === "gilded")
    return team === 1
      ? "#ffd700"
      : team === 2
        ? "#b8860b"
        : team === 3
          ? "#e5e4e2"
          : "#8b0000";
  if (theme === "lokmod")
    return team === 1
      ? "#ffd700"
      : team === 2
        ? "#ccaaff"
        : team === 3
          ? "#ffffff"
          : "#444444";
  if (theme === "glitch")
    return team === 1
      ? "#00ffff"
      : team === 2
        ? "#ff00ff"
        : team === 3
          ? "#ffff00"
          : "#ffffff";
  if (theme === "monochrome" || theme === "comic")
    return team === 1
      ? "#ffffff"
      : team === 2
        ? "#888888"
        : team === 3
          ? "#dddddd"
          : "#444444";
  if (theme === "celestial")
    return team === 1
      ? "#ffffff"
      : team === 2
        ? "#ffd700"
        : team === 3
          ? "#aaccff"
          : "#eeeeee";
  if (theme === "overdrive")
    return team === 1
      ? "#ff2200"
      : team === 2
        ? "#ffaa00"
        : team === 3
          ? "#ff0000"
          : "#880000";
  if (theme === "hacker")
    return team === 1
      ? "#00ff00"
      : team === 2
        ? "#008800"
        : team === 3
          ? "#ccffcc"
          : "#004400";
  if (theme === "synthwave" || theme === "neon_abyss")
    return team === 1
      ? "#ff00ff"
      : team === 2
        ? "#00ffff"
        : team === 3
          ? "#ffff00"
          : "#ff8800";
  if (theme === "vampire")
    return team === 1
      ? "#dd0000"
      : team === 2
        ? "#550000"
        : team === 3
          ? "#ffffff"
          : "#880000";
  if (theme === "oceanic")
    return team === 1
      ? "#00aaff"
      : team === 2
        ? "#0055ff"
        : team === 3
          ? "#00ffcc"
          : "#002288";
  if (theme === "infernal")
    return team === 1
      ? "#ff4400"
      : team === 2
        ? "#ff8800"
        : team === 3
          ? "#ffaa00"
          : "#882200";
  if (theme === "abyss")
    return team === 1
      ? "#ffffff"
      : team === 2
        ? "#aaaaaa"
        : team === 3
          ? "#dddddd"
          : "#555555";

  return team === 1
    ? "#ff6655"
    : team === 2
      ? "#5599ff"
      : team === 3
        ? "#55ff55"
        : "#ffff55";
}

function rotatePoint(ox: number, oy: number, angle: number): [number, number] {
  return [
    ox * Math.cos(angle) - oy * Math.sin(angle),
    ox * Math.sin(angle) + oy * Math.cos(angle),
  ];
}

function getWeaponTip(c: Character): [number, number] {
  let reach = 30;
  if (c.weapon === "dagger") reach = 18;
  else if (c.weapon === "spear") reach = 45;
  else if (c.weapon === "scythe") reach = 40;
  else if (c.weapon === "axe") reach = 25;
  else if (c.weapon === "katana") reach = 35;
  else if (c.weapon === "mace") reach = 28;
  else if (c.weapon === "rapier") reach = 42;
  else if (c.weapon === "whip") reach = 38;
  else if (c.weapon === "blaster" || c.weapon === "fireball") reach = 20;
  else if (c.weapon === "none") reach = 0;
  const [wx, wy] = rotatePoint(0, -reach * c.scale, c.angle);
  return [c.x + wx, c.y + wy];
}

function pushParticle(
  x: number,
  y: number,
  vx: number,
  vy: number,
  life: number,
  color: string,
  size: number,
  pool: Particle[],
  usePool: boolean,
) {
  if (pool.length >= MAX_PARTICLES) return;
  if (usePool) {
    const deadP = pool.find((p) => !p.active);
    if (deadP) {
      deadP.x = x;
      deadP.y = y;
      deadP.vx = vx;
      deadP.vy = vy;
      deadP.life = life;
      deadP.maxLife = life;
      deadP.color = color;
      deadP.size = size;
      deadP.active = true;
      return;
    }
  }
  pool.push({ x, y, vx, vy, life, maxLife: life, color, size, active: true });
}

function pushEssence(
  x: number,
  y: number,
  color: string,
  pool: Essence[],
  usePool: boolean,
) {
  const vx = (Math.random() - 0.5) * 8;
  const vy = (Math.random() - 0.5) * 8;
  const life = 200 + Math.random() * 100;
  if (usePool) {
    const deadE = pool.find((e) => !e.active);
    if (deadE) {
      deadE.x = x;
      deadE.y = y;
      deadE.vx = vx;
      deadE.vy = vy;
      deadE.life = life;
      deadE.maxLife = life;
      deadE.color = color;
      deadE.angle = 0;
      deadE.rotSpeed = (Math.random() - 0.5) * 0.2;
      deadE.active = true;
      return;
    }
  }
  pool.push({
    x,
    y,
    vx,
    vy,
    life,
    maxLife: life,
    color,
    angle: 0,
    rotSpeed: (Math.random() - 0.5) * 0.2,
    active: true,
  });
}

function drawSkin(
  ctx: CanvasRenderingContext2D,
  c: Character,
  color: string,
  skin: string,
  scale: number,
  flash: boolean = false,
  theme: ThemeMode = "classic",
  devMode: boolean = false
): boolean {
  const isWire = devMode || theme === "wireframe_matrix" || theme === "paper_sketch";
  const isGlass = theme === "glassmorphism";
  const isAbyss = theme === "abyss" || theme === "hacker" || theme === "glitch" || theme === "neon_abyss" || theme === "rgb_cycle" || theme === "neon_overdrive";

  const applyColor = (cBase: string) => {
    if (flash) return "white";
    if (isGlass) return "rgba(255,255,255,0.2)";
    if (isAbyss && cBase !== "#000" && cBase !== "#fff" && cBase !== "#000000" && cBase !== "#ffffff" && cBase !== "rgba(0,0,0,0.3)") return color;
    return cBase;
  };

  const fill = () => {
    if (isWire) ctx.stroke();
    else ctx.fill();
  };

  const fillRect = (x: number, y: number, w: number, h: number) => {
    if (isWire) ctx.strokeRect(x, y, w, h);
    else ctx.fillRect(x, y, w, h);
  };

  if (skin === "pacman") {
    ctx.fillStyle = "#ffff00";
    ctx.fillStyle = applyColor("#ffff00");
    ctx.strokeStyle = applyColor("#ffff00");
    ctx.beginPath();
    const mouthOpen = Math.abs(Math.sin(Date.now() / 100)) * 0.5;
    ctx.arc(0, 0, 15 * scale, mouthOpen, Math.PI * 2 - mouthOpen);
    ctx.lineTo(0, 0);
    ctx.fill();
    fill();
    return true;
  }
  if (skin === "tea") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(-12 * scale, -10 * scale, 24 * scale, 20 * scale);
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = applyColor("#fff");
    ctx.strokeStyle = applyColor("#fff");
    fillRect(-12 * scale, -10 * scale, 24 * scale, 20 * scale);
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.arc(12 * scale, 0, 8 * scale, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillRect(-10 * scale, -8 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    fillRect(-10 * scale, -8 * scale, 20 * scale, 10 * scale);
    return true;
  }
  if (skin === "ballman") {
    ctx.fillStyle = color;
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    ctx.beginPath();
    ctx.arc(0, 0, 14 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    fill();
    ctx.fillStyle = applyColor("#fff");
    ctx.strokeStyle = applyColor("#fff");
    ctx.beginPath();
    ctx.arc(-5 * scale, -5 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.arc(5 * scale, -5 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    fill();
    ctx.fillStyle = applyColor("#000");
    ctx.strokeStyle = applyColor("#000");
    ctx.beginPath();
    ctx.arc(-5 * scale, -5 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.arc(5 * scale, -5 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    fill();
    return true;
  }
  if (skin === "fallguys") {
    ctx.fillStyle = color;
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    ctx.beginPath();
    ctx.roundRect(-10 * scale, -15 * scale, 20 * scale, 30 * scale, 10 * scale);
    ctx.fill();
    ctx.fillStyle = "#fff";
    fill();
    ctx.fillStyle = applyColor("#fff");
    ctx.strokeStyle = applyColor("#fff");
    ctx.beginPath();
    ctx.roundRect(-6 * scale, -10 * scale, 12 * scale, 8 * scale, 4 * scale);
    ctx.fill();
    fill();
    return true;
  }
  if (skin === "food") {
    ctx.fillStyle = "#e8b878";
    ctx.fillStyle = applyColor("#e8b878");
    ctx.strokeStyle = applyColor("#e8b878");
    ctx.beginPath();
    ctx.arc(0, -5 * scale, 12 * scale, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#552200";
    ctx.fillRect(-12 * scale, -5 * scale, 24 * scale, 6 * scale);
    ctx.fillStyle = "#22aa22";
    ctx.fillRect(-13 * scale, 1 * scale, 26 * scale, 3 * scale);
    ctx.fillStyle = "#e8b878";
    ctx.fillRect(-11 * scale, 4 * scale, 22 * scale, 6 * scale);
    fill();
    ctx.fillStyle = applyColor("#552200");
    ctx.strokeStyle = applyColor("#552200");
    fillRect(-12 * scale, -5 * scale, 24 * scale, 6 * scale);
    ctx.fillStyle = applyColor("#22aa22");
    ctx.strokeStyle = applyColor("#22aa22");
    fillRect(-13 * scale, 1 * scale, 26 * scale, 3 * scale);
    ctx.fillStyle = applyColor("#e8b878");
    ctx.strokeStyle = applyColor("#e8b878");
    fillRect(-11 * scale, 4 * scale, 22 * scale, 6 * scale);
    return true;
  }
  if (skin === "voxel") {
    ctx.fillStyle = color;
    ctx.fillRect(-10 * scale, -10 * scale, 20 * scale, 20 * scale);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(-10 * scale, 0, 20 * scale, 10 * scale);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-6 * scale, -6 * scale, 4 * scale, 4 * scale);
    ctx.fillRect(2 * scale, -6 * scale, 4 * scale, 4 * scale);
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    fillRect(-10 * scale, -10 * scale, 20 * scale, 20 * scale);
    ctx.fillStyle = applyColor("rgba(0,0,0,0.3)");
    ctx.strokeStyle = applyColor("rgba(0,0,0,0.3)");
    fillRect(-10 * scale, 0, 20 * scale, 10 * scale);
    ctx.fillStyle = applyColor("#fff");
    ctx.strokeStyle = applyColor("#fff");
    fillRect(-6 * scale, -6 * scale, 4 * scale, 4 * scale);
    fillRect(2 * scale, -6 * scale, 4 * scale, 4 * scale);
    return true;
  }
  if (skin === "mecha") {
    ctx.fillStyle = "#888";
    ctx.fillRect(-12 * scale, -15 * scale, 24 * scale, 30 * scale);
    ctx.fillStyle = color;
    ctx.fillRect(-10 * scale, -12 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = "#0ff";
    ctx.fillRect(-6 * scale, -20 * scale, 12 * scale, 5 * scale);
    ctx.fillStyle = applyColor("#888");
    ctx.strokeStyle = applyColor("#888");
    fillRect(-12 * scale, -15 * scale, 24 * scale, 30 * scale);
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    fillRect(-10 * scale, -12 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = applyColor("#0ff");
    ctx.strokeStyle = applyColor("#0ff");
    fillRect(-6 * scale, -20 * scale, 12 * scale, 5 * scale);
    return true;
  }
  if (skin === "diamond") {
    ctx.fillStyle = color;
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    ctx.beginPath();
    ctx.moveTo(0, -18 * scale);
    ctx.lineTo(14 * scale, 0);
    ctx.lineTo(0, 18 * scale);
    ctx.lineTo(-14 * scale, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    fill();
    ctx.fillStyle = applyColor("rgba(255,255,255,0.5)");
    ctx.strokeStyle = applyColor("rgba(255,255,255,0.5)");
    ctx.beginPath();
    ctx.moveTo(0, -18 * scale);
    ctx.lineTo(7 * scale, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    fill();
    return true;
  }
  if (skin === "skull") {
    ctx.fillStyle = "#eee";
    ctx.fillStyle = applyColor("#eee");
    ctx.strokeStyle = applyColor("#eee");
    ctx.beginPath();
    ctx.arc(0, -5 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-10 * scale, -5 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = "#000";
    fill();
    fillRect(-10 * scale, -5 * scale, 20 * scale, 10 * scale);
    ctx.fillStyle = applyColor("#000");
    ctx.strokeStyle = applyColor("#000");
    ctx.beginPath();
    ctx.arc(-4 * scale, -7 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.arc(4 * scale, -7 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-6 * scale, 1 * scale, 3 * scale, 5 * scale);
    ctx.fillRect(-1 * scale, 1 * scale, 3 * scale, 5 * scale);
    ctx.fillRect(4 * scale, 1 * scale, 3 * scale, 5 * scale);
    fill();
    fillRect(-6 * scale, 1 * scale, 3 * scale, 5 * scale);
    fillRect(-1 * scale, 1 * scale, 3 * scale, 5 * scale);
    fillRect(4 * scale, 1 * scale, 3 * scale, 5 * scale);
    return true;
  }
  if (skin === "robot") {
    ctx.fillStyle = "#555";
    ctx.fillRect(-11 * scale, -16 * scale, 22 * scale, 14 * scale);
    ctx.fillStyle = color;
    ctx.fillRect(-11 * scale, -2 * scale, 22 * scale, 14 * scale);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(-8 * scale, -13 * scale, 5 * scale, 4 * scale);
    ctx.fillRect(3 * scale, -13 * scale, 5 * scale, 4 * scale);
    ctx.fillStyle = "#888";
    ctx.fillRect(-11 * scale, -16 * scale, 22 * scale, 3 * scale);
    ctx.fillStyle = applyColor("#555");
    ctx.strokeStyle = applyColor("#555");
    fillRect(-11 * scale, -16 * scale, 22 * scale, 14 * scale);
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    fillRect(-11 * scale, -2 * scale, 22 * scale, 14 * scale);
    ctx.fillStyle = applyColor("#0f0");
    ctx.strokeStyle = applyColor("#0f0");
    fillRect(-8 * scale, -13 * scale, 5 * scale, 4 * scale);
    fillRect(3 * scale, -13 * scale, 5 * scale, 4 * scale);
    ctx.fillStyle = applyColor("#888");
    ctx.strokeStyle = applyColor("#888");
    fillRect(-11 * scale, -16 * scale, 22 * scale, 3 * scale);
    return true;
  }
  if (skin === "ghost") {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = color;
    ctx.fillStyle = applyColor(color);
    ctx.strokeStyle = applyColor(color);
    ctx.beginPath();
    ctx.arc(0, -5 * scale, 10 * scale, Math.PI, 0);
    ctx.lineTo(10 * scale, 10 * scale);
    ctx.lineTo(5 * scale, 5 * scale);
    ctx.lineTo(0, 10 * scale);
    ctx.lineTo(-5 * scale, 5 * scale);
    ctx.lineTo(-10 * scale, 10 * scale);
    ctx.closePath();
    ctx.fill();
    fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.fillStyle = applyColor("white");
    ctx.strokeStyle = applyColor("white");
    ctx.beginPath();
    ctx.arc(-4 * scale, -7 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.arc(4 * scale, -7 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    fill();
    return true;
  }
  void c;
  return false;
}

function drawRawChar(
  ctx: CanvasRenderingContext2D,
  c: Character,
  flash: boolean,
  theme: ThemeMode,
  devMode: boolean,
  timestamp: number,
) {
  const scale = c.scale;
  const team = c.team;
  if (flash) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
  }

  if (devMode || theme === "wireframe_matrix" || theme === "paper_sketch") {
    ctx.strokeStyle = flash
      ? "white"
      : theme === "paper_sketch"
        ? "#000"
        : getTeamColor(team, theme, c.kineticType, timestamp);
    ctx.lineWidth = theme === "wireframe_matrix" ? 2 * scale : 1.5;

    if (
      c.skin !== "default" &&
      drawSkin(ctx, c, "transparent", c.skin, scale, flash, theme, devMode)
    ) {
      ctx.stroke();
      // Sub-parts stroked dynamically within drawSkin based on `devMode` / theme context!
    } else {
      for (const p of c.parts) {
        ctx.beginPath();
        ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (c.weapon !== "none") {
      let wR = 6;
      if (
        c.weapon === "dagger" ||
        c.weapon === "katana" ||
        c.weapon === "rapier"
      )
        wR = 4;
      else if (
        c.weapon === "hammer" ||
        c.weapon === "axe" ||
        c.weapon === "mace"
      )
        wR = 10;
      const reach =
        c.weapon === "spear"
          ? 45
          : c.weapon === "dagger"
            ? 18
            : c.weapon === "scythe"
              ? 40
              : c.weapon === "katana"
                ? 35
                : c.weapon === "axe"
                  ? 25
                  : c.weapon === "mace"
                    ? 28
                    : c.weapon === "rapier"
                      ? 42
                      : c.weapon === "whip"
                        ? 38
                        : c.weapon === "blaster" || c.weapon === "fireball"
                          ? 20
                          : 30;
      ctx.strokeStyle = flash
        ? "white"
        : theme === "wireframe_matrix"
          ? "#fff"
          : theme === "paper_sketch"
            ? "#000"
            : "#00ff00";
      ctx.beginPath();
      ctx.arc(0, -reach * scale, wR * scale, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (theme === "glassmorphism") {
    const color = getTeamColor(team, theme, c.kineticType, timestamp);
    ctx.fillStyle = flash ? "white" : color;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1.5 * scale;
    if (!drawSkin(ctx, c, color, c.skin, scale, flash, theme, devMode)) {
      for (const p of c.parts) {
        ctx.beginPath();
        if (p.type === "body") ctx.roundRect(p.ox - p.r, p.oy - p.r * 1.2, p.r * 2, p.r * 2.4, p.r * 0.4);
        else if (p.type === "head") ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
        else ctx.roundRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2, p.r * 0.5);
        ctx.fill();
        ctx.stroke();
      }
    }
    if (c.weapon !== "none")
      drawWeapon(
        ctx,
        c.weapon,
        scale,
        "rgba(255,255,255,0.8)",
        "rgba(200,200,200,0.4)",
        theme,
        timestamp,
      );
  } else if (
    theme === "abyss" ||
    theme === "hacker" ||
    theme === "glitch" ||
    theme === "neon_abyss" ||
    theme === "rgb_cycle" ||
    theme === "neon_overdrive"
  ) {
    let glowColor = getTeamColor(team, theme, c.kineticType, timestamp);
    if (theme === "neon_abyss")
      glowColor = team === 1 ? "#ff00ff" : team === 2 ? "#00ffff" : "#00ff00";
    if (c.kineticType === "ghost" || c.skin === "ghost") ctx.globalAlpha = 0.4;

    if (!drawSkin(ctx, c, glowColor, c.skin, scale, flash, theme, devMode)) {
      for (const p of c.parts) {
        if (theme === "neon_abyss") {
          ctx.strokeStyle = flash ? "white" : glowColor;
          ctx.lineWidth = 2 * scale;
          ctx.strokeRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2);
        } else {
          ctx.beginPath();
          if (p.type === "body") ctx.roundRect(p.ox - p.r, p.oy - p.r * 1.2, p.r * 2, p.r * 2.4, p.r * 0.4);
          else if (p.type === "head") ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
          else ctx.roundRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2, p.r * 0.5);

          ctx.fillStyle = "#050505";
          ctx.fill();

          ctx.lineWidth = 1.5 * scale;
          ctx.strokeStyle = flash ? "white" : p.type === "head" ? glowColor : "rgba(255,255,255,0.15)";

          if (p.type === "head") {
            ctx.shadowBlur = 12;
            ctx.shadowColor = glowColor;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.stroke();
        }
      }
    }
    if (c.weapon !== "none")
      drawWeapon(
        ctx,
        c.weapon,
        scale,
        flash
          ? "white"
          : theme === "hacker"
            ? "#00ff00"
            : theme === "glitch"
              ? "#fff"
              : "#ffff00",
        flash
          ? "white"
          : theme === "hacker"
            ? "#005500"
            : "#ffff00",
        theme,
        timestamp,
      );
    ctx.globalAlpha = 1;
  } else {
    let skin = "#ffcc99",
      dark = "#aa2211";
    if (c.kineticType === "bounty") {
      skin = "#ffffff";
      dark = "#ffd700";
    } else if (c.kineticType === "zombie" || team === 5) {
      skin = "#ccffcc";
      dark = "#004400";
    } else if (c.kineticType === "null") {
      skin = "#aaaaaa";
      dark = "#555555";
    } else if (theme === "gameboy") {
      skin = "#8bac0f";
      dark = team === 1 ? "#0f380f" : "#306230";
    } else if (theme === "runesite" || theme === "runesite_ultimate") {
      skin = "#dca878";
      dark = team === 1 ? "#5e1515" : "#152c5e";
    } else if (theme === "gsix") {
      skin = "#080808";
      dark = "#cccccc";
    } else if (theme === "gilded" || theme === "lokmod") {
      skin = "#fff";
      dark = "#1a0f00";
    } else if (theme === "synthwave") {
      skin = "#ffccff";
      dark = "#220044";
    } else if (theme === "vampire" || theme === "blood_moon") {
      skin = "#ffffff";
      dark = "#222222";
    } else if (theme === "oceanic") {
      skin = "#ccffff";
      dark = "#002244";
    } else if (theme === "infernal" || theme === "overdrive") {
      skin = "#ffaaaa";
      dark = "#440000";
    } else if (theme === "monochrome" || theme === "comic") {
      skin = "#ffffff";
      dark = "#000000";
    } else if (theme === "celestial" || theme === "celestial_forge") {
      skin = "#ffffff";
      dark = "#aa8800";
    } else {
      dark =
        team === 1
          ? "#aa2211"
          : team === 2
            ? "#2244aa"
            : team === 3
              ? "#22aa22"
              : "#aaaa22";
    }
    const color = getTeamColor(team, theme, c.kineticType, timestamp);

    if (c.kineticType === "ghost" || c.skin === "ghost") ctx.globalAlpha = 0.4;

    if (!drawSkin(ctx, c, color, c.skin, scale, flash, theme, devMode)) {
      if (theme === "neon") {
        ctx.fillStyle = "#050505";
        ctx.strokeStyle = flash ? "white" : color;
        ctx.lineWidth = 2 * scale;
        ctx.shadowBlur = flash ? 15 : 8;
        ctx.shadowColor = flash ? "white" : color;
        for (const p of c.parts) {
          ctx.fillRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2);
          ctx.strokeRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2);
        }
      } else {
        for (const p of c.parts) {
          const partColor = flash
            ? "white"
            : p.type === "head"
              ? skin
              : p.type === "body"
                ? color
                : p.type === "arm"
                  ? dark
                  : color;
          
          ctx.fillStyle = partColor;
          
          if (!flash && theme !== "comic" && theme !== "paper_sketch") {
             ctx.shadowBlur = 4;
             ctx.shadowColor = "rgba(0,0,0,0.4)";
          }
          
          ctx.beginPath();
          if (p.type === "body") ctx.roundRect(p.ox - p.r, p.oy - p.r * 1.2, p.r * 2, p.r * 2.4, p.r * 0.4);
          else if (p.type === "head") ctx.arc(p.ox, p.oy, p.r, 0, Math.PI * 2);
          else ctx.roundRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2, p.r * 0.5);
          ctx.fill();
          
          if (theme === "comic" || theme === "paper_sketch") {
            ctx.strokeStyle = theme === "comic" ? "#000" : "rgba(0,0,0,0.6)";
            ctx.lineWidth = 1.5 * scale;
            ctx.stroke();
          } else if (!flash) {
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.lineWidth = 1 * scale;
            ctx.stroke();
          }
          
          ctx.shadowBlur = 0;

          if (!flash && p.type === "head") {
            ctx.fillStyle =
              theme === "gsix" ||
              theme === "gilded" ||
              theme === "vampire" ||
              theme === "lokmod" ||
              theme === "monochrome" ||
              theme === "comic" ||
              theme === "blood_moon"
                ? "#fff"
                : theme === "gameboy"
                  ? "#0f380f"
                  : "#111";
            
            ctx.beginPath();
            ctx.ellipse(p.ox - 3 * scale, p.oy - 1 * scale, 1.5 * scale, 2.5 * scale, 0.2, 0, Math.PI * 2);
            ctx.ellipse(p.ox + 3 * scale, p.oy - 1 * scale, 1.5 * scale, 2.5 * scale, -0.2, 0, Math.PI * 2);
            ctx.fill();
            
            if (theme === "vampire" || theme === "blood_moon" || theme === "infernal") {
              ctx.fillStyle = theme === "infernal" ? "#ffaa00" : "#ff0000";
              ctx.beginPath();
              ctx.arc(p.ox - 3 * scale, p.oy - 1 * scale, 0.8 * scale, 0, Math.PI * 2);
              ctx.arc(p.ox + 3 * scale, p.oy - 1 * scale, 0.8 * scale, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    }

    if (c.shieldHp > 0) {
      ctx.strokeStyle = "rgba(0, 150, 255, 0.8)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00aaff";
      ctx.beginPath();
      ctx.arc(0, 0, CHAR_RADIUS * scale * 1.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    if (c.weapon !== "none") {
      let wCol1 = flash ? "white" : "#ffee44";
      let wCol2 = flash ? "white" : "#aaaaaa";
      if (theme === "gameboy") {
        wCol1 = "#9bbc0f";
        wCol2 = "#306230";
      }
      if (theme === "runesite" || theme === "runesite_ultimate") {
        wCol1 = flash ? "white" : "#aaaaaa";
        wCol2 = flash ? "white" : "#555555";
      }
      if (theme === "gsix") {
        wCol1 = flash ? "white" : "#00f0ff";
        wCol2 = flash ? "white" : "#444";
      }
      if (
        theme === "gilded" ||
        theme === "lokmod" ||
        theme === "celestial" ||
        c.kineticType === "bounty" ||
        theme === "celestial_forge"
      ) {
        wCol1 = flash ? "white" : "#ffd700";
        wCol2 = flash ? "white" : "#cc9900";
      }
      if (
        theme === "vampire" ||
        theme === "monochrome" ||
        theme === "overdrive" ||
        theme === "comic" ||
        theme === "blood_moon"
      ) {
        wCol1 = flash ? "white" : "#ff0000";
        wCol2 = flash ? "white" : "#555555";
      }
      if (
        theme === "neon" ||
        theme === "synthwave" ||
        theme === "glitch" ||
        theme === "neon_overdrive"
      ) {
        wCol1 = flash ? "white" : "#ffff00";
        wCol2 = "transparent";
      }
      if (theme === "rgb_cycle") {
        wCol1 = color;
        wCol2 = "#fff";
      }
      drawWeapon(ctx, c.weapon, scale, wCol1, wCol2, theme, timestamp);
    }
    ctx.globalAlpha = 1;
  }

  // Boss crown
  if (c.isBoss && !c.dead) {
    ctx.save();
    ctx.fillStyle = "#ffd700";
    ctx.strokeStyle = "#aa8800";
    ctx.lineWidth = 1;
    const cy = -CHAR_RADIUS * scale * 2.2;
    ctx.beginPath();
    ctx.moveTo(-7 * scale, cy + 4 * scale);
    ctx.lineTo(-7 * scale, cy - 2 * scale);
    ctx.lineTo(-4 * scale, cy);
    ctx.lineTo(0, cy - 5 * scale);
    ctx.lineTo(4 * scale, cy);
    ctx.lineTo(7 * scale, cy - 2 * scale);
    ctx.lineTo(7 * scale, cy + 4 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawWeapon(
  ctx: CanvasRenderingContext2D,
  type: WeaponType,
  scale: number,
  c1: string,
  c2: string,
  theme: ThemeMode,
  ts: number,
) {
  if (type === "none") return;
  void ts;
  if (
    theme === "neon" ||
    theme === "synthwave" ||
    theme === "glitch" ||
    theme === "neon_abyss" ||
    theme === "neon_overdrive"
  ) {
    ctx.strokeStyle = c1;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    if (type === "dagger") {
      ctx.moveTo(0, -20 * scale);
      ctx.lineTo(0, -28 * scale);
    } else if (type === "spear") {
      ctx.moveTo(0, -26 * scale);
      ctx.lineTo(0, -58 * scale);
    } else if (type === "scythe") {
      ctx.moveTo(0, -26 * scale);
      ctx.lineTo(0, -40 * scale);
      ctx.quadraticCurveTo(-20 * scale, -35 * scale, -25 * scale, -20 * scale);
    } else if (type === "axe") {
      ctx.moveTo(0, -20 * scale);
      ctx.lineTo(0, -35 * scale);
      ctx.moveTo(-10 * scale, -30 * scale);
      ctx.lineTo(10 * scale, -30 * scale);
      ctx.lineTo(10 * scale, -40 * scale);
      ctx.lineTo(-10 * scale, -40 * scale);
      ctx.closePath();
    } else if (type === "katana") {
      ctx.moveTo(0, -20 * scale);
      ctx.quadraticCurveTo(5 * scale, -30 * scale, 0, -45 * scale);
    } else if (type === "mace") {
      ctx.moveTo(0, -20 * scale);
      ctx.lineTo(0, -35 * scale);
      ctx.arc(0, -35 * scale, 6 * scale, 0, Math.PI * 2);
    } else if (type === "rapier") {
      ctx.moveTo(0, -20 * scale);
      ctx.lineTo(0, -45 * scale);
      ctx.moveTo(-3 * scale, -25 * scale);
      ctx.lineTo(3 * scale, -25 * scale);
    } else if (type === "whip") {
      ctx.moveTo(0, -20 * scale);
      ctx.bezierCurveTo(
        -20 * scale,
        -30 * scale,
        20 * scale,
        -40 * scale,
        0,
        -50 * scale,
      );
    } else if (type === "blaster" || type === "fireball") {
      ctx.moveTo(-4 * scale, -20 * scale);
      ctx.lineTo(4 * scale, -20 * scale);
      ctx.lineTo(4 * scale, -26 * scale);
      ctx.lineTo(1 * scale, -26 * scale);
      ctx.lineTo(1 * scale, -30 * scale);
      ctx.lineTo(-1 * scale, -30 * scale);
      ctx.lineTo(-1 * scale, -26 * scale);
      ctx.lineTo(-4 * scale, -26 * scale);
      ctx.closePath();
    } else {
      ctx.moveTo(0, -26 * scale);
      ctx.lineTo(0, -46 * scale);
      if (type === "hammer") {
        ctx.moveTo(-6 * scale, -42 * scale);
        ctx.lineTo(6 * scale, -42 * scale);
      }
    }
    ctx.stroke();
    return;
  }
  ctx.fillStyle = c2;
  if (theme === "comic" || theme === "paper_sketch") {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
  }
  const drawPoly = (pts: number[]) => {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.closePath();
    ctx.fill();
    if (theme === "comic" || theme === "paper_sketch") ctx.stroke();
  };

  if (type === "dagger") {
    ctx.fillRect(-2 * scale, -26 * scale, 4 * scale, 6 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-2 * scale, -30 * scale, 4 * scale, 4 * scale);
  } else if (type === "spear") {
    ctx.fillRect(-2 * scale, -46 * scale, 4 * scale, 26 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-3 * scale, -58 * scale, 6 * scale, 12 * scale);
  } else if (type === "hammer") {
    ctx.fillRect(-2 * scale, -38 * scale, 4 * scale, 18 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-8 * scale, -44 * scale, 16 * scale, 10 * scale);
  } else if (type === "scythe") {
    ctx.fillRect(-2 * scale, -40 * scale, 4 * scale, 20 * scale);
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(-2 * scale, -40 * scale);
    ctx.quadraticCurveTo(-20 * scale, -30 * scale, -25 * scale, -15 * scale);
    ctx.lineTo(-20 * scale, -15 * scale);
    ctx.quadraticCurveTo(-15 * scale, -25 * scale, -2 * scale, -35 * scale);
    ctx.fill();
    if (theme === "comic" || theme === "paper_sketch") ctx.stroke();
  } else if (type === "axe") {
    ctx.fillRect(-2 * scale, -35 * scale, 4 * scale, 15 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-10 * scale, -40 * scale, 20 * scale, 10 * scale);
  } else if (type === "katana") {
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(-2 * scale, -20 * scale);
    ctx.quadraticCurveTo(3 * scale, -35 * scale, -2 * scale, -45 * scale);
    ctx.lineTo(2 * scale, -45 * scale);
    ctx.quadraticCurveTo(7 * scale, -35 * scale, 2 * scale, -20 * scale);
    ctx.fill();
    if (theme === "comic" || theme === "paper_sketch") ctx.stroke();
  } else if (type === "mace") {
    ctx.fillRect(-2 * scale, -35 * scale, 4 * scale, 15 * scale);
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.arc(0, -35 * scale, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    if (theme === "comic" || theme === "paper_sketch") ctx.stroke();
  } else if (type === "rapier") {
    ctx.fillRect(-1 * scale, -45 * scale, 2 * scale, 25 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-3 * scale, -25 * scale, 6 * scale, 3 * scale);
  } else if (type === "whip") {
    ctx.strokeStyle = c1;
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(0, -20 * scale);
    ctx.bezierCurveTo(
      -20 * scale,
      -30 * scale,
      20 * scale,
      -40 * scale,
      0,
      -50 * scale,
    );
    ctx.stroke();
  } else if (type === "blaster" || type === "fireball") {
    drawPoly([
      -4 * scale,
      -20 * scale,
      4 * scale,
      -20 * scale,
      4 * scale,
      -26 * scale,
      1 * scale,
      -26 * scale,
      1 * scale,
      -30 * scale,
      -1 * scale,
      -30 * scale,
      -1 * scale,
      -26 * scale,
      -4 * scale,
      -26 * scale,
    ]);
    ctx.fillStyle = c1;
    ctx.fillRect(-1 * scale, -30 * scale, 2 * scale, 2 * scale);
  } else {
    ctx.fillRect(-3 * scale, -46 * scale, 6 * scale, 8 * scale);
    ctx.fillStyle = c1;
    ctx.fillRect(-2 * scale, -38 * scale, 4 * scale, 12 * scale);
  }
}

const spriteCache: Record<string, HTMLCanvasElement> = {};
function getCharSprite(
  c: Character,
  flash: boolean,
  theme: ThemeMode,
  devMode: boolean,
): HTMLCanvasElement {
  const key = `${c.team}-${c.scale}-${c.weapon}-${flash}-${theme}-${devMode}-${c.kineticType}-${c.skin}-${c.isBoss}`;
  if (spriteCache[key]) return spriteCache[key];
  const cvs = document.createElement("canvas");
  const size = 160 * Math.max(1, c.scale);
  cvs.width = size;
  cvs.height = size;
  const ctx = cvs.getContext("2d");
  if (!ctx) return cvs;
  ctx.translate(size / 2, size / 2);
  drawRawChar(ctx, c, flash, theme, devMode, 0);
  spriteCache[key] = cvs;
  return cvs;
}
function renderChar(
  ctx: CanvasRenderingContext2D,
  c: Character,
  flash: boolean,
  alpha: number,
  theme: ThemeMode,
  devMode: boolean,
  useCache: boolean,
  timestamp: number,
) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.globalAlpha = alpha;
  if (
    useCache &&
    !flash &&
    !devMode &&
    alpha === 1 &&
    theme !== "glassmorphism"
  ) {
    const sprite = getCharSprite(c, flash, theme, devMode);
    ctx.rotate(c.angle);
    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
  } else {
    ctx.rotate(c.angle);
    drawRawChar(ctx, c, flash, theme, devMode, timestamp);
  }
  ctx.restore();
}
function drawHpBar(
  ctx: CanvasRenderingContext2D,
  c: Character,
  modifier: LokModifier,
  devMode: boolean,
  _theme: ThemeMode,
) {
  if (
    (modifier === "sudden_death" || modifier === "shrinking_arena") &&
    !devMode
  )
    return;
  const barW = 30 * c.scale;
  const barH = 4 * c.scale;
  const py = c.y - CHAR_RADIUS * c.scale - 15 * c.scale;
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(c.x - barW / 2, py, barW, barH);
  const hpPct = Math.max(0, c.hp / c.maxHp);
  ctx.fillStyle = hpPct > 0.5 ? "#00ff00" : hpPct > 0.2 ? "#ffff00" : "#ff0000";
  ctx.fillRect(c.x - barW / 2, py, barW * hpPct, barH);
  if (c.isBoss) {
    ctx.fillStyle = "#ffd700";
    ctx.font = `bold ${8 * c.scale}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText("BOSS", c.x, py - 2);
  }
}
function drawGhost(
  ctx: CanvasRenderingContext2D,
  g: Ghost,
  _devMode: boolean,
  theme: ThemeMode,
) {
  ctx.save();
  ctx.translate(g.x, g.y);
  ctx.globalAlpha = Math.max(0, g.life / g.maxLife) * 0.6;
  ctx.fillStyle = getTeamColor(g.team, theme);
  ctx.beginPath();
  ctx.arc(0, -5, 10, Math.PI, 0);
  ctx.lineTo(10, 10);
  ctx.lineTo(5, 5);
  ctx.lineTo(0, 10);
  ctx.lineTo(-5, 5);
  ctx.lineTo(-10, 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(-4, -7, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -7, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function spawnExplosion(
  x: number,
  y: number,
  team: number,
  theme: ThemeMode,
  state: GameState,
  pool: Particle[],
  kType: KineticType = "standard",
) {
  const color = getTeamColor(team, theme, kType, 0);
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * 4 + 1;
    pushParticle(
      x,
      y,
      Math.cos(angle) * spd,
      Math.sin(angle) * spd,
      20 + Math.random() * 20,
      state.rainbowBlood ? `hsl(${Math.random() * 360}, 100%, 50%)` : color,
      3 + Math.random() * 4,
      pool,
      state.optPool,
    );
  }
}

// ─── THEME BACKGROUND DRAW ───────────────────────────────────────────────────
function drawThemeBackground(
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
function drawBtn(
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
    theme === "neon" || theme === "neon_abyss"
      ? "#00ffff"
      : theme === "gameboy"
        ? "#9bbc0f"
        : theme === "runesite" || theme === "runesite_ultimate"
          ? "#b12a2a"
          : theme === "gsix"
            ? "#00f0ff"
            : theme === "gilded" || theme === "lokmod"
              ? "#ffd700"
              : theme === "blood_moon"
                ? "#ff0000"
                : theme === "synthwave"
                  ? "#ff00ff"
                  : theme === "celestial_forge"
                    ? "#00ffff"
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
function drawClassicMainMenu(
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
  ctx.fillStyle = "#ccaaff";
  ctx.font = "bold 52px monospace";
  ctx.fillText("KINETIC", W / 2, 120);
  ctx.fillStyle = "#ff9944";
  ctx.font = "bold 52px monospace";
  ctx.fillText("SOULS", W / 2, 178);

  ctx.save();
  const pulse = state.menuPulse ? 1 + Math.sin(ts / 150) * 0.03 : 1;
  ctx.translate(W / 2, 205);
  ctx.scale(pulse, pulse);
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(255, 215, 0, 0.6)";
  ctx.fillStyle = "#ffff00";
  ctx.font = "bold 15px monospace";
  ctx.fillText("I love you Tan-Moka", 0, 0);
  ctx.restore();

  ctx.shadowBlur = 0;

  ctx.fillStyle = "#888";
  ctx.font = "14px monospace";
  ctx.fillText("1v1 AUTO BATTLE ARENA", W / 2, 235);
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

  ctx.fillStyle = "#666";
  ctx.font = "12px monospace";
  ctx.textBaseline = "middle";
  ctx.fillText("P1: Press [A] to spawn  |  P2: Press [L] to spawn", W / 2, 530);
  ctx.fillText("Characters bounce around and fight automatically!", W / 2, 550);
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

function drawModernMainMenu(
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

  ctx.shadowBlur = state.menuPulse ? 20 * pulse : 0;
  ctx.shadowColor = titleColor;
  ctx.fillStyle = titleColor;
  ctx.font = "bold 48px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("KINETIC SOULS", W / 2, 30);
  ctx.shadowBlur = 0;

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

function drawMainMenu(
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

// ─── LOK MENU ────────────────────────────────────────────────────────────────
function drawLokMenu(
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
) {
  void mode; void ts;
  const W = ARENA_W, H = ARENA_H + SCOREBOARD_H;
  drawThemeBackground(ctx, theme, ts, W, H, 0);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px monospace";
  ctx.textAlign = "center";
  ctx.fillText("⚙ LOK GAME MODIFIERS", W / 2, 22);

  const sections: {
    label: string;
    items: { label: string; value: string }[];
    current: string;
    col: number;
    row: number;
  }[] = [
    {
      label: "THEME",
      items: [
        { label: "Classic", value: "classic" },
        { label: "Neon", value: "neon" },
        { label: "Gameboy", value: "gameboy" },
        { label: "Abyss", value: "abyss" },
        { label: "Runesite", value: "runesite" },
        { label: "GSix", value: "gsix" },
        { label: "Gilded", value: "gilded" },
        { label: "Synthwave", value: "synthwave" },
        { label: "Vampire", value: "vampire" },
        { label: "Oceanic", value: "oceanic" },
        { label: "Infernal", value: "infernal" },
        { label: "Glitch", value: "glitch" },
        { label: "Monochrome", value: "monochrome" },
        { label: "Celestial", value: "celestial" },
        { label: "Overdrive", value: "overdrive" },
        { label: "Comic", value: "comic" },
        { label: "Hacker", value: "hacker" },
        { label: "RGB Cycle", value: "rgb_cycle" },
        { label: "Neon Abyss", value: "neon_abyss" },
        { label: "Glass", value: "glassmorphism" },
        { label: "Matrix", value: "wireframe_matrix" },
        { label: "Cel. Forge", value: "celestial_forge" },
        { label: "Blood Moon", value: "blood_moon" },
        { label: "Neon OD", value: "neon_overdrive" },
        { label: "Paper", value: "paper_sketch" },
      ],
      current: theme,
      col: 0,
      row: 0,
    },
    {
      label: "MODIFIER",
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
      ],
      current: mod,
      col: 1,
      row: 0,
    },
    {
      label: "CAMERA",
      items: [
        { label: "Static", value: "static" },
        { label: "Dynamic", value: "dynamic" },
        { label: "Action", value: "action" },
        { label: "Enhanced", value: "enhanced" },
      ],
      current: cam,
      col: 2,
      row: 0,
    },
    {
      label: "WEAPONS",
      items: [
        { label: "Standard", value: "standard" },
        { label: "Roulette", value: "roulette" },
        { label: "Melee Mash", value: "melee_mash" },
        { label: "Ranged", value: "ranged_test" },
      ],
      current: wep,
      col: 2,
      row: 1,
    },
    {
      label: "ENVIRONMENT",
      items: [
        { label: "None", value: "none" },
        { label: "Ice Rink", value: "ice" },
        { label: "Black Hole", value: "blackhole" },
        { label: "Lava Floor", value: "lava" },
        { label: "Storm", value: "storm" },
        { label: "Bouncy", value: "bouncy" },
        { label: "Wraparound", value: "wrap" },
        { label: "Blackout", value: "blackout" },
      ],
      current: env,
      col: 1,
      row: 1,
    },
    {
      label: "VIEW MODE",
      items: [
        { label: "Standard", value: "standard" },
        { label: "Theater", value: "theater" },
        { label: "Cinematic", value: "cinematic" },
      ],
      current: view,
      col: 2,
      row: 2,
    },
  ];

  const colW = 290, colGap = 10;
  const startX = (W - (colW * 3 + colGap * 2)) / 2;
  const startY = 58;
  const bh = 24, bw = 130, gap = 5;

  for (const sec of sections) {
    const baseX = startX + sec.col * (colW + colGap);
    const baseY = startY + sec.row * 170;

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(sec.label, baseX, baseY);

    const maxRows = sec.label === "THEME" ? 14 : 7;
    sec.items.forEach((item, i) => {
      const col2 = Math.floor(i / maxRows);
      const row2 = i % maxRows;
      const bx = baseX + col2 * (bw + gap);
      const by = baseY + 12 + row2 * (bh + 3);
      const hover =
        mouse.x >= bx &&
        mouse.x <= bx + bw &&
        mouse.y >= by &&
        mouse.y <= by + bh;
      drawBtn(
        ctx,
        item.label,
        bx,
        by,
        bw,
        bh,
        hover,
        theme,
        sec.current === item.value,
        state.classicMenu
      );
    });
  }

  const backW = 120, backH = 30;
  const backX = W / 2 - backW / 2, backY = H - 44;
  const bHover =
    mouse.x >= backX &&
    mouse.x <= backX + backW &&
    mouse.y >= backY &&
    mouse.y <= backY + backH;
  drawBtn(ctx, "◀ BACK", backX, backY, backW, backH, bHover, theme, false, state.classicMenu);
  void state;
}

// ─── SETTINGS MENU ───────────────────────────────────────────────────────────
function drawSettingsMenu(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  ts: number,
  mouse: { x: number; y: number }
) {
  const W = ARENA_W, H = ARENA_H + SCOREBOARD_H;
  drawThemeBackground(ctx, state.theme, ts, W, H, 0);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px monospace";
  ctx.textAlign = "center";
  ctx.fillText("🎨 SETTINGS", W / 2, 22);

  const toggles: { label: string; key: keyof GameState }[] = [
    { label: "HUD", key: "hud" },
    { label: "Trails", key: "trails" },
    { label: "Motion Blur", key: "motionBlur" },
    { label: "Arena Ads", key: "ads" },
    { label: "CRT Filter", key: "crtFilter" },
    { label: "VHS Filter", key: "vhsFilter" },
    { label: "Invert Filter", key: "invertFilter" },
    { label: "AI Magnetic", key: "aiMagnetic" },
    { label: "Hand of God", key: "handOfGod" },
    { label: "Moon Gravity", key: "moonGravity" },
    { label: "Exploding Corpses", key: "explodingCorpses" },
    { label: "Slo-Mo Kills", key: "sloMoKills" },
    { label: "Rainbow Blood", key: "rainbowBlood" },
    { label: "Menu Grid", key: "menuGrid" },
    { label: "Menu Particles", key: "menuParticles" },
    { label: "Menu Drift", key: "menuDrift" },
    { label: "Menu CRT", key: "menuCRT" },
    { label: "Menu Pulse", key: "menuPulse" },
    { label: "Menu Sim", key: "menuSimulator" },
    { label: "Classic Menu", key: "classicMenu" },
    { label: "Opt: Cache", key: "optCache" },
    { label: "Opt: Delta", key: "optDelta" },
    { label: "Opt: Gravity", key: "optGravity" },
    { label: "Opt: Smart Spawn", key: "optSmartSpawn" },
    { label: "Opt: Grid", key: "optGrid" },
    { label: "Opt: Pool", key: "optPool" },
  ];

  const cols = 4;
  const tw = 200, th = 26, gap = 6;
  const totalW = cols * tw + (cols - 1) * gap;
  const startX = (W - totalW) / 2;
  const startY = 54;

  toggles.forEach((t, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const bx = startX + col * (tw + gap);
    const by = startY + row * (th + gap);
    const val = state[t.key] as boolean;
    const hover = mouse.x >= bx && mouse.x <= bx + tw && mouse.y >= by && mouse.y <= by + th;

    if (state.classicMenu) {
      drawBtn(ctx, `${val ? "✓" : "○"} ${t.label}`, bx, by, tw, th, hover, state.theme, val, true);
    } else {
      ctx.fillStyle = val ? "rgba(0,200,100,0.4)" : "rgba(60,60,80,0.7)";
      ctx.strokeStyle = val ? "#00ff88" : "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.fillRect(bx, by, tw, th);
      ctx.strokeRect(bx, by, tw, th);
      ctx.fillStyle = "#fff";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(
        `${val ? "✓" : "○"} ${t.label}`,
        bx + 8,
        by + th / 2 + 4,
      );
    }
  });

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
function drawGameOver(
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
const BESTIARY_ENTRIES: {
  id: KineticType;
  name: string;
  role: string;
  hp: string;
  spd: string;
  weapon: string;
  lore: string;
  color: string;
  boss: boolean;
  locked: boolean;
}[] = [
  { id: "standard", name: "Kinetic Standard", role: "Warrior", hp: "20", spd: "Normal", weapon: "Varies", lore: "The backbone of every arena. Balanced, reliable, unpredictable.", color: "#ff6655", boss: false, locked: false },
  { id: "tank", name: "Iron Tank", role: "Defender", hp: "40", spd: "Slow", weapon: "Mace", lore: "Built for endurance. Takes hits so allies don't have to.", color: "#8888ff", boss: false, locked: false },
  { id: "assassin", name: "Shadow Reaper", role: "Striker", hp: "10", spd: "Very Fast", weapon: "Katana", lore: "Strikes before you see it coming. Paper HP, lethal blade.", color: "#ff00aa", boss: false, locked: false },
  { id: "sniper", name: "Horizon Marksman", role: "Ranged", hp: "20", spd: "Normal", weapon: "Blaster", lore: "Keeps distance. Picks off threats with cold precision.", color: "#00ffff", boss: false, locked: false },
  { id: "ninja", name: "Void Ninja", role: "Skirmisher", hp: "20", spd: "Fast", weapon: "Dagger", lore: "Flickers between spaces. Hard to pin down, impossible to ignore.", color: "#cc00ff", boss: false, locked: false },
  { id: "ghost", name: "Wraith Echo", role: "Haunter", hp: "20", spd: "Fast", weapon: "Scythe", lore: "Barely there. Half in this world, fully lethal.", color: "#aaddff", boss: false, locked: false },
  { id: "zombie", name: "Revenant Husk", role: "Swarm", hp: "1", spd: "Slow", weapon: "Brawl", lore: "One hit and it drops. But they come in waves. Always waves.", color: "#33ff33", boss: false, locked: false },
  { id: "shield", name: "Bastion Guard", role: "Bulwark", hp: "20+15S", spd: "Slow", weapon: "Standard", lore: "Energy shielded. You must break the barrier before the soul.", color: "#00aaff", boss: false, locked: false },
  { id: "mage", name: "LoK Caster", role: "BOSS", hp: "30+", spd: "Slow", weapon: "Fireball", lore: "Commands the unseen forces. A boss unit. Respect accordingly.", color: "#ff8800", boss: true, locked: false },
  { id: "necromancer", name: "Death Weaver", role: "BOSS", hp: "40+", spd: "Normal", weapon: "Scythe", lore: "Raises the fallen. The longer the fight, the stronger it becomes.", color: "#aa00ff", boss: true, locked: false },
  { id: "giant", name: "Titan Behemoth", role: "BOSS", hp: "80+", spd: "Very Slow", weapon: "Hammer", lore: "One hit changes the match. Its shadow is a warning.", color: "#ff4400", boss: true, locked: false },
  { id: "juggernaut", name: "The Juggernaut", role: "BOSS", hp: "60+", spd: "Crawl", weapon: "Axe", lore: "Doesn't stop. Can't be turned. Walls bounce off it.", color: "#cc4400", boss: true, locked: false },
  { id: "null", name: "NULL Entity", role: "BOSS", hp: "30+", spd: "Frozen", weapon: "None", lore: "It should not exist here. Massive. Immovable. Watching.", color: "#555555", boss: true, locked: false },
  { id: "bounty", name: "Bounty Target", role: "Special", hp: "15", spd: "Fast", weapon: "None", lore: "Worth more than a kill. Catch it before the enemy does.", color: "#ffd700", boss: false, locked: false },
  { id: "volatile", name: "Volatile Core", role: "Saboteur", hp: "5", spd: "Very Fast", weapon: "None", lore: "Unstable, frantic, and rushing toward the nearest crowd. Its death is its ultimate weapon.", color: "#ff2222", boss: false, locked: true },
  { id: "gravity", name: "Gravity Architect", role: "Controller", hp: "25", spd: "Slow", weapon: "Standard", lore: "Bends space to its will. Where it walks, the arena itself begins to collapse.", color: "#8800ff", boss: false, locked: true },
  { id: "vanguard", name: "Vanguard Lancer", role: "Piercer", hp: "25", spd: "Burst", weapon: "Spear", lore: "Momentum is its master. It only knows how to charge forward in devastating straight lines.", color: "#aaddff", boss: false, locked: true },
  { id: "weaver", name: "Aura Weaver", role: "Support", hp: "15", spd: "Normal", weapon: "Rapier", lore: "Mends the broken. In an arena of infinite death, it brings a fleeting spark of life.", color: "#00ff88", boss: false, locked: true },
  { id: "hivemind", name: "The Hivemind", role: "BOSS", hp: "60+", spd: "Very Slow", weapon: "Whip", lore: "A singular consciousness fractured into a thousand vessels. Kill the head, or drown in the swarm.", color: "#ff8800", boss: true, locked: true },
  { id: "glitch_chrono", name: "Chrono-Glitch", role: "Anomaly", hp: "20", spd: "Teleport", weapon: "Dagger", lore: "Desynchronized from the server tick-rate. It exists where it shouldn't.", color: "#ff00ff", boss: false, locked: true }
];

function drawBestiary(
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

  const cardW = 420, cardH = 90, cols = 2, gap = 12;
  const totalW = cols * cardW + gap;
  const startX = (W - totalW) / 2;
  const startY = 56 + scrollY;

  const standardEntries = BESTIARY_ENTRIES.filter((e) => !e.locked);
  const lokEntries = BESTIARY_ENTRIES.filter((e) => e.locked);

  standardEntries.forEach((entry, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = startX + col * (cardW + gap);
    const cy = startY + row * (cardH + gap);

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
      ctx.fillText("👑 BOSS", cx + cardW - 70, cy + 18);
    }

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px monospace";
    ctx.fillText(`Role: ${entry.role}  ·  HP: ${entry.hp}  ·  SPD: ${entry.spd}  ·  Weapon: ${entry.weapon}`, cx + 12, cy + 36);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "11px monospace";
    ctx.fillText(entry.lore, cx + 12, cy + 56);

    ctx.fillStyle = entry.color;
    ctx.fillRect(cx, cy, 4, cardH);

    void ts;
  });

  const standardRows = Math.ceil(standardEntries.length / cols);
  const lokHeaderY = startY + standardRows * (cardH + gap) + 30;

  ctx.fillStyle = "#ff4444";
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "center";
  ctx.fillText("🔒 LOK - LOCKED DOWN KINETICS", W / 2, lokHeaderY);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "10px monospace";
  ctx.fillText("Marked as too dangerous. Deployed only during special events.", W / 2, lokHeaderY + 20);

  const lokStartY = lokHeaderY + 40;

  lokEntries.forEach((entry, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = startX + col * (cardW + gap);
    const cy = lokStartY + row * (cardH + gap);

    const hover =
      mouse.x >= cx &&
      mouse.x <= cx + cardW &&
      mouse.y >= cy &&
      mouse.y <= cy + cardH;

    ctx.fillStyle = entry.boss ? hover ? "rgba(120,40,0,0.8)" : "rgba(80,20,0,0.7)" : hover ? "rgba(30,30,60,0.9)" : "rgba(15,15,35,0.8)";
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
      ctx.fillText("👑 BOSS", cx + cardW - 70, cy + 18);
    }

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px monospace";
    ctx.fillText(`Role: ${entry.role}  ·  HP: ${entry.hp}  ·  SPD: ${entry.spd}  ·  Weapon: ${entry.weapon}`, cx + 12, cy + 36);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "11px monospace";
    ctx.fillText(entry.lore, cx + 12, cy + 56);

    ctx.fillStyle = entry.color;
    ctx.fillRect(cx, cy, 4, cardH);
  });

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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function KineticSouls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const bgPatternRef = useRef<CanvasPattern | null>(null);

  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const camRef = useRef({
    x: ARENA_W / 2,
    y: SCOREBOARD_H + ARENA_H / 2,
    zoom: 1,
  });
  const keysRef = useRef<Set<string>>(new Set());

  const [showLiveMenu, setShowLiveMenu] = useState(false);
  const [godAction, setGodAction] = useState<
    | "smite"
    | "heal"
    | "revive"
    | "freeze"
    | "enrage"
    | "mutate"
    | "infect"
    | "ascend"
  >("smite");
  const [godTarget, setGodTarget] = useState<number>(2);
  const [birthType, setBirthType] = useState<KineticType>("standard");
  const [p1Skin, setP1Skin] = useState<SkinType>("default");
  const [p2Skin, setP2Skin] = useState<SkinType>("default");
  const [currentSplash] = useState(
    SPLASH_ARCHIVE[Math.floor(Math.random() * SPLASH_ARCHIVE.length)],
  );
  const [showMobileUI, setShowMobileUI] = useState(false);
  const [showSkins, setShowSkins] = useState(false);
  const [bestiaryScroll] = useState(0);
  const [hoverBox, setHoverBox] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [, setTick] = useState(0);
  const joyRef = useRef({ active: false, startX: 0, startY: 0, dx: 0, dy: 0 });
  const refMenuScroll = useRef(0);
  const refBestReplay = useRef<{ frames: any[]; victimId: number; maxV: number } | null>(null);
  const refReplayPlaybackIdx = useRef(0);

  const [passport, setPassport] = useState<LokPassportData>({
    connected: false,
    username: "Guest",
    lokCoins: 0,
    equippedBackground: null,
    inventory: [],
  });
  const lokCoinsRef = useRef<number>(0);

  void currentSplash;
  void hoverBox;
  void setHoverBox;
  void joyRef;
  void bgImageRef;
  void bgPatternRef;

  const stateRef = useRef<GameState>({
    mode: "timer",
    opponent: "pvp",
    theme: "classic",
    modifier: "none",
    camera: "static",
    viewMode: "standard",
    minimapPosition: "bottom-right",
    weaponStyle: "standard",
    environment: "none",
    p1Score: 0,
    p2Score: 0,
    directorScore: 0,
    timeLeft: 120,
    scoreLimit: 10,
    fighterSpeed: 1.0,
    running: false,
    over: false,
    paused: false,
    p1Auto: false,
    devMode: false,
    winner: "",
    hitPause: 0,
    shakeFrames: 0,
    timeScale: 1,
    stats: { maxChars: 0, totalDmg: 0 },
    juice: "normal",
    hud: true,
    trails: false,
    motionBlur: false,
    ads: false,
    crtFilter: false,
    vhsFilter: false,
    invertFilter: false,
    aiMagnetic: false,
    handOfGod: false,
    optCache: true,
    optDelta: true,
    optGravity: true,
    optSmartSpawn: true,
    optGrid: true,
    optPool: true,
    actionCamTeam: 1,
    actionCamIndex: 0,
    draggingId: null,
    shrinkingZone: 0,
    fpsTarget: 60,
    menuParticles: true,
    menuDrift: true,
    menuGrid: true,
    menuPulse: true,
    menuCRT: false,
    moonGravity: false,
    explodingCorpses: false,
    sloMoKills: false,
    rainbowBlood: false,
    parallaxGrid: true,
    reactiveGrid: true,
    classicMenu: true,
    lokBackgroundEnabled: true,
    stormAngle: 0,
    menuSimulator: true,
    minimapTextPulse: true,
    bountyEndsGame: false,
    lokMenuPosition: "left",
    lokMenuHoverCycle: true,
    dimKnockout: false,
    focusTargetId: null,
    focusZoom: 2,
  });

  const refMode = useRef<GameMode>("timer");
  const refOpp = useRef<OpponentMode>("pvp");
  const refTheme = useRef<ThemeMode>("classic");
  const refMod = useRef<LokModifier>("none");
  const refCam = useRef<CameraMode>("static");
  const refView = useRef<ViewMode>("standard");
  const refEnv = useRef<Environment>("none");
  const refWep = useRef<WeaponStyle>("standard");
  const refTLimit = useRef<number>(120);
  const refSLimit = useRef<number>(10);
  const refFSpeed = useRef<number>(1.0);
  const refMinimapPos = useRef<MinimapPosition>("bottom-right");

  const refs = {
    mode: refMode, opp: refOpp, theme: refTheme, mod: refMod,
    cam: refCam, view: refView, env: refEnv, wep: refWep,
    tLimit: refTLimit, sLimit: refSLimit, fSpeed: refFSpeed, minimapPos: refMinimapPos
  };

  const screenRef = useRef<ScreenState>("menu");

  const refChars = useRef<Character[]>([]);
  const refParts = useRef<Particle[]>([]);
  const refGhosts = useRef<Ghost[]>([]);
  const refTexts = useRef<FloatingText[]>([]);
  const refFeed = useRef<KillFeedMsg[]>([]);
  const refBombs = useRef<Drop[]>([]);
  const refProjs = useRef<Projectile[]>([]);
  const refEssences = useRef<Essence[]>([]);
  const refSabres = useRef<any[]>([]);

  const dataRef = {
    chars: refChars, parts: refParts, ghosts: refGhosts, texts: refTexts,
    feed: refFeed, bombs: refBombs, projs: refProjs, essences: refEssences, sabres: refSabres
  };

  const refRaf = useRef(0);
  const refLast = useRef(0);
  const refTimerAcc = useRef(0);
  const refBotTimer = useRef(0);
  const refBotNext = useRef(2500);
  const refP1Timer = useRef(0);
  const refBountyTimer = useRef(0);

  const timeRef = {
    raf: refRaf, last: refLast, timerAcc: refTimerAcc, botTimer: refBotTimer,
    botNext: refBotNext, p1Timer: refP1Timer, bountyTimer: refBountyTimer
  };

  const p1SkinRef = useRef<SkinType>("default");
  const p2SkinRef = useRef<SkinType>("default");
  useEffect(() => { p1SkinRef.current = p1Skin; }, [p1Skin]);
  useEffect(() => { p2SkinRef.current = p2Skin; }, [p2Skin]);


  const connectLokPassport = () => {
    const bgUrl = "https://www.transparenttextures.com/patterns/hexellence.png";
    lokCoinsRef.current = 15420;
    setPassport({
      connected: true,
      username: "Eric_GSix",
      lokCoins: 15420,
      equippedBackground: bgUrl,
      inventory: [
        "Gilded Skin",
        "Neon Skin",
        "Moon Gravity Mod",
        "Wireframe Matrix",
      ],
    });
    setTick((t) => t + 1);
  };

  const spawnText = useCallback(
    (
      x: number,
      y: number,
      text: string,
      color: string,
      isSplat: boolean = false,
    ) => {
      const st = stateRef.current;
      const entry: FloatingText = {
        x, y, text, color, life: 40, maxLife: 40, vy: -1.5, active: true, isSplat,
      };
      if (st.optPool) {
        const deadT = dataRef.texts.current.find((t) => !t.active);
        if (deadT) { Object.assign(deadT, entry); return; }
      }
      dataRef.texts.current.push(entry);
    },
    [],
  );

  const triggerExplosion = useCallback(
    (
      ex: number,
      ey: number,
      radius: number,
      state: GameState,
      isBomb: boolean = false,
    ) => {
      state.shakeFrames += state.juice === "super" ? 30 : 15;
      for (let i = 0; i < 40; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 4 + Math.random() * 8;
        const pColor = state.rainbowBlood
          ? `hsl(${Math.random() * 360}, 100%, 50%)`
          : "#ff4400";
        pushParticle(
          ex, ey,
          Math.cos(a) * spd, Math.sin(a) * spd,
          30 + Math.random() * 20, pColor, 3 + Math.random() * 5,
          dataRef.parts.current, state.optPool,
        );
      }
      dataRef.chars.current.forEach((c) => {
        if (c.dead) return;
        const dx = c.x - ex, dy = c.y - ey;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          if (isBomb) {
            if (Math.random() < 0.3) { c.hp = 0; c.flashFrames = 5; }
            else {
              const force = (20 * ((radius - dist) / radius)) / c.mass;
              c.vx += (dx / dist) * force;
              c.vy += (dy / dist) * force;
              c.stunTime = 60;
            }
          } else {
            const force = (15 * ((radius - dist) / radius)) / c.mass;
            c.vx += (dx / dist) * force;
            c.vy += (dy / dist) * force;
            c.hp -= 5;
            c.flashFrames = 5;
          }
        }
      });
    },
    [],
  );

  const endGame = useCallback(() => {
    const st = stateRef.current;
    let winner = "";
    if (st.mode === "horde" || st.mode === "infection")
      winner = st.p1Score >= 50 ? "You Survived!" : "The Horde Consumed You";
    else if (st.mode === "unlimited") winner = "Match Concluded";
    else {
      if (st.p1Score > st.p2Score) winner = "Player 1 Wins!";
      else if (st.p2Score > st.p1Score) winner = "The Enemy Wins!";
      else winner = "It's a Draw!";
    }
    stateRef.current = {
      ...st, running: false, over: true, paused: false, winner, draggingId: null,
    };
    screenRef.current = "over";
    setPassport((p) => ({ ...p, lokCoins: lokCoinsRef.current }));
  }, []);

  const startGame = useCallback(() => {
    charIdCounter = 0;
    if (!stateRef.current.optPool) {
      dataRef.chars.current = [];
      dataRef.parts.current = [];
      dataRef.ghosts.current = [];
      dataRef.texts.current = [];
      dataRef.feed.current = [];
      dataRef.bombs.current = [];
      dataRef.projs.current = [];
      dataRef.essences.current = [];
    } else {
      dataRef.chars.current.forEach((c) => (c.dead = true));
      dataRef.parts.current.forEach((p) => (p.active = false));
      dataRef.ghosts.current.forEach((g) => (g.active = false));
      dataRef.texts.current.forEach((t) => (t.active = false));
      dataRef.feed.current.forEach((f) => (f.active = false));
      dataRef.bombs.current.forEach((b) => (b.active = false));
      dataRef.projs.current.forEach((p) => (p.active = false));
      dataRef.essences.current.forEach((e) => (e.active = false));
    }
    timeRef.timerAcc.current = 0;
    timeRef.botTimer.current = 0;
    timeRef.p1Timer.current = 0;
    timeRef.bountyTimer.current = 0;
    camRef.current = { x: ARENA_W / 2, y: SCOREBOARD_H + ARENA_H / 2, zoom: 1 };
    let limit = refs.mode.current === "score" ? refs.sLimit.current : 0;
    if (refs.mode.current === "horde" || refs.mode.current === "infection") {
      limit = 50;
      refs.opp.current = "bot";
    }
    timeRef.botNext.current =
      BOT_MIN_INTERVAL + Math.random() * (BOT_MAX_INTERVAL - BOT_MIN_INTERVAL);

    stateRef.current.mode = refs.mode.current;
    stateRef.current.opponent = refs.opp.current;
    stateRef.current.theme = refs.theme.current;
    stateRef.current.modifier = refs.mod.current;
    stateRef.current.camera = refs.cam.current;
    stateRef.current.viewMode = refs.view.current;
    stateRef.current.weaponStyle = refs.wep.current;
    stateRef.current.environment = refs.env.current;
    stateRef.current.minimapPosition = refs.minimapPos.current;

    if (refs.view.current === "cinematic") {
      stateRef.current.camera = "enhanced";
      stateRef.current.hud = false;
    } else if (refs.view.current === "theater") {
      stateRef.current.hud = false;
    }

    stateRef.current = {
      ...stateRef.current,
      p1Score: 0, p2Score: 0, directorScore: 0,
      fighterSpeed: refs.fSpeed.current,
      timeLeft: refs.mode.current === "unlimited" ? Infinity : refs.tLimit.current,
      scoreLimit: refs.mode.current === "unlimited" ? Infinity : limit,
      running: true, over: false, paused: false, p1Auto: false, winner: "",
      hitPause: 0, shakeFrames: 0, timeScale: 1,
      stats: { maxChars: 0, totalDmg: 0 },
      actionCamTeam: 1, actionCamIndex: 0, draggingId: null, shrinkingZone: 0,
    };

    if (refs.mode.current === "infection") {
      dataRef.chars.current.push(
        spawnCharacter(1, refs.mod.current, dataRef.chars.current, true, stateRef.current.optPool, refs.wep.current, stateRef.current.fighterSpeed, undefined, undefined, "standard", p1SkinRef.current),
      );
      for (let i = 0; i < 15; i++)
        dataRef.chars.current.push(
          spawnCharacter(2, refs.mod.current, dataRef.chars.current, true, stateRef.current.optPool, refs.wep.current, stateRef.current.fighterSpeed),
        );
    }
    screenRef.current = "game";
  }, [refs, dataRef, timeRef]);

  const spawnP1 = useCallback(() => {
    const st = stateRef.current;
    if (!st.running || st.paused || screenRef.current !== "game") return;
    const c = spawnCharacter(
      1, st.modifier, dataRef.chars.current, st.optSmartSpawn, st.optPool,
      st.weaponStyle, st.fighterSpeed, undefined, undefined, birthType, p1SkinRef.current,
    );
    if (!st.optPool || c.id >= charIdCounter - 1) dataRef.chars.current.push(c);
    lokCoinsRef.current = Math.max(0, lokCoinsRef.current - 5);
  }, [birthType, dataRef.chars]);

  const spawnP2 = useCallback(() => {
    const st = stateRef.current;
    if (!st.running || st.paused || screenRef.current !== "game") return;
    const kineticTypes: KineticType[] = [
      "standard", "tank", "assassin", "ninja", "sniper", "mage", "ghost",
      "zombie", "shield", "necromancer", "giant", "juggernaut", "null",
    ];
    const rType = kineticTypes[Math.floor(Math.random() * kineticTypes.length)];
    const isBossType = ["mage", "necromancer", "giant", "juggernaut", "null"].includes(rType);
    const c = spawnCharacter(
      2, st.modifier, dataRef.chars.current, st.optSmartSpawn, st.optPool,
      st.weaponStyle, st.fighterSpeed, undefined, undefined, rType, p2SkinRef.current, isBossType,
    );
    if (!st.optPool || c.id >= charIdCounter - 1) dataRef.chars.current.push(c);
  }, [dataRef.chars]);

  const gameLoop = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dtRaw = Math.min(timestamp - timeRef.last.current, 50);
      timeRef.last.current = timestamp;
      const screen = screenRef.current;
      const state = stateRef.current;

      const fpsMulti = state.fpsTarget / 60;
      const subDtRaw = dtRaw / fpsMulti;

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (screen === "game" && state.motionBlur) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fillRect(0, SCOREBOARD_H, ARENA_W, ARENA_H);
        ctx.clearRect(0, 0, ARENA_W, SCOREBOARD_H);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (screen === "menu") {
        drawMainMenu(ctx, refs.mode.current, refs.opp.current, mouseRef.current, timestamp, state, currentSplash);
        if (state.menuSimulator) {
          timeRef.botTimer.current += subDtRaw;
          if (timeRef.botTimer.current > 1000) {
            timeRef.botTimer.current = 0;
            if (dataRef.chars.current.filter((c) => !c.dead).length < 20) {
              const randomTeam = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
              dataRef.chars.current.push(
                spawnCharacter(randomTeam, state.modifier, dataRef.chars.current, false, state.optPool, "standard", 1.0),
              );
            }
          }
        }
      } else if (screen === "lok_menu") {
        drawLokMenu(ctx, refs.mode.current, refs.theme.current, refs.mod.current, refs.cam.current, refs.wep.current, refs.env.current, refs.view.current, mouseRef.current, state, timestamp, refMenuScroll.current);
      } else if (screen === "settings_menu") {
        drawSettingsMenu(ctx, state, timestamp, mouseRef.current, refMenuScroll.current);
      } else if (screen === "over") {
        drawGameOver(ctx, state, mouseRef.current);
      } else if (screen === "bestiary") {
        drawBestiary(ctx, state, mouseRef.current, timestamp, refMenuScroll.current);
      }

      if (screen === "game" || (screen === "menu" && state.menuSimulator)) {
        let updatePhysics =
          (state.running && !state.paused) ||
          (screen === "menu" && state.menuSimulator);

        if (updatePhysics && state.hitPause > 0 && state.juice !== "off") {
          state.hitPause -= dtRaw;
          updatePhysics = false;
        }
        if (state.timeScale < 1) {
          state.timeScale += 0.005;
          if (state.timeScale > 1) state.timeScale = 1;
        }

        if (updatePhysics) {
          if (state.mode === "timer" && state.timeLeft !== Infinity && screen === "game") {
            timeRef.timerAcc.current += dtRaw;
            if (timeRef.timerAcc.current >= 1000) {
              timeRef.timerAcc.current -= 1000;
              state.timeLeft -= 1;
              if (state.timeLeft <= 0) endGame();
            }
          }
          if (state.modifier === "shrinking_arena") {
            state.shrinkingZone += 0.2 * (dtRaw / 16.666) * state.timeScale;
          }
          if (state.modifier === "lok_bounty" && screen === "game") {
            timeRef.bountyTimer.current += dtRaw * state.timeScale;
            if (timeRef.bountyTimer.current >= 8000) {
              timeRef.bountyTimer.current = 0;
              if (Math.random() < 0.6) {
                const b = spawnCharacter(3, state.modifier, dataRef.chars.current, state.optSmartSpawn, state.optPool, "none", state.fighterSpeed, undefined, undefined, "bounty");
                if (!state.optPool || b.id >= charIdCounter - 1) dataRef.chars.current.push(b);
              }
            }
          }

          if (screen === "game") {
            if (state.opponent === "bot" && state.mode !== "infection") {
              timeRef.botTimer.current += dtRaw * state.timeScale;
              let minSpawn = state.mode === "horde" ? 300 : BOT_MIN_INTERVAL;
              let maxSpawn = state.mode === "horde" ? 800 : BOT_MAX_INTERVAL;
              if (timeRef.botTimer.current >= timeRef.botNext.current) {
                timeRef.botTimer.current = 0;
                timeRef.botNext.current = minSpawn + Math.random() * (maxSpawn - minSpawn);
                const kTypes: KineticType[] = ["standard", "tank", "assassin", "ninja", "sniper", "mage", "ghost", "zombie", "shield", "necromancer", "giant", "juggernaut"];
                const rK = kTypes[Math.floor(Math.random() * kTypes.length)];
                const isBossK = ["mage", "necromancer", "giant", "juggernaut", "null"].includes(rK);
                const newC = spawnCharacter(2, state.modifier, dataRef.chars.current, state.optSmartSpawn, state.optPool, state.weaponStyle, state.fighterSpeed, undefined, undefined, rK, p2SkinRef.current, isBossK);
                if (!state.optPool || newC.id >= charIdCounter - 1) dataRef.chars.current.push(newC);
              }
            }

            if (state.p1Auto) {
              timeRef.p1Timer.current += dtRaw * state.timeScale;
              if (timeRef.p1Timer.current >= BOT_MIN_INTERVAL + Math.random() * (BOT_MAX_INTERVAL - BOT_MIN_INTERVAL)) {
                timeRef.p1Timer.current = 0;
                const newC = spawnCharacter(1, state.modifier, dataRef.chars.current, state.optSmartSpawn, state.optPool, state.weaponStyle, state.fighterSpeed, undefined, undefined, birthType, p1SkinRef.current);
                if (!state.optPool || newC.id >= charIdCounter - 1) dataRef.chars.current.push(newC);
              }
            }
          }

          const dt = subDtRaw * state.timeScale * 0.016;
          const DRAG = state.environment === "ice" ? 0.998 : state.environment === "bouncy" ? 1.0 : 0.985;
          const GRAVITY = state.optGravity && state.moonGravity ? 0.1 : 0;

          const activeChars = dataRef.chars.current.filter((c) => !c.dead);
          state.stats.maxChars = Math.max(state.stats.maxChars, activeChars.length);

          for (const c of dataRef.chars.current) {
            if (c.dead) continue;

            if (isNaN(c.x) || isNaN(c.y) || Math.abs(c.vx) > 150 || Math.abs(c.vy) > 150) {
              c.dead = true;
              continue;
            }

            if (c.stunTime > 0) {
              c.stunTime -= dtRaw;
              c.vx *= 0.9;
              c.vy *= 0.9;
            } else {
              if (GRAVITY > 0) c.vy += GRAVITY;

              if (state.environment === "blackhole") {
                const bx = ARENA_W / 2, by = SCOREBOARD_H + ARENA_H / 2;
                const dx = bx - c.x, dy = by - c.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 20) { c.vx += (dx / dist) * 0.4; c.vy += (dy / dist) * 0.4; }
              }
              if (state.environment === "storm") {
                c.vx += Math.cos(state.stormAngle) * 0.25;
                c.vy += Math.sin(state.stormAngle) * 0.25;
              }
              if (state.modifier === "magnet" || state.aiMagnetic) {
                for (const other of dataRef.chars.current) {
                  if (other.dead || other.id === c.id || other.team === c.team) continue;
                  const dx2 = other.x - c.x, dy2 = other.y - c.y;
                  const d2 = Math.hypot(dx2, dy2);
                  if (d2 < 200 && d2 > 10) {
                    const f = 0.3 / d2;
                    c.vx += dx2 * f;
                    c.vy += dy2 * f;
                  }
                }
              }
              if (state.modifier === "repel") {
                for (const other of dataRef.chars.current) {
                  if (other.dead || other.id === c.id || other.team === c.team) continue;
                  const dx2 = c.x - other.x, dy2 = c.y - other.y;
                  const d2 = Math.hypot(dx2, dy2);
                  if (d2 < 150 && d2 > 10) {
                    const f = 0.5 / d2;
                    c.vx += dx2 * f;
                    c.vy += dy2 * f;
                  }
                }
              }

              if (c.kineticType !== "null" && c.stunTime <= 0) {
                let targetX = -1, targetY = -1;
                let bestDist = Infinity;
                for (const other of dataRef.chars.current) {
                  if (other.dead || other.team === c.team) continue;
                  const d = Math.hypot(c.x - other.x, c.y - other.y);
                  if (d < bestDist) { bestDist = d; targetX = other.x; targetY = other.y; }
                }
                if (targetX >= 0) {
                  const dx = targetX - c.x, dy = targetY - c.y;
                  const dist = Math.hypot(dx, dy);
                  if (dist > 5) {
                    let aiSpeed = c.isBoss ? 0.35 : 0.2;
                    if (c.kineticType === "assassin" || c.kineticType === "ninja") aiSpeed = 0.45;
                    if (c.kineticType === "tank" || c.kineticType === "juggernaut") aiSpeed = 0.15;
                    if (c.kineticType === "giant") aiSpeed = 0.1;
                if (c.kineticType === "volatile") aiSpeed = 0.6;
                    c.vx += (dx / dist) * aiSpeed;
                    c.vy += (dy / dist) * aiSpeed;
                  }
                }
              }

          if (c.kineticType === "gravity") {
            c.customTimer -= dtRaw;
            if (c.customTimer <= 0) {
              c.customTimer = 5000 + Math.random() * 3000;
              dataRef.bombs.current.push({ type: "blackhole", x: c.x, y: c.y, timer: 3000, maxTimer: 3000, active: true, radius: 150 });
            }
          } else if (c.kineticType === "vanguard") {
            c.customTimer -= dtRaw;
            if (c.customTimer <= 0) {
              c.customTimer = 3000 + Math.random() * 2000;
              c.vx += Math.cos(c.angle) * 15;
              c.vy += Math.sin(c.angle) * 15;
              for(let i=0; i<5; i++) pushParticle(c.x, c.y, (Math.random()-0.5)*2, (Math.random()-0.5)*2, 20, "#fff", 5, dataRef.parts.current, state.optPool);
            }
          } else if (c.kineticType === "weaver") {
            c.customTimer -= dtRaw;
            if (c.customTimer <= 0) {
              c.customTimer = 4000;
              dataRef.chars.current.forEach(ally => {
                 if (!ally.dead && ally.team === c.team && Math.hypot(ally.x - c.x, ally.y - c.y) < 150) {
                    ally.hp = Math.min(ally.maxHp, ally.hp + 10);
                    spawnText(ally.x, ally.y - 10, "+10", "#00ff88");
                 }
              });
              for (let a = 0; a < Math.PI * 2; a += 0.5) {
                 pushParticle(c.x, c.y, Math.cos(a)*4, Math.sin(a)*4, 30, "#00ff88", 3, dataRef.parts.current, state.optPool);
              }
            }
          } else if (c.kineticType === "hivemind") {
            c.customTimer -= dtRaw;
            if (c.customTimer <= 0) {
              c.customTimer = 3000;
              for(let i=0; i<2; i++) {
                 const drone = spawnCharacter(c.team, state.modifier, dataRef.chars.current, false, state.optPool, "none", state.fighterSpeed, c.x + (Math.random()-0.5)*40, c.y + (Math.random()-0.5)*40, "zombie");
                 drone.maxHp = 1; drone.hp = 1; drone.scale = 0.6;
                 if (!state.optPool || drone.id >= charIdCounter - 1) dataRef.chars.current.push(drone);
              }
            }
          }
            }

            void dt;
            c.x += c.vx * (subDtRaw / 16.666) * state.timeScale;
            c.y += c.vy * (subDtRaw / 16.666) * state.timeScale;
            c.angle += c.angularV;
            c.vx *= DRAG;
            c.vy *= DRAG;

            const cr = CHAR_RADIUS * c.scale;
            const sz = state.modifier === "shrinking_arena" ? state.shrinkingZone : 0;
            const minX = sz, maxX = ARENA_W - sz;
            const minY = SCOREBOARD_H + sz, maxY = SCOREBOARD_H + ARENA_H - sz;
            const bounce = state.environment === "bouncy" ? 1.05 : 0.82;

            if (state.environment === "wrap") {
              if (c.x < -cr) c.x = ARENA_W + cr;
              if (c.x > ARENA_W + cr) c.x = -cr;
              if (c.y < SCOREBOARD_H - cr) c.y = SCOREBOARD_H + ARENA_H + cr;
              if (c.y > SCOREBOARD_H + ARENA_H + cr) c.y = SCOREBOARD_H - cr;
            } else {
              if (c.x < minX + cr) { c.x = minX + cr; c.vx = Math.abs(c.vx) * bounce; }
              if (c.x > maxX - cr) { c.x = maxX - cr; c.vx = -Math.abs(c.vx) * bounce; }
              if (c.y < minY + cr) { c.y = minY + cr; c.vy = Math.abs(c.vy) * bounce; }
              if (c.y > maxY - cr) { c.y = maxY - cr; c.vy = -Math.abs(c.vy) * bounce; }
            }

            if (state.environment === "lava" && c.y >= SCOREBOARD_H + ARENA_H - cr - 15) {
              c.hp -= 0.08 * state.timeScale;
              c.flashFrames = 2;
            }

            if (state.modifier === "shrinking_arena" && sz > 10) {
              if (c.x < minX + cr + 5 || c.x > maxX - cr - 5 ||
                c.y < minY + cr + 5 || c.y > maxY - cr - 5) {
                c.hp -= 0.15 * state.timeScale;
                c.flashFrames = 2;
              }
            }

            if (state.trails) {
              c.trail.push({ x: c.x, y: c.y, angle: c.angle });
              if (c.trail.length > 6) c.trail.shift();
            }

            if (c.flashFrames > 0) c.flashFrames--;
            if (c.cooldown > 0) c.cooldown -= dtRaw;
          }

          const chars = dataRef.chars.current;
          const handleCollision = (a: Character, b: Character) => {
            if (a.dead || b.dead) return;

            const dx = b.x - a.x, dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
              const minDist = (CHAR_RADIUS * a.scale + CHAR_RADIUS * b.scale) * 0.85;
              if (dist < minDist && dist > 0.01) {
                const nx = dx / dist, ny = dy / dist;
                const overlap = minDist - dist;
                const totalMass = a.mass + b.mass;
                a.x -= nx * overlap * (b.mass / totalMass);
                a.y -= ny * overlap * (b.mass / totalMass);
                b.x += nx * overlap * (a.mass / totalMass);
                b.y += ny * overlap * (a.mass / totalMass);

                if (a.team !== b.team && state.juice !== "off") {
                  state.hitPause = state.juice === "super" ? 80 : 40;
                  state.shakeFrames += state.juice === "super" ? 8 : 4;
                }

                const relVx = a.vx - b.vx, relVy = a.vy - b.vy;
                const rawDot = relVx * nx + relVy * ny;
                if (rawDot > 0) {
                  const dot = Math.min(rawDot, 30); // Cap physics response to prevent infinite velocity freezing!
                  const restitution = state.environment === "bouncy" ? 1.2 : 0.9;
                  const impulse = (2 * dot * restitution) / totalMass;
                  a.vx -= impulse * b.mass * nx;
                  a.vy -= impulse * b.mass * ny;
                  b.vx += impulse * a.mass * nx;
                  b.vy += impulse * a.mass * ny;
                }

              if (a.team !== b.team && (state.running || screen === "menu")) {
                  const aPart = a.parts[Math.floor(Math.random() * a.parts.length)];
                  const bPart = b.parts[Math.floor(Math.random() * b.parts.length)];
                  const dmgMult = Math.min(Math.abs(rawDot) * 0.5, 6); // Cap damage multiplier
                  const aDmg = getPartDamage(aPart.type) * dmgMult;
                  const bDmg = getPartDamage(bPart.type) * dmgMult;

                  const realADmg = Math.max(0.5, aDmg);
                  const realBDmg = Math.max(0.5, bDmg);

                  if (a.shieldHp > 0) a.shieldHp -= realBDmg;
                  else a.hp -= realBDmg;
                  if (b.shieldHp > 0) b.shieldHp -= realADmg;
                  else b.hp -= realADmg;

                  a.flashFrames = 3;
                  b.flashFrames = 3;
                if (screen === "game") state.stats.totalDmg += realADmg + realBDmg;

                if (screen === "game" && state.modifier === "vampire_kiss") {
                    const vampTeam = a.team;
                    const vampire = vampTeam === a.team ? a : b;
                    vampire.hp = Math.min(vampire.maxHp, vampire.hp + 2);
                  }

                  if (Math.abs(rawDot) > 1) {
                    const pColor = state.rainbowBlood
                      ? `hsl(${Math.random() * 360}, 100%, 50%)`
                      : getTeamColor(a.team, state.theme, a.kineticType, 0);
                    const pCount = Math.min(Math.floor(Math.abs(rawDot)), 6); // Cap particle counts
                    for (let p = 0; p < pCount; p++) {
                      const pa = Math.random() * Math.PI * 2;
                      pushParticle(
                        (a.x + b.x) / 2, (a.y + b.y) / 2,
                        Math.cos(pa) * 2, Math.sin(pa) * 2,
                        12, pColor, 2 + Math.random() * 2,
                        dataRef.parts.current, state.optPool,
                      );
                    }
                  if (screen === "game") lokCoinsRef.current += 1;
                  }
                  if (a.kineticType === "glitch_chrono" && realBDmg > 0) {
                    a.x = 50 + Math.random() * (ARENA_W - 100);
                    a.y = SCOREBOARD_H + 50 + Math.random() * (ARENA_H - 100);
                    for (let p = 0; p < 10; p++) pushParticle(a.x, a.y, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 20, "#ff00ff", 3, dataRef.parts.current, state.optPool);
                  }
                  if (b.kineticType === "glitch_chrono" && realADmg > 0) {
                    b.x = 50 + Math.random() * (ARENA_W - 100);
                    b.y = SCOREBOARD_H + 50 + Math.random() * (ARENA_H - 100);
                    for (let p = 0; p < 10; p++) pushParticle(b.x, b.y, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 20, "#ff00ff", 3, dataRef.parts.current, state.optPool);
                  }
                } else if (a.team === b.team) {
                  const relV = Math.abs(rawDot);
                  if (relV > 2) {
                    a.vx *= -0.5; a.vy *= -0.5;
                    b.vx *= -0.5; b.vy *= -0.5;
                  }
                }
              }
          };

          if (state.optGrid && chars.length > 15) {
            const grid = new Map<string, Character[]>();
            for (const c of chars) {
              if (c.dead || c.kineticType === "ghost") continue;
              const cx = Math.floor(c.x / GRID_CELL_SIZE);
              const cy = Math.floor(c.y / GRID_CELL_SIZE);
              const key = `${cx},${cy}`;
              if (!grid.has(key)) grid.set(key, []);
              grid.get(key)!.push(c);
            }
            for (const c of chars) {
              if (c.dead || c.kineticType === "ghost") continue;
              const cx = Math.floor(c.x / GRID_CELL_SIZE);
              const cy = Math.floor(c.y / GRID_CELL_SIZE);
              for (let ox = -1; ox <= 1; ox++) {
                for (let oy = -1; oy <= 1; oy++) {
                  const cell = grid.get(`${cx + ox},${cy + oy}`);
                  if (cell) {
                    for (const b of cell) {
                      if (c.id >= b.id) continue;
                      handleCollision(c, b);
                    }
                  }
                }
              }
            }
          } else {
            for (let i = 0; i < chars.length; i++) {
              const a = chars[i];
              if (a.dead) continue;
              for (let j = i + 1; j < chars.length; j++) handleCollision(a, chars[j]);
            }
          }

          for (const proj of dataRef.projs.current) {
            if (!proj.active) continue;
            proj.x += proj.vx;
            proj.y += proj.vy;
            proj.life -= dtRaw;
            if (proj.life <= 0 || proj.x < 0 || proj.x > ARENA_W ||
              proj.y < SCOREBOARD_H || proj.y > SCOREBOARD_H + ARENA_H) {
              proj.active = false;
              continue;
            }
            for (const c of dataRef.chars.current) {
              if (c.dead || c.team === proj.team) continue;
              if (Math.hypot(c.x - proj.x, c.y - proj.y) < CHAR_RADIUS * c.scale) {
                const dmg = proj.type === "fireball" ? 8 : 5;
                if (c.shieldHp > 0) c.shieldHp -= dmg;
                else c.hp -= dmg;
                c.flashFrames = 5;
                c.vx += proj.vx * 0.5 / c.mass;
                c.vy += proj.vy * 0.5 / c.mass;
                proj.active = false;
                spawnExplosion(proj.x, proj.y, proj.team, state.theme, state, dataRef.parts.current);
                if (c.kineticType === "glitch_chrono") {
                  c.x = 50 + Math.random() * (ARENA_W - 100);
                  c.y = SCOREBOARD_H + 50 + Math.random() * (ARENA_H - 100);
                  for (let p = 0; p < 10; p++) pushParticle(c.x, c.y, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 20, "#ff00ff", 3, dataRef.parts.current, state.optPool);
                }
                break;
              }
            }
          }

          for (const c of dataRef.chars.current) {
            if (c.dead) continue;
            if ((c.weapon === "blaster" || c.weapon === "fireball") && c.cooldown <= 0) {
              const [tx, ty] = getWeaponTip(c);
              let nearestEnemy: Character | null = null;
              let nearDist = Infinity;
              for (const other of dataRef.chars.current) {
                if (other.dead || other.team === c.team) continue;
                const d = Math.hypot(c.x - other.x, c.y - other.y);
                if (d < nearDist) { nearDist = d; nearestEnemy = other; }
              }
              if (nearestEnemy && nearDist < 300) {
                const dx = nearestEnemy.x - tx, dy = nearestEnemy.y - ty;
                const dist = Math.hypot(dx, dy);
                const speed = 5;
                const pColor = getTeamColor(c.team, state.theme, c.kineticType, 0);
                ObjectPoolSystem.acquire(
                  dataRef.projs.current, state.optPool, 0,
                  () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, color: "", team: 0, active: false, type: "laser" }),
                  (p) => { p.x = tx; p.y = ty; p.vx = (dx / dist) * speed; p.vy = (dy / dist) * speed; p.life = 1500; p.color = pColor; p.team = c.team; p.type = c.weapon === "fireball" ? "fireball" : "laser"; }
                );
                c.cooldown = c.weapon === "fireball" ? 1800 : 1200;
              }
            }
          }

          for (const p of dataRef.parts.current) {
            if (!p.active) continue;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.92;
            p.vy *= 0.92;
            p.life -= dtRaw;
            if (p.life <= 0) p.active = false;
          }
          for (const g of dataRef.ghosts.current) {
            if (!g.active) continue;
            g.y += g.vy;
            g.life -= dtRaw;
            if (g.life <= 0) g.active = false;
          }
          for (const t of dataRef.texts.current) {
            if (!t.active) continue;
            t.y += t.vy;
            t.life -= dtRaw;
            if (t.life <= 0) t.active = false;
          }
          for (const e of dataRef.essences.current) {
            if (!e.active) continue;
            e.x += e.vx;
            e.y += e.vy;
            e.vx *= 0.97;
            e.vy *= 0.97;
            e.angle += e.rotSpeed;
            e.life -= dtRaw;
            if (e.life <= 0) e.active = false;
          }
          for (const f of dataRef.feed.current) {
            if (!f.active) continue;
            f.life -= dtRaw;
            if (f.life <= 0) f.active = false;
          }
          for (const bomb of dataRef.bombs.current) {
            if (!bomb.active) continue;
            bomb.timer += dtRaw;
            if (bomb.timer >= bomb.maxTimer) {
              triggerExplosion(bomb.x, bomb.y, bomb.radius, state, bomb.type === "bomb");
              bomb.active = false;
            }
          }

          if ((screen === "game" && state.running) || (screen === "menu" && state.menuSimulator)) {
            for (const c of dataRef.chars.current) {
              if (!c.dead && c.hp <= 0) {
                c.dead = true;
            if (c.kineticType === "volatile") {
              triggerExplosion(c.x, c.y, 120, state, true);
            } else {
              spawnExplosion(c.x, c.y, c.team, state.theme, state, dataRef.parts.current, c.kineticType);
            }

                if (screen === "game") {
                  if (state.modifier === "necromancy" && c.team !== 5) {
                  const zombie = spawnCharacter(5, state.modifier, dataRef.chars.current, false, state.optPool, "none", state.fighterSpeed, c.x, c.y, "zombie");
                  if (!state.optPool || zombie.id >= charIdCounter - 1) dataRef.chars.current.push(zombie);
                }

                  if (state.explodingCorpses) {
                  triggerExplosion(c.x, c.y, 80, state, false);
                }

                  const killer = dataRef.chars.current.find((other) => !other.dead && other.team !== c.team);
                  if (killer) {
                    if (killer.team === 1) {
                      state.p1Score++;
                      state.directorScore += c.isBoss ? 50 : 10;
                      lokCoinsRef.current += c.isBoss ? 25 : 10;
                      spawnText(killer.x, killer.y - 30, c.isBoss ? "+BOSS +50 LoK" : "+1", c.isBoss ? "#ffd700" : "#00ff88");
                    } else if (killer.team === 2) {
                      state.p2Score++;
                      spawnText(killer.x, killer.y - 30, "+1", "#ff4444");
                    }
                    const feedMsg = c.isBoss
                      ? `👑 BOSS eliminated by Team ${killer.team}!`
                      : `Team ${killer.team} eliminated ${c.kineticType}`;
                  ObjectPoolSystem.acquire(
                    dataRef.feed.current, state.optPool, 0,
                    () => ({ text: "", life: 0, color: "", active: false }),
                    (f) => { f.text = feedMsg; f.life = 3000; f.color = killer.team === 1 ? "#00ff88" : "#ff4444"; }
                  );
                  }

                  if (c.team === 3 && state.modifier === "lok_bounty" && state.bountyEndsGame) {
                    endGame();
                  }

                ObjectPoolSystem.acquire(
                  dataRef.ghosts.current, state.optPool, 0,
                  () => ({ x: 0, y: 0, team: 0, vy: 0, life: 0, maxLife: 0, scored: false, active: false }),
                  (g) => { g.x = c.x; g.y = c.y; g.team = c.team; g.vy = -0.8; g.life = 1500; g.maxLife = 1500; g.scored = false; }
                );

                  if (state.sloMoKills) {
                    state.timeScale = 0.2;
                  }

                  if (state.mode === "score" && state.scoreLimit !== Infinity) {
                    if (state.p1Score >= state.scoreLimit || state.p2Score >= state.scoreLimit) {
                      endGame();
                    }
                  }
                  if (state.mode === "horde" || state.mode === "infection") {
                    if (state.p1Score >= 50) endGame();
                  }
                }
              }
            }

            if (screen === "game" && state.mode === "infection") {
              let infected = 0, survivors = 0;
              for (let i = 0; i < dataRef.chars.current.length; i++) {
                const c = dataRef.chars.current[i];
                if (!c.dead) { if (c.team === 1) survivors++; else if (c.team === 2) infected++; }
              }
              if (survivors === 0 && infected > 0) endGame();
            }
          }
        }

        // ─── RENDER PASS ─────────────────────────────────────────────────────
        const state2 = stateRef.current;
        const theme = state2.theme;
        const ts = timestamp;

        if (screen === "game") {
          drawThemeBackground(ctx, theme, ts, ARENA_W, ARENA_H, SCOREBOARD_H);

          // --- GRID RENDERING WITH PARALLAX & JIGGLE ---
          ctx.save();
          let pOffsetX = 0;
          let pOffsetY = 0;
          if (state2.parallaxGrid && state2.camera !== "static") {
            pOffsetX = -(camRef.current.x - ARENA_W / 2) * 0.15;
            pOffsetY = -(camRef.current.y - (SCOREBOARD_H + ARENA_H / 2)) * 0.15;
          }
          if (state2.reactiveGrid && state2.shakeFrames > 0 && state2.juice !== "off") {
            pOffsetX += (Math.random() - 0.5) * (state2.juice === "super" ? 15 : 6);
            pOffsetY += (Math.random() - 0.5) * (state2.juice === "super" ? 15 : 6);
          }

          if (
            theme !== "abyss" && theme !== "hacker" && theme !== "glitch" &&
            theme !== "monochrome" && theme !== "neon_abyss" && theme !== "rgb_cycle" &&
            state2.environment !== "blackout"
          ) {
            let gridColor = "#334";
            if (theme === "neon") gridColor = "#112244";
            if (theme === "gameboy") gridColor = "#8bac0f";
            if (theme === "runesite" || theme === "runesite_ultimate") gridColor = "#403930";
            if (theme === "gsix") gridColor = "#004444";
            if (theme === "gilded") gridColor = "#664400";
            if (theme === "synthwave") gridColor = "#440066";
            if (theme === "vampire" || theme === "overdrive" || theme === "blood_moon") gridColor = "#440000";
            if (theme === "oceanic") gridColor = "#004466";
            if (theme === "infernal") gridColor = "#661100";
            if (theme === "lokmod") gridColor = "#333333";
            if (theme === "comic" || theme === "paper_sketch") gridColor = "rgba(0,0,0,0.1)";

            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            for (let gx = (pOffsetX % 40) - 40; gx <= ARENA_W + 40; gx += 40) {
              ctx.beginPath(); ctx.moveTo(gx, SCOREBOARD_H); ctx.lineTo(gx, SCOREBOARD_H + ARENA_H); ctx.stroke();
            }
            for (let gy = SCOREBOARD_H + (pOffsetY % 40) - 40; gy <= SCOREBOARD_H + ARENA_H + 40; gy += 40) {
              ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(ARENA_W, gy); ctx.stroke();
            }
          }

          if (state2.environment !== "ice" && state2.environment !== "wrap" && state2.environment !== "blackout" && theme !== "abyss" && theme !== "neon_abyss" && theme !== "rgb_cycle") {
            ctx.strokeStyle = theme === "gameboy" ? "#306230" : theme === "gilded" ? "#ffaa00" : theme === "comic" || theme === "paper_sketch" ? "#000" : "rgba(255,255,255,0.2)";
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 10]);
            ctx.beginPath(); ctx.moveTo(ARENA_W / 2 + pOffsetX, SCOREBOARD_H); ctx.lineTo(ARENA_W / 2 + pOffsetX, SCOREBOARD_H + ARENA_H); ctx.stroke();
            ctx.setLineDash([]);
          }
          ctx.restore();

          if (state2.environment === "blackout") {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, SCOREBOARD_H, ARENA_W, ARENA_H);
          }

          if (state2.modifier === "shrinking_arena" && state2.shrinkingZone > 0) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
            ctx.fillRect(0, SCOREBOARD_H, ARENA_W, state2.shrinkingZone);
            ctx.fillRect(0, SCOREBOARD_H + ARENA_H - state2.shrinkingZone, ARENA_W, state2.shrinkingZone);
            ctx.fillRect(0, SCOREBOARD_H, state2.shrinkingZone, ARENA_H);
            ctx.fillRect(ARENA_W - state2.shrinkingZone, SCOREBOARD_H, state2.shrinkingZone, ARENA_H);
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 2;
            ctx.strokeRect(state2.shrinkingZone, SCOREBOARD_H + state2.shrinkingZone, ARENA_W - state2.shrinkingZone * 2, ARENA_H - state2.shrinkingZone * 2);
          }

          if (state2.environment === "blackhole") {
            const bx = ARENA_W / 2, by = SCOREBOARD_H + ARENA_H / 2;
            const grd = ctx.createRadialGradient(bx, by, 0, bx, by, 80);
            grd.addColorStop(0, "rgba(0,0,0,0.95)");
            grd.addColorStop(0.5, "rgba(50,0,100,0.5)");
            grd.addColorStop(1, "transparent");
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(bx, by, 80, 0, Math.PI * 2);
            ctx.fill();
          }

          if (state2.environment === "lava") {
            const pulse2 = 0.5 + 0.5 * Math.sin(ts * 0.003);
            ctx.fillStyle = `rgba(255, ${Math.floor(40 + pulse2 * 40)}, 0, 0.6)`;
            ctx.fillRect(0, SCOREBOARD_H + ARENA_H - 18, ARENA_W, 18);
          }
        }

        let targetX = ARENA_W / 2;
        let targetY = SCOREBOARD_H + ARENA_H / 2;
        let targetZoom = 1;
        const activeChars = dataRef.chars.current.filter((c) => !c.dead);

        if (state2.camera === "enhanced" && activeChars.length > 0) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          for (const c of activeChars) {
            if (c.x < minX) minX = c.x; if (c.x > maxX) maxX = c.x;
            if (c.y < minY) minY = c.y; if (c.y > maxY) maxY = c.y;
          }
          const bw = Math.max(maxX - minX, 300), bh = Math.max(maxY - minY, 200);
          targetX = minX + bw / 2; targetY = minY + bh / 2;
          targetZoom = Math.min(ARENA_W / bw, ARENA_H / bh, 2.5);
        } else if (state2.camera === "action" && activeChars.length > 0) {
          const teamChars = activeChars.filter((c) => c.team === state2.actionCamTeam);
          if (teamChars.length > 0) {
            const targetChar = teamChars[state2.actionCamIndex % teamChars.length] || teamChars[0];
            targetX = targetChar.x; targetY = targetChar.y; targetZoom = 2.5;
          }
        } else if (state2.camera === "dynamic" && activeChars.length > 0) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          for (const c of activeChars) {
            if (c.x < minX) minX = c.x; if (c.x > maxX) maxX = c.x;
            if (c.y < minY) minY = c.y; if (c.y > maxY) maxY = c.y;
          }
          const bw = Math.max(maxX - minX + 200, 400), bh = Math.max(maxY - minY + 200, 250);
          targetX = minX + bw / 2; targetY = minY + bh / 2;
          targetZoom = Math.min(ARENA_W / bw, ARENA_H / bh, 2.2);
        } else if (state2.camera === "focus" && activeChars.length > 0) {
          let targetChar = activeChars.find((c) => c.id === state2.focusTargetId);
          if (!targetChar) { targetChar = activeChars[0]; state2.focusTargetId = targetChar.id; }
          targetX = targetChar.x; targetY = targetChar.y; targetZoom = state2.focusZoom;
        }

        camRef.current.x += (targetX - camRef.current.x) * 0.08;
        camRef.current.y += (targetY - camRef.current.y) * 0.08;
        camRef.current.zoom += (targetZoom - camRef.current.zoom) * 0.08;

        const camShakeX = state2.shakeFrames > 0 ? (Math.random() - 0.5) * 6 : 0;
        const camShakeY = state2.shakeFrames > 0 ? (Math.random() - 0.5) * 6 : 0;
        if (state2.shakeFrames > 0) state2.shakeFrames--;

        ctx.save();
        ctx.beginPath(); ctx.rect(0, SCOREBOARD_H, ARENA_W, ARENA_H); ctx.clip();
        ctx.translate(camShakeX, camShakeY);
        ctx.translate(ARENA_W / 2, SCOREBOARD_H + ARENA_H / 2);
        ctx.scale(camRef.current.zoom, camRef.current.zoom);
        ctx.translate(-camRef.current.x, -camRef.current.y);

        if (state2.ads && screen === "game") {
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

        for (const e of dataRef.essences.current) {
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

        for (const c of dataRef.chars.current) {
          if (c.dead) continue;
          if (
            screen === "game" &&
            (c.x < -50 || c.x > ARENA_W + 50 || c.y < SCOREBOARD_H - 50 || c.y > SCOREBOARD_H + ARENA_H + 50)
          ) continue;

          if (state2.trails && c.trail.length > 1) {
            for (let ti = 0; ti < c.trail.length; ti++) {
              const tf = c.trail[ti];
              const alpha = (ti / c.trail.length) * 0.35;
              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.translate(tf.x, tf.y);
              ctx.rotate(tf.angle);
              const trailColor = getTeamColor(c.team, theme, c.kineticType, ts);
              ctx.fillStyle = trailColor;
              if (c.skin !== "default") {
                drawSkin(ctx, c, trailColor, c.skin, c.scale, false, theme, state2.devMode);
              } else {
                for (const p of c.parts) {
                  ctx.fillRect(p.ox - p.r, p.oy - p.r, p.r * 2, p.r * 2);
                }
              }
              ctx.restore();
            }
          }

          const flash = c.flashFrames > 0;
          renderChar(ctx, c, flash, 1, theme, state2.devMode, state2.optCache, ts);

          if (state2.hud) {
            drawHpBar(ctx, c, state2.modifier, state2.devMode, theme);
          }
        }

        for (const p of dataRef.parts.current) {
          if (!p.active) continue;
          const alpha = Math.max(0, p.life / p.maxLife);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;

        for (const g of dataRef.ghosts.current) {
          if (!g.active) continue;
          drawGhost(ctx, g, state2.devMode, theme);
        }

        for (const proj of dataRef.projs.current) {
          if (!proj.active) continue;
          ctx.fillStyle = proj.type === "fireball" ? "#ff6600" : proj.color;
          ctx.shadowBlur = proj.type === "fireball" ? 8 : 4;
          ctx.shadowColor = proj.color;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, proj.type === "fireball" ? 5 : 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        for (const t of dataRef.texts.current) {
          if (!t.active) continue;
          const alpha2 = Math.max(0, t.life / t.maxLife);
          ctx.globalAlpha = alpha2;
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
            ctx.font = "bold 14px monospace";
            ctx.textAlign = "center";
            ctx.fillText(t.text, t.x, t.y);
          }
        }
        ctx.globalAlpha = 1;

        // Render Sabres
        for (const s of dataRef.sabres.current) {
          if (!s.active) continue;
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.angle);
          ctx.translate(0, 25 * s.scale); // Offset to pivot around the middle of the handle
          ctx.globalAlpha = Math.min(1, s.life / 500);
          let wCol1 = "#aaaaaa", wCol2 = "#555555";
          if (s.isBrkn) {
            if (s.element === "fire") { wCol1 = "#ff0000"; wCol2 = "#ffaa00"; }
            else if (s.element === "frost") { wCol1 = "#00ffff"; wCol2 = "#0088ff"; }
            else if (s.element === "vortex") { wCol1 = "#aa00ff"; wCol2 = "#440088"; }
            ctx.shadowBlur = 10; ctx.shadowColor = wCol1;
          }
          drawWeapon(ctx, s.weapon, s.scale, wCol1, wCol2, theme, ts);
          ctx.restore();
        }

        ctx.restore();

        if (state2.hud && screen === "game") {
          if (state2.classicMenu) {
            ctx.fillStyle =
              theme === "gameboy" ? "#8bac0f" :
              theme === "runesite" || theme === "runesite_ultimate" ? "#1e1a16" :
              theme === "gilded" ? "#221100" :
              theme === "lokmod" ? "#080814" :
              theme === "comic" || theme === "paper_sketch" ? "#ffffff" :
              "#0a0a18";
            ctx.fillRect(0, 0, ARENA_W, SCOREBOARD_H);
            ctx.strokeStyle =
              theme === "gameboy" ? "#0f380f" :
              theme === "gilded" || theme === "lokmod" ? "#ffd700" :
              theme === "comic" || theme === "paper_sketch" ? "#000" :
              "#6644aa";
            ctx.lineWidth = 3;
            ctx.strokeRect(0, SCOREBOARD_H, ARENA_W, ARENA_H);

            ctx.font = "bold 18px monospace";
            ctx.textAlign = "center";
            ctx.fillStyle = theme === "gameboy" ? "#0f380f" : theme === "comic" || theme === "paper_sketch" ? "#444" : "#cc4433";
            ctx.fillText(`P1: ${state2.p1Score}`, 140, 36);
            
            ctx.fillStyle = theme === "gameboy" ? "#306230" : theme === "comic" || theme === "paper_sketch" ? "#888" : "#3366cc";
            ctx.fillText(`P2: ${state2.p2Score}`, ARENA_W - 140, 36);
            
            ctx.fillStyle = theme === "gameboy" ? "#0f380f" : theme === "gilded" || theme === "lokmod" ? "#ffd700" : theme === "comic" || theme === "paper_sketch" ? "#000" : "#aaaaaa";
            ctx.font = "bold 22px monospace";
            ctx.fillText("KINETIC SOULS", ARENA_W / 2, 24);

            ctx.fillStyle = theme === "gameboy" ? "#0f380f" : theme === "comic" || theme === "paper_sketch" ? "#000" : "#ffaa00";
            ctx.font = "bold 10px monospace";
            ctx.fillText(`DIR POINTS: ${state2.directorScore}`, ARENA_W / 2, 36);

            ctx.font = "12px monospace";
            if (state2.mode === "horde" || state2.mode === "infection") ctx.fillText(`SURVIVE 50 KILLS | ENEMY KILLS: ${state2.p2Score}/15`, ARENA_W / 2, 50);
            else if (state2.mode === "unlimited") ctx.fillText(`TIME: ∞ | LIMIT: ∞`, ARENA_W / 2, 50);
            else if (state2.mode === "timer") ctx.fillText(`TIME: ${Math.floor(state2.timeLeft / 60)}:${Math.floor(state2.timeLeft % 60).toString().padStart(2, "0")}`, ARENA_W / 2, 50);
            else ctx.fillText(`FIRST TO ${state2.scoreLimit}`, ARENA_W / 2, 50);

            if (state2.modifier !== "none" || state2.camera !== "static" || state2.p1Auto || state2.opponent === "ffa") {
              ctx.fillStyle = theme === "gameboy" ? "#306230" : theme === "gilded" || theme === "lokmod" ? "#ffaa00" : theme === "comic" || theme === "paper_sketch" ? "#666" : "#ffaa00";
              ctx.fillText(`[MOD: ${state2.modifier.toUpperCase()} | CAM: ${state2.camera.toUpperCase()} | AUTO: ${state2.p1Auto ? "ON" : "OFF"}]`, ARENA_W / 2, 60);
            }

            if (state2.devMode) {
              const activeChars = dataRef.chars.current.filter((c) => !c.dead);
              ctx.textAlign = "left";
              ctx.fillStyle = "#00ff00";
              ctx.font = "10px monospace";
              ctx.fillText(`DEV MODE ACTIVE`, 10, SCOREBOARD_H + 20);
              ctx.fillText(`Entities: ${activeChars.length}`, 10, SCOREBOARD_H + 35);
              ctx.fillText(`Particles: ${state2.optPool ? dataRef.parts.current.filter((p) => p.active).length : dataRef.parts.current.length}`, 10, SCOREBOARD_H + 50);
            }
          } else {
            const hudTheme = theme;
            const hudBg = hudTheme === "gameboy" ? "#0f380f" : hudTheme === "paper_sketch" ? "#e8e0d0" : hudTheme === "comic" ? "#ffe8c0" : "rgba(0,0,0,0.85)";
            const hudText = hudTheme === "gameboy" ? "#9bbc0f" : hudTheme === "paper_sketch" || hudTheme === "comic" ? "#000" : "#ffffff";

            ctx.fillStyle = hudBg;
            ctx.fillRect(0, 0, ARENA_W, SCOREBOARD_H);
            ctx.strokeStyle = getTeamColor(1, theme);
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, ARENA_W, SCOREBOARD_H);

            ctx.fillStyle = hudText;
            ctx.font = "bold 20px monospace";
            ctx.textAlign = "left";
            ctx.fillText(`P1: ${state2.p1Score}`, 16, 22);
            ctx.textAlign = "right";
            ctx.fillText(`P2: ${state2.p2Score}`, ARENA_W - 16, 22);
            ctx.textAlign = "center";

            if (state2.mode === "timer" && state2.timeLeft !== Infinity) {
              const timeColor = state2.timeLeft <= 10 ? "#ff2200" : state2.timeLeft <= 30 ? "#ffaa00" : hudText;
              ctx.fillStyle = timeColor;
              ctx.font = "bold 22px monospace";
              ctx.fillText(`${Math.ceil(state2.timeLeft)}s`, ARENA_W / 2, 24);
            } else if (state2.mode === "score") {
              ctx.fillStyle = hudText;
              ctx.font = "14px monospace";
              ctx.fillText(`Score limit: ${state2.scoreLimit}`, ARENA_W / 2, 24);
            }

            ctx.fillStyle = "rgba(255,200,0,0.7)";
            ctx.font = "11px monospace";
            ctx.fillText(`⚡ Dir: ${state2.directorScore}`, ARENA_W / 2, 44);

            if (state2.modifier !== "none") {
              ctx.fillStyle = "#ffaa00";
              ctx.font = "10px monospace";
              ctx.textAlign = "left";
              ctx.fillText(`[${state2.modifier.replace(/_/g, " ").toUpperCase()}]`, 16, 44);
            }
            if (state2.environment !== "none") {
              ctx.fillStyle = "#00aaff";
              ctx.font = "10px monospace";
              ctx.textAlign = "right";
              ctx.fillText(`ENV: ${state2.environment.toUpperCase()}`, ARENA_W - 16, 44);
            }

            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.font = "10px monospace";
            ctx.textAlign = "right";
            let hudActiveFighters = 0;
            for (let i=0; i<dataRef.chars.current.length; i++) if (!dataRef.chars.current[i].dead) hudActiveFighters++;
            ctx.fillText(`Fighters: ${hudActiveFighters}`, ARENA_W - 16, 58);
          }

          if (state2.viewMode === "standard") {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const mw = 120, mh = 80;
            let mx = ARENA_W - mw - 10;
            let my = SCOREBOARD_H + ARENA_H - mh - 10;
            
            if (state2.minimapPosition === "bottom-left") { mx = 10; my = SCOREBOARD_H + ARENA_H - mh - 10; }
            else if (state2.minimapPosition === "top-right") { mx = ARENA_W - mw - 10; my = SCOREBOARD_H + 10; }
            else if (state2.minimapPosition === "top-left") { mx = 10; my = SCOREBOARD_H + 10; }

            ctx.fillStyle = theme === "gameboy" ? "rgba(139,172,15,0.9)" : theme === "paper_sketch" || theme === "comic" ? "rgba(255,255,255,0.9)" : "rgba(10,10,20,0.8)";
            ctx.fillRect(mx, my, mw, mh);
            ctx.strokeStyle = theme === "gameboy" ? "#0f380f" : theme === "gilded" || theme === "lokmod" ? "#ffd700" : theme === "paper_sketch" || theme === "comic" ? "#000" : "#444";
            ctx.lineWidth = 2;
            ctx.strokeRect(mx, my, mw, mh);

            ctx.strokeStyle = theme === "comic" || theme === "paper_sketch" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mx + mw / 2, my);
            ctx.lineTo(mx + mw / 2, my + mh);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(mx, my + mh / 2);
            ctx.lineTo(mx + mw, my + mh / 2);
            ctx.stroke();

            for (const c of dataRef.chars.current) {
              if (c.dead) continue;
              ctx.fillStyle = getTeamColor(c.team, theme, c.kineticType === "zombie" || c.team === 5 ? "zombie" : "standard");
              ctx.shadowBlur = 5;
              ctx.shadowColor = ctx.fillStyle;
              ctx.beginPath();
              ctx.arc(mx + (c.x / ARENA_W) * mw, my + ((c.y - SCOREBOARD_H) / ARENA_H) * mh, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.shadowBlur = 0;

            ctx.strokeStyle = theme === "gameboy" ? "#0f380f" : theme === "gilded" || theme === "lokmod" ? "#ffd700" : theme === "paper_sketch" || theme === "comic" ? "#444" : "rgba(255,255,255,0.5)";
            const camZ = camRef.current.zoom;
            ctx.strokeRect(
              mx + ((camRef.current.x - ARENA_W / camZ / 2) / ARENA_W) * mw,
              my + ((camRef.current.y - SCOREBOARD_H - ARENA_H / camZ / 2) / ARENA_H) * mh,
              mw / camZ,
              mh / camZ
            );
            ctx.restore();
          }

          if (state2.paused) {
            if (state2.classicMenu) {
              const W = ARENA_W, H = ARENA_H;
              ctx.fillStyle = theme === "gameboy" ? "rgba(139,172,15,0.8)" : "rgba(0,0,0,0.8)";
              ctx.fillRect(0, SCOREBOARD_H, W, H);
              ctx.fillStyle = theme === "gameboy" ? "#0f380f" : theme === "gilded" || theme === "lokmod" ? "#ffd700" : "#ccaaff";
              ctx.font = "bold 40px monospace";
              ctx.textAlign = "center";
              ctx.fillText("PAUSED", W / 2, SCOREBOARD_H + H / 2 - 50);
              const mx = mouseRef.current.x, my = mouseRef.current.y;
              const btnX = W / 2 - 75;
              drawBtn(ctx, "RESUME", btnX, SCOREBOARD_H + H / 2 - 10, 150, 40, mx >= btnX && mx <= btnX + 150 && my >= SCOREBOARD_H + H / 2 - 10 && my <= SCOREBOARD_H + H / 2 + 30, theme, false, true);
              drawBtn(ctx, "LIVE MODS", btnX, SCOREBOARD_H + H / 2 + 40, 150, 40, mx >= btnX && mx <= btnX + 150 && my >= SCOREBOARD_H + H / 2 + 40 && my <= SCOREBOARD_H + H / 2 + 80, theme, false, true);
              drawBtn(ctx, "QUIT TO MENU", btnX, SCOREBOARD_H + H / 2 + 90, 150, 40, mx >= btnX && mx <= btnX + 150 && my >= SCOREBOARD_H + H / 2 + 90 && my <= SCOREBOARD_H + H / 2 + 130, theme, false, true);
            } else {
              ctx.fillStyle = "rgba(0,0,0,0.6)";
              ctx.fillRect(0, SCOREBOARD_H, ARENA_W, ARENA_H);
              ctx.fillStyle = "#fff";
              ctx.font = "bold 36px monospace";
              ctx.textAlign = "center";
              ctx.fillText("⏸ PAUSED", ARENA_W / 2, SCOREBOARD_H + ARENA_H / 2);
            }
          }

          const feedActive = dataRef.feed.current.filter((f) => f.active);
          if (state2.classicMenu) {
            ctx.textAlign = "right";
            ctx.font = "10px monospace";
            feedActive.forEach((msg, idx) => {
              ctx.globalAlpha = Math.min(1, msg.life / 800);
              ctx.fillStyle = theme === "gameboy" ? "#0f380f" : msg.color;
              ctx.fillText(msg.text, ARENA_W - 10, SCOREBOARD_H + 20 + idx * 15);
            });
          } else {
            feedActive.slice(-4).forEach((f, fi) => {
              const alpha3 = Math.min(1, f.life / 800);
              ctx.globalAlpha = alpha3;
              ctx.fillStyle = f.color;
              ctx.font = "11px monospace";
              ctx.textAlign = "left";
              ctx.fillText(f.text, 10, SCOREBOARD_H + 16 + fi * 16);
            });
          }
          ctx.globalAlpha = 1;
        } else if (screen === "replay") {
          const replay = refBestReplay.current!;
          const frame = replay.frames[Math.floor(refReplayPlaybackIdx.current)];
          
          if (!frame) {
            screenRef.current = "over";
            return;
          }

          drawThemeBackground(ctx, state2.theme, ts, ARENA_W, ARENA_H, SCOREBOARD_H);

          // Interpolate camera beautifully toward the victim
          const victim = frame.chars.find(c => c.id === replay.victimId);
          if (victim) {
            camRef.current.x += (victim.x - camRef.current.x) * 0.1;
            camRef.current.y += (victim.y - camRef.current.y) * 0.1;
            camRef.current.zoom += (2.5 - camRef.current.zoom) * 0.05;
          }

          ctx.save();
          ctx.beginPath(); ctx.rect(0, SCOREBOARD_H, ARENA_W, ARENA_H); ctx.clip();
          ctx.translate(ARENA_W / 2, SCOREBOARD_H + ARENA_H / 2);
          ctx.scale(camRef.current.zoom, camRef.current.zoom);
          ctx.translate(-camRef.current.x, -camRef.current.y);

          for (const c of frame.chars) {
            if (c.dead) continue;
            renderChar(ctx, c, c.flashFrames > 0, 1, state2.theme, state2.devMode, false, ts);
          }
          for (const p of frame.parts) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = alpha; ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          }
          ctx.globalAlpha = 1;
          for (const t of frame.texts) {
            ctx.fillStyle = t.color; ctx.font = "bold 14px monospace"; ctx.textAlign = "center"; ctx.fillText(t.text, t.x, t.y);
          }

          for (const s of frame.sabres) {
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
            drawWeapon(ctx, s.weapon, s.scale, wCol1, wCol2, state2.theme, ts);
            ctx.restore();
          }
          ctx.restore();

          // Velocity Cam Cinematic Overlay
          ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(0, SCOREBOARD_H, ARENA_W, 60);
          ctx.fillStyle = "#ff00ff"; ctx.font = "bold 24px monospace"; ctx.textAlign = "center";
          ctx.fillText("🎥 VELOCITY CAM: HIGHEST IMPACT KILL", ARENA_W / 2, SCOREBOARD_H + 25);
          ctx.fillStyle = "#fff"; ctx.font = "14px monospace";
          ctx.fillText(`Impact Force: ${Math.floor(replay.maxV)}  |  Playback: ${Math.floor((refReplayPlaybackIdx.current / replay.frames.length) * 100)}%`, ARENA_W / 2, SCOREBOARD_H + 45);

          refReplayPlaybackIdx.current += 0.5; // Half-speed slow-mo playback
          if (refReplayPlaybackIdx.current >= replay.frames.length + 40) { screenRef.current = "over"; setTick(t => t + 1); }
        }

        if (state2.crtFilter && screen === "game") {
          for (let row = 0; row < ARENA_H; row += 3) {
            ctx.fillStyle = "rgba(0,0,0,0.12)";
            ctx.fillRect(0, SCOREBOARD_H + row, ARENA_W, 1);
          }
          const crtGrd = ctx.createRadialGradient(
            ARENA_W / 2, SCOREBOARD_H + ARENA_H / 2, 0,
            ARENA_W / 2, SCOREBOARD_H + ARENA_H / 2, Math.max(ARENA_W, ARENA_H),
          );
          crtGrd.addColorStop(0, "transparent");
          crtGrd.addColorStop(1, "rgba(0,0,0,0.35)");
          ctx.fillStyle = crtGrd;
          ctx.fillRect(0, SCOREBOARD_H, ARENA_W, ARENA_H);
        }

        if (state2.vhsFilter && screen === "game") {
          const glitchLine = Math.floor(Math.random() * ARENA_H);
          ctx.fillStyle = "rgba(255,0,0,0.04)";
          ctx.fillRect(0, SCOREBOARD_H + glitchLine, ARENA_W, 2);
          ctx.fillStyle = "rgba(0,0,255,0.04)";
          ctx.fillRect(2, SCOREBOARD_H + glitchLine, ARENA_W, 2);
        }

        if (state2.invertFilter && screen === "game") {
          ctx.globalCompositeOperation = "difference";
          ctx.fillStyle = "white";
          ctx.fillRect(0, SCOREBOARD_H, ARENA_W, ARENA_H);
          ctx.globalCompositeOperation = "source-over";
        }

      }

      timeRef.raf.current = requestAnimationFrame(gameLoop);
    },
    [refs, dataRef, timeRef, endGame, triggerExplosion, spawnText, birthType],
  );

  useEffect(() => {
    timeRef.last.current = performance.now();
    timeRef.raf.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(timeRef.raf.current);
  }, [gameLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (["bestiary", "lok_menu", "settings_menu"].includes(screenRef.current)) {
        refMenuScroll.current = Math.min(0, Math.max(-3000, refMenuScroll.current - e.deltaY));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const my = (e.clientY - rect.top) * (canvas.height / rect.height);
      const screen = screenRef.current;
      const state = stateRef.current;
      const W = ARENA_W, H = ARENA_H + SCOREBOARD_H;

      if (screen === "menu") {
        if (state.classicMenu) {
          const cx = ARENA_W / 2;
          if (mx >= cx - 130 && mx <= cx - 15 && my >= 285 && my <= 321) { refs.mode.current = "timer"; setTick((t) => t + 1); }
          if (mx >= cx + 15 && mx <= cx + 130 && my >= 285 && my <= 321) { refs.mode.current = "score"; setTick((t) => t + 1); }
          if (mx >= cx - 130 && mx <= cx - 15 && my >= 373 && my <= 409) { refs.opp.current = "pvp"; setTick((t) => t + 1); }
          if (mx >= cx + 15 && mx <= cx + 130 && my >= 373 && my <= 409) { refs.opp.current = "bot"; setTick((t) => t + 1); }
          if (mx >= cx - 75 && mx <= cx + 75 && my >= 440 && my <= 484) { startGame(); setTick((t) => t + 1); }
          if (mx >= cx - 75 && mx <= cx + 75 && my >= 495 && my <= 525) { screenRef.current = "bestiary"; refMenuScroll.current = 0; setTick((t) => t + 1); return; }
          if (mx >= ARENA_W - 160 && mx <= ARENA_W - 10 && my >= SCOREBOARD_H + ARENA_H - 40 && my <= SCOREBOARD_H + ARENA_H - 10) { screenRef.current = "lok_menu"; refMenuScroll.current = 0; setTick((t) => t + 1); return; }
          if (mx >= 10 && mx <= 160 && my >= SCOREBOARD_H + ARENA_H - 40 && my <= SCOREBOARD_H + ARENA_H - 10) { screenRef.current = "settings_menu"; refMenuScroll.current = 0; setTick((t) => t + 1); return; }
        } else {
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
          const bw = 160, bh = 34, gapY = 10;
          const col1X = W / 2 - bw - 10, col2X = W / 2 + 10;
          let sY = 144;
          const maxRows = Math.max(modeButtons.length, oppButtons.length);
          for (let i = 0; i < maxRows; i++) {
            if (modeButtons[i]) {
              const bx = col1X, by = sY + i * (bh + gapY);
              if (mx >= bx && mx <= bx + bw && my >= by && my <= by + bh) {
                refs.mode.current = modeButtons[i].value;
                setTick((t) => t + 1);
                return;
              }
            }
            if (oppButtons[i]) {
              const bx = col2X, by = sY + i * (bh + gapY);
              if (mx >= bx && mx <= bx + bw && my >= by && my <= by + bh) {
                refs.opp.current = oppButtons[i].value;
                setTick((t) => t + 1);
                return;
              }
            }
          }
          sY += maxRows * (bh + gapY) + 16;
          const bigBtnYs = [sY, sY + bh + gapY, sY + (bh + gapY) * 2, sY + (bh + gapY) * 3];
          const bbW = 340, bbH = 36, bbX = W / 2 - 170;
          if (mx >= bbX && mx <= bbX + bbW) {
            if (my >= bigBtnYs[0] && my <= bigBtnYs[0] + bbH) { startGame(); setTick((t) => t + 1); }
            else if (my >= bigBtnYs[1] && my <= bigBtnYs[1] + bbH) { screenRef.current = "lok_menu"; refMenuScroll.current = 0; setTick((t) => t + 1); }
            else if (my >= bigBtnYs[2] && my <= bigBtnYs[2] + bbH) { screenRef.current = "settings_menu"; refMenuScroll.current = 0; setTick((t) => t + 1); }
            else if (my >= bigBtnYs[3] && my <= bigBtnYs[3] + bbH) { screenRef.current = "bestiary"; refMenuScroll.current = 0; setTick((t) => t + 1); }
          }
        }
      } else if (screen === "lok_menu") {
        const allThemes = [ {label: "Classic", value: "classic"}, {label: "Neon", value: "neon"}, {label: "Gameboy", value: "gameboy"}, {label: "Abyss", value: "abyss"}, {label: "Runesite", value: "runesite"}, {label: "GSix", value: "gsix"}, {label: "Gilded", value: "gilded"}, {label: "Synthwave", value: "synthwave"}, {label: "Vampire", value: "vampire"}, {label: "Oceanic", value: "oceanic"}, {label: "Infernal", value: "infernal"}, {label: "Glitch", value: "glitch"}, {label: "Monochrome", value: "monochrome"}, {label: "Celestial", value: "celestial"}, {label: "Overdrive", value: "overdrive"}, {label: "Comic", value: "comic"}, {label: "Hacker", value: "hacker"}, {label: "RGB Cycle", value: "rgb_cycle"}, {label: "Neon Abyss", value: "neon_abyss"}, {label: "Glass", value: "glassmorphism"}, {label: "Matrix", value: "wireframe_matrix"}, {label: "Cel. Forge", value: "celestial_forge"}, {label: "Blood Moon", value: "blood_moon"}, {label: "Neon OD", value: "neon_overdrive"}, {label: "Paper", value: "paper_sketch"} ];
        const allMods = [ {label: "None", value: "none"}, {label: "Sudden Death", value: "sudden_death"}, {label: "Titans", value: "titans"}, {label: "Shrinking", value: "shrinking_arena"}, {label: "Vampire Kiss", value: "vampire_kiss"}, {label: "Necromancy", value: "necromancy"}, {label: "Magnet", value: "magnet"}, {label: "Repel", value: "repel"}, {label: "LoK Bounty", value: "lok_bounty"} ];
        const allCams = [ {label: "Static", value: "static"}, {label: "Dynamic", value: "dynamic"}, {label: "Action", value: "action"}, {label: "Enhanced", value: "enhanced"}, {label: "Focus Cam", value: "focus"} ];
        const allWeps = [ {label: "Standard", value: "standard"}, {label: "Roulette", value: "roulette"}, {label: "Melee Mash", value: "melee_mash"}, {label: "Ranged", value: "ranged_test"} ];
        const allEnvs = [ {label: "None", value: "none"}, {label: "Ice Rink", value: "ice"}, {label: "Black Hole", value: "blackhole"}, {label: "Lava Floor", value: "lava"}, {label: "Storm", value: "storm"}, {label: "Bouncy", value: "bouncy"}, {label: "Wraparound", value: "wrap"}, {label: "Blackout", value: "blackout"} ];
        const allViews = [ {label: "Standard", value: "standard"}, {label: "Theater", value: "theater"}, {label: "Cinematic", value: "cinematic"} ];

        const sections = [
          { items: allThemes, setter: (v: string) => { refs.theme.current = v as ThemeMode; state.theme = v as ThemeMode; Object.keys(spriteCache).forEach(k => delete spriteCache[k]); }, col: 0, row: 0, label: "THEME" },
          { items: allMods, setter: (v: string) => { refs.mod.current = v as LokModifier; }, col: 1, row: 0, label: "MODIFIER" },
          { items: allCams, setter: (v: string) => { refs.cam.current = v as CameraMode; }, col: 2, row: 0, label: "CAMERA" },
          { items: allWeps, setter: (v: string) => { refs.wep.current = v as WeaponStyle; }, col: 2, row: 1, label: "WEAPONS" },
          { items: allEnvs, setter: (v: string) => { refs.env.current = v as Environment; }, col: 1, row: 1, label: "ENVIRONMENT" },
          { items: allViews, setter: (v: string) => { refs.view.current = v as ViewMode; }, col: 2, row: 2, label: "VIEW MODE" },
        ];

        const backW = 150, backH = 35;
        const backX = ARENA_W / 2 - backW / 2, backY = (ARENA_H + SCOREBOARD_H) - 40;
        if (mx >= backX && mx <= backX + backW && my >= backY && my <= backY + backH) {
          screenRef.current = "menu";
          setTick((t) => t + 1);
          return;
        }
        if (my >= 30 && my <= ARENA_H + SCOREBOARD_H - 30) {
          const colW = 260, colGap = 15;
          const startX = (ARENA_W - (colW * 3 + colGap * 2)) / 2;
          const startY = 58 + refMenuScroll.current;
          const bh = 24, bw = 125, gap = 10;

          for (const sec of sections) {
            const baseX = startX + sec.col * (colW + colGap);
            const baseY = startY + sec.row * 170;
            const maxRows = sec.label === "THEME" ? 14 : 7;

            sec.items.forEach((item, i) => {
              const col2 = Math.floor(i / maxRows);
              const row2 = i % maxRows;
              const bx = baseX + col2 * (bw + gap);
              const by = baseY + 12 + row2 * (bh + 3);
              if (mx >= bx && mx <= bx + bw && my >= by && my <= by + bh) {
                sec.setter(item.value); setTick((t) => t + 1);
              }
            });
          }
        }
      } else if (screen === "settings_menu") {
        const toggleKeys: (keyof GameState)[] = [
          "hud","trails","motionBlur","ads","crtFilter","vhsFilter","invertFilter",
          "aiMagnetic","handOfGod","moonGravity","explodingCorpses","sloMoKills",
          "rainbowBlood","menuGrid","menuParticles","menuDrift","menuCRT","menuPulse",
            "menuSimulator","classicMenu","optCache","optDelta","optGravity","optSmartSpawn","optGrid","optPool",
            "minimapGlowingText","slowCorpses","menuAiMagnetic"
        ];
        const cols = 4, tw = 200, th = 26, gap3 = 10;
        const totalW = cols * tw + (cols - 1) * gap3;
        const startX2 = (W - totalW) / 2;
        const startY2 = 54 + refMenuScroll.current;
        if (my >= 60 && my <= H - 60) {
        toggleKeys.forEach((key, i) => {
          const col = i % cols, row = Math.floor(i / cols);
          const bx = startX2 + col * (tw + gap3);
          const by = startY2 + row * (th + gap3);
          if (mx >= bx && mx <= bx + tw && my >= by && my <= by + th) {
            (stateRef.current as Record<string, unknown>)[key] = !(stateRef.current[key] as boolean);
            setTick((t) => t + 1);
          }
        });
        }
        const backX2 = W / 2 - 60, backY2 = H - 44;
        if (mx >= backX2 && mx <= backX2 + 120 && my >= backY2 && my <= backY2 + 30) {
          screenRef.current = "menu";
          setTick((t) => t + 1);
        }
      } else if (screen === "bestiary") {
        const backW = 140, backH = 32;
        const backX = W / 2 - backW / 2, backY = H - 42;
        if (mx >= backX && mx <= backX + backW && my >= backY && my <= backY + backH) {
          screenRef.current = "menu";
          setTick((t) => t + 1);
        }
      } else if (screen === "over") {
        if (state.classicMenu) {
          const cx = ARENA_W / 2;
          if (mx >= cx - 90 && mx <= cx + 90 && my >= 440 && my <= 488) {
            screenRef.current = "menu";
            dataRef.chars.current = [];
            dataRef.parts.current = [];
            dataRef.ghosts.current = [];
            setTick((t) => t + 1);
          }
        } else {
          screenRef.current = "menu";
          dataRef.chars.current = [];
          dataRef.parts.current = [];
          dataRef.ghosts.current = [];
          setTick((t) => t + 1);
        }
      } else if (screen === "game") {
        if (state.handOfGod) {
          for (const c of dataRef.chars.current) {
            if (!c.dead && Math.hypot(c.x - mx, c.y - my) < CHAR_RADIUS * c.scale * 2) {
              state.draggingId = c.id;
              break;
            }
          }
        }
        const shard = { x: mx, y: my, vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 6 };
        for (let si = 0; si < 6; si++) {
          pushParticle(
            shard.x, shard.y,
            shard.vx + (Math.random() - 0.5) * 4,
            shard.vy + (Math.random() - 0.5) * 4,
            18, "#ffffff", 3 + Math.random() * 3, dataRef.parts.current, state.optPool,
          );
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      const screen = screenRef.current;
      const state = stateRef.current;

      if (screen === "game" && state.camera === "focus") {
        if (e.key === "ArrowUp") { state.focusZoom = Math.min(state.focusZoom + 0.2, 5); setTick(t=>t+1); }
        if (e.key === "ArrowDown") { state.focusZoom = Math.max(state.focusZoom - 0.2, 0.5); setTick(t=>t+1); }
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          const active = dataRef.chars.current.filter(c => !c.dead);
          const idx = active.findIndex(c => c.id === state.focusTargetId);
          const dir = e.key === "ArrowLeft" ? -1 : 1;
          if (active.length > 0) { state.focusTargetId = active[(idx + dir + active.length) % active.length].id; camRef.current.snapNext = true; }
          setTick(t=>t+1);
        }
      }

      if (e.key.toLowerCase() === "a" && screen === "game") {
        spawnP1();
      } else if (e.key.toLowerCase() === "l" && screen === "game") {
        spawnP2();
      } else if (e.key.toLowerCase() === "q" && screen === "game") {
        state.p1Auto = !state.p1Auto;
        setTick((t) => t + 1);
      } else if (e.key.toLowerCase() === "p") {
        if (screen === "game") {
          if (state.classicMenu && state.paused) {
            const cx = ARENA_W / 2;
            const mx = mouseRef.current.x, my = mouseRef.current.y;
            if (mx >= cx - 75 && mx <= cx + 75 && my >= SCOREBOARD_H + ARENA_H / 2 - 10 && my <= SCOREBOARD_H + ARENA_H / 2 + 30) state.paused = false;
            if (mx >= cx - 75 && mx <= cx + 75 && my >= SCOREBOARD_H + ARENA_H / 2 + 40 && my <= SCOREBOARD_H + ARENA_H / 2 + 80) { setShowLiveMenu(true); state.paused = false; }
            if (mx >= cx - 75 && mx <= cx + 75 && my >= SCOREBOARD_H + ARENA_H / 2 + 90 && my <= SCOREBOARD_H + ARENA_H / 2 + 130) { screenRef.current = "menu"; state.running = false; state.paused = false; }
            setTick((t) => t + 1);
          } else {
            state.paused = !state.paused;
            setTick((t) => t + 1);
          }
        }
      } else if (e.key.toLowerCase() === "m" && screen === "game") {
        setShowLiveMenu((v) => !v);
      } else if (e.key === "Escape") {
        if (screen === "game" && state.running) {
          state.paused = !state.paused;
          setTick((t) => t + 1);
        } else if (screen !== "menu" && screen !== "game") {
          screenRef.current = "menu";
          setTick((t) => t + 1);
        }
      } else if (e.key === "Enter" && screen === "over") {
        screenRef.current = "menu";
        dataRef.chars.current = [];
        dataRef.parts.current = [];
        dataRef.ghosts.current = [];
        setTick((t) => t + 1);
      } else if (e.key === "Enter" && screen === "menu") {
        startGame();
        setTick((t) => t + 1);
      }
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
      stateRef.current.draggingId = null;
    };

    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (screenRef.current !== "game" || stateRef.current.paused || !stateRef.current.running) {
        return; // Allow native clicks to pass through to JSX menus
      }
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const tx = (touch.clientX - rect.left) * (canvas.width / rect.width);
      const ty = (touch.clientY - rect.top) * (canvas.height / rect.height);
      if (screenRef.current === "game") {
        if (tx < ARENA_W / 2) spawnP1();
        else spawnP2();
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("wheel", handleWheel, { passive: true });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startGame, spawnP1, spawnP2, dataRef]);

  const allSkins: SkinType[] = ["default", "ballman", "fallguys", "voxel", "mecha", "diamond", "skull", "robot", "pacman", "tea", "food", "ghost"];

  const modeMap: Record<string, string> = { timer: "Timer", score: "Score", horde: "Horde", infection: "Infection", unlimited: "Unlimited" };
  const oppMap: Record<string, string> = { pvp: "PvP", bot: "Bot", ffa: "4-Way FFA" };
  const themeMap: Record<string, string> = { classic: "Classic", runesite: "Runesite", gsix: "GSix", neon: "Neon", gameboy: "GameBoy", runesite_ultimate: "Runesite (Ult)", gilded: "Gilded", lokmod: "LokMod", glitch: "Glitch", rgb_cycle: "RGB Chroma", comic: "Comic Book", neon_abyss: "Neon Abyss", cyberpunk: "Cyberpunk", ethereal: "Ethereal", wasteland: "Wasteland", monochrome: "Monochrome", void: "The Void", celestial: "Celestial", overdrive: "Overdrive", abyss: "Abyss", hacker: "Hacker", synthwave: "Synthwave", vampire: "Vampire", oceanic: "Oceanic", infernal: "Infernal", glassmorphism: "Glass", wireframe_matrix: "Matrix", celestial_forge: "Cel. Forge", blood_moon: "Blood Moon", neon_overdrive: "Neon OD", paper_sketch: "Paper" };
  const modMap: Record<string, string> = { none: "None", sudden_death: "Sudden Death", shrinking_arena: "Shrinking Arena", titans: "Titans", vampire_kiss: "Vampire's Kiss", necromancy: "Necromancy", magnet: "Magnets", repel: "Repel", lok_bounty: "LoK Bounty" };
  const wepMap: Record<string, string> = { standard: "Standard", roulette: "Roulette", melee_mash: "Melee Mash", ranged_test: "Ranged" };
  const envMap: Record<string, string> = { none: "None", ice: "Ice Rink", blackhole: "Black Hole", lava: "Lava Floor", storm: "Storm", bouncy: "Bouncy Walls", wrap: "Wraparound", blackout: "Blackout" };
  const viewMap: Record<string, string> = { standard: "Standard", theater: "Theater", cinematic: "Cinematic" };
  const camMap: Record<string, string> = { static: "Static", dynamic: "Dynamic", action: "Action", enhanced: "Enhanced", focus: "Focus Cam" };
  const juiceMap: Record<string, string> = { off: "Juice: OFF", normal: "Juice: NORM", super: "Juice: SUPR" };
  const fpsOptions = [60, 120, 240];
  const godActionMap: Record<string, string> = { smite: "Smite", heal: "Heal", revive: "Revive", freeze: "Freeze", enrage: "Enrage", mutate: "Mutate", infect: "Infect", ascend: "Ascend" };
  const birthMap: Record<string, string> = { standard: "Standard", tank: "Tank", assassin: "Assassin", ninja: "Ninja", sniper: "Sniper", ghost: "Ghost", zombie: "Zombie", shield: "Shield", giant: "Giant", mage: "Mage", necromancer: "Necromancer", juggernaut: "Juggernaut", null: "Null", bounty: "Bounty", volatile: "Volatile", vanguard: "Vanguard", weaver: "Weaver", gravity: "Gravity", hivemind: "Hivemind", glitch_chrono: "Chrono" };
  const minimapOptions = ["bottom-right", "bottom-left", "top-right", "top-left", "bottom-center", "top-center", "center"];
  const minimapMap: Record<string, string> = { "bottom-right": "Bottom Right", "bottom-left": "Bottom Left", "top-right": "Top Right", "top-left": "Top Left", "bottom-center": "Bottom Center", "top-center": "Top Center", "center": "Center" };

  const tooltips: Record<string, string> = {
    "Mode": "Win condition: Timer, Score, Horde, Infection, etc.",
    "Opponent": "Fight Humans, AI Bots, or Free-For-All.",
    "Theme (Visuals)": "Changes color palette and effects.",
    "Modifier": "Special rules. LoK Bounty drops VIP targets.",
    "Weapons": "Restrict the arena to specific weapon sets.",
    "Environment": "Hazards like Black Holes, Ice, Lava, etc.",
    "View Mode": "Standard shows UI. Theater/Cinematic hides it.",
    "Camera Mode": "Dynamic follows action. Focus locks on one.",
    "Minimap Pos": "Moves the tactical radar map.",
    "Hit Juice": "Visual impact intensity (screenshake, hits).",
    "Target FPS": "Engine tick rate. Higher = smoother physics.",
    "Tactical Map": "Shows the radar tracking all units.",
    "Motion Trails": "Sleek blur behind moving kinetics.",
    "Rainbow Blood": "Impacts spray multicolored particles.",
    "Arena Ads": "Scrolling classic LoK brand advertisements.",
    "CRT Filter": "Arcade scanline overlay.",
    "VHS Filter": "Retro tracking lines and color shifts.",
    "Invert Colors": "Flips the entire visual palette.",
    "Parallax Grid": "Background grid shifts with camera.",
    "Jiggle Grid": "Grid violently shakes during heavy hits.",
    "Hand of God": "Click and drag kinetics with your mouse.",
    "Aggro Magnet": "Kinetics naturally gravitate to each other.",
    "Moon Gravity": "Adds low-G floaty physics.",
    "Slo-Mo Kills": "Matrix-style slowdown on eliminations.",
    "Boom Corpses": "Dead bodies trigger volatile explosions.",
    "Dim. Knockout": "High force hits banish kinetics to the Void.",
    "Slow Corpses": "Dead bodies spawn anomalous freeze zones.",
    "God Action": "The miracle to unleash upon the arena.",
    "Target Team": "Which team receives the miracle.",
    "Spawn Kinetic": "Manually force a specific kinetic type.",
    "Time (s)": "Match duration in seconds.",
    "Score Lim": "Target score to win.",
    "Speed (x)": "Global fighter movement speed multiplier."
  };

  const renderSleekSelect = (label: string, value: string | number, options: (string | number)[], displayMap: Record<string | number, string> | null, setter: (val: any) => void) => {
    const handlePrev = () => { const idx = options.indexOf(value); setter(options[(idx - 1 + options.length) % options.length]); setTick((t) => t + 1); };
    const handleNext = () => { const idx = options.indexOf(value); setter(options[(idx + 1) % options.length]); setTick((t) => t + 1); };
    return (
      <div onMouseEnter={() => setHoverBox({ text: tooltips[label] || label, x: 0, y: 0 })} onMouseLeave={() => setHoverBox(null)} onWheel={(e) => { if (!stateRef.current.lokMenuHoverCycle) return; e.stopPropagation(); e.deltaY > 0 ? handleNext() : handlePrev(); }} style={{ display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(102, 170, 255, 0.2)", borderRadius: "4px", padding: "4px 6px" }}>
        <label style={{ fontSize: "9px", color: "#ffd700", textTransform: "uppercase", marginBottom: "2px" }}>{label}</label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={handlePrev} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: "0 4px", outline: "none" }}>◀</button>
          <select value={value} onChange={(e) => { let v: string | number = e.target.value; if (typeof options[0] === "number") v = Number(v); setter(v); setTick((t) => t + 1); }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#ffd700", fontSize: "11px", fontFamily: "monospace", textAlign: "center", cursor: "pointer", outline: "none", width: "100%", padding: "2px", margin: "2px 0" }}>
            {options.map(opt => <option key={opt} value={opt} style={{ background: "#111", color: "#fff" }}>{displayMap ? displayMap[opt] : opt}</option>)}
          </select>
          <button onClick={handleNext} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: "0 4px", outline: "none" }}>▶</button>
        </div>
      </div>
    );
  };

  const renderSleekInput = (label: string, defaultValue: number, step: number, setter: (val: number) => void) => (
    <div onMouseEnter={() => setHoverBox({ text: tooltips[label] || label, x: 0, y: 0 })} onMouseLeave={() => setHoverBox(null)} style={{ display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(102, 170, 255, 0.2)", borderRadius: "4px", padding: "4px 6px", flex: 1 }}>
      <label style={{ fontSize: "9px", color: "#ffd700", textTransform: "uppercase", marginBottom: "2px" }}>{label}</label>
      <input type="number" step={step} defaultValue={defaultValue} onChange={(e) => { setter(parseFloat(e.target.value) || 0); setTick((t) => t + 1); }} style={{ background: "transparent", border: "none", color: "#66aaff", fontSize: "11px", fontFamily: "monospace", width: "100%", textAlign: "center", outline: "none" }} />
    </div>
  );

  const renderSleekToggle = (label: string, color: string, value: boolean, setter: (val: boolean) => void) => (
    <div onMouseEnter={() => setHoverBox({ text: tooltips[label] || label, x: 0, y: 0 })} onMouseLeave={() => setHoverBox(null)} onClick={() => { setter(!value); setTick((t) => t + 1); }} style={{ cursor: "pointer", color: value ? color : "#666", fontSize: "10px", display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.4)", border: `1px solid ${value ? color : 'rgba(255,255,255,0.1)'}`, borderRadius: "4px", padding: "4px 6px", userSelect: "none" }}>
      <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: value ? color : "transparent", border: `1px solid ${value ? color : '#666'}`, flexShrink: 0 }} />
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
    </div>
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: (stateRef.current.lokMenuPosition || "left") === "left" ? "row" : "row-reverse",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Main Menu Passport Overlay */}
      {screenRef.current === "menu" && (
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 100 }}>
          {passport.connected ? (
            <div style={{ padding: "8px 12px", background: "rgba(255, 215, 0, 0.15)", border: "1px solid #ffd700", borderRadius: "4px", color: "#ffd700", fontSize: "12px", fontFamily: "monospace", fontWeight: "bold", backdropFilter: "blur(4px)" }}>
              🏅 {passport.username} · {lokCoinsRef.current} LoK Coins
            </div>
          ) : (
            <button onClick={connectLokPassport} style={{ background: "rgba(68, 34, 0, 0.8)", color: "#ffd700", border: "1px solid #ffd700", padding: "8px 16px", fontSize: "12px", fontFamily: "monospace", fontWeight: "bold", cursor: "pointer", borderRadius: "4px", backdropFilter: "blur(4px)" }}>
              Connect LoK Passport
            </button>
          )}
        </div>
      )}

      {/* Live Mods Menu as a Sidebar */}
      {showLiveMenu && (
        <div
          style={{
            width: "310px",
            minWidth: "310px",
            flexShrink: 0,
            backgroundColor: "rgba(10, 5, 15, 0.95)",
            borderLeft: stateRef.current.lokMenuPosition === "right" ? "2px solid #ffd700" : "none",
            borderRight: (stateRef.current.lokMenuPosition || "left") === "left" ? "2px solid #ffd700" : "none",
            boxShadow: `inset ${(stateRef.current.lokMenuPosition || "left") === "left" ? '-10px' : '10px'} 0 20px rgba(255,215,0,0.05)`,
            padding: "20px 16px",
            color: "#fff",
            fontFamily: "'Courier New', Courier, monospace",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            boxSizing: "border-box",
            paddingBottom: "80px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/* Sidebar Menu Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 215, 0, 0.3)', paddingBottom: '10px' }}>
            <h3 style={{ margin: 0, color: '#ffd700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', textShadow: '0 0 5px rgba(255, 215, 0, 0.5)', lineHeight: 1.2, textTransform: "uppercase" }}>
              <span style={{ color: '#ff8800', fontSize: '18px' }}>⚡</span> LoK Modifiers <span style={{ color: '#ff8800', fontSize: '18px' }}>⚡</span>
            </h3>
            <button onClick={() => setShowLiveMenu(false)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>✕</button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,215,0,0.05)", padding: "6px", borderRadius: "4px", border: "1px solid rgba(255,215,0,0.2)" }}>
            <button onClick={() => { stateRef.current.lokMenuPosition = stateRef.current.lokMenuPosition === "left" ? "right" : "left"; setTick((t) => t + 1); }} style={{ fontSize: "10px", background: "rgba(255,215,0,0.1)", border: "1px solid #ffd700", color: "#ffd700", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
              DOCK: {(stateRef.current.lokMenuPosition || "left").toUpperCase()}
            </button>
            <label style={{ fontSize: "10px", color: "#ccc", display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={stateRef.current.lokMenuHoverCycle ?? true} onChange={e => { stateRef.current.lokMenuHoverCycle = e.target.checked; setTick(t=>t+1); }} style={{ marginRight: "6px" }} />
              Scroll-to-Cycle
            </label>
          </div>

        {/* Hover Info Box */}
        <div style={{ padding: "8px", background: "rgba(255,215,0,0.1)", border: `1px solid ${stateRef.current.theme === "blood_moon" ? "#ff0000" : "#ffd700"}`, borderRadius: "4px", fontSize: "10px", color: "#fff", minHeight: "44px", display: "flex", alignItems: "center" }}>
          <span style={{ color: stateRef.current.theme === "blood_moon" ? "#ff0000" : "#ffd700", fontWeight: "bold", marginRight: "6px" }}>ℹ️ INFO:</span> {hoverBox?.text || "Hover over an option to see what it does."}
        </div>

          {/* Sidebar Menu Inputs */}
          <div style={{ display: "flex", gap: "6px" }}>
            {renderSleekInput("Time (s)", refs.tLimit.current, 1, (v) => { refs.tLimit.current = v; stateRef.current.timeLeft = v; })}
            {renderSleekInput("Score Lim", refs.sLimit.current, 1, (v) => { refs.sLimit.current = v; stateRef.current.scoreLimit = v; })}
            {renderSleekInput("Speed (x)", refs.fSpeed.current, 0.1, (v) => { refs.fSpeed.current = v; stateRef.current.fighterSpeed = v; })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {renderSleekSelect("Mode", stateRef.current.mode, Object.keys(modeMap), modeMap, (v) => stateRef.current.mode = v)}
            {renderSleekSelect("Opponent", stateRef.current.opponent, Object.keys(oppMap), oppMap, (v) => stateRef.current.opponent = v)}
            {renderSleekSelect("Theme (Visuals)", stateRef.current.theme, Object.keys(themeMap), themeMap, (v) => stateRef.current.theme = v)}
            {renderSleekSelect("Modifier", stateRef.current.modifier, Object.keys(modMap), modMap, (v) => stateRef.current.modifier = v)}
            {renderSleekSelect("Weapons", stateRef.current.weaponStyle, Object.keys(wepMap), wepMap, (v) => stateRef.current.weaponStyle = v)}
            {renderSleekSelect("Environment", stateRef.current.environment, Object.keys(envMap), envMap, (v) => stateRef.current.environment = v)}
            {renderSleekSelect("View Mode", stateRef.current.viewMode, Object.keys(viewMap), viewMap, (v) => stateRef.current.viewMode = v)}
            {renderSleekSelect("Camera Mode", stateRef.current.camera, Object.keys(camMap), camMap, (v) => stateRef.current.camera = v)}
          {renderSleekSelect("Minimap Pos", stateRef.current.minimapPosition, minimapOptions, minimapMap, (v) => stateRef.current.minimapPosition = v)}
            {renderSleekSelect("Hit Juice", stateRef.current.juice, Object.keys(juiceMap), juiceMap, (v) => stateRef.current.juice = v)}
            {renderSleekSelect("Target FPS", stateRef.current.fpsTarget, fpsOptions, {60:"60 FPS", 120:"120 FPS", 240:"240 FPS"}, (v) => stateRef.current.fpsTarget = v)}
          </div>

          <h4 style={{ margin: "4px 0 0 0", color: "#ffaa00", fontSize: "12px", borderBottom: "1px solid #ffaa00", paddingBottom: "2px" }}>⚙️ VISUALS & OPTS</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
          {renderSleekToggle("Tactical Map", "#66aaff", stateRef.current.hud, (v) => stateRef.current.hud = v)}
            {renderSleekToggle("Motion Trails", "#66aaff", stateRef.current.trails, (v) => stateRef.current.trails = v)}
            {renderSleekToggle("Rainbow Blood", "#66aaff", stateRef.current.rainbowBlood, (v) => stateRef.current.rainbowBlood = v)}
            {renderSleekToggle("Arena Ads", "#66aaff", stateRef.current.ads, (v) => stateRef.current.ads = v)}
            {renderSleekToggle("CRT Filter", "#66aaff", stateRef.current.crtFilter, (v) => stateRef.current.crtFilter = v)}
            {renderSleekToggle("VHS Filter", "#66aaff", stateRef.current.vhsFilter, (v) => stateRef.current.vhsFilter = v)}
            {renderSleekToggle("Invert Colors", "#66aaff", stateRef.current.invertFilter, (v) => stateRef.current.invertFilter = v)}
            {renderSleekToggle("Parallax Grid", "#ffaaee", stateRef.current.parallaxGrid, (v) => stateRef.current.parallaxGrid = v)}
            {renderSleekToggle("Jiggle Grid", "#ffaaee", stateRef.current.reactiveGrid, (v) => stateRef.current.reactiveGrid = v)}
            {renderSleekToggle("Hand of God", "#55ff55", stateRef.current.handOfGod, (v) => stateRef.current.handOfGod = v)}
            {renderSleekToggle("Aggro Magnet", "#55ff55", stateRef.current.aiMagnetic, (v) => stateRef.current.aiMagnetic = v)}
            {renderSleekToggle("Moon Gravity", "#55ff55", stateRef.current.moonGravity, (v) => stateRef.current.moonGravity = v)}
            {renderSleekToggle("Slo-Mo Kills", "#55ff55", stateRef.current.sloMoKills, (v) => stateRef.current.sloMoKills = v)}
            {renderSleekToggle("Boom Corpses", "#55ff55", stateRef.current.explodingCorpses, (v) => stateRef.current.explodingCorpses = v)}
            {renderSleekToggle("Sprite Cache", "#55ff55", stateRef.current.optCache, (v) => stateRef.current.optCache = v)}
            {renderSleekToggle("Swarm Grid", "#55ff55", stateRef.current.optGrid, (v) => stateRef.current.optGrid = v)}
            {renderSleekToggle("Memory Pool", "#55ff55", stateRef.current.optPool, (v) => stateRef.current.optPool = v)}
            {renderSleekToggle("Delta Physics", "#55ff55", stateRef.current.optDelta, (v) => stateRef.current.optDelta = v)}
            {renderSleekToggle("Gravity FX", "#55ff55", stateRef.current.optGravity, (v) => stateRef.current.optGravity = v)}
            {renderSleekToggle("DEV Hitboxes", "#ff0000", stateRef.current.devMode, (v) => stateRef.current.devMode = v)}
            {renderSleekToggle("Dim. Knockout", "#ff00ff", stateRef.current.dimKnockout, (v) => stateRef.current.dimKnockout = v)}
          </div>

          <h4 style={{ margin: "4px 0 0 0", color: "#ff44aa", fontSize: "12px", borderBottom: "1px solid #ff44aa", paddingBottom: "2px" }}>⚡ MIRACLES & SPAWNER</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {renderSleekSelect("God Action", godAction, Object.keys(godActionMap), godActionMap, setGodAction)}
            {renderSleekSelect("Target Team", godTarget, [0, 1, 2, 3, 4, 5], {0:"All Teams",1:"Team 1",2:"Team 2",3:"Team 3",4:"Team 4",5:"Team 5(Z)"}, setGodTarget)}
          </div>
          
          <button onClick={() => {
            dataRef.chars.current.forEach((c) => {
              if (!c.dead && (godTarget === 0 || c.team === godTarget)) {
                if (godAction === "smite") c.hp = 0;
                else if (godAction === "heal") c.hp = c.maxHp;
                else if (godAction === "freeze") { c.vx = 0; c.vy = 0; c.stunTime = 3000; }
                else if (godAction === "enrage") { c.vx *= 3; c.vy *= 3; }
                else if (godAction === "ascend") { c.scale *= 1.3; c.hp = c.maxHp; c.isBoss = true; }
                else if (godAction === "mutate") { c.weapon = getRandomWeapon(); }
                else if (godAction === "infect") { c.kineticType = "zombie"; c.team = 5; }
                else if (godAction === "revive" && c.dead) { c.dead = false; c.hp = c.maxHp; }
              }
            });
            setTick((t) => t + 1);
          }} style={{ background: "#cc3300", color: "#fff", border: "1px solid #ff4444", padding: "8px", fontSize: "11px", cursor: "pointer", borderRadius: 4, fontWeight: "bold", width: "100%", boxShadow: "0 0 10px rgba(204,51,0,0.5)" }}>⚡ EXECUTE MIRACLE</button>

          {renderSleekSelect("Spawn Kinetic", birthType, Object.keys(birthMap), birthMap, setBirthType)}

          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={spawnP1} style={{ background: "rgba(255,80,80,0.2)", color: "#ff8888", border: "1px solid #ff4444", padding: "6px", fontSize: "11px", cursor: "pointer", borderRadius: 4, fontWeight: "bold", flex: 1 }}>+P1 SPAWN</button>
            <button onClick={spawnP2} style={{ background: "rgba(80,100,255,0.2)", color: "#88aaff", border: "1px solid #4466ff", padding: "6px", fontSize: "11px", cursor: "pointer", borderRadius: 4, fontWeight: "bold", flex: 1 }}>+P2 SPAWN</button>
          </div>
          
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => { stateRef.current.paused = !stateRef.current.paused; setTick((t) => t + 1); }} style={{ background: "#224488", color: "#fff", border: "1px solid #4466ff", padding: "6px", fontSize: "11px", cursor: "pointer", borderRadius: 4, fontWeight: "bold", flex: 1 }}>⏸ PAUSE</button>
            <button onClick={() => { dataRef.parts.current = []; setTick((t) => t + 1); }} style={{ background: "#333", color: "#aaa", border: "1px solid #666", padding: "6px", fontSize: "11px", cursor: "pointer", borderRadius: 4, fontWeight: "bold", flex: 1 }}>CLEAN FX</button>
          </div>
        </div>
      )}

      {/* Main Game Container */}
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <canvas
        ref={canvasRef}
        width={ARENA_W}
        height={ARENA_H + SCOREBOARD_H}
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          imageRendering: "pixelated",
          cursor: stateRef.current.handOfGod ? "crosshair" : "default",
          touchAction: "none",
        }}
      />

      {/* Skin Picker Row */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 50,
          width: "100%",
          maxWidth: ARENA_W,
        }}
      >
        <button
          onClick={() => setShowSkins(!showSkins)}
          style={{
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            borderBottom: "none",
            padding: "4px 16px",
            fontSize: 10,
            fontFamily: "monospace",
            cursor: "pointer",
            borderRadius: "6px 6px 0 0",
          }}
        >
          {showSkins ? "▼ HIDE SKINS" : "▲ SHOW SKINS"}
        </button>
        {showSkins && (
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "rgba(0,0,0,0.95)",
              padding: "8px",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "100%",
              borderTop: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span style={{ color: "#ff6655", fontSize: 10, fontFamily: "monospace", marginRight: 4 }}>P1 SKIN:</span>
            {allSkins.map((s) => (
            <button
              key={`p1-${s}`}
              onClick={() => setP1Skin(s)}
              style={{
                background: p1Skin === s ? "#ff6655" : "rgba(60,60,80,0.8)",
                color: p1Skin === s ? "#000" : "#fff",
                border: "1px solid " + (p1Skin === s ? "#fff" : "rgba(255,255,255,0.2)"),
                padding: "2px 6px",
                fontSize: 9,
                fontFamily: "monospace",
                cursor: "pointer",
                borderRadius: 3,
              }}
            >
              {s}
            </button>
          ))}
          <span style={{ color: "#5599ff", fontSize: 10, fontFamily: "monospace", margin: "0 4px" }}>P2 SKIN:</span>
          {allSkins.map((s) => (
            <button
              key={`p2-${s}`}
              onClick={() => setP2Skin(s)}
              style={{
                background: p2Skin === s ? "#5599ff" : "rgba(60,60,80,0.8)",
                color: p2Skin === s ? "#000" : "#fff",
                border: "1px solid " + (p2Skin === s ? "#fff" : "rgba(255,255,255,0.2)"),
                padding: "2px 6px",
                fontSize: 9,
                fontFamily: "monospace",
                cursor: "pointer",
                borderRadius: 3,
              }}
            >
              {s}
            </button>
          ))}
          </div>
        )}
      </div>

      {/* Mobile Controls Toggle */}
      <div style={{ position: "absolute", top: 4, right: 4 }}>
        <label style={{ color: "#fff", fontSize: 10, fontFamily: "monospace", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showMobileUI}
            onChange={(e) => setShowMobileUI(e.target.checked)}
            style={{ marginRight: 4 }}
          />
          Mobile Controls
        </label>
      </div>

      {showMobileUI && (
        <div style={{ position: "absolute", bottom: 44, display: "flex", gap: 12 }}>
          <button
            onPointerDown={(e) => { e.preventDefault(); spawnP1(); }}
            style={{
              background: "rgba(255,80,80,0.7)",
              color: "#fff",
              border: "2px solid #ff4444",
              padding: "14px 28px",
              fontSize: 14,
              fontFamily: "monospace",
              borderRadius: 8,
              cursor: "pointer",
              userSelect: "none",
              touchAction: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            P1 SPAWN
          </button>
          <button
            onPointerDown={(e) => { e.preventDefault(); spawnP2(); }}
            style={{
              background: "rgba(80,100,255,0.7)",
              color: "#fff",
              border: "2px solid #4466ff",
              padding: "14px 28px",
              fontSize: 14,
              fontFamily: "monospace",
              borderRadius: 8,
              cursor: "pointer",
              userSelect: "none",
              touchAction: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            P2 SPAWN
          </button>
        </div>
      )}
    </div>
  </div>
  );
}

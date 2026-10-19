export type HpBarStyle = "standard" | "thick" | "segmented" | "hidden";
export type FloatingTextStyle = "standard" | "comic" | "neon" | "hidden";
export type TitleStyle = "standard" | "advanced" | "neon" | "retro" | "glitch" | "minimal" | "pixel";
export type ParticleStyle = "original" | "new" | "sparkle" | "snow" | "none";
export type PhysicsMode = "standard" | "phantoms" | "classic_weapons" | "super_bouncy" | "lead_weights" | "bounce_only" | "attack_on_contact";
export type KineticModelStyle = "block" | "classic" | "hd" | "sabre";

export type GameMode = "timer" | "score" | "horde" | "infection" | "unlimited" | "boss_rush";
export type OpponentMode = "pvp" | "bot" | "ffa" | "host" | "join" | "1v1" | "2v2" | "3v1" | "4v1";
export type ThemeMode =
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
  | "paper_sketch"
  | "cyberpunk"
  | "ethereal"
  | "wasteland"
  | "void"
  | "outrun"
  | "frostbite"
  | "solaris"
  |  "deepsea"
  | "liminal"
  | "nebula"
  | "matrix_reloaded"
  | "stellar_drift"
  | "neon_pulse"
  | "obsidian_shard"
  | "retro_wave"
  | "pixel_dream";

export type LokModifier =
  | "none"
  | "sudden_death"
  | "titans"
  | "shrinking_arena"
  | "vampire_kiss"
  | "necromancy"
  | "magnet"
  | "repel"
  | "lok_bounty"
  | "gravity_well"
  | "time_distortion"
  | "chaos_vortex";

export type CameraMode = "static" | "dynamic" | "action" | "enhanced" | "focus";
export type ViewMode = "standard" | "theater" | "cinematic";
export type MinimapPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "bottom-center"
  | "top-center"
  | "center";
export type WeaponStyle = "standard" | "roulette" | "melee_mash" | "ranged_test" | "none";
export type Environment =
   | "none"
   | "ice"
   | "blackhole"
   | "lava"
   | "storm"
   | "bouncy"
   | "wrap"
   | "blackout"
   | "slipstream"
   | "mobius_rifts"
   | "amplitude_floor"
   | "solar_flares"
   | "magnetic_fields"
   | "void_storm"
   | "rift_portals"
   | "acid_rain"
   | "sandstorm"
   | "dense_fog";
export type ScreenState = "menu" | "lok_menu" | "settings_menu" | "game" | "over" | "bestiary";
export type WeaponType =
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
export type JuiceLevel = "off" | "normal" | "super";
export type KineticType =
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
  | "glitch_chrono"
  | "vampire_lord"
  | "bat"
  | "angel"
  | "cherub"
  | "drone"
  | "wasp"
  | "fragment"
  | "spore"
  | "shifter"
  | "titan_slayer"
  | "chrono_warden"
  | "void_walker";

export type SkinType =
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

export type LokPassportData = {
  connected: boolean;
  username: string;
  lokCoins: number;
  equippedBackground: string | null;
  inventory: string[];
};

export interface GameState {
   mode: GameMode;
   opponent: OpponentMode;
   theme: ThemeMode;
   modifier: LokModifier;
   camera: CameraMode;
   viewMode: ViewMode;
   minimapPosition: MinimapPosition;
   weaponStyle: WeaponStyle;
   kineticStyle: KineticModelStyle;
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
   stats: { maxChars: number; totalDmg: number; highestV?: number };
   juice: JuiceLevel;
   hud: boolean;
   trails: boolean;
   motionBlur: boolean;
   ads: boolean;
   crtFilter: boolean;
   vhsFilter: boolean;
   invertFilter: boolean;
   aiMagnetic: boolean;
   aiDash: boolean;
   handOfGod: boolean;
   trickShots: boolean;
   fruitNinjaFx: boolean;
   optCache: boolean;
   optDelta: boolean;
   optGravity: boolean;
   optSmartSpawn: boolean;
   optGrid: boolean;
   optPool: boolean;
   optGridDebug: boolean;
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
    menuTitleCircles: boolean;
   moonGravity: boolean;
   antiGravity: boolean;
   explodingCorpses: boolean;
   sloMoKills: boolean;
   rainbowBlood: boolean;
   parallaxGrid: boolean;
   reactiveGrid: boolean;
   classicMenu: boolean;
   lokBackgroundEnabled: boolean;
   stormAngle: number;
    menuSimulator: boolean;
    menuSimMode: "peaceful" | "aggressive" | "fill" | "overload" | "theme_cycler";
    minimapTextPulse: boolean;
   bountyEndsGame: boolean;
   lokMenuPosition: "left" | "right";
   lokMenuHoverCycle: boolean;
   dimKnockout: boolean;
   focusTargetId: number | null;
   focusZoom: number;
    showMinimap: boolean;
    bestiarySprites: boolean;
    bestiaryBossFx: boolean;
   menuAdvancedTitle: boolean;
   arenaTitle: boolean;
   minimapLogo: boolean;
   passportBorder: boolean;
   screensaverMode: boolean;
    hpBarStyle: HpBarStyle;
    floatingTextStyle: FloatingTextStyle;
    titleStyle: TitleStyle;
    particleStyle: ParticleStyle;
    themeNotifyEnabled: boolean;
    physicsMode: PhysicsMode;
   chaosMode: boolean;
   chaosTimer: number;
   aiAggressive: boolean;
   showVersionText: boolean;
   // NEW MENU OPTIONS (5)
   pixelPerfect: boolean;
   timeDilation: boolean;
   gravityInversion: boolean;
   chaosTheory: boolean;
   neonAfterimage: boolean;
   // NEW CUSTOMIZATIONS (5)
   weaponTrails: boolean;
   dynamicArena: boolean;
   soulEchoes: boolean;
   criticalFlash: boolean;
   audioVisualizer: boolean;
   // XXL MODE (Environment Scaling)
   xxlMode: boolean;
   xxlScale: string;
    // NEW FEATURE FIELDS
    essenceSpawnTimer: number;
    bossWave: number;
    bossKills: number;
    riftPortalCooldown: number;
    dragStartX?: number;
    dragStartY?: number;
    marionetteId?: number | null;
    barriers?: { x1: number; y1: number; x2: number; y2: number; life: number }[];
    // SPAWNING OPTIONS
    optClickToSpawn: boolean;
    optStandardGravity?: boolean;
    // XXL OPTIONS
    xxlPopcap?: boolean;
    // NPC MODES
    takeoverTimer: number;
    takeoverLimit: number;
  }

export interface Part {
  ox: number;
  oy: number;
  r: number;
  type: "head" | "body" | "arm" | "leg";
}
export interface TrailFrame {
  x: number;
  y: number;
  angle: number;
}
export interface Character {
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
  masterId?: number;
  originalWeapon: WeaponType;
  sabreTimer: number;
  tossedTimer: number; // For trick shot bonuses
  isLocked?: boolean;
  lockedX?: number;
  lockedY?: number;
  lockTimer?: number;
}
export interface Sabre {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularV: number;
  life: number;
  maxLife: number;
  active: boolean;
  scale: number;
  weapon: WeaponType;
  isBrkn: boolean;
  element: string;
  ownerId: number;
}
export interface Particle {
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
export interface Projectile {
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
export interface Ghost {
  x: number;
  y: number;
  team: number;
  vy: number;
  life: number;
  maxLife: number;
  scored: boolean;
  active: boolean;
}
export interface FloatingText {
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
export interface KillFeedMsg {
  text: string;
  life: number;
  color: string;
  active: boolean;
}
export interface Drop {
  type: "bomb" | "blackhole" | "medkit" | "freeze" | "nuke";
  x: number;
  y: number;
  timer: number;
  maxTimer: number;
  active: boolean;
  radius: number;
}
export interface Essence {
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

export interface Portal {
   x: number;
   y: number;
   active: boolean;
   life: number; // how long until it disappears (or permanent if -1)
   targetX: number; // where this portal leads to
   targetY: number;
   color: string;
   size: number;
}

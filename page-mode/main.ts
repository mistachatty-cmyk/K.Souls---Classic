import { spawnCharacter as spawnClassic, renderChar as renderClassic, drawHpBar as hpClassic, drawThemeBackground as backgroundClassic, getPartDamage as classicPartDamage, getWeaponTip as classicWeaponTip, getTeamColor as classicTeamColor, BESTIARY_ENTRIES as classicBestiary } from "../classic/src/pages/KineticSouls";
import { spawnCharacter as spawnKs2, getPartDamage as ks2PartDamage } from "../ks2/src/systems/Spawner";
import { renderChar as renderKs2, drawHpBar as hpKs2, getTeamColor as ks2TeamColor } from "../ks2/src/render/DrawEntities";
import { drawThemeBackground as backgroundKs2, BESTIARY_ENTRIES as ks2Bestiary } from "../ks2/src/render/DrawUI";
import { getWeaponTip as ks2WeaponTip } from "../ks2/src/game/utils";
import { updateBehaviors } from "../ks2/src/systems/Behaviors";
import type { Character as Ks2Character, Drop, GameState, Particle } from "../ks2/src/game/types";
import { mapPageTeamScores, playerOneSide } from "./team-sides.mjs";
import { classifyPageMaterial, materialDamage, materialDurability, materialStageLabel, type PageMaterial } from "./materials.mjs";
import { fighterTargetRecoil, impactImpulse, normalizeImpactDirection, resolveTargetContact } from "./impact-physics.mjs";
import { pageEffects } from "./effects.mjs";
import { createFracturePattern } from "./fracture.mjs";
import { createGlassShardPolygons } from "./glass-shards.mjs";
import { createPaperTearPolygons } from "./paper-shards.mjs";
import { createStoneChipPolygons } from "./stone-chips.mjs";
import { createDigitalTearBlocks } from "./digital-tear.mjs";
import { applyImpact, createSegmentField, isSegmentSolid, resolveSegmentContact, segmentOpeningRects, type SegmentField } from "./segment-field.mjs";
import { sortTargetsFrontFirst, underlyingTargetForPoint, descendantLayersByElement, visibleOpeningRects } from "./layers.mjs";
import { captureDestructionState, snapshotOpeningRects, type DestructionState } from "./destruction-replay.mjs";
import { containedMediaPlacement, mediaMaskAlpha } from "./owned-media-fragments.mjs";
import { captureVideoTimes, pauseVideos, resumeVideos, seekVideos, type VideoTime } from "./video-timeline.mjs";
import { captureSceneField, restoreSceneField, savedVideoTime } from "./scene-state.mjs";
import { creatorFloorTop, creatorStageBottom } from "./creator-stage.mjs";
import { advanceHeldSpawns, HOLD_REPEAT_MS, startHeldSpawn, type HeldSpawn } from "./hold-repeat.mjs";

type Variant = "classic" | "ks2";
type Side = 1 | 2;
type Fighter = ReturnType<typeof spawnClassic> | ReturnType<typeof spawnKs2>;
type Target = { id: number; element: Element; x: number; y: number; width: number; height: number; damage: number; destroyed: boolean; impactX: number; impactY: number; impactDX: number; impactDY: number; lastHitAt: number; boss: boolean; stage: number; material: PageMaterial; fractures: FractureMark[]; field?: SegmentField; dynamic?: boolean; vx?: number; vy?: number; homeX?: number; homeY?: number; stageFloorY?: number; homeStageFloorY?: number };
type Projectile = { x: number; y: number; previousX: number; previousY: number; vx: number; vy: number; team: number; life: number; type: "laser" | "fireball"; color: string };
type FloatingText = { x: number; y: number; value: string; color: string; life: number };
type FractureMark = { segments: ReturnType<typeof createFracturePattern>; color: string; strength: number; createdAt: number };
type ArenaShard = { x: number; y: number; vx: number; vy: number; width: number; height: number; angle: number; spin: number; color: string; life: number; maxLife: number; material?: PageMaterial; points?: Array<{ x: number; y: number }> };
type ArenaChunk = { x: number; y: number; vx: number; vy: number; width: number; height: number; mass: number; angle: number; spin: number; material: PageMaterial; color: string; sourceTargetId: number; mediaX?: number; mediaY?: number; ownerTeam: number; hitFighters: Set<number>; secondaryBudget: number; life: number };
type Shockwave = { x: number; y: number; radius: number; maxRadius: number; life: number; maxLife: number; color: string; width: number };
type Options = { variant?: Variant };
type Settings = { npcSide: Side; motion: "battle" | "dvd"; modifier: string; environment: string; theme: string; weapon: string; speed: number; spawnMs: number; matchDurationMs: number; displayHp: boolean; fighter: string; npcEnabled: boolean; effectMode: "full" | "low"; destructionTempo: "adaptive" | "deep" };

const settings: Settings = { npcSide: 2, motion: "battle", modifier: "none", environment: "bouncy", theme: "synthwave", weapon: "roulette", speed: 1, spawnMs: 2200, matchDurationMs: 120_000, displayHp: true, fighter: "standard", npcEnabled: true, effectMode: "full", destructionTempo: "adaptive" };
const classicThemes = ["classic", "neon", "gameboy", "abyss", "runesite", "gsix", "gilded", "synthwave", "vampire", "oceanic", "infernal", "glitch", "monochrome", "celestial", "overdrive", "comic", "hacker", "rgb_cycle", "neon_abyss", "glassmorphism", "wireframe_matrix", "celestial_forge", "blood_moon", "neon_overdrive", "paper_sketch"];
const ks2Themes = ["classic", "runesite", "gsix", "neon", "gameboy", "runesite_ultimate", "gilded", "lokmod", "glitch", "rgb_cycle", "comic", "neon_abyss", "cyberpunk", "ethereal", "wasteland", "monochrome", "void", "celestial", "overdrive", "abyss", "hacker", "synthwave", "vampire", "oceanic", "infernal", "glassmorphism", "wireframe_matrix", "celestial_forge", "blood_moon", "neon_overdrive", "paper_sketch", "outrun", "frostbite", "solaris", "deepsea", "liminal", "nebula"];
const classicNativeModifiers = ["none", "sudden_death", "titans", "shrinking_arena", "vampire_kiss", "necromancy", "magnet", "repel", "lok_bounty"];
const ks2NativeModifiers = ["none", "sudden_death", "titans", "shrinking_arena", "vampire_kiss", "necromancy", "magnet", "repel", "lok_bounty"];
const pageOnlyModifiers = ["gravity_well", "time_distortion", "chaos_vortex"];
const classicModifiers = [...classicNativeModifiers, ...pageOnlyModifiers];
const ks2Modifiers = [...ks2NativeModifiers, ...pageOnlyModifiers];
const pageOnlyModifierSet = new Set(pageOnlyModifiers);
const ks2PageEnvironmentSet = new Set(["solar_flares", "magnetic_fields", "void_storm"]);
const classicEnvironments = ["none", "ice", "blackhole", "lava", "storm", "bouncy", "wrap", "blackout"];
const ks2Environments = [...classicEnvironments, "solar_flares", "magnetic_fields", "void_storm"];
const weapons = ["standard", "roulette", "melee_mash", "ranged_test"];
const matchDurations = ["60000", "120000", "180000", "300000"];
const pageSides = ["1", "2"];
let game: PageBattle | null = null;
const createRunId = () => {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16); crypto.getRandomValues(bytes); bytes[6] = (bytes[6] & 0x0f) | 0x40; bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(value => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
const safePage = () => !/\b(login|sign-in|signin|checkout|payment|billing|account\/security)\b/i.test(location.pathname)
  && !document.querySelector('input[type="password"],input[autocomplete="cc-number"],input[name*="card" i]');

class PageBattle {
  variant: Variant;
  host: HTMLDivElement;
  root: ShadowRoot;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  panel: HTMLElement;
  hud: HTMLElement;
  fighters: Fighter[] = [];
  projectiles: Projectile[] = [];
  particles: Particle[] = [];
  bombs: Drop[] = [];
  floatingTexts: FloatingText[] = [];
  shards: ArenaShard[] = [];
  chunks: ArenaChunk[] = [];
  shockwaves: Shockwave[] = [];
  targets = new Map<Element, Target>();
  nextTargetId = 1;
  damage: { targetId: number; x: number; y: number; width: number; height: number }[] = [];
  screenShake = 0;
  running = true;
  paused = false;
  score = 0;
  kills = 0;
  chainBreaks = 0;
  breakCombo = 0;
  comboUntil = 0;
  bossTarget: Target | null = null;
  bossPulseAt = 0;
  teamKOs: Record<Side, number> = { 1: 0, 2: 0 };
  matchNpcSide: Side = settings.npcSide;
  matchDurationMs = settings.matchDurationMs;
  matchDestructionTempo = settings.destructionTempo;
  remainingMs = this.matchDurationMs;
  matchFinished = false;
  completedRun = false;
  rightControlUntil = 0;
  minimized = false;
  snapshots: Array<{ at: number; fighters: Array<{ id: number; x: number; y: number; angle: number }>; score: number; kos: Record<Side, number>; videos: VideoTime[]; destruction: DestructionState }> = [];
  snapshotAt = 0;
  replayIndex: number | null = null;
  activeVideo: HTMLVideoElement | null = null;
  hudAt = 0;
  runId = createRunId();
  frame = 0;
  previous = performance.now();
  npcAt = 0;
  bountyAt = performance.now() + 8000;
  heldSides = new Map<number, HeldSpawn>();
  heldKeys = new Map<string, HeldSpawn>();
  scanAt = 0;
  observer: MutationObserver;

  constructor(variant: Variant) {
    this.variant = variant;
    this.host = document.createElement("div");
    this.host.id = "lok-kinetic-official-page";
    this.host.dataset.variant = variant;
    this.host.style.cssText = "position:fixed;inset:0;z-index:2147483645;pointer-events:none";
    this.root = this.host.attachShadow({ mode: "open" });
    this.root.innerHTML = `<style>
      :host{all:initial}*,*:before,*:after{box-sizing:border-box}.arena{position:fixed;inset:0;pointer-events:none;image-rendering:pixelated}.ui{font:600 13px system-ui,sans-serif;color:white;text-shadow:0 1px 3px black;pointer-events:auto}.top{position:fixed;left:12px;top:12px;right:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.badge,.controls,.panel{background:#101722ec;border:1px solid #80dcff99;box-shadow:0 8px 30px #0009;border-radius:12px}.badge{padding:10px 13px;max-width:48vw}.badge strong{color:#a8ebff}.controls{display:flex;gap:4px;flex-wrap:wrap;padding:6px}button,select,input{font:inherit}button{border:1px solid #ffffff66;border-radius:8px;background:#2b4058;color:#fff;padding:8px 10px;cursor:pointer}button:hover,button:focus-visible{background:#416b89;outline:2px solid #9eeaff}button[data-active="true"]{background:#357663}.bottom{position:fixed;bottom:12px;left:12px;right:12px;display:flex;justify-content:space-between;gap:10px}.spawn{font-size:16px;font-weight:800;min-height:52px;min-width:132px;touch-action:none;user-select:none}.spawn[data-spraying="true"]{filter:brightness(1.35);box-shadow:0 0 20px #8de6ff99}.spawn[data-side="1"]{background:#694050}.spawn[data-side="2"]{background:#375b79}.panel{position:fixed;right:12px;top:65px;width:min(430px,calc(100vw - 24px));max-height:min(75vh,720px);overflow:auto;padding:18px;display:none}.panel[data-open="true"]{display:block}.panel h2{margin:0 0 10px;font-size:22px}.panel section{margin:12px 0}.panel label{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:8px 0}.panel select,.panel input{max-width:55%;background:#172638;color:#fff;border:1px solid #668ca4;border-radius:6px;padding:6px}.panel .entry{border-bottom:1px solid #ffffff30;padding:8px 0}.panel .entry strong{display:block}.panel .entry small{color:#b9d7e4}.panel a{color:#8de6ff}.notice{color:#bcd3df;font-size:12px;line-height:1.4}.panel[data-minimized="true"]{height:58px;min-height:58px;overflow:hidden}.panel[data-minimized="true"]>:not([data-creator-head]){display:none}[data-creator-head]{display:flex;align-items:center;justify-content:space-between;gap:12px}[data-creator-head] h2{font-size:18px!important}.panel [data-timeline]{max-width:65%}.panel [data-upload]{max-width:62%}@media(max-width:640px){.top{flex-direction:column}.badge{max-width:100%;font-size:11px}.controls{max-width:100%}.controls button{padding:6px}.panel{top:105px}.spawn{min-width:112px}}
    </style><style>
      :host{--ks-hot:#ff9944;--ks-cold:#ccaaff;--ks-team1:#ff6655;--ks-team2:#5599ff}
      :host([data-variant="ks2"]){--ks-hot:#a77cff;--ks-cold:#54e5ff;--ks-team1:#ff765f;--ks-team2:#67b6ff}
      .ui{font:700 12px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.025em;text-shadow:0 1px 2px #000}
      .badge,.controls,.panel{background:linear-gradient(135deg,#101018f5,#141b2cf0);border:1px solid color-mix(in srgb,var(--ks-cold) 72%,transparent);border-radius:4px;box-shadow:0 0 0 1px #000a,inset 0 1px #ffffff12,0 10px 32px #000b}
      .badge{padding:9px 12px;max-width:min(510px,55vw);min-width:280px;border-left:3px solid var(--ks-hot)}
      .hud-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding-bottom:6px;border-bottom:1px solid #ffffff24}
      .hud-brand{font-size:11px;letter-spacing:.13em;color:var(--ks-cold)}.hud-brand b{color:var(--ks-hot)}
      .hud-clock{color:#ffe36c;font-size:17px;font-variant-numeric:tabular-nums;text-shadow:0 0 12px #ffd45a77}
      .hud-score{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding-top:7px}
      .hud-team{display:flex;justify-content:space-between;gap:8px;color:#d9d8e6}.hud-team:first-child strong{color:var(--ks-team1)}.hud-team:last-child strong{color:var(--ks-team2)}
      .hud-meta{margin-top:6px;color:#a9a8bd;font-size:10px}.hud-meta strong{color:#f2e6ff}
      .controls{gap:4px;padding:5px}
      button,select,input{font:inherit}button{border:1px solid #ffffff3d;border-radius:3px;background:#211d31;color:#f7f2ff;padding:7px 9px;cursor:pointer;text-transform:uppercase;font-size:10px;font-weight:900;letter-spacing:.045em;transition:background-color .12s,border-color .12s,transform .12s}
      button:hover,button:focus-visible{background:#383050;border-color:var(--ks-hot);outline:2px solid var(--ks-cold);outline-offset:1px}button:active{transform:translateY(1px)}
      .controls button[data-action="modifiers"],.controls button[data-action="bestiary"]{color:#ffe36c}
      .controls button[data-action="pause"]{color:var(--ks-cold)}.controls button[data-action="exit"]{color:#ff9b8c}
      .spawn{font-size:12px;font-weight:900;min-height:52px;min-width:144px;touch-action:none;user-select:none;letter-spacing:.06em}
      .spawn[data-spraying="true"]{filter:brightness(1.35);box-shadow:0 0 18px #8de6ff88}
      .spawn[data-side="1"]{background:linear-gradient(135deg,#4a202b,#291920);border-color:var(--ks-team1);color:#ffb4a9}
      .spawn[data-side="2"]{background:linear-gradient(135deg,#1c314d,#1a1f31);border-color:var(--ks-team2);color:#bbd9ff}
      .panel{border-top:3px solid var(--ks-hot);padding:16px;font-size:12px}
      .panel h2{margin:0 0 12px;font-size:16px;line-height:1.25;letter-spacing:.09em;text-transform:uppercase;color:var(--ks-cold);text-shadow:0 0 10px color-mix(in srgb,var(--ks-cold) 35%,transparent)}
      .panel section{margin:13px 0;padding-top:10px;border-top:1px solid #ffffff20}.panel label{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:9px 0;color:#e7e1f0}
      .panel select,.panel input{max-width:58%;background:#100e19;color:#fff;border:1px solid #746692;border-radius:3px;padding:6px}
      .panel input[type="checkbox"]{accent-color:var(--ks-hot)}.panel input[type="range"]{accent-color:var(--ks-hot)}
      .panel .entry{border-bottom:1px solid #ffffff24;padding:9px 2px}.panel .entry strong{display:block}.panel .entry small{color:#b9d7e4}
      .panel a{color:var(--ks-cold)}.notice{color:#bcb8cd;font-size:11px;line-height:1.5}
      .panel [data-scene],.panel .controls button{border-color:#8570ae;background:#241c38;color:#e9dcff}
      .bottom{gap:12px}.panel[data-minimized="true"]{height:58px;min-height:58px;overflow:hidden}
      @media(max-width:640px){.top{flex-direction:column;align-items:stretch}.badge{max-width:100%;min-width:0;font-size:10px}.controls{max-width:100%;justify-content:space-between}.controls button{padding:7px 6px;font-size:9px}.panel{top:138px;max-height:calc(100dvh - 220px)}.spawn{min-width:0;width:calc(50vw - 20px);min-height:56px;font-size:11px}}
      @media(prefers-reduced-motion:reduce){button{transition:none}}
    </style><canvas class="arena"></canvas><div class="ui"><div class="top"><div class="badge" aria-label="Kinetic Souls match status"></div><div class="controls"><button data-action="creator">Creative Sandbox</button><button data-action="modifiers" title="M">Modifiers · M</button><button data-action="bestiary">Bestiary</button><button data-action="settings">Settings</button><button data-action="pause">Pause</button><button data-action="exit">Restore page</button></div></div><div class="panel" role="dialog" aria-label="Kinetic Souls controls"></div><div class="bottom"><button class="spawn" data-side="1" aria-label="Spawn left team; hold to repeat" title="Tap or hold A to launch the left team">P1 · Spawn left</button><button class="spawn" data-side="2" aria-label="Spawn right team; hold to repeat" title="Tap or hold L to launch the right team">P2 / NPC · Spawn right · L</button></div></div>`;
    document.body.appendChild(this.host);
    this.canvas = this.root.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.panel = this.root.querySelector(".panel")!;
    this.hud = this.root.querySelector(".badge")!;
    this.root.querySelectorAll<HTMLButtonElement>("button[data-side]").forEach(button => {
      button.addEventListener("pointerdown", event => {
        if (event.button !== 0 && event.pointerType !== "touch") return;
        event.preventDefault();
        try { button.setPointerCapture(event.pointerId); } catch { /* Window-level release still clears the hold. */ }
        const side = Number(button.dataset.side) as Side;
        this.spawn(side, true);
        button.dataset.spraying = "true";
        this.heldSides.set(event.pointerId, { side, lastSpawnAt: performance.now() });
      });
      const stopSpray = (event: PointerEvent) => {
        this.heldSides.delete(event.pointerId);
        button.dataset.spraying = "false";
      };
      button.addEventListener("pointerup", stopSpray);
      button.addEventListener("pointercancel", stopSpray);
      button.addEventListener("lostpointercapture", stopSpray);
      button.addEventListener("contextmenu", event => event.preventDefault());
      // Preserve keyboard and assistive-technology activation as a one-shot spawn.
      button.addEventListener("click", event => { if (event.detail === 0) this.spawn(Number(button.dataset.side) as Side, true); });
    });
    this.root.querySelectorAll("button[data-action]").forEach(button => button.addEventListener("click", () => this.action((button as HTMLElement).dataset.action!)));
    this.observer = new MutationObserver(() => { this.scanAt = 0; });
    this.observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("pointerup", this.releaseHeld, true);
    window.addEventListener("pointercancel", this.releaseHeld, true);
    window.addEventListener("blur", this.releaseAllHeld);
    window.addEventListener("keydown", this.keydown, true);
    window.addEventListener("keyup", this.keyup, true);
    document.addEventListener("click", this.clickSide, true);
    window.addEventListener("resize", this.resize);
    window.addEventListener("scroll", this.refresh, { passive: true });
    this.resize();
    this.scan();
    this.updateSideControls();
    this.spawn(this.playerOneSide(), false);
    this.npcAt = performance.now() + settings.spawnMs;
    this.snapshots.push(this.captureSnapshot());
    this.frame = requestAnimationFrame(this.tick);
  }

  keydown = (event: KeyboardEvent) => {
    if (/INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement)?.tagName || "")) return;
    const key = event.key.toLowerCase();
    if (key === "a" || key === "l") {
      event.preventDefault();
      if (!this.matchFinished && startHeldSpawn(this.heldKeys, key, key === "a" ? 1 : 2, performance.now())) {
        const side = key === "a" ? 1 : 2;
        this.spawn(side, true);
        const button = this.root.querySelector<HTMLElement>(`button[data-side="${side}"]`);
        if (button) button.dataset.spraying = "true";
      }
      return;
    }
    if (event.repeat) return;
    if (key === "m") { event.preventDefault(); this.action("modifiers"); }
    else if (key === "escape") { event.preventDefault(); this.action(this.panel.dataset.open === "true" ? "close" : "pause"); }
  };
  keyup = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const held = this.heldKeys.get(key);
    if (!held) return;
    this.heldKeys.delete(key);
    if (![...this.heldKeys.values()].some(entry => entry.side === held.side) && ![...this.heldSides.values()].some(entry => entry.side === held.side)) {
      const button = this.root.querySelector<HTMLElement>(`button[data-side="${held.side}"]`);
      if (button) button.dataset.spraying = "false";
    }
  };
  releaseHeld = (event: PointerEvent) => { this.heldSides.delete(event.pointerId); };
  releaseAllHeld = () => { this.heldSides.clear(); this.heldKeys.clear(); this.root.querySelectorAll<HTMLElement>('[data-spraying="true"]').forEach(button => { button.dataset.spraying = "false"; }); };
  clickSide = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element) || this.host.contains(target) || target.closest('a,button,input,textarea,select,[contenteditable="true"],[data-lok-sandbox-object]')) return;
    if (event.clientX < innerWidth * 0.25) this.spawn(1, true);
    else if (event.clientX > innerWidth * 0.75) this.spawn(2, true);
  };
  resize = () => { this.canvas.width = innerWidth; this.canvas.height = innerHeight; this.scanAt = 0; };
  refresh = () => { this.scanAt = 0; };

  scan() {
    const seen = new Set<Element>();
    const nodes = document.querySelectorAll("main *, article *, section *, header *, footer *, img, video, h1, h2, h3, p, [data-lok-demo-media]");
    let count = 0;
    for (const element of nodes) {
      if (count > 1800 || this.host.contains(element) || element.closest("#lok-kinetic-official-page,[data-lok-nondestructible],.lok-choice,[data-lok-sandbox-object],a,button,input,select,textarea,form,[contenteditable],[role=button]")
        || element.querySelector("a,button,input,select,textarea,form,[contenteditable],[role=button],[data-lok-nondestructible]")) continue;
      const rect = element.getBoundingClientRect();
      // Break individual pieces of the page, not a full-height layout wrapper.
      if (rect.width < 40 || rect.height < 20 || rect.width > Math.min(innerWidth * 0.9, 780) || rect.height > 480 || rect.width * rect.height > 210000 || rect.bottom < -150 || rect.top > innerHeight + 150) continue;
      count++;
      if (!this.targets.has(element)) this.targets.set(element, { id: this.nextTargetId++, element, x: 0, y: 0, width: 0, height: 0, damage: 0, destroyed: false, impactX: 0, impactY: 0, impactDX: 0, impactDY: -1, lastHitAt: 0, boss: false, stage: 0, material: classifyPageMaterial(element.tagName), fractures: [] });
      const target = this.targets.get(element)!;
      if (target.field && (Math.abs(target.field.width - rect.width) > 1 || Math.abs(target.field.height - rect.height) > 1)) target.field = undefined;
      target.x = rect.left + scrollX; target.y = rect.top + scrollY; target.width = rect.width; target.height = rect.height;
      seen.add(element);
    }
    // Give the largest eligible page piece a one-time boss health bar and attack cycle.
    if (!this.bossTarget) {
      const boss = [...seen].map(element => this.targets.get(element)!).filter(target => target.width * target.height > 14000).sort((a, b) => b.width * b.height - a.width * a.height)[0];
      if (boss) { boss.boss = true; this.bossTarget = boss; this.bossPulseAt = performance.now() + 9000; }
    }
    for (const [element] of this.targets) if (!element.isConnected) this.targets.delete(element);
  }

  spawn(side: Side, human: boolean) {
    if (this.matchFinished) return;
    if (human && side === this.matchNpcSide && settings.npcEnabled) { this.rightControlUntil = performance.now() + 12_000; this.updateNpcButton(); this.updateSideControls(); }
    const x = scrollX + (side === 1 ? 44 : innerWidth - 44);
    const y = scrollY + 145 + Math.random() * Math.max(80, innerHeight - 290);
    const entries = this.variant === "classic" ? classicBestiary : ks2Bestiary;
    const chosen = entries.find(e => e.id === settings.fighter && e.role !== "Weapon" && e.role !== "Relic") || entries[0];
    const type = chosen.id as never;
    const fighter = this.variant === "classic"
      ? spawnClassic(side, settings.modifier as never, this.fighters as ReturnType<typeof spawnClassic>[], true, false, settings.weapon as never, settings.speed, x, y, type)
      : spawnKs2(side, settings.modifier as never, this.fighters as ReturnType<typeof spawnKs2>[], true, false, settings.weapon as never, settings.speed, x, y, type);
    fighter.vx = (side === 1 ? 1 : -1) * Math.max(2, Math.abs(fighter.vx));
    this.fighters.push(fighter);
    if (this.fighters.length > 120) this.fighters.splice(0, this.fighters.length - 120);
    this.updateHud();
  }

  spawnBounty() {
    if (this.fighters.length >= 118) return;
    const x = scrollX + innerWidth * (0.2 + Math.random() * 0.6);
    const y = scrollY + innerHeight * (0.22 + Math.random() * 0.56);
    const fighter = this.variant === "classic"
      ? spawnClassic(3, settings.modifier as never, this.fighters as ReturnType<typeof spawnClassic>[], false, false, "none", settings.speed, x, y, "bounty")
      : spawnKs2(3, settings.modifier as never, this.fighters as ReturnType<typeof spawnKs2>[], false, false, "none", settings.speed, x, y, "bounty");
    this.fighters.push(fighter);
    this.floatingTexts.push({ x, y: y - 26, value: "BOUNTY TARGET", color: "#ffd700", life: 1100 });
  }

  updateHud() {
    const playerSide = this.playerOneSide();
    const opponentSide = this.matchNpcSide;
    const playerFighters = this.fighters.filter(f => !f.dead && f.team === playerSide).length;
    const opponentFighters = this.fighters.filter(f => !f.dead && f.team === opponentSide).length;
    const time = Math.ceil(this.remainingMs / 1000);
    const control = performance.now() < this.rightControlUntil ? "Player 2" : settings.npcEnabled ? "NPC" : "Player 2";
    const combo = performance.now() < this.comboUntil ? ` · Combo ×${this.breakCombo}` : "";
    const version = this.variant === "ks2" ? "KS2 · ALPHA" : "CLASSIC · 1";
    this.hud.innerHTML = `<div class="hud-head"><span class="hud-brand">KINETIC <b>SOULS</b> <small>${version}</small></span><span class="hud-clock">${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}</span></div><div class="hud-score"><span class="hud-team"><span>P1 · ${playerFighters}</span><strong>${this.teamKOs[playerSide]} KO</strong></span><span class="hud-team"><span>${control} · ${opponentFighters}</span><strong>${this.teamKOs[opponentSide]} KO</strong></span></div><div class="hud-meta">PAGE BREAKS <strong>${this.score}</strong> · CHAIN <strong>${this.chainBreaks}</strong>${combo ? `<strong>${combo}</strong>` : ""} · ${this.matchFinished ? "MATCH COMPLETE" : "A / L TO SPAWN · HOLD TO SPRAY"}</div>`;
    this.updateSideControls();
  }

  playerOneSide(): Side { return playerOneSide(this.matchNpcSide); }

  matchScores() {
    return mapPageTeamScores(this.teamKOs, this.matchNpcSide);
  }

  updateSideControls() {
    for (const button of this.root.querySelectorAll<HTMLButtonElement>("button[data-side]")) {
      const side = Number(button.dataset.side) as Side;
      const playerSide = this.playerOneSide();
      const isPlayerOne = side === playerSide;
      const isNpcTakeover = side === this.matchNpcSide && settings.npcEnabled && performance.now() >= this.rightControlUntil;
      const owner = isPlayerOne ? "P1" : isNpcTakeover ? "NPC" : "P2";
      const sideName = side === 1 ? "left" : "right";
      const key = side === 1 ? "A" : "L";
      button.textContent = `${owner} · Spawn ${sideName}`;
      button.setAttribute("aria-label", `Spawn ${owner === "P1" ? "Player 1" : owner === "NPC" ? "the NPC" : "Player 2"} on the ${sideName} side; hold to repeat`);
      button.title = `Tap or hold ${key} to launch ${owner === "P1" ? "Player 1" : owner === "NPC" ? "the NPC" : "Player 2"} on the ${sideName} side`;
    }
  }

  durationLabel(durationMs: number) {
    const minutes = durationMs / 60_000;
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  elapsedMatchMs() { return Math.max(0, this.matchDurationMs - this.remainingMs); }

  captureSnapshot() {
    return { at: this.elapsedMatchMs(), fighters: this.fighters.map(f => ({ id: f.id, x: f.x, y: f.y, angle: f.angle })), score: this.score, kos: { ...this.teamKOs },
      videos: captureVideoTimes([...this.targets.values()]),
      destruction: captureDestructionState([...this.targets.values()], this.damage, this.chunks) };
  }

  visualEffects() { return pageEffects(settings.effectMode, matchMedia("(prefers-reduced-motion: reduce)").matches); }

  awardKo(fighter: Fighter, team: number) {
    if (fighter.dead) return;
    fighter.dead = true; this.kills++;
    if (team === 1 || team === 2) this.teamKOs[team]++;
    const color = this.variant === "classic"
      ? classicTeamColor(team, settings.theme as never, fighter.kineticType as never)
      : ks2TeamColor(team, settings.theme as never, fighter.kineticType as never);
    const name = String(fighter.kineticType || "kinetic").replaceAll("_", " ").toUpperCase();
    this.floatingTexts.push({ x: fighter.x, y: fighter.y - 24, value: fighter.kineticType === "bounty" ? "BOUNTY CLAIMED!" : team === 5 ? "UNDEAD K.O." : `${name} K.O.`, color: fighter.kineticType === "bounty" ? "#ffd700" : color, life: 1050 });
    this.screenShake = Math.max(this.screenShake, 3.5);
    const particleCount = Math.max(1, Math.round(14 * this.visualEffects().particles));
    for (let i = 0; i < particleCount && this.particles.length < 350; i++) {
      const angle = Math.random() * Math.PI * 2, speed = 2 + Math.random() * 5;
      this.particles.push({ x: fighter.x, y: fighter.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 420 + Math.random() * 380, maxLife: 800, size: 2 + Math.random() * 4, color, active: true });
    }
    // Kinetic Souls' Necromancy modifier turns defeated fighters into green neutral undead.
    if (settings.modifier === "necromancy" && fighter.team !== 5 && this.fighters.length < 118) {
      const zombie = this.variant === "classic"
        ? spawnClassic(5, settings.modifier as never, this.fighters as ReturnType<typeof spawnClassic>[], false, false, "none", settings.speed, fighter.x, fighter.y, "zombie")
        : spawnKs2(5, settings.modifier as never, this.fighters as ReturnType<typeof spawnKs2>[], false, false, "none", settings.speed, fighter.x, fighter.y, "zombie");
      this.fighters.push(zombie);
      this.floatingTexts.push({ x: fighter.x, y: fighter.y + 8, value: "UNDEAD RISE", color: "#72ff73", life: 950 });
    }
    this.updateHud();
  }

  updateNpcButton() {
    const button = this.panel.querySelector("[data-resume-npc]");
    if (button) button.textContent = `Resume NPC on ${this.matchNpcSide === 1 ? "left" : "right"}`;
  }

  tick = (now: number) => {
    if (!this.running) return;
    const elapsedMs = now - this.previous;
    const dt = Math.min(2.5, Math.max(0.3, elapsedMs / 16.67));
    this.previous = now;
    if (!this.paused && !this.matchFinished) {
      this.remainingMs = Math.max(0, this.remainingMs - elapsedMs);
      if (this.remainingMs <= 0) { this.finishMatch(); }
      if (!this.matchFinished) for (const [pointerId, held] of advanceHeldSpawns(this.heldSides, now, HOLD_REPEAT_MS)) {
        this.spawn(held.side, true);
        if (!this.root.querySelector(`button[data-side="${held.side}"][data-spraying="true"]`)) this.heldSides.delete(pointerId);
      }
      if (!this.matchFinished) for (const [, held] of advanceHeldSpawns(this.heldKeys, now, HOLD_REPEAT_MS)) {
        this.spawn(held.side, true);
      }
      if (!this.matchFinished && settings.npcEnabled && now >= this.rightControlUntil && now > this.npcAt) { this.spawn(this.matchNpcSide, false); this.npcAt = now + settings.spawnMs; }
      if (!this.matchFinished && settings.modifier === "lok_bounty" && now >= this.bountyAt) { this.spawnBounty(); this.bountyAt = now + 8000; }
      if (now > this.scanAt) { this.scan(); this.scanAt = now + 900; }
      if (!this.matchFinished) this.step(dt);
      if (now >= this.snapshotAt) { this.snapshots.push(this.captureSnapshot()); this.snapshots = this.snapshots.slice(-(Math.ceil(this.matchDurationMs / 1000) + 1)); this.snapshotAt = now + 1000; }
      if (now >= this.hudAt) { this.updateHud(); this.hudAt = now + 500; }
      const timeline = this.panel.querySelector<HTMLInputElement>("[data-timeline]");
      if (timeline && this.replayIndex === null) { timeline.max = String(Math.max(0, this.snapshots.length - 1)); timeline.value = timeline.max; }
    }
    this.draw(now);
    this.frame = requestAnimationFrame(this.tick);
  };

  step(dt: number) {
    const dtMs = dt * 16.67;
    const now = performance.now();
    const worldWidth = Math.max(innerWidth, document.documentElement.scrollWidth), worldHeight = Math.max(innerHeight, document.documentElement.scrollHeight);
    const shrink = settings.modifier === "shrinking_arena" ? Math.min(0.32, this.elapsedMatchMs() / this.matchDurationMs * 0.32) : 0;
    const minX = 18 + Math.min(worldWidth * 0.38, worldWidth * shrink), maxX = Math.max(minX + 36, worldWidth - 18 - worldWidth * shrink);
    const minY = 85 + Math.min(Math.max(0, worldHeight - 120) * 0.38, worldHeight * shrink), maxY = Math.max(minY + 80, worldHeight - 18 - worldHeight * shrink);
    const visibleTargets = sortTargetsFrontFirst([...this.targets.values()].filter(t => !t.destroyed && t.x + t.width >= scrollX - 100 && t.x <= scrollX + innerWidth + 100 && t.y + t.height >= scrollY - 100 && t.y <= scrollY + innerHeight + 100));
    if (this.variant === "ks2" && settings.motion === "battle") {
      // KS2's standalone AI and fighter abilities operate on document coordinates here.
      const state = { aiAggressive: true, screensaverMode: false, optGrid: true, optPool: false, modifier: settings.modifier, fighterSpeed: settings.speed, timeScale: 1 } as GameState;
      updateBehaviors(this.fighters as Ks2Character[], state, dtMs, this.particles, (x, y, value, color) => this.floatingTexts.push({ x, y, value, color, life: 900 }), this.bombs, performance.now());
      if (this.fighters.length > 120) this.fighters.splice(0, this.fighters.length - 120);
    }
    if (this.variant === "classic" && settings.motion === "battle") this.updateClassicAbilities(dtMs);
    this.stepSandboxObjects(dt);
    for (const fighter of this.fighters) {
      if (fighter.dead) continue;
      if (settings.modifier === "magnet" || settings.modifier === "repel") {
        const direction = settings.modifier === "magnet" ? 1 : -1;
        for (const other of this.fighters) {
          if (other === fighter || other.dead || other.team === fighter.team) continue;
          const dx = other.x - fighter.x, dy = other.y - fighter.y, distance = Math.hypot(dx, dy);
          if (distance > 20 && distance < 240) { fighter.vx += dx / distance * 0.035 * direction * dt; fighter.vy += dy / distance * 0.035 * direction * dt; }
        }
      }
      // Classic's standalone loop supports the original KS2 force modifiers too;
      // KS2 already applies these in its native updateBehaviors system above.
      if (this.variant === "classic" && settings.motion === "battle") {
        if (settings.modifier === "gravity_well") {
          const wellX = scrollX + innerWidth * (0.5 + Math.sin(performance.now() * 0.0005) * 0.32);
          const wellY = scrollY + innerHeight * (0.5 + Math.cos(performance.now() * 0.0007) * 0.32);
          const dx = wellX - fighter.x, dy = wellY - fighter.y, distance = Math.hypot(dx, dy);
          if (distance > 10 && distance < 360) { fighter.vx += dx / distance * 0.38 * dt; fighter.vy += dy / distance * 0.38 * dt; }
        } else if (settings.modifier === "chaos_vortex" && Math.random() < 0.001 * dt) {
          fighter.vx += (Math.random() - 0.5) * 30;
          fighter.vy += (Math.random() - 0.5) * 30;
          this.floatingTexts.push({ x: fighter.x, y: fighter.y - 18, value: "CHAOS BURST", color: "#ff65dc", life: 700 });
        }
      }
      const enemies = this.fighters.filter(other => !other.dead && other.team !== fighter.team && Math.abs(other.y - fighter.y) < innerHeight * 1.3);
      let nearest: Fighter | undefined;
      let nearestDistance = Infinity;
      for (const enemy of enemies) { const d = Math.hypot(enemy.x - fighter.x, enemy.y - fighter.y); if (d < nearestDistance) { nearest = enemy; nearestDistance = d; } }
      if (this.variant === "classic" && settings.motion === "battle" && nearest && nearestDistance > 35 && fighter.kineticType !== "null" && fighter.stunTime <= 0) {
        let seek = fighter.isBoss ? 0.35 : 0.2;
        if (fighter.kineticType === "assassin" || fighter.kineticType === "ninja") seek = 0.45;
        if (fighter.kineticType === "tank" || fighter.kineticType === "juggernaut") seek = 0.15;
        if (fighter.kineticType === "giant") seek = 0.1;
        if (fighter.kineticType === "volatile") seek = 0.6;
        fighter.vx += (nearest.x - fighter.x) / nearestDistance * seek * dt;
        fighter.vy += (nearest.y - fighter.y) / nearestDistance * seek * dt;
      }
      const speed = Math.hypot(fighter.vx, fighter.vy);
      if (speed > 16 * settings.speed) { fighter.vx *= 16 * settings.speed / speed; fighter.vy *= 16 * settings.speed / speed; }
      fighter.cooldown = Math.max(0, fighter.cooldown - dtMs);
      if (fighter.stunTime > 0) fighter.stunTime = Math.max(0, fighter.stunTime - dtMs);
      if (settings.environment === "blackhole") { fighter.vx += (scrollX + innerWidth / 2 - fighter.x) * 0.0001; fighter.vy += (scrollY + innerHeight / 2 - fighter.y) * 0.0001; }
      if (settings.environment === "ice") { fighter.vx *= 1.002; fighter.vy *= 1.002; }
      if (settings.environment === "storm") { fighter.vx += Math.sin(now * 0.001 + fighter.y * 0.009) * 0.16 * dt; fighter.vy += Math.cos(now * 0.0013 + fighter.x * 0.006) * 0.08 * dt; }
      if (this.variant === "ks2" && settings.environment === "solar_flares") {
        const flareX = scrollX + innerWidth * (0.5 + Math.sin(now * 0.0005) * 0.5), flareY = scrollY + innerHeight * (0.5 + Math.cos(now * 0.0007) * 0.5);
        if (Math.hypot(fighter.x - flareX, fighter.y - flareY) < 100) { fighter.hp -= 0.1 * dt; fighter.flashFrames = Math.max(fighter.flashFrames, 1); }
      }
      if (this.variant === "ks2" && settings.environment === "magnetic_fields") {
        fighter.vx += Math.sin(now * 0.001 + fighter.y * 0.01) * 0.5 * dt;
        fighter.vy += Math.cos(now * 0.001 + fighter.x * 0.01) * 0.5 * dt;
      }
      if (this.variant === "ks2" && settings.environment === "void_storm") {
        fighter.hp = Math.max(1, fighter.hp - 0.04 * dt);
        const stormDrag = Math.pow(1.01, dt); fighter.vx *= stormDrag; fighter.vy *= stormDrag;
      }
      if (settings.environment === "lava" && fighter.y >= maxY - 52) {
        fighter.hp -= 0.45 * dt; fighter.flashFrames = Math.max(fighter.flashFrames, 1);
        if (fighter.hp <= 0) this.awardKo(fighter, fighter.team === 1 ? 2 : fighter.team === 2 ? 1 : 0);
      }
      const timeScale = this.variant === "classic" && settings.modifier === "time_distortion"
        ? 1 + Math.sin(performance.now() * 0.005 + fighter.id) * 0.5
        : 1;
      fighter.x += fighter.vx * dt * timeScale; fighter.y += fighter.vy * dt * timeScale;
      fighter.angle += fighter.angularV * dt;
      const drag = settings.environment === "ice" ? 0.998 : settings.environment === "bouncy" ? 1 : 0.985;
      fighter.vx *= drag; fighter.vy *= drag;
      fighter.flashFrames = Math.max(0, fighter.flashFrames - dt);
      if (settings.environment === "wrap") { if (fighter.x < minX) fighter.x = maxX; if (fighter.x > maxX) fighter.x = minX; }
      else { if (fighter.x < minX || fighter.x > maxX) { fighter.vx *= settings.environment === "bouncy" ? -1.15 : -1; fighter.x = Math.max(minX, Math.min(maxX, fighter.x)); } }
      if (fighter.y < minY || fighter.y > maxY) { fighter.vy *= settings.environment === "bouncy" ? -1.15 : -1; fighter.y = Math.max(minY, Math.min(maxY, fighter.y)); }
      for (const target of visibleTargets) {
        if (target.destroyed) continue;
        const contact = target.field
          ? resolveSegmentContact(target.field, fighter.x - target.x, fighter.y - target.y, target.x, target.y, 15 * fighter.scale)
          : resolveTargetContact(fighter.x, fighter.y, target.x, target.y, target.width, target.height, 15 * fighter.scale);
        if (!contact) continue;
        const incomingX = fighter.vx, incomingY = fighter.vy;
        const normalVelocity = incomingX * contact.normalX + incomingY * contact.normalY;
        fighter.x = contact.fighterX; fighter.y = contact.fighterY;
        if (normalVelocity >= 0) continue;
        const impactSpeed = -normalVelocity;
        const recoil = fighterTargetRecoil(incomingX, incomingY, contact.normalX, contact.normalY, settings.environment === "bouncy" ? 1.2 : 0.9);
        const recoilSpeed = Math.hypot(recoil.vx, recoil.vy), maxRecoilSpeed = 16 * settings.speed;
        const recoilScale = recoilSpeed > maxRecoilSpeed ? maxRecoilSpeed / recoilSpeed : 1;
        fighter.vx = recoil.vx * recoilScale; fighter.vy = recoil.vy * recoilScale;
        // Match the source combat loop's brief hit flash when a fighter lands a hit.
        fighter.flashFrames = Math.max(fighter.flashFrames, 3);
        this.damageTarget(target, contact.x, contact.y, Math.max(0.6, Math.min(5, impactSpeed * 0.34)), fighter.team === 1 ? "#ff714e" : "#72dfff", impactSpeed, incomingX, incomingY, fighter.team);
        break;
      }
    }
    for (let i = 0; i < this.fighters.length; i++) {
      const a = this.fighters[i]; if (a.dead) continue;
      for (let j = i + 1; j < this.fighters.length; j++) {
        const b = this.fighters[j]; if (b.dead) continue;
        const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy), radius = 14 * (a.scale + b.scale) * 0.85;
        if (distance >= radius || distance < 0.01) continue;
        const nx = dx / distance, ny = dy / distance;
        const totalMass = Math.max(0.1, a.mass + b.mass), overlap = radius - distance;
        a.x -= nx * overlap * b.mass / totalMass; a.y -= ny * overlap * b.mass / totalMass;
        b.x += nx * overlap * a.mass / totalMass; b.y += ny * overlap * a.mass / totalMass;
        const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (relativeVelocity < 0) {
          const restitution = settings.environment === "bouncy" ? 1.2 : 0.82;
          const impulse = -(1 + restitution) * relativeVelocity / (1 / a.mass + 1 / b.mass);
          a.vx -= impulse * nx / a.mass; a.vy -= impulse * ny / a.mass;
          b.vx += impulse * nx / b.mass; b.vy += impulse * ny / b.mass;
        }
        if (settings.motion === "dvd" || a.team === b.team) continue;
        const partDamage = this.variant === "classic" ? classicPartDamage : ks2PartDamage;
        const aPart = a.parts[Math.floor(Math.random() * a.parts.length)];
        const bPart = b.parts[Math.floor(Math.random() * b.parts.length)];
        const multiplier = Math.min(Math.abs(relativeVelocity) * 0.5, 6);
        const aDamage = Math.max(0.5, partDamage(aPart?.type || "body") * multiplier);
        const bDamage = Math.max(0.5, partDamage(bPart?.type || "body") * multiplier);
        if (a.shieldHp > 0) a.shieldHp -= bDamage; else a.hp -= bDamage;
        if (b.shieldHp > 0) b.shieldHp -= aDamage; else b.hp -= aDamage;
        a.flashFrames = 3; b.flashFrames = 3;
        if (settings.modifier === "vampire_kiss") a.hp = Math.min(a.maxHp, a.hp + 2);
        if (a.hp <= 0) this.awardKo(a, b.team as Side);
        if (b.hp <= 0) this.awardKo(b, a.team as Side);
      }
    }
    this.updateProjectiles(dt, dtMs, visibleTargets);
    this.stepChunks(dt, dtMs, visibleTargets);
    this.updateEffects(dt, dtMs);
    this.updateBossPulse(visibleTargets, performance.now());
    this.fighters = this.fighters.filter(f => !f.dead);
  }

  stepSandboxObjects(dt: number) {
    for (const target of this.targets.values()) {
      if (!target.dynamic || target.destroyed) continue;
      target.vy = (target.vy || 0) + 0.18 * dt;
      target.x += (target.vx || 0) * dt; target.y += (target.vy || 0) * dt;
      target.vx = (target.vx || 0) * 0.992;
      const floor = creatorFloorTop(target.stageFloorY ?? Infinity, target.height, Math.max(innerHeight, document.documentElement.scrollHeight));
      if (target.y > floor) { target.y = floor; target.vy = -(target.vy || 0) * 0.56; target.vx = (target.vx || 0) * 0.82; }
      const maxX = Math.max(innerWidth, document.documentElement.scrollWidth) - target.width - 8;
      if (target.x < 8 || target.x > maxX) { target.x = Math.max(8, Math.min(maxX, target.x)); target.vx = -(target.vx || 0) * 0.68; }
      const el = target.element as HTMLElement;
      el.style.left = `${target.x}px`; el.style.top = `${target.y}px`;
    }
  }

  addSandboxObject(element: HTMLElement, width = 190, height = 132) {
    const x = scrollX + Math.max(24, innerWidth * 0.35), y = scrollY + Math.max(130, innerHeight * 0.28);
    element.dataset.lokSandboxObject = "";
    element.style.cssText += `;position:absolute;left:${x}px;top:${y}px;width:${width}px;height:${height}px;object-fit:contain;z-index:2147483643;border:2px solid #93eaff;box-shadow:0 8px 24px #0008;cursor:grab;touch-action:none`;
    document.body.appendChild(element);
    const stageFloorY = creatorStageBottom(y, height, scrollY + innerHeight, Math.max(innerHeight, document.documentElement.scrollHeight));
    const target: Target = { id: this.nextTargetId++, element, x, y, width, height, damage: 0, destroyed: false, impactX: x + width / 2, impactY: y + height / 2, impactDX: 0, impactDY: -1, lastHitAt: 0, boss: false, stage: 0, material: classifyPageMaterial(element.tagName, true), fractures: [], dynamic: true, vx: (Math.random() - .5) * 3, vy: -2, homeX: x, homeY: y, stageFloorY, homeStageFloorY: stageFloorY };
    this.targets.set(element, target);
    let drag: { px: number; py: number; x: number; y: number } | null = null;
    element.addEventListener("pointerdown", event => { if (element instanceof HTMLVideoElement && event.offsetY > element.clientHeight - 42) return; drag = { px: event.clientX, py: event.clientY, x: target.x, y: target.y }; element.setPointerCapture(event.pointerId); element.style.cursor = "grabbing"; event.preventDefault(); });
    element.addEventListener("pointermove", event => { if (!drag) return; target.x = drag.x + event.clientX - drag.px; target.y = drag.y + event.clientY - drag.py; target.vx = target.vy = 0; element.style.left = `${target.x}px`; element.style.top = `${target.y}px`; });
    const release = () => { if (drag) target.stageFloorY = creatorStageBottom(target.y, target.height, scrollY + innerHeight, Math.max(innerHeight, document.documentElement.scrollHeight)); drag = null; element.style.cursor = "grab"; };
    element.addEventListener("pointerup", release); element.addEventListener("pointercancel", release);
    this.scanAt = 0;
    return target;
  }

  addStarterScene(scene: string) {
    const palettes: Record<string, string[]> = { neon: ["#ff477e", "#5ee7ff", "#ffcf56", "#a98cff"], ruins: ["#95745b", "#d5b58b", "#4c6a70", "#d87954"], garden: ["#3cae75", "#a6d86d", "#f3bd55", "#65b7ca"] };
    const colors = palettes[scene] || palettes.neon;
    for (let i = 0; i < 8; i++) {
      const tile = document.createElement("div"); tile.textContent = ["RIFT TILE", "BREAKABLE", "SANDBOX PROP", "TARGET"][i % 4];
      tile.style.cssText = `display:grid;place-items:center;background:linear-gradient(135deg,${colors[i % colors.length]},#101522);color:white;font:800 12px system-ui;text-shadow:0 1px 5px #000;border-radius:${i % 2 ? "4px" : "50%"};`;
      const target = this.addSandboxObject(tile, i % 3 === 0 ? 116 : 152, i % 3 === 0 ? 88 : 108);
      target.x += (i % 4) * 174; target.y += Math.floor(i / 4) * 128; target.homeX = target.x; target.homeY = target.y;
      target.stageFloorY = creatorStageBottom(target.y, target.height, scrollY + innerHeight, Math.max(innerHeight, document.documentElement.scrollHeight)); target.homeStageFloorY = target.stageFloorY;
      tile.style.left = `${target.x}px`; tile.style.top = `${target.y}px`;
    }
  }

  rebuildScene() {
    this.replayIndex = null;
    this.damage.length = 0;
    this.shards = [];
    this.chunks = [];
    for (const target of this.targets.values()) {
      target.damage = 0; target.destroyed = false; target.stage = 0; target.lastHitAt = 0; target.fractures = []; target.field = undefined;
      if (target.dynamic) { target.x = target.homeX ?? target.x; target.y = target.homeY ?? target.y; target.stageFloorY = target.homeStageFloorY ?? target.stageFloorY; target.vx = target.vy = 0; const el = target.element as HTMLElement; el.style.display = ""; el.style.visibility = ""; el.style.maskImage = ""; el.style.removeProperty("-webkit-mask-image"); el.style.left = `${target.x}px`; el.style.top = `${target.y}px`; }
    }
    this.floatingTexts.push({ x: scrollX + innerWidth / 2, y: scrollY + 120, value: "SCENE REBUILT", color: "#9eeaff", life: 1000 });
  }

  async saveScene() {
    const objects = await Promise.all([...this.targets.values()].filter(t => t.dynamic).map(async t => {
      const el = t.element as HTMLElement; let blob: Blob | undefined;
      const src = (el as HTMLImageElement | HTMLVideoElement).src;
      if (src?.startsWith("blob:")) { try { blob = await (await fetch(src)).blob(); } catch {} }
      return { x: t.x, y: t.y, homeX: t.homeX, homeY: t.homeY, stageFloorY: t.stageFloorY, homeStageFloorY: t.homeStageFloorY, width: t.width, height: t.height, damage: t.damage, destroyed: t.destroyed, stage: t.stage,
        field: captureSceneField(t.field), videoTime: el instanceof HTMLVideoElement ? savedVideoTime(el.currentTime, el.duration) : undefined,
        kind: el.tagName.toLowerCase(), text: el.tagName === "DIV" ? el.textContent : "", color: el.tagName === "DIV" ? el.style.background : "", blob, name: el.getAttribute("aria-label") || el.getAttribute("alt") || "Sandbox object" };
    }));
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const req = indexedDB.open("lok-demo-day-projects", 1); req.onupgradeneeded = () => req.result.createObjectStore("scenes", { keyPath: "id" }); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
    const id = `kinetic-${Date.now()}`;
    await new Promise<void>((resolve, reject) => { const tx = db.transaction("scenes", "readwrite"); tx.objectStore("scenes").put({ id, title: `Kinetic ${this.variant} scene · ${new Date().toLocaleString()}`, kind: "kinetic-scene", objects, variant: this.variant, updatedAt: new Date().toISOString() }); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); }); db.close();
    this.floatingTexts.push({ x: scrollX + innerWidth / 2, y: scrollY + 100, value: "SCENE SAVED", color: "#9eeaff", life: 1000 });
  }

  async openScene() {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const req = indexedDB.open("lok-demo-day-projects", 1); req.onupgradeneeded = () => req.result.createObjectStore("scenes", { keyPath: "id" }); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
    const records = await new Promise<any[]>((resolve, reject) => { const req = db.transaction("scenes", "readonly").objectStore("scenes").getAll(); req.onsuccess = () => resolve(req.result.filter((v: any) => v.kind === "kinetic-scene")); req.onerror = () => reject(req.error); }); db.close();
    const chosen = records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    if (!chosen) { this.floatingTexts.push({ x: scrollX + innerWidth / 2, y: scrollY + 100, value: "NO SAVED SCENES", color: "#ffd479", life: 1100 }); return; }
    const replacedIds = new Set([...this.targets.values()].filter(target => target.dynamic).map(target => target.id));
    this.damage = this.damage.filter(area => !replacedIds.has(area.targetId));
    this.chunks = this.chunks.filter(chunk => !replacedIds.has(chunk.sourceTargetId));
    for (const t of this.targets.values()) if (t.dynamic) { this.targets.delete(t.element); const media = t.element as HTMLImageElement | HTMLVideoElement; if (media instanceof HTMLVideoElement) media.pause(); if (media.src?.startsWith("blob:")) URL.revokeObjectURL(media.src); t.element.remove(); }
    this.activeVideo = null;
    this.replayIndex = null; this.snapshots = []; this.snapshotAt = performance.now();
    for (const obj of chosen.objects) {
      let el: HTMLElement;
      if (obj.blob && (obj.kind === "img" || obj.kind === "video")) { el = document.createElement(obj.kind) as HTMLElement; (el as HTMLImageElement | HTMLVideoElement).src = URL.createObjectURL(obj.blob); if (obj.kind === "video") { const v = el as HTMLVideoElement; this.activeVideo = v; v.controls = true; v.muted = true; v.loop = true; v.playsInline = true; v.addEventListener("loadedmetadata", () => { v.currentTime = savedVideoTime(obj.videoTime, v.duration); this.syncVideoTimeline(); if (!this.paused) void v.play().catch(() => {}); }, { once: true }); v.addEventListener("timeupdate", () => this.syncVideoTimeline()); } }
      else { el = document.createElement("div"); el.textContent = obj.text || obj.name; el.style.cssText = `display:grid;place-items:center;background:${obj.color || "linear-gradient(135deg,#46789b,#101522)"};color:white;font:800 12px system-ui`; }
      const t = this.addSandboxObject(el, obj.width, obj.height); t.x = obj.x; t.y = obj.y; t.homeX = obj.homeX; t.homeY = obj.homeY;
      const pageBottom = Math.max(innerHeight, document.documentElement.scrollHeight);
      t.stageFloorY = Number.isFinite(obj.stageFloorY) && obj.stageFloorY > 0 ? obj.stageFloorY : creatorStageBottom(t.y, t.height, scrollY + innerHeight, pageBottom);
      t.homeStageFloorY = Number.isFinite(obj.homeStageFloorY) && obj.homeStageFloorY > 0 ? obj.homeStageFloorY : creatorStageBottom(t.homeY ?? t.y, t.height, scrollY + innerHeight, pageBottom);
      t.damage = obj.damage; t.destroyed = obj.destroyed; t.stage = Number.isInteger(obj.stage) ? Math.max(0, Math.min(3, obj.stage)) : 0;
      t.field = restoreSceneField(obj.field, t.width, t.height, t.material) || undefined;
      el.style.left = `${t.x}px`; el.style.top = `${t.y}px`; if (t.destroyed) el.style.display = "none"; else if (t.field?.removedCount) this.updateDynamicMask(t);
    }
  }

  exportScene() { this.canvas.toBlob(blob => { if (!blob) return; const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `kinetic-${this.variant}-scene.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }); }

  recordReplay() {
    if (!this.canvas.captureStream || typeof MediaRecorder === "undefined") { this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Short replay recording is unavailable in this browser. Use Export arena still instead."; return; }
    try {
      const stream = this.canvas.captureStream(30), chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm" });
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => { const url = URL.createObjectURL(new Blob(chunks, { type: "video/webm" })); const a = document.createElement("a"); a.href = url; a.download = `kinetic-${this.variant}-replay.webm`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); stream.getTracks().forEach(track => track.stop()); };
      recorder.start(); this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Recording the live arena for 8 seconds…";
      window.setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Replay exported."; }, 8000);
    } catch { this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Could not start replay recording in this browser."; }
  }

  finishMatch() {
    if (this.matchFinished) return;
    this.matchFinished = true; this.paused = true;
    pauseVideos([...this.targets.values()]);
    this.heldSides.clear();
    this.heldKeys.clear();
    this.root.querySelectorAll<HTMLElement>('[data-spraying="true"]').forEach(button => { button.dataset.spraying = "false"; });
    const scores = this.matchScores();
    const result = scores.player1 === scores.player2 ? "Draw" : scores.player1 > scores.player2 ? "Player 1 wins" : "Player 2 / NPC wins";
    this.completeRun(result);
    this.panel.dataset.view = "result"; this.panel.dataset.open = "true";
    this.panel.innerHTML = `<h2>Match complete</h2><p><strong>${result}</strong></p><p>Player 1: ${scores.player1} KOs · Player 2 / NPC: ${scores.player2} KOs</p><p>Page targets destroyed: ${this.score}</p><p>Destruction: ${this.matchDestructionTempo === "deep" ? "Deep everywhere" : "Adaptive"}</p><button data-rematch>Rematch · ${this.durationLabel(settings.matchDurationMs)}</button><button data-close-panel>Close panel</button>`;
    this.panel.querySelector("[data-rematch]")?.addEventListener("click", () => this.rematch());
    this.panel.querySelector("[data-close-panel]")?.addEventListener("click", () => { this.panel.dataset.open = "false"; });
    this.updateHud();
  }

  completeRun(result: string) {
    if (this.completedRun) return;
    this.completedRun = true;
    const teamScores = this.matchScores();
    window.dispatchEvent(new CustomEvent("lok:demoday:page-run", { detail: { version: 1, gameKey: "kinetic-souls", variant: this.variant, runId: this.runId, durationMs: this.elapsedMatchMs(), matchDurationMs: this.matchDurationMs, destructionTempo: this.matchDestructionTempo, npcSide: this.matchNpcSide, teamScores, result, score: this.score + teamScores.player1 + teamScores.player2, xp: Math.min(200, this.score * 3 + teamScores.player1 + teamScores.player2), completedAt: new Date().toISOString() } }));
  }

  rematch() {
    this.rebuildScene(); this.fighters = []; this.projectiles = []; this.teamKOs = { 1: 0, 2: 0 }; this.score = 0; this.kills = 0; this.chainBreaks = 0;
    this.breakCombo = 0; this.comboUntil = 0; this.shockwaves = []; this.chunks = [];
    this.matchDurationMs = settings.matchDurationMs; this.matchDestructionTempo = settings.destructionTempo; this.remainingMs = this.matchDurationMs; this.matchFinished = false; this.completedRun = false; this.runId = createRunId();
    this.matchNpcSide = settings.npcSide; this.rightControlUntil = 0; this.paused = false; this.npcAt = performance.now() + 900;
    this.snapshots = []; this.snapshotAt = performance.now(); this.replayIndex = null;
    (this.root.querySelector('[data-action="pause"]') as HTMLElement).textContent = "Pause";
    this.panel.dataset.open = "false"; this.spawn(this.playerOneSide(), false); this.snapshots.push(this.captureSnapshot()); this.updateHud();
    resumeVideos([...this.targets.values()]);
  }

  syncVideoTimeline() {
    const slider = this.panel.querySelector<HTMLInputElement>("[data-video-timeline]");
    if (!slider || !this.activeVideo) return;
    slider.max = String(Number.isFinite(this.activeVideo.duration) ? this.activeVideo.duration : 0);
    if (document.activeElement !== slider) slider.value = String(this.activeVideo.currentTime);
  }

  showReplayVideos(sample: { videos: VideoTime[] } | null) {
    const visible = sample ? new Set(sample.videos.map(video => video.targetId)) : null;
    for (const target of this.targets.values()) if (target.dynamic && target.element instanceof HTMLVideoElement)
      target.element.style.visibility = visible && !visible.has(target.id) ? "hidden" : "";
  }

  updateClassicAbilities(dtMs: number) {
    for (const fighter of [...this.fighters]) {
      if (fighter.dead || !["gravity", "vanguard", "weaver", "hivemind"].includes(fighter.kineticType)) continue;
      fighter.customTimer -= dtMs;
      if (fighter.customTimer > 0) continue;
      if (fighter.kineticType === "gravity") {
        fighter.customTimer = 5000 + Math.random() * 3000;
        this.bombs.push({ type: "blackhole", x: fighter.x, y: fighter.y, timer: 3000, maxTimer: 3000, active: true, radius: 150 });
      } else if (fighter.kineticType === "vanguard") {
        fighter.customTimer = 3000 + Math.random() * 2000;
        fighter.vx += Math.cos(fighter.angle) * 15; fighter.vy += Math.sin(fighter.angle) * 15;
      } else if (fighter.kineticType === "weaver") {
        fighter.customTimer = 4000;
        for (const ally of this.fighters) if (!ally.dead && ally.team === fighter.team && Math.hypot(ally.x - fighter.x, ally.y - fighter.y) < 150) {
          ally.hp = Math.min(ally.maxHp, ally.hp + 10);
          this.floatingTexts.push({ x: ally.x, y: ally.y - 10, value: "+10", color: "#00ff88", life: 900 });
        }
      } else if (fighter.kineticType === "hivemind") {
        fighter.customTimer = 3000;
        for (let i = 0; i < 2 && this.fighters.length < 120; i++) {
          const drone = spawnClassic(fighter.team, settings.modifier as never, this.fighters as ReturnType<typeof spawnClassic>[], false, false, "none", settings.speed, fighter.x + (Math.random() - 0.5) * 40, fighter.y + (Math.random() - 0.5) * 40, "zombie");
          drone.maxHp = 1; drone.hp = 1; drone.scale = 0.6;
          this.fighters.push(drone);
        }
      }
    }
  }

  updateProjectiles(dt: number, dtMs: number, visibleTargets: Target[]) {
    if (settings.motion === "battle") for (const fighter of this.fighters) {
      if (fighter.dead || fighter.cooldown > 0 || (fighter.weapon !== "blaster" && fighter.weapon !== "fireball")) continue;
      const nearest = this.fighters.filter(other => !other.dead && other.team !== fighter.team)
        .sort((a, b) => Math.hypot(a.x - fighter.x, a.y - fighter.y) - Math.hypot(b.x - fighter.x, b.y - fighter.y))[0];
      if (!nearest || Math.hypot(nearest.x - fighter.x, nearest.y - fighter.y) >= 300) continue;
      const [x, y] = this.variant === "classic"
        ? classicWeaponTip(fighter as ReturnType<typeof spawnClassic>)
        : ks2WeaponTip(fighter as ReturnType<typeof spawnKs2>);
      const distance = Math.max(1, Math.hypot(nearest.x - x, nearest.y - y));
      const color = this.variant === "classic"
        ? classicTeamColor(fighter.team, settings.theme as never, fighter.kineticType as never)
        : ks2TeamColor(fighter.team, settings.theme as never, fighter.kineticType as never);
      this.projectiles.push({ x, y, previousX: x, previousY: y, vx: (nearest.x - x) / distance * 5, vy: (nearest.y - y) / distance * 5, life: 1500, team: fighter.team, type: fighter.weapon === "fireball" ? "fireball" : "laser", color });
      fighter.cooldown = fighter.weapon === "fireball" ? 1800 : 1200;
    }
    for (const shot of this.projectiles) {
      shot.previousX = shot.x; shot.previousY = shot.y;
      shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dtMs;
      if (shot.life <= 0 || shot.x < 0 || shot.y < 0 || shot.x > document.documentElement.scrollWidth || shot.y > document.documentElement.scrollHeight) continue;
      // A page element between the teams absorbs a shot and becomes destructible.
      const target = visibleTargets.find(t => !t.destroyed && shot.x >= t.x && shot.x < t.x + t.width && shot.y >= t.y && shot.y < t.y + t.height
        && (!t.field || isSegmentSolid(t.field, shot.x - t.x, shot.y - t.y)));
      if (target) {
        const impactColor = shot.color;
        this.damageTarget(target, shot.x, shot.y, shot.type === "fireball" ? 3.2 : 1.8, impactColor, Math.hypot(shot.vx, shot.vy), shot.vx, shot.vy, shot.team);
        shot.life = 0;
        continue;
      }
      for (const fighter of this.fighters) {
        if (fighter.dead || fighter.team === shot.team || Math.hypot(fighter.x - shot.x, fighter.y - shot.y) >= 14 * fighter.scale) continue;
        const damage = shot.type === "fireball" ? 8 : 5;
        if (fighter.shieldHp > 0) fighter.shieldHp -= damage; else fighter.hp -= damage;
        fighter.flashFrames = 5;
        fighter.vx += shot.vx * 0.5 / fighter.mass; fighter.vy += shot.vy * 0.5 / fighter.mass;
        shot.life = 0;
        if (fighter.hp <= 0) this.awardKo(fighter, shot.team as Side);
        break;
      }
    }
    this.projectiles = this.projectiles.filter(shot => shot.life > 0).slice(-180);
  }

  stepChunks(dt: number, dtMs: number, targets: Target[]) {
    const floor = Math.max(innerHeight, document.documentElement.scrollHeight) - 12;
    for (const chunk of [...this.chunks]) {
      chunk.vy += 0.26 * dt;
      chunk.x += chunk.vx * dt; chunk.y += chunk.vy * dt; chunk.angle += chunk.spin * dt;
      chunk.vx *= 0.993;
      if (chunk.y + chunk.height / 2 >= floor) {
        chunk.y = floor - chunk.height / 2;
        chunk.vy = Math.abs(chunk.vy) > 0.9 ? -chunk.vy * 0.36 : 0;
        chunk.vx *= 0.76; chunk.spin *= 0.76;
      }
      for (const fighter of this.fighters) {
        if (fighter.dead || chunk.hitFighters.has(fighter.id)) continue;
        const nearestX = Math.max(chunk.x - chunk.width / 2, Math.min(fighter.x, chunk.x + chunk.width / 2));
        const nearestY = Math.max(chunk.y - chunk.height / 2, Math.min(fighter.y, chunk.y + chunk.height / 2));
        if (Math.hypot(fighter.x - nearestX, fighter.y - nearestY) > 13 * fighter.scale) continue;
        chunk.hitFighters.add(fighter.id);
        fighter.vx += chunk.vx * Math.min(1.5, chunk.mass / Math.max(0.5, fighter.mass)) * 0.3;
        fighter.vy += chunk.vy * Math.min(1.5, chunk.mass / Math.max(0.5, fighter.mass)) * 0.3;
        if (chunk.ownerTeam === fighter.team) continue;
        const hit = Math.min(3, Math.max(0.5, Math.hypot(chunk.vx, chunk.vy) * chunk.mass * 0.16));
        if (fighter.shieldHp > 0) fighter.shieldHp -= hit; else fighter.hp -= hit;
        fighter.flashFrames = Math.max(fighter.flashFrames, 3);
        if (fighter.hp <= 0) this.awardKo(fighter, chunk.ownerTeam);
      }
      if (chunk.secondaryBudget && Math.hypot(chunk.vx, chunk.vy) > 1.5) {
        const target = targets.find(candidate => candidate.id !== chunk.sourceTargetId && !candidate.destroyed
          && chunk.x >= candidate.x && chunk.x < candidate.x + candidate.width && chunk.y >= candidate.y && chunk.y < candidate.y + candidate.height
          && (!candidate.field || isSegmentSolid(candidate.field, chunk.x - candidate.x, chunk.y - candidate.y)));
        if (target) {
          chunk.secondaryBudget = 0;
          this.damageTarget(target, chunk.x, chunk.y, Math.min(2, chunk.mass * 0.55), chunk.color, Math.hypot(chunk.vx, chunk.vy), chunk.vx, chunk.vy, chunk.ownerTeam);
          chunk.vx *= -0.45; chunk.vy *= -0.45;
        }
      }
      chunk.life -= dtMs;
    }
    this.chunks = this.chunks.filter(chunk => chunk.life > 0).slice(-48);
  }

  updateEffects(dt: number, dtMs: number) {
    for (const wave of this.shockwaves) { wave.radius += (wave.maxRadius - wave.radius) * Math.min(1, 0.18 * dt); wave.life -= dtMs; }
    this.shockwaves = this.shockwaves.filter(wave => wave.life > 0).slice(-36);
    for (const particle of this.particles) {
      if (!particle.active) continue;
      particle.x += particle.vx * dt; particle.y += particle.vy * dt;
      particle.vx *= 0.92; particle.vy *= 0.92;
      particle.life -= dtMs;
      if (particle.life <= 0) particle.active = false;
    }
    this.particles = this.particles.filter(particle => particle.active).slice(-350);
    for (const label of this.floatingTexts) { label.y -= 0.45 * dt; label.life -= dtMs; }
    this.floatingTexts = this.floatingTexts.filter(label => label.life > 0).slice(-80);
    for (const bomb of this.bombs) {
      if (!bomb.active) continue;
      bomb.timer -= dtMs;
      if (bomb.timer > 0) continue;
      bomb.active = false;
      for (const fighter of this.fighters) {
        if (fighter.dead || Math.hypot(fighter.x - bomb.x, fighter.y - bomb.y) > bomb.radius) continue;
        if (fighter.shieldHp > 0) fighter.shieldHp -= 5; else fighter.hp -= 5;
        fighter.flashFrames = 5;
      }
    }
    this.bombs = this.bombs.filter(bomb => bomb.active).slice(-40);
    for (const fighter of this.fighters) if (!fighter.dead && fighter.hp <= 0) this.awardKo(fighter, fighter.team === 1 ? 2 : 1);
    const floor = Math.max(innerHeight, document.documentElement.scrollHeight) - 12;
    const animateShards = this.visualEffects().animated;
    for (const shard of this.shards) {
      if (!animateShards) { shard.life = 0; continue; }
      shard.vy += 0.32 * dt;
      shard.x += shard.vx * dt; shard.y += shard.vy * dt; shard.angle += shard.spin * dt;
      shard.vx *= 0.995;
      if (shard.y + shard.height > floor) {
        shard.y = floor - shard.height;
        if (Math.abs(shard.vy) > 1.4) shard.vy *= -0.48; else shard.vy = 0;
        shard.vx *= 0.78; shard.spin *= 0.72;
      }
      shard.life -= dtMs;
    }
    this.shards = this.shards.filter(shard => shard.life > 0).slice(-180);
    this.screenShake *= Math.pow(0.08, dt);
  }

  damageTarget(target: Target, x: number, y: number, amount: number, color: string, force: number, incomingX = 0, incomingY = -1, ownerTeam = 0) {
    if (target.destroyed) return;
    const [directionX, directionY] = normalizeImpactDirection(incomingX, incomingY);
    const appliedDamage = materialDamage(amount, target.material);
    target.damage += appliedDamage;
    target.impactX = x; target.impactY = y; target.impactDX = directionX; target.impactDY = directionY; target.lastHitAt = performance.now();
    this.applyLocalImpact(target, x, y, directionX, directionY, appliedDamage, ownerTeam, color, force);
    this.recordFracture(target, x, y, directionX, directionY, appliedDamage, color);
    if (target.dynamic) { const impulse = impactImpulse(force); target.vx = (target.vx || 0) + directionX * impulse; target.vy = (target.vy || 0) + directionY * impulse; }
    this.shockwaves.push({ x, y, radius: 3, maxRadius: 16 + Math.min(32, force * 2.2), life: 220, maxLife: 220, color, width: 2 + Math.min(3, force * 0.12) });
    this.screenShake = Math.min(9, Math.max(this.screenShake, Math.min(7, force * 0.24)));
    this.floatingTexts.push({ x, y: y - 10, value: `-${Math.round(appliedDamage * 10)}`, color, life: 520 });
    const limit = this.targetLimit(target);
    const stage = Math.min(3, Math.floor(target.damage / limit * 4));
    if (stage > target.stage) {
      target.stage = stage;
      this.floatingTexts.push({ x, y: y - 28, value: target.boss ? `WARDEN PHASE ${stage}` : materialStageLabel(target.material, stage), color: target.boss ? "#ffe681" : color, life: 850 });
      this.screenShake = Math.max(this.screenShake, 2 + stage * 1.1);
    }
    const count = Math.max(1, Math.round(Math.min(9, Math.max(3, Math.round(amount * 1.6))) * this.visualEffects().particles));
    for (let i = 0; i < count && this.particles.length < 350; i++) {
      const angle = Math.random() * Math.PI * 2, speed = Math.min(9, 2 + force * 0.18 + Math.random() * 3);
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.5, life: 380 + Math.random() * 320, maxLife: 700, size: 2 + Math.random() * 4, color, active: true });
    }
    if (target.damage < limit) return;
    target.destroyed = true; this.score++;
    if (target.dynamic) (target.element as HTMLElement).style.display = "none";
    const combo = this.registerBreak(x, y, target.boss ? "#ffe681" : color);
    this.damage.push({ targetId: target.id, x: target.x, y: target.y, width: target.width, height: target.height });
    this.breakIntoShards(target, x, y, force, combo);
    this.shockwaves.push({ x, y, radius: 8, maxRadius: Math.min(340, 105 + force * 12 + combo * 12), life: 560, maxLife: 560, color: target.boss ? "#ffe681" : color, width: target.boss ? 7 : 4 });
    this.floatingTexts.push({ x: target.x + target.width / 2, y: target.y, value: target.boss ? "RIFT WARDEN DOWN!" : combo > 1 ? `PAGE BREAK · ×${combo}` : "PAGE BREAK!", color: target.boss ? "#ffe681" : "#fff0a6", life: 1200 });
    this.screenShake = Math.min(13, Math.max(this.screenShake, 7 + Math.min(6, force * 0.18) + Math.min(2, combo * 0.35)));
    this.chainBlast(target, x, y, color);
    this.updateHud();
  }

  targetLimit(target: Target) {
    const base = materialDurability(Math.max(2.5, Math.min(9, target.width * target.height / 11000)), target.material);
    const structuralFactor = this.matchDestructionTempo === "deep" ? 6 : target.width * target.height >= 6500 ? 3 : 1;
    return (target.boss ? base * 3 : base) * structuralFactor;
  }

  applyLocalImpact(target: Target, x: number, y: number, directionX: number, directionY: number, damage: number, ownerTeam = 0, color = "#b8ecff", force = 4) {
    if (!target.field) {
      const activeFields = [...this.targets.values()].filter(candidate => candidate.field && !candidate.destroyed).length;
      if (activeFields >= 16) return;
      target.field = createSegmentField(target.width, target.height, target.material) || undefined;
    }
    if (!target.field) return;
    const result = applyImpact(target.field, { targetId: target.id, x: x - target.x, y: y - target.y, directionX, directionY, damage });
    if (result.removedCells.length && target.dynamic) this.updateDynamicMask(target);
    for (const piece of result.detachedChunks) {
      if (this.chunks.length >= 48) break;
      const impulse = Math.min(12, Math.max(2, force * 0.55));
      this.chunks.push({ x: target.x + piece.x + piece.width / 2, y: target.y + piece.y + piece.height / 2,
        vx: directionX * impulse + (Math.random() - 0.5) * 2, vy: directionY * impulse - 1,
        width: piece.width, height: piece.height, mass: piece.mass, angle: 0, spin: (Math.random() - 0.5) * 0.12,
        material: target.material, color, sourceTargetId: target.id, mediaX: target.dynamic ? piece.x : undefined, mediaY: target.dynamic ? piece.y : undefined,
        ownerTeam, hitFighters: new Set(), secondaryBudget: 1, life: 4000 });
    }
  }

  updateDynamicMask(target: Target) {
    const mask = mediaMaskAlpha(target.field || null);
    if (!mask || !mask.alpha.includes(0)) return;
    const canvas = document.createElement("canvas"); canvas.width = mask.width; canvas.height = mask.height;
    const context = canvas.getContext("2d"); if (!context) return;
    const image = context.createImageData(mask.width, mask.height);
    for (let index = 0; index < mask.alpha.length; index++) {
      image.data[index * 4] = 255; image.data[index * 4 + 1] = 255; image.data[index * 4 + 2] = 255; image.data[index * 4 + 3] = mask.alpha[index];
    }
    context.putImageData(image, 0, 0);
    const value = `url("${canvas.toDataURL()}")`;
    const style = (target.element as HTMLElement).style;
    style.maskImage = value; style.setProperty("-webkit-mask-image", value);
    style.maskSize = "100% 100%"; style.maskRepeat = "no-repeat";
  }

  recordFracture(target: Target, x: number, y: number, directionX: number, directionY: number, amount: number, color: string) {
    const strength = Math.min(1.6, Math.max(0.2, amount / this.targetLimit(target) * 5));
    const seed = (Math.imul(target.fractures.length + 1, 2654435761) ^ Math.floor(x * 17) ^ Math.floor(y * 31) ^ Math.round(target.damage * 101)) >>> 0;
    const segments = createFracturePattern(target.width, target.height, x - target.x, y - target.y, directionX, directionY, strength, seed);
    if (!segments.length) return;
    target.fractures.push({ segments, color, strength, createdAt: performance.now() });
    if (target.fractures.length > 6) target.fractures.shift();
  }

  registerBreak(x: number, y: number, color: string) {
    const now = performance.now();
    this.breakCombo = now < this.comboUntil ? Math.min(8, this.breakCombo + 1) : 1;
    this.comboUntil = now + 1800;
    if (this.breakCombo > 1) this.floatingTexts.push({ x, y: y - 38, value: `COMBO ×${this.breakCombo}`, color, life: 1050 });
    return this.breakCombo;
  }

  chainBlast(source: Target, x: number, y: number, color: string) {
    const radius = source.boss ? 280 : Math.min(250, 150 + Math.max(0, this.breakCombo - 1) * 18);
    const nearby = [...this.targets.values()].filter(target => !target.destroyed && target !== source)
      .map(target => ({ target, distance: Math.hypot(target.x + target.width / 2 - x, target.y + target.height / 2 - y) }))
      .filter(item => item.distance < radius).sort((a, b) => a.distance - b.distance).slice(0, source.boss ? 8 : Math.min(8, 4 + this.breakCombo - 1));
    if (!nearby.length) return;
    this.chainBreaks += nearby.length;
    this.floatingTexts.push({ x, y: y - 42, value: `CHAIN REACTION ×${nearby.length}`, color, life: 1000 });
    for (const { target, distance } of nearby) {
      const amount = materialDamage((source.boss ? 2.4 : 1.8) * (1 - distance / radius), target.material);
      const impactX = target.x + target.width / 2, impactY = target.y + target.height / 2;
      const [directionX, directionY] = normalizeImpactDirection(impactX - x, impactY - y);
      target.impactX = impactX; target.impactY = impactY; target.impactDX = directionX; target.impactDY = directionY; target.lastHitAt = performance.now(); target.damage += amount;
      this.applyLocalImpact(target, impactX, impactY, directionX, directionY, amount);
      this.recordFracture(target, impactX, impactY, directionX, directionY, amount, color);
      if (target.dynamic) { const impulse = impactImpulse(source.boss ? 12 : 7) * (1 - distance / radius); target.vx = (target.vx || 0) + directionX * impulse; target.vy = (target.vy || 0) + directionY * impulse; }
      const stage = Math.min(3, Math.floor(target.damage / this.targetLimit(target) * 4));
      if (stage > target.stage) { target.stage = stage; this.floatingTexts.push({ x: impactX, y: impactY - 28, value: materialStageLabel(target.material, stage), color, life: 850 }); }
      this.screenShake = Math.max(this.screenShake, source.boss ? 8 : 5);
      if (target.damage >= this.targetLimit(target)) {
        target.destroyed = true; this.score++;
        if (target.dynamic) (target.element as HTMLElement).style.display = "none";
        const combo = this.registerBreak(impactX, impactY, color);
        this.damage.push({ targetId: target.id, x: target.x, y: target.y, width: target.width, height: target.height });
        this.breakIntoShards(target, impactX, impactY, amount * 2, combo);
        this.shockwaves.push({ x: impactX, y: impactY, radius: 5, maxRadius: Math.min(300, 90 + combo * 16), life: 480, maxLife: 480, color, width: 3 + Math.min(3, combo * 0.4) });
      }
    }
  }

  updateBossPulse(targets: Target[], now: number) {
    const boss = this.bossTarget;
    if (!boss || boss.destroyed || now < this.bossPulseAt || !targets.includes(boss)) return;
    this.bossPulseAt = now + 9000;
    const x = boss.x + boss.width / 2, y = boss.y + boss.height / 2;
    this.floatingTexts.push({ x, y: y - 36, value: "WARDEN PULSE!", color: "#ffe681", life: 1100 });
    this.screenShake = Math.max(this.screenShake, 5);
    for (const target of targets) {
      if (target === boss || target.destroyed || Math.hypot(target.x + target.width / 2 - x, target.y + target.height / 2 - y) > 190) continue;
      const targetX = target.x + target.width / 2, targetY = target.y + target.height / 2;
      this.damageTarget(target, targetX, targetY, 0.8, "#ffe681", 4, targetX - x, targetY - y);
    }
  }

  breakIntoShards(target: Target, x: number, y: number, force: number, combo = 1) {
    const effects = this.visualEffects();
    if (!effects.animated) return;
    const style = getComputedStyle(target.element);
    const color = style.backgroundColor !== "rgba(0, 0, 0, 0)" ? style.backgroundColor : style.color;
    if (target.material === "glass") {
      const count = Math.max(4, Math.round((10 + Math.min(8, combo)) * effects.particles));
      const seed = (Math.imul(Math.floor(x * 17) ^ Math.floor(y * 31) ^ Math.round(target.damage * 101), 2654435761) ^ target.fractures.length) >>> 0;
      const polygons = createGlassShardPolygons(target.width, target.height, x - target.x, y - target.y, count, seed);
      for (let i = 0; i < polygons.length && this.shards.length < 180; i++) {
        const polygon = polygons[i];
        const centerX = polygon.reduce((sum, point) => sum + point.x, 0) / polygon.length;
        const centerY = polygon.reduce((sum, point) => sum + point.y, 0) / polygon.length;
        const points = polygon.map(point => ({ x: point.x - centerX, y: point.y - centerY }));
        const width = Math.max(1, Math.max(...points.map(point => point.x)) - Math.min(...points.map(point => point.x)));
        const height = Math.max(1, Math.max(...points.map(point => point.y)) - Math.min(...points.map(point => point.y)));
        const [outX, outY] = normalizeImpactDirection(centerX - (x - target.x), centerY - (y - target.y));
        const speed = Math.min(16, 3 + force * 0.12 + combo * 0.3);
        this.shards.push({ x: target.x + centerX, y: target.y + centerY, vx: outX * speed + target.impactDX * force * 0.08,
          vy: outY * speed + target.impactDY * force * 0.08 - 1.2, width, height, angle: 0,
          spin: Math.sin(i * 12.9898 + seed) * 0.16, color: color || "rgba(175,235,255,.4)", material: "glass", points,
          life: 1800 + (i % 5) * 120, maxLife: 2280 });
      }
      return;
    }
    if (target.material === "paper") {
      const seed = (Math.imul(Math.floor(x * 17) ^ Math.floor(y * 31) ^ Math.round(target.damage * 101), 2654435761) ^ target.fractures.length) >>> 0;
      const strips = createPaperTearPolygons(target.width, target.height, x - target.x, y - target.y, seed);
      for (let i = 0; i < strips.length && this.shards.length < 180; i++) {
        const polygon = strips[i];
        const centerX = polygon.reduce((sum, point) => sum + point.x, 0) / polygon.length;
        const centerY = polygon.reduce((sum, point) => sum + point.y, 0) / polygon.length;
        const points = polygon.map(point => ({ x: point.x - centerX, y: point.y - centerY }));
        const upper = i === 0;
        const shear = upper ? -1 : 1;
        this.shards.push({ x: target.x + centerX, y: target.y + centerY,
          vx: shear * (0.7 + Math.min(2, force * 0.025)) + target.impactDX * force * 0.018,
          vy: shear * (1.1 + Math.min(2.6, force * 0.035)) + target.impactDY * force * 0.018,
          width: target.width, height: target.height / 2, angle: 0, spin: shear * 0.018,
          color: "rgba(245,231,193,.92)", material: "paper", points,
          life: 900 + i * 140, maxLife: 1180 });
      }
      return;
    }
    if (target.material === "stone") {
      const seed = (Math.imul(Math.floor(x * 19) ^ Math.floor(y * 29) ^ Math.round(target.damage * 97), 2246822519) ^ target.fractures.length) >>> 0;
      const count = Math.max(3, Math.min(5, Math.round(5 * effects.particles)));
      const chips = createStoneChipPolygons(target.width, target.height, x - target.x, y - target.y, count, seed);
      for (let i = 0; i < chips.length && this.shards.length < 180; i++) {
        const polygon = chips[i];
        const centerX = polygon.reduce((sum, point) => sum + point.x, 0) / polygon.length;
        const centerY = polygon.reduce((sum, point) => sum + point.y, 0) / polygon.length;
        const points = polygon.map(point => ({ x: point.x - centerX, y: point.y - centerY }));
        const [outX, outY] = normalizeImpactDirection(centerX - (x - target.x), centerY - (y - target.y));
        const speed = Math.min(6, 1.2 + force * 0.035);
        this.shards.push({ x: target.x + centerX, y: target.y + centerY,
          vx: outX * speed + target.impactDX * force * 0.018,
          vy: outY * speed + target.impactDY * force * 0.018 + 0.5,
          width: 14, height: 14, angle: 0, spin: Math.sin(i * 7.13 + seed) * 0.045,
          color: "#8993a1", material: "stone", points, life: 760 + i * 65, maxLife: 1085 });
      }
      return;
    }
    const count = Math.max(1, Math.round(Math.min(38, Math.max(12, Math.round(Math.sqrt(target.width * target.height) / 11) + combo * 2)) * effects.particles));
    for (let i = 0; i < count && this.shards.length < 180; i++) {
      const angle = (Math.PI * 2 * i / count) + (Math.random() - 0.5) * 0.55;
      const speed = 3 + Math.random() * 5 + Math.min(7, force * 0.15) + Math.min(3, combo * 0.35);
      const w = 5 + Math.random() * 16, h = 4 + Math.random() * 13;
      this.shards.push({ x: x + (Math.random() - 0.5) * target.width * 0.25, y: y + (Math.random() - 0.5) * target.height * 0.25,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2 - Math.random() * 2,
        width: w, height: h, angle: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.3,
        color, life: 1400 + Math.random() * 1100, maxLife: 2500 });
    }
  }

  draw(now: number) {
    const effects = this.visualEffects();
    const ctx = this.ctx; ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const replay = this.replayIndex === null ? null : this.snapshots[this.replayIndex];
    const damageAreas = replay?.destruction.areas ?? this.damage;
    const replayFields = replay?.destruction.fields;
    const replayFieldById = new Map(replayFields?.map(field => [field.targetId, field]) ?? []);
    const brokenIds = new Set(damageAreas.map(area => area.targetId));
    const renderTargets = replay ? new Map([...this.targets].map(([element, target]) => {
      const field = replayFieldById.get(target.id);
      const restoredField = field ? { ...target.field, width: field.width, height: field.height, cellSize: field.cellSize, cols: field.cols, removedCount: field.removed.length,
        cells: new Map(field.removed.map(key => [key, { stress: 0, removed: true }])) } as SegmentField : undefined;
      return [element, { ...target, destroyed: brokenIds.has(target.id), field: restoredField }] as const;
    })) : this.targets;
    const currentOpenings = replayFields ? replayFields.flatMap(snapshotOpeningRects) : [...this.targets.values()].filter(target => !target.destroyed && target.field?.removedCount)
      .flatMap(target => segmentOpeningRects(target.field!).map(cell => ({ targetId: target.id, x: target.x + cell.x, y: target.y + cell.y, width: cell.width, height: cell.height })));
    if (damageAreas.length || currentOpenings.length) {
      const covers: Array<{ x: number; y: number; width: number; height: number; color: string }> = [];
      const arenaRects: Array<{ x: number; y: number; width: number; height: number }> = [];
      const colorCache = new Map<Target, string>();
      const targetsById = new Map([...renderTargets.values()].map(target => [target.id, target]));
      const descendants = descendantLayersByElement(renderTargets);
      const addOpening = (target: Target, x: number, y: number, width: number, height: number) => {
        for (const rect of visibleOpeningRects(target, descendants, { x, y, width, height })) {
          const under = underlyingTargetForPoint(target, renderTargets, rect.x + rect.width / 2, rect.y + rect.height / 2);
          if (!under) { arenaRects.push(rect); continue; }
          let color = colorCache.get(under);
          if (!color) {
            const background = getComputedStyle(under.element).backgroundColor;
            color = background && background !== "transparent" && background !== "rgba(0, 0, 0, 0)" ? background : under.material === "paper" ? "#e9e0ce" : under.material === "stone" ? "#303543" : "#1a2234";
            colorCache.set(under, color);
          }
          covers.push({ ...rect, color });
        }
      };
      for (const area of damageAreas) {
        if (area.x + area.width < scrollX || area.y + area.height < scrollY || area.x > scrollX + innerWidth || area.y > scrollY + innerHeight) continue;
        const target = targetsById.get(area.targetId);
        if (target) addOpening(target, area.x, area.y, area.width, area.height);
        else arenaRects.push(area);
      }
      for (const cell of currentOpenings) {
        const target = targetsById.get(cell.targetId);
        if (target && cell.x + cell.width >= scrollX && cell.x <= scrollX + innerWidth && cell.y + cell.height >= scrollY && cell.y <= scrollY + innerHeight)
          addOpening(target, cell.x, cell.y, cell.width, cell.height);
      }
      for (const cover of covers) {
        ctx.fillStyle = cover.color;
        ctx.fillRect(cover.x - scrollX, cover.y - scrollY, cover.width, cover.height);
      }
      ctx.save(); ctx.beginPath();
      for (const area of arenaRects) ctx.rect(area.x - scrollX, area.y - scrollY, area.width, area.height);
      for (const target of renderTargets.values()) {
        if (target.destroyed || target.damage <= 0) continue;
        if (!replay && !target.field && !underlyingTargetForPoint(target, renderTargets, target.impactX, target.impactY)) {
          const r = 5 + Math.min(24, target.damage * 2.6);
          const x = target.impactX - scrollX, y = target.impactY - scrollY;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.clip();
      const sceneTime = effects.animated ? now : 0;
      if (this.variant === "classic") backgroundClassic(ctx, settings.theme as never, sceneTime, innerWidth, innerHeight, 0);
      else backgroundKs2(ctx, settings.theme as never, sceneTime, innerWidth, innerHeight, 0);
      this.drawArenaEnhancements(ctx, sceneTime);
      ctx.restore();
    }
    ctx.save();
    const visualShake = this.screenShake * effects.shake;
    const shakeX = Math.sin(now * 0.083) * visualShake, shakeY = Math.cos(now * 0.071) * visualShake * 0.55;
    ctx.translate(shakeX, shakeY); ctx.translate(-scrollX, -scrollY);
    if (settings.environment === "lava") {
      const floorY = Math.max(innerHeight, document.documentElement.scrollHeight) - 18;
      if (floorY >= scrollY - 12 && floorY <= scrollY + innerHeight + 12) {
        const heat = ctx.createLinearGradient(0, floorY - 18, 0, floorY + 5);
        heat.addColorStop(0, "rgba(255,92,30,0)"); heat.addColorStop(0.7, "rgba(255,92,30,.75)"); heat.addColorStop(1, "rgba(255,217,92,.9)");
        ctx.fillStyle = heat; ctx.fillRect(scrollX, floorY - 18, innerWidth, 24);
      }
    }
    if (settings.modifier === "shrinking_arena") {
      const worldWidth = Math.max(innerWidth, document.documentElement.scrollWidth), worldHeight = Math.max(innerHeight, document.documentElement.scrollHeight);
      const shrink = Math.min(0.32, this.elapsedMatchMs() / this.matchDurationMs * 0.32);
      const left = 18 + worldWidth * shrink, top = 85 + Math.max(0, worldHeight - 120) * shrink;
      ctx.save(); ctx.strokeStyle = "rgba(255,106,135,.78)"; ctx.shadowColor = "#ff5f8c"; ctx.shadowBlur = 12; ctx.lineWidth = 3; ctx.setLineDash([12, 9]);
      ctx.strokeRect(left, top, Math.max(36, worldWidth - left * 2), Math.max(80, worldHeight - top - 18)); ctx.setLineDash([]); ctx.restore();
    }
    for (const bomb of this.bombs) {
      if (!bomb.active || bomb.x < scrollX - 160 || bomb.x > scrollX + innerWidth + 160 || bomb.y < scrollY - 160 || bomb.y > scrollY + innerHeight + 160) continue;
      ctx.strokeStyle = "#b177ff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bomb.x, bomb.y, Math.min(bomb.radius, 18 + (3000 - bomb.timer) * 0.025), 0, Math.PI * 2); ctx.stroke();
    }
    for (const wave of this.shockwaves) {
      if (!effects.animated) continue;
      if (wave.x < scrollX - wave.maxRadius || wave.x > scrollX + innerWidth + wave.maxRadius || wave.y < scrollY - wave.maxRadius || wave.y > scrollY + innerHeight + wave.maxRadius) continue;
      const progress = 1 - wave.life / wave.maxLife;
      ctx.save(); ctx.globalAlpha = Math.max(0, 1 - progress) * 0.85; ctx.strokeStyle = wave.color;
      ctx.lineWidth = Math.max(1, wave.width * (1 - progress * 0.72)); ctx.shadowColor = wave.color; ctx.shadowBlur = 12 * (1 - progress * 0.5);
      ctx.beginPath(); ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
    for (const shot of this.projectiles) {
      if (shot.x < scrollX - 20 || shot.x > scrollX + innerWidth + 20 || shot.y < scrollY - 20 || shot.y > scrollY + innerHeight + 20) continue;
      ctx.save(); ctx.globalAlpha = 0.44; ctx.strokeStyle = shot.color; ctx.lineWidth = shot.type === "fireball" ? 7 : 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(shot.previousX, shot.previousY); ctx.lineTo(shot.x, shot.y); ctx.stroke(); ctx.restore();
      ctx.shadowColor = shot.color; ctx.shadowBlur = shot.type === "fireball" ? 18 : 9;
      ctx.fillStyle = shot.color; ctx.beginPath(); ctx.arc(shot.x, shot.y, shot.type === "fireball" ? 7 : 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }
    for (const particle of this.particles) {
      if (!effects.animated || !particle.active || particle.x < scrollX || particle.x > scrollX + innerWidth || particle.y < scrollY || particle.y > scrollY + innerHeight) continue;
      ctx.globalAlpha = Math.max(0, Math.min(1, particle.life / Math.max(1, particle.maxLife)));
      ctx.fillStyle = particle.color; ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    ctx.globalAlpha = 1;
    for (const target of renderTargets.values()) {
      if (!target.dynamic || target.destroyed || target.x > scrollX + innerWidth || target.x + target.width < scrollX || target.y > scrollY + innerHeight || target.y + target.height < scrollY) continue;
      const el = target.element as HTMLElement;
      if (replay && el instanceof HTMLVideoElement && !replay.videos.some(video => video.targetId === target.id)) continue;
      try {
        ctx.save(); ctx.beginPath();
        if (target.field?.removedCount) {
          for (let row = 0; row < target.field.rows; row++) for (let col = 0; col < target.field.cols; col++) {
            const cellX = col * target.field.cellSize, cellY = row * target.field.cellSize;
            if (isSegmentSolid(target.field, cellX, cellY)) ctx.rect(target.x + cellX, target.y + cellY,
              Math.min(target.field.cellSize, target.width - cellX), Math.min(target.field.cellSize, target.height - cellY));
          }
        } else ctx.rect(target.x, target.y, target.width, target.height);
        ctx.clip();
        if (el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0) {
          const placement = containedMediaPlacement(el.naturalWidth, el.naturalHeight, target.width, target.height, 0, 0);
          if (placement) ctx.drawImage(el, target.x + placement.x, target.y + placement.y, placement.width, placement.height);
        } else if (el instanceof HTMLVideoElement && el.readyState >= 2) {
          const placement = containedMediaPlacement(el.videoWidth, el.videoHeight, target.width, target.height, 0, 0);
          if (placement) ctx.drawImage(el, target.x + placement.x, target.y + placement.y, placement.width, placement.height);
        } else if (el instanceof HTMLDivElement) {
          const style = getComputedStyle(el); ctx.fillStyle = style.backgroundColor === "rgba(0, 0, 0, 0)" ? "#356781" : style.backgroundColor;
          ctx.fillRect(target.x, target.y, target.width, target.height);
          ctx.fillStyle = style.color; ctx.font = "bold 12px system-ui"; ctx.textAlign = "center"; ctx.fillText(el.textContent || "SANDBOX PROP", target.x + target.width / 2, target.y + target.height / 2);
        }
      } catch { /* A media frame may be unavailable during its first decode. */ }
      finally { ctx.restore(); }
    }
    for (const target of this.targets.values()) {
      if (replay) continue;
      if (target.destroyed) continue;
      const x = target.impactX, y = target.impactY, strength = Math.min(1, target.damage / 6);
      const age = now - target.lastHitAt;
      ctx.save();
      if (target.damage > 0) {
        ctx.beginPath(); ctx.rect(target.x, target.y, target.width, target.height); ctx.clip();
        const colors: Record<PageMaterial, string> = { glass: "#e7fbff", paper: "#fff0a6", stone: "#d5dce9", digital: this.variant === "classic" ? "#ffb14e" : "#c7a6ff" };
        if (target.material === "paper") {
          const creaseY = Math.max(target.y + target.height * 0.12, Math.min(target.y + target.height * 0.88, target.impactY));
          const creaseSpan = target.width * 0.34;
          ctx.globalAlpha = Math.min(0.42, 0.2 + strength * 0.06);
          ctx.strokeStyle = "rgba(112,76,48,.88)"; ctx.lineWidth = 0.8 + target.stage * 0.16;
          ctx.beginPath(); ctx.moveTo(target.impactX - creaseSpan, creaseY + 1.2);
          ctx.lineTo(target.impactX - creaseSpan * 0.48, creaseY - 0.8);
          ctx.lineTo(target.impactX, creaseY);
          ctx.lineTo(target.impactX + creaseSpan * 0.52, creaseY + 1.1);
          ctx.lineTo(target.impactX + creaseSpan, creaseY - 0.6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(target.impactX - creaseSpan * 0.18, creaseY + 0.15);
          ctx.lineTo(target.impactX - creaseSpan * 0.26, creaseY - Math.max(3, target.height * 0.08));
          ctx.moveTo(target.impactX + creaseSpan * 0.2, creaseY + 0.15);
          ctx.lineTo(target.impactX + creaseSpan * 0.31, creaseY + Math.max(3, target.height * 0.07)); ctx.stroke();
        }
        if (target.material === "stone") {
          const seamLength = Math.min(28, 8 + target.stage * 6);
          const seamX = target.impactDX || 1, seamY = target.impactDY || 0.35;
          const seamNorm = Math.hypot(seamX, seamY) || 1;
          ctx.globalAlpha = 0.34 + strength * 0.24;
          ctx.lineCap = "square"; ctx.strokeStyle = "rgba(24,31,42,.92)"; ctx.lineWidth = 2 + target.stage * 0.55;
          ctx.beginPath(); ctx.moveTo(x - seamX / seamNorm * seamLength, y - seamY / seamNorm * seamLength);
          ctx.lineTo(x + seamX / seamNorm * seamLength, y + seamY / seamNorm * seamLength); ctx.stroke();
          ctx.globalAlpha *= 0.52; ctx.strokeStyle = "rgba(226,233,241,.82)"; ctx.lineWidth = 0.65;
          ctx.beginPath(); ctx.moveTo(x - seamX / seamNorm * seamLength * 0.72, y - seamY / seamNorm * seamLength * 0.72 - 1);
          ctx.lineTo(x + seamX / seamNorm * seamLength * 0.6, y + seamY / seamNorm * seamLength * 0.6 - 1); ctx.stroke();
        }
        if (target.material === "digital") {
          const seed = (Math.imul(Math.floor(target.impactX * 13) ^ Math.floor(target.impactY * 23) ^ Math.round(target.damage * 109), 3266489917) ^ target.stage) >>> 0;
          const count = Math.max(3, Math.round((4 + target.stage) * effects.particles));
          const blocks = createDigitalTearBlocks(target.width, target.height, target.impactX - target.x, target.impactY - target.y, count, seed);
          const accent = this.variant === "classic" ? "255,177,78" : "187,145,255";
          const age = Math.max(0, now - target.lastHitAt);
          for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            ctx.globalAlpha = 0.18 + strength * 0.12;
            ctx.fillStyle = i % 2 ? "rgba(9,12,20,.86)" : `rgba(${accent},.72)`;
            ctx.fillRect(target.x + block.x, target.y + block.y, block.width, block.height);
            if (effects.animated && age < 240 && i % 2 === 0) {
              const tearOffset = Math.min(5, Math.max(1, block.height + 1));
              ctx.globalAlpha = 0.24 * (1 - age / 240);
              ctx.fillStyle = `rgba(${accent},.9)`;
              ctx.fillRect(target.x + block.x, target.y + block.y + tearOffset, block.width, 1);
            }
          }
        }
        for (const fracture of target.fractures) {
          const fresh = effects.animated ? Math.max(0, 1 - (now - fracture.createdAt) / 180) : 0;
          const alpha = Math.min(0.9, 0.24 + fracture.strength * 0.25 + fresh * 0.3 + strength * 0.12);
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = target.material === "glass" ? "rgba(240,252,255,.85)" : colors[target.material];
          ctx.lineWidth = target.material === "stone" ? 1.35 + target.stage * 0.38 : target.material === "paper" ? 0.9 + target.stage * 0.18 : 0.75 + target.stage * 0.2;
          ctx.shadowColor = target.material === "glass" || target.material === "digital" ? fracture.color : "transparent";
          ctx.shadowBlur = target.material === "glass" ? 3 + fresh * 7 : target.material === "digital" ? 2 + fresh * 4 : 0;
          ctx.beginPath();
          for (const segment of fracture.segments) {
            ctx.moveTo(target.x + segment.x1, target.y + segment.y1);
            ctx.lineTo(target.x + segment.x2, target.y + segment.y2);
          }
          ctx.stroke();
          if (target.material === "glass") {
            ctx.globalAlpha = alpha * 0.38; ctx.strokeStyle = fracture.color; ctx.lineWidth = 0.55; ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = effects.animated && age < 90 ? 0.75 : 0.34 + strength * 0.16;
        ctx.strokeStyle = colors[target.material]; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(x, y, 2.4 + strength * 3.2, 0, Math.PI * 2); ctx.stroke();
      }
      if (target.boss) {
        if (target.damage === 0) ctx.globalAlpha = 0.75;
        const pulse = effects.animated ? 0.5 + Math.sin(now * 0.006) * 0.5 : 0.5;
        const radius = Math.max(target.width, target.height) * (0.7 + pulse * 0.22);
        ctx.strokeStyle = `rgba(255,230,129,${0.45 + pulse * 0.45})`; ctx.lineWidth = 3; ctx.setLineDash([8, 7]);
        ctx.beginPath(); ctx.ellipse(target.x + target.width / 2, target.y + target.height / 2, radius * 0.62, radius * 0.42, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.font = "bold 12px system-ui"; ctx.textAlign = "center"; ctx.fillStyle = "#fff0a6"; ctx.fillText(`RIFT WARDEN · ${Math.max(0, 100 - Math.round(target.damage / this.targetLimit(target) * 100))}%`, target.x + target.width / 2, target.y - 12);
      }
      ctx.restore();
    }
    const restore: Array<{ fighter: Fighter; x: number; y: number; angle: number }> = [];
    const replayFighters = new Map(replay?.fighters.map(point => [point.id, point]) ?? []);
    if (replay) this.fighters.forEach(fighter => { const point = replayFighters.get(fighter.id); if (point) { restore.push({ fighter, x: fighter.x, y: fighter.y, angle: fighter.angle }); fighter.x = point.x; fighter.y = point.y; fighter.angle = point.angle; } });
    for (const fighter of this.fighters) {
      if (replay && !replayFighters.has(fighter.id)) continue;
      if (fighter.x < scrollX - 100 || fighter.x > scrollX + innerWidth + 100 || fighter.y < scrollY - 100 || fighter.y > scrollY + innerHeight + 100) continue;
      if (this.variant === "classic") {
        renderClassic(ctx, fighter as ReturnType<typeof spawnClassic>, effects.animated && fighter.flashFrames > 0, 1, settings.theme as never, false, true, now);
        if (settings.displayHp) hpClassic(ctx, fighter as ReturnType<typeof spawnClassic>, settings.modifier as never, false, settings.theme as never);
      } else {
        renderKs2(ctx, fighter as ReturnType<typeof spawnKs2>, effects.animated && fighter.flashFrames > 0, 1, settings.theme as never, false, true, now);
        if (settings.displayHp) hpKs2(ctx, fighter as ReturnType<typeof spawnKs2>, settings.modifier as never, false, settings.theme as never);
      }
    }
    for (const state of restore) { state.fighter.x = state.x; state.fighter.y = state.y; state.fighter.angle = state.angle; }
    const chunkSources = new Map([...this.targets.values()].filter(target => target.dynamic).map(target => [target.id, target]));
    if (effects.animated) for (const chunk of replay?.destruction.chunks ?? this.chunks) {
      if (chunk.x + chunk.width < scrollX || chunk.x - chunk.width > scrollX + innerWidth || chunk.y + chunk.height < scrollY || chunk.y - chunk.height > scrollY + innerHeight) continue;
      ctx.save(); ctx.translate(chunk.x, chunk.y); ctx.rotate(chunk.angle);
      const depth = chunk.material === "stone" ? 5 : chunk.material === "glass" ? 3 : 2;
      ctx.fillStyle = "rgba(2,5,14,.28)"; ctx.fillRect(-chunk.width / 2 + 5, -chunk.height / 2 + 7, chunk.width, chunk.height);
      ctx.fillStyle = chunk.material === "paper" ? "#e9deca" : chunk.material === "stone" ? "#747f91" : chunk.material === "glass" ? "#a6e7f2" : "#1c3044";
      ctx.fillRect(-chunk.width / 2, -chunk.height / 2, chunk.width, chunk.height);
      const source = chunk.sourceTargetId === undefined ? undefined : chunkSources.get(chunk.sourceTargetId);
      const media = source?.element;
      if (chunk.mediaX !== undefined && chunk.mediaY !== undefined && source &&
          ((media instanceof HTMLImageElement && media.complete && media.naturalWidth > 0) ||
           (media instanceof HTMLVideoElement && media.readyState >= 2))) {
        const naturalWidth = media instanceof HTMLImageElement ? media.naturalWidth : media.videoWidth;
        const naturalHeight = media instanceof HTMLImageElement ? media.naturalHeight : media.videoHeight;
        const placement = containedMediaPlacement(naturalWidth, naturalHeight, source.width, source.height, chunk.mediaX, chunk.mediaY);
        if (placement) {
          ctx.save(); ctx.beginPath(); ctx.rect(-chunk.width / 2, -chunk.height / 2, chunk.width, chunk.height); ctx.clip();
          try { ctx.drawImage(media, placement.x - chunk.width / 2, placement.y - chunk.height / 2, placement.width, placement.height); }
          catch { /* The first video frame may not have decoded yet. */ }
          ctx.restore();
        }
      }
      ctx.fillStyle = this.variant === "classic" ? "#ad5835" : "#61509f";
      ctx.fillRect(-chunk.width / 2, chunk.height / 2 - depth, chunk.width, depth);
      ctx.strokeStyle = chunk.color; ctx.lineWidth = 1; ctx.strokeRect(-chunk.width / 2, -chunk.height / 2, chunk.width, chunk.height);
      ctx.restore();
    }
    for (const shard of this.shards) {
      if (!effects.animated || shard.x < scrollX - 30 || shard.x > scrollX + innerWidth + 30 || shard.y < scrollY - 30 || shard.y > scrollY + innerHeight + 30) continue;
      ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, shard.life / shard.maxLife)); ctx.translate(shard.x, shard.y); ctx.rotate(shard.angle);
      if (shard.points) {
        ctx.beginPath(); ctx.moveTo(shard.points[0].x, shard.points[0].y);
        for (const point of shard.points.slice(1)) ctx.lineTo(point.x, point.y);
        ctx.closePath();
        if (shard.material === "paper") {
          ctx.fillStyle = "rgba(245,231,193,.9)"; ctx.fill();
          ctx.strokeStyle = "rgba(105,70,47,.92)"; ctx.lineWidth = 1.15; ctx.stroke();
          ctx.globalAlpha *= 0.48; ctx.strokeStyle = "rgba(255,255,239,.92)"; ctx.lineWidth = 0.65; ctx.stroke();
        } else if (shard.material === "stone") {
          ctx.fillStyle = "#8993a1"; ctx.fill();
          ctx.strokeStyle = "rgba(30,38,49,.96)"; ctx.lineWidth = 1.35; ctx.stroke();
          ctx.globalAlpha *= 0.7; ctx.strokeStyle = "rgba(219,226,234,.88)"; ctx.lineWidth = 0.7; ctx.stroke();
        } else {
          ctx.fillStyle = "rgba(175,235,255,.42)"; ctx.fill();
          ctx.strokeStyle = "rgba(245,254,255,.88)"; ctx.lineWidth = 1.2; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(shard.points[0].x, shard.points[0].y); ctx.lineTo(shard.points[1].x, shard.points[1].y);
          ctx.strokeStyle = this.variant === "classic" ? "rgba(255,177,78,.72)" : "rgba(187,145,255,.76)"; ctx.lineWidth = 0.65; ctx.stroke();
        }
      } else {
        ctx.fillStyle = shard.color; ctx.fillRect(-shard.width / 2, -shard.height / 2, shard.width, shard.height);
        ctx.strokeStyle = this.variant === "classic" ? "#ffb14e" : "#bb91ff"; ctx.lineWidth = 1; ctx.strokeRect(-shard.width / 2, -shard.height / 2, shard.width, shard.height);
      }
      ctx.restore();
    }
    ctx.font = "bold 14px system-ui"; ctx.textAlign = "center";
    for (const label of this.floatingTexts) { ctx.fillStyle = label.color; ctx.fillText(label.value, label.x, label.y); }
    ctx.restore();
  }

  drawArenaEnhancements(ctx: CanvasRenderingContext2D, time: number) {
    const w = innerWidth, h = innerHeight;
    const hot = this.variant === "classic" ? "255,92,48" : "157,105,255";
    const cool = this.variant === "classic" ? "255,196,100" : "84,229,255";
    const pulse = this.visualEffects().animated ? 0.5 + Math.sin(time * 0.0022) * 0.5 : 0.5;
    if (settings.environment === "blackout") { ctx.fillStyle = "rgba(4,3,12,.82)"; ctx.fillRect(0, 0, w, h); }
    if (this.variant === "ks2" && settings.environment === "void_storm") { ctx.fillStyle = `rgba(18,0,48,${0.12 + pulse * 0.1})`; ctx.fillRect(0, 0, w, h); }
    if (this.variant === "ks2" && settings.environment === "solar_flares") {
      const x = w * (0.5 + Math.sin(time * 0.0005) * 0.5), y = h * (0.5 + Math.cos(time * 0.0007) * 0.5);
      const flare = ctx.createRadialGradient(x, y, 3, x, y, 105); flare.addColorStop(0, "rgba(255,244,159,.85)"); flare.addColorStop(0.2, "rgba(255,132,45,.42)"); flare.addColorStop(1, "rgba(255,80,28,0)");
      ctx.fillStyle = flare; ctx.fillRect(x - 105, y - 105, 210, 210);
    }
    if (this.variant === "ks2" && settings.environment === "magnetic_fields") {
      ctx.save(); ctx.globalAlpha = 0.22 + pulse * 0.08; ctx.strokeStyle = "#73caff"; ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) { const y = (time * 0.05 + i * 28) % h; ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(w * 0.25, y - 18, w * 0.75, y + 18, w, y); ctx.stroke(); }
      ctx.restore();
    }
    const glow = ctx.createRadialGradient(w * 0.52, h * 0.48, 4, w * 0.52, h * 0.48, Math.max(w, h) * 0.8);
    glow.addColorStop(0, `rgba(${hot},${0.14 + pulse * 0.08})`);
    glow.addColorStop(0.58, `rgba(${hot},0.035)`);
    glow.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

    // Keep the official theme as the base, then add the arena's moving combat grid.
    ctx.save(); ctx.globalAlpha = 0.28 + pulse * 0.1; ctx.strokeStyle = `rgba(${cool},0.78)`; ctx.lineWidth = 1;
    const horizon = h * 0.46, drift = (time * 0.025) % 28;
    for (let x = -w; x <= w * 2; x += 42) {
      ctx.beginPath(); ctx.moveTo(w * 0.5 + (x - w * 0.5) * 0.08, horizon); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = horizon + drift; y < h; y += 28) {
      const depth = (y - horizon) / (h - horizon);
      ctx.globalAlpha = (0.08 + depth * 0.22) * (0.8 + pulse * 0.2);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.globalAlpha = 0.48 + pulse * 0.18; ctx.shadowColor = `rgb(${hot})`; ctx.shadowBlur = 18;
    ctx.strokeStyle = `rgba(${hot},0.7)`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.54, w * (0.16 + pulse * 0.012), h * 0.12, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([10, 12]); ctx.lineDashOffset = -time * 0.035;
    ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.54, w * 0.24, h * 0.19, 0, 0.15, Math.PI * 1.85); ctx.stroke();
    ctx.setLineDash([]); ctx.shadowBlur = 0; ctx.restore();

    ctx.save();
    for (let i = 0; i < 26; i++) {
      const x = (i * 173 + time * (0.012 + (i % 3) * 0.004)) % w;
      const y = (i * 97 + Math.sin(time * 0.001 + i) * 18) % h;
      const alpha = 0.22 + 0.35 * (0.5 + Math.sin(time * 0.004 + i * 2) * 0.5);
      ctx.globalAlpha = alpha; ctx.fillStyle = i % 3 === 0 ? `rgb(${cool})` : `rgb(${hot})`;
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8; ctx.fillRect(x, y, i % 4 === 0 ? 3 : 2, i % 4 === 0 ? 3 : 2);
    }
    ctx.restore();
  }

  action(name: string) {
    if (name === "exit") { this.stop(); return; }
    if (name === "pause") { if (this.matchFinished) return; this.paused = !this.paused; if (this.paused) pauseVideos([...this.targets.values()]); else { this.replayIndex = null; this.showReplayVideos(null); resumeVideos([...this.targets.values()]); } (this.root.querySelector('[data-action="pause"]') as HTMLElement).textContent = this.paused ? "Resume" : "Pause"; return; }
    if (name === "close" || (this.panel.dataset.open === "true" && this.panel.dataset.view === name)) { this.panel.dataset.open = "false"; return; }
    if (name === "creator" && this.panel.dataset.view === "creator" && this.panel.dataset.open === "true") { this.panel.dataset.minimized = this.panel.dataset.minimized === "true" ? "false" : "true"; return; }
    this.panel.dataset.view = name; this.panel.dataset.open = "true"; this.panel.dataset.minimized = "false";
    const optionLabel = (option: string, key: keyof Settings) => {
      const label = ({ none: "None", sudden_death: "Sudden Death", shrinking_arena: "Shrinking Arena", lok_bounty: "LoK Bounty", titans: "Titans", vampire_kiss: "Vampire's Kiss", time_distortion: "Time Distortion", chaos_vortex: "Chaos Vortex", gravity_well: "Gravity Well", melee_mash: "Melee Mash", ranged_test: "Ranged Test", blackhole: "Black Hole", gameboy: "Game Boy", paper_sketch: "Paper Sketch", wireframe_matrix: "Wireframe Matrix", blood_moon: "Blood Moon", runesite_ultimate: "Runesite Ultimate", neon_abyss: "Neon Abyss", rgb_cycle: "RGB Cycle", glassmorphism: "Glassmorphism", celestial_forge: "Celestial Forge", neon_overdrive: "Neon Overdrive", matrix_reloaded: "Matrix Reloaded", stellar_drift: "Stellar Drift", neon_pulse: "Neon Pulse", obsidian_shard: "Obsidian Shard", retro_wave: "Retro Wave", pixel_dream: "Pixel Dream", lava: "Lava Floor", storm: "Storm", blackout: "Blackout" } as Record<string, string>)[option] || option.replaceAll("_", " ").replace(/\b\w/g, char => char.toUpperCase());
      const pageAdapted = pageOnlyModifierSet.has(option) || (key === "environment" && this.variant === "ks2" && ks2PageEnvironmentSet.has(option));
      if (key === "matchDurationMs") return this.durationLabel(Number(option));
      if (key === "npcSide") return option === "1" ? "Left" : "Right";
      return pageAdapted ? `${label} · PAGE MODE` : label;
    };
    const select = (label: string, key: keyof Settings, options: string[]) => `<label>${label}<select data-setting="${key}">${options.map(option => `<option value="${option}" ${String(settings[key]) === option ? "selected" : ""}>${optionLabel(option, key)}</option>`).join("")}</select></label>`;
    const npc = `<label>NPC opponent<input data-setting="npcEnabled" type="checkbox" ${settings.npcEnabled ? "checked" : ""}></label>`;
    if (name === "creator") {
      this.panel.innerHTML = `<div data-creator-head><h2>Creative Sandbox · Live Match</h2><button data-minimize>Minimize</button></div><p class="notice">These objects share the live match physics. Fighters collide with and break them; the page underneath is restored when you leave.</p><section><strong>Starter scenes</strong><div class="controls"><button data-scene="neon">Neon tiles</button><button data-scene="ruins">Rift ruins</button><button data-scene="garden">Sky garden</button></div></section><section><label>Add image or video<input data-upload type="file" accept="image/*,video/mp4,video/webm,video/ogg"></label></section><section><label>Match replay · scrub while paused<input data-timeline type="range" min="0" max="${Math.max(0, this.snapshots.length - 1)}" value="${this.replayIndex ?? Math.max(0, this.snapshots.length - 1)}"></label><small data-replay-time>${Math.ceil((this.snapshots[this.replayIndex ?? Math.max(0, this.snapshots.length - 1)]?.at || 0) / 1000)}s</small><label>Video playback position<input data-video-timeline type="range" min="0" max="0" value="0"></label></section><section class="controls"><button data-rebuild>Rebuild scene</button><button data-save>Save scene</button><button data-open-scene>Open latest scene</button><button data-export>Export arena still</button><button data-record>Record 8-second replay</button></section><p class="notice" data-creator-status role="status">Local media and scenes stay on this device. Drag props to place them. Video stays muted.</p>`;
      this.panel.querySelector("[data-minimize]")?.addEventListener("click", () => { this.panel.dataset.minimized = "true"; });
      this.panel.querySelectorAll<HTMLButtonElement>("[data-scene]").forEach(button => button.addEventListener("click", () => { this.addStarterScene(button.dataset.scene || "neon"); this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Starter props added to the live physics world."; }));
      this.panel.querySelector<HTMLInputElement>("[data-upload]")?.addEventListener("change", event => { const file = (event.currentTarget as HTMLInputElement).files?.[0]; if (!file) return; if (!file.type.startsWith("image/") && !["video/mp4", "video/webm", "video/ogg"].includes(file.type)) { this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Choose an image, MP4, WebM, or Ogg video."; return; } if (file.size > 120 * 1024 * 1024) { this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Choose a file smaller than 120 MB."; return; } const media = document.createElement(file.type.startsWith("video/") ? "video" : "img") as HTMLImageElement | HTMLVideoElement; media.src = URL.createObjectURL(file); media.setAttribute("aria-label", file.name); if (media instanceof HTMLVideoElement) { this.activeVideo = media; media.controls = true; media.muted = true; media.loop = true; media.playsInline = true; media.addEventListener("loadedmetadata", () => this.syncVideoTimeline()); media.addEventListener("timeupdate", () => this.syncVideoTimeline()); } this.addSandboxObject(media); if (media instanceof HTMLVideoElement && !this.paused) void media.play().catch(() => {}); this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = `${file.name} added as a movable physics target.`; });
      this.panel.querySelector<HTMLInputElement>("[data-video-timeline]")?.addEventListener("input", event => { if (this.activeVideo) this.activeVideo.currentTime = Number((event.currentTarget as HTMLInputElement).value); });
      this.panel.querySelector("[data-rebuild]")?.addEventListener("click", () => this.rebuildScene());
      this.panel.querySelector("[data-save]")?.addEventListener("click", () => { void this.saveScene().then(() => this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Scene saved to this device.").catch(() => this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Local scene storage is unavailable in this browser."); });
      this.panel.querySelector("[data-open-scene]")?.addEventListener("click", () => { void this.openScene().then(() => this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Latest saved scene opened.").catch(() => this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Could not open the saved scene."); });
      this.panel.querySelector("[data-export]")?.addEventListener("click", () => this.exportScene());
      this.panel.querySelector("[data-record]")?.addEventListener("click", () => this.recordReplay());
      this.panel.querySelector<HTMLInputElement>("[data-timeline]")?.addEventListener("input", event => { const input = event.currentTarget as HTMLInputElement; this.replayIndex = Number(input.value); this.paused = true; (this.root.querySelector('[data-action="pause"]') as HTMLElement).textContent = "Resume"; const snapshot = this.snapshots[this.replayIndex]; const targets = [...this.targets.values()]; pauseVideos(targets); if (snapshot) { seekVideos(targets, snapshot.videos); this.showReplayVideos(snapshot); } this.syncVideoTimeline(); this.panel.querySelector<HTMLElement>("[data-replay-time]")!.textContent = `${Math.floor((snapshot?.at || 0) / 1000)}s · paused`; });
      this.syncVideoTimeline();
    } else if (name === "bestiary") {
      const entries = this.variant === "classic" ? classicBestiary : ks2Bestiary;
      this.panel.innerHTML = `<h2>${this.variant === "classic" ? "Classic" : "KS2"} Bestiary</h2><p class="notice">Choose a fighter for the next spawn.</p>${select("Spawn fighter", "fighter", entries.filter(e => e.role !== "Weapon" && e.role !== "Relic").map(e => e.id))}<div>${entries.map(e => `<div class="entry"><strong style="color:${e.color}">${e.name}</strong><small>${e.role} · HP ${e.hp} · ${e.weapon}</small><div>${e.lore}</div></div>`).join("")}</div>`;
    } else if (name === "modifiers") {
      const themeChoices = this.variant === "classic" ? classicThemes : ks2Themes;
      const modifierChoices = this.variant === "classic" ? classicModifiers : ks2Modifiers;
      const environmentChoices = this.variant === "classic" ? classicEnvironments : ks2Environments;
      const modeNote = this.variant === "classic" ? "The Classic catalog is preserved; Gravity Well, Time Distortion, and Chaos Vortex are clearly labeled page-mode adaptations." : "The KS2 theme menu and arena environment controls match the live game; solar flares, magnetic fields, void storm, and three extra force modifiers are labeled page-mode adaptations.";
      this.panel.innerHTML = `<h2>LoK Game Modifiers · M</h2><p class="notice">${modeNote} Fighter data comes from this version's Bestiary. Full-arena-only controls stay linked to the standalone game.</p>${select("Movement", "motion", ["battle", "dvd"])}${select("Combat modifier", "modifier", modifierChoices)}${select("Environment", "environment", environmentChoices)}${select("Weapon loadout", "weapon", weapons)}${select("Arena theme", "theme", themeChoices)}${select("Spawn fighter", "fighter", (this.variant === "classic" ? classicBestiary : ks2Bestiary).filter(e => e.role !== "Weapon" && e.role !== "Relic").map(e => e.id))}<label>Fighter speed<input data-setting="speed" type="range" min="0.5" max="3" step="0.1" value="${settings.speed}"></label><p class="notice"><a href="https://demo.gsix.online/games/kinetic-${this.variant}" target="_blank" rel="noopener">Open the full ${this.variant === "classic" ? "Classic" : "KS2"} arena ↗</a></p>`;
    } else {
      this.panel.innerHTML = `<h2>Settings</h2><label>Version<select data-version><option value="classic" ${this.variant === "classic" ? "selected" : ""}>Classic (1)</option><option value="ks2" ${this.variant === "ks2" ? "selected" : ""}>KS2 (alpha)</option></select></label>${npc}<button data-resume-npc>Resume NPC</button><p class="notice">Tap A/L or a team control to launch. Hold to keep launching; pressing the NPC side takes control for 12 seconds.</p>${select("NPC side · next match", "npcSide", pageSides)}<p class="notice">Player 1 launches from the opposite side. This change applies next match.</p>${select("Match duration", "matchDurationMs", matchDurations)}${select("Destruction · next match", "destructionTempo", ["adaptive", "deep"])}<p class="notice">Adaptive breaks small pieces quickly and carves larger panels. Deep everywhere carves every eligible target longer. Both keep the page reversible.</p><p class="notice">The selected length and destruction tempo apply to your next match.</p><label>NPC interval<input data-setting="spawnMs" type="range" min="1000" max="6000" step="250" value="${settings.spawnMs}"></label><label>Health bars<input data-setting="displayHp" type="checkbox" ${settings.displayHp ? "checked" : ""}></label>${select("Visual effects", "effectMode", ["full", "low"])}<p class="notice">Low reduces particles and screen shake. Reduced Motion disables shake and animated debris automatically.</p><p class="notice">Fighters stay at their document positions while you scroll. Newly added page elements join the arena.</p>`;
    }
    if (name === "settings") this.updateNpcButton();
    this.panel.querySelectorAll("[data-setting]").forEach(input => input.addEventListener("change", event => {
      const control = event.currentTarget as HTMLInputElement | HTMLSelectElement;
      const key = control.dataset.setting as keyof Settings;
      (settings as unknown as Record<string, unknown>)[key] = key === "spawnMs" || key === "speed" || key === "matchDurationMs" || key === "npcSide" ? Number(control.value) : key === "displayHp" || key === "npcEnabled" ? (control as HTMLInputElement).checked : control.value;
      this.updateHud();
      this.updateNpcButton();
    }));
    this.panel.querySelector("[data-version]")?.addEventListener("change", event => this.switchVariant((event.currentTarget as HTMLSelectElement).value as Variant));
    this.panel.querySelector("[data-resume-npc]")?.addEventListener("click", () => { this.rightControlUntil = 0; settings.npcEnabled = true; this.npcAt = performance.now(); this.updateHud(); this.panel.dataset.open = "false"; this.action("settings"); });
  }

  switchVariant(variant: Variant) { if (variant === this.variant) return; this.stop(); game = new PageBattle(variant); game.action("settings"); }
  stop() {
    this.running = false; cancelAnimationFrame(this.frame); this.observer.disconnect();
    this.heldSides.clear();
    window.removeEventListener("keydown", this.keydown, true); window.removeEventListener("keyup", this.keyup, true); window.removeEventListener("resize", this.resize); window.removeEventListener("scroll", this.refresh);
    window.removeEventListener("pointerup", this.releaseHeld, true); window.removeEventListener("pointercancel", this.releaseHeld, true); window.removeEventListener("blur", this.releaseAllHeld);
    document.removeEventListener("click", this.clickSide, true);
    for (const target of this.targets.values()) if (target.dynamic) {
      const media = target.element as HTMLImageElement | HTMLVideoElement;
      if (media instanceof HTMLVideoElement) media.pause();
      if (media.src?.startsWith("blob:")) URL.revokeObjectURL(media.src);
      target.element.remove();
    }
    this.activeVideo = null;
    this.host.remove();
    if (game === this) game = null;
  }
}

const api = {
  start(options: Options = {}) {
    if (!safePage()) return { ok: false as const, reason: "Demo Day skips sign-in and payment pages." };
    if (game) game.stop();
    game = new PageBattle(options.variant === "ks2" ? "ks2" : "classic");
    return { ok: true as const };
  },
  stop() { game?.stop(); },
  isRunning() { return !!game?.running; },
  switchVariant(variant: Variant) { game?.switchVariant(variant); },
  openSettings() { game?.action("settings"); },
};

declare global { interface Window { KineticSoulsOfficialPage?: typeof api } }
window.KineticSoulsOfficialPage = api;

import { spawnCharacter as spawnClassic, renderChar as renderClassic, drawHpBar as hpClassic, drawThemeBackground as backgroundClassic, getPartDamage as classicPartDamage, getWeaponTip as classicWeaponTip, getTeamColor as classicTeamColor, BESTIARY_ENTRIES as classicBestiary } from "../classic/src/pages/KineticSouls";
import { spawnCharacter as spawnKs2, getPartDamage as ks2PartDamage } from "../ks2/src/systems/Spawner";
import { renderChar as renderKs2, drawHpBar as hpKs2, getTeamColor as ks2TeamColor } from "../ks2/src/render/DrawEntities";
import { drawThemeBackground as backgroundKs2, BESTIARY_ENTRIES as ks2Bestiary } from "../ks2/src/render/DrawUI";
import { getWeaponTip as ks2WeaponTip } from "../ks2/src/game/utils";
import { updateBehaviors } from "../ks2/src/systems/Behaviors";
import type { Character as Ks2Character, Drop, GameState, Particle } from "../ks2/src/game/types";

type Variant = "classic" | "ks2";
type Side = 1 | 2;
type HeldSpawn = { side: Side; lastSpawnAt: number };
type Fighter = ReturnType<typeof spawnClassic> | ReturnType<typeof spawnKs2>;
type Target = { element: Element; x: number; y: number; width: number; height: number; damage: number; destroyed: boolean; impactX: number; impactY: number; lastHitAt: number; boss: boolean; stage: number; dynamic?: boolean; vx?: number; vy?: number; homeX?: number; homeY?: number };
type Projectile = { x: number; y: number; previousX: number; previousY: number; vx: number; vy: number; team: number; life: number; type: "laser" | "fireball"; color: string };
type FloatingText = { x: number; y: number; value: string; color: string; life: number };
type ArenaShard = { x: number; y: number; vx: number; vy: number; width: number; height: number; angle: number; spin: number; color: string; life: number; maxLife: number };
type Options = { variant?: Variant };
type Settings = { npcSide: 0 | Side; motion: "battle" | "dvd"; modifier: string; environment: string; theme: string; weapon: string; speed: number; spawnMs: number; displayHp: boolean; fighter: string; npcEnabled: boolean };

const settings: Settings = { npcSide: 2, motion: "battle", modifier: "none", environment: "bouncy", theme: "synthwave", weapon: "roulette", speed: 1, spawnMs: 2200, displayHp: true, fighter: "standard", npcEnabled: true };
const themes = ["classic", "neon", "gameboy", "abyss", "gsix", "gilded", "hacker", "synthwave", "vampire", "oceanic", "infernal", "glitch", "monochrome", "celestial", "overdrive", "comic", "wireframe_matrix", "blood_moon", "paper_sketch"];
const modifiers = ["none", "sudden_death", "titans", "vampire_kiss", "magnet", "repel"];
const environments = ["none", "ice", "blackhole", "bouncy", "wrap"];
const weapons = ["standard", "roulette", "melee_mash", "ranged_test", "none"];
const HOLD_REPEAT_MS = 150;

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
  targets = new Map<Element, Target>();
  damage: { x: number; y: number; width: number; height: number }[] = [];
  screenShake = 0;
  running = true;
  paused = false;
  score = 0;
  kills = 0;
  chainBreaks = 0;
  bossTarget: Target | null = null;
  bossPulseAt = 0;
  teamKOs: Record<Side, number> = { 1: 0, 2: 0 };
  startTime = performance.now();
  remainingMs = 120_000;
  matchFinished = false;
  completedRun = false;
  rightControlUntil = 0;
  minimized = false;
  snapshots: Array<{ at: number; fighters: Array<{ x: number; y: number; angle: number }>; score: number; kos: Record<Side, number> }> = [];
  snapshotAt = 0;
  replayIndex: number | null = null;
  activeVideo: HTMLVideoElement | null = null;
  hudAt = 0;
  runId = createRunId();
  frame = 0;
  previous = performance.now();
  npcAt = 0;
  lastNpcSide: Side = 2;
  heldSides = new Map<number, HeldSpawn>();
  heldKeys = new Map<string, HeldSpawn>();
  scanAt = 0;
  observer: MutationObserver;

  constructor(variant: Variant) {
    this.variant = variant;
    this.host = document.createElement("div");
    this.host.id = "lok-kinetic-official-page";
    this.host.style.cssText = "position:fixed;inset:0;z-index:2147483645;pointer-events:none";
    this.root = this.host.attachShadow({ mode: "open" });
    this.root.innerHTML = `<style>
      :host{all:initial}*,*:before,*:after{box-sizing:border-box}.arena{position:fixed;inset:0;pointer-events:none;image-rendering:pixelated}.ui{font:600 13px system-ui,sans-serif;color:white;text-shadow:0 1px 3px black;pointer-events:auto}.top{position:fixed;left:12px;top:12px;right:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.badge,.controls,.panel{background:#101722ec;border:1px solid #80dcff99;box-shadow:0 8px 30px #0009;border-radius:12px}.badge{padding:10px 13px;max-width:48vw}.badge strong{color:#a8ebff}.controls{display:flex;gap:4px;flex-wrap:wrap;padding:6px}button,select,input{font:inherit}button{border:1px solid #ffffff66;border-radius:8px;background:#2b4058;color:#fff;padding:8px 10px;cursor:pointer}button:hover,button:focus-visible{background:#416b89;outline:2px solid #9eeaff}button[data-active="true"]{background:#357663}.bottom{position:fixed;bottom:12px;left:12px;right:12px;display:flex;justify-content:space-between;gap:10px}.spawn{font-size:16px;font-weight:800;min-height:52px;min-width:132px;touch-action:none;user-select:none}.spawn[data-spraying="true"]{filter:brightness(1.35);box-shadow:0 0 20px #8de6ff99}.spawn[data-side="1"]{background:#694050}.spawn[data-side="2"]{background:#375b79}.panel{position:fixed;right:12px;top:65px;width:min(430px,calc(100vw - 24px));max-height:min(75vh,720px);overflow:auto;padding:18px;display:none}.panel[data-open="true"]{display:block}.panel h2{margin:0 0 10px;font-size:22px}.panel section{margin:12px 0}.panel label{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:8px 0}.panel select,.panel input{max-width:55%;background:#172638;color:#fff;border:1px solid #668ca4;border-radius:6px;padding:6px}.panel .entry{border-bottom:1px solid #ffffff30;padding:8px 0}.panel .entry strong{display:block}.panel .entry small{color:#b9d7e4}.panel a{color:#8de6ff}.notice{color:#bcd3df;font-size:12px;line-height:1.4}.panel[data-minimized="true"]{height:58px;min-height:58px;overflow:hidden}.panel[data-minimized="true"]>:not([data-creator-head]){display:none}[data-creator-head]{display:flex;align-items:center;justify-content:space-between;gap:12px}[data-creator-head] h2{font-size:18px!important}.panel [data-timeline]{max-width:65%}.panel [data-upload]{max-width:62%}@media(max-width:640px){.top{flex-direction:column}.badge{max-width:100%;font-size:11px}.controls{max-width:100%}.controls button{padding:6px}.panel{top:105px}.spawn{min-width:112px}}
    </style><canvas class="arena"></canvas><div class="ui"><div class="top"><div class="badge" role="status"></div><div class="controls"><button data-action="creator">Creative Sandbox</button><button data-action="modifiers" title="M">Modifiers M</button><button data-action="bestiary">Bestiary</button><button data-action="settings">Settings</button><button data-action="pause">Pause</button><button data-action="exit">Restore page</button></div></div><div class="panel" role="dialog" aria-label="Kinetic Souls controls"></div><div class="bottom"><button class="spawn" data-side="1" aria-label="Spawn left team; hold to repeat" title="Tap or hold A to launch the left team">P1 · Spawn left</button><button class="spawn" data-side="2" aria-label="Spawn right team; hold to repeat" title="Tap or hold L to launch the right team">P2 / NPC · Spawn right · L</button></div></div>`;
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
    this.spawn(1, false);
    this.npcAt = performance.now() + settings.spawnMs;
    this.snapshots.push({ at: 0, fighters: this.fighters.map(f => ({ x: f.x, y: f.y, angle: f.angle })), score: 0, kos: { 1: 0, 2: 0 } });
    this.frame = requestAnimationFrame(this.tick);
  }

  keydown = (event: KeyboardEvent) => {
    if (/INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement)?.tagName || "")) return;
    const key = event.key.toLowerCase();
    if (key === "a" || key === "l") {
      event.preventDefault();
      if (!this.heldKeys.has(key) && !this.matchFinished) {
        const side = key === "a" ? 1 : 2;
        this.spawn(side, true);
        this.heldKeys.set(key, { side, lastSpawnAt: performance.now() });
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
    const nodes = document.querySelectorAll("main *, article *, section *, header *, footer *, img, video, h1, h2, h3, p, a, button, [data-lok-demo-media]");
    let count = 0;
    for (const element of nodes) {
      if (count > 1800 || this.host.contains(element) || element.closest("#lok-kinetic-official-page,[data-lok-nondestructible],.lok-choice,[data-lok-sandbox-object]")) continue;
      const rect = element.getBoundingClientRect();
      // Break individual pieces of the page, not a full-height layout wrapper.
      if (rect.width < 40 || rect.height < 20 || rect.width > Math.min(innerWidth * 0.9, 780) || rect.height > 480 || rect.width * rect.height > 210000 || rect.bottom < -150 || rect.top > innerHeight + 150) continue;
      count++;
      if (!this.targets.has(element)) this.targets.set(element, { element, x: 0, y: 0, width: 0, height: 0, damage: 0, destroyed: false, impactX: 0, impactY: 0, lastHitAt: 0, boss: false, stage: 0 });
      const target = this.targets.get(element)!;
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
    if (human && side === 2) { this.lastNpcSide = 2; this.rightControlUntil = performance.now() + 12_000; this.updateNpcButton(); }
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

  updateHud() {
    const left = this.fighters.filter(f => !f.dead && f.team === 1).length;
    const right = this.fighters.filter(f => !f.dead && f.team === 2).length;
    const time = Math.ceil(this.remainingMs / 1000);
    const control = performance.now() < this.rightControlUntil ? "Player 2" : settings.npcEnabled ? "NPC" : "Right idle";
    this.hud.innerHTML = `<strong>KINETIC SOULS ${this.variant === "ks2" ? "2 · ALPHA" : "CLASSIC · 1"} · ${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}</strong><br>P1 ${left} · ${this.teamKOs[1]} KOs · ${control} ${right} · ${this.teamKOs[2]} KOs<br>Page breaks ${this.score} · Chain ${this.chainBreaks} · ${this.matchFinished ? "MATCH COMPLETE" : "Tap to launch · Hold A/L or a side control for a stream"}`;
  }

  awardKo(fighter: Fighter, team: Side) {
    if (fighter.dead) return;
    fighter.dead = true; this.kills++; this.teamKOs[team]++;
    this.updateHud();
  }

  updateNpcButton() {
    const button = this.panel.querySelector("[data-resume-npc]");
    if (button) button.textContent = `Resume NPC on ${this.lastNpcSide === 1 ? "left" : "right"}`;
  }

  tick = (now: number) => {
    if (!this.running) return;
    const elapsedMs = now - this.previous;
    const dt = Math.min(2.5, Math.max(0.3, elapsedMs / 16.67));
    this.previous = now;
    if (!this.paused && !this.matchFinished) {
      this.remainingMs = Math.max(0, this.remainingMs - elapsedMs);
      if (this.remainingMs <= 0) { this.finishMatch(); }
      if (!this.matchFinished) for (const [pointerId, held] of this.heldSides) {
        if (now - held.lastSpawnAt < HOLD_REPEAT_MS) continue;
        this.spawn(held.side, true);
        held.lastSpawnAt = now;
        if (!this.root.querySelector(`button[data-side="${held.side}"][data-spraying="true"]`)) this.heldSides.delete(pointerId);
      }
      if (!this.matchFinished) for (const held of this.heldKeys.values()) {
        if (now - held.lastSpawnAt < HOLD_REPEAT_MS) continue;
        this.spawn(held.side, true);
        held.lastSpawnAt = now;
      }
      if (!this.matchFinished && settings.npcEnabled && now >= this.rightControlUntil && now > this.npcAt) { this.spawn(2, false); this.npcAt = now + settings.spawnMs; }
      if (now > this.scanAt) { this.scan(); this.scanAt = now + 900; }
      if (!this.matchFinished) this.step(dt);
      if (now >= this.snapshotAt) { this.snapshots.push({ at: 120_000 - this.remainingMs, fighters: this.fighters.map(f => ({ x: f.x, y: f.y, angle: f.angle })), score: this.score, kos: { ...this.teamKOs } }); this.snapshots = this.snapshots.slice(-121); this.snapshotAt = now + 1000; }
      if (now >= this.hudAt) { this.updateHud(); this.hudAt = now + 500; }
      const timeline = this.panel.querySelector<HTMLInputElement>("[data-timeline]");
      if (timeline && this.replayIndex === null) { timeline.max = String(Math.max(0, this.snapshots.length - 1)); timeline.value = timeline.max; }
    }
    this.draw(now);
    this.frame = requestAnimationFrame(this.tick);
  };

  step(dt: number) {
    const dtMs = dt * 16.67;
    const minX = 18, maxX = Math.max(innerWidth - 18, document.documentElement.scrollWidth - 18);
    const minY = 85, maxY = Math.max(innerHeight - 18, document.documentElement.scrollHeight - 18);
    const visibleTargets = [...this.targets.values()].filter(t => !t.destroyed && t.x + t.width >= scrollX - 100 && t.x <= scrollX + innerWidth + 100 && t.y + t.height >= scrollY - 100 && t.y <= scrollY + innerHeight + 100);
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
      fighter.x += fighter.vx * dt; fighter.y += fighter.vy * dt;
      fighter.angle += fighter.angularV * dt;
      const drag = settings.environment === "ice" ? 0.998 : settings.environment === "bouncy" ? 1 : 0.985;
      fighter.vx *= drag; fighter.vy *= drag;
      fighter.flashFrames = Math.max(0, fighter.flashFrames - dt);
      if (settings.environment === "wrap") { if (fighter.x < minX) fighter.x = maxX; if (fighter.x > maxX) fighter.x = minX; }
      else { if (fighter.x < minX || fighter.x > maxX) { fighter.vx *= settings.environment === "bouncy" ? -1.15 : -1; fighter.x = Math.max(minX, Math.min(maxX, fighter.x)); } }
      if (fighter.y < minY || fighter.y > maxY) { fighter.vy *= settings.environment === "bouncy" ? -1.15 : -1; fighter.y = Math.max(minY, Math.min(maxY, fighter.y)); }
      for (const target of visibleTargets) {
        if (target.destroyed || fighter.x < target.x - 20 || fighter.x > target.x + target.width + 20 || fighter.y < target.y - 20 || fighter.y > target.y + target.height + 20) continue;
        const cx = Math.max(target.x, Math.min(fighter.x, target.x + target.width));
        const cy = Math.max(target.y, Math.min(fighter.y, target.y + target.height));
        if (Math.hypot(fighter.x - cx, fighter.y - cy) < 15 * fighter.scale) {
          const impactSpeed = Math.abs(fighter.vx * (fighter.x - cx) + fighter.vy * (fighter.y - cy)) / Math.max(1, Math.hypot(fighter.x - cx, fighter.y - cy));
          fighter.vx *= -0.78; fighter.vy *= -0.58;
          fighter.vx += (Math.random() - 0.5) * 1.8; fighter.vy -= 0.35 + Math.random() * 0.55;
          if (target.dynamic) { target.vx = (target.vx || 0) + fighter.vx * 0.38; target.vy = (target.vy || 0) + fighter.vy * 0.28 - 1.5; }
          this.damageTarget(target, cx, cy, Math.max(0.6, Math.min(5, impactSpeed * 0.34)), fighter.team === 1 ? "#ff714e" : "#72dfff", impactSpeed);
        }
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
      const floor = Math.max(innerHeight, document.documentElement.scrollHeight) - target.height - 8;
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
    const target: Target = { element, x, y, width, height, damage: 0, destroyed: false, impactX: x + width / 2, impactY: y + height / 2, lastHitAt: 0, boss: false, stage: 0, dynamic: true, vx: (Math.random() - .5) * 3, vy: -2, homeX: x, homeY: y };
    this.targets.set(element, target);
    let drag: { px: number; py: number; x: number; y: number } | null = null;
    element.addEventListener("pointerdown", event => { if (element instanceof HTMLVideoElement && event.offsetY > element.clientHeight - 42) return; drag = { px: event.clientX, py: event.clientY, x: target.x, y: target.y }; element.setPointerCapture(event.pointerId); element.style.cursor = "grabbing"; event.preventDefault(); });
    element.addEventListener("pointermove", event => { if (!drag) return; target.x = drag.x + event.clientX - drag.px; target.y = drag.y + event.clientY - drag.py; target.vx = target.vy = 0; element.style.left = `${target.x}px`; element.style.top = `${target.y}px`; });
    const release = () => { drag = null; element.style.cursor = "grab"; };
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
      tile.style.left = `${target.x}px`; tile.style.top = `${target.y}px`;
    }
  }

  rebuildScene() {
    this.damage.length = 0;
    for (const target of this.targets.values()) {
      target.damage = 0; target.destroyed = false; target.stage = 0; target.lastHitAt = 0;
      if (target.dynamic) { target.x = target.homeX ?? target.x; target.y = target.homeY ?? target.y; target.vx = target.vy = 0; const el = target.element as HTMLElement; el.style.display = ""; el.style.left = `${target.x}px`; el.style.top = `${target.y}px`; }
    }
    this.floatingTexts.push({ x: scrollX + innerWidth / 2, y: scrollY + 120, value: "SCENE REBUILT", color: "#9eeaff", life: 1000 });
  }

  async saveScene() {
    const objects = await Promise.all([...this.targets.values()].filter(t => t.dynamic).map(async t => {
      const el = t.element as HTMLElement; let blob: Blob | undefined;
      const src = (el as HTMLImageElement | HTMLVideoElement).src;
      if (src?.startsWith("blob:")) { try { blob = await (await fetch(src)).blob(); } catch {} }
      return { x: t.x, y: t.y, homeX: t.homeX, homeY: t.homeY, width: t.width, height: t.height, damage: t.damage, destroyed: t.destroyed, kind: el.tagName.toLowerCase(), text: el.tagName === "DIV" ? el.textContent : "", color: el.tagName === "DIV" ? el.style.background : "", blob, name: el.getAttribute("aria-label") || el.getAttribute("alt") || "Sandbox object" };
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
    for (const t of this.targets.values()) if (t.dynamic) { this.targets.delete(t.element); t.element.remove(); }
    for (const obj of chosen.objects) {
      let el: HTMLElement;
      if (obj.blob && (obj.kind === "img" || obj.kind === "video")) { el = document.createElement(obj.kind) as HTMLElement; (el as HTMLImageElement | HTMLVideoElement).src = URL.createObjectURL(obj.blob); if (obj.kind === "video") { const v = el as HTMLVideoElement; this.activeVideo = v; v.controls = true; v.muted = true; v.loop = true; v.playsInline = true; v.addEventListener("loadedmetadata", () => { const timeline = this.panel.querySelector<HTMLInputElement>("[data-video-timeline]"); if (timeline) timeline.max = String(v.duration || 0); }); void v.play().catch(() => {}); } }
      else { el = document.createElement("div"); el.textContent = obj.text || obj.name; el.style.cssText = `display:grid;place-items:center;background:${obj.color || "linear-gradient(135deg,#46789b,#101522)"};color:white;font:800 12px system-ui`; }
      const t = this.addSandboxObject(el, obj.width, obj.height); t.x = obj.x; t.y = obj.y; t.homeX = obj.homeX; t.homeY = obj.homeY; t.damage = obj.damage; t.destroyed = obj.destroyed; el.style.left = `${t.x}px`; el.style.top = `${t.y}px`; if (t.destroyed) el.style.display = "none";
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
    this.heldSides.clear();
    this.heldKeys.clear();
    this.root.querySelectorAll<HTMLElement>('[data-spraying="true"]').forEach(button => { button.dataset.spraying = "false"; });
    const result = this.teamKOs[1] === this.teamKOs[2] ? "Draw" : this.teamKOs[1] > this.teamKOs[2] ? "Player 1 wins" : "Player 2 / NPC wins";
    this.completeRun(result);
    this.panel.dataset.view = "result"; this.panel.dataset.open = "true";
    this.panel.innerHTML = `<h2>Match complete</h2><p><strong>${result}</strong></p><p>Player 1: ${this.teamKOs[1]} KOs · Player 2 / NPC: ${this.teamKOs[2]} KOs</p><p>Page targets destroyed: ${this.score}</p><button data-rematch>Rematch · 2 minutes</button><button data-close-panel>Close panel</button>`;
    this.panel.querySelector("[data-rematch]")?.addEventListener("click", () => this.rematch());
    this.panel.querySelector("[data-close-panel]")?.addEventListener("click", () => { this.panel.dataset.open = "false"; });
    this.updateHud();
  }

  completeRun(result: string) {
    if (this.completedRun) return;
    this.completedRun = true;
    window.dispatchEvent(new CustomEvent("lok:demoday:page-run", { detail: { version: 1, gameKey: "kinetic-souls", variant: this.variant, runId: this.runId, durationMs: 120_000 - this.remainingMs, teamScores: { player1: this.teamKOs[1], player2: this.teamKOs[2] }, result, score: this.score + this.teamKOs[1] + this.teamKOs[2], xp: Math.min(200, this.score * 3 + this.teamKOs[1] + this.teamKOs[2]), completedAt: new Date().toISOString() } }));
  }

  rematch() {
    this.rebuildScene(); this.fighters = []; this.projectiles = []; this.teamKOs = { 1: 0, 2: 0 }; this.score = 0; this.kills = 0; this.chainBreaks = 0;
    this.remainingMs = 120_000; this.matchFinished = false; this.completedRun = false; this.runId = createRunId();
    this.rightControlUntil = 0; this.paused = false; this.npcAt = performance.now() + 900;
    this.snapshots = []; this.snapshotAt = performance.now(); this.replayIndex = null;
    (this.root.querySelector('[data-action="pause"]') as HTMLElement).textContent = "Pause";
    this.panel.dataset.open = "false"; this.spawn(1, false); this.updateHud();
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
      const target = visibleTargets.find(t => !t.destroyed && shot.x >= t.x && shot.x <= t.x + t.width && shot.y >= t.y && shot.y <= t.y + t.height);
      if (target) {
        const impactColor = shot.color;
        this.damageTarget(target, shot.x, shot.y, shot.type === "fireball" ? 3.2 : 1.8, impactColor, Math.hypot(shot.vx, shot.vy));
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

  updateEffects(dt: number, dtMs: number) {
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
    for (const shard of this.shards) {
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

  damageTarget(target: Target, x: number, y: number, amount: number, color: string, force: number) {
    if (target.destroyed) return;
    target.damage += amount;
    target.impactX = x; target.impactY = y; target.lastHitAt = performance.now();
    this.screenShake = Math.min(9, Math.max(this.screenShake, Math.min(7, force * 0.24)));
    this.floatingTexts.push({ x, y: y - 10, value: `-${Math.round(amount * 10)}`, color, life: 520 });
    const limit = this.targetLimit(target);
    const stage = Math.min(3, Math.floor(target.damage / limit * 4));
    if (stage > target.stage) {
      target.stage = stage;
      this.floatingTexts.push({ x, y: y - 28, value: target.boss ? `WARDEN PHASE ${stage}` : ["", "CRACKED", "BREAKING", "UNSTABLE"][stage], color: target.boss ? "#ffe681" : color, life: 850 });
      this.screenShake = Math.max(this.screenShake, 2 + stage * 1.1);
    }
    const count = Math.min(9, Math.max(3, Math.round(amount * 1.6)));
    for (let i = 0; i < count && this.particles.length < 350; i++) {
      const angle = Math.random() * Math.PI * 2, speed = Math.min(9, 2 + force * 0.18 + Math.random() * 3);
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.5, life: 380 + Math.random() * 320, maxLife: 700, size: 2 + Math.random() * 4, color, active: true });
    }
    if (target.damage < limit) return;
    target.destroyed = true; this.score++;
    this.damage.push({ x: target.x, y: target.y, width: target.width, height: target.height });
    this.breakIntoShards(target, x, y, force);
    this.floatingTexts.push({ x: target.x + target.width / 2, y: target.y, value: target.boss ? "RIFT WARDEN DOWN!" : "PAGE BREAK!", color: target.boss ? "#ffe681" : "#fff0a6", life: 1200 });
    this.screenShake = Math.min(11, Math.max(this.screenShake, 6 + Math.min(5, force * 0.15)));
    this.chainBlast(target, x, y, color);
    this.updateHud();
  }

  targetLimit(target: Target) {
    const base = Math.max(2.5, Math.min(9, target.width * target.height / 11000));
    return target.boss ? base * 3 : base;
  }

  chainBlast(source: Target, x: number, y: number, color: string) {
    const radius = source.boss ? 260 : 150;
    const nearby = [...this.targets.values()].filter(target => !target.destroyed && target !== source)
      .map(target => ({ target, distance: Math.hypot(target.x + target.width / 2 - x, target.y + target.height / 2 - y) }))
      .filter(item => item.distance < radius).sort((a, b) => a.distance - b.distance).slice(0, source.boss ? 8 : 4);
    if (!nearby.length) return;
    this.chainBreaks += nearby.length;
    this.floatingTexts.push({ x, y: y - 42, value: `CHAIN REACTION ×${nearby.length}`, color, life: 1000 });
    for (const { target, distance } of nearby) {
      const amount = (source.boss ? 2.4 : 1.8) * (1 - distance / radius);
      const impactX = target.x + target.width / 2, impactY = target.y + target.height / 2;
      target.impactX = impactX; target.impactY = impactY; target.lastHitAt = performance.now(); target.damage += amount;
      const stage = Math.min(3, Math.floor(target.damage / this.targetLimit(target) * 4));
      if (stage > target.stage) { target.stage = stage; this.floatingTexts.push({ x: impactX, y: impactY - 28, value: ["", "CRACKED", "BREAKING", "UNSTABLE"][stage], color, life: 850 }); }
      this.screenShake = Math.max(this.screenShake, source.boss ? 8 : 5);
      if (target.damage >= this.targetLimit(target)) {
        target.destroyed = true; this.score++;
        this.damage.push({ x: target.x, y: target.y, width: target.width, height: target.height });
        this.breakIntoShards(target, impactX, impactY, amount * 2);
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
      this.damageTarget(target, target.x + target.width / 2, target.y + target.height / 2, 0.8, "#ffe681", 4);
    }
  }

  breakIntoShards(target: Target, x: number, y: number, force: number) {
    const style = getComputedStyle(target.element);
    const color = style.backgroundColor !== "rgba(0, 0, 0, 0)" ? style.backgroundColor : style.color;
    const count = Math.min(24, Math.max(8, Math.round(Math.sqrt(target.width * target.height) / 13)));
    for (let i = 0; i < count && this.shards.length < 180; i++) {
      const angle = (Math.PI * 2 * i / count) + (Math.random() - 0.5) * 0.55;
      const speed = 2 + Math.random() * 4 + Math.min(5, force * 0.12);
      const w = 5 + Math.random() * 12, h = 4 + Math.random() * 10;
      this.shards.push({ x: x + (Math.random() - 0.5) * target.width * 0.25, y: y + (Math.random() - 0.5) * target.height * 0.25,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2 - Math.random() * 2,
        width: w, height: h, angle: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.3,
        color, life: 1400 + Math.random() * 1100, maxLife: 2500 });
    }
  }

  draw(now: number) {
    const ctx = this.ctx; ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.damage.length) {
      ctx.save(); ctx.beginPath();
      for (const area of this.damage) {
        if (area.x + area.width < scrollX || area.y + area.height < scrollY || area.x > scrollX + innerWidth || area.y > scrollY + innerHeight) continue;
        ctx.rect(area.x - scrollX, area.y - scrollY, area.width, area.height);
      }
      for (const target of this.targets.values()) {
        if (target.destroyed || target.damage <= 0) continue;
        const r = 5 + Math.min(24, target.damage * 2.6);
        const x = target.impactX - scrollX, y = target.impactY - scrollY;
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.clip();
      const sceneTime = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : now;
      if (this.variant === "classic") backgroundClassic(ctx, settings.theme as never, sceneTime, innerWidth, innerHeight, 0);
      else backgroundKs2(ctx, settings.theme as never, sceneTime, innerWidth, innerHeight, 0);
      this.drawArenaEnhancements(ctx, sceneTime);
      ctx.restore();
    }
    ctx.save();
    const shakeX = Math.sin(now * 0.083) * this.screenShake, shakeY = Math.cos(now * 0.071) * this.screenShake * 0.55;
    ctx.translate(shakeX, shakeY); ctx.translate(-scrollX, -scrollY);
    for (const bomb of this.bombs) {
      if (!bomb.active || bomb.x < scrollX - 160 || bomb.x > scrollX + innerWidth + 160 || bomb.y < scrollY - 160 || bomb.y > scrollY + innerHeight + 160) continue;
      ctx.strokeStyle = "#b177ff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bomb.x, bomb.y, Math.min(bomb.radius, 18 + (3000 - bomb.timer) * 0.025), 0, Math.PI * 2); ctx.stroke();
    }
    for (const shot of this.projectiles) {
      if (shot.x < scrollX - 20 || shot.x > scrollX + innerWidth + 20 || shot.y < scrollY - 20 || shot.y > scrollY + innerHeight + 20) continue;
      ctx.save(); ctx.globalAlpha = 0.44; ctx.strokeStyle = shot.color; ctx.lineWidth = shot.type === "fireball" ? 7 : 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(shot.previousX, shot.previousY); ctx.lineTo(shot.x, shot.y); ctx.stroke(); ctx.restore();
      ctx.shadowColor = shot.color; ctx.shadowBlur = shot.type === "fireball" ? 18 : 9;
      ctx.fillStyle = shot.color; ctx.beginPath(); ctx.arc(shot.x, shot.y, shot.type === "fireball" ? 7 : 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }
    for (const particle of this.particles) {
      if (!particle.active || particle.x < scrollX || particle.x > scrollX + innerWidth || particle.y < scrollY || particle.y > scrollY + innerHeight) continue;
      ctx.globalAlpha = Math.max(0, Math.min(1, particle.life / Math.max(1, particle.maxLife)));
      ctx.fillStyle = particle.color; ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    ctx.globalAlpha = 1;
    for (const target of this.targets.values()) {
      if (!target.dynamic || target.destroyed || target.x > scrollX + innerWidth || target.x + target.width < scrollX || target.y > scrollY + innerHeight || target.y + target.height < scrollY) continue;
      const el = target.element as HTMLElement;
      try {
        if (el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0) ctx.drawImage(el, target.x - scrollX, target.y - scrollY, target.width, target.height);
        else if (el instanceof HTMLVideoElement && el.readyState >= 2) ctx.drawImage(el, target.x - scrollX, target.y - scrollY, target.width, target.height);
        else if (el instanceof HTMLDivElement) {
          const style = getComputedStyle(el); ctx.fillStyle = style.backgroundColor === "rgba(0, 0, 0, 0)" ? "#356781" : style.backgroundColor;
          ctx.fillRect(target.x - scrollX, target.y - scrollY, target.width, target.height);
          ctx.fillStyle = style.color; ctx.font = "bold 12px system-ui"; ctx.textAlign = "center"; ctx.fillText(el.textContent || "SANDBOX PROP", target.x - scrollX + target.width / 2, target.y - scrollY + target.height / 2);
        }
      } catch { /* A media frame may be unavailable during its first decode. */ }
    }
    for (const target of this.targets.values()) {
      if (target.destroyed) continue;
      const x = target.impactX, y = target.impactY, strength = Math.min(1, target.damage / 6);
      const age = now - target.lastHitAt;
      ctx.save();
      if (target.damage > 0) {
        ctx.globalAlpha = age < 110 ? 0.8 : 0.38 + strength * 0.25;
        ctx.strokeStyle = this.variant === "classic" ? "#ffb14e" : "#c7a6ff"; ctx.lineWidth = 2 + strength * 2;
        ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 8 + strength * 12;
        for (let arm = 0; arm < 6; arm++) {
          const angle = arm * Math.PI / 3 + (target.x % 0.45);
          const reach = 7 + strength * 25;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(angle) * reach, y + Math.sin(angle) * reach); ctx.stroke();
        }
      }
      if (target.boss) {
        if (target.damage === 0) ctx.globalAlpha = 0.75;
        const pulse = 0.5 + Math.sin(now * 0.006) * 0.5;
        const radius = Math.max(target.width, target.height) * (0.7 + pulse * 0.22);
        ctx.strokeStyle = `rgba(255,230,129,${0.45 + pulse * 0.45})`; ctx.lineWidth = 3; ctx.setLineDash([8, 7]);
        ctx.beginPath(); ctx.ellipse(target.x + target.width / 2, target.y + target.height / 2, radius * 0.62, radius * 0.42, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.font = "bold 12px system-ui"; ctx.textAlign = "center"; ctx.fillStyle = "#fff0a6"; ctx.fillText(`RIFT WARDEN · ${Math.max(0, 100 - Math.round(target.damage / this.targetLimit(target) * 100))}%`, target.x + target.width / 2, target.y - 12);
      }
      ctx.restore();
    }
    const replay = this.replayIndex === null ? null : this.snapshots[this.replayIndex];
    const restore: Array<{ fighter: Fighter; x: number; y: number; angle: number }> = [];
    if (replay) this.fighters.forEach((fighter, i) => { const point = replay.fighters[i]; if (point) { restore.push({ fighter, x: fighter.x, y: fighter.y, angle: fighter.angle }); fighter.x = point.x; fighter.y = point.y; fighter.angle = point.angle; } });
    for (const fighter of this.fighters) {
      if (fighter.x < scrollX - 100 || fighter.x > scrollX + innerWidth + 100 || fighter.y < scrollY - 100 || fighter.y > scrollY + innerHeight + 100) continue;
      if (this.variant === "classic") {
        renderClassic(ctx, fighter as ReturnType<typeof spawnClassic>, fighter.flashFrames > 0, 1, settings.theme as never, false, true, now);
        if (settings.displayHp) hpClassic(ctx, fighter as ReturnType<typeof spawnClassic>, settings.modifier as never, false, settings.theme as never);
      } else {
        renderKs2(ctx, fighter as ReturnType<typeof spawnKs2>, fighter.flashFrames > 0, 1, settings.theme as never, false, true, now);
        if (settings.displayHp) hpKs2(ctx, fighter as ReturnType<typeof spawnKs2>, settings.modifier as never, false, settings.theme as never);
      }
    }
    for (const state of restore) { state.fighter.x = state.x; state.fighter.y = state.y; state.fighter.angle = state.angle; }
    for (const shard of this.shards) {
      if (shard.x < scrollX - 30 || shard.x > scrollX + innerWidth + 30 || shard.y < scrollY - 30 || shard.y > scrollY + innerHeight + 30) continue;
      ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, shard.life / shard.maxLife)); ctx.translate(shard.x, shard.y); ctx.rotate(shard.angle);
      ctx.fillStyle = shard.color; ctx.fillRect(-shard.width / 2, -shard.height / 2, shard.width, shard.height);
      ctx.strokeStyle = this.variant === "classic" ? "#ffb14e" : "#bb91ff"; ctx.lineWidth = 1; ctx.strokeRect(-shard.width / 2, -shard.height / 2, shard.width, shard.height);
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
    const pulse = 0.5 + Math.sin(time * 0.0022) * 0.5;
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
    if (name === "pause") { this.paused = !this.paused; if (!this.paused) this.replayIndex = null; (this.root.querySelector('[data-action="pause"]') as HTMLElement).textContent = this.paused ? "Resume" : "Pause"; return; }
    if (name === "close" || (this.panel.dataset.open === "true" && this.panel.dataset.view === name)) { this.panel.dataset.open = "false"; return; }
    if (name === "creator" && this.panel.dataset.view === "creator" && this.panel.dataset.open === "true") { this.panel.dataset.minimized = this.panel.dataset.minimized === "true" ? "false" : "true"; return; }
    this.panel.dataset.view = name; this.panel.dataset.open = "true"; this.panel.dataset.minimized = "false";
    const select = (label: string, key: keyof Settings, options: string[]) => `<label>${label}<select data-setting="${key}">${options.map(option => `<option value="${option}" ${settings[key] === option ? "selected" : ""}>${option.replaceAll("_", " ")}</option>`).join("")}</select></label>`;
    const npc = `<label>Right-side NPC<input data-setting="npcEnabled" type="checkbox" ${settings.npcEnabled ? "checked" : ""}></label>`;
    if (name === "creator") {
      this.panel.innerHTML = `<div data-creator-head><h2>Creative Sandbox · Live Match</h2><button data-minimize>Minimize</button></div><p class="notice">These objects share the live match physics. Fighters collide with and break them; the page underneath is restored when you leave.</p><section><strong>Starter scenes</strong><div class="controls"><button data-scene="neon">Neon tiles</button><button data-scene="ruins">Rift ruins</button><button data-scene="garden">Sky garden</button></div></section><section><label>Add image or video<input data-upload type="file" accept="image/*,video/mp4,video/webm,video/ogg"></label></section><section><label>Match replay · scrub while paused<input data-timeline type="range" min="0" max="${Math.max(0, this.snapshots.length - 1)}" value="${this.replayIndex ?? Math.max(0, this.snapshots.length - 1)}"></label><small data-replay-time>${Math.ceil((this.snapshots[this.replayIndex ?? Math.max(0, this.snapshots.length - 1)]?.at || 0) / 1000)}s</small><label>Video playback position<input data-video-timeline type="range" min="0" max="0" value="0"></label></section><section class="controls"><button data-rebuild>Rebuild scene</button><button data-save>Save scene</button><button data-open-scene>Open latest scene</button><button data-export>Export arena still</button><button data-record>Record 8-second replay</button></section><p class="notice" data-creator-status role="status">Local media and scenes stay on this device. Drag props to place them. Video stays muted.</p>`;
      this.panel.querySelector("[data-minimize]")?.addEventListener("click", () => { this.panel.dataset.minimized = "true"; });
      this.panel.querySelectorAll<HTMLButtonElement>("[data-scene]").forEach(button => button.addEventListener("click", () => { this.addStarterScene(button.dataset.scene || "neon"); this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Starter props added to the live physics world."; }));
      this.panel.querySelector<HTMLInputElement>("[data-upload]")?.addEventListener("change", event => { const file = (event.currentTarget as HTMLInputElement).files?.[0]; if (!file) return; if (!file.type.startsWith("image/") && !["video/mp4", "video/webm", "video/ogg"].includes(file.type)) { this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Choose an image, MP4, WebM, or Ogg video."; return; } if (file.size > 120 * 1024 * 1024) { this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Choose a file smaller than 120 MB."; return; } const media = document.createElement(file.type.startsWith("video/") ? "video" : "img") as HTMLImageElement | HTMLVideoElement; media.src = URL.createObjectURL(file); media.setAttribute("aria-label", file.name); if (media instanceof HTMLVideoElement) { this.activeVideo = media; media.controls = true; media.muted = true; media.loop = true; media.playsInline = true; void media.play().catch(() => {}); const scrub = this.panel.querySelector<HTMLInputElement>("[data-video-timeline]")!; media.addEventListener("loadedmetadata", () => { scrub.max = String(media.duration || 0); }); media.addEventListener("timeupdate", () => { if (document.activeElement !== scrub) scrub.value = String(media.currentTime); }); } this.addSandboxObject(media); this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = `${file.name} added as a movable physics target.`; });
      this.panel.querySelector<HTMLInputElement>("[data-video-timeline]")?.addEventListener("input", event => { if (this.activeVideo) this.activeVideo.currentTime = Number((event.currentTarget as HTMLInputElement).value); });
      this.panel.querySelector("[data-rebuild]")?.addEventListener("click", () => this.rebuildScene());
      this.panel.querySelector("[data-save]")?.addEventListener("click", () => { void this.saveScene().then(() => this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Scene saved to this device.").catch(() => this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Local scene storage is unavailable in this browser."); });
      this.panel.querySelector("[data-open-scene]")?.addEventListener("click", () => { void this.openScene().then(() => this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Latest saved scene opened.").catch(() => this.panel.querySelector<HTMLElement>("[data-creator-status]")!.textContent = "Could not open the saved scene."); });
      this.panel.querySelector("[data-export]")?.addEventListener("click", () => this.exportScene());
      this.panel.querySelector("[data-record]")?.addEventListener("click", () => this.recordReplay());
      this.panel.querySelector<HTMLInputElement>("[data-timeline]")?.addEventListener("input", event => { const input = event.currentTarget as HTMLInputElement; this.replayIndex = Number(input.value); this.paused = true; (this.root.querySelector('[data-action="pause"]') as HTMLElement).textContent = "Resume"; const snapshot = this.snapshots[this.replayIndex]; this.panel.querySelector<HTMLElement>("[data-replay-time]")!.textContent = `${Math.floor((snapshot?.at || 0) / 1000)}s · paused`; });
    } else if (name === "bestiary") {
      const entries = this.variant === "classic" ? classicBestiary : ks2Bestiary;
      this.panel.innerHTML = `<h2>${this.variant === "classic" ? "Classic" : "KS2"} Bestiary</h2><p class="notice">Choose a fighter for the next spawn.</p>${select("Spawn fighter", "fighter", entries.filter(e => e.role !== "Weapon" && e.role !== "Relic").map(e => e.id))}<div>${entries.map(e => `<div class="entry"><strong style="color:${e.color}">${e.name}</strong><small>${e.role} · HP ${e.hp} · ${e.weapon}</small><div>${e.lore}</div></div>`).join("")}</div>`;
    } else if (name === "modifiers") {
      this.panel.innerHTML = `<h2>Live modifiers · M</h2><p class="notice">Changes apply to this live-page battle. DVD mode bounces without team damage. The standalone arena has the remaining modifiers.</p>${select("Movement", "motion", ["battle", "dvd"])}${select("Combat modifier", "modifier", modifiers)}${select("Environment", "environment", environments)}${select("Weapon loadout", "weapon", weapons)}${select("Arena theme", "theme", this.variant === "classic" ? themes : [...themes, "cyberpunk", "ethereal", "wasteland", "void", "outrun", "frostbite", "solaris", "deepsea", "nebula"])}${select("Fighter", "fighter", (this.variant === "classic" ? classicBestiary : ks2Bestiary).filter(e => e.role !== "Weapon" && e.role !== "Relic").map(e => e.id))}<label>Fighter speed<input data-setting="speed" type="range" min="0.5" max="3" step="0.1" value="${settings.speed}"></label><p class="notice"><a href="https://demo.gsix.online/games/kinetic-${this.variant}" target="_blank" rel="noopener">Open the full ${this.variant === "classic" ? "Classic" : "KS2"} arena ↗</a></p>`;
    } else {
      this.panel.innerHTML = `<h2>Settings</h2><label>Version<select data-version><option value="classic" ${this.variant === "classic" ? "selected" : ""}>Classic (1)</option><option value="ks2" ${this.variant === "ks2" ? "selected" : ""}>KS2 (alpha)</option></select></label>${npc}<button data-resume-npc>Resume NPC on right</button><p class="notice">Tap A/L or a team control to launch one fighter. Hold either to keep launching; right-side input takes over Player 2 for 12 seconds.</p><label>NPC interval<input data-setting="spawnMs" type="range" min="1000" max="6000" step="250" value="${settings.spawnMs}"></label><label>Health bars<input data-setting="displayHp" type="checkbox" ${settings.displayHp ? "checked" : ""}></label><p class="notice">Fighters stay at their document positions while you scroll. Newly added page elements join the arena.</p>`;
    }
    this.panel.querySelectorAll("[data-setting]").forEach(input => input.addEventListener("change", event => {
      const control = event.currentTarget as HTMLInputElement | HTMLSelectElement;
      const key = control.dataset.setting as keyof Settings;
      (settings as unknown as Record<string, unknown>)[key] = key === "spawnMs" || key === "speed" ? Number(control.value) : key === "displayHp" || key === "npcEnabled" ? (control as HTMLInputElement).checked : control.value;
      if (key === "npcSide" && settings.npcSide) this.lastNpcSide = settings.npcSide;
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

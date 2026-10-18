import { spawnCharacter as spawnClassic, renderChar as renderClassic, drawHpBar as hpClassic, drawThemeBackground as backgroundClassic, BESTIARY_ENTRIES as classicBestiary } from "../classic/src/pages/KineticSouls";
import { spawnCharacter as spawnKs2 } from "../ks2/src/systems/Spawner";
import { renderChar as renderKs2, drawHpBar as hpKs2 } from "../ks2/src/render/DrawEntities";
import { drawThemeBackground as backgroundKs2, BESTIARY_ENTRIES as ks2Bestiary } from "../ks2/src/render/DrawUI";

type Variant = "classic" | "ks2";
type Side = 1 | 2;
type Fighter = ReturnType<typeof spawnClassic> | ReturnType<typeof spawnKs2>;
type Target = { element: Element; x: number; y: number; width: number; height: number; damage: number; destroyed: boolean };
type Options = { variant?: Variant };
type Settings = { npcSide: 0 | Side; modifier: string; environment: string; theme: string; weapon: string; speed: number; spawnMs: number; displayHp: boolean; fighter: string };

const settings: Settings = { npcSide: 2, modifier: "none", environment: "none", theme: "classic", weapon: "roulette", speed: 1, spawnMs: 2600, displayHp: true, fighter: "standard" };
const themes = ["classic", "neon", "gameboy", "abyss", "gsix", "gilded", "hacker", "synthwave", "vampire", "oceanic", "infernal", "glitch", "monochrome", "celestial", "overdrive", "comic", "wireframe_matrix", "blood_moon", "paper_sketch"];
const modifiers = ["none", "sudden_death", "titans", "vampire_kiss", "magnet", "repel"];
const environments = ["none", "ice", "blackhole", "bouncy", "wrap"];
const weapons = ["standard", "roulette", "melee_mash", "ranged_test", "none"];

let game: PageBattle | null = null;
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
  targets = new Map<Element, Target>();
  damage: { x: number; y: number; width: number; height: number }[] = [];
  running = true;
  paused = false;
  score = 0;
  kills = 0;
  startTime = performance.now();
  runId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  frame = 0;
  previous = performance.now();
  npcAt = 0;
  lastNpcSide: Side = 2;
  scanAt = 0;
  observer: MutationObserver;

  constructor(variant: Variant) {
    this.variant = variant;
    this.host = document.createElement("div");
    this.host.id = "lok-kinetic-official-page";
    this.host.style.cssText = "position:fixed;inset:0;z-index:2147483645;pointer-events:none";
    this.root = this.host.attachShadow({ mode: "open" });
    this.root.innerHTML = `<style>
      :host{all:initial}*,*:before,*:after{box-sizing:border-box}.arena{position:fixed;inset:0;pointer-events:none;image-rendering:pixelated}.ui{font:600 13px system-ui,sans-serif;color:white;text-shadow:0 1px 3px black;pointer-events:auto}.top{position:fixed;left:12px;top:12px;right:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.badge,.controls,.panel{background:#101722ec;border:1px solid #80dcff99;box-shadow:0 8px 30px #0009;border-radius:12px}.badge{padding:10px 13px;max-width:48vw}.badge strong{color:#a8ebff}.controls{display:flex;gap:4px;flex-wrap:wrap;padding:6px}button,select,input{font:inherit}button{border:1px solid #ffffff66;border-radius:8px;background:#2b4058;color:#fff;padding:8px 10px;cursor:pointer}button:hover,button:focus-visible{background:#416b89;outline:2px solid #9eeaff}button[data-active="true"]{background:#357663}.bottom{position:fixed;bottom:12px;left:12px;right:12px;display:flex;justify-content:space-between;gap:10px}.spawn{font-size:16px;font-weight:800;min-height:52px;min-width:132px}.spawn[data-side="1"]{background:#694050}.spawn[data-side="2"]{background:#375b79}.panel{position:fixed;right:12px;top:65px;width:min(430px,calc(100vw - 24px));max-height:min(75vh,720px);overflow:auto;padding:18px;display:none}.panel[data-open="true"]{display:block}.panel h2{margin:0 0 10px;font-size:22px}.panel section{margin:12px 0}.panel label{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:8px 0}.panel select,.panel input{max-width:55%;background:#172638;color:#fff;border:1px solid #668ca4;border-radius:6px;padding:6px}.panel .entry{border-bottom:1px solid #ffffff30;padding:8px 0}.panel .entry strong{display:block}.panel .entry small{color:#b9d7e4}.panel a{color:#8de6ff}.notice{color:#bcd3df;font-size:12px;line-height:1.4}@media(max-width:640px){.top{flex-direction:column}.badge{max-width:100%;font-size:11px}.controls{max-width:100%}.controls button{padding:6px}.panel{top:105px}.spawn{min-width:112px}}
    </style><canvas class="arena"></canvas><div class="ui"><div class="top"><div class="badge" role="status"></div><div class="controls"><button data-action="modifiers" title="M">Modifiers M</button><button data-action="bestiary">Bestiary</button><button data-action="settings">Settings</button><button data-action="pause">Pause</button><button data-action="exit">Restore page</button></div></div><div class="panel" role="dialog" aria-label="Kinetic Souls controls"></div><div class="bottom"><button class="spawn" data-side="1" title="Spawn left team, A">A · Spawn left</button><button class="spawn" data-side="2" title="Spawn right team, L">Spawn right · L</button></div></div>`;
    document.body.appendChild(this.host);
    this.canvas = this.root.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.panel = this.root.querySelector(".panel")!;
    this.hud = this.root.querySelector(".badge")!;
    this.root.querySelectorAll("button[data-side]").forEach(button => button.addEventListener("click", () => this.spawn(Number((button as HTMLElement).dataset.side) as Side, true)));
    this.root.querySelectorAll("button[data-action]").forEach(button => button.addEventListener("click", () => this.action((button as HTMLElement).dataset.action!)));
    this.observer = new MutationObserver(() => { this.scanAt = 0; });
    this.observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("keydown", this.keydown, true);
    window.addEventListener("resize", this.resize);
    window.addEventListener("scroll", this.refresh, { passive: true });
    this.resize();
    this.scan();
    this.spawn(1, false);
    this.spawn(2, false);
    this.npcAt = performance.now() + settings.spawnMs;
    this.frame = requestAnimationFrame(this.tick);
  }

  keydown = (event: KeyboardEvent) => {
    if (event.repeat || /INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement)?.tagName || "")) return;
    const key = event.key.toLowerCase();
    if (key === "a" || key === "l") { event.preventDefault(); this.spawn(key === "a" ? 1 : 2, true); }
    else if (key === "m") { event.preventDefault(); this.action("modifiers"); }
    else if (key === "escape") { event.preventDefault(); this.action(this.panel.dataset.open === "true" ? "close" : "pause"); }
  };
  resize = () => { this.canvas.width = innerWidth; this.canvas.height = innerHeight; this.scanAt = 0; };
  refresh = () => { this.scanAt = 0; };

  scan() {
    const seen = new Set<Element>();
    const nodes = document.querySelectorAll("main *, article *, section *, header *, footer *, img, video, h1, h2, h3, p, a, button, [data-lok-demo-media]");
    let count = 0;
    for (const element of nodes) {
      if (count > 1800 || this.host.contains(element) || element.closest("#lok-kinetic-official-page")) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 20 || rect.width > innerWidth * 1.5 || rect.bottom < -150 || rect.top > innerHeight + 150) continue;
      count++;
      if (!this.targets.has(element)) this.targets.set(element, { element, x: 0, y: 0, width: 0, height: 0, damage: 0, destroyed: false });
      const target = this.targets.get(element)!;
      target.x = rect.left + scrollX; target.y = rect.top + scrollY; target.width = rect.width; target.height = rect.height;
      seen.add(element);
    }
    for (const [element] of this.targets) if (!element.isConnected) this.targets.delete(element);
  }

  spawn(side: Side, human: boolean) {
    if (human && settings.npcSide === side) { this.lastNpcSide = side; settings.npcSide = 0; }
    const x = scrollX + (side === 1 ? 44 : innerWidth - 44);
    const y = scrollY + 145 + Math.random() * Math.max(80, innerHeight - 290);
    const entries = this.variant === "classic" ? classicBestiary : ks2Bestiary;
    const chosen = entries.find(e => e.id === settings.fighter) || entries[0];
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
    this.hud.innerHTML = `<strong>KINETIC SOULS ${this.variant === "ks2" ? "2 · ALPHA" : "CLASSIC · 1"}</strong><br>Left ${left} · Right ${right} · Breaks ${this.score} · KOs ${this.kills}<br>NPC ${settings.npcSide === 0 ? "off" : settings.npcSide === 1 ? "left" : "right"} · A / L to spawn`;
  }

  tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(2.5, Math.max(0.3, (now - this.previous) / 16.67));
    this.previous = now;
    if (!this.paused) {
      if (now > this.npcAt && settings.npcSide) { this.spawn(settings.npcSide, false); this.npcAt = now + settings.spawnMs; }
      if (now > this.scanAt) { this.scan(); this.scanAt = now + 900; }
      this.step(dt);
    }
    this.draw(now);
    this.frame = requestAnimationFrame(this.tick);
  };

  step(dt: number) {
    const minX = 18, maxX = Math.max(innerWidth - 18, document.documentElement.scrollWidth - 18);
    const minY = 85, maxY = Math.max(innerHeight - 18, document.documentElement.scrollHeight - 18);
    const visibleTargets = [...this.targets.values()].filter(t => !t.destroyed && t.x + t.width >= scrollX - 100 && t.x <= scrollX + innerWidth + 100 && t.y + t.height >= scrollY - 100 && t.y <= scrollY + innerHeight + 100);
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
      if (nearest && nearestDistance > 35) {
        const seek = fighter.kineticType === "assassin" || fighter.kineticType === "ninja" ? 0.22 : fighter.kineticType === "tank" ? 0.07 : 0.12;
        fighter.vx += (nearest.x - fighter.x) / nearestDistance * seek * dt;
        fighter.vy += (nearest.y - fighter.y) / nearestDistance * seek * dt;
        const speed = Math.hypot(fighter.vx, fighter.vy);
        if (speed > 8 * settings.speed) { fighter.vx *= 8 * settings.speed / speed; fighter.vy *= 8 * settings.speed / speed; }
        if ((fighter.weapon === "blaster" || fighter.weapon === "fireball") && nearestDistance < 270 && fighter.cooldown <= 0) {
          nearest.hp -= fighter.weapon === "fireball" ? 3 : 2;
          nearest.flashFrames = 5;
          fighter.cooldown = 45;
          if (nearest.hp <= 0) { nearest.dead = true; this.kills++; this.updateHud(); }
        }
      }
      fighter.cooldown = Math.max(0, fighter.cooldown - dt);
      if (settings.environment === "blackhole") { fighter.vx += (scrollX + innerWidth / 2 - fighter.x) * 0.0001; fighter.vy += (scrollY + innerHeight / 2 - fighter.y) * 0.0001; }
      if (settings.environment === "ice") { fighter.vx *= 1.002; fighter.vy *= 1.002; }
      fighter.x += fighter.vx * dt; fighter.y += fighter.vy * dt;
      fighter.angle += fighter.angularV * dt;
      fighter.flashFrames = Math.max(0, fighter.flashFrames - dt);
      if (settings.environment === "wrap") { if (fighter.x < minX) fighter.x = maxX; if (fighter.x > maxX) fighter.x = minX; }
      else { if (fighter.x < minX || fighter.x > maxX) { fighter.vx *= settings.environment === "bouncy" ? -1.15 : -1; fighter.x = Math.max(minX, Math.min(maxX, fighter.x)); } }
      if (fighter.y < minY || fighter.y > maxY) { fighter.vy *= settings.environment === "bouncy" ? -1.15 : -1; fighter.y = Math.max(minY, Math.min(maxY, fighter.y)); }
      for (const target of visibleTargets) {
        if (target.destroyed || fighter.x < target.x - 20 || fighter.x > target.x + target.width + 20 || fighter.y < target.y - 20 || fighter.y > target.y + target.height + 20) continue;
        const cx = Math.max(target.x, Math.min(fighter.x, target.x + target.width));
        const cy = Math.max(target.y, Math.min(fighter.y, target.y + target.height));
        if (Math.hypot(fighter.x - cx, fighter.y - cy) < 15 * fighter.scale) {
          target.damage += Math.max(0.05, Math.hypot(fighter.vx, fighter.vy) * 0.04);
          fighter.vx *= -0.7; fighter.vy += (Math.random() - 0.5) * 1.4;
          if (target.damage > Math.max(3, Math.min(12, target.width * target.height / 8000))) {
            target.destroyed = true; this.score++;
            this.damage.push({ x: target.x, y: target.y, width: target.width, height: target.height });
            this.updateHud();
          }
        }
      }
    }
    for (let i = 0; i < this.fighters.length; i++) {
      const a = this.fighters[i]; if (a.dead) continue;
      for (let j = i + 1; j < this.fighters.length; j++) {
        const b = this.fighters[j]; if (b.dead || a.team === b.team) continue;
        const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy), radius = 15 * (a.scale + b.scale);
        if (distance > radius || distance < 0.01) continue;
        const nx = dx / distance, ny = dy / distance;
        const closing = Math.max(1, (a.vx - b.vx) * nx + (a.vy - b.vy) * ny);
        const weaponBonus = ["hammer", "axe", "scythe", "katana", "mace"].includes(a.weapon) || ["hammer", "axe", "scythe", "katana", "mace"].includes(b.weapon) ? 1.35 : 1;
        const damage = settings.modifier === "sudden_death" ? 9 : Math.max(0.7, Math.min(6, closing * 0.65)) * weaponBonus;
        a.hp -= damage / Math.max(0.5, a.mass); b.hp -= damage / Math.max(0.5, b.mass);
        a.flashFrames = 5; b.flashFrames = 5;
        const impulse = Math.max(2, closing) * (settings.environment === "bouncy" ? 1.7 : 1);
        a.vx -= nx * impulse / a.mass; a.vy -= ny * impulse / a.mass;
        b.vx += nx * impulse / b.mass; b.vy += ny * impulse / b.mass;
        a.x -= nx * 2; b.x += nx * 2;
        if (a.hp <= 0) { a.dead = true; this.kills++; if (settings.modifier === "vampire_kiss") b.hp = Math.min(b.maxHp, b.hp + 3); }
        if (b.hp <= 0) { b.dead = true; this.kills++; if (settings.modifier === "vampire_kiss") a.hp = Math.min(a.maxHp, a.hp + 3); }
        if (a.dead || b.dead) this.updateHud();
      }
    }
    this.fighters = this.fighters.filter(f => !f.dead);
  }

  draw(now: number) {
    const ctx = this.ctx; ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.damage.length) {
      ctx.save(); ctx.beginPath();
      for (const area of this.damage) {
        if (area.x + area.width < scrollX || area.y + area.height < scrollY || area.x > scrollX + innerWidth || area.y > scrollY + innerHeight) continue;
        ctx.rect(area.x - scrollX, area.y - scrollY, area.width, area.height);
      }
      ctx.clip();
      const sceneTime = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : now;
      if (this.variant === "classic") backgroundClassic(ctx, settings.theme as never, sceneTime, innerWidth, innerHeight, 0);
      else backgroundKs2(ctx, settings.theme as never, sceneTime, innerWidth, innerHeight, 0);
      ctx.restore();
    }
    ctx.save(); ctx.translate(-scrollX, -scrollY);
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
    ctx.restore();
  }

  action(name: string) {
    if (name === "exit") { this.stop(); return; }
    if (name === "pause") { this.paused = !this.paused; (this.root.querySelector('[data-action="pause"]') as HTMLElement).textContent = this.paused ? "Resume" : "Pause"; return; }
    if (name === "close" || (this.panel.dataset.open === "true" && this.panel.dataset.view === name)) { this.panel.dataset.open = "false"; return; }
    this.panel.dataset.view = name; this.panel.dataset.open = "true";
    const select = (label: string, key: keyof Settings, options: string[]) => `<label>${label}<select data-setting="${key}">${options.map(option => `<option value="${option}" ${settings[key] === option ? "selected" : ""}>${option.replaceAll("_", " ")}</option>`).join("")}</select></label>`;
    const npc = `<label>NPC team<select data-setting="npcSide"><option value="0" ${settings.npcSide === 0 ? "selected" : ""}>Off · both manual</option><option value="1" ${settings.npcSide === 1 ? "selected" : ""}>Left</option><option value="2" ${settings.npcSide === 2 ? "selected" : ""}>Right</option></select></label>`;
    if (name === "bestiary") {
      const entries = this.variant === "classic" ? classicBestiary : ks2Bestiary;
      this.panel.innerHTML = `<h2>${this.variant === "classic" ? "Classic" : "KS2"} Bestiary</h2><p class="notice">Choose a fighter for the next spawn.</p>${select("Spawn fighter", "fighter", entries.map(e => e.id))}<div>${entries.map(e => `<div class="entry"><strong style="color:${e.color}">${e.name}</strong><small>${e.role} · HP ${e.hp} · ${e.weapon}</small><div>${e.lore}</div></div>`).join("")}</div>`;
    } else if (name === "modifiers") {
      this.panel.innerHTML = `<h2>Live modifiers · M</h2><p class="notice">Changes apply to this live-page battle. The standalone arena has the remaining modifiers.</p>${select("Combat modifier", "modifier", modifiers)}${select("Environment", "environment", environments)}${select("Weapon loadout", "weapon", weapons)}${select("Arena theme", "theme", this.variant === "classic" ? themes : [...themes, "cyberpunk", "ethereal", "wasteland", "void", "outrun", "frostbite", "solaris", "deepsea", "nebula"])}${select("Fighter", "fighter", (this.variant === "classic" ? classicBestiary : ks2Bestiary).map(e => e.id))}<label>Fighter speed<input data-setting="speed" type="range" min="0.5" max="3" step="0.1" value="${settings.speed}"></label><p class="notice"><a href="https://demo.gsix.online/games/kinetic-${this.variant}" target="_blank" rel="noopener">Open the full ${this.variant === "classic" ? "Classic" : "KS2"} arena ↗</a></p>`;
    } else {
      this.panel.innerHTML = `<h2>Settings</h2><label>Version<select data-version><option value="classic" ${this.variant === "classic" ? "selected" : ""}>Classic (1)</option><option value="ks2" ${this.variant === "ks2" ? "selected" : ""}>KS2 (alpha)</option></select></label>${npc}<button data-resume-npc>Resume NPC on ${this.lastNpcSide === 1 ? "left" : "right"}</button><p class="notice">A spawns left. L spawns right. Tapping either side takes manual control; Resume NPC hands it back.</p><label>NPC interval<input data-setting="spawnMs" type="range" min="1000" max="6000" step="250" value="${settings.spawnMs}"></label><label>Health bars<input data-setting="displayHp" type="checkbox" ${settings.displayHp ? "checked" : ""}></label><p class="notice">Fighters stay at their document positions while you scroll. Newly added page elements join the arena.</p>`;
    }
    this.panel.querySelectorAll("[data-setting]").forEach(input => input.addEventListener("change", event => {
      const control = event.currentTarget as HTMLInputElement | HTMLSelectElement;
      const key = control.dataset.setting as keyof Settings;
      (settings as unknown as Record<string, unknown>)[key] = key === "npcSide" || key === "spawnMs" || key === "speed" ? Number(control.value) : key === "displayHp" ? (control as HTMLInputElement).checked : control.value;
      if (key === "npcSide" && settings.npcSide) this.lastNpcSide = settings.npcSide;
      this.updateHud();
    }));
    this.panel.querySelector("[data-version]")?.addEventListener("change", event => this.switchVariant((event.currentTarget as HTMLSelectElement).value as Variant));
    this.panel.querySelector("[data-resume-npc]")?.addEventListener("click", () => { settings.npcSide = this.lastNpcSide; this.updateHud(); this.panel.dataset.open = "false"; this.action("settings"); });
  }

  switchVariant(variant: Variant) { if (variant === this.variant) return; this.stop(); game = new PageBattle(variant); game.action("settings"); }
  stop() {
    this.running = false; cancelAnimationFrame(this.frame); this.observer.disconnect();
    window.removeEventListener("keydown", this.keydown, true); window.removeEventListener("resize", this.resize); window.removeEventListener("scroll", this.refresh);
    this.host.remove();
    window.dispatchEvent(new CustomEvent("lok:demoday:page-run", { detail: { version: 1, gameKey: "kinetic-souls", variant: this.variant, runId: this.runId, score: this.score + this.kills, xp: Math.min(200, this.score * 3 + this.kills), completedAt: new Date().toISOString() } }));
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

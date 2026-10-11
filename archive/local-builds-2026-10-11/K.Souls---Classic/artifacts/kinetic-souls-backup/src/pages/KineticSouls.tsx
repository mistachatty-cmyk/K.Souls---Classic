import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { 
  ARENA_W, ARENA_H, CHAR_RADIUS, BOT_MIN_INTERVAL, 
  BOT_MAX_INTERVAL, SCOREBOARD_H, GRID_CELL_SIZE 
} from "../game/constants";
import type { 
  GameMode, OpponentMode, ThemeMode, LokModifier, 
  CameraMode, ViewMode, MinimapPosition, WeaponStyle, 
  Environment, ScreenState, WeaponType, KineticType, 
  SkinType, LokPassportData, GameState, Character, Sabre, Particle, 
  Projectile, Ghost, FloatingText, KillFeedMsg, Drop, Essence 
} from "../game/types";
import { 
  spawnCharacter, getPartDamage, getRandomWeapon, resetCharIdCounter, getCharIdCounter 
} from "../systems/Spawner";
import { pushParticle, spawnExplosion } from "../systems/Particles";
import { getTeamColor, renderChar, drawWeapon } from "../render/DrawEntities";
import { drawThemeBackground, drawBtn, drawMainMenu, drawLokMenu, drawSettingsMenu, drawGameOver, drawBestiary } from "../render/DrawUI";
import { drawWorld } from "../render/DrawWorld";
import { updateBehaviors } from "../systems/Behaviors";
import { setupInputListeners } from "../systems/Input";
import { getWeaponTip, ObjectPoolSystem } from "../game/utils";

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : "";
};

/**
 * KineticSouls Main Game Component
 * 
 * This component drives the entire game engine. It uses a `requestAnimationFrame` loop
 * attached to a canvas element. To maintain 60+ FPS, it heavily relies on `useRef` for 
 * game state rather than React `useState`, preventing costly React re-renders during gameplay.
 */
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
    snapNext: false,
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
    | "area_lock"
    | "architect_pen"
    | "marionette"
  >("smite");
  const godActionRef = useRef(godAction);
  useEffect(() => { godActionRef.current = godAction; }, [godAction]);
  const [godTarget, setGodTarget] = useState<number>(2);
  const [birthType, setBirthType] = useState<KineticType>("standard");
  const birthTypeRef = useRef<KineticType>("standard");
  useEffect(() => { birthTypeRef.current = birthType; }, [birthType]);
  const [p1Skin, setP1Skin] = useState<SkinType>("default");
  const [p2Skin, setP2Skin] = useState<SkinType>("default");
  const [currentSplash, setCurrentSplash] = useState("LOK HORIZON: Connecting...");
  const [showMobileUI, setShowMobileUI] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showSkins, setShowSkins] = useState(false);
  const [bestiaryScroll] = useState(0);
  const [hoverBox, setHoverBox] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [, setTick] = useState(0);
  const [liveMenuWidth, setLiveMenuWidth] = useState(310);
  const [isResizingMenu, setIsResizingMenu] = useState(false);
  const joyRef = useRef({ active: false, startX: 0, startY: 0, dx: 0, dy: 0 });

  const [showMediaPlayer, setShowMediaPlayer] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"none"|"audio"|"video"|"youtube"|"soundcloud">("none");
  useEffect(() => {
    if (!mediaUrl) { setMediaType("none"); return; }
    if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) setMediaType("youtube");
    else if (mediaUrl.includes("soundcloud.com")) setMediaType("soundcloud");
    else if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) setMediaType("video");
    else setMediaType("audio");
  }, [mediaUrl]);

  const refMenuScroll = useRef(0);
  const refBestReplay = useRef<{ frames: any[]; victimId: number; maxV: number } | null>(null);
  const refReplayPlaybackIdx = useRef(0);

  // --- PERFORMANCE SYSTEM: OFFSCREEN SPRITE CACHE ---
  const spriteCacheRef = useRef<Map<string, HTMLCanvasElement>>(new Map());

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
  void bestiaryScroll;

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
    };
    window.addEventListener("resize", checkOrientation);
    checkOrientation();

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Attach the cache securely to the state reference so the drawing systems can access it
  useEffect(() => {
    (stateRef.current as any).spriteCache = spriteCacheRef.current;
  }, []);

  /**
   * Global Game State
   * Stored in a ref so the game loop can mutate and read it instantly without re-rendering.
   */
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
    aiDash: false,
    handOfGod: false,
    trickShots: false,
    fruitNinjaFx: false,
    optCache: true,
    optDelta: true,
    optGravity: true,
    optSmartSpawn: true,
    optGrid: true,
    optPool: true,
    optGridDebug: false, // Added to State
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
    antiGravity: false,
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
    bestiarySprites: true,
    bestiaryBossFx: true,
    menuAdvancedTitle: false,
    arenaTitle: false,
    minimapLogo: false,
    passportBorder: false,
    screensaverMode: false,
    hpBarStyle: "standard",
    floatingTextStyle: "standard",
    physicsMode: "standard",
    chaosMode: false,
    chaosTimer: 0,
    barriers: [],
    kineticStyle: "sabre",
  } as unknown as GameState);

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
  const refKinStyle = useRef<"classic" | "hd" | "sabre">("sabre");

  const refs = useMemo(() => ({
    mode: refMode, opp: refOpp, theme: refTheme, mod: refMod,
    cam: refCam, view: refView, env: refEnv, wep: refWep,
    tLimit: refTLimit, sLimit: refSLimit, fSpeed: refFSpeed, minimapPos: refMinimapPos, kinStyle: refKinStyle
  }), []);

  const screenRef = useRef<ScreenState>("menu");

  /**
   * Entity Data Stores
   * Arrays holding all active game objects. Wrapped in `dataRef` for easy passing.
   */
  const refChars = useRef<Character[]>([]);
  const refParts = useRef<Particle[]>([]);
  const refGhosts = useRef<Ghost[]>([]);
  const refTexts = useRef<FloatingText[]>([]);
  const refFeed = useRef<KillFeedMsg[]>([]);
  const refBombs = useRef<Drop[]>([]);
  const refProjs = useRef<Projectile[]>([]);
  const refEssences = useRef<Essence[]>([]);
  const refSabres = useRef<Sabre[]>([]);

  const dataRef = useMemo(() => ({
    chars: refChars, parts: refParts, ghosts: refGhosts, texts: refTexts,
    feed: refFeed, bombs: refBombs, projs: refProjs, essences: refEssences, sabres: refSabres
  }), []);

  const refRaf = useRef(0);
  const refLast = useRef(0);
  const refTimerAcc = useRef(0);
  const refBotTimer = useRef(0);
  const refBotNext = useRef(2500);
  const refP1Timer = useRef(0);
  const refBountyTimer = useRef(0);
  const refMenuDragY = useRef<number | null>(null);

  const timeRef = useMemo(() => ({
    raf: refRaf, last: refLast, timerAcc: refTimerAcc, botTimer: refBotTimer,
    botNext: refBotNext, p1Timer: refP1Timer, bountyTimer: refBountyTimer
  }), []);

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

  /**
   * Spawns floating text (e.g., damage numbers, heals) at a specific world coordinate.
   * Utilizes object pooling if `optPool` is enabled.
   */
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

  /**
   * Triggers a physics-based explosion that knocks back characters and deals damage.
   * Also spawns visual particles.
   */
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

  /**
   * Handles transition to the game over screen and determines the winner.
   */
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

  /**
   * Initializes and starts a new game based on current configuration refs.
   */
  const startGame = useCallback(() => {
    resetCharIdCounter();
    if (!stateRef.current.optPool) {
      dataRef.chars.current = [];
      dataRef.parts.current = [];
      dataRef.ghosts.current = [];
      dataRef.texts.current = [];
      dataRef.feed.current = [];
      dataRef.bombs.current = [];
      dataRef.projs.current = [];
      dataRef.essences.current = [];
      dataRef.sabres.current = [];
    } else {
      dataRef.chars.current.forEach((c) => (c.dead = true));
      dataRef.parts.current.forEach((p) => (p.active = false));
      dataRef.ghosts.current.forEach((g) => (g.active = false));
      dataRef.texts.current.forEach((t) => (t.active = false));
      dataRef.feed.current.forEach((f) => (f.active = false));
      dataRef.bombs.current.forEach((b) => (b.active = false));
      dataRef.projs.current.forEach((p) => (p.active = false));
      dataRef.essences.current.forEach((e) => (e.active = false));
      dataRef.sabres.current.forEach((s) => (s.active = false));
    }
    timeRef.timerAcc.current = 0;
    timeRef.botTimer.current = 0;
    timeRef.p1Timer.current = 0;
    timeRef.bountyTimer.current = 0;
    camRef.current = { x: ARENA_W / 2, y: SCOREBOARD_H + ARENA_H / 2, zoom: 1, snapNext: false };
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
    (stateRef.current as any).kineticStyle = refs.kinStyle.current;

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
        st.weaponStyle, st.fighterSpeed, undefined, undefined, birthTypeRef.current, p1SkinRef.current,
    );
    if (!st.optPool || c.id >= getCharIdCounter() - 1) dataRef.chars.current.push(c);
    lokCoinsRef.current = Math.max(0, lokCoinsRef.current - 5);
    }, [dataRef.chars]);

  const spawnP2 = useCallback(() => {
    const st = stateRef.current;
    if (!st.running || st.paused || screenRef.current !== "game") return;
    const kineticTypes: KineticType[] = [
      "standard", "tank", "assassin", "ninja", "sniper", "mage", "ghost",
      "zombie", "shield", "necromancer", "giant", "juggernaut", "null", "vampire_lord", "angel",
      "drone", "wasp", "fragment", "spore"
    ];
    const rType = kineticTypes[Math.floor(Math.random() * kineticTypes.length)];
    const isBossType = ["mage", "necromancer", "giant", "juggernaut", "null"].includes(rType);
    const c = spawnCharacter(
      2, st.modifier, dataRef.chars.current, st.optSmartSpawn, st.optPool,
      st.weaponStyle, st.fighterSpeed, undefined, undefined, rType, p2SkinRef.current, isBossType,
    );
    if (!st.optPool || c.id >= getCharIdCounter() - 1) dataRef.chars.current.push(c);
  }, [dataRef.chars]);

  /**
   * Main Game Engine Loop
   * Called every frame via `requestAnimationFrame`. Handles physics, AI, collision, and rendering.
   */
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

        // ─── PHYSICS & STATE UPDATES ─────────────────────────────────────────
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

          if ((state as any).barriers) {
             for (let i = (state as any).barriers.length - 1; i >= 0; i--) {
                (state as any).barriers[i].life -= dtRaw;
                if ((state as any).barriers[i].life <= 0) (state as any).barriers.splice(i, 1);
             }
          }
          if ((state as any).marionetteId !== undefined && (state as any).marionetteId !== null && mouseRef.current.isDown) {
             const mc = dataRef.chars.current.find(char => char.id === (state as any).marionetteId);
             if (mc && !mc.dead) {
                const dx = mouseRef.current.x - mc.x;
                const dy = mouseRef.current.y - mc.y;
                mc.vx += dx * 0.05;
                mc.vy += dy * 0.05;
             }
          }

          if (state.modifier === "lok_bounty" && screen === "game") {
            timeRef.bountyTimer.current += dtRaw * state.timeScale;
            if (timeRef.bountyTimer.current >= 8000) {
              timeRef.bountyTimer.current = 0;
              if (Math.random() < 0.6) {
                const b = spawnCharacter(3, state.modifier, dataRef.chars.current, state.optSmartSpawn, state.optPool, "none", state.fighterSpeed, undefined, undefined, "bounty");
                if (!state.optPool || b.id >= getCharIdCounter() - 1) dataRef.chars.current.push(b);
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
                const kTypes: KineticType[] = ["standard", "tank", "assassin", "ninja", "sniper", "mage", "ghost", "zombie", "shield", "necromancer", "giant", "juggernaut", "vampire_lord", "angel", "drone", "wasp", "fragment", "spore"];
                const rK = kTypes[Math.floor(Math.random() * kTypes.length)];
                const isBossK = ["mage", "necromancer", "giant", "juggernaut", "null", "vampire_lord"].includes(rK);
                const newC = spawnCharacter(2, state.modifier, dataRef.chars.current, state.optSmartSpawn, state.optPool, state.weaponStyle, state.fighterSpeed, undefined, undefined, rK, p2SkinRef.current, isBossK);
                if (!state.optPool || newC.id >= getCharIdCounter() - 1) dataRef.chars.current.push(newC);
              }
            }

            if (state.p1Auto) {
              timeRef.p1Timer.current += dtRaw * state.timeScale;
              if (timeRef.p1Timer.current >= BOT_MIN_INTERVAL + Math.random() * (BOT_MAX_INTERVAL - BOT_MIN_INTERVAL)) {
                timeRef.p1Timer.current = 0;
                const newC = spawnCharacter(1, state.modifier, dataRef.chars.current, state.optSmartSpawn, state.optPool, state.weaponStyle, state.fighterSpeed, undefined, undefined, birthTypeRef.current, p1SkinRef.current);
                if (!state.optPool || newC.id >= getCharIdCounter() - 1) dataRef.chars.current.push(newC);
              }
            }
          }

          const dt = subDtRaw * state.timeScale * 0.016;
          const DRAG = state.environment === "ice" ? 0.998 : state.environment === "bouncy" ? 1.0 : 0.985;
          let GRAVITY = 0;
          if (state.optGravity) {
            if (state.antiGravity) GRAVITY = -0.15;
            else if (state.moonGravity) GRAVITY = 0.1;
            else GRAVITY = 0.2; // Standard gravity fallback
          }

          const activeChars = dataRef.chars.current.filter((c) => !c.dead);
          state.stats.maxChars = Math.max(state.stats.maxChars, activeChars.length);

          for (const c of dataRef.chars.current) {
            if (c.dead) continue;

            if (state.draggingId === c.id) {
              c.vx = (mouseRef.current.x - c.x) * 0.45;
              c.vy = (mouseRef.current.y - c.y) * 0.45;
              c.stunTime = 100;
              c.angularV = (mouseRef.current.x - c.x) * 0.01;
            }

            if (isNaN(c.x) || isNaN(c.y) || Math.abs(c.vx) > 150 || Math.abs(c.vy) > 150) {
              c.dead = true;
              continue;
            }

            if (c.stunTime > 0) {
              c.stunTime -= dtRaw;
              c.vx *= 0.9;
              c.vy *= 0.9;
            } else {
              if (!state.screensaverMode) c.vy += GRAVITY;

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

              updateBehaviors(dataRef.chars.current, state, dtRaw, dataRef.parts.current, spawnText, dataRef.bombs.current, timestamp);
            }

            void dt;
            c.x += c.vx * (subDtRaw / 16.666) * state.timeScale;
            c.y += c.vy * (subDtRaw / 16.666) * state.timeScale;
            c.angle += c.angularV * state.timeScale;
            c.vx *= state.screensaverMode ? 1.0 : DRAG;
            c.vy *= state.screensaverMode ? 1.0 : DRAG;
            c.angularV *= 0.98; // Natural spin decay

            if ((c as any).tossedTimer > 0) (c as any).tossedTimer -= dtRaw;

            if (state.trickShots && Math.abs(c.angularV) > 0.01) {
              const speed = Math.hypot(c.vx, c.vy);
              if (speed > 1) {
                const nx = -c.vy / speed;
                const ny = c.vx / speed;
                const force = c.angularV * speed * 0.08;
                c.vx += nx * force;
                c.vy += ny * force;
              }
            }

            const cr = CHAR_RADIUS * c.scale;
            const sz = state.modifier === "shrinking_arena" ? state.shrinkingZone : 0;
            const minX = sz, maxX = ARENA_W - sz;
            const minY = SCOREBOARD_H + sz, maxY = SCOREBOARD_H + ARENA_H - sz;
            let bounce = state.environment === "bouncy" ? 1.05 : 0.82;
            if (state.screensaverMode) bounce = 1.0;

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

            if (c.sabreTimer > 0) {
              c.sabreTimer -= dtRaw;
              if (c.sabreTimer <= 0) {
                c.weapon = c.originalWeapon;
                for (let i = 0; i < 5; i++) {
                   pushParticle(c.x, c.y - CHAR_RADIUS * c.scale, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 20, "#ffff00", 2, dataRef.parts.current, state.optPool);
                }
              }
            }

            if ((c as any).isLocked && (c as any).lockTimer && (c as any).lockTimer > 0) {
              (c as any).lockTimer -= dtRaw;
              c.vx = 0; c.vy = 0;
              c.x = (c as any).lockedX || c.x;
              c.y = (c as any).lockedY || c.y;
              if ((c as any).lockTimer <= 0) (c as any).isLocked = false;
            }

            if ((state as any).barriers) {
               for (const b of (state as any).barriers) {
                  const lineDx = b.x2 - b.x1;
                  const lineDy = b.y2 - b.y1;
                  const lenSq = lineDx * lineDx + lineDy * lineDy;
                  if (lenSq === 0) continue;
                  const dot = ((c.x - b.x1) * lineDx + (c.y - b.y1) * lineDy) / lenSq;
                  const closestX = b.x1 + Math.max(0, Math.min(1, dot)) * lineDx;
                  const closestY = b.y1 + Math.max(0, Math.min(1, dot)) * lineDy;
                  const dist = Math.hypot(c.x - closestX, c.y - closestY);
                  if (dist < CHAR_RADIUS * c.scale + 2) {
                     const nx = (c.x - closestX) / dist;
                     const ny = (c.y - closestY) / dist;
                     c.vx += nx * 2; c.vy += ny * 2;
                     c.x = closestX + nx * (CHAR_RADIUS * c.scale + 2);
                     c.y = closestY + ny * (CHAR_RADIUS * c.scale + 2);
                  }
               }
            }
          }

          // ─── COLLISION RESOLUTION ──────────────────────────────────────────
          const chars = dataRef.chars.current;
          const handleCollision = (a: Character, b: Character) => {
            if (a.dead || b.dead) return;

            if (state.physicsMode === "phantoms") return;

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
                  let restitution = state.environment === "bouncy" ? 1.2 : 0.9;
                  if (state.physicsMode === "super_bouncy") restitution = 1.8;
                  else if (state.physicsMode === "lead_weights") restitution = 0.2;
                  const impulse = (2 * dot * restitution) / totalMass;
                  a.vx -= impulse * b.mass * nx;
                  a.vy -= impulse * b.mass * ny;
                  b.vx += impulse * a.mass * nx;
                  b.vy += impulse * a.mass * ny;
                }

              if (a.team !== b.team && (state.running || screen === "menu")) {
                const aPart = a.parts && a.parts.length > 0 ? a.parts[Math.floor(Math.random() * a.parts.length)] : null;
                const bPart = b.parts && b.parts.length > 0 ? b.parts[Math.floor(Math.random() * b.parts.length)] : null;
                  const dmgMult = Math.min(Math.abs(rawDot) * 0.5, 6); // Cap damage multiplier
                const aDmg = aPart ? getPartDamage(aPart.type) * dmgMult : 2 * dmgMult;
                const bDmg = bPart ? getPartDamage(bPart.type) * dmgMult : 2 * dmgMult;

                  let realADmg = Math.max(0.5, aDmg);
                  let realBDmg = Math.max(0.5, bDmg);

                  if (a.weapon === "none" && a.originalWeapon !== "none") realADmg = 0;
                  if (b.weapon === "none" && b.originalWeapon !== "none") realBDmg = 0;

                  if (a.shieldHp > 0) a.shieldHp -= realBDmg;
                  else a.hp -= realBDmg;
                  if (b.shieldHp > 0) b.shieldHp -= realADmg;
                  else b.hp -= realADmg;

                if (aPart && ((state as any).kineticStyle === "sabre" || !(state as any).kineticStyle) && aPart.type === "head" && a.weapon !== "none" && Math.random() < 0.14) {
                     const isBrkn = Math.random() < 0.14;
                     const element = isBrkn ? ["fire", "frost", "vortex"][Math.floor(Math.random() * 3)] : "none";
                     ObjectPoolSystem.acquire(
                       dataRef.sabres.current, state.optPool, 0,
                       () => ({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularV: 0, life: 0, maxLife: 0, active: false, scale: 1, weapon: "none" as WeaponType, isBrkn: false, element: "none", ownerId: -1 }),
                       (s) => {
                         s.x = a.x; s.y = a.y - CHAR_RADIUS * a.scale;
                         s.vx = a.vx * 0.5 + (Math.random() - 0.5) * 15; s.vy = a.vy * 0.5 - 5 - Math.random() * 5;
                         s.angle = a.angle; s.angularV = (Math.random() - 0.5) * 0.5;
                         s.life = 4000; s.maxLife = 4000;
                         s.scale = a.scale; s.weapon = a.weapon;
                         s.isBrkn = isBrkn; s.element = element; s.ownerId = a.id;
                       }
                     );
                  a.weapon = "none" as WeaponType;
                     a.sabreTimer = 4000 + Math.random() * 10000;
                  }

                if (bPart && ((state as any).kineticStyle === "sabre" || !(state as any).kineticStyle) && bPart.type === "head" && b.weapon !== "none" && Math.random() < 0.14) {
                     const isBrkn = Math.random() < 0.14;
                     const element = isBrkn ? ["fire", "frost", "vortex"][Math.floor(Math.random() * 3)] : "none";
                     ObjectPoolSystem.acquire(
                       dataRef.sabres.current, state.optPool, 0,
                       () => ({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularV: 0, life: 0, maxLife: 0, active: false, scale: 1, weapon: "none" as WeaponType, isBrkn: false, element: "none", ownerId: -1 }),
                       (s) => {
                         s.x = b.x; s.y = b.y - CHAR_RADIUS * b.scale;
                         s.vx = b.vx * 0.5 + (Math.random() - 0.5) * 15; s.vy = b.vy * 0.5 - 5 - Math.random() * 5;
                         s.angle = b.angle; s.angularV = (Math.random() - 0.5) * 0.5;
                         s.life = 4000; s.maxLife = 4000;
                         s.scale = b.scale; s.weapon = b.weapon;
                         s.isBrkn = isBrkn; s.element = element; s.ownerId = b.id;
                       }
                     );
                  b.weapon = "none" as WeaponType;
                     b.sabreTimer = 4000 + Math.random() * 10000;
                  }

                  a.flashFrames = 3;
                  b.flashFrames = 3;
                if (screen === "game") state.stats.totalDmg += realADmg + realBDmg;

                if (screen === "game" && state.modifier === "vampire_kiss") {
                    const vampTeam = a.team;
                    const vampire = vampTeam === a.team ? a : b;
                    vampire.hp = Math.min(vampire.maxHp, vampire.hp + 2);
                  }

                  if (screen === "game") {
                    if (a.kineticType === "vampire_lord" && realBDmg > 0) {
                      a.hp = Math.min(a.maxHp, a.hp + realBDmg * 0.5);
                      spawnText(a.x, a.y - 20, "+" + (realBDmg * 0.5).toFixed(1), "#ff0044");
                    }
                    if (b.kineticType === "vampire_lord" && realADmg > 0) {
                      b.hp = Math.min(b.maxHp, b.hp + realADmg * 0.5);
                      spawnText(b.x, b.y - 20, "+" + (realADmg * 0.5).toFixed(1), "#ff0044");
                    }
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
                  if (screen === "game") {
                    lokCoinsRef.current += 1;
                    if (Math.abs(rawDot) > 12) {
                      lokCoinsRef.current += 1;
                      spawnText((a.x + b.x) / 2, (a.y + b.y) / 2 - 20, "HEAVY HIT +1", "#ffd700");
                    }

                    // --- TRICK SHOT 2.0 BONUSES ---
                    if (state.trickShots && ((a as any).tossedTimer > 0 || (b as any).tossedTimer > 0) && Math.abs(rawDot) > 15) {
                      const skillSource = (a as any).tossedTimer > 0 ? a : b;
                      const skillTarget = (a as any).tossedTimer > 0 ? b : a;
                      lokCoinsRef.current += 5;
                      spawnText(skillSource.x, skillSource.y - 40, "TRICKSHOT +5 LoK", "#ffd700");

                      for (let i = 0; i < 3; i++) {
                        const vx = -nx * 12 + (Math.random() - 0.5) * 4;
                        const vy = -ny * 12 + (Math.random() - 0.5) * 4;
                        ObjectPoolSystem.acquire(
                          dataRef.projs.current, state.optPool, 0,
                          () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, color: "", team: 0, active: false, type: "laser" as "laser" | "fireball" }),
                          (p) => {
                            p.x = (a.x + b.x) / 2; p.y = (a.y + b.y) / 2;
                            p.vx = vx; p.vy = vy; p.life = 1000;
                            p.color = "#00ffff"; p.team = skillSource.team; p.type = "laser";
                          }
                        );
                      }

                      if (Math.random() < 0.2) {
                        skillTarget.stunTime = 3000;
                        spawnText(skillTarget.x, skillTarget.y, "FROZEN", "#00ffff");
                      } else if (Math.random() < 0.4) {
                        skillSource.vx *= 2.5; skillSource.vy *= 2.5;
                        spawnText(skillSource.x, skillSource.y, "ENRAGED", "#ff4400");
                      }
                      state.shakeFrames += 15;
                    }
                  }
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
                  () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, color: "", team: 0, active: false, type: "laser" as "laser" | "fireball" }),
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

          for (const s of dataRef.sabres.current) {
            if (!s.active) continue;
            s.x += s.vx * (subDtRaw / 16.666) * state.timeScale;
            s.y += s.vy * (subDtRaw / 16.666) * state.timeScale;
            s.angle += s.angularV * state.timeScale;
            s.life -= dtRaw;

            if (state.optGravity) {
              if (state.antiGravity) s.vy += -0.15 * state.timeScale;
              else if (state.moonGravity) s.vy += 0.05 * state.timeScale;
              else s.vy += 0.2 * state.timeScale;
            }
            s.vx *= 0.98;
            s.vy *= 0.98;

            if (s.x < 0) { s.x = 0; s.vx *= -0.8; s.angularV += (Math.random() - 0.5) * 0.2; }
            if (s.x > ARENA_W) { s.x = ARENA_W; s.vx *= -0.8; s.angularV += (Math.random() - 0.5) * 0.2; }
            if (s.y < SCOREBOARD_H) { s.y = SCOREBOARD_H; s.vy *= -0.8; s.angularV += (Math.random() - 0.5) * 0.2; }
            if (s.y > SCOREBOARD_H + ARENA_H) { s.y = SCOREBOARD_H + ARENA_H; s.vy *= -0.8; s.angularV += (Math.random() - 0.5) * 0.2; }

            if (s.life <= 0) {
              s.active = false;
              continue;
            }

            for (const c of dataRef.chars.current) {
              if (c.dead) continue;
              if (c.id === s.ownerId && s.maxLife - s.life < 500) continue;
              
              const dx = c.x - s.x;
              const dy = c.y - s.y;
              if (Math.hypot(dx, dy) < CHAR_RADIUS * c.scale + 15) {
                 if (s.isBrkn) {
                   if (s.element === "fire") triggerExplosion(c.x, c.y, 80, state, false);
                   else if (s.element === "frost") { c.stunTime = 3000; c.flashFrames = 10; }
                   else if (s.element === "vortex") dataRef.bombs.current.push({ type: "blackhole", x: c.x, y: c.y, timer: 3000, maxTimer: 3000, active: true, radius: 100 });
                 }
                 c.hp -= 5 * state.timeScale;
                 c.flashFrames = 3;
                 s.vx = -s.vx * 0.5 + (Math.random() - 0.5) * 5;
                 s.vy = -s.vy * 0.5 + (Math.random() - 0.5) * 5;
                 s.angularV += (Math.random() - 0.5) * 0.5;
                 
                 if (c.hp <= 0 && state.juice !== "off") { state.hitPause = state.juice === "super" ? 60 : 30; state.shakeFrames += 10; }
              }
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
                  if (!state.optPool || zombie.id >= getCharIdCounter() - 1) dataRef.chars.current.push(zombie);
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
                  (g) => { g.x = c.x; g.y = c.y; g.team = c.team; g.vy = state.antiGravity ? 0.8 : -0.8; g.life = 1500; g.maxLife = 1500; g.scored = false; }
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
      }

        // ─── RENDER PASS ─────────────────────────────────────────────────────
        const theme = state.theme;
        const ts = timestamp;

        if (screen === "game") {
          drawThemeBackground(ctx, theme, ts, ARENA_W, ARENA_H, SCOREBOARD_H);

          // --- GRID RENDERING WITH PARALLAX & JIGGLE ---
          ctx.save();
          let pOffsetX = 0;
          let pOffsetY = 0;
          if (state.parallaxGrid && state.camera !== "static") {
            pOffsetX = -(camRef.current.x - ARENA_W / 2) * 0.15;
            pOffsetY = -(camRef.current.y - (SCOREBOARD_H + ARENA_H / 2)) * 0.15;
          }
          if (state.reactiveGrid && state.shakeFrames > 0 && state.juice !== "off") {
            pOffsetX += (Math.random() - 0.5) * (state.juice === "super" ? 15 : 6);
            pOffsetY += (Math.random() - 0.5) * (state.juice === "super" ? 15 : 6);
          }

          if (
            theme !== "abyss" && theme !== "hacker" && theme !== "glitch" &&
            theme !== "monochrome" && theme !== "neon_abyss" && theme !== "rgb_cycle" &&
            state.environment !== "blackout"
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

          if (state.environment !== "ice" && state.environment !== "wrap" && state.environment !== "blackout" && theme !== "abyss" && theme !== "neon_abyss" && theme !== "rgb_cycle") {
            ctx.strokeStyle = theme === "gameboy" ? "#306230" : theme === "gilded" ? "#ffaa00" : theme === "comic" || theme === "paper_sketch" ? "#000" : "rgba(255,255,255,0.2)";
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 10]);
            ctx.beginPath(); ctx.moveTo(ARENA_W / 2 + pOffsetX, SCOREBOARD_H); ctx.lineTo(ARENA_W / 2 + pOffsetX, SCOREBOARD_H + ARENA_H); ctx.stroke();
            ctx.setLineDash([]);
          }
          ctx.restore();

          if (state.environment === "blackout") {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, SCOREBOARD_H, ARENA_W, ARENA_H);
          }

          if (state.modifier === "shrinking_arena" && state.shrinkingZone > 0) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
            ctx.fillRect(0, SCOREBOARD_H, ARENA_W, state.shrinkingZone);
            ctx.fillRect(0, SCOREBOARD_H + ARENA_H - state.shrinkingZone, ARENA_W, state.shrinkingZone);
            ctx.fillRect(0, SCOREBOARD_H, state.shrinkingZone, ARENA_H);
            ctx.fillRect(ARENA_W - state.shrinkingZone, SCOREBOARD_H, state.shrinkingZone, ARENA_H);
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 2;
            ctx.strokeRect(state.shrinkingZone, SCOREBOARD_H + state.shrinkingZone, ARENA_W - state.shrinkingZone * 2, ARENA_H - state.shrinkingZone * 2);
          }

          if (state.environment === "blackhole") {
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

          if (state.environment === "lava") {
            const pulse2 = 0.5 + 0.5 * Math.sin(ts * 0.003);
            ctx.fillStyle = `rgba(255, ${Math.floor(40 + pulse2 * 40)}, 0, 0.6)`;
            ctx.fillRect(0, SCOREBOARD_H + ARENA_H - 18, ARENA_W, 18);
          }
        }

        let targetX = ARENA_W / 2;
        let targetY = SCOREBOARD_H + ARENA_H / 2;
        let targetZoom = 1;
        const activeChars = dataRef.chars.current.filter((c) => !c.dead);

        if (state.camera === "enhanced" && activeChars.length > 0) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          for (const c of activeChars) {
            if (c.x < minX) minX = c.x; if (c.x > maxX) maxX = c.x;
            if (c.y < minY) minY = c.y; if (c.y > maxY) maxY = c.y;
          }
          const bw = Math.max(maxX - minX, 300), bh = Math.max(maxY - minY, 200);
          targetX = minX + bw / 2; targetY = minY + bh / 2;
          targetZoom = Math.min(ARENA_W / bw, ARENA_H / bh, 2.5);
        } else if (state.camera === "action" && activeChars.length > 0) {
          const teamChars = activeChars.filter((c) => c.team === state.actionCamTeam);
          if (teamChars.length > 0) {
            const targetChar = teamChars[state.actionCamIndex % teamChars.length] || teamChars[0];
            targetX = targetChar.x; targetY = targetChar.y; targetZoom = 2.5;
          }
        } else if (state.camera === "dynamic" && activeChars.length > 0) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          for (const c of activeChars) {
            if (c.x < minX) minX = c.x; if (c.x > maxX) maxX = c.x;
            if (c.y < minY) minY = c.y; if (c.y > maxY) maxY = c.y;
          }
          const bw = Math.max(maxX - minX + 200, 400), bh = Math.max(maxY - minY + 200, 250);
          targetX = minX + bw / 2; targetY = minY + bh / 2;
          targetZoom = Math.min(ARENA_W / bw, ARENA_H / bh, 2.2);
        } else if (state.camera === "focus" && activeChars.length > 0) {
          let targetChar = activeChars.find((c) => c.id === state.focusTargetId);
          if (!targetChar) { targetChar = activeChars[0]; state.focusTargetId = targetChar.id; }
          targetX = targetChar.x; targetY = targetChar.y; targetZoom = state.focusZoom;
        }

        camRef.current.x += (targetX - camRef.current.x) * 0.08;
        camRef.current.y += (targetY - camRef.current.y) * 0.08;
        camRef.current.zoom += (targetZoom - camRef.current.zoom) * 0.08;

        drawWorld(ctx, state, {
          chars: dataRef.chars.current,
          parts: dataRef.parts.current,
          ghosts: dataRef.ghosts.current,
          texts: dataRef.texts.current,
          bombs: dataRef.bombs.current,
          projs: dataRef.projs.current,
          essences: dataRef.essences.current,
          sabres: dataRef.sabres.current
        }, timestamp, mouseRef.current, godActionRef.current, camRef.current);

        if (state.hud && screen === "game") {
          if (state.classicMenu) {
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
            ctx.fillText(`P1: ${state.p1Score}`, 140, 36);
            
            ctx.fillStyle = theme === "gameboy" ? "#306230" : theme === "comic" || theme === "paper_sketch" ? "#888" : "#3366cc";
            ctx.fillText(`P2: ${state.p2Score}`, ARENA_W - 140, 36);
            
            ctx.fillStyle = theme === "gameboy" ? "#0f380f" : theme === "gilded" || theme === "lokmod" ? "#ffd700" : theme === "comic" || theme === "paper_sketch" ? "#000" : "#aaaaaa";
            ctx.font = "bold 22px monospace";
            ctx.fillText("KINETIC SOULS", ARENA_W / 2, 24);

            ctx.fillStyle = theme === "gameboy" ? "#0f380f" : theme === "comic" || theme === "paper_sketch" ? "#000" : "#ffaa00";
            ctx.font = "bold 10px monospace";
            ctx.fillText(`DIR POINTS: ${state.directorScore}`, ARENA_W / 2, 36);

            ctx.font = "12px monospace";
            if (state.mode === "horde" || state.mode === "infection") ctx.fillText(`SURVIVE 50 KILLS | ENEMY KILLS: ${state.p2Score}/15`, ARENA_W / 2, 50);
            else if (state.mode === "unlimited") ctx.fillText(`TIME: ∞ | LIMIT: ∞`, ARENA_W / 2, 50);
            else if (state.mode === "timer") ctx.fillText(`TIME: ${Math.floor(state.timeLeft / 60)}:${Math.floor(state.timeLeft % 60).toString().padStart(2, "0")}`, ARENA_W / 2, 50);
            else ctx.fillText(`FIRST TO ${state.scoreLimit}`, ARENA_W / 2, 50);

            if (state.modifier !== "none" || state.camera !== "static" || state.p1Auto || state.opponent === "ffa") {
              ctx.fillStyle = theme === "gameboy" ? "#306230" : theme === "gilded" || theme === "lokmod" ? "#ffaa00" : theme === "comic" || theme === "paper_sketch" ? "#666" : "#ffaa00";
              ctx.fillText(`[MOD: ${state.modifier.toUpperCase()} | CAM: ${state.camera.toUpperCase()} | AUTO: ${state.p1Auto ? "ON" : "OFF"}]`, ARENA_W / 2, 60);
            }

            if (state.devMode) {
              const activeChars = dataRef.chars.current.filter((c) => !c.dead);
              ctx.textAlign = "left";
              ctx.fillStyle = "#00ff00";
              ctx.font = "10px monospace";
              ctx.fillText(`DEV MODE ACTIVE`, 10, SCOREBOARD_H + 20);
              ctx.fillText(`Entities: ${activeChars.length}`, 10, SCOREBOARD_H + 35);
              ctx.fillText(`Particles: ${state.optPool ? dataRef.parts.current.filter((p) => p.active).length : dataRef.parts.current.length}`, 10, SCOREBOARD_H + 50);
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
            ctx.fillText(`P1: ${state.p1Score}`, 16, 22);
            ctx.textAlign = "right";
            ctx.fillText(`P2: ${state.p2Score}`, ARENA_W - 16, 22);
            ctx.textAlign = "center";

            if (state.mode === "timer" && state.timeLeft !== Infinity) {
              const timeColor = state.timeLeft <= 10 ? "#ff2200" : state.timeLeft <= 30 ? "#ffaa00" : hudText;
              ctx.fillStyle = timeColor;
              ctx.font = "bold 22px monospace";
              ctx.fillText(`${Math.ceil(state.timeLeft)}s`, ARENA_W / 2, 24);
            } else if (state.mode === "score") {
              ctx.fillStyle = hudText;
              ctx.font = "14px monospace";
              ctx.fillText(`Score limit: ${state.scoreLimit}`, ARENA_W / 2, 24);
            }

            ctx.fillStyle = "rgba(255,200,0,0.7)";
            ctx.font = "11px monospace";
            ctx.fillText(`⚡ Dir: ${state.directorScore}`, ARENA_W / 2, 44);

            if (state.modifier !== "none") {
              ctx.fillStyle = "#ffaa00";
              ctx.font = "10px monospace";
              ctx.textAlign = "left";
              ctx.fillText(`[${state.modifier.replace(/_/g, " ").toUpperCase()}]`, 16, 44);
            }
            if (state.environment !== "none") {
              ctx.fillStyle = "#00aaff";
              ctx.font = "10px monospace";
              ctx.textAlign = "right";
              ctx.fillText(`ENV: ${state.environment.toUpperCase()}`, ARENA_W - 16, 44);
            }

            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.font = "10px monospace";
            ctx.textAlign = "right";
            let hudActiveFighters = 0;
            for (let i=0; i<dataRef.chars.current.length; i++) if (!dataRef.chars.current[i].dead) hudActiveFighters++;
            ctx.fillText(`Fighters: ${hudActiveFighters}`, ARENA_W - 16, 58);
          }

          if (state.viewMode === "standard") {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const mw = 120, mh = 80;
            let mx = ARENA_W - mw - 10;
            let my = SCOREBOARD_H + ARENA_H - mh - 10;
            
            if (state.minimapPosition === "bottom-left") { mx = 10; my = SCOREBOARD_H + ARENA_H - mh - 10; }
            else if (state.minimapPosition === "top-right") { mx = ARENA_W - mw - 10; my = SCOREBOARD_H + 10; }
            else if (state.minimapPosition === "top-left") { mx = 10; my = SCOREBOARD_H + 10; }

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

          if (state.paused) {
            if (state.classicMenu) {
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
          if (state.classicMenu) {
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
          if (screen === ("replay" as any)) {
          const replay = refBestReplay.current!;
          const frame = replay.frames[Math.floor(refReplayPlaybackIdx.current)];
          
          if (!frame) {
            screenRef.current = "over";
            return;
          }

          drawThemeBackground(ctx, state.theme, ts, ARENA_W, ARENA_H, SCOREBOARD_H);

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
            renderChar(ctx, c, c.flashFrames > 0, 1, state.theme, state.devMode, false, ts, (state as any).kineticStyle);
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
            drawWeapon(ctx, s.weapon, s.scale, wCol1, wCol2, state.theme, ts);
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

        if (state.crtFilter && screen === "game") {
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

        if (state.vhsFilter && screen === "game") {
          const glitchLine = Math.floor(Math.random() * ARENA_H);
          ctx.fillStyle = "rgba(255,0,0,0.04)";
          ctx.fillRect(0, SCOREBOARD_H + glitchLine, ARENA_W, 2);
          ctx.fillStyle = "rgba(0,0,255,0.04)";
          ctx.fillRect(2, SCOREBOARD_H + glitchLine, ARENA_W, 2);
        }

        if (state.invertFilter && screen === "game") {
          ctx.globalCompositeOperation = "difference";
          ctx.fillStyle = "white";
          ctx.fillRect(0, SCOREBOARD_H, ARENA_W, ARENA_H);
          ctx.globalCompositeOperation = "source-over";
        }

      timeRef.raf.current = requestAnimationFrame(gameLoop);
    },
    [refs, dataRef, timeRef, endGame, triggerExplosion, spawnText],
  );

  useEffect(() => {
    timeRef.last.current = performance.now();
    timeRef.raf.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(timeRef.raf.current);
  }, [gameLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const inputCleanup = setupInputListeners(
      canvas,
      stateRef,
      dataRef,
      mouseRef,
      keysRef,
      screenRef,
      godActionRef,
      camRef,
      refMenuScroll,
      refMenuDragY,
      {
        startGame,
        endGame,
        spawnP1,
        spawnP2,
        setShowLiveMenu,
        spawnText,
        setTick,
        pushParticle,
        updateConfig: (key: string, value: any) => {
          if (value === "header") return; // Safely ignore category header clicks
          if (key === 'mode') refs.mode.current = value;
          else if (key === 'theme') { 
             refs.theme.current = value; 
             stateRef.current.theme = value; 
             spriteCacheRef.current.clear(); // Invalidate cache on UI theme swap
          }
          else if (key === 'mod') refs.mod.current = value;
          else if (key === 'cam') refs.cam.current = value;
          else if (key === 'wep') refs.wep.current = value;
          else if (key === 'env') refs.env.current = value;
          else if (key === 'view') refs.view.current = value;
          else if (key === 'opp') refs.opp.current = value;
        }
      }
    );

    return inputCleanup;
  }, [startGame, spawnP1, spawnP2, dataRef, spawnText]);

  const allSkins: SkinType[] = ["default", "ballman", "fallguys", "voxel", "mecha", "diamond", "skull", "robot", "pacman", "tea", "food", "ghost"];

  const modeMap: Record<string, string> = { timer: "Timer", score: "Score", horde: "Horde", infection: "Infection", unlimited: "Unlimited" };
  const oppMap: Record<string, string> = { pvp: "PvP", bot: "Bot", ffa: "4-Way FFA" };
  const themeMap: Record<string, string> = { classic: "Classic", runesite: "Runesite", gsix: "GSix", neon: "Neon", gameboy: "GameBoy", runesite_ultimate: "Runesite (Ult)", gilded: "Gilded", lokmod: "LokMod", glitch: "Glitch", rgb_cycle: "RGB Chroma", comic: "Comic Book", neon_abyss: "Neon Abyss", cyberpunk: "Cyberpunk", ethereal: "Ethereal", wasteland: "Wasteland", monochrome: "Monochrome", void: "The Void", celestial: "Celestial", overdrive: "Overdrive", abyss: "Abyss", hacker: "Hacker", synthwave: "Synthwave", vampire: "Vampire", oceanic: "Oceanic", infernal: "Infernal", glassmorphism: "Glass", wireframe_matrix: "Matrix", celestial_forge: "Cel. Forge", blood_moon: "Blood Moon", neon_overdrive: "Neon OD", paper_sketch: "Paper", outrun: "Outrun", frostbite: "Frostbite", solaris: "Solaris", deepsea: "Deepsea", liminal: "Liminal", nebula: "Nebula" };
  const modMap: Record<string, string> = { none: "None", sudden_death: "Sudden Death", shrinking_arena: "Shrinking Arena", titans: "Titans", vampire_kiss: "Vampire's Kiss", necromancy: "Necromancy", magnet: "Magnets", repel: "Repel", lok_bounty: "LoK Bounty" };
  const wepMap: Record<string, string> = { standard: "Standard", roulette: "Roulette", melee_mash: "Melee Mash", ranged_test: "Ranged" };
  const envMap: Record<string, string> = { none: "None", ice: "Ice Rink", blackhole: "Black Hole", lava: "Lava Floor", storm: "Storm", bouncy: "Bouncy Walls", wrap: "Wraparound", blackout: "Blackout" };
  const viewMap: Record<string, string> = { standard: "Standard", theater: "Theater", cinematic: "Cinematic" };
  const camMap: Record<string, string> = { static: "Static", dynamic: "Dynamic", action: "Action", enhanced: "Enhanced", focus: "Focus Cam" };
  const juiceMap: Record<string, string> = { off: "Juice: OFF", normal: "Juice: NORM", super: "Juice: SUPR" };
  const kinStyleMap: Record<string, string> = { classic: "Classic", hd: "HD", sabre: "Sabre" };
  const fpsOptions = [60, 120, 240];
  const godActionMap: Record<string, string> = { smite: "Smite", heal: "Heal", revive: "Revive", freeze: "Freeze", enrage: "Enrage", mutate: "Mutate", infect: "Infect", ascend: "Ascend", area_lock: "Area Lock", architect_pen: "Arch. Pen", marionette: "Marionette" };
  const birthMap: Record<string, string> = { standard: "Standard", tank: "Tank", assassin: "Assassin", ninja: "Ninja", sniper: "Sniper", ghost: "Ghost", zombie: "Zombie", shield: "Shield", giant: "Giant", mage: "Mage", necromancer: "Necromancer", juggernaut: "Juggernaut", null: "Null", bounty: "Bounty", volatile: "Volatile", vanguard: "Vanguard", weaver: "Weaver", gravity: "Gravity", hivemind: "Hivemind", glitch_chrono: "Chrono", vampire_lord: "Vampire L.", bat: "Bat", angel: "Angel", cherub: "Cherub", drone: "Drone", wasp: "Wasp", fragment: "Fragment", spore: "Spore" };
  const minimapOptions = ["bottom-right", "bottom-left", "top-right", "top-left", "bottom-center", "top-center", "center"];
  const minimapMap: Record<string, string> = { "bottom-right": "Bottom Right", "bottom-left": "Bottom Left", "top-right": "Top Right", "top-left": "Top Left", "bottom-center": "Bottom Center", "top-center": "Top Center", "center": "Center" };

  const tooltips: Record<string, string> = {
    "Mode": "Win condition: Timer, Score, Horde, Infection, etc.",
    "Opponent": "Fight Humans, AI Bots, or Free-For-All.",
    "Theme (Visuals)": "Changes color palette and effects.",
    "Kinetic Style": "Switch character visuals between Classic, HD, and Sabre.",
    "Modifier": "Special rules. LoK Bounty drops VIP targets.",
    "Weapons": "Restrict the arena to specific weapon sets.",
    "Environment": "Hazards like Black Holes, Ice, Lava, etc.",
    "View Mode": "Standard shows UI. Theater/Cinematic hides it.",
    "Camera Mode": "Dynamic follows action. Focus locks on one.",
    "Minimap Pos": "Moves the tactical radar map.",
    "Hit Juice": "Visual impact intensity (screenshake, hits).",
    "Target FPS": "Engine tick rate. Higher = smoother physics.",
    "Arena Title": "Giant hovering Kinetic Souls logo in the background.",
    "Minimap Logo": "Hovering Kinetic Souls title over the tactical map.",
    "Passport Border": "Glowing animated border indicating you are logged into LoK Passport.",
    "3D Title FX": "Adds 3D shadows and tech rings to the classic menu title.",
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
    "AI Dashing": "Melee kinetics will lunge at targets when in range.",
    "Moon Gravity": "Adds low-G floaty physics.",
    "Anti-Gravity": "Reverses gravity, sending kinetics to the ceiling.",
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
      <div onMouseEnter={() => setHoverBox({ text: tooltips[label] || label, x: 0, y: 0 })} onMouseLeave={() => setHoverBox(null)} onWheel={(e) => { if (!(stateRef.current as any).lokMenuHoverCycle) return; e.stopPropagation(); e.deltaY > 0 ? handleNext() : handlePrev(); }} style={{ display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(102, 170, 255, 0.2)", borderRadius: "4px", padding: "4px 6px" }}>
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

      {/* Landscape Enforcement Overlay for Mobile */}
      {isPortrait && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(10, 5, 15, 0.98)", zIndex: 99999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#ffd700", fontFamily: "monospace", textAlign: "center", padding: "20px", backdropFilter: "blur(10px)" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px", transform: "rotate(-90deg)" }}>📱</div>
          <h2 style={{ fontSize: "28px", marginBottom: "10px", textShadow: "0 0 15px rgba(255,215,0,0.6)" }}>ROTATE DEVICE</h2>
          <p style={{ color: "#fff", fontSize: "14px", maxWidth: "80%", lineHeight: 1.5 }}>Kinetic Souls is optimized for Landscape viewing. Please rotate your phone to access the Ultimate Sandbox.</p>
        </div>
      )}

      {/* Sleek Mobile & App HUD */}
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: "10px", zIndex: 100 }}>
        {deferredPrompt && (
          <button 
            onClick={async () => {
              deferredPrompt.prompt();
              const { outcome } = await deferredPrompt.userChoice;
              if (outcome === 'accepted') setDeferredPrompt(null);
            }} 
            style={{ background: "rgba(0, 150, 255, 0.2)", color: "#55aaff", border: "1px solid #55aaff", padding: "6px 14px", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold", borderRadius: "20px", cursor: "pointer", backdropFilter: "blur(4px)", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}
          >
            📲 INSTALL APP
          </button>
        )}
        <button 
          onClick={() => setShowLiveMenu(v => !v)} 
          style={{ background: showLiveMenu ? "rgba(255, 215, 0, 0.3)" : "rgba(20, 15, 5, 0.7)", color: "#ffd700", border: "1px solid #ffd700", padding: "6px 14px", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold", borderRadius: "20px", cursor: "pointer", backdropFilter: "blur(4px)", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}
        >
          ⚙️ LOK MODS
        </button>
        <button 
          onClick={() => setShowMobileUI(v => !v)} 
          style={{ background: showMobileUI ? "rgba(255, 255, 255, 0.2)" : "rgba(20, 15, 5, 0.7)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", padding: "6px 14px", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold", borderRadius: "20px", cursor: "pointer", backdropFilter: "blur(4px)", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}
        >
          📱 {showMobileUI ? "HIDE UI" : "MOBILE UI"}
        </button>
      </div>

        {/* Quick Access Floating Sidebar (Themes & Lok Mods) */}
        <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "10px", zIndex: 101, pointerEvents: "auto" }}>
          <button
            onClick={() => setShowLiveMenu(v => !v)}
            style={{
              background: showLiveMenu ? "rgba(255, 215, 0, 0.4)" : "rgba(20, 15, 5, 0.8)",
              color: "#ffd700", border: "2px solid #ffd700", padding: "16px 8px", fontSize: "13px", fontFamily: "monospace", fontWeight: "bold", borderRadius: "8px", cursor: "pointer", backdropFilter: "blur(4px)", boxShadow: "0 4px 10px rgba(0,0,0,0.5)", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)"
            }}
          >
            ⚙️ LOK MODS
          </button>

          <button
            onClick={() => setShowMediaPlayer(v => !v)}
            style={{
              background: showMediaPlayer ? "rgba(255, 215, 0, 0.4)" : "rgba(20, 15, 5, 0.8)",
              color: "#ffd700", border: "2px solid #ffd700", padding: "16px 8px", fontSize: "13px", fontFamily: "monospace", fontWeight: "bold", borderRadius: "8px", cursor: "pointer", backdropFilter: "blur(4px)", boxShadow: "0 4px 10px rgba(0,0,0,0.5)", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)"
            }}
          >
            🎵 MEDIA
          </button>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", background: "rgba(20, 15, 5, 0.8)", border: "2px solid rgba(255,255,255,0.6)", borderRadius: "8px", padding: "4px", backdropFilter: "blur(4px)", boxShadow: "0 4px 10px rgba(0,0,0,0.5)", alignItems: "center" }}>
            <button
              onClick={() => {
                const themes = Object.keys(themeMap) as ThemeMode[];
                const idx = themes.indexOf(stateRef.current.theme);
                const prevTheme = themes[(idx - 1 + themes.length) % themes.length];
                stateRef.current.theme = prevTheme;
                refs.theme.current = prevTheme;
                spriteCacheRef.current.clear(); // Safely wipe cache so new theme colors generate!
                setTick(t => t + 1);
              }}
              style={{ background: "transparent", color: "#fff", border: "none", fontSize: "16px", cursor: "pointer", padding: "4px" }}
            >
              ▲
            </button>
            <div style={{ color: "#fff", fontSize: "11px", fontFamily: "monospace", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", textAlign: "center", padding: "8px 0", fontWeight: "bold" }}>
              THEME
            </div>
            <button
              onClick={() => {
                const themes = Object.keys(themeMap) as ThemeMode[];
                const idx = themes.indexOf(stateRef.current.theme);
                const nextTheme = themes[(idx + 1) % themes.length];
                stateRef.current.theme = nextTheme;
                refs.theme.current = nextTheme;
                spriteCacheRef.current.clear(); // Safely wipe cache so new theme colors generate!
                setTick(t => t + 1);
              }}
              style={{ background: "transparent", color: "#fff", border: "none", fontSize: "16px", cursor: "pointer", padding: "4px" }}
            >
              ▼
            </button>
          </div>
        </div>

      {/* TIGHT ARENA WRAPPER: Keeps the LoK menu docked perfectly to the canvas edge */}
      <div
        style={{
          display: "flex",
          flexDirection: ((stateRef.current as any).lokMenuPosition || "left") === "left" ? "row" : "row-reverse",
          alignItems: "stretch",
          width: "fit-content",
          maxWidth: "100vw",
          maxHeight: "100vh",
          position: "relative",
        }}
      >

      {/* Live Mods Menu as a Sidebar */}
      {showLiveMenu && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexShrink: 0,
            zIndex: 1000,
            pointerEvents: "auto",
            backgroundColor: "rgba(10, 5, 15, 0.95)",
            borderLeft: "2px solid #ffd700",
            borderRight: "none",
            boxShadow: "inset -10px 0 20px rgba(255,215,0,0.05)",
          }}
        >
          <div
            style={{
              width: `${liveMenuWidth}px`,
              minWidth: `${liveMenuWidth}px`,
              padding: "20px 16px",
              color: "#fff",
              fontFamily: "'Courier New', Courier, monospace",
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
            <button onClick={() => { (stateRef.current as any).lokMenuPosition = (stateRef.current as any).lokMenuPosition === "left" ? "right" : "left"; setTick((t) => t + 1); }} style={{ fontSize: "10px", background: "rgba(255,215,0,0.1)", border: "1px solid #ffd700", color: "#ffd700", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
              DOCK: {((stateRef.current as any).lokMenuPosition || "left").toUpperCase()}
            </button>
            <label style={{ fontSize: "10px", color: "#ccc", display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={(stateRef.current as any).lokMenuHoverCycle ?? true} onChange={e => { (stateRef.current as any).lokMenuHoverCycle = e.target.checked; setTick(t=>t+1); }} style={{ marginRight: "6px" }} />
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
            {renderSleekSelect("Mode", stateRef.current.mode, Object.keys(modeMap), modeMap, (v) => { stateRef.current.mode = v; refs.mode.current = v; })}
            {renderSleekSelect("Opponent", stateRef.current.opponent, Object.keys(oppMap), oppMap, (v) => { stateRef.current.opponent = v; refs.opp.current = v; })}
            {renderSleekSelect("Theme (Visuals)", stateRef.current.theme, Object.keys(themeMap), themeMap, (v) => { stateRef.current.theme = v; refs.theme.current = v; spriteCacheRef.current.clear(); })}
            {renderSleekSelect("Kinetic Style", (stateRef.current as any).kineticStyle || "sabre", Object.keys(kinStyleMap), kinStyleMap, (v) => { (stateRef.current as any).kineticStyle = v; refs.kinStyle.current = v; spriteCacheRef.current.clear(); setTick(t => t + 1); })}
            {renderSleekSelect("Modifier", stateRef.current.modifier, Object.keys(modMap), modMap, (v) => { stateRef.current.modifier = v; refs.mod.current = v; })}
            {renderSleekSelect("Weapons", stateRef.current.weaponStyle, Object.keys(wepMap), wepMap, (v) => { stateRef.current.weaponStyle = v; refs.wep.current = v; })}
            {renderSleekSelect("Environment", stateRef.current.environment, Object.keys(envMap), envMap, (v) => { stateRef.current.environment = v; refs.env.current = v; })}
            {renderSleekSelect("View Mode", stateRef.current.viewMode, Object.keys(viewMap), viewMap, (v) => { stateRef.current.viewMode = v; refs.view.current = v; })}
            {renderSleekSelect("Camera Mode", stateRef.current.camera, Object.keys(camMap), camMap, (v) => { stateRef.current.camera = v; refs.cam.current = v; })}
            {renderSleekSelect("Minimap Pos", stateRef.current.minimapPosition, minimapOptions, minimapMap, (v) => { stateRef.current.minimapPosition = v; refs.minimapPos.current = v; })}
            {renderSleekSelect("Hit Juice", stateRef.current.juice, Object.keys(juiceMap), juiceMap, (v) => { stateRef.current.juice = v; })}
            {renderSleekSelect("Target FPS", stateRef.current.fpsTarget, fpsOptions, {60:"60 FPS", 120:"120 FPS", 240:"240 FPS"}, (v) => { stateRef.current.fpsTarget = v; })}
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
            {renderSleekToggle("Trick Shots", "#55ff55", stateRef.current.trickShots, (v) => stateRef.current.trickShots = v)}
            {renderSleekToggle("Aggro Magnet", "#55ff55", stateRef.current.aiMagnetic, (v) => stateRef.current.aiMagnetic = v)}
            {renderSleekToggle("AI Dashing", "#55ff55", !!(stateRef.current as any).aiDash, (v) => (stateRef.current as any).aiDash = v)}
            {renderSleekToggle("Moon Gravity", "#55ff55", stateRef.current.moonGravity, (v) => stateRef.current.moonGravity = v)}
            {renderSleekToggle("Anti-Gravity", "#55ff55", stateRef.current.antiGravity, (v) => stateRef.current.antiGravity = v)}
            {renderSleekToggle("Slo-Mo Kills", "#55ff55", stateRef.current.sloMoKills, (v) => stateRef.current.sloMoKills = v)}
            {renderSleekToggle("Boom Corpses", "#55ff55", stateRef.current.explodingCorpses, (v) => stateRef.current.explodingCorpses = v)}
            {renderSleekToggle("Sprite Cache", "#55ff55", stateRef.current.optCache, (v) => stateRef.current.optCache = v)}
            {renderSleekToggle("Swarm Grid", "#55ff55", stateRef.current.optGrid, (v) => stateRef.current.optGrid = v)}
            {renderSleekToggle("Memory Pool", "#55ff55", stateRef.current.optPool, (v) => stateRef.current.optPool = v)}
            {renderSleekToggle("Arena Title", "#ffaaee", stateRef.current.arenaTitle, (v) => stateRef.current.arenaTitle = v)}
            {renderSleekToggle("Minimap Logo", "#66aaff", stateRef.current.minimapLogo, (v) => stateRef.current.minimapLogo = v)}
            {renderSleekToggle("Delta Physics", "#55ff55", stateRef.current.optDelta, (v) => stateRef.current.optDelta = v)}
            {renderSleekToggle("Gravity FX", "#55ff55", stateRef.current.optGravity, (v) => stateRef.current.optGravity = v)}
            {renderSleekToggle("DEV Hitboxes", "#ff0000", stateRef.current.devMode, (v) => stateRef.current.devMode = v)}
            {renderSleekToggle("Dim. Knockout", "#ff00ff", stateRef.current.dimKnockout, (v) => stateRef.current.dimKnockout = v)}
            {renderSleekToggle("Arena Title", "#ffaaee", stateRef.current.arenaTitle, (v) => stateRef.current.arenaTitle = v)}
            {renderSleekToggle("Minimap Logo", "#66aaff", stateRef.current.minimapLogo, (v) => stateRef.current.minimapLogo = v)}
            {renderSleekToggle("Passport Border", "#ffd700", stateRef.current.passportBorder, (v) => stateRef.current.passportBorder = v)}
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
        {/* Drag Handle */}
        <div
          onPointerDown={(e) => { e.preventDefault(); setIsResizingMenu(true); }}
          style={{
            width: "8px",
            cursor: "ew-resize",
            backgroundColor: isResizingMenu ? "rgba(255, 215, 0, 0.5)" : "transparent",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 215, 0, 0.3)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isResizingMenu ? "rgba(255, 215, 0, 0.5)" : "transparent"}
        />
      </div>
      )}

      {/* Main Game Container */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
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

      {/* LoK Media Player Overlay */}
      {showMediaPlayer && (
        <div
          style={{
            position: "absolute",
            bottom: showSkins ? 80 : 30, // dynamically dodge the skin picker
            left: "50%",
            transform: "translateX(-50%)",
            width: "340px",
            background: "rgba(10, 5, 15, 0.95)",
            border: "1px solid #ffd700",
            borderRadius: "8px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: 105,
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.8)",
            pointerEvents: "auto"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#ffd700", fontSize: "12px", fontFamily: "monospace", fontWeight: "bold" }}>🎵 LOK MEDIA PLAYER</span>
            <button onClick={() => setShowMediaPlayer(false)} style={{ background: "transparent", color: "#ff4444", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>✕</button>
          </div>
          <input
            type="text"
            placeholder="Paste MP3, MP4, YouTube, or SoundCloud URL..."
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            style={{ width: "100%", padding: "6px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "1px solid #444", borderRadius: "4px", fontSize: "10px", fontFamily: "monospace", boxSizing: "border-box", outline: "none" }}
          />
          {mediaType === "youtube" && <iframe width="100%" height="80" src={`https://www.youtube.com/embed/${getYouTubeId(mediaUrl)}`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen style={{ borderRadius: "4px" }}></iframe>}
          {mediaType === "soundcloud" && <iframe width="100%" height="80" scrolling="no" frameBorder="no" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(mediaUrl)}&color=%23ffd700&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`} style={{ borderRadius: "4px" }}></iframe>}
          {mediaType === "audio" && mediaUrl && <audio controls src={mediaUrl} style={{ width: "100%", height: "30px", borderRadius: "4px" }} />}
          {mediaType === "video" && mediaUrl && <video controls src={mediaUrl} style={{ width: "100%", maxHeight: "150px", background: "#000", borderRadius: "4px" }} />}
        </div>
      )}

      {showMobileUI && (
        <div style={{ position: "absolute", bottom: 10, display: "flex", flexDirection: "column", gap: 12, width: "100%", padding: "0 20px", boxSizing: "border-box", zIndex: 100, pointerEvents: "none" }}>
          <div style={{ display: "flex", gap: 12, justifyContent: "space-between", width: "100%", pointerEvents: "auto" }}>
          <button
            onPointerDown={(e) => { e.preventDefault(); spawnP1(); }}
            style={{
              background: "rgba(255,80,80,0.7)",
              color: "#fff",
              border: "2px solid #ff4444",
              padding: "10px 18px",
              fontSize: 14,
              fontFamily: "monospace",
              borderRadius: 8,
              cursor: "pointer",
              userSelect: "none",
              touchAction: "none",
              flex: 1,
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
              padding: "10px 18px",
              fontSize: 14,
              fontFamily: "monospace",
              borderRadius: 8,
              cursor: "pointer",
              userSelect: "none",
              touchAction: "none",
              flex: 1,
              WebkitTapHighlightColor: "transparent",
            }}
          >
            P2 SPAWN
          </button>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "space-between", width: "100%", pointerEvents: "auto" }}>
            <button 
              style={{ padding: "12px", borderRadius: "24px", color: "#fff", background: godAction === 'area_lock' ? '#3b82f6' : 'rgba(30,30,30,0.8)', border: "1px solid rgba(255,255,255,0.2)", touchAction: "none", userSelect: "none", fontWeight: "bold", flex: 1, backdropFilter: "blur(4px)" }}
              onTouchStart={(e) => { e.preventDefault(); setGodAction('area_lock'); }}
              onTouchEnd={(e) => { e.preventDefault(); setGodAction('smite'); }}
              onTouchCancel={(e) => { e.preventDefault(); setGodAction('smite'); }}
            >🔒 Lock</button>
            <button 
              style={{ padding: "12px", borderRadius: "24px", color: "#fff", background: godAction === 'architect_pen' ? '#22c55e' : 'rgba(30,30,30,0.8)', border: "1px solid rgba(255,255,255,0.2)", touchAction: "none", userSelect: "none", fontWeight: "bold", flex: 1, backdropFilter: "blur(4px)" }}
              onTouchStart={(e) => { e.preventDefault(); setGodAction('architect_pen'); }}
              onTouchEnd={(e) => { e.preventDefault(); setGodAction('smite'); }}
              onTouchCancel={(e) => { e.preventDefault(); setGodAction('smite'); }}
            >🚧 Pen</button>
            <button 
              style={{ padding: "12px", borderRadius: "24px", color: "#fff", background: godAction === 'marionette' ? '#a855f7' : 'rgba(30,30,30,0.8)', border: "1px solid rgba(255,255,255,0.2)", touchAction: "none", userSelect: "none", fontWeight: "bold", flex: 1, backdropFilter: "blur(4px)" }}
              onTouchStart={(e) => { e.preventDefault(); setGodAction('marionette'); }}
              onTouchEnd={(e) => { e.preventDefault(); setGodAction('smite'); }}
              onTouchCancel={(e) => { e.preventDefault(); setGodAction('smite'); }}
            >🎭 Puppet</button>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "space-between", width: "100%", pointerEvents: "auto" }}>
            <button
              onPointerDown={(e) => { e.preventDefault(); setShowLiveMenu(v => !v); }}
              style={{ padding: "10px", borderRadius: "8px", color: "#ffd700", background: showLiveMenu ? "rgba(255,215,0,0.2)" : "rgba(30,30,30,0.8)", border: "1px solid #ffd700", fontWeight: "bold", flex: 1, cursor: "pointer", touchAction: "none" }}
            >
              ⚙️ LIVE MODS
            </button>
            <button
              onPointerDown={(e) => { e.preventDefault(); stateRef.current.paused = !stateRef.current.paused; setTick(t=>t+1); }}
              style={{ padding: "10px", borderRadius: "8px", color: "#fff", background: "rgba(30,30,30,0.8)", border: "1px solid rgba(255,255,255,0.2)", fontWeight: "bold", flex: 1, cursor: "pointer", touchAction: "none" }}
            >
              {stateRef.current.paused ? "▶ RESUME" : "⏸ PAUSE"}
            </button>
          </div>
        </div>
      )}
      
      </div> {/* End Main Game Container */}
      </div> {/* End Tight Arena Wrapper */}
    </div>
  );
}

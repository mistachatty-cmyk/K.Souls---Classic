import { MutableRefObject } from "react";
import { GameState, ThemeMode, LokModifier, CameraMode, WeaponStyle, Environment, ViewMode, Character, Particle, Projectile, Sabre } from "../game/types";
import { SETTINGS_DATA, LOK_MENU_DATA, KINETIC_MODEL_OPTIONS, KINETIC_MODEL_PICKER_HEIGHT } from "../render/DrawUI";
import { ARENA_W, ARENA_H, SCOREBOARD_H } from "../game/constants";

/**
 * Registry of external callbacks needed by the Input system.
 * This bridges the gap between the stateless Input system and the React component.
 * 
 * @property {Function} startGame - Starts the game (optional XXL mode)
 * @property {Function} endGame - Ends the current game session
 * @property {Function} spawnP1 - Spawns a Player 1 character
 * @property {Function} spawnP2 - Spawns a Player 2/bot character
 * @property {Function} setShowLiveMenu - Toggles the live modifier menu
 * @property {Function} spawnText - Renders floating text at coordinates
 * @property {Function} setTick - Forces a React re-render tick
 * @property {Function} pushParticle - Adds a particle effect to the game world
 * @property {Function} spawnExplosion - Triggers explosion VFX at position (used by God Actions)
 * @property {Function} updateConfig - Updates game configuration by key
 */
export interface InputCallbacks {
  startGame: (xxl?: boolean) => void;
  endGame: () => void;
  spawnP1: () => void;
  spawnP2: () => void;
  setShowLiveMenu: (updater: (v: boolean) => boolean) => void;
  spawnText: (x: number, y: number, text: string, color: string) => void;
  setTick: (updater: (v: number) => number) => void;
  pushParticle: (x: number, y: number, vx: number, vy: number, life: number, color: string, scale: number, parts: any[], usePool: boolean) => void;
  /** Triggers explosion visual effects - used by God Actions (Area Lock, etc.) */
  spawnExplosion: (x: number, y: number, color: string) => void;
  updateConfig: (key: string, value: any) => void;
}

/**
 * Attaches all game-wide event listeners (Keyboard, Mouse, Touch).
 * Returns a cleanup function.
 */
export function setupInputListeners(
  canvas: HTMLCanvasElement,
  stateRef: MutableRefObject<GameState>,
  dataRef: any,
  mouseRef: MutableRefObject<{ x: number, y: number, isDown: boolean }>,
  keysRef: MutableRefObject<Set<string>>,
  screenRef: MutableRefObject<string>,
  godActionRef: MutableRefObject<string>,
  camRef: MutableRefObject<any>,
  refMenuScroll: MutableRefObject<number>,
  refMenuDragY: MutableRefObject<number | null>,
  callbacks: InputCallbacks
) {
  let modelRailTouchStart: { x: number; y: number } | null = null;
  /**
   * Handles end of drag interactions for God Actions
   * - Area Lock: Locks characters within selection rectangle + spawns corner explosion VFX
   * - Architect Pen: Places barrier wall at drag coordinates
   * - Includes visual confirmation effects (from Untitled-3.txt)
   */
  const endDragInteraction = (mx: number, my: number) => {
    const state = stateRef.current as any;
    const gAction = godActionRef.current;
    if (gAction === "area_lock" && state.dragStartX !== undefined && state.dragStartY !== undefined) {
       const sx = state.dragStartX, sy = state.dragStartY;
       const minX = Math.min(sx, mx), maxX = Math.max(sx, mx);
       const minY = Math.min(sy, my), maxY = Math.max(sy, my);
       let capturedCount = 0;
       for (const c of dataRef.chars.current) {
          if (!c.dead && c.x >= minX && c.x <= maxX && c.y >= minY && c.y <= maxY) {
             (c as any).isLocked = true; (c as any).lockedX = c.x; (c as any).lockedY = c.y; (c as any).lockTimer = 3000;
             capturedCount++;
          }
       }
       // Visual effect for Area Lock confirmation (4 corner bursts + optional center gold burst on super juice)
       if (state.juice && state.juice !== "off") {
          const width = maxX - minX;
          const height = maxY - minY;
          if (width > 10 && height > 10) {
             const effectColor = "#3b82f6";
             callbacks.spawnExplosion?.(minX, minY, effectColor);
             callbacks.spawnExplosion?.(maxX, minY, effectColor);
             callbacks.spawnExplosion?.(minX, maxY, effectColor);
             callbacks.spawnExplosion?.(maxX, maxY, effectColor);
             if (state.juice === "super" && capturedCount > 0) {
                callbacks.spawnExplosion?.(minX + width/2, minY + height/2, "#ffd700");
             }
          }
       }
    } else if (gAction === "architect_pen" && state.dragStartX !== undefined && state.dragStartY !== undefined) {
       state.barriers = state.barriers || [];
       state.barriers.push({ x1: state.dragStartX, y1: state.dragStartY, x2: mx, y2: my, life: 10000 });
       if (state.barriers.length > 5) state.barriers.shift();
    }
    state.dragStartX = undefined; state.dragStartY = undefined; state.marionetteId = undefined;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    if (mouseRef.current.isDown && refMenuDragY.current !== null) {
      const dy = mouseRef.current.y - refMenuDragY.current;
      const maxScroll = screenRef.current === "settings_menu" ? -2400 : -3000;
      refMenuScroll.current = Math.min(0, Math.max(maxScroll, refMenuScroll.current + dy));
      refMenuDragY.current = mouseRef.current.y;
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    mouseRef.current.isDown = true;
    const screen = screenRef.current;
    if (["bestiary", "lok_menu", "settings_menu"].includes(screen)) {
       const rect = canvas.getBoundingClientRect();
       refMenuDragY.current = (e.clientY - rect.top) * (canvas.height / rect.height);
    }
    if (screen === "game") {
       const state = stateRef.current as any;
       const tx = mouseRef.current.x, ty = mouseRef.current.y;
       const gAction = godActionRef.current;
       let interacted = false;
       if (state.handOfGod) {
          for (const c of dataRef.chars.current) {
             if (!c.dead && Math.hypot(c.x - tx, c.y - ty) < 18 * c.scale * 2) { state.draggingId = c.id; interacted = true; break; }
          }
       }
       if (!interacted) {
          if (gAction === "area_lock" || gAction === "architect_pen") { state.dragStartX = tx; state.dragStartY = ty; interacted = true; }
          else if (gAction === "marionette") {
             for (const c of dataRef.chars.current) {
                if (!c.dead && Math.hypot(c.x - tx, c.y - ty) < 18 * c.scale * 2) { state.marionetteId = c.id; interacted = true; break; }
             }
          }
       }
    }
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
    if (stateRef.current.draggingId !== null) {
      const c = dataRef.chars.current.find(char => char.id === stateRef.current.draggingId);
      if (c) c.tossedTimer = 3000;
    }
    stateRef.current.draggingId = null;
    refMenuDragY.current = null;
    endDragInteraction(mouseRef.current.x, mouseRef.current.y);
  };

  /**
   * Handles touch start events on the game canvas
   * - Processes menu clicks for non-game screens
   * - Initiates God Action drags (Area Lock, Architect Pen, Marionette)
   * - Only tracks the first finger on the canvas for precise control
   */
  const handleTouchStart = (e: TouchEvent) => {
    // If there are no fingers specifically on the canvas, ignore it.
    if (e.targetTouches.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.targetTouches[0];
    const tx = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const ty = (touch.clientY - rect.top) * (canvas.height / rect.height);
    modelRailTouchStart = screenRef.current === "settings_menu" ? { x: tx, y: ty } : null;

    // Handle menu clicks (non-game screens)
    if (screenRef.current !== "game" || stateRef.current.paused || !stateRef.current.running) {
      mouseRef.current.x = tx;
      mouseRef.current.y = ty;
      if (["bestiary", "lok_menu", "settings_menu"].includes(screenRef.current)) refMenuDragY.current = ty;
      return;
    }

    e.preventDefault();
    mouseRef.current.x = tx;
    mouseRef.current.y = ty;
    mouseRef.current.isDown = true;
    handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as any);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    let selectedBySwipe = false;
    if (modelRailTouchStart && screenRef.current === "settings_menu") {
      const endX = mouseRef.current.x;
      const { x, y } = modelRailTouchStart;
      if (y >= 97 + refMenuScroll.current && y <= 221 + refMenuScroll.current && Math.abs(endX - x) > 32) {
        const styles = KINETIC_MODEL_OPTIONS.map((option) => option.id);
        const current = Math.max(0, styles.indexOf(stateRef.current.kineticStyle));
        const next = Math.max(0, Math.min(styles.length - 1, current + (endX < x ? 1 : -1)));
        callbacks.updateConfig("kineticStyle", styles[next]);
        callbacks.setTick((tick) => tick + 1);
        selectedBySwipe = true;
      }
    }
    if (!selectedBySwipe && screenRef.current !== "game") handleClick(e);
    modelRailTouchStart = null;
    handleMouseUp();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    keysRef.current.add(e.key.toLowerCase());
    const screen = screenRef.current;
    const state = stateRef.current;

    if (screen === "settings_menu" && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      const styles = KINETIC_MODEL_OPTIONS.map((option) => option.id);
      const current = Math.max(0, styles.indexOf(state.kineticStyle));
      const direction = e.key === "ArrowRight" ? 1 : -1;
      const next = (current + direction + styles.length) % styles.length;
      callbacks.updateConfig("kineticStyle", styles[next]);
      callbacks.setTick((tick) => tick + 1);
      e.preventDefault();
      return;
    }

    if (screen === "game" && state.camera === "focus") {
      if (e.key === "ArrowUp") { state.focusZoom = Math.min(state.focusZoom + 0.2, 5); callbacks.setTick(t=>t+1); }
      if (e.key === "ArrowDown") { state.focusZoom = Math.max(state.focusZoom - 0.2, 0.5); callbacks.setTick(t=>t+1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const active = dataRef.chars.current.filter(c => !c.dead);
        const idx = active.findIndex(c => c.id === state.focusTargetId);
        const dir = e.key === "ArrowLeft" ? -1 : 1;
        if (active.length > 0) { 
          state.focusTargetId = active[(idx + dir + active.length) % active.length].id; 
          if (camRef.current) camRef.current.snapNext = true;
        }
        callbacks.setTick(t=>t+1);
      }
    }

    if (e.key.toLowerCase() === "a" && screen === "game") callbacks.spawnP1();
    else if (e.key.toLowerCase() === "l" && screen === "game") callbacks.spawnP2();
    else if (e.key.toLowerCase() === "m" && screen === "game") callbacks.setShowLiveMenu(v => !v);
    else if (e.key === "Escape") {
      if (screen === "game" && state.running) { state.paused = !state.paused; callbacks.setTick(t => t + 1); }
      else if (screen !== "menu" && screen !== "game") { screenRef.current = "menu"; callbacks.setTick(t => t + 1); }
    } else if (e.key === "Enter" && screen === "menu") callbacks.startGame();
  };

  const handleKeyUp = (e: KeyboardEvent) => { keysRef.current.delete(e.key.toLowerCase()); };

   const handleWheel = (e: WheelEvent) => {
     if (["bestiary", "lok_menu", "settings_menu"].includes(screenRef.current)) {
        // settings_menu has more content; allow deeper scroll
        const maxScroll = screenRef.current === "settings_menu" ? -2400 : -800;
        refMenuScroll.current = Math.min(0, Math.max(maxScroll, refMenuScroll.current - e.deltaY));
        callbacks.setTick(t => t + 1);
        e.preventDefault();
     }
   };

    const handleClick = (e: MouseEvent | TouchEvent) => {
        const screen = screenRef.current;
        const state = stateRef.current;
        
        // ROOT FIX: Force fresh coordinate calculation directly from the event to prevent stale clicks
        const rect = canvas.getBoundingClientRect();
        let clientX: number | undefined;
        let clientY: number | undefined;
        if ("clientX" in e) {
           clientX = (e as MouseEvent).clientX;
           clientY = (e as MouseEvent).clientY;
        } else if ("changedTouches" in e && (e as TouchEvent).changedTouches.length > 0) {
           clientX = (e as TouchEvent).changedTouches[0].clientX;
           clientY = (e as TouchEvent).changedTouches[0].clientY;
        }
        let mx = mouseRef.current.x;
        let my = mouseRef.current.y;
        if (clientX !== undefined && clientY !== undefined) {
           mx = (clientX - rect.left) * (canvas.width / rect.width);
           my = (clientY - rect.top) * (canvas.height / rect.height);
           mouseRef.current.x = mx;
           mouseRef.current.y = my;
        }

        const W = ARENA_W, H = ARENA_H + SCOREBOARD_H; // ARENA constants

        // Bug Fix: Tactical Minimap Navigation Support
    if (screen === "game" && state.hud && state.viewMode === "standard") {
        const mw = 120, mh = 80;
        let mxMap = W - mw - 10, myMap = H - mh - 10;
        
        // Handle all minimap positions
        if (state.minimapPosition === "top-center") { mxMap = ARENA_W / 2 - mw / 2; myMap = SCOREBOARD_H + 10; }
        else if (state.minimapPosition === "bottom-center") { mxMap = ARENA_W / 2 - mw / 2; myMap = SCOREBOARD_H + ARENA_H - mh - 10; }
        else if (state.minimapPosition === "center") { mxMap = ARENA_W / 2 - mw / 2; myMap = SCOREBOARD_H + ARENA_H / 2 - mh / 2; }
        else if (state.minimapPosition === "bottom-left") { mxMap = 10; myMap = H - mh - 10; }
        else if (state.minimapPosition === "top-right") { mxMap = W - mw - 10; myMap = SCOREBOARD_H + 10; }
        else if (state.minimapPosition === "top-left") { mxMap = 10; myMap = SCOREBOARD_H + 10; }
        // Default: bottom-right (mxMap = W - mw - 10, myMap = H - mh - 10)

        if (mx >= mxMap && mx <= mxMap + mw && my >= myMap && my <= myMap + mh) {
            callbacks.updateConfig("cam", "static");
            if (camRef.current) {
                const mapW = (state as any).xxlMode ? W * 3 : W;
                const mapH = (state as any).xxlMode ? ARENA_H * 3 : ARENA_H;
                const mapOffX = (state as any).xxlMode ? -W : 0;
                const mapOffY = (state as any).xxlMode ? SCOREBOARD_H - ARENA_H : SCOREBOARD_H;

                camRef.current.x = mapOffX + ((mx - mxMap) / mw) * mapW;
                camRef.current.y = mapOffY + ((my - myMap) / mh) * mapH;
            }
            callbacks.setTick(t => t + 1);
            return;
        }
    }

    if (screen === "menu") {
      const cx = W / 2, cy = H / 2;
      if (state.classicMenu) {
        if (mx >= cx - 130 && mx <= cx - 15 && my >= 285 && my <= 321) callbacks.updateConfig("mode", "timer");
        if (mx >= cx + 15 && mx <= cx + 130 && my >= 285 && my <= 321) callbacks.updateConfig("mode", "score");
        if (mx >= cx - 130 && mx <= cx - 15 && my >= 373 && my <= 409) callbacks.updateConfig("opp", "pvp");
        if (mx >= cx + 15 && mx <= cx + 130 && my >= 373 && my <= 409) callbacks.updateConfig("opp", "bot");
        if (mx >= cx - 130 && mx <= cx - 15 && my >= 415 && my <= 445) callbacks.updateConfig("opp", "host");
        if (mx >= cx + 15 && mx <= cx + 130 && my >= 415 && my <= 445) callbacks.updateConfig("opp", "join");
        if (mx >= cx - 155 && mx <= cx - 5 && my >= 455 && my <= 499) callbacks.startGame(false);
        if (mx >= cx + 5 && mx <= cx + 155 && my >= 455 && my <= 499) callbacks.startGame(true);
        if (mx >= cx - 75 && mx <= cx + 75 && my >= 510 && my <= 540) screenRef.current = "bestiary";
        if (mx >= 10 && mx <= 160 && my >= H - 40 && my <= H - 10) { screenRef.current = "settings_menu"; refMenuScroll.current = 0; }
        if (mx >= W - 160 && mx <= W - 10 && my >= H - 40 && my <= H - 10) screenRef.current = "lok_menu";
        callbacks.setTick(t => t + 1);
      } else {
        const bw = 160, bh = 34, gapY = 10;
        const col1X = cx - bw - 10, col2X = cx + 10;
        let sY = 144;
        const modeVals = ["timer", "score", "unlimited", "horde", "infection"];
        const oppVals = ["pvp", "bot", "ffa", "host", "join"];
        
        for (let i = 0; i < 5; i++) {
          const by = sY + i * (bh + gapY);
          if (mx >= col1X && mx <= col1X + bw && my >= by && my <= by + bh) callbacks.updateConfig("mode", modeVals[i]);
        }
        for (let i = 0; i < 5; i++) {
          const by = sY + i * (bh + gapY);
          if (mx >= col2X && mx <= col2X + bw && my >= by && my <= by + bh) callbacks.updateConfig("opp", oppVals[i]);
        }
        
        sY += 5 * (bh + gapY) + 16;
        const bbW = 340, bbH = 36, bbX = cx - bbW / 2;
        
        if (mx >= bbX && mx <= bbX + bbW && my >= sY && my <= sY + bbH) callbacks.startGame(false);
        if (mx >= bbX && mx <= bbX + bbW && my >= sY + 44 && my <= sY + 44 + bbH) callbacks.startGame(true);
        if (mx >= bbX && mx <= bbX + bbW && my >= sY + 88 && my <= sY + 88 + bbH) screenRef.current = "lok_menu";
        if (mx >= bbX && mx <= bbX + bbW && my >= sY + 132 && my <= sY + 132 + bbH) { screenRef.current = "settings_menu"; refMenuScroll.current = 0; }
        if (mx >= bbX && mx <= bbX + bbW && my >= sY + 176 && my <= sY + 176 + bbH) screenRef.current = "bestiary";
        callbacks.setTick(t => t + 1);
      }
    } else if (screen === "lok_menu") {
      const backW = 160, backH = 36;
      const backX2 = W / 2 - backW / 2, backY2 = H - 50;
      if (mx >= backX2 && mx <= backX2 + backW && my >= backY2 && my <= backY2 + backH) {
        screenRef.current = "menu"; callbacks.setTick(t => t + 1); return;
      }
      
      let currentY = 58 + refMenuScroll.current;
      const colW = 290, colGap = 10;
      const startX = (W - (colW * 3 + colGap * 2)) / 2;
      const bh = 24, bw = 130, gap = 5;
      const colY = [currentY, currentY, currentY];

      LOK_MENU_DATA.forEach(sec => {
        const colsInSec = sec.key === "theme" ? 2 : 1;
        const maxRows = Math.ceil(sec.items.length / colsInSec);
        const baseX = startX + sec.col * (colW + colGap);
        const baseY = colY[sec.col];

        sec.items.forEach((item, i) => {
          const col2 = Math.floor(i / maxRows);
          const row2 = i % maxRows;
          const bx = baseX + col2 * (bw + gap);
          const by = baseY + 12 + row2 * (bh + 3);
          if (item.value !== "header" && my >= 46 && my <= H - 60 && mx >= bx && mx <= bx + bw && my >= by && my <= by + bh) {
            callbacks.updateConfig(sec.key, item.value);
            callbacks.setTick(t => t + 1);
          }
        });
        
        colY[sec.col] = baseY + (maxRows * (bh + 3)) + 36 + 20;
      });
    } else if (screen === "settings_menu") {
      // PRIORITY: Main Menu button in header (x:12-182, y:11-45) — check FIRST
      if (mx >= 12 && mx <= 182 && my >= 11 && my <= 45) {
        screenRef.current = "menu"; refMenuScroll.current = 0; callbacks.setTick(t => t + 1); return;
      }
      // Only process item clicks in the scrollable area (below header y=60)
      const SETTINGS_SCROLL_TOP = 60;
      if (my >= SETTINGS_SCROLL_TOP) {
        const pickerStartX = (W - (210 * 4 + 8 * 3)) / 2;
        const pickerY = SETTINGS_SCROLL_TOP + 10 + refMenuScroll.current + 27;
        for (let index = 0; index < KINETIC_MODEL_OPTIONS.length; index++) {
          const bx = pickerStartX + index * 218;
          if (mx >= bx && mx <= bx + 210 && my >= pickerY && my <= pickerY + 124) {
            callbacks.updateConfig("kineticStyle", KINETIC_MODEL_OPTIONS[index].id);
            callbacks.setTick((tick) => tick + 1);
            return;
          }
        }
        let currentY = SETTINGS_SCROLL_TOP + 16 + refMenuScroll.current + KINETIC_MODEL_PICKER_HEIGHT;
        const cardW = 210, cardH = 50, gap = 8, cols = 4;
        const startX = (W - (cols * cardW + (cols - 1) * gap)) / 2;
        let clicked = false;
        for (const group of SETTINGS_DATA) {
          currentY += 22; // group header height
          for (let i = 0; i < group.items.length; i++) {
            const item = group.items[i];
            const col = i % cols, row = Math.floor(i / cols);
            const bx = startX + col * (cardW + gap), by = currentY + row * (cardH + gap);
            if (mx >= bx && mx <= bx + cardW && my >= by && my <= by + cardH) {
              if (item.type === "toggle") (state as any)[item.key] = !(state as any)[item.key];
              else if (item.type === "cycle") {
                const opts = item.key === "hpBarStyle" ? ["standard", "thick", "segmented", "hidden"] :
                               item.key === "floatingTextStyle" ? ["standard", "comic", "neon", "hidden"] :
                               item.key === "xxlScale" ? ["2x", "3x", "4x"] :
                               item.key === "cameraSpeed" ? ["slow", "normal", "fast"] :
                               item.key === "titleStyle" ? ["standard", "advanced", "neon", "retro", "glitch", "minimal", "pixel"] :
                               item.key === "particleStyle" ? ["original", "new", "sparkle", "snow", "none"] :
                               item.key === "minimapPosition" ? ["bottom-right", "bottom-left", "top-right", "top-left", "bottom-center", "top-center", "center"] :
                               item.key === "physicsMode" ? ["standard", "bounce_only", "attack_on_contact", "super_bouncy", "lead_weights", "phantoms"] :
                               ["standard", "phantoms", "super_bouncy", "lead_weights"];
                const cur = (state as any)[item.key] as string;
                const idx = Math.max(0, opts.indexOf(cur));
                (state as any)[item.key] = opts[(idx + 1) % opts.length];
              }
              callbacks.setTick(t => t + 1);
              clicked = true;
              break;
            }
          }
          currentY += Math.ceil(group.items.length / cols) * (cardH + gap) + 28;
          if (clicked) break;
        }
      }
    } else if (screen === "bestiary") {
      const toggleW = 140, toggleH = 26;
      const toggleX = W - toggleW - 20, toggleY = 14;
      if (mx >= toggleX && mx <= toggleX + toggleW && my >= toggleY && my <= toggleY + toggleH) {
        state.bestiarySprites = !state.bestiarySprites; callbacks.setTick(t => t + 1); return;
      }
      const fxToggleX = toggleX - toggleW - 10;
      if (mx >= fxToggleX && mx <= fxToggleX + toggleW && my >= toggleY && my <= toggleY + toggleH) {
        state.bestiaryBossFx = !state.bestiaryBossFx; callbacks.setTick(t => t + 1); return;
      }
      const backW = 140, backH = 32;
      const backX = W / 2 - backW / 2, backY = H - 42;
      if (mx >= backX && mx <= backX + backW && my >= backY && my <= backY + backH) {
        screenRef.current = "menu"; callbacks.setTick(t => t + 1);
      }
    } else if (screen === "over") {
      screenRef.current = "menu";
      dataRef.chars.current = []; dataRef.parts.current = [];
      callbacks.setTick(t => t + 1);
    }
  };

  /**
   * Handles touch move events for:
   * - Menu drag scrolling (bestiary, lok_menu, settings_menu)
   * - Game screen touch tracking (supports Fruit Ninja FX trail particles)
   * - Only tracks canvas touches for accurate positioning
   */
  const handleTouchMove = (e: TouchEvent) => {
    // Menu drag scrolling
        if (refMenuDragY.current !== null && ["bestiary", "lok_menu", "settings_menu"].includes(screenRef.current)) {
        e.preventDefault();
        if (e.targetTouches.length === 0) return;
        const rect = canvas.getBoundingClientRect();
        const my = (e.targetTouches[0].clientY - rect.top) * (canvas.height / rect.height);
        const mx = (e.targetTouches[0].clientX - rect.left) * (canvas.width / rect.width);
        const previousY = refMenuDragY.current;
        mouseRef.current.x = mx;
        mouseRef.current.y = my;
        if (screenRef.current === "settings_menu" && modelRailTouchStart && Math.abs(mx - modelRailTouchStart.x) > Math.abs(my - modelRailTouchStart.y)) return;
        const dy = my - previousY;
        refMenuScroll.current = Math.min(0, Math.max(-800, refMenuScroll.current + dy));
        refMenuDragY.current = my;
      }
    // Game screen movement tracking
    if (screenRef.current === "game" && stateRef.current.running && !stateRef.current.paused) {
      if (e.targetTouches.length === 0) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.targetTouches[0];
      mouseRef.current.x = (touch.clientX - rect.left) * (canvas.width / rect.width);
      mouseRef.current.y = (touch.clientY - rect.top) * (canvas.height / rect.height);

      if (mouseRef.current.isDown && stateRef.current.fruitNinjaFx) {
        for(let i=0; i<2; i++) {
          callbacks.pushParticle(
            mouseRef.current.x, mouseRef.current.y,
            (Math.random()-0.5)*2, (Math.random()-0.5)*2,
            20, "#00ffff", 2, dataRef.parts.current, !!stateRef.current.optPool
          );
        }
      }
    }
  };

  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
  canvas.addEventListener("touchend", handleTouchEnd);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  canvas.addEventListener("wheel", handleWheel, { passive: false });

  return () => {
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("click", handleClick);
    canvas.removeEventListener("touchstart", handleTouchStart);
    canvas.removeEventListener("touchmove", handleTouchMove);
    canvas.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    canvas.removeEventListener("wheel", handleWheel);
  };
}

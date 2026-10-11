import { MutableRefObject } from "react";
import { GameState, ThemeMode, LokModifier, CameraMode, WeaponStyle, Environment, ViewMode, Character, Particle, Projectile, Sabre } from "../game/types";
import { SETTINGS_DATA, LOK_MENU_DATA } from "../render/DrawUI";

/**
 * Registry of external callbacks needed by the Input system.
 * This bridges the gap between the stateless Input system and the React component.
 */
export interface InputCallbacks {
  startGame: () => void;
  endGame: () => void;
  spawnP1: () => void;
  spawnP2: () => void;
  setShowLiveMenu: (updater: (v: boolean) => boolean) => void;
  spawnText: (x: number, y: number, text: string, color: string) => void;
  setTick: (updater: (v: number) => number) => void;
  pushParticle: (x: number, y: number, vx: number, vy: number, life: number, color: string, scale: number, parts: any[], usePool: boolean) => void;
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
  const endDragInteraction = (mx: number, my: number) => {
    const state = stateRef.current;
    const gAction = godActionRef.current;
    if (gAction === "area_lock" && state.dragStartX !== undefined && state.dragStartY !== undefined) {
       const sx = state.dragStartX, sy = state.dragStartY;
       const minX = Math.min(sx, mx), maxX = Math.max(sx, mx);
       const minY = Math.min(sy, my), maxY = Math.max(sy, my);
       for (const c of dataRef.chars.current) {
          if (!c.dead && c.x >= minX && c.x <= maxX && c.y >= minY && c.y <= maxY) {
             c.isLocked = true; c.lockedX = c.x; c.lockedY = c.y; c.lockTimer = 3000;
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
      refMenuScroll.current = Math.min(0, Math.max(-3000, refMenuScroll.current + dy));
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
       const state = stateRef.current;
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

  const handleTouchStart = (e: TouchEvent) => {
    if (screenRef.current !== "game" || stateRef.current.paused || !stateRef.current.running) return;
    e.preventDefault();
    if (e.targetTouches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.targetTouches[0];
    const tx = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const ty = (touch.clientY - rect.top) * (canvas.height / rect.height);
    mouseRef.current.x = tx; mouseRef.current.y = ty; mouseRef.current.isDown = true;
    handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as any);
  };

  const handleTouchEnd = () => { handleMouseUp(); };

  const handleKeyDown = (e: KeyboardEvent) => {
    keysRef.current.add(e.key.toLowerCase());
    const screen = screenRef.current;
    const state = stateRef.current;

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
       refMenuScroll.current = Math.min(0, Math.max(-3000, refMenuScroll.current - e.deltaY));
       callbacks.setTick(t => t + 1);
       e.preventDefault();
    }
  };

  const handleClick = (e: MouseEvent) => {
    const screen = screenRef.current;
    const state = stateRef.current;
    const mx = mouseRef.current.x, my = mouseRef.current.y;
    const W = 1200, H = 800; // ARENA constants

    if (screen === "menu") {
      const cx = W / 2, cy = H / 2;
      if (state.classicMenu) {
        if (mx >= cx - 130 && mx <= cx - 15 && my >= 285 && my <= 321) callbacks.updateConfig("mode", "timer");
        if (mx >= cx + 15 && mx <= cx + 130 && my >= 285 && my <= 321) callbacks.updateConfig("mode", "score");
        if (mx >= cx - 130 && mx <= cx - 15 && my >= 373 && my <= 409) callbacks.updateConfig("opp", "pvp");
        if (mx >= cx + 15 && mx <= cx + 130 && my >= 373 && my <= 409) callbacks.updateConfig("opp", "bot");
        if (mx >= cx - 75 && mx <= cx + 75 && my >= 440 && my <= 484) callbacks.startGame();
        if (mx >= cx - 75 && mx <= cx + 75 && my >= 495 && my <= 525) screenRef.current = "bestiary";
        if (mx >= 10 && mx <= 160 && my >= H - 40 && my <= H - 10) screenRef.current = "settings_menu";
        if (mx >= W - 160 && mx <= W - 10 && my >= H - 40 && my <= H - 10) screenRef.current = "lok_menu";
        callbacks.setTick(t => t + 1);
      } else {
        const bw = 160, bh = 34, gapY = 10;
        const col1X = cx - bw - 10, col2X = cx + 10;
        let sY = 144;
        const modeVals = ["timer", "score", "unlimited", "horde", "infection"];
        const oppVals = ["pvp", "bot", "ffa"];
        
        for (let i = 0; i < 5; i++) {
          const by = sY + i * (bh + gapY);
          if (mx >= col1X && mx <= col1X + bw && my >= by && my <= by + bh) callbacks.updateConfig("mode", modeVals[i]);
        }
        for (let i = 0; i < 3; i++) {
          const by = sY + i * (bh + gapY);
          if (mx >= col2X && mx <= col2X + bw && my >= by && my <= by + bh) callbacks.updateConfig("opp", oppVals[i]);
        }
        
        sY += 5 * (bh + gapY) + 16;
        const bbW = 340, bbH = 36, bbX = cx - bbW / 2;
        
        if (mx >= bbX && mx <= bbX + bbW && my >= sY && my <= sY + bbH) callbacks.startGame();
        if (mx >= bbX && mx <= bbX + bbW && my >= sY + 46 && my <= sY + 46 + bbH) screenRef.current = "lok_menu";
        if (mx >= bbX && mx <= bbX + bbW && my >= sY + 92 && my <= sY + 92 + bbH) screenRef.current = "settings_menu";
        if (mx >= bbX && mx <= bbX + bbW && my >= sY + 138 && my <= sY + 138 + bbH) screenRef.current = "bestiary";
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

      LOK_MENU_DATA.forEach(sec => {
        const baseX = startX + sec.col * (colW + colGap);
        const baseY = currentY + sec.row * 170;
        const maxRows = sec.key === "theme" ? 14 : 7;
        sec.items.forEach((item, i) => {
          const col2 = Math.floor(i / maxRows);
          const row2 = i % maxRows;
          const bx = baseX + col2 * (bw + gap);
          const by = baseY + 12 + row2 * (bh + 3);
          if (mx >= bx && mx <= bx + bw && my >= by && my <= by + bh) {
            callbacks.updateConfig(sec.key, item.value);
            callbacks.setTick(t => t + 1);
          }
        });
      });
    } else if (screen === "settings_menu") {
      const backW = 160, backH = 36;
      const backX2 = W / 2 - backW / 2, backY2 = H - 56;
      if (mx >= backX2 && mx <= backX2 + backW && my >= backY2 && my <= backY2 + backH) {
        screenRef.current = "menu"; callbacks.setTick(t => t + 1); return;
      }
      if (my >= 60 && my <= H - 60) {
        let currentY = 80 + refMenuScroll.current;
        const cardW = 210, cardH = 50, gap = 8, cols = 4;
        const startX = (W - (cols * cardW + (cols - 1) * gap)) / 2;
        SETTINGS_DATA.forEach(group => {
          currentY += 20;
          group.items.forEach((item, i) => {
            const col = i % cols, row = Math.floor(i / cols);
            const bx = startX + col * (cardW + gap), by = currentY + row * (cardH + gap);
            if (mx >= bx && mx <= bx + cardW && my >= by && my <= by + cardH) {
              if (item.type === "toggle") (state as any)[item.key] = !(state as any)[item.key];
              else if (item.type === "cycle") {
                const opts = item.key === "hpBarStyle" ? ["standard", "thick", "segmented", "hidden"] :
                             item.key === "floatingTextStyle" ? ["standard", "comic", "neon", "hidden"] :
                             ["standard", "phantoms", "super_bouncy", "lead_weights"];
                const cur = (state as any)[item.key] as string;
                const idx = opts.indexOf(cur);
                (state as any)[item.key] = opts[(idx + 1) % opts.length];
              }
              callbacks.setTick(t => t + 1);
            }
          });
          currentY += Math.ceil(group.items.length / cols) * (cardH + gap) + 30;
        });
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

  const handleTouchMove = (e: TouchEvent) => {
    if (refMenuDragY.current !== null && ["bestiary", "lok_menu", "settings_menu"].includes(screenRef.current)) {
       e.preventDefault();
       const rect = canvas.getBoundingClientRect();
       const my = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height);
       const dy = my - refMenuDragY.current;
       refMenuScroll.current = Math.min(0, Math.max(-3000, refMenuScroll.current + dy));
       refMenuDragY.current = my;
    }
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

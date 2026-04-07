# GEMINI: Fix Critical Game Issues - Kinetic Souls

## Urgent: Fix These 5 Critical Bugs

You previously made changes that broke 5 core features. I need you to fix them NOW. These are bugs that need reverting/fixing, not enhancements.

---

## CRITICAL BUG #1: Live LoK Modifier Menu NOT WORKING ❌

**What's Broken**: The in-game settings panel (press [M]) doesn't respond to any input. Dropdowns and inputs don't update the game.

**What Should Happen**: 
- Press [M] during gameplay → panel appears top-right
- Change any dropdown (Mode, Theme, Modifier, etc.) → game state updates INSTANTLY
- Changes should take effect immediately in gameplay

**Where the Code Is**:
```typescript
// Find this section in KineticSouls.tsx:
{showLiveMenu && (
  <div style={{...}}>
    {/* This JSX React panel with dropdowns */}
    <select defaultValue={stateRef.current.mode}>
      <option value="timer">Timer</option>
      {/* ... other options */}
    </select>
    <onChange={() => {stateRef.current.mode = e.target.value}}
```

**How to Fix**:
1. Find all dropdowns/inputs in the `showLiveMenu` JSX section
2. Check that each has an `onChange` handler
3. Verify each `onChange` updates the correct `stateRef.current` property
4. Test: Open game, press [M], change Mode dropdown → should switch modes immediately

**Examples of what should work**:
```typescript
// Mode dropdown onChange
onChange={(e) => { stateRef.current.mode = e.target.value as GameMode; }}

// Theme dropdown onChange  
onChange={(e) => { stateRef.current.theme = e.target.value as ThemeMode; }}

// Juice level select onChange
onChange={(e) => { stateRef.current.juice = e.target.value as JuiceLevel; }}
```

**Priority**: 🔴 CRITICAL - Game is unplayable without this

---

## CRITICAL BUG #2: Physics Engine is BROKEN ❌

**What's Broken**: Character movement, collision detection, spawn behavior all broken.

**Symptoms**:
- Characters don't move correctly
- Hit detection broken
- Characters spawn in wrong places
- Game feels unresponsive

**DO NOT MODIFY**:
- ❌ `processCollision()` function
- ❌ Character velocity calculations (`c.vx`, `c.vy`)
- ❌ Spawn position logic in `spawnCharacter()`
- ❌ Collision overlap calculations
- ❌ Physics timestep/delta calculations

**How to Fix**:
1. Do a **full text search** in the file for: `processCollision`
2. Verify that function is EXACTLY as it should be (no changes)
3. Check the character movement loop in `gameLoop()`:
   ```typescript
   c.x += c.vx * dtScale;
   c.y += c.vy * dtScale;
   ```
4. Verify collision detection thresholds haven't changed:
   ```typescript
   if (dist < minDist && dist > 0) {
     // collision logic
   }
   ```
5. Test: Start a game, try to move characters around → they should move smoothly

**If you accidentally modified physics**:
- Undo any changes to collision math
- Undo any changes to velocity multipliers
- Undo any changes to spawn coordinates

**Priority**: 🔴 CRITICAL - Game is unplayable

---

## BUG #3: Splash Text Hardcoded ❌

**What's Broken**: Main menu only shows "I love you Tan-Moka" every time. Should randomly show different splash texts.

**What Should Happen**: 
- Each time you load the game, you see a random message
- Examples: "🦉 Lok: Focus on what matters.", "💰 COIN MODE: Greed is a weapon.", "Must build additional pylons.", etc.
- 35+ different messages in the `SPLASH_ARCHIVE`

**Current Bad Code** (WRONG):
```typescript
const [currentSplash] = useState("I love you Tan-Moka"); // ❌ HARDCODED
```

**What It Should Be** (CORRECT):
```typescript
const [currentSplash] = useState(
  SPLASH_ARCHIVE[Math.floor(Math.random() * SPLASH_ARCHIVE.length)]
); // ✅ Random selection
```

**How to Fix**:
1. Find where `currentSplash` is initialized with `useState`
2. Change it from hardcoded string to random selection from array
3. Use this exact calculation: `SPLASH_ARCHIVE[Math.floor(Math.random() * SPLASH_ARCHIVE.length)]`
4. Test: Reload game 3 times → should see different splash texts each time

**Priority**: 🟡 MEDIUM - Cosmetic but affects UX

---

## BUG #4: Tactical Map (Minimap) Clicks Not Working ❌

**What's Broken**: The minimap in the bottom-right corner doesn't respond to clicks. Can't navigate by clicking on it.

**What Should Happen**:
- Minimap appears at bottom-right (780, 520) to (900, 600) in screen space
- Shows glowing dots for each character
- Shows camera frustum rectangle
- Clicking different areas should pan camera or zoom

**Where the Code Is**:
```typescript
// In gameLoop() function, near end:
if (state.hud && state.viewMode === "standard") {
  // Minimap rendering code
  const mw = 120, mh = 80, mx = ARENA_W - mw - 10, my = SCOREBOARD_H + ARENA_H - mh - 10;
  // ... minimap drawing code
}
```

**How to Fix**:
1. Find the minimap rendering section in `gameLoop()` (~lines 1880-1925)
2. Verify it's still rendering correctly
3. Check if there's click handler code that might be missing
4. Minimap should be in SCREEN SPACE, not world space
5. Test: Click on different areas of minimap → camera should move/respond

**Priority**: 🟡 MEDIUM - UX feature

---

## BUG #5: Game Title Pulsate Effect Disabled ❌

**What's Broken**: Menu title "KINETIC SOULS" doesn't have the pulsating animation when `state.menuPulse` is enabled.

**What Should Happen**:
- In main menu, title should gently scale up/down in a smooth loop
- Only when `state.menuPulse === true`
- Animation: `1 + Math.sin(timestamp / 150) * 0.03`
- Creates a subtle "breathing" effect

**Where the Code Is**:
```typescript
// In drawMainMenu() function:
if (state.menuPulse) {
  const pulse = 1 + Math.sin(timestamp / 150) * 0.03;
  ctx.translate(ARENA_W / 2, 205);
  ctx.scale(pulse, pulse);
  // ... draw title
}
```

**How to Fix**:
1. Find the title rendering in `drawMainMenu()`
2. Look for where "KINETIC SOULS" is drawn
3. Verify there's a scale transform applied if `state.menuPulse` is true
4. The calculation should be: `1 + Math.sin(timestamp / 150) * 0.03`
5. Apply this to `ctx.scale(pulse, pulse)`
6. Test: In settings menu, toggle "Logo Pulse" ON/OFF → title should pulse/stop

**Priority**: 🟢 LOW - Cosmetic only

---

## Fix Order (Most Important First)

1. **🔴 Physics Engine** - Without this, game is broken
2. **🔴 Live Modifier Panel** - Without this, can't change settings during game
3. **🟡 Splash Text** - Quick fix, affects main menu
4. **🟡 Tactical Map** - UX improvement
5. **🟢 Title Pulsate** - Cosmetic polish

---

## Testing After Each Fix

After you fix each bug:

```
FIX #1: Live Modifier Panel
- [ ] Open game
- [ ] Press [M] to open panel
- [ ] Try changing Mode dropdown
- [ ] Try changing Theme dropdown
- [ ] Verify changes take effect immediately
- [ ] Close panel with X button
- Confirm: ✅ Working or ❌ Still broken

FIX #2: Physics Engine
- [ ] Open game
- [ ] Press [A] to spawn P1 character
- [ ] Character should move around smoothly
- [ ] Press [L] to spawn P2 character
- [ ] Characters should collide with each other
- [ ] Hits should register (see damage numbers)
- Confirm: ✅ Working or ❌ Still broken

FIX #3: Splash Text
- [ ] Close and reload game 3 times
- [ ] Each time, check main menu splash text
- [ ] Should see different messages each reload
- Confirm: ✅ Working or ❌ Still broken

FIX #4: Tactical Map
- [ ] Play a game
- [ ] Look at bottom-right minimap
- [ ] Try clicking on minimap
- [ ] Camera should respond to clicks
- Confirm: ✅ Working or ❌ Still broken

FIX #5: Title Pulsate
- [ ] From main menu, click "Menu Settings"
- [ ] Toggle "Logo Pulse" ON
- [ ] Go back - title should pulse
- [ ] Toggle "Logo Pulse" OFF
- [ ] Go back - title should stop pulsing
- Confirm: ✅ Working or ❌ Still broken
```

---

## CRITICAL RULES - DO NOT BREAK ANYTHING ELSE

✅ **Safe to Change**:
- Canvas drawing commands (colors, shapes)
- Text rendering (fonts, sizes)
- JSX styling (CSS-in-JS)
- Event handler logic (click, keyboard)

❌ **DO NOT TOUCH**:
- Game loop frame rate
- Physics calculations
- Collision detection thresholds
- Character spawn positions
- Game state structure
- Type definitions

---

## When Done

After fixing all 5 bugs:
1. Verify game is fully playable
2. Test each fix from the checklist above
3. Confirm no new bugs were introduced
4. Report which bugs are fixed ✅ and which still need work ❌

---

## File to Modify

**Only file you need to edit**:
- `src/pages/KineticSouls.tsx`

That's the main component file containing all the code.

---

**Start with Bug #1 (Live Modifier Panel) first - it should be a quick fix!** 🚀

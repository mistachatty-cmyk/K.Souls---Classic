# COPY & PASTE THIS INTO GEMINI

---

I need your help improving the visual design of a canvas-based game called **Kinetic Souls** - a fighting game where characters auto-battle in an arena. The game is fully functional and playable, but the visuals need polish.

## Core Game Identity & Progression Scope
When updating or polishing anything, keep the true vision of the game in mind:
- **Economy:** Players always earn at least 1 Lok point no matter what, and cumulative overall damage is tracked for special unlocks.
- **Purchases:** Integrated seamlessly into the Main Menu, Lok Game Modifier, and the in-game Lok Live Game Modifier.
- **Passes:** Support structures for the **Lok Pass** (in-game items) and **Lok Passport** (cross-project premium items).
- **Tiers:** Customizations follow strict quality tiers: `(RAW) -> (DMG) -> (Br/Kn) -> (GILDED) -> (Lok) -> (RUNESIGHT)`.
- **Lok Live Game Modifier:** This is not just a standard UI menu; it is an integral, premium, modular piece of the game. It must be structured so we can add advanced features later (like characters bouncing inside the menu, RGB borders, unique fonts).
- **Movement Modes:** Visuals must support 4 distinct vibe modes: **Chill**, **Screensaver**, **Standard**, and **Chaos**.
- **The Sabre & Br/kn Sabres:** The iconic weapon growing from every Kinetic's head. The hilt has a small hitbox. If struck perfectly, it has a 14% chance to break off, flying around as a lethal physics object. The Kinetic becomes "Null" (0 damage) until the Sabre regrows (4-14s). Broken sabres have a 14% chance to become elemental "Br/kn Sabres" (Fire, Frost, Vortex) triggering massive arena events.

## CRITICAL: Do NOT Break Anything

**PROTECTED - Must Keep Working:**
- All 5 game modes (Timer, Score, Horde, Infection, Unlimited)
- All physics and collision detection
- Character spawning system (all 13 kinetic types)
- All 20+ theme color systems
- All 12 weapon types
- Live modifier panel (real-time in-game settings)
- Particle effects and explosions
- Camera modes (static, dynamic, action, enhanced)
- Keyboard shortcuts: [A], [L], [Q], [P], [M]
- Scoring system and game state management

**DO NOT MODIFY:**
- Game constants (ARENA_W=900, ARENA_H=560, CHAR_RADIUS=14, etc.)
- Physics calculations or collision math
- Event handlers for keyboard/mouse/touch
- Type definitions or interface structures
- Character movement algorithms

## What You CAN Safely Change

✅ Canvas drawing (colors, shapes, shadows, glows)
✅ Text rendering (fonts, sizes, alignment)
✅ JSX styling (CSS-in-JS properties)
✅ Visual effects (animations, filters, overlays)
✅ Sprite design and appearance
✅ Button styling and states
✅ UI polish and visual hierarchy

## Visual Areas to Enhance

1. **Character Rendering** - `drawRawChar()` function
   - Make characters look less like basic squares
   - Improve visual appeal while keeping the same hitbox

2. **Weapon Visuals** - `drawWeapon()` function
   - Enhance the 12 weapon types
   - Better distinction between weapons

3. **Particle Effects** - Explosion and impact visuals
   - Better shapes and colors
   - More satisfying death effects

4. **HP Bars** - `drawHpBar()` function
   - More polished appearance
   - Better visibility and theme-aware styling

5. **Main Menu** - `drawMainMenu()` function
   - Better visual hierarchy
   - Improved button states and styling

6. **Live LoK Mods Panel** - JSX React overlay
   - Better spacing and visual feedback
   - Improved hover states

7. **Minimap** - Bottom-right tactical HUD
   - Better visual clarity
   - Improved contrast

8. **Scoreboard** - Top 60px with scores and timer
   - Better typography and layout

9. **Theme Consistency** - 20+ themes (Classic, Neon, GameBoy, Runesite, etc.)
   - Each theme should look visually cohesive

10. **Environment Effects** - Ice, Blackhole, Lava, Storm, etc.
    - More immersive visuals

## Reference Documentation

I have comprehensive documentation available:
- **VISUAL_GAME_REFERENCE.md** - Contains:
  - Exact canvas dimensions and positioning
  - Code-to-visual function mapping (which function creates which visual)
  - Complete spec for every UI element
  - Theme color palettes
  - 11 screenshot references

- **KineticSouls.tsx** - The main game file (900+ lines)
  - Contains all rendering functions
  - Game loop and physics system
  - Live modifier panel JSX

## How to Approach This

1. **Read the visual reference** - Understand current design
2. **Identify one visual area** - e.g., character rendering
3. **Make it look better** - Enhance appearance, not mechanics
4. **Test thoroughly** - Verify nothing broke
5. **Move to next area** - Iterate systematically

## Example Safe Change

```typescript
// BEFORE (basic)
ctx.fillStyle = "#ff0000";
ctx.fillRect(x, y, 10, 10);

// AFTER (enhanced, safe)
ctx.fillStyle = "#ff4444";
ctx.shadowBlur = 8;
ctx.shadowColor = "#ff0000";
ctx.strokeStyle = "#ff8800";
ctx.lineWidth = 2;
ctx.fillRect(x, y, 10, 10);
ctx.stroke();
ctx.shadowBlur = 0;
// Result: Better-looking visuals, same hitbox size and position
```

## Testing Checklist

After changes, verify:
- [ ] Game starts and plays without errors
- [ ] All buttons work (menus, start game, etc.)
- [ ] Character spawning works ([A] for P1, [L] for P2)
- [ ] Combat works (characters hit each other, take damage)
- [ ] Scores update correctly
- [ ] All themes display correctly
- [ ] Live modifier panel opens ([M] key)
- [ ] Pause works ([P] key)
- [ ] No console errors
- [ ] Visual quality is clearly improved

## Success Means

✅ Game works exactly like before
✅ Visuals are noticeably more polished
✅ UI is more intuitive and readable
✅ Effects feel more satisfying
✅ Each theme looks cohesive
✅ No new bugs or broken features

---

## Step 1: Let Me Share the Files

I'll provide you with:
1. **VISUAL_GAME_REFERENCE.md** - The complete visual specification
2. **KineticSouls.tsx** - The game code to modify

After you review those, we can start improving the visuals systematically.

Would you like me to share the reference file first so you understand the current design?

---

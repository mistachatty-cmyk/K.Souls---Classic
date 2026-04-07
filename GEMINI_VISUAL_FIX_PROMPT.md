# Gemini AI: Kinetic Souls Visual Enhancement Prompt

## Overview
You are being asked to improve the visual design and rendering quality of the **Kinetic Souls** canvas-based fighting game. The game is a fully functional auto-battle arena where multiple characters fight automatically, and you have comprehensive reference documentation to guide your work.

## Core Philosophy: Sandbox Customization
We have an "options philosophy" for this game—think *Interactive Buddy*. It is a sandbox where everything should be customizable. **If you introduce a new visual style, effect, or layout, you must add it appropriately as a toggleable option in the menus (like the Live LoK Mods panel).** Do not permanently overwrite existing styles if they can be preserved as an alternative option.

## Core Game Identity & Progression
Keep in mind the true nature of this game when designing visuals or features:
- **The Gameplay:** It is a dynamic 1v1 arena brawler where kinetics fight in a physics-based arena. Matches are filled with random events, chaos, and "Directors" stepping in to drop items, hazards, and killable entities.
- **The Economy & Progression:** Players *always* earn at least 1 Lok point/coin no matter what, with kills and triggers granting more. Additionally, overall cumulative damage is tracked continuously to trigger special unlocks.
- **Purchases & Storefronts:** In-game purchases and unlock redemptions will be accessible directly from the Main Menu, the pre-game Lok Game Modifier, and the in-game Lok Live Game Modifier.
- **The Passes:** Features must connect to the **Lok Pass** (grants almost all in-game items) and the **Lok Passport** (grants all premium items across all Lok-related projects).
- **Skin & Theme Tiers:** Visuals scale in quality and customization based on tier: `(RAW) -> (DMG) -> (Br/Kn) -> (GILDED) -> (Lok) -> (RUNESIGHT)`. Higher tiers feature significantly higher quality graphics, complex rendering, and deeper customization options.
- **Lok Live Game Modifier (Premium Hub):** This in-game UI is a premium, integral, modular piece of the game loop. It must be built for extreme long-term customization (e.g., eventually allowing kinetics to bounce *inside* the menu itself, RGB glowing borders, custom typography, etc.).
- **The Arena & Movement Modes:** The arena reacts dynamically. We are planning 4 distinct movement/vibe modes: **Chill Mode**, **Screensaver Mode** (hypnotic, DVD-logo style bouncing), **Standard Mode**, and **Chaos Mode**. The visuals and physics must support these varying levels of intensity.
- **The Sabre & Br/kn Sabres:** The iconic weapon of the game. A Sabre grows from the hilt on every Kinetic's head (small hitbox). If struck precisely, there is a 14% chance it breaks off and flies around the arena as a lethal physics object. The Kinetic becomes "Null" (cannot deal damage) until the Sabre regrows (4-14 seconds). Knocked-off Sabres have a 14% chance to spawn as "Br/kn Sabres" (elemental variants like Fire, Frost, Vortex) that alter the game state with special effects.

## Critical No-Break Rules ⛔

**THESE FEATURES MUST NOT BE BROKEN:**
- ✅ All 5 game modes (Timer, Score, Horde, Infection, Unlimited)
- ✅ All game physics and collision detection
- ✅ Character spawning system and all 13 kinetic types
- ✅ All 20+ theme color systems
- ✅ All 12 weapon types and animations
- ✅ Live modifier panel functionality (real-time in-game settings)
- ✅ Particle system and explosion effects
- ✅ Camera modes (static, dynamic, action, enhanced)
- ✅ Audio state management (if implemented)
- ✅ Touch controls and mobile support
- ✅ All keyboard shortcuts ([A], [L], [Q], [P], [M])
- ✅ Scoring system and ghost floaters
- ✅ HP bars and damage indicators
- ✅ Pause/Resume functionality

**DO NOT MODIFY:**
- Game constants (ARENA_W, ARENA_H, CHAR_RADIUS, etc.)
- Physics calculations or collision math
- Game state management structure
- Event handlers for keyboard/mouse/touch
- Type definitions or interface structures
- Character movement algorithms

---

## Reference Documentation Available

You have access to **VISUAL_GAME_REFERENCE.md** which contains:
1. **In-Game Screen Layout** - Exact dimensions, positioning, z-index for scoreboard, arena, minimap
2. **Live LoK Modifiers Panel** - Complete spec for the in-game settings overlay (260px wide, gold borders, all dropdowns)
3. **Canvas Dimensions** - ARENA_W (900px), ARENA_H (560px), SCOREBOARD_H (60px)
4. **Theme Colors** - Complete color palettes for all 20+ themes
5. **Code-to-Visual Mapping** - Exact functions that create each visual element
6. **Image References** - 11 screenshot images showing the current state

### How to Use the Reference
When you need to improve a visual:
1. **Look up the image** (01-11) showing the current state
2. **Find the code function** in the mapping table
3. **Read the spec** in the appropriate section
4. **Make improvements** without changing the structure

---

## Visual Areas Ready for Enhancement

### ✨ High Priority - Visual Polish
These visuals commonly need refinement:

1. **Character Rendering** (`drawRawChar()` function)
   - Current: Simple colored squares for body parts
   - Enhance: Better proportions, smoother animations, more appealing design
   - Constraint: Keep the same hitbox sizes and pose system
   - Does NOT affect: Collision detection, physics, spawning

2. **Weapon Visuals** (`drawWeapon()` function)
   - Current: Simple line/shape drawings
   - Enhance: More detailed weapon shapes, better rotation animation, clearer distinction
   - Constraint: Weapon reach calculations must remain unchanged
   - 12 weapons to improve: Dagger, Spear, Hammer, Scythe, Axe, Katana, Mace, Rapier, Whip, Blaster, Fireball, Standard

3. **Particle Effects** (Explosions, impacts, trails)
   - Current: Basic squares with opacity fade
   - Enhance: Better shapes, colors, trajectories while maintaining gravity/physics
   - Constraint: Physics calculations (velocity, gravity) must stay identical
   - All themes should have theme-appropriate colors

4. **HP Bars** (`drawHpBar()` function)
   - Current: Simple colored rectangles
   - Enhance: More polished appearance, better visibility, theme-aware styling
   - Positioning: Already correct (above character at `c.y - CHAR_RADIUS * c.scale - 15 * c.scale`)
   - Colors: Green (>50%), Yellow (20-50%), Red (<20%)

5. **Main Menu UI** (`drawMainMenu()` function)
   - Current: Basic buttons and text layout
   - Enhance: Better visual hierarchy, button states (hover/active), consistent styling
   - Constraint: All buttons must maintain their click coordinates and functionality
   - Layout coordinates are documented in VISUAL_GAME_REFERENCE.md

6. **Live LoK Mods Panel** (JSX React component)
   - Current: Functional but minimal styling
   - Enhance: Better spacing, visual feedback, hover states, scroll behavior
   - Constraint: All dropdown changes must immediately update game state
   - Existing structure: 260px fixed width, absolute positioning (top 10px, right 10px)

7. **Minimap/Tactical HUD** (Bottom-right corner rendering)
   - Current: Basic dots on grid
   - Enhance: Better visual clarity, improved contrast, team color distinction
   - Positioning: Fixed at (780, 520) to (900, 600) in screen space
   - Must show: Character positions, camera frustum, grid

8. **Scoreboard** (Top 60px of canvas)
   - Current: Text-only display
   - Enhance: Better typography, layout, visual separation of elements
   - Elements to maintain:
     - P1 Score: x=140, y=36
     - Title: x=450 (center), y=24
     - P2 Score: x=760, y=36
     - Director Points: x=450, y=36
     - Timer/Info: x=450, y=50
     - Modifiers: x=450, y=60

9. **Theme Consistency**
   - Each theme should have cohesive visuals
   - Current themes: Classic, Neon, GameBoy, Runesite, GSix, Gilded, LokMod, Abyss, Glitch, Comic, Monochrome, etc.
   - Enhance: Better visual distinction between themes, consistent UI per theme

10. **Environment Effects**
    - Current: Basic overlays and visual tricks
    - Enhance: More immersive environment visuals
    - 8 environments: None, Ice, Blackhole, Lava, Storm, Bouncy, Wrap, Blackout
    - Physics logic must remain unchanged

---

## What NOT to Do ❌

### Forbidden Changes
- ❌ Do NOT rewrite the physics engine - only enhance visuals
- ❌ Do NOT add new game modes or mechanics
- ❌ Do NOT remove any themes, weapons, or kinetic types
- ❌ Do NOT change character hitbox sizes or spawn positions
- ❌ Do NOT alter the game loop frame rate or timing
- ❌ Do NOT modify input handling or keyboard shortcuts
- ❌ Do NOT break the live modifier system
- ❌ Do NOT change state management structure
- ❌ Do NOT add new dependencies (only use existing React/Canvas APIs)
- ❌ Do NOT modify the 13 kinetic types or their properties

### Safe Changes Only
- ✅ Canvas drawing calls (color, shape, anti-aliasing)
- ✅ Text rendering (font, size, alignment, shadow)
- ✅ JSX styling (CSS-in-JS properties)
- ✅ Visual effects (shadows, glows, filters)
- ✅ Animation timing (only visual, not game logic)
- ✅ Sprite rendering order or layering
- ✅ UI polish and button states

---

## How to Make Changes Safely

### Pattern 1: Canvas Drawing Enhancement
```typescript
// BEFORE (bad physics impact)
ctx.fillStyle = "#ff0000";
ctx.fillRect(x, y, 10, 10);

// AFTER (safe visual enhancement)
ctx.fillStyle = "#ff4444";
ctx.shadowBlur = 8;
ctx.shadowColor = "#ff0000";
ctx.strokeStyle = "#ff8800";
ctx.lineWidth = 2;
ctx.fillRect(x, y, 10, 10);
ctx.stroke();
ctx.shadowBlur = 0;
// Physics unchanged: x, y dimensions and hit detection used elsewhere remain identical
```

### Pattern 2: JSX Styling Enhancement
```typescript
// BEFORE (minimal)
style={{ background: "#000", color: "#fff" }}

// AFTER (polished)
style={{
  background: "rgba(0, 0, 0, 0.9)",
  color: "#fff",
  border: "2px solid #ffd700",
  borderRadius: "4px",
  boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
  padding: "8px 12px"
}}
// No behavior change, only appearance
```

### Pattern 3: Conditional Theme Styling
```typescript
// BEFORE
ctx.fillStyle = "#fff";

// AFTER (theme-aware)
ctx.fillStyle = theme === "gameboy" ? "#9bbc0f" : 
                theme === "runesite" ? "#dca878" : "#fff";
// Same visual effect logic, supports all themes
```

---

## Testing Checklist

After making visual enhancements, verify:

- [ ] **Gameplay Works**: Start a game and play for 30 seconds
  - Characters spawn correctly
  - Combat works (hits register)
  - Scores update
  
- [ ] **All Buttons Function**: Click every button/option in menus
  - Main menu buttons work
  - LoK modifiers selections change game state
  - Settings toggle correctly
  
- [ ] **All Themes Display**: Switch between themes and verify visuals
  - Colors are distinct per theme
  - No broken/missing visuals
  - Readability is maintained
  
- [ ] **Live Modifiers Work**: Press [M] during gameplay
  - Panel opens/closes
  - All inputs update game state in real-time
  - Panel stays in correct position
  
- [ ] **Controls Work**:
  - [A] spawns P1
  - [L] spawns P2
  - [Q] toggles auto-spawn
  - [P] pauses
  - [M] opens modifier panel
  
- [ ] **Camera Modes Work**:
  - Static: Fixed camera
  - Dynamic: Follows action
  - Action: Focuses on character
  - Enhanced: Zooms to fit arena
  
- [ ] **Particle Effects Visible**:
  - Explosions appear and fade
  - Damage numbers show
  - Motion trails visible (when enabled)
  
- [ ] **No Console Errors**: Open dev tools and verify no errors
  - Game should run smoothly
  - No warnings about missing properties

---

## Code Structure Reference

**Key Files to Modify:**
- `src/pages/KineticSouls.tsx` - Main component (only file you need to edit)

**Key Functions for Visual Enhancement:**
- `drawRawChar()` - Character appearance (lines ~600-900)
- `drawWeapon()` - Weapon rendering (lines ~920-1100)
- `drawMainMenu()` - Menu screen (lines ~1400-1500)
- `drawLokMenu()` - Modifier menu (lines ~1500-1700)
- `drawHpBar()` - Health bars (lines ~950-970)
- `drawGhost()` - Death floaters (lines ~980-1010)
- `gameLoop()` canvas rendering - Scoreboard, minimap, effects (lines ~1600-2050)

**Key Styling Elements:**
- Theme colors: `getTeamColor()` function (lines ~300-450)
- Button styling: `drawBtn()` function (lines ~1250-1320)
- Character positioning: `BASE_PARTS` constant (lines ~180-190)

---

## Success Criteria

Your visual enhancements are successful if:

1. ✅ All game features **work exactly as before**
2. ✅ Visual quality is **noticeably improved**
3. ✅ The game is **more visually cohesive** (consistent art direction per theme)
4. ✅ UI elements are **more intuitive** and **readable**
5. ✅ Effects are **more satisfying** and **polished**
6. ✅ No **new bugs** or **broken features** are introduced
7. ✅ The design **maintains the original aesthetic**

---

## Quick Start Workflow

1. **Read VISUAL_GAME_REFERENCE.md** to understand:
   - Canvas layout and dimensions
   - Function mapping to visuals
   - Current design specifications

2. **Load KineticSouls.tsx** and explore:
   - Identify visual functions (drawRawChar, drawWeapon, etc.)
   - Look at theme color system
   - Understand current rendering approach

3. **Pick one visual area** (e.g., Character rendering)
   - Enhance it while keeping structure identical
   - Test thoroughly
   - Move to next area

4. **Iterate and test** after each change group
   - Small, focused improvements
   - Verify no breakage
   - Commit/save regularly

5. **Polish across all themes**
   - Ensure each theme looks cohesive
   - Verify all 20+ theme colors work

---

## Questions to Ask About Improvements

For each visual area, ask:
- "Does this make the game look better?"
- "Can I see what's happening more clearly?"
- "Does this match the theme aesthetic?"
- "Will this work on all themes?"
- "Is the performance impact acceptable?"

---

## Final Note

Your goal is to make **Kinetic Souls visually beautiful and polished** while keeping **every feature and mechanic intact**. The game is fully playable and feature-complete—you're just making it look and feel more professional and enjoyable.

Good luck! 🎮✨

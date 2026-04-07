# Kinetic Souls - Visual Game Reference

## Screenshots & Images

> **Note**: Place the following screenshot files in `docs/visuals/`:
> - `01_main_menu.png` - Main menu screen
> - `02_lok_mods_panel.png` - Live LoK Mods settings panel (in-game)
> - `03_lok_modifiers_menu.png` - Full LoK Modifiers selection screen
> - `04_bestiary.png` - Character Bestiary reference menu

### Main Menu
![Main Menu](../docs/visuals/01_main_menu.png)

**Code Reference**: `drawMainMenu()` function
- Location: KineticSouls.tsx, renders when `screenRef.current === "menu"`
- Renders: Game title, splash text, mode/opponent buttons, start button
- Key Variables: `refs.mode`, `refs.opp`, `currentSplash`

### Live LoK Mods Panel
![Live LoK Mods](../docs/visuals/02_lok_mods_panel.png)

**Code Reference**: React JSX state hook + inline styling
- Location: KineticSouls.tsx, `showLiveMenu` state and conditional render
- Renders: Right-panel overlay with all configuration dropdowns
- Key Handle: Click handlers that update `stateRef.current`

### LoK Modifiers Menu
![LoK Modifiers](../docs/visuals/03_lok_modifiers_menu.png)

**Code Reference**: `drawLokMenu()` function
- Location: KineticSouls.tsx, renders when `screenRef.current === "lok_menu"`
- Renders: Full-screen menu with all theme/modifier/environment buttons
- Button Click Logic: Sets `refs.theme`, `refs.mod`, `refs.env`, etc.

### Bestiary
![Bestiary](../docs/visuals/04_bestiary.png)

**Code Reference**: Character spawning system
- Location: `spawnCharacter()` function spawns all 13 kinetic types
- Types Referenced: `KineticType` enum includes all bestiary entries
- Key Function: `getPartDamage()` defines role-specific damage per body part

### Additional Gameplay Screenshots (Current Game State)

#### Horde Mode - Chaotic Gameplay
![Horde Mode Gameplay](../docs/visuals/05_horde_gameplay.png)
*50+ fighters battling simultaneously with particle effects and motion trails*

**Code Reference**: Game loop rendering with `state.mode === "horde"`
- Location: `gameLoop()` function, arena rendering section
- Spawning Logic: `spawnCharacter()` called repeatedly by `botTimer`
- Particle System: `dataRef.parts.current` rendered with falling gravity
- Motion Trails: Rendered when `state.trails === true` from `c.trail[]`

#### Live LoK Mods Panel - Expanded View
![Live Mods Panel Extended](../docs/visuals/06_live_mods_panel_extended.png)
*Full expanded controls for Mode, Opponent, Modifier, Weapons, Camera, Theme, Environment*

**Code Reference**: JSX overlay component with all dropdowns
- Location: Lines containing `showLiveMenu && (<div style={{...}})...`
- Input Mapping:
  - Mode: `onChange={() => stateRef.current.mode = ...}`
  - Opponent: `onChange={() => stateRef.current.opponent = ...}`
  - Modifier: `onChange={() => stateRef.current.modifier = ...}`
  - All others follow same pattern

#### Live LoK Mods - Environment Dropdown
![Environment Selection](../docs/visuals/07_environment_dropdown.png)
*Shows all environment options: Ice Rink, Black Hole, Lava Floor, Storm, Bouncy, Wrap, Blackout*

**Code Reference**: Environment dropdown + rendering logic
- Type Definition: `type Environment = "none" | "ice" | "blackhole" | "lava" | "storm" | "bouncy" | "wrap" | "blackout"`
- Rendering: `gameLoop()` function, environment-specific sections:
  - Ice: Wall bounce/friction logic (~line 1680)
  - Blackhole: Gravity pull effect (~line 1650)
  - Lava: Damage floor (~line 1750)
  - Storm: Wind force (~line 1640)
  - Wrap: Teleport edges (~line 1630)

#### LoK Modifiers Full Screen
![LoK Modifiers Screen](../docs/visuals/08_lok_modifiers_screen.png)
*Complete modifier selection menu with all game options organized by category*

**Code Reference**: `drawLokMenu()` with button layout system
- Location: `drawLokMenu()` function
- Button Creation: `drawBtn()` helper function (recurring calls with x/y coordinates)
- State Updates: `handleClick()` checks coordinates and sets `refs.*` properties
- Grid System: Buttons organized in rows (y=110, 175, 210, 290, 355, 420, 485)

#### Runesite Theme Gameplay
![Runesite Themed Game](../docs/visuals/09_runesite_gameplay.png)
*Game running with Runesite theme showing brown/tan colored characters and UI*

**Code Reference**: Theme color system + character rendering
- Color Definition: `getTeamColor()` function line for runesite:
  ```
  if (theme === "runesite" || theme === "runesite_ultimate")
    return team === 1 ? "#b12a2a" : team === 2 ? "#2a52b1" : ...
  ```
- Skin Colors: `drawRawChar()` sets `skin = "#dca878"` and `dark = "#152c5e"`
- Arena Background: `bgColor = "#2b2620"` (brown)
- Grid Color: `gridColor = "#403930"` (dark brown)

#### Standard Gameplay - Mid-Battle
![Standard Gameplay](../docs/visuals/10_standard_gameplay.png)
*Normal gameplay session with multiple fighters, HP bars, scores, and minimap*

**Code Reference**: Complete game loop rendering
- Canon Rendering: `gameLoop()` function
- Character Rendering: `renderChar()` called for each `c` in `dataRef.chars.current`
- HP Bars: `drawHpBar()` function called above each character
- Scoreboard: Top 60px rendered by score text @ center, P1/P2 scores at sides
- Minimap: Rendered in last section of `gameLoop()` when `state.hud && state.viewMode === "standard"`

#### Dense Battle - High Fighter Count
![Dense Battle Scene](../docs/visuals/11_dense_battle.png)
*Heavy engagement with 20+ fighters, showing visual juice effects and particle bursts*

#### Bestiary - Character Reference (Close-up)
![Bestiary Detail View](../docs/visuals/12_bestiary_detail.png)
*Character entries showing Role, HP, Speed, Weapon, and flavor text descriptions*

---

## Game Title & Branding
- **Title**: KINETIC SOULS
- **Subtitle**: "I love you Tan-Moka"
- **Game Type**: 1v1 AUTO BATTLE ARENA

---

## Main Menu Screen

### Layout & Colors
- Dark background with grid pattern
- Title in large white/light text with golden yellow accent on "SOULS"
- Tagline in golden yellow text below title

### Menu Sections

#### GAME MODE
- Options: Timer: 2 Mins, Score: 10 Pts
- Purple/blue button style
- Selectable dropdown or button controls

#### OPPONENT
- Options: Player vs Player, Player vs Bot
- Purple/blue button style
- Clear visual separation between modes

#### Action Buttons
- **START GAME** - Orange/brown button, centered
- **Menu Settings** - Light blue button, bottom left
- **LoK Game Modifiers** - Yellow button, bottom right

### Footer Instructions
- Control hints: "P1: Press [A] to spawn | P2: Press [L] to spawn"
- Additional info: "Characters bounce around and fight automatically!"
- Checkbox: "Enable Mobile controls"

---

## Live LoK Mods Panel (In-Game Settings)

### Header
- Red/orange lightning bolt icon
- "LIVE LOK MODS" text in golden yellow
- Red X button to close

### Configuration Sections (Left Panel)

#### MODE (Dropdown)
- Timer
- Score
- Horde
- Infection
- Unlimited

#### OPPONENT (Dropdown)
- PvP
- Bot
- FFA

#### MODIFIER (Dropdown)
- None
- Sudden Death
- Titans
- Wep: Roulette
- [Others]

#### WEAPONS (Dropdown)
- Standard
- [Others]

#### CAMERA (Dropdown)
- Static (highlighted/selected state)
- Dynamic
- Action Cam
- None

---

## LoK Modifiers Full Menu Screen

### Title & Subtitle
- "LOK MODIFIERS" in golden yellow
- "SECRET MODES & ENVS" subtitle

### Menu Sections (Grid Layout)

#### SECRET MODES & ENVS (Top Row)
- Horde Mode
- Infection
- Env: Storm
- Env: Bouncy

#### THEMES (2x2 Grid)
- Classic (selected/highlighted)
- Neon
- GameBoy
- Abyss
- RuneSite
- GSix
- Gilded
- Hacker
- Synthwave
- Vampire
- Oceanic
- Infernal

#### WEAPONS & MODIFIERS (Row)
- None (selected/highlighted)
- Sudden Death
- Titans
- Wep: Roulette

#### CAMERAS & PHYSICS (Row)
- Static Cam (selected/highlighted)
- Dynamic Cam
- Action Cam

#### CUT CONTENT (VISUAL TOGGLES) (Row)
- Juice: OFF
- HUD: OFF
- Trails: OFF
- Ads: OFF
- CRT: OFF

#### PRO ENGINE OPTIMIZATIONS (Row)
- Cache: ON
- Delta: ON
- Gravity: ON
- SmSpawn: ON
- Grid: ON

### Footer Button
- "BACK TO MAIN" - Orange/brown button, centered

### Footer Controls
- "P1: [A] Spawn | P2: [L] Spawn | [Q] Auto-Spawn | [P] Pause | [M] Live Modifiers Menu"

### Bottom UI
- Checkbox: "Enable Mobile controls"
- Spawn Buttons (Player specific):
  - "SPAWN P1" - Red/orange button
  - "SPAWN P2" - Blue button

---

## Bestiary - Character Reference Menu

### Title
- Golden yellow text
- Icon (book/document icon)
- "BESTIARY — KINETIC SOULS"
- Subtitle: "14 entries found"

### Character Grid (2-Column Layout)

#### Entry Format
- **Character Name** (colored left border)
- **Role**: [Role Type]
- **HP**: [Value]
- **SPD**: [Speed Level]
- **Weapon**: [Weapon Type]
- **Description**: [Character flavor text]

#### Characters Shown
1. **Kinetic Standard** (Red border)
   - Role: Warrior
   - HP: 20 • SPD: Normal • Weapon: Varies
   - "The backbone of every arena. Balanced, reliable, unpredictable."

2. **Shadow Reaper** (Pink/Magenta border)
   - Role: Striker
   - HP: 18 • SPD: Very Fast • Weapon: Katana
   - "Strikes before you see it coming. Paper HP, lethal blade."

3. **Void Ninja** (Purple border)
   - Role: Strikeman
   - HP: 20 • SPD: Fast • Weapon: Dagger
   - "Flickers between spaces. Hard to pin down. Impossible to ignore."

4. **Relevant Husk** (Yellow/Green border)
   - Role: Support
   - HP: 1 • SPD: Slow • Weapon: Brawl
   - "One hit and it drops. But they come in waves. Always waves."

5. **Iron Tank** (Blue border)
   - Role: Defender
   - HP: 40 • SPD: Slow • Weapon: Mace
   - "Built for endurance. Takes hits so allies don't have to."

6. **Horizon Marksman** (Cyan border)
   - Role: Ranger
   - HP: 20 • SPD: Normal • Weapon: Blaster
   - "Keeps distance. Picks off threats with cold precision."

7. **Wraith Echo** (Purple border)
   - Role: Hunter
   - HP: 20 • SPD: Fast • Weapon: Scythe
   - "Barely there. Half in this world, fully lethal."

8. **Bastian Guard** (Blue border)
   - Role: Bulwark
   - HP: 20+35 • SPD: Slow • Weapon: Standard
   - "Energy shielded. You must break the barrier before the soul."

9. **LoK Caster** (Orange border) - BOSS
   - Role: BOSS
   - HP: 30+ • SPD: Slow • Weapon: Fireball
   - "Commands the unseen forces. A boss unit. Respect accordingly."

10. **Death Weaver** (Purple border) - BOSS
    - Role: BOSS
    - HP: 40+ • SPD: Normal • Weapon: Scythe
    - "Raises the fallen. The longer the fight, the stronger it becomes."

11. **Titan Behemoth** (Red border) - BOSS
    - Role: BOSS
    - HP: 80+ • SPD: Very Slow • Weapon: Hammer
    - "[Description continues...]"

12. **Ggenaut** (Purple border) - BOSS
    - Role: BOSS
    - HP: 60+ • SPD: Crawl • Weapon: Axe
    - "[Description continues...]"

### Footer
- Character customization skins displayed below:
  - P1 SKIN: "default, ballman, fallguy, voxel, mecha, diamond, skull, robot, pacman, tea, food, ghost"
  - P2 SKIN: Same selection available

---

## Visual Style Guide

### Color Palette
- **Primary Dark**: Deep navy/black background (#0F1419 or similar)
- **Accent Gold**: Golden yellow for titles and key text (#FFD700 or similar)
- **Accent Red/Orange**: For buttons and warnings (#FF6B35 or similar)
- **UI Purple**: For selection and primary buttons (#7B68EE or similar)
- **UI Blue**: For alternate buttons and elements (#4169E1 or similar)
- **Character Borders**: Color-coded by character type/role

### Typography
- **Titles**: Bold, large, golden yellow
- **UI Text**: Light gray/white on dark background
- **Headers**: Golden yellow or red/orange
- **Body Text**: Light gray, readable on dark backgrounds
- **Monospace**: Used for technical stats and values

### Borders & Frames
- Glowing border effect (neon-style) around main panels
- Character entry left borders (thick, color-coded)
- Clear visual separation between sections
- Underlines for section headers

### Button Styles
- **Primary Action** (Start Game): Orange/brown, large, centered
- **Secondary** (Settings): Light blue
- **Spawn Buttons**: P1 = Red/Orange, P2 = Blue
- **Back/Menu**: Orange/brown
- Hover/Active states with glow or brightness increase

### Icons & Symbols
- Lightning bolt for LoK (⚡)
- Book icon for Bestiary (📖)
- Star/crown for BOSS designation
- Checkbox states for toggles (☑️ / ☐)

---

## Animation & Effects Notes

### Menu Transitions
- Smooth fade in/out between screens
- Glow effect on selected items
- Highlight on hover

### Game Arena
- Particles spawn and animate during gameplay
- Character movement is fluid and automatic
- Score/timer updates in real-time
- Visual feedback for hits (particle bursts, impact effects)

### Visual Feedback
- Spawn indicators for players
- Health indicators visible during gameplay
- Visual distinction between player 1 (red) and player 2 (blue)

---

## Responsive Layout Notes

### Desktop (Current)
- Full menu panels centered
- Grid layouts for characters/options
- Footer instructions visible
- Buttons appropriately sized

### Mobile
- "Enable Mobile controls" checkbox option
- Touch-friendly button sizes
- Responsive grid layouts
- Simplified or condensed menus if needed

---

## Known Issues / Notes for Implementation

- Menu "/" character rendering (canvas-based, font-specific)
- Ensure all colors are consistent across menus
- Glow/neon effect should be consistent on all borders
- Mobile control toggle should work seamlessly
- Bestiary character count may vary (14 shown in reference)

---

## ⚠️ CRITICAL ISSUES - GEMINI CHANGES (TO FIX ON NEXT PASS)

**DO NOT IGNORE - These are breaking changes that need to be reverted/fixed:**

### Issue 1: Live LoK Game Modifier Menu NOT WORKING ❌
**Status**: BROKEN - Not being fixed at all
**Problem**: The JSX overlay panel (`showLiveMenu`) is not responsive to user input
**Current State**: Panel appears but dropdowns/inputs don't update game state
**Required Fix**: 
- Verify all `onChange` handlers are properly connected
- Check that `stateRef.current` updates are triggering game state changes
- Ensure panel stays visible and positioned correctly during gameplay
- All dropdowns must immediately affect gameplay when changed
**Code Location**: JSX state hook with `showLiveMenu && (<div...>)` wrapper
**Priority**: CRITICAL - This is a core gameplay feature

### Issue 2: Physics Engine is BROKEN ❌
**Status**: BROKEN - Collision detection and movement affected
**Problem**: Character physics, collisions, and movement behavior have been compromised
**Symptoms**: 
- Characters not moving correctly
- Collision detection broken
- Spawn behavior altered
- Game feels unresponsive
**Required Fix**:
- Do NOT modify any code in `processCollision()` function
- Do NOT change character velocity/acceleration calculations
- Do NOT alter the physics timestep or delta-time multiplier
- Revert any changes to collision detection thresholds
- Verify `spawnCharacter()` position calculations are intact
**Code Location**: `gameLoop()` physics section, `processCollision()` function, character velocity updates
**Priority**: CRITICAL - Game is unplayable without this

### Issue 3: Splash Text FORCED to Single Message ❌
**Status**: BROKEN - Only shows "I love you Tan-Moka"
**Problem**: The `SPLASH_ARCHIVE` array is being ignored, forced to single splash text
**Current**: Always shows "I love you Tan-Moka"
**Should Be**: Randomly selects from 35+ messages in `SPLASH_ARCHIVE`
**Examples of messages that should appear**:
- "🦉 Lok: Focus on what matters."
- "💰 COIN MODE: Greed is a weapon."
- "Everything-Everywhere-All-At-Once."
- "Must build additional pylons."
- And 31 others...
**Required Fix**:
- Verify calculation: `SPLASH_ARCHIVE[Math.floor(Math.random() * SPLASH_ARCHIVE.length)]`
- Check that `currentSplash` state is being set correctly on component mount
- Do NOT hard-code the splash text
- Keep the random selection logic intact
**Code Location**: Line containing `currentSplash` initialization
**Priority**: MEDIUM - Feature/cosmetic but affects user experience

### Issue 4: Tactical Map Locations NOT ACTIVE ❌
**Status**: BROKEN - Minimap click detection disabled
**Problem**: Clicking on minimap doesn't update camera/view
**Current Features Disabled**:
- Clicking minimap corners to zoom to areas
- Minimap frustum rectangle is not interactive
- Camera not responding to minimap input
**Required Fix**:
- DO NOT remove the minimap rendering
- Check that minimap is in screen space (not world space)
- Verify click handlers for minimap area
- Minimap should show at bottom-right (780, 520) to (900, 600)
- Must be able to click to navigate or zoom
**Code Location**: `gameLoop()` minimap rendering section (~lines 1880-1925)
**Priority**: MEDIUM - UX feature, not core gameplay

### Issue 5: Game Title Hover/Pulsating Option DISABLED ❌
**Status**: BROKEN - Visual effect option not working
**Problem**: Menu title "KINETIC SOULS" doesn't have pulsating/hovering animation when enabled
**Feature That's Broken**:
- `state.menuPulse` should trigger pulsating effect on title
- Animation uses: `1 + Math.sin(timestamp / 150) * 0.03`
- Should apply to title scale transform
**Current State**: Option exists but has no visual effect
**Required Fix**:
- Verify `state.menuPulse` state variable exists
- Check that title uses `ctx.scale()` with pulse calculation
- Animation should scale title slightly larger/smaller
- Effect should be smooth and continuous
**Code Location**: `drawMainMenu()` function, title rendering section
**Priority**: LOW - Cosmetic only, doesn't affect gameplay

---

## How to Fix These Issues on Next Pass

### For Gemini (Next Instructions):

1. **Physics First** (CRITICAL)
   - Load KineticSouls.tsx
   - Check `processCollision()` function - verify collision math
   - Check character spawn positions - make sure they're correct
   - Check velocity calculations - should not be affected by visual changes
   - Run a test game - verify characters move and hit correctly

2. **Live Modifier Panel** (CRITICAL)
   - Verify JSX panel is rendering
   - Check each `onChange` handler: `stateRef.current.mode = ...`, etc.
   - Verify all dropdowns update game state in real-time
   - Test each dropdown during active gameplay

3. **Splash Text** (MEDIUM)
   - Find where `currentSplash` is set
   - Verify it uses random selection from `SPLASH_ARCHIVE`
   - Test by reloading page multiple times - should see different splash texts

4. **Tactical Map** (MEDIUM)
   - Check minimap is still rendering at bottom-right
   - Look for click handlers for minimap navigation
   - Verify minimap is in screen space (not affected by camera transform)

5. **Title Pulsate** (LOW)
   - In `drawMainMenu()`, find title rendering
   - Add back: `ctx.scale(1 + Math.sin(timestamp / 150) * 0.03, same)`
   - Check that `state.menuPulse` controls whether this is active

---



### Canvas Dimensions
```
TOTAL CANVAS: 900px (W) × 620px (H)
├── SCOREBOARD AREA: 900px × 60px (Top)
└── ARENA AREA: 900px × 560px (Main gameplay zone)
```

### SCOREBOARD (Top 60px) - Screen Space Layout
**Background**: Theme-dependent color (dark navy, green for gameboy, etc.)
**Vertical Layout** (60px height):
```
Line 1 (y=24):  [P1 Score Left]      [KINETIC SOULS Title]      [P2 Score Right]
Line 2 (y=36):  [Director Points]    [Time/Score Limit Info]    [Modifier/Cam Info]
```

#### Scoreboard Elements (Screen Space - Fixed Position):
- **P1 Score** (left): "P1: {score}" @ x=140, y=36
  - Color: Dark red (#cc4433)
  - Font: Bold 18px monospace
  
- **Title**: "KINETIC SOULS" @ x=450 (center), y=24
  - Color: Golden/Yellow (#aaaaaa)
  - Font: Bold 22px monospace
  
- **P2 Score** (right): "P2: {score}" @ x=760, y=36
  - Color: Dark blue (#3366cc)
  - Font: Bold 18px monospace
  
- **Director Points** (center): "DIR POINTS: {count}" @ x=450, y=36
  - Color: Golden/Orange (#ffaa00)
  - Font: Bold 10px monospace
  
- **Mode Info** (center): Time/Score Limit info @ x=450, y=50
  - Examples:
    - "TIME: 1:45 | LIMIT: ∞" (Timer mode)
    - "FIRST TO 10" (Score mode)
    - "SURVIVE 50 KILLS | ENEMY KILLS: 5/15" (Horde mode)
  - Font: 12px monospace
  
- **Active Modifiers** (center, if active) @ x=450, y=60
  - "[MOD: {modifier} | CAM: {camera} | AUTO: {p1Auto}]"
  - Color: Golden (#ffaa00)
  - Font: 12px monospace

### ARENA AREA (Bottom 560px) - World Space + Camera System

#### Background
- Grid pattern with lines every 40px
- Center dashed line (vertical) down middle
- Parallax effect when dynamic camera enabled
- Environment overlay (lava, storm particles, etc.)

#### Arena Bounds
```
Arena Rendering Bounds:
0 ≤ X ≤ 900
60 ≤ Y ≤ 620

Character Spawn Zones (Team Corners):
├── Team 1: Left side (x ≈ 40-100)
├── Team 2: Right side (x ≈ 800-860)
├── Team 3: Top side (y ≈ 60-120)
├── Team 4: Bottom side (y ≈ 540-600)
└── Teams 5 (Zombies): Any location
```

#### Game Objects in Arena (World Space - Camera Affected):
1. **Characters** - Rendered with rotation, animated trails
   - Head (7px radius), Body (9px), Arms (5px), Legs (5px)
   - Weapon displayed (rotated with character)
   - HP Bar above (color: green→yellow→red based on health)
   
2. **Particles** - Explosion, impact, and ambient effects
   - Fall with gravity (configurable)
   - Fade out over 20-40 frames
   
3. **Ghosts** - Death score floaters
   - Float upward toward scoreboard
   - Score when reaching top
   
4. **Floating Text** - Damage numbers and status
   - "-5" (damage, white) or "+HP" (heal, green)
   - Color varies by theme and effect type
   
5. **Projectiles** (laser/fireball)
   - Glowing circles (4px or 8px)
   - Travel in straight lines
   
6. **Drop Items** - Powerups/hazards
   - Bombs (red outline, black fill, countdown timer)
   - Black holes (purple glow)
   - Medkits (white cross)
   - Freeze (cyan triangle)
   - Nukes (large red circles)

### TACTICAL HUD (Minimap) - Screen Space
**Position**: Bottom-right corner
```
Bounds: (780, 520) to (900, 600)
├── Width: 120px
├── Height: 80px
└── Border: 2px outline (gold/purple/theme-dependent)
```

**Content**:
- Center crosshairs (vertical + horizontal lines)
- Glowing dots representing each character
  - Color: Team color (#ff6655, #5599ff, #55ff55, etc.)
  - Size: 2.5px radius
- Camera frustum rectangle (shows viewport)
  - Stroke only, no fill
  - Thickness: 1-2px

### PAUSE OVERLAY (Screen Space)
Appears when [P] is pressed during active gameplay:
```
Background: Dark semi-transparent (#000000 @ 80% opacity)
Covers entire canvas area

Centered Text:
├── "PAUSED" (40px bold monospace) @ center top
├── [Resume] Button @ center
├── [Live Modifiers] Button @ center + 50px
└── [Quit to Menu] Button @ center + 100px
```

---

## LIVE LOK MODIFIERS PANEL - IN-GAME OVERLAY

### Position & Dimensions
```
ABSOLUTE POSITIONING (Screen Space):
├── Top: 10px
├── Right: 10px
├── Width: 260px (Fixed)
├── Max Height: 90vh (Scrollable if needed)
├── Z-Index: 10 (Above game canvas)

Background: rgba(15, 5, 25, 0.95) - Dark semi-transparent
Border: 2px solid #ffd700 (Gold)
Border-Radius: 4px
Box-Shadow: 0 0 20px rgba(255,215,0,0.3) (Glow effect)
```

### Header Section
```
Height: ~45px
Border-Bottom: 1px solid #ffd700
Padding-Bottom: 8px
Margin-Bottom: 15px

Layout: Flex with center alignment
├── Title (center, flex: 1)
│   └── "⚡ LIVE LOK MODS ⚡"
│       Color: #ffaa00 (Orange-gold)
│       Font: Bold 16px monospace
│
└── Close Button (right, position: absolute)
    ├── Text: "X"
    ├── Color: #ff4444 (Red)
    ├── Font: Bold 16px
    └── onClick: Close panel
```

### Configuration Sections

#### Row 1: Time/Score/Speed Inputs (3 columns)
```
Layout: Flex with 3 equal flex: 1 items
Gap: 5px

[1] Time (Seconds)
    Label: "Time (Sec):" (10px)
    Input: Number field
    Background: #000
    Border: 1px solid #442266
    Color: #66aaff
    Default: 120
    
[2] Score Limit
    Label: "Score Lim:" (10px)
    Input: Number field
    Background: #000
    Border: 1px solid #442266
    Color: #66aaff
    Default: 10
    
[3] Fighter Speed (Multiplier)
    Label: "Speed (x):" (10px, Color: #ffaa00)
    Input: Number field (step: 0.1)
    Background: #000
    Border: 1px solid #aa8800
    Color: #ffaa00
    Default: 1.0
    Hover Tooltip: "Fighter Speed Multiplier (x)"
```

#### Row 2: Mode Selection (Dropdown)
```
Label: "Mode:" (12px)
Margin-Bottom: 4px
Select Dropdown:
├── Background: #000
├── Border: 1px solid #442266
├── Color: #66aaff
├── Width: 100%
├── Padding: 4px
├── Options: Timer, Score, Horde, Infection, Unlimited
└── Default: Current gameState.mode
```

#### Row 3: Opponent Selection (Dropdown)
```
Label: "Opponent:" (12px)
Select Dropdown:
├── Options: PvP, Bot, 4-Way FFA
├── Default: Current gameState.opponent
└── [Same styling as Mode]
```

#### Row 4: Modifier Selection (Dropdown)
```
Label: "Modifier:" (12px)
Select Dropdown:
├── Options:
│   ├── None
│   ├── Sudden Death
│   ├── Titans
│   ├── Shrinking Arena
│   ├── Vampire's Kiss (Lifesteal)
│   ├── Necromancy
│   ├── Magnets
│   ├── Repel
│   └── Heavy
├── Default: Current gameState.modifier
└── [Same styling]
```

#### Row 5: Weapon Selection (Dropdown)
```
Label: "Weapons:" (12px)
Select Dropdown:
├── Options: Standard, Roulette, Melee Mash, Ranged (Blaster)
├── Default: Current gameState.weaponStyle
└── [Same styling]
```

#### Row 6: Camera/View Selection (Dropdown)
```
Label: "Camera / View:" (12px)
Select Dropdown:
├── Options:
│   ├── Standard (UI On)
│   ├── Theater (No UI)
│   └── Cinematic (Bars + Auto-Zoom)
├── Default: Current gameState.viewMode
└── [Same styling]
```

#### Row 7: Theme Selection (Dropdown)  **← MOST DETAILED**
```
Label: "Theme:" (12px)
Select Dropdown with OptGroup:

├── STANDARD THEMES
│   ├── Classic
│   ├── Runesite
│   ├── GSix
│   ├── Neon
│   └── GameBoy
│
├── ULTIMATE SKINS
│   ├── Runesite (Ultimate)
│   ├── Gilded (GSix Ult)
│   ├── LokMod (Super)
│   ├── Glitch (Super)
│   └── RGB Chroma
│
└── EXPERIMENTAL
    ├── Comic Book
    ├── Neon Abyss
    ├── Cyberpunk
    ├── Ethereal
    ├── Wasteland
    ├── Monochrome
    ├── The Void
    ├── Celestial
    ├── Overdrive
    ├── Abyss
    ├── Hacker
    ├── Synthwave
    ├── Vampire
    ├── Oceanic
    └── Infernal
```

#### Row 8: Environment Selection (Dropdown)
```
Label: "Environment:" (12px)
Select Dropdown:
├── Options: None, Ice Rink, Black Hole, Lava Floor, Storm, Bouncy, Pac-Man Wrap, Blackout
├── Default: Current gameState.environment
└── Margin-Bottom: 15px
```

#### Section: ✂️ CUT CONTENT & PHYSICS
```
Header: "✂️ CUT CONTENT & PHYSICS" (13px, Color: #ffaa00)
Margin: 10px 0 8px 0

Checkboxes (12px font, Color: #66aaff):
├── ☑ Hand of God (Mouse Grab)
├── ☑ Magnetic AI (Aggro Pull)
├── [Juice Level Select: Juice OFF/NORMAL/SUPER]
├── ☑ Tactical HUD (Minimap)
├── ☑ Motion Trails
├── ☑ Arena Ads
├── ☑ CRT Arcade Filter
├── ☑ VHS Artifacts
├── ☑ Invert Colors
├── ☑ Moon Gravity
├── ☑ Exploding Corpses
├── ☑ Slo-Mo on Kill
└── ☑ Rainbow Blood
```

#### Section: ⚙️ ENGINE OPTS
```
Header: "⚙️ ENGINE OPTS" (13px, Color: #ffaa00)
Margin: 15px 0 8px 0
Border-Top: 1px solid #ffaa00

Options (12px font, Color: #55ff55):
├── [FPS Target: 60 / 120 / 240]
├── ☑ Sprite Caching
├── ☑ Swarm Grid (Spatial Part)
├── ☑ Memory Pooling
├── ☑ Delta-Time Physics
├── ☑ Gravity Particles
├── ☑ Smart Spawning
│
└── ☑ DEV: Show Hitboxes (Color: #ff0000, Padding-Top: 8px, Border-Top: 1px solid #ff0000)
```

#### Section: 🧬 BIRTH (SPAWNER)
```
Header: "🧬 BIRTH (SPAWNER)" (Color: #44ff44)
Margin: 15px 0 10px 0
Padding: 15px top

Layout: Flex with 2 items
├── [1] Kinetic Type Selector (Dropdown)
│   └── Grouped Options:
│       ├── STANDARD KINETICS
│       │   ├── Standard Fighter
│       │   ├── Tank (Heavy & Slow)
│       │   ├── Assassin (Fast & Fragile)
│       │   └── Sniper (Ranged)
│       │
│       └── FANTASY KINETICS
│           ├── Giant (Titan-Class)
│           ├── Shield Kinetic
│           ├── Ninja (Blinks)
│           ├── Mage (Fireballs)
│           ├── Juggernaut (Axe)
│           ├── Ghost (Phases)
│           ├── Null Kinetic  ← Dangerous, rare
│           ├── Necromancer (BOSS)
│           └── Zombie (Team 5)
│
└── [2] SPAWN Button
    ├── Background: #003300 (Dark green)
    ├── Color: #44ff44 (Bright green)
    ├── Border: 1px solid #44ff44
    ├── Font: Bold 11px
    └── Action: Spawns selected kinetic type at arena center
```

#### Section: 💣 ITEM DROPS
```
Header: "💣 ITEM DROPS" (Color: #ff4400)
Margin: 10px 0 5px
Text-Align: Center

Button Grid (Flex, Gap: 5px, Flex-Wrap: wrap):
├── [1] BOMB Button
│   ├── Flex: 1 0 45%
│   ├── Background: #441100 (Dark red-brown)
│   ├── Border: 1px solid #ff4400
│   ├── Color: #ffaa00 (Orange)
│   └── Action: Spawn bomb at arena center (3s timer, 150px radius)
│
├── [2] BLACKHOLE Button
│   └── [Same styling] - Spawn vacuum at center
│
├── [3] MEDKIT Button
│   └── [Same styling] - Health restore drops
│
├── [4] FREEZE Button
│   └── [Same styling] - Stun effect zone
│
└── [5] NUKE Button
    └── [Same styling] - Large explosion (300px radius, 3s timer)
```

#### Section: ⚡ MIRACLES
```
Header: "⚡ MIRACLES" (Color: #5599ff)
Margin: 10px 0 5px

Layout: Flex with 2 dropdowns
├── [1] Action Select (Dropdown)
│   ├── Smite (Kill)
│   ├── Heal (Max HP)
│   ├── Freeze (Stun)
│   ├── Enrage (Speed)
│   ├── Mutate (Weapon)
│   ├── Infect (Zombie)
│   └── Ascend (Giant)
│   └── Styling: Color #5599ff, Flex: 1
│
└── [2] Target Select (Dropdown)
    ├── Team 1, Team 2, Team 3, Team 4
    ├── Team 5 (Zombies)
    └── All Teams
    └── Styling: Color #5599ff, Flex: 1

Execute Button:
├── Width: 100%
├── Padding: 8px
├── Background: #001133 (Dark blue)
├── Color: #5599ff (Light blue)
├── Border: 1px solid #5599ff
├── Font: Bold 12px
└── Margin-Bottom: 15px
```

#### Section: 🌌 BACKGROUND & GRID
```
Header: "🌌 BACKGROUND & GRID" (Color: #ff44aa)
Margin: 15px 0 5px
Text-Align: Center

Checkboxes (12px, Color: #ffaaee):
├── ☑ Parallax Grid (Camera Link)
└── ☑ Reactive Grid (Jiggle)
```

### Scrolling
- Max-Height: 90vh
- Overflow-Y: auto
- Scroll when content exceeds viewport

### Panel Appearance Summary
- **Width**: 260px (right panel)
- **Position**: Fixed, Top 10px, Right 10px
- **Theme Color**: Dark teal/purple with gold borders
- **Glow**: Golden shadow for depth
- **Font**: Monospace throughout
- **Organization**: Clear sections with headers
- **Interactivity**: All inputs immediately update game state

### Interaction Flow
```
User opens [M] key during gameplay
    ↓
Panel slides/appears at top-right with glow effect
    ↓
User modifies any setting in real-time
    ↓
Game state updates immediately (no "Apply" button needed)
    ↓
Changes take effect instantly
    ↓
User closes with X button
    ↓
Panel disappears, game continues with new settings
```

---

## Original Game Code Reference - KineticSouls.tsx

This is the original game implementation code. Use this as a **CODE REFERENCE** to understand the game mechanics, character types, game modes, themes, and visual effects during visual design rebuilding.

**Key sections in the code:**
- **Game Constants** (ARENA_W, ARENA_H, CHAR_RADIUS, etc.) - Define arena dimensions
- **Type Definitions** - GameMode, OpponentMode, ThemeMode, KineticType, etc.
- **Spawn System** - `spawnCharacter()` - Create fighters with types and weapons
- **Theme Color System** - `getTeamColor()` - All 20+ theme color definitions
- **Weapon System** - `drawWeapon()` - All 12 weapon visual styles
- **Game Loop** - Core physics, collision, rendering, and state management
- **Menu Rendering** - All menu screen implementations (Main, Settings, LoK, Game Over)
- **Special Features** - Live modifiers, filters, visual juice, particle effects

**Do not copy this code directly.** Instead:
1. Reference character types and their properties
2. Check theme colors and styling
3. Verify game modes and rules
4. Understand visual effect implementations
5. Check button layout and UI positioning

```typescript
import { useEffect, useRef, useCallback, useState } from "react";

const ARENA_W = 900;
const ARENA_H = 560;
const CHAR_RADIUS = 14;
const MAX_HP = 20;
const SPAWN_SPEED = 2.8;
const BOT_MIN_INTERVAL = 2000;
const BOT_MAX_INTERVAL = 4000;
const SCOREBOARD_H = 60;
const GRID_CELL_SIZE = 60;

const SPLASH_ARCHIVE = [
  "THEEEee ULtimatee everything-everywhere-all-at-once auto-battler?",
  "Why choose a variant when you can build the ULTIMATE?",
  "🦉 Lok: Focus on what matters.",
  "💰 COIN MODE: Greed is a weapon.",
  "GSix: Gilded Protocol - Authorized.",
  "Br/kn State: THE SOUL OF THE MACHINE.",
  "4-Tone Puke: Pure Retro DMG.",
  "Everything-Everywhere-All-At-Once.",
  "Liquidate the System.",
  "Welcome back, Eric.",
  "Welcome back, Cante.",
  "Welcome back, Miss N.",
  "Welcome back, Sire.",
  "Must build additional pylons.",
  "The only way to win is to not lose.",
  "The only way to lose is to not win.",
  "The only way to tie is to not win or lose.",
  "Howa bout a pickle you nasty",
  "W.O.W Service Initiated",
  "W.O.W Service Terminated",
  "Have you seen Moka?",
  "I love you Tan-Moka",
  "MCallie Named her BumbleBee...",
  "It's okay to be sad and happy, it grows you ^^",
  "I like saying hungry hungry hippo but I don't mean to offend",
  "Hey Hey Hey... Don't be so rough <3",
  "Hello World!",
  "Ima Cookie MOnster",
  "Youa Cookie?",
  "You're a good person, I like you",
  "I'm a good person, I like you",
  "Arena Smash Bro's",
  "Ultimate Arena Smash Bro's",
  "Yum Yum Get in my tum",
];

type GameMode = "timer" | "score" | "horde" | "infection" | "unlimited";
type OpponentMode = "pvp" | "bot" | "ffa";
type ThemeMode =
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
  | "rgb_cycle";
type LokModifier =
  | "none"
  | "sudden_death"
  | "titans"
  | "shrinking_arena"
  | "vampire_kiss"
  | "necromancy"
  | "magnet"
  | "repel"
  | "heavy";
type CameraMode = "static" | "dynamic" | "action" | "enhanced";
type ViewMode = "standard" | "theater" | "cinematic";
type WeaponStyle = "standard" | "roulette" | "melee_mash" | "ranged_test";
type Environment =
  | "none"
  | "ice"
  | "blackhole"
  | "lava"
  | "storm"
  | "bouncy"
  | "wrap"
  | "blackout";
type ScreenState = "menu" | "lok_menu" | "settings_menu" | "game" | "over";
type WeaponType =
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
  | "fireball";
type JuiceLevel = "off" | "normal" | "super";
type KineticType =
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
  | "juggernaut";

// [Full component implementation omitted for reference save]
// See artifacts/kinetic-souls/src/KineticSouls.tsx for complete code

export default function KineticSouls() {
  // Main React component with canvas-based game loop
  // Handles all game state, rendering, input, and live modifier menus
}
```

---

## CODE-TO-VISUAL MAPPING GUIDE

### Function Reference Map

This section maps key code functions to the visual elements they create:

#### **Screen Rendering Functions**
| Function | Purpose | Visual Output | Images |
|----------|---------|----------------|--------|
| `gameLoop()` | Main animation frame loop, called recursively by requestAnimationFrame | Complete game canvas rendering, character animation, physics updates | 10, 11 |
| `drawMainMenu()` | Renders the main menu screen | Main menu with title, buttons, splash text | 01, 03 |
| `drawLokMenu()` | Renders full LoK Modifiers selection menu | Full modifier menu screen with all options | 03, 08 |
| `drawSettingsMenu()` | Renders menu settings (background, drift, particles, CRT) | Settings menu screen | [Not in primary images] |
| `drawGameOver()` | Renders game over screen with winner and stats | Game over screen with scores | [Derivative of 10] |
| `drawAnimatedBackground()` | Renders animated menu background with grid and particles | Menu background effects | 01 |

#### **Character & Combat Rendering**
| Function | Purpose | Visual Output | Images |
|----------|---------|----------------|--------|
| `renderChar()` | Renders individual character at world position with rotation | [See image 10] Single character sprite | 10, 11 |
| `drawRawChar()` | Draws character body parts, skin colors, weapons | Character visual design | 09, 10, 11 |
| `drawWeapon()` | Renders 12 different weapon types | Individual weapon visuals | 10, 11 |
| `drawHpBar()` | Renders health bar above each character | HP bar (green/yellow/red) | 10, 11 |
| `drawGhost()` | Renders death score floater (ghost sprite) | Ghost floating upward | 10, 11 |
| `drawOSRSplat()` | Renders OSRS-style damage splat text | Splattered damage numbers | 11 |

#### **Colorization & Theming**
| Function | Purpose | Visual Output | Images |
|----------|---------|----------------|--------|
| `getTeamColor()` | Returns team color based on theme and type | Character/UI team coloring | 09 (shows Runesite colors) |
| Background color logic | Sets `bgColor` based on `state.theme` | Arena background hue | 09 (brown Runesite vs. blue classic) |
| `gridColor` assignment | Sets grid line color per theme | Grid visual style | 09, 10 |

#### **UI & HUD Elements**
| Function/Section | Purpose | Visual Output | Images |
|----------|---------|----------------|--------|
| Scoreboard rendering (lines ~1900-1950) | Renders top bar with scores, time, modifier info | Scoreboard with scores `P1/P2`, timer, director points | 10 |
| Minimap rendering (lines ~1880-1925) | Renders tactical HUD in bottom-right | Bottom-right minimap with dots | 10 |
| Kill feed (lines ~1865-1880) | Renders kill messages on right side | Kill feed text (animated, fades out) | 10 |
| Pause overlay (lines ~1950-1980) | Renders pause menu with buttons | Pause screen overlay | [Context screenshot] |

#### **Particle & Effect Systems**
| Function | Purpose | Visual Output | Images |
|----------|---------|----------------|--------|
| `pushParticle()` | Adds particle to pool with color/velocity/lifetime | Particle spawned | 11 (visible as burst trails) |
| `spawnExplosion()` | Creates burst of 15 particles around point | Explosion effect at character death | 11 |
| `triggerExplosion()` | Larger explosion with physics damage to characters | Area-of-effect explosion | 11 |
| `drawOSRSplat()` | Renders damage text in splat shape | Damage splats on screen | 11 |

#### **Physics & Collision Systems**
| Section | Purpose | Visual Impact | Images |
|----------|---------|----------------|--------|
| `processCollision()` | Handles character collision detection | Character pushback visual | 11 (dense fighters pushing) |
| Environment physics | Ice friction, blackhole pull, lava damage | Environment-specific movement | [Varies per env] |
| Spawn system in `gameLoop()` | Character spawning with bot timing | Characters appearing at edges | 11 |

#### **Live Modifier Panel**
| Element | Code Location | Visual Output | Images |
|----------|---------|----------------|--------|
| Panel Container | `showLiveMenu && (<div style={{...}}>` | Right-side overlay panel | 02, 06 |
| Mode Dropdown | `<select defaultValue={stateRef.current.mode}>` | Mode selector with options | 06 |
| Theme Dropdown | `<select ... value={stateRef.current.theme}>` | Theme selector with optgroups | 06, 09 |
| Environment Dropdown | `<select ... value={stateRef.current.environment}>` | Environment selector | 07 |
| Kinetic Birth Section | `<button onClick={() => spawnCharacter(...)}>` | Spawn button + type selector | 06 |
| Miracle Execute | `<button onClick={() => {...for (c of chars)...}}>` | Execute miracle button | 06 |
| Engine Options | Checkboxes for `optCache`, `optGrid`, `optPool` | Performance toggle visual | 06 |

---

### Visual Element to Code Function Quick Reference

**Want to find the code for visual element X? Use this:**

- **Character appearance** → `drawRawChar()` + `getTeamColor()`
- **Theme colors** → `getTeamColor()` (switch statement by theme)
- **Weapons** → `drawWeapon()` function
- **HP bars** → `drawHpBar()` function
- **Main menu** → `drawMainMenu()` function  
- **LoK modifiers menu** → `drawLokMenu()` function
- **Live modifier panel** → JSX state hook with `showLiveMenu`
- **Particles/explosions** → `spawnExplosion()`, `triggerExplosion()`, `pushParticle()`
- **Scoreboards/HUD** → Lines 1900-1950 in `gameLoop()`
- **Minimap** → Lines 1880-1925 in `gameLoop()`
- **Game over screen** → `drawGameOver()` function
- **Camera effects** → `camRef.current` updates in `gameLoop()`
- **Pause menu** → Lines 1950-1980 in `gameLoop()`, button layout
- **Environment effects** → Search `state.environment ===` in `gameLoop()`
- **Theme switching** → Each rendering function checks `state.theme` with if/else chains

---

### Image-to-Code Mapping

| Image File | Visual Content | Primary Functions | State Variables |
|-----------|--------|-----------|---------|
| 01_main_menu.png | Main menu screen | `drawMainMenu()` | `screenRef = "menu"` |
| 02_lok_mods_panel.png | Live modifier panel | JSX overlay | `showLiveMenu = true` |
| 03_lok_modifiers_menu.png | Full modifier menu | `drawLokMenu()` | `screenRef = "lok_menu"` |
| 04_bestiary.png | Character reference | `spawnCharacter()` types | `KineticType` enum |
| 05_horde_gameplay.png | Horde mode battle | `gameLoop()` full render | `state.mode = "horde"` |
| 06_live_mods_expanded.png | Panel with all controls | JSX dropdowns/inputs | `showLiveMenu = true` |
| 07_environment_dropdown.png | Environment selector | Environment dropdown | `Environment` type options |
| 08_lok_modifiers_screen.png | Full mod menu buttons | `drawLokMenu()` buttons | `drawBtn()` calls |
| 09_runesite_gameplay.png | Themed battle | `getTeamColor("runesite")` | `state.theme = "runesite"` |
| 10_standard_gameplay.png | Mid-battle scene | `gameLoop()` complete | `screenRef = "game"`, `state.running = true` |
| 11_dense_battle.png | High fighter count | Particle system active | `state.juice = "super"`, many `spawnExplosion()` calls |

---

### Implementation Checklist for Gemini

When implementing visuals based on images, verify you have:

- [ ] **drawMainMenu()** - Title font, button positions, splash text colors
- [ ] **drawLokMenu()** - Button grid layout (rows at y=110, 175, 210, 290, 355, 420, 485)
- [ ] **Live panel width** - 260px fixed width, scrollable content
- [ ] **Character sprites** - `BASE_PARTS` dimensions, color scheme per theme
- [ ] **Weapon rendering** - 12 weapon types in `drawWeapon()`
- [ ] **HP bar positioning** - Above character at `c.y - CHAR_RADIUS * c.scale - 15 * c.scale`
- [ ] **Scoreboard layout** - P1 at x=140, Center at x=450, P2 at x=760
- [ ] **Minimap bounds** - (780, 520) to (900, 600), 120×80px
- [ ] **Pause overlay** - Semi-transparent black background, centered buttons
- [ ] **Environment effects** - Blackhole, Lava, Storm, etc. visuals
- [ ] **Particle colors** - Theme-aware in `spawnExplosion()` call

**Reference this code when:**
- Verifying visual asset requirements
- Understanding game mechanic implementations
- Checking theme-specific styling
- Validating character types and properties
- Implementing UI elements and menu layouts
- Building particle effects and visual feedback systems
- Mapping screenshots to code functions


# KINETIC SOULS - OFFICIAL GAME MANUAL

Welcome to the comprehensive logic, stats, and feature guide for **Kinetic Souls**. This document outlines the inner workings of every micro-system, gameplay loop, and interactive mechanic in the game. 

Use this document as a reference for balancing, modding, or generating player-facing PDF instructions.

---

## 1. CORE PHYSICS & COMBAT LOGIC
Kinetic Souls is entirely driven by a custom 2D physics engine running on a delta-time loop. Combat is not animated; it is a direct result of velocity and mass.

*   **Movement Loop:** `velocity = velocity * drag + gravity`. Characters move based on their `vx` and `vy` values.
*   **Collision Detection:** Uses circle-to-circle overlap checks via the `processCollision` system.
*   **Damage Calculation:** Damage is calculated dynamically based on the **Relative Velocity (Dot Product)** of two colliding kinetics. 
    *   *Formula:* `Damage = Base Part Multiplier * (Relative Impact Force * 0.5)`
    *   *Cap:* The physics engine caps collision impact multipliers at `6x` to prevent infinite velocity explosions.
*   **Stun & Hit Pause:** High-velocity hits trigger "Juice" (Screen shake and frames of hit-pause) and apply `stunTime`, disabling a kinetic's AI steering momentarily so they bounce realistically.

---

## 2. THE KINETICS (Entities & Stats)
Every Kinetic spawned in the arena operates on baseline stats that dictate how they interact with the physics engine.

### Standard Kinetics
*   **Kinetic Standard:** Balanced AI. `HP: 20` | `Speed: Normal` | `Mass: 1.0`
*   **Iron Tank:** Heavy mass, resists knockback. `HP: 40` | `Speed: Slow` | `Mass: 1.5`
*   **Shadow Assassin:** Extreme AI steering, paper health. `HP: 10` | `Speed: Very Fast`
*   **Horizon Sniper:** Maintains distance from targets. `HP: 20`
*   **Bastion Guard:** Spawns with regenerative shielding. `HP: 20 + 15 Shield`
*   **Revenant Husk (Zombie):** Swarm units that die instantly. `HP: 1`

### Boss Entities (Massive impact, High HP)
*   **Titan Behemoth:** Massive scale and damage multipliers. `HP: 80+` | `Speed: Very Slow`
*   **The Juggernaut:** Cannot be stunned easily. Walls bounce off it. `HP: 60+`
*   **LoK Caster (Mage):** Fires AoE energy. `HP: 30+`
*   **Vampire Lord:** Regains 50% of the health it deals as damage. Orbiting bats. `HP: 50+`
*   **NULL Entity:** Immovable object. Extreme Mass. `HP: 30+`

---

## 3. THE SABRE SYSTEM (Weapons & Status)
Weapons in Kinetic Souls are deeply integrated into the physics engine.

*   **The Hilt Hitbox:** Every Kinetic has a "head" part acting as the hilt of their weapon. 
*   **The Break (Null Status):** If a Kinetic's head takes a direct hit, there is a **14% chance** their Sabre breaks off. The Kinetic becomes disarmed ("Null") and cannot deal weapon damage for 4 to 14 seconds until it regenerates.
*   **Loose Sabres:** The broken weapon becomes a volatile physics object that bounces around the arena, capable of dealing 5 damage to anyone it slices.
*   **Br/Kn Sabres:** When a Sabre breaks, there is a secondary **14% chance** it becomes a legendary Br/Kn (Broken) Sabre with elemental effects:
    *   🔥 **Fire:** Leaves a trail of plasma, triggers 80px explosions on impact.
    *   ❄️ **Frost:** Instantly freezes targets (`stunTime = 3000ms`).
    *   🌌 **Vortex:** Rips open a mini black hole on impact, sucking in nearby kinetics.

---

## 4. GAME MODES & PACING
The game utilizes varied win-conditions to keep the sandbox fresh.

*   **⏱ Timer:** Highest score when the clock hits 0:00 wins.
*   **🏆 Score Limit:** First team to reach the target kill count (e.g., 10, 50) wins.
*   **♾ Unlimited:** No timer, no score limit. Pure sandbox testing.
*   **🧟 Horde:** You control P1. Survive until 50 kills while the game spawns aggressive Zombie and Boss waves.
*   **🦠 Infection:** Starts with 1 Infected vs 15 Survivors. Anyone killed by the infected switches to the infected team.

---

## 5. THE DIRECTOR & LOK MODIFIERS
The player acts as "The Director," able to manipulate the simulation in real-time using the Live Modifier Panel (`[M]` key).

### Live Modifiers
*   **Sudden Death:** All kinetics have 1 HP.
*   **Shrinking Arena:** A red border slowly closes in; kinetics touching it take continuous damage.
*   **Necromancy:** Every killed kinetic instantly respawns as a hostile Zombie.
*   **Vampire's Kiss:** Kinetics heal 2 HP on every successful hit.
*   **LoK Bounty:** High-value golden targets spawn randomly. Killing them grants extreme points and LoK coins.

### Director Miracles (God Actions)
The player can execute explicit scripts to instantly alter targets in the arena:
*   **Smite:** Instantly kills targeted team.
*   **Heal / Revive:** Restores targeted team to Max HP or brings dead kinetics back to life.
*   **Freeze:** Halts momentum and applies 3 seconds of stun to targets.
*   **Enrage:** Multiplies targeted kinetics' velocity by 3x.
*   **Infect:** Converts targeted kinetics into Zombies on Team 5.
*   **Ascend:** Increases scale by 1.3x, restores HP, and converts targets into Bosses.

---

## 6. ENVIRONMENTS & CAMERA SYSTEMS
*   **Environments:** Modify the physical boundaries.
    *   *Ice Rink:* Friction is removed.
    *   *Bouncy Walls:* Wall restitution increased from 0.82 to 1.05.
    *   *Wraparound:* Touching the edge of the screen teleports the kinetic to the opposite side.
    *   *Lava Floor:* The bottom 18px of the screen applies continuous damage over time.
*   **Cameras:**
    *   *Dynamic:* Zooms and pans to frame the bounding box of all living kinetics.
    *   *Focus:* Locks onto a single targeted kinetic (controlled via Arrow Keys).

---

## 7. ECONOMY (LoK Coins & The Passport)
*   **Earning Rates:** 
    *   Standard Kill: +1 LoK Coin
    *   Boss Kill: +25 LoK Coins
    *   Heavy Hit (High Velocity): +1 LoK Coin
*   **LoK Passport:** Tracks global currency. Allows the unlocking of premium Themes (e.g., Gilded, Runesight), Modifiers (e.g., Moon Gravity), and exclusive Bestiary skins.

---

## 8. SANDBOX CUSTOMIZATION (The Ultimate Sandbox)
Kinetic Souls is designed around extreme modularity. These options can be tweaked in real-time via the Live Modifier Menu:

### Physics & Collision Modes
*   **Standard:** Normal circle-to-circle physics with mass-based resolution.
*   **Phantoms:** Kinetics phase through each other without transferring momentum (originally a bug, now a feature).
*   **Super Bouncy:** Greatly increases collision restitution (1.8x).
*   **Lead Weights:** Massive dampening on impact (0.2x restitution), making kinetics feel extremely heavy.
*   **Trick Shots:** Enable this feature to apply Magnus Effect curveballs to thrown kinetics based on angular momentum! (Spin them with your mouse).
    *   *Future Integration:* Landing successful trickshots will soon trigger major sandbox bonuses (e.g., speed ups, 3x missiles shooting out on contact, and adding beneficial status effects to targeted kinetics).

### Visual UI Customization
*   **HP Bar Styles:** 
    *   *Standard:* Classic floating bar. *Thick:* High-visibility chunky bar. *Segmented:* Retro notches. *Hidden:* UI disabled.
*   **Floating Text Styles:** 
    *   *Standard:* Clean monospace. *Comic Book:* Tilted, bold outline text. *Neon Glow:* Bright text with heavy shadow blur. *Hidden:* Disables floating numbers.

### Alternate Simulation Modes
*   **Screensaver Mode:** Disables all AI steering, combat hits, and gravity. Sets drag to 1.0 (zero friction) and wall bounce to 1.0 (perfect elasticity). Kinetics bounce forever like a DVD logo.

---

## 9. USER INTERFACE & MENUS (`DrawUI.ts`)
The entire user interface is dynamically rendered onto the Canvas 2D context to support extreme visual customization and post-processing filters (like CRT and VHS effects).

*   **Theme Backgrounds:** The `drawThemeBackground()` system clears and paints the screen with animated, thematic elements (e.g., floating matrix numbers, synthwave suns) based on the active `ThemeMode`.
*   **Main Menu (Classic & Modern):** The `drawMainMenu()` function dynamically swaps between the classic 2000s web-game layout and the sleek, centered modern layout based on the `classicMenu` setting.
*   **Lok Modifiers & Settings:** The `drawLokMenu()` and `drawSettingsMenu()` functions map the game's state configurations to interactable grid layouts. They natively support mouse interactions and vertical scrolling via `scrollY` offsets.
*   **Bestiary Encyclopedia:** `drawBestiary()` iterates through `BESTIARY_ENTRIES` to render lore, stats, and live, scaled representations of character/weapon combinations onto individual cards.

---

## 10. BUILD SYSTEM & ELECTRON INTEGRATION (`vite.config.ts`)
Kinetic Souls is compiled using Vite and wrapped as a desktop application using Electron.

*   **Relative Pathing (`base: './'`):** Because Electron loads local files via the `file://` protocol, Vite's default absolute asset paths (e.g., `/assets/main.js`) will result in 404 errors (The "Blank Screen of Death"). The `vite.config.ts` is explicitly set to use relative paths to guarantee compatibility between the web server and the Electron desktop wrapper.
*   **Plugins:** Utilizes `@vitejs/plugin-react` to enable modern JSX parsing and hot-module replacement (HMR) during active development.

---

## 11. MOBILE & TOUCH CONTROLS
Kinetic Souls provides 1:1 parity between desktop mouse clicks and mobile touch interactions via the DOM's `TouchEvent` API, dynamically scaling the canvas coordinates.

### Touch Interactions
*   **Basic Spawning:** Tapping the left half of the arena spawns a P1 character, while tapping the right half spawns a P2 character.
*   **Hand of God (Drag & Drop):** If `handOfGod` is enabled in the settings, tapping and dragging any kinetic intercepts the physics loop, letting the user "toss" the entity using natural swipe momentum.
*   **God Actions on Mobile:** The Live Mobile UI provides toggleable buttons (Lock, Pen, Puppet) that override default taps:
    *   *Lock:* Drag a box with your finger to capture and freeze kinetic energy.
    *   *Pen:* Draw solid physics barriers directly onto the canvas.
    *   *Puppet:* Hook a kinetic with an invisible spring and whip it around using your finger's path.

### Mobile Overlay UI & Quick Access Sidebar
Accessible via the pill-shaped HUD at the top right, this touch-friendly overlay replaces keyboard shortcuts, granting instant access to Team Spawning, Miracles, the LoK Modifiers Sidebar, and Game Pausing without interfering with the arena's touch detection. 

To guarantee full mobile accessibility to the most critical sandbox features, a persistent **Quick Access Sidebar** is anchored to the left edge of the screen. It features a massive "⚙️ LOK MODS" toggle button and a "THEME" vertical scroller to instantly cycle through aesthetics.

### Landscape Enforcement
Because the core physics engine calculates a rigid 900x560 2D coordinate grid, holding a device in portrait mode squishes the canvas to unplayable dimensions. Kinetic Souls dynamically listens to the `window.resize` bounds; if `innerHeight > innerWidth`, the game deploys a frosted-glass overlay prompting the user to rotate their device.

### PWA (Progressive Web App) Installation
Kinetic Souls is fully equipped to be installed directly to an iOS or Android home screen, bypassing App Stores. The React application listens for the `beforeinstallprompt` browser event. If triggered, a shiny **"📲 INSTALL APP"** button populates the top-right HUD. 

*To activate this capability, ensure the `/public/` directory contains a standard `manifest.json` linked inside your `index.html` file:*

```json
{
  "name": "Kinetic Souls",
  "short_name": "K.Souls",
  "start_url": ".",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#080814",
  "theme_color": "#ffd700",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```
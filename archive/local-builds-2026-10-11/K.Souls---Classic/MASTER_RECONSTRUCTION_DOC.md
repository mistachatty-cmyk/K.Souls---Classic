# KINETIC SOULS: Master Reconstruction Document

**Core Concept:** 1v1 cross-platform sandbox arena fighter (inspired by Interactive Buddy/2000s flash games) featuring automated fighters with heavy user interaction, physics manipulation, and ecosystem integration.
**Repository:** mistachatty-cmyk/K.Souls---Classic

## 0. Core Game Philosophy: The Ultimate Sandbox
* **Everything is Optional:** Kinetic Souls is the ultimate sandbox interactive game. Every aspect—from the intro screen, background simulation, menus, in-game UI, game modifiers, end-game screen, scoreboards, to final action reports—must be highly customizable.
* **Bugs into Features:** If a fun or interesting bug occurs (e.g., collision phasing), do not just delete it—convert it into a toggleable feature that players can enable.
* **Modular Additions:** Whenever a new visual change, gameplay tweak, or feature is created, ALWAYS expose it as a toggle or dropdown option in the Lok Live Game Modifier or Settings menus. Never permanently overwrite existing styles if they can be preserved as an option to maximize player usability and fun.

---

## 1. Entities & The Bestiary System
**Goal:** Rebuild the entity logic and the UI that catalogs them.

*   **Bestiary UI Fixes:**
    *   Ensure Bestiary is accessible on the Main Menu and displays correctly in Classic Mode.
    *   Add proper sprite resizing and scaling for all Bestiary cards.
    *   Implement toggleable VFX options around sprites at the top of the Bestiary screen.
    *   Add a dedicated "Lok's Bestiary" section.
*   **Minions Category:**
    *   Add Vampiric Bats: Health is exactly 1/3 of an average Kinetic.
*   **Bosses Category:**
    *   Add Vampire Lord: Spawns with 7 Vampiric bats orbiting it. Passive Ability: Regains 50% of the health from any damage it deals to the player/Kinetics.
*   **Equipment & Status Entities (Sabres):**
    *   **Mechanics:** Sabres protrude from a Kinetic's head, connected by a Hilt (which has its own strict collision box).
    *   **Hilt Collision Logic:** Striking the Hilt collision box has a 14% chance to break the Sabre off.
    *   **Status Effects:** When a Sabre breaks, the Kinetic gains the Null status effect (also implement a general Knocked Out status).
    *   **Br/Kn Sabres:** A broken Sabre has a 14% chance to transform into an ultimate "Br/Kn Sabre".
    *   **UI:** Give Sabres and Br/Kn Sabres their own dedicated Bestiary categories. Ensure higher-tier Kinetics/items generate significantly more VFX.

## 2. UI, Menus, & Settings Overhaul
**Goal:** Fix rendering overlaps and build a scalable, beautiful UI.

*   **Global Settings Fixes:**
    *   Critical Fix: Resolve the root pixel overlap and collision issue causing buttons to misfire or click each other. Reconnect all button logic cleanly.
    *   Beautify the Settings menu and separate it into clean Categories.
    *   Implement a Summary Box: Hovering over any menu option (including the in-game modifier) outlines the box and displays a description/summary.
    *   **Customization Toggles:** Everything must be optional.
        *   **Menu Particles:** Cycle between `original` (falling pixels), `new` (vertical energy lines), `sparkle`, `snow`, and `none`.
        *   **Title Styles:** Cycle the main menu logo between `standard`, `advanced`, `neon`, `retro`, `glitch`, `minimal`, and `pixel`.
        *   **Title Circles:** Toggleable fluctuating ambient rings behind the main menu title.
        *   **Menu Pulse & Drift:** Toggleable background camera drifting and rhythmic UI pulsating.
*   **Main Menu Updates:**
    *   Create a "Classic Alternate" main menu featuring new VFX options.
    *   Add a new "Game Mode" menu option to house extra modes.
*   **In-Game UI:**
    *   Minimap: Allow placement in all 9 screen anchors, plus a dead-center option via the Live Game Modifier. Add an optional floating, glowing "Minimap" title text above it.
    *   Camera/Ads: Fix camera functionality so dynamic border ads stay connected and don't break on camera shifts. Thicken the ad banner ("chunkier") and space out the sponsor text properly. Update with sponsor events/themes.
    *   Background: Add a toggleable Background Title option in-game.
    *   Death Notifications: Add as a toggleable option.

## 3. The "Lok" Ecosystem & Economy
**Goal:** Integrate the Lok Operator (Owl mascot) and the meta-progression systems.

*   **Lok Game Modifier Menu (In-Game):**
    *   Theme: Connecting to Lok triggers a border VFX effect indicating "Online" status and shifts the modifier menu to a Lok-specific theme.
    *   UX: Menu must be scrollable (or use arrows), acknowledge interactions, and be dockable strictly to the Left or Right of the screen so it doesn't cut off gameplay.
    *   Tiers: Add UI tiers for DMG, Br/Kn, Runesight, Lok, etc.
    *   Tabs: Add a dedicated "Events" tab.
*   **Progression & Economy:**
    *   Lok Coins: Base rate is 1 kill = 1+ Lok Coin (different Kinetics yield different bounties). Create multiple avenues to earn coins.
    *   Purchasing: Coins unlock sandbox options, modifiers, and features.
    *   Lok Passport / Lok Pass: Integrate functionality for premium/ecosystem unlocks and inventory management.

## 4. Gameplay Mechanics & Interaction
**Goal:** Expand how the player interacts with the sandbox physics.

*   **Operator Attacks (Touch/Mouse Controls):**
    *   [X] Implement grabbing, spinning, and throwing Kinetics to play with physics and velocity. Touch event logic natively maps to `handOfGod`, allowing mobile drag-and-drop tossing.
    *   [X] God Actions (Architect Pen, Area Lock, Marionette) map perfectly to both mouse events and iOS/Android touch events.
    *   [X] Implement sleek Mobile HUD with "Live LoK Mods" quick-access, Landscape-orientation locks, and PWA (Install to Homescreen) integration.
    *   [X] **Persistent Quick Access Sidebar:** Added an always-visible floating left-sidebar to guarantee mobile accessibility to the LoK Modifiers menu and instant Theme cycling.
    *   [X] Trick Shots: Enable in Settings. Dragging a Kinetic in circles builds up angular momentum (spin). When thrown, the spin generates a Magnus force, causing the Kinetic to curve through the air like a Pokémon Go curveball!
    *   **Future Trickshot Upgrades (Planned):** Add major bonuses when landing a trickshot (e.g., global speed ups, firing 3 missiles on contact, applying positive buffs, and status effects).
    *   Special Shots: Add an unlockable "Triple Shot" (fires 3 Kinetics at once) and "Focus Shot".
*   **VFX & Death Physics:**
    *   Add "Chill Explosions" as an alternative to chaotic death explosions.
    *   Add Fruit Ninja effects and playstyle options.
    *   Add Lenovo Touch effects.
*   **Game Modes & Pacing:**
    *   Calm/Chill Mode: Kinetics disable combat/chaos to just float, bounce, and sit using basic physics for a relaxing viewing experience.
    *   Focus Mode: Allow left-to-right scrolling through individual Kinetics.
    *   KINETICSOULSXXL (Alpha): A massive mode where the map scales up 10x for massive unit counts and chaos.
    *   Invert Mode: An unlockable overhaul option (add an in-game doc reminder that this is earned by playing through levels).
*   **End-of-Game Stats:**
    *   Track and display velocity, motion, and custom user-built stats.
    *   Specifically add "Highest Velocity Kill" to the endgame screen.

## 5. Future Scope & Integrations
**Goal:** Long-term features to keep in mind so the architecture supports them.

*   **Media Player Integration:** Plan UI space (bottom middle) for an MP3/Video player supporting Spotify, Apple Music, SoundCloud, Bandlab, YouTube, and raw URLs.
*   **Social & Twitch:** Integrate a Twitch connection button for stream interactions.
*   **Educational/Party Modes:** Add a typing-game mode (typing words/sentences fast spawns enemies against the opposing team) suited for schools/parties.
*   **Collectibles:** Build out a framework for tracking in-game collectible items.
*   **Cinematics:** Upgrade the current Theater/Cinematic mode.




## 6 Raw Message tha created this info:

Kinetic souls Notes


I love this! CHange Necromancy to have zombie to spawn on Narrator: Fantasy



Lets add four directors 2 the game that narrate or effect the game. Manually or on purpose. Each director. HAving a personality theme and style limiting them to certain modifications on the game. From bosses, to nights out where they turn the screen black. and when it's back on  there's a random drop on screen

Please make the live lok menu turn off after each match. ALso please make it draggable

Please make a optional test version of it.



Make 1 test version that makes it transparent background or makes it so that you can see the game while playing it.

Please create another version that has the menu  under the score board for easy acess thinkof mutliple intuitive ways to hadle it then offer them as options to show me.



Treat drops differnt in the menu. Make them all isntantly clickable  like the bombs



Add super bomb, add medium bomb. Add healer bomb, addsemtex bomb that explodes after 6 seoconds. with a chance to not go off. ALso give it a chance to have a delayed explosion up to 12 more seconds after 6 seconds. exploding at any time after that. if it hasn't exploded by the end of the duration it will either explode, become a dud or continue the cycle. every time it completes a cycles theres a 20% decrease in the chance it will explode until zero.



MAke themes based on holidays and other games please, please make sponsor themese as well.



Keep the current bosses but make them the version you mentioned and make them more speical and name them boss's in the menu. The origianl one's you made should simply be special variants of  normal kinetics.



Can you fix that dotted line and backround? i keep asking and they are simply not aligned there missed alighned! 



Also add touch features on both sides for both teams. make everything intuitive and efficent. also be creative and smart



Lets prototype the beastiary to give a description of all kinetics

Add a snake event - Plan this out and lets come up with ideas. I imagin this being like the class ic snake games

Make , "Classic Customs" a customizer to idnivisually cutsomize what your  kinetic team looks like.

Generate a few customizations

Also Add slight show environment, Add freeze, 


Add a function  so that the dotted bar in the middle of the maps can be directly tied to events called 




KMW Cache, FLash storage,  K&V quantum cache - context limits, turbo qunat , paige cashe



How can I implement the actual "passport.username" into the GameState so the scoreboard reflects my real user name?
Can we add a new unique KineticType modifier to the game loop?


## 7 Original Master Prompt:
KINETIC SOULS: Master Reconstruction Document
Core Concept: 1v1 cross-platform sandbox arena fighter (inspired by Interactive Buddy/2000s flash games) featuring automated fighters with heavy user interaction, physics manipulation, and ecosystem integration.
Repository: mistachatty-cmyk/K.Souls---Classic

1. Entities & The Bestiary System
Goal: Rebuild the entity logic and the UI that catalogs them.

Bestiary UI Fixes:

Ensure Bestiary is accessible on the Main Menu and displays correctly in Classic Mode.

Add proper sprite resizing and scaling for all Bestiary cards.

Implement toggleable VFX options around sprites at the top of the Bestiary screen.

Add a dedicated "Lok's Bestiary" section.

Minions Category:

Add Vampiric Bats: Health is exactly 1/3 of an average Kinetic.

Bosses Category:

Add Vampire Lord: Spawns with 7 Vampiric bats orbiting it. Passive Ability: Regains 50% of the health from any damage it deals to the player/Kinetics.

Equipment & Status Entities (Sabres):

Mechanics: Sabres protrude from a Kinetic's head, connected by a Hilt (which has its own strict collision box).

Hilt Collision Logic: Striking the Hilt collision box has a 14% chance to break the Sabre off.

Status Effects: When a Sabre breaks, the Kinetic gains the Null status effect (also implement a general Knocked Out status).

Br/Kn Sabres: A broken Sabre has a 14% chance to transform into an ultimate "Br/Kn Sabre".

UI: Give Sabres and Br/Kn Sabres their own dedicated Bestiary categories. Ensure higher-tier Kinetics/items generate significantly more VFX.

2. UI, Menus, & Settings Overhaul
Goal: Fix rendering overlaps and build a scalable, beautiful UI.

Global Settings Fixes:

Critical Fix: Resolve the root pixel overlap and collision issue causing buttons to misfire or click each other. Reconnect all button logic cleanly.

Beautify the Settings menu and separate it into clean Categories.

Implement a Summary Box: Hovering over any menu option (including the in-game modifier) outlines the box and displays a description/summary.

Main Menu Updates:

Create a "Classic Alternate" main menu featuring new VFX options.

Add a new "Game Mode" menu option to house extra modes.

In-Game UI:

Minimap: Allow placement in all 9 screen anchors, plus a dead-center option via the Live Game Modifier. Add an optional floating, glowing "Minimap" title text above it.

Camera/Ads: Fix camera functionality so dynamic border ads stay connected and don't break on camera shifts. Thicken the ad banner ("chunkier") and space out the sponsor text properly. Update with sponsor events/themes.

Background: Add a toggleable Background Title option in-game.

Death Notifications: Add as a toggleable option.

3. The "Lok" Ecosystem & Economy
Goal: Integrate the Lok Operator (Owl mascot) and the meta-progression systems.

Lok Game Modifier Menu (In-Game):

Theme: Connecting to Lok triggers a border VFX effect indicating "Online" status and shifts the modifier menu to a Lok-specific theme.

UX: Menu must be scrollable (or use arrows), acknowledge interactions, and be dockable strictly to the Left or Right of the screen so it doesn't cut off gameplay.

Tiers: Add UI tiers for DMG, Br/Kn, Runesight, Lok, etc.

Tabs: Add a dedicated "Events" tab.

Progression & Economy:

Lok Coins: Base rate is 1 kill = 1+ Lok Coin (different Kinetics yield different bounties). Create multiple avenues to earn coins.

Purchasing: Coins unlock sandbox options, modifiers, and features.

Lok Passport / Lok Pass: Integrate functionality for premium/ecosystem unlocks and inventory management.

4. Gameplay Mechanics & Interaction
Goal: Expand how the player interacts with the sandbox physics.

Operator Attacks (Touch/Mouse Controls):

Implement grabbing, spinning, and throwing Kinetics to play with physics and velocity.

Trick Shots: Add Pokémon Go-style curveballs and charge shots.

Special Shots: Add an unlockable "Triple Shot" (fires 3 Kinetics at once) and "Focus Shot".

The Interactive Buddy Toolbar (Sandbox Toys):


Mechanic - The Lok Dividend: Logging in on Sunday instantly grants a massive lump-sum of LoK Coins (a "Dividend").

Mechanic - Zen Mode: Unlocks a special Sunday-exclusive "Chill/Screensaver" aesthetic. Kinetics do not fight; they harmonize and bounce peacefully. Players enter a "Pacifist God Mode" where they can drag, toss, and bounce Kinetics around playfully without dealing any damage. The game generates a passive trickle of tokens just for leaving the beautiful simulation running on a monitor while the player steps away from the computer. It is a pleasant, hands-off reward.


Mechanics: A classic, toggleable UI bar that spans the top of the screen (inspired by Interactive Buddy).

World Tools: Allows the player to switch from combat actions to wholesome world-interactions. Examples include growing physical flowers on the arena floor, dropping bouncy hearts, sending flocks of doves across the screen, or spawning harmless mini-Kinetics just to play with.

Vibe: Pushes the engine beyond a pure fighter into a highly expressive, creative physics toybox.

VFX & Death Physics:

Add "Chill Explosions" as an alternative to chaotic death explosions.

Add Fruit Ninja effects and playstyle options.

Add Lenovo Touch effects.

Game Modes & Pacing:

**Physics Engine Paradigms:**
- **Contact Brawl (Standard):** Fast-paced auto-battler where damage is dealt on ANY body contact, calculated by relative velocity.
- **Weapon Strikes Only (Classic Weapons):** The original sandbox feel. Kinetics bounce freely with high bounciness. Damage is ONLY dealt when a kinetic's weapon (Sabre) tip physically intersects with an enemy's body hitbox.

Calm/Chill Mode: Kinetics disable combat/chaos to just float, bounce, and sit using basic physics for a relaxing viewing experience.

Focus Mode: Allow left-to-right scrolling through individual Kinetics.

KINETICSOULSXXL (Alpha): A massive mode where the map scales up 10x for massive unit counts and chaos.

Invert Mode: An unlockable overhaul option (add an in-game doc reminder that this is earned by playing through levels).

End-of-Game Stats:

Track and display velocity, motion, and custom user-built stats.

Specifically add "Highest Velocity Kill" to the endgame screen.

5. Future Scope & Integrations
Goal: Long-term features to keep in mind so the architecture supports them.

Media Player Integration: Plan UI space (bottom middle) for an MP3/Video player supporting Spotify, Apple Music, SoundCloud, Bandlab, YouTube, and raw URLs.

Social & Twitch: Integrate a Twitch connection button for stream interactions.

Educational/Party Modes: Add a typing-game mode (typing words/sentences fast spawns enemies against the opposing team) suited for schools/parties.

Collectibles: Build out a framework for tracking in-game collectible items.

Cinematics: Upgrade the current Theater/Cinematic mode.



## 8 Gemeni CLI MIndset
"Act as my senior game developer and coding assistant. Below is the Master Design Document for our project, Kinetic Souls. Read and absorb this entire document to understand the scope, mechanics, UI requirements, and future features. Do not generate any code yet. Simply reply 'Acknowledged' once you understand the framework. We will tackle these systems one modular component at a time in the following prompts."

## 9. Workspace Architecture & Build Pipeline
**Goal:** Maintain a stable dev environment with instantaneous Hot Module Replacement (HMR) and seamless testing deployments via Vercel (Viscreal).

*   **Vite Hot Module Replacement (HMR):**
    *   **The Architecture:** The React source code lives exclusively inside `artifacts/kinetic-souls/`. For Vite to properly hook into React and enable instant browser updates (HMR), this nested folder *must* contain its own `package.json` with `"type": "module"` and a `"dev": "vite"` script.
    *   **Why it Matters:** If the inner `package.json` goes missing or is deleted during a restructuring, Vite's pre-bundler loses context. The dev server might start, but the browser will completely refuse to update when you hit save on `KineticSouls.tsx`.
*   **Extreme Performance (240 FPS Goal):**
    *   **Typed Arrays:** Investigate replacing standard JavaScript object arrays with contiguous memory structures (like `Float32Array`) for all `(x, y)` coordinate math. This will drastically reduce memory overhead and garbage collection spikes.
    *   **Bitwise Optimization:** Implement Bitwise shift operations (`value >> 0` instead of `Math.floor(value)`) inside the Spatial Partitioning Grid calculation loop to shave off fractional CPU cycles.
    *   **AI Grid Hashing:** Pass the collision `grid` down into the AI targeting loops so entities no longer evaluate $O(N^2)$ distances across the entire map, keeping the engine silky smooth even with hundreds of kinetics.
*   **Vercel (Viscreal) Deployment:**
    *   **The Pipeline:** To keep a live testing branch accessible to anyone without the source code, Vercel looks at the root of the repo.
    *   **Configuration:** A `vercel.json` file at the root automatically maps the build commands. It tells Vercel to use the `vite` framework, run `pnpm run build` (which triggers the build across all workspaces), and outputs the compiled web game from `artifacts/kinetic-souls/dist`.
    *   **Mobile Caching Fix:** Mobile browsers and PWA Service Workers aggressively cache `index.html`. To prevent mobile devices from getting stuck on old builds, Vercel must be configured (via `vercel.json` headers) to apply strict `no-cache, no-store, must-revalidate` policies specifically to `/index.html` and `/sw.js`, while allowing immutable assets (like hashed JS/CSS files) to be cached forever.
*   **Running the Game:**
    *   Always run `pnpm dev` from the **root directory**. This will correctly jump into the artifact folder and spin up the Vite server with HMR fully enabled.

## 10. Backups & Archiving
**Goal:** Maintain clean and lightweight snapshots of the project codebase.

*   **Playable Version Archives (Time Machine):**
    *   **The Vercel Method (Recommended):** Every time Vercel builds the game, it generates a unique, permanent, immutable URL (e.g., `kinetic-souls-xyz123.vercel.app`). Instead of bloating the active codebase with legacy mechanics or complicated local cache arrays, we can curate a list of "Classic" or "Stable" milestone builds. We will create a "Version Archive" UI menu that simply hyperlinks players to those frozen-in-time Vercel URLs.
    *   **The Cache Method (Not Recommended):** While Service Workers *can* store multiple full versions of the app offline on a user's device, doing so rapidly consumes mobile storage (which mobile browsers will eventually aggressively wipe) and creates massive routing and PWA conflict headaches.
*   **Method:** Backups are generated using Git to automatically ignore the massive `node_modules` folders and compiled outputs.
*   **Creation Command:** `git archive --format=zip HEAD -o "$env:USERPROFILE\Documents\K.Souls-Backup.zip"`
*   **Standard Backup Locations:**
    *   **Documents Folder (Recommended):** `~\Documents\K.Souls-Backup.zip`
    *   **Project Root (Alternative):** `C:\K.Souls---Classic\K.Souls-Backup.zip`
*   **Restoration:** To restore a backup, extract the zip file to your desired directory, open a terminal inside it, and run `pnpm install` to freshly redownload all project dependencies.

## 11. Known Fatal Engine Errors & Solutions
**Goal:** Document common pitfalls that cause the game to crash, render a blank screen, or fail compilation so future AI assistants avoid them.

*   **Black Screen (gameLoop Silent Crash / Canvas Exception):**
    *   **Cause:** Usually occurs inside `DrawEntities.ts` or physics loops when attempting to access properties of `undefined` (like `aPart.type` when `a.parts` is empty) or when passing a zero/negative radius to `ctx.createRadialGradient()`. The canvas silently swallows the `IndexSizeError`, halting the `requestAnimationFrame` loop and leaving a black screen.
    *   **Fix:** ALWAYS safeguard particle/part arrays (`const parts = c.parts || [];`) and wrap radius values in `Math.max(0.1, radius)` before creating gradients. Check if objects exist before property access (`if (aPart && aPart.type === "head")`).
*   **White Screen (React Compiler Panic / Syntax Error):**
    *   **Cause:** Occurs when invalid syntax is injected into JSX or TSX. The most common cause is broken conditional chains, such as placing an `else if` directly after an `else` block, or duplicating `useRef` variable declarations.
    *   **Fix:** Ensure strict adherence to JS control flow (`if -> else if -> else`). Verify no duplicate `const` declarations exist when applying unified diffs.
*   **"Falling to the Bottom" Bug (Top-Down Physics Breach):**
    *   **Cause:** Treating the top-down arena as a side-scrolling platformer by accidentally applying a constant positive `GRAVITY` fallback.
    *   **Fix:** In a top-down perspective, base gravity should always be `0`. Modifiers like `moonGravity` or `antiGravity` are the only ones that apply global directional forces. Standard movement uses friction (`DRAG`), not downward gravity.
*   **UI Dropdown Desync (Changes Don't Apply):**
    *   **Cause:** State modifications in the UI lacking a render trigger, or modifying `stateRef` without clearing the offscreen Sprite Cache.
    *   **Fix:** Always call `setTick(t => t + 1)` after modifying `stateRef` from the menu, and ALWAYS call `spriteCacheRef.current.clear()` when changing graphics (like `theme` or `kineticStyle`) so the new visuals render immediately.

## 12. Future Sandbox Additions

*   **Kinetic Class: The Sanguine**
    *   **Mechanics:** A parasitic entity. Steals 5% mass from enemies on contact to grow larger. Upon reaching critical mass (2.5x base), it erupts in a massive 300px radial shockwave, pushing all nearby kinetics away, before instantly shrinking back to its original size.
    *   **Engine Safety:** Safely intercepts during the collision loop via `checkSanguine(a, b)`. Uses a custom particle pool flag (`isRing`) to safely render its expanding wireframe blast without breaking standard particle physics.
*   **Kinetic Class: The Splinter-Bot**
    *   **Mechanics:** A fragile glass-cannon kinetic. Upon taking heavy damage (dropping below 50% HP), it instantly destroys itself and spawns a swarm of 3 smaller, faster "Micro-Splinter" clones.
*   **Kinetic Class: Binary Tether & Scrap-Mage**
    *   **Mechanics:** Binary Tethers apply Hooke's Law physics to bind two kinetics together. The Scrap-Mage magnetically orbits broken Sabres into a saw-blade shield.
*   **Environment Modifiers: Möbius Rifts, Amplitude Floor, Slipstreams**
    *   **Mechanics:** Introduces momentum-preserving wormholes (Möbius), undulating EQ bounce floors (Amplitude), and directional wind tunnels (Slipstreams).
*   **Environment Modifier: The Pinball Matrix**
    *   **Mechanics:** Spawns static, high-bounciness neon bumpers in the arena. Collisions inject massive kinetic velocity into the colliding kinetic.
*   **Equipment: Advanced Br/Kn Elemental Sabres**
    *   **Vengeance Core:** Absorbs kinetic energy on first impact and reflects it 2x on the next.
    *   **Absolute Zero:** Creates an area that increases kinetic mass by 3x and drops bounciness to 0.1, making them heavy dead-weights.
    *   **Caustic Core:** Leaks highly corrosive acid pools that dynamically shrink kinetic mass and geometry down until destroyed.
*   **Equipment: The Tesla Sabre (Br/Kn)**
    *   **Mechanics:** An elemental broken sabre variant. Acts as a mobile lightning rod. Periodically chains lightning damage to up to 3 nearby kinetics, applying a severe velocity jitter.
*   **God Actions: Area Lock, Architect's Pen, Marionette**
    *   **Mechanics:** Area Lock allows freezing kinetics into batteries. Architect's pen allows physical drawing of solid walls directly to the canvas. Marionette attaches a physics spring from the mouse to kinetics to fling them.
*   **God Action: Chronos Shift**
    *   **Mechanics:** A toggled "Matrix-style" slow-motion mode that smoothly eases the engine's `timeScale` down to 0.15.


## 13. The Grand Vision: Omni-Platform & LokToken Economy
**Goal:** Establish the ultimate cross-platform lightweight engine tied to a custom, ultra-secure cryptocurrency database.

*   **Omni-Platform Deployment (The "Doom" Philosophy):**
    *   The engine must remain so hyper-optimized that it can run on practically any screen: Web browsers, iOS, Android, Mac, PC, Steam, Cloud, and iPads.
    *   Updates must be perfectly streamlined across all platforms using modern deployment pipelines and web wrappers (Electron/Tauri/Capacitor).
*   **The Trillion-Kill Economy:**
    *   Players will slaughter Kinetics at massive scales, eventually earning billions and trillions of LoK Coins over time. 
    *   These points will be used to buy all cosmetics, features, and sandbox tools. JavaScript's native numbers safely support up to 9 quadrillion, accommodating this massive scale effortlessly.
*   **LokToken & The Custom Vault Database:**
    *   In-game LoK Coins will be convertible to **LokTokens**, a custom proprietary cryptocurrency.
    *   The backend database will be built completely from scratch as a locked, maximum-security vault holding user documentation and tokens.
    *   It will feature bespoke, advanced encryption to privately and safely store data to the max.
    *   The rollout will start private, eventually going public to reward early players who generated massive kinetic kill counts with real, convertible value.

## 14. Live-Ops & Ecosystem Events System
**Goal:** Create a scheduled, server-authoritative event system managed via an external Developer Dashboard.

*   **The Dev Dashboard (Architecture):**
    *   A standalone secure admin portal connected to the PostgreSQL/Drizzle database.
    *   Allows developers to manually trigger or pre-schedule global events (e.g., multiplier weekends, cosmetic drops, boss invasions) based on time/date chron-jobs.
    *   The React game client will poll the Express API on load (`GET /api/events/active`) to sync the game state with global multipliers.
*   **The Weekend Flow (Scheduled Multipliers):**
    *   **Frenzy Friday:** Global 2x LoK Coin multiplier. Encourages the start of the weekend sandbox grind.
    *   **Supernova Saturday:** Global 3x LoK Coin multiplier + higher tier Kinetic/Boss spawn rates. The peak engagement day.
*   **The Sunday Dilemma ("Sunday Serenity"):**
    *   *Philosophy:* Sunday events must be extremely rewarding but *cannot* enforce FOMO (Fear Of Missing Out) or require intense grinding. It must respect players' real-life time (family, rest, religion).
    *   *Mechanic - The Lok Dividend:* Logging in on Sunday instantly grants a massive lump-sum of LoK Coins (a "Dividend").
    *   *Mechanic - Zen Mode:* Unlocks a special Sunday-exclusive "Chill/Screensaver" aesthetic. Kinetics do not fight; they harmonize and bounce peacefully. The game generates a passive trickle of tokens just for leaving the beautiful simulation running on a monitor while the player steps away from the computer. It is a pleasant, hands-off reward.
    
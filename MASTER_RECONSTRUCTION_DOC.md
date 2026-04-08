# KINETIC SOULS: Master Reconstruction Document

**Core Concept:** 1v1 cross-platform sandbox arena fighter (inspired by Interactive Buddy/2000s flash games) featuring automated fighters with heavy user interaction, physics manipulation, and ecosystem integration.
**Repository:** mistachatty-cmyk/K.Souls---Classic

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
    *   Implement grabbing, spinning, and throwing Kinetics to play with physics and velocity.
    *   Trick Shots: Add Pokémon Go-style curveballs and charge shots.
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

VFX & Death Physics:

Add "Chill Explosions" as an alternative to chaotic death explosions.

Add Fruit Ninja effects and playstyle options.

Add Lenovo Touch effects.

Game Modes & Pacing:

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
# 🧠 Kinetic Souls: Brainstorm Inbox

*This document serves as the permanent landing spot and recovery reference for all raw ideas, mechanics, and features planned for future implementation. When an idea is implemented, it is moved to the Master Reconstruction Doc.*

---

### 1. The "Pinball Matrix" Environment (Gameplay Mechanic)
- **Concept:** A new environment modifier that spawns static, high-bounciness neon bumpers across the arena. 
- **Mechanic:** When kinetics hit them, they get injected with massive velocity, turning the arena into a literal pinball machine.

### 2. Weapon Visual Overhaul (Visual Polish)
- **Concept:** Completely upgrade `drawWeapon()` away from basic line drawings.
- **Execution:** Overhaul all 12 weapon types (Dagger, Spear, Hammer, Scythe, Axe, Katana, Mace, Rapier, Whip, Blaster, Fireball, Standard) so they look distinct, scale beautifully, and have better sweeping arcs during combat.

### 3. Particle System & Death FX (Visual Polish)
- **Concept:** Upgrade `pushParticle()` and `triggerExplosion()`.
- **Execution:** Move from fading squares to glowing orbs and physics-based debris. Add the "Chill Explosions" toggle for a cleaner, less chaotic look.

### 4. Advanced God Actions / Trickshots (Interaction)
- **Concept:** Expand the Magnus-force curveballs ("Trick Shots 2.0").
- **Execution:** Landing a massive trickshot triggers a "Super Move" (e.g., firing lasers, freezing enemies, or massive healing bursts) as a reward for high-skill physics manipulation.

### 5. Reusable Engine Library Additions (Boilerplate Extraction)
- **Dynamic Camera System:** Extract the cinematic lerping, XXL bounds scaling, and trauma screen-shake.
- **Offscreen Sprite Cacher:** Extract the pre-rendering canvas system for high-performance entities.
- **Input Handler:** Extract the touch/mouse/keyboard unified listener and collision AABB interaction logic.
### KINETIC SOULS: Sandbox Expansion Sprint 01

**To: Principal Web Engineer AI** **From: Lead Game Designer**

Please review the following four features for implementation into our HTML5 Canvas 2D Physics Engine. Provide the JavaScript/Canvas code for each module, keeping performance and extreme modularity in mind. All visuals should lean into a "Technical Minimalism" aesthetic—clean lines, sharp geometry, and high-contrast indicators.

#### 1. Boss Entity: The Snarl Construct

- **Concept:** A rogue, highly aggressive administrative bot that locks down movement.
    
- **Physics Logic:** * Give it 5x the `mass` of a standard Kinetic.
    
    - **The Tether:** Instead of a Sabre collision, calculate the distance to the nearest enemy Kinetic using `Math.hypot(dx, dy)`. If within range `R`, establish a tether.
        
    - Apply a heavy friction multiplier (e.g., `target.vx *= 0.85`, `target.vy *= 0.85`) to the tethered entity every tick.
        
- **Render Logic:** Draw the tether using `ctx.lineTo()` with a stark, glowing red stroke. The tether should snap if the distance exceeds `R * 1.5`.
    

#### 2. Environment Modifier: The Wilderness Grid

- **Concept:** A high-risk, high-reward zone overlay.
    
- **Physics Logic:**
    
    - Divide the canvas into a 4x4 or 5x5 grid array.
        
    - Every `N` frames, randomly select 1 to 3 grid cells to become "Active".
        
    - During collision detection, check if the `(x, y)` midpoint of the collision falls within an Active cell's boundaries.
        
    - If true, multiply the standard relative impact velocity damage by `3.0`.
        
- **Render Logic:** Draw a subtle, low-opacity white/grey grid over the arena background. Fill "Active" cells with a pulsing, semi-transparent hazard color (like neon orange or yellow) to telegraph the danger to the player.
    

#### 3. Broken Sabre Modifier: Gravity Well (Br/Kn)

- **Concept:** A localized black hole triggered when a specific Sabre snaps off.
    
- **Physics Logic:**
    
    - When the Sabre's state changes to "Broken" and its type is "Gravity", initiate a cooldown timer.
        
    - Every `120` ticks, execute a pull function: Loop through the main entity array and loose sabre array.
        
    - For each item within radius `Pull_R`, calculate the angle to the Gravity Sabre using `Math.atan2(dy, dx)`.
        
    - Apply a velocity vector towards the Sabre: `entity.vx += Math.cos(angle) * pullStrength`.
        
- **Render Logic:** Draw a minimalist, collapsing wireframe circle or an inward-flowing particle effect at the Sabre's `(x, y)` coordinates to telegraph the pull radius.
    

#### 4. God Action: Exponential Mitosis

- **Concept:** Instant swarm generation via mouse click.
    
- **Physics Logic:**
    
    - On `mousedown` (if Mitosis is the active God Tool), find the closest Kinetic to the mouse `(x, y)`.
        
    - Instantiate a new Kinetic object, duplicating the target's `mass`, `ai_state`, and `color`.
        
    - **Crucial:** Spawn the clone with a slight offset (`x + (target.radius * 2.1)`) to prevent the engine from registering an infinite collision loop inside the same bounding box.
        
    - Inherit the original's momentum: `clone.vx = target.vx`, `clone.vy = target.vy`.
        
    - _Constraint:_ Implement a hard cap on the entity array length (e.g., max 50 Kinetics) to prevent the Canvas loop from crashing the browser.
        
- **Render Logic:** Flash a brief, bright white stroke around the original Kinetic for 2 frames to indicate a successful duplication.
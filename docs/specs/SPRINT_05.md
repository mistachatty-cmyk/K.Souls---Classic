---
aliases:
  - "KINETIC SOULS: Sandbox Expansion Sprint 05"
---
### KINETIC SOULS: Sandbox Expansion Sprint 05

**To: Principal Web Engineer AI** **From: Lead Game Designer**

Please review the following four features for implementation. This sprint introduces orbital mechanics, particle trails, and flow fields to the Canvas engine. Maintain strict adherence to the "Technical Minimalism" aesthetic and ensure garbage collection is optimized for the new particle arrays.

#### 1. Kinetic Class: The Scrap-Mage

- **Concept:** A highly vulnerable core entity that magnetically attracts broken Sabres, using them to build a rotating, deadly shield of debris.
    
- **Physics Logic:** * The core entity spawns with very low `mass` and `radius`.
    
    - Every tick, it scans the loose Sabre array. If a Sabre is in a "Broken" state and within radius `Attract_R`, it applies a pull vector toward the Scrap-Mage.
        
    - **The Orbit:** If a broken Sabre collides with the Scrap-Mage, change its state to "Orbiting". Override its `(x, y)` physics updates with a trigonometric orbit calculation based on the engine's tick time: `sabre.x = mage.x + Math.cos(time + offset) * orbitRadius`.
        
    - Orbiting Sabres retain their collision boxes, acting as an impenetrable, grinding saw-blade against other Kinetics.
        
- **Render Logic:** The Scrap-Mage core is a small, pulsing hexagon. The orbital paths should not be drawn; let the floating Sabres define the shape organically as they spin.
    

#### 2. Environment Modifier: Slipstream Corridors

- **Concept:** Invisible, high-speed flow fields that inject constant directional velocity, creating transit highways or deadly acceleration traps.
    
- **Physics Logic:**
    
    - Define an array of rectangular zones (`startX`, `startY`, `width`, `height`) with an assigned `flowVector` (e.g., `fx: 2.0, fy: 0.0` for a strong rightward push).
        
    - **Collision:** During the main loop, check if a Kinetic's `(x, y)` falls within a Slipstream bounding box.
        
    - If true, add the `flowVector` directly to the Kinetic's velocity every tick (`kinetic.vx += flowVector.fx`), capping at a `maxTerminalVelocity` to prevent the engine from breaking collision detection.
        
- **Render Logic:** Render the zones as very faint, semi-transparent rectangles (`rgba(255, 255, 255, 0.05)`). To telegraph the direction, animate small, minimalist chevrons (`>>>`) or dashes flowing through the zone along the vector path.
    

#### 3. Broken Sabre Modifier: The Caustic Core (Br/Kn)

- **Concept:** A shattered weapon that leaks highly corrosive fluid, permanently melting the mass and geometry of any Kinetic that touches it.
    
- **Physics Logic:**
    
    - When the Sabre snaps and its element is "Acid", it begins leaking.
        
    - Every `15` ticks, it drops an `AcidPool` object at its current `(x, y)` coordinate with a decay timer of 5 seconds.
        
    - **The Melt:** If a Kinetic collides with an `AcidPool`, it doesn't take standard knockback damage. Instead, reduce its `mass` and `radius` by `2%` per tick of contact.
        
    - If a Kinetic's radius drops below a minimum threshold (`minRadius`), it dissolves entirely and is spliced from the array.
        
- **Render Logic:** The leaking Sabre leaves a trail of stark, bright green or yellow minimalist dots (no complex liquid shaders, just pure 2D Canvas arcs). Affected Kinetics briefly flash the acid color as their scale visibly shrinks.
    

#### 4. God Action: The Director's Marionette

- **Concept:** Forcibly tether any entity to the Director's mouse cursor with an invisible, highly elastic spring, allowing you to swing them like a wrecking ball.
    
- **Physics Logic:**
    
    - On `mousedown` over a Kinetic, trigger an `isPuppet = true` state.
        
    - **The Spring:** Bypass standard gravity for this unit. Apply **Hooke's Law** between the current `(mouseX, mouseY)` and the Kinetic's `(x, y)`. The further you drag the mouse away, the violently harder the spring pulls the Kinetic toward the cursor.
        
    - Because you are building massive `vx` and `vy` by whipping the mouse around, releasing `mouseup` will launch the Kinetic across the arena at devastating speeds, transferring that kinetic energy into whatever it hits.
        
- **Render Logic:** Draw a single, razor-thin, high-tension line from the tip of the cursor to the exact center of the puppeteered Kinetic. The line should change color (e.g., white to red) as the physical tension/distance increases.
  
  
  About, Landing page
  
  Mens women 
  
  TRYL Mission - about page
  SHop - Mens womens kids -
  
  Prayer Request
  Type name - Type prayersquest
  Email - 
  

 Can tye so many ways in a belows  section 
  
  Email - 
  
  Click add to cart  ----  continue shopping/Back button
  
  Only instagram 
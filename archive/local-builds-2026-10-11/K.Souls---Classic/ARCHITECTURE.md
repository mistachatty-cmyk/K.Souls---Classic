# AI-Optimized Game Architecture & Workflow Protocol

## The Problem: The "Context Wall"
When building complex games, monolithic files (like a 3000-line `Game.tsx`) cause AI coding assistants to fail. 
1. **Slow Generation:** Outputting 1000-line unified diffs takes forever, consumes massive tokens, and often truncates.
2. **Patch Failures:** Massive red deletion blocks fail to apply because a single changed indentation character breaks the diff matcher.
3. **Context Dilution:** When state, rendering, and logic are mixed, the AI loses scope and hallucinates variables.

## The Solution: "AI-First" Componentization
To ensure future games are easy for AI to code, we must architect them from day one to have **Zero Monoliths**. No file should exceed 300-500 lines. 

### 1. Strict Domain Separation
Structure your project so the AI only needs to read/edit one specific concept at a time:
- **`src/core/`**: Agnostic engine logic (Object Pools, Math routines, Collision detection).
- **`src/game/state.ts`**: The singular source of truth (e.g., GameState interfaces).
- **`src/game/constants.ts`**: Magic numbers (e.g., `ARENA_W`, `MAX_HP`).
- **`src/systems/`**: Pure functions that update state (e.g., `updatePhysics(chars, dt)`, `processCombat()`).
- **`src/render/`**: Functions that ONLY draw to the canvas. No state mutation allowed here.

### 2. Protocol: AI Must Never Generate Massive Deletion Diffs
If an AI extracts an 800-line function into a new file, **do not let the AI generate the diff to delete the old 800 lines.** The AI will generate a massive wall of `-` lines that will invariably fail to apply. 
**Workflow for Extractions:**
1. AI generates the newly extracted file completely (e.g., `DrawUI.ts`).
2. AI provides a tiny diff to add the `import` to the main file.
3. **Human Developer manually deletes** the 800 lines of dead code from the main file. 
This entirely bypasses the diff tool's patching limitations and saves significant time.

### 3. Protocol: Pass State Explicitly, Avoid Closures
AI struggles with giant `useEffect` closures where variables are accessed from 1000 lines above. 
**Bad:** `function gameLoop() { chars.forEach(c => c.x += c.vx * timeScale) }`
**Good:** `function updatePhysics(chars: Character[], timeScale: number, dt: number)`
By passing state explicitly, the AI can rewrite `updatePhysics` perfectly without needing the entire React component in context.

### 4. Splitting the Game Loop
Your `gameLoop` should act as a clean table of contents. If you want to add a new mechanic, you only pass the AI the specific system file.
```typescript
function gameLoop(timestamp) {
    const dt = calculateDelta(timestamp);
    
    // 1. Mutate State
    SpawnerSystem.update(state, dt);
    PhysicsSystem.update(state, dt);
    CombatSystem.processCollisions(state);
    
    // 2. Render State
    clearCanvas(ctx);
    RenderEnvironment.draw(ctx, state);
    RenderEntities.draw(ctx, state);
    RenderUI.draw(ctx, state);
}
```
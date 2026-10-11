# Kinetic Souls: Reusable Systems Library

This document contains modular, decoupled systems extracted from the Kinetic Souls engine. They are designed to be copy-pasted and transferred to any future HTML5 Canvas, React, or TypeScript game projects.

---

## 📦 CHUNK 1: Core Engine & Performance Systems
These are the foundational scripts needed to run a high-performance 2D game in the browser (60-240 FPS) without lag spikes or stuttering.

### 1. The Delta-Time Game Loop
**Category:** `Engine Core`  
**What it does:** Monitors how much time has passed between frames (Delta Time) and scales movement math so that a character moves at the exact same speed on a 60Hz monitor as they do on a 144Hz or 240Hz monitor.  
**How it's coded:** It uses `requestAnimationFrame` and stores the previous timestamp. It calculates a `dtScale` multiplier that you apply to all velocity calculations (`x += vx * dtScale`).

**Reusable Script (`GameLoop.ts`):**
```typescript
export class GameEngine {
    private lastTime: number = 0;
    private animationFrameId: number = 0;
    public isRunning: boolean = false;

    // Standard baseline (60 FPS = ~16.66ms per frame)
    private readonly TARGET_FPS_MS = 1000 / 60; 

    public start(updateFn: (dtScale: number) => void) {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();

        const loop = (timestamp: number) => {
            if (!this.isRunning) return;

            // Calculate Delta Time
            const deltaTime = timestamp - this.lastTime;
            this.lastTime = timestamp;

            // dtScale is 1.0 at exactly 60fps. 
            // If the game lags and drops to 30fps, dtScale becomes 2.0 (moving things twice as far to catch up).
            const dtScale = deltaTime / this.TARGET_FPS_MS;

            // Cap the scale to prevent physics from exploding if the user tabs out
            const safeDtScale = Math.min(dtScale, 3.0);

            updateFn(safeDtScale);
            this.animationFrameId = requestAnimationFrame(loop);
        };

        this.animationFrameId = requestAnimationFrame(loop);
    }

    public stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
    }
}
```

### 2. Object Pooling System (Zero Garbage Collection)
**Category:** `Memory / Performance`  
**What it does:** In JavaScript, constantly creating (`new Particle()`) and destroying (`array.filter()`) thousands of particles/projectiles causes the Garbage Collector to freeze your game for a few milliseconds (stuttering). Object pooling creates a massive array of inactive objects right when the game starts, and just recycles them.  
**How it's coded:** A fixed-size array is initialized. When you need a particle, you find the first `active === false` object, reset its stats, and turn it on.

**Reusable Script (`ObjectPool.ts`):**
```typescript
export interface IPoolable {
    active: boolean;
    reset: (...args: any[]) => void;
}

export class ObjectPool<T extends IPoolable> {
    private pool: T[];
    private currentIndex: number = 0;

    constructor(factoryFn: () => T, initialSize: number = 1000) {
        this.pool = Array.from({ length: initialSize }, factoryFn);
    }

    // Get an inactive object from the pool
    public get(): T | null {
        // Fast circular search
        for (let i = 0; i < this.pool.length; i++) {
            this.currentIndex = (this.currentIndex + 1) % this.pool.length;
            const obj = this.pool[this.currentIndex];
            if (!obj.active) {
                obj.active = true;
                return obj;
            }
        }
        return null; // Pool is full
    }

    // Returns only the active objects for rendering/updating
    public getActive(): T[] {
        // Warning: Do not use .filter() in the main game loop, do it manually to avoid GC
        const activeItems: T[] = [];
        for (let i = 0; i < this.pool.length; i++) {
            if (this.pool[i].active) activeItems.push(this.pool[i]);
        }
        return activeItems;
    }
}
```

### 3. Spatial Partitioning Hash Grid
**Category:** `Physics / AI Optimization`  
**What it does:** Checking if 200 entities hit each other requires 40,000 math checks per frame. A Spatial Hash Grid divides your map into invisible "buckets". An entity only checks for collisions with other entities inside its own bucket or immediately adjacent buckets.  
**How it's coded:** Uses a TypeScript `Map` where the key is a string combining X/Y coordinates (`"5,10"`), and the value is an array of entities in that cell.

**Reusable Script (`SpatialGrid.ts`):**
```typescript
export interface IGridEntity {
    id: string | number;
    x: number;
    y: number;
    radius: number;
}

export class SpatialHashGrid<T extends IGridEntity> {
    private cellSize: number;
    private grid: Map<string, T[]>;

    constructor(cellSize: number = 60) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    public clearAndPopulate(entities: T[]) {
        this.grid.clear();
        for (let i = 0; i < entities.length; i++) {
            const ent = entities[i];
            const key = `${(ent.x / this.cellSize) >> 0},${(ent.y / this.cellSize) >> 0}`;
            if (!this.grid.has(key)) this.grid.set(key, []);
            this.grid.get(key)!.push(ent);
        }
    }

    public getNearby(entity: T): T[] {
        const nearby: T[] = [];
        const cellX = (entity.x / this.cellSize) >> 0;
        const cellY = (entity.y / this.cellSize) >> 0;

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const cellEntities = this.grid.get(`${cellX + dx},${cellY + dy}`);
                if (cellEntities) {
                    for(let i=0; i<cellEntities.length; i++) {
                        if (cellEntities[i].id !== entity.id) nearby.push(cellEntities[i]);
                    }
                }
            }
        }
        return nearby;
    }
}
```

---

## 📦 CHUNK 2: Dynamic UI, Menus & The LoK Ecosystem

### 1. The Randomized Splash Text System
**Category:** `UI / Polish`  
**What it does:** Every time the player loads the game or returns to the main menu, a random piece of flavor text ("Splash Text") is displayed under the title.  
**How it's coded:** It uses a React custom hook `useSplashText` that pulls from a static array, ensuring the text is only calculated once on mount.

**Reusable Script (`useSplashText.ts`):**
```typescript
import { useState, useCallback } from 'react';

export const SPLASH_ARCHIVE = [
    "THEEEee ULtimatee everything-everywhere-all-at-once auto-battler?",
    "Why choose a variant when you can build the ULTIMATE?",
    "🦉 Lok: Focus on what matters.",
    "Everything-Everywhere-All-At-Once."
];

export function useSplashText() {
    const [splashText, setSplashText] = useState(() => {
        return SPLASH_ARCHIVE[Math.floor(Math.random() * SPLASH_ARCHIVE.length)];
    });

    const rollNewSplash = useCallback(() => {
        setSplashText(SPLASH_ARCHIVE[Math.floor(Math.random() * SPLASH_ARCHIVE.length)]);
    }, []);

    return { splashText, rollNewSplash };
}
```

### 2. Canvas Interactive Button System
**Category:** `Canvas UI`  
**What it does:** Draws beautiful hovered/glowing buttons directly onto the HTML5 Canvas and detects if the mouse clicked inside them (AABB collision).  
**How it's coded:** A reusable static class that handles bounds checking and styling in one swoop.

**Reusable Script (`CanvasMenuSystem.ts`):**
```typescript
export interface MouseState { x: number; y: number; isDown: boolean; clickedThisFrame: boolean; }

export class CanvasMenuSystem {
    public static drawAndCheckButton(
        ctx: CanvasRenderingContext2D,
        mouse: MouseState,
        text: string,
        x: number, y: number, w: number, h: number,
        baseColor: string = "#442266", hoverColor: string = "#7B68EE", textColor: string = "#ffffff"
    ): boolean {
        const isHovered = mouse.x >= x && mouse.x <= x + w && mouse.y >= y && mouse.y <= y + h;
        const isClicked = isHovered && mouse.clickedThisFrame;

        // Draw Background & Glow
        ctx.fillStyle = isHovered ? hoverColor : baseColor;
        ctx.shadowBlur = isHovered ? 15 : 0;
        ctx.shadowColor = hoverColor;
        ctx.fillRect(x, y, w, h);
        
        // Draw Border
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        ctx.shadowBlur = 0; 

        // Draw Text
        ctx.fillStyle = textColor;
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x + w / 2, y + h / 2);
        ctx.textAlign = "left";

        return isClicked;
    }
}
```

*(Note: The `LokModifierPanel` was a massive React component, and its architectural concept of updating a `stateRef` instead of using `setState` is the primary takeaway for high-performance React game UI).*
# Gemini Code Assist - Standard Operating Procedure (SOP)

This document serves as a guide for interacting with Gemini Code Assist effectively, preventing "Context Wall" overloads, avoiding code truncation, and ensuring maximum code quality. Reference these rules before starting major refactors or attaching large amounts of context.

---

## 1. The "Context Wall" & Context Dilution
**The Problem:** Attaching the entire workspace, `node_modules`, or numerous heavy Markdown documents at once overloads the AI's token limit (memory). This results in:
- Truncated (cut-off) code generation.
- Hallucinated or incorrect variables.
- Refusal to generate large diffs.

**The Solution:** Keep the context lean and strictly relevant to the current task.

## 2. How to Share Code Safely
- **Active Tab:** The easiest way to share a file is simply to open it in your active editor tab. Gemini automatically reads the active file.
- **Explicit Attachments:** Use the `@` symbol in the chat (e.g., `@DrawUI.ts`) to explicitly attach a file without dumping the whole folder.
- **Copy-Paste Snippets:** For massive monolithic files (1,000+ lines), copy and paste *only the specific function* (e.g., `drawMainMenu()`) into the chat to guarantee zero truncation and perfect focus.
- **NEVER Bulk-Attach:** Do not bulk-attach documentation, `package.json`, or entire folders unless specifically requested to establish a brand-new project context.

## 3. Code Generation & Diffs
- Gemini generates unified diffs (patches) to safely modify your code without rewriting the whole file.
- For a diff to apply perfectly, Gemini needs to see the *current* state of the file. Always ensure your local file is saved before asking for a fix.
- When dealing with huge functions that shouldn't be fully rewritten, ask Gemini to output "just the specific block to replace."

## 4. Task Management Workflow
1. **One Issue at a Time:** Fix bugs serially (Bug 1, verify, then Bug 2). Asking for 5 complex physics and UI fixes in one prompt drastically increases the chance of errors.
2. **Verify Execution:** Always check the terminal for Vite/compiler errors after saving a generated fix.
3. **Document Everything:** After applying a successful fix, immediately update `CHANGELOG.md` and `KNOWN_BUGS.md` before moving to the next issue.

## 5. Architectural Reminder
As stated in `ARCHITECTURE.md`, AI coding assistants perform best with **Zero Monoliths**.
If a file grows beyond 500 lines, prioritize splitting it into smaller, domain-specific modules (`src/core`, `src/systems`, `src/render`) rather than trying to force the AI to read a 2,000-line file.

## 6. Version Control Checkpoints
- Always commit your current working state (or use a rollback checkpoint) *before* applying a large AI-generated code patch.
- If the AI hallucinates, breaks a core mechanic, or misunderstands a complex physics function, simply discarding the file changes in Git is infinitely faster than trying to manually untangle the code.

## 7. Effective Error Reporting
- If a Vite build fails, the server crashes, or the browser shows a blank screen, do not just say "it broke" or "nothing happened."
- **Always paste the exact red error log** from your terminal or browser console. The AI can instantly pinpoint syntax errors or undefined variables from the stack trace.

## 8. Explicit Constraints
- When asking for visual or UI changes, always explicitly state what underlying systems should remain untouched.
- *Example:* "Update the character rendering in `drawRawChar()`, but DO NOT modify the hitbox dimensions, velocity multipliers, or physics logic."

## 9. Core Game Philosophy: The Ultimate Sandbox
- **Everything is Optional:** Kinetic Souls is the ultimate sandbox interactive game. Every aspect—from the intro screen, background simulation, menus, in-game UI, game modifiers, end-game screen, scoreboards, to final action reports—must be highly customizable.
- **Bugs into Features:** If a fun or interesting bug occurs (e.g., collision phasing), do not just delete it—convert it into a toggleable feature that players can enable.
- **Modular Additions:** Whenever you create a new visual change, gameplay tweak, or feature, ALWAYS expose it as a toggle or dropdown option in the Lok Live Game Modifier or Settings menus. Never permanently overwrite existing styles if they can be preserved as an option to maximize player usability and fun.

## 10. Diff Failure Workarounds & Context Desyncs
- **The Problem:** Editors reject diffs ("couldn't be fully applied") when the file's current state mismatches the AI's assumed state due to partially accepted code.
- **The Workaround:** The AI must use "wide-context diffs" anchored to static, unique lines (like the end of a function `}` or object `};`) rather than relying on recently modified lines.

## 11. Strict Documentation Protocol
- Every new feature, logic change, or mechanic added MUST be thoroughly documented in the game's overarching manual.
- **Format:** Any new code must be accompanied by an explanation of: *How it works*, *What it does*, *Why it exists*, the underlying *Logic*, and baseline *Stats* (e.g., base damage, velocity multipliers, cooldown timers) so it can be easily located and edited in the future.

## 12. Brainstorming & Idea Transfer Loop
- The user utilizes a separate AI chat (via `GEMINI_TRANSFER_DOC.md`) to brainstorm creative sandbox concepts without diluting this coding context.
- **The Inbox:** All raw ideas must be pasted into `BRAINSTORM_INBOX.md`. This file serves as the consistent landing spot and recovery reference.
- **Implementation:** When the user brings ideas back to this chat for implementation, the AI must evaluate them for 2D Canvas Physics feasibility.
- **Crucial:** Any approved and implemented idea must be permanently logged into the `MASTER_RECONSTRUCTION_DOC.md` and the `GAME_MANUAL.md` to ensure future implementations have context on the new feature.

---
*Note: If Gemini warns you about truncation or context limits, stop, clear the chat context (or start a new chat), and provide only the specific function needed for the task.*

## 13. Universal AI System Prompt (For OpenCode / Nemotron / Cross-Model Handoff)

**Instructions for the User:** Copy the text block below and paste it as your FIRST prompt when opening a new chat with Nemotron, ChatGPT, or any other OpenCode model. This ensures they instantly understand the engine constraints and don't break the architecture.

---
**[COPY AND PASTE THE TEXT BELOW THIS LINE TO INITIALIZE NEW AI MODELS]**

<SYSTEM_PROMPT>
Act as a Senior Game Engine Developer and High-Performance React Engineer. You are working on "Kinetic Souls", a 1v1 cross-platform sandbox arena fighter and auto-battler built entirely in React, TypeScript, and HTML5 Canvas.

Before we begin, you must strictly adhere to the following architectural rules and engine constraints:

### 1. The Core Architecture (Do NOT Break This)
- The entire game runs inside a single React component using a `requestAnimationFrame` loop.
- **NO REACT RE-RENDERS:** The engine runs at 60-240 FPS. To achieve this, ALL game state (`GameState`), entity arrays (`Character[]`, `Particle[]`), and timers are stored inside `useRef` hooks (e.g., `stateRef`, `dataRef`, `timeRef`).
- **NEVER** convert a `useRef` game state mutation into a `useState` hook. Doing so will trigger React re-renders 60 times a second and crash the browser.

### 2. Performance & Optimization Rules
- **Object Pooling:** The game uses an `ObjectPoolSystem` for particles, floating text, and projectiles. Do not use standard array `push()` and `filter()` for transient objects if pooling is enabled, as it causes severe Garbage Collection (GC) lag spikes.
- **Spatial Partitioning:** Collision detection and AI targeting utilize a `Map`-based Spatial Hash Grid (e.g., O(1) cell lookups). When optimizing loops, always leverage this grid rather than writing O(N^2) loops across `dataRef.chars.current`.
- **Offscreen Rendering:** The engine uses a `SpriteCache` (an offscreen `<canvas>`) to stamp complex vector graphics. When updating visual logic, ensure you respect the cache-clearing mechanisms on theme swaps.

### 3. Modularity & Clean Code
- The codebase has been modularized. `KineticSouls.tsx` handles the main loop, state refs, and event listeners. 
- Rendering logic MUST remain pure and lives in `DrawEntities.ts`, `DrawUI.ts`, and `DrawWorld.ts`.
- Spawning, AI, and Particle logic live in `Spawner.ts`, `Behaviors.ts`, and `Particles.ts`.

### 4. Code Generation Rules
- When I ask you to refactor, optimize, or build a feature, do NOT output the entire file if it is over 200 lines long.
- Output your code as a **Unified Diff** or clearly indicate the specific function block to replace.
- Maintain strict TypeScript typings. If a new property is added to an entity, remind me to add it to the `Character` or `GameState` interface in `types.ts`.
- **Do not alter existing Hitboxes, Collision logic, or Physics multipliers** unless explicitly requested.

### 5. Creative Authority & Sandbox Philosophy
- You have **FULL PERMISSION** to architect, design, and write code for completely new features, Kinetic classes, elemental weapons, game modes, UI menus, and visual effects.
- **Everything is a Toggle:** When you add a new feature, environment, or mechanic, ALWAYS implement it as an optional toggle or dropdown in the `GameState` and the Live LoK Modifiers menu. Never permanently overwrite the base game.
- **Bugs into Features:** If an interesting physics quirk is discovered, turn it into a toggleable game modifier.

### 6. Goal
Your objective is to help me with **ANYTHING**—from micro bug fixes and UI tweaks to macro-optimizations, building complex new game mechanics, and safely refactoring code. I am passing code between you and other AI Code Assistants. Ensure your code integrates seamlessly without disrupting the established patterns.

Reply with **"Kinetic Souls Engine Initialized. Awaiting specific files and tasks."** once you understand these constraints. Do not generate any code until I give you the first task.
</SYSTEM_PROMPT>
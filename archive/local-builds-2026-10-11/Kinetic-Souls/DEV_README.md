# Kinetic Souls - Development Setup

Welcome to the Kinetic Souls project workspace! This is a fully prepared development environment.

## Project Overview

**Kinetic Souls** is a 2D 1v1 retro battle game built with React + HTML5 Canvas. It's a pnpm monorepo with multiple packages:

### Main Applications
- **`artifacts/kinetic-souls`** - The main game (React single-page app, no backend required)
- **`artifacts/api-server`** - Express API server for leaderboards and backend features
- **`artifacts/mockup-sandbox`** - Sandbox for UI mockups and experiments

### Shared Libraries
- **`lib/db`** - Drizzle ORM + PostgreSQL database layer
- **`lib/api-spec`** - OpenAPI 3.1 specification + Orval codegen
- **`lib/api-client-react`** - Generated React Query hooks
- **`lib/api-zod`** - Generated Zod validation schemas

## Quick Start

### Prerequisites
- Node.js 24+ (check with `node --version`)
- pnpm 10+ (install with `npm install -g pnpm` if needed)

### Installation

Dependencies are already installed. To reinstall:
```bash
pnpm install
```

### Running the Game

To play the Kinetic Souls game:
```bash
pnpm --filter @workspace/kinetic-souls run dev
```
Then open http://localhost:5173 in your browser.

**Controls:**
- **PvP Mode:** P1 presses `A` to spawn, P2 presses `L` to spawn
- **PvB Mode (vs Bot):** Your player auto-spawns, bot spawns automatically

### Running the API Server

To run the backend API server:
```bash
pnpm --filter @workspace/api-server run dev
```
The server will listen on the port specified by the `PORT` environment variable (default: 3000).

## Available Commands

All commands are available in VS Code via Tasks (Ctrl+Shift+B or View → Run Task):

| Command | Task Name | Purpose |
|---------|-----------|---------|
| `pnpm install` | Install Dependencies | Install all node modules |
| `pnpm run typecheck` | Typecheck | Run TypeScript compiler checks |
| `pnpm run build` | Build All | Build entire monorepo |
| Dev: Kinetic Souls Game | Dev: Kinetic Souls Game | Run game dev server with hot reload |
| Dev: API Server | Dev: API Server | Run API server with auto-restart |
| `pnpm --filter @workspace/kinetic-souls run build` | Build: Kinetic Souls | Production build of the game |
| `pnpm --filter @workspace/api-server run build` | Build: API Server | Production build of API |

### Run Tasks in VS Code

Press `Ctrl+Shift+B` or go to **View → Run Task** and select:
- "Dev: Kinetic Souls Game" - Start the game dev server
- "Dev: API Server" - Start the API server
- "Typecheck" - Check for TypeScript errors
- "Build All" - Full production build

## Project Structure

```
Kinetic-Souls/
├── artifacts/                  # Deployable apps
│   ├── kinetic-souls/         # Main game
│   ├── api-server/            # Express API
│   └── mockup-sandbox/        # UI sandbox
├── lib/                        # Shared libraries
│   ├── db/                    # Database layer
│   ├── api-spec/              # OpenAPI spec
│   ├── api-client-react/      # Generated API client
│   └── api-zod/               # Generated validation
├── scripts/                    # Utility scripts
├── .vscode/                   # VS Code config
│   ├── tasks.json            # Development tasks
│   ├── settings.json         # Workspace settings
│   └── launch.json           # Debug configurations
└── pnpm-workspace.yaml        # Monorepo config
```

## Development Workflow

### Making Changes

1. **Edit code** in your editor - changes auto-save
2. **Run typecheck** to catch errors: `pnpm run typecheck`
3. **Test locally** by running the dev server
4. **Build for production** with `pnpm run build`

### Key Files

- **Game logic:** `artifacts/kinetic-souls/src/pages/KineticSouls.tsx` (all game logic in one file!)
- **API routes:** `artifacts/api-server/src/routes/`
- **Database schema:** `lib/db/src/schema/`

## TypeScript & Monorepo Notes

⚠️ **Important:** Always run `pnpm run typecheck` from the root, not from individual packages. The monorepo uses TypeScript project references, and the build order matters.

## Debugging

### Debug the API Server
1. Press `F5` or go to Run → Start Debugging
2. Select "Debug: API Server"
3. Set breakpoints in the code
4. The debugger will attach and you can step through code

### Console Debugging
Open browser DevTools (F12) when running the game to see:
- Console logs from the game
- Network calls to the API
- Performance metrics

## Environment Variables

### Kinetic Souls Game
No environment configuration needed - runs entirely in the browser.

### API Server
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string (required in production)

## Troubleshooting

### Issue: "Port already in use"
If port 5173 (game) or 3000 (API) is already in use:
```bash
# Find and kill the process
lsof -i :5173      # Find what's using port 5173
kill -9 <PID>      # Kill the process
```

### Issue: TypeScript errors after changes
Always run `pnpm run typecheck` to rebuild the entire project dependency graph.

### Issue: Stale node_modules
```bash
pnpm install
# Or to do a hard reset:
rm -rf node_modules
pnpm install
```

## Next Steps

1. ✅ Environment is set up and ready
2. Run `pnpm --filter @workspace/kinetic-souls run dev` to start playing
3. Open `artifacts/kinetic-souls/src/pages/KineticSouls.tsx` to explore the game code
4. Check the game features by adjusting settings and modifiers
5. Start making changes and rebuilding features!

## Resources

- **Replit Documentation:** See `replit.md` in the root for more details
- **Version Info:** Check `VERSIONS.md` for dependency versions
- **Git Status:** Run `git status` to check what files have changed

## Questions?

When you need help:
1. Check the inline comments in `KineticSouls.tsx` - the game logic is well-documented
2. Review `replit.md` for architecture details
3. Run `pnpm run typecheck` to identify type issues
4. Check VS Code problems panel (Ctrl+Shift+M) for all errors

---

**Happy coding! 🎮**

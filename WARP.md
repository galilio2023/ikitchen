# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Voyager_OS** is a Next.js 16 application for industrial kitchen design with a futuristic "Obsidian Glass" aesthetic. The system allows culinary engineers to create kitchen projects, manipulate spatial units (windows, vents, sockets) in a 3-pane editor, and generate designs using AI.

## Development Commands

### Development & Build
```powershell
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Run production server
```

### Linting
```powershell
npm run lint         # Run ESLint
```

### Database Operations
```powershell
npx tsx scripts/seed.ts    # Seed database with initial project data
```

**Important**: Database seeding requires `.env.local` with valid `MONGODB_URI`.

## Architecture & Key Concepts

### Data Model: Dual Schema Pattern
The application separates project metadata from technical spatial data:

- **Project Model** (`src/models/Project.ts`): High-level metadata (name, client, status, progress, owner)
- **Kitchen Model** (`src/models/Kitchen.ts`): Spatial data (walls, obstacles, appliances, standards)
- **Relationship**: Kitchen references Project via `projectId` field

### State Management: Redux Toolkit
All application state lives in Redux (`src/lib/store.ts`):

- **kitchenSlice** (`src/lib/features/kitchens/kitchenSlice.ts`): Manages kitchen data, obstacles, walls, selected items
- **uiSlice** (`src/lib/features/ui/uiSlice.ts`): Manages UI state (modals, sidebar)

**Key Async Thunks**:
- `fetchAllKitchens`: GET `/api/projects` - retrieves all projects
- `fetchKitchenById`: GET `/api/projects/[id]` - retrieves single project with kitchen data
- `saveKitchen`: PUT `/api/projects/[id]` - persists spatial changes
- `addProjectThunk`: POST `/api/projects` - creates new project+kitchen pair

### Spatial Coordinate System
All spatial units use `ICoordinate` interface (`src/types/kitchen.ts`):
```typescript
{
  x: number;      // Distance from left corner of wall (cm)
  y: number;      // Distance from floor (cm)
  z: number;      // Depth offset from wall face (cm)
  width: number;
  height: number;
  depth: number;  // Physical thickness
}
```

### Component Architecture: "Rule of One"
Every component is isolated to its own file to ensure zero-collision development:

- **Dashboard**: `src/components/dashboard/` - ProjectGrid, MagicStatsCard, SidebarContainer, AICommandInput
- **Kitchen Editor**: `src/components/kitchen/` - SpatialCanvas, SpatialNode, SpatialRegistry, SpatialInspector
- **Modals**: `src/components/modals/` - ModalWrapper, ProjectForm, GlobalCreateProjectModal
- **Project Details**: `src/components/project-details/` - ProjectHero, ProjectInfo

### API Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/projects` | Fetch all projects (no auto-seed; use `scripts/seed.ts` or admin `POST /api/seed`) |
| POST | `/api/projects` | Initialize a new Project + Kitchen node pair |
| GET | `/api/projects/[id]` | Get project metadata |
| PUT | `/api/projects/[id]` | Save kitchen spatial data |
| PATCH | `/api/projects/[id]` | Update project metadata |
| DELETE | `/api/projects/[id]` | Delete project |
| POST | `/api/generate/kitchen` | AI-driven spatial unit generation |
| POST | `/api/generate/design` | Generate complete kitchen design |
| POST | `/api/generate/image` | Generate 3D kitchen visualization |

### Authentication (NextAuth.js)
- Provider: Credentials-based
- Admin bypass: `ibrahimgalal2011@gmail.com` / `@Ibrahim@galal@1`
- Auth config: `src/app/api/auth/[...nextauth]/route.ts`
- Protected routes handled by middleware
- User model includes auto-hashing of passwords on save

### Path Aliases
TypeScript paths configured in `tsconfig.json`:
- `@/*` maps to `src/*`

Example: `import { IKitchen } from '@/types/kitchen'`

## Working with Obstacles

**Obstacle Types** (defined in `src/types/kitchen.ts`):
- `window`, `door`, `socket`, `vent`, `pipe`, `pillar`, `radiator`, `clearance`

**Adding/Modifying Obstacles**:
1. Dispatch `updateObstaclePosition` or `updateObstacleDetails` actions
2. Call `saveKitchen` thunk to persist to database
3. All obstacles are linked to a specific `wallIndex`

## AI Generation System

The system integrates Gemini AI for:
1. Natural language kitchen design generation
2. Spatial unit materialization from text prompts
3. 3D visualization rendering

API key stored in `GEMINI_API_KEY` and `NEXT_PUBLIC_GEMINI_API_KEY` environment variables.

## Styling & Animations

- **Framework**: Tailwind CSS v4 with custom Obsidian Glass aesthetic
- **Theme**: Dual-glow cyan-400 + violet-500
- **Animations**: GSAP 3.14 for entry sequences, zero-gravity floating, magic glow effects
- **Visual Engine**: Starfield background with backdrop-blur-xl panels
- **UI Components**: Radix UI primitives (Dialog, ScrollArea, Separator, Slot)

## Environment Variables

Required in `.env.local`:
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=VOYAGER_OS_SECRET_KEY_99_CYAN
GEMINI_API_KEY=...
NEXT_PUBLIC_GEMINI_API_KEY=...
```

**Warning**: `.env.local` contains sensitive credentials. Never commit this file.

## Code Modification Guidelines

### When Adding New Obstacle Types
1. Update `ObstacleType` in `src/types/kitchen.ts`
2. Update enum in `src/models/Kitchen.ts` schema
3. Add corresponding UI in toolbox/library components

### When Adding New API Endpoints
1. Create `route.ts` in appropriate `src/app/api/` subdirectory
2. Ensure MongoDB connection via `dbConnect()`
3. Follow existing error handling patterns (try/catch with NextResponse)

### When Modifying Redux State
1. Add action in appropriate slice (`kitchenSlice` or `uiSlice`)
2. For async operations, create a new thunk
3. Update TypeScript interfaces if state shape changes

### When Working with Spatial Data
1. Always validate coordinates against wall dimensions
2. Use `wallIndex` to link obstacles to specific walls
3. Call `saveKitchen` thunk after modifications to persist changes
4. Update `updatedAt` timestamp when modifying kitchen data

## Testing Strategy

No test framework is currently configured. When adding tests:
1. Install preferred framework (Jest, Vitest, etc.)
2. Add test scripts to `package.json`
3. Follow Next.js testing best practices for App Router

## Common Pitfalls

1. **MongoDB Connection**: Always call `dbConnect()` in API routes before database operations
2. **Redux Serialization**: Store uses `serializableCheck: false` due to MongoDB ObjectIds
3. **Auth Session**: NextAuth session includes custom `role` and `id` fields via callbacks
4. **Windows PowerShell**: Use PowerShell-compatible commands (e.g., `Get-ChildItem` instead of `ls -la`)
5. **ID Fields**: Kitchen model uses both `_id` (MongoDB) and `id` (frontend). Handle both when matching obstacles.

## Project-Specific Terminology

- **Node**: A project/kitchen entity in the system
- **Uplink**: Login/authentication process
- **Neural Sync**: Database connection/initialization
- **Spatial Registry**: The inventory of all obstacles/appliances
- **Spatial Canvas**: The interactive 2D editor workspace
- **Inspector**: The detail panel for editing object properties
- **Cluster**: The database/project collection

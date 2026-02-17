# Issues Fixed & Features Implemented Log

This document serves as a detailed ledger of all changes, fixes, and feature implementations in the Kitchen SaaS project. Unlike a standard changelog, this file requires deep explanations of the **What**, **Why**, and **How** for every significant change. This ensures that the reasoning behind architectural decisions and bug fixes is preserved for future reference.

---

## [2025-02-23] - Initialization of Architecture & Documentation Standards

### 1. What was done?
We established a comprehensive documentation framework for the project, creating three key files:
*   `PLAN.md`: A master roadmap and status tracker.
*   `code-patterns.md`: A reference for coding standards and architectural patterns.
*   `Gemini.md`: A specific guide for the AI integration.

### 2. Why was it done?
The project is growing in complexity, involving advanced features like AI layout generation and complex client-side state management (Zustand). Without a centralized plan and strict coding standards:
*   **Context Switching:** Developers would lose track of "what's next" or "what's broken."
*   **Inconsistency:** Different parts of the app might use conflicting patterns (e.g., fetching data in Client vs. Server components).
*   **AI Complexity:** The integration with Google Gemini involves specific prompt engineering and error handling that needs to be documented separately to avoid regression.

### 3. How was it implemented?
*   **`PLAN.md`**: Created a structured Markdown file divided into "Executive Summary," "Critical Issues," and "Roadmap." This file acts as the single source of truth for the project's state.
*   **`code-patterns.md`**: Defined rules for:
    *   **Server vs. Client Components:** Enforcing Server Components for data fetching.
    *   **State Management:** Mandating `Zustand` for the editor and `Server Actions` for mutations.
    *   **Styling:** Standardizing on Tailwind CSS + `cn` utility.
*   **`Gemini.md`**: Documented the specific API endpoints (`gemini-pro`), the JSON schema required for layouts, and the exact prompt templates used in `src/services/aiService.ts`.

---

## [2025-02-23] - Drag & Drop Implementation and Code Refactoring

### 1. What was done?
*   **Implemented Drag & Drop:** Added the missing `handleDrop` logic in `KitchenEditor.tsx` to allow users to drag obstacles (windows, doors, etc.) from the sidebar onto the canvas.
*   **Refactored `renderableNodes`:** Extracted the logic for merging obstacles and appliances into a reusable Zustand selector (`selectRenderableNodes`).
*   **Standardized ID Handling:** Updated the selector to robustly handle `_id` vs `id` discrepancies, ensuring consistent ID usage across the application.

### 2. Why was it done?
*   **Critical Functionality:** The editor was previously non-functional as users could not add items to the kitchen plan.
*   **Code Duplication:** The logic to combine and format renderable nodes was duplicated in both `KitchenEditor.tsx` and `UnifiedSidebar.tsx`, leading to maintenance risks.
*   **Type Safety:** Inconsistent handling of MongoDB `_id` and frontend `id` caused potential runtime errors and type mismatches.

### 3. How was it implemented?
*   **`src/lib/store/kitchenStore.ts`**: Added `selectRenderableNodes` as a named export. This selector encapsulates the transformation logic, ensuring that `obstacles` and `appliances` are always merged and formatted identically.
*   **`src/components/kitchen/KitchenEditor.tsx`**:
    *   Replaced the local `useMemo` for `renderableNodes` with `useKitchenStore(selectRenderableNodes)`.
    *   Implemented `handleDrop`:
        *   Retrieves `obstacleType` from `dataTransfer`.
        *   Calculates `x, y` coordinates relative to the canvas.
        *   Uses `DEFAULT_OBSTACLE_DIMENSIONS` to set initial size.
        *   Dispatches `addObstacle` to the store.
*   **`src/components/kitchen/UnifiedSidebar.tsx`**: Replaced the local `useMemo` with the shared `selectRenderableNodes` selector.

---

## [2025-02-23] - Type Consistency & ID Standardization

### 1. What was done?
*   **Backend Standardization:** Updated the Mongoose `Kitchen` schema to automatically transform `_id` to `id` when converting to JSON or Objects.
*   **Frontend Type Enforcement:** Updated TypeScript interfaces (`IKitchen`, `IObstacle`, `IAppliance`) to strictly require `id` as a string and remove optional `_id` fields.
*   **Store Cleanup:** Simplified `selectRenderableNodes` in `kitchenStore.ts` to rely on the guaranteed `id` field, removing the fallback logic for `_id`.

### 2. Why was it done?
*   **Fragility:** The frontend was previously littered with `obs.id || (obs as any)._id?.toString()`, which is error-prone and hard to read.
*   **Best Practice:** Decoupling the frontend from database-specific implementation details (like `_id`) makes the code cleaner and more portable.

### 3. How was it implemented?
*   **`src/models/Kitchen.ts`**: Added `toJSON: { virtuals: true }` and `toObject: { virtuals: true }` options to the schema. Implemented a transform function to explicitly set `id` and remove `_id` and `__v`.
*   **`src/types/kitchen.ts`**: Removed `_id?: string` from interfaces and made `id: string` mandatory.
*   **`src/lib/store/kitchenStore.ts`**: Removed the complex ID resolution logic in `selectRenderableNodes`.

---

## [2025-02-23] - AI Design Application Fixes

### 1. What was done?
*   **Prompt Engineering:** Updated the AI prompt in `kitchenAiService.ts` to explicitly list valid unit types (e.g., "socket", "vent", "window", "door", "appliance", "cabinet").
*   **Server Action Logic:** Updated `applyAiLayout` in `aiActions.ts` to:
    *   Generate a robust UUID for each new appliance.
    *   Explicitly set the `type` field to `'appliance'` to match the `IAppliance` interface.
    *   Ensure `isFixed` defaults to `false`.

### 2. Why was it done?
*   **Data Integrity:** The AI was occasionally returning invalid unit types or missing fields, which caused the frontend to crash or render "ghost" items.
*   **Schema Compliance:** The `IAppliance` interface requires specific fields (`type: 'appliance'`, `id`) that were not being correctly populated by the raw AI response.

### 3. How was it implemented?
*   **`src/services/aiService.ts`**: Added a constraint to the prompt: `Ensure that 'type' in 'units' is one of: ...`.
*   **`src/actions/aiActions.ts`**:
    *   Imported `v4 as uuidv4` from `uuid`.
    *   Mapped over `validatedDesign.units` to construct valid `IAppliance` objects before saving to MongoDB.

---

## [2025-02-23] - Wall Editor Implementation

### 1. What was done?
*   **Store Updates:** Added `addWall`, `updateWall`, and `deleteWall` actions to `kitchenStore.ts`.
*   **UI Implementation:** Completely rewrote `WallManager.tsx` to provide a full CRUD interface for walls.
    *   **Add:** Button to create new walls with default dimensions.
    *   **Edit:** Inline editing mode to modify wall label, length, and height.
    *   **Delete:** Option to remove walls (with confirmation).
    *   **Select:** Tab-based navigation to switch the active wall.

### 2. Why was it done?
*   **Core Feature:** Users need to define the physical structure of their kitchen before placing appliances. Previously, walls were hardcoded or read-only.
*   **Flexibility:** Real-world kitchens have varying dimensions and wall counts. The editor must support this variability.

### 3. How was it implemented?
*   **`src/lib/store/kitchenStore.ts`**: Implemented reducers for adding, updating, and deleting walls. The delete reducer also handles resetting the `activeWallIndex` to prevent out-of-bounds errors.
*   **`src/components/kitchen/WallManager.tsx`**: Built a reactive UI using local state for editing values (`isEditing`, `editValues`). Used `lucide-react` icons for a clean, modern look.

---

## [2025-02-23] - Snapping & Alignment Implementation

### 1. What was done?
*   **Snap Guide Calculation:** Implemented logic in `SpatialCanvas.tsx` to calculate snap lines (x and y guides) based on the edges and centers of existing obstacles and the wall boundaries.
*   **Visual Feedback:** Added visual indicators (cyan lines) to the canvas to show active snap guides.
*   **Drop Logic Update:** Updated `KitchenEditor.tsx` to account for the canvas scale when calculating drop coordinates, ensuring items are placed exactly where the user drops them, regardless of zoom level.

### 2. Why was it done?
*   **Precision:** Users need to align cabinets and appliances precisely. Without snapping, layouts look messy and unprofessional.
*   **UX Improvement:** Visual guides give users confidence that their items are aligned correctly.
*   **Bug Fix:** The previous drop logic did not account for the canvas scale, causing items to "jump" away from the cursor when dropped on a zoomed-out canvas.

### 3. How was it implemented?
*   **`src/components/kitchen/SpatialCanvas.tsx`**:
    *   Added `useMemo` to calculate all possible snap lines (edges, centers, wall boundaries).
    *   Added state `snapLines` to store currently active guides.
    *   Rendered absolute positioned `div` elements for the guides.
*   **`src/components/kitchen/KitchenEditor.tsx`**:
    *   Updated `handleDrop` to calculate the current scale factor dynamically based on the wall length and container width.
    *   Applied the scale factor to the drop coordinates: `x = (clientX - left) / scale`.

---

## [2025-02-23] - Collision Detection Implementation

### 1. What was done?
*   **Validation Logic:** Rewrote `validateKitchenLayout` in `validationService.ts` to implement robust collision detection and out-of-bounds checks.
*   **Algorithm:**
    *   **Out of Bounds:** Checks if any item extends beyond the wall's length or height (0 to length, 0 to height).
    *   **Collision:** Uses Axis-Aligned Bounding Box (AABB) logic to detect overlaps between any two items on the same wall.
*   **Store Integration:** The validation logic is automatically triggered whenever the kitchen state changes (via `kitchenStore.ts`), updating the `validationErrors` array.

### 2. Why was it done?
*   **Realism:** Physical objects cannot occupy the same space. The application must enforce this constraint to generate valid designs.
*   **Data Integrity:** Preventing invalid layouts ensures that the AI and other downstream services receive clean data.

### 3. How was it implemented?
*   **`src/services/validationService.ts`**:
    *   Grouped items by `wallIndex` to optimize checks (only check items on the same wall).
    *   Iterated through all pairs of items to check for AABB overlap: `x1 < x2 + w2 && x1 + w1 > x2 && ...`.
    *   Added checks for `x < 0`, `y < 0`, `x + w > wallLength`, `y + h > wallHeight`.

---

## [2025-02-23] - Undo/Redo History Implementation

### 1. What was done?
*   **Middleware Integration:** Integrated `zundo` (temporal middleware) into the `kitchenStore` to automatically track state changes.
*   **Store Provider Update:** Updated `KitchenStoreProvider.tsx` to expose the temporal store via a new hook `useKitchenHistory`.
*   **UI Controls:** Updated `SpatialControls.tsx` to connect the Undo/Redo buttons to the temporal store's `undo` and `redo` actions. Added keyboard shortcuts (Ctrl+Z, Ctrl+Y).

### 2. Why was it done?
*   **Essential UX:** Design tools require trial and error. Users must be able to revert mistakes easily.
*   **Productivity:** Keyboard shortcuts significantly speed up the workflow for power users.

### 3. How was it implemented?
*   **`src/lib/store/kitchenStore.ts`**: Wrapped the store creator with `temporal(...)`. Configured it to only track changes to `currentKitchen` (ignoring UI state like `activeWallIndex`).
*   **`src/providers/KitchenStoreProvider.tsx`**: Added type definitions for the temporal store and created a `useKitchenHistory` hook to safely access history functions.
*   **`src/components/kitchen/SpatialControls.tsx`**: Used `useKitchenHistory` to get `undo`, `redo`, `pastStates`, and `futureStates`. Implemented `useEffect` for keyboard event listeners.

---

## [2025-02-23] - Loading States Implementation

### 1. What was done?
*   **Editor Loading:** Added a full-screen loading spinner in `KitchenEditor.tsx` for the initial data fetch.
*   **Saving Feedback:** Implemented a "Saving changes..." overlay and button spinner in `KitchenEditor.tsx` to indicate background persistence.
*   **AI Feedback:** Enhanced `AiDesignPanel.tsx` with a dedicated "Designing your kitchen..." overlay and button spinners during AI generation and application.

### 2. Why was it done?
*   **User Confidence:** Users need to know that the application is working, especially during long-running operations like AI generation or database writes.
*   **Perceived Performance:** Smooth transitions and loading indicators make the application feel faster and more responsive.

### 3. How was it implemented?
*   **`src/components/kitchen/KitchenEditor.tsx`**: Used `lucide-react`'s `Loader2` icon and conditional rendering based on `isSaving` and `store.currentKitchen`.
*   **`src/components/kitchen/AiDesignPanel.tsx`**: Added a backdrop blur overlay with a `Sparkles` animation to thematically match the AI feature.

---

## [2025-02-23] - 3D Preview Implementation

### 1. What was done?
*   **3D Scene Integration:** Integrated `@react-three/fiber` and `@react-three/drei` into `VisualizationPanel.tsx` to render a 3D representation of the kitchen.
*   **Scene Construction:**
    *   **Wall/Floor:** Rendered a base plane representing the wall dimensions.
    *   **Items:** Mapped obstacles (red) and appliances (blue) to 3D boxes (`ThreeBox`) positioned according to their 2D coordinates.
    *   **Controls:** Added `OrbitControls` to allow users to rotate, pan, and zoom the 3D view.
*   **Toggle Mode:** Added a toggle to switch between the "AI Render" (image generation) and "3D Preview" (interactive scene) modes.

### 2. Why was it done?
*   **Spatial Understanding:** A 2D plan is often hard for non-professionals to visualize. A 3D view provides immediate spatial context.
*   **Verification:** It allows users to verify depth and vertical positioning (e.g., wall cabinets vs. base cabinets) which might be ambiguous in 2D.

### 3. How was it implemented?
*   **`src/components/kitchen/VisualizationPanel.tsx`**:
    *   Imported `Canvas` from `@react-three/fiber`.
    *   Created a `render3DScene` function that iterates over `currentKitchen.obstacles` and `appliances`.
    *   Used `position={[x + w/2, y + h/2, d/2]}` to correctly center the 3D objects based on their top-left 2D origin.

---

## [2025-02-23] - Bill of Materials (BOM) Implementation

### 1. What was done?
*   **BOM Panel:** Created a new `BomPanel.tsx` component to calculate and display the list of items.
*   **Calculation Logic:** Implemented logic to aggregate appliances by name and estimate cabinetry costs based on wall length.
*   **Export Feature:** Added a "Export to CSV" button that generates a downloadable CSV file of the BOM.
*   **Sidebar Integration:** Added a new "BOM" tab to `UnifiedSidebar.tsx` to access the panel.

### 2. Why was it done?
*   **Business Value:** A design is only useful if it can be executed. The BOM provides the "shopping list" and cost estimate needed for the next step.
*   **User Convenience:** Exporting to CSV allows users to take their design data to external tools (Excel, Google Sheets) or send it to contractors.

### 3. How was it implemented?
*   **`src/components/kitchen/BomPanel.tsx`**:
    *   Used `useMemo` to reactively calculate totals whenever `currentKitchen` changes.
    *   Implemented a simple pricing model (mock data for now) to demonstrate cost estimation.
    *   Created a `handleExport` function using `data:text/csv` URI scheme for client-side file generation.
*   **`src/components/kitchen/UnifiedSidebar.tsx`**: Added the `Receipt` icon and logic to render `BomPanel` when the tab is active.

---

## [2025-02-23] - UX/UI Overhaul

### 1. What was done?
*   **Blueprint Aesthetic:** Implemented a grid background and styled spatial nodes to look like architectural blueprints.
*   **Glassmorphism:** Updated the sidebar to use a translucent, blurred background (`backdrop-blur-md`).
*   **Micro-interactions:** Integrated `framer-motion` for smooth layout transitions, drag feedback, and entry animations.
*   **3D Fidelity:** Enhanced the 3D preview with realistic lighting (`Environment`), shadows (`ContactShadows`), and physically based materials (`meshStandardMaterial`).
*   **Narrative Loading:** Replaced the generic AI loading spinner with a storytelling interface that cycles through steps like "Analyzing floor plan..." to build trust.

### 2. Why was it done?
*   **Trust & Professionalism:** A polished UI builds user confidence in the tool's capabilities, especially for AI-driven features.
*   **Usability:** Visual cues (snapping lines, hover states, cursor changes) make the complex task of spatial planning intuitive.
*   **Delight:** "Juice" (animations, feedback) turns a functional tool into an enjoyable experience.

### 3. How was it implemented?
*   **`src/app/globals.css`**: Added a custom radial gradient utility for the blueprint grid.
*   **`src/components/kitchen/SpatialNode.tsx`**: Switched to `motion.div` and added spring animations for entry/exit.
*   **`src/components/kitchen/VisualizationPanel.tsx`**: Added `Environment` and `ContactShadows` from `@react-three/drei`.
*   **`src/components/kitchen/AiDesignPanel.tsx`**: Implemented a `useEffect` loop to cycle through loading messages.

---

## [2025-02-23] - Transition to "Draw & Edit" Interaction Model

### 1. What was done?
*   **Replaced Drag & Drop:** Removed the drag-and-drop functionality from `KitchenEditor` and `SpatialCanvas`.
*   **Implemented Drawing:** Added "Click & Drag" drawing logic to `SpatialCanvas` to allow users to draw rectangles directly on the wall.
*   **Tool Selector:** Refactored `ObstacleToolbox` to act as a tool selector (Window, Door, Clear Zone) instead of a drag source.
*   **Hybrid Approach:** Introduced a "Clear Zone" tool to allow users to define generic constraints alongside semantic architectural elements.

### 2. Why was it done?
*   **Precision:** Drawing allows users to define the exact size and position of an item in one go, which is more natural for architectural planning than dragging a fixed-size icon.
*   **Stability:** The previous drag-and-drop implementation had issues with scaling and coordinate transformation. The new drawing logic is simpler and more robust.
*   **AI Context:** By allowing users to draw "Clear Zones", we can provide better constraints to the AI (e.g., "don't put cabinets here") without confusing it with generic "obstacles".

### 3. How was it implemented?
*   **`src/components/kitchen/SpatialCanvas.tsx`**: Implemented `onMouseDown`, `onMouseMove`, and `onMouseUp` handlers to track drawing state and render a visual preview.
*   **`src/lib/store/kitchenStore.ts`**: Added `activeTool` state to track which tool is currently selected.
*   **`src/components/kitchen/ObstacleToolbox.tsx`**: Updated to toggle the `activeTool` in the store.

---

## [2025-02-23] - Database Schema Stabilization & Fixes

### 1. What was done?
*   **Schema Hardening:** Updated `Project` and `Kitchen` schemas to enforce critical relationships (e.g., `Kitchen` must have a `projectId`).
*   **Dev Flexibility:** Made `owner` optional in `Project` schema to allow for easier seeding and development without full auth.
*   **HMR Fix:** Added logic to delete Mongoose models from the cache before recompiling to prevent `OverwriteModelError` and ensure schema updates are applied immediately in development.

### 2. Why was it done?
*   **Data Integrity:** Ensuring that every kitchen is linked to a project prevents orphaned data.
*   **Developer Experience:** The previous strict auth requirements made it hard to test the editor in isolation. The HMR fix prevents the server from crashing when saving schema files.

### 3. How was it implemented?
*   **`src/models/Project.ts` & `src/models/Kitchen.ts`**: Added `if (mongoose.models.ModelName) delete mongoose.models.ModelName;` before the `model()` call.

---

## [2025-02-24] - Robust AI Integration & Production Readiness

### 1. What was done?
*   **Robust AI Parsing:** Implemented regex-based JSON extraction in `aiService.ts` to handle LLM responses that include markdown or conversational text.
*   **Deterministic AI Config:** Set `temperature: 0.1` and `topP: 0.95` to ensure consistent layout generation.
*   **Mock AI Fallback:** Added a mock layout generator that activates if the `GEMINI_API_KEY` is missing or if the API call fails in development.
*   **AI Rate Limiting:** Implemented a database-backed rate limiter (10 requests/hour) to control costs and prevent abuse.
*   **DB Lifecycle Optimization:** Optimized `dbConnect.ts` for serverless environments by disabling `autoIndex` in production and implementing connection pooling.
*   **Migration System:** Built a custom migration runner (`scripts/migrate.ts`) and tracking system to safely evolve the database schema.
*   **Spatial Inspector Polish:** Enhanced the `SpatialInspector.tsx` with precise `+`/`-` controls, 5cm step increments, and input validation.

### 2. Why was it done?
*   **Reliability:** LLMs are non-deterministic; robust parsing and configuration are required to prevent runtime crashes.
*   **Cost Control:** Generative AI APIs are expensive. Rate limiting ensures the project remains financially viable.
*   **Scalability:** The migration system and DB optimizations ensure the app can handle real-world traffic and data evolution without downtime.
*   **UX Precision:** Users need to be able to fine-tune their drawings with exact measurements, not just mouse dragging.

### 3. How was it implemented?
*   **`src/services/aiService.ts`**: Added `extractJson` helper and `AbortController` for 15s timeouts.
*   **`src/actions/aiActions.ts`**: Integrated `UsageLimit` model to track IP-based requests.
*   **`src/lib/dbConnect.ts`**: Added `maxPoolSize: 10` and `autoIndex: false` for production.
*   **`scripts/migrate.ts`**: Created a runner that executes scripts from `scripts/migrations` and records them in a `Migration` collection.
*   **`src/components/kitchen/SpatialInspector.tsx`**: Added `Plus`/`Minus` buttons and enforced a 10cm minimum dimension constraint.

---

## [2025-02-24] - Observability & Dependency Compatibility

### 1. What was done?
*   **Engine Enforcement:** Updated `package.json` to enforce `node >= 20.0.0` to align with Next.js 16 and Mongoose 9 requirements.
*   **Structured Logging:** Enhanced `src/lib/logger.ts` to output structured JSON logs in production (for Datadog/CloudWatch) and readable colorized logs in development.
*   **AI & DB Logging:** Added dedicated `logger.ai()` and `logger.db()` methods to trace high-value operations.

### 2. Why was it done?
*   **Stability:** Ensuring all environments (CI, Dev, Prod) run on the same Node version prevents "works on my machine" bugs.
*   **Debuggability:** Structured logs allow for powerful querying in log management systems, making it easier to diagnose production issues.

### 3. How was it implemented?
*   **`package.json`**: Added `"engines": { "node": ">=20.0.0" }`.
*   **`src/lib/logger.ts`**: Refactored the `log` method to output raw JSON objects in production and added specialized methods for AI and DB events.

---

## [2025-02-24] - AI Resilience & Health Checks

### 1. What was done?
*   **Defensive JSON Parsing:** Enhanced `aiService.ts` with a multi-stage parser that attempts direct parsing, then regex extraction, and finally logs detailed errors if both fail.
*   **Deterministic AI Config:** Set `temperature: 0.0` in `aiService.ts` to minimize hallucination and ensure consistent outputs for identical inputs.
*   **Health Check Endpoint:** Created `src/app/api/health/route.ts` to provide a quick status check for MongoDB connectivity and AI configuration.

### 2. Why was it done?
*   **Resilience:** AI models can sometimes return "chatty" responses or malformed JSON. The new parser ensures the app doesn't crash on these edge cases.
*   **Operational Visibility:** The health endpoint allows uptime monitors (like UptimeRobot or AWS Route53) to verify that the critical dependencies are healthy.

### 3. How was it implemented?
*   **`src/services/aiService.ts`**: Added `parseResponse` method with try-catch blocks and `logger.error` calls.
*   **`src/app/api/health/route.ts`**: Implemented a Next.js Route Handler that checks `mongoose.connection.readyState` and `hasGeminiAPI`.

---

## [2025-02-24] - Security Hardening & Atomic Rate Limiting

### 1. What was done?
*   **Atomic Rate Limiting:** Refactored `checkAiRateLimit` in `aiActions.ts` to use atomic MongoDB operators (`$inc`, `$set`, `$setOnInsert`).
*   **Robust IP Extraction:** Updated IP identification to correctly handle comma-separated `x-forwarded-for` headers by extracting the first IP.
*   **Production Error Masking:** Implemented generic error messages for production clients while preserving detailed server-side logs.

### 2. Why was it done?
*   **Consistency:** Atomic operations prevent race conditions where multiple concurrent requests could bypass the rate limit.
*   **Security:** Masking internal error messages prevents "information leakage" that could be used by attackers to understand the system's internal structure.
*   **Accuracy:** Correct IP extraction ensures that users behind multiple proxies are still correctly identified for rate limiting.

### 3. How was it implemented?
*   **`src/actions/aiActions.ts`**:
    *   Used `UsageLimit.findOneAndUpdate` with `$inc` and `$set`.
    *   Used `forwardedFor.split(',')[0].trim()` for IP extraction.
    *   Used `isProd ? "Generic Message" : error.message` in catch blocks.

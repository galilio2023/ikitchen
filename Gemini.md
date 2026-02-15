# Project Status & Roadmap

This document tracks the current state of the Kitchen SaaS application, including completed features, known issues, and the future roadmap.

## 1. Current Status: "Draw & Edit" Transition

We have successfully transitioned the kitchen editor from a drag-and-drop model to a more precise "Draw & Edit" interaction model. This allows users to define constraints (windows, doors, clear zones) by drawing directly on the wall canvas, which provides better input for the AI layout generator.

### Completed Features
*   **Database Stability:**
    *   Refined `Project` and `Kitchen` schemas for robustness.
    *   Enforced `projectId` requirement in `Kitchen` to prevent orphaned data.
    *   Made `owner` optional in `Project` to support unauthenticated seeding/dev.
    *   Implemented transactional logic for project creation and deletion.
*   **Kitchen Editor Overhaul:**
    *   **Toolbox:** Refactored to be a tool selector (Window, Door, Socket, Pillar, Clear Zone).
    *   **Canvas:** Implemented "Click & Drag" drawing functionality.
    *   **Visuals:** Added visual preview for the item being drawn.
    *   **Hybrid Approach:** Added "Clear Zone" tool for generic constraints alongside semantic architectural elements.
*   **AI Integration:**
    *   Integrated Google Gemini Pro for layout generation.
    *   Implemented strict JSON validation with Zod.
    *   Added "Apply Layout" functionality to convert AI suggestions into real appliances.
*   **Dashboard:**
    *   Implemented database seeding for quick testing.
    *   Fixed "Empty Dashboard" state and error handling.

### Fixed Issues
*   **TypeScript Errors:** Resolved strict type mismatches in `aiActions.ts`, `AiDesignPanel.tsx`, and page components.
*   **Mongoose Schema Conflicts:** Fixed `OverwriteModelError` by ensuring models are deleted before recompilation in development.
*   **Data Integrity:** Fixed "Project validation failed: owner is required" by updating schema definition and recompiling.
*   **Drag & Drop Bugs:** Replaced the problematic drag-and-drop system with the more stable drawing system.

## 2. Known Issues / Technical Debt

*   **Image Generation:** The `generateAiImage` function currently returns a static placeholder. Needs integration with a real image generation API (DALL-E 3 or Gemini Vision).
*   **Undo/Redo:** The history stack (`zundo`) is implemented but needs thorough testing with the new drawing actions to ensure state consistency.
*   **Wall Navigation:** Currently focuses on a single wall. Multi-wall navigation needs to be verified with the new drawing tools.

## 3. Roadmap

### Phase 1: Refinement (Current)
- [x] Switch to "Draw & Edit" model.
- [x] Stabilize Database Schemas.
- [x] Fix critical TypeScript errors.
- [ ] **Next:** Polish the "Inspect" panel to allow precise resizing of drawn items (e.g., typing "120cm" instead of dragging).

### Phase 2: AI Enhancement
- [ ] **Context-Aware Design:** Pass the new "Clear Zone" constraints to the AI prompt to ensure it respects user-defined walkways.
- [ ] **Real Image Generation:** Connect `generateAiImage` to an actual API.
- [ ] **Style Selection:** Allow users to pick a style (Modern, Rustic, Industrial) before generating.

### Phase 3: Production Readiness
- [ ] **Authentication:** Re-enable strict `owner` requirements in schemas once Auth is fully integrated.
- [ ] **Performance:** Optimize the 3D/2D rendering of the canvas for complex layouts.
- [ ] **BOM Export:** Finalize the Bill of Materials generation based on the applied AI layout.

---
*Last Updated: 2024-05-22*

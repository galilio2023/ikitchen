# Code Patterns & Development Standards

This document outlines the architectural patterns, coding standards, and best practices for the **Kitchen SaaS** project. Adhering to these patterns ensures consistency, maintainability, and scalability.

## 1. Tech Stack Overview

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript (Strict mode)
*   **UI Library:** React 19
*   **Styling:** Tailwind CSS + `clsx` / `tailwind-merge` (via `cn` utility)
*   **State Management:** Zustand (Client), Server Actions (Server)
*   **Database:** MongoDB with Mongoose
*   **Validation:** Zod

## 2. Architectural Patterns

### A. Server Components vs. Client Components
*   **Default to Server Components:** Use Server Components for data fetching (`page.tsx`, `layout.tsx`) and static UI.
*   **Client Components (`'use client'`):** Use only when interactivity (hooks, event listeners, browser APIs) is required.
*   **Pattern:** Wrap interactive logic in specific components (e.g., `KitchenEditor`, `UnifiedSidebar`) and keep the page shell as a Server Component.

### B. Data Fetching & Mutations
*   **Fetching:** Fetch data directly in Server Components using Mongoose models.
    ```typescript
    // src/app/(dashboard)/projects/page.tsx
    async function getProjects() {
      await dbConnect();
      return await Project.find({}).lean();
    }
    ```
*   **Mutations:** Use **Server Actions** (`src/actions`) for all data writes. Do not use API routes unless absolutely necessary (e.g., webhooks).
    ```typescript
    // src/actions/projectActions.ts
    'use server';
    export async function createProject(formData: FormData) { ... }
    ```

### C. State Management (Zustand)
*   **Scope:** Use Zustand for complex client-side state (e.g., the Kitchen Editor).
*   **Provider Pattern:** Wrap the store in a Context Provider (`KitchenStoreProvider`) to initialize it with server-side data (hydration).
    ```typescript
    // src/providers/KitchenStoreProvider.tsx
    export const KitchenStoreProvider = ({ children, initialState }) => { ... }
    ```
*   **Selectors:** Use selectors to subscribe only to specific slices of state to prevent unnecessary re-renders.

## 3. Database & Models

### A. Mongoose Schemas
*   **Location:** `src/models`
*   **Pattern:** Define both a TypeScript Interface and a Mongoose Schema.
*   **Virtuals:** Use virtuals to map `_id` to `id` for frontend consumption.
    ```typescript
    schema.virtual('id').get(function() { return this._id.toHexString(); });
    schema.set('toJSON', { virtuals: true });
    ```

### B. Database Connection
*   **Singleton:** Use `lib/dbConnect.ts` to ensure a single cached connection across hot reloads in development.

## 4. Component Structure

### A. File Organization
*   `src/components/kitchen`: Components specific to the Kitchen Editor domain.
*   `src/components/dashboard`: Components for the dashboard/project management.
*   `src/components/ui`: Reusable, generic UI components (buttons, modals).

### B. Props Interface
*   Define interfaces explicitly.
*   Prefix interfaces with component name if specific (e.g., `SpatialNodeProps`).

## 5. Styling (Tailwind CSS)

*   **Utility First:** Use Tailwind utility classes for layout and spacing.
*   **Conditional Classes:** Use the `cn` utility (Classnames + Tailwind Merge) for dynamic classes.
    ```typescript
    import { cn } from '@/lib/utils';
    <div className={cn("bg-white", isSelected && "border-blue-500")} />
    ```

## 6. Error Handling

*   **Server Actions:** Return a standardized object: `{ success: boolean, error?: string, data?: any }`.
*   **UI Feedback:** Use `sonner` (toast notifications) for user feedback on success/failure.
*   **Validation:** Use **Zod** schemas (`src/lib/validations.ts`) to validate inputs on both client and server.

## 7. AI Integration

*   **Service Layer:** Encapsulate AI logic in `src/services/aiService.ts`.
*   **Prompt Engineering:** Keep prompts consistent and versioned if possible.
*   **Response Parsing:** Always validate AI JSON responses with Zod before using them.

---
*Refer to this document during code reviews to ensure alignment with project standards.*

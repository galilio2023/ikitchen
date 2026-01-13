# 🌌 Voyager_OS | Neural Kitchen SaaS

[![Status](https://img.shields.io/badge/STATUS-NOMINAL-06b6d4?style=for-the-badge&logo=opsgenie)](https://github.com)
[![Version](https://img.shields.io/badge/VERSION-4.5.0-8b5cf6?style=for-the-badge)](https://github.com)
[![Engine](https://img.shields.io/badge/ENGINE-GSAP_3.12-white?style=for-the-badge)](https://gsap.com)
[![Build](https://img.shields.io/badge/BUILD-PASSED-emerald-500?style=for-the-badge)](https://github.com)

> **Voyager_OS** is a high-fidelity spatial computing platform for industrial kitchen design. Built with a 2026 "Obsidian Glass" aesthetic, it allows culinary engineers to materialize kitchen nodes using AI, manipulate spatial units in a GSAP-powered canvas, and manage complex project registries with neural precision.

---

## 🚀 1. Project Capabilities (Current Status)

The system is currently in its **Final Launch Phase**. Key functional pillars include:

-   **Neural Authentication**: Secure session management with NextAuth.js, featuring an Admin bypass and specialized role injection.
-   **Atomic Dashboard**: A bento-grid interface that provides real-time cluster status, active node monitoring, and project synchronization.
-   **3-Pane Spatial Editor**: A high-performance workspace for architectural manipulation.
    -   **Registry (Left)**: Live tracking of all spatial units (Vents, Sockets, Windows).
    -   **Canvas (Center)**: Interactive, grid-snapping workspace with zero-gravity animations.
    -   **Inspector (Right)**: Fine-tuning of dimensional parameters and material properties.
-   **Neural Core (AI Generation)**: A natural language interface that translates architectural prompts into structured spatial coordinates.
-   **Data Handshake**: A robust Mongoose-driven relationship between high-level **Projects** and technical **Kitchen** documents.

---

## 🛠️ 2. Fully Detailed Usage Guide

### Step 1: Uplink (Login)
1.  Navigate to `/login`.
2.  Enter credentials. 
    -   *Admin Bypass*: `ibrahimgalal2011@gmail.com` | `voyager`.
3.  The system will initiate a **Neural Sync** and redirect you to the main Cluster.

### Step 2: Node Initialization (Creating a Project)
1.  Click **'Initialize_Node'** in the Sidebar or Dashboard.
2.  Input the **Client Identifier** and **Communication Uplink** (Phone).
3.  The system will generate a new Project node and its associated Kitchen schema, then redirect you to the **Spatial Registry**.

### Step 3: Spatial Materialization (The Editor)
1.  **Manual Input**: Drag spatial units (Windows, Vents, Sockets) from the Registry into the **Spatial Canvas**.
2.  **AI Input**: Type a command in the **AI Command Input** (e.g., *"Generate three sockets at 120cm height"*).
3.  **Manipulation**: Click a unit on the Canvas to highlight it. Use the **Inspector** on the right to adjust width, height, and depth.
4.  **Auto-Save**: All changes are persisted via the `saveKitchen` Redux thunk to the MongoDB cluster.

### Step 4: System Monitoring
-   Return to the **Dashboard** to see the project's progress percentage, status (Draft, Designing, etc.), and visual preview.

---

## 🏗️ 3. Architecture: The 'Rule of One'

Voyager_OS follows a strict **Atomic Refactor** philosophy. Every component is isolated to its own file to ensure zero-collision development and high maintainability.

### Accessing the System
To access the **Residence Al Maadi** project node or the main Cluster, you must authenticate:
- **Login Endpoint**: `/login`
- **Identifier**: `ibrahimgalal2011@gmail.com`
- **Secure Key**: `voyager`

### File Structure Map

| Directory | Role | Key Files / Components |
| :--- | :--- | :--- |
| `src/app` | Routing & API Layers | `layout.tsx` (Root), `middleware.ts` (Guard), `api/` (Neural Bridge) |
| `src/components/dashboard` | Cluster Management | `ProjectGrid.tsx`, `MagicStatsCard.tsx`, `SidebarContainer.tsx`, `AICommandInput.tsx` |
| `src/components/kitchen` | Spatial Editor | `SpatialCanvas.tsx`, `SpatialNode.tsx`, `SpatialRegistry.tsx`, `SpatialInspector.tsx` |
| `src/components/modals` | Data Entry | `ModalWrapper.tsx`, `ProjectForm.tsx`, `GlobalCreateProjectModal.tsx` |
| `src/components/project-details` | Node Overview | `ProjectHero.tsx`, `ProjectInfo.tsx` |
| `src/lib/features` | Neural State (Redux) | `kitchenSlice.ts` (Data), `uiSlice.ts` (Interface) |
| `src/models` | Data Schemas | `Project.ts` (Metadata), `Kitchen.ts` (Spatial) |
| `src/types` | Type Definitions | `kitchen.ts` (Interfaces) |

---

## 🧬 4. Data Model: The Neural Link

The project utilizes a dual-model system to separate metadata from technical spatial data.

### IProject (Metadata) - `src/models/Project.ts`
-   `name`: Registry name.
-   `client`: Client identifier.
-   `status`: Current phase (Draft/Designing/Installed).
-   `progress`: 0-100% sync status.
-   `owner`: Reference to the `User` document.

### IKitchen (Spatial Data) - `src/models/Kitchen.ts`
-   `projectId`: Foreign key linking to the parent Project.
-   `walls`: Architectural boundaries (Length, Height, Thickness).
-   `obstacles`: Spatial nodes (Vents, Windows, Sockets) with `position {x, y, z, width, height, depth}`.
-   `standards`: Global kitchen dimensions.

---

## 📡 5. API Registry (Endpoints)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | Fetches all nodes. Performs intelligent **Auto-Seeding** if the cluster is empty. |
| `POST` | `/api/projects` | Initializes a new Project + Kitchen node pair. |
| `GET` | `/api/projects/[id]` | Retrieves metadata for a specific project node. |
| `GET` | `/api/kitchens/[id]` | Retrieves full spatial data. Uses `.populate('projectId')` to bridge metadata. |
| `PUT` | `/api/projects/[id]` | Persists spatial modifications (walls, obstacles) to the DB. |
| `POST` | `/api/generate/kitchen` | Neural Core endpoint for AI-driven unit generation. |

---

## 🎨 6. Visual Design System

-   **Theme**: `cyan-400` + `violet-500` dual-glow aesthetic.
-   **Transparency**: `bg-[#030014]/90` (Midnight) with `backdrop-blur-xl`.
-   **Motion (GSAP)**:
    -   **Entry Sequence**: Staggered float-ups and slide-ins for all major panels.
    -   **Magic Glow**: Mouse-following radial gradients on all interactive cards.
    -   **Zero-Gravity**: Floating idle animations for spatial units on the canvas.
    -   **Sign-Out**: Coordinated body fade-out sequence.

---

## 🛠️ 7. Installation & Deployment

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Sync**:
    Create `.env.local` in the root:
    ```env
    MONGODB_URI="mongodb+srv://..."
    NEXTAUTH_SECRET="VOYAGER_OS_SECRET_KEY"
    NEXTAUTH_URL="http://localhost:3000"
    AUTH_SECRET="VOYAGER_OS_SECRET_KEY"
    ```
3.  **Database Ignition (Seeding)**:
    ```bash
    npx tsx scripts/seed.ts
    ```
4.  **Terminal Launch**:
    ```bash
    npm run dev
    ```

---

*Voyager_OS © 2026 iKitchen Systems. All Neural Links Reserved.*

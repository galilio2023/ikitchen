# 📖 Voyager_OS | User Guide

Welcome to the **Voyager_OS Neural Interface**. This guide provides the operational procedures for manipulating spatial nodes within the Voyager cluster.

---

## 🔐 1. System Authentication (Uplink)

To initiate a session, navigate to the `/login` terminal.

- **Admin Identifier**: `ibrahimgalal2011@gmail.com`
- **Secure Key**: `voyager`

Upon successful authentication, the system will synchronize your neural link and grant access to the **Residence Al Maadi** project registry.

---

## 🛠️ 2. Spatial Editor Operations

The **Spatial Editor** is a 3-pane high-fidelity workspace designed for architectural precision.

### 📋 The Library & Registry (Left Panel)
- **Node Registry**: Catalogs every active spatial unit. Clicking an item focuses it on the canvas.
- **Hardware Library**: Contains draggable nodes (Windows, Doors, Power, Water, etc.). 
  - **Adding Nodes**: Click a tool to inject it into the workspace, or drag it directly onto the **Spatial Canvas**.

### 🎨 The Canvas (Center Panel)
The **Spatial Canvas** is your primary interaction zone.
- **Manipulation**: Drag and drop spatial units across the Cyan-shadow grid. The system supports both moving existing nodes and dropping new ones from the Library.
- **Visuals**: Units feature "Zero-Gravity" idle animations to indicate an active neural link.
- **Interaction**: Clicking a node directly on the Canvas will select it and reveal its properties in the Inspector.

### 🔍 The Inspector (Right Panel)
The **Node Inspector** reveals the architectural "DNA" of the selected spatial node.
- **Precise Editing**: Manually input exact `POS_X`, `POS_Y`, **Width**, **Height**, and **Depth** values.
- **Persist Changes**: Click **'Persist_Changes'** to save your spatial configuration to the MongoDB cluster.
- **Neural Visualize**: Click **'Neural_Visualize'** to trigger the Gemini AI core. This will generate a high-fidelity 3D render of your kitchen design based on the current spatial parameters.

---

## 🤖 3. Neural AI Core (Command Input)

Located in the Sidebar, the **Neural_AI_Core** allows for automated node materialization.
- **Prompting**: Type natural language commands like *"Generate three sockets at 120cm height"*.
- **Materialization**: The AI will calculate the optimal spatial parameters and inject new nodes directly into your workspace.

---

## 🌌 4. Visual Navigation

- **Starfield Background**: The system utilizes a high-performance Starfield engine. If the background appears solid, ensure all layout containers are set to `bg-transparent`.
- **Obsidian Glass**: Most UI elements utilize "Obsidian Glass" styling (`backdrop-blur-xl`) to allow the background stars to remain visible, providing deep spatial immersion.

---

*Voyager_OS © 2026 iKitchen Systems. Secure your neural link.*

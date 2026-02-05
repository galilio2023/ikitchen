<p align="center">
  <img src="https://avatars.githubusercontent.com/u/110768301?v=4" alt="Project Logo" width="120" height="120" style="border-radius: 50%;">
</p>

<h1 align="center">Kitchen Voyager</h1>

<p align="center">
  An intelligent, enterprise-grade SaaS platform for professional kitchen design and layout generation, powered by AI.
</p>

---

## About The Project

Kitchen Voyager is a modern, web-based tool designed to streamline the kitchen design process. It provides an interactive 2D canvas where users can define wall layouts, place obstacles like windows and doors, and then leverage a powerful AI assistant to automatically generate optimal kitchen layouts.

This project has undergone a complete architectural overhaul to align with the latest industry best practices, moving from a complex client-side architecture to a lean, performant, and maintainable server-centric model using Next.js Server Actions.

## Key Features

- **AI-Powered Layout Generation:** Automatically generates functional and efficient kitchen layouts based on user-defined constraints.
- **Interactive 2D Spatial Canvas:** A drag-and-drop interface for designing wall structures and placing fixed obstacles.
- **Real-time Validation Engine:** Provides immediate feedback to the user, preventing common design errors like overlapping items.
- **Modern, Server-Centric Architecture:** Built with Next.js 14+ App Router, Server Components, and Server Actions for optimal performance and a simplified developer experience.
- **Themable UI:** Includes a clean, professional, and accessible design system with full support for both light and dark modes.
- **Project Management:** A complete workflow for creating, viewing, and deleting design projects.

## Tech Stack

This project is built with a modern, robust, and scalable technology stack:

- **Framework:** [Next.js](https://nextjs.org/) (v14+ App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Client State Management:** [Zustand](https://github.com/pmndrs/zustand) (for localized client state)
- **AI:** [Google Gemini](https://ai.google.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A MongoDB database instance (local or cloud-based)
- A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add the following variables:
    ```env
    # Your MongoDB connection string
    MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>

    # Your Google Gemini API Key
    GEMINI_API_KEY=AIzaSy...
    ```
4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architectural Overview

The application's architecture has been intentionally refactored to be server-centric, leveraging the latest features of Next.js to maximize performance and simplify the codebase.

- **Data Fetching:** Pages and layouts are rendered as **Server Components**, fetching data directly from the database on the server before sending any HTML to the client. This eliminates the need for client-side loading spinners for primary data.
- **Data Mutations:** All data creation, updates, and deletions are handled by **Server Actions**. This removes the need for traditional API routes and client-side state management libraries like Redux, resulting in a significantly simpler and more secure data flow.
- **Client State:** For purely client-side UI state (e.g., managing the state of the interactive kitchen editor), we use a lightweight **Zustand** store. This state is initialized with data fetched on the server, providing the best of both worlds.

---

<div align="center" style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #333;">
  <p style="font-family: sans-serif; font-size: 14px; color: #888;">
    Developed by
  </p>
  <p style="font-family: sans-serif; font-size: 18px; font-weight: bold; margin-top: 0.5rem; background: linear-gradient(to right, #FFF, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
    Tablawy
  </p>
  <a href="https://vercel.com/?utm_source=kitchen-voyager&utm_campaign=oss" target="_blank" rel="noopener noreferrer">
    <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg" alt="Powered by Vercel" style="margin-top: 1rem;" />
  </a>
</div>

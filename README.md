<p align="center">
  <img src="https://avatars.githubusercontent.com/u/110768301?v=4" alt="iKitchen Logo" width="140" height="140" style="border-radius: 50%; border: 2px solid #333;">
</p>

<h1 align="center">iKitchen</h1>

<p align="center">
  <b>Intelligent Kitchen Design, Simplified.</b>
  <br />
  An enterprise-grade SaaS platform for professional kitchen design, powered by a server-centric architecture and an AI layout generation engine.
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Next.js-14%2B-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/MongoDB-4.4-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</p>

<br>

<p align="center">
  <em>The iKitchen dashboard, showcasing a clean, professional, and data-driven interface.</em>
</p>

---

## 🚀 About iKitchen

iKitchen is a modern, web-based tool designed to revolutionize the kitchen design workflow. It provides an interactive 2D spatial editor where designers can quickly map out wall dimensions, place structural obstacles like doors and windows, and then leverage a powerful AI assistant to automatically generate functional and efficient kitchen layouts.

This project was architected from the ground up to be a showcase of modern web development best practices. It eschews traditional client-heavy architectures in favor of a lean, performant, and maintainable **server-centric model** using Next.js Server Actions, resulting in a faster user experience and a dramatically simplified codebase.

## ✨ Key Features

- **AI-Powered Layout Generation:** Automatically generates functional and efficient kitchen layouts based on user-defined constraints and design principles.
- **Interactive 2D Spatial Canvas:** A fluid drag-and-drop interface for designing wall structures and placing fixed obstacles with pixel-perfect precision.
- **Real-time Validation Engine:** Provides immediate, intelligent feedback to the user, preventing common design errors like overlapping items before they happen.
- **Modern, Server-Centric Architecture:** Built with the Next.js App Router, Server Components, and Server Actions for optimal performance and a superior developer experience.
- **Themable UI:** A clean, professional, and accessible design system with full support for both light and dark modes, built on a centralized Tailwind CSS v4 configuration.
- **Project Management:** A complete workflow for creating, viewing, and deleting design projects, all powered by our robust server-side architecture.

## 🛠️ Under the Hood: The Architecture

The architecture of iKitchen is its most important feature. It is intentionally designed to be simple, powerful, and scalable.

### 1. Server-Centric Data Flow

We have completely eliminated the need for traditional REST or GraphQL API routes for our frontend. All data fetching and mutations are handled by **Server Components** and **Server Actions**.

**How it Works:**
- **Data Fetching:** Pages like the Dashboard are **Server Components**. They fetch data directly from the database on the server *before* any HTML is sent to the client. This means faster page loads and no client-side loading spinners for primary content.
- **Data Mutations:** When a user performs an action (like creating or deleting a project), the component calls a **Server Action**—a simple `async` function marked with `'use server'`. Next.js automatically creates a secure RPC endpoint for this function, completely abstracting away the need for `fetch` calls, API routes, or manual state management.

```
Client Component (Form) ---calls---> Server Action ---updates---> Database ---revalidates---> Updated UI
```

### 2. Lean State Management

With the removal of client-side data fetching, we were able to **completely delete Redux**. This dramatically reduced the project's complexity and bundle size.

- **Server State:** All data that comes from the database is considered "server state" and is managed by Server Components and Server Actions.
- **Client State:** For the small amount of purely client-side UI state (e.g., the state of the interactive kitchen editor), we use **Zustand**. It is lightweight, unopinionated, and provides a localized store that doesn't pollute the global scope, making it the perfect tool for managing the editor's complex state without the boilerplate of Redux.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4 `@theme` architecture)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Client State:** [Zustand](https://github.com/pmndrs/zustand)
- **AI Engine:** [Google Gemini](https://ai.google.dev/)
- **UI:** [Lucide React](https://lucide.dev/) for icons, [Sonner](https://sonner.emilkowal.ski/) for notifications.

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A MongoDB database instance (local or cloud-based)
- A Google Gemini API Key

### Installation & Setup

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
    MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<database>"

    # Your Google Gemini API Key
    GEMINI_API_KEY=AIzaSy...
    ```
4.  **Seed the database (Optional):**
    To populate your database with initial demo data for testing, run the following command:
    ```sh
    npx tsx scripts/seed.ts
    ```
5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

<div align="center" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid hsl(var(--border));">
  <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: hsl(var(--muted-foreground));">
    Developed with passion by
  </p>
  <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 600; margin-top: 0.25rem; background: linear-gradient(to right, hsl(var(--foreground)), hsl(var(--muted-foreground))); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
    Tablawy
  </p>
  <a href="https://vercel.com/?utm_source=ikitchen&utm_campaign=oss" target="_blank" rel="noopener noreferrer" style="margin-top: 1.5rem; display: inline-block;">
    <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg" alt="Powered by Vercel" />
  </a>
</div>

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
    <img src="https://img.shields.io/badge/Next.js-16%2B-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Prisma-39827F?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
</p>

<br>

<p align="center">
  <em>The iKitchen dashboard, showcasing a clean, professional, and data-driven interface.</em>
</p>

---

## 🚀 About iKitchen (B2C Pivot — Egypt & Gulf Market)

iKitchen has pivoted from a complex CAD planner into a high-converting, localized B2C kitchen planning experience optimized specifically for the Egyptian and Gulf consumer. Rather than expecting users to design complex structures, iKitchen guides them through a quick **3-step mobile-first configurator** to estimate price ranges, select materials, and automatically draft a personalized WhatsApp request to book a free site survey (`رفع مقاسات`).

The platform supports a dual-mode workflow:
- **Consumer Mode (B2C):** A frictionless 3-step configurator in [B2cConfigurator.tsx](file:///C:/Users/PC/Desktop/ikitchen/src/components/kitchen/B2cConfigurator.tsx) tailored for high-speed engagement on mobile, ending with a WhatsApp survey booking.
- **Showroom / Sales Mode (B2B):** A comprehensive administration dashboard in [DashboardClient.tsx](file:///C:/Users/PC/Desktop/ikitchen/src/components/dashboard/DashboardClient.tsx) where showroom staff can review projects, configure custom details, track pricing tiers, and manage customer leads.

## ✨ Key Features

- **3-Step B2C Configurator:** A fast, mobile-first design journey where users choose their Kitchen Role (Show vs. Service), select from style cards (`Acrylic`, `High Gloss`, `Khashm`, etc.), define shape layouts (`I`, `L`, `U`, `Parallel`), and get instant estimated price ranges.
- **WhatsApp Survey Funnel:** Integrates direct WhatsApp triggers. It compiles a highly detailed, natural Arabic message detailing their configuration to instantly book a free site survey (`معاينة مجانية ورفع مقاسات`).
- **AI-Powered WhatsApp Copywriter:** Leverages Google Gemini in [aiService.ts](file:///C:/Users/PC/Desktop/ikitchen/src/services/aiService.ts) to automatically draft personalized, natural-sounding Arabic messages based on user specifications to send to the sales rep.
- **Dual-Language i18n:** Full Arabic (RTL) and English (LTR) localization support with a persistent language toggle at the top level.
- **Smart Offline Fallback:** Fully operational local pricing and copywriting engine that serves as an instant fallback if AI or external API services are offline.
- **Robust Modern Architecture:** Constructed with a server-centric approach using Next.js 16 Server Components and Server Actions, completely replacing heavy client-side APIs and Redux with Zustand and Prisma.

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

### 2. State & Database Layer

- **Relational Integrity with Prisma:** Our relational schemas are defined using Prisma ORM in [schema.prisma](file:///C:/Users/PC/Desktop/ikitchen/prisma/schema.prisma) with PostgreSQL, supporting users, project instances, layout configurations, and raw AI log audits.
- **Lightweight UI Store:** We use **Zustand** to manage dynamic configurator state locally, avoiding the heavy boilerplate of Redux.
- **Secure Authentication:** User and session management is handled out of the box using **Better Auth**, ensuring secure access control.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router v16)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4 `@theme` architecture)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Client State:** [Zustand](https://github.com/pmndrs/zustand)
- **AI Engine:** [Google Gemini](https://ai.google.dev/)
- **UI:** [Lucide React](https://lucide.dev/) for icons, [Sonner](https://sonner.emilkowal.ski/) for notifications.

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20 or later)
- npm or yarn
- A PostgreSQL database instance
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
    # Your PostgreSQL connection string for Prisma
    DATABASE_URL="postgresql://username:password@localhost:5432/ikitchen?schema=public"

    # Better Auth config
    BETTER_AUTH_SECRET="a_random_32_character_secret"
    BETTER_AUTH_URL="http://localhost:3000"

    # Your Google Gemini API Key
    GEMINI_API_KEY=AIzaSy...
    ```
4.  **Synchronize & Seed the database:**
    Initialize the database using Prisma migrate/push and populate it with seed data:
    ```sh
    npx prisma db push
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
    <img src="https://raw.githubusercontent.com/abumalick/powered-by-vercel/master/powered-by-vercel.svg" alt="Powered by Vercel" />
  </a>
</div>

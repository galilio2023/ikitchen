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

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Client State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **AI:** [Google Gemini](https://ai.google.dev/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Passwordless)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A MongoDB database
- A Google Gemini API Key
- An SMTP server for sending magic links (e.g., SendGrid, Postmark, or a simple Gmail account for development)

### Installation

1.  **Clone the repository**
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following:
    ```env
    # Your MongoDB connection string
    MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<database>"
    
    # Your Google Gemini API Key
    GEMINI_API_KEY=AIzaSy...
    
    # NextAuth.js secret (generate a random string)
    NEXTAUTH_SECRET=your_super_secret_key_here
    NEXTAUTH_URL=http://localhost:3000
    
    # Email Provider (for passwordless login)
    EMAIL_SERVER_HOST=smtp.example.com
    EMAIL_SERVER_PORT=587
    EMAIL_SERVER_USER=user@example.com
    EMAIL_SERVER_PASSWORD=password
    EMAIL_FROM=noreply@yourdomain.com
    ```
4.  **Seed the database (Optional):**
    To populate your database with initial demo data, run:
    ```sh
    npx tsx scripts/seed.ts
    ```
5.  **Run the development server:**
    ```sh
    npm run dev
    ```

---

<div align="center" style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #333;">
  <p style="font-family: sans-serif; font-size: 14px; color: #888;">
    Developed by
  </p>
  <p style="font-family: sans-serif; font-size: 18px; font-weight: bold; margin-top: 0.5rem; background: linear-gradient(to right, #FFF, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
    Tablawy
  </p>
</div>

import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import Starfield from "@/components/StarField";
import StoreProvider from "@/lib/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: "%s | KITCHEN_VOYAGER",
        default: "KITCHEN_VOYAGER | Neural_3D_OS",
    },
    description: "Advanced 3D kitchen modeling and project management system.",
};

// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark selection:bg-magic-purple/30 overflow-hidden">
        {/* Added overflow-hidden to html to prevent any bounce/stretch */}
        <body className={`${inter.className} bg-black text-white antialiased h-screen relative overflow-hidden`}>
        <StoreProvider>
            <Starfield starCount={80} />
            {/* Changed min-h-screen to h-full.
                       This ensures the child SidebarLayout (h-screen) has a stable container.
                    */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </StoreProvider>
        </body>
        </html>
    );
}

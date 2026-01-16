import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import Starfield from "@/components/StarField";
import StoreProvider from "@/lib/StoreProvider";
import GlobalCreateProjectModal from "@/components/modals/GlobalCreateProjectModal";

import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ 
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        template: "%s | KITCHEN_VOYAGER",
        default: "KITCHEN_VOYAGER | Neural_3D_OS",
    },
    description: "Advanced_3D_modeling_node.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
        <body className="font-sans bg-background text-foreground antialiased h-dvh relative overflow-hidden">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {/* 1. LAYER 0: Background Visuals (Mounted first, no logic) */}
            <Starfield starCount={120} />

            {/* 2. LAYER 1: State Provider (Wraps the logic tree) */}
            <StoreProvider>
                <GlobalCreateProjectModal />
                {/* 3. LAYER 2: Main Content (The relative z-10 ensures it stays above stars) */}
                <div className="relative z-10 h-dvh  flex flex-col overflow-hidden">
                    {children}
                </div>
            </StoreProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
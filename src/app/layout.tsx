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
    description: "Advanced_3D_modeling_node.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark selection:bg-magic-purple/30">
        <body className={`${inter.className} bg-black text-white antialiased min-h-screen relative overflow-x-hidden`}>

        {/* 1. LAYER 0: Background Visuals (Mounted first, no logic) */}
        <Starfield starCount={80} />

        {/* 2. LAYER 1: State Provider (Wraps the logic tree) */}
        <StoreProvider>

            {/* 3. LAYER 2: Main Content (The relative z-10 ensures it stays above stars) */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {children}
            </div>

        </StoreProvider>

        </body>
        </html>
    );
}
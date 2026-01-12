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
        <html lang="en" className="dark selection:bg-magic-purple/30">
        <body className={`${inter.className} bg-black text-white antialiased min-h-screen relative`}>
        {/* StoreProvider must wrap the content for Redux to work */}
        <StoreProvider>
            <Starfield starCount={80} />

            {/* We use 'fixed' for the Starfield background and
                  let the 'relative' div handle the actual layout flow.
                */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {children}
            </div>
        </StoreProvider>
        </body>
        </html>
    );
}
import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import Starfield from "@/components/StarField";
import StoreProvider from "@/lib/StoreProvider"; // 1. Import the Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: "%s | KITCHEN_VOYAGER",
        default: "KITCHEN_VOYAGER | Neural_3D_OS",
    },
    description: "Advanced 3D kitchen modeling and project management system.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark selection:bg-magic-purple/30">
        <body className={`${inter.className} bg-black text-white antialiased min-h-screen relative`}>
        {/* 2. Redux Engine must wrap the content that uses it */}
        <StoreProvider>
            {/* 3. Starfield sits in the background */}
            <Starfield starCount={80} />

            {/* 4. Children container ensures stars stay behind the UI */}
            <div className="relative z-10">
                {children}
            </div>
        </StoreProvider>
        </body>
        </html>
    );
}
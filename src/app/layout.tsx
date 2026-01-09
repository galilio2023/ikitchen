import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | KitchenMan",
    default: "KitchenMan | Neural 3D Design Studio",
  },
  description: "Advanced 3D kitchen modeling and project management system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-950 text-slate-200 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

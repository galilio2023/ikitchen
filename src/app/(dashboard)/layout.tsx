import SidebarLayout from "@/components/dashboard/sidebar";
import React from "react";

// Removed async and dbConnect to prevent Server-Side blocking
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-obsidian overflow-hidden">
            <SidebarLayout>
                <main className="flex-1 relative h-full overflow-hidden">
                    {children}
                </main>
            </SidebarLayout>
        </div>
    );
}
// src/app/(dashboard)/layout.tsx
import dbConnect from "@/lib/dbConnect";
import SidebarLayout from "@/components/dashboard/sidebar";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Connect to MongoDB
    try {
        await dbConnect();
    } catch (error) {
        // This prevents the whole dashboard from crashing if the DB is down
        console.error("NEURAL_LINK_DATABASE_OFFLINE:", error);
    }

    return (
        /**
         * 1. h-screen + overflow-hidden:
         * Essential to keep the Sidebar fixed while the
         * main workspace handles its own scrolling.
         */
        <div className="flex h-screen w-full bg-obsidian overflow-hidden">

            {/* 2. SidebarLayout:
                Wraps the navigation. Ensure this component uses
                flex-shrink-0 for the sidebar itself.
            */}
            <SidebarLayout>

                {/* 3. Main Content Area:
                    The "flex-1" ensures this fills the remaining width.
                    The "relative" allows your fixed PropertiesPanel to
                    position itself correctly.
                */}
                <main className="flex-1 relative h-full overflow-hidden">
                    {children}
                </main>

            </SidebarLayout>
        </div>
    );
}
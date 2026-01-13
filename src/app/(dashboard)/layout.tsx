import SidebarLayout from "@/components/dashboard/sidebar";
import React from "react";

// Removed async and dbConnect to prevent Server-Side blocking
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarLayout>
            {children}
        </SidebarLayout>
    );
}
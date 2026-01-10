import dbConnect from "@/lib/dbConnect";
import SidebarLayout from "@/components/dashboard/sidebar";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    await dbConnect();




    return (
        /* Removed StoreProvider from here */

            <SidebarLayout>
                {children}
            </SidebarLayout>

    );
}
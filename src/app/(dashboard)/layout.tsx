import { ProjectProvider } from "@/context/ProjectContext";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import SidebarLayout from "@/components/dashboard/sidebar"; // Updated import to your new unified layout
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // 1. Establish DB Connection on the Server
    await dbConnect();

    // 2. Fetch Initial Data for the ProjectProvider
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();

    // 3. Serialize Data (Convert Mongoose ObjectIds to Strings)
    const serializedData = JSON.parse(JSON.stringify(projects));

    return (
        <ProjectProvider initialData={serializedData}>
            {/* We wrap the children in SidebarLayout.
               This file now manages the Sidebar, Navbar, and the scrollable Main area
               with the 2026 Specular Brilliant aesthetic.
            */}
            <SidebarLayout>
                {children}
            </SidebarLayout>
        </ProjectProvider>
    );
}
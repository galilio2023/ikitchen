import React from "react";
import { getProjects } from "@/services/projectService";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
    const projects = await getProjects();

    return (
        <DashboardClient projects={projects} />
    );
}

import React from 'react';
import { getProjects } from '@/services/projectService';
import ProjectsVaultClient from '@/components/dashboard/ProjectsVaultClient';

export default async function ProjectsVaultPage() {
    const projects = await getProjects();

    return (
        <ProjectsVaultClient projects={projects} />
    );
}

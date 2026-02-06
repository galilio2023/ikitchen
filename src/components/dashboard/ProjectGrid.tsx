'use client';

import React from 'react';
import EnterpriseProjectCard from './project-card/EnterpriseProjectCard';
import EmptyDashboard from "./EmptyDashboard";

// The project data is now expected to be a plain object
interface Project {
    id: string;
    clientName?: string;
    status?: string;
    progress?: number;
}

interface ProjectGridProps {
    projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
    if (projects.length === 0) {
        return <EmptyDashboard />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
            {projects.map((project) => (
                <EnterpriseProjectCard
                    key={project.id}
                    project={project}
                />
            ))}
        </div>
    );
}

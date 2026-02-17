import React from 'react';
import { ChefHat, Database } from 'lucide-react';
import { getProjects } from '@/services/projectService';
import ProjectGrid from '@/components/dashboard/ProjectGrid';
import CreateProjectButton from '@/components/CreateProjectButton';

export default async function ProjectsVaultPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <ChefHat size={24} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Project Vault
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                        Manage and organize all your kitchen designs.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                        <Database size={14} />
                        <span>{projects.length} Projects</span>
                    </div>
                    <CreateProjectButton />
                </div>
            </header>

            <ProjectGrid projects={projects} />
        </div>
    );
}

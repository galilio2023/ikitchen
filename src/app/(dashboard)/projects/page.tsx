import React from 'react';
import { ChefHat } from 'lucide-react';
import { getProjects } from '@/services/projectService';
import ProjectGrid from '@/components/dashboard/ProjectGrid';
import MagicStatsCard from '@/components/dashboard/MagicStatsCard';

export default async function ProjectsVaultPage() {
    const projects = await getProjects();

    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status !== 'completed').length,
        completed: projects.filter(p => p.status === 'completed').length
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/40">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm">
                            <ChefHat size={28} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Project Vault
                        </h1>
                    </div>
                    <p className="text-base text-muted-foreground max-w-2xl">
                        Centralized repository for all your kitchen design projects. Manage, edit, and track progress.
                    </p>
                </div>
            </header>

            {/* Quick Stats Row - Using consistent MagicStatsCard component */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MagicStatsCard
                    title="Total Projects"
                    value={stats.total.toString()}
                    iconName="database"
                    color="blue"
                />
                <MagicStatsCard
                    title="Active Projects"
                    value={stats.active.toString()}
                    iconName="activity"
                    color="amber"
                />
                <MagicStatsCard
                    title="Completed"
                    value={stats.completed.toString()}
                    iconName="zap"
                    color="green"
                />
            </div>

            <div className="bg-card/30 border rounded-2xl p-6 md:p-8 shadow-sm">
                <ProjectGrid projects={projects} showSearch={true} />
            </div>
        </div>
    );
}

import React from 'react';
import { ChefHat, Database, CheckCircle2, Clock } from 'lucide-react';
import { getProjects } from '@/services/projectService';
import ProjectGrid from '@/components/dashboard/ProjectGrid';
import CreateProjectButton from '@/components/CreateProjectButton';

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
                <div className="flex items-center gap-4">
                    <CreateProjectButton size="lg" className="shadow-lg shadow-primary/20" />
                </div>
            </header>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                        <Database size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-card border rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</p>
                        <p className="text-2xl font-bold">{stats.active}</p>
                    </div>
                </div>
                <div className="bg-card border rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
                        <p className="text-2xl font-bold">{stats.completed}</p>
                    </div>
                </div>
            </div>

            <div className="bg-card/30 border rounded-2xl p-6 md:p-8 shadow-sm">
                <ProjectGrid projects={projects} />
            </div>
        </div>
    );
}

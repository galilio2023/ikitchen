'use client';

import { useEffect, useState } from 'react';
import { IProject } from '@/models/Project';
import  StatCard  from '@/components/StatCard';
import ProjectCard from '@/components/ProjectCard';
import { Activity, LayoutGrid, Terminal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

 function DashboardPage() {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();
                setProjects(data);
            } catch (err) {
                console.error("Critical System Error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center font-mono space-y-4">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent animate-spin" />
            <div className="text-blue-500 uppercase text-[10px] tracking-[0.5em]">Booting_Core...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-1000">

                {/* Header */}
                <header className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black italic uppercase text-white font-mono tracking-tighter">
                            System_Overview
                        </h1>
                        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                            Node_Status: <span className="text-emerald-500 animate-pulse font-bold">● Online</span>
                        </p>
                    </div>
                    <Button className="bg-white text-black hover:bg-slate-200 rounded-none border-b-4 border-r-4 border-slate-500 font-bold uppercase text-xs px-6 py-5 active:translate-y-1 active:border-0 transition-all">
                        <Plus className="mr-2 h-4 w-4" /> Initialize_Project
                    </Button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-800 border border-slate-800">
                    <StatCard
                        label="Total_Units"
                        value={projects.length}
                        icon={Activity}
                        color="text-blue-400"
                    />
                    <StatCard
                        label="Active_Queue"
                        value={projects.filter(p => p.status !== 'Completed').length}
                        icon={LayoutGrid}
                        color="text-slate-400"
                    />
                    <StatCard
                        label="Efficiency"
                        value="98.2%"
                        icon={Terminal}
                        color="text-emerald-400"
                    />
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((project, i) => (
                        <ProjectCard
                            key={String(project._id)}
                            name={project.name}
                            client={project.client}
                            status={project.status}
                            progress={project.progress}
                            index={i}
                        />
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="p-20 text-center border border-dashed border-slate-800 font-mono text-xs text-slate-600 uppercase">
                        No_Active_Sequences_In_Queue
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
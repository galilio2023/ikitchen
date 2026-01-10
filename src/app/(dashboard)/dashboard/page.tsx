'use client';

import { Box, Zap, Database, Cpu } from "lucide-react";
import CreateProjectModal from '@/components/CreateProjectModal';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProjects } from "@/lib/features/projects/projectSlice";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { items: projects, loading } = useAppSelector((state) => state.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        /* REMOVED 'isolate' from main:
           This allows the Starfield (z-[-2]) and Nebula (z-[-1])
           to be visible through the 'glass-brilliant' components.
        */
        <main className="p-8 lg:p-12 space-y-10 max-w-7xl mx-auto relative">

            {/* 1. SPECTACULAR HEADER */}
            <header className="glass-brilliant p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border-white/5">
                {/* Local Light Source:
                   We keep z-0 or z-10 for content to ensure it sits ABOVE
                   the global Starfield.
                */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-magic-purple/20 blur-[80px] rounded-full pointer-events-none z-0" />

                <div className="flex items-center gap-8 relative z-10">
                    <div className="h-20 w-20 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner relative group backdrop-blur-md">
                        <Box className="text-magic-purple h-10 w-10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute -inset-1 bg-magic-purple/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div>
                        <h1 className="text-5xl font-black tracking-tighter sparkle-text uppercase italic leading-none">
                            Voyager<span className="text-white/20 not-italic">_OS</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-magic-purple animate-pulse shadow-[0_0_10px_#8b5cf6]" />
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Neural_Link: Established</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <CreateProjectModal />
                </div>
            </header>

            {/* 2. SPECULAR STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <StatCard label="Live_Nodes" value="12" icon={Database} />
                <StatCard label="System_Health" value="99.9%" icon={Zap} />
                <StatCard label="Processing" value="Nominal" icon={Cpu} />
            </div>

            {/* 3. RECENT ACTIVITY PREVIEW */}
            <section className="glass-brilliant rounded-[2rem] p-8 border-t-2 border-t-magic-purple/30 bg-black/40 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Core_Activity_Log</h2>
                    <button className="text-[9px] text-magic-purple font-bold uppercase tracking-widest hover:brightness-125 transition-all">View_All_Metrics</button>
                </div>

                <div className="min-h-48 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/[0.02] relative overflow-hidden group p-6">
                    <div className="absolute inset-0 bg-gradient-to-t from-magic-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 w-full">
                        {loading ? (
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-[9px] text-magic-purple font-mono tracking-[0.5em] animate-pulse uppercase text-center w-full">
                                    SYNCHRONIZING_CORE...
                                </p>
                            </div>
                        ) : projects.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 w-full max-w-2xl mx-auto">
                                {projects.slice(0, 5).map(project => (
                                    <div key={project._id || project.id} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-magic-purple/30 transition-all group/item">
                                        <span className="text-[10px] font-mono text-white/80 tracking-widest uppercase">{project.name}</span>
                                        <span className="text-[8px] text-magic-purple/60 font-mono tracking-tighter uppercase">{project.status}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[9px] text-white/20 font-mono tracking-[0.5em] animate-pulse uppercase text-center w-full">
                                NO_ACTIVE_SEQUENCES_FOUND
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
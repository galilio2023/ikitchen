'use client';

// 1. EXTERNAL LOGIC & ICONS
import { Box, Zap, Database, Cpu, AlertTriangle, GitBranch } from "lucide-react";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProjects } from "@/lib/features/projects/projectSlice";

// 2. YOUR EXISTING COMPONENTS (Keep these imports!)
import CreateProjectModal from '@/components/CreateProjectModal';
import StatCard from "@/components/StatCard";

/**
 * @section REFACTOR_NOTE
 * We are keeping the logic inside this file organized by "Sections"
 * so you can find the Header, Stats, and Log easily.
 */

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { items: projects, loading, error } = useAppSelector((state) => state.projects);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <main className="p-8 lg:p-12 space-y-10 max-w-7xl mx-auto relative">

            {/* SECTION: HEADER (Formerly DashboardLayout area) */}
            <header className="glass-brilliant p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border-white/5">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-magic-purple/20 blur-[80px] rounded-full pointer-events-none z-0" />

                <div className="flex items-center gap-8 relative z-10">
                    <div className="h-20 w-20 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner relative group backdrop-blur-md">
                        <Box className="text-magic-purple h-10 w-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-white">
                            Voyager<span className="text-white/20 not-italic">_OS</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-magic-purple animate-pulse shadow-[0_0_10px_#8b5cf6]" />
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">Neural_Link: Established</p>

                            {/* NEW: Branch Indicator (Vital for your schema-branching workflow) */}
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10 ml-4">
                                <GitBranch size={10} className="text-magic-purple" />
                                <span className="text-[8px] font-bold text-white/60 tracking-widest uppercase">branch: schema/obstacles</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <CreateProjectModal />
                </div>
            </header>

            {/* Replace your previous StatCard row with this */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <StatCard
                    label="DB_CONNECTION"
                    value={error ? "OFFLINE" : "PENDING"}
                    icon={Database}
                    status={error ? "critical" : "nominal"} // <--- Using your internal status logic
                />
                <StatCard label="YAML_CONFIG" value="EMPTY" icon={Zap} status="nominal" />
                <StatCard label="AI_REVIEW" value="STANDBY" icon={Cpu} status="active" />
            </div>

            {/* SECTION: ACTIVITY LOG (The functional data list) */}
            <section className="glass-brilliant rounded-[2rem] p-8 border-t-2 border-t-magic-purple/30 bg-black/40 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Core_Activity_Log</h2>
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 animate-pulse">
                            <AlertTriangle size={12} />
                            <span className="text-[9px] font-bold uppercase">Database_Not_Found</span>
                        </div>
                    )}
                </div>

                <div className="min-h-48 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/[0.02] relative overflow-hidden group p-6 text-center">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-8 w-8 border-2 border-magic-purple border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-[9px] text-magic-purple font-mono tracking-[0.5em] uppercase">Initializing_Sequence...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="space-y-4 max-w-sm">
                            <div className="p-4 bg-white/5 rounded-full w-fit mx-auto border border-white/10 text-white/20">
                                <Database size={24} />
                            </div>
                            <p className="text-[10px] text-white/40 font-mono tracking-[0.2em] uppercase leading-relaxed">
                                No nodes active. Use the button above to initialize your first <span className="text-magic-purple font-bold">Obstacle</span>.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 w-full max-w-2xl">
                            {projects.map(project => (
                                <div key={project._id} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-magic-purple/30 transition-all">
                                    <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">{project.name}</span>
                                    <span className="text-[8px] px-2 py-1 rounded bg-magic-purple/20 text-magic-purple border border-magic-purple/30 uppercase">Review_Pending</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
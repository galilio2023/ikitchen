'use client';

import { Database, Zap, Cpu, GitBranch, Search } from "lucide-react";
import { useEffect, useTransition, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllKitchens } from "@/lib/features/kitchens/kitchenSlice";
import dynamic from 'next/dynamic';
import MagicStatsCard from "@/components/dashboard/MagicStatsCard";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

const CreateProjectModal = dynamic(() => import('@/components/CreateProjectModal'), {
    ssr: false,
    loading: () => <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
});

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { items: projects, loading, error } = useAppSelector((state) => state.kitchen);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchAllKitchens());
        });
    }, [dispatch]);

    const filteredProjects = useMemo(() => {
        return projects.filter(project =>
            project.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            project.status?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    const stats = useMemo(() => {
        const total = projects.length;
        const completed = projects.filter(p => p.progress === 100).length;
        const averageProgress = total > 0
            ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / total)
            : 0;

        return { total, completed, averageProgress };
    }, [projects]);

    const isActuallyLoading = (loading || isPending) && projects.length === 0;

    return (
        /* CHANGE: Reduced mobile padding from p-10 to p-4, md:p-10 */
        <div className="space-y-6 md:space-y-10 p-4 md:p-10 max-w-7xl mx-auto">

            {/* 1. SYSTEM STATUS - Adjusted gap for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <MagicStatsCard
                    index={0}
                    label="TOTAL_NODES"
                    value={isActuallyLoading ? "SCANNING..." : stats.total.toString()}
                    icon={Database}
                    status={error ? "critical" : (isActuallyLoading ? "active" : "nominal")}
                    isScanning={isActuallyLoading || error === 'SIGNAL_LOST'}
                />
                <MagicStatsCard
                    index={1}
                    label="COMPLETED_NODES"
                    value={isActuallyLoading ? "SCANNING..." : stats.completed.toString()}
                    icon={Zap}
                    status="nominal"
                    isScanning={isActuallyLoading || error === 'SIGNAL_LOST'}
                />
                {/* Visible on tablets/desktop, helps grid rhythm */}
                <MagicStatsCard
                    index={2}
                    label="AVG_INTEGRITY"
                    value={isActuallyLoading ? "SCANNING..." : `${stats.averageProgress}%`}
                    icon={Cpu}
                    status="active"
                    isScanning={isActuallyLoading || error === 'SIGNAL_LOST'}
                />
            </div>

            {/* 2. ACTIVITY LOG & REGISTRY */}
            <section className="glass-brilliant rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-border">
                {/* CHANGE: Added responsive padding and stacking for search bar */}
                <div className="p-5 md:p-8 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 bg-accent/10">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/60">Active_Nodes</h2>
                        <div className="flex items-center gap-2">
                            <GitBranch size={12} className="text-magic-purple" />
                            <span className="text-[9px] font-mono text-foreground/40 uppercase tracking-widest">registry/v1.0.4</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1 w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-foreground/40 group-focus-within:text-magic-purple transition-colors" />
                            <input
                                type="text"
                                placeholder="Search_Registry..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-accent/30 border border-border rounded-xl py-3 pl-12 pr-4 text-[10px] font-mono uppercase tracking-widest text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-magic-purple/40 focus:bg-accent/50 transition-all"
                            />
                        </div>
                        <div className="w-full sm:w-auto">
                            <CreateProjectModal />
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-6 min-h-[350px]">
                    {isActuallyLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-2 border-magic-purple border-t-transparent rounded-full animate-spin" />
                            <p className="text-[9px] font-mono text-magic-purple uppercase animate-pulse tracking-[0.3em]">Querying_Database...</p>
                        </div>
                    ) : (
                        <ProjectGrid projects={filteredProjects} isSearch={searchQuery.length > 0} />
                    )}
                </div>
            </section>
        </div>
    );
}
'use client';

import { Database, Zap, Cpu, GitBranch, ExternalLink } from "lucide-react";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllKitchens } from "@/lib/features/kitchens/kitchenSlice";

import CreateProjectModal from '@/components/CreateProjectModal';
import StatCard from "@/components/StatCard";
import Link from "next/link";

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    // Ensuring we select the correct slice state
    const { items: projects, loading, error } = useAppSelector((state) => state.kitchen);

    useEffect(() => {
        dispatch(fetchAllKitchens());
    }, [dispatch]);

    return (
        <div className="space-y-10 p-10 max-w-7xl mx-auto">
            {/* 1. SYSTEM STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="DB_CONNECTION"
                    value={error ? "OFFLINE" : (loading ? "CONNECTING" : "NOMINAL")}
                    icon={Database}
                    status={error ? "critical" : (loading ? "active" : "nominal")}
                />
                <StatCard label="YAML_CONFIG" value="EMPTY" icon={Zap} status="nominal" />
                <StatCard label="AI_REVIEW" value="STANDBY" icon={Cpu} status="active" />
            </div>

            {/* 2. ACTIVITY LOG & REGISTRY */}
            <section className="glass-brilliant rounded-[2.5rem] border border-white/5 bg-black/40 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Active_Nodes</h2>
                        <div className="flex items-center gap-2">
                            <GitBranch size={12} className="text-magic-purple" />
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">feature/schema-kitchen</span>
                        </div>
                    </div>
                    <CreateProjectModal />
                </div>

                <div className="p-6 min-h-[350px]">
                    {loading && (!projects || projects.length === 0) ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-2 border-magic-purple border-t-transparent rounded-full animate-spin" />
                            <p className="text-[9px] font-mono text-magic-purple uppercase animate-pulse tracking-[0.3em]">Querying_Database...</p>
                        </div>
                    ) : (!projects || projects.length === 0) ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 rounded-full bg-white/[0.02] border border-white/5 text-white/10">
                                <Database size={32} />
                            </div>
                            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">No nodes established in cluster.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {projects.map((project: any) => (
                                <Link
                                    key={project._id || project.id}
                                    href={`/projects/${project._id || project.id}`}
                                    className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-magic-purple/40 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="h-2 w-2 rounded-full bg-magic-purple/40 group-hover:bg-magic-purple group-hover:shadow-[0_0_12px_rgba(139,92,246,0.8)] transition-all" />
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-white/80 group-hover:text-white uppercase tracking-wider">
                                                {project.clientName || "Unknown_Client"}
                                            </span>
                                            <span className="text-[8px] font-mono text-white/10">NODE_ID: {String(project._id || project.id).slice(-6)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:block text-right">
                                            <p className="text-[7px] text-white/20 uppercase font-black tracking-widest">Status</p>
                                            <p className="text-[9px] text-magic-purple font-mono uppercase">{project.status || 'DRAFT'}</p>
                                        </div>
                                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 group-hover:border-magic-purple/50 group-hover:text-magic-purple transition-all">
                                            <ExternalLink size={14} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
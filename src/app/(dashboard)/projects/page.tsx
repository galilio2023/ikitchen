'use client';

import React, { useEffect } from 'react';
import { ChefHat, Database, Search, Filter, ArrowUpRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchAllKitchens } from '@/lib/features/kitchens/kitchenSlice';
import Link from 'next/link';

export default function ProjectsVaultPage() {
    const dispatch = useAppDispatch();
    const { items: projects, loading } = useAppSelector((state) => state.kitchen);

    useEffect(() => {
        if (projects.length === 0) {
            dispatch(fetchAllKitchens());
        }
    }, [dispatch, projects.length]);

    return (
        <div className="space-y-10 p-10 max-w-7xl mx-auto font-mono">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-magic-cyan/10 border border-magic-cyan/20 rounded-2xl text-magic-cyan">
                            <ChefHat size={24} />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                            Project_Vault<span className="text-white/20 not-italic">.db</span>
                        </h1>
                    </div>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] ml-14">Secure_Registry_Storage</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3">
                        <Database size={14} className="text-white/20" />
                        <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">{projects.length} Nodes_Stored</span>
                    </div>
                </div>
            </header>

            <div className="glass-brilliant rounded-[2.5rem] border border-white/20 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Identifier</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Entity_Name</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Integrity</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Uplink</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id || project._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                                <td className="px-8 py-6">
                                    <span className="text-[10px] text-white/20 font-mono">{String(project.id || project._id || 'SYS').slice(-8).toUpperCase()}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-[11px] text-white font-black uppercase tracking-widest">{project.clientName || "UNKNOWN_ENTITY"}</p>
                                    <p className="text-[8px] text-white/20 uppercase mt-1">{project.tags?.join(" | ") || "NO_TAGS"}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                                            <div 
                                                className="h-full bg-magic-purple shadow-[0_0_8px_#8b5cf6]" 
                                                style={{ width: `${project.progress}%` }} 
                                            />
                                        </div>
                                        <span className="text-[10px] text-white font-mono">{project.progress}%</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] text-white/60 uppercase font-black tracking-tighter">
                                        {project.status || "DRAFT"}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link 
                                        href={`/projects/${project.id || project._id}`}
                                        className="inline-flex items-center gap-2 text-magic-purple hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Access
                                        <ArrowUpRight size={14} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <p className="text-[10px] text-white/20 uppercase tracking-[0.5em]">No_Records_Found_In_Vault</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

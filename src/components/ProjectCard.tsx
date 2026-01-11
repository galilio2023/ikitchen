'use client';

import { motion } from 'framer-motion';
import { User, ChevronRight, Binary, Cpu, Zap, Activity, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface ProjectCardProps {
    project: any; // Using any here to accommodate the merged IProject + IKitchen structure
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const id = project._id || project.id;
    const projectIdString = String(id);
    const isCompleted = project.progress === 100;

    return (
        <motion.div
            whileHover={{ scale: 1.01, y: -5 }}
            className="group relative glass-brilliant p-8 rounded-[2.5rem] transition-all duration-500 hover:border-magic-purple/40"
        >
            {/* 1. AMBIENT LIGHT LEAK */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-magic-purple/5 blur-[50px] group-hover:bg-magic-purple/15 transition-colors pointer-events-none" />

            {/* 2. HEADER: NODE IDENTIFIER */}
            <div className="flex justify-between items-center mb-8 relative z-10 font-mono">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
                    <Binary className="h-3 w-3 text-white/20" />
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">
                        Node_{projectIdString.slice(-4)}
                    </span>
                </div>

                <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter transition-all",
                    isCompleted
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                        : "bg-magic-purple/5 border-magic-purple/20 text-magic-purple"
                )}>
                    <span className={cn(
                        "h-1 w-1 rounded-full animate-pulse",
                        isCompleted ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-magic-purple shadow-[0_0_8px_#8b5cf6]"
                    )} />
                    {isCompleted ? "STABLE_LINK" : project.status || "PROCESSING"}
                </div>
            </div>

            {/* 3. IDENTITY SECTION */}
            <div className="space-y-3 mb-10 relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none transition-all group-hover:text-magic-purple">
                    {project.name || project.clientName}
                </h3>
                <div className="flex items-center gap-2.5 font-mono">
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/5 text-white/20">
                        <User className="h-3 w-3" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/40 group-hover:text-white/70 transition-colors">
                        {project.client || "External_Entity"}
                    </span>
                </div>
            </div>

            {/* 4. INTEGRITY (PROGRESS) BAR */}
            <div className="space-y-4 relative z-10 font-mono">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2 text-white/20">
                        <Activity className="h-3 w-3" />
                        <span>Core_Integrity</span>
                    </div>
                    <span className={isCompleted ? "text-emerald-400" : "text-magic-purple"}>
                        {project.progress || 0}%
                    </span>
                </div>

                <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden p-[1px] border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress || 0}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className={cn(
                            "h-full rounded-full transition-all duration-700",
                            isCompleted ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-magic-purple shadow-[0_0_10px_#8b5cf6]"
                        )}
                    />
                </div>
            </div>

            {/* 5. FOOTER: ACCESS ACTION */}
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center relative z-10 font-mono">
                <div className="flex items-center gap-2 text-white/20">
                    <Zap className="h-3 w-3 text-magic-purple/40 group-hover:text-magic-purple transition-colors" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neural_Sync_Active</span>
                </div>

                <Link
                    href={`/projects/${id}`}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-white/60 hover:text-white transition-all group/btn"
                >
                    Access_Node
                    <ChevronRight className="h-3 w-3 text-magic-purple group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* 6. INTERACTIVE SHINE LAYER */}
            <div className="glass-shine absolute inset-0 pointer-events-none" />
        </motion.div>
    );
}
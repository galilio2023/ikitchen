'use client';

import { motion } from 'framer-motion';
import { IProject } from '@/models/Project';
import { User, ChevronRight, Binary, Cpu, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    project: IProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const projectId = String(project._id);
    const isCompleted = project.progress === 100;

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -8 }}
            className="group relative glass-brilliant p-8 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-magic-purple/40"
        >
            {/* 1. NEBULA LIGHT LEAK */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-magic-purple/5 blur-[50px] group-hover:bg-magic-purple/10 transition-colors pointer-events-none" />

            <div className="absolute top-8 right-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                <Cpu className="h-16 w-16 text-white" />
            </div>

            {/* 2. TOP BAR: NODE ID & STATUS */}
            <div className="flex justify-between items-center mb-8 relative z-10 font-mono">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full">
                    <Binary className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                        Node_{projectId.slice(-4)}
                    </span>
                </div>

                <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter",
                    isCompleted
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-magic-purple/10 border-magic-purple/20 text-magic-purple shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                )}>
                    <span className={cn(
                        "h-1.5 w-1.5 rounded-full animate-pulse",
                        isCompleted ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-magic-purple shadow-[0_0_8px_#8b5cf6]"
                    )} />
                    {isCompleted ? "Stable_Link" : "Processing"}
                </div>
            </div>

            {/* 3. IDENTITY SECTION */}
            <div className="space-y-3 mb-10 relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:sparkle-text transition-all duration-300">
                    {project.name}
                </h3>
                <div className="flex items-center gap-2.5 text-gray-500 font-mono">
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
                        <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                        {project.client}
                    </span>
                </div>
            </div>

            {/* 4. LASER PROGRESS BAR */}
            <div className="space-y-4 relative z-10 font-mono">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Activity className="h-3 w-3" />
                        <span>Core_Integrity</span>
                    </div>
                    <span className={cn("nebula-glow", isCompleted ? "text-emerald-400" : "text-magic-purple")}>
                        {project.progress}%
                    </span>
                </div>

                <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                            "h-full rounded-full shadow-[0_0_15px] transition-all duration-700",
                            isCompleted ? "bg-emerald-500 shadow-emerald-500/50" : "bg-magic-purple shadow-purple-500/50"
                        )}
                    />
                </div>
            </div>

            {/* 5. ACTION FOOTER */}
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center relative z-10 font-mono">
                <div className="flex items-center gap-2 text-gray-600">
                    <Zap className="h-3 w-3 text-magic-purple/40 group-hover:text-magic-purple transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Sync_Active</span>
                </div>

                <button className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 group-hover:text-white transition-all group/btn">
                    Access_Node
                    <ChevronRight className="h-3 w-3 text-magic-purple group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* 6. GLASS SHINE EFFECT */}
            <div className="glass-shine absolute inset-0 pointer-events-none" />
        </motion.div>
    );
}
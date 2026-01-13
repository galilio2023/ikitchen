'use client';

import { IKitchen } from "@/types/kitchen";
import { IProject } from "@/models/Project";
import { Binary, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProjectHero({ project }: { project: IProject | null }) {
    const isCompleted = project?.progress === 100;

    return (
        <section className="relative h-full min-h-[100px] w-full rounded-xl md:rounded-2xl overflow-hidden glass-brilliant bg-transparent group/hero">
            {/* Background Image with Overlay */}
            {project?.img ? (
                <div className="absolute inset-0 z-0">
                    <img 
                        src={project.img} 
                        alt={project.client || project.name} 
                        className="w-full h-full object-cover opacity-20 transition-transform duration-700 group-hover/hero:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-magic-purple/10 to-transparent z-0" />
            )}

            <div className="relative z-10 h-full p-4 md:p-5 flex flex-col justify-end">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-accent/30 border border-border rounded-full backdrop-blur-md">
                        <Binary className="h-2.5 w-2.5 text-magic-purple" />
                        <span className="text-[7px] text-foreground/40 font-mono font-black uppercase tracking-widest">
                            ID: {project?._id?.toString().slice(-8) || project?.id?.toString().slice(-8) || 'SYS'}
                        </span>
                    </div>

                    <div className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-full border text-[7px] font-black uppercase tracking-widest backdrop-blur-md",
                        isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-magic-purple/10 border-magic-purple/20 text-magic-purple"
                    )}>
                        <span className={cn(
                            "h-1 w-1 rounded-full animate-pulse",
                            isCompleted ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-magic-purple shadow-[0_0_8px_#8b5cf6]"
                        )} />
                        {project?.status}
                    </div>
                </div>

                <h1 className="text-sm md:text-base lg:text-lg font-black text-foreground uppercase tracking-tighter mb-0.5 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    {project?.name || "PROJECT_OFFLINE"}
                </h1>
                
                <div className="flex items-center gap-4">
                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-foreground/30">
                        CLIENT: {project?.client || "UNKNOWN"}
                    </p>

                    {project?.tags && (
                        <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="px-1.5 py-0.5 rounded bg-accent/20 border border-border text-[6px] text-foreground/30 uppercase font-black tracking-widest">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Corner */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 text-right">
                <div className="flex items-center gap-1.5 justify-end mb-0.5">
                    <Activity size={10} className="text-magic-purple" />
                    <span className="text-xs md:text-sm font-mono font-black text-foreground">{project?.progress || 0}%</span>
                </div>
                <p className="text-[6px] font-black uppercase tracking-[0.2em] text-foreground/20">Sync</p>
            </div>
        </section>
    );
}

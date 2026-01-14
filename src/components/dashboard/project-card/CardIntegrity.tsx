'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardIntegrityProps {
    progress: number;
    isCompleted: boolean;
}

export function CardIntegrity({ progress, isCompleted }: CardIntegrityProps) {
    return (
        <div className="space-y-4 relative z-10 font-mono mt-auto pt-6">
            <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                <div className="flex flex-col gap-1">
                    <span className="text-[7px] text-foreground/40">System_Status</span>
                    <div className="flex items-center gap-2 text-foreground/60 group-hover:text-foreground/80 transition-colors">
                        <Activity className={cn("h-3 w-3", !isCompleted && "animate-pulse")} />
                        <span>Core_Integrity</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[7px] text-foreground/40">Sync_Value</span>
                    <span className={cn(
                        "text-xs font-black tracking-tighter",
                        isCompleted ? "text-emerald-400" : "text-magic-purple"
                    )}>
                        {progress || 0}%
                    </span>
                </div>
            </div>

            <div className="relative h-2 w-full bg-accent/30 rounded-full overflow-hidden p-[2px] border border-border group/progress">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress || 0}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={cn(
                        "h-full rounded-full transition-all duration-700 relative",
                        isCompleted ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-magic-purple shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                    )}
                >
                    {/* Animated Shine on the progress bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine-sweep_3s_infinite]" />
                </motion.div>
            </div>
        </div>
    );
}

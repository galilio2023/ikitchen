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
        <div className="space-y-4 relative z-10 font-mono">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 text-foreground/20">
                    <Activity className="h-3 w-3" />
                    <span>Core_Integrity</span>
                </div>
                <span className={isCompleted ? "text-emerald-400" : "text-magic-purple"}>
                    {progress || 0}%
                </span>
            </div>

            <div className="h-1 w-full bg-accent/30 rounded-full overflow-hidden p-[1px] border border-border">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress || 0}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={cn(
                        "h-full rounded-full transition-all duration-700",
                        isCompleted ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-magic-purple shadow-[0_0_8px_#8b5cf6]"
                    )}
                />
            </div>
        </div>
    );
}

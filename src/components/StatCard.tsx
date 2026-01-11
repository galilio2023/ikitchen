'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    status: 'nominal' | 'active' | 'critical';
}

export default function StatCard({ label, value, icon: Icon, status }: StatCardProps) {
    // Dynamic styling based on system status
    const statusStyles = {
        nominal: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
        active: "text-magic-purple border-magic-purple/20 bg-magic-purple/5 shadow-[0_0_15px_rgba(139,92,246,0.1)]",
        critical: "text-red-400 border-red-500/20 bg-red-500/5 shadow-[0_0_15px_rgba(248,113,113,0.1)]"
    };

    const dotStyles = {
        nominal: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
        active: "bg-magic-purple shadow-[0_0_8px_#8b5cf6]",
        critical: "bg-red-500 shadow-[0_0_8px_#f87171]"
    };

    return (
        <div className={cn(
            "relative overflow-hidden glass-brilliant p-6 rounded-[2rem] border transition-all duration-500",
            statusStyles[status]
        )}>
            {/* Background Icon Watermark */}
            <Icon className="absolute -right-4 -bottom-4 h-24 w-24 opacity-[0.03] -rotate-12 pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <Icon size={18} className="text-white/60" />
                    </div>

                    {/* Status Indicator Dot */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5">
                        <motion.span
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={cn("h-1.5 w-1.5 rounded-full", dotStyles[status])}
                        />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                            {status}
                        </span>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                        {label}
                    </p>
                    <h3 className="text-xl font-mono font-black tracking-tighter text-white">
                        {value}
                    </h3>
                </div>
            </div>

            {/* Subtle bottom glow flare */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-[2px] opacity-30",
                status === 'nominal' && "bg-emerald-500",
                status === 'active' && "bg-magic-purple",
                status === 'critical' && "bg-red-500"
            )} />
        </div>
    );
}
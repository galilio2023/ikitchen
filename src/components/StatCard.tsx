'use client';

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { memo } from "react";

/**
 * NodeStatus Mapping:
 * nominal: Cyan (Stable)
 * active: Purple (Processing)
 * critical: Red (Overload)
 */
type NodeStatus = 'nominal' | 'active' | 'critical';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    status?: NodeStatus;
}

const statusConfig = {
    nominal: {
        color: 'text-magic-cyan',
        bg: 'bg-magic-cyan',
        border: 'group-hover:border-magic-cyan/50',
        glow: 'shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]',
        label: '_NOMINAL',
        bits: 3
    },
    active: {
        color: 'text-magic-purple',
        bg: 'bg-magic-purple',
        border: 'group-hover:border-magic-purple/50',
        glow: 'shadow-[inset_0_0_15px_rgba(139,92,246,0.2)]',
        label: '_ACTIVE',
        bits: 5
    },
    critical: {
        color: 'text-red-500',
        bg: 'bg-red-500',
        border: 'group-hover:border-red-500/50',
        glow: 'shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]',
        label: '_CRITICAL',
        bits: 8
    },
};

export default memo(function StatCard({ label, value, icon: Icon, status = 'nominal' }: StatCardProps) {
    const config = statusConfig[status];

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={cn(
                "glass-brilliant glass-shine p-8 rounded-[2.5rem] font-mono group relative overflow-hidden transition-all duration-500",
                "border border-white/5 backdrop-blur-md" // Enhanced backdrop for Starfield compatibility
            )}
        >
            {/* 1. SENSOR GRID BACKGROUND (Overlay on Starfield) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{
                     backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                     backgroundSize: '24px 24px'
                 }}
            />

            {/* 2. DYNAMIC AMBIENT LIGHT LEAK */}
            <div className={cn(
                "absolute -bottom-16 -right-16 w-40 h-40 blur-[60px] transition-all duration-1000 pointer-events-none opacity-10 group-hover:opacity-30",
                config.bg
            )} />

            {/* 3. TELEMETRY HEADER */}
            <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="relative">
                    {/* Pulsing Aura */}
                    <div className={cn("absolute inset-0 rounded-2xl blur-lg group-hover:animate-pulse opacity-20", config.bg)} />

                    <div className={cn(
                        "relative p-3.5 bg-black border border-white/10 rounded-2xl transition-all duration-500",
                        config.color,
                        config.glow,
                        config.border
                    )}>
                        <Icon size={20} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-[7px] uppercase font-black tracking-[0.5em] text-white/20 mb-1">
                        System_Node_Link
                    </span>
                    <span className="text-[11px] uppercase font-bold text-white/60 tracking-[0.2em] group-hover:text-white transition-colors">
                        {label}
                    </span>
                </div>
            </div>

            {/* 4. MAIN DATA DISPLAY */}
            <div className="relative z-10">
                <div className="flex items-baseline gap-3">
                    <h3 className="text-5xl font-black text-white tracking-tighter group-hover:sparkle-text transition-all duration-500">
                        {value}
                    </h3>
                    <div className="flex flex-col">
                         <span className={cn("text-[9px] font-black tracking-tighter italic uppercase transition-colors", config.color)}>
                            {config.label}
                        </span>
                        <span className="text-[7px] text-white/10 font-bold uppercase tracking-widest mt-0.5">
                            verified
                        </span>
                    </div>
                </div>

                {/* 5. HEALTH-AWARE BIT-STREAM */}
                <div className="mt-8 flex gap-1.5 h-1.5 items-end">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                opacity: [0.2, 0.6, 0.2],
                                scaleY: i < config.bits ? [1, 1.3, 1] : 1
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: i * 0.12,
                                ease: "easeInOut"
                            }}
                            className={cn(
                                "h-full w-full rounded-full transition-all duration-700",
                                i < config.bits ? config.bg : "bg-white/5 group-hover:bg-white/10"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* 6. CORNER TELEMETRY STAMP */}
            <div className="absolute top-6 right-8 flex flex-col items-end opacity-20 group-hover:opacity-50 transition-opacity">
                <div className="text-[6px] text-white font-black uppercase tracking-[0.4em]">
                    voyager_OS_8.2
                </div>
                <div className={cn("h-[1px] w-4 mt-1", config.bg)} />
            </div>
        </motion.div>
    );
});
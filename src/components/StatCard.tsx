'use client';

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string; // Optional: Defaults to magic-purple
}

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-brilliant glass-shine p-8 rounded-[2rem] font-mono group relative overflow-hidden transition-all duration-500"
        >
            {/* 1. SENSOR GRID BACKGROUND */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }}
            />

            {/* 2. NEBULA LIGHT LEAK (Hover) */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-magic-purple/10 blur-[50px] group-hover:bg-magic-purple/20 transition-all duration-700 pointer-events-none" />

            {/* 3. HEADER: ICON & TELEMETRY LABEL */}
            <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="relative">
                    {/* Animated Glow Ring */}
                    <div className="absolute inset-0 bg-magic-purple/20 rounded-xl blur-md group-hover:animate-pulse" />
                    <div className="relative p-3 bg-black border border-white/10 rounded-xl text-magic-purple shadow-[inset_0_0_10px_rgba(139,92,246,0.3)] group-hover:border-magic-purple/50 transition-colors">
                        <Icon size={18} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-black tracking-[0.4em] text-white/20">
                        Signal_Detected
                    </span>
                    <span className="text-[10px] uppercase font-bold text-white/60 tracking-widest group-hover:text-white transition-colors">
                        {label}
                    </span>
                </div>
            </div>

            {/* 4. DATA VALUE: SPECULAR WHITE */}
            <div className="relative z-10">
                <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl font-black text-white tracking-tighter group-hover:sparkle-text transition-all duration-500">
                        {value}
                    </h3>
                    {/* Units / Status */}
                    <span className="text-[9px] text-magic-purple/40 font-black tracking-tighter italic uppercase">
                        _nominal
                    </span>
                </div>

                {/* 5. DYNAMIC DATA LINE (The "Bit-Stream") */}
                <div className="mt-6 flex gap-1.5">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0.1 }}
                            animate={{ opacity: [0.1, 0.5, 0.1] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.15
                            }}
                            className={cn(
                                "h-1 w-full rounded-full transition-all duration-500",
                                i < 4 ? "bg-magic-purple/60" : "bg-white/5 group-hover:bg-white/10"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* 6. SYSTEM STAMP */}
            <div className="absolute top-4 right-6 text-[7px] text-white/5 font-black uppercase tracking-[0.3em] group-hover:text-magic-purple/30 transition-colors">
                Node_Verified_882
            </div>
        </motion.div>
    );
}
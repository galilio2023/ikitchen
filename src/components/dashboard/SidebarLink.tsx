'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import gsap from "gsap";

export function SidebarLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
    const iconRef = useRef<HTMLSpanElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        gsap.to(iconRef.current, { scale: 1.2, color: '#8b5cf6', duration: 0.3, ease: "power2.out" });
        gsap.to(glowRef.current, { opacity: 1, scale: 1.5, duration: 0.4, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
        gsap.to(iconRef.current, { scale: active ? 1.1 : 1, color: active ? '#8b5cf6' : 'currentColor', duration: 0.3, ease: "power2.in" });
        gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.4, ease: "power2.in" });
    };

    return (
        <Link
            href={href}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group flex items-center gap-4 px-4 py-3 rounded-2xl text-[11px] transition-all duration-300 relative overflow-hidden font-bold uppercase tracking-widest",
                active
                    ? "text-foreground bg-accent/50 border border-border"
                    : "text-foreground/40 hover:text-foreground hover:bg-accent/20"
            )}
        >
            <AnimatePresence>
                {active && (
                    <motion.div
                        layoutId="active-pill"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute left-0 top-3 bottom-3 w-[2px] bg-magic-purple rounded-r-full shadow-[0_0_15px_#8b5cf6]"
                    />
                )}
            </AnimatePresence>
            
            {/* Hover Glow */}
            <div 
                ref={glowRef}
                className="absolute inset-0 bg-magic-purple/10 blur-xl opacity-0 pointer-events-none"
            />

            <span 
                ref={iconRef}
                className={cn(
                    "transition-none",
                    active ? "text-magic-purple scale-110" : ""
                )}
            >
                {icon}
            </span>
            <span className={cn("transition-all", active ? "translate-x-1" : "group-hover:translate-x-1")}>
                {label}
            </span>
        </Link>
    );
}

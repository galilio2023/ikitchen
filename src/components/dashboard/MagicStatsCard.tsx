'use client';

import React, { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface MagicStatsCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    status: 'nominal' | 'active' | 'critical';
    isScanning?: boolean;
    index?: number;
}

export default function MagicStatsCard({ label, value, icon: Icon, status, isScanning, index = 0 }: MagicStatsCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const shimmerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 1. Entry Animation: Staggered float up and fade in
        const ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current, 
                { y: 40, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1.2, 
                    ease: 'power4.out', 
                    delay: index * 0.15 
                }
            );
        });
        return () => ctx.revert();
    }, [index]);

    useEffect(() => {
        // 2. Scanning Animation: GSAP-driven shimmering light
        let ctx: gsap.Context;
        if (isScanning && shimmerRef.current) {
            ctx = gsap.context(() => {
                gsap.to(shimmerRef.current, {
                    x: '200%',
                    duration: 1.5,
                    repeat: -1,
                    ease: 'power1.inOut',
                });
            });
        }
        
        // Dual-glow shift animation
        if (glowRef.current) {
            gsap.to(glowRef.current, {
                background: 'radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.4) 0%, transparent 70%), radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }

        return () => ctx?.revert();
    }, [isScanning]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!glowRef.current || !cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Mouse-following glow
        gsap.to(glowRef.current, {
            x: x - 150,
            y: y - 150,
            duration: 0.5,
            ease: 'power2.out'
        });
    };

    const handleMouseEnter = () => {
        // Hover: Scale, increase border opacity, and pulse glow
        gsap.to(cardRef.current, { 
            scale: 1.05, 
            borderColor: 'var(--primary)', 
            duration: 0.4, 
            ease: 'power2.out' 
        });
        gsap.to(glowRef.current, { 
            opacity: 1, 
            duration: 0.4 
        });
        
        // Pulsing glow effect
        gsap.to(glowRef.current, {
            scale: 1.2,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { 
            scale: 1, 
            borderColor: 'var(--border)', 
            duration: 0.4, 
            ease: 'power2.out' 
        });
        gsap.to(glowRef.current, { 
            opacity: 0, 
            duration: 0.4,
            scale: 1
        });
        gsap.killTweensOf(glowRef.current);
    };

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden backdrop-blur-2xl bg-card/20 border border-border p-7 rounded-[2.5rem] transition-all duration-500 flex flex-col justify-between h-40",
                isScanning && "cursor-wait"
            )}
        >
            {/* 3. MAGIC GLOW: Dual radial gradients following cursor */}
            <div 
                ref={glowRef}
                className="absolute inset-0 w-[400px] h-[400px] pointer-events-none opacity-0 mix-blend-screen dark:mix-blend-screen mix-blend-multiply blur-[80px]"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.4) 0%, transparent 70%), radial-gradient(circle at 70% 70%, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: 0
                }}
            />

            {/* 4. SCANNING SHIMMER: Only visible during SIGNAL_LOST / Loading */}
            {isScanning && (
                <div 
                    ref={shimmerRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                        transform: 'translateX(-100%) skewX(-20deg)',
                    }}
                />
            )}

            <div ref={contentRef} className="relative z-20 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-accent/40 border border-border group-hover:border-primary/40 transition-colors">
                        <Icon size={20} className="text-foreground/80" />
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/60 border border-border">
                        <span className={cn(
                            "h-2 w-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]",
                            isScanning ? "bg-foreground animate-pulse" : 
                            status === 'nominal' ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : 
                            status === 'active' ? "bg-magic-purple shadow-[0_0_10px_#8b5cf6]" : "bg-red-500 shadow-[0_0_10px_#ef4444]"
                        )} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/60">
                            {isScanning ? 'Scanning...' : status}
                        </span>
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] !text-foreground/30">
                        {label}
                    </p>
                    <h3 className="text-2xl font-mono font-black tracking-tighter !text-foreground uppercase truncate">
                        {isScanning ? 'Querying...' : value}
                    </h3>
                </div>
            </div>
        </div>
    );
}

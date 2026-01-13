'use client';

import React, { useEffect, useRef } from 'react';
import { Database, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import Link from 'next/link';

interface SignalLostProps {
    error?: string;
}

export default function SignalLost({ error }: SignalLostProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Glitch animation for text
            const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
            glitchTl
                .to(textRef.current, { skewX: 20, duration: 0.1, ease: "power4.inOut" })
                .to(textRef.current, { skewX: -20, duration: 0.1, ease: "power4.inOut" })
                .to(textRef.current, { skewX: 0, duration: 0.1, ease: "power4.inOut" })
                .to(textRef.current, { x: 5, duration: 0.05 })
                .to(textRef.current, { x: -5, duration: 0.05 })
                .to(textRef.current, { x: 0, duration: 0.05 });

            // Flicker animation for icon
            gsap.to(iconRef.current, {
                opacity: 0.5,
                duration: 0.1,
                repeat: -1,
                yoyo: true,
                repeatDelay: Math.random() * 2
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="h-[80vh] flex flex-col items-center justify-center text-center space-y-8 px-6">
            <div ref={iconRef} className="relative">
                <div className="p-8 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <Database size={48} />
                </div>
                <div className="absolute -top-2 -right-2 p-2 rounded-full bg-black border border-red-500/50 text-red-500 animate-pulse">
                    <AlertTriangle size={20} />
                </div>
            </div>

            <div className="space-y-4 max-w-md">
                <h2 
                    ref={textRef}
                    className="text-4xl font-black uppercase tracking-tighter text-foreground glitch-text"
                >
                    SIGNAL_LOST
                </h2>
                <div className="space-y-2">
                    <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-[0.3em]">
                        Neural_Link_Status: {error === 'SIGNAL_LOST' ? 'NODE_DECOMMISSIONED' : 'UNSTABLE_UPLINK'}
                    </p>
                    <p className="text-[9px] font-mono text-red-500/60 uppercase tracking-widest">
                        ERROR_CODE: {error || "UNKNOWN_SYNC_FAILURE"}
                    </p>
                </div>
            </div>

            <Link 
                href="/dashboard" 
                className="group relative px-8 py-4 bg-accent/20 border border-border rounded-2xl overflow-hidden transition-all hover:bg-accent/40"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative text-[10px] font-black uppercase tracking-[0.4em] text-foreground/60 group-hover:text-foreground transition-colors">
                    Return_to_Core
                </span>
            </Link>
        </div>
    );
}

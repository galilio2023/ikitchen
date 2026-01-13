'use client';

import React, { useEffect, useRef } from 'react';
import { Zap, Wind, DoorOpen, Square, Cpu } from 'lucide-react';
import { ObstacleType } from "@/types/kitchen";
import gsap from 'gsap';

interface SpatialNodeProps {
    id: string;
    type: ObstacleType;
    x: number;
    y: number;
    isSelected: boolean;
    onDragStart: () => void;
    onClick: (e: React.MouseEvent) => void;
}

export default function SpatialNode({ id, type, x, y, isSelected, onDragStart, onClick }: SpatialNodeProps) {
    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!nodeRef.current) return;

        // Floating idle animation
        const ctx = gsap.context(() => {
            gsap.to(nodeRef.current, {
                y: "+=10",
                rotation: "random(-5, 5)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random() * 2
            });
        }, nodeRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={nodeRef}
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
            className={`
                absolute p-2 z-20 group transition-all duration-200 rounded-lg border cursor-grab active:cursor-grabbing
                ${isSelected
                ? 'bg-magic-purple/20 border-magic-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-110'
                : 'bg-accent/20 border-border hover:border-foreground/40 hover:bg-accent/40'}
            `}
            style={{
                left: x,
                top: y,
                width: 44,
                height: 44,
                transform: 'translate(-50%, -50%)'
            }}
        >
            <div className="flex items-center justify-center h-full w-full">
                <NodeIcon type={type} />
            </div>

            {/* Metadata Label */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-max text-[7px] text-foreground/60 uppercase font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-background/80 backdrop-blur-sm px-1 py-0.5 rounded border border-border">
                {type}_NODE::{Math.round(x)},{Math.round(y)}
            </div>
        </div>
    );
}

function NodeIcon({ type }: { type: string }) {
    const iconSize = 18;
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes('fridge')) return <Cpu size={iconSize} className="text-magic-cyan" />;
    if (lowerType.includes('oven')) return <Zap size={iconSize} className="text-orange-500" />;
    if (lowerType.includes('sink')) return <Wind size={iconSize} className="text-blue-300" />;
    if (lowerType.includes('dishwasher')) return <Cpu size={iconSize} className="text-emerald-400" />;

    switch(lowerType) {
        case 'socket': return <Zap size={iconSize} className="text-yellow-400" />;
        case 'vent': return <Wind size={iconSize} className="text-blue-400" />;
        case 'door': return <DoorOpen size={iconSize} className="text-orange-400" />;
        case 'window': return <Square size={iconSize} className="text-blue-400" />;
        case 'appliance': return <Cpu size={iconSize} className="text-magic-purple" />;
        default: return <Cpu size={iconSize} className="text-magic-purple" />;
    }
}

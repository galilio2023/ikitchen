'use client';

import React from 'react';
import { User, Layers } from "lucide-react";

interface CardIdentityProps {
    clientName: string;
    img?: string;
    tags?: string[];
}

export function CardIdentity({ clientName, img, tags }: CardIdentityProps) {
    return (
        <div className="space-y-4 mb-6 relative z-10 flex-grow">
            <div className="relative h-40 w-full mb-4 rounded-3xl overflow-hidden border border-border bg-accent/20 group/img">
                {img ? (
                    <img 
                        src={img} 
                        alt={clientName} 
                        className="w-full h-full object-cover opacity-80 group-hover/img:scale-110 group-hover/img:opacity-100 transition-all duration-1000 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-foreground/20 group-hover/img:text-magic-purple/30 transition-colors">
                        <Layers size={40} strokeWidth={1} />
                        <span className="text-[8px] font-black uppercase tracking-[0.4em]">No_Visual_Data</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                
                {/* Image Overlay Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-2 py-1 rounded-lg bg-background/40 backdrop-blur-md border border-border opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <div className="w-1 h-1 rounded-full bg-magic-cyan animate-pulse" />
                    <span className="text-[7px] text-foreground/70 font-black uppercase tracking-widest">Live_Feed</span>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter leading-tight transition-all group-hover:text-magic-purple group-hover:translate-x-1">
                    {clientName || "Unknown_Node"}
                </h3>
                
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-accent/20 border border-border text-[7px] text-foreground/60 uppercase font-black tracking-widest hover:bg-magic-purple/10 hover:text-magic-purple transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-2.5 font-mono mt-6">
                <div className="p-2 bg-accent/30 rounded-xl border border-border text-foreground/40 group-hover:border-magic-purple/30 group-hover:text-magic-purple/50 transition-colors">
                    <User className="h-3 w-3" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[7px] text-foreground/40 uppercase font-black tracking-widest">Authorized_Entity</span>
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-foreground/70 group-hover:text-foreground transition-colors">
                        {clientName || "External_Entity"}
                    </span>
                </div>
            </div>
        </div>
    );
}
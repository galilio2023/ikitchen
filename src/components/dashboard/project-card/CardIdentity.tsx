'use client';

import React from 'react';
import { User } from "lucide-react";

interface CardIdentityProps {
    clientName: string;
    img?: string;
    tags?: string[];
}

export function CardIdentity({ clientName, img, tags }: CardIdentityProps) {
    return (
        <div className="space-y-3 mb-6 relative z-10 flex-grow">
            {img && (
                <div className="relative h-32 w-full mb-4 rounded-2xl overflow-hidden border border-border bg-accent/20">
                    <img 
                        src={img} 
                        alt={clientName} 
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
            )}

            <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter leading-none transition-all group-hover:text-magic-purple">
                {clientName || "Unknown_Node"}
            </h3>
            
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-accent/30 border border-border text-[7px] text-foreground/30 uppercase font-black tracking-widest">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            
            <div className="flex items-center gap-2.5 font-mono mt-4">
                <div className="p-1.5 bg-accent/30 rounded-lg border border-border text-foreground/20">
                    <User className="h-3 w-3" />
                </div>
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-foreground/40 group-hover:text-foreground/70 transition-colors">
                    {clientName || "External_Entity"}
                </span>
            </div>
        </div>
    );
}

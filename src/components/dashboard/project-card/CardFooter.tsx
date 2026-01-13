'use client';

import React from 'react';
import { Zap, ChevronRight } from "lucide-react";
import Link from 'next/link';

interface CardFooterProps {
    id: string;
}

export function CardFooter({ id }: CardFooterProps) {
    return (
        <div className="mt-10 pt-6 border-t border-border flex justify-between items-center relative z-10 font-mono">
            <div className="flex items-center gap-2 text-foreground/20">
                <Zap className="h-3 w-3 text-magic-purple/40 group-hover:text-magic-purple transition-colors" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neural_Sync_Active</span>
            </div>

            <Link
                href={`/projects/${id}`}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-foreground/60 hover:text-foreground transition-all group/btn"
            >
                Access_Node
                <ChevronRight className="h-3 w-3 text-magic-purple group-hover/btn:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}

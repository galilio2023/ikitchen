'use client';

import React, { useState } from 'react';
import { Binary, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/lib/hooks";
import { deleteProjectThunk } from "@/lib/features/kitchens/kitchenSlice";

interface CardHeaderProps {
    id: string;
    status: string;
    isCompleted: boolean;
    date?: string | Date;
}

export function CardHeader({ id, status, isCompleted, date }: CardHeaderProps) {
    const dispatch = useAppDispatch();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    }) : null;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!showConfirm) {
            setShowConfirm(true);
            setTimeout(() => setShowConfirm(false), 3000); // Reset after 3 seconds
            return;
        }

        setIsDeleting(true);
        try {
            await dispatch(deleteProjectThunk(id)).unwrap();
        } catch (error) {
            console.error("Failed to delete project:", error);
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <div className="flex justify-between items-center mb-8 relative z-10 font-mono">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/30 border border-border rounded-full mb-1">
                        <Binary className="h-3 w-3 text-foreground/40" />
                        <span className="text-[9px] text-foreground/60 font-black uppercase tracking-widest">
                            Node_{id.slice(-4)}
                        </span>
                    </div>
                    {formattedDate && (
                        <span className="text-[7px] text-foreground/40 uppercase tracking-[0.2em] ml-1">
                            LOGGED_{formattedDate.replace(' ', '_')}
                        </span>
                    )}
                </div>

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={cn(
                        "p-1.5 rounded-lg transition-all group/del",
                        showConfirm 
                            ? "bg-red-500/20 border border-red-500/40 text-red-500" 
                            : "bg-accent/20 border border-border text-foreground/40 hover:text-red-400 hover:border-red-400/40 hover:bg-red-400/5"
                    )}
                    title={showConfirm ? "Click again to confirm" : "Delete Node"}
                >
                    {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : showConfirm ? (
                        <AlertTriangle className="h-3 w-3 animate-pulse" />
                    ) : (
                        <Trash2 className="h-3 w-3" />
                    )}
                </button>
            </div>

            <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter transition-all",
                isCompleted
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-magic-purple/5 border-magic-purple/20 text-magic-purple"
            )}>
                <span className={cn(
                    "h-1 w-1 rounded-full animate-pulse",
                    isCompleted ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-magic-purple shadow-[0_0_8px_#8b5cf6]"
                )} />
                {isCompleted ? "STABLE_LINK" : status || "PROCESSING"}
            </div>
        </div>
    );
}

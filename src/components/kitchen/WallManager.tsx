'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
    setActiveWallIndex, 
    addWall, 
    removeWall, 
    updateWall 
} from '@/lib/features/kitchens/kitchenSlice';
import { Plus, Trash2, Edit3, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WallManager() {
    const dispatch = useAppDispatch();
    const { currentKitchen, activeWallIndex } = useAppSelector((state) => state.kitchen);
    
    if (!currentKitchen) return null;

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Wall_Clusters</h3>
                    <p className="text-[7px] lg:text-[8px] font-mono text-foreground/10 uppercase tracking-widest">Active_Nodes: {currentKitchen.walls.length}</p>
                </div>
                <button 
                    onClick={() => dispatch(addWall())}
                    className="p-1.5 rounded-lg bg-magic-cyan/10 border border-magic-cyan/20 text-magic-cyan hover:bg-magic-cyan/20 transition-all"
                >
                    <Plus size={14} />
                </button>
            </div>

            <div className="flex flex-col gap-2">
                {currentKitchen.walls.map((wall, index) => (
                    <div 
                        key={wall.id || index}
                        className={cn(
                            "group relative glass-brilliant p-3 rounded-xl border transition-all duration-300",
                            activeWallIndex === index 
                                ? "border-magic-purple bg-magic-purple/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                                : "border-border hover:border-foreground/20"
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <button 
                                onClick={() => dispatch(setActiveWallIndex(index))}
                                className="flex items-center gap-2 flex-1"
                            >
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full animate-pulse",
                                    activeWallIndex === index ? "bg-magic-purple shadow-[0_0_8px_#8b5cf6]" : "bg-foreground/20"
                                )} />
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest",
                                    activeWallIndex === index ? "text-foreground" : "text-foreground/40"
                                )}>
                                    {wall.label}
                                </span>
                            </button>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => {
                                        const newLabel = prompt("Enter new wall label:", wall.label);
                                        if (newLabel) dispatch(updateWall({ index, updates: { label: newLabel } }));
                                    }}
                                    className="p-1 text-foreground/20 hover:text-foreground transition-colors"
                                >
                                    <Edit3 size={12} />
                                </button>
                                {currentKitchen.walls.length > 1 && (
                                    <button 
                                        onClick={() => dispatch(removeWall(index))}
                                        className="p-1 text-foreground/20 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                                <p className="text-[6px] font-mono text-foreground/20 uppercase tracking-widest">Length</p>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number"
                                        value={wall.length}
                                        onChange={(e) => dispatch(updateWall({ index, updates: { length: Number(e.target.value) } }))}
                                        className="w-full bg-transparent text-[10px] font-mono text-foreground focus:outline-none"
                                    />
                                    <span className="text-[6px] text-foreground/10">CM</span>
                                </div>
                            </div>
                            <MoveRight size={10} className="text-foreground/10" />
                            <div className="flex-1 space-y-1">
                                <p className="text-[6px] font-mono text-foreground/20 uppercase tracking-widest">Height</p>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number"
                                        value={wall.height}
                                        onChange={(e) => dispatch(updateWall({ index, updates: { height: Number(e.target.value) } }))}
                                        className="w-full bg-transparent text-[10px] font-mono text-foreground focus:outline-none"
                                    />
                                    <span className="text-[6px] text-foreground/10">CM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
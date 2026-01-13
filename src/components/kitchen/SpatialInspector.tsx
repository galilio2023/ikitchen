'use client';

import React from 'react';
import { IObstacle } from "@/types/kitchen";
import { Settings2, Maximize2, Move, Box, Palette, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAppDispatch } from "@/lib/hooks";
import { updateObstacleDetails, saveKitchen, applyDesign } from "@/lib/features/kitchens/kitchenSlice";

interface SpatialInspectorProps {
    selectedNode: IObstacle | null;
    currentKitchen: any; // We'll pass this in
    onVisualize?: () => void;
    isRendering?: boolean;
}

export default function SpatialInspector({ selectedNode, currentKitchen, onVisualize, isRendering }: SpatialInspectorProps) {
    const dispatch = useAppDispatch();
    const [isDesigning, setIsDesigning] = React.useState(false);

    const handleUpdate = (updates: Partial<IObstacle['position']>) => {
        if (!selectedNode) return;
        dispatch(updateObstacleDetails({
            id: selectedNode.id,
            updates
        }));
    };

    const handleSave = () => {
        if (currentKitchen) {
            dispatch(saveKitchen(currentKitchen));
        }
    };

    const handleDesign = async () => {
        setIsDesigning(true);
        try {
            const res = await fetch('/api/generate/design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kitchenData: currentKitchen })
            });
            const data = await res.json();
            if (data.design) {
                dispatch(applyDesign(data.design));
            }
        } catch (error) {
            console.error("GEMINI_DESIGN_FAILURE", error);
        } finally {
            setIsDesigning(false);
        }
    };

    if (!selectedNode) {
        return (
            <aside className="w-64 lg:w-80 flex-none border-l border-border p-4 lg:p-6 flex flex-col items-center justify-between text-center bg-accent/5 backdrop-blur-xl">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="p-3 lg:p-4 rounded-2xl lg:rounded-3xl bg-accent/20 border border-border text-foreground/20 mb-4">
                        <Settings2 size={24} />
                    </div>
                    <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Inspector_Standby</p>
                    <p className="text-[7px] lg:text-[8px] font-mono text-foreground/10 uppercase tracking-widest mt-2 px-4 lg:px-6">Select a spatial node to view its architectural parameters.</p>
                </div>

                <div className="w-full space-y-4">
                    <button 
                        onClick={handleDesign}
                        disabled={isDesigning}
                        className="w-full group relative overflow-hidden px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-magic-purple/20 border border-magic-purple/40 text-magic-purple transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2 lg:gap-3">
                            {isDesigning ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Sparkles size={16} className="group-hover:animate-pulse text-magic-cyan" />
                            )}
                            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                                {isDesigning ? 'Designing...' : 'Design_with_Gemini'}
                            </span>
                        </div>
                    </button>

                    <button 
                        onClick={handleSave}
                        className="w-full group relative overflow-hidden px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-accent/20 border border-border text-foreground/40 transition-all hover:text-foreground hover:border-foreground/20"
                    >
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Persist_Changes</span>
                    </button>

                    <button 
                        onClick={onVisualize}
                        disabled={isRendering}
                        className="w-full group relative overflow-hidden px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-gradient-to-r from-magic-cyan/20 to-magic-purple/20 border border-magic-cyan/40 text-magic-cyan transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2 lg:gap-3">
                            {isRendering ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Sparkles size={16} className="group-hover:animate-pulse" />
                            )}
                            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                                {isRendering ? 'Materializing...' : 'Neural_Visualize'}
                            </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-magic-cyan/10 to-magic-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-64 lg:w-80 flex-none border-l border-border p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 overflow-y-auto bg-accent/5 backdrop-blur-xl">
            <div className="space-y-1">
                <h3 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 text-right">Node_Inspector</h3>
                <div className="flex items-center justify-end gap-2">
                    <span className="text-[12px] lg:text-[14px] font-black uppercase tracking-tighter text-foreground">{selectedNode.type}_UNIT</span>
                    <Box size={14} className="text-magic-cyan" />
                </div>
            </div>

            <div className="space-y-4 lg:space-y-6">
                <section className="space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-2 text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40">
                        <Move size={12} className="text-magic-purple" />
                        Spatial_Coordinates
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 lg:gap-3">
                        <div className="glass-brilliant p-2 lg:p-3 rounded-lg lg:rounded-xl border border-border">
                            <p className="text-[6px] lg:text-[7px] font-mono text-foreground/20 uppercase tracking-widest mb-1">POS_X</p>
                            <input 
                                type="number"
                                value={selectedNode.position.x}
                                onChange={(e) => handleUpdate({ x: Number(e.target.value) })}
                                className="w-full bg-transparent text-xs lg:text-sm font-mono text-foreground focus:outline-none"
                            />
                        </div>
                        <div className="glass-brilliant p-2 lg:p-3 rounded-lg lg:rounded-xl border border-border">
                            <p className="text-[6px] lg:text-[7px] font-mono text-foreground/20 uppercase tracking-widest mb-1">POS_Y</p>
                            <input 
                                type="number"
                                value={selectedNode.position.y}
                                onChange={(e) => handleUpdate({ y: Number(e.target.value) })}
                                className="w-full bg-transparent text-xs lg:text-sm font-mono text-foreground focus:outline-none"
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-3 lg:space-y-4">
                    <div className="flex items-center gap-2 text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40">
                        <Maximize2 size={12} className="text-magic-cyan" />
                        Dimensional_Specs
                    </div>
                    
                    <div className="space-y-2 lg:space-y-3">
                        <div className="glass-brilliant p-3 lg:p-4 rounded-lg lg:rounded-xl border border-border flex items-center justify-between">
                            <p className="text-[7px] lg:text-[8px] font-mono text-foreground/20 uppercase tracking-widest">Width</p>
                            <input 
                                type="number"
                                value={selectedNode.position.width}
                                onChange={(e) => handleUpdate({ width: Number(e.target.value) })}
                                className="w-16 bg-transparent text-[10px] lg:text-xs font-mono text-foreground font-black text-right focus:outline-none"
                            />
                        </div>
                        <div className="glass-brilliant p-3 lg:p-4 rounded-lg lg:rounded-xl border border-border flex items-center justify-between">
                            <p className="text-[7px] lg:text-[8px] font-mono text-foreground/20 uppercase tracking-widest">Height</p>
                            <input 
                                type="number"
                                value={selectedNode.position.height}
                                onChange={(e) => handleUpdate({ height: Number(e.target.value) })}
                                className="w-16 bg-transparent text-[10px] lg:text-xs font-mono text-foreground font-black text-right focus:outline-none"
                            />
                        </div>
                        <div className="glass-brilliant p-3 lg:p-4 rounded-lg lg:rounded-xl border border-border flex items-center justify-between">
                            <p className="text-[7px] lg:text-[8px] font-mono text-foreground/20 uppercase tracking-widest">Depth</p>
                            <input 
                                type="number"
                                value={selectedNode.position.depth}
                                onChange={(e) => handleUpdate({ depth: Number(e.target.value) })}
                                className="w-16 bg-transparent text-[10px] lg:text-xs font-mono text-foreground font-black text-right focus:outline-none"
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40">
                        <Palette size={12} className="text-magic-purple" />
                        Material_Properties
                    </div>
                    <div className="glass-brilliant p-4 rounded-xl border border-border text-center">
                        <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-widest italic animate-pulse">Establishing_Sync...</p>
                    </div>
                </section>
            </div>

            <div className="mt-auto space-y-4 lg:space-y-6 pt-4 lg:pt-6 border-t border-border">
                <button 
                    onClick={handleDesign}
                    disabled={isDesigning}
                    className="w-full group relative overflow-hidden px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-magic-purple/20 border border-magic-purple/40 text-magic-purple transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    <div className="relative z-10 flex items-center justify-center gap-2 lg:gap-3">
                        {isDesigning ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Sparkles size={16} className="group-hover:animate-pulse text-magic-cyan" />
                        )}
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                            {isDesigning ? 'Designing...' : 'Design_with_Gemini'}
                        </span>
                    </div>
                </button>

                <button 
                    onClick={handleSave}
                    className="w-full group relative overflow-hidden px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-accent/20 border border-border text-foreground/40 transition-all hover:text-foreground hover:border-foreground/20"
                >
                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">Persist_Changes</span>
                </button>

                <button 
                    onClick={onVisualize}
                    disabled={isRendering}
                    className="w-full group relative overflow-hidden px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-gradient-to-r from-magic-cyan/20 to-magic-purple/20 border border-magic-cyan/40 text-magic-cyan transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    <div className="relative z-10 flex items-center justify-center gap-2 lg:gap-3">
                        {isRendering ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Sparkles size={16} className="group-hover:animate-pulse" />
                        )}
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                            {isRendering ? 'Materializing...' : 'Neural_Visualize'}
                        </span>
                    </div>
                </button>

                <p className="text-[6px] lg:text-[7px] font-mono text-foreground/10 uppercase tracking-[0.2em] text-center">
                    Node_ID: {selectedNode.id}
                </p>
            </div>
        </aside>
    );
}

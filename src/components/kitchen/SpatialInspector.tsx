'use client';

import React from 'react';

import { IKitchen, IObstacle } from "@/types/kitchen";
import { Settings2, Maximize2, Move, Box, Palette, Sparkles, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/lib/hooks";
import { updateObstacleDetails, setSelectedObstacle } from "@/lib/features/kitchens/kitchenSlice";

// Explicitly defining the props for helper components to satisfy TS Strict mode
interface InspectorFieldProps {
    label: string;
    value: number;
    onChange: (v: number) => void;
}


interface SpatialInspectorProps {
    selectedNode: (IObstacle & { isAppliance?: boolean; name?: string; }) | null;
    currentKitchen: IKitchen | null;
    onVisualize: () => void;
    isRendering: boolean;
}

export default function SpatialInspector({
                                             selectedNode,
                                             currentKitchen,
                                             onVisualize,
                                             isRendering
                                         }: SpatialInspectorProps) {
    const dispatch = useAppDispatch();

    if (!selectedNode) {
        return (
            <aside className="hidden lg:flex w-80 flex-none border-l border-border p-6 flex flex-col items-center justify-center text-center bg-accent/5 backdrop-blur-xl h-full">
                <Settings2 size={24} className="text-foreground/20 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Inspector_Standby</p>
            </aside>
        );
    }

    return (
        <aside className="fixed inset-x-0 bottom-0 z-[60] lg:relative lg:inset-auto w-full lg:w-80 h-[70vh] lg:h-full border-t lg:border-t-0 lg:border-l border-border p-6 flex flex-col gap-6 overflow-y-auto bg-background/95 lg:bg-accent/5 backdrop-blur-2xl rounded-t-[3rem] lg:rounded-none shadow-2xl">
            <div className="flex items-center justify-between lg:justify-end gap-2 border-b lg:border-0 border-border pb-4 lg:pb-0">
                <button onClick={() => dispatch(setSelectedObstacle(null))} className="lg:hidden p-2 rounded-full bg-accent">
                    <X size={16} />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-[14px] font-black uppercase tracking-tighter text-foreground">{selectedNode.type}_UNIT</span>
                    <Box size={14} className="text-magic-cyan" />
                </div>
            </div>

            {/* COORDINATES SECTION */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40">
                    <Move size={12} className="text-magic-purple" />
                    Spatial_Coordinates
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {/* Fixed: Added (v: number) type to inline handlers */}
                    <CoordinateBox
                        label="POS_X"
                        value={selectedNode.position.x}
                        onChange={(v: number) => dispatch(updateObstacleDetails({ id: selectedNode.id, updates: { x: v } }))}
                    />
                    <CoordinateBox
                        label="POS_Y"
                        value={selectedNode.position.y}
                        onChange={(v: number) => dispatch(updateObstacleDetails({ id: selectedNode.id, updates: { y: v } }))}
                    />
                </div>
            </section>

            {/* DIMENSIONS SECTION */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40">
                    <Maximize2 size={12} className="text-magic-cyan" />
                    Dimensional_Specs
                </div>
                <div className="space-y-2">
                    <DimensionRow
                        label="Width"
                        value={selectedNode.position.width}
                        onChange={(v: number) => dispatch(updateObstacleDetails({ id: selectedNode.id, updates: { width: v } }))}
                    />
                    <DimensionRow
                        label="Height"
                        value={selectedNode.position.height}
                        onChange={(v: number) => dispatch(updateObstacleDetails({ id: selectedNode.id, updates: { height: v } }))}
                    />
                </div>
            </section>

            <button
                onClick={onVisualize}
                className="mt-auto w-full py-4 bg-magic-purple rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg flex items-center justify-center gap-3"
            >
                {isRendering ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {isRendering ? 'Materializing...' : 'Neural_Visualize'}
            </button>
        </aside>
    );
}

// Fixed: Added Prop types to avoid implicit 'any'
function CoordinateBox({ label, value, onChange }: InspectorFieldProps) {
    return (
        <div className="glass-brilliant p-3 rounded-xl border border-border">
            <p className="text-[7px] font-mono text-foreground/20 mb-1 uppercase tracking-widest">{label}</p>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full bg-transparent text-sm font-mono text-foreground focus:outline-none"
            />
        </div>
    );
}

function DimensionRow({ label, value, onChange }: InspectorFieldProps) {
    return (
        <div className="glass-brilliant p-4 rounded-xl border border-border flex items-center justify-between">
            <p className="text-[8px] font-mono text-foreground/20 uppercase tracking-widest">{label}</p>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-16 bg-transparent text-xs font-mono text-foreground font-black text-right focus:outline-none"
            />
        </div>
    );
}
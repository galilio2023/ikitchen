'use client';

import React from 'react';
import { Square, DoorOpen, Zap, Droplets, Columns2, Heater, ShieldAlert } from 'lucide-react';
import { ObstacleType } from "@/types/kitchen";
// UNIFIED: Pointing to the consolidated kitchenSlice
import { addObstacle } from "@/lib/features/kitchens/kitchenSlice";
import { useAppDispatch } from "@/lib/hooks";

interface ObstacleToolboxProps {
    wallIndex: number;
}

export default function ObstacleToolbox({ wallIndex }: ObstacleToolboxProps) {
    const dispatch = useAppDispatch();

    // Hardware definitions with design-system specific colors
    const tools = [
        { type: 'window', icon: Square, label: 'Window', color: 'text-blue-400' },
        { type: 'door', icon: DoorOpen, label: 'Door', color: 'text-orange-400' },
        { type: 'socket', icon: Zap, label: 'Power', color: 'text-yellow-400' },
        { type: 'pipe', icon: Droplets, label: 'Water', color: 'text-cyan-400' },
        { type: 'pillar', icon: Columns2, label: 'Pillar', color: 'text-emerald-400' },
        { type: 'radiator', icon: Heater, label: 'Heat', color: 'text-red-400' },
        { type: 'clearance', icon: ShieldAlert, label: 'Zone', color: 'text-purple-400' },
    ];

    /**
     * Dispatch to the Unified Kitchen Slice
     * Payload matches the strict IObstacle schema
     */
    const handleAdd = (type: ObstacleType) => {
        dispatch(addObstacle({
            type,
            wallIndex,
            x: 50,     // Initial distance along wall (cm)
            y: 100     // Initial elevation height (cm)
        }));
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header / Versioning */}
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-magic-purple uppercase tracking-[0.3em]">
                    Hardware_Library
                </span>
            </div>

            {/* Scrollable Tool List */}
            <div className="grid grid-cols-1 gap-3 overflow-y-auto">
                {tools.map((tool) => (
                    <div
                        key={tool.type}
                        draggable
                        // Trigger immediate add on click
                        onClick={() => handleAdd(tool.type as ObstacleType)}
                        // Support Drag-and-Drop for the ObstacleLayer
                        onDragStart={(e) => {
                            e.dataTransfer.setData('obstacleType', tool.type);
                            e.dataTransfer.effectAllowed = 'move';
                        }}
                        className="group flex items-center gap-4 px-4 py-4 rounded-2xl bg-accent/30 border border-border hover:bg-accent/50 hover:border-magic-purple/40 cursor-pointer active:scale-95 transition-all"
                    >
                        {/* Tool Icon Wrapper */}
                        <div className={`p-2.5 rounded-xl bg-background/40 border border-border ${tool.color} group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all`}>
                            <tool.icon size={18} />
                        </div>

                        {/* Tool Labels */}
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/70 group-hover:text-foreground transition-colors">
                                {tool.label}
                            </span>
                            <span className="text-[8px] font-mono text-foreground/20 uppercase tracking-tighter">
                                Comp_Ref_{tool.type.substring(0, 3).toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Footer */}
            <div className="mt-auto pt-4 border-t border-border relative z-10">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-magic-cyan animate-pulse shadow-[0_0_8px_#22d3ee]" />
                    <span className="text-[8px] font-mono text-foreground/30 uppercase tracking-[0.2em]">
                        Ready_To_Deploy
                    </span>
                </div>
            </div>
        </div>
    );
}
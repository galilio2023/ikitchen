'use client';

import React from 'react';
import { Square, DoorOpen, Zap, Droplets, Columns2, Heater, ShieldAlert } from 'lucide-react';
import {ObstacleType} from "@/types";
import {addObstacle} from "@/lib/features/kitchens/kitchenSlice";
import {useAppDispatch} from "@/lib/hooks";

interface ObstacleToolboxProps {
    wallIndex: number; // <--- ADD THIS
}

export default function ObstacleToolbox({ wallIndex }: ObstacleToolboxProps) {
    const dispatch = useAppDispatch();

    const tools = [
        { type: 'window', icon: Square, label: 'Window', color: 'text-blue-400' },
        { type: 'door', icon: DoorOpen, label: 'Door', color: 'text-orange-400' },
        { type: 'socket', icon: Zap, label: 'Power', color: 'text-yellow-400' },
        { type: 'pipe', icon: Droplets, label: 'Water', color: 'text-cyan-400' },
        { type: 'pillar', icon: Columns2, label: 'Pillar', color: 'text-emerald-400' },
        { type: 'radiator', icon: Heater, label: 'Heat', color: 'text-red-400' },
        { type: 'clearance', icon: ShieldAlert, label: 'Zone', color: 'text-purple-400' },
    ];
    const handleAdd = (type: ObstacleType) => {
        dispatch(addObstacle({
            type,
            wallIndex, // Use the prop we just added
            x: 50,     // Default starting position on the wall
            y: 100
        }));
    };
    return (
        <aside className="w-72 glass-brilliant glass-shine rounded-[2rem] p-6 flex flex-col gap-6 h-full border border-white/5">
            <div className="flex flex-col gap-1 relative z-10">
                <span className="text-[10px] font-black text-magic-purple uppercase tracking-[0.3em]">Hardware_Library</span>
                <span className="text-[11px] font-medium text-white/30 font-mono italic">v4.0_STRICT_SNAP</span>
            </div>

            <div className="grid grid-cols-1 gap-3 relative z-10 overflow-y-auto scrollbar-hide">
                {tools.map((tool) => (
                    <div
                        key={tool.type}
                        draggable
                        // CLICK TO ADD:
                        onClick={() => handleAdd(tool.type as ObstacleType)}
                        onDragStart={(e) => {
                            e.dataTransfer.setData('obstacleType', tool.type);
                            e.dataTransfer.effectAllowed = 'move';
                        }}
                        className="group flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-magic-purple/40 cursor-pointer active:scale-95 transition-all"
                    >
                        <div className={`p-2.5 rounded-xl bg-black/40 border border-white/5 ${tool.color} group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all`}>
                            <tool.icon size={18} />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                                {tool.label}
                            </span>
                            <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                                Comp_Ref_{tool.type.substring(0, 3)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Status Indicator */}
            <div className="mt-auto pt-4 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-magic-cyan animate-pulse" />
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Ready_To_Deploy</span>
                </div>
            </div>
        </aside>
    );
}
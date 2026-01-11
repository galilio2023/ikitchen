// src/components/kitchen/ElevationEngine.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { saveKitchen, setSelectedObstacle, updateObstaclePosition } from '@/lib/features/kitchens/kitchenSlice';
import DraggableObstacle from "./DraggableObstacle";
import ObstacleToolbox from "./ObstacleToolbox";
import PropertiesPanel from "./PropertiesPanel";
import { IKitchen, IObstacle } from '@/types/kitchen';
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ElevationEngine({ kitchen }: { kitchen: IKitchen }) {
    const dispatch = useAppDispatch();
    const { currentKitchen, selectedObstacleId } = useAppSelector((state) => state.kitchen);
    const [activeWallIdx, setActiveWallIdx] = useState(0);

    const handleSave = () => {
        if (currentKitchen) {
            dispatch(saveKitchen(currentKitchen));
            toast.success("WORKSPACE_SYNC_COMPLETE");
        }
    };

    const obstaclesByWall = useMemo(() => {
        const map: Record<number, { data: IObstacle; globalIndex: number }[]> = {};
        (kitchen.obstacles || []).forEach((obs, index) => {
            if (!map[obs.wallIndex]) map[obs.wallIndex] = [];
            map[obs.wallIndex].push({ data: obs, globalIndex: index });
        });
        return map;
    }, [kitchen.obstacles]);

    if (!kitchen.walls || kitchen.walls.length === 0) {
        return (
            <div className="flex h-full items-center justify-center bg-obsidian">
                <div className="text-center opacity-20">
                    <Plus className="mx-auto mb-4" size={48} />
                    <p className="text-xs font-mono uppercase tracking-[0.5em]">Grid_Offline</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden bg-obsidian font-mono">
            <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-[#030303] scroll-smooth">
                {/* Header Wall Nav */}
                <div className="sticky top-0 z-50 w-full py-4 bg-obsidian/90 backdrop-blur-xl border-b border-white/5 px-10">
                    <div className="flex justify-center gap-2">
                        {kitchen.walls.map((wall, idx) => (
                            <button
                                key={wall.id}
                                onClick={() => {
                                    setActiveWallIdx(idx);
                                    document.getElementById(`wall-${wall.id}`)?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={cn(
                                    "px-6 py-1.5 rounded-full text-[9px] font-black uppercase transition-all border",
                                    activeWallIdx === idx ? "bg-magic-purple/20 border-magic-purple text-magic-purple" : "text-white/30 border-transparent hover:border-white/10"
                                )}
                            >
                                {wall.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-10 pt-10 pb-64 space-y-32">
                    {kitchen.walls.map((wall, wallIdx) => (
                        <section key={wall.id} id={`wall-${wall.id}`} className="relative group">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <span className="text-[8px] font-black text-magic-purple uppercase">Elevation_0{wallIdx + 1}</span>
                                    <h2 className="text-xl font-bold text-white uppercase italic">{wall.label}</h2>
                                </div>
                                <span className="text-[9px] text-white/20">{wall.length}cm x {wall.height}cm</span>
                            </div>

                            <div className="relative h-[500px] bg-black rounded-[2rem] border border-white/5 overflow-hidden group-hover:border-magic-purple/20 transition-all">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #8b5cf6 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />

                                {obstaclesByWall[wallIdx]?.map((obs) => (
                                    <DraggableObstacle
                                        key={obs.data.id}
                                        obstacle={obs.data}
                                        globalIndex={obs.globalIndex}
                                        wall={wall}
                                        isSelected={selectedObstacleId === obs.data.id}
                                        onSelect={() => dispatch(setSelectedObstacle(obs.data.id))}
                                        onPositionChange={(x, y) => dispatch(updateObstaclePosition({ id: obs.data.id, x, y }))}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            <aside className="w-80 border-l border-white/5 bg-black/40 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <ObstacleToolbox wallIndex={activeWallIdx} />
                </div>
                <div className="p-6 border-t border-white/5 bg-black/60">
                    <button onClick={handleSave} className="w-full py-4 bg-magic-purple text-white font-black text-[10px] uppercase rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all">
                        Sync_Workspace
                    </button>
                </div>
            </aside>

            {/* Float Properties Panel */}
            <PropertiesPanel />
        </div>
    );
}
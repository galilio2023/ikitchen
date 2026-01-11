'use client';

import { motion } from 'framer-motion';
import { IWall, IKitchen } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    updateWallLength,
    addWall,
    setSelectedObstacle
} from '@/lib/features/kitchens/kitchenSlice';
import DraggableObstacle from "@/components/kitchen/DraggableObstacle";
import WallNavigator from "@/components/kitchen/WallNavigator";
import ObstacleToolbox from "@/components/kitchen/ObstacleToolbox";
import { Plus } from 'lucide-react';
import {useMemo} from "react";

export default function ElevationEngine({ kitchen }: { kitchen: IKitchen }) {
    const dispatch = useAppDispatch();
    const { selectedObstacleIndex } = useAppSelector((state) => state.kitchen);

    // OPTIMIZATION: Pre-sort obstacles by wall to prevent O(n^2) rendering
    const obstaclesByWall = useMemo(() => {
        const map: Record<number, typeof kitchen.obstacles> = {};
        (kitchen.obstacles || []).forEach((obs) => {
            if (!map[obs.wallIndex]) map[obs.wallIndex] = [];
            map[obs.wallIndex].push(obs);
        });
        return map;
    }, [kitchen.obstacles]);

    if (!kitchen.walls || kitchen.walls.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                <div className="w-16 h-16 rounded-full bg-magic-purple/10 flex items-center justify-center mb-6 animate-pulse">
                    <Plus className="text-magic-purple" size={32} />
                </div>
                <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm mb-2">No_Walls_Detected</h3>
                <button
                    onClick={() => dispatch(addWall({ projectId: kitchen.projectId }))}
                    className="px-10 py-4 bg-magic-purple text-white font-black rounded-full hover:scale-105 transition-all text-[10px] uppercase tracking-widest shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                >
                    Create_First_Wall_Vector
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="sticky top-0 z-50 py-4 bg-obsidian/80 backdrop-blur-md mb-10">
                <WallNavigator walls={kitchen.walls} />
            </div>

            <div className="space-y-32 pb-60">
                {kitchen.walls.map((wall, index) => {
                    const wallObstacles = obstaclesByWall[index] || [];

                    return (
                        <div key={index} id={`wall-panel-${index}`} className="relative scroll-mt-40 group z-10 isolate flex flex-col">
                            {/* ... WALL HEADER LOGIC ... */}

                            <div
                                className="wall-surface relative h-80 bg-[#080808] rounded-[2.5rem] border-2 border-white/10 overflow-hidden z-20"
                                onClick={() => dispatch(setSelectedObstacle(null))}
                            >
                                <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
                                     style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

                                {wallObstacles.map((obs) => {
                                    // Calculate global index for the dispatcher
                                    const globalIdx = kitchen.obstacles.findIndex(o => o.id === obs.id);
                                    return (
                                        <DraggableObstacle
                                            key={obs.id}
                                            obstacle={obs}
                                            obstacleIndex={globalIdx}
                                            wall={wall}
                                            isSelected={selectedObstacleIndex === globalIdx}
                                        />
                                    );
                                })}

                                {wallObstacles.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                        <span className="text-[10px] uppercase font-black tracking-[0.5em] text-white">Surface_Ready</span>
                                    </div>
                                )}
                            </div>

                            <div className="relative z-30 px-8" style={{ transform: 'translateY(-1.5rem)' }}>
                                <ObstacleToolbox wallIndex={index} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}
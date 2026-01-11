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

export default function ElevationEngine({ kitchen }: { kitchen: IKitchen }) {
    const dispatch = useAppDispatch();
    const { selectedObstacleIndex } = useAppSelector((state) => state.kitchen);

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
            {/* HUD: Sticky Navigation */}
            <div className="sticky top-0 z-50 py-4 bg-obsidian/80 backdrop-blur-md mb-10">
                <WallNavigator walls={kitchen.walls} />
            </div>

            <div className="space-y-32 pb-60">
                {kitchen.walls.map((wall, index) => (
                    <div
                        key={index}
                        id={`wall-panel-${index}`}
                        className="relative scroll-mt-40 group z-10 isolate flex flex-col"
                        onClick={() => dispatch(setSelectedObstacle(null))}
                    >
                        {/* WALL HEADER */}
                        <div className="flex justify-between items-end mb-6 px-4">
                            <div className="flex items-center gap-4">
                                <span className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-magic-purple">
                                    0{index + 1}
                                </span>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Elevation_Vector</h3>
                                    <p className="text-lg font-black text-white italic tracking-tighter">{wall.label}</p>
                                </div>
                            </div>

                            {/* Length Input: StopPropagation is key here */}
                            <div
                                className="flex items-center gap-3 bg-white/[0.03] px-4 py-2 rounded-2xl border border-white/10 focus-within:border-magic-purple/50 transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="number"
                                    value={wall.length}
                                    onChange={(e) => dispatch(updateWallLength({ index, length: Number(e.target.value) }))}
                                    className="bg-transparent text-sm font-mono text-magic-purple w-20 focus:outline-none text-right font-bold"
                                />
                                <span className="text-[10px] text-white/20 uppercase font-black">cm</span>
                            </div>
                        </div>

                        {/* THE WALL SURFACE */}
                        <div
                            className="wall-surface relative h-80 bg-[#080808] rounded-[2.5rem] border-2 border-white/10 shadow-2xl transition-all group-hover:border-white/20 touch-none overflow-hidden z-20"
                        >
                            {/* CAD Grid */}
                            <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
                                 style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />

                            {/* Obstacles */}
                            {kitchen.obstacles
                                .map((obs, idx) => ({ obs, idx }))
                                .filter(item => item.obs.wallIndex === index)
                                .map(item => (
                                    <DraggableObstacle
                                        key={`${index}-obs-${item.idx}`}
                                        obstacle={item.obs}
                                        obstacleIndex={item.idx}
                                        wall={wall}
                                        isSelected={selectedObstacleIndex === item.idx}
                                    />
                                ))
                            }

                            {/* Empty Hint */}
                            {kitchen.obstacles.filter(o => o.wallIndex === index).length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                    <span className="text-[10px] uppercase font-black tracking-[0.5em] text-white">Surface_Ready</span>
                                </div>
                            )}
                        </div>

                        {/* THE TOOLBOX: Isolated via translateY and StopPropagation */}
                        <div
                            className="relative z-30 px-8 pointer-events-auto"
                            style={{ transform: 'translateY(-1.5rem)' }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseMove={(e) => e.stopPropagation()}
                        >
                            <ObstacleToolbox wallIndex={index} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
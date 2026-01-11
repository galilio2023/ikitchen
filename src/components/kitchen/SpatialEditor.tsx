'use client';

import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    addObstacle,
    setSelectedObstacle
} from '@/lib/features/kitchens/kitchenSlice';
import { Zap, Wind, Cpu, ShieldAlert, DoorOpen, Square } from 'lucide-react';
import { ObstacleType } from "@/types/kitchen";

export default function SpatialEditor() {
    const dispatch = useAppDispatch();

    // SELECTOR: Use the unified kitchen state
    const { currentKitchen, selectedObstacleId } = useAppSelector((state) => state.kitchen);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const GRID_SIZE = 20;

    // OPTIMIZED: Memoize the obstacles list to stabilize the rendering loop
    const renderableObstacles = useMemo(() => {
        return (currentKitchen?.obstacles ?? []).map((obs, index) => ({
            ...obs,
            renderKey: obs.id || `spatial-obs-${index}-${obs.position.x}-${obs.position.y}`
        }));
    }, [currentKitchen?.obstacles]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const typeString = e.dataTransfer.getData("obstacleType");

        if (typeString) {
            const type = typeString as ObstacleType;
            const rect = e.currentTarget.getBoundingClientRect();

            // Calculate snapped coordinates
            const x = Math.round((e.clientX - rect.left) / GRID_SIZE) * GRID_SIZE;
            const y = Math.round((e.clientY - rect.top) / GRID_SIZE) * GRID_SIZE;

            dispatch(addObstacle({
                type,
                wallIndex: 0,
                x,
                y
            }));
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => dispatch(setSelectedObstacle(null))}
            className="relative w-full h-full bg-[#030303] overflow-hidden cursor-crosshair border border-white/5 shadow-inner"
            style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }}
        >
            {/* Render Hardware Nodes using the memoized list */}
            {renderableObstacles.map((obs) => (
                <div
                    key={obs.renderKey}
                    draggable
                    onDragStart={() => setDraggingId(obs.id)}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (obs.id) dispatch(setSelectedObstacle(obs.id));
                    }}
                    className={`
                        absolute p-2 z-20 group transition-all duration-200 rounded-lg border cursor-grab active:cursor-grabbing
                        ${selectedObstacleId === obs.id
                        ? 'bg-magic-purple/20 border-magic-purple shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-110'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.05]'}
                    `}
                    style={{
                        left: obs.position.x,
                        top: obs.position.y,
                        width: 44,
                        height: 44,
                        // Offset by half width/height so it drops centered on cursor
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="flex items-center justify-center h-full w-full">
                        <ObstacleIcon type={obs.type} />
                    </div>

                    {/* Metadata Label */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-max text-[7px] text-white/30 uppercase font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/50 px-1 py-0.5 rounded">
                        {obs.type}_NODE::{Math.round(obs.position.x)},{Math.round(obs.position.y)}
                    </div>
                </div>
            ))}

            {/* Offline Guard */}
            {!currentKitchen && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
                    <ShieldAlert size={32} className="text-red-500 mb-4 animate-pulse" />
                    <p className="text-red-500 font-mono text-[10px] tracking-[0.2em] uppercase">
                        NEURAL_WORKSPACE_OFFLINE
                    </p>
                </div>
            )}
        </div>
    );
}

function ObstacleIcon({ type }: { type: string }) {
    const iconSize = 18;
    switch(type) {
        case 'socket': return <Zap size={iconSize} className="text-yellow-400" />;
        case 'vent': return <Wind size={iconSize} className="text-blue-400" />;
        case 'door': return <DoorOpen size={iconSize} className="text-orange-400" />;
        case 'window': return <Square size={iconSize} className="text-blue-400" />;
        default: return <Cpu size={iconSize} className="text-magic-purple" />;
    }
}
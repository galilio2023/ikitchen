'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addObstacle, moveObstacle } from '@/lib/features/projects/projectSlice';
import { Zap, Wind, Cpu, Trash2 } from 'lucide-react';
import {ObstacleType} from "@/types";

export default function SpatialEditor() {
    const dispatch = useAppDispatch();
    // Use the specific kitchen/project slice
    const currentProject = useAppSelector((state) => state.projects.currentProject);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    // Inside SpatialEditor.tsx handleDrop function
    const GRID_SIZE = 20;

// 2. Fix the handleDrop dispatch
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
                wallIndex: 0, // Default for Spatial Editor
                x,
                y
                // NOTE: Removed width/height because the Reducer handles defaults
            }));
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative w-full h-full bg-[#030303] overflow-hidden cursor-crosshair border border-white/5"
            style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }}
        >
            {currentProject?.obstacles?.map((obs) => (
                <div
                    key={obs.id}
                    draggable
                    onDragStart={() => setDraggingId(obs.id)}
                    className="absolute glass-brilliant border border-white/10 hover:border-magic-purple/40 p-2 z-20 group"
                    style={{ left: obs.x, top: obs.y, width: 40, height: 40 }}
                >
                    {/* Icon Mapping */}
                    <ObstacleIcon type={obs.type} />

                    <div className="absolute -bottom-5 left-0 text-[6px] text-white/20 uppercase font-mono">
                        {obs.type}_NODE
                    </div>
                </div>
            ))}

            {!currentProject && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <p className="text-red-500 font-mono text-[10px] animate-pulse">
                        ERROR: DATABASE_OFFLINE_SYNC_FAILED
                    </p>
                </div>
            )}
        </div>
    );
}

function ObstacleIcon({ type }: { type: string }) {
    switch(type) {
        case 'socket': return <Zap size={16} className="text-yellow-400" />;
        case 'vent': return <Wind size={16} className="text-blue-400" />;
        default: return <Cpu size={16} className="text-magic-purple" />;
    }
}
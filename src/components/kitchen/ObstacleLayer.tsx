'use client';

import React, { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { addObstacle } from '@/lib/features/kitchens/kitchenSlice';
import { calculateWallPoints, getNearestWallInfo } from '@/lib/geometry';
import { ObstacleType } from '@/types/kitchen';
import DraggableObstacle from './DraggableObstacle';

export default function ObstacleLayer() {
    const dispatch = useAppDispatch();
    const { currentKitchen } = useAppSelector((state) => state.kitchen);

    const wallTracks = useMemo(() => {
        return currentKitchen ? calculateWallPoints(currentKitchen.walls) : [];
    }, [currentKitchen]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!currentKitchen) return;

        // 1. Get the type of obstacle being dropped
        const type = e.dataTransfer.getData('obstacleType') as ObstacleType;

        // 2. Get mouse coordinates relative to the canvas
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // 3. The Math Brain: Find the nearest wall and the snap position
        const snap = getNearestWallInfo(mouseX, mouseY, wallTracks);

        // 4. Create the IObstacle object
        const newObstacle = {
            id: crypto.randomUUID(),
            type: type,
            wallIndex: snap.wallIndex,
            position: {
                x: snap.positionX, // The horizontal distance along the wall (CM)
                y: 100,            // Default height from floor
                z: 0,
                width: 60,         // Default width
                height: 60,        // Default height
                depth: 2
            }
        };

        // 5. Send to Redux
        dispatch(addObstacle(newObstacle));
    };

    if (!currentKitchen) return null;

    return (
        <div
            onDragOver={(e) => e.preventDefault()} // Required to allow drop
            onDrop={handleDrop}
            className="relative w-full h-[600px] bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden group"
        >
            {/* Visual Grid for better technical feel */}
            <div className="absolute inset-0 grid-background opacity-20 pointer-events-none" />

            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {wallTracks.map((wall, i) => (
                    <g key={i}>
                        <line
                            x1={wall.start.x} y1={wall.start.y}
                            x2={wall.end.x} y2={wall.end.y}
                            stroke="#8b5cf6"
                            strokeWidth="2"
                            strokeDasharray="4 8"
                            className="opacity-40 group-hover:opacity-100 transition-opacity duration-700"
                        />
                        <text
                            x={(wall.start.x + wall.end.x) / 2}
                            y={(wall.start.y + wall.end.y) / 2 - 10}
                            fill="rgba(139, 92, 246, 0.5)"
                            className="text-[9px] font-mono font-bold uppercase tracking-tighter"
                            textAnchor="middle"
                        >
                            Wall_{wall.label} ({wall.length}cm)
                        </text>
                    </g>
                ))}
            </svg>

            {/* Render Obstacles */}
            {currentKitchen.obstacles.map((obs) => (
                <DraggableObstacle
                    key={obs.id}
                    obstacle={obs}
                    wallTracks={wallTracks}
                />
            ))}
        </div>
    );
}
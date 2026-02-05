'use client';

import React from 'react';
import { Wind, DoorOpen, Zap, Box } from 'lucide-react';
import { ObstacleType } from "@/types/kitchen";
import { useKitchenStore } from '@/providers/KitchenStoreProvider'; // CORRECTED IMPORT PATH
import { v4 as uuidv4 } from 'uuid';

const obstacleTypes: { type: ObstacleType; label: string; icon: React.ReactNode }[] = [
    { type: 'window', label: 'Window', icon: <Wind size={20} /> },
    { type: 'door', label: 'Door', icon: <DoorOpen size={20} /> },
    { type: 'socket', label: 'Socket', icon: <Zap size={20} /> },
    { type: 'pillar', label: 'Pillar', icon: <Box size={20} /> },
];

interface ObstacleToolboxProps {
    wallIndex: number;
}

export default function ObstacleToolbox({ wallIndex }: ObstacleToolboxProps) {
    const { addObstacle } = useKitchenStore(state => state);

    const handleDragStart = (e: React.DragEvent, type: ObstacleType) => {
        e.dataTransfer.setData("obstacleType", type);
    };

    const handleAddClick = (type: ObstacleType) => {
        addObstacle({
            id: uuidv4(),
            type: type,
            wallIndex: wallIndex,
            position: { x: 50, y: 50, z: 0, width: 60, height: 60, depth: 20 }
        });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add to Wall</h3>
            <div className="grid grid-cols-2 gap-4">
                {obstacleTypes.map(({ type, label, icon }) => (
                    <div
                        key={type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, type)}
                        onClick={() => handleAddClick(type)}
                        className="card p-4 flex flex-col items-center justify-center gap-2 cursor-grab hover:bg-accent hover:border-primary transition-colors"
                    >
                        {icon}
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

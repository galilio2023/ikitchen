'use client';

import React from 'react';
import { Wind, DoorOpen, Zap, Box, Ban } from 'lucide-react';
import { ObstacleType } from "@/types/kitchen";
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { cn } from '@/lib/utils';

const obstacleTypes: { type: ObstacleType; label: string; icon: React.ReactNode }[] = [
    { type: 'window', label: 'Window', icon: <Wind size={20} /> },
    { type: 'door', label: 'Door', icon: <DoorOpen size={20} /> },
    { type: 'socket', label: 'Socket', icon: <Zap size={20} /> },
    { type: 'pillar', label: 'Pillar', icon: <Box size={20} /> },
    { type: 'clearance', label: 'Clear Zone', icon: <Ban size={20} /> },
];

interface ObstacleToolboxProps {
    wallIndex: number;
}

export default function ObstacleToolbox({ wallIndex }: ObstacleToolboxProps) {
    const { activeTool, setActiveTool } = useKitchenStore(state => state);

    const handleToolClick = (type: ObstacleType) => {
        if (activeTool === type) {
            setActiveTool(null); // Deselect if already active
        } else {
            setActiveTool(type);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Drawing Tools</h3>
            <p className="text-sm text-muted-foreground">
                Select a tool to define constraints for the AI.
            </p>
            <div className="grid grid-cols-2 gap-4">
                {obstacleTypes.map(({ type, label, icon }) => (
                    <button
                        key={type}
                        onClick={() => handleToolClick(type)}
                        className={cn(
                            "card p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200",
                            activeTool === type 
                                ? "bg-primary text-primary-foreground border-primary shadow-md scale-105" 
                                : "hover:bg-accent hover:border-primary/50"
                        )}
                    >
                        {icon}
                        <span className="text-sm font-medium">{label}</span>
                    </button>
                ))}
            </div>
            
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md mt-4">
                <p className="font-semibold mb-1">Tip:</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li>Use <strong>Window</strong> for areas where low cabinets are okay.</li>
                    <li>Use <strong>Clear Zone</strong> for walkways or dining areas where <em>nothing</em> should be placed.</li>
                </ul>
            </div>
        </div>
    );
}

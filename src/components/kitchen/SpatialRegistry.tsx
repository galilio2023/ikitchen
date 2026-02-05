'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Box, DoorOpen, Power, Wind, Zap } from 'lucide-react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider'; // CORRECTED IMPORT PATH

interface Node {
    id: string;
    type: string;
}

interface SpatialRegistryProps {
    nodes: Node[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export default function SpatialRegistry({ nodes, selectedId, onSelect }: SpatialRegistryProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'window': return <Wind size={14} />;
            case 'door': return <DoorOpen size={14} />;
            case 'socket': return <Zap size={14} />;
            case 'appliance': return <Power size={14} />;
            default: return <Box size={14} />;
        }
    };

    return (
        <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4">Scene Objects</h3>
            {nodes.map((node) => (
                <button
                    key={node.id}
                    onClick={() => onSelect(node.id)}
                    className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                        selectedId === node.id
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-muted-foreground hover:bg-accent"
                    )}
                >
                    <span className={cn(selectedId === node.id ? "text-primary" : "text-muted-foreground/50")}>
                        {getIcon(node.type)}
                    </span>
                    <span className="text-sm font-semibold">
                        {node.type}
                    </span>
                </button>
            ))}
            {nodes.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">No objects in scene.</p>
                </div>
            )}
        </div>
    );
}

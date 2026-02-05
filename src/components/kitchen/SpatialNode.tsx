'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useKitchenStore } from '@/providers/KitchenStoreProvider'; // CORRECTED IMPORT PATH

interface SpatialNodeProps {
    id: string;
    type: string;
    x: number;
    y: number;
    isSelected: boolean;
    onDragStart: () => void;
    onClick: (e: React.MouseEvent) => void;
}

export default function SpatialNode({ id, type, x, y, isSelected, onDragStart, onClick }: SpatialNodeProps) {
    const { validationErrors } = useKitchenStore(state => state);
    
    const isInError = validationErrors.some(err => err.itemIds.includes(id));

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
            style={{
                transform: `translate(${x}px, ${y}px)`,
                position: 'absolute',
                width: '64px',
                height: '64px',
            }}
            className={cn(
                "bg-accent rounded-lg cursor-grab active:cursor-grabbing shadow-md border-2",
                "flex items-center justify-center text-xs font-mono uppercase text-accent-foreground",
                isSelected ? "border-primary" : "border-transparent",
                isInError && "border-destructive"
            )}
        >
            {type}
        </div>
    );
}

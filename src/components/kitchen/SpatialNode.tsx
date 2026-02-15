'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { motion } from 'framer-motion';

interface SpatialNodeProps {
    id: string;
    type: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    isSelected: boolean;
    onDragStart: () => void;
    onClick: (e: React.MouseEvent) => void;
}

export default function SpatialNode({ id, type, x, y, width = 64, height = 64, isSelected, onDragStart, onClick }: SpatialNodeProps) {
    const { validationErrors } = useKitchenStore(state => state);
    
    const isInError = validationErrors.some(err => err.itemIds.includes(id));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            
            // Native drag attributes are still needed for the HTML5 Drag & Drop API used in the parent
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
            
            style={{
                x, // Framer Motion handles the transform directly
                y,
                position: 'absolute',
                width: `${width}px`,
                height: `${height}px`,
            }}
            className={cn(
                "bg-accent rounded-lg cursor-grab active:cursor-grabbing shadow-md border-2",
                "flex items-center justify-center text-xs font-mono uppercase text-accent-foreground select-none",
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent",
                isInError && "border-destructive ring-2 ring-destructive/20"
            )}
        >
            {/* Inner content with subtle detail */}
            <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                {/* Architectural lines */}
                <div className="absolute inset-0 border border-black/5 opacity-20 m-1 rounded-sm" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-black/10" />
                
                <span className="z-10 font-bold tracking-wider">{type}</span>
                
                {/* Dimensions tooltip on hover could go here */}
            </div>
        </motion.div>
    );
}

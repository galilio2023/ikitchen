'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { motion } from 'framer-motion';
import { Wind, DoorOpen, Zap, Box, Ban, Power } from 'lucide-react';

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

    // Type-specific styling configuration
    const getNodeStyle = (type: string) => {
        switch (type) {
            case 'window':
                return {
                    bg: 'bg-blue-100/80 dark:bg-blue-900/30',
                    border: 'border-blue-400 dark:border-blue-500',
                    text: 'text-blue-700 dark:text-blue-300',
                    icon: <Wind size={16} />
                };
            case 'door':
                return {
                    bg: 'bg-amber-100/80 dark:bg-amber-900/30',
                    border: 'border-amber-400 dark:border-amber-500',
                    text: 'text-amber-700 dark:text-amber-300',
                    icon: <DoorOpen size={16} />
                };
            case 'socket':
                return {
                    bg: 'bg-yellow-100/80 dark:bg-yellow-900/30',
                    border: 'border-yellow-400 dark:border-yellow-500',
                    text: 'text-yellow-700 dark:text-yellow-300',
                    icon: <Zap size={16} />
                };
            case 'clearance':
                return {
                    bg: 'bg-red-50/50 dark:bg-red-900/10',
                    border: 'border-red-300 border-dashed dark:border-red-700',
                    text: 'text-red-600 dark:text-red-400',
                    icon: <Ban size={16} />
                };
            case 'appliance':
                return {
                    bg: 'bg-purple-100/90 dark:bg-purple-900/40',
                    border: 'border-purple-400 dark:border-purple-500',
                    text: 'text-purple-700 dark:text-purple-300',
                    icon: <Power size={16} />
                };
            default:
                return {
                    bg: 'bg-accent/80',
                    border: 'border-border',
                    text: 'text-foreground',
                    icon: <Box size={16} />
                };
        }
    };

    const style = getNodeStyle(type);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            
            draggable
            onDragStart={onDragStart}
            onClick={onClick}
            
            style={{
                left: `${x}px`, 
                top: `${y}px`,
                position: 'absolute',
                width: `${width}px`,
                height: `${height}px`,
            }}
            className={cn(
                "rounded-md cursor-grab active:cursor-grabbing shadow-sm border-2 backdrop-blur-sm",
                "flex flex-col items-center justify-center select-none transition-colors duration-200",
                style.bg,
                style.border,
                isSelected ? "ring-2 ring-primary ring-offset-1 z-20" : "z-10",
                isInError && "border-destructive ring-2 ring-destructive/50"
            )}
        >
            {/* Architectural Center Line for Windows/Doors */}
            {(type === 'window' || type === 'door') && (
                <div className={cn("absolute inset-x-0 top-1/2 h-px bg-current opacity-30", style.text)} />
            )}

            <div className={cn("flex flex-col items-center gap-1 p-1", style.text)}>
                {/* Only show icon if height allows */}
                {height >= 40 && (
                    <span className="opacity-80">{style.icon}</span>
                )}
                
                {/* Only show label if width allows */}
                {width >= 50 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider leading-none truncate max-w-full px-1">
                        {type}
                    </span>
                )}
                
                {/* Dimensions on hover or selection */}
                {(isSelected || (width > 80 && height > 60)) && (
                    <span className="text-[8px] font-mono opacity-60 leading-none">
                        {Math.round(width)}x{Math.round(height)}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

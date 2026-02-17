'use client';

import React from 'react';
import { Copy, Trash2, X } from 'lucide-react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { v4 as uuidv4 } from 'uuid';
import { IObstacle, IAppliance } from '@/types/kitchen';

interface ContextualToolbarProps {
    selectedId: string;
    onClose: () => void;
}

export default function ContextualToolbar({ selectedId, onClose }: ContextualToolbarProps) {
    const { currentKitchen, addObstacle, addAppliance, deleteObstacle } = useKitchenStore(state => state);

    const handleDuplicate = () => {
        if (!currentKitchen) return;
        
        const obstacle = currentKitchen.obstacles.find(o => o.id === selectedId);
        const appliance = currentKitchen.appliances?.find(a => a.id === selectedId);
        
        if (obstacle) {
            const newObstacle: IObstacle = {
                ...obstacle,
                id: uuidv4(),
                position: {
                    ...obstacle.position,
                    x: obstacle.position.x + 10,
                    y: obstacle.position.y + 10
                }
            };
            addObstacle(newObstacle);
        } else if (appliance) {
            const newAppliance: IAppliance = {
                ...appliance,
                id: uuidv4(),
                position: {
                    ...appliance.position,
                    x: appliance.position.x + 10,
                    y: appliance.position.y + 10
                }
            };
            addAppliance(newAppliance);
        }
    };

    const handleDelete = () => {
        deleteObstacle(selectedId);
        onClose();
    };

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/90 backdrop-blur border rounded-lg p-1 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <button 
                onClick={handleDuplicate}
                className="p-2 hover:bg-accent hover:text-primary rounded-md transition-colors flex items-center gap-2 text-xs font-medium"
                title="Duplicate Item"
            >
                <Copy size={14} />
                <span>Duplicate</span>
            </button>
            
            <div className="w-px h-4 bg-border mx-1" />
            
            <button 
                onClick={handleDelete}
                className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors flex items-center gap-2 text-xs font-medium"
                title="Delete Item"
            >
                <Trash2 size={14} />
                <span>Delete</span>
            </button>

            <div className="w-px h-4 bg-border mx-1" />

            <button 
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                title="Deselect"
            >
                <X size={14} />
            </button>
        </div>
    );
}

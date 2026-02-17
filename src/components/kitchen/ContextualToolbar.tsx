'use client';

import React from 'react';
import { Copy, Trash2, X } from 'lucide-react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { v4 as uuidv4 } from 'uuid';

interface ContextualToolbarProps {
    selectedId: string;
    onClose: () => void;
}

export default function ContextualToolbar({ selectedId, onClose }: ContextualToolbarProps) {
    const { currentKitchen, addObstacle, deleteObstacle } = useKitchenStore(state => state);

    const handleDuplicate = () => {
        if (!currentKitchen) return;
        
        // Find the object in obstacles or appliances
        const obstacle = currentKitchen.obstacles.find(o => o.id === selectedId);
        const appliance = currentKitchen.appliances?.find(a => a.id === selectedId);
        
        const item = obstacle || appliance;
        
        if (item) {
            // Create a copy with a new ID and slightly offset position
            const newItem = {
                ...item,
                id: uuidv4(),
                position: {
                    ...item.position,
                    x: item.position.x + 10,
                    y: item.position.y + 10
                }
            };
            
            // We use addObstacle for both because the store handles merging/separation logic 
            // (though ideally we should have separate actions, for now addObstacle works for generic items)
            // Note: If it's an appliance, we might need a specific addAppliance action in the future.
            // For now, let's assume we are duplicating obstacles.
            if (obstacle) {
                addObstacle(newItem);
            }
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

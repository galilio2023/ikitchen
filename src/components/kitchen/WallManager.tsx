'use client';

import React, { useState } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function WallManager() {
    const { 
        currentKitchen, 
        activeWallIndex, 
        setActiveWallIndex,
        addWall,
        updateWall,
        deleteWall
    } = useKitchenStore(state => state);

    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState<{ label: string; length: number; height: number } | null>(null);

    if (!currentKitchen) return null;

    const walls = currentKitchen.walls || [];

    const handleAddWall = () => {
        const newWall = {
            id: uuidv4(),
            label: `Wall ${walls.length + 1}`,
            length: 300, // Default length
            height: 240, // Default height
            thickness: 10
        };
        addWall(newWall);
        setActiveWallIndex(walls.length); // Select the new wall
    };

    const handleStartEdit = () => {
        const currentWall = walls[activeWallIndex];
        if (currentWall) {
            setEditValues({
                label: currentWall.label,
                length: currentWall.length,
                height: currentWall.height
            });
            setIsEditing(true);
        }
    };

    const handleSaveEdit = () => {
        if (editValues) {
            updateWall(activeWallIndex, editValues);
            setIsEditing(false);
            setEditValues(null);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditValues(null);
    };

    const handleDeleteWall = () => {
        if (walls.length <= 1) {
            alert("You must have at least one wall.");
            return;
        }
        if (confirm("Are you sure you want to delete this wall? All items on it will be removed.")) {
            deleteWall(activeWallIndex);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-muted-foreground">Walls</h3>
                <button 
                    onClick={handleAddWall}
                    className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                    <Plus size={12} /> Add Wall
                </button>
            </div>

            {/* Wall Selector Tabs */}
            <div className="flex flex-wrap gap-2">
                {walls.map((wall, index) => (
                    <button
                        key={wall.id}
                        onClick={() => setActiveWallIndex(index)}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                            activeWallIndex === index
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-border hover:bg-accent"
                        )}
                    >
                        {wall.label}
                    </button>
                ))}
            </div>

            {/* Active Wall Properties Editor */}
            {walls[activeWallIndex] && (
                <div className="p-3 bg-muted/30 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">
                            {isEditing ? "Edit Wall" : walls[activeWallIndex].label}
                        </span>
                        <div className="flex gap-1">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSaveEdit} className="p-1 hover:bg-green-100 text-green-600 rounded">
                                        <Check size={14} />
                                    </button>
                                    <button onClick={handleCancelEdit} className="p-1 hover:bg-red-100 text-red-600 rounded">
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleStartEdit} className="p-1 hover:bg-accent rounded text-muted-foreground">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={handleDeleteWall} className="p-1 hover:bg-red-100 text-red-500 rounded">
                                        <Trash2 size={14} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-2">
                                <label className="text-[10px] uppercase text-muted-foreground">Label</label>
                                <input 
                                    type="text" 
                                    value={editValues?.label || ''}
                                    onChange={(e) => setEditValues(prev => prev ? {...prev, label: e.target.value} : null)}
                                    className="w-full text-xs p-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-muted-foreground">Length (cm)</label>
                                <input 
                                    type="number" 
                                    value={editValues?.length || 0}
                                    onChange={(e) => setEditValues(prev => prev ? {...prev, length: Number(e.target.value)} : null)}
                                    className="w-full text-xs p-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-muted-foreground">Height (cm)</label>
                                <input 
                                    type="number" 
                                    value={editValues?.height || 0}
                                    onChange={(e) => setEditValues(prev => prev ? {...prev, height: Number(e.target.value)} : null)}
                                    className="w-full text-xs p-1 border rounded"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div>Length: <span className="text-foreground">{walls[activeWallIndex].length} cm</span></div>
                            <div>Height: <span className="text-foreground">{walls[activeWallIndex].height} cm</span></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

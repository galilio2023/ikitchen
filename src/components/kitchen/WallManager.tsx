'use client';

import React, { useState } from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Edit2, Check, X, Ruler } from 'lucide-react';
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
            length: 300,
            height: 240,
            thickness: 10
        };
        addWall(newWall);
        setActiveWallIndex(walls.length);
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

    const handleDeleteWall = () => {
        if (walls.length <= 1) {
            alert("You must have at least one wall.");
            return;
        }
        if (confirm("Are you sure you want to delete this wall?")) {
            deleteWall(activeWallIndex);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Active Wall</h3>
                <button 
                    onClick={handleAddWall}
                    className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                    <Plus size={14} /> Add Wall
                </button>
            </div>

            {/* Segmented Control for Walls */}
            <div className="flex p-1 bg-muted rounded-lg overflow-x-auto custom-scrollbar">
                {walls.map((wall, index) => (
                    <button
                        key={wall.id}
                        onClick={() => setActiveWallIndex(index)}
                        className={cn(
                            "flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                            activeWallIndex === index
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {wall.label}
                    </button>
                ))}
            </div>

            {/* Active Wall Properties */}
            {walls[activeWallIndex] && (
                <div className="p-4 bg-card border rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary/10 rounded text-primary">
                                <Ruler size={14} />
                            </div>
                            <span className="text-sm font-semibold">
                                {isEditing ? "Edit Dimensions" : walls[activeWallIndex].label}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSaveEdit} className="p-1.5 hover:bg-green-500/10 text-green-600 rounded-md transition-colors">
                                        <Check size={14} />
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="p-1.5 hover:bg-red-500/10 text-red-600 rounded-md transition-colors">
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleStartEdit} className="p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground rounded-md transition-colors">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={handleDeleteWall} className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Label</label>
                                <input 
                                    type="text" 
                                    value={editValues?.label || ''}
                                    onChange={(e) => setEditValues(prev => prev ? {...prev, label: e.target.value} : null)}
                                    className="w-full text-xs p-2 bg-background border rounded-md focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Length (cm)</label>
                                    <input 
                                        type="number" 
                                        value={editValues?.length || 0}
                                        onChange={(e) => setEditValues(prev => prev ? {...prev, length: Number(e.target.value)} : null)}
                                        className="w-full text-xs p-2 bg-background border rounded-md focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Height (cm)</label>
                                    <input 
                                        type="number" 
                                        value={editValues?.height || 0}
                                        onChange={(e) => setEditValues(prev => prev ? {...prev, height: Number(e.target.value)} : null)}
                                        className="w-full text-xs p-2 bg-background border rounded-md focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-muted/30 p-2 rounded-lg">
                                <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Length</span>
                                <span className="text-sm font-mono font-medium">{walls[activeWallIndex].length} cm</span>
                            </div>
                            <div className="bg-muted/30 p-2 rounded-lg">
                                <span className="text-[10px] uppercase text-muted-foreground block mb-0.5">Height</span>
                                <span className="text-sm font-mono font-medium">{walls[activeWallIndex].height} cm</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

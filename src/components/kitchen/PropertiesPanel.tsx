'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateObstacleDetails, setSelectedObstacle } from '@/lib/features/kitchens/kitchenSlice';
import { X, Ruler, MoveHorizontal, MoveVertical, Maximize } from 'lucide-react';
import React from "react";

export default function PropertiesPanel() {
    const dispatch = useAppDispatch();
    const { currentKitchen, selectedObstacleIndex } = useAppSelector((state) => state.kitchen);

    if (selectedObstacleIndex === null || !currentKitchen) return null;

    const obstacle = currentKitchen.obstacles[selectedObstacleIndex];
    const { x, y, width, height } = obstacle.position;

    const updateValue = (key: string, val: string) => {
        dispatch(updateObstacleDetails({
            index: selectedObstacleIndex,
            updates: { [key]: parseFloat(val) || 0 }
        }));
    };

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 w-72 glass-brilliant rounded-[2rem] border border-white/10 p-6 z-[100] animate-in slide-in-from-right-10 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span className="text-[8px] font-black text-magic-purple uppercase tracking-widest">Properties</span>
                    <h3 className="text-sm font-bold text-white uppercase italic">{obstacle.type} node</h3>
                </div>
                <button
                    onClick={() => dispatch(setSelectedObstacle(null))}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={14} className="text-white/40" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Position Group */}
                <div className="space-y-4">
                    <PropertyInput
                        label="From_Left (X)"
                        icon={<MoveHorizontal size={12}/>}
                        value={x}
                        onChange={(v) => updateValue('x', v)}
                    />
                    <PropertyInput
                        label="From_Floor (Y)"
                        icon={<MoveVertical size={12}/>}
                        value={y}
                        onChange={(v) => updateValue('y', v)}
                    />
                </div>

                <div className="h-[1px] bg-white/5" />

                {/* Dimensions Group */}
                <div className="space-y-4">
                    <PropertyInput
                        label="Node_Width"
                        icon={<Maximize size={12}/>}
                        value={width}
                        onChange={(v) => updateValue('width', v)}
                    />
                    <PropertyInput
                        label="Node_Height"
                        icon={<Ruler size={12}/>}
                        value={height}
                        onChange={(v) => updateValue('height', v)}
                    />
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5">
                <p className="text-[7px] font-mono text-white/20 leading-relaxed uppercase">
                    Spatial_Lock enabled. Changes are synchronized to local_node in real-time.
                </p>
            </div>
        </div>
    );
}



// Reusable Input Component with explicit types
interface PropertyInputProps {
    label: string;
    icon: React.ReactNode;
    value: number;
    onChange: (val: string) => void; // This fixes TS7006
}

function PropertyInput({ label, icon, value, onChange }: PropertyInputProps) {
    return (
        <div className="space-y-1.5 group">
            <div className="flex items-center gap-2 text-white/30 group-focus-within:text-magic-purple transition-colors">
                {icon}
                <label className="text-[8px] font-black uppercase tracking-tighter">{label}</label>
            </div>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-magic-purple/50 focus:bg-white/[0.07] transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-white/10 italic">CM</span>
            </div>
        </div>
    );
}
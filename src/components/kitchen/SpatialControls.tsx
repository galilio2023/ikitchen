'use client';

import React, { useEffect } from 'react';
import { ShieldAlert, Undo2, Redo2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useKitchenHistory } from '@/providers/KitchenStoreProvider';

interface SpatialControlsProps {
    isOffline: boolean;
    zoom: number;
    onZoomChange: (zoom: number) => void;
    onResetView: () => void;
}

export default function SpatialControls({ isOffline, zoom, onZoomChange, onResetView }: SpatialControlsProps) {
    const { undo, redo, pastStates, futureStates } = useKitchenHistory((state) => ({
        undo: state.undo,
        redo: state.redo,
        pastStates: state.pastStates,
        futureStates: state.futureStates,
    }));

    const canUndo = pastStates.length > 0;
    const canRedo = futureStates.length > 0;

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    if (canRedo) redo();
                } else {
                    if (canUndo) undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                if (canRedo) redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, undo, redo]);

    if (isOffline) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 pointer-events-auto">
                <ShieldAlert size={32} className="text-red-500 mb-4 animate-pulse" />
                <p className="text-red-500 font-mono text-[10px] tracking-[0.2em] uppercase">
                    NEURAL_WORKSPACE_OFFLINE
                </p>
            </div>
        );
    }

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur border rounded-full p-2 shadow-lg z-40">
            <button 
                onClick={() => undo()} 
                disabled={!canUndo}
                className="p-2 hover:bg-accent rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Undo (Ctrl+Z)"
            >
                <Undo2 size={20} />
            </button>
            <button 
                onClick={() => redo()} 
                disabled={!canRedo}
                className="p-2 hover:bg-accent rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Redo (Ctrl+Y)"
            >
                <Redo2 size={20} />
            </button>
            
            <div className="w-px h-4 bg-border mx-1" />
            
            <button 
                onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                title="Zoom Out"
            >
                <ZoomOut size={20} />
            </button>
            <span className="text-xs font-mono w-12 text-center select-none">
                {Math.round(zoom * 100)}%
            </span>
            <button 
                onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                title="Zoom In"
            >
                <ZoomIn size={20} />
            </button>
            
            <div className="w-px h-4 bg-border mx-1" />
            
            <button 
                onClick={onResetView}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                title="Reset View"
            >
                <Maximize size={20} />
            </button>
        </div>
    );
}

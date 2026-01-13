'use client';

import React from 'react';
import { IKitchen } from '@/types/kitchen';
import SpatialNode from './SpatialNode';
import SpatialControls from './SpatialControls';

interface SpatialCanvasProps {
    currentKitchen: IKitchen | null;
    currentWall?: any;
    renderableObstacles: any[];
    selectedObstacleId: string | null;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onCanvasClick: () => void;
    onNodeClick: (id: string) => void;
    onNodeDragStart: (id: string) => void;
}

export default function SpatialCanvas({
    currentKitchen,
    currentWall,
    renderableObstacles,
    selectedObstacleId,
    onDrop,
    onDragOver,
    onCanvasClick,
    onNodeClick,
    onNodeDragStart
}: SpatialCanvasProps) {
    return (
        <div
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onCanvasClick}
            className="relative w-full h-full bg-transparent overflow-hidden cursor-crosshair border border-border shadow-inner"
            style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(6, 182, 212, 0.15) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }}
        >
            {/* Wall Boundary */}
            {currentWall && (
                <div 
                    className="absolute border-2 border-magic-cyan/20 bg-magic-cyan/5 pointer-events-none transition-all duration-500"
                    style={{
                        left: 0,
                        top: 0,
                        width: currentWall.length,
                        height: currentWall.height,
                    }}
                >
                    <div className="absolute top-2 right-4 text-[10px] font-mono text-magic-cyan/40 uppercase tracking-widest">
                        {currentWall.label} :: {currentWall.length}x{currentWall.height} CM
                    </div>
                </div>
            )}

            {/* Render Hardware Nodes */}
            {renderableObstacles.map((obs) => (
                <SpatialNode
                    key={obs.renderKey}
                    id={obs.id}
                    type={obs.type}
                    x={obs.position.x}
                    y={obs.position.y}
                    isSelected={selectedObstacleId === obs.id}
                    onDragStart={() => onNodeDragStart(obs.id)}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (obs.id) onNodeClick(obs.id);
                    }}
                />
            ))}

            {/* Offline Guard / Controls Layer */}
            <SpatialControls isOffline={!currentKitchen} />
        </div>
    );
}

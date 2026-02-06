'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import { IKitchen } from '@/types/kitchen';
import SpatialNode from './SpatialNode';
import SpatialControls from './SpatialControls';
import { PlusCircle } from 'lucide-react';

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
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (containerRef.current && currentWall) {
                const padding = 40;
                const availableWidth = containerRef.current.offsetWidth - (padding * 2);
                const wallWidth = currentWall.length;
                const newScale = Math.min(availableWidth / wallWidth, 1.5);
                setScale(newScale);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentWall]);

    const showEmptyState = renderableObstacles.length === 0;

    return (
        <div
            ref={containerRef}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onCanvasClick}
            className="relative w-full h-full bg-background overflow-hidden cursor-crosshair border-t flex items-center justify-center"
        >
            <div
                style={{
                    transform: `scale(${scale})`,
                    width: currentWall?.length || '100%',
                    height: currentWall?.height || '100%',
                    position: 'relative'
                }}
            >
                {currentWall && (
                    <div
                        className="absolute border-2 border-dashed border-border bg-muted/20 pointer-events-none"
                        style={{
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <div className="absolute -top-6 left-0 text-xs font-mono text-muted-foreground uppercase">
                            {currentWall.label} ({currentWall.length} x {currentWall.height} cm)
                        </div>
                    </div>
                )}

                {renderableObstacles.map((obs) => (
                    <SpatialNode
                        key={obs.id}
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
            </div>

            {showEmptyState && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                    <PlusCircle size={48} className="mb-4" />
                    <p className="text-sm font-bold">Your canvas is ready!</p>
                    <p className="text-xs mt-2">Go to the 'Add' tab in the sidebar to place items on your wall.</p>
                </div>
            )}

            <SpatialControls isOffline={!currentKitchen} />
        </div>
    );
}

'use client';

import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';
import { IKitchen } from '@/types/kitchen';
import SpatialNode from './SpatialNode';
import SpatialControls from './SpatialControls';
import { PlusCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

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
    const [snapLines, setSnapLines] = useState<{ x?: number, y?: number }>({});

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

    // Calculate snap guides
    const guides = useMemo(() => {
        if (!renderableObstacles) return { x: [], y: [] };
        
        const xGuides = new Set<number>();
        const yGuides = new Set<number>();

        renderableObstacles.forEach(obs => {
            if (obs.id === selectedObstacleId) return; // Don't snap to self
            
            // Edges and center
            xGuides.add(obs.position.x);
            xGuides.add(obs.position.x + obs.position.width);
            xGuides.add(obs.position.x + obs.position.width / 2);

            yGuides.add(obs.position.y);
            yGuides.add(obs.position.y + obs.position.height);
            yGuides.add(obs.position.y + obs.position.height / 2);
        });

        // Add wall boundaries
        if (currentWall) {
            xGuides.add(0);
            xGuides.add(currentWall.length);
            yGuides.add(0);
            yGuides.add(currentWall.height);
        }

        return { x: Array.from(xGuides), y: Array.from(yGuides) };
    }, [renderableObstacles, selectedObstacleId, currentWall]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        onDragOver(e);

        // Basic snapping visualization logic would go here
        // For now, we just pass through the event
    };

    const showEmptyState = renderableObstacles.length === 0;

    return (
        <div
            ref={containerRef}
            onDragOver={handleDragOver}
            onDrop={onDrop}
            onClick={onCanvasClick}
            className="relative w-full h-full bg-background overflow-hidden cursor-crosshair border-t flex items-center justify-center bg-grid-pattern"
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

                {/* Snap Lines */}
                {snapLines.x !== undefined && (
                    <div 
                        className="absolute top-0 bottom-0 border-l border-cyan-500 z-50 pointer-events-none animate-pulse"
                        style={{ left: snapLines.x }}
                    >
                        <span className="absolute top-0 left-1 text-[10px] bg-cyan-500 text-white px-1 rounded">
                            {Math.round(snapLines.x)}
                        </span>
                    </div>
                )}
                {snapLines.y !== undefined && (
                    <div 
                        className="absolute left-0 right-0 border-t border-cyan-500 z-50 pointer-events-none animate-pulse"
                        style={{ top: snapLines.y }}
                    >
                        <span className="absolute left-0 top-1 text-[10px] bg-cyan-500 text-white px-1 rounded">
                            {Math.round(snapLines.y)}
                        </span>
                    </div>
                )}

                <AnimatePresence>
                    {renderableObstacles.map((obs) => (
                        <SpatialNode
                            key={obs.id}
                            id={obs.id}
                            type={obs.type}
                            x={obs.position.x}
                            y={obs.position.y}
                            width={obs.position.width}
                            height={obs.position.height}
                            isSelected={selectedObstacleId === obs.id}
                            onDragStart={() => onNodeDragStart(obs.id)}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (obs.id) onNodeClick(obs.id);
                            }}
                        />
                    ))}
                </AnimatePresence>
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

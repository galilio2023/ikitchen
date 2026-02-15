'use client';

import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';
import { IKitchen, IObstacle, ObstacleType } from '@/types/kitchen';
import SpatialNode from './SpatialNode';
import SpatialControls from './SpatialControls';
import { PlusCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface SpatialCanvasProps {
    currentKitchen: IKitchen | null;
    currentWall?: any;
    renderableObstacles: any[];
    selectedObstacleId: string | null;
    activeTool: ObstacleType | null;
    onCanvasClick: () => void;
    onNodeClick: (id: string) => void;
    onNodeDragStart: (id: string) => void;
    onAddObstacle: (obstacle: IObstacle) => void;
    onToolUsed: () => void;
}

export default function SpatialCanvas({
                                          currentKitchen,
                                          currentWall,
                                          renderableObstacles,
                                          selectedObstacleId,
                                          activeTool,
                                          onCanvasClick,
                                          onNodeClick,
                                          onNodeDragStart,
                                          onAddObstacle,
                                          onToolUsed
                                      }: SpatialCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [snapLines, setSnapLines] = useState<{ x?: number, y?: number }>({});
    
    // Drawing state
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
    const [currentPoint, setCurrentPoint] = useState<{ x: number, y: number } | null>(null);

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

    // Helper to convert mouse coordinates to wall coordinates
    const getWallCoordinates = (e: React.MouseEvent) => {
        if (!containerRef.current || !currentWall) return { x: 0, y: 0 };

        const rect = containerRef.current.getBoundingClientRect();
        
        // Calculate the center of the container
        const containerCenterX = rect.width / 2;
        const containerCenterY = rect.height / 2;

        // Calculate the dimensions of the scaled wall
        const scaledWallWidth = currentWall.length * scale;
        const scaledWallHeight = currentWall.height * scale;

        // Calculate the top-left corner of the wall in the container's coordinate space
        const wallLeft = containerCenterX - (scaledWallWidth / 2);
        const wallTop = containerCenterY - (scaledWallHeight / 2);

        // Calculate the mouse position relative to the wall's top-left corner
        const mouseXRelative = e.clientX - rect.left - wallLeft;
        const mouseYRelative = e.clientY - rect.top - wallTop;

        // Convert back to unscaled wall coordinates
        return {
            x: mouseXRelative / scale,
            y: mouseYRelative / scale
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!activeTool || !currentWall) return;
        
        // Prevent default to stop text selection
        e.preventDefault();
        
        const coords = getWallCoordinates(e);
        setIsDrawing(true);
        setStartPoint(coords);
        setCurrentPoint(coords);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !startPoint) return;
        
        const coords = getWallCoordinates(e);
        setCurrentPoint(coords);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDrawing || !startPoint || !currentPoint || !activeTool || !currentWall) {
            setIsDrawing(false);
            setStartPoint(null);
            setCurrentPoint(null);
            return;
        }

        // Calculate final dimensions
        const width = Math.abs(currentPoint.x - startPoint.x);
        const height = Math.abs(currentPoint.y - startPoint.y);
        const x = Math.min(startPoint.x, currentPoint.x);
        const y = Math.min(startPoint.y, currentPoint.y);

        // Only add if it has some size (prevent accidental clicks)
        if (width > 5 && height > 5) {
            onAddObstacle({
                id: uuidv4(),
                type: activeTool,
                wallIndex: 0, // Assuming active wall index is handled by parent or store
                position: {
                    x,
                    y,
                    z: 0,
                    width,
                    height,
                    depth: 20 // Default depth
                }
            });
            onToolUsed();
        }

        setIsDrawing(false);
        setStartPoint(null);
        setCurrentPoint(null);
    };

    const showEmptyState = renderableObstacles.length === 0 && !isDrawing;

    return (
        <div
            ref={containerRef}
            onClick={onCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
                if (isDrawing) {
                    setIsDrawing(false);
                    setStartPoint(null);
                    setCurrentPoint(null);
                }
            }}
            className={`relative w-full h-full bg-background overflow-hidden border-t flex items-center justify-center bg-grid-pattern ${activeTool ? 'cursor-crosshair' : 'cursor-default'}`}
        >
            <div
                style={{
                    transform: `scale(${scale})`,
                    width: currentWall?.length || '100%',
                    height: currentWall?.height || '100%',
                    position: 'relative',
                    transformOrigin: 'center center'
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

                {/* Drawing Preview */}
                {isDrawing && startPoint && currentPoint && (
                    <div
                        className="absolute border-2 border-primary bg-primary/20 z-50"
                        style={{
                            left: Math.min(startPoint.x, currentPoint.x),
                            top: Math.min(startPoint.y, currentPoint.y),
                            width: Math.abs(currentPoint.x - startPoint.x),
                            height: Math.abs(currentPoint.y - startPoint.y),
                        }}
                    />
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
                    <p className="text-xs mt-2">Select a tool from the sidebar and draw on the wall.</p>
                </div>
            )}

            <SpatialControls isOffline={!currentKitchen} />
        </div>
    );
}

'use client';

import React from 'react';
import { useKitchenStore } from '@/providers/KitchenStoreProvider';
import DraggableObstacle from './DraggableObstacle';

interface ObstacleLayerProps {
    wallIndex: number;
}

export default function ObstacleLayer({ wallIndex }: ObstacleLayerProps) {
    const currentKitchen = useKitchenStore(state => state.currentKitchen);
    const selectedObstacleId = useKitchenStore(state => state.selectedObstacleId);
    const setSelectedObstacle = useKitchenStore(state => state.setSelectedObstacle);
    const updateObstaclePosition = useKitchenStore(state => state.updateObstaclePosition);

    if (!currentKitchen) return null;

    // Filter obstacles belonging to THIS specific wall
    const wallObstacles = currentKitchen.obstacles.filter(
        (obs) => obs.wallIndex === wallIndex
    );

    const handleSelect = (id: string) => {
        setSelectedObstacle(id);
    };

    const handleDrag = (id: string, x: number, y: number) => {
        updateObstaclePosition(id, x, y);
    };

    return (
        <div className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden">
            {/* We map through the filtered obstacles.
              'pointer-events-auto' on the children allows them to be clickable
              while the layer itself doesn't block underlying wall clicks.
            */}
            {wallObstacles.map((obs, index) => (
                <div key={obs.id} className="pointer-events-auto">
                    <DraggableObstacle
                        obstacle={obs}
                        globalIndex={index}
                        wall={currentKitchen.walls[wallIndex]}
                        isSelected={selectedObstacleId === obs.id}
                        onSelect={() => handleSelect(obs.id)}
                        // This allows the child to stay "dumb" while updating the slice
                        onPositionChange={(x, y) => handleDrag(obs.id, x, y)}
                    />
                </div>
            ))}

            {/* Empty State / Ghost Indicator if needed */}
            {wallObstacles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl opacity-20">
                    <span className="text-[10px] font-mono uppercase tracking-widest">
                        Wall_{wallIndex}_Empty
                    </span>
                </div>
            )}
        </div>
    );
}
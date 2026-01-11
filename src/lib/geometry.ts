import { IWall } from '@/types/kitchen';

export const SCALE = 0.5; // 1cm = 0.5px (Central Truth)

export interface WallTrack {
    start: { x: number; y: number };
    end: { x: number; y: number };
    label: string;
    length: number;
}

export interface SnapResult {
    wallIndex: number;
    positionX: number; // Distance along wall in CM
    x: number;         // Projected X on canvas
    y: number;         // Projected Y on canvas
    dist: number;      // Distance from mouse to wall
}

export const calculateWallPoints = (walls: IWall[]): WallTrack[] => {
    let x = 150; // Initial Canvas Offset
    let y = 150;

    return walls.map((wall, i) => {
        const start = { x, y };
        // 90-degree clockwise layout logic
        // Wall 0: Right, Wall 1: Down, Wall 2: Left, Wall 3: Up
        if (i % 4 === 0) x += wall.length * SCALE;
        else if (i % 4 === 1) y += wall.length * SCALE;
        else if (i % 4 === 2) x -= wall.length * SCALE;
        else if (i % 4 === 3) y -= wall.length * SCALE;

        return {
            start,
            end: { x, y },
            label: wall.label,
            length: wall.length
        };
    });
};

export const getNearestWallInfo = (
    mouseX: number,
    mouseY: number,
    wallTracks: WallTrack[]
): SnapResult => {
    let minDistance = Infinity;
    let bestSnap: Omit<SnapResult, 'dist'> = {
        wallIndex: 0,
        positionX: 0,
        x: 0,
        y: 0
    };

    wallTracks.forEach((wall, index) => {
        const dx = wall.end.x - wall.start.x;
        const dy = wall.end.y - wall.start.y;
        const l2 = dx * dx + dy * dy;

        if (l2 === 0) return;

        // Projection of mouse point onto the line segment
        let t = ((mouseX - wall.start.x) * dx + (mouseY - wall.start.y) * dy) / l2;
        t = Math.max(0, Math.min(1, t)); // Clamp to segment bounds

        const snapX = wall.start.x + t * dx;
        const snapY = wall.start.y + t * dy;
        const dist = Math.sqrt((mouseX - snapX) ** 2 + (mouseY - snapY) ** 2);

        if (dist < minDistance) {
            minDistance = dist;
            bestSnap = {
                wallIndex: index,
                positionX: t * wall.length, // Convert 0-1 ratio back to CM
                x: snapX,
                y: snapY
            };
        }
    });

    return { ...bestSnap, dist: minDistance };
};
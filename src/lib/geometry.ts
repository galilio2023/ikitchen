import { IWall } from '@/types/kitchen';

export const SCALE = 0.5; // 1cm = 0.5px (Central Truth)

export const calculateWallPoints = (walls: IWall[]) => {
    let x = 150; // Initial Canvas Offset
    let y = 150;
    return walls.map((wall, i) => {
        const start = { x, y };
        // 90-degree clockwise layout logic
        if (i % 4 === 0) x += wall.length * SCALE;
        else if (i % 4 === 1) y += wall.length * SCALE;
        else if (i % 4 === 2) x -= wall.length * SCALE;
        else if (i % 4 === 3) y -= wall.length * SCALE;
        return { start, end: { x, y }, label: wall.label, length: wall.length };
    });
};

// Update this function in src/lib/geometry.ts
export const getNearestWallInfo = (mouseX: number, mouseY: number, wallPoints: any[]) => {
    let minDistance = Infinity;
    // Ensure the initial object matches the final shape
    let bestSnap = { wallIndex: 0, positionX: 0, x: 0, y: 0 };

    wallPoints.forEach((wall, index) => {
        const dx = wall.end.x - wall.start.x;
        const dy = wall.end.y - wall.start.y;
        const l2 = dx * dx + dy * dy;
        if (l2 === 0) return;

        let t = ((mouseX - wall.start.x) * dx + (mouseY - wall.start.y) * dy) / l2;
        t = Math.max(0, Math.min(1, t));

        const snapX = wall.start.x + t * dx;
        const snapY = wall.start.y + t * dy;
        const dist = Math.sqrt((mouseX - snapX) ** 2 + (mouseY - snapY) ** 2);

        if (dist < minDistance) {
            minDistance = dist;
            bestSnap = {
                wallIndex: index,
                positionX: t * wall.length, // Distance along the wall in CM
                x: snapX,
                y: snapY
            };
        }
    });

    return { ...bestSnap, dist: minDistance };
};
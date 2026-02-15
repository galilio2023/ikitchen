import { IKitchen } from '@/types/kitchen';

// Define the structure for a validation error
export interface ValidationError {
    type: 'Collision' | 'OutOfBounds';
    message: string;
    itemIds: string[];
}

// Represents a 2D bounding box for collision detection
interface BoundingBox {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

/**
 * The main validation engine for the kitchen layout.
 * It checks the current kitchen state against a set of logical rules.
 * @param kitchen The full kitchen object to validate.
 * @returns An array of ValidationError objects. An empty array means the layout is valid.
 */
export function validateKitchenLayout(kitchen: IKitchen | null): ValidationError[] {
    if (!kitchen) return [];

    const errors: ValidationError[] = [];
    
    // Combine obstacles and appliances into a single list of items to check
    const allItems = [
        ...(kitchen.obstacles || []).map(o => ({ ...o, isAppliance: false })),
        ...(kitchen.appliances || []).map(a => ({ ...a, isAppliance: true }))
    ];

    // Group items by wall index to only check collisions on the same wall
    const itemsByWall = new Map<number, typeof allItems>();

    for (const item of allItems) {
        if (!itemsByWall.has(item.wallIndex)) {
            itemsByWall.set(item.wallIndex, []);
        }
        itemsByWall.get(item.wallIndex)!.push(item);
    }

    // Iterate through each wall
    for (const [wallIndex, items] of itemsByWall.entries()) {
        const wall = kitchen.walls[wallIndex];
        if (!wall) continue;

        // 1. Check for Out of Bounds
        for (const item of items) {
            const { x, y, width, height } = item.position;
            
            // Check horizontal bounds (0 to wall length)
            if (x < 0 || (x + width) > wall.length) {
                errors.push({
                    type: 'OutOfBounds',
                    message: `Item extends beyond the wall length.`,
                    itemIds: [item.id],
                });
            }

            // Check vertical bounds (0 to wall height)
            if (y < 0 || (y + height) > wall.height) {
                errors.push({
                    type: 'OutOfBounds',
                    message: `Item extends beyond the wall height.`,
                    itemIds: [item.id],
                });
            }
        }

        // 2. Check for Collisions between items
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const itemA = items[i];
                const itemB = items[j];

                // Simple AABB (Axis-Aligned Bounding Box) collision detection
                const a = itemA.position;
                const b = itemB.position;

                const isOverlapping = (
                    a.x < b.x + b.width &&
                    a.x + a.width > b.x &&
                    a.y < b.y + b.height &&
                    a.y + a.height > b.y
                );

                if (isOverlapping) {
                    errors.push({
                        type: 'Collision',
                        message: `Items are overlapping.`,
                        itemIds: [itemA.id, itemB.id],
                    });
                }
            }
        }
    }

    return errors;
}

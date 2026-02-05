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
    const allItems = [...(kitchen.obstacles || []), ...(kitchen.appliances || [])];

    // --- Rule 1: Collision Detection ---
    // Create a map of bounding boxes for each wall
    const wallItems = new Map<number, BoundingBox[]>();

    for (const item of allItems) {
        if (!item.id) continue; // Skip items without an ID

        const box: BoundingBox = {
            id: item.id,
            x1: item.position.x,
            y1: item.position.y,
            x2: item.position.x + item.position.width,
            y2: item.position.y + item.position.height,
        };

        if (!wallItems.has(item.wallIndex)) {
            wallItems.set(item.wallIndex, []);
        }
        wallItems.get(item.wallIndex)!.push(box);
    }

    // Check for collisions on each wall
    for (const boxes of wallItems.values()) {
        for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
                const boxA = boxes[i];
                const boxB = boxes[j];

                // Check for overlap
                if (boxA.x1 < boxB.x2 && boxA.x2 > boxB.x1 && boxA.y1 < boxB.y2 && boxA.y2 > boxB.y1) {
                    errors.push({
                        type: 'Collision',
                        message: `Items are overlapping.`,
                        itemIds: [boxA.id, boxB.id],
                    });
                }
            }
        }
    }

    // --- Future Rules (e.g., Boundary Checks) can be added here ---

    return errors;
}

import { z } from 'zod';

// 1. The Core Types
const obstacleTypes = ['window', 'door', 'socket', 'vent', 'pipe', 'pillar', 'radiator', 'clearance'] as const;
const unitTypes = [...obstacleTypes, 'cabinet'] as const;

// 2. The Coordinate Schema (Use this one everywhere in the file)
export const coordinateSchema = z.object({
    x: z.number().min(0, 'X must be non-negative'),
    y: z.number().min(0, 'Y must be non-negative'),
    z: z.number().default(0),
    width: z.number().min(1, 'Width must be positive'),
    height: z.number().min(1, 'Height must be positive'),
    depth: z.number().min(0, 'Depth must be non-negative'),
});

// 3. The Unit Schema (For AI Output)
const unitSchema = z.object({
    id: z.string().min(1, 'Unit ID is required'),
    wallIndex: z.number().int().nonnegative(),
    type: z.enum(unitTypes),
    position: coordinateSchema,
});

// 4. The Final AI Design Schema
export const generatedDesignSchema = z.object({
    layoutType: z.string().min(1),
    aiReasoning: z.string().min(1),
    units: z.array(unitSchema),
}).superRefine((val, ctx) => {
    val.units.forEach((unit, index) => {
        // Wall Index Check
        if (!Number.isInteger(unit.wallIndex)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Unit at index ${index} must have an integer wallIndex`,
                path: [`units`, index, `wallIndex`],
            });
        }
        // Max Length check (Safety Gate)
        if (unit.position.x + unit.position.width > 1200) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Unit at index ${index} exceeds max wall length`,
                path: [`units`, index, `position`, `x`],
            });
        }
    });
});

export type GeneratedDesign = z.infer<typeof generatedDesignSchema>;
import { z } from 'zod';

// Kitchen standards schema with sensible defaults and constraints
export const kitchenStandardsSchema = z.object({
  baseCabinetHeight: z.number().int().positive().min(70).max(120).describe("Base cabinet height in cm"),
  baseCabinetDepth: z.number().int().positive().min(40).max(80).describe("Base cabinet depth in cm"),
  upperCabinetDepthMin: z.number().int().positive().min(20).max(40).describe("Minimum upper cabinet depth in cm"),
  upperCabinetDepthMax: z.number().int().positive().min(20).max(50).describe("Maximum upper cabinet depth in cm"),
  upperCabinetHeights: z.array(z.number().int().positive()).nonempty().describe("Valid upper cabinet heights in cm"),
  backsplashHeight: z.number().int().positive().min(10).max(20).describe("Backsplash height in cm"),
  minWalkway: z.number().int().positive().min(60).max(120).describe("Minimum walkway width in cm"),
  preferredWalkwayMin: z.number().int().positive().min(90).max(120).describe("Preferred minimum walkway width in cm"),
  preferredWalkwayMax: z.number().int().positive().min(90).max(150).describe("Preferred maximum walkway width in cm"),
  minWorkTriangleLeg: z.number().int().positive().min(120).max(240).describe("Minimum work triangle leg length in cm"),
  minIslandClearance: z.number().int().positive().min(90).max(150).describe("Minimum clearance around island in cm"),
  toeKickHeight: z.number().int().positive().min(10).max(20).describe("Toe kick height in cm"),
});

// Enum for valid unit types
const unitTypeSchema = z.enum([
  'socket', 'vent', 'window', 'door', 'appliance', 'pipe', 'pillar', 'radiator', 'clearance', 'cabinet'
]);

// Schema for unit position
const positionSchema = z.object({
  x: z.number().min(0).describe("X coordinate in cm (left edge along wall)"),
  y: z.number().min(0).describe("Y coordinate in cm (height from floor)"),
  width: z.number().positive().describe("Width in cm"),
  height: z.number().positive().describe("Height in cm"),
  depth: z.number().min(0).describe("Depth in cm"),
}).transform((val) => {
  // Round to 1 decimal place for consistency
  return {
    x: Number(val.x.toFixed(1)),
    y: Number(val.y.toFixed(1)),
    width: Number(val.width.toFixed(1)),
    height: Number(val.height.toFixed(1)),
    depth: Number(val.depth.toFixed(1)),
  };
});

// Schema for individual unit
const unitSchema = z.object({
  id: z.string().min(1).describe("Unique identifier for the unit"),
  type: unitTypeSchema.describe("Type of unit"),
  wallIndex: z.number().int().min(0).describe("Index of the wall this unit belongs to"),
  position: positionSchema.describe("Position of the unit"),
});

// Schema for BOM item
const bomItemSchema = z.object({
  item: z.string().min(1).describe("Description of the item"),
  qty: z.number().int().min(0).describe("Quantity"),
  price: z.number().min(0).optional().describe("Price in currency units"),
}).transform((val) => {
  // Round price to 2 decimal places if present
  return {
    ...val,
    ...(val.price !== undefined && { price: Number(val.price.toFixed(2)) })
  };
});

// Main generated design schema
export const generatedDesignSchema = z.object({
  units: z.array(unitSchema).describe("Array of units to place in the kitchen"),
  bom: z.array(bomItemSchema).optional().describe("Bill of Materials"),
  instructions: z.string().optional().describe("Installation or assembly instructions"),
  imagePrompt: z.string().optional().describe("Prompt for generating a visual representation"),
}).transform((val) => {
  // Round all numeric values to 1 decimal place for consistency
  return {
    ...val,
    units: val.units.map(unit => ({
      ...unit,
      position: {
        x: Number(unit.position.x.toFixed(1)),
        y: Number(unit.position.y.toFixed(1)),
        width: Number(unit.position.width.toFixed(1)),
        height: Number(unit.position.height.toFixed(1)),
        depth: Number(unit.position.depth.toFixed(1)),
      }
    })),
    bom: val.bom?.map(item => ({
      ...item,
      ...(item.price !== undefined && { price: Number(item.price.toFixed(2)) })
    }))
  };
});

// Default standards for 2026 - these are the canonical values
export const DEFAULT_STANDARDS = Object.freeze({
  baseCabinetHeight: 85,       // Standard base cabinet height
  baseCabinetDepth: 60,        // Standard base cabinet depth
  upperCabinetDepthMin: 30,    // Minimum upper cabinet depth
  upperCabinetDepthMax: 40,    // Maximum upper cabinet depth
  upperCabinetHeights: [40, 50, 60, 70, 80, 90], // Valid upper cabinet heights
  backsplashHeight: 15,        // Standard backsplash height
  minWalkway: 90,              // Minimum walkway width
  preferredWalkwayMin: 90,     // Preferred minimum walkway width
  preferredWalkwayMax: 120,    // Preferred maximum walkway width
  minWorkTriangleLeg: 120,     // Minimum work triangle leg length
  minIslandClearance: 90,      // Minimum clearance around island
  toeKickHeight: 15,           // Standard toe kick height
});

import { z } from 'zod';

/**
 * Validation schemas for API requests
 * Using Zod for type-safe runtime validation
 */

// Project Schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  client: z.string().min(1, 'Client name is required').max(100, 'Client name too long'),
  status: z.enum(['Draft', 'Active', 'Completed', 'Archived']).optional(),
  progress: z.number().min(0).max(100).optional(),
  img: z.string().url().optional().or(z.literal('')),
  url: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  stars: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  client: z.string().min(1).max(100).optional(),
  status: z.enum(['Draft', 'Active', 'Completed', 'Archived']).optional(),
  progress: z.number().min(0).max(100).optional(),
  img: z.string().url().optional().or(z.literal('')),
  url: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  stars: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
});

// Kitchen Schemas
export const coordinateSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
  z: z.number().default(0),
  width: z.number().min(1),
  height: z.number().min(1),
  depth: z.number().min(0),
});

export const wallSchema = z.object({
  label: z.string().default('Wall'),
  length: z.number().min(1, 'Wall length must be at least 1'),
  height: z.number().default(240),
  thickness: z.number().default(10),
});

export const obstacleSchema = z.object({
  type: z.enum(['window', 'door', 'socket', 'vent', 'pipe', 'pillar', 'radiator', 'clearance']),
  wallIndex: z.number().min(0),
  position: coordinateSchema,
});

export const applianceSchema = z.object({
  name: z.string().min(1, 'Appliance name is required'),
  wallIndex: z.number().min(0),
  position: coordinateSchema,
  isFixed: z.boolean().default(false),
  brandModel: z.string().optional(),
});

export const createKitchenSchema = z.object({
  projectId: z.string().optional(),
  clientName: z.string().min(1, 'Client name is required').max(100),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  address: z.string().max(200).optional(),
  status: z.enum(['draft', 'measuring', 'designing', 'ordered', 'installed']).optional(),
  walls: z.array(wallSchema).min(1, 'At least one wall is required'),
  obstacles: z.array(obstacleSchema).optional(),
  appliances: z.array(applianceSchema).optional(),
  standards: z.object({
    baseCabinetDepth: z.number().default(60),
    wallCabinetDepth: z.number().default(35),
    countertopThickness: z.number().default(4),
    kickplateHeight: z.number().default(10),
  }).optional(),
  totalPrice: z.number().min(0).optional(),
  material: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
});

export const updateKitchenSchema = createKitchenSchema.partial();

// Auth Schemas
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  role: z.enum(['admin', 'user']).optional(),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// AI Generation Schemas
export const generateDesignSchema = z.object({
  walls: z.array(wallSchema).min(1, 'At least one wall is required'),
  obstacles: z.array(obstacleSchema).optional(),
  preferences: z.object({
    style: z.string().optional(),
    budget: z.number().optional(),
    priority: z.enum(['aesthetics', 'functionality', 'budget']).optional(),
  }).optional(),
});

export const generateImageSchema = z.object({
  walls: z.array(wallSchema).min(1),
  appliances: z.array(applianceSchema).optional(),
  style: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
});

export const generateKitchenFromPromptSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(500),
  existingWalls: z.array(wallSchema).optional(),
});

/**
 * Helper function to validate request body
 * Returns parsed data or throws validation error
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safe validation that returns result object instead of throwing
 */
export function safeValidateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, error: result.error };
}

/**
 * Format Zod errors for API responses
 */
export function formatValidationError(error: z.ZodError<unknown>): { field: string; message: string }[] {
  return error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

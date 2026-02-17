'use server';

import { kitchenAiService } from '@/services/aiService';
import { revalidatePath } from 'next/cache';
import Kitchen from '@/models/Kitchen';
import UsageLimit from '@/models/UsageLimit';
import dbConnect from '@/lib/dbConnect';
import { generatedDesignSchema, GeneratedDesign } from '@/lib/validations';
import { v4 as uuidv4 } from 'uuid';
import { IKitchen } from '@/types/kitchen';
import { headers } from 'next/headers';
import { logger } from '@/lib/logger';
import { isProd } from '@/lib/env';

async function checkAiRateLimit(identifier: string) {
    const LIMIT = 10; // 10 requests per hour
    const WINDOW_MS = 60 * 60 * 1000; // 1 hour

    await dbConnect();

    // Atomic operation to handle rate limiting and window resets
    // We use $inc for atomicity and $setOnInsert to initialize the window
    const now = new Date();
    
    // First, find the current state
    let usage = await UsageLimit.findOne({ identifier, type: 'ai_generation' });

    if (!usage) {
        usage = await UsageLimit.findOneAndUpdate(
            { identifier, type: 'ai_generation' },
            { 
                $setOnInsert: { lastReset: now, count: 1 } 
            },
            { upsert: true, new: true }
        );
        return { allowed: true };
    }

    const timePassed = now.getTime() - usage.lastReset.getTime();

    if (timePassed > WINDOW_MS) {
        // Window expired, reset atomically
        await UsageLimit.updateOne(
            { identifier, type: 'ai_generation' },
            { $set: { lastReset: now, count: 1 } }
        );
        return { allowed: true };
    }

    if (usage.count >= LIMIT) {
        return { 
            allowed: false, 
            retryAfter: Math.ceil((WINDOW_MS - timePassed) / 1000 / 60) 
        };
    }

    // Increment atomically
    await UsageLimit.updateOne(
        { identifier, type: 'ai_generation' },
        { $inc: { count: 1 } }
    );

    return { allowed: true };
}

export async function generateAiLayout(kitchenId: string) {
    try {
        await dbConnect();

        // Robust IP extraction: take the first IP in the x-forwarded-for list
        const headerList = await headers();
        const forwardedFor = headerList.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
        
        const rateLimit = await checkAiRateLimit(ip);
        if (!rateLimit.allowed) {
            return { error: `Rate limit exceeded. Please try again in ${rateLimit.retryAfter} minutes.` };
        }

        const kitchen = await Kitchen.findById(kitchenId);
        if (!kitchen) {
            throw new Error("Kitchen not found.");
        }

        const kitchenData = kitchen.toObject() as unknown as IKitchen;
        const design = await kitchenAiService.generateLayout(kitchenData);
        
        kitchen.generatedDesign = design;
        await kitchen.save();

        revalidatePath(`/projects/${kitchen.projectId}`);

        return { success: true, design };
    } catch (error: any) {
        // Log full error details on the server
        logger.error("Server Action Error: generateAiLayout", error);
        
        // Return generic message in production to avoid leaking internal details
        const message = isProd 
            ? "An unexpected error occurred while generating the layout. Please try again later." 
            : error.message || "Failed to generate AI layout.";
            
        return { error: message };
    }
}

export async function applyAiLayout(kitchenId: string, design: GeneratedDesign) {
    try {
        await dbConnect();

        const validation = generatedDesignSchema.safeParse(design);
        if (!validation.success) {
            throw new Error("Invalid AI design format.");
        }
        const validatedDesign = validation.data;

        const kitchen = await Kitchen.findById(kitchenId);
        if (!kitchen) {
            throw new Error("Kitchen not found.");
        }

        const newAppliances = validatedDesign.units.map(unit => ({
            ...unit,
            id: unit.id || uuidv4(),
            name: unit.type,
            type: 'appliance',
            isFixed: false,
        }));

        kitchen.appliances = newAppliances as any;
        kitchen.generatedDesign = undefined;

        await kitchen.save();

        revalidatePath(`/projects/${kitchen.projectId}`);

        const plainAppliances = kitchen.appliances.map((app: any) => ({
            ...app.toObject(),
            id: app._id ? app._id.toString() : app.id
        }));

        return { success: true, appliances: plainAppliances };

    } catch (error: any) {
        logger.error("Server Action Error: applyAiLayout", error);
        const message = isProd 
            ? "Failed to apply the layout. Please try again." 
            : error.message;
        return { error: message };
    }
}

export async function generateAiImage(prompt: string, kitchenData: any) {
    try {
        logger.info("Generating image placeholder", { prompt });
        const placeholderUrl = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80";
        return { success: true, imageUrl: placeholderUrl };
    } catch (error: any) {
        logger.error("Server Action Error: generateAiImage", error);
        return { error: "Failed to generate image. Please try again." };
    }
}

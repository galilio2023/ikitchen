'use server';

import { kitchenAiService } from '@/services/aiService';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { generatedDesignSchema, GeneratedDesign } from '@/lib/validations';
import { v4 as uuidv4 } from 'uuid';
import { IKitchen } from '@/types/kitchen';
import { headers } from 'next/headers';
import { logger } from '@/lib/logger';
import { isProd } from '@/lib/env';

async function checkAiRateLimit(identifier: string) {
    const LIMIT = 10;
    const WINDOW_MS = 60 * 60 * 1000;
    const now = new Date();

    const usage = await prisma.usageLimit.findUnique({
        where: { identifier_type: { identifier, type: 'ai_generation' } }
    });

    if (!usage) {
        await prisma.usageLimit.create({
            data: { identifier, type: 'ai_generation', lastReset: now, count: 1 }
        });
        return { allowed: true };
    }

    const timePassed = now.getTime() - usage.lastReset.getTime();

    if (timePassed > WINDOW_MS) {
        await prisma.usageLimit.update({
            where: { identifier_type: { identifier, type: 'ai_generation' } },
            data: { lastReset: now, count: 1 }
        });
        return { allowed: true };
    }

    if (usage.count >= LIMIT) {
        return { allowed: false, retryAfter: Math.ceil((WINDOW_MS - timePassed) / 1000 / 60) };
    }

    await prisma.usageLimit.update({
        where: { identifier_type: { identifier, type: 'ai_generation' } },
        data: { count: { increment: 1 } }
    });

    return { allowed: true };
}

export async function generateAiLayout(kitchenId: string) {
    try {
        const headerList = await headers();
        const forwardedFor = headerList.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
        
        const rateLimit = await checkAiRateLimit(ip);
        if (!rateLimit.allowed) {
            return { error: `Rate limit exceeded. Please try again in ${rateLimit.retryAfter} minutes.` };
        }

        const kitchen = await prisma.kitchen.findUnique({ where: { id: kitchenId } });
        if (!kitchen) throw new Error("Kitchen not found.");

        const kitchenData = kitchen as unknown as IKitchen;
        const design = await kitchenAiService.generateLayout(kitchenData);
        
        await prisma.kitchen.update({
            where: { id: kitchenId },
            data: { generatedDesign: design as any }
        });

        revalidatePath(`/projects/${kitchen.projectId}`);

        return { success: true, design };
    } catch (error: any) {
        logger.error("Server Action Error: generateAiLayout", error);
        const message = isProd ? "An unexpected error occurred while generating the layout. Please try again later." : error.message || "Failed to generate AI layout.";
        return { error: message };
    }
}

export async function applyAiLayout(kitchenId: string, design: GeneratedDesign) {
    try {
        const validation = generatedDesignSchema.safeParse(design);
        if (!validation.success) throw new Error("Invalid AI design format.");
        
        const validatedDesign = validation.data;

        const kitchen = await prisma.kitchen.findUnique({ where: { id: kitchenId } });
        if (!kitchen) throw new Error("Kitchen not found.");

        const newAppliances = validatedDesign.units.map(unit => ({
            ...unit,
            id: unit.id || uuidv4(),
            name: unit.type,
            type: 'appliance',
            isFixed: false,
        }));

        const updatedKitchen = await prisma.kitchen.update({
            where: { id: kitchenId },
            data: { 
                appliances: newAppliances as any,
                generatedDesign: null as any
            }
        });

        revalidatePath(`/projects/${kitchen.projectId}`);

        return { success: true, appliances: updatedKitchen.appliances };
    } catch (error: any) {
        logger.error("Server Action Error: applyAiLayout", error);
        const message = isProd ? "Failed to apply the layout. Please try again." : error.message;
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

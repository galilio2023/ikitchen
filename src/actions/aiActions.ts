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

async function checkAiRateLimit(identifier: string) {
    const LIMIT = 10; // 10 requests per hour
    const WINDOW = 60 * 60 * 1000; // 1 hour

    const usage = await UsageLimit.findOneAndUpdate(
        { identifier, type: 'ai_generation' },
        { $setOnInsert: { lastReset: new Date(), count: 0 } },
        { upsert: true, new: true }
    );

    const now = new Date();
    const timePassed = now.getTime() - usage.lastReset.getTime();

    if (timePassed > WINDOW) {
        usage.count = 1;
        usage.lastReset = now;
        await usage.save();
        return { allowed: true };
    }

    if (usage.count >= LIMIT) {
        return { allowed: false, retryAfter: Math.ceil((WINDOW - timePassed) / 1000 / 60) };
    }

    usage.count += 1;
    await usage.save();
    return { allowed: true };
}

export async function generateAiLayout(kitchenId: string) {
    try {
        await dbConnect();

        // Get identifier (IP address) for rate limiting
        const headerList = await headers();
        const ip = headerList.get('x-forwarded-for') || 'unknown';
        
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
        console.error("Server Action Error: generateAiLayout", error);
        return { error: error.message || "Failed to generate AI layout. Please try again." };
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
        console.error("Server Action Error: applyAiLayout", error);
        return { error: "Failed to apply AI layout. Please try again." };
    }
}

export async function generateAiImage(prompt: string, kitchenData: any) {
    try {
        console.log("Generating image for prompt:", prompt);
        const placeholderUrl = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80";
        return { success: true, imageUrl: placeholderUrl };
    } catch (error: any) {
        console.error("Server Action Error: generateAiImage", error);
        return { error: "Failed to generate image. Please try again." };
    }
}

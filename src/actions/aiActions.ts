'use server';

import { kitchenAiService } from '@/services/aiService';
import { revalidatePath } from 'next/cache';
import Kitchen from '@/models/Kitchen';
import dbConnect from '@/lib/dbConnect';
import { generatedDesignSchema, GeneratedDesign } from '@/lib/validations';
import { v4 as uuidv4 } from 'uuid';

export async function generateAiLayout(kitchenId: string) {
    try {
        await dbConnect();
        const kitchen = await Kitchen.findById(kitchenId);
        if (!kitchen) {
            throw new Error("Kitchen not found.");
        }

        const design = await kitchenAiService.generateLayout(kitchen);
        
        kitchen.generatedDesign = design;
        await kitchen.save();

        revalidatePath(`/projects/${kitchen.projectId}`);

        return { success: true, design };
    } catch (error: any) {
        console.error("Server Action Error: generateAiLayout", error);
        return { error: "Failed to generate AI layout. Please try again." };
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
            type: 'appliance', // Explicitly set type to 'appliance'
            isFixed: false,
        }));

        kitchen.appliances = newAppliances;
        kitchen.generatedDesign = undefined;

        await kitchen.save();

        revalidatePath(`/projects/${kitchen.projectId}`);

        return { success: true, appliances: kitchen.appliances };

    } catch (error: any) {
        console.error("Server Action Error: applyAiLayout", error);
        return { error: "Failed to apply AI layout. Please try again." };
    }
}

export async function generateAiImage(prompt: string, kitchenData: any) {
    try {
        console.log("Generating image for prompt:", prompt);
        // In a real production app, this would call DALL-E 3 or Stable Diffusion via an API.
        // For now, we return a high-quality placeholder that represents a "success" state.
        // We can use a service like Unsplash Source or a specific placeholder service for architecture.
        const placeholderUrl = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80";
        return { success: true, imageUrl: placeholderUrl };
    } catch (error: any) {
        console.error("Server Action Error: generateAiImage", error);
        return { error: "Failed to generate image. Please try again." };
    }
}

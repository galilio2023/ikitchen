'use server';

import { kitchenAiService } from '@/services/aiService';
import { revalidatePath } from 'next/cache';
import Kitchen from '@/models/Kitchen';
import dbConnect from '@/lib/dbConnect';
import { generatedDesignSchema, GeneratedDesign } from '@/lib/validations';

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
            id: unit.id || `appliance-${Date.now()}`,
            name: unit.type,
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
        const placeholderUrl = "https://via.placeholder.com/1024x768.png?text=AI+Visualization";
        return { success: true, imageUrl: placeholderUrl };
    } catch (error: any) {
        console.error("Server Action Error: generateAiImage", error);
        return { error: "Failed to generate image. Please try again." };
    }
}

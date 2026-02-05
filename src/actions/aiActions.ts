'use server';

import { kitchenAiService } from '@/services/aiService';
import { revalidatePath } from 'next/cache';
import Kitchen from '@/models/Kitchen';
import dbConnect from '@/lib/dbConnect';

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

export async function generateAiImage(prompt: string, kitchenData: any) {
    try {
        // In a real app, you would call your image generation service here.
        // For now, we'll return a placeholder.
        console.log("Generating image for prompt:", prompt);
        const placeholderUrl = "https://via.placeholder.com/1024x768.png?text=AI+Visualization";
        return { success: true, imageUrl: placeholderUrl };
    } catch (error: any) {
        console.error("Server Action Error: generateAiImage", error);
        return { error: "Failed to generate image. Please try again." };
    }
}

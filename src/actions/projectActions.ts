'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';
import Project from '@/models/Project';
import * as validations from '@/lib/validations';

export async function createProject(prevState: any, formData: FormData) {
    try {
        await dbConnect();
        
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        
        if (!name) {
            return {
                error: 'Project name is required',
            };
        }
        
        // Create a new project
        const project = new Project({
            name,
            client: name, // Using name as client for now
            status: 'Draft',
            progress: 0,
            owner: null, // Will be set to actual user ID when authentication is implemented
        });
        
        await project.save();
        
        // Create a corresponding kitchen
        const kitchen = new Kitchen({
            projectId: project._id,
            clientName: name,
            phone: phone || '',
            status: 'draft',
            walls: [],
            obstacles: [],
            appliances: [],
            standards: {
                baseCabinetDepth: 60,
                wallCabinetDepth: 35,
                countertopThickness: 4,
                kickplateHeight: 10,
            },
        });
        
        await kitchen.save();
        
        // Revalidate paths to update the UI
        revalidatePath('/dashboard');
        revalidatePath('/projects');
        
        // Redirect to the newly created project page
        redirect(`/projects/${project.id}`);
        
    } catch (error: any) {
        console.error('Create Project Error:', error);
        return {
            error: error.message || 'An error occurred while creating the project.',
        };
    }
}

export async function deleteProject(projectId: string) {
    // ... deleteProject function remains the same
}

export async function applyAiLayout(kitchenId: string, design: validations.GeneratedDesign) {
    try {
        await dbConnect();

        if (!kitchenId || !design) {
            throw new Error("Kitchen ID and design are required.");
        }

        const validation = validations.generatedDesignSchema.safeParse(design);
        if (!validation.success) {
            throw new Error("Invalid AI design format.");
        }
        const validatedDesign = validation.data;

        const kitchen = await Kitchen.findById(kitchenId);
        if (!kitchen) {
            throw new Error("Kitchen not found.");
        }

        // Create new appliances based on the AI design's units
        const newAppliances = validatedDesign.units.map(unit => ({
            ...unit,
            name: unit.type, // Use the unit type as the name for now
            isFixed: false,
        }));

        kitchen.appliances = newAppliances;
        kitchen.generatedDesign = undefined; // Clear the preview design

        await kitchen.save();

        // Revalidate the project page to show the new layout
        revalidatePath(`/projects/${kitchen.projectId}`);

        return { success: true };

    } catch (error: any) {
        console.error("Server Action Error: applyAiLayout", error);
        return {
            error: error.message || "Failed to apply AI layout.",
        };
    }
}

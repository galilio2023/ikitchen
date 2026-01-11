import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import Kitchen from '@/models/Kitchen';

export async function GET(
    request: Request,
    { params }: { params: { id: string } } // Note: Next.js 15 requires awaiting params
) {
    try {
        await dbConnect();
        const { id } = params;

        const project = await Project.findById(id);
        if (!project) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

        const kitchen = await Kitchen.findOne({ projectId: id });

        // Merge Project and Kitchen into one "KitchenNode" for Redux
        return NextResponse.json({
            ...project.toObject(),
            ...(kitchen ? kitchen.toObject() : {}),
            id: project._id.toString()
        });
    } catch (error) {
        return NextResponse.json({ error: "FETCH_FAILED" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = params;
        const data = await request.json();

        // Sync Project Timestamp
        await Project.findByIdAndUpdate(id, { updatedAt: new Date() });

        // Sync Spatial Data
        const updatedKitchen = await Kitchen.findOneAndUpdate(
            { projectId: id },
            {
                walls: data.walls,
                obstacles: data.obstacles,
                standards: data.standards
            },
            { new: true, upsert: true }
        );

        return NextResponse.json(updatedKitchen);
    } catch (error) {
        return NextResponse.json({ error: "SAVE_FAILED" }, { status: 500 });
    }
}
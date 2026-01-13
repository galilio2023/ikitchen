import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import Kitchen from '@/models/Kitchen';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Note: Next.js 15 requires awaiting params
) {
    try {
        await dbConnect();
        const { id } = await params;

        const project = await Project.findById(id);
        if (!project) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

        const kitchen = await Kitchen.findOne({ projectId: id });

        // Return both Project and Kitchen separately
        return NextResponse.json({
            project: {
                ...project.toObject(),
                id: project._id.toString()
            },
            kitchen: kitchen ? {
                ...kitchen.toObject(),
                id: kitchen._id.toString()
            } : null
        });
    } catch (error) {
        return NextResponse.json({ error: "FETCH_FAILED" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();

        // Sync Project Timestamp
        await Project.findByIdAndUpdate(id, { updatedAt: new Date() });

        // Sync Spatial Data
        const updatedKitchen = await Kitchen.findOneAndUpdate(
            { projectId: id },
            {
                walls: data.walls,
                obstacles: data.obstacles,
                appliances: data.appliances,
                standards: data.standards
            },
            { new: true, upsert: true }
        );

        return NextResponse.json(updatedKitchen);
    } catch (error) {
        return NextResponse.json({ error: "SAVE_FAILED" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        // 1. Delete the Project
        const deletedProject = await Project.findByIdAndDelete(id);
        
        if (!deletedProject) {
            return NextResponse.json({ error: "PROJECT_NOT_FOUND" }, { status: 404 });
        }

        // 2. Delete the associated Kitchen
        await Kitchen.findOneAndDelete({ projectId: id });

        return NextResponse.json({ success: true, message: "Project and associated data deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();

        // Update Project
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        if (!updatedProject) {
            return NextResponse.json({ error: "PROJECT_NOT_FOUND" }, { status: 404 });
        }

        // Sync to Kitchen if relevant fields are changed
        const syncData: any = {};
        if (data.name) syncData.clientName = data.name;
        if (data.status) syncData.status = data.status;
        if (data.img) syncData.img = data.img;
        if (data.tags) syncData.tags = data.tags;

        if (Object.keys(syncData).length > 0) {
            await Kitchen.findOneAndUpdate(
                { projectId: id },
                { $set: syncData }
            );
        }

        return NextResponse.json(updatedProject);
    } catch (error) {
        return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
    }
}
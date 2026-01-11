import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

export async function GET() {
    try {
        await dbConnect();
        // Use .lean() for faster dashboard performance
        const projects = await Project.find({}).sort({ updatedAt: -1 }).lean();
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: "FAILED_TO_FETCH" }, { status: 500 });
    }
}
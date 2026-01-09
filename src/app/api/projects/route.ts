import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

/**
 * GET /api/projects
 * Fetches all kitchen projects from MongoDB
 */
export async function GET() {
    try {
        await dbConnect();

        const projects = await Project.find({}).sort({ createdAt: -1 });

        return NextResponse.json(projects, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        console.error(' [API_PROJECTS_GET] Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/projects
 * Creates a new kitchen sequence entry
 */
export async function POST(request: Request) {
    try {
        await dbConnect();

        // 1. Parse the request body
        const body = await request.json();
        const { name, client } = body;

        // 2. Industrial Validation
        if (!name || !client) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'Name and Client fields are required' },
                { status: 400 }
            );
        }

        // 3. Create the document using your Mongoose Schema
        // Defaults: status="Draft", progress=0
        const newProject = await Project.create({
            name,
            client,
            status: "Draft",
            progress: 0
        });

        // 4. Return the new project with 201 Created status
        return NextResponse.json(newProject, { status: 201 });

    } catch (error) {
        console.error(' [API_PROJECTS_POST] Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to initialize project sequence' },
            { status: 500 }
        );
    }
}
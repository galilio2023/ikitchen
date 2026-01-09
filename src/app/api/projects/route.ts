import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';

/**
 * GET /api/projects
 * Fetches all kitchen projects from MongoDB
 */
export async function GET() {
    try {
        // 1. Establish database connection
        await dbConnect();

        // 2. Fetch projects sorted by most recent first
        // This ensures "Residence Al Maadi" appears at the top
        const projects = await Project.find({}).sort({ createdAt: -1 });

        // 3. Return the data with a 200 OK status
        return NextResponse.json(projects, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0', // Ensure we get fresh data
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
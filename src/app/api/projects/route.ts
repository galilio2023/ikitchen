import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import mongoose from "mongoose";

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
        const body = await request.json();

        const { name, client } = body;

        // 1. Manual Short-Circuit: Throw error if fields are missing or just whitespace
        // This triggers the 'catch' block immediately without touching the DB
        if (!name?.trim() || !client?.trim()) {
            const validationError = new mongoose.Error.ValidationError();
            validationError.addError('fields', new mongoose.Error.ValidatorError({
                message: 'All identifier fields (Name & Client) must be populated.',
                path: 'fields',
                type: 'required',
            }));
            throw validationError;
        }

        // 2. Proceed to Mongoose Create if manual check passes
        const newProject = await Project.create({
            name,
            client,
            status: "Draft",
            progress: 0
        });

        return NextResponse.json(newProject, { status: 201 });

    } catch (error: any) {
        // This catch block now handles BOTH your manual 'throw' and DB errors

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Payload_Malformed', message: 'Invalid JSON input' },
                { status: 400 }
            );
        }

        if (error instanceof mongoose.Error.ValidationError) {
            // This now catches the manual throw FROM Step 1
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { error: 'Input_Validation_Failed', details: messages },
                { status: 400 }
            );
        }

        console.error(' [SYSTEM_CRITICAL]:', error);
        return NextResponse.json(
            { error: 'Internal_Server_Error' },
            { status: 500 }
        );
    }
}
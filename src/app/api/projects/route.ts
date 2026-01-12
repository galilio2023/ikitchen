// src/app/api/projects/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';

export async function GET() {
    try {
        // 1. Check for the URI first to avoid the connection attempt entirely if missing
        if (!process.env.MONGODB_URI) {
            return NextResponse.json([], { status: 200 });
        }

        // 2. Wrap the connection and fetch in a timeout race
        const connectionTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('DATABASE_HANDSHAKE_TIMEOUT')), 10000)
        );

        const fetchData = async () => {
            const conn = await dbConnect();
            if (!conn) return []; // Handle the null return from your dbConnect.ts
            return await Kitchen.find({}).sort({ updatedAt: -1 }).lean();
        };

        // 3. Race the DB call against the 3-second timer
        const projects = await Promise.race([fetchData(), connectionTimeout]);

        return NextResponse.json(projects);
    } catch (error) {
        console.error("📡 SYSTEM_SYNC_FAILURE:", error);
        // Returning 200 with [] is the ONLY way to tell Redux "I'm done" and stop the spinner
        return NextResponse.json([], { status: 200 });
    }
}
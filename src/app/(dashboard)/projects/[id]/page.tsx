import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';

export async function GET() {
    try {
        // 1. Check if URI exists at all
        if (!process.env.MONGODB_URI) {
            console.log("⚠️ MONGODB_URI is missing. Returning empty registry.");
            return NextResponse.json([], { status: 200 });
        }

        // 2. Wrap dbConnect in a timeout so it doesn't hang the UI
        const connectionPromise = dbConnect();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('DB_TIMEOUT')), 3000)
        );

        // Race them!
        await Promise.race([connectionPromise, timeoutPromise]);

        const kitchens = await Kitchen.find({}).sort({ createdAt: -1 });
        return NextResponse.json(kitchens);
    } catch (error) {
        console.error("📡 DB_OFFLINE:", error);
        // 3. Return empty array on failure so spinner stops
        return NextResponse.json([], { status: 200 });
    }
}
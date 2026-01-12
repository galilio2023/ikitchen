import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';

export async function GET() {
    try {
        // 1. Establish connection with a strict timeout
        await dbConnect();

        // 2. Fetch with .lean() is perfect for performance
        // Added a limit to prevent memory spikes if the DB grows
        const kitchens = await Kitchen.find({})
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        // 3. Transform _id to id to match your IKitchen interface
        const formattedKitchens = kitchens.map((k: any) => ({
            ...k,
            id: k._id.toString(),
        }));

        return NextResponse.json(formattedKitchens);
    } catch (error: any) {
        console.error("❌ [API_ERROR]:", error.message);
        return NextResponse.json(
            { error: "KITCHEN_FETCH_FAILED", details: error.message },
            { status: 500 }
        );
    }
}
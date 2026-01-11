import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';

export async function GET() {
    try {
        await dbConnect();
        const kitchens = await Kitchen.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(kitchens);
    } catch (error) {
        return NextResponse.json({ error: "KITCHEN_FETCH_FAILED" }, { status: 500 });
    }
}
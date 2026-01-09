import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // This creates the kitchen in MongoDB using the data sent from the frontend
        const newKitchen = await Kitchen.create(body);

        return NextResponse.json(
            { success: true, data: newKitchen },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}
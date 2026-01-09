import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';

// CREATE: Add a new kitchen
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const newKitchen = await Kitchen.create({
            clientName: body.clientName,
            phone: body.phone,
            address: body.address,
            walls: body.walls,
            obstacles: body.obstacles,
            appliances: body.appliances,
            material: body.material,
            color: body.color
        });

        return NextResponse.json(
            { success: true, data: newKitchen },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating kitchen:', error);
        return NextResponse.json(
            { success: false, error: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}

// READ: Get all kitchens
export async function GET() {
    try {
        await dbConnect();

        // We find all kitchens and sort them so the newest ones appear first
        const kitchens = await Kitchen.find({}).sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, data: kitchens },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error fetching kitchens:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch kitchens' },
            { status: 500 }
        );
    }
}
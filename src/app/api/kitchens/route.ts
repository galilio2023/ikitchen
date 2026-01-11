import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';

/**
 * READ: Get kitchens (supports filtering by projectId)
 */
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        // If a projectId is provided, filter for it; otherwise, return all
        const query = projectId ? { projectId } : {};
        const kitchens = await Kitchen.find(query).sort({ createdAt: -1 });

        return NextResponse.json(
            { success: true, data: kitchens },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error fetching kitchens:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch kitchen data' },
            { status: 500 }
        );
    }
}

/**
 * CREATE: Add a new kitchen node
 */
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const newKitchen = await Kitchen.create(body);

        return NextResponse.json(
            { success: true, data: newKitchen },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating kitchen:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create spatial node' },
            { status: 500 }
        );
    }
}

/**
 * UPDATE: Synchronize Redux state to MongoDB
 */
export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        if (!body._id) {
            return NextResponse.json({ success: false, error: 'Missing Kitchen ID' }, { status: 400 });
        }

        // Find the kitchen by ID and update with the new spatial data
        const updatedKitchen = await Kitchen.findByIdAndUpdate(
            body._id,
            {
                walls: body.walls,
                obstacles: body.obstacles,
                appliances: body.appliances,
                material: body.material,
                color: body.color,
                clientName: body.clientName,
                address: body.address,
                phone: body.phone
            },
            { new: true, runValidators: true }
        );

        if (!updatedKitchen) {
            return NextResponse.json({ success: false, error: 'Kitchen node not found' }, { status: 404 });
        }

        return NextResponse.json(
            { success: true, data: updatedKitchen },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error updating kitchen:', error);
        return NextResponse.json(
            { success: false, error: 'Neural sync failed during update' },
            { status: 500 }
        );
    }
}

/**
 * DELETE: Remove a kitchen node
 */
export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

        await Kitchen.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Node purged' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: 'Purge failed' }, { status: 500 });
    }
}
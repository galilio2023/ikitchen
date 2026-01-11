import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const kitchen = await Kitchen.findById(params.id);
        if (!kitchen) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        return NextResponse.json(kitchen);
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
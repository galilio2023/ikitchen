import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';
import { kitchenAiService } from '@/services/aiService';
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 2. Get Kitchen ID from body
        const { kitchenId } = await req.json();
        if (!kitchenId) {
            return NextResponse.json({ error: "KITCHEN_ID_REQUIRED" }, { status: 400 });
        }

        // 3. Fetch the actual kitchen document
        const kitchen = await Kitchen.findById(kitchenId);
        if (!kitchen) {
            return NextResponse.json({ error: "KITCHEN_NOT_FOUND" }, { status: 404 });
        }

        // 4. Use our new AI Service (handles prompt + Gemini + Zod validation)
        const aiDesign = await kitchenAiService.generateLayout(kitchen);

        // 5. Save the design to the "Preview" field in MongoDB
        // This makes it available for the frontend to "Accept" or "Reject"
        kitchen.generatedDesign = aiDesign;
        await kitchen.save();

        return NextResponse.json({
            success: true,
            design: aiDesign,
            message: "Design generated and saved to preview"
        });

    } catch (error: any) {
        console.error('[DESIGN_GENERATE_API_ERROR]:', error);

        return NextResponse.json({
            error: "DESIGN_GENERATION_FAILED",
            details: error.message || 'An unexpected error occurred'
        }, { status: 500 });
    }
}
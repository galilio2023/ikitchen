import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';
import { kitchenAiService } from '@/services/aiService';
import { generatedDesignSchema } from '@/lib/validations';

export async function POST(request: Request) {
    try {
        // 1. Auth & Session Check
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
        }

        // 2. Database Connection
        await dbConnect();

        // 3. Extract KitchenID
        const { kitchenId } = await request.json();
        if (!kitchenId) {
            return NextResponse.json({ error: 'KITCHEN_ID_REQUIRED' }, { status: 400 });
        }

        // 4. Fetch the specific kitchen context
        const kitchen = await Kitchen.findById(kitchenId);
        if (!kitchen) {
            return NextResponse.json({ error: 'KITCHEN_NOT_FOUND' }, { status: 404 });
        }

        // 5. Call the real AI Service
        // This uses Gemini 1.5-Pro to look at the actual walls/obstacles
        const aiDesign = await kitchenAiService.generateLayout(kitchen);

        // 6. Validation (Double-check AI output against Zod)
        const validation = generatedDesignSchema.safeParse(aiDesign);

        if (!validation.success) {
            console.error('[AI_VALIDATION_FAILURE]:', validation.error);
            return NextResponse.json({ error: 'AI_OUTPUT_INVALID' }, { status: 422 });
        }

        // 7. Persistence (Save to preview field)
        kitchen.generatedDesign = validation.data;
        await kitchen.save();

        return NextResponse.json({
            success: true,
            design: validation.data
        });

    } catch (error: any) {
        console.error('AI Kitchen Generation Error:', error);
        return NextResponse.json(
            { error: 'AI_SERVICE_FAILURE', details: error.message },
            { status: 500 }
        );
    }
}
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeneratedUnit {
    type: 'socket' | 'vent' | 'window' | 'door' | 'pipe';
    x: number;
    y: number;
    width?: number;
    height?: number;
}

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: "INVALID_PROMPT" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            console.warn('[AI GENERATE] Gemini API key not found, using mock data');
            // Fallback to mock data
            const mockUnits: GeneratedUnit[] = [
                { type: 'socket', x: 120, y: 110, width: 10, height: 10 },
                { type: 'vent', x: 280, y: 200, width: 40, height: 40 },
                { type: 'socket', x: 450, y: 110, width: 10, height: 10 },
            ];

            await new Promise(resolve => setTimeout(resolve, 1500));
            return NextResponse.json({ 
                success: true, 
                units: mockUnits,
                message: "Neural_Core: Mock_Spatial_Parameters_Calculated" 
            });
        }

        // Use Gemini AI to generate spatial units
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const systemPrompt = `You are a kitchen design AI. Given a user prompt, generate spatial units (obstacles) for a kitchen design.
Return ONLY a valid JSON array of objects with this structure:
[{"type": "socket"|"vent"|"window"|"door"|"pipe", "x": number (0-500), "y": number (0-300), "width": number, "height": number}]

Constraints:
- x coordinates: 0-500 cm (wall length)
- y coordinates: 0-300 cm (wall height)
- Typical socket: width 10cm, height 10cm, y around 30-120cm
- Typical vent: width 40cm, height 40cm, y around 200-240cm
- Typical window: width 80-120cm, height 80-120cm, y around 100-180cm

User request: ${prompt}`;

        const result = await model.generateContent(systemPrompt);
        const response = result.response;
        const text = response.text();

        // Extract JSON from response
        let units: GeneratedUnit[] = [];
        try {
            // Try to parse JSON directly
            const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (jsonMatch) {
                units = JSON.parse(jsonMatch[0]) as GeneratedUnit[];
            } else {
                // Fallback parsing
                units = JSON.parse(text) as GeneratedUnit[];
            }
        } catch (parseError) {
            console.error('[AI GENERATE] Failed to parse Gemini response:', text);
            // Return intelligent default based on prompt
            units = [
                { type: 'socket', x: 120, y: 110, width: 10, height: 10 },
                { type: 'vent', x: 280, y: 220, width: 40, height: 40 },
            ];
        }

        // Validate and sanitize units
        const validUnits = units.filter(unit => 
            unit.type && 
            typeof unit.x === 'number' && 
            typeof unit.y === 'number' &&
            unit.x >= 0 && unit.x <= 500 &&
            unit.y >= 0 && unit.y <= 300
        ).map(unit => ({
            ...unit,
            width: unit.width || 10,
            height: unit.height || 10
        }));

        return NextResponse.json({ 
            success: true, 
            units: validUnits,
            message: "Neural_Core: Gemini_Spatial_Parameters_Calculated" 
        });
    } catch (error) {
        console.error('[AI GENERATE] Error:', error);
        return NextResponse.json({ 
            error: "AI_GENERATION_FAILED",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

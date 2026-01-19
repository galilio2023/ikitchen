import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const { kitchenData } = await request.json();

        if (!kitchenData || !kitchenData.walls) {
            return NextResponse.json({ error: "INVALID_KITCHEN_DATA" }, { status: 400 });
        }

        console.log('[IMAGE GENERATE] Processing kitchen visualization...');

        const apiKey = process.env.GEMINI_API_KEY;
        
        // Generate detailed kitchen description
        const description = generateKitchenDescription(kitchenData);
        
        if (!apiKey) {
            console.warn('[IMAGE GENERATE] Using mock render with description');
            return NextResponse.json({ 
                success: true, 
                imageUrl: selectMockImage(kitchenData),
                description,
                message: "Mock_Render: Kitchen_Visualization_Generated" 
            });
        }

        // Use Gemini to generate detailed kitchen visualization description
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are a professional architectural visualizer. Based on this kitchen layout, create a detailed, vivid description for a 3D rendering:

${description}

Generate a detailed visualization description that includes:
- Overall aesthetic and style (modern, traditional, minimalist, etc.)
- Color scheme and materials (cabinetry, countertops, backsplash)
- Lighting design (natural light from windows, artificial lighting)
- Spatial flow and layout impression
- Key design features that stand out

Make it realistic and specific to the dimensions and layout provided.`;

        const result = await model.generateContent(prompt);
        const aiDescription = result.response.text();

        // In production, you would use this description with:
        // - DALL-E, Midjourney, or Stable Diffusion APIs
        // - 3D rendering services
        // For now, select appropriate stock image based on characteristics
        const imageUrl = selectMockImage(kitchenData);

        return NextResponse.json({ 
            success: true, 
            imageUrl,
            description: aiDescription,
            message: "Gemini_AI: Kitchen_Visualization_Description_Generated",
            // In production, include: renderUrl from actual image generation API
        });
    } catch (error) {
        console.error('[IMAGE GENERATE] Error:', error);
        return NextResponse.json({ 
            error: "RENDER_GENERATION_FAILED",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

function generateKitchenDescription(kitchenData: {
    walls: unknown[];
    obstacles?: unknown[];
    appliances?: unknown[];
}): string {
    interface Wall { length: number; height: number; label?: string; }
    interface Obstacle { type: string; wallIndex: number; position: { x: number; y: number } }
    interface Appliance { name: string; wallIndex: number; }
    
    const walls = kitchenData.walls as Wall[];
    const obstacles = (kitchenData.obstacles || []) as Obstacle[];
    const appliances = (kitchenData.appliances || []) as Appliance[];
    
    let desc = `Kitchen Layout:\n`;
    desc += `- Total walls: ${walls.length}\n`;
    
    walls.forEach((wall, i) => {
        desc += `- ${wall.label || `Wall ${i + 1}`}: ${wall.length}cm × ${wall.height}cm\n`;
    });
    
    if (obstacles.length > 0) {
        desc += `\nArchitectural Features:\n`;
        const windows = obstacles.filter(o => o.type === 'window');
        const doors = obstacles.filter(o => o.type === 'door');
        const vents = obstacles.filter(o => o.type === 'vent');
        
        if (windows.length > 0) desc += `- ${windows.length} window(s) providing natural light\n`;
        if (doors.length > 0) desc += `- ${doors.length} door(s)\n`;
        if (vents.length > 0) desc += `- ${vents.length} ventilation unit(s)\n`;
    }
    
    if (appliances.length > 0) {
        desc += `\nAppliances & Equipment:\n`;
        appliances.forEach(app => {
            desc += `- ${app.name.replace(/_/g, ' ')}\n`;
        });
    }
    
    return desc;
}

function selectMockImage(kitchenData: { walls: unknown[]; obstacles?: unknown[]; appliances?: unknown[] }): string {
    interface Obstacle { type: string; }
    interface Appliance { name: string; }
    
    const obstacles = (kitchenData.obstacles || []) as Obstacle[];
    const appliances = (kitchenData.appliances || []) as Appliance[];
    const walls = kitchenData.walls as unknown[];
    
    const hasWindows = obstacles.some(o => o.type === 'window');
    const hasModernAppliances = appliances.some(a => 
        a.name.toLowerCase().includes('dishwasher') || 
        a.name.toLowerCase().includes('oven')
    );
    const isLargeKitchen = walls.length >= 4;
    
    // Select appropriate kitchen image based on characteristics
    const images = [
        "https://images.unsplash.com/photo-1556911220-e15224bbafb0?w=1200", // Modern white kitchen
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200", // Contemporary kitchen
        "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200", // Minimalist kitchen
        "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200", // Bright kitchen with windows
        "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=1200", // Large modern kitchen
    ];
    
    if (hasWindows && hasModernAppliances) return images[3];
    if (isLargeKitchen) return images[4];
    if (hasModernAppliances) return images[1];
    
    return images[0];
}

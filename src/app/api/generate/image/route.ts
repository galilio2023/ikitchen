import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/dbConnect';
import Kitchen from '@/models/Kitchen';

export async function POST(req: Request) {
    try {
        // 1. Auth & DB Connection
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { kitchenId } = await req.json();

        const kitchen = await Kitchen.findById(kitchenId);
        if (!kitchen) return NextResponse.json({ error: "Kitchen not found" }, { status: 404 });

        const apiKey = process.env.GEMINI_API_KEY;

        // 2. Generate Context for AI
        const description = generateKitchenDescription(kitchen);

        if (!apiKey) {
            return NextResponse.json({
                success: true,
                imageUrl: selectMockImage(kitchen),
                description,
                message: "Mock_Render: No API Key found."
            });
        }

        // 3. AI Visualizer Logic
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a professional architectural visualizer. Create a vivid 3D rendering description for this kitchen:
        ${description}
        Include style, materials (cabinets, countertops), and lighting. Keep it professional and concise.`;

        const result = await model.generateContent(prompt);
        // FIXED: Access text() directly to avoid TS80007
        const aiDescription = result.response.text();

        // 4. In a real scenario, you'd send aiDescription to an Image Gen API here
        const imageUrl = selectMockImage(kitchen);

        return NextResponse.json({
            success: true,
            imageUrl,
            description: aiDescription,
            message: "Visualization description generated successfully."
        });

    } catch (error: any) {
        console.error('[IMAGE_GEN_ERROR]:', error);
        return NextResponse.json({ error: "RENDER_FAILED", details: error.message }, { status: 500 });
    }
}

// ... Keep your generateKitchenDescription and selectMockImage helpers below ...

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

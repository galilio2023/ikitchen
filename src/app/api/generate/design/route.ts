import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const { kitchenData } = await request.json();

        if (!kitchenData || !kitchenData.walls) {
            return NextResponse.json({ error: "INVALID_KITCHEN_DATA" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        
        // If no API key, use intelligent mock data based on kitchen dimensions
        if (!apiKey) {
            console.warn('[DESIGN GENERATE] Using mock design generation');
            return generateMockDesign(kitchenData);
        }

        // Use Gemini AI to generate complete kitchen design
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Prepare kitchen context for AI
        const kitchenContext = prepareKitchenContext(kitchenData);
        
        const prompt = `You are a professional kitchen designer. Generate a complete kitchen layout based on the following specifications:

${kitchenContext}

Return ONLY a valid JSON object with this structure:
{
  "appliances": [
    {"name": "appliance_name", "wallIndex": number, "position": {"x": number, "y": number, "z": number, "width": number, "height": number, "depth": number}, "isFixed": boolean}
  ],
  "obstacles": [
    {"type": "socket"|"vent"|"pipe", "wallIndex": number, "position": {"x": number, "y": number, "z": number, "width": number, "height": number, "depth": number}}
  ],
  "designRationale": "Brief explanation of the design choices"
}

Key design principles:
- Place the sink near existing water pipes
- Position the stove away from windows for safety
- Ensure electrical sockets are accessible for appliances
- Maintain ergonomic triangle between sink, stove, and fridge
- Consider natural lighting from windows
- Respect building obstacles like doors and pillars

Generate a practical, ergonomic kitchen design.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse AI response
        let design;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                design = JSON.parse(jsonMatch[0]);
            } else {
                design = JSON.parse(text);
            }
        } catch (parseError) {
            console.error('[DESIGN GENERATE] Failed to parse AI response:', text);
            return generateMockDesign(kitchenData);
        }

        // Validate and sanitize design
        const validatedDesign = validateDesign(design, kitchenData);

        return NextResponse.json({
            success: true,
            design: validatedDesign,
            message: "Gemini_AI: Complete_Kitchen_Design_Generated",
            aiRationale: design.designRationale || "Optimized for ergonomics and workflow"
        });
    } catch (error) {
        console.error('[DESIGN GENERATE] Error:', error);
        return NextResponse.json({ 
            error: "GEMINI_DESIGN_FAILURE",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

function prepareKitchenContext(kitchenData: { walls: unknown[]; obstacles: unknown[] }): string {

    interface Wall {
        length: number;
        height: number;
        [key: string]: unknown;
    }
    
    interface Obstacle {
        type: string;
        position: { x: number; y: number; width: number; height: number };
        wallIndex: number;
    }
    
    const walls = kitchenData.walls as Wall[];
    const obstacles = (kitchenData.obstacles || []) as Obstacle[];
    
    let context = `Kitchen Dimensions:\n`;
    walls.forEach((wall, i) => {
        context += `  Wall ${i + 1}: ${wall.length}cm length × ${wall.height}cm height\n`;
    });
    
    if (obstacles.length > 0) {
        context += `\nExisting Obstacles:\n`;
        obstacles.forEach((obs, i) => {
            context += `  ${i + 1}. ${obs.type} on Wall ${obs.wallIndex + 1} at (${obs.position.x}cm, ${obs.position.y}cm)\n`;
        });
    }
    
    return context;
}

function generateMockDesign(kitchenData: { walls: unknown[] }) {
    interface Wall {
        length: number;
        height: number;
        [key: string]: unknown;
    }

    interface GeneratedAppliance {
        name: string;
        wallIndex: number;
        position: { x: number; y: number; z: number; width: number; height: number; depth: number };
        isFixed: boolean;
    }

    const suggestedAppliances: GeneratedAppliance[] = [];
    const suggestedObstacles: { type: string; wallIndex: number; position: { x: number; y: number; z: number; width: number; height: number; depth: number } }[] = [];

    (kitchenData.walls as Wall[]).forEach((wall: Wall, index: number) => {
        if (index === 0 && wall.length >= 200) {
            suggestedAppliances.push(
                {
                    name: "Refrigerator",
                    wallIndex: index,
                    position: { x: 20, y: 0, z: 0, width: 70, height: 200, depth: 70 },
                    isFixed: false
                },
                {
                    name: "Oven_Stove",
                    wallIndex: index,
                    position: { x: 140, y: 0, z: 0, width: 60, height: 90, depth: 60 },
                    isFixed: true
                }
            );
            suggestedObstacles.push(
                {
                    type: "socket",
                    wallIndex: index,
                    position: { x: 100, y: 40, z: 0, width: 10, height: 10, depth: 5 }
                },
                {
                    type: "vent",
                    wallIndex: index,
                    position: { x: 140, y: 200, z: 0, width: 60, height: 40, depth: 30 }
                }
            );
        } else if (index === 1 && wall.length >= 200) {
            suggestedAppliances.push(
                {
                    name: "Sink_Unit",
                    wallIndex: index,
                    position: { x: Math.floor(wall.length / 2) - 40, y: 0, z: 0, width: 80, height: 90, depth: 60 },
                    isFixed: true
                },
                {
                    name: "Dishwasher",
                    wallIndex: index,
                    position: { x: Math.floor(wall.length / 2) + 50, y: 0, z: 0, width: 60, height: 90, depth: 60 },
                    isFixed: false
                }
            );
            suggestedObstacles.push(
                {
                    type: "pipe",
                    wallIndex: index,
                    position: { x: Math.floor(wall.length / 2) - 30, y: 30, z: 0, width: 15, height: 60, depth: 15 }
                },
                {
                    type: "socket",
                    wallIndex: index,
                    position: { x: Math.floor(wall.length / 2) + 60, y: 40, z: 0, width: 10, height: 10, depth: 5 }
                }
            );
        }
    });

    return NextResponse.json({
        success: true,
        design: {
            appliances: suggestedAppliances,
            obstacles: suggestedObstacles
        },
        message: "Mock_Design: Intelligent_Layout_Generated",
        aiRationale: "Optimized kitchen work triangle with ergonomic placement"
    });
}

function validateDesign(design: { appliances: unknown[]; obstacles: unknown[] }, kitchenData: { walls: unknown[] }) {
    interface Wall { length: number; height: number; }
    const walls = kitchenData.walls as Wall[];
    
    // Validate appliances
    const validAppliances = (design.appliances || []).filter((app: unknown) => {
        const appliance = app as { wallIndex: number; position: { x: number; y: number } };
        if (appliance.wallIndex >= walls.length) return false;
        const wall = walls[appliance.wallIndex];
        return appliance.position.x >= 0 && 
               appliance.position.x <= wall.length &&
               appliance.position.y >= 0 && 
               appliance.position.y <= wall.height;
    });
    
    // Validate obstacles
    const validObstacles = (design.obstacles || []).filter((obs: unknown) => {
        const obstacle = obs as { wallIndex: number; position: { x: number; y: number } };
        if (obstacle.wallIndex >= walls.length) return false;
        const wall = walls[obstacle.wallIndex];
        return obstacle.position.x >= 0 && 
               obstacle.position.x <= wall.length &&
               obstacle.position.y >= 0 && 
               obstacle.position.y <= wall.height;
    });
    
    return {
        appliances: validAppliances,
        obstacles: validObstacles
    };
}

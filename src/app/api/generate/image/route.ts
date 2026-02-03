import{ NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
// import { authOptions } from '../../../auth/[...nextauth]/options';
import { authOptions } from "@/lib/auth";

/**
 * POST /api/generate/image
 *
 * Sample request:
 * {
 *   "kitchenData": {
 *     "walls": [...],
 *     "obstacles": [...],
 *     "appliances": [...],
 *     "design": {...}
 *   },
 *   "prompt": "A modern kitchen with the specified layout"
 *}
 *
 * Response:
 * {
 *   "success": true,
 *   "imageUrl": "data:image/png;base64,...",
 *   "description": "Description of the generated image",
 *   "provider": "mock"
 * }
 */
export async function POST(req: NextRequest) {
  try {
   // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { kitchenData, prompt } = await req.json();

// Validate required fields
    if (!kitchenData) {
      return Response.json(
        { error: "Kitchen data is required" },
        { status: 400 },
      );
    }

    // In a real implementation, we would call the AI image model
    // For now, we'llreturn a mock response
    const { callImageModel } = await import("@/lib/aiAdapter");

    const result = await callImageModel(prompt || "Modern kitchen layout", {
      width: 1024,
      height: 768,
    });

    // Return the image data
   return Response.json({
      success: true,
      imageUrl: result.imageData,
      description: `Generated visualization for kitchen with${kitchenData.obstacles?.length || 0} obstacles`,
      provider: result.providerResponse?.mock ? "mock" : "real_provider",
    });
  } catch (error) {
console.error("Error in /api/generate/image:", error);
    return Response.json({ error: "InternalServer Error" }, { status: 500 });
  }
}

function generateKitchenDescription(kitchenData: {
  walls: unknown[];
  obstacles?: unknown[];
  appliances?: unknown[];
}): string {
interface Wall {
    length: number;
    height: number;
    label?: string;
  }
  interface Obstacle {
    type: string;
    wallIndex: number;
    position: { x: number; y: number };
  }
  interface Appliance {
    name: string;
    wallIndex:number;
  }

  const walls = kitchenData.walls as Wall[];
  const obstacles = (kitchenData.obstacles || []) as Obstacle[];
  const appliances = (kitchenData.appliances || []) as Appliance[];

  let desc = `Kitchen Layout:\n`;
  desc += `- Total walls:${walls.length}\n`;

  walls.forEach((wall, i) => {
    desc += `- ${wall.label || `Wall ${i + 1}`}: ${wall.length}cm × ${wall.height}cm\n`;
  });
  if (obstacles.length > 0) {
    desc += `\nArchitectural Features:\n`;
    const windows = obstacles.filter((o) => o.type === "window");
    const doors = obstacles.filter((o) => o.type === "door");
    const vents = obstacles.filter((o) => o.type === "vent");

    if (windows.length > 0)
      desc+= `- ${windows.length} window(s) providing natural light\n`;
    if (doors.length > 0) desc += `- ${doors.length} door(s)\n`;
    if (vents.length > 0) desc += `- ${vents.length} ventilation unit(s)\n`;
  }

  if (appliances.length> 0) {
    desc += `\nAppliances & Equipment:\n`;
    appliances.forEach((app) => {
      desc += `- ${app.name.replace(/_/g, " ")}\n`;
    });
  }

  return desc;
}

function selectMockImage(kitchenData: {
  walls:unknown[];
  obstacles?: unknown[];
  appliances?: unknown[];
}): string {
  interface Obstacle {
    type: string;
  }
  interface Appliance {
    name: string;
  }

  const obstacles = (kitchenData.obstacles || []) as Obstacle[];
  const appliances = (kitchenData.appliances || []) as Appliance[];
const walls = kitchenData.walls as unknown[];

  const hasWindows = obstacles.some((o) => o.type === "window");
  const hasModernAppliances = appliances.some(
    (a) =>
      a.name.toLowerCase().includes("dishwasher") ||
      a.name.toLowerCase().includes("oven"),
 );
  const isLargeKitchen = walls.length >= 4;

  // Select appropriate kitchen image based on characteristics
  const images = [
    "https://images.unsplash.com/photo-1556911220-e15224bbafb0?w=1200", //Modern white kitchen"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200", // Contemporary kitchen
    "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200", // Minimalist kitchen
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200", // Bright kitchenwith windows
    "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=1200", // Large modern kitchen
  ];

  if (hasWindows && hasModernAppliances) return images[3];
 if (isLargeKitchen) return images[4];
  if (hasModernAppliances) return images[1];

  return images[0];
}

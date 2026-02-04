import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
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

    const { kitchenData, prompt } = await req.json();

    // Validate required fields
    if (!kitchenData) {
      return Response.json(
        { error: "Kitchen data is required" },
        { status: 400 },
      );
    }

    // In a real implementation, we would call the AI image model
    // For now, we'll return a mock response
    const { callImageModel } = await import("@/lib/aiAdapter");

    const result = await callImageModel(prompt || "Modern kitchen layout", {
      width: 1024,
      height: 768,
    });

    // Return the image data
    return Response.json({
      success: true,
      imageUrl: result.imageData,
      description: `Generated visualization for kitchen with ${kitchenData.obstacles?.length || 0} obstacles`,
      provider: result.providerResponse?.mock ? "mock" : "real_provider",
    });
  } catch (error) {
    console.error("Error in /api/generate/image:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

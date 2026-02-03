import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Kitchen from "@/models/Kitchen";
import { generatedDesignSchema } from "@/lib/validations";
import { detectOverlaps } from "@/lib/validationHelpers";

/**
 * PATCH /api/kitchens/[id]/design
 * * This endpoint "Accepts" an AI-generated design, persists it to the kitchen record,
 * and optionally converts the AI units into permanent kitchen obstacles.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Authenticateuser
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id: kitchenId } = params;
    const {
      generatedDesign,
      applyUnitsAsObstacles = false,
      force = false,
    } = await req.json();

    if (!generatedDesign) {
      return Response.json(
        { error: "Generated design is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // 2. Fetch and Verify Ownership
    const kitchen = await Kitchen.findOne({
      _id: kitchenId,
      userId: session.user.id,
    });

    if (!kitchen) {
      return Response.json({ error: "Kitchen not found" }, { status: 404 });
    }

    // 3. Schema Validation (Zod)
    const validationResult = generatedDesignSchema.safeParse(generatedDesign);
    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          error: "INVALID_DESIGN_SCHEMA",
          // Flatten errors for clean frontend display
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    const validatedDesign = validationResult.data;

    // 4. Spatial Conflict Validation
    // Destructuring here fixes TS2339: Property length does not exist on type { conflicts: ...}
    const { conflicts } = detectOverlaps(
      validatedDesign.units,
      kitchen.obstacles || [],
      kitchen.walls || [],
    );

    // Block save if conflicts exist and 'force' is not true
    if (conflicts && conflicts.length > 0 && !force) {
      return Response.json(
        {
          success: false,
          error: "CONFLICTS_DETECTED",
          conflicts,
        },
        { status: 409 },
      );
    }

    // 5. Convert Design Units to Kitchen Obstacles (If requested)
    let newObstacles = [...(kitchen.obstacles || [])];

    if (applyUnitsAsObstacles) {
      const convertedUnits = validatedDesign.units.map((unit: any) => ({
        id:
          unit.id ||
          `ai_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        type: unit.type,
        x: unit.position.x,
        y: unit.position.y,
        width: unit.position.width,
        height: unit.position.height,
        z: unit.position.depth || 0, // Mapping depth to z-axis
        wallIndex: unit.wallIndex,
        name: unit.name,
        metadata: {
          generatedBy: "ai",
          acceptedAt: new Date().toISOString(),
        },
      }));

      // Append the new AI units to existing obstacles
      newObstacles = [...newObstacles, ...convertedUnits];
    }

    // 6. Persist to MongoDB
    // We update the obstacles AND push a snapshotto the history array
    const updatedKitchen = await Kitchen.findOneAndUpdate(
      { _id: kitchenId, userId: session.user.id },
      {
        $set: {
          obstacles: newObstacles,
          generatedDesign: validatedDesign,
        },
        $push: {
          generatedDesignHistory: {
            id: `design_${Date.now()}`,
            createdAt: new Date(),
            userId: session.user.id,
            design: validatedDesign,
          },
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedKitchen) {
      throw new Error("Update operation failed to return a document.");
    }

    // 7. Success Response
    return Response.json({
      success: true,
      obstacles: updatedKitchen.obstacles,
      conflicts, // Return conflicts for informational purposes if 'force' was true
    });
  } catch (error) {
    console.error("Error in /api/kitchens/[id]/design:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

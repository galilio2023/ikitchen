import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Kitchen from "@/models/Kitchen";
import AiRawResponse from "@/models/AiRawResponse";
import { callModelText } from "@/lib/aiAdapter";
import { extractFirstJson } from "@/lib/extractor";
import { generatedDesignSchema, DEFAULT_STANDARDS } from "@/lib/validations";
import {
  detectOverlaps,
  checkWorkTriangle,
  checkAisleWidth,
  checkIslandSize,
} from "@/lib/validationHelpers";
import { createHash } from "crypto"; // FIX: Use createHash for modern Node

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const {
      kitchenId,
      kitchenContext,
      prompt,
      options = {},
    } = await req.json();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    await dbConnect();

    // 1. Resolve Kitchen Context
    let dbKitchen = null;
    if (kitchenId) {
      dbKitchen = await Kitchen.findOne({ _id: kitchenId, userId });
      if (!dbKitchen) {
        return Response.json({ error: "Kitchen not found" }, { status: 404 });
      }
    }

    // Merge DB state with any unsaved frontend state (kitchenContext)
    const canonicalContext = dbKitchen
      ? { ...dbKitchen.toObject(), ...kitchenContext }
      : kitchenContext;

    // 2. AI Prompts
    const systemPrompt = `You are an expert kitchen designer. Respond ONLY with JSON. 
    Standards: ${JSON.stringify(DEFAULT_STANDARDS)}`;

    const userPrompt = `Context: ${JSON.stringify(canonicalContext)}. 
    Request: ${prompt}`;

    // 3. Call AI
    const aiResult = await callModelText(systemPrompt, userPrompt, {
      temperature: 0.0,
      maxTokens: options.maxTokens || 2048,
    });

    // 4. Extract & Parse JSON
    let parsedDesign;
    try {
      const jsonStr = extractFirstJson(aiResult.text || "");
      parsedDesign = JSON.parse(jsonStr);
    } catch (e) {
      return Response.json(
        {
          success: false,
          error: "INVALID_AI_OUTPUT",
          details: "AI failed to return valid JSON structure.",
        },
        { status: 422 },
      );
    }

    // 5. Validation (Zod)
    const validationResult = generatedDesignSchema.safeParse(parsedDesign);

    // Hash the prompt for auditing
    const promptHash = createHash("sha256").update(userPrompt).digest("hex");

    if (!validationResult.success) {
      const rawLog = await AiRawResponse.create({
        kitchenId: kitchenId || null,
        userId,
        model: aiResult.raw?.model || "gemini-1.5-pro",
        rawText: aiResult.text,
        promptHash,
        tokensEstimate: aiResult.tokensEstimate || 0,
      });

      return Response.json(
        {
          success: false,
          error: "SCHEMA_VALIDATION_FAILED",
          details: validationResult.error.flatten().fieldErrors,
          rawResponseRef: rawLog._id,
        },
        { status: 422 },
      );
    }

    const design = validationResult.data;

    // 6. Kitchen Physics Checks
    const { conflicts } = detectOverlaps(
      design.units,
      canonicalContext?.obstacles || [],
      canonicalContext?.walls || [],
    );

    const checks = {
      workTriangle: checkWorkTriangle(design.units as any, DEFAULT_STANDARDS),
      aisleWidth: checkAisleWidth(design.units as any, DEFAULT_STANDARDS),
      islandSize: checkIslandSize(0, 0, DEFAULT_STANDARDS), // Simplified for now
    };

    // 7. Success Audit & Response
    const rawLog = await AiRawResponse.create({
      kitchenId: kitchenId || null,
      userId,
      model: aiResult.raw?.model || "gemini-1.5-pro",
      rawText: aiResult.text,
      promptHash,
      tokensEstimate: aiResult.tokensEstimate || 0,
    });

    return Response.json({
      success: true,
      design,
      checks,
      conflicts,
      rawResponseRef: rawLog._id,
    });
  } catch (error) {
    console.error("Error in /api/generate/kitchen:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

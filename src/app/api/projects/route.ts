// src/app/api/projects/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Kitchen from "@/models/Kitchen";
import Project from "@/models/Project";
import * as validations from "@/lib/validations";

export async function GET() {
  // Purposefully do NOT auto-seed the database from a GET handler.
  // Seeding should be done via scripts/seed.ts or a gated admin endpoint.
  try {
    if (!process.env.MONGODB_URI) {
      // If no DB configured, return an empty list for the dashboard (non-fatal)
      return NextResponse.json([], { status: 200 });
    }

    // Ensure DB connection is established; dbConnect implements caching and retries
    await dbConnect();

    const projects = await Project.find({}).sort({ updatedAt: -1 }).lean();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    // If DB is unavailable or connection failed, respond with 503 Service Unavailable so orchestrators know
    console.error("[API][GET /api/projects] Error fetching projects:", error);
    return new NextResponse(null, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    // 0) Authentication: require a logged-in session to create projects
    // The App Router session typing can be noisy; use guarded any casts for session access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionRaw = await getServerSession(authOptions as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (sessionRaw as any)?.user?.id ?? null;
    if (!sessionRaw || !userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "NO_DATABASE_CONFIGURED" },
        { status: 500 },
      );
    }

    await dbConnect();
    const body = await request.json();

    // 1) Validate Project payload using Zod
    const projectValidation = validations.safeValidateRequest(
      validations.createProjectSchema,
      body,
    );
    if (!projectValidation.success) {
      return NextResponse.json(
        { errors: validations.formatValidationError(projectValidation.error) },
        { status: 400 },
      );
    }

    // Build project payload (schema may already provide proper shape) and attach owner
    const projectPayload = {
      name: projectValidation.data.name,
      client: projectValidation.data.client || projectValidation.data.name,
      status: projectValidation.data.status || "draft",
      progress:
        typeof projectValidation.data.progress === "number"
          ? projectValidation.data.progress
          : 0,
      img: projectValidation.data.img,
      tags: projectValidation.data.tags || [],
      owner: userId,
    };

    const project = await Project.create(projectPayload);

    // 2) Validate Kitchen payload using Zod. Start from provided body and add required linkage fields.
    const defaultWalls = [
      {
        id: `wall-${Date.now()}`,
        label: "Wall 1",
        length: 300,
        height: 240,
        thickness: 10,
      },
    ];
    const defaultStandards = {
      baseCabinetDepth: 60,
      wallCabinetDepth: 35,
      countertopThickness: 4,
      kickplateHeight: 10,
    };

    const kitchenPayload = {
      ...body,
      projectId: project._id,
      clientName: projectPayload.client,
      phone: body.phone || "UNKNOWN",
      userId: userId,
      walls:
        Array.isArray(body.walls) && body.walls.length > 0
          ? body.walls
          : defaultWalls,
      standards: body.standards || defaultStandards,
    };

    const kitchenValidation = validations.safeValidateRequest(
      validations.createKitchenSchema,
      kitchenPayload,
    );
    if (!kitchenValidation.success) {
      // Rollback project to avoid orphaned documents
      try {
        await Project.findByIdAndDelete(project._id);
      } catch (rollbackErr) {
        console.error(
          "[API][POST /api/projects] Failed rollback after kitchen validation error:",
          rollbackErr,
        );
      }
      return NextResponse.json(
        { errors: validations.formatValidationError(kitchenValidation.error) },
        { status: 400 },
      );
    }

    const kitchen = await Kitchen.create(kitchenValidation.data);

    const response = { ...kitchen.toObject(), id: project._id.toString() };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("[API][POST /api/projects] Initialization failed:", error);
    return NextResponse.json(
      { error: "INITIALIZATION_FAILED" },
      { status: 500 },
    );
  }
}

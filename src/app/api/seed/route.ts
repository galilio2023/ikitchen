import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import Kitchen from "@/models/Kitchen";

// Minimal seed payload - mirrors scripts/seed.ts
const SEED_PROJECT = {
  name: "Residence Al Maadi - Unit 402",
  client: "Ahmed Mansour",
  status: "Designing",
  progress: 45,
};

const SEED_KITCHEN = {
  clientName: "Ahmed Mansour",
  phone: "+20123456789",
  status: "designing",
  walls: [
    { id: "wall_a", label: "Wall A", length: 350, height: 240, thickness: 10 },
    { id: "wall_b", label: "Wall B", length: 400, height: 240, thickness: 10 },
    { id: "wall_c", label: "Wall C", length: 350, height: 240, thickness: 10 },
    { id: "wall_d", label: "Wall D", length: 400, height: 240, thickness: 10 },
  ],
  obstacles: [
    {
      id: "obs_window_1",
      type: "window",
      wallIndex: 0,
      position: { x: 100, y: 110, z: 0, width: 120, height: 100, depth: 10 },
    },
  ],
  appliances: [],
  standards: {
    baseCabinetDepth: 60,
    wallCabinetDepth: 35,
    countertopThickness: 4,
    kickplateHeight: 10,
  },
};

export async function POST() {
  try {
    // Allow local automated seeding if AUTO_SEED=1 (useful for CI/local demos)
    const allowAuto = process.env.AUTO_SEED === "1";

    // Verify session and admin role unless AUTO_SEED is enabled
    if (!allowAuto) {
      // The NextAuth types sometimes cause inference issues here in app routes; use minimal any casts guarded by eslint-disable.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionRaw = await getServerSession(authOptions as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const role = (sessionRaw as any)?.user?.role as string | undefined;

      if (!sessionRaw || !role) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      }

      if (role !== "admin") {
        return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
      }
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "NO_DATABASE_CONFIGURED" },
        { status: 500 },
      );
    }

    await dbConnect();

    // Purge existing sample data (only for dev/testing)
    await Project.deleteMany({
      name: /Residence Al Maadi|NEURAL_KITCHEN_ALPHA|OBSIDIAN_CORE_BETA|VOYAGER_NODE_GAMMA/i,
    });
    await Kitchen.deleteMany({
      clientName: /Residence Al Maadi|ALPHA_CORP|BETA_SYSTEMS|GAMMA_LABS/i,
    });

    // Create seed project + kitchen
    const project = await Project.create(SEED_PROJECT);
    await Kitchen.create({ ...SEED_KITCHEN, projectId: project._id });

    // Also create a few small example projects for demo purposes
    const examples = [
      {
        name: "NEURAL_KITCHEN_ALPHA",
        client: "ALPHA_CORP",
        status: "designing",
        progress: 85,
      },
      {
        name: "OBSIDIAN_CORE_BETA",
        client: "BETA_SYSTEMS",
        status: "measuring",
        progress: 40,
      },
      {
        name: "VOYAGER_NODE_GAMMA",
        client: "GAMMA_LABS",
        status: "installed",
        progress: 100,
      },
    ];

    for (const ex of examples) {
      const p = await Project.create(ex);
      await Kitchen.create({
        projectId: p._id,
        clientName: ex.client,
        phone: "555-AUTO-SEED",
        walls: [
          {
            id: `wall-${Date.now()}`,
            label: "Wall 1",
            length: 400,
            height: 240,
            thickness: 10,
          },
        ],
        standards: SEED_KITCHEN.standards,
      });
    }

    return NextResponse.json({ success: true, message: "Seed completed" });
  } catch (error) {
    console.error("[API][POST /api/seed] Seed failed:", error);
    return NextResponse.json({ error: "SEED_FAILED" }, { status: 500 });
  }
}

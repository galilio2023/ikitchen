import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const project = await prisma.$transaction(async (tx) => {
      // Clear existing data to avoid duplicates during seeding
      await tx.kitchen.deleteMany();
      await tx.project.deleteMany();

      // Create a sample project
      const p = await tx.project.create({
        data: {
          name: "Modern Family Kitchen",
          client: "Sarah Johnson",
          status: "Designing",
          progress: 35,
          tags: ["Modern", "Renovation"],
        }
      });

      // Create the associated kitchen
      await tx.kitchen.create({
        data: {
          projectId: p.id,
          clientName: "Sarah Johnson",
          phone: "555-0123",
          status: "designing",
          walls: [
            {
              id: "wall-1",
              label: "North Wall",
              length: 400,
              height: 240,
              thickness: 15,
            },
            {
              id: "wall-2",
              label: "East Wall",
              length: 300,
              height: 240,
              thickness: 15,
            },
          ],
          obstacles: [],
          appliances: [],
        }
      });
      return p;
    });

    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

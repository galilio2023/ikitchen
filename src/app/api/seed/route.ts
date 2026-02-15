import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import Kitchen from "@/models/Kitchen";
import mongoose from "mongoose";

export async function POST() {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await dbConnect();

    // Clear existing data to avoid duplicates during seeding
    await Project.deleteMany({}, { session });
    await Kitchen.deleteMany({}, { session });

    // Create a sample project
    const project = new Project({
      name: "Modern Family Kitchen",
      client: "Sarah Johnson",
      status: "Designing",
      progress: 35,
      tags: ["Modern", "Renovation"],
      // owner is optional now, so we can omit it for seeding without auth
    });
    await project.save({ session });

    // Create the associated kitchen
    const kitchen = new Kitchen({
      projectId: project._id,
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
    });
    await kitchen.save({ session });

    await session.commitTransaction();

    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Seed Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}

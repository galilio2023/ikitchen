"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Kitchen from "@/models/Kitchen";
import Project from "@/models/Project";
import mongoose from "mongoose";

// Define consistent return types for our actions
type FormState = {
  error: string | null;
  success: boolean;
  projectId: string | null;
};

export async function createProject(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await dbConnect();

    const name = formData.get("name") as string;
    if (!name) {
      throw new Error("Project name is required");
    }

    const project = new Project({
      name,
      client: name,
      status: "Draft",
      progress: 0,
    });
    await project.save({ session });

    const kitchen = new Kitchen({
      projectId: project._id,
      clientName: name,
      phone: (formData.get("phone") as string) || "",
      walls: [
        {
          id: `wall-${Date.now()}`,
          label: "Wall 1",
          length: 300,
          height: 240,
          thickness: 10,
        },
      ],
    });
    await kitchen.save({ session });

    await session.commitTransaction();

    revalidatePath("/dashboard");
    revalidatePath("/projects");

    return { success: true, projectId: project.id, error: null };
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Create Project Error:", error);
    return {
      success: false,
      projectId: null,
      error: "An error occurred while creating the project. Please try again.",
    };
  } finally {
    session.endSession();
  }
}

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function deleteProject(projectId: string): Promise<ActionState> {
  if (!projectId) {
    return { error: "Project ID is required." };
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await dbConnect();
    const project = await Project.findByIdAndDelete(projectId, { session });
    if (!project) {
      throw new Error("Project not found.");
    }
    await Kitchen.deleteOne({ projectId: projectId }, { session });
    await session.commitTransaction();
    revalidatePath("/dashboard");
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Delete Project Error:", error);
    return { error: "An error occurred while deleting the project." };
  } finally {
    session.endSession();
  }
}

export async function updateKitchen(
  projectId: string,
  kitchenId: string,
  kitchenData: any,
): Promise<ActionState> {
  try {
    await dbConnect();
    if (!kitchenId) {
      throw new Error("Kitchen ID is required.");
    }
    if (!projectId) {
      throw new Error("Project ID is required.");
    }
    await Kitchen.findByIdAndUpdate(kitchenId, kitchenData);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error: updateKitchen", error);
    return { error: "Failed to save kitchen." };
  }
}

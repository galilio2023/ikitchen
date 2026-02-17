import dbConnect from "@/lib/dbConnect";
import Project, { IProjectDocument } from "@/models/Project";
import Kitchen from "@/models/Kitchen";
import { isValidObjectId } from "mongoose";

export interface ProjectSummary {
  id: string;
  clientName: string;
  status: string;
  progress: number;
  updatedAt: Date;
}

export async function getProjects(): Promise<ProjectSummary[]> {
  await dbConnect();
  
  const projects = await Project.find({})
    .sort({ updatedAt: -1 })
    .lean<IProjectDocument[]>();

  return projects.map((p) => ({
    id: p._id.toString(),
    clientName: p.client,
    status: p.status || 'Draft',
    progress: p.progress || 0,
    updatedAt: p.updatedAt || new Date(),
  }));
}

export async function getProjectStats(projects: ProjectSummary[]) {
  return {
    total: projects.length,
    completed: projects.filter((p) => p.progress === 100).length,
    averageProgress:
      projects.length > 0
        ? Math.round(
            projects.reduce((acc, p) => acc + (p.progress || 0), 0) /
              projects.length,
          )
        : 0,
  };
}

export async function getProjectWithKitchen(projectId: string) {
  await dbConnect();

  if (!isValidObjectId(projectId)) {
    return null;
  }

  try {
    const project = await Project.findById(projectId).lean();
    const kitchen = await Kitchen.findOne({ projectId: projectId }).lean();

    if (!project || !kitchen) {
      return null;
    }

    // Robust serialization for Client Components
    return {
      project: JSON.parse(JSON.stringify(project)),
      kitchen: JSON.parse(JSON.stringify(kitchen)),
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

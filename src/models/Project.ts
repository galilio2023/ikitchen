import mongoose, { Document, Schema } from "mongoose";

/**
 * IProject Interface
 * Represents the high-level metadata for the Dashboard.
 * Spatial data (walls/obstacles) is now handled exclusively by the Kitchen model.
 */
export interface IProject {
  _id?: string;
  id?: string;
  name: string; // The project/registry name
  client: string; // The client name
  status: string; // 'Draft', 'Active', etc.
  progress: number;
  img?: string;
  url?: string;
  github?: string;
  stars?: number;
  tags?: string[];
  owner?: string; // Made optional to support initial development/seeding
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mongoose Document Interface
 * Omit _id from the interface because Mongoose Document provides it.
 */
export interface IProjectDocument extends Omit<IProject, "_id">, Document {}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "Draft",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    img: String,
    url: String,
    github: String,
    stars: {
      type: Number,
      default: 0,
    },
    tags: [String],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Changed to false to allow unauthenticated creation during dev
    },
  },
  {
    timestamps: true,
    // Ensure virtuals are included
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for 'id' to map MongoDB's _id to the frontend's expected id field
ProjectSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Virtual populate to get the associated Kitchen
ProjectSchema.virtual('kitchen', {
  ref: 'Kitchen',
  localField: '_id',
  foreignField: 'projectId',
  justOne: true // A project has one kitchen
});

// Database indexes for query optimization
ProjectSchema.index({ owner: 1, createdAt: -1 }); // Most common query: get user's projects sorted by date
ProjectSchema.index({ status: 1 }); // Filter by status
ProjectSchema.index({ name: "text", client: "text" }); // Full-text search on name and client

// Check if the model is already compiled to prevent OverwriteModelError, 
// but we need to ensure the schema is updated if it was already compiled with required: true.
// In development with HMR, Mongoose models can persist.
// The safest way in Next.js dev is to delete the model from mongoose.models if it exists
// to force a re-compile with the new schema definition.
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.model<IProjectDocument>("Project", ProjectSchema);

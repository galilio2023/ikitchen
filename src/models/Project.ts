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
  owner?: string;
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
      required: true,
    },
  },
  {
    timestamps: true,
    // Ensure virtual 'id' is included when converting to JSON/Object for the frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for 'id' to map MongoDB's _id to the frontend's expected id field
ProjectSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Database indexes for query optimization
ProjectSchema.index({ owner: 1, createdAt: -1 }); // Most common query: get user's projects sorted by date
ProjectSchema.index({ status: 1 }); // Filter by status
ProjectSchema.index({ name: "text", client: "text" }); // Full-text search on name and client

export default mongoose.models.Project ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);

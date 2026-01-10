import mongoose, { Document, Schema } from 'mongoose';

// 1. Raw Data Interface (Used for your UI and API)
export interface IProject {
    _id: string;
    id?:string
    name: string;
    client: string;
    status: string;
    progress: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// 2. Mongoose Document Interface (Used for DB operations)
// We extend the Raw Data and Mongoose's Document,
// Omit the _id from Document to avoid the TS2430 conflict
export interface IProjectDocument extends Omit<IProject, '_id'>, Document {}

const ProjectSchema = new Schema<IProjectDocument>({
    name: { type: String, required: true },
    client: { type: String, required: true },
    status: { type: String, default: "Draft" },
    progress: { type: Number, default: 0 }
}, {
    timestamps: true,
    // This helper ensures _id is treated as a string when sent to the frontend
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);
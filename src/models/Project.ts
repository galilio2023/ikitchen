import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  client: string;
  status: "Draft" | "Measuring" | "Designing" | "Rendered" | "Completed";
  progress: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Draft", "Measuring", "Designing", "Rendered", "Completed"],
      default: "Draft",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true },
);

export default (mongoose.models.Project as Model<IProject>) ||
  mongoose.model<IProject>("Project", ProjectSchema);

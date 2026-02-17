import mongoose, { Schema, Document } from 'mongoose';

export interface IMigration extends Document {
    name: string;
    executedAt: Date;
}

const MigrationSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    executedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Migration || mongoose.model<IMigration>('Migration', MigrationSchema);

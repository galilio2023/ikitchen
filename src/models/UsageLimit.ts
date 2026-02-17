import mongoose, { Schema, Document } from 'mongoose';

export interface IUsageLimit extends Document {
    identifier: string; // userId or IP address
    type: 'ai_generation' | 'image_generation';
    count: number;
    lastReset: Date;
}

const UsageLimitSchema: Schema = new Schema({
    identifier: { type: String, required: true, index: true },
    type: { type: String, required: true, enum: ['ai_generation', 'image_generation'] },
    count: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now }
});

// Compound index for efficient lookups
UsageLimitSchema.index({ identifier: 1, type: 1 }, { unique: true });

export default mongoose.models.UsageLimit || mongoose.model<IUsageLimit>('UsageLimit', UsageLimitSchema);

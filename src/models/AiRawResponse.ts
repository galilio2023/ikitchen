import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IAiRawResponse extends Document {
    kitchenId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    modelName: string;
    promptHash: string;
    rawText: string;
    tokenCostEstimate?: number;
    createdAt: Date;
    updatedAt: Date;
}

const AiRawResponseSchema = new Schema<IAiRawResponse>({
    kitchenId: { type: Schema.Types.ObjectId, ref: 'Kitchen', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    modelName: { type: String, required: true },
    promptHash: { type: String, required: true },
    rawText: { type: String, required: true },
    tokenCostEstimate: { type: Number }
}, { timestamps: true });

const AiRawResponse = models.AiRawResponse || model<IAiRawResponse>('AiRawResponse', AiRawResponseSchema);

export default AiRawResponse;

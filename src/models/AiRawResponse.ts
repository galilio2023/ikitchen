import mongoose from 'mongoose';

// Schema for storing raw AI responses
const aiRawResponseSchema = new mongoose.Schema({
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kitchen',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  model: {
    type: String,
    required: true
  },
  rawText: {
    type: String,
    required: true,
    maxlength: 10000 // Truncate very long responses
  },
  promptHash: {
    type: String,
    required: true,
    index: true
  },
  tokensEstimate: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Add indexes
aiRawResponseSchema.index({ createdAt: 1 });
aiRawResponseSchema.index({ kitchenId: 1 });
aiRawResponseSchema.index({ userId: 1 });

export default mongoose.models.AiRawResponse || 
  mongoose.model('AiRawResponse', aiRawResponseSchema);
import mongoose, { Schema, model, models } from 'mongoose';

const KitchenSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Kitchen name is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'onboarding'],
        default: 'onboarding'
    },
    capacity: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Kitchen = models.Kitchen || model('Kitchen', KitchenSchema);
export default Kitchen;
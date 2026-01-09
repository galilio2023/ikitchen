import mongoose, { Schema, model, models, Document } from 'mongoose';

// 1. DEFINING THE TYPES (The Interface)
// This tells TypeScript: "A Kitchen object MUST have these things."
export interface IKitchen extends Document {
    clientName: string;
    phone: string;
    address?: string; // The '?' means it is optional
    material: 'Natural Wood' | 'Acrylic' | 'HPL' | 'Aluminum' | 'PVC';
    color?: string;
    dimensions: {
        wallA?: number;
        wallB?: number;
        height?: number;
    };
    totalPrice: number;
    deposit: number;
    status: 'Inquiry' | 'Measured' | 'Designing' | 'In Production' | 'Installed';
}

// 2. THE SCHEMA (You already have this part!)
const KitchenSchema = new Schema<IKitchen>({
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    material: {
        type: String,
        enum: ['Natural Wood', 'Acrylic', 'HPL', 'Aluminum', 'PVC'],
        default: 'Acrylic'
    },
    color: { type: String },
    dimensions: {
        wallA: { type: Number },
        wallB: { type: Number },
        height: { type: Number }
    },
    totalPrice: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Inquiry', 'Measured', 'Designing', 'In Production', 'Installed'],
        default: 'Inquiry'
    }
}, {
    timestamps: true
});

// 3. EXPORT WITH TYPES
// We add <IKitchen> here so the model knows which types to use
const Kitchen = models.Kitchen || model<IKitchen>('Kitchen', KitchenSchema);
export default Kitchen;
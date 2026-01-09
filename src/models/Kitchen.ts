import mongoose, { Schema, model, models } from 'mongoose';

const KitchenSchema = new Schema({
    // Client & Contact
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },

    // Kitchen Specifications
    material: {
        type: String,
        enum: ['Natural Wood', 'Acrylic', 'HPL', 'Aluminum', 'PVC'],
        default: 'Acrylic'
    },
    color: { type: String },

    // Dimensions (cm)
    dimensions: {
        wallA: { type: Number },
        wallB: { type: Number },
        height: { type: Number }
    },

    // Financials
    totalPrice: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },

    // Status Tracking
    status: {
        type: String,
        enum: ['Inquiry', 'Measured', 'Designing', 'In Production', 'Installed'],
        default: 'Inquiry'
    }
}, {
    timestamps: true
});

// Export the model
const Kitchen = models.Kitchen || model('Kitchen', KitchenSchema);
export default Kitchen;
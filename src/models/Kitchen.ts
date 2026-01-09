import mongoose, { Schema, model, models } from 'mongoose';

const KitchenSchema = new Schema({
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },

    // Flexible Walls Array
    walls: [{
        label: { type: String },
        length: { type: Number },
    }],

    // Obstacles (Windows, Doors, etc.)
    obstacles: [{
        type: {
            type: String,
            enum: ['Window', 'Door', 'Column', 'Dressing Entry', 'Gas Pipe', 'Pillar'],
            required: true
        },
        wallLabel: { type: String },
        width: { type: Number },
        heightFromFloor: { type: Number },
        distanceFromCorner: { type: Number },
    }],

    // Appliances
    appliances: [{
        name: { type: String },
        width: { type: Number },
        isBuiltIn: { type: Boolean, default: true }
    }],

    material: {
        type: String,
        enum: ['Natural Wood', 'Acrylic', 'HPL', 'Aluminum', 'PVC'],
        default: 'Acrylic'
    },
    color: { type: String },
    status: {
        type: String,
        enum: ['Inquiry', 'Measured', 'Designing', 'In Production', 'Installed'],
        default: 'Inquiry'
    },
    totalPrice: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Kitchen = models.Kitchen || model('Kitchen', KitchenSchema);
export default Kitchen;
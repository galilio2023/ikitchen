import mongoose, { Schema, model, models } from 'mongoose';

const KitchenSchema = new Schema({
    // 1. Client & Project Identity
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },

    // 2. Flexible Room Layout (Add 1 wall or 10 walls)
    walls: [{
        label: { type: String }, // e.g., "Main Wall", "Window Wall"
        length: { type: Number }, // cm
    }],

    // 3. Architectural Obstacles (Windows, Doors, Dressing Entries, Columns)
    obstacles: [{
        type: {
            type: String,
            enum: ['Window', 'Door', 'Column', 'Dressing Entry', 'Gas Pipe', 'Pillar'],
            required: true
        },
        wallLabel: { type: String }, // Which wall is it on?
        width: { type: Number },
        heightFromFloor: { type: Number }, // Critical for windows vs. cabinets
        distanceFromCorner: { type: Number }, // Where does it start on the wall?
    }],

    // 4. Appliances (Refrigerator, Oven, etc.)
    appliances: [{
        name: { type: String }, // "Refrigerator", "Dishwasher"
        width: { type: Number },
        isBuiltIn: { type: Boolean, default: true }
    }],

    // 5. Build Specifications
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

    // 6. Financials
    totalPrice: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Kitchen = models.Kitchen || model('Kitchen', KitchenSchema);
export default Kitchen;
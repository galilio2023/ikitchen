import mongoose, { Schema, model, models } from 'mongoose';

// 3D Coordinate System: The "Address" of every object
const CoordinateSchema = new Schema({
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    x: { type: Number, required: true },      // Horizontal (from left corner)
    y: { type: Number, required: true },      // Vertical (from floor)
    z: { type: Number, default: 0 },         // Depth (offset from wall face)
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true }   // Thickness/Volume
});

const KitchenSchema = new Schema({
    // Client & Project Identity
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    status: {
        type: String,
        enum: ['draft', 'measuring', 'designing', 'ordered', 'installed'],
        default: 'draft'
    },

    // The Physical Room (The Canvas)
    walls: [{
        label: { type: String, default: 'Wall' }, // e.g., "Wall A"
        length: { type: Number, required: true }, // in cm
        height: { type: Number, default: 240 },
        thickness: { type: Number, default: 10 }
    }],

    // Fixed Architectural Elements (Things the AI cannot move)
    obstacles: [{
        type: {
            type: String,
            enum: ['window', 'door', 'socket', 'pipe', 'pillar', 'radiator', 'clearance']
        },
        wallIndex: { type: Number, required: true }, // Link to walls array index
        position: CoordinateSchema
    }],

    // Kitchen Components (Things the AI/User places)
    appliances: [{
        name: { type: String, required: true }, // e.g., "Fridge", "Sink"
        wallIndex: { type: Number, required: true },
        position: CoordinateSchema,
        isFixed: { type: Boolean, default: false } // If true, AI won't suggest moving it
    }],

    // Global Project Standards (The "Kitchen Man's" Rules)
    standards: {
        baseCabinetDepth: { type: Number, default: 60 },
        wallCabinetDepth: { type: Number, default: 35 },
        countertopThickness: { type: Number, default: 4 },
        kickplateHeight: { type: Number, default: 10 } // Space for feet at bottom
    },

    // Financials (Protected from mass-assignment in API)
    totalPrice: { type: Number, default: 0 },
    material: { type: String },
    color: { type: String }

}, { timestamps: true });

// Export the model
const Kitchen = models.Kitchen || model('Kitchen', KitchenSchema);
export default Kitchen;
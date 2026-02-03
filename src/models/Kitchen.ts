import mongoose, { Schema, model, models } from 'mongoose';

/**
 * Reusable Coordinate Schema matching your ICoordinate interface
 */
const CoordinateSchema = new Schema({
    x: { type: Number, required: true, min: 0 },
    y: { type: Number, required: true, min: 0 },
    z: { type: Number, default: 0 },
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    depth: { type: Number, required: true, min: 0 }
}, { _id: false });

const KitchenSchema = new Schema({
    // userId is optional to allow seeding without authentication
    // but should always be populated in normal application usage
    userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false  // Made optional to support seeding
    },
    projectId: { 
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    clientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    address: { type: String },
    status: {
        type: String,
        enum: ['draft', 'measuring', 'designing', 'ordered', 'installed'],
        default: 'draft'
    },
    img: String,
    url: String,
    github: String,
    stars: { type: Number, default: 0 },
    tags: [String],

    walls: [{
        id: { type: String, required: true },
        label: { type: String, default: 'Wall' },
        length: { type: Number, required: true },
        height: { type: Number, default: 240 },
        thickness: { type: Number, default: 10 }
    }],

    obstacles: [{
        id: { type: String, required: true }, // Matches your IObstacle interface
        _id: { type: String },
        type: {
            type: String,
            enum: ['window', 'door', 'socket', 'vent', 'pipe', 'pillar', 'radiator', 'clearance'],
            required: true
        },
        wallIndex: { type: Number, required: true },
        position: CoordinateSchema // Nested structure: obstacle.position.x
    }],

    appliances: [{
        name: { type: String, required: true },
        wallIndex: { type: Number, required: true },
        position: CoordinateSchema,
        isFixed: { type: Boolean, default: false }
    }],

    standards: {
        baseCabinetDepth: { type: Number, default: 60 },
        wallCabinetDepth: { type: Number, default: 35 },
        countertopThickness: { type: Number, default: 4 },
        kickplateHeight: { type: Number, default: 10 }
    },

    totalPrice: { type: Number, default: 0 },
    material: { type: String },
    color: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },

    // --- AI DESIGN ADDITIONS ---
    generatedDesign: {
        layoutType: String,
        aiReasoning: String,
        units: [{
            id: String,
            wallIndex: Number,
            type: String,
            position: CoordinateSchema
        }]
    }

}, { timestamps: true });

// Database indexes for query optimization
KitchenSchema.index({ userId: 1, projectId: 1 }); // Combined index for user's projects
KitchenSchema.index({ userId: 1, status: 1 }); // User's kitchens by status
KitchenSchema.index({ projectId: 1 }); // Individual project lookup
KitchenSchema.index({ progress: 1 });
KitchenSchema.index({ createdAt: -1 });
KitchenSchema.index({ clientName: 'text' });

const Kitchen = models.Kitchen || model('Kitchen', KitchenSchema);
export default Kitchen;
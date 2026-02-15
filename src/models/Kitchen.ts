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

// Schema for items in generatedDesignHistory
const designHistoryItemSchema = new Schema({
  id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  model: { type: String },
  promptHash: { type: String },
  design: { type: Schema.Types.Mixed }, // Store the full design object
  imageUrls: [{ type: String }], // Store any generated image URLs
  rawResponseRef: { type: Schema.Types.ObjectId, ref: 'AiRawResponse' },
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
        ref: 'Project',
        required: true // Enforce relationship: A kitchen must belong to a project
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
        type: {
            type: String,
            enum: ['window', 'door', 'socket', 'vent', 'pipe', 'pillar', 'radiator', 'clearance'],
            required: true
        },
        wallIndex: { type: Number, required: true },
        position: CoordinateSchema // Nested structure: obstacle.position.x
    }],

    appliances: [{
        id: { type: String, required: true },
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
      type: Schema.Types.Mixed, 
      default: null // Initially null until AI generates a design
    },
    // History of all generated designs for this kitchen
    // This enables design iteration and rollback capabilities
    generatedDesignHistory: [designHistoryItemSchema]
}, { 
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret: any) {
            if (ret._id) {
                ret.id = ret._id.toString();
            }
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function(doc, ret: any) {
            if (ret._id) {
                ret.id = ret._id.toString();
            }
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Database indexes for query optimization
KitchenSchema.index({ userId: 1, projectId: 1 }); // Combined index for user's projects
KitchenSchema.index({ userId: 1, status: 1 }); // User's kitchens by status
KitchenSchema.index({ projectId: 1 }); // Individual project lookup
KitchenSchema.index({ progress: 1 });
KitchenSchema.index({ createdAt: -1 });
KitchenSchema.index({ clientName: 'text' });

// Check if the model is already compiled to prevent OverwriteModelError
if (mongoose.models.Kitchen) {
  delete mongoose.models.Kitchen;
}

const Kitchen = mongoose.model('Kitchen', KitchenSchema);
export default Kitchen;